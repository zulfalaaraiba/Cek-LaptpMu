/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  FileText, 
  Settings, 
  GitFork, 
  Layers, 
  Clock, 
  Cpu, 
  BarChart3, 
  CheckCircle,
  HelpCircle,
  Sparkles,
  ArrowDown
} from "lucide-react";

interface FlowchartStep {
  id: number;
  label: string;
  icon: React.ReactNode;
  desc: string;
  subItems?: string[];
  color: string;
  badge?: string;
}

interface FlowchartVisualizerProps {
  activeStep: number | null; // 1 to 9, or null
  isSorting: boolean;
}

export default function FlowchartVisualizer({ activeStep, isSorting }: FlowchartVisualizerProps) {
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  const steps: FlowchartStep[] = [
    {
      id: 1,
      label: "Mulai",
      icon: <Play className="w-5 h-5 text-emerald-500" />,
      desc: "Menyiapkan filter pilihan merek dan kriteria pengurutan laptop sesuai keinginanmu.",
      color: "border-emerald-200 bg-emerald-50/50 text-emerald-800",
      badge: "START"
    },
    {
      id: 2,
      label: "Membaca Data Laptop",
      icon: <FileText className="w-5 h-5 text-blue-500" />,
      desc: "Aplikasi membaca semua daftar laptop yang tersimpan di dalam file data (seperti merek, harga, RAM, tipe, dan rating).",
      color: "border-blue-200 bg-blue-50/50 text-blue-800",
      badge: "INPUT"
    },
    {
      id: 3,
      label: "Pembersihan Data",
      icon: <Settings className="w-5 h-5 text-amber-500" />,
      desc: "Memisahkan informasi yang penting, membuang data yang kosong atau rusak, dan mengubahnya menjadi daftar siap pakai.",
      subItems: ["Memilih Atribut Laptop", "Membuang Kolom Kosong", "Menyusun Daftar Rapi"],
      color: "border-amber-200 bg-amber-50/50 text-amber-800",
      badge: "PREPARE"
    },
    {
      id: 4,
      label: "Mengurutkan (Merge Sort)",
      icon: <GitFork className="w-5 h-5 text-indigo-500 animate-pulse" />,
      desc: "Mengurutkan seluruh daftar menggunakan metode bagi-dan-gabung (Merge Sort) agar hasilnya presisi dan stabil.",
      subItems: ["Bagi: Memecah data jadi bagian kecil", "Urutkan: Menyusun data per kelompok", "Gabung: Mengumpulkan semua kembali"],
      color: "border-indigo-200 bg-indigo-50/50 text-indigo-800",
      badge: "PROSES"
    },
    {
      id: 5,
      label: "Laptop Sudah Terurut",
      icon: <Layers className="w-5 h-5 text-cyan-500" />,
      desc: "Daftar laptop sekarang sudah tersusun rapi dari yang termurah, termahal, atau rating terbaik sesuai pilihanmu.",
      color: "border-cyan-200 bg-cyan-50/50 text-cyan-800",
      badge: "TERURUT"
    },
    {
      id: 6,
      label: "Menghitung Waktu Proses",
      icon: <Clock className="w-5 h-5 text-rose-500" />,
      desc: "Menghitung seberapa cepat sistem komputer merapikan daftar laptop (dalam satuan milidetik).",
      color: "border-rose-200 bg-rose-50/50 text-rose-800",
      badge: "WAKTU"
    },
    {
      id: 7,
      label: "Mengukur Penggunaan Memori",
      icon: <Cpu className="w-5 h-5 text-purple-500" />,
      desc: "Memastikan berapa banyak kapasitas RAM atau ruang memori sementara yang digunakan sistem untuk mengurutkan data.",
      color: "border-purple-200 bg-purple-50/50 text-purple-800",
      badge: "MEMORI"
    },
    {
      id: 8,
      label: "Menampilkan Grafik & Hasil",
      icon: <BarChart3 className="w-5 h-5 text-orange-500" />,
      desc: "Merender kartu laptop interaktif, tabel spek lengkap, dan grafik kecepatan serta memori agar mudah kamu pelajari.",
      color: "border-orange-200 bg-orange-50/50 text-orange-800",
      badge: "HASIL"
    },
    {
      id: 9,
      label: "Selesai",
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
      desc: "Selesai! Kamu sekarang bisa membandingkan laptop terbaik dan mendownload datanya.",
      color: "border-emerald-300 bg-emerald-100/50 text-emerald-950",
      badge: "SELESAI"
    }
  ];

  return (
    <div className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-6" id="flowchart-visualizer-card">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div className="space-y-1">
          <span className="px-2.5 py-0.5 bg-blue-50 text-blue-800 text-[10px] font-bold rounded-md uppercase tracking-wider">
            Alur Kerja Aplikasi (Flowchart)
          </span>
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-900" />
            Langkah Kerja Cek LaptopMu
          </h2>
          <p className="text-xs text-slate-400">
            Berikut adalah tahapan sistem dari awal membaca data laptop hingga menampilkan grafik perbandingan untukmu.
          </p>
        </div>

        {isSorting && (
          <div className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1.5 rounded-xl border border-blue-100 text-xs font-semibold animate-pulse self-start md:self-center">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-ping"></div>
            <span>Sedang memproses langkah...</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* DIAGRAM FLOWCHART UTAMA */}
        <div className="lg:col-span-7 space-y-3 bg-slate-50/50 border border-slate-100 p-4 md:p-6 rounded-2xl">
          {steps.map((step, idx) => {
            const isActive = activeStep === step.id;
            const isCompleted = activeStep !== null && activeStep > step.id;

            return (
              <React.Fragment key={step.id}>
                {/* FLOW CARD */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedStep(step.id)}
                  className={`relative p-3.5 border rounded-xl flex items-center justify-between gap-4 cursor-pointer transition-all duration-300 ${
                    isActive 
                      ? "ring-2 ring-blue-500/50 bg-white border-blue-400 shadow-md shadow-blue-500/5 translate-x-1" 
                      : isCompleted 
                        ? "bg-slate-100 border-slate-200/80 opacity-75" 
                        : "bg-white border-slate-100 hover:border-slate-200"
                  }`}
                  id={`flowchart-node-${step.id}`}
                >
                  <div className="flex items-center gap-3">
                    {/* Urutan Angka atau Icon */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                      isActive 
                        ? "bg-blue-900 text-white" 
                        : isCompleted 
                          ? "bg-slate-200 text-slate-500" 
                          : "bg-slate-50 text-slate-400 border border-slate-200/50"
                    }`}>
                      {step.id}
                    </div>

                    {/* Konten Kiri */}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-xs md:text-sm ${isActive ? "text-blue-950" : "text-slate-700"}`}>
                          {step.label}
                        </span>
                        {step.badge && (
                          <span className={`text-[8px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            isActive ? "bg-blue-100 text-blue-900" : "bg-slate-100 text-slate-400"
                          }`}>
                            {step.badge}
                          </span>
                        )}
                      </div>

                      {/* Sub Items Preview jika ada */}
                      {step.subItems && (
                        <div className="flex flex-wrap gap-x-2 gap-y-1 mt-1 text-[9px] font-semibold text-slate-400">
                          {step.subItems.map((item, sIdx) => (
                            <span key={sIdx} className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200/30">
                              • {item}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Icon & Indikator Status Kanan */}
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg shrink-0 ${
                      isActive ? "bg-blue-50 text-blue-900" : "bg-slate-50 text-slate-400"
                    }`}>
                      {step.icon}
                    </div>
                    
                    {/* Ring ping pulsing if active */}
                    {isActive && (
                      <span className="relative flex h-2.5 w-2.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* LINE CONNECTOR */}
                {idx < steps.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className={`w-4 h-4 transition-colors ${
                      isCompleted ? "text-blue-500 animate-pulse" : "text-slate-300"
                    }`} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* SIDE BAR PENJELASAN LANGKAH (INFO BOX) */}
        <div className="lg:col-span-5 h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedStep || activeStep || 1}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-slate-900 text-white rounded-2xl p-6 h-full flex flex-col justify-between border border-slate-800 shadow-xl relative overflow-hidden min-h-[300px]"
              id="flowchart-info-box"
            >
              {/* Background abstract overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent opacity-60 pointer-events-none"></div>
              
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded font-bold uppercase">
                    Detail Langkah Kerja
                  </span>
                  <HelpCircle className="w-4.5 h-4.5 text-slate-500" />
                </div>

                {(() => {
                  const s = steps.find((step) => step.id === (selectedStep || activeStep || 1));
                  if (!s) return null;
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
                          {s.icon}
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-white">
                            {s.label}
                          </h4>
                          <p className="text-[10px] text-slate-400 uppercase">Langkah {s.id} dari 9</p>
                        </div>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed text-left">
                        {s.desc}
                      </p>

                      {s.subItems && s.subItems.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-white/5 text-left">
                          <p className="text-[10px] font-bold text-slate-400">SUB-LANGKAH DETIL:</p>
                          <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                            {s.subItems.map((item, subIdx) => (
                              <li key={subIdx} className="leading-normal">
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div className="pt-6 border-t border-white/5 text-[10px] text-slate-400 flex items-center justify-between relative z-10">
                <span>KLIK LANGKAH DI KIRI UNTUK PENJELASAN</span>
                <span className="text-blue-400 font-bold">Cek LaptopMu</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
