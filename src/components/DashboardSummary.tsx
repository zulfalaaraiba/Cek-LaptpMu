/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Database, Zap, Clock, HardDrive, BarChart3 } from "lucide-react";
import { SkenarioHasil } from "../types";

interface DashboardSummaryProps {
  scenarios: SkenarioHasil[];
  totalData: number;
}

export default function DashboardSummary({ scenarios, totalData }: DashboardSummaryProps) {
  // Hitung metrik ringkasan
  const hasScenarios = scenarios.length > 0;
  
  const fastest = hasScenarios 
    ? Math.min(...scenarios.map(s => s.waktu)) 
    : 0;
    
  const slowest = hasScenarios 
    ? Math.max(...scenarios.map(s => s.waktu)) 
    : 0;
    
  const maxMemory = hasScenarios 
    ? Math.max(...scenarios.map(s => s.memori)) 
    : 0;

  const statCards = [
    {
      icon: <Database className="w-5 h-5 text-blue-600" />,
      title: "Jumlah Data",
      value: totalData > 0 ? `${totalData.toLocaleString("id-ID")} Laptop` : "0 Laptop",
      desc: "Ukuran penuh dataset input",
      color: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
      icon: <Zap className="w-5 h-5 text-emerald-600" />,
      title: "Waktu Tercepat",
      value: hasScenarios ? `${fastest.toFixed(3)} ms` : "0.000 ms",
      desc: `Dicapai pada N = ${hasScenarios ? scenarios[0].ukuran : 0}`,
      color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    {
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      title: "Waktu Terlama",
      value: hasScenarios ? `${slowest.toFixed(3)} ms` : "0.000 ms",
      desc: `Dicapai pada N = ${hasScenarios ? scenarios[scenarios.length - 1].ukuran : 0}`,
      color: "bg-amber-50 text-amber-700 border-amber-100",
    },
    {
      icon: <HardDrive className="w-5 h-5 text-indigo-600" />,
      title: "Memori Maksimum",
      value: hasScenarios ? `${maxMemory.toFixed(3)} MB` : "0.000 MB",
      desc: "Estimasi overhead alokasi stack",
      color: "bg-indigo-50 text-indigo-700 border-indigo-100",
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-purple-600" />,
      title: "Kompleksitas Algoritma",
      value: "O(n log n)",
      desc: "Space: O(n) auxiliary",
      color: "bg-purple-50 text-purple-700 border-purple-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4" id="dashboard-summary-grid">
      {statCards.map((card, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, delay: idx * 0.05 }}
          className="bg-white border border-slate-100 p-5 rounded-2xl shadow-xs hover:shadow-xs transition-shadow duration-150 flex flex-col justify-between"
          id={`stat-card-${idx}`}
        >
          <div className="space-y-3">
            <div className={`p-2.5 rounded-xl w-fit border ${card.color}`}>
              {card.icon}
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 block font-display">
                {card.title}
              </span>
              <span className="text-lg md:text-xl font-bold text-slate-800 tracking-tight font-mono">
                {card.value}
              </span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 block mt-3 font-mono leading-none">
            {card.desc.toUpperCase()}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
