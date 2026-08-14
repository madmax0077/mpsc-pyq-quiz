#!/usr/bin/env node
/**
 * Report thin / category-label explanations.
 * Exit 0 if none (or only allowlist), else 1.
 *
 * Usage:
 *   node scripts/check-thin-explanations.mjs [minChars=120]
 */
import { readFileSync, writeFileSync } from "node:fs";

const minChars = Number(process.argv[2] || 120);
const quizzes = JSON.parse(readFileSync("public/quizzes.json", "utf8").replace(/^\uFEFF/, ""));

const catLike =
  /^(भूगोल|इतिहास|अर्थशास्त्र|विज्ञान|नागरिकशास्त्र|राज्यशास्त्र|गणित|बुद्धिमत्ता|बुद्धिमत्ता चाचणी|current affairs|history|geography|economics|science|polity|aptitude|english grammar|english vocabulary|english idioms|marathi|मराठी|मराठी आकलन|general studies|gs|सामान्य अध्ययन|english|सामान्य ज्ञान)$/i;

function isThin(e) {
  e = String(e || "").trim();
  if (!e) return "empty";
  if (catLike.test(e)) return "category";
  if (e.length < minChars) return `short<${minChars}`;
  if (/^(option|पर्याय)\s*[A-D]\.?$/i.test(e)) return "option-only";
  if (/exam placeholder|placeholder stem|key defer/i.test(e)) return "placeholder";
  return null;
}

const rows = [];
let total = 0;
for (const quiz of quizzes) {
  const items = [];
  quiz.questions.forEach((qq, i) => {
    const reason = isThin(qq.explanation);
    if (reason) {
      items.push({
        n: qq.number || i + 1,
        reason,
        exp: String(qq.explanation || "").slice(0, 80),
      });
    }
  });
  if (items.length) {
    rows.push({
      id: quiz.id,
      thin: items.length,
      n: quiz.questions.length,
      items: items.slice(0, 5),
    });
    total += items.length;
  }
}

writeFileSync(
  "_thin_report.json",
  JSON.stringify({ minChars, total, quizzes: rows.length, rows }, null, 2)
);
console.log(`thin=${total} quizzes=${rows.length} minChars=${minChars}`);
if (rows.length) {
  for (const r of rows.slice(0, 40)) {
    console.log(`  ${r.id}: ${r.thin}/${r.n}`);
  }
  if (rows.length > 40) console.log(`  ... +${rows.length - 40} more`);
}
process.exit(total ? 1 : 0);
