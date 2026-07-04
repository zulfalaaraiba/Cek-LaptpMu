/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SalesData } from "../types";

/**
 * Mengurai konten teks sales_data.csv menjadi array of SalesData.
 */
export function parseSalesCSV(csvText: string): SalesData[] {
  const lines = csvText.split(/\r?\n/);
  if (lines.length <= 1) {
    return [];
  }

  const results: SalesData[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const cols = line.split(",");
    if (cols.length >= 3) {
      results.push({
        Brand: cols[0].trim(),
        TahunSebelumnya: parseInt(cols[1]) || 0,
        TahunBerjalan: parseInt(cols[2]) || 0,
      });
    }
  }

  return results;
}
