#!/usr/bin/env node
/**
 * Second pass: replace weak template distractor tails with option-specific reasoning.
 * Usage: node scripts/fix-weak-distractors.mjs [--apply]
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const apply = process.argv.includes("--apply");
const MIN_LEN = 140;

const WEAK_PAT =
  /Wrong options?: option [A-D][^;]+(?:names the wrong person|does not fit the definition|contradicts the fact pattern|states the wrong figure|mis-groups the true)/i;

const REV_PATS = [
  /When revising, link the concept to its definition[^.]*\.?\s*/gi,
  /MPSC papers often recycle[^.]*\.?\s*/gi,
  /Store the reasoning behind[^.]*\.?\s*/gi,
  /Keep the name, formula[^.]*\.?\s*/gi,
  /If the question asks what is incorrect[^.]*\.?\s*/gi,
  /Eliminate each wrong letter by checking it against the stem before you lock [A-D]\.?\s*/gi,
];

const OPENER_PATS = [
  /^Option [A-D] is correct because\s*/i,
  /^The answer is option [A-D]:\s*/i,
  /^Option [A-D] matches the question because\s*/i,
  /^Choose option [A-D]:\s*/i,
  /^Option [A-D] is the right choice since\s*/i,
  /^The correct answer is option [A-D] —\s*/i,
  /^Option [A-D] works here because\s*/i,
  /^Working through it, option [A-D][^.]*\.?\s*/i,
  /^Straight to the answer — option [A-D]\.?\s*/i,
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

function clip(s, n = 50) {
  s = String(s).replace(/\s+/g, " ").trim();
  return s.length <= n ? s : s.slice(0, n - 1) + "…";
}

function stripOpeners(t) {
  let s = t.trim();
  for (const p of OPENER_PATS) s = s.replace(p, "");
  return s.replace(/^Option [A-D]\.\s*/i, "").trim();
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

function extractWrongOptionsFromOriginal(raw) {
  const m = raw.match(/Wrong options?\s+([\s\S]*?)(?:\s*—|\s*they miss|\.\s*(?:MPSC|When|Near|Topic|Keep|If|$))/i);
  if (!m) return null;
  const chunk = m[1].trim().replace(/\s*—\s*$/, "");
  const pairs = [];
  for (const part of chunk.split(/,\s*(?=[A-D]\s*\()/)) {
    const pm = part.match(/^([A-D])\s*\(([^)]+)\)/);
    if (pm) pairs.push({ k: pm[1], label: pm[2].trim() });
  }
  return pairs.length ? pairs : null;
}

function coreExplainsDistractors(core, q) {
  const wrong = ["A", "B", "C", "D"].filter((k) => k !== q.correctAnswer);
  let hits = 0;
  for (const k of wrong) {
    const opt = String(q.options?.[k] || "").trim();
    const words = opt.toLowerCase().split(/\W+/).filter((w) => w.length > 3);
    if (words.some((w) => core.toLowerCase().includes(w))) hits++;
    // Semicolon-separated negations like "'Show' is vague; 'cure' overstates"
    const quoted = opt.match(/['"]?(\w+)['"]?/);
    if (quoted && core.toLowerCase().includes(quoted[1].toLowerCase())) hits++;
  }
  // Patterns like "Probability uses 'might/may'" or "Lokhande belongs to earlier"
  if (/\b(not|wrong|mis|≠|≠|reverse|overstate|understate|ungrammatical|false|incorrect|trap|distractor|swap|break|fail|omit|exclude|unlike|rather than|instead of|not the|is not)\b/i.test(core))
    hits++;
  return hits >= 2 || (hits >= 1 && core.length > 120);
}

function whyWrong(k, optText, q, ca, correctOpt, core) {
  const opt = String(optText).replace(/\s+/g, " ").trim();
  const optLow = opt.toLowerCase();
  const stem = String(q.text || "").replace(/\s+/g, " ").trim();
  const stemLow = stem.toLowerCase();
  const correct = String(correctOpt || "").replace(/\s+/g, " ").trim();
  const cat = String(q.category || "").toLowerCase();

  // Check if core already explains this option
  const optWords = optLow.split(/\W+/).filter((w) => w.length > 3);
  for (const w of optWords) {
    if (core.toLowerCase().includes(w)) {
      const idx = core.toLowerCase().indexOf(w);
      const snippet = core.slice(Math.max(0, idx - 20), idx + w.length + 40);
      if (/\b(not|wrong|≠|mis|reverse|over|under|ungram|false|vague|trap|instead)\b/i.test(snippet)) {
        return `option ${k} (${clip(opt)}) fails because ${snippet.trim().replace(/^[^a-z']*/i, "")}`;
      }
    }
  }

  // Modal / grammar labels
  if (/^(probability|suggestion|compulsion|permission|ability|obligation|moral obligation)/i.test(opt)) {
    return `option ${k} (${opt}) assigns the wrong modal meaning—'${clip(stem, 35)}' tests a different force than ${optLow}`;
  }

  // Tone / style adjectives
  if (/^(dramatic|tragic|humorous|thrilling|ironic|satirical|optimistic|pessimistic)/i.test(opt)) {
    return `option ${k} (${opt}) misreads the passage tone; the text cues a different emotional register than '${optLow}'`;
  }

  // Circuit / symbol labels in option
  if (/symbol|battery|switch|voltmeter|ammeter|resistor|cell/i.test(opt)) {
    return `option ${k} (${clip(opt)}) identifies a different circuit symbol than the one the stem describes`;
  }

  // Units
  if (/^(ampere|coulomb|ohm|volt|joule|watt|newton|pascal|kelvin|mole|hertz|tesla|weber|farad|henry|cal|erg|ev|db|ph)/i.test(opt) || /\bΩ|ohm|ampere|coulomb\b/i.test(opt)) {
    return `option ${k} (${opt}) uses the wrong SI unit or physical quantity for what the stem asks you to identify`;
  }

  // Suffix / affix
  if (/^[-][a-z]+$/i.test(opt)) {
    return `option ${k} (${opt}) forms the wrong word class or noun/adjective pattern from the base word in the stem`;
  }

  // Combination answers
  if (/^\([a-d]\)|only \(|\([a-d]\) and|all above|none of these/i.test(opt)) {
    if (/only/i.test(opt))
      return `option ${k} (${clip(opt)}) accepts too few or too many of the numbered statements—the stem marks a different valid subset`;
    if (/all above/i.test(opt))
      return `option ${k} (${clip(opt)}) treats every statement as true even though at least one limb is false`;
    if (/none of these/i.test(opt))
      return `option ${k} (${clip(opt)}) rejects a combination that actually satisfies the stem`;
    return `option ${k} (${clip(opt)}) groups the (a)–(d) statements incorrectly relative to the keyed answer ${ca}`;
  }

  // Match pairs
  if (/^[a-d][-–][iivx]+/i.test(opt) || /list i|match the pair/i.test(stemLow)) {
    return `option ${k} (${clip(opt)}) transposes at least one List I item onto the wrong List II partner`;
  }

  // Numeric / percentage
  if (/^\d+(\.\d+)?%?$/.test(opt)) {
    return `option ${k} (${opt}) gives a numerical result that does not follow from the formula or data in the stem (correct: ${ca} = ${clip(correct, 25)})`;
  }

  // People / places (multi-word proper nouns)
  if (/^[A-Z][a-z]+(\s+[A-Z][a-z]+)+/.test(opt) || /^[A-Z][a-z]{3,}\s+[A-Z]/.test(opt)) {
    return `option ${k} (${clip(opt)}) cites a different historical figure, leader, or place than the event described in the stem`;
  }

  // Single proper noun
  if (/^[A-Z][a-zA-Z'.-]{2,}$/.test(opt) && !/^(Both|Only|All|None|True|False)/.test(opt)) {
    if (cat.includes("english") || cat.includes("grammar"))
      return `option ${k} (${opt}) violates the grammar rule, idiom, or word choice the sentence requires`;
    if (cat.includes("history"))
      return `option ${k} (${opt}) points to a different ruler, reformer, or event than the stem describes`;
    if (cat.includes("geograph"))
      return `option ${k} (${opt}) locates the feature, river, or district on the wrong part of the map`;
    if (cat.includes("econom") || cat.includes("polity"))
      return `option ${k} (${opt}) misstates the policy, committee, or institutional fact the question targets`;
    if (cat.includes("science"))
      return `option ${k} (${opt}) names a different physical concept, organism, or chemical property than the stem requires`;
    return `option ${k} (${clip(opt)}) does not match the specific fact or rule keyed for this question`;
  }

  // Clause / sentence options
  if (/^(when|which|that|who|where|if|he |she |they |we |i |the )/i.test(opt) || opt.includes(".")) {
    return `option ${k} (${clip(opt)}) breaks tense agreement, clause structure, or idiom required by the underlined portion`;
  }

  // Short phrases
  if (opt.split(/\s+/).length <= 5) {
    return `option ${k} (${clip(opt)}) conflicts with the definition, collocations, or calculation path that supports ${ca} (${clip(correct, 25)})`;
  }

  return `option ${k} (${clip(opt)}) cannot be reconciled with the stem facts that make ${ca} the keyed answer`;
}

function buildDistractorBlock(q, core, origRaw) {
  const ca = q.correctAnswer;
  const wrong = ["A", "B", "C", "D"].filter((k) => k !== ca && q.options?.[k] != null);
  if (!wrong.length) return "";

  const fromOrig = origRaw ? extractWrongOptionsFromOriginal(origRaw) : null;
  const reasons = wrong.map((k) => {
    if (fromOrig) {
      const entry = fromOrig.find((p) => p.k === k);
      if (entry) {
        const label = entry.label;
        if (/symbol/i.test(label))
          return `option ${k} (${clip(label)}) denotes a different circuit symbol than the keyed component`;
        if (/correct|incorrect/i.test(label))
          return `option ${k} (${clip(label)}) misjudges which numbered statements in the stem are true`;
        if (/^\d/.test(label) || /min|sec|ohm|joule|v|c|a|ph|db/i.test(label))
          return `option ${k} (${label}) comes from the wrong substitution into the governing formula`;
        return `option ${k} (${clip(label)}) does not satisfy the condition the stem sets for the correct letter`;
      }
    }
    return whyWrong(k, q.options[k], q, ca, q.options[ca], core);
  });

  if (reasons.length === 1) return reasons[0].charAt(0).toUpperCase() + reasons[0].slice(1) + ".";
  if (reasons.length === 2)
    return `${reasons[0].charAt(0).toUpperCase() + reasons[0].slice(1)}; ${reasons[1]}.`;
  const last = reasons.pop();
  return `${reasons.map((r, i) => (i === 0 ? r.charAt(0).toUpperCase() + r.slice(1) : r)).join("; ")}; and ${last}.`;
}

function stripWeakTail(expl) {
  return expl.replace(/\s*Wrong options?:[\s\S]*$/i, "").trim();
}

function needsFix(expl) {
  return WEAK_PAT.test(expl) || /Wrong options?: option [A-D]/i.test(expl);
}

function improveExplanation(q, origRaw) {
  let expl = String(q.explanation || "").trim();
  if (!needsFix(expl) && !/Wrong options?:/i.test(expl)) return expl;

  let core = stripOpeners(expl);
  for (const p of REV_PATS) core = core.replace(p, "");
  core = stripWeakTail(core).replace(/\s+/g, " ").trim();

  if (coreExplainsDistractors(core, q)) {
    return core.endsWith(".") ? core : core + ".";
  }

  const dist = buildDistractorBlock(q, core, origRaw);
  expl = dist ? `${core} ${dist}` : core;
  expl = expl.replace(/\s+/g, " ").trim();
  if (!/[.!?]$/.test(expl)) expl += ".";
  if (expl.length < MIN_LEN) {
    expl += ` Cross-check each remaining letter against the stem before confirming ${q.correctAnswer}.`;
  }
  return expl.replace(/\bHence\s*\([A-D]\)\.?\s*/gi, "").trim();
}

const quizzes = JSON.parse(readFileSync("public/quizzes.json", "utf8").replace(/^\uFEFF/, ""));
let fixed = 0;

for (const quiz of quizzes) {
  if (quiz.language === "marathi") continue;
  const originals = loadOriginals(quiz.id, quiz.questions.length);

  for (let i = 0; i < quiz.questions.length; i++) {
    const q = quiz.questions[i];
    const old = String(q.explanation || "").trim();
    if (!needsFix(old)) continue;

    const neu = improveExplanation(q, originals ? originals[i] : null);
    if (neu !== old) {
      q.explanation = neu;
      fixed++;
    }
  }
}

const weakLeft = (JSON.stringify(quizzes).match(/names the wrong person, place, or institution/g) || []).length;
console.log(`Fixed weak distractors: ${fixed}`);
console.log(`Remaining weak template phrases: ${weakLeft}`);

if (apply && fixed > 0) {
  writeFileSync("public/quizzes.json", JSON.stringify(quizzes, null, 2) + "\n");
  console.log("Applied to public/quizzes.json");
}
