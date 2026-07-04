/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { motion } from "motion/react";
import { UploadCloud, FileSpreadsheet, CheckCircle, AlertCircle, FileCode } from "lucide-react";
import { parseLaptopCSV } from "../utils/csvParser";
import { Laptop } from "../types";

interface CsvUploadZoneProps {
  onDataLoaded: (laptops: Laptop[], fileName: string, fileSizeStr: string) => void;
}

// 20 Baris Data Laptop Contoh untuk keperluan demo instan
const SAMPLE_CSV_DATA = `Company,Product,TypeName,Inches,ScreenResolution,Cpu,Ram,Memory,Gpu,OpSys,Weight,Price_euros
Apple,MacBook Pro,Ultrabook,13.3,IPS Panel Retina Display 2560x1600,Intel Core i5 2.3GHz,8GB,128GB SSD,Intel Iris Plus Graphics 640,macOS,1.37kg,1339.69
Apple,Macbook Air,Ultrabook,13.3,1440x900,Intel Core i5 1.8GHz,8GB,128GB Flash Storage,Intel HD Graphics 6000,macOS,1.34kg,898.94
HP,250 G6,Notebook,15.6,1366x768,Intel Core i3 6006U 2GHz,8GB,256GB SSD,Intel HD Graphics 520,No OS,1.86kg,575.00
Apple,MacBook Pro,Ultrabook,15.4,IPS Panel Retina Display 2880x1800,Intel Core i7 2.7GHz,16GB,512GB SSD,AMD Radeon Pro 455,macOS,1.83kg,2537.45
Apple,MacBook Pro,Ultrabook,13.3,IPS Panel Retina Display 2560x1600,Intel Core i5 3.1GHz,8GB,256GB SSD,Intel Iris Plus Graphics 650,macOS,1.37kg,1803.60
Acer,Aspire 3,Notebook,15.6,1366x768,AMD A9-Series 9420 3GHz,4GB,500GB HDD,AMD Radeon R5,Windows 10,2.1kg,400.00
Apple,MacBook Pro,Ultrabook,15.4,IPS Panel Retina Display 2880x1800,Intel Core i7 2.2GHz,16GB,256GB Flash Storage,Intel Iris Pro Graphics,Mac OS X,2.04kg,2139.97
Apple,Macbook Air,Ultrabook,13.3,1440x900,Intel Core i5 1.8GHz,8GB,256GB Flash Storage,Intel HD Graphics 6000,macOS,1.34kg,1158.70
Asus,ZenBook UX430UN,Ultrabook,14.0,Full HD 1920x1080,Intel Core i7 8550U 1.8GHz,16GB,512GB SSD,NVIDIA GeForce MX150,Windows 10,1.12kg,1495.00
Acer,Swift 3,Ultrabook,14.0,IPS Panel Full HD 1920x1080,Intel Core i5 8250U 1.6GHz,8GB,256GB SSD,Intel UHD Graphics 620,Windows 10,1.6kg,770.00
HP,250 G6,Notebook,15.6,1366x768,Intel Core i5 7200U 2.5GHz,4GB,500GB HDD,Intel HD Graphics 620,No OS,1.86kg,393.90
HP,250 G6,Notebook,15.6,1366x768,Intel Core i3 6006U 2GHz,4GB,500GB HDD,Intel HD Graphics 520,Windows 10,1.86kg,344.99
Apple,MacBook Pro,Ultrabook,15.4,IPS Panel Retina Display 2880x1800,Intel Core i7 2.9GHz,16GB,512GB SSD,AMD Radeon Pro 560,macOS,1.83kg,2439.97
Dell,Inspiron 3567,Notebook,15.6,1366x768,Intel Core i3 6006U 2GHz,4GB,1TB HDD,AMD Radeon R5 M430,Windows 10,2.3kg,498.90
Apple,MacBook 12,Ultrabook,12.0,IPS Panel Retina Display 2304x1440,Intel Core M m3 1.2GHz,8GB,256GB Flash Storage,Intel HD Graphics 615,macOS,0.92kg,1261.88
Apple,MacBook Pro,Ultrabook,13.3,IPS Panel Retina Display 2560x1600,Intel Core i5 2.3GHz,8GB,256GB SSD,Intel Iris Plus Graphics 640,macOS,1.37kg,1517.90
Dell,Inspiron 3567,Notebook,15.6,1366x768,Intel Core i7 7500U 2.7GHz,8GB,256GB SSD,AMD Radeon R5 M430,Windows 10,2.3kg,745.00
Apple,MacBook Pro,Ultrabook,15.4,IPS Panel Retina Display 2880x1800,Intel Core i7 2.9GHz,16GB,512GB SSD,AMD Radeon Pro 560,macOS,1.83kg,2858.00
Lenovo,IdeaPad 320-15IKB,Notebook,15.6,Full HD 1920x1080,Intel Core i3 7130U 2.7GHz,4GB,1TB HDD,NVIDIA GeForce 940MX,Windows 10,2.2kg,499.00
Dell,Inspiron 3567,Notebook,15.6,1366x768,Intel Core i5 7200U 2.5GHz,8GB,1TB HDD,AMD Radeon R5 M430,Windows 10,2.3kg,499.00
Asus,Vivobook E200HA,Netbook,11.6,1366x768,Intel Atom x5-Z8350 1.44GHz,2GB,32GB Flash Storage,Intel HD Graphics,Windows 10,0.98kg,191.90
Lenovo,Legion Y520-15IKBN,Gaming,15.6,IPS Panel Full HD 1920x1080,Intel Core i5 7300HQ 2.5GHz,8GB,128GB SSD +  1TB HDD,NVIDIA GeForce GTX 1050,Windows 10,2.4kg,999.00
HP,255 G6,Notebook,15.6,1366x768,AMD A6-Series 9220 2.5GHz,4GB,500GB HDD,AMD Radeon R4 Graphics,No OS,1.86kg,258.00
Dell,Inspiron 5379,2 in 1 Convertible,13.3,IPS Panel Full HD / Touchscreen 1920x1080,Intel Core i7 8550U 1.8GHz,8GB,256GB SSD,Intel UHD Graphics 620,Windows 10,1.62kg,1099.00
Lenovo,IdeaPad 320-15IAP,Notebook,15.6,1366x768,Intel Celeron N3350 1.1GHz,4GB,1TB HDD,Intel HD Graphics 500,Windows 10,2.2kg,309.00
Dell,Inspiron 3567,Notebook,15.6,1366x768,Intel Core i3 6006U 2GHz,4GB,1TB HDD,Intel HD Graphics 520,Windows 10,2.3kg,463.00
Apple,Macbook Air,Ultrabook,13.3,1440x900,Intel Core i5 1.6GHz,8GB,128GB Flash Storage,Intel HD Graphics 6000,Mac OS X,1.35kg,1099.00
Asus,Rog GL553VD-FY124T,Gaming,15.6,Full HD 1920x1080,Intel Core i7 7700HQ 2.8GHz,8GB,128GB SSD +  1TB HDD,NVIDIA GeForce GTX 1050,Windows 10,2.5kg,1299.00
Dell,Inspiron 5570,Notebook,15.6,Full HD 1920x1080,Intel Core i7 8550U 1.8GHz,8GB,256GB SSD +  1TB HDD,AMD Radeon 530,Windows 10,2.2kg,974.50
HP,ProBook 470,Notebook,17.3,Full HD 1920x1080,Intel Core i5 8250U 1.6GHz,8GB,1TB HDD,NVIDIA GeForce 930MX,Windows 10,2.5kg,896.00
Lenovo,IdeaPad 320-15ISK,Notebook,15.6,1366x768,Intel Core i3 6006U 2GHz,4GB,1TB HDD,NVIDIA GeForce 920MX,Windows 10,2.2kg,419.00
Dell,Inspiron 3567,Notebook,15.6,1366x768,Intel Core i3 6006U 2GHz,4GB,1TB HDD,AMD Radeon R5 M430,Windows 10,2.3kg,449.00
Acer,Aspire 3,Notebook,15.6,1366x768,AMD A12-Series 9720P 2.7GHz,8GB,1TB HDD,AMD Radeon RX 540,Windows 10,2.1kg,449.00
Dell,Inspiron 5379,2 in 1 Convertible,13.3,IPS Panel Full HD / Touchscreen 1920x1080,Intel Core i5 8250U 1.6GHz,8GB,256GB SSD,Intel UHD Graphics 620,Windows 10,1.62kg,813.00
HP,Notebook 15-BS101nv,Notebook,15.6,Full HD 1920x1080,Intel Core i7 8550U 1.8GHz,8GB,256GB SSD,AMD Radeon 520,Windows 10,1.86kg,719.00
Asus,X541UA-DM1897,Notebook,15.6,Full HD 1920x1080,Intel Core i3 6006U 2.0GHz,4GB,256GB SSD,Intel HD Graphics 520,No OS,2kg,389.00
HP,250 G6,Notebook,15.6,1366x768,Intel Core i3 6006U 2GHz,4GB,1TB HDD,Intel HD Graphics 520,No OS,1.86kg,367.00
Dell,Inspiron 5770,Notebook,17.3,IPS Panel Full HD 1920x1080,Intel Core i5 8250U 1.6GHz,8GB,128GB SSD +  1TB HDD,AMD Radeon 530,Windows 10,2.8kg,979.00
HP,250 G6,Notebook,15.6,1366x768,Intel Core i3 7100U 2.4GHz,4GB,1TB HDD,Intel HD Graphics 620,Windows 10,1.86kg,439.00
HP,ProBook 450,Notebook,15.6,Full HD 1920x1080,Intel Core i5 8250U 1.6GHz,8GB,256GB SSD,Intel UHD Graphics 620,Windows 10,2.1kg,879.00
Asus,X541UA-DM1897,Notebook,15.6,Full HD 1920x1080,Intel Core i3 6006U 2GHz,4GB,256GB SSD,Intel HD Graphics 520,No OS,2kg,389.00
Dell,Inspiron 5379,2 in 1 Convertible,13.3,IPS Panel Full HD / Touchscreen 1920x1080,Intel Core i7 8550U 1.8GHz,8GB,256GB SSD,Intel UHD Graphics 620,Windows 10,1.62kg,979.00
Asus,X542UQ-DM117,Notebook,15.6,Full HD 1920x1080,Intel Core i5 7200U 2.5GHz,8GB,256GB SSD,NVIDIA GeForce 940MX,Linux,2.3kg,522.99
Acer,Aspire A515-51G,Notebook,15.6,IPS Panel Full HD 1920x1080,Intel Core i5 8250U 1.6GHz,8GB,256GB SSD,NVIDIA GeForce MX150,Windows 10,2.2kg,682.00
Dell,Inspiron 7773,2 in 1 Convertible,17.3,IPS Panel Full HD / Touchscreen 1920x1080,Intel Core i7 8550U 1.8GHz,12GB,512GB SSD,NVIDIA GeForce 150MX,Windows 10,2.77kg,1399.00
Apple,MacBook Pro,Ultrabook,13.3,IPS Panel Retina Display 2560x1600,Intel Core i5 2.0GHz,8GB,256GB SSD,Intel Iris Graphics 540,macOS,1.37kg,1419.00
Lenovo,IdeaPad 320-15ISK,Notebook,15.6,1366x768,Intel Core i3 6006U 2GHz,4GB,1TB HDD,Intel HD Graphics 520,No OS,2.2kg,369.00
Asus,Rog Strix,Gaming,17.3,Full HD 1920x1080,Intel Core i7 7700HQ 2.8GHz,8GB,256GB SSD +  1TB HDD,NVIDIA GeForce GTX 1050,Windows 10,2.73kg,1299.00
Dell,Inspiron 3567,Notebook,15.6,1366x768,Intel Core i5 7200U 2.5GHz,8GB,256GB SSD,AMD Radeon R5 M430,Windows 10,2.3kg,639.00
Asus,X541S,Notebook,15.6,1366x768,Intel Celeron N3060 1.6GHz,4GB,1TB HDD,Intel HD Graphics 400,Windows 10,2kg,244.00
` + Array(300).fill(0).map((_, i) => {
  // Tambahkan data sintetik bervariasi dalam jumlah banyak untuk pengujian skala besar (>1.000 data)
  const brands = ["Lenovo", "Dell", "HP", "Asus", "Acer", "MSI", "Apple", "Toshiba"];
  const types = ["Notebook", "Ultrabook", "Gaming", "Netbook", "Workstation"];
  const brand = brands[i % brands.length];
  const type = types[i % types.length];
  const price = Math.round(199 + (i * 7.5) + Math.sin(i) * 50);
  return `${brand},Laptop Model-${100 + i},${type},15.6,Full HD 1920x1080,Intel Core i5,8GB,256GB SSD,Intel HD Graphics,Windows 10,2.1kg,${price}`;
}).join("\n");

