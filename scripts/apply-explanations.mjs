#!/usr/bin/env node
/**
 * Apply EN (+ optional MR) explanation arrays onto quiz ids in quizzes.json.
 *
 * Usage:
 *   node scripts/apply-explanations.mjs <enId> <enExpJson> [mrId] [mrExpJson]
 *
 * Also: adds missing number 1..N, strips language:"english" from EN quiz.
 */
import { copyFileSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const [, , enId, enPath, mrId, mrPath] = process.argv;
if (!enId || !enPath) {
  console.error("Usage: node scripts/apply-explanations.mjs <enId> <enExpJson> [mrId] [mrExpJson]");
  process.exit(2);
}

const quizPath = "public/quizzes.json";
const quizzes = JSON.parse(readFileSync(quizPath, "utf8").replace(/^\uFEFF/, ""));
const enExps = JSON.parse(readFileSync(enPath, "utf8"));

function apply(id, exps, stripEnglishLang) {
  const quiz = quizzes.find((x) => x.id === id);
  if (!quiz) throw new Error(`quiz not found: ${id}`);
  if (exps.length !== quiz.questions.length) {
    throw new Error(`${id}: exp count ${exps.length} != questions ${quiz.questions.length}`);
  }
  const empty = exps.filter((e) => !String(e || "").trim()).length;
  if (empty) throw new Error(`${id}: ${empty} empty explanations`);
  quiz.questions.forEach((q, i) => {
    q.explanation = String(exps[i]).trim();
    if (!Number.isInteger(q.number) || q.number <= 0) q.number = i + 1;
  });
  if (stripEnglishLang && "language" in quiz && quiz.language !== "marathi") {
    delete quiz.language;
  }
  return quiz.questions.length;
}

const nEn = apply(enId, enExps, true);
console.log(`Applied ${nEn} EN explanations -> ${enId}`);

if (mrId && mrPath) {
  const mrExps = JSON.parse(readFileSync(mrPath, "utf8"));
  const nMr = apply(mrId, mrExps, false);
  const en = quizzes.find((x) => x.id === enId);
  const mr = quizzes.find((x) => x.id === mrId);
  for (let i = 0; i < en.questions.length; i++) {
    if (en.questions[i].correctAnswer !== mr.questions[i].correctAnswer) {
      throw new Error(`Answer mismatch at index ${i}`);
    }
  }
  console.log(`Applied ${nMr} MR explanations -> ${mrId}`);
}

const out = JSON.stringify(quizzes, null, 2) + "\n";
const tmp = quizPath + ".tmp";
writeFileSync(tmp, out);

async function commitWrite() {
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
      return;
    } catch (e) {
      last = e;
      await sleep(400);
    }
  }
  throw last;
}

await commitWrite();
console.log("OK wrote", quizPath);
