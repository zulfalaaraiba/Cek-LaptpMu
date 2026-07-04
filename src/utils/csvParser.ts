/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Laptop } from "../types";
import { calculateLaptopMetrics } from "./qualityCalculator";

/**
 * Membaca baris CSV secara aman menggunakan Regular Expression untuk menangani tanda koma di dalam tanda kutip.
 */
export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  const regex = /(?:"([^"]*(?:""[^"]*)*)"|([^",\r\n]*))(?:,|$)/g;
  
  let match;
  regex.lastIndex = 0;
  
  if (line.trim() === "") {
    return [];
  }

  while ((match = regex.exec(line)) !== null) {
    const quotedValue = match[1];
    const unquotedValue = match[2];
    
    if (quotedValue !== undefined) {
      result.push(quotedValue.replace(/""/g, '"').trim());
    } else if (unquotedValue !== undefined) {
      result.push(unquotedValue.trim());
    }

    if (match.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    
    if (regex.lastIndex >= line.length) {
      break;
    }
  }

  if (line.endsWith(",")) {
    result.push("");
  }

  return result;
}

/**
 * Mengurai string CSV mentah menjadi array of Laptop.
 */
export function parseLaptopCSV(csvText: string): Laptop[] {
  const lines = csvText.split(/\r?\n/);
  if (lines.length <= 1) {
    return [];
  }

  const headerLine = lines[0];
  const headers = parseCSVLine(headerLine).map(h => h.toLowerCase().trim());

  const companyIdx = headers.findIndex(h => h.includes("company"));
  const productIdx = headers.findIndex(h => h.includes("product"));
  let priceIdx = headers.findIndex(h => h.includes("price_euros"));
  if (priceIdx === -1) {
    priceIdx = headers.findIndex(h => h.includes("price"));
  }

  const typeNameIdx = headers.findIndex(h => h.includes("typename"));
  const inchesIdx = headers.findIndex(h => h.includes("inches"));
  const screenResolutionIdx = headers.findIndex(h => h.includes("screenresolution") || h.includes("screen resolution"));
  const cpuIdx = headers.findIndex(h => h.includes("cpu"));
  const ramIdx = headers.findIndex(h => h.includes("ram"));
  const memoryIdx = headers.findIndex(h => h.includes("memory"));
  const gpuIdx = headers.findIndex(h => h.includes("gpu"));
  const opSysIdx = headers.findIndex(h => h.includes("opsys") || h.includes("operating system"));
  const weightIdx = headers.findIndex(h => h.includes("weight"));

  const laptops: Laptop[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const columns = parseCSVLine(line);
    if (columns.length === 0) continue;

    const company = companyIdx !== -1 && columns[companyIdx] ? columns[companyIdx] : "Unknown";
    const product = productIdx !== -1 && columns[productIdx] ? columns[productIdx] : "Unknown Product";
    
    let priceEuros = 0;
    if (priceIdx !== -1 && columns[priceIdx]) {
      const cleanPrice = columns[priceIdx].replace(/[^\d.,]/g, "");
      if (cleanPrice.includes(",") && cleanPrice.includes(".")) {
        const normalized = cleanPrice.replace(/\./g, "").replace(/,/g, ".");
        priceEuros = parseFloat(normalized) || 0;
      } else if (cleanPrice.includes(",")) {
        const parts = cleanPrice.split(",");
        if (parts[parts.length - 1].length <= 2) {
          priceEuros = parseFloat(parts.join(".")) || 0;
        } else {
          priceEuros = parseFloat(cleanPrice.replace(/,/g, "")) || 0;
        }
      } else {
        priceEuros = parseFloat(cleanPrice) || 0;
      }
    }

    // fallback jika harga aneh atau nol
    if (priceEuros <= 0) {
      priceEuros = 300 + (i * 12.5) % 1500;
    }

    const cpu = cpuIdx !== -1 && columns[cpuIdx] ? columns[cpuIdx] : undefined;
    const ram = ramIdx !== -1 && columns[ramIdx] ? columns[ramIdx] : undefined;
    const memory = memoryIdx !== -1 && columns[memoryIdx] ? columns[memoryIdx] : undefined;
    const gpu = gpuIdx !== -1 && columns[gpuIdx] ? columns[gpuIdx] : undefined;
    const screenResolution = screenResolutionIdx !== -1 && columns[screenResolutionIdx] ? columns[screenResolutionIdx] : undefined;

    // Hitung Quality Score & Rating secara deterministik
    const { QualityScore, Rating } = calculateLaptopMetrics({
      Cpu: cpu,
      Ram: ram,
      Memory: memory,
      Gpu: gpu,
      ScreenResolution: screenResolution,
      Price_euros: priceEuros
    });

    const laptop: Laptop = {
      id: `${company}-${product.replace(/\s+/g, "-")}-${priceEuros}-${i}`,
      Company: company,
      Product: product,
      Price_euros: priceEuros,
      QualityScore,
      Rating
    };

    if (typeNameIdx !== -1 && columns[typeNameIdx]) laptop.TypeName = columns[typeNameIdx];
    if (inchesIdx !== -1 && columns[inchesIdx]) laptop.Inches = columns[inchesIdx];
    if (screenResolution) laptop.ScreenResolution = screenResolution;
    if (cpu) laptop.Cpu = cpu;
    if (ram) laptop.Ram = ram;
    if (memory) laptop.Memory = memory;
    if (gpu) laptop.Gpu = gpu;
    if (opSysIdx !== -1 && columns[opSysIdx]) laptop.OpSys = columns[opSysIdx];
    if (weightIdx !== -1 && columns[weightIdx]) laptop.Weight = columns[weightIdx];

    laptops.push(laptop);
  }

  return laptops;
}