export default function CsvUploadZone({ onDataLoaded }: CsvUploadZoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: string; count: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setErrorMsg("Format file salah. Harap unggah file dengan format .csv!");
      setFileMeta(null);
      return;
    }

    setErrorMsg(null);
    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` 
      : `${(file.size / 1024).toFixed(2)} KB`;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = parseLaptopCSV(text);
        
        if (parsed.length === 0) {
          setErrorMsg("Gagal mengurai file CSV. Pastikan format tabel memiliki kolom Company, Product, dan Price_euros.");
          setFileMeta(null);
          return;
        }

        setFileMeta({
          name: file.name,
          size: sizeStr,
          count: parsed.length,
        });

        onDataLoaded(parsed, file.name, sizeStr);
      } catch (err: any) {
        setErrorMsg(`Gagal memproses file: ${err.message}`);
        setFileMeta(null);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileBrowser = () => {
    fileInputRef.current?.click();
  };

  const loadSampleDataset = () => {
    setErrorMsg(null);
    try {
      const parsed = parseLaptopCSV(SAMPLE_CSV_DATA);
      const sizeStr = `${(SAMPLE_CSV_DATA.length / 1024).toFixed(2)} KB`;
      
      setFileMeta({
        name: "laptop_price_dataset_demo.csv",
        size: sizeStr,
        count: parsed.length,
      });

      onDataLoaded(parsed, "laptop_price_dataset_demo.csv", sizeStr);
    } catch (err: any) {
      setErrorMsg(`Gagal memuat dataset demo: ${err.message}`);
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-6" id="upload-zone-container">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h2 className="text-lg font-bold font-display text-slate-800 flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-800" />
            Unggah Dataset Laptop (.csv)
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed max-w-lg mt-1">
            Gunakan file CSV Anda sendiri yang memiliki minimal kolom <span className="font-mono text-blue-700 bg-blue-50 px-1 py-0.5 rounded">Company</span>, <span className="font-mono text-blue-700 bg-blue-50 px-1 py-0.5 rounded">Product</span>, dan <span className="font-mono text-blue-700 bg-blue-50 px-1 py-0.5 rounded">Price_euros</span>.
          </p>
        </div>
        
        <button
          onClick={loadSampleDataset}
          type="button"
          className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all self-start md:self-center font-mono cursor-pointer"
          id="btn-load-sample"
        >
          <FileCode className="w-4 h-4 text-slate-500" />
          MUAT DATASET LAPTOP DEFAULT
        </button>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={triggerFileBrowser}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer flex flex-col items-center justify-center gap-3 transition-all duration-200 ${
          dragActive 
            ? "border-blue-600 bg-blue-50/50" 
            : "border-slate-200 hover:border-slate-300 bg-slate-50/20"
        }`}
        id="drag-and-drop-area"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="csv-file-input"
        />

        <div className="p-4 bg-blue-50 text-blue-700 rounded-full">
          <UploadCloud className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700">
            Seret & letakkan file CSV Anda di sini, atau <span className="text-blue-600 hover:underline">pilih file</span>
          </p>
          <p className="text-xs text-slate-400">
            Hanya file spreadsheet .csv yang didukung (Maks. 10 MB)
          </p>
        </div>
      </div>

      {errorMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-3 text-rose-800 text-xs"
          id="upload-error-alert"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-rose-600" />
          <div>
            <span className="font-semibold">Kesalahan Parsing:</span> {errorMsg}
          </div>
        </motion.div>
      )}

      {fileMeta && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
          id="upload-success-badge"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg flex-shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="text-xs font-semibold font-mono text-slate-400">DATASET AKTIF</h4>
              <p className="text-sm font-semibold text-slate-800 truncate max-w-sm md:max-w-md">{fileMeta.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-xs font-mono">
            <div>
              <span className="text-slate-400 block text-[10px]">UKURAN FILE</span>
              <span className="font-bold text-slate-700">{fileMeta.size}</span>
            </div>
            <div className="border-l border-emerald-200/50 pl-6">
              <span className="text-slate-400 block text-[10px]">TOTAL RECORD</span>
              <span className="font-bold text-slate-700">{fileMeta.count.toLocaleString("id-ID")} Laptop</span>
            </div>
            <div className="border-l border-emerald-200/50 pl-6">
              <span className="text-slate-400 block text-[10px]">STATUS</span>
              <span className="font-bold text-emerald-700 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                READY
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
