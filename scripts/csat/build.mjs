/**
 * Builds the CSAT question bank into public/csat-questions.json.
 *
 * Deterministic: a fixed seed drives every shuffle, so rebuilding without
 * changing a generator reproduces the identical file.
 *
 * Usage:  node scripts/csat/build.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildOptions, makeRng, shuffle, signature } from "./lib/util.mjs";
import * as percentageProfitLoss from "./generators/percentage-profit-loss.mjs";
import * as numberSystem from "./generators/number-system.mjs";
import * as ratioAverage from "./generators/ratio-average.mjs";
import * as timeWork from "./generators/time-work.mjs";
import * as speedDistance from "./generators/speed-distance.mjs";
import * as interest from "./generators/interest.mjs";
import * as algebra from "./generators/algebra.mjs";
import * as mensuration from "./generators/mensuration.mjs";
import * as probabilityStats from "./generators/probability-stats.mjs";
import * as series from "./generators/series.mjs";
import * as codingDecoding from "./generators/coding-decoding.mjs";
import * as direction from "./generators/direction.mjs";
import * as ranking from "./generators/ranking.mjs";
import * as clocksCalendars from "./generators/clocks-calendars.mjs";
import * as syllogism from "./generators/syllogism.mjs";
import * as analogy from "./generators/analogy.mjs";
import * as bloodRelations from "./generators/blood-relations.mjs";
import * as dataInterpretation from "./generators/data-interpretation.mjs";
import * as puzzles from "./generators/puzzles.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const OUT = path.join(ROOT, "public", "csat-questions.json");

const SEED = 20260801;
/** Bank size per practice topic (EN+MR share the same items). Was 100; raised to 200. */
const TARGET_PER_TOPIC = 200;

const GENERATORS = [
  percentageProfitLoss,
  numberSystem,
  ratioAverage,
  timeWork,
  speedDistance,
  interest,
  algebra,
  mensuration,
  probabilityStats,
  series,
  codingDecoding,
  direction,
  ranking,
  clocksCalendars,
  syllogism,
  analogy,
  bloodRelations,
  dataInterpretation,
  puzzles,
];

/** Options must be far enough apart that rounding cannot make two identical. */
const MIN_GAP = 0.02;

function buildTopic(mod, rng) {
  const { topicId, archetypes } = mod;

  // Shuffle each archetype's parameter list once, then draw round-robin so the
  // final bank is an even mix rather than 30 of one kind followed by 30 of the next.
  const queues = archetypes.map((a) => ({
    archetype: a,
    cases: shuffle(rng, a.cases()),
    cursor: 0,
  }));

  const out = [];
  const seenSignature = new Set();
  const seenText = new Set();

  let guard = 0;
  while (out.length < TARGET_PER_TOPIC) {
    guard += 1;
    if (guard > 100000) break;

    let progressed = false;
    for (const q of queues) {
      if (out.length >= TARGET_PER_TOPIC) break;
      if (q.cursor >= q.cases.length) continue;

      const params = q.cases[q.cursor];
      q.cursor += 1;
      progressed = true;

      const sig = signature(q.archetype.id, params);
      if (seenSignature.has(sig)) continue;

      let payload;
      try {
        payload = q.archetype.make(params);
      } catch {
        continue;
      }
      if (!payload) continue;

      const built = buildOptions(rng, payload.correct, payload.distractors, { minGap: MIN_GAP });
      if (!built) continue;

      const textKey = payload.en.text.replace(/\s+/g, " ").trim().toLowerCase();
      if (seenText.has(textKey)) continue;

      seenSignature.add(sig);
      seenText.add(textKey);

      out.push({
        id: "",
        topicId,
        archetype: q.archetype.id,
        difficulty: q.archetype.difficulty,
        params,
        options: built.options,
        correctAnswer: built.correctAnswer,
        en: payload.en,
        mr: payload.mr,
      });
    }
    if (!progressed) break; // every archetype exhausted
  }

  out.forEach((item, i) => {
    item.id = `csat-${topicId}-${String(i + 1).padStart(4, "0")}`;
  });

  return out;
}

function main() {
  const rng = makeRng(SEED);
  const questions = [];
  const summary = [];

  for (const mod of GENERATORS) {
    const items = buildTopic(mod, rng);
    questions.push(...items);

    const byArchetype = new Map();
    const byDifficulty = new Map();
    for (const q of items) {
      byArchetype.set(q.archetype, (byArchetype.get(q.archetype) || 0) + 1);
      byDifficulty.set(q.difficulty, (byDifficulty.get(q.difficulty) || 0) + 1);
    }
    summary.push({ topicId: mod.topicId, count: items.length, byArchetype, byDifficulty });
  }

  const payload = {
    version: 1,
    note: "Generated CSAT practice bank. Do not hand-edit — run scripts/csat/build.mjs.",
    questions,
  };

  fs.writeFileSync(OUT, JSON.stringify(payload, null, 2) + "\n", "utf8");

  console.log(`Wrote ${questions.length} questions to public/csat-questions.json\n`);
  for (const s of summary) {
    console.log(`${s.topicId}: ${s.count} questions`);
    console.log(
      "  difficulty: " +
        [...s.byDifficulty.entries()].map(([k, v]) => `${k}=${v}`).join(", "),
    );
    for (const [k, v] of [...s.byArchetype.entries()].sort((a, b) => b[1] - a[1])) {
      console.log(`    ${String(v).padStart(3)}  ${k}`);
    }
  }
}

main();
