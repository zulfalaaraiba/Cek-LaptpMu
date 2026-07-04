/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { SalesData } from "../types";
import { BarChart3, Filter } from "lucide-react";

interface LaptopSalesChartProps {
  salesData: SalesData[];
}

export default function LaptopSalesChart({ salesData }: LaptopSalesChartProps) {
  const [selectedBrand, setSelectedBrand] = useState<string>("Semua");

  if (salesData.length === 0) {
    return (
      <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-sm font-mono">
        DATA PENJUALAN TIDAK TERSEDIA ATAU BELUM DIMUAT
      </div>
    );
  }

  // Dapatkan semua brand unik untuk dropdown filter
  const brands = ["Semua", ...Array.from(new Set(salesData.map((s) => s.Brand)))];

  // Filter data berdasarkan brand pilihan
  const filteredData = selectedBrand === "Semua"
    ? salesData
    : salesData.filter((s) => s.Brand === selectedBrand);

  return (
    <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6" id="laptop-sales-chart-panel">
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-900" />
            <h3 className="font-bold text-slate-800 font-display">
              Analisis Tren Penjualan Laptop di Indonesia
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Perbandingan total unit penjualan: Tahun Sebelumnya vs Tahun Berjalan
          </p>
        </div>

        {/* Dropdown Filter Merek */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-mono font-bold text-slate-500">FILTER MEREK:</span>
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none transition-colors"
          >
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bar Chart Recharts */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredData}
            margin={{ top: 10, right: 20, left: -10, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="Brand"
              tick={{ fill: "#64748b", fontSize: 11, fontFamily: "sans-serif", fontWeight: 600 }}
              stroke="#cbd5e1"
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 11, fontFamily: "monospace" }}
              stroke="#cbd5e1"
              label={{
                value: "Unit Terjual",
                angle: -90,
                position: "insideLeft",
                offset: 0,
                style: { fill: "#64748b", fontSize: 11, fontWeight: 500 },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                fontSize: "12px",
              }}
              labelStyle={{ fontWeight: "bold", color: "#1e293b" }}
            />
            <Legend verticalAlign="top" height={36} iconType="rect" />
            <Bar
              name="Tahun Sebelumnya"
              dataKey="TahunSebelumnya"
              fill="#2b6cb0" // Secondary
              radius={[4, 4, 0, 0]}
            />
            <Bar
              name="Tahun Berjalan"
              dataKey="TahunBerjalan"
              fill="#1a365d" // Primary
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Info tambahan */}
      <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between text-xs text-slate-500 font-mono">
        <span className="font-semibold text-slate-400">SUMBER DATA:</span>
        <span className="font-bold text-slate-700 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
          sales_data.csv (Simulasi Valid)
        </span>
      </div>
    </div>
  );
}
