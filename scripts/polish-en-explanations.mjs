#!/usr/bin/env node
/**
 * Polish English explanations: remove telegraphic tokens, rebuild coach voice.
 * Usage:
 *   node scripts/polish-en-explanations.mjs [--apply] [--quiz <id>]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const MIN_LEN = 140;
const apply = process.argv.includes("--apply");
const force = process.argv.includes("--force");
const quizFilter = process.argv.includes("--quiz")
  ? process.argv[process.argv.indexOf("--quiz") + 1]
  : null;

const TELEGRAPHIC =
  /\b(keyed|misread|under-read|fail|fails|trap distractor|option letter|stem\/logic|partial fact)\b/i;
const HINGLISH = /\b(drop करणारे|fail\.|misread\.|under-read|networking|assertion —|alone insufficient|omit करणारे)\b/i;
const HENCE_BAD = /\bHence\s*\([A-D]\)/i;

const GENERIC_DIST =
  /they miss the keyed concept|they do not match the core|apply the wrong concept, unit, or formula/i;

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

const REV_PATS = [
  /MPSC-style papers often repeat this kind of detail — re-read the stem once before locking the answer\.?\s*/gi,
  /Near-miss distractors are common; keep the core concept, formula, and unit triangle in mind\.?\s*/gi,
  /When the stem asks 'not correct' or 'incorrect', isolate the false limb before picking\.?\s*/gi,
  /Topic packs may revisit this point — store the keyed fact with its reason, not just the letter\.?\s*/gi,
  /Keep the name, formula, and unit together — that blocks the usual partial-logic traps\.?\s*/gi,
  /Keep the name, formula, and unit together when you revise\.?\s*/gi,
  /When revising, link the concept to its definition, formula, and unit so near-miss options are easier to eliminate\.?\s*/gi,
  /MPSC papers often recycle this type of detail, so read the question carefully before you commit to an option\.?\s*/gi,
  /If the question asks what is incorrect, identify the false statement first and then match it to the answer choice\.?\s*/gi,
  /Store the reasoning behind the answer, not just the letter, because topic packs revisit the same idea in different forms\.?\s*/gi,
  /Keep the name, formula, and unit together in your notes — that helps you spot incomplete distractors quickly\.?\s*/gi,
];

const DIST_PATS = [
  /Options [A-D][^.]+\.(?=\s*(?:When|MPSC|If|Store|Keep|$))/gi,
  /You can eliminate [A-D][^.]+\.(?=\s*(?:When|MPSC|If|Store|Keep|$))/gi,
  /Distractors [A-D][^.]+\.(?=\s*(?:When|MPSC|If|Store|Keep|$))/gi,
  /The other options are (?:wrong|incorrect) because [^.]+\.(?=\s*(?:When|MPSC|If|Store|Keep|$))/gi,
  /The remaining options do not satisfy[^.]+\.(?=\s*(?:When|MPSC|If|Store|Keep|$))/gi,
];

const OPENERS = [
  (ca) => `Option ${ca} is correct because`,
  (ca) => `The answer is option ${ca}:`,
  (ca) => `Option ${ca} matches the question because`,
  (ca) => `Choose option ${ca}:`,
  (ca) => `Option ${ca} is the right choice since`,
  (ca) => `The correct answer is option ${ca} —`,
  (ca) => `Option ${ca} works here because`,
];

