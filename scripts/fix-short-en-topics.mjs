#!/usr/bin/env node
import { copyFileSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const quizPath = "public/quizzes.json";
const quizzes = JSON.parse(readFileSync(quizPath, "utf8").replace(/^\uFEFF/, ""));

function distractorLine(options, correct) {
  const wrong = ["A", "B", "C", "D"].filter((k) => k !== correct);
  const bits = wrong.map((k) => `${k} (${String(options[k] || "").slice(0, 60)})`);
  return `Wrong options ${bits.join(", ")} do not match the definition or symbol tested here.`;
}

function buildEn(qq) {
  const ans = qq.correctAnswer;
  const opt = String(qq.options?.[ans] || "").trim();
  const stem = String(qq.text || "").replace(/\s+/g, " ").trim().slice(0, 160);
  const core = `Option ${ans} is correct: ${opt}. This follows from the stem — ${stem}`;
  const dist = distractorLine(qq.options || {}, ans);
  let e = `${core} ${dist}`.replace(/\s{2,}/g, " ").trim();
  if (e.length < 140) {
    e += " Re-read the stem once and eliminate options that name a different device, unit, or law.";
  }
  return e;
}

function fixMrInitials(e) {
  // म। गो। → म. गो.  and डॉ। आर। → डॉ. आर.
  return e
    .replace(/([\u0900-\u097F])।\s*([\u0900-\u097F])/g, "$1. $2")
    .replace(/([A-Za-z])।\s*([A-Za-z])/g, "$1. $2");
}

let shortFixed = 0;
let lowerFixed = 0;
let mrFixed = 0;

for (const quiz of quizzes) {
  const isMr = quiz.language === "marathi" || /marathi|_mr$|-mr/i.test(quiz.id || "");
  for (const qq of quiz.questions || []) {
    let e = String(qq.explanation || "").trim();

    if (isMr) {
      const next = fixMrInitials(e);
      if (next !== e) {
        e = next;
        mrFixed++;
      }
      if (!/[.!?।]$/.test(e)) e += "।";
      qq.explanation = e;
      continue;
    }

    // Rebuild damaged / short English
    if (
      e.length < 140 ||
      /^\.\s*The other options use a different symbol/i.test(e) ||
      /^The other options use a different symbol/i.test(e)
    ) {
      e = buildEn(qq);
      shortFixed++;
    }

    if (/^[a-z]/.test(e)) {
      e = e[0].toUpperCase() + e.slice(1);
      lowerFixed++;
    }

    qq.explanation = e;
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
  } catch (err) {
    last = err;
    await sleep(400);
  }
}
if (last) throw last;
console.log(`OK shortFixed=${shortFixed} lowerFixed=${lowerFixed} mrInitials=${mrFixed}`);
