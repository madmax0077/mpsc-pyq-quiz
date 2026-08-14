#!/usr/bin/env node
/**
 * Replace generic distractor boilerplate with question-specific reasoning.
 * Usage: node scripts/fix-boilerplate-explanations.mjs [--apply]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const apply = process.argv.includes("--apply");
const MIN_LEN = 140;

const BOILERPLATE_SUFFIX =
  "are incorrect because they apply the wrong concept, unit, or formula for this question";

function stripGenericDistractor(text) {
  let s = text;
  // Remove from "Options A..." through the fixed boilerplate suffix (handles periods inside option text)
  const idx = s.search(/Options [A-D]/i);
  if (idx >= 0) {
    const suffixIdx = s.indexOf(BOILERPLATE_SUFFIX, idx);
    if (suffixIdx >= 0) {
      const end = suffixIdx + BOILERPLATE_SUFFIX.length;
      const tail = s.slice(end).replace(/^\.?\s*/, "");
      s = s.slice(0, idx).trim() + (tail ? " " + tail : "");
    }
  }
  s = s.replace(
    /You can eliminate [A-D][\s\S]*?conflicts with the principle or calculation that leads to option [A-D]\.?\s*/gi,
    ""
  );
  s = s.replace(
    /Distractors [A-D][\s\S]*?look plausible but do not follow from the facts stated in the question\.?\s*/gi,
    ""
  );
  return s;
}

const BOILERPLATE_DIST = null; // replaced by stripGenericDistractor

const REV_PATS = [
  /When revising, link the concept to its definition, formula, and unit so near-miss options are easier to eliminate\.?\s*/gi,
  /MPSC papers often recycle this type of detail, so read the question carefully before you commit to an option\.?\s*/gi,
  /If the question asks what is incorrect, identify the false statement first and then match it to the answer choice\.?\s*/gi,
  /Store the reasoning behind the answer, not just the letter, because topic packs revisit the same idea in different forms\.?\s*/gi,
  /Keep the name, formula, and unit together in your notes — that helps you spot incomplete distractors quickly\.?\s*/gi,
  /MPSC-style papers often repeat this kind of detail — re-read the stem once before locking the answer\.?\s*/gi,
  /Near-miss distractors are common; keep the core concept, formula, and unit triangle in mind\.?\s*/gi,
  /Topic packs may revisit this point — store the keyed fact with its reason, not just the letter\.?\s*/gi,
  /Keep the name, formula, and unit together — that blocks the usual partial-logic traps\.?\s*/gi,
  /Keep the name, formula, and unit together when you revise\.?\s*/gi,
];

const OPENER_PATS = [
  /^Working through it, option [A-D] is the one\.?\s*/i,
  /^Straight to the answer — option [A-D]\.?\s*/i,
  /^The right pick is option [A-D]\.?\s*/i,
  /^The verified answer here is option [A-D]\.?\s*/i,
  /^Per the exam key, option [A-D]\.?\s*/i,
  /^The examiner has marked option [A-D]\.?\s*/i,
  /^Option [A-D] —\s*/i,
  /^Option [A-D] is correct because\s*/i,
  /^The answer is option [A-D]:\s*/i,
  /^Option [A-D] matches the question because\s*/i,
  /^Choose option [A-D]:\s*/i,
  /^Option [A-D] is the right choice since\s*/i,
  /^The correct answer is option [A-D] —\s*/i,
  /^Option [A-D] works here because\s*/i,
];

