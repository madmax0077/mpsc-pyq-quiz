#!/usr/bin/env node
/**
 * Apply explanations to a single quiz (topic tests / unpaired).
 * Usage: node scripts/apply-topic-explanations.mjs <quizId> <expJson>
 */
import { copyFileSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const [, , quizId, expPath] = process.argv;
if (!quizId || !expPath) {
  console.error("Usage: node scripts/apply-topic-explanations.mjs <quizId> <expJson>");
  process.exit(2);
}

const quizPath = "public/quizzes.json";
const quizzes = JSON.parse(readFileSync(quizPath, "utf8").replace(/^\uFEFF/, ""));
const exps = JSON.parse(readFileSync(expPath, "utf8"));
const quiz = quizzes.find((x) => x.id === quizId);
if (!quiz) throw new Error(`quiz not found: ${quizId}`);
if (exps.length !== quiz.questions.length) {
  throw new Error(`${quizId}: exp ${exps.length} != questions ${quiz.questions.length}`);
}
const empty = exps.filter((e) => !String(e || "").trim()).length;
if (empty) throw new Error(`${quizId}: ${empty} empty explanations`);

quiz.questions.forEach((q, i) => {
  q.explanation = String(exps[i]).trim();
  if (!Number.isInteger(q.number) || q.number <= 0) q.number = i + 1;
});
if ("language" in quiz && quiz.language !== "marathi") {
  delete quiz.language;
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
console.log(`OK applied ${exps.length} -> ${quizId}`);
