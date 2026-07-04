/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Laptop, 
  SkenarioHasil, 
  SortCriteria, 
  VisualizationStep,
  SalesData,
  MergeSortStats
} from "./types";
import { getDefaultLaptops } from "./data/defaultLaptops";
import { MergeSortVisualizer } from "./algorithms/mergeSortVisualizer";
import { analyzePerformance } from "./utils/performanceAnalyzer";
import { parseLaptopCSV } from "./utils/csvParser";
import { parseSalesCSV } from "./utils/salesParser";

import MergeSortExplanation from "./components/MergeSortExplanation";
import MergeSortStepVisualizer from "./components/MergeSortStepVisualizer";
import FlowchartVisualizer from "./components/FlowchartVisualizer";
import LaptopCard from "./components/LaptopCard";
import LaptopTable from "./components/LaptopTable";
import ComplexityCharts from "./charts/ComplexityCharts";
import LaptopSalesChart from "./charts/LaptopSalesChart";

import { runComplexityBenchmark, BenchmarkResult } from "./utils/complexityBenchmark";
import SortingFlowVisualizer from "./components/SortingFlowVisualizer";
import ComplexityAnalysisDashboard from "./components/ComplexityAnalysisDashboard";

import { 
  Cpu, 
  GraduationCap, 
  BarChart2, 
  BookOpen, 
  Layers, 
  Upload, 
  Filter, 
  Play, 
  RefreshCw, 
  ChevronRight, 
  Info,
  Layers3,
  Calendar,
  Sparkles,
  TrendingUp,
  Award,
  Monitor
} from "lucide-react";

const datasetSizeOptions = [
  { value: "asli", label: "Dataset Asli (34 Laptop)" },
  { value: "50", label: "50 Laptop (Simulasi)" },
  { value: "100", label: "100 Laptop (Simulasi)" },
  { value: "200", label: "200 Laptop (Simulasi)" },
  { value: "500", label: "500 Laptop (Simulasi)" },
  { value: "1000", label: "1000 Laptop (Simulasi)" },
];

