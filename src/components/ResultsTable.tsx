/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion } from "motion/react";
import { Copy, Download, Check, TableProperties } from "lucide-react";
import { SkenarioHasil } from "../types";

interface ResultsTableProps {
  scenarios: SkenarioHasil[];
}

export default function ResultsTable({ scenarios }: ResultsTableProps) {
  const [copied, setCopied] = useState(false);

  if (scenarios.length === 0) {
    return null;
  }

  // Fungsi eksport ke CSV
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "No,Ukuran Data (N),Waktu Eksekusi (ms),Estimasi Memori (MB),Kompleksitas Teoretis\n";
    
    scenarios.forEach((row, idx) => {
      csvContent += `${idx + 1},${row.ukuran},${row.waktu},${row.memori},O(n log n)\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "mergesort_benchmark_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fungsi menyalin isi tabel
  const handleCopyTable = () => {
    let plainText = "No\tUkuran Data (N)\tWaktu Eksekusi (ms)\tEstimasi Memori (MB)\tKompleksitas Teoretis\n";
    scenarios.forEach((row, idx) => {
      plainText += `${idx + 1}\t${row.ukuran}\t${row.waktu} ms\t${row.memori} MB\tO(n log n)\n`;
    });

    navigator.clipboard.writeText(plainText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4" id="results-table-container">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-800 flex items-center gap-2">
            <TableProperties className="w-5 h-5 text-blue-800" />
            Tabel Hasil Pengujian Empiris
          </h2>
          <p className="text-xs text-slate-400">
            Data hasil pengujian runtime real-time Merge Sort pada thread browser lokal
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleCopyTable}
            type="button"
            className="px-3.5 py-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer font-mono"
            id="btn-copy-table"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>BERHASIL DISALIN!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>SALIN TABEL</span>
              </>
            )}
          </button>

          <button
            onClick={handleExportCSV}
            type="button"
            className="px-3.5 py-2 bg-blue-800 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center gap-2 transition-all cursor-pointer font-mono"
            id="btn-export-results-csv"
          >
            <Download className="w-4 h-4" />
            <span>EXPORT CSV</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-100 rounded-xl">
        <table className="w-full text-left border-collapse text-sm" id="empirical-results-table">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-100 font-display">
              <th className="py-3.5 px-4 font-semibold text-slate-600 text-xs text-center w-16">NO</th>
              <th className="py-3.5 px-4 font-semibold text-slate-600 text-xs">UKURAN DATA (N)</th>
              <th className="py-3.5 px-4 font-semibold text-slate-600 text-xs">WAKTU EKSEKUSI (ms)</th>
              <th className="py-3.5 px-4 font-semibold text-slate-600 text-xs">ESTIMASI MEMORI (MB)</th>
              <th className="py-3.5 px-4 font-semibold text-slate-600 text-xs">KOMPLEKSITAS TEORETIS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 font-mono text-xs">
            {scenarios.map((row, idx) => (
              <tr key={row.ukuran} className="hover:bg-slate-50/30 transition-colors">
                <td className="py-3 px-4 text-slate-400 font-bold text-center">{idx + 1}</td>
                <td className="py-3 px-4 text-slate-800 font-bold">{row.ukuran.toLocaleString("id-ID")}</td>
                <td className="py-3 px-4 text-slate-800 text-blue-600 font-semibold">{row.waktu.toFixed(4)} ms</td>
                <td className="py-3 px-4 text-slate-800 text-indigo-600 font-semibold">{row.memori.toFixed(4)} MB</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md font-semibold text-[10px]">
                    O(n log n)
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
