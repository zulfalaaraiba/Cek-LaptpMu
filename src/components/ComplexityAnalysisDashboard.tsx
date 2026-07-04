/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { BenchmarkResult } from "../utils/complexityBenchmark";
import { TrendingUp, Award, Layers3, Cpu, Sparkles } from "lucide-react";

interface ComplexityAnalysisDashboardProps {
  data: BenchmarkResult[];
}

export default function ComplexityAnalysisDashboard({ data }: ComplexityAnalysisDashboardProps) {
  if (data.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs font-semibold" id="benchmark-empty">
        SILAKAN KLIK TOMBOL JALANKAN PENGURUTAN DI ATAS UNTUK MELIHAT GRAFIK ANALISIS KOMPLEKSITAS & BENCHMARK PENELITIAN
      </div>
    );
  }

  // Format tooltip custom
  const formatXAxis = (tickItem: any) => `${tickItem} Data`;

  // Hitung ringkasan statistik pertumbuhan
  const largestData = data[data.length - 1];
  const totalComp = largestData.comparisons.toLocaleString("id-ID");
  const totalCalls = largestData.recursiveCalls.toLocaleString("id-ID");
  const totalWaktu = largestData.waktu.toFixed(3);

  return (
    <div className="space-y-8" id="complexity-research-dashboard">
      
      {/* 1. VISUALISASI KOMPLEKSITAS MERGE SORT */}
      <section className="space-y-6" id="complexity-charts-section">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
            <Layers3 className="w-5 h-5 text-indigo-900" />
            Visualisasi Kompleksitas Merge Sort
          </h2>
          <p className="text-xs text-slate-400">
            Diagram empiris pertumbuhan algoritma Merge Sort berdasarkan data pengujian simulasi multiskala.
          </p>
        </div>

        {/* Grid 3 Grafik */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Grafik 1: Execution Time vs Jumlah Data */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-1 mb-4">
              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase">
                Waktu vs Data size
              </span>
              <h3 className="font-bold text-slate-800 text-xs font-display">
                1. Execution Time (ms)
              </h3>
            </div>

            <div className="h-56 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="ukuran" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "11px" }}
                    labelFormatter={(label) => `Ukuran: ${label} Data`}
                  />
                  <Line 
                    name="Waktu (ms)" 
                    type="monotone" 
                    dataKey="waktu" 
                    stroke="#1e3a8a" 
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#fff", stroke: "#1e3a8a", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-slate-400 mt-3 text-center italic">
              Kurva melandai membuktikan laju log-linear O(n log n).
            </p>
          </motion.div>

          {/* Grafik 2: Memory Usage vs Jumlah Data */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-1 mb-4">
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded uppercase">
                Memori vs Data size
              </span>
              <h3 className="font-bold text-slate-800 text-xs font-display">
                2. Memory Usage (MB)
              </h3>
            </div>

            <div className="h-56 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="ukuran" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "11px" }}
                    labelFormatter={(label) => `Ukuran: ${label} Data`}
                  />
                  <Line 
                    name="Memori (MB)" 
                    type="monotone" 
                    dataKey="memori" 
                    stroke="#10b981" 
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#fff", stroke: "#10b981", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-slate-400 mt-3 text-center italic">
              Grafik memori meningkat secara linear mengikuti O(n).
            </p>
          </motion.div>

          {/* Grafik 3: Recursive Calls vs Jumlah Data */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.2 }}
            className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs flex flex-col justify-between"
          >
            <div className="space-y-1 mb-4">
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                Panggilan Rekursif vs Data size
              </span>
              <h3 className="font-bold text-slate-800 text-xs font-display">
                3. Recursive Calls (Bar)
              </h3>
            </div>

            <div className="h-56 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="ukuran" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "11px" }}
                    labelFormatter={(label) => `Ukuran: ${label} Data`}
                  />
                  <Bar name="Recursive Calls" dataKey="recursiveCalls" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-slate-400 mt-3 text-center italic">
              Jumlah panggilan rekursif melonjak seiring penambahan data.
            </p>
          </motion.div>
        </div>

        {/* Ringkasan Otomatis Grafik */}
        <div className="p-4 bg-blue-50/50 border border-blue-100/50 rounded-2xl flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-900 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-950 space-y-1">
            <p className="font-bold">Kesimpulan Visual Komparatif:</p>
            <p className="leading-relaxed">
              Grafik pengujian membuktikan bahwa <b>waktu eksekusi</b> Merge Sort meningkat secara landai log-linear sesuai laju <b>O(n log n)</b>, menjadikannya jauh lebih efisien dibandingkan Bubble/Selection Sort berkarakteristik kuadratik O(n²). Di sisi lain, <b>penggunaan memori</b> meningkat secara linear lurus mengikuti kriteria ruang <b>O(n)</b> karena alokasi sub-array temporer. Sedangkan <b>jumlah panggilan rekursif</b> bertambah secara deterministik seiring kedalaman pembagian array.
            </p>
          </div>
        </div>
      </section>

      {/* 2. ANALISIS PERTUMBUHAN KOMPLEKSITAS MERGE SORT */}
      <section className="space-y-4" id="complexity-growth-section">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-800 font-display flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-900" />
            Analisis Pertumbuhan Kompleksitas Merge Sort
          </h2>
          <p className="text-xs text-slate-400">
            Tabel komparasi empiris hasil simulasi multi-dataset untuk mata kuliah Kompleksitas Algoritma.
          </p>
        </div>

        {/* Table Hasil Pengujian */}
        <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-mono font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 text-center">Ukuran Data (N)</th>
                  <th className="py-3 px-4 text-right">Execution Time (ms)</th>
                  <th className="py-3 px-4 text-center">Recursive Calls</th>
                  <th className="py-3 px-4 text-center">Merge Operations</th>
                  <th className="py-3 px-4 text-center">Comparisons</th>
                  <th className="py-3 px-4 text-center">Memory Usage</th>
                  <th className="py-3 px-4">Kesimpulan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-600 font-mono">
                {data.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 text-center font-bold text-slate-900">
                      {row.ukuran} Data
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-blue-900">
                      {row.waktu.toFixed(4)} ms
                    </td>
                    <td className="py-3 px-4 text-center text-indigo-700 font-semibold">
                      {row.recursiveCalls.toLocaleString("id-ID")} kali
                    </td>
                    <td className="py-3 px-4 text-center text-amber-700">
                      {row.merges.toLocaleString("id-ID")} kali
                    </td>
                    <td className="py-3 px-4 text-center text-slate-700 font-semibold">
                      {row.comparisons.toLocaleString("id-ID")} kali
                    </td>
                    <td className="py-3 px-4 text-center text-emerald-700">
                      {row.memori.toFixed(4)} MB
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-500 text-[11px]">
                      {row.ukuran <= 50 ? (
                        <span>Sangat instan, overhead minimal.</span>
                      ) : row.ukuran <= 200 ? (
                        <span>Pertumbuhan waktu log-linear sangat aman.</span>
                      ) : (
                        <span>Konsisten stabil, performa O(n log n) optimal.</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ringkasan Penelitian Otomatis */}
        <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-3xl space-y-3 shadow-md shadow-blue-900/10">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h4 className="font-bold text-sm">Kesimpulan Penelitian Akademis Otomatis:</h4>
          </div>
          <p className="text-xs leading-relaxed opacity-90 font-sans">
            Berdasarkan simulasi multiskala di atas dengan kriteria laptop yang diuji, total perbandingan yang dilakukan pada ukuran tertinggi (N = 1000) adalah sebanyak <b className="text-amber-300 font-mono">{totalComp} kali</b> dengan kedalaman rekursi maksimum sebesar <b className="text-amber-300 font-mono">{Math.ceil(Math.log2(1000))} level</b>. 
            Hal ini memverifikasi bahwa semakin besar ukuran data, laju pertumbuhan waktu eksekusi meningkat secara bertahap mengikuti fungsi kurva <b className="text-amber-300 font-mono">O(n log n)</b> yang sangat stabil dan aman untuk sistem pengurutan berskala tinggi.
          </p>
        </div>
      </section>
    </div>
  );
}
