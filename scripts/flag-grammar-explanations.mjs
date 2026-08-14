#!/usr/bin/env node
/**
 * Flag explanations with telegraphic / Hinglish / typo / English-dominant-MR issues.
 * Writes _grammar_queue.json ranked by bad-count (Marathi quizzes first).
 *
 * Usage: node scripts/flag-grammar-explanations.mjs
 * Exit 1 if any flags (unless --report-only).
 */
import { readFileSync, writeFileSync } from "node:fs";

const reportOnly = process.argv.includes("--report-only");
const quizzes = JSON.parse(readFileSync("public/quizzes.json", "utf8").replace(/^\uFEFF/, ""));

const TELEGRAPHIC =
  /\b(keyed|misread|under-read|fail|fails|trap distractor|option letter|stem\/logic|partial fact)\b/i;
const EN_TYPO =
  /\b(teh|recieve|seperate|occured|definately|wich|thier|alot|more better|dont|doesnt|isnt|wasnt|wont|cant)\b/i;
const HINGLISH_VERB =
  /\b(drop करणारे|fail\.|misread\.|under-read|networking|assertion —|alone insufficient|omit करणारे)\b/i;

function isMarathiQuiz(quiz) {
  return quiz.language === "marathi" || /marathi|_mr$|-mr/i.test(quiz.id || "");
}

function latinWordCount(s) {
  return (String(s).match(/[A-Za-z]{3,}/g) || []).length;
}

function devWordCount(s) {
  return (String(s).match(/[\u0900-\u097F]+/g) || []).length;
}

function flagExplanation(e, isMr, qHasDev) {
  const reasons = [];
  if (!e) {
    reasons.push("empty");
    return reasons;
  }
  if (TELEGRAPHIC.test(e)) reasons.push("telegraphic");
  if (EN_TYPO.test(e)) reasons.push("en_typo");
  if (HINGLISH_VERB.test(e)) reasons.push("hinglish");
  if (isMr && qHasDev) {
    const lat = latinWordCount(e);
    const dev = devWordCount(e);
    if (dev === 0) reasons.push("mr_no_dev");
    else if (lat > dev * 1.5 && lat >= 8) reasons.push("mr_en_dominant");
    // English-heavy body even when some Devanagari wrappers exist
    else if (lat >= 12 && lat > dev) reasons.push("mr_en_heavy");
  }
  // single fragment: no . ! ? । and long
  if (e.length >= 120 && !/[.!?।]/.test(e)) reasons.push("no_sentence_punct");
  return reasons;
}

const byQuiz = new Map();
const items = [];
let totalFlagged = 0;

for (const quiz of quizzes) {
  const isMr = isMarathiQuiz(quiz);
  const quizFlags = [];
  (quiz.questions || []).forEach((qq, i) => {
    const e = String(qq.explanation || "").trim();
    const qHasDev = /[\u0900-\u097F]/.test(String(qq.text || ""));
    const reasons = flagExplanation(e, isMr, qHasDev);
    if (!reasons.length) return;
    totalFlagged++;
    const row = {
      quizId: quiz.id,
      i,
      n: qq.number || i + 1,
      isMr,
      reasons,
      ans: qq.correctAnswer,
      exp: e.slice(0, 160),
    };
    quizFlags.push(row);
    items.push(row);
  });
  if (quizFlags.length) {
    byQuiz.set(quiz.id, {
      id: quiz.id,
      isMr,
      title: String(quiz.title || "").slice(0, 60),
      n: quiz.questions.length,
      bad: quizFlags.length,
      reasons: quizFlags.reduce((acc, x) => {
        for (const r of x.reasons) acc[r] = (acc[r] || 0) + 1;
        return acc;
      }, {}),
    });
  }
}

const ranked = [...byQuiz.values()].sort((a, b) => {
  if (a.isMr !== b.isMr) return a.isMr ? -1 : 1;
  return b.bad - a.bad;
});

const out = {
  totalQuestions: quizzes.reduce((s, x) => s + (x.questions || []).length, 0),
  totalFlagged,
  quizzesFlagged: ranked.length,
  ranked,
  items,
};
writeFileSync("_grammar_queue.json", JSON.stringify(out, null, 2));

console.log(`flagged=${totalFlagged} quizzes=${ranked.length}`);
for (const r of ranked.slice(0, 40)) {
  console.log(`  ${r.isMr ? "MR" : "EN"} ${r.id}: ${r.bad}/${r.n}`, JSON.stringify(r.reasons));
}
if (ranked.length > 40) console.log(`  ... +${ranked.length - 40} more`);

if (!reportOnly && totalFlagged) process.exit(1);
process.exit(0);
