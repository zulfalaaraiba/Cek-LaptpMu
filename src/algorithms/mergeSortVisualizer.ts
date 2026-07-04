/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Laptop, SortCriteria, VisualizationStep } from "../types";

/**
 * Comparator fungsi kustom berdasarkan kriteria pengurutan terpilih.
 * Mengembalikan true jika 'a' harus mendahului 'b'.
 */
export function compareLaptops(a: Laptop, b: Laptop, criteria: SortCriteria): boolean {
  switch (criteria) {
    case "Harga Termurah":
      return a.Price_euros <= b.Price_euros;
      
    case "Harga Termahal":
      return a.Price_euros >= b.Price_euros;
      
    case "Rating Terbaik":
      if (a.Rating !== b.Rating) {
        return a.Rating >= b.Rating; // Descending
      }
      return a.Price_euros <= b.Price_euros; // Jika rating sama, urutkan termurah
      
    case "Quality Score Terbaik":
      if (a.QualityScore !== b.QualityScore) {
        return a.QualityScore >= b.QualityScore; // Descending
      }
      return a.Price_euros <= b.Price_euros; // Jika QS sama, urutkan termurah
      
    case "Harga + Quality Score":
      // Bobot: Quality score tertinggi didahulukan, jika nilai sama maka harga termurah
      if (a.QualityScore !== b.QualityScore) {
        return a.QualityScore >= b.QualityScore;
      }
      return a.Price_euros <= b.Price_euros;

    default:
      return a.Price_euros <= b.Price_euros;
  }
}

/**
 * Class pembantu untuk menjalankan Merge Sort sekaligus merekam statistik eksekusi
 * dan langkah visualisasi detail (split, compare, merge).
 */
export class MergeSortVisualizer {
  private steps: VisualizationStep[] = [];
  private recursiveCalls = 0;
  private merges = 0;
  private comparisons = 0;
  private criteria: SortCriteria;

  constructor(criteria: SortCriteria) {
    this.criteria = criteria;
  }

  /**
   * Menjalankan pengurutan penuh dan mengembalikan hasil akhir beserta rekam langkah visualisasi.
   */
  public sort(array: Laptop[]): {
    sortedArray: Laptop[];
    steps: VisualizationStep[];
    recursiveCalls: number;
    merges: number;
    comparisons: number;
  } {
    this.steps = [];
    this.recursiveCalls = 0;
    this.merges = 0;
    this.comparisons = 0;

    // Duplikasi state awal
    const workingArray = [...array];
    
    // Simpan step awal (Data Awal / Random)
    this.steps.push({
      type: "split",
      message: "Data awal dimuat dalam keadaan acak (tidak terurut). Persiapan pemisahan rekursif.",
      leftIndices: [],
      rightIndices: [],
      activeIndices: [],
      mergedIndices: [],
      tempState: [...workingArray],
    });

    const sorted = this.mergeSortRecursive(workingArray, 0, workingArray.length - 1);

    // Langkah final selesai
    this.steps.push({
      type: "done",
      message: `Proses pengurutan Merge Sort selesai secara stabil berdasarkan kriteria '${this.criteria}'!`,
      leftIndices: [],
      rightIndices: [],
      activeIndices: [],
      mergedIndices: sorted.map(l => l.id),
      tempState: [...sorted],
    });

    return {
      sortedArray: sorted,
      steps: this.steps,
      recursiveCalls: this.recursiveCalls,
      merges: this.merges,
      comparisons: this.comparisons,
    };
  }

  private mergeSortRecursive(arr: Laptop[], leftStart: number, rightEnd: number): Laptop[] {
    this.recursiveCalls++;
    const subset = arr.slice(leftStart, rightEnd + 1);

    // Base case
    if (leftStart >= rightEnd) {
      return subset;
    }

    const mid = Math.floor((leftStart + rightEnd) / 2);
    
    // Catat langkah Split
    const leftIDs = arr.slice(leftStart, mid + 1).map(l => l.id);
    const rightIDs = arr.slice(mid + 1, rightEnd + 1).map(l => l.id);
    
    // Simpan langkah split visual jika ukuran data tidak terlalu raksasa (untuk kenyamanan browser render)
    if (arr.length <= 150) {
      this.steps.push({
        type: "split",
        message: `Membagi array (N = ${subset.length}) pada posisi indeks ${mid}. Kiri: ${leftIDs.length} laptop, Kanan: ${rightIDs.length} laptop.`,
        leftIndices: leftIDs,
        rightIndices: rightIDs,
        activeIndices: [],
        mergedIndices: [],
        tempState: [...arr],
      });
    }

    // Urutkan rekursif bagian kiri dan kanan
    const sortedLeft = this.mergeSortRecursive(arr, leftStart, mid);
    const sortedRight = this.mergeSortRecursive(arr, mid + 1, rightEnd);

    // Gabungkan (Merge)
    return this.merge(arr, leftStart, mid, rightEnd, sortedLeft, sortedRight);
  }

  private merge(
    originalArr: Laptop[], 
    leftStart: number, 
    mid: number, 
    rightEnd: number, 
    leftArr: Laptop[], 
    rightArr: Laptop[]
  ): Laptop[] {
    this.merges++;
    const merged: Laptop[] = [];
    let l = 0;
    let r = 0;

    // Catat langkah awal sebelum penggabungan
    const activeLeftIDs = leftArr.map(x => x.id);
    const activeRightIDs = rightArr.map(x => x.id);

    while (l < leftArr.length && r < rightArr.length) {
      this.comparisons++;
      const itemL = leftArr[l];
      const itemR = rightArr[r];

      // Catat perbandingan visual
      if (originalArr.length <= 150) {
        this.steps.push({
          type: "compare",
          message: `Membandingkan laptop [${itemL.Company} - ${itemL.Product}] (Skor/Harga) vs [${itemR.Company} - ${itemR.Product}] sesuai kriteria ${this.criteria}.`,
          leftIndices: activeLeftIDs,
          rightIndices: activeRightIDs,
          activeIndices: [itemL.id, itemR.id],
          mergedIndices: merged.map(x => x.id),
          tempState: [...originalArr],
        });
      }

      if (compareLaptops(itemL, itemR, this.criteria)) {
        merged.push(itemL);
        l++;
      } else {
        merged.push(itemR);
        r++;
      }
    }

    // Gabungkan sisa bagian kiri
    while (l < leftArr.length) {
      merged.push(leftArr[l]);
      l++;
    }

    // Gabungkan sisa bagian kanan
    while (r < rightArr.length) {
      merged.push(rightArr[r]);
      r++;
    }

    // Update original array di rentang penggabungan ini agar render bertahap terlihat
    for (let i = 0; i < merged.length; i++) {
      originalArr[leftStart + i] = merged[i];
    }

    // Catat hasil merge selesai untuk fragmen ini
    if (originalArr.length <= 150) {
      this.steps.push({
        type: "merge",
        message: `Berhasil menggabungkan dan merapikan ${merged.length} laptop secara urut.`,
        leftIndices: [],
        rightIndices: [],
        activeIndices: [],
        mergedIndices: merged.map(x => x.id),
        tempState: [...originalArr],
      });
    }

    return merged;
  }
}
