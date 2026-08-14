#!/usr/bin/env node
/**
 * Full site audit of every question explanation.
 * Exit 0 only if clean.
 *
 * Usage: node scripts/audit-all-explanations.mjs [passLabel]
 */
import { readFileSync, writeFileSync } from "node:fs";

const passLabel = process.argv[2] || "audit";
const quizzes = JSON.parse(readFileSync("public/quizzes.json", "utf8").replace(/^\uFEFF/, ""));

const catLike =
  /^(भूगोल|इतिहास|अर्थशास्त्र|विज्ञान|नागरिकशास्त्र|राज्यशास्त्र|गणित|बुद्धिमत्ता|बुद्धिमत्ता चाचणी|सामान्य अध्ययन|सामान्य ज्ञान|current affairs|history|geography|economics|science|polity|aptitude|english|english grammar|english vocabulary|english idioms|marathi|मराठी|मराठी आकलन|general studies|gs|maths?|reasoning|iq|civics|chemistry|physics|biology|botany|zoology|environment|ecology)$/i;

const issues = [];
let total = 0;

for (const quiz of quizzes) {
  const isMr = quiz.language === "marathi" || /marathi|_mr$|-mr$/i.test(quiz.id || "");
  (quiz.questions || []).forEach((qq, i) => {
    total++;
    const e = String(qq.explanation ?? "").trim();
    const n = qq.number || i + 1;
    const base = { quizId: quiz.id, n, id: qq.id, len: e.length, exp: e.slice(0, 100) };

    if (!("explanation" in qq)) {
      issues.push({ ...base, reason: "MISSING_FIELD" });
      return;
    }
    if (!e) {
      issues.push({ ...base, reason: "EMPTY" });
      return;
    }
    if (catLike.test(e)) {
      issues.push({ ...base, reason: "CATEGORY_ONLY" });
      return;
    }
    if (e.length < 80) {
      issues.push({ ...base, reason: "VERY_SHORT" });
      return;
    }
    if (e.length < 140) {
      issues.push({ ...base, reason: "SHORT_LT_140" });
      return;
    }
    if (/Hence\s*\(/i.test(e)) {
      issues.push({ ...base, reason: "HENCE" });
      return;
    }
    if (/exam placeholder|placeholder stem|key defer|Original exam:|TODO|FIXME|lorem ipsum/i.test(e)) {
      issues.push({ ...base, reason: "PLACEHOLDER" });
      return;
    }
    if (/^(option|पर्याय)\s*[A-D]\.?$/i.test(e)) {
      issues.push({ ...base, reason: "OPTION_ONLY" });
      return;
    }
    if (qq.category && e === String(qq.category).trim()) {
      issues.push({ ...base, reason: "EQUALS_CATEGORY" });
      return;
    }

    const qHasDev = /[\u0900-\u097F]/.test(String(qq.text || ""));
    const eHasDev = /[\u0900-\u097F]/.test(e);
    if (isMr && qHasDev && !eHasDev) {
      issues.push({ ...base, reason: "MR_Q_EN_EXP" });
    }
  });
}

const byReason = {};
const byQuiz = {};
for (const x of issues) {
  byReason[x.reason] = (byReason[x.reason] || 0) + 1;
  byQuiz[x.quizId] = (byQuiz[x.quizId] || 0) + 1;
}

const report = { passLabel, total, issueCount: issues.length, byReason, byQuiz, issues };
writeFileSync(`_audit_${passLabel}.json`, JSON.stringify(report, null, 2));

console.log(`${passLabel}: totalQ=${total} issues=${issues.length}`);
if (issues.length) {
  console.log("byReason", byReason);
  console.log(
    "byQuiz",
    Object.entries(byQuiz)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k}:${v}`)
      .join(", ")
  );
  process.exit(1);
}
console.log(`${passLabel}: CLEAN`);
process.exit(0);