export default function App() {
  // States
  const [allLaptops, setAllLaptops] = useState<Laptop[]>([]); // Data mentah asli / yang diunggah
  const [displayLaptops, setDisplayLaptops] = useState<Laptop[]>([]); // Data terfilter (masih acak/random)
  const [sortedLaptops, setSortedLaptops] = useState<Laptop[]>([]); // Data hasil sorting Merge Sort
  const [complexityResults, setComplexityResults] = useState<BenchmarkResult[]>([]);
  const [datasetSizeOption, setDatasetSizeOption] = useState<string>("asli");
  
  // Helper fungsi untuk menduplikasi dataset laptop
  const getDuplicatedDataset = (baseList: Laptop[], targetSize: number): Laptop[] => {
    if (baseList.length === 0) return [];
    const result: Laptop[] = [];
    let copyIndex = 1;
    while (result.length < targetSize) {
      for (const l of baseList) {
        if (result.length >= targetSize) break;
        result.push({
          ...l,
          id: `${l.id}-dup-${copyIndex}-${result.length}`,
        });
      }
      copyIndex++;
    }
    return result;
  };
  
  const [selectedBrand, setSelectedBrand] = useState<string>("Semua");
  const [selectedCriteria, setSelectedCriteria] = useState<SortCriteria>("Harga + Quality Score");
  
  // File upload metadata
  const [fileName, setFileName] = useState<string>("default_indonesian_dataset.csv");
  const [fileSize, setFileSize] = useState<string>("4.5 KB");

  // Visualisasi Merge Sort
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [visualizationSteps, setVisualizationSteps] = useState<VisualizationStep[]>([]);
  const [hasSorted, setHasSorted] = useState<boolean>(false);
  const [stats, setStats] = useState<MergeSortStats | null>(null);
  const [flowchartStep, setFlowchartStep] = useState<number | null>(null);

  // Benchmarking Complexity state
  const [benchmarkResults, setBenchmarkResults] = useState<SkenarioHasil[]>([]);

  // Sales Data State
  const [salesData, setSalesData] = useState<SalesData[]>([]);

  // Active Tab for Analytics (Runtime, Memory, Sales)
  const [activeTab, setActiveTab] = useState<"runtime" | "memory" | "sales">("runtime");

  // Load Initial Data (Acak / Random)
  useEffect(() => {
    // 1. Muat laptop default
    const defaults = getDefaultLaptops();
    // Acak (randomize) susunannya terlebih dahulu agar tidak terurut
    const randomized = [...defaults].sort(() => Math.random() - 0.5);
    setAllLaptops(randomized);
    setDisplayLaptops(randomized);

    // 2. Muat data penjualan dari public/sales_data.csv
    fetch("/sales_data.csv")
      .then((res) => res.text())
      .then((text) => {
        const parsed = parseSalesCSV(text);
        if (parsed && parsed.length > 0) {
          setSalesData(parsed);
        } else {
          // Fallback lokal jika fetch gagal
          setSalesData(getFallbackSalesData());
        }
      })
      .catch(() => {
        setSalesData(getFallbackSalesData());
      });
  }, []);

  // Update filtered list (displayLaptops) when selectedBrand changes
  useEffect(() => {
    let list = [...allLaptops];
    if (selectedBrand !== "Semua") {
      list = list.filter((l) => l.Company.toLowerCase() === selectedBrand.toLowerCase());
    }

    // Duplikasi jika opsi ukuran dipilih
    if (datasetSizeOption !== "asli") {
      const targetSize = parseInt(datasetSizeOption);
      if (!isNaN(targetSize) && targetSize > 0) {
        list = getDuplicatedDataset(list, targetSize);
      }
    }

    setDisplayLaptops(list);
    // Reset status sorting jika filter diganti agar user dapat menguji data terfilter yang baru
    setSortedLaptops([]);
    setHasSorted(false);
    setStats(null);
  }, [selectedBrand, allLaptops, datasetSizeOption]);

  // Fallback data penjualan jika file sales_data.csv gagal di-fetch
  const getFallbackSalesData = (): SalesData[] => {
    return [
      { Brand: "ASUS", TahunSebelumnya: 18500, TahunBerjalan: 24200 },
      { Brand: "Lenovo", TahunSebelumnya: 21000, TahunBerjalan: 22500 },
      { Brand: "Acer", TahunSebelumnya: 15200, TahunBerjalan: 16800 },
      { Brand: "HP", TahunSebelumnya: 19300, TahunBerjalan: 18100 },
      { Brand: "Dell", TahunSebelumnya: 14800, TahunBerjalan: 15400 },
      { Brand: "MSI", TahunSebelumnya: 8500, TahunBerjalan: 11200 },
      { Brand: "Apple", TahunSebelumnya: 9200, TahunBerjalan: 12600 },
      { Brand: "Gigabyte", TahunSebelumnya: 3100, TahunBerjalan: 4200 }
    ];
  };

  // Handler File Upload CSV manual
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    // Format ukuran file
    const sizeKB = (file.size / 1024).toFixed(1);
    setFileSize(`${sizeKB} KB`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      if (csvText) {
        const parsed = parseLaptopCSV(csvText);
        if (parsed.length > 0) {
          // Acak data yang diunggah
          const randomized = [...parsed].sort(() => Math.random() - 0.5);
          setAllLaptops(randomized);
          setSortedLaptops([]);
          setHasSorted(false);
          setStats(null);
        } else {
          alert("Format CSV tidak valid atau kosong. Harap gunakan format dataset laptop yang sesuai.");
        }
      }
    };
    reader.readAsText(file);
  };

  // Mengacak kembali data display saat ini
  const handleRandomize = () => {
    const randomized = [...displayLaptops].sort(() => Math.random() - 0.5);
    setDisplayLaptops(randomized);
    setSortedLaptops([]);
    setHasSorted(false);
    setStats(null);
  };

  // Fungsi Utama Jalankan Merge Sort dengan Animasi Flowchart Interaktif
  const handleRunMergeSort = () => {
    if (displayLaptops.length === 0) {
      alert("Tidak ada data laptop untuk diurutkan!");
      return;
    }

    setIsSorting(true);
    setHasSorted(false);
    setFlowchartStep(1); // Mulai (Start)

    // Skenario Preprocessing & Loading yang Ter-animasi sesuai alur Flowchart
    setTimeout(() => {
      setFlowchartStep(2); // Membaca Laptop Price Dataset (CSV)
    }, 450);

    setTimeout(() => {
      setFlowchartStep(3); // Preprocessing Data (Memilih Atribut, Hapus Null, Konversi ke List)
    }, 1100);

    setTimeout(() => {
      setFlowchartStep(4); // Merge Sort (Aktif)

      // Jalankan kalkulasi riil Merge Sort di latar belakang
      const startRuntime = performance.now();
      const visualizer = new MergeSortVisualizer(selectedCriteria);
      const { sortedArray, steps, recursiveCalls, merges, comparisons } = visualizer.sort(displayLaptops);
      const endRuntime = performance.now();
      const runtimeMs = parseFloat((endRuntime - startRuntime).toFixed(4));

      // Hitung estimasi penggunaan memori
      const objectOverheadBytes = 1200;
      const recursiveStackBytes = Math.log2(displayLaptops.length || 1) * 256;
      const totalBytesAllocated = (displayLaptops.length * objectOverheadBytes) + (displayLaptops.length * recursiveStackBytes);
      const memoryMB = parseFloat((totalBytesAllocated / (1024 * 1024)).toFixed(4));

      // Simpan step visualisasi dan hasil
      setVisualizationSteps(steps);
      setSortedLaptops(sortedArray);

      // Simpan statistik analisis Merge Sort
      setStats({
        dataSize: displayLaptops.length,
        runtime: runtimeMs,
        memory: memoryMB,
        recursiveCalls,
        merges,
        comparisons,
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)"
      });

      // Jalankan analisis grafik kompleksitas di latar belakang
      const benchmark = analyzePerformance(allLaptops, selectedCriteria);
      setBenchmarkResults(benchmark);

      // Jalankan benchmark multiskala baru untuk penelitian akademis
      const compBenchmark = runComplexityBenchmark(allLaptops.length > 0 ? allLaptops : displayLaptops, selectedCriteria);
      setComplexityResults(compBenchmark);

      // Jika data bertipe besar (isLargeData), alur visualisasi dilewati
      // maka jalankan simulasi flowchart langkah demi langkah ke akhir secara berurutan
      const isLargeData = displayLaptops.length > 16;
      if (isLargeData) {
        setTimeout(() => {
          setFlowchartStep(5); // Data Laptop Terurut
        }, 1000);

        setTimeout(() => {
          setFlowchartStep(6); // Mengukur Waktu Eksekusi
        }, 1600);

        setTimeout(() => {
          setFlowchartStep(7); // Mengukur Penggunaan Memori
        }, 2200);

        setTimeout(() => {
          setFlowchartStep(8); // Menampilkan Tabel + Grafik
        }, 2800);

        setTimeout(() => {
          setFlowchartStep(9); // Selesai
          setIsSorting(false);
          setHasSorted(true);
        }, 3400);
      }
    }, 1800);
  };

  const finishVisualizing = () => {
    // Alur lanjutan flowchart setelah merge sort selesai divisualisasikan secara manual
    setFlowchartStep(5); // Data Laptop Terurut

    setTimeout(() => {
      setFlowchartStep(6); // Mengukur Waktu Eksekusi
    }, 600);

    setTimeout(() => {
      setFlowchartStep(7); // Mengukur Penggunaan Memori
    }, 1200);

    setTimeout(() => {
      setFlowchartStep(8); // Menampilkan Tabel + Grafik
    }, 1800);

    setTimeout(() => {
      setFlowchartStep(9); // Selesai
      setIsSorting(false);
      setHasSorted(true);
    }, 2400);
  };

  // List Brand filter yang didukung
  const filterBrands = [
    "Semua", "ASUS", "Lenovo", "Acer", "HP", "Dell", "MSI", "Apple", 
    "Huawei", "Axioo", "Advan", "Infinix", "Zyrex", "AVITA", "Gigabyte"
  ];

  // List kriteria sortir
  const sortOptions: SortCriteria[] = [
    "Harga Termurah",
    "Harga Termahal",
    "Rating Terbaik",
    "Quality Score Terbaik",
    "Harga + Quality Score"
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 antialiased font-sans pb-16 selection:bg-blue-100 selection:text-blue-900">
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-900 text-white rounded-xl flex items-center justify-center shadow-md">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800 tracking-tight flex items-center gap-1.5 leading-none">
                Cek LaptopMu
                <span className="text-[10px] bg-blue-50 text-blue-800 px-1.5 py-0.5 rounded font-semibold">Rekomendasi Pintar</span>
              </h1>
              <p className="text-[10px] text-slate-400 mt-1">
                Cari, bandingkan, dan urutkan laptop impianmu dengan mudah!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="hidden sm:inline">Aplikasi Aktif & Siap Digunakan</span>
          </div>
        </div>
      </header>

      {/* CORE WRAPPER */}
      <main className="max-w-7xl mx-auto px-6 mt-8 space-y-8">
        {/* HERO INTRO */}
        <section className="bg-gradient-to-br from-blue-950 to-slate-900 text-white rounded-3xl p-8 md:p-10 shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-700/20 via-transparent to-transparent opacity-60"></div>
          
          <div className="space-y-4 max-w-2xl relative z-10">
            <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold rounded-full uppercase tracking-widest">
              100% Cepat & Akurat
            </span>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-tight">
              Temukan Laptop Terbaik di <span className="text-blue-400">Cek LaptopMu</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Bingung mencari laptop yang pas? Di sini kamu bisa mencari, memfilter, dan mengurutkan puluhan laptop berdasarkan harga termurah, termahal, atau rating kualitas dengan cepat menggunakan metode pengurutan pintar (Merge Sort).
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative z-10 flex flex-col items-center justify-center text-center max-w-xs shrink-0 backdrop-blur-xs">
            <Layers3 className="w-8 h-8 text-blue-400 mb-2" />
            <h3 className="font-semibold text-sm">Kenapa Cek LaptopMu?</h3>
            <p className="text-xs text-slate-300 mt-1">
              Kami mengurutkan data laptop secara real-time langsung di browser kamu dengan cepat, tanpa harus menunggu loading lama.
            </p>
          </div>
        </section>

        {/* METODOLOGI PENJELASAN */}
        <section>
          <MergeSortExplanation />
        </section>

        {/* FLOWCHART INTERAKTIF ALUR KERJA */}
        <section>
          <FlowchartVisualizer activeStep={flowchartStep} isSorting={isSorting} />
        </section>

        {/* BARIS FILTER UTAMA */}
        <section className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-900" />
              <h3 className="font-bold text-slate-800">Atur Pilihan Laptop</h3>
            </div>
            <p className="text-xs text-slate-400">
              Pilih merek laptop yang kamu incar dan kriteria urutan yang kamu inginkan.
            </p>
          </div>

          {/* Grid Selector */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Brand Filter */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 block uppercase">Pilih Merek Laptop</label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none transition-all cursor-pointer"
              >
                {filterBrands.map((brand) => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Sort Criteria */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 block uppercase">Urutkan Berdasarkan</label>
              <select
                value={selectedCriteria}
                onChange={(e) => setSelectedCriteria(e.target.value as SortCriteria)}
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none transition-all cursor-pointer"
              >
                {sortOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Dataset Size Option */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 block uppercase">Ukuran Simulasi Dataset</label>
              <select
                value={datasetSizeOption}
                onChange={(e) => setDatasetSizeOption(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-3 text-xs font-bold text-slate-700 outline-none transition-all cursor-pointer"
              >
                {datasetSizeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tombol Utama Trigger */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={handleRandomize}
              className="px-6 py-3 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Acak Ulang Data (Randomize)</span>
            </button>

            <button
              onClick={handleRunMergeSort}
              disabled={isSorting}
              className="flex-1 bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-blue-900/10 hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Jalankan Merge Sort</span>
            </button>
          </div>
        </section>

        {/* RANGKAIAN PANEL VISUALISASI LANGKAH DEMI LANGKAH */}
        <AnimatePresence mode="wait">
          {isSorting && (
            <motion.section
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
              id="active-visualization-section"
            >
              <MergeSortStepVisualizer
                steps={visualizationSteps}
                onFinishVisualizing={finishVisualizing}
                isLargeData={displayLaptops.length > 16}
                totalDataSize={displayLaptops.length}
              />
            </motion.section>
          )}
        </AnimatePresence>

        {/* METRICS STATISTIK ANALISIS (HANYA MUNCUL SETELAH DISORTIR) */}
        <AnimatePresence>
          {hasSorted && stats && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              id="sorting-stats-panel"
            >
              <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase">Jumlah Data (N)</span>
                  <span className="text-2xl font-black font-mono text-slate-800">{stats.dataSize}</span>
                </div>
                <div className="text-[9px] text-slate-400 font-mono mt-3">UKURAN SUBSET FILTERED</div>
              </div>

              <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase">Waktu Eksekusi (ms)</span>
                  <span className="text-2xl font-black font-mono text-blue-900">{stats.runtime} <span className="text-xs font-bold text-slate-400">ms</span></span>
                </div>
                <div className="text-[9px] text-slate-400 font-mono mt-3">DENGAN PERFORMANCE.NOW()</div>
              </div>

              <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase">Estimasi Heap Memori (MB)</span>
                  <span className="text-2xl font-black font-mono text-blue-900">{stats.memory} <span className="text-xs font-bold text-slate-400">MB</span></span>
                </div>
                <div className="text-[9px] text-slate-400 font-mono mt-3">ESTIMASI KEBUTUHAN TEMPORER ARRAY</div>
              </div>

              <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-mono font-bold block uppercase">Metrik Kompleksitas</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">Waktu: O(n log n)</span>
                    <span className="text-xs font-bold font-mono text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded">Ruang: O(n)</span>
                  </div>
                </div>
                <div className="text-[9px] text-slate-400 font-mono mt-3">KOMPLEKSITAS TEORITIS ASIMPTOTIK</div>
              </div>

              {/* Detail Komparasi dan Calls */}
              <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-xs col-span-2 lg:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="border-r border-slate-100 py-1">
                  <span className="text-[10px] text-slate-400 font-mono font-bold block">RECURSIVE CALLS</span>
                  <span className="text-xl font-bold font-mono text-slate-700">{stats.recursiveCalls} kali</span>
                </div>
                <div className="border-r border-slate-100 py-1">
                  <span className="text-[10px] text-slate-400 font-mono font-bold block" title="Kedalaman Rekursif Maksimum: Ceil(Log2(N))">RECURSIVE DEPTH ℹ️</span>
                  <span className="text-xl font-bold font-mono text-blue-900" title="Kedalaman rekursi teoritis yang diperlukan untuk membelah dataset laptop secara seimbang.">{Math.ceil(Math.log2(stats.dataSize || 1))} level</span>
                </div>
                <div className="border-r border-slate-100 py-1">
                  <span className="text-[10px] text-slate-400 font-mono font-bold block">MERGE OPERATIONS</span>
                  <span className="text-xl font-bold font-mono text-slate-700">{stats.merges} kali</span>
                </div>
                <div className="py-1">
                  <span className="text-[10px] text-slate-400 font-mono font-bold block">TOTAL COMPARISONS</span>
                  <span className="text-xl font-bold font-mono text-slate-700">{stats.comparisons} kali</span>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* VISUALISASI ALIRAN DATA (BEFORE vs AFTER SORTING) */}
        <SortingFlowVisualizer
          beforeLaptops={displayLaptops}
          afterLaptops={sortedLaptops}
          isSorting={isSorting}
          hasSorted={hasSorted}
          activeFlowchartStep={flowchartStep}
        />

        {/* KUMPULAN LAPTOP GRID (MARKETPLACE PREVIEW) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-lg md:text-xl font-bold font-display text-slate-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-900" />
                Katalog Laptop {selectedBrand !== "Semua" ? `Merek ${selectedBrand}` : "Indonesia (Acak)"}
              </h2>
              <p className="text-xs text-slate-400">
                Data mentah dalam susunan yang masih acak. Tekan "Jalankan Merge Sort" untuk merapikan urutannya.
              </p>
            </div>

            <div className="text-xs text-slate-500 font-mono">
              TAMPIL: <span className="font-bold text-slate-700">{displayLaptops.length} LAPTOP</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="marketplace-grid">
            {(hasSorted ? sortedLaptops : displayLaptops).map((laptop, index) => (
              <LaptopCard 
                key={laptop.id} 
                laptop={laptop} 
                index={index} 
              />
            ))}
          </div>
        </section>

        {/* DUA TAB ANALISIS DI BAWAH (RUNTIME, MEMORY) */}
        <section className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6" id="complexity-tab-container">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-800">
                Pusat Analisis Kecepatan & Memori
              </h2>
              <p className="text-xs text-slate-400">
                Pilih salah satu tab di bawah untuk melihat grafik performa sistem pengurutan.
              </p>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex bg-slate-50 border border-slate-200/60 p-1.5 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveTab("runtime")}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === "runtime" 
                    ? "bg-blue-900 text-white shadow-xs" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                1. Analisis Kecepatan
              </button>
              <button
                onClick={() => setActiveTab("memory")}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  activeTab === "memory" 
                    ? "bg-blue-900 text-white shadow-xs" 
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                2. Analisis Memori
              </button>
            </div>
          </div>

          {/* TAB CONTENT PANEL */}
          <div className="pt-2">
            {activeTab === "runtime" && (
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-950 space-y-1">
                    <p className="font-bold">Informasi Grafik Kecepatan:</p>
                    <p>
                      Grafik ini menggambarkan seberapa cepat sistem kami menyelesaikan pengurutan berdasarkan jumlah laptop. Pengurutan ini terkenal sangat stabil dan tetap cepat meskipun jumlah laptop yang diurutkan bertambah banyak.
                    </p>
                  </div>
                </div>
                {benchmarkResults.length > 0 ? (
                  <>
                    <ComplexityCharts data={benchmarkResults} />
                    {stats && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs text-slate-800 space-y-2"
                      >
                        <p className="font-bold text-emerald-950 flex items-center gap-1.5">
                          <Sparkles className="w-4.5 h-4.5 text-emerald-700" />
                          Hasil & Kesimpulan Kecepatan:
                        </p>
                        <p className="leading-relaxed text-left">
                          Berdasarkan kriteria pengurutan <span className="font-bold text-blue-900">"{selectedCriteria}"</span>, sistem berhasil mengurutkan <span className="font-bold text-emerald-800">{stats.dataSize} data laptop</span> dengan total waktu <span className="font-bold text-emerald-700">{stats.runtime} milidetik</span> dan melakukan sebanyak <span className="font-bold text-emerald-800">{stats.comparisons} kali perbandingan</span>.
                        </p>
                        <p className="leading-relaxed text-left">
                          Hal ini membuktikan bahwa metode pengurutan kami sangat bisa diandalkan. Ketika daftar laptop bertambah banyak, waktu yang dibutuhkan untuk mengurutkannya tetap landai dan efisien.
                        </p>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs font-semibold">
                    SILAKAN KLIK TOMBOL JALANKAN PENGURUTAN DI ATAS UNTUK MELIHAT GRAFIK KECEPATAN
                  </div>
                )}
              </div>
            )}

            {activeTab === "memory" && (
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-start gap-3">
                  <Info className="w-5 h-5 text-indigo-900 shrink-0 mt-0.5" />
                  <div className="text-xs text-indigo-950 space-y-1">
                    <p className="font-bold">Informasi Penggunaan Memori:</p>
                    <p>
                      Sistem ini menggunakan sedikit memori RAM tambahan sementara untuk membagi-bagi kelompok data laptop sebelum disatukan kembali secara rapi. Grafik di bawah menunjukkan jumlah memori yang terpakai seiring bertambahnya data laptop.
                    </p>
                  </div>
                </div>
                {benchmarkResults.length > 0 ? (
                  <>
                    <ComplexityCharts data={benchmarkResults} />
                    {stats && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl text-xs text-slate-800 space-y-2"
                      >
                        <p className="font-bold text-indigo-950 flex items-center gap-1.5">
                          <Sparkles className="w-4.5 h-4.5 text-indigo-700" />
                          Hasil & Kesimpulan Penggunaan Memori:
                        </p>
                        <p className="leading-relaxed text-left">
                          Untuk merapikan daftar ini, estimasi memori RAM tambahan sementara yang terpakai adalah sebesar <span className="font-bold text-indigo-700">{stats.memory} MB</span>.
                        </p>
                        <p className="leading-relaxed text-left">
                          Penggunaan memori ini naik secara lurus sesuai dengan jumlah laptop yang diurutkan. Angka ini sangat kecil dan aman, sehingga tidak akan membuat browser atau komputer kamu menjadi lambat.
                        </p>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs font-semibold">
                    SILAKAN KLIK TOMBOL JALANKAN PENGURUTAN DI ATAS UNTUK MELIHAT GRAFIK MEMORI
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* TAB COMPLEXITY RESEARCH DASHBOARD */}
        <section className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6" id="complexity-research-dashboard-container">
          <ComplexityAnalysisDashboard data={complexityResults} />
        </section>

        {/* GRAFIK PENJUALAN LAPTOP TERBESAR TAHUN INI vs TAHUN SEBELUMNYA */}
        <section className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold font-display text-slate-800 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-900" />
              Grafik Unit Penjualan Laptop Terbesar (Tahun Berjalan vs Tahun Sebelumnya)
            </h2>
            <p className="text-xs text-slate-400">
              Visualisasi riset pasar komparatif untuk mengidentifikasi volume permintaan merek laptop terpopuler di Indonesia.
            </p>
          </div>
          <LaptopSalesChart salesData={salesData} />
        </section>

        {/* TABEL SPESIFIKASI DETAIL DI BAGIAN PALING BAWAH */}
        <section>
          <LaptopTable 
            laptops={hasSorted ? sortedLaptops : displayLaptops} 
            isSorted={hasSorted} 
          />
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-slate-100 bg-white py-8 text-center text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto px-6 space-y-2">
          <p>© 2026 Laptop MergeSort Analyzer. Seluruh Hak Cipta Dilindungi.</p>
          <p className="text-[10px] text-slate-300">
            Platform riset skripsi. Algoritma Merge Sort diimplementasikan secara manual murni tanpa memanggil library bawaan JavaScript Array.prototype.sort().
          </p>
        </div>
      </footer>
    </div>
  );
}
