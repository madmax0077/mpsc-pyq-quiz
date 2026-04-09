import { ParsedQuestion } from "./types";
import { filterEnglishText } from "./english-filter";

/**
 * Multi-strategy MCQ parser — robust to OCR noise.
 *
 * For bilingual PDFs (Marathi + English), automatically filters out
 * non-English text before parsing.
 *
 * Handles all common Indian competitive exam formats:
 *   (1) … (2) … (3) … (4) …     ← parenthetical numbers  (MPSC, UPSC, SSC)
 *   (a) … (b) … (c) … (d) …     ← parenthetical letters
 *   A) …  B) …  C) …  D) …     ← letter + bracket / dot
 *   1) …  2) …  3) …  4) …     ← bare numbers per line
 */
export function parseOCRText(rawText: string): ParsedQuestion[] {
  const englishOnly = filterEnglishText(rawText);
  const text = normalise(englishOnly);
  if (!text) return [];

  const strategies = [
    () => splitByQuestionNumber(text),
    () => splitByParenOptionBlocks(text),
    () => splitByOptionClusters(text),
    () => trySingleBlock(text),
  ];

  let best: ParsedQuestion[] = [];
  for (const fn of strategies) {
    const result = fn();
    if (result.length > best.length) best = result;
  }
  return best;
}

/* ================================================================== */
/*  NORMALISATION — fix common OCR artefacts                          */
/* ================================================================== */

const OCR_CHAR_MAP: Record<string, string> = {
  "®": "b", "©": "c", "@": "a", "¢": "c", "€": "c",
};

function normalise(raw: string): string {
  let text = raw
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\t/g, " ")
    .replace(/\u00A0/g, " ")
    .replace(/\u2018|\u2019/g, "'")
    .replace(/\u201C|\u201D/g, '"')
    .replace(/[{\[]\s*([1-4])\s*[}\]]/g, "($1)")
    .replace(/[{\[]\s*([a-dA-D])\s*[}\]]/g, "($1)");

  // Pattern: OCR special char inside parens → mapped option letter
  text = text.replace(/\(([®©@¢€])\)/g, (_m, ch: string) =>
    `(${OCR_CHAR_MAP[ch] || ch})`
  );

  // Pattern: OCR char inside opening paren WITHOUT closing paren
  text = text.replace(/\(([®©@¢€])(?=[\s,.])/g, (_m, ch: string) =>
    `(${OCR_CHAR_MAP[ch] || ch})`
  );

  // Pattern: bare OCR char + ) with no opening paren
  text = text.replace(/(?<=\s|^)([®©¢@])\)/gm, (_m, ch: string) =>
    `(${OCR_CHAR_MAP[ch] || ch})`
  );

  // Pattern: multi-char garbled option markers like ©®) → (3), @® → stripped
  text = text.replace(/(?<=\s|^)[©®@¢€]{2,}\)(?=\s)/gm, "(3)");
  text = text.replace(/(?<=\s|^)®[nN]\s/gm, "(1) ");

  // Pattern: extra chars around option letters — (pb)→(b), (bh)→(b), (pa)→(a)
  text = text.replace(/\(p?([a-d])h?\)/gi, "($1)");

  // Pattern: OCR reads ) as y — (ay→(a), (cy→(c), (ivy→(iv)
  text = text.replace(/\(([a-d]|i{1,3}v?|vi{0,3})y(?=[\s,.])/gi, "($1)");

  // Pattern: bare n) → (n) for 1-4 (OCR drops opening paren)
  text = text.replace(/(?<!\d)([1-4])\)(?=\s)/g, "($1)");

  // Strip "Answer Options" and "Select the correct options" header lines
  text = text.replace(/\n\s*answer\s*options?\s*:?\s*(?=\n|$)/gim, "");
  text = text.replace(/\n\s*select\s+the\s+correct\s+options?\s*:?\s*(?=\n|$)/gim, "");

  text = text.replace(/ {2,}/g, " ");
  return text;
}

/* ================================================================== */
/*  STRATEGY 1 – Split on question-number headers at line start       */
/* ================================================================== */

