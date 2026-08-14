#!/usr/bin/env node
/**
 * Validate a newly added English + Marathi quiz pair in quizzes.json.
 *
 * Usage:
 *   node validate-quiz.mjs <quizzes.json> <englishQuizId> <marathiQuizId>
 *
 * Checks (per quiz):
 *   - unique question ids
 *   - options has exactly A,B,C,D and all non-empty
 *   - correctAnswer is A-D  (unless cancelled: true)
 *   - number is a positive integer and unique
 *   - explanation present, non-empty, and NOT containing "Hence ("
 * Cross-language:
 *   - identical set of numbers
 *   - identical correctAnswer per number
 *   - identical cancelled set
 *
 * Prints "OK" and exits 0 when clean; otherwise lists problems and exits 1.
 */
import { readFileSync } from "node:fs";

const [, , quizzesPath, enId, mrId] = process.argv;
if (!quizzesPath || !enId || !mrId) {
  console.error("Usage: node validate-quiz.mjs <quizzes.json> <englishQuizId> <marathiQuizId>");
  process.exit(2);
}

const quizzes = JSON.parse(readFileSync(quizzesPath, "utf8").replace(/^\uFEFF/, ""));
const errors = [];

function getQuiz(id) {
  const q = quizzes.find((x) => x.id === id);
  if (!q) errors.push(`quiz id not found: ${id}`);
  return q;
}

function checkQuiz(quiz, label, expectLang) {
  if (!quiz) return null;
  if (expectLang === "marathi" && quiz.language !== "marathi") {
    errors.push(`[${label}] expected "language":"marathi"`);
  }
  if (expectLang === "english" && quiz.language) {
    errors.push(`[${label}] English quiz must NOT have a "language" field`);
  }
  const ids = new Set();
  const numbers = new Set();
  const byNumber = new Map();
  for (const q of quiz.questions) {
    if (ids.has(q.id)) errors.push(`[${label}] duplicate question id: ${q.id}`);
    ids.add(q.id);

    const keys = Object.keys(q.options || {}).sort().join("");
    if (keys !== "ABCD") errors.push(`[${label}] ${q.id}: options keys must be A,B,C,D (got "${keys}")`);
    else for (const k of ["A", "B", "C", "D"]) {
      if (!String(q.options[k] ?? "").trim()) errors.push(`[${label}] ${q.id}: empty option ${k}`);
    }

    if (!q.cancelled && !["A", "B", "C", "D"].includes(q.correctAnswer)) {
      errors.push(`[${label}] ${q.id}: correctAnswer must be A-D (got "${q.correctAnswer}")`);
    }

    if (!Number.isInteger(q.number) || q.number <= 0) {
      errors.push(`[${label}] ${q.id}: "number" must be a positive integer`);
    } else {
      if (numbers.has(q.number)) errors.push(`[${label}] duplicate number: ${q.number}`);
      numbers.add(q.number);
      byNumber.set(q.number, q);
    }

    const exp = String(q.explanation ?? "").trim();
    if (!exp) errors.push(`[${label}] ${q.id}: missing explanation`);
    else if (/Hence\s*\(/.test(exp)) errors.push(`[${label}] ${q.id}: explanation uses robotic "Hence (X)."`);
  }
  return { numbers, byNumber };
}

const en = getQuiz(enId);
const mr = getQuiz(mrId);
const enInfo = checkQuiz(en, "EN", "english");
const mrInfo = checkQuiz(mr, "MR", "marathi");

if (enInfo && mrInfo) {
  const enNums = [...enInfo.numbers].sort((a, b) => a - b);
  const mrNums = [...mrInfo.numbers].sort((a, b) => a - b);
  if (enNums.join(",") !== mrNums.join(",")) {
    errors.push(`EN/MR number sets differ. EN-only: [${enNums.filter((n) => !mrInfo.numbers.has(n))}] MR-only: [${mrNums.filter((n) => !enInfo.numbers.has(n))}]`);
  }
  for (const n of enNums) {
    const a = enInfo.byNumber.get(n);
    const b = mrInfo.byNumber.get(n);
    if (!b) continue;
    if ((a.cancelled || false) !== (b.cancelled || false)) errors.push(`number ${n}: cancelled flag differs between EN and MR`);
    if (a.correctAnswer !== b.correctAnswer) errors.push(`number ${n}: correctAnswer differs (EN ${a.correctAnswer} vs MR ${b.correctAnswer})`);
  }
}

if (errors.length) {
  console.error(`FAILED with ${errors.length} problem(s):`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
const count = en ? en.questions.length : 0;
console.log(`OK: ${enId} & ${mrId} valid (${count} questions each).`);
