"use client";

import { useState, useRef, useCallback } from "react";
import { ParsedQuestion } from "@/lib/types";
import { parseOCRText } from "@/lib/ocr-parser";

const ACCEPT = "image/png,image/jpeg,image/webp,image/gif,application/pdf";
const ACCEPT_EXT = ".png,.jpg,.jpeg,.webp,.gif,.pdf";

interface Props {
  onQuestionsExtracted: (questions: ParsedQuestion[]) => void;
}

type FileKind = "image" | "pdf" | null;

export default function FileUploader({ onQuestionsExtracted }: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [fileKind, setFileKind] = useState<FileKind>(null);
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [rawText, setRawText] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setFileKind(null);
    setFileName("");
    setPreview(null);
    setPdfFile(null);
    setRawText("");
    setError("");
    setProgress(0);
    setStatusText("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFile = useCallback((file: File) => {
    setError("");
    setRawText("");
    setProgress(0);
    setStatusText("");

    if (file.type === "application/pdf") {
      setFileKind("pdf");
      setFileName(file.name);
      setPdfFile(file);
      setPreview(null);
      return;
    }

    if (file.type.startsWith("image/")) {
      setFileKind("image");
      setFileName(file.name);
      setPdfFile(null);
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
      return;
    }

    setError("Unsupported file type. Please upload an image (PNG, JPG) or a PDF.");
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
    },
    [handleFile],
  );

  /* ---- Image OCR ---- */
  const extractFromImage = async () => {
    if (!preview) return;
    setProcessing(true);
    setProgress(0);
    setStatusText("Running OCR on image...");
    setError("");

    try {
      const Tesseract = await import("tesseract.js");
      const result = await Tesseract.recognize(preview, "eng", {
        logger: (info) => {
          if (info.status === "recognizing text" && typeof info.progress === "number") {
            setProgress(Math.round(info.progress * 100));
          }
        },
      });
      finishExtraction(result.data.text);
    } catch {
      setError("OCR processing failed. Try a clearer image or add questions manually.");
    } finally {
      setProcessing(false);
      setStatusText("");
    }
  };

  /* ---- PDF text extraction ---- */
  const extractFromPdf = async () => {
    if (!pdfFile) return;
    setProcessing(true);
    setProgress(0);
    setError("");

    try {
      const { extractTextFromPdf } = await import("@/lib/pdf-extract");
      const result = await extractTextFromPdf(pdfFile, (p) => {
        setProgress(p.percent);
        setStatusText(
          p.stage === "reading"
            ? `Reading page ${p.current} of ${p.total}...`
            : p.stage === "ocr"
              ? `OCR on page ${p.current} of ${p.total} (scanned PDF)...`
              : `Rendering page images ${p.current} of ${p.total}...`,
        );
      });
      finishExtraction(result.text, result.pageTexts, result.pageImages);
    } catch (err) {
      console.error(err);
      setError("PDF processing failed. The file may be corrupted or password-protected.");
    } finally {
      setProcessing(false);
      setStatusText("");
    }
  };

  /* ---- Common post-extraction ---- */
  const finishExtraction = (text: string, pageTexts?: string[], pageImages?: string[]) => {
    setRawText(text);
    const parsed = parseOCRText(text);

    if (parsed.length > 0 && pageTexts && pageImages && pageImages.length > 0) {
      attachDiagramImages(parsed, pageTexts, pageImages);
    }

    if (parsed.length > 0) {
      onQuestionsExtracted(parsed);
    } else {
      setError(
        "Could not auto-detect structured questions. The raw text is shown below — you can review it or add questions manually.",
      );
    }
  };

  /**
   * For questions that reference a diagram/figure, find which PDF page
   * the question lives on and attach the page image.
   * Uses per-page text arrays (1:1 with pageImages) for accurate mapping.
   */
  const attachDiagramImages = (
    questions: ParsedQuestion[],
    pageTexts: string[],
    pageImages: string[],
  ) => {
    const DIAGRAM_PATTERN =
      /\b(?:diagram|figure|figures|observe the figure|following figure|find\s.*value\s.*['"]?x['"]?|number of triangles|which figure|correct figure|identify.*figure|following diagram)\b/i;

    for (const q of questions) {
      if (!DIAGRAM_PATTERN.test(q.text)) continue;

      const pageIdx = findQuestionPage(q.text, pageTexts);
      if (pageIdx >= 0 && pageIdx < pageImages.length) {
        q.imageUrl = pageImages[pageIdx];
      }
    }
  };

  const findQuestionPage = (qText: string, pageTexts: string[]): number => {
    const cleanSnippet = qText
      .replace(/^\d+\.\s*/, "")
      .slice(0, 50)
      .trim();

    if (!cleanSnippet) return -1;

    for (let i = 0; i < pageTexts.length; i++) {
      if (pageTexts[i].includes(cleanSnippet)) return i;
    }

    const escaped = cleanSnippet
      .slice(0, 30)
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    try {
      const re = new RegExp(escaped, "i");
      for (let i = 0; i < pageTexts.length; i++) {
        if (re.test(pageTexts[i])) return i;
      }
    } catch { /* regex failed, skip */ }

    return -1;
  };

  const handleExtract = () => {
    if (fileKind === "pdf") extractFromPdf();
    else extractFromImage();
  };

  /* ---- Render ---- */
  const hasFile = fileKind !== null;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="mb-1 text-lg font-semibold text-slate-800">
        Upload Question Paper
      </h3>
      <p className="mb-4 text-sm text-slate-500">
        Upload an image or PDF — questions &amp; options will be extracted automatically.
      </p>

      {/* ---- Drop zone ---- */}
      {!hasFile ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 transition-colors ${
            dragActive
              ? "border-indigo-500 bg-indigo-50"
              : "border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50"
          }`}
        >
          <svg className="mb-3 h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          <p className="text-sm font-medium text-slate-600">
            Drag &amp; drop your file here
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Supports PNG, JPG, WEBP, and PDF
          </p>
          <input
            ref={inputRef}
            type="file"
            accept={`${ACCEPT},${ACCEPT_EXT}`}
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* File info / preview */}
          <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
            {fileKind === "image" && preview ? (
              <img src={preview} alt="Uploaded" className="max-h-64 w-full object-contain" />
            ) : (
              <div className="flex items-center gap-4 p-5">
                {/* PDF icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-100">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{fileName}</p>
                  <p className="text-xs text-slate-500">PDF document</p>
                </div>
              </div>
            )}

            {/* Close button */}
            {!processing && (
              <button
                onClick={reset}
                className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow hover:bg-red-50 transition-colors"
              >
                <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Progress */}
          {processing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>{statusText || "Processing..."}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Extract button */}
          {!processing && (
            <button
              onClick={handleExtract}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              {fileKind === "pdf" ? "Extract Questions from PDF" : "Extract Questions from Image"}
            </button>
          )}
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-700 border border-amber-200">
          {error}
        </p>
      )}

      {/* Raw text */}
      {rawText && (
        <details className="mt-3">
          <summary className="cursor-pointer text-sm font-medium text-slate-500 hover:text-slate-700">
            View extracted raw text
          </summary>
          <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-3 text-xs text-slate-600 border border-slate-200">
            {rawText}
          </pre>
        </details>
      )}
    </div>
  );
}