function splitByQuestionNumber(text: string): ParsedQuestion[] {
  const re = /(?:^|\n)\s*(?:(?:Q(?:uestion)?|Ques|Qn?)[\s.:#\-]*)?\d{1,3}\s*[.):\-]\s/gi;

  const positions: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const before = text.substring(Math.max(0, m.index - 5), m.index);
    if (/[(\[{]\s*$/.test(before)) continue;
    positions.push(m.index);
  }

  if (positions.length === 0) return [];

  const out: ParsedQuestion[] = [];
  for (let i = 0; i < positions.length; i++) {
    const start = positions[i];
    const end = i + 1 < positions.length ? positions[i + 1] : text.length;
    const block = text.substring(start, end).trim();
    const q = extractQuestionFromBlock(block);
    if (q) out.push(q);
  }
  return out;
}

/* ================================================================== */
/*  STRATEGY 2 – Find "(1)…(2)…(3)…(4)" clusters directly           */
/* ================================================================== */

function splitByParenOptionBlocks(text: string): ParsedQuestion[] {
  const optSetRe = /\(\s*1\s*\)\s*.+?\(\s*2\s*\)\s*.+?\(\s*3\s*\)\s*.+?\(\s*4\s*\)\s*.+?(?=\n\s*\d{1,3}\s*[.):\-]\s|\n\s*(?:Q(?:uestion)?|Ques)\s*\d|\(\s*1\s*\)\s*(?=.+\(\s*2\s*\))|$)/gs;

  const matches: { start: number; end: number; optStart: number }[] = [];
  let match: RegExpExecArray | null;

  while ((match = optSetRe.exec(text)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length,
      optStart: match.index,
    });
  }

  if (matches.length === 0) return [];

  const out: ParsedQuestion[] = [];
  for (let i = 0; i < matches.length; i++) {
    const optStart = matches[i].optStart;
    const optEnd = matches[i].end;
    const prevEnd = i > 0 ? matches[i - 1].end : 0;
    const qRaw = text.substring(prevEnd, optStart).trim();
    const optBlock = text.substring(optStart, optEnd);
    const opts = extractParenNumOpts(optBlock);
    const qText = cleanQuestionText(qRaw);
    if (qText && Object.keys(opts).length >= 2) {
      out.push({ text: qText, options: fillOptions(opts) });
    }
  }
  return out;
}

/* ================================================================== */
/*  STRATEGY 3 – Detect option line clusters and work backwards       */
/* ================================================================== */

function splitByOptionClusters(text: string): ParsedQuestion[] {
  const lines = text.split("\n");
  const optLineNums: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    if (looksLikeOptionLine(lines[i])) optLineNums.push(i);
  }
  if (optLineNums.length < 2) return [];

  const clusters: number[][] = [];
  let cluster = [optLineNums[0]];
  for (let i = 1; i < optLineNums.length; i++) {
    if (optLineNums[i] - optLineNums[i - 1] <= 2) {
      cluster.push(optLineNums[i]);
    } else {
      if (cluster.length >= 2) clusters.push(cluster);
      cluster = [optLineNums[i]];
    }
  }
  if (cluster.length >= 2) clusters.push(cluster);

  const out: ParsedQuestion[] = [];
  for (let ci = 0; ci < clusters.length; ci++) {
    const c = clusters[ci];
    const firstOpt = c[0];
    const prevEnd = ci > 0 ? clusters[ci - 1][clusters[ci - 1].length - 1] + 1 : 0;
    const qLines = lines.slice(Math.max(prevEnd, firstOpt - 6), firstOpt);
    const qText = cleanQuestionText(qLines.join(" "));
    const opts = extractOptionsFromLines(c.map((n) => lines[n]));
    if (qText && Object.keys(opts).length >= 2) {
      out.push({ text: qText, options: fillOptions(opts) });
    }
  }
  return out;
}

/* ================================================================== */
/*  STRATEGY 4 – Single block                                        */
/* ================================================================== */

function trySingleBlock(text: string): ParsedQuestion[] {
  const q = extractQuestionFromBlock(text);
  return q ? [q] : [];
}

/* ================================================================== */
/*  CORE: Extract one question + options from a text block            */
/* ================================================================== */

function hasEnoughEnglish(text: string): boolean {
  const words = text.split(/\s+/).filter((w) => w.length >= 2);
  if (words.length === 0) return false;
  const engWords = words.filter((w) => /^[a-zA-Z]/.test(w));
  return engWords.length / words.length >= 0.4;
}

function optionsLookValid(opts: Record<string, string>): boolean {
  const vals = Object.values(opts).filter(Boolean);
  if (vals.length < 2) return false;
  return vals.some((v) => hasEnoughEnglish(v));
}

function extractQuestionFromBlock(block: string): ParsedQuestion | null {
  const trimmed = block.trim();
  if (!trimmed) return null;

  const isMatchType =
    /match\s+the\s+(following|pairs?|correct|column)/i.test(trimmed) ||
    /\bmatch\s*:/i.test(trimmed) ||
    /\bmatch\s+the\s+pairs/i.test(trimmed);

  if (isMatchType) {
    const parenNum = detectParenNumResult(trimmed);
    if (parenNum && Object.keys(parenNum.opts).length >= 2 && optionsLookValid(parenNum.opts)) {
      let qText = trimmed.substring(0, parenNum.idx);
      qText = cleanQuestionText(qText);
      if (qText) {
        return { text: qText, options: fillOptions(parenNum.opts) };
      }
    }
    const qText = cleanQuestionText(trimmed);
    if (qText) {
      return { text: qText, options: { A: "", B: "", C: "", D: "" } };
    }
  }

  // Priority 1: (1)…(2)…(3)…(4) options
  const parenNum = detectParenNumResult(trimmed);
  if (parenNum && Object.keys(parenNum.opts).length >= 2) {
    let qText = trimmed.substring(0, parenNum.idx);
    qText = cleanQuestionText(qText);
    if (qText) {
      return { text: qText, options: fillOptions(parenNum.opts) };
    }
  }

  // Priority 2: (a)-(d) options
  const parenLetter = detectParenLetterResult(trimmed);
  if (parenLetter && Object.keys(parenLetter.opts).length >= 2) {
    let qText = trimmed.substring(0, parenLetter.idx);
    qText = cleanQuestionText(qText);
    if (qText) {
      return { text: qText, options: fillOptions(parenLetter.opts) };
    }
  }

  // Priority 3-4: other option formats
  const otherDetectors = [
    () => detectLetterResult(trimmed),
    () => detectBareNumResult(trimmed),
  ];

  for (const detect of otherDetectors) {
    const result = detect();
    if (result && Object.keys(result.opts).length >= 2) {
      let qText = trimmed.substring(0, result.idx);
      qText = cleanQuestionText(qText);
      if (qText) {
        return { text: qText, options: fillOptions(result.opts) };
      }
    }
  }
  return null;
}

/* ================================================================== */
/*  OPTION DETECTORS                                                  */
/* ================================================================== */

function extractParenNumOpts(text: string): Record<string, string> {
  const NUM_TO_LETTER: Record<string, string> = { "1": "A", "2": "B", "3": "C", "4": "D" };
  const re = /\(\s*([1-4])\s*\)\s*(.+?)(?=\s*\(\s*[1-4]\s*\)|$)/gs;
  const opts: Record<string, string> = {};
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const letter = NUM_TO_LETTER[m[1]];
    if (letter && !opts[letter]) opts[letter] = cleanOptionValue(m[2]);
  }
  return opts;
}