const ORIGINALS = {
  "topic-science-test-29-electricity-en": "_topic_electricity_en_all.json",
  "topic-science-test-34-magnetism-and-electromagnetic-spectrum-en": "_topic_magnetism_en_all.json",
  "topic-science-test-27-light-en": "_topic_light_en_all.json",
  "topic-science-test-41-health-science-en": "_topic_health_en_all.json",
  "topic-science-test-36-electricity-numerical-worksheet-en": "_topic_t36_elec_num_en_all.json",
  "topic-science-test-37-acid-base-and-salt-en": "_topic_t37_acid_en_all.json",
  "topic-science-test-25-surface-tension-en": "_topic_t25_surface_en_all.json",
  "topic-science-test-35-concept-of-matter-and-chemical-classificatio-en": "_topic_t35_matter_en_all.json",
  "topic-science-test-38-atom-and-its-structure-en": "_topic_t38_atom_en_all.json",
  "gbc-pre-2023-english": "_gbc23_en_all.json",
  "topic-science-test-39-botany-en": "_topic_botany_en_all.json",
  "sb-pre-2021-english": "_sb21_en_all.json",
  "topic-science-test-30-sound-numerical-en": "_topic_t30_sound_en_all.json",
  "topic-science-test-40-zoology-en": "_topic_zoology_en_all.json",
  "cs-pre-2023-english": "_cs23_en_all.json",
  "sb-pre-2022-english": "_sb22_en_all.json",
  "psi_pre_2010_english": "_psi10_en_all.json",
  "gc_pre_2024_en": "_gc24_en_all.json",
  "gts-pre-2021-english": "_gts21_en_all.json",
  "psi-2023-english": "_psi23_en_all.json",
  "sb-pre-2020-english": "_sb20_en_all.json",
  "gc_pre_2025_english": "_gc25_en_all.json",
  "gb_pre_2025_en": "_gb25_en_all.json",
  "csg_pre_2025_en": "_csg25_en_all.json",
  "ts-pre-2022-english": "_ts22_en_all.json",
  "gb_combine_pre_2024_en": "_gb24_en_all.json",
  "excise_pre_2017_english": "_exc17_en_all.json",
  "cs-combined-pre-2024": "_cs24_en_all.json",
  "gc-pre-2021-english": "_gc21_en_all.json",
  "gc-pre-2022-english": "_gc22_en_all.json",
  "gcs_pre_2024_en": "_gcs24_en_all.json",
  "psi-pre-2021-english": "_psi21_en_all.json",
  "asst_pre_2011_en": "_asst11_en_all.json",
};

const MATCH_PAT = /apply the wrong concept, unit, or formula for this question|When revising, link the concept to its definition/;

function clip(s, n = 45) {
  s = String(s).replace(/\s+/g, " ").trim();
  return s.length <= n ? s : s.slice(0, n - 1) + "…";
}

function loadOriginals(quizId, n) {
  const rel = ORIGINALS[quizId];
  if (!rel || !existsSync(rel)) return null;
  try {
    const arr = JSON.parse(readFileSync(rel, "utf8"));
    return arr.length === n ? arr : null;
  } catch {
    return null;
  }
}

function stripOpeners(text) {
  let s = text.trim();
  for (const pat of OPENER_PATS) s = s.replace(pat, "");
  return s.trim();
}

function stripAllBoilerplate(text) {
  let s = stripGenericDistractor(text);
  for (const pat of REV_PATS) {
    s = s.replace(pat, "");
  }
  return s.replace(/\s+/g, " ").trim();
}

function hasBoilerplate(text) {
  return MATCH_PAT.test(text);
}

function countWrongOptionMentions(core, q) {
  const wrong = ["A", "B", "C", "D"].filter((k) => k !== q.correctAnswer);
  let count = 0;
  for (const k of wrong) {
    const opt = String(q.options?.[k] || "").trim();
    const optShort = opt.slice(0, 12);
    if (optShort.length >= 4 && core.includes(optShort)) count++;
    if (new RegExp(`\\b${k}\\b|\\(${k}\\)|option ${k}|'${optShort.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`, "i").test(core))
      count++;
  }
  return count;
}

