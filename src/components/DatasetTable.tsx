/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, Laptop as LaptopIcon, RefreshCw } from "lucide-react";
import { Laptop } from "../types";

interface DatasetTableProps {
  laptops: Laptop[];
}

export default function DatasetTable({ laptops }: DatasetTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter laptop berdasarkan pencarian
  const filteredLaptops = useMemo(() => {
    if (!searchTerm.trim()) {
      return laptops;
    }
    const lowerSearch = searchTerm.toLowerCase();
    return laptops.filter(
      (laptop) =>
        laptop.Company.toLowerCase().includes(lowerSearch) ||
        laptop.Product.toLowerCase().includes(lowerSearch) ||
        (laptop.TypeName && laptop.TypeName.toLowerCase().includes(lowerSearch))
    );
  }, [laptops, searchTerm]);

  // Reset page ke 1 saat pencarian berubah
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Perhitungan pagination
  const totalItems = filteredLaptops.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  
  const paginatedLaptops = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredLaptops.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredLaptops, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (laptops.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4" id="dataset-table-container">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-800 flex items-center gap-2">
            <LaptopIcon className="w-5 h-5 text-blue-800" />
            Dataset Laptop Terurut (Hasil Merge Sort)
          </h2>
          <p className="text-xs text-slate-400">
            Seluruh data laptop di bawah ini telah diurutkan berdasarkan harga (Price_euros) terendah secara stabil
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Kolom Pencarian */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari merk, produk, atau tipe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-700 outline-none w-full sm:w-64 transition-all"
              id="dataset-search-input"
            />
          </div>

          {/* Pengatur Jumlah Baris */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">TAMPILKAN:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 outline-none"
              id="rows-per-page-select"
            >
              <option value={10}>10 Baris</option>
              <option value={25}>25 Baris</option>
              <option value={50}>50 Baris</option>
              <option value={100}>100 Baris</option>
            </select>
          </div>
        </div>
      </div>

      {/* Kontainer Tabel */}
      <div className="overflow-x-auto border border-slate-100 rounded-xl relative max-h-120">
        <table className="w-full text-left border-collapse text-sm" id="laptop-dataset-table">
          <thead className="sticky top-0 z-10 bg-slate-100 shadow-xs">
            <tr className="font-display">
              <th className="py-3 px-4 font-semibold text-slate-700 text-xs text-center w-16">NO</th>
              <th className="py-3 px-4 font-semibold text-slate-700 text-xs">BRAND / COMPANY</th>
              <th className="py-3 px-4 font-semibold text-slate-700 text-xs">PRODUCT NAME</th>
              <th className="py-3 px-4 font-semibold text-slate-700 text-xs">TYPE</th>
              <th className="py-3 px-4 font-semibold text-slate-700 text-xs">SPECIFICATIONS (RAM / CPU / SSD)</th>
              <th className="py-3 px-4 font-semibold text-slate-700 text-xs text-right">PRICE (EUROS)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginatedLaptops.length > 0 ? (
              paginatedLaptops.map((laptop, idx) => {
                const globalIdx = (currentPage - 1) * itemsPerPage + idx + 1;
                return (
                  <tr key={globalIdx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-400 text-xs">{globalIdx}</td>
                    <td className="py-3 px-4 font-bold text-slate-800 text-xs">{laptop.Company}</td>
                    <td className="py-3 px-4 text-slate-700 text-xs font-medium">{laptop.Product}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-slate-50 border border-slate-200/50 rounded text-slate-600 text-[10px] font-mono font-medium">
                        {laptop.TypeName || "Notebook"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 text-xs font-mono">
                      {[laptop.Ram, laptop.Cpu, laptop.Memory].filter(Boolean).join(" | ") || "-"}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-800 text-xs">
                      €{laptop.Price_euros.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400 font-mono text-xs">
                  TIDAK ADA DATA LAPTOP YANG COCOK DENGAN PENCARIAN
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2 border-t border-slate-100" id="table-pagination-controls">
        <div className="text-xs text-slate-500 font-mono">
          Menampilkan <span className="font-bold text-slate-800">{totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> sampai{" "}
          <span className="font-bold text-slate-800">{Math.min(currentPage * itemsPerPage, totalItems)}</span> dari{" "}
          <span className="font-bold text-slate-800">{totalItems.toLocaleString("id-ID")}</span> data laptop
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            id="btn-prev-page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1 font-mono text-xs font-bold text-slate-700">
            <span className="px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg text-blue-800">{currentPage}</span>
            <span className="text-slate-300">/</span>
            <span className="px-2 py-1">{totalPages}</span>
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-1.5 border border-slate-200 bg-white hover:bg-slate-50 rounded-lg text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            id="btn-next-page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
