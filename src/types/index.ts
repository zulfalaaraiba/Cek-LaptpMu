/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Laptop {
  id: string; // ID unik untuk key React & animasi visual
  Company: string;
  Product: string;
  Price_euros: number;
  TypeName?: string;
  Inches?: string;
  ScreenResolution?: string;
  Cpu?: string;
  Ram?: string;
  Memory?: string;
  Gpu?: string;
  OpSys?: string;
  Weight?: string;
  
  // Calculated properties
  QualityScore: number;
  Rating: number;
}

export interface SkenarioHasil {
  ukuran: number;
  ukuranLabel: string;
  waktu: number; // in ms
  memori: number; // in MB
}

export interface SalesData {
  Brand: string;
  TahunSebelumnya: number; // nilai penjualan USD / unit
  TahunBerjalan: number;
}

export interface MergeSortStats {
  dataSize: number;
  runtime: number; // ms
  memory: number; // MB
  recursiveCalls: number;
  merges: number;
  comparisons: number;
  timeComplexity: string;
  spaceComplexity: string;
}

export type SortCriteria = 
  | "Harga Termurah" 
  | "Harga Termahal" 
  | "Rating Terbaik" 
  | "Quality Score Terbaik" 
  | "Harga + Quality Score";

export interface VisualizationStep {
  type: "split" | "compare" | "merge" | "done";
  message: string;
  leftIndices: string[]; // Laptop IDs on the left
  rightIndices: string[]; // Laptop IDs on the right
  activeIndices: string[]; // Laptop IDs currently being compared
  mergedIndices: string[]; // Laptop IDs successfully merged in this step
  tempState: Laptop[]; // current temporary array state for rendering
}
