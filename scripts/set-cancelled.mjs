#!/usr/bin/env node
import { copyFileSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const [, , ...args] = process.argv;
// Usage: node scripts/set-cancelled.mjs <quizId>[,quizId2] <1-based numbers comma-separated>
const ids = (args[0] || "").split(",").filter(Boolean);
const nums = (args[1] || "")
  .split(",")
  .map((x) => Number(x.trim()))
  .filter((n) => n > 0);
if (!ids.length || !nums.length) {
  console.error("Usage: node scripts/set-cancelled.mjs <id1,id2> <n1,n2,...>");
  process.exit(2);
}

const quizPath = "public/quizzes.json";
const quizzes = JSON.parse(readFileSync(quizPath, "utf8").replace(/^\uFEFF/, ""));
for (const id of ids) {
  const quiz = quizzes.find((x) => x.id === id);
  if (!quiz) throw new Error(`missing ${id}`);
  for (const n of nums) {
    const q = quiz.questions[n - 1];
    if (!q) throw new Error(`${id}: no index for ${n}`);
    q.cancelled = true;
    if (!Number.isInteger(q.number)) q.number = n;
    console.log(id, n, "ans", q.correctAnswer, "cancelled", true);
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
console.log("OK");
