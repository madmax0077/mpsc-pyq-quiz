#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";

const quizId = process.argv[2];
const outPrefix = process.argv[3] || quizId;
if (!quizId) {
  console.error("Usage: node scripts/extract-quiz-work.mjs <quizId> [outPrefix]");
  process.exit(2);
}

const quizzes = JSON.parse(readFileSync("public/quizzes.json", "utf8").replace(/^\uFEFF/, ""));
const en = quizzes.find((x) => x.id === quizId);
if (!en) throw new Error(`quiz not found: ${quizId}`);

const slim = en.questions.map((q, i) => ({
  i: i + 1,
  id: q.id,
  text: q.text,
  options: q.options,
  correctAnswer: q.correctAnswer,
  cancelled: !!q.cancelled || q.correctAnswer === "CANCELLED",
  category: q.category || "",
  explanation: q.explanation || "",
}));

writeFileSync(`_${outPrefix}_en_work.json`, JSON.stringify(slim, null, 2));

const lines = slim
  .map((q) => {
    const stem = String(q.text || "").replace(/\s+/g, " ").slice(0, 500);
    return [
      `Q${q.i} [${q.correctAnswer}]${q.cancelled ? " CANCELLED" : ""}`,
      stem,
      `A) ${q.options?.A ?? ""}`,
      `B) ${q.options?.B ?? ""}`,
      `C) ${q.options?.C ?? ""}`,
      `D) ${q.options?.D ?? ""}`,
    ].join("\n");
  })
  .join("\n\n");

writeFileSync(`_${outPrefix}_en_compact.txt`, lines);
console.log(
  "wrote",
  slim.length,
  "cancelled",
  slim.filter((x) => x.cancelled).map((x) => x.i).join(",") || "none",
  "chars",
  lines.length
);
