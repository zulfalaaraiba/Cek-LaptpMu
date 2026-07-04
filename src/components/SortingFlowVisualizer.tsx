/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Laptop } from "../types";
import { ArrowRight, Activity, CornerDownRight, CheckCircle, ListOrdered } from "lucide-react";

interface SortingFlowVisualizerProps {
  beforeLaptops: Laptop[];
  afterLaptops: Laptop[];
  isSorting: boolean;
  hasSorted: boolean;
  activeFlowchartStep: number | null;
}

export default function SortingFlowVisualizer({
  beforeLaptops,
  afterLaptops,
  isSorting,
  hasSorted,
  activeFlowchartStep,
}: SortingFlowVisualizerProps) {
  // Hitung fase aktif
  let activePhase: "none" | "split" | "divide" | "merge" | "sorted" = "none";
  if (isSorting) {
    if (activeFlowchartStep === 1 || activeFlowchartStep === 2 || activeFlowchartStep === 3) {
      activePhase = "split";
    } else if (activeFlowchartStep === 4) {
      activePhase = "divide";
    } else if (activeFlowchartStep === 5 || activeFlowchartStep === 6 || activeFlowchartStep === 7) {
      activePhase = "merge";
    }
  } else if (hasSorted) {
    activePhase = "sorted";
  }

  // Ambil maksimal 8 data teratas untuk perbandingan yang rapi di dashboard
  const limit = 8;
  const beforeSlice = beforeLaptops.slice(0, limit);
  const afterSlice = afterLaptops.slice(0, limit);

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6" id="sorting-flow-visualizer-section">
      <div className="space-y-1">
        <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-900" />
          Visualisasi Aliran Data (Before vs After Sorting)
        </h2>
        <p className="text-xs text-slate-400">
          Perhatikan perubahan susunan data laptop berdasarkan harga terendah ke tertinggi sebelum dan sesudah Merge Sort dijalankan.
        </p>
      </div>

      {/* INDIKATOR ALIRAN FASE ANIMASI */}
      <div className="grid grid-cols-4 gap-2 md:gap-4 border border-slate-100 bg-slate-50/50 p-3 md:p-4 rounded-2xl text-center">
        {/* Phase 1: Split Array */}
        <div className="space-y-2 relative">
          <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            activePhase === "split" 
              ? "bg-indigo-600 text-white ring-4 ring-indigo-100 scale-110" 
              : activePhase === "divide" || activePhase === "merge" || activePhase === "sorted"
                ? "bg-indigo-100 text-indigo-700" 
                : "bg-slate-100 text-slate-400"
          }`}>
            1
          </div>
          <span className={`text-[10px] font-bold block transition-colors ${
            activePhase === "split" ? "text-indigo-700 font-extrabold" : "text-slate-500"
          }`}>
            Split Array
          </span>
          <span className="absolute top-4 -right-2 text-slate-300 hidden md:block">➔</span>
        </div>

        {/* Phase 2: Recursive Divide */}
        <div className="space-y-2 relative">
          <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            activePhase === "divide" 
              ? "bg-blue-600 text-white ring-4 ring-blue-100 scale-110" 
              : activePhase === "merge" || activePhase === "sorted"
                ? "bg-blue-100 text-blue-700" 
                : "bg-slate-100 text-slate-400"
          }`}>
            2
          </div>
          <span className={`text-[10px] font-bold block transition-colors ${
            activePhase === "divide" ? "text-blue-700 font-extrabold" : "text-slate-500"
          }`}>
            Recursive Divide
          </span>
          <span className="absolute top-4 -right-2 text-slate-300 hidden md:block">➔</span>
        </div>

        {/* Phase 3: Merge */}
        <div className="space-y-2 relative">
          <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            activePhase === "merge" 
              ? "bg-amber-600 text-white ring-4 ring-amber-100 scale-110" 
              : activePhase === "sorted"
                ? "bg-amber-100 text-amber-700" 
                : "bg-slate-100 text-slate-400"
          }`}>
            3
          </div>
          <span className={`text-[10px] font-bold block transition-colors ${
            activePhase === "merge" ? "text-amber-700 font-extrabold" : "text-slate-500"
          }`}>
            Merge Sort
          </span>
          <span className="absolute top-4 -right-2 text-slate-300 hidden md:block">➔</span>
        </div>

        {/* Phase 4: Sorted */}
        <div className="space-y-2">
          <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
            activePhase === "sorted" 
              ? "bg-emerald-600 text-white ring-4 ring-emerald-100 scale-110" 
              : "bg-slate-100 text-slate-400"
          }`}>
            ✓
          </div>
          <span className={`text-[10px] font-bold block transition-colors ${
            activePhase === "sorted" ? "text-emerald-700 font-extrabold" : "text-slate-500"
          }`}>
            Sorted Ascending
          </span>
        </div>
      </div>

      {/* DUAL TABLE: BEFORE VS AFTER SORTING */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TABEL BEFORE SORTING */}
        <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <span className="text-xs font-bold text-slate-700 font-display block">
              Data Sebelum Sorting
            </span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 font-mono text-[9px] font-bold rounded">
              Before Sorting
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-100 bg-white">
            <table className="w-full text-left border-collapse text-[11px] font-mono">
              <thead>
                <tr className="bg-slate-100/80 text-slate-500 font-bold uppercase border-b border-slate-100">
                  <th className="py-2 px-3 text-center w-8">No</th>
                  <th className="py-2 px-2">Brand/Product</th>
                  <th className="py-2 px-2 text-right">Price</th>
                  <th className="py-2 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-600">
                {beforeSlice.map((laptop, idx) => (
                  <tr key={laptop.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-2 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-2 px-2">
                      <span className="font-bold text-slate-900 mr-1">{laptop.Company}</span>
                      <span className="text-slate-500 truncate inline-block max-w-[120px] align-bottom">
                        {laptop.Product}
                      </span>
                    </td>
                    <td className="py-2 px-2 text-right font-bold text-slate-700">
                      €{laptop.Price_euros.toLocaleString("id-ID")}
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[8px] font-bold uppercase">
                        Unsorted
                      </span>
                    </td>
                  </tr>
                ))}
                {beforeLaptops.length > limit && (
                  <tr>
                    <td colSpan={4} className="py-1.5 text-center text-[10px] text-slate-400 italic bg-slate-50">
                      + Dan {beforeLaptops.length - limit} laptop lainnya acak di bawah
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TABEL AFTER SORTING */}
        <div className={`border border-slate-100 rounded-2xl p-4 space-y-3 transition-all duration-300 ${
          hasSorted 
            ? "bg-emerald-50/20 border-emerald-100" 
            : "bg-slate-50/30 border-dashed"
        }`}>
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-2">
            <span className="text-xs font-bold text-slate-700 font-display block">
              Data Setelah Sorting
            </span>
            <span className={`px-2 py-0.5 font-mono text-[9px] font-bold rounded border ${
              hasSorted 
                ? "bg-emerald-100 text-emerald-800 border-emerald-200" 
                : "bg-slate-100 text-slate-400 border-slate-200"
            }`}>
              After Sorting
            </span>
          </div>

          {hasSorted && afterLaptops.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-emerald-100/50 bg-white shadow-xs">
              <table className="w-full text-left border-collapse text-[11px] font-mono">
                <thead>
                  <tr className="bg-emerald-50/40 text-emerald-800 font-bold uppercase border-b border-emerald-100">
                    <th className="py-2 px-3 text-center w-8">No</th>
                    <th className="py-2 px-2">Brand/Product</th>
                    <th className="py-2 px-2 text-right">Price</th>
                    <th className="py-2 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-600">
                  {afterSlice.map((laptop, idx) => (
                    <tr key={laptop.id} className="hover:bg-emerald-50/10 transition-colors">
                      <td className="py-2 px-3 text-center font-bold text-emerald-600">{idx + 1}</td>
                      <td className="py-2 px-2">
                        <span className="font-bold text-slate-900 mr-1">{laptop.Company}</span>
                        <span className="text-slate-500 truncate inline-block max-w-[120px] align-bottom">
                          {laptop.Product}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-right font-extrabold text-blue-900">
                        €{laptop.Price_euros.toLocaleString("id-ID")}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[8px] font-bold uppercase">
                          Sorted
                        </span>
                      </td>
                    </tr>
                  ))}
                  {afterLaptops.length > limit && (
                    <tr>
                      <td colSpan={4} className="py-1.5 text-center text-[10px] text-emerald-600 italic bg-emerald-50/20">
                        + Dan {afterLaptops.length - limit} laptop lainnya berurutan rapi di bawah
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-center bg-white border border-dashed border-slate-200 rounded-xl p-4 text-slate-400">
              <ListOrdered className="w-8 h-8 text-slate-300 animate-pulse mb-2" />
              <p className="text-xs font-semibold">Menunggu Pengurutan Selesai...</p>
              <p className="text-[10px] leading-relaxed max-w-[200px] text-slate-400 mt-1">
                Tekan tombol <b>"Jalankan Merge Sort"</b> di atas untuk merapikan urutan secara rekursif.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
