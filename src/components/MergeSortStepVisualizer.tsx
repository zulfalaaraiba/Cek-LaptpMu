/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { VisualizationStep, Laptop } from "../types";
import { Play, Pause, SkipForward, RotateCcw, Info, CheckCircle2, Server, HelpCircle } from "lucide-react";

interface MergeSortStepVisualizerProps {
  steps: VisualizationStep[];
  onFinishVisualizing: () => void;
  isLargeData: boolean;
  totalDataSize: number;
}

export default function MergeSortStepVisualizer({
  steps,
  onFinishVisualizing,
  isLargeData,
  totalDataSize,
}: MergeSortStepVisualizerProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(250); // ms per step
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Jika data terlalu besar untuk di-render step-by-step
    if (isLargeData) {
      setIsPlaying(false);
      // Langsung lompat ke langkah terakhir setelah delay tipis simulasi progres
      const t = setTimeout(() => {
        setCurrentStepIdx(steps.length - 1);
        onFinishVisualizing();
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [isLargeData, steps, onFinishVisualizing]);

  // Efek interval untuk auto-play langkah visualisasi
  useEffect(() => {
    if (isLargeData) return;

    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            onFinishVisualizing();
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, steps, playbackSpeed, isLargeData, onFinishVisualizing]);

  if (steps.length === 0) {
    return null;
  }

  const currentStep = steps[currentStepIdx] || steps[steps.length - 1];
  const progressPercent = Math.round((currentStepIdx / (steps.length - 1 || 1)) * 100);

  // Helper untuk menentukan warna laptop card berdasarkan status visualisasi saat ini
  const getCardStatusColor = (laptopId: string) => {
    if (currentStep.activeIndices.includes(laptopId)) {
      return "border-blue-500 bg-blue-50/95 ring-2 ring-blue-400/50 shadow-blue-100"; // Biru = sedang dibandingkan
    }
    if (currentStep.mergedIndices.includes(laptopId)) {
      return "border-emerald-500 bg-emerald-50/90 shadow-emerald-50"; // Hijau = selesai merge di sub-array ini
    }
    if (currentStep.leftIndices.includes(laptopId) || currentStep.rightIndices.includes(laptopId)) {
      return "border-amber-400 bg-amber-50/90 shadow-amber-50"; // Kuning = proses split / merge sub-array aktif
    }
    return "border-slate-100 bg-white opacity-60"; // Standby
  };

  const getStepBadgeColor = (type: string) => {
    switch (type) {
      case "split":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "compare":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "merge":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "done":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const resetVisualizer = () => {
    setCurrentStepIdx(0);
    setIsPlaying(true);
  };

  const stepForward = () => {
    if (currentStepIdx < steps.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    }
  };

  const stepBackward = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  // Batasi laptop yang dirender di panel visualisasi untuk keindahan agar tidak meluap (maks 24)
  const renderLimit = 16;
  const displayLaptops = currentStep.tempState.slice(0, renderLimit);

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-md space-y-6" id="mergesort-visualizer-card">
      {/* Header Visualizer */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <span className="px-2 py-0.5 bg-blue-50 text-blue-800 font-mono text-[10px] font-bold rounded-md uppercase tracking-wider">
            Skenario Animasi Edukasi
          </span>
          <h2 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
            <Server className="w-5 h-5 text-blue-800" />
            Visualisasi Pembelahan & Penggabungan (Merge Sort)
          </h2>
          <p className="text-xs text-slate-400">
            Perhatikan bagaimana dataset laptop dipecah (Divide) lalu digabungkan kembali (Conquer) secara terurut.
          </p>
        </div>

        {/* Kontrol Navigasi (Hanya muncul jika ukuran data kecil & interaktif) */}
        {!isLargeData && (
          <div className="flex flex-wrap items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/50 self-start md:self-center">
            <button
              onClick={resetVisualizer}
              title="Reset ke Langkah Awal"
              className="p-2 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={stepBackward}
              disabled={currentStepIdx === 0}
              title="Kembali ke Langkah Sebelumnya"
              className="p-2 hover:bg-slate-200 text-slate-600 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
            >
              <span className="text-xs font-bold font-mono">PREV</span>
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-1.5 bg-blue-800 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>PAUSE</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>PLAY</span>
                </>
              )}
            </button>

            <button
              onClick={stepForward}
              disabled={currentStepIdx === steps.length - 1}
              title="Lompat ke Langkah Berikutnya"
              className="p-2 hover:bg-slate-200 text-slate-600 disabled:opacity-30 rounded-lg transition-colors cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Selector Kecepatan */}
            <div className="border-l border-slate-200 pl-2 ml-2 flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-mono">SPEED:</span>
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-white border border-slate-200 rounded text-[10px] font-bold p-1 text-slate-700 outline-none"
              >
                <option value={500}>Lambat (0.5s)</option>
                <option value={250}>Sedang (0.25s)</option>
                <option value={100}>Cepat (0.1s)</option>
                <option value={40}>Turbo (0.04s)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Jika Data Sangat Banyak (>40), kita tunjukkan Progress bar kilat tanpa overload memori browser */}
      {isLargeData ? (
        <div className="py-12 flex flex-col items-center justify-center max-w-xl mx-auto text-center space-y-4" id="large-data-simulation">
          <div className="p-4 bg-emerald-50 text-emerald-800 rounded-full animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-base font-display">
              Analisis Skala Besar Berhasil Diproses!
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Mengingat ukuran data Anda cukup besar (<span className="font-bold font-mono text-blue-700 bg-blue-50 px-1 py-0.5 rounded">{totalDataSize} Laptop</span>), visualisasi kartu langkah demi langkah dilewati demi stabilitas memori browser. Proses komparasi Merge Sort diselesaikan secara instan dalam hitungan mikrodetik!
            </p>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-full rounded-full transition-all duration-1000"></div>
          </div>
          <span className="text-[10px] text-emerald-700 font-mono font-bold animate-pulse">
            SORTING COMPLETE • GRAPHICS UPDATED BELOW
          </span>
        </div>
      ) : (
        /* INTERACTIVE STEP-BY-STEP LAYOUT */
        <div className="space-y-6">
          {/* Status Proses Panel */}
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-1 text-xs font-bold font-mono rounded-lg border ${getStepBadgeColor(currentStep.type)} uppercase`}>
                {currentStep.type}
              </span>
              <p className="text-xs md:text-sm font-semibold text-slate-700 leading-relaxed">
                {currentStep.message}
              </p>
            </div>

            <div className="text-right shrink-0 font-mono text-xs">
              <span className="text-slate-400 block text-[9px] font-bold">LANGKAH KE</span>
              <span className="text-slate-800 font-bold">
                {currentStepIdx + 1} / {steps.length} ({progressPercent}%)
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-blue-800 h-full rounded-full transition-all duration-150" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* Legenda Warna */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono justify-center border-b border-slate-50 pb-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-blue-50 border border-blue-500 inline-block ring-2 ring-blue-400/50"></span>
              <span className="text-slate-500 text-[11px]">Sedang Dibandingkan (Comparison)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-amber-50 border border-amber-400 inline-block"></span>
              <span className="text-slate-500 text-[11px]">Sub-Array Aktif (Split)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-emerald-50 border border-emerald-500 inline-block"></span>
              <span className="text-slate-500 text-[11px]">Selesai Diurutkan (Merged)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-white border border-slate-100 opacity-60 inline-block"></span>
              <span className="text-slate-500 text-[11px]">Standby / Belum Terjangkau</span>
            </div>
          </div>

          {/* Rangkaian Kartu Laptop yang Dimanipulasi */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3" id="visualizer-cards-grid">
            <AnimatePresence mode="popLayout">
              {displayLaptops.map((laptop, index) => {
                const isCompared = currentStep.activeIndices.includes(laptop.id);
                const isMerged = currentStep.mergedIndices.includes(laptop.id);

                return (
                  <motion.div
                    key={laptop.id}
                    layout
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: isCompared ? 1.05 : 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className={`p-3 border rounded-xl flex flex-col justify-between h-40 transition-all ${getCardStatusColor(laptop.id)}`}
                    id={`viz-card-${index}`}
                  >
                    <div className="space-y-1.5">
                      {/* Brand Logo & Type */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-800 tracking-tight font-display bg-slate-200/50 px-1.5 py-0.5 rounded uppercase">
                          {laptop.Company}
                        </span>
                        <span className="text-[9px] font-mono font-semibold text-slate-400">
                          N = {index + 1}
                        </span>
                      </div>

                      {/* Product Name */}
                      <h4 className="text-[11px] font-bold text-slate-700 leading-snug truncate" title={laptop.Product}>
                        {laptop.Product}
                      </h4>

                      {/* Specs Mini */}
                      <div className="text-[9px] font-mono text-slate-400 space-y-0.5 leading-none">
                        <p>RAM: {laptop.Ram || "8GB"}</p>
                        <p>CPU: {laptop.Cpu ? laptop.Cpu.split(" ")[0] : "Core i5"}</p>
                      </div>
                    </div>

                    {/* Footer Metrics */}
                    <div className="mt-3 pt-2 border-t border-slate-100 flex flex-col gap-1 leading-none font-mono">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-semibold">SKOR QUALITY</span>
                        <span className="font-bold text-slate-700">{laptop.QualityScore}</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400 font-semibold">HARGA</span>
                        <span className="font-bold text-blue-700">€{Math.round(laptop.Price_euros)}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Informasi Pembatasan Render */}
            {currentStep.tempState.length > renderLimit && (
              <div className="p-3 border border-slate-100 bg-slate-50/50 rounded-xl flex flex-col items-center justify-center text-center text-slate-400 gap-1.5 h-40">
                <HelpCircle className="w-5 h-5 text-slate-300" />
                <span className="text-[9px] font-mono font-bold">
                  +{currentStep.tempState.length - renderLimit} LAPTOP LAINNYA
                </span>
                <span className="text-[8px] leading-tight text-slate-400">
                  Disederhanakan agar visualisasi rapi di layar
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