function whyWrongOption(k, optText, q, ca, correctOpt) {
  const opt = String(optText).replace(/\s+/g, " ").trim();
  const optLow = opt.toLowerCase();
  const stem = String(q.text || "").replace(/\s+/g, " ").trim();
  const correct = String(correctOpt || "").replace(/\s+/g, " ").trim();

  // Combination / subset answers
  if (/^\([a-d]\)|only \(|\([a-d]\) and|\([a-d]\),|\([a-d]\) only|all above|none of these/i.test(opt)) {
    if (/only/i.test(opt) && !opt.includes(correct.slice(0, 8))) {
      return `option ${k} (${clip(opt)}) drops one or more valid statements or keeps an invalid one that the stem rules out`;
    }
    if (/all above|all of the above/i.test(opt)) {
      return `option ${k} (${clip(opt)}) bundles every limb even though at least one statement in the list is false`;
    }
    if (/none of these/i.test(opt)) {
      return `option ${k} (${clip(opt)}) denies a pairing that the stem actually supports`;
    }
    return `option ${k} (${clip(opt)}) mis-groups the true and false statements from the stem`;
  }

  // Match-the-pairs
  if (/^[a-d]-[iivx]+|^[a-d]\s*[-–]\s*[iivx]+/i.test(opt) || /a-[iivx]/i.test(stem)) {
    return `option ${k} (${clip(opt)}) swaps at least one List I–List II pairing that the keyed match rejects`;
  }

  // Numeric
  if (/^\d+(\.\d+)?%?$/.test(opt.trim())) {
    return `option ${k} (${opt}) states the wrong figure—the keyed answer is ${ca} (${clip(correct, 30)})`;
  }

  // Names / places (capitalized words)
  if (/^[A-Z]/.test(opt) && opt.split(" ").length <= 6) {
    return `option ${k} (${clip(opt)}) names the wrong person, place, or institution for this stem`;
  }

  // Grammar / word form
  if (/^[-]/.test(opt) || /^(when|which|that|who|where|if)\s/i.test(opt)) {
    return `option ${k} (${clip(opt)}) breaks tense, clause structure, or collocation rules the stem requires`;
  }

  // Single word / short phrase
  if (opt.split(" ").length <= 4) {
    if (correct && optLow === correct.toLowerCase()) {
      return `option ${k} (${clip(opt)}) duplicates the correct idea but is not the keyed letter`;
    }
    return `option ${k} (${clip(opt)}) does not fit the definition, idiom, or rule the question tests`;
  }

  return `option ${k} (${clip(opt)}) contradicts the fact pattern or principle that makes ${ca} correct`;
}

function buildDistractorBlock(q) {
  const ca = q.correctAnswer;
  const wrong = ["A", "B", "C", "D"].filter((k) => k !== ca && q.options?.[k] != null);
  if (!wrong.length) return "";

  const reasons = wrong.map((k) => whyWrongOption(k, q.options[k], q, ca, q.options[ca]));
  if (reasons.length === 1) {
    return `Wrong option: ${reasons[0]}.`;
  }
  if (reasons.length === 2) {
    return `Wrong options: ${reasons[0]}; ${reasons[1]}.`;
  }
  const last = reasons.pop();
  return `Wrong options: ${reasons.join("; ")}; and ${last}.`;
}

function hasSpecificDistractors(text) {
  return /\bwrong option(s)?\b|option [A-D] \([^)]+\) (does not|names|states|breaks|mis-|contradict|swaps|bundles|drops|denies)/i.test(
    text
  );
}

