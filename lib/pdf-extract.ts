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
}

function reconstructText(items: unknown[]): string {
  const lines: string[] = [];
  let currentLine = "";
  let lastY: number | null = null;

  for (const raw of items) {
    const item = raw as TextItem;
    if (typeof item.str !== "string") continue;

    const y = item.transform ? item.transform[5] : null;
    if (lastY !== null && y !== null && Math.abs(y - lastY) > 2) {
      lines.push(currentLine);
      currentLine = "";
    }
    if (y !== null) lastY = y;

    if (currentLine && !currentLine.endsWith(" ") && !item.str.startsWith(" ")) {
      currentLine += " ";
    }
    currentLine += item.str;

    if (item.hasEOL) {
      lines.push(currentLine);
      currentLine = "";
      lastY = null;
    }
  }

  if (currentLine.trim()) lines.push(currentLine);
  return lines.map((l) => l.trim()).filter(Boolean).join("\n");
}
