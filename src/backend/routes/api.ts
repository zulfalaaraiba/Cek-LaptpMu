/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router, Request, Response } from "express";

const router = Router();

/**
 * Route check health
 * GET /health
 */
router.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
  });
});

/**
 * Endpoint opsional lain untuk API info
 * GET /api/info
 */
router.get("/api/info", (req: Request, res: Response) => {
  res.json({
    appName: "MergeSort Complexity Analyzer API",
    version: "1.0.0",
    description: "API server untuk mendukung platform analisis algoritma Merge Sort",
  });
});

export default router;