function detectParenNumResult(text: string): { opts: Record<string, string>; idx: number } | null {
  const NUM_TO_LETTER: Record<string, string> = { "1": "A", "2": "B", "3": "C", "4": "D" };

  const re = /\(\s*([1-4])\s*\)\s*(.+?)(?=\s*\(\s*[1-4]\s*\)|$)/gs;
  const opts: Record<string, string> = {};
  let firstIdx = Infinity;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const letter = NUM_TO_LETTER[m[1]];
    const val = cleanOptionValue(m[2]);
    if (letter && !opts[letter] && val) {
      opts[letter] = val;
    }
    if (m.index < firstIdx) firstIdx = m.index;
  }

  // Handle garbled (3) → () : if we found (1),(2),(4) but not (3), check for ()
  if (opts["A"] && opts["B"] && opts["D"] && !opts["C"]) {
    const emptyRe = /\(\)\s*(.+?)(?=\s*\(\s*[1-4]\s*\)|$)/gs;
    let em: RegExpExecArray | null;
    while ((em = emptyRe.exec(text)) !== null) {
      if (em.index >= firstIdx) {
        const val = cleanOptionValue(em[1]);
        if (val) {
          opts["C"] = val;
          break;
        }
      }
    }
  }

  // Also handle: found (1),(2) but not (3),(4) — check for () and stray patterns
  if (opts["A"] && opts["B"] && !opts["C"]) {
    const emptyRe = /\(\)\s*(.+?)(?=\s*\(\s*[1-4]\s*\)|\s*\(\)|$)/gs;
    let em: RegExpExecArray | null;
    while ((em = emptyRe.exec(text)) !== null) {
      if (em.index >= firstIdx) {
        const val = cleanOptionValue(em[1]);
        if (val) {
          opts["C"] = val;
          break;
        }
      }
    }
  }

  if (Object.keys(opts).length >= 2) return { opts, idx: firstIdx };

  // Fallback: bare n) format
  const reBare = /(?:^|\s)([1-4])\)\s*(.+?)(?=\s+[1-4]\)|$)/gs;
  const optsBare: Record<string, string> = {};
  let firstIdxBare = Infinity;
  while ((m = reBare.exec(text)) !== null) {
    const letter = NUM_TO_LETTER[m[1]];
    const val = cleanOptionValue(m[2]);
    if (letter && !optsBare[letter] && val) {
      optsBare[letter] = val;
    }
    if (m.index < firstIdxBare) firstIdxBare = m.index;
  }
  return Object.keys(optsBare).length >= 2 ? { opts: optsBare, idx: firstIdxBare } : null;
}

