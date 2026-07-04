/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Laptop } from "../types";
import { calculateLaptopMetrics } from "../utils/qualityCalculator";

const rawDefaultLaptops = [
  // ASUS
  { Company: "ASUS", Product: "ROG Strix G16", Price_euros: 1899, TypeName: "Gaming", Inches: "16.0", ScreenResolution: "2560x1600 QHD", Cpu: "Intel Core i9-13980HX", Ram: "32GB", Memory: "1TB SSD", Gpu: "NVIDIA GeForce RTX 4070" },
  { Company: "ASUS", Product: "TUF Gaming A15", Price_euros: 1199, TypeName: "Gaming", Inches: "15.6", ScreenResolution: "1920x1080 FHD", Cpu: "AMD Ryzen 7 7735HS", Ram: "16GB", Memory: "512GB SSD", Gpu: "NVIDIA GeForce RTX 4060" },
  { Company: "ASUS", Product: "ZenBook 14 OLED", Price_euros: 1299, TypeName: "Ultrabook", Inches: "14.0", ScreenResolution: "2880x1800 Retina", Cpu: "Intel Core i7-1360P", Ram: "16GB", Memory: "1TB SSD", Gpu: "Intel Iris Xe" },
  { Company: "ASUS", Product: "VivoBook Go 14", Price_euros: 450, TypeName: "Notebook", Inches: "14.0", ScreenResolution: "1920x1080 FHD", Cpu: "AMD Ryzen 3 7320U", Ram: "8GB", Memory: "256GB SSD", Gpu: "AMD Radeon Graphics" },
  { Company: "ASUS", Product: "ExpertBook B1", Price_euros: 749, TypeName: "Notebook", Inches: "14.0", ScreenResolution: "1920x1080 FHD", Cpu: "Intel Core i5-1235U", Ram: "8GB", Memory: "512GB SSD", Gpu: "Intel UHD Graphics" },

  // Lenovo
  { Company: "Lenovo", Product: "ThinkPad X1 Carbon Gen 11", Price_euros: 2199, TypeName: "Ultrabook", Inches: "14.0", ScreenResolution: "2880x1800 Retina", Cpu: "Intel Core i7-1365U", Ram: "32GB", Memory: "1TB SSD", Gpu: "Intel Iris Xe" },
  { Company: "Lenovo", Product: "IdeaPad Slim 3", Price_euros: 549, TypeName: "Notebook", Inches: "15.6", ScreenResolution: "1920x1080 FHD", Cpu: "AMD Ryzen 5 7520U", Ram: "8GB", Memory: "512GB SSD", Gpu: "AMD Radeon Graphics" },
  { Company: "Lenovo", Product: "Legion Pro 5i", Price_euros: 1699, TypeName: "Gaming", Inches: "16.0", ScreenResolution: "2560x1600 QHD", Cpu: "Intel Core i7-13700HX", Ram: "16GB", Memory: "1TB SSD", Gpu: "NVIDIA GeForce RTX 4060" },
  { Company: "Lenovo", Product: "Yoga Slim 7 Carbon", Price_euros: 1450, TypeName: "Ultrabook", Inches: "13.3", ScreenResolution: "2560x1600 QHD", Cpu: "AMD Ryzen 7 5800U", Ram: "16GB", Memory: "1TB SSD", Gpu: "AMD Radeon Graphics" },
  { Company: "Lenovo", Product: "LOQ 15IRH8", Price_euros: 999, TypeName: "Gaming", Inches: "15.6", ScreenResolution: "1920x1080 FHD", Cpu: "Intel Core i5-12450H", Ram: "8GB", Memory: "512GB SSD", Gpu: "NVIDIA GeForce RTX 3050" },

  // Acer
  { Company: "Acer", Product: "Nitro V 15", Price_euros: 899, TypeName: "Gaming", Inches: "15.6", ScreenResolution: "1920x1080 FHD", Cpu: "Intel Core i5-13420H", Ram: "8GB", Memory: "512GB SSD", Gpu: "NVIDIA GeForce RTX 3050" },
  { Company: "Acer", Product: "Aspire Lite 14", Price_euros: 399, TypeName: "Notebook", Inches: "14.0", ScreenResolution: "1920x1200 FHD", Cpu: "Intel Core i3-1215U", Ram: "8GB", Memory: "256GB SSD", Gpu: "Intel UHD Graphics" },
  { Company: "Acer", Product: "Swift Go 14 OLED", Price_euros: 1049, TypeName: "Ultrabook", Inches: "14.0", ScreenResolution: "2880x1800 Retina", Cpu: "Intel Core i7-13700H", Ram: "16GB", Memory: "512GB SSD", Gpu: "Intel Iris Xe" },
  { Company: "Acer", Product: "Predator Helios 16", Price_euros: 2499, TypeName: "Gaming", Inches: "16.0", ScreenResolution: "2560x1600 QHD", Cpu: "Intel Core i9-13900HX", Ram: "32GB", Memory: "2TB SSD", Gpu: "NVIDIA GeForce RTX 4080" },

  // HP
  { Company: "HP", Product: "Pavilion Plus 14", Price_euros: 950, TypeName: "Notebook", Inches: "14.0", ScreenResolution: "2880x1800 Retina", Cpu: "AMD Ryzen 7 7840U", Ram: "16GB", Memory: "1TB SSD", Gpu: "AMD Radeon Graphics" },
  { Company: "HP", Product: "Victus 16", Price_euros: 1149, TypeName: "Gaming", Inches: "16.1", ScreenResolution: "1920x1080 FHD", Cpu: "AMD Ryzen 7 7840HS", Ram: "16GB", Memory: "512GB SSD", Gpu: "NVIDIA GeForce RTX 4050" },
  { Company: "HP", Product: "Omen Transmit 16", Price_euros: 2199, TypeName: "Gaming", Inches: "16.0", ScreenResolution: "2560x1600 QHD", Cpu: "Intel Core i9-13900HX", Ram: "32GB", Memory: "1TB SSD", Gpu: "NVIDIA GeForce RTX 4070" },
  { Company: "HP", Product: "ProBook 440 G10", Price_euros: 850, TypeName: "Notebook", Inches: "14.0", ScreenResolution: "1920x1080 FHD", Cpu: "Intel Core i5-1335U", Ram: "8GB", Memory: "512GB SSD", Gpu: "Intel Iris Xe" },
  { Company: "HP", Product: "EliteBook 840 G10", Price_euros: 1599, TypeName: "Ultrabook", Inches: "14.0", ScreenResolution: "1920x1200 FHD", Cpu: "Intel Core i7-1355U", Ram: "16GB", Memory: "1TB SSD", Gpu: "Intel Iris Xe" },

  // Dell
  { Company: "Dell", Product: "XPS 13 Plus 9320", Price_euros: 1899, TypeName: "Ultrabook", Inches: "13.4", ScreenResolution: "3840x2160 4K", Cpu: "Intel Core i7-1360P", Ram: "32GB", Memory: "1TB SSD", Gpu: "Intel Iris Xe" },
  { Company: "Dell", Product: "Inspiron 15 3520", Price_euros: 499, TypeName: "Notebook", Inches: "15.6", ScreenResolution: "1920x1080 FHD", Cpu: "Intel Core i3-1215U", Ram: "8GB", Memory: "256GB SSD", Gpu: "Intel UHD Graphics" },

  // MSI
  { Company: "MSI", Product: "Katana 15 B13V", Price_euros: 1499, TypeName: "Gaming", Inches: "15.6", ScreenResolution: "1920x1080 FHD", Cpu: "Intel Core i7-13620H", Ram: "16GB", Memory: "1TB SSD", Gpu: "NVIDIA GeForce RTX 4060" },
  { Company: "MSI", Product: "Thin GF63 12U", Price_euros: 799, TypeName: "Gaming", Inches: "15.6", ScreenResolution: "1920x1080 FHD", Cpu: "Intel Core i5-12450H", Ram: "8GB", Memory: "512GB SSD", Gpu: "NVIDIA GeForce RTX 2050" },
  { Company: "MSI", Product: "Stealth 16 Studio", Price_euros: 2599, TypeName: "Gaming", Inches: "16.0", ScreenResolution: "2560x1600 QHD", Cpu: "Intel Core i9-13900H", Ram: "32GB", Memory: "2TB SSD", Gpu: "NVIDIA GeForce RTX 4070" },
  { Company: "MSI", Product: "Raider GE78 HX", Price_euros: 3499, TypeName: "Gaming", Inches: "17.0", ScreenResolution: "2560x1600 QHD", Cpu: "Intel Core i9-13980HX", Ram: "64GB", Memory: "2TB SSD", Gpu: "NVIDIA GeForce RTX 4090" },

  // Apple
  { Company: "Apple", Product: "MacBook Air M2", Price_euros: 1299, TypeName: "Ultrabook", Inches: "13.6", ScreenResolution: "2560x1600 Retina", Cpu: "Apple M2 8-Core", Ram: "8GB", Memory: "256GB SSD", Gpu: "Apple GPU 8-Core" },
  { Company: "Apple", Product: "MacBook Pro 14 M3 Pro", Price_euros: 2249, TypeName: "Ultrabook", Inches: "14.2", ScreenResolution: "2880x1800 Retina", Cpu: "Apple M3 Pro 11-Core", Ram: "18GB", Memory: "512GB SSD", Gpu: "Apple GPU 14-Core" },

  // Brand Indonesia & Lainnya
  { Company: "Huawei", Product: "MateBook D14", Price_euros: 699, TypeName: "Notebook", Inches: "14.0", ScreenResolution: "1920x1080 FHD", Cpu: "Intel Core i5-1135G7", Ram: "8GB", Memory: "512GB SSD", Gpu: "Intel Iris Xe" },
  { Company: "Axioo", Product: "Hype 5 AMD", Price_euros: 429, TypeName: "Notebook", Inches: "14.0", ScreenResolution: "1920x1080 FHD", Cpu: "AMD Ryzen 5 5500U", Ram: "8GB", Memory: "512GB SSD", Gpu: "AMD Radeon Graphics" },
  { Company: "Advan", Product: "Soulmate SG14", Price_euros: 299, TypeName: "Notebook", Inches: "14.0", ScreenResolution: "1366x768 HD", Cpu: "Intel Celeron N4020", Ram: "4GB", Memory: "128GB SSD", Gpu: "Intel UHD Graphics" },
  { Company: "Infinix", Product: "InBook Y2 Plus", Price_euros: 489, TypeName: "Notebook", Inches: "15.6", ScreenResolution: "1920x1080 FHD", Cpu: "Intel Core i5-1135G7", Ram: "8GB", Memory: "512GB SSD", Gpu: "Intel Iris Xe" },
  { Company: "Zyrex", Product: "Kresna Lite", Price_euros: 249, TypeName: "Notebook", Inches: "14.0", ScreenResolution: "1366x768 HD", Cpu: "Intel Celeron N4000", Ram: "4GB", Memory: "64GB Flash", Gpu: "Intel HD Graphics" },
  { Company: "AVITA", Product: "Pura 14", Price_euros: 349, TypeName: "Notebook", Inches: "14.0", ScreenResolution: "1366x768 HD", Cpu: "AMD A9-9425", Ram: "4GB", Memory: "128GB SSD", Gpu: "AMD Radeon R5" },
  { Company: "Gigabyte", Product: "G5 KF5", Price_euros: 1099, TypeName: "Gaming", Inches: "15.6", ScreenResolution: "1920x1080 FHD", Cpu: "Intel Core i5-12500H", Ram: "16GB", Memory: "512GB SSD", Gpu: "NVIDIA GeForce RTX 4060" }
];

export const getDefaultLaptops = (): Laptop[] => {
  return rawDefaultLaptops.map((l, index) => {
    const { QualityScore, Rating } = calculateLaptopMetrics({
      Cpu: l.Cpu,
      Ram: l.Ram,
      Memory: l.Memory,
      Gpu: l.Gpu,
      ScreenResolution: l.ScreenResolution,
      Price_euros: l.Price_euros
    });

    return {
      id: `default-${l.Company}-${l.Product.replace(/\s+/g, "-")}-${index}`,
      Company: l.Company,
      Product: l.Product,
      Price_euros: l.Price_euros,
      TypeName: l.TypeName,
      Inches: l.Inches,
      ScreenResolution: l.ScreenResolution,
      Cpu: l.Cpu,
      Ram: l.Ram,
      Memory: l.Memory,
      Gpu: l.Gpu,
      QualityScore,
      Rating
    };
  });
};
