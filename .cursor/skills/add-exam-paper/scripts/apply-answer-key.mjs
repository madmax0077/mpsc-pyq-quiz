#!/usr/bin/env node
/**
 * Apply an answer key to one or more quizzes in quizzes.json (in place).
 *
 * Usage:
 *   node apply-answer-key.mjs <quizzes.json> <quizId[,quizId2,...]> <answerkey.json>
 *
 * answerkey.json is a flat map of ORIGINAL question number -> answer letter,
 * where the value "CANCELLED" (or "#") marks a cancelled question:
 *   { "1": "A", "2": "C", "33": "CANCELLED", "34": "B" }
 *
 * For each targeted quiz, every question is matched by its `number` field and
 * gets `correctAnswer` set (and `cancelled: true` where the key says so).
 * Numbers present in the key but missing from the quiz, and vice-versa, are
 * reported. The file is rewritten pretty-printed (2 spaces) only if all
 * targeted quizzes were found.
 */
import { readFileSync, writeFileSync } from "node:fs";

const [, , quizzesPath, quizIdsArg, keyPath] = process.argv;
if (!quizzesPath || !quizIdsArg || !keyPath) {
  console.error("Usage: node apply-answer-key.mjs <quizzes.json> <quizId[,quizId2]> <answerkey.json>");
  process.exit(2);
}

const readJson = (p) => JSON.parse(readFileSync(p, "utf8").replace(/^\uFEFF/, ""));

const quizIds = quizIdsArg.split(",").map((s) => s.trim()).filter(Boolean);
const quizzes = readJson(quizzesPath);
const rawKey = readJson(keyPath);

const isCancelled = (v) => v === "#" || String(v).toUpperCase() === "CANCELLED";
const key = new Map();
for (const [num, val] of Object.entries(rawKey)) {
  key.set(Number(num), isCancelled(val) ? "CANCELLED" : String(val).toUpperCase());
}

let hadError = false;
for (const id of quizIds) {
  const quiz = quizzes.find((q) => q.id === id);
  if (!quiz) {
    console.error(`ERROR: quiz id not found: ${id}`);
    hadError = true;
    continue;
  }
  const seen = new Set();
  let applied = 0;
  for (const q of quiz.questions) {
    if (typeof q.number !== "number") {
      console.error(`ERROR [${id}]: question ${q.id} has no numeric "number"`);
      hadError = true;
      continue;
    }
    seen.add(q.number);
    if (!key.has(q.number)) {
      console.error(`WARN  [${id}]: no answer-key entry for number ${q.number}`);
      continue;
    }
    const ans = key.get(q.number);
    if (ans === "CANCELLED") {
      q.cancelled = true;
    } else if (["A", "B", "C", "D"].includes(ans)) {
      q.correctAnswer = ans;
      delete q.cancelled;
    } else {
      console.error(`ERROR [${id}]: bad key value "${ans}" for number ${q.number}`);
      hadError = true;
      continue;
    }
    applied++;
  }
  for (const num of key.keys()) {
    if (!seen.has(num)) console.error(`WARN  [${id}]: key has number ${num} but quiz has no such question`);
  }
  console.log(`${id}: applied ${applied}/${quiz.questions.length} questions`);
}

if (hadError) {
  console.error("Aborted: fix the ERROR lines above; file NOT written.");
  process.exit(1);
}

writeFileSync(quizzesPath, JSON.stringify(quizzes, null, 2) + "\n");
console.log("OK: answer key applied.");