function detectParenLetterResult(text: string): { opts: Record<string, string>; idx: number } | null {
  const re = /\(\s*([a-dA-D])\s*\)\s*(.+?)(?=\s*\(\s*[a-dA-D]\s*\)|$)/gs;
  const opts: Record<string, string> = {};
  let firstIdx = Infinity;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const letter = m[1].toUpperCase();
    const val = cleanOptionValue(m[2]);
    if (!opts[letter] && val) opts[letter] = val;
    if (m.index < firstIdx) firstIdx = m.index;
  }
  return Object.keys(opts).length >= 2 ? { opts, idx: firstIdx } : null;
}

function detectLetterResult(text: string): { opts: Record<string, string>; idx: number } | null {
  const inlineRe = /[(\[]?\s*([A-Da-d])\s*[)\].\-:]\s*(.+?)(?=\s+[(\[]?\s*[A-Da-d]\s*[)\].\-:]|$)/g;
  let opts: Record<string, string> = {};
  let firstIdx = Infinity;
  let m: RegExpExecArray | null;

  while ((m = inlineRe.exec(text)) !== null) {
    const letter = m[1].toUpperCase();
    if (!opts[letter]) opts[letter] = m[2].trim();
    if (m.index < firstIdx) firstIdx = m.index;
  }
  if (Object.keys(opts).length >= 2) return { opts, idx: firstIdx };

  opts = {};
  firstIdx = Infinity;
  const lineRe = /(?:^|\n)\s*[(\[]?\s*([A-Da-d])\s*[)\].\-:]\s*(.+)/g;
  while ((m = lineRe.exec(text)) !== null) {
    const letter = m[1].toUpperCase();
    if (!opts[letter]) opts[letter] = m[2].trim();
    if (m.index < firstIdx) firstIdx = m.index;
  }
  return Object.keys(opts).length >= 2 ? { opts, idx: firstIdx } : null;
}

