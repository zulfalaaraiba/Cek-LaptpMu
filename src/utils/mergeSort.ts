/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Laptop } from "../types";

/**
 * Menggabungkan dua sub-array yang sudah terurut secara stabil.
 * Penggabungan dilakukan berdasarkan field Price_euros secara ascending.
 */
function merge(left: Laptop[], right: Laptop[]): Laptop[] {
  const result: Laptop[] = [];
  let leftIndex = 0;
  let rightIndex = 0;

  // Bandingkan elemen dari kedua sub-array dan gabungkan
  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex].Price_euros <= right[rightIndex].Price_euros) {
      result.push(left[leftIndex]);
      leftIndex++;
    } else {
      result.push(right[rightIndex]);
      rightIndex++;
    }
  }

  // Tambahkan sisa elemen jika ada (left atau right)
  while (leftIndex < left.length) {
    result.push(left[leftIndex]);
    leftIndex++;
  }

  while (rightIndex < right.length) {
    result.push(right[rightIndex]);
    rightIndex++;
  }

  return result;
}
/**
 * Fungsi rekursif Merge Sort untuk mengurutkan array of Laptop.
 * Memiliki kompleksitas waktu O(n log n) dan kompleksitas ruang O(n).
 */
export function mergeSort(array: Laptop[]): Laptop[] {
  // Base case: jika array hanya memiliki 0 atau 1 elemen, maka sudah terurut
  if (array.length <= 1) {
    return [...array];
  }
  // Cari titik tengah array
  const middle = Math.floor(array.length / 2);
  // Bagian kiri dan kanan
  const left = array.slice(0, middle);
  const right = array.slice(middle);
  // Urutkan kedua bagian secara rekursif lalu gabungkan
  return merge(mergeSort(left), mergeSort(right));
}
