/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

import apiRouter from "./src/backend/routes/api";
import { errorHandler, notFoundHandler } from "./src/backend/middlewares/errorHandler";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Keamanan dan logging middlewares
  app.use(
    helmet({
      contentSecurityPolicy: false, // Dinonaktifkan untuk mendukung rendering mulus di iframe preview AI Studio
      crossOriginEmbedderPolicy: false,
    })
  );
  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());

  // Handler khusus untuk GET /health sebelum middleware static / Vite
  app.get("/health", (req, res) => {
    res.json({
      status: "OK"
    });
  });

  // Handler khusus untuk GET / (Content Negotiation)
  // Menjamin jika request bukan dari browser (tidak meminta text/html), server mengembalikan teks "Laptop MergeSort Analyzer Running"
  app.get("/", (req, res, next) => {
    const acceptHeader = req.headers.accept || "";
    if (acceptHeader.includes("text/html")) {
      return next(); // Teruskan ke Vite / Static handler untuk menyajikan aplikasi React
    }
    res.send("Laptop MergeSort Analyzer Running");
  });

  // Pasang API router lainnya
  app.use(apiRouter);

  // Integrasi Vite Dev Server (Development) vs Express Static (Production)
  if (process.env.NODE_ENV !== "production") {
    console.log("[SERVER] Menjalankan server dalam mode DEVELOPMENT...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Gunakan middleware Vite untuk menangani aset frontend secara hot-reload
    app.use(vite.middlewares);
  } else {
    console.log("[SERVER] Menjalankan server dalam mode PRODUCTION...");
    const distPath = path.join(process.cwd(), "dist");
    
    // Sajikan file static hasil build Vite
    app.use(express.static(distPath));
    
    // Tangani seluruh rute frontend (SPA) agar kembali ke index.html
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Tangani rute tidak ditemukan dan error global
  app.use(notFoundHandler);
  app.use(errorHandler);

  // Bind ke host 0.0.0.0 dan port 3000 (sesuai persyaratan platform)
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Server aktif di http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("[SERVER] Gagal memulai server:", error);
});
