/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Laptop } from "../types";
import { Table, Check } from "lucide-react";

interface LaptopTableProps {
  laptops: Laptop[];
  isSorted: boolean;
}

export default function LaptopTable({ laptops, isSorted }: LaptopTableProps) {
  if (laptops.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-100 text-slate-400 text-sm font-mono shadow-sm">
        BELUM ADA DATA LAPTOP YANG DIMUAT
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden space-y-4" id="laptop-data-table-container">
      {/* Header Tabel */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800 font-display flex items-center gap-2 text-base md:text-lg">
            <Table className="w-5 h-5 text-blue-900" />
            Tabel Komparasi Spesifikasi Laptop
          </h3>
          <p className="text-xs text-slate-400">
            Daftar lengkap seluruh laptop beserta kalkulasi parameter kualitas dan harga.
          </p>
        </div>

        {/* Status Terurut */}
        <div>
          <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border flex items-center gap-1 ${
            isSorted 
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-amber-50 text-amber-800 border-amber-200"
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isSorted ? "bg-emerald-500" : "bg-amber-500"}`}></span>
            {isSorted ? "DATA SUDAH TERURUT (MERGE SORT)" : "DATA ACAK (BELUM TERURUT)"}
          </span>
        </div>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs md:text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-mono font-bold uppercase tracking-wider">
              <th className="py-3.5 px-6">No</th>
              <th className="py-3.5 px-4">Brand</th>
              <th className="py-3.5 px-4">Model/Tipe</th>
              <th className="py-3.5 px-4 text-right">Price</th>
              <th className="py-3.5 px-4 text-center">Quality Score</th>
              <th className="py-3.5 px-4 text-center">Rating</th>
              <th className="py-3.5 px-4 text-center">RAM</th>
              <th className="py-3.5 px-4">Storage</th>
              <th className="py-3.5 px-4">Processor</th>
              <th className="py-3.5 px-4">GPU</th>
              <th className="py-3.5 px-6 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-slate-600">
            {laptops.map((laptop, idx) => (
              <tr 
                key={laptop.id} 
                className="hover:bg-slate-50/50 transition-colors font-mono"
                id={`table-row-${idx}`}
              >
                <td className="py-3 px-6 font-bold text-slate-400">{idx + 1}</td>
                <td className="py-3 px-4 font-bold text-slate-900">{laptop.Company}</td>
                <td className="py-3 px-4 font-sans font-semibold text-slate-700 max-w-[180px] truncate" title={laptop.Product}>
                  {laptop.Product}
                </td>
                <td className="py-3 px-4 text-right font-bold text-blue-900">
                  €{laptop.Price_euros.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-2 py-0.5 rounded-md text-xs font-bold font-mono ${
                    laptop.QualityScore >= 80 
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-100" 
                      : laptop.QualityScore >= 60 
                        ? "bg-blue-50 text-blue-800 border border-blue-100" 
                        : "bg-amber-50 text-amber-800 border border-amber-100"
                  }`}>
                    {laptop.QualityScore}
                  </span>
                </td>
                <td className="py-3 px-4 text-center font-bold text-amber-600">
                  ★ {laptop.Rating.toFixed(1)}
                </td>
                <td className="py-3 px-4 text-center">{laptop.Ram || "8GB"}</td>
                <td className="py-3 px-4 font-sans text-xs text-slate-500 max-w-[120px] truncate" title={laptop.Memory}>
                  {laptop.Memory || "256GB SSD"}
                </td>
                <td className="py-3 px-4 font-sans text-xs text-slate-500 max-w-[150px] truncate" title={laptop.Cpu}>
                  {laptop.Cpu || "Intel Core i5"}
                </td>
                <td className="py-3 px-4 font-sans text-xs text-slate-500 max-w-[150px] truncate" title={laptop.Gpu}>
                  {laptop.Gpu || "Intel UHD"}
                </td>
                <td className="py-3 px-6 text-center">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isSorted 
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    {isSorted ? (
                      <>
                        <Check className="w-3 h-3" />
                        Sorted
                      </>
                    ) : (
                      "Raw"
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Info Jumlah Data */}
      <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
        <span>TOTAL DATA TABEL:</span>
        <span className="font-bold text-slate-700">{laptops.length} LAPTOP</span>
      </div>
    </div>
  );
}
