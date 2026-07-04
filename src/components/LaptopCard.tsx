/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Laptop } from "../types";
import { Star, Shield, Cpu, HardDrive, Smartphone, Award, ExternalLink } from "lucide-react";
import { motion } from "motion/react";

interface LaptopCardProps {
  key?: string;
  laptop: Laptop;
  index: number;
}

export default function LaptopCard({ laptop, index }: LaptopCardProps) {
  // Map warna background gradasi stylish untuk placeholder gambar berdasarkan brand agar terlihat otentik dan premium
  const getBrandGradient = (brand: string) => {
    const b = brand.toLowerCase();
    if (b.includes("apple")) return "from-slate-700 to-slate-900";
    if (b.includes("asus") || b.includes("rog")) return "from-red-600 to-slate-900";
    if (b.includes("lenovo") || b.includes("thinkpad") || b.includes("legion")) return "from-blue-600 to-blue-950";
    if (b.includes("hp")) return "from-cyan-600 to-slate-900";
    if (b.includes("msi")) return "from-rose-700 to-black";
    if (b.includes("dell")) return "from-sky-500 to-indigo-900";
    if (b.includes("acer") || b.includes("predator")) return "from-emerald-600 to-slate-900";
    // Merek Indonesia / brand lainnya
    return "from-slate-500 to-slate-800";
  };

  // Mendapatkan gambar realistis Unsplash berdasarkan kategori dan merek laptop
  const getLaptopImage = (l: Laptop) => {
    const company = l.Company.toLowerCase();
    const product = l.Product.toLowerCase();
    const type = (l.TypeName || "").toLowerCase();

    // 1. Apple MacBook Series
    if (company.includes("apple") || product.includes("macbook")) {
      return "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&h=400&q=80";
    }

    // 2. Gaming Laptops (RGB, High Performance, heavy specs)
    if (
      type.includes("gaming") ||
      product.includes("rog") ||
      product.includes("tuf") ||
      product.includes("legion") ||
      product.includes("loq") ||
      product.includes("predator") ||
      product.includes("nitro") ||
      product.includes("katana") ||
      product.includes("stealth") ||
      product.includes("raider") ||
      product.includes("gf63") ||
      company.includes("msi") ||
      product.includes("g5") ||
      product.includes("helios")
    ) {
      return "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=600&h=400&q=80";
    }

    // 3. Ultrabook & Business Premium (Sleek, thin, aluminum body)
    if (
      type.includes("ultrabook") ||
      product.includes("zenbook") ||
      product.includes("thinkpad") ||
      product.includes("yoga") ||
      product.includes("swift") ||
      product.includes("elitebook") ||
      product.includes("xps") ||
      product.includes("matebook")
    ) {
      return "https://images.unsplash.com/photo-1496181130204-7552cc14f1d0?auto=format&fit=crop&w=600&h=400&q=80";
    }

    // 4. Everyday Workstation / Notebook (VivoBook, IdeaPad, Aspire, Pavilion, Hype, Soulmate, dll)
    return "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&h=400&q=80";
  };

  // Renderer rating bintang kuning
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />);
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <div key={i} className="relative">
            <Star className="w-3.5 h-3.5 text-slate-200" />
            <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
          </div>
        );
      } else {
        stars.push(<Star key={i} className="w-3.5 h-3.5 text-slate-200" />);
      }
    }
    return stars;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(20, index) * 0.03 }}
      className="bg-white border border-slate-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
      id={`laptop-card-${laptop.id}`}
    >
      {/* Gambar Laptop Realistis dari Unsplash sesuai tipe */}
      <div className="h-44 relative flex items-end p-4 overflow-hidden bg-slate-950">
        {/* Unsplash Cover Image */}
        <img
          src={getLaptopImage(laptop)}
          alt={laptop.Product}
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
        />
        
        {/* Dark Elegant Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-95"></div>

        {/* Grid lines overlay for high-tech branding */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:12px_12px] opacity-20"></div>

        {/* Display Teks/Icon Tengah */}
        <div className="relative w-full z-10">
          <p className="text-[9px] tracking-widest font-mono font-bold text-blue-300 uppercase leading-none mb-1">
            {laptop.TypeName || "LAPTOP CORE"}
          </p>
          <p className="text-sm font-bold font-display text-white truncate drop-shadow-xs">
            {laptop.Product}
          </p>
        </div>

        {/* Badge Quality Score Mengapung */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md border border-white/20 px-2 py-1 rounded-lg shadow-sm flex items-center gap-1.5 z-20">
          <Shield className="w-3.5 h-3.5 text-blue-900" />
          <div className="leading-none text-right">
            <span className="text-[8px] text-slate-400 block font-mono">QUALITY</span>
            <span className="text-xs font-bold text-blue-900 font-mono">{laptop.QualityScore}</span>
          </div>
        </div>

        {/* Badge Rating Bintang Kiri */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs px-2 py-1 rounded-md text-white flex items-center gap-1 z-20 text-[10px] font-bold font-mono">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          {laptop.Rating.toFixed(1)}
        </div>
      </div>

      {/* Konten Spesifikasi Card */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Company / Brand & Logo Merek */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-wider text-blue-900 font-mono bg-blue-50 px-2 py-0.5 rounded-full uppercase">
              {laptop.Company}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Inches: {laptop.Inches || '15.6"'}
            </span>
          </div>

          {/* Nama Laptop Utama */}
          <h3 className="font-bold text-slate-800 font-display text-sm md:text-base leading-snug group-hover:text-blue-900 transition-colors line-clamp-2" title={laptop.Product}>
            {laptop.Product}
          </h3>
        </div>

        {/* Spesifikasi Grid List */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono py-3 border-y border-slate-100 text-slate-500">
          <div className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate" title={laptop.Cpu}>{laptop.Cpu || "Core i5"}</span>
          </div>
          <div className="flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate" title={laptop.Ram}>{laptop.Ram || "8GB RAM"}</span>
          </div>
          <div className="flex items-center gap-1 col-span-2">
            <span className="text-[10px] bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded truncate w-full" title={laptop.Memory}>
              MEM: {laptop.Memory || "256GB SSD"}
            </span>
          </div>
          <div className="flex items-center gap-1 col-span-2">
            <span className="text-[10px] bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded truncate w-full" title={laptop.Gpu}>
              GPU: {laptop.Gpu || "Intel HD"}
            </span>
          </div>
        </div>

        {/* Harga & Rating Bar Progres */}
        <div className="space-y-3 pt-2">
          {/* Progress bar visual untuk Quality Score */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-400">
              <span>QUALITY SCORE</span>
              <span className="text-slate-600">{laptop.QualityScore} / 100</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${
                  laptop.QualityScore >= 80 
                    ? "bg-emerald-500" 
                    : laptop.QualityScore >= 60 
                      ? "bg-blue-600" 
                      : "bg-amber-500"
                }`}
                style={{ width: `${laptop.QualityScore}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {/* Harga Euro */}
            <div className="leading-none">
              <span className="text-[9px] text-slate-400 block font-mono font-bold">HARGA CONVERTED</span>
              <span className="text-lg font-black text-blue-900 font-mono tracking-tight">
                €{laptop.Price_euros.toLocaleString("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {/* Bintang Rating Mini */}
            <div className="flex items-center gap-0.5">
              {renderStars(laptop.Rating)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
