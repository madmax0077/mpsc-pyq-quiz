/**
 * Proves the validator actually has teeth.
 *
 * Takes the real bank, injects one deliberate defect at a time, and asserts
 * that validate.mjs rejects each corrupted copy. If any mutation slips through,
 * the validator is too weak to be trusted and this script fails.
 *
 * Usage:  node scripts/csat/mutation-test.mjs
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const BANK = path.join(ROOT, "public", "csat-questions.json");
const VALIDATOR = path.join(__dirname, "validate.mjs");

const LETTERS = ["A", "B", "C", "D"];

const MUTATIONS = [
  {
    name: "key points at the wrong option",
    apply(bank) {
      const q = bank.questions[3];
      const others = LETTERS.filter((k) => k !== q.correctAnswer);
      q.correctAnswer = others[0];
    },
  },
  {
    name: "correct option's value is altered",
    apply(bank) {
      const q = bank.questions[7];
      q.options[q.correctAnswer] = String(q.options[q.correctAnswer]).replace(/\d+/, (d) =>
        String(Number(d) + 7),
      );
    },
  },
  {
    name: "English question states a different number than it was solved for",
    apply(bank) {
      const q = bank.questions[11];
      let replaced = false;
      q.en.text = q.en.text.replace(/(\d+)%/, (full, d) => {
        if (replaced) return full;
        replaced = true;
        return `${Number(d) + 5}%`;
      });
    },
  },
  {
    name: "Marathi question disagrees with the English one",
    apply(bank) {
      const q = bank.questions[15];
      let replaced = false;
      q.mr.text = q.mr.text.replace(/(\d+)/, (full, d) => {
        if (replaced) return full;
        replaced = true;
        return String(Number(d) + 3);
      });
    },
  },
  {
    name: "Marathi text left in English (not translated)",
    apply(bank) {
      const q = bank.questions[19];
      q.mr.text = q.en.text;
    },
  },
  {
    name: "Marathi explanation left in English",
    apply(bank) {
      const q = bank.questions[23];
      q.mr.explanation = q.en.explanation;
    },
  },
  {
    name: "explanation emptied",
    apply(bank) {
      bank.questions[27].en.explanation = "";
    },
  },
  {
    name: "explanation reduced to a one-liner with no working",
    apply(bank) {
      bank.questions[31].en.explanation = "The answer is obvious.";
    },
  },
  {
    name: "explanation quotes a different final answer",
    apply(bank) {
      const q = bank.questions[35];
      const keyed = String(q.options[q.correctAnswer]);
      const magnitude = keyed.replace(/[^0-9.]/g, "");
      q.en.explanation = q.en.explanation.split(magnitude).join("99999");
      q.mr.explanation = q.mr.explanation.split(magnitude).join("99999");
    },
  },
  {
    name: "two options carry the same value",
    apply(bank) {
      const q = bank.questions[39];
      const other = LETTERS.find((k) => k !== q.correctAnswer);
      q.options[other] = q.options[q.correctAnswer];
    },
  },
  {
    name: "duplicate question inserted",
    apply(bank) {
      const copy = JSON.parse(JSON.stringify(bank.questions[43]));
      copy.id = copy.id + "-dup";
      bank.questions.push(copy);
    },
  },
  {
    name: "answer key skewed so one letter dominates",
    apply(bank) {
      for (const q of bank.questions) q.correctAnswer = "A";
    },
  },
];

function runValidator(file) {
  try {
    execFileSync(process.execPath, [VALIDATOR, file], { stdio: "pipe" });
    return { passed: true, output: "" };
  } catch (err) {
    return { passed: false, output: String(err.stdout || "") };
  }
}

function main() {
  const original = fs.readFileSync(BANK, "utf8");

  // Sanity: the untouched bank must pass, otherwise the test proves nothing.
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "csat-mutation-"));
  const baseFile = path.join(tmpDir, "base.json");
  fs.writeFileSync(baseFile, original);
  const base = runValidator(baseFile);
  if (!base.passed) {
    console.error("The unmodified bank does not pass validation — fix that first.");
    console.error(base.output);
    process.exit(1);
  }
  console.log("Baseline: unmodified bank PASSES validation.\n");

  let escaped = 0;
  MUTATIONS.forEach((m, i) => {
    const bank = JSON.parse(original);
    m.apply(bank);
    const file = path.join(tmpDir, `mutant-${i}.json`);
    fs.writeFileSync(file, JSON.stringify(bank, null, 2));
    const res = runValidator(file);
    if (res.passed) {
      escaped += 1;
      console.log(`  ESCAPED  ${m.name}`);
    } else {
      console.log(`  caught   ${m.name}`);
    }
  });

  fs.rmSync(tmpDir, { recursive: true, force: true });

  console.log("");
  if (escaped === 0) {
    console.log(`All ${MUTATIONS.length} injected defects were caught. The validator has teeth.`);
    process.exit(0);
  }
  console.log(`${escaped} of ${MUTATIONS.length} defects slipped through — strengthen the validator.`);
  process.exit(1);
}

main();
