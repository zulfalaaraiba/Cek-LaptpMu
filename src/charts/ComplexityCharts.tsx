/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { SkenarioHasil } from "../types";
import { TrendingUp, Activity } from "lucide-react";

interface ComplexityChartsProps {
  data: SkenarioHasil[];
}

export default function ComplexityCharts({ data }: ComplexityChartsProps) {
  if (data.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm font-mono" id="charts-empty">
        SILAKAN JALANKAN ANALISIS UNTUK MENAMPILKAN VISUALISASI GRAFIK KOMPLEKSITAS
      </div>
    );
  }

  // Format angka untuk tooltip
  const formatTimeTooltip = (value: any) => [`${parseFloat(value).toFixed(4)} ms`, "Waktu Eksekusi"];
  const formatMemoryTooltip = (value: any) => [`${parseFloat(value).toFixed(4)} MB`, "Estimasi Memori"];
  
  const formatXAxis = (tickItem: any) => tickItem.toLocaleString("id-ID");

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6" id="complexity-charts-container">
      {/* GRAFIK 1: Analisis Waktu Eksekusi */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between"
        id="time-chart-card"
      >
        <div className="space-y-1 mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-700" />
            <h3 className="font-bold text-slate-800 font-display">
              Analisis Waktu Eksekusi Merge Sort
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Karakteristik pertumbuhan waktu eksekusi: O(n log n)
          </p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 20, left: -10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="ukuran" 
                tickFormatter={formatXAxis}
                tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
                stroke="#cbd5e1"
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
                stroke="#cbd5e1"
                label={{ 
                  value: 'Waktu (ms)', 
                  angle: -90, 
                  position: 'insideLeft', 
                  offset: 0,
                  style: { fill: '#64748b', fontSize: 11, fontWeight: 500 }
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                  fontSize: '12px',
                  fontFamily: 'sans-serif'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                formatter={formatTimeTooltip}
                labelFormatter={(label) => `Ukuran Data (N): ${label.toLocaleString("id-ID")}`}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Line
                name="Waktu Eksekusi (ms)"
                type="monotone"
                dataKey="waktu"
                stroke="#1a365d"
                strokeWidth={3}
                activeDot={{ r: 8 }}
                dot={{ r: 5, stroke: '#1a365d', strokeWidth: 2, fill: '#ffffff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400 font-mono">
          <span>X: UKURAN DATA (N)</span>
          <span>Y: MILIDETIK (ms)</span>
        </div>
      </motion.div>

      {/* GRAFIK 2: Analisis Penggunaan Memori */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between"
        id="memory-chart-card"
      >
        <div className="space-y-1 mb-6">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-700" />
            <h3 className="font-bold text-slate-800 font-display">
              Analisis Penggunaan Memori
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Karakteristik alokasi memori heap tambahan: O(n)
          </p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 20, left: -10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis 
                dataKey="ukuran" 
                tickFormatter={formatXAxis}
                tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
                stroke="#cbd5e1"
              />
              <YAxis 
                tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
                stroke="#cbd5e1"
                label={{ 
                  value: 'Memori (MB)', 
                  angle: -90, 
                  position: 'insideLeft', 
                  offset: 0,
                  style: { fill: '#64748b', fontSize: 11, fontWeight: 500 }
                }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
                  fontSize: '12px',
                  fontFamily: 'sans-serif'
                }}
                labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                formatter={formatMemoryTooltip}
                labelFormatter={(label) => `Ukuran Data (N): ${label.toLocaleString("id-ID")}`}
              />
              <Legend verticalAlign="top" height={36} iconType="circle" />
              <Line
                name="Penggunaan Memori (MB)"
                type="monotone"
                dataKey="memori"
                stroke="#2b6cb0"
                strokeWidth={3}
                activeDot={{ r: 8 }}
                dot={{ r: 5, stroke: '#2b6cb0', strokeWidth: 2, fill: '#ffffff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 pt-3 border-t border-slate-50 flex justify-between items-center text-[10px] text-slate-400 font-mono">
          <span>X: UKURAN DATA (N)</span>
          <span>Y: MEGABYTE (MB)</span>
        </div>
      </motion.div>
    </div>
  );
}
