/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Menghitung Quality Score (0-100) dan Rating Bintang (1.0-5.0) secara otomatis dan realistis
 * berdasarkan spesifikasi laptop.
 */
export function calculateLaptopMetrics(laptop: {
  Cpu?: string;
  Ram?: string;
  Memory?: string;
  Gpu?: string;
  ScreenResolution?: string;
  Price_euros: number;
}) {
  const cpuStr = (laptop.Cpu || "").toLowerCase();
  const ramStr = (laptop.Ram || "").toLowerCase();
  const memStr = (laptop.Memory || "").toLowerCase();
  const gpuStr = (laptop.Gpu || "").toLowerCase();
  const screenStr = (laptop.ScreenResolution || "").toLowerCase();

  // 1. Processor (40%)
  let cpuScore = 50;
  if (cpuStr.includes("i9") || cpuStr.includes("ryzen 9") || cpuStr.includes("m1 pro") || cpuStr.includes("m1 max") || cpuStr.includes("m2 pro") || cpuStr.includes("m2 max") || cpuStr.includes("m3 pro") || cpuStr.includes("m3 max")) {
    cpuScore = 100;
  } else if (cpuStr.includes("i7") || cpuStr.includes("ryzen 7") || cpuStr.includes("m1") || cpuStr.includes("m2") || cpuStr.includes("m3")) {
    cpuScore = 90;
  } else if (cpuStr.includes("i5") || cpuStr.includes("ryzen 5")) {
    cpuScore = 75;
  } else if (cpuStr.includes("i3") || cpuStr.includes("ryzen 3")) {
    cpuScore = 60;
  } else if (cpuStr.includes("celeron") || cpuStr.includes("pentium") || cpuStr.includes("atom") || cpuStr.includes("a9") || cpuStr.includes("a6")) {
    cpuScore = 35;
  }

  // 2. RAM (20%)
  let ramScore = 30;
  const ramValue = parseInt(ramStr.replace(/[^\d]/g, "")) || 4;
  if (ramValue >= 32) {
    ramScore = 100;
  } else if (ramValue === 16) {
    ramScore = 85;
  } else if (ramValue === 12) {
    ramScore = 75;
  } else if (ramValue === 8) {
    ramScore = 65;
  } else if (ramValue === 4) {
    ramScore = 40;
  }

  // 3. Storage / Memory (15%)
  let memScore = 40;
  if (memStr.includes("ssd")) {
    if (memStr.includes("1tb") || memStr.includes("2tb") || memStr.includes("1024gb")) {
      memScore = 100;
    } else if (memStr.includes("512gb")) {
      memScore = 85;
    } else if (memStr.includes("256gb")) {
      memScore = 70;
    } else if (memStr.includes("128gb")) {
      memScore = 55;
    }
  } else if (memStr.includes("hdd")) {
    if (memStr.includes("1tb") || memStr.includes("2tb")) {
      memScore = 50;
    } else {
      memScore = 40;
    }
  } else if (memStr.includes("flash") || memStr.includes("emmc")) {
    memScore = 35;
  }

  // 4. GPU (15%)
  let gpuScore = 45;
  if (gpuStr.includes("rtx 40") || gpuStr.includes("rtx 30") || gpuStr.includes("radeon pro") || gpuStr.includes("gtx 1080") || gpuStr.includes("gtx 1070")) {
    gpuScore = 100;
  } else if (gpuStr.includes("gtx") || gpuStr.includes("mx150") || gpuStr.includes("mx130") || gpuStr.includes("iris xe") || gpuStr.includes("iris plus")) {
    gpuScore = 75;
  } else if (gpuStr.includes("hd graphics") || gpuStr.includes("uhd graphics") || gpuStr.includes("radeon r")) {
    gpuScore = 55;
  }

  // 5. Screen Resolution (10%)
  let screenScore = 45;
  if (screenStr.includes("3840x2160") || screenStr.includes("4k") || screenStr.includes("2880x1800") || screenStr.includes("retina")) {
    screenScore = 100;
  } else if (screenStr.includes("2560x1600") || screenStr.includes("2560x1440") || screenStr.includes("quad hd") || screenStr.includes("qhd")) {
    screenScore = 85;
  } else if (screenStr.includes("1920x1080") || screenStr.includes("full hd") || screenStr.includes("fhd")) {
    screenScore = 70;
  } else if (screenStr.includes("1366x768") || screenStr.includes("1440x900")) {
    screenScore = 50;
  }

  // Hitung Skor Kualitas Terbobot
  const qualityScore = Math.round(
    (cpuScore * 0.4) +
    (ramScore * 0.2) +
    (memScore * 0.15) +
    (gpuScore * 0.15) +
    (screenScore * 0.1)
  );

  // Batasi agar berada dalam rentang 10–100
  const finalQualityScore = Math.max(15, Math.min(100, qualityScore));

  // Rating Bintang (deterministik berdasarkan quality score + sedikit bobot harga, berkisar 3.2 s.d 5.0)
  const priceBonus = Math.min(0.5, laptop.Price_euros / 5000);
  const rawRating = (finalQualityScore / 20) + priceBonus;
  const rating = parseFloat(Math.max(3.0, Math.min(5.0, rawRating)).toFixed(1));

  return {
    QualityScore: finalQualityScore,
    Rating: rating,
  };
}
