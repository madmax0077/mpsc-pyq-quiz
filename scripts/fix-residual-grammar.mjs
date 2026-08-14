#!/usr/bin/env node
/**
 * Fix residual grammar issues not caught by flagger:
 * - EN boilerplate distractor lines
 * - MR calques / hinglish fact/सापळा
 * - Leading lowercase English sentences
 */
import { copyFileSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const quizPath = "public/quizzes.json";
const quizzes = JSON.parse(readFileSync(quizPath, "utf8").replace(/^\uFEFF/, ""));

const BOILER =
  /Options?\s+[A-D][\s\S]{0,200}?are incorrect because they apply the wrong concept, unit, or formula for this question\.?\s*(When revising[^.]*\.)?/gi;
const BOILER2 =
  /Wrong options[\s\S]{0,220}?miss the keyed concept, formula, or definition this item tests\.?/gi;
const REVISION = /When revising, link the concept to its definition[^.]*\./gi;

let fixed = 0;

function polishEn(e) {
  let out = e;
  const before = out;
  out = out.replace(BOILER, "").replace(BOILER2, "").replace(REVISION, "");
  out = out.replace(/\s{2,}/g, " ").replace(/\s+([.!?])/g, "$1").trim();
  if (out && /^[a-z]/.test(out)) out = out[0].toUpperCase() + out.slice(1);
  // ensure distractor note if we stripped a lot
  if (out.length < 140 && before.length >= 140) {
    out =
      out.replace(/\.*$/, "") +
      ". The other options use a different symbol, definition, unit, or formula, so they do not match this stem.";
  }
  if (out !== before) fixed++;
  return out;
}

function polishMr(e) {
  let out = e;
  const before = out;
  out = out.replace(/चुकीचे वाचन/g, "चुकीची निवड");
  out = out.replace(/या या /g, "या ");
  out = out.replace(/मंडळात वर/g, "मंडळावर");
  out = out.replace(/सापळा पर्याय पर्याय/g, "सापळा पर्याय");
  out = out.replace(/अर्धवट fact\/सापळा/gi, "अर्धवट किंवा सापळा");
  out = out.replace(/\bfact\/सापळा/gi, "सापळा");
  out = out.replace(/trap distractor/gi, "सापळा पर्याय");
  out = out.replace(/\bkeyed\b/gi, "अधिकृत");
  out = out.replace(/या प्रश्नाच्या मुख्य तथ्याशी जुळत नाहीत/g, "प्रश्नातील योग्य संकल्पनेशी जुळत नाहीत");
  // Fix abusive danda after single Latin initials like म। गो। → म. गो.
  out = out.replace(/([A-Za-z\u0900-\u097F])।\s*([A-Za-z\u0900-\u097F])।/g, "$1. $2.");
  out = out.replace(/\s{2,}/g, " ").trim();
  if (!/[.!?।]$/.test(out)) out += "।";
  if (out !== before) fixed++;
  return out;
}

for (const quiz of quizzes) {
  const isMr = quiz.language === "marathi" || /marathi|_mr$|-mr/i.test(quiz.id || "");
  for (const qq of quiz.questions || []) {
    const e = String(qq.explanation || "");
    qq.explanation = isMr ? polishMr(e) : polishEn(e);
  }
}

const out = JSON.stringify(quizzes, null, 2) + "\n";
const tmp = quizPath + ".tmp";
writeFileSync(tmp, out);
let last;
for (let i = 0; i < 12; i++) {
  try {
    try {
      renameSync(tmp, quizPath);
    } catch {
      copyFileSync(tmp, quizPath);
      try {
        unlinkSync(tmp);
      } catch {
        /* ignore */
      }
    }
    last = null;
    break;
  } catch (e) {
    last = e;
    await sleep(400);
  }
}
if (last) throw last;

// recount
let boiler = 0,
  calque = 0,
  keyed = 0;
for (const quiz of quizzes) {
  for (const qq of quiz.questions || []) {
    const e = qq.explanation || "";
    if (/apply the wrong concept/i.test(e) || /miss the keyed concept/i.test(e)) boiler++;
    if (/चुकीचे वाचन|या या |मंडळात वर|सापळा पर्याय पर्याय/.test(e)) calque++;
    if (/\bkeyed\b/i.test(e)) keyed++;
  }
}
console.log(`OK polished fields=${fixed} remaining boiler=${boiler} calque=${calque} keyed=${keyed}`);
if (boiler || calque || keyed) process.exit(1);