function fixExplanation(q, originalCore) {
  const raw = String(q.explanation || "").trim();
  if (!hasBoilerplate(raw)) return raw;

  let core = stripOpeners(raw);
  core = stripAllBoilerplate(core);

  // Prefer original if current core is thin after stripping
  const orig = originalCore ? stripOpeners(stripAllBoilerplate(originalCore)) : "";
  if (orig.length > core.length + 20) core = orig;
  else if (core.length < 40 && orig.length >= 40) core = orig;

  core = core.replace(/\bHence\s*\([A-D]\)\.?\s*/gi, "").replace(/\s+/g, " ").trim();

  // If only template remained, build from question
  if (core.length < 40) {
    const stem = clip(String(q.text || "").replace(/\n/g, " "), 80);
    const opt = clip(q.options?.[q.correctAnswer] || q.correctAnswer, 50);
    core = `This item asks about ${stem}, and option ${q.correctAnswer} (${opt}) matches the required concept.`;
  }

  let expl = core;
  const inlineCount = countWrongOptionMentions(core, q);

  if (inlineCount < 2) {
    const dist = buildDistractorBlock(q);
    if (dist && !core.toLowerCase().includes(dist.slice(0, 30).toLowerCase())) {
      expl = `${core} ${dist}`;
    }
  }

  expl = expl.replace(/\s+/g, " ").trim();
  if (!/[.!?]$/.test(expl)) expl += ".";

  // Pad if too short
  if (expl.length < MIN_LEN) {
    const ca = q.correctAnswer;
    const dist = buildDistractorBlock(q);
    if (!hasSpecificDistractors(expl)) expl = `${expl} ${dist}`;
    else expl = `${expl} Eliminate each wrong letter by checking it against the stem before you lock ${ca}.`;
  }

  expl = expl.replace(/\bHence\s*\([A-D]\)\.?\s*/gi, "").replace(/\s+/g, " ").trim();
  // Final safety strip — never leave boilerplate in output
  expl = stripAllBoilerplate(expl);
  if (!/[.!?]$/.test(expl)) expl += ".";
  return expl;
}

const quizzes = JSON.parse(readFileSync("public/quizzes.json", "utf8").replace(/^\uFEFF/, ""));
let fixed = 0;
let scanned = 0;
const fixedIds = new Set();

for (const quiz of quizzes) {
  if (quiz.language === "marathi") continue;
  const originals = loadOriginals(quiz.id, quiz.questions.length);

  for (let i = 0; i < quiz.questions.length; i++) {
    const q = quiz.questions[i];
    const old = String(q.explanation || "").trim();
    if (!hasBoilerplate(old)) continue;
    scanned++;

    const origCore = originals ? String(originals[i] || "") : "";
    const neu = fixExplanation(q, origCore);
    if (neu !== old) {
      q.explanation = neu;
      fixed++;
      fixedIds.add(`${quiz.id}:${q.id}`);
    }
  }
}

console.log(`Scanned: ${scanned}, Fixed: ${fixed}`);

// Verify
let remaining = 0;
for (const quiz of quizzes) {
  if (quiz.language === "marathi") continue;
  for (const q of quiz.questions) {
    if (MATCH_PAT.test(q.explanation || "")) remaining++;
  }
}
console.log(`Remaining boilerplate: ${remaining}`);

// Validate fixed explanations
let invalid = 0;
for (const quiz of quizzes) {
  if (quiz.language === "marathi") continue;
  for (const q of quiz.questions) {
    if (!fixedIds.has(`${quiz.id}:${q.id}`)) continue;
    const e = String(q.explanation || "").trim();
    if (MATCH_PAT.test(e)) {
      console.error(`Still has boilerplate: ${quiz.id}/${q.id}`);
      invalid++;
    }
    if (/\bHence\s*\([A-D]\)/i.test(e)) {
      console.error(`Hence found: ${quiz.id}/${q.id}`);
      invalid++;
    }
    if (e.length < MIN_LEN) {
      console.error(`Short fixed: ${quiz.id}/${q.id} len=${e.length}`);
      invalid++;
    }
  }
}
if (invalid) {
  console.error(`Validation failed: ${invalid} issues`);
  process.exit(1);
}

if (apply && fixed > 0) {
  writeFileSync("public/quizzes.json", JSON.stringify(quizzes, null, 2) + "\n");
  console.log("Applied to public/quizzes.json");
} else if (!apply) {
  console.log("Dry run — re-run with --apply to write");
}
