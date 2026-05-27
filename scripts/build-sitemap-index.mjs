/**
 * Generates `out/sitemap.xml` as a sitemap-INDEX that references every chunked
 * sitemap produced by Next.js' `generateSitemaps()` (in `app/sitemap.ts`).
 *
 * Background: when `next.config.mjs` sets `output: "export"`, Next.js emits the
 * per-chunk files (`out/sitemap/0.xml`, `out/sitemap/1.xml`, ...) but does NOT
 * also emit the top-level `out/sitemap.xml` index that Google Search Console
 * and the AdSense crawler expect to find at `https://<host>/sitemap.xml`.
 *
 * This script runs as a postbuild step and writes that index file so the
 * canonical `/sitemap.xml` URL serves a valid <sitemapindex>, while each
 * chunk URL (`/sitemap/0.xml`, etc.) serves a normal <urlset>.
 */
import fs from "node:fs";
import path from "node:path";

const SITE_URL = "https://www.mpscs.in";
const OUT_DIR = path.resolve(process.cwd(), "out");
const CHUNKS_DIR = path.join(OUT_DIR, "sitemap");
const INDEX_PATH = path.join(OUT_DIR, "sitemap.xml");

if (!fs.existsSync(CHUNKS_DIR)) {
  console.warn(
    `[sitemap-index] No chunks found at ${CHUNKS_DIR}. Skipping index generation.`,
  );
  process.exit(0);
}

const chunkFiles = fs
  .readdirSync(CHUNKS_DIR)
  .filter((name) => /^\d+\.xml$/.test(name))
  .sort((a, b) => Number(a.replace(".xml", "")) - Number(b.replace(".xml", "")));

if (chunkFiles.length === 0) {
  console.warn("[sitemap-index] No numbered chunk files found. Skipping.");
  process.exit(0);
}

const now = new Date().toISOString();

const entries = chunkFiles
  .map(
    (file) =>
      `  <sitemap>\n    <loc>${SITE_URL}/sitemap/${file}</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>`,
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>\n`;

fs.writeFileSync(INDEX_PATH, xml, "utf8");

console.log(
  `[sitemap-index] Wrote ${INDEX_PATH} with ${chunkFiles.length} chunk(s): ${chunkFiles.join(", ")}`,
);
