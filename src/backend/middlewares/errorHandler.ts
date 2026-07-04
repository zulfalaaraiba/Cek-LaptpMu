/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Request, Response, NextFunction } from "express";

/**
 * Middleware untuk menangani request yang tidak cocok dengan route manapun (Not Found).
 */
export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  // Jika request menghendaki halaman HTML (seperti navigasi halaman), kita biarkan
  if (req.headers.accept && req.headers.accept.includes("text/html")) {
    return next();
  }
  
  res.status(404).json({
    status: "error",
    message: `Resource not found: ${req.method} ${req.originalUrl}`,
  });
}

/**
 * Middleware global untuk menangani error (Error Handler).
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error("Backend Error:", err);
  
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    status: "error",
    message: err.message || "Internal Server Error",
    // Hanya tampilkan stack trace jika bukan production
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
}
