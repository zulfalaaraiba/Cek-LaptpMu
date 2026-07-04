/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from "react";
import { Play, Settings, AlertTriangle } from "lucide-react";

interface ConfigPanelProps {
  totalData: number;
  onRunAnalysis: (limit: number) => void;
  isAnalyzing: boolean;
}

export default function ConfigPanel({ totalData, onRunAnalysis, isAnalyzing }: ConfigPanelProps) {
  const [selectedLimit, setSelectedLimit] = useState<number>(1000);

  // Daftar opsi ukuran data
  const options = [
    { value: 100, label: "100 Baris Data" },
    { value: 300, label: "300 Baris Data" },
    { value: 500, label: "500 Baris Data" },
    { value: 1000, label: "1.000 Baris Data" },
    { value: -1, label: `Semua Data (${totalData.toLocaleString("id-ID")} Baris)` },
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (totalData === 0) return;
    
    // Konversi -1 menjadi jumlah data riil
    const actualLimit = selectedLimit === -1 ? totalData : selectedLimit;
    onRunAnalysis(actualLimit);
  };

  const hasData = totalData > 0;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm" id="config-panel-container">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-50 text-blue-800 rounded-lg">
          <Settings className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold font-display text-slate-800">
            Panel Konfigurasi Eksperimen
          </h2>
          <p className="text-xs text-slate-500 font-mono">
            BENCHMARK CONFIGURATION
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="data-size-select" className="block text-xs font-semibold text-slate-600 mb-1.5 font-mono">
            UKURAN DATA UTAMA (N)
          </label>
          <select
            id="data-size-select"
            disabled={!hasData || isAnalyzing}
            value={selectedLimit}
            onChange={(e) => setSelectedLimit(Number(e.target.value))}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-sm font-semibold text-slate-800 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {hasData ? (
              options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.value > totalData}>
                  {opt.label} {opt.value > totalData ? "(Data Kurang)" : ""}
                </option>
              ))
            ) : (
              <option value="">Unggah file CSV untuk mengaktifkan opsi</option>
            )}
          </select>
        </div>

        {!hasData ? (
          <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2.5 text-amber-800 text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <span>
              <strong>Perhatian:</strong> Silakan unggah dataset (.csv) laptop atau gunakan data default di atas terlebih dahulu untuk menjalankan analisis kompleksitas algoritma.
            </span>
          </div>
        ) : (
          <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-slate-600 text-xs leading-relaxed font-mono">
            <span className="font-bold text-slate-700 block">Skenario Analisis:</span>
            Pengujian komparatif akan otomatis menguji seluruh variasi ukuran: 
            <strong> {Array.from(new Set([100, 300, 500, 1000].filter(s => s <= totalData).concat(totalData))).join(", ")} </strong> 
            elemen untuk menghasilkan grafik pertumbuhan kompleksitas yang komprehensif.
          </div>
        )}

        <button
          type="submit"
          disabled={!hasData || isAnalyzing}
          className="w-full py-3.5 px-4 bg-blue-800 hover:bg-blue-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-semibold rounded-xl text-sm transition-all duration-150 flex items-center justify-center gap-2 shadow-xs cursor-pointer"
          id="btn-run-analysis"
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Sedang Menganalisis...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Jalankan Analisis Kompleksitas</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
