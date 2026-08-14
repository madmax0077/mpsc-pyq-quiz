#!/usr/bin/env node
/**
 * Patch thin explanations in public/quizzes.json (exam papers).
 * Usage: node scripts/patch-thin-explanations.mjs [patchesJson]
 * Default patches: scripts/thin-explanation-patches.json
 */
import { copyFileSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const patchesPath = process.argv[2] || "scripts/thin-explanation-patches.json";
const quizPath = "public/quizzes.json";
const patches = JSON.parse(readFileSync(patchesPath, "utf8").replace(/^\uFEFF/, ""));

const quizzes = JSON.parse(readFileSync(quizPath, "utf8").replace(/^\uFEFF/, ""));

let applied = 0;
let missing = 0;

for (const patch of patches) {
  const quiz = quizzes.find((x) => x.id === patch.quizId);
  if (!quiz) {
    console.error(`quiz not found: ${patch.quizId}`);
    missing++;
    continue;
  }
  const q = quiz.questions.find((x) => x.number === patch.number);
  if (!q) {
    console.error(`${patch.quizId}: question ${patch.number} not found`);
    missing++;
    continue;
  }
  const exp = String(patch.explanation || "").trim();
  if (exp.length < 140) {
    throw new Error(`${patch.quizId} Q${patch.number}: explanation too short (${exp.length} chars)`);
  }
  if (patch.correctAnswer && q.correctAnswer !== patch.correctAnswer) {
    throw new Error(
      `${patch.quizId} Q${patch.number}: correctAnswer mismatch (quiz=${q.correctAnswer}, patch=${patch.correctAnswer})`
    );
  }
  q.explanation = exp;
  applied++;
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

console.log(`OK patched ${applied} explanations (${missing} missing)`);
