#!/usr/bin/env node
/**
 * Merge explanations from an explained quizzes.json onto the current catalog
 * WITHOUT removing or replacing any quizzes.
 *
 * Usage:
 *   node scripts/merge-explanations-safe.mjs <explainedSource>
 * explainedSource: git ref path like "6e71331:public/quizzes.json" OR a file path
 */
import { execSync } from "node:child_process";
import { copyFileSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const srcArg = process.argv[2] || "6e71331:public/quizzes.json";
const quizPath = "public/quizzes.json";

function loadJson(src) {
  if (src.includes(":") && !src.match(/^[A-Za-z]:\\/)) {
    // git ref:path
    const raw = execSync(`git show ${src}`, { maxBuffer: 150 * 1024 * 1024 }).toString();
    return JSON.parse(raw.replace(/^\uFEFF/, ""));
  }
  return JSON.parse(readFileSync(src, "utf8").replace(/^\uFEFF/, ""));
}

const current = JSON.parse(readFileSync(quizPath, "utf8").replace(/^\uFEFF/, ""));
const explained = loadJson(srcArg);
const beforeCount = current.length;
const expById = new Map(explained.map((q) => [q.id, q]));

let quizzesUpdated = 0;
let questionsPatched = 0;
let skippedNoMatch = 0;

for (const quiz of current) {
  const src = expById.get(quiz.id);
  if (!src) continue;

  const byId = new Map(src.questions.map((q) => [q.id, q]));
  const byNumber = new Map(
    src.questions.filter((q) => Number.isInteger(q.number)).map((q) => [q.number, q])
  );

  let patchedHere = 0;
  quiz.questions.forEach((q, i) => {
    const match =
      (q.id && byId.get(q.id)) ||
      (Number.isInteger(q.number) && byNumber.get(q.number)) ||
      src.questions[i];
    if (!match) {
      skippedNoMatch++;
      return;
    }
    // Safety: only copy explanation-related fields; never change correctAnswer
    const newExp = String(match.explanation || "").trim();
    if (!newExp) return;

    const oldExp = String(q.explanation || "").trim();
    // Prefer longer/deeper explanation if both exist; always take new if old empty/thin category
    const catLike =
      /^(भूगोल|इतिहास|अर्थशास्त्र|विज्ञान|history|geography|economics|science|polity|aptitude|english grammar|english vocabulary|current affairs|marathi|मराठी)$/i;
    const oldThin = !oldExp || oldExp.length < 80 || catLike.test(oldExp);
    if (oldThin || newExp.length >= oldExp.length * 0.8) {
      q.explanation = newExp;
      patchedHere++;
      questionsPatched++;
    }
    if (match.cancelled === true) q.cancelled = true;
    if (Number.isInteger(match.number) && (!Number.isInteger(q.number) || q.number <= 0)) {
      q.number = match.number;
    }
  });

  // Strip invalid language:english on EN quizzes if explained version had it cleaned
  if ("language" in quiz && quiz.language !== "marathi" && quiz.language !== undefined) {
    // keep marathi; remove mistaken english language field only
    if (String(quiz.language).toLowerCase() === "english") delete quiz.language;
  }

  if (patchedHere) quizzesUpdated++;
}

if (current.length !== beforeCount) {
  throw new Error(`REFUSING WRITE: quiz count changed ${beforeCount} -> ${current.length}`);
}

// Backup current before write
copyFileSync(quizPath, "public/quizzes.json.bak-pre-merge-explanations");

const out = JSON.stringify(current, null, 2) + "\n";
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

const verify = JSON.parse(readFileSync(quizPath, "utf8").replace(/^\uFEFF/, ""));
if (verify.length !== beforeCount) {
  throw new Error(`VERIFY FAIL: count ${verify.length} != ${beforeCount}`);
}

console.log(
  JSON.stringify(
    {
      source: srcArg,
      quizzesKept: verify.length,
      quizzesUpdated,
      questionsPatched,
      skippedNoMatch,
      rto: verify.filter((x) => /rto/i.test(x.id)).map((x) => x.id),
    },
    null,
    2
  )
);