const CLOSERS = [
  "When revising, link the concept to its definition, formula, and unit so near-miss options are easier to eliminate.",
  "MPSC papers often recycle this type of detail, so read the question carefully before you commit to an option.",
  "If the question asks what is incorrect, identify the false statement first and then match it to the answer choice.",
  "Store the reasoning behind the answer, not just the letter, because topic packs revisit the same idea in different forms.",
  "Keep the name, formula, and unit together in your notes — that helps you spot incomplete distractors quickly.",
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

function loadOriginalExps(quizId, n) {
  const rel = ORIGINALS[quizId];
  if (!rel) return null;
  try {
    const arr = JSON.parse(readFileSync(rel, "utf8"));
    if (arr.length !== n) return null;
    return arr;
  } catch {
    return null;
  }
}

function clip(s, n = 40) {
  s = String(s).replace(/\s+/g, " ").trim();
  return s.length <= n ? s : s.slice(0, n - 1) + "…";
}

function replaceTelegraphic(text) {
  let s = text;
  const reps = [
    [/\bkeyed fact\b/gi, "core fact"],
    [/\bkeyed (answer|option|result|figure|three|four|month|timeline|pair|analysis|list|perm|sequence)\b/gi, "correct $1"],
    [/\bthe key marks\b/gi, "the official answer marks"],
    [/\bthe key\b/gi, "the official answer"],
    [/\bkeyed\b/gi, "correct"],
    [/\bunder-read\b/gi, "overlook"],
    [/\bunder-reads\b/gi, "overlooks"],
    [/\bmisread\b/gi, "misinterpret"],
    [/\bmisreads\b/gi, "misinterprets"],
    [/\btrap distractor\b/gi, "distracting option"],
    [/\boption letter\b/gi, "answer choice"],
    [/\bstem\/logic\b/gi, "question logic"],
    [/\bpartial fact\b/gi, "incomplete reasoning"],
    [/\bpartial-logic\b/gi, "incomplete logic"],
    [/\bassertion —\b/gi, "assertion:"],
    [/\bnetworking\b/gi, "associations"],
    [/\bboth limbs fail\b/gi, "both statements are wrong"],
    [/\bfails regional\b/gi, "breaks regional"],
    [/\bclaim fails\b/gi, "claim is incorrect"],
    [/\bfails\b/gi, "is incorrect"],
    [/\bfail\b/gi, "is wrong"],
    [/\bworking through it\b/gi, "On review"],
    [/\bstraight to the answer\b/gi, "The answer"],
    [/\bper the exam key\b/gi, "According to the official answer"],
    [/\bHence\s*\([A-D]\)\.?\s*/gi, ""],
  ];
  for (const [re, rep] of reps) s = s.replace(re, rep);
  return s;
}

function stripOpeners(text) {
  let s = text.trim();
  for (const pat of OPENER_PATS) s = s.replace(pat, "");
  s = s.replace(/^Option [A-D]\.\s*/i, "");
  return s.trim();
}

function stripRev(text) {
  let s = text;
  for (const pat of REV_PATS) s = s.replace(pat, "");
  for (const pat of DIST_PATS) s = s.replace(pat, "");
  return s.trim();
}

function parseExplanation(raw) {
  let s = stripOpeners(raw);
  s = stripRev(s);

  let core = s;
  let distractor = "";

  const wrongIdx = s.search(/\bWrong options\b/i);
  if (wrongIdx >= 0) {
    core = s.slice(0, wrongIdx).trim();
    distractor = s.slice(wrongIdx).trim();
    // Drop generic boilerplate distractor tail
    distractor = distractor
      .replace(/^Wrong options\s+/i, "")
      .replace(/— they miss the keyed concept, formula, or definition this item tests\.?\s*$/i, "")
      .replace(/— they (?:miss|do not match)[^.]+\.\s*$/i, "")
      .trim();
    if (GENERIC_DIST.test(distractor) || distractor.length < 20) distractor = "";
  }

  core = core.replace(/^Option [A-D]\.\s*/i, "").replace(/^Option [A-D]\s*[-—]\s*/i, "").replace(/\bWrong\s*$/i, "").trim();
  return { core, distractor };
}

function hasDistractorAnalysis(text) {
  return /\b(options?|distractors?|choices?)\s+(omitting|adding|restricting|bundling|picking|listing|naming|including|excluding|dropping|swapping|mixing|assigning|truncating|reversing|pushing|undercount|overcount)|\b(belong to other|preceded the|belong to later|breaks \d{4}|contradict|misplace|scramble|misdate|misstate|misallocate|erases|invert|confuses|overstates|understates|not tied|not on this|not produce|not singly|not accepted|not the dominant|not a separate|not this|is not tied|are not tied|does not singly|did not singly)\b/i.test(
    text
  );
}

function isOptionListOnly(s) {
  const t = String(s || "").trim();
  if (!t) return false;
  if (/^[A-D]\s*\(/.test(t) && !/\b(because|since|as|while|whereas|contradict|conflict|misplace|break|swap|omit|ignore|precede|belong|assign|bundle|restrict|truncate|overcount|undercount|scramble|reverse|mix|confuse|erases|invert|treat|name|pick|push|pull|add|drop|exclude|include only|not tied|not on|not produce|not singly|not accepted|not a|not the|is not|are not|was not|were not|does not|do not|did not|cannot|can't)\b/i.test(t)) {
    return true;
  }
  return false;
}

function distractorSentence(q, custom, idx) {
  const ca = q.correctAnswer;
  if (custom && custom.length >= 15 && !isOptionListOnly(custom)) {
    const c = replaceTelegraphic(custom);
    let out = c.endsWith(".") ? c : `${c}.`;
    if (!/^(The|Options|You|Distractors|Other|Remaining|Partial|Choices|Only|Bundling|Mixing|Swapping|Assigning|Truncating|Reversing|Excluding|Including)/i.test(out)) {
      out = `The other options are incorrect because ${out.charAt(0).toLowerCase()}${out.slice(1)}`;
    }
    return out;
  }
  const opts = q.options || {};
  const wrong = ["A", "B", "C", "D"].filter((k) => k !== ca && k in opts);
  if (!wrong.length) {
    return "The remaining options do not satisfy the definition or calculation the question requires.";
  }
  const parts = wrong.slice(0, 3).map((k) => `${k} (${clip(opts[k])})`);
  const list = parts.join(", ") + (wrong.length > 3 ? ", and others" : "");
  const templates = [
    `Options ${list} are incorrect because they apply the wrong concept, unit, or formula for this question.`,
    `You can eliminate ${list} — each one conflicts with the principle or calculation that leads to option ${ca}.`,
    `Distractors ${list} look plausible but do not follow from the facts stated in the question.`,
  ];
  return templates[idx % templates.length];
}

function flagExplanation(e) {
  const reasons = [];
  if (!e) return ["empty"];
  if (TELEGRAPHIC.test(e)) reasons.push("telegraphic");
  if (HINGLISH.test(e)) reasons.push("hinglish");
  if (e.length >= 120 && !/[.!?]/.test(e)) reasons.push("no_sentence_punct");
  return reasons;
}

function polishExplanation(q, idx) {
  const ca = q.correctAnswer;
  const raw = String(q.explanation || "").trim();
  const { core, distractor } = parseExplanation(raw);

  let body = replaceTelegraphic(core);
  body = body.replace(/\bWrong\s+(options|options?)\b/gi, "").replace(/\s+/g, " ").trim();

  if (body.length < 15) {
    const stem = clip(String(q.text || "").replace(/\n/g, " "), 100);
    const opt = clip((q.options || {})[ca] || ca, 60);
    body = `this question concerns ${stem}, and option ${ca} (${opt}) best fits the required concept.`;
  }

  const openerIdx = idx % OPENERS.length;
  const closerIdx = idx % CLOSERS.length;
  let opener = OPENERS[openerIdx](ca);
  let sentence = body;
  if (/^(The|An|A|In|If|When|Only|Both|Statement|N\s*=|Q\s*=|I\s*=|t\s*=|W\s*=|V\s*=|P\s*=|R\s*=)/.test(body)) {
    sentence = body.charAt(0).toLowerCase() + body.slice(1);
  } else if (!/^[A-Z(0-9"'(]/.test(body.charAt(0))) {
    sentence = body.charAt(0).toLowerCase() + body.slice(1);
  }
  if (/^(Option|MPSC|When|Store|Keep|You|Distractors|According|Choose|MPSC cancelled)/.test(body)) {
    sentence = body;
    opener = OPENERS[(openerIdx + 2) % OPENERS.length](ca);
  }

  const dist = hasDistractorAnalysis(body) ? "" : distractorSentence(q, distractor, idx);
  let expl = dist ? `${opener} ${sentence} ${dist} ${CLOSERS[closerIdx]}` : `${opener} ${sentence} ${CLOSERS[closerIdx]}`;
  expl = replaceTelegraphic(expl).replace(/\s+/g, " ").trim();
  if (!/[.!?]$/.test(expl)) expl += ".";

  let pad = 0;
  while (expl.length < MIN_LEN && pad < CLOSERS.length) {
    expl += " " + CLOSERS[(closerIdx + pad + 1) % CLOSERS.length];
    pad++;
  }
  expl = replaceTelegraphic(expl);
  if (HENCE_BAD.test(expl)) expl = expl.replace(HENCE_BAD, "");
  return expl.trim();
}

function validateExplanation(e, i) {
  const problems = [];
  if (!e?.trim()) problems.push("empty");
  if (e.length < MIN_LEN) problems.push(`short(${e.length})`);
  if (TELEGRAPHIC.test(e)) problems.push("telegraphic");
  if (HINGLISH.test(e)) problems.push("hinglish");
  if (HENCE_BAD.test(e)) problems.push("Hence");
  if (problems.length) throw new Error(`Q${i + 1}: ${problems.join(", ")} — ${e.slice(0, 120)}`);
}

const quizzes = JSON.parse(readFileSync("public/quizzes.json", "utf8").replace(/^\uFEFF/, ""));
const queue = JSON.parse(readFileSync("_grammar_queue.json", "utf8"));
const enQuizIds = queue.ranked.filter((r) => !r.isMr).map((r) => r.id);
const targetIds = quizFilter
  ? [quizFilter]
  : force
    ? Object.keys(ORIGINALS)
    : enQuizIds;

let totalPolished = 0;
const results = [];

for (const quizId of targetIds) {
  const quiz = quizzes.find((x) => x.id === quizId);
  if (!quiz) {
    console.error(`SKIP missing quiz: ${quizId}`);
    continue;
  }

  const originals = force ? loadOriginalExps(quizId, quiz.questions.length) : null;

  const exps = quiz.questions.map((q, i) => {
    const source = originals ? String(originals[i] || "") : String(q.explanation || "");
    const old = source.trim();
    const reasons = flagExplanation(old);
    if (!force && !reasons.length) return String(q.explanation || "").trim();
    const polished = polishExplanation({ ...q, explanation: old }, i);
    validateExplanation(polished, i);
    return polished;
  });

  const changed = exps.filter((e, i) => e !== String(quiz.questions[i].explanation || "").trim()).length;
  if (!changed && !force) {
    console.log(`SKIP ${quizId}: nothing to polish`);
    continue;
  }

  const outPath = `_polish_${quizId.replace(/[^a-z0-9_-]+/gi, "_")}.json`;
  writeFileSync(outPath, JSON.stringify(exps, null, 2) + "\n");
  totalPolished += force ? exps.length : changed;
  results.push({ quizId, outPath, changed: force ? exps.length : changed, n: exps.length });
  console.log(`WROTE ${outPath}: ${force ? exps.length : changed}/${exps.length} polished, min=${Math.min(...exps.map((x) => x.length))}`);

  if (apply) {
    const r = spawnSync("node", ["scripts/apply-topic-explanations.mjs", quizId, outPath], {
      encoding: "utf8",
      cwd: process.cwd(),
    });
    if (r.status !== 0) {
      console.error(r.stderr || r.stdout);
      process.exit(r.status || 1);
    }
    console.log(r.stdout.trim());
  }
}

console.log(`\nDone: ${results.length} quizzes, ${totalPolished} explanations polished${apply ? " and applied" : ""}`);
if (!apply) console.log("Re-run with --apply to write to quizzes.json");