function detectBareNumResult(text: string): { opts: Record<string, string>; idx: number } | null {
  const NUM_TO_LETTER: Record<string, string> = { "1": "A", "2": "B", "3": "C", "4": "D" };
  const re = /(?:^|\n)\s*([1-4])\s*[.):\-]\s*(.+)/g;
  const opts: Record<string, string> = {};
  let firstIdx = Infinity;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const letter = NUM_TO_LETTER[m[1]];
    if (letter && !opts[letter]) opts[letter] = m[2].trim();
    if (m.index < firstIdx) firstIdx = m.index;
  }
  return Object.keys(opts).length >= 2 ? { opts, idx: firstIdx } : null;
}

/* ================================================================== */
/*  HELPERS                                                           */
/* ================================================================== */

function cleanQuestionText(raw: string): string {
  return raw
    .replace(/^\s*(?:Q(?:uestion)?|Ques|Qn?)?\s*\d{0,3}\s*[.):\-]?\s*/i, "")
    .replace(/\n/g, " ")
    .replace(/ {2,}/g, " ")
    .replace(/\s*answer\s*options?\s*:?\s*$/i, "")
    .replace(/\s*select\s+the\s+correct\s+options?\s*:?\s*$/i, "")
    .trim();
}

function cleanOptionValue(raw: string): string {
  let result = raw
    .replace(/\n/g, " ")
    .replace(/\s*answer\s*options?\s*:?\s*$/i, "")
    .replace(/\s*select\s+the\s+correct\s+options?\s*:?\s*$/i, "")
    .replace(/\s*P\.?T\.?O\.?\s*$/i, "")
    .replace(/ {2,}/g, " ")
    .trim();

  result = fixGarbledLetterRefs(result);
  return result;
}

/**
 * Fix garbled letter references INSIDE option text.
 * OCR commonly garbles (c) to (9), (0), (5), (6), () or drops the closing paren.
 * This runs per-option-value so it doesn't conflict with the question statements
 * where (c) might be intact.
 */
function fixGarbledLetterRefs(text: string): string {
  const letters = ["a", "b", "c", "d"] as const;
  const present = new Set<string>();
  for (const l of letters) {
    if (new RegExp(`\\(\\s*${l}\\s*\\)`, "i").test(text)) present.add(l);
  }

  if (present.size === 0) return text;

  // Digits 0,5,6,9 almost always represent garbled (c) in OCR
  const digitTarget = !present.has("c")
    ? "c"
    : letters.find((l) => !present.has(l)) || null;

  if (digitTarget) {
    text = text.replace(/\(\s*[0569]\s*\)/g, `(${digitTarget})`);
    text = text.replace(/\(\s*[0569]\s*$/g, `(${digitTarget})`);
  }

  // Empty parens () → first missing letter
  const firstMissing = letters.find((l) => !present.has(l));
  if (firstMissing && /\(\)/.test(text)) {
    text = text.replace(/\(\)(?=[\s,.]|$)/g, `(${firstMissing})`);
  }

  return text;
}

function fillOptions(opts: Record<string, string>): Record<"A" | "B" | "C" | "D", string> {
  return {
    A: opts["A"] || "",
    B: opts["B"] || "",
    C: opts["C"] || "",
    D: opts["D"] || "",
  };
}

function looksLikeOptionLine(line: string): boolean {
  return (
    /^\s*[(\[]?\s*[A-Da-d]\s*[)\].\-:]\s*.+/.test(line) ||
    /^\s*\(\s*[1-4a-dA-D]\s*\)\s*.+/.test(line)
  );
}

function extractOptionsFromLines(lines: string[]): Record<string, string> {
  const opts: Record<string, string> = {};
  const NUM_TO_LETTER: Record<string, string> = { "1": "A", "2": "B", "3": "C", "4": "D" };

  for (const line of lines) {
    let m = line.match(/^\s*\(\s*([1-4])\s*\)\s*(.+)/);
    if (m) { opts[NUM_TO_LETTER[m[1]] || m[1]] = m[2].trim(); continue; }

    m = line.match(/^\s*\(\s*([a-dA-D])\s*\)\s*(.+)/);
    if (m) { opts[m[1].toUpperCase()] = m[2].trim(); continue; }

    m = line.match(/^\s*[(\[]?\s*([A-Da-d])\s*[)\].\-:]\s*(.+)/);
    if (m) { opts[m[1].toUpperCase()] = m[2].trim(); continue; }
  }
  return opts;
}
