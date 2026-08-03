/**
 * Reports the practice pool each CSAT topic will actually show in the app,
 * per language, combining previous-year questions with the generated bank.
 *
 * Usage:  node scripts/csat/pool-report.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");

const quizzes = JSON.parse(fs.readFileSync(path.join(ROOT, "public", "quizzes.json"), "utf8"));
const bank = JSON.parse(fs.readFileSync(path.join(ROOT, "public", "csat-questions.json"), "utf8"));

// Mirrors the match rules declared in lib/csat.ts for the topics that draw PYQs.
const src = fs.readFileSync(path.join(ROOT, "lib", "csat.ts"), "utf8");
const topics = [];
const topicRe = /id:\s*"([a-z0-9-]+)",\s*\n\s*name:\s*"([^"]+)",\s*\n\s*stream:/g;
let m;
while ((m = topicRe.exec(src)) !== null) {
  const after = src.slice(topicRe.lastIndex, topicRe.lastIndex + 1200);
  const lessonOnly = /lessonOnly:\s*true/.test(after.split("lesson:")[0] || "");
  topics.push({ id: m[1], name: m[2], lessonOnly });
}

function matchesFor(topicId) {
  const idx = src.indexOf(`id: "${topicId}"`);
  const slice = src.slice(idx, idx + 1200);
  const mm = slice.match(/match:\s*\[([\s\S]*?)\]/);
  if (!mm) return [];
  const out = [];
  const re = /category:\s*"([^"]+)",\s*topic:\s*"([^"]+)"/g;
  let r;
  while ((r = re.exec(mm[1])) !== null) out.push({ category: r[1], topic: r[2] });
  return out;
}

const isCancelled = (q) =>
  q.cancelled === true || /cancel/i.test(q.explanation || "") === false ? q.cancelled === true : true;

function usableQuestion(q) {
  if (q.cancelled === true) return false;
  if (!q.correctAnswer) return false;
  if (!q.text || !q.text.trim()) return false;
  const o = q.options || {};
  return ["A", "B", "C", "D"].every((k) => o[k] && String(o[k]).trim());
}

// Must stay in step with dedupeKey in lib/csat.ts.
const dedupe = (t) => t.replace(/\s+/g, " ").trim().toLowerCase();

function pool(topicId, language) {
  const seen = new Set();
  let bankCount = 0;
  let pyqCount = 0;

  for (const q of bank.questions) {
    if (q.topicId !== topicId) continue;
    const text = language === "marathi" ? q.mr.text : q.en.text;
    const k = dedupe(text);
    if (seen.has(k)) continue;
    seen.add(k);
    bankCount += 1;
  }

  const matches = matchesFor(topicId);
  if (matches.length) {
    for (const quiz of quizzes) {
      if (quiz.id === "__copyright__") continue;
      if (quiz.examType && quiz.examType !== "MPSC") continue;
      const lang = quiz.language === "marathi" ? "marathi" : "english";
      if (lang !== language) continue;
      for (const q of quiz.questions || []) {
        if (!usableQuestion(q)) continue;
        if (!matches.some((mt) => q.category === mt.category && q.topic === mt.topic)) continue;
        const k = dedupe(q.text);
        if (seen.has(k)) continue;
        seen.add(k);
        pyqCount += 1;
      }
    }
  }
  return { bankCount, pyqCount, total: bankCount + pyqCount };
}

const TARGET = 200;
console.log("topic".padEnd(34) + "EN(bank+pyq=tot)".padEnd(24) + "MR(bank+pyq=tot)");
console.log("-".repeat(80));

let below = 0;
let practiceTopics = 0;
for (const t of topics) {
  const en = pool(t.id, "english");
  const mr = pool(t.id, "marathi");
  const fmt = (p) => `${p.bankCount}+${p.pyqCount}=${p.total}`.padEnd(24);
  if (t.lessonOnly) {
    console.log(t.id.padEnd(34) + "".padEnd(48) + "lesson only, no practice set");
    continue;
  }
  practiceTopics += 1;
  const flag = en.total >= TARGET && mr.total >= TARGET ? "" : "   <-- below target";
  if (flag) below += 1;
  console.log(t.id.padEnd(34) + fmt(en) + fmt(mr) + flag);
}
console.log("-".repeat(80));
console.log(
  `${practiceTopics - below} of ${practiceTopics} practice topics reach ${TARGET}+ in both languages.`,
);
