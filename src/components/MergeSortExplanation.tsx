/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Info, Code, Layers, Zap, ShieldCheck } from "lucide-react";

export default function MergeSortExplanation() {
  const cards = [
    {
      icon: <Layers className="w-6 h-6 text-blue-600" />,
      title: "Bagi & Satukan",
      desc: "Data laptop yang acak-acakan dibagi dulu jadi bagian kecil-kecil, lalu digabungin lagi secara berurutan agar rapi.",
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      title: "Urutan Tetap Aman",
      desc: "Kalau ada dua laptop yang harganya persis sama, posisi aslinya gak bakal ketuker atau berantakan.",
    },
    {
      icon: <Code className="w-6 h-6 text-emerald-600" />,
      title: "Kecepatan Stabil",
      desc: "Proses pengurutan tetap cepat dan stabil, baik saat kamu mengurutkan belasan data maupun ribuan data laptop sekaligus.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-purple-600" />,
      title: "Sistematis & Presisi",
      desc: "Sistem membutuhkan ruang memori sementara yang teratur untuk memastikan proses penyaringan tidak ada yang terlewat.",
    },
  ];

  return (
    <div className="space-y-4" id="explanation-container">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-50 text-blue-800 rounded-lg">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Kenapa Menggunakan Metode Ini?
          </h2>
          <p className="text-xs text-slate-500">
            Berikut adalah kelebihan cara kerja sistem dalam menyusun data laptopmu.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
            className="p-5 bg-white border border-slate-100 rounded-xl shadow-xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
            id={`explanation-card-${idx}`}
          >
            <div className="space-y-3">
              <div className="p-2.5 bg-slate-50 w-fit rounded-lg">{card.icon}</div>
              <h3 className="font-semibold text-slate-800 text-sm md:text-base">
                {card.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {card.desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
              <span className="text-[10px] text-slate-400 font-medium">
                Karakteristik
              </span>
              <span className="text-xs font-semibold text-blue-600">
                {idx === 0 ? "Bagi-Gabung" : idx === 1 ? "Stabil" : idx === 2 ? "Konsisten" : "Akurat"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
