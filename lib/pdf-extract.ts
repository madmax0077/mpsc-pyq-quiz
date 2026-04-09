/**
 * Extracts text from a PDF with proper line-break reconstruction.
 *
 * 1. Tries the embedded text layer first (fast, for digital PDFs).
 * 2. Falls back to rendering pages -> Tesseract OCR (for scanned PDFs).
 *
 * Also renders each page as a JPEG data-URL so that diagram/figure
 * images can be attached to questions that reference them.
 */

export interface PdfProgress {
  stage: "reading" | "ocr" | "images";
  current: number;
  total: number;
  percent: number;
}

export interface PdfResult {
  text: string;
  pageTexts: string[];
  pageImages: string[];
}

type ProgressCb = (p: PdfProgress) => void;

export async function extractTextFromPdf(
  file: File,
  onProgress?: ProgressCb,
): Promise<PdfResult> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdf.numPages;

  /* ---------- Pass 1 – text layer ---------- */
  const pageTexts: string[] = [];

  for (let i = 1; i <= totalPages; i++) {
    onProgress?.({
      stage: "reading",
      current: i,
      total: totalPages,
      percent: Math.round((i / totalPages) * 40),
    });
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pageTexts.push(reconstructText(content.items));
  }

  const textLayerResult = pageTexts.join("\n\n");
  const wordCount = textLayerResult.split(/\s+/).filter(Boolean).length;

  let finalPageTexts = pageTexts;

  if (wordCount <= totalPages * 5) {
    /* ---------- Pass 2 – OCR for scanned/image-based PDFs ---------- */
    const Tesseract = await import("tesseract.js");
    const ocrTexts: string[] = [];
    const scale = 3;

    for (let i = 1; i <= totalPages; i++) {
      onProgress?.({
        stage: "ocr",
        current: i,
        total: totalPages,
        percent: Math.round((i / totalPages) * 80),
      });

      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d")!;
      await page.render({ canvasContext: ctx, viewport }).promise;

      const dataUrl = canvas.toDataURL("image/png");
      const result = await Tesseract.recognize(dataUrl, "eng");
      ocrTexts.push(result.data.text);
      canvas.width = 0;
      canvas.height = 0;
    }

    finalPageTexts = ocrTexts;
  }

  /* ---------- Pass 3 – render page images for diagrams ---------- */
  const pageImages: string[] = [];
  const imgScale = 1.5;

  for (let i = 1; i <= totalPages; i++) {
    onProgress?.({
      stage: "images",
      current: i,
      total: totalPages,
      percent: 80 + Math.round((i / totalPages) * 20),
    });

    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: imgScale });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    await page.render({ canvasContext: ctx, viewport }).promise;
    pageImages.push(canvas.toDataURL("image/jpeg", 0.7));
    canvas.width = 0;
    canvas.height = 0;
  }

  onProgress?.({ stage: "images", current: totalPages, total: totalPages, percent: 100 });
  return {
    text: finalPageTexts.join("\n\n"),
    pageTexts: finalPageTexts,
    pageImages,
  };
}

/* ------------------------------------------------------------------ */
/*  Reconstruct readable text from PDF text-content items             */
/* ------------------------------------------------------------------ */

interface TextItem {
  str: string;
  hasEOL?: boolean;
  transform?: number[];
  width?: number;
  height?: number;
}

/**
 * Detects two-column layout (common in bilingual MPSC papers where
 * Marathi is on the left and English on the right). When detected,
 * separates columns so they don't interleave.
 */
function reconstructText(items: unknown[]): string {
  const typed: TextItem[] = [];
  for (const raw of items) {
    const item = raw as TextItem;
    if (typeof item.str === "string" && item.str.trim()) typed.push(item);
  }
  if (typed.length === 0) return "";

  const xPositions = typed
    .filter((it) => it.transform)
    .map((it) => it.transform![4]);

  if (xPositions.length > 10) {
    const sorted = [...xPositions].sort((a, b) => a - b);
    const minX = sorted[0];
    const maxX = sorted[sorted.length - 1];
    const pageWidth = maxX - minX;

    if (pageWidth > 200) {
      const midX = minX + pageWidth * 0.45;
      const leftCount = xPositions.filter((x) => x < midX).length;
      const rightCount = xPositions.filter((x) => x >= midX).length;

      if (leftCount > typed.length * 0.2 && rightCount > typed.length * 0.2) {
        const leftItems = typed.filter(
          (it) => !it.transform || it.transform[4] < midX,
        );
        const rightItems = typed.filter(
          (it) => it.transform && it.transform[4] >= midX,
        );
        const leftText = buildLines(leftItems);
        const rightText = buildLines(rightItems);
        return leftText + "\n" + rightText;
      }
    }
  }

  return buildLines(typed);
}

function buildLines(items: TextItem[]): string {
  const lines: string[] = [];
  let currentLine = "";
  let lastY: number | null = null;
  let lastX: number | null = null;

  for (const item of items) {
    const y = item.transform ? item.transform[5] : null;
    const x = item.transform ? item.transform[4] : null;

    if (lastY !== null && y !== null && Math.abs(y - lastY) > 3) {
      lines.push(currentLine);
      currentLine = "";
    }
    if (y !== null) lastY = y;

    const needsSpace =
      currentLine &&
      !currentLine.endsWith(" ") &&
      !item.str.startsWith(" ") &&
      (lastX === null || x === null || x - lastX > 1);

    if (needsSpace) currentLine += " ";
    currentLine += item.str;

    if (x !== null && item.transform) {
      lastX = x + (item.width ?? item.str.length * 5);
    }

    if (item.hasEOL) {
      lines.push(currentLine);
      currentLine = "";
      lastY = null;
      lastX = null;
    }
  }

  if (currentLine.trim()) lines.push(currentLine);
  return lines.map((l) => l.trim()).filter(Boolean).join("\n");
}
