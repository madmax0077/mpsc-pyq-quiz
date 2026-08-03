/**
 * Independent validator for public/csat-questions.json.
 *
 * Deliberately does NOT import the generators. For every question it:
 *   1. re-reads the numbers out of the rendered ENGLISH question text,
 *   2. re-solves the problem with a formula written independently of the one
 *      used to build it (a different algebraic route wherever possible),
 *   3. checks the result equals the keyed option.
 *
 * That catches a wrong key, a wrong formula AND a template that renders
 * different numbers than the ones it solved for.
 *
 * On top of that it enforces structural and bilingual invariants:
 *   - four distinct, non-empty options; key present; no near-duplicate values
 *   - the English and Marathi questions must state the SAME set of numbers
 *   - Marathi must actually be Devanagari; English must not contain Devanagari
 *   - both explanations must show worked steps and quote the answer
 *   - no duplicate questions anywhere in the bank
 *
 * Usage:  node scripts/csat/validate.mjs
 * Exit code 1 when anything fails.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");
const BANK = process.argv[2]
  ? path.resolve(process.cwd(), process.argv[2])
  : path.join(ROOT, "public", "csat-questions.json");

const MINUS = "\u2212";
const RUPEE = "\u20B9";
const LETTERS = ["A", "B", "C", "D"];

/* --------------------------- formatting (mirrors the display layer) -------------------------- */

function round(n, dp = 2) {
  const f = 10 ** dp;
  return Math.round((n + Number.EPSILON) * f) / f;
}

function num(n) {
  const r = round(n, 2);
  if (Number.isInteger(r)) return String(r);
  return String(r).replace(/0+$/, "").replace(/\.$/, "");
}

function groupIndian(n) {
  const neg = n < 0;
  const [intPart, decPart] = Math.abs(n).toFixed(2).split(".");
  let out;
  if (intPart.length <= 3) {
    out = intPart;
  } else {
    out = intPart.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + intPart.slice(-3);
  }
  const dec = decPart === "00" ? "" : "." + decPart.replace(/0$/, "");
  return (neg ? "-" : "") + out + dec;
}

const inr = (n) => RUPEE + groupIndian(n);
const pct = (n) => num(n) + "%";
const signedPct = (n) => {
  const r = round(n, 2);
  if (r === 0) return "0%";
  return (r > 0 ? "+" : MINUS) + num(Math.abs(r)) + "%";
};

/* ------------------------------------ number extraction ------------------------------------- */

/** All numbers appearing in a string, commas stripped, as a sorted array. */
function numbersIn(text) {
  const out = [];
  const re = /(\d[\d,]*(?:\.\d+)?)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    out.push(parseFloat(m[1].replace(/,/g, "")));
  }
  return out.sort((a, b) => a - b);
}

function sameNumbers(a, b) {
  if (a.length !== b.length) return false;
  return a.every((v, i) => Math.abs(v - b[i]) < 1e-9);
}

const DEVANAGARI = /[\u0900-\u097F]/;

/** A plain number, rupee amount or percentage — anything else is a word answer. */
const NUMERIC_OPTION = /^\u20B9?[+\u2212-]?[\d,]+(\.\d+)?%?$/;

function quotesWordAnswer(explanation, keyed) {
  const parts = keyed
    .split("/")
    .map((s) => s.trim())
    .filter(Boolean);
  const hay = explanation.toLowerCase();
  return parts.some((p) => hay.includes(p.toLowerCase()));
}

/** Does `text` contain `token` as a standalone number (not part of a longer one)? */
function hasNumberToken(text, token) {
  const esc = token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?<![\\d.,])${esc}(?![\\d])`).test(text);
}

/**
 * Amounts are rendered with Indian digit grouping ("1,320"), so a bare "1320"
 * lookup would miss them. Accept either rendering of the same value.
 */
function statesValue(text, value) {
  const plain = num(Math.abs(value));
  if (hasNumberToken(text, plain)) return true;
  const grouped = groupIndian(Math.abs(value));
  return hasNumberToken(text, grouped);
}

function grab(text, re, label) {
  const m = text.match(re);
  if (!m) throw new Error(`could not parse ${label} from the English text`);
  return m.slice(1).map((v) => (v === undefined ? undefined : parseFloat(String(v).replace(/,/g, ""))));
}

/* --------------------------------- independent solvers --------------------------------------- */
/*
 * Each solver reads the English text and returns the option string that MUST
 * be keyed correct. Routes are chosen to differ from the generator's:
 * e.g. successive change is solved by multiplying the two factors rather than
 * by the a + b + ab/100 shortcut, and the equal-gain-loss case is solved by
 * building both cost prices explicitly rather than by the x^2/100 shortcut.
 */
const SOLVERS = {
  "successive-change"(text) {
    const m = text.match(
      /increased by ([\d.]+)% and then (decreased by|further increased by) ([\d.]+)%/,
    );
    if (!m) throw new Error("could not parse successive-change");
    const a = parseFloat(m[1]);
    const b = m[2] === "decreased by" ? -parseFloat(m[3]) : parseFloat(m[3]);
    // Route: compound the two multipliers instead of using a + b + ab/100.
    const final = 100 * (1 + a / 100) * (1 + b / 100);
    return signedPct(final - 100);
  },

  "markup-discount"(text) {
    const [m, d] = grab(
      text,
      /marks his goods ([\d.]+)% above the cost price and then allows a discount of ([\d.]+)%/,
      "markup-discount",
    );
    // Route: build the actual selling price from a cost of 100.
    const sp = ((100 + m) * (100 - d)) / 100;
    return signedPct(sp - 100);
  },

  "same-sp-equal-gain-loss"(text) {
    const [sp, x1, x2] = grab(
      text,
      new RegExp(
        `sells two articles for ${RUPEE}([\\d,]+) each\\. On one of them he gains ([\\d.]+)% and on the other he loses ([\\d.]+)%`,
      ),
      "same-sp-equal-gain-loss",
    );
    if (x1 !== x2) throw new Error("gain% and loss% differ in the text");
    // Route: reconstruct both cost prices rather than using the x^2/100 shortcut.
    const cpGain = (sp * 100) / (100 + x1);
    const cpLoss = (sp * 100) / (100 - x1);
    const totalCp = cpGain + cpLoss;
    const totalSp = 2 * sp;
    return signedPct(((totalSp - totalCp) / totalCp) * 100);
  },

  "sp-from-loss-to-profit"(text) {
    const [sp1, loss, target] = grab(
      text,
      new RegExp(
        `By selling an article for ${RUPEE}([\\d,]+) a man loses ([\\d.]+)%\\. At what price should he sell the same article in order to gain ([\\d.]+)%`,
      ),
      "sp-from-loss-to-profit",
    );
    // Route: recover the cost from the loss-making sale, then apply the gain.
    const cp = (sp1 * 100) / (100 - loss);
    return inr(round((cp * (100 + target)) / 100, 2));
  },

  "successive-discount-single"(text) {
    const [d1, d2] = grab(
      text,
      /two successive discounts of ([\d.]+)% and ([\d.]+)%/,
      "successive-discount-single",
    );
    // Route: what survives both discounts, subtracted from 100.
    const survives = ((100 - d1) * (100 - d2)) / 100;
    return pct(round(100 - survives, 2));
  },

  "more-than-less-than"(text) {
    const [x] = grab(text, /A's income is ([\d.]+)% more than B's income/, "more-than-less-than");
    // Route: express B as a percentage of A, then subtract from 100.
    const bAsPctOfA = (100 / (100 + x)) * 100;
    return pct(round(100 - bAsPctOfA, 2));
  },

  "cp-articles-equals-sp-articles"(text) {
    const [n, m] = grab(
      text,
      /cost price of ([\d.]+) articles is equal to the selling price of ([\d.]+) articles/,
      "cp-articles-equals-sp-articles",
    );
    // Route: price ratio minus one.
    return pct(round((n / m - 1) * 100, 2));
  },

  "false-weight"(text) {
    const [w] = grab(
      text,
      /uses a weight of ([\d.]+) g in place of 1 kg/,
      "false-weight",
    );
    // Route: goods delivered per unit charged.
    return pct(round((1000 / w - 1) * 100, 2));
  },

  "income-expenditure-savings"(text) {
    const [p, i, e] = grab(
      text,
      /spends ([\d.]+)% of his income\. His income increases by ([\d.]+)% and at the same time his expenditure increases by ([\d.]+)%/,
      "income-expenditure-savings",
    );
    // Route: absolute savings before and after, then ratio.
    const before = 100 - p;
    const after = 100 * (1 + i / 100) - p * (1 + e / 100);
    return signedPct(round((after / before - 1) * 100, 2));
  },

  "exam-fail-both"(text) {
    const [x, y, z] = grab(
      text,
      /([\d.]+)% of the students failed in Mathematics and ([\d.]+)% failed in English\. If ([\d.]+)% of the students failed in both subjects/,
      "exam-fail-both",
    );
    // Route: passed-in-both via complement of the union.
    const failedOnlyMaths = x - z;
    const failedOnlyEnglish = y - z;
    const union = failedOnlyMaths + failedOnlyEnglish + z;
    return pct(round(100 - union, 2));
  },

  "profit-on-sp-to-cp"(text) {
    const [p] = grab(
      text,
      /profit is ([\d.]+)% of his selling price/,
      "profit-on-sp-to-cp",
    );
    // Route: with SP = 100, cost = 100 - p; profit relative to cost.
    const cost = 100 - p;
    return pct(round((p / cost) * 100, 2));
  },

  "price-rise-consumption-cut"(text) {
    const [x] = grab(text, /price of sugar rises by ([\d.]+)%/, "price-rise-consumption-cut");
    // Route: new affordable quantity for the same spend, then the shortfall.
    const newQty = 100 / (100 + x);
    return pct(round((1 - newQty) * 100, 2));
  },

  "price-cut-extra-quantity"(text) {
    const [x, q, m] = grab(
      text,
      new RegExp(
        `A reduction of ([\\d.]+)% in the price of rice enables a man to buy ([\\d.]+) kg more rice for ${RUPEE}([\\d,]+)`,
      ),
      "price-cut-extra-quantity",
    );
    // Route: solve for the ORIGINAL price from the quantity gap, then reduce it.
    // m/(P(1-x/100)) - m/P = q  =>  P = (m/q)(1/(1-x/100) - 1)
    const f = 1 - x / 100;
    const original = (m / q) * (1 / f - 1);
    const reduced = original * f;
    return inr(round(reduced, 2));
  },

  "markup-needed-for-profit"(text) {
    const [d, p] = grab(
      text,
      /after allowing a discount of ([\d.]+)%, a profit of ([\d.]+)% is still earned/,
      "markup-needed-for-profit",
    );
    // Route: required SP as a fraction of MP.
    const requiredSp = 100 + p;
    const markedPrice = requiredSp / ((100 - d) / 100);
    return pct(round(markedPrice - 100, 2));
  },

  /* ------------------------- Number System -------------------------
   * These solvers deliberately brute-force (trial division, exhaustive
   * search, term-by-term summation) instead of reusing the closed-form
   * identities the generator applied.
   * ----------------------------------------------------------------- */

  "hcf-lcm-product"(text) {
    const [h, l, a] = grab(
      text,
      /The HCF and the LCM of two numbers are (\d+) and (\d+) respectively\. If one of the numbers is (\d+)/,
      "hcf-lcm-product",
    );
    // Route: search for the number whose HCF and LCM with `a` actually match.
    for (let b = 1; b <= l; b += 1) {
      if (gcdOf(a, b) === h && lcmOf(a, b) === l && b !== a) return String(b);
    }
    throw new Error("no second number satisfies the stated HCF and LCM");
  },

  "lcm-remainder"(text) {
    const [d1, d2, d3, r] = grab(
      text,
      /Find the least number which, when divided by (\d+), (\d+) and (\d+), leaves a remainder of (\d+) in each case/,
      "lcm-remainder",
    );
    // Route: scan upward for the first number that fits, no LCM used.
    const cap = d1 * d2 * d3 + r + 1;
    for (let n = r + 1; n <= cap; n += 1) {
      if (n % d1 === r && n % d2 === r && n % d3 === r) return String(n);
    }
    throw new Error("no number found");
  },

  "hcf-remainder"(text) {
    const [A, B, C, r1, r2, r3] = grab(
      text,
      /Find the greatest number that divides (\d+), (\d+) and (\d+) leaving remainders (\d+), (\d+) and (\d+) respectively/,
      "hcf-remainder",
    );
    // Route: search downward for the largest divisor that fits all three.
    for (let g = Math.min(A, B, C); g >= 1; g -= 1) {
      if (A % g === r1 && B % g === r2 && C % g === r3) return String(g);
    }
    throw new Error("no divisor found");
  },

  "unit-digit-power"(text) {
    const [a, n] = grab(text, /Find the digit in the unit's place of (\d+)\^(\d+)/, "unit-digit-power");
    // Route: multiply out mod 10, no cycle reasoning.
    let d = 1;
    for (let i = 0; i < n; i += 1) d = (d * a) % 10;
    return String(d);
  },

  "remainder-power"(text) {
    const [a, n, m] = grab(
      text,
      /Find the remainder when (\d+)\^(\d+) is divided by (\d+)/,
      "remainder-power",
    );
    // Route: multiply out mod m, no cycle reasoning.
    let r = 1;
    for (let i = 0; i < n; i += 1) r = (r * a) % m;
    return String(r);
  },

  "missing-digit-divisible"(text) {
    const m = text.match(
      /What is the least digit that should replace \* so that the number ([\d*]+) becomes divisible by (\d+)/,
    );
    if (!m) throw new Error("could not parse missing-digit-divisible");
    const stem = m[1];
    const d = parseInt(m[2], 10);
    for (let x = 0; x <= 9; x += 1) {
      if (Number(stem.replace("*", String(x))) % d === 0) return String(x);
    }
    throw new Error("no digit works");
  },

  "factor-count"(text) {
    const [n] = grab(text, /How many factors does the number (\d+) have/, "factor-count");
    // Route: trial division, not prime factorisation.
    let count = 0;
    for (let i = 1; i <= n; i += 1) if (n % i === 0) count += 1;
    return String(count);
  },

  "sum-series"(text) {
    // Route: add the terms one by one instead of using the summation formulas.
    let m = text.match(/Find the sum of the squares of the first (\d+) natural numbers/);
    if (m) {
      const n = parseInt(m[1], 10);
      let s = 0;
      for (let i = 1; i <= n; i += 1) s += i * i;
      return String(s);
    }
    m = text.match(/Find the sum of the first (\d+) (odd|even) natural numbers/);
    if (m) {
      const n = parseInt(m[1], 10);
      let s = 0;
      let term = m[2] === "odd" ? 1 : 2;
      for (let i = 0; i < n; i += 1) {
        s += term;
        term += 2;
      }
      return String(s);
    }
    m = text.match(/Find the sum of the first (\d+) natural numbers/);
    if (m) {
      const n = parseInt(m[1], 10);
      let s = 0;
      for (let i = 1; i <= n; i += 1) s += i;
      return String(s);
    }
    throw new Error("could not parse sum-series");
  },

  "two-digit-reversal"(text) {
    const [s, diff] = grab(
      text,
      /The sum of the digits of a two-digit number is (\d+)\. When the digits are interchanged, the new number is (\d+) more than the original number/,
      "two-digit-reversal",
    );
    // Route: scan every two-digit number.
    const hits = [];
    for (let n = 10; n <= 99; n += 1) {
      const t = Math.floor(n / 10);
      const u = n % 10;
      if (t + u !== s) continue;
      if (10 * u + t - n !== diff) continue;
      hits.push(n);
    }
    if (hits.length !== 1) throw new Error(`expected one solution, found ${hits.length}`);
    return String(hits[0]);
  },

  "successive-division"(text) {
    const [a, r1, b, r2, ab] = grab(
      text,
      /A number, when divided by (\d+), leaves a remainder of (\d+)\. The quotient so obtained, when divided by (\d+), leaves a remainder of (\d+)\. What remainder will the original number leave when divided by (\d+)/,
      "successive-division",
    );
    if (a * b !== ab) throw new Error("the stated combined divisor is not a x b");
    // Route: construct actual numbers that fit and read off the remainder.
    const seen = new Set();
    for (let k = 0; k < 20; k += 1) {
      const n = a * (b * k + r2) + r1;
      seen.add(n % ab);
    }
    if (seen.size !== 1) throw new Error("remainder is not constant");
    return String([...seen][0]);
  },

  "factorial-zeros"(text) {
    const [n] = grab(text, /How many zeros are there at the end of (\d+)!/, "factorial-zeros");
    // Route: count the factors of 5 inside every term of the factorial.
    let fives = 0;
    for (let i = 1; i <= n; i += 1) {
      let v = i;
      while (v % 5 === 0) {
        fives += 1;
        v /= 5;
      }
    }
    return String(fives);
  },

  "count-multiples"(text) {
    const [N, p, q] = grab(
      text,
      /How many numbers from 1 to (\d+) are divisible by (\d+) or by (\d+)/,
      "count-multiples",
    );
    // Route: count them one by one, no inclusion-exclusion.
    let count = 0;
    for (let i = 1; i <= N; i += 1) if (i % p === 0 || i % q === 0) count += 1;
    return String(count);
  },

  /* --------------------- Ratio, Proportion & Averages --------------------- */

  "ratio-share"(text) {
    const [total, a, b, c] = grab(
      text,
      new RegExp(`A sum of ${RUPEE}([\\d,]+) is divided among A, B and C in the ratio (\\d+) : (\\d+) : (\\d+)`),
      "ratio-share",
    );
    const unit = total / (a + b + c);
    if (a * unit + b * unit + c * unit !== total) throw new Error("shares do not add to the total");
    return inr(round(b * unit, 2));
  },

  "ratio-change"(text) {
    const [a, b, add, c, d] = grab(
      text,
      /Two numbers are in the ratio (\d+) : (\d+)\. If (\d+) is added to each of them, the ratio becomes (\d+) : (\d+)/,
      "ratio-change",
    );
    // Route: search for the multiplier instead of solving the linear equation.
    const hits = [];
    for (let x = 1; x <= 2000; x += 1) {
      if ((a * x + add) * d === (b * x + add) * c) hits.push(x);
    }
    if (hits.length !== 1) throw new Error(`expected one multiplier, found ${hits.length}`);
    return String(Math.min(a * hits[0], b * hits[0]));
  },

  "average-replacement"(text) {
    const [n, d, w] = grab(
      text,
      /The average weight of (\d+) students increases by ([\d.]+) kg when a student weighing ([\d.]+) kg is replaced by a new student/,
      "average-replacement",
    );
    // Route: build a concrete group and search for the replacement weight.
    const group = [w];
    for (let i = 1; i < n; i += 1) group.push(60);
    const before = group.reduce((s, v) => s + v, 0) / n;
    for (let cand = w; cand <= w + 400; cand += 0.5) {
      const after = (group.reduce((s, v) => s + v, 0) - w + cand) / n;
      if (Math.abs(after - before - d) < 1e-9) return num(cand);
    }
    throw new Error("no replacement weight found");
  },

  "combined-average"(text) {
    const [n1, a1, n2, a2] = grab(
      text,
      /In a class, (\d+) boys have an average score of ([\d.]+) marks and (\d+) girls have an average score of ([\d.]+) marks/,
      "combined-average",
    );
    // Route: expand to individual scores and average them.
    const all = [];
    for (let i = 0; i < n1; i += 1) all.push(a1);
    for (let i = 0; i < n2; i += 1) all.push(a2);
    return num(round(all.reduce((s, v) => s + v, 0) / all.length, 2));
  },

  "alligation"(text) {
    const [cheap, dear, mean] = grab(
      text,
      new RegExp(
        `rice costing ${RUPEE}([\\d,]+) per kg be mixed with rice costing ${RUPEE}([\\d,]+) per kg so that the mixture is worth ${RUPEE}([\\d,]+) per kg`,
      ),
      "alligation",
    );
    // Route: search the smallest whole-number mix that hits the mean price.
    for (let total = 2; total <= 120; total += 1) {
      for (let r1 = 1; r1 < total; r1 += 1) {
        const r2 = total - r1;
        if (gcdOf(r1, r2) !== 1) continue;
        if (Math.abs((r1 * cheap + r2 * dear) / total - mean) < 1e-9) return `${r1} : ${r2}`;
      }
    }
    throw new Error("no mixing ratio found");
  },

  "mixture-replacement"(text) {
    const [V, x, n] = grab(
      text,
      /A vessel contains (\d+) litres of pure milk\. (\d+) litres are drawn out and replaced by water\. This operation is repeated (\d+) times/,
      "mixture-replacement",
    );
    // Route: step through the operations instead of using the power formula.
    let milk = V;
    for (let i = 0; i < n; i += 1) milk -= milk * (x / V);
    return num(round(milk, 2));
  },

  "mixture-add-water"(text) {
    const [total, a, b, add] = grab(
      text,
      /(\d+) litres of a mixture contains milk and water in the ratio (\d+) : (\d+)\. If (\d+) litres of water is added/,
      "mixture-add-water",
    );
    const unit = total / (a + b);
    const milk = a * unit;
    const water = b * unit + add;
    const g = gcdOf(milk, water);
    return `${milk / g} : ${water / g}`;
  },

  proportional(text) {
    let m = text.match(/Find the fourth proportional to (\d+), (\d+) and (\d+)/);
    if (m) {
      const [a, b, c] = m.slice(1).map(Number);
      // Route: search for the term that makes the cross-products equal.
      for (let d = 1; d <= 20000; d += 1) if (a * d === b * c) return num(d);
      throw new Error("no fourth proportional found");
    }
    m = text.match(/Find the mean proportional between (\d+) and (\d+)/);
    if (m) {
      const [a, b] = m.slice(1).map(Number);
      for (let x = 1; x <= 20000; x += 1) if (x * x === a * b) return num(x);
      throw new Error("no mean proportional found");
    }
    throw new Error("could not parse proportional");
  },

  "chain-ratio"(text) {
    const [a, b, c, d] = grab(
      text,
      /If A : B = (\d+) : (\d+) and B : C = (\d+) : (\d+), find A : B : C/,
      "chain-ratio",
    );
    // Route: put B on a common value via the LCM of the two B terms.
    const B = lcmOf(b, c);
    const A = (a * B) / b;
    const C = (d * B) / c;
    const g = gcdOf(gcdOf(A, B), C);
    return `${A / g} : ${B / g} : ${C / g}`;
  },

  "income-ratio-savings"(text) {
    const [i1, i2, e1, e2, s] = grab(
      text,
      new RegExp(
        `The incomes of A and B are in the ratio (\\d+) : (\\d+) and their expenditures are in the ratio (\\d+) : (\\d+)\\. If each of them saves ${RUPEE}([\\d,]+)`,
      ),
      "income-ratio-savings",
    );
    // Route: search the income multiplier rather than solving the 2x2 system.
    for (let x = 1; x <= 60000; x += 1) {
      const y = (i1 * x - s) / e1;
      if (y <= 0 || !Number.isInteger(y)) continue;
      if (i2 * x - e2 * y === s) return inr(round(i1 * x, 2));
    }
    throw new Error("no income found");
  },

  "corrected-average"(text) {
    const [n, avg, wrong, right] = grab(
      text,
      /The average of (\d+) observations was calculated as ([\d.]+)\. It was later found that one observation was read as ([\d.]+) instead of the correct value ([\d.]+)/,
      "corrected-average",
    );
    // Route: build the actual list, swap the value and re-average.
    const list = [wrong];
    const rest = n * avg - wrong;
    for (let i = 1; i < n; i += 1) list.push(rest / (n - 1));
    list[0] = right;
    return num(round(list.reduce((a, b) => a + b, 0) / n, 2));
  },

  /* ------------------------------ Time & Work ------------------------------ */

  "work-together-two"(text) {
    const [a, b] = grab(
      text,
      /A can complete a piece of work in (\d+) days and B can complete the same work in (\d+) days/,
      "work-together-two",
    );
    return num(round(1 / (1 / a + 1 / b), 2));
  },

  "work-find-second"(text) {
    const [t, a] = grab(
      text,
      /A and B together can complete a piece of work in (\d+) days\. A alone can complete it in (\d+) days/,
      "work-find-second",
    );
    return num(round(1 / (1 / t - 1 / a), 2));
  },

  "work-one-leaves"(text) {
    const [a, b, n] = grab(
      text,
      /A can do a piece of work in (\d+) days and B can do it in (\d+) days\. They begin together, but A leaves after (\d+) days/,
      "work-one-leaves",
    );
    const done = n * (1 / a + 1 / b);
    return num(round((1 - done) * b, 2));
  },

  "work-efficiency-percent"(text) {
    const [x, b] = grab(
      text,
      /A is ([\d.]+)% more efficient than B\. If B alone can complete a piece of work in (\d+) days/,
      "work-efficiency-percent",
    );
    return num(round((b * 100) / (100 + x), 2));
  },

  "pipes-fill-empty"(text) {
    const [a, b, c] = grab(
      text,
      /Two pipes can fill a tank in (\d+) hours and (\d+) hours respectively, while a third pipe can empty the full tank in (\d+) hours/,
      "pipes-fill-empty",
    );
    return num(round(1 / (1 / a + 1 / b - 1 / c), 2));
  },

  "pipes-leak"(text) {
    const [a, b] = grab(
      text,
      /A pipe can fill a cistern in ([\d.]+) hours, but because of a leak in the bottom it actually takes ([\d.]+) hours to fill/,
      "pipes-leak",
    );
    return num(round(1 / (1 / a - 1 / b), 2));
  },

  "men-days-hours"(text) {
    const [m1, h1, d1, m2, h2] = grab(
      text,
      /If (\d+) men working (\d+) hours a day can complete a piece of work in (\d+) days, in how many days can (\d+) men working (\d+) hours a day/,
      "men-days-hours",
    );
    // Route: total man-hours must match.
    const manHours = m1 * h1 * d1;
    return num(round(manHours / (m2 * h2), 2));
  },

  "work-wages-share"(text) {
    const [a, b, w] = grab(
      text,
      new RegExp(
        `A can do a piece of work in (\\d+) days and B can do it in (\\d+) days\\. They work together and complete it, receiving ${RUPEE}([\\d,]+) in all`,
      ),
      "work-wages-share",
    );
    // Route: share in proportion to the work each actually does.
    const t = 1 / (1 / a + 1 / b);
    const workA = t / a;
    return inr(round(w * workA, 2));
  },

  "work-alternate-days"(text) {
    const [a, b] = grab(
      text,
      /A can complete a piece of work in (\d+) days and B can complete it in (\d+) days\. They work on alternate days, with A starting on the first day/,
      "work-alternate-days",
    );
    // Route: simulate with fractional work rather than LCM units.
    let done = 0;
    let days = 0;
    for (let i = 0; i < 1000; i += 1) {
      const rate = i % 2 === 0 ? 1 / a : 1 / b;
      if (done + rate >= 1 - 1e-12) {
        days += (1 - done) / rate;
        return num(round(days, 2));
      }
      done += rate;
      days += 1;
    }
    throw new Error("simulation did not finish");
  },

  "work-together-three"(text) {
    const [a, b, c] = grab(
      text,
      /A, B and C can individually complete a piece of work in (\d+), (\d+) and (\d+) days respectively/,
      "work-together-three",
    );
    return num(round(1 / (1 / a + 1 / b + 1 / c), 2));
  },

  /* -------------------------- Speed, Time & Distance -------------------------- */

  "average-speed-two-legs"(text) {
    const [s1, s2] = grab(
      text,
      /from town P to town Q at (\d+) km\/hr and returns along the same road at (\d+) km\/hr/,
      "average-speed-two-legs",
    );
    // Route: put a concrete distance on it and divide total by total.
    const d = 600;
    const time = d / s1 + d / s2;
    return num(round((2 * d) / time, 2));
  },

  "train-cross-pole"(text) {
    const [len, kmph] = grab(
      text,
      /A train (\d+) metres long is running at a speed of (\d+) km\/hr\. How many seconds will it take to cross an electric pole/,
      "train-cross-pole",
    );
    return num(round(len / ((kmph * 1000) / 3600), 2));
  },

  "train-cross-platform"(text) {
    const [len, kmph, plat] = grab(
      text,
      /A train (\d+) metres long, running at (\d+) km\/hr, crosses a platform (\d+) metres long/,
      "train-cross-platform",
    );
    return num(round((len + plat) / ((kmph * 1000) / 3600), 2));
  },

  "two-trains-cross"(text) {
    const m = text.match(
      /Two trains of lengths (\d+) metres and (\d+) metres are running (in opposite directions|in the same direction) at (\d+) km\/hr and (\d+) km\/hr/,
    );
    if (!m) throw new Error("could not parse two-trains-cross");
    const l1 = Number(m[1]);
    const l2 = Number(m[2]);
    const opposite = m[3] === "in opposite directions";
    const s1 = Number(m[4]);
    const s2 = Number(m[5]);
    const rel = opposite ? s1 + s2 : Math.abs(s1 - s2);
    return num(round((l1 + l2) / ((rel * 1000) / 3600), 2));
  },

  "boat-stream-time"(text) {
    const [b, s, d] = grab(
      text,
      /The speed of a boat in still water is (\d+) km\/hr and the speed of the stream is (\d+) km\/hr\. How many hours will the boat take to go (\d+) km downstream/,
      "boat-stream-time",
    );
    return num(round(d / (b + s) + d / (b - s), 2));
  },

  "boat-find-speed"(text) {
    const [dDown, t, dUp] = grab(
      text,
      /A boat covers (\d+) km downstream in (\d+) hours and (\d+) km upstream in the same \d+ hours/,
      "boat-find-speed",
    );
    return num(round((dDown / t - dUp / t) / 2, 2));
  },

  "late-early-distance"(text) {
    const [s1, late, s2, early] = grab(
      text,
      /at (\d+) km\/hr reaches (\d+) minutes late\. Walking at (\d+) km\/hr, he reaches (\d+) minutes early/,
      "late-early-distance",
    );
    // Route: solve for the distance, then confirm by simulating both walks
    // that the slower one really is late by exactly the stated margin.
    const gapHours = (late + early) / 60;
    const d = gapHours / (1 / s1 - 1 / s2);
    const slowMinutes = (d / s1) * 60;
    const fastMinutes = (d / s2) * 60;
    if (Math.abs(slowMinutes - fastMinutes - (late + early)) > 1e-9) {
      throw new Error("the two walking times do not differ by the stated margin");
    }
    return num(round(d, 2));
  },

  "speed-ratio-time"(text) {
    const [p, q, extra] = grab(
      text,
      /Walking at (\d+)\/(\d+) of his usual speed, a man reaches his office (\d+) minutes later than usual/,
      "speed-ratio-time",
    );
    // Route: usual time t satisfies t * (q/p) - t = extra.
    return num(round(extra / (q / p - 1), 2));
  },

  "catch-up"(text) {
    const [s1, head, s2] = grab(
      text,
      /A thief escapes on a motorcycle at (\d+) km\/hr\. After ([\d.]+) hours a police jeep starts from the same point in pursuit at (\d+) km\/hr/,
      "catch-up",
    );
    // Route: equate the two positions instead of using a relative speed.
    // s1 * (head + t) = s2 * t
    const t = (s1 * head) / (s2 - s1);
    return num(round(s2 * t, 2));
  },

  "train-cross-man"(text) {
    const m = text.match(
      /A train (\d+) metres long is running at (\d+) km\/hr\. A man is running at (\d+) km\/hr (in the same direction as the train|in the direction opposite to that of the train)/,
    );
    if (!m) throw new Error("could not parse train-cross-man");
    const len = Number(m[1]);
    const ts = Number(m[2]);
    const ms = Number(m[3]);
    const same = m[4] === "in the same direction as the train";
    const rel = same ? ts - ms : ts + ms;
    return num(round(len / ((rel * 1000) / 3600), 2));
  },

  /* ----------------------- Simple & Compound Interest ----------------------- */

  "si-basic"(text) {
    const [p, r, t] = grab(
      text,
      new RegExp(`Find the simple interest on ${RUPEE}([\\d,]+) at ([\\d.]+)% per annum for ([\\d.]+) years`),
      "si-basic",
    );
    // Route: add up one year's interest, year by year.
    const perYear = (p * r) / 100;
    let si = 0;
    for (let i = 0; i < t; i += 1) si += perYear;
    return inr(round(si, 2));
  },

  "si-find-rate"(text) {
    const [p, si, t] = grab(
      text,
      new RegExp(
        `A sum of ${RUPEE}([\\d,]+) earns a simple interest of ${RUPEE}([\\d,]+) in ([\\d.]+) years`,
      ),
      "si-find-rate",
    );
    // Route: search the rate that reproduces the stated interest.
    for (let r = 0.25; r <= 40; r += 0.25) {
      if (Math.abs((p * r * t) / 100 - si) < 1e-9) return pct(round(r, 2));
    }
    throw new Error("no rate reproduces the stated interest");
  },

  "si-multiplies"(text) {
    const m = text.match(
      /will a sum of money (double|treble|become four times) itself in ([\d.]+) years/,
    );
    if (!m) throw new Error("could not parse si-multiplies");
    const k = { double: 2, treble: 3, "become four times": 4 }[m[1]];
    const t = Number(m[2]);
    // Route: take a concrete principal and search for the rate.
    const p = 1000;
    for (let r = 0.25; r <= 100; r += 0.25) {
      if (Math.abs(p + (p * r * t) / 100 - k * p) < 1e-9) return pct(round(r, 2));
    }
    throw new Error("no rate found");
  },

  "ci-basic"(text) {
    const [p, r, t] = grab(
      text,
      new RegExp(
        `Find the compound interest on ${RUPEE}([\\d,]+) at ([\\d.]+)% per annum for ([\\d.]+) years, compounded annually`,
      ),
      "ci-basic",
    );
    // Route: grow the balance one year at a time rather than raising to a power.
    let amount = p;
    for (let i = 0; i < t; i += 1) amount += (amount * r) / 100;
    return inr(round(amount - p, 2));
  },

  "ci-si-difference"(text) {
    const [p, r, t] = grab(
      text,
      new RegExp(
        `compound interest and the simple interest on ${RUPEE}([\\d,]+) at ([\\d.]+)% per annum for ([\\d.]+) years`,
      ),
      "ci-si-difference",
    );
    let amount = p;
    for (let i = 0; i < t; i += 1) amount += (amount * r) / 100;
    const ci = amount - p;
    const si = (p * r * t) / 100;
    return inr(round(ci - si, 2));
  },

  "ci-half-yearly"(text) {
    const [p, r, t] = grab(
      text,
      new RegExp(
        `Find the compound interest on ${RUPEE}([\\d,]+) at ([\\d.]+)% per annum for ([\\d.]+) years when the interest is compounded half-yearly`,
      ),
      "ci-half-yearly",
    );
    // Route: step through each half-year.
    const periods = Math.round(t * 2);
    let amount = p;
    for (let i = 0; i < periods; i += 1) amount += (amount * (r / 2)) / 100;
    return inr(round(amount - p, 2));
  },

  "ci-find-principal"(text) {
    const [amount, t, r] = grab(
      text,
      new RegExp(
        `A sum of money amounts to ${RUPEE}([\\d,]+) in ([\\d.]+) years at ([\\d.]+)% per annum compound interest`,
      ),
      "ci-find-principal",
    );
    // Route: unwind the growth one year at a time.
    let p = amount;
    for (let i = 0; i < t; i += 1) p /= 1 + r / 100;
    return inr(round(p, 2));
  },

  "si-two-parts"(text) {
    const [total, r1, r2, t] = grab(
      text,
      new RegExp(
        `A sum of ${RUPEE}([\\d,]+) is divided into two parts\\. One part is lent at ([\\d.]+)% per annum and the other at ([\\d.]+)% per annum simple interest\\. If the interest earned from both parts in ([\\d.]+) years is the same`,
      ),
      "si-two-parts",
    );
    // Route: search the split that makes the two interests equal.
    for (let x = 1; x < total; x += 1) {
      const i1 = (x * r1 * t) / 100;
      const i2 = ((total - x) * r2 * t) / 100;
      if (Math.abs(i1 - i2) < 1e-9) return inr(round(x, 2));
    }
    throw new Error("no split found");
  },

  /* --------------------------------- Algebra --------------------------------- */

  "linear-system"(text) {
    const [a, b, c1, b2, a2, c2] = grab(
      text,
      /Solve the equations (\d+)x \+ (\d+)y = (\d+) and (\d+)x − (\d+)y = (\d+)/,
      "linear-system",
    );
    if (b2 !== b || a2 !== a) throw new Error("the two equations do not use the stated coefficients");
    // Route: Cramer's rule.
    const det = a * -a - b * b2;
    const x = (c1 * -a - b * c2) / det;
    return num(round(x, 2));
  },

  "quadratic-roots"(text) {
    const m = text.match(
      /roots of the equation x² ([−+]) ([\d.]+)x \+ ([\d.]+) = 0, find the value of (α² \+ β²|1\/α \+ 1\/β)/,
    );
    if (!m) throw new Error("could not parse quadratic-roots");
    const b = m[1] === "−" ? -Number(m[2]) : Number(m[2]);
    const c = Number(m[3]);
    // Route: find the actual roots and evaluate the expression directly.
    const disc = b * b - 4 * c;
    if (disc < 0) throw new Error("roots are not real");
    const r1 = (-b + Math.sqrt(disc)) / 2;
    const r2 = (-b - Math.sqrt(disc)) / 2;
    const value = m[4] === "α² + β²" ? r1 * r1 + r2 * r2 : 1 / r1 + 1 / r2;
    return num(round(value, 2));
  },

  "age-problem"(text) {
    const [k1, years, k2] = grab(
      text,
      /A father is at present (\d+) times as old as his son\. After (\d+) years he will be (\d+) times as old as his son/,
      "age-problem",
    );
    // Route: try every plausible age for the son.
    const hits = [];
    for (let s = 1; s <= 120; s += 1) {
      if (k1 * s + years === k2 * (s + years)) hits.push(s);
    }
    if (hits.length !== 1) throw new Error(`expected one age, found ${hits.length}`);
    return num(hits[0]);
  },

  "reciprocal-identity"(text) {
    const m = text.match(/If x \+ 1\/x = (\d+), find the value of (x² \+ 1\/x²|x³ \+ 1\/x³)/);
    if (!m) throw new Error("could not parse reciprocal-identity");
    const k = Number(m[1]);
    // Route: solve for an actual x and evaluate numerically.
    const x = (k + Math.sqrt(k * k - 4)) / 2;
    const value = m[2] === "x² + 1/x²" ? x * x + 1 / (x * x) : x ** 3 + 1 / x ** 3;
    return num(round(value, 2));
  },

  "arithmetic-progression"(text) {
    let m = text.match(/Find the (\d+)th term of the arithmetic progression ([\d]+), ([\d]+),/);
    if (m) {
      const n = Number(m[1]);
      const a = Number(m[2]);
      const d = Number(m[3]) - a;
      // Route: step forward term by term.
      let term = a;
      for (let i = 1; i < n; i += 1) term += d;
      return num(term);
    }
    m = text.match(/Find the sum of the first (\d+) terms of the arithmetic progression ([\d]+), ([\d]+),/);
    if (m) {
      const n = Number(m[1]);
      const a = Number(m[2]);
      const d = Number(m[3]) - a;
      let term = a;
      let sum = 0;
      for (let i = 0; i < n; i += 1) {
        sum += term;
        term += d;
      }
      return num(sum);
    }
    throw new Error("could not parse arithmetic-progression");
  },

  "sum-product-identity"(text) {
    const m = text.match(/If a \+ b = (\d+) and ab = (\d+), find the value of (a² \+ b²|a³ \+ b³)/);
    if (!m) throw new Error("could not parse sum-product-identity");
    const s = Number(m[1]);
    const p = Number(m[2]);
    // Route: recover a and b themselves, then evaluate directly.
    const disc = s * s - 4 * p;
    if (disc < 0) throw new Error("no real a and b");
    const a = (s + Math.sqrt(disc)) / 2;
    const b = (s - Math.sqrt(disc)) / 2;
    const value = m[3] === "a² + b²" ? a * a + b * b : a ** 3 + b ** 3;
    return num(round(value, 2));
  },

  "remainder-theorem"(text) {
    const m = text.match(
      /the polynomial (\d+)x³ \+ (\d+)x² − (\d+)x \+ 5 is divided by \(x ([−+]) (\d+)\)/,
    );
    if (!m) throw new Error("could not parse remainder-theorem");
    const coeffs = [Number(m[1]), Number(m[2]), -Number(m[3]), 5];
    const k = m[4] === "−" ? Number(m[5]) : -Number(m[5]);
    // Route: synthetic division rather than direct substitution.
    let carry = 0;
    for (const c of coeffs) carry = c + carry * k;
    return num(carry);
  },

  "geometric-progression"(text) {
    const m = text.match(/Find the (\d+)th term of the geometric progression ([\d]+), ([\d]+),/);
    if (!m) throw new Error("could not parse geometric-progression");
    const n = Number(m[1]);
    const a = Number(m[2]);
    const r = Number(m[3]) / a;
    // Route: multiply forward term by term.
    let term = a;
    for (let i = 1; i < n; i += 1) term *= r;
    return num(round(term, 2));
  },

  /* ------------------------------- Mensuration ------------------------------- */

  "rectangle-from-ratio"(text) {
    const [a, b, perimeter] = grab(
      text,
      /The length and the breadth of a rectangle are in the ratio (\d+) : (\d+) and its perimeter is ([\d.]+) metres/,
      "rectangle-from-ratio",
    );
    // Route: search the multiplier that reproduces the perimeter.
    for (let x = 1; x <= 500; x += 1) {
      if (2 * (a * x + b * x) === perimeter) return num(a * x * b * x);
    }
    throw new Error("no multiplier reproduces the perimeter");
  },

  "circle-area-circumference"(text) {
    let m = text.match(/Find the area of a circle whose radius is ([\d.]+) cm/);
    if (m) {
      const r = Number(m[1]);
      return num(round((22 / 7) * r * r, 2));
    }
    m = text.match(/Find the circumference of a circle whose radius is ([\d.]+) cm/);
    if (m) {
      const r = Number(m[1]);
      // Route: circumference as pi times the diameter.
      return num(round((22 / 7) * (2 * r), 2));
    }
    throw new Error("could not parse circle-area-circumference");
  },

  "cuboid-volume-surface"(text) {
    const m = text.match(
      /Find the (volume|total surface area) of a cuboid whose length, breadth and height are ([\d.]+) cm, ([\d.]+) cm and ([\d.]+) cm/,
    );
    if (!m) throw new Error("could not parse cuboid-volume-surface");
    const l = Number(m[2]);
    const b = Number(m[3]);
    const h = Number(m[4]);
    if (m[1] === "volume") return num(round(l * b * h, 2));
    // Route: add the six faces individually.
    const faces = [l * b, l * b, b * h, b * h, h * l, h * l];
    return num(round(faces.reduce((x, y) => x + y, 0), 2));
  },

  "cylinder-volume-curved"(text) {
    const m = text.match(
      /Find the (volume|curved surface area) of a right circular cylinder of radius ([\d.]+) cm and height ([\d.]+) cm/,
    );
    if (!m) throw new Error("could not parse cylinder-volume-curved");
    const r = Number(m[2]);
    const h = Number(m[3]);
    if (m[1] === "volume") return num(round((22 / 7) * r * r * h, 2));
    // Route: unrolled rectangle, circumference times height.
    return num(round((22 / 7) * 2 * r * h, 2));
  },

  "square-diagonal"(text) {
    const [d] = grab(text, /The diagonal of a square is ([\d.]+) cm/, "square-diagonal");
    // Route: recover the side first, then square it.
    const side = d / Math.SQRT2;
    return num(round(side * side, 2));
  },

  "path-around-field"(text) {
    const [l, b, w] = grab(
      text,
      /A rectangular field is ([\d.]+) metres long and ([\d.]+) metres wide\. A path of uniform width ([\d.]+) metres runs all around it on the OUTSIDE/,
      "path-around-field",
    );
    // Route: split the path into four strips instead of subtracting rectangles.
    const topAndBottom = 2 * (w * (l + 2 * w));
    const sides = 2 * (w * b);
    return num(round(topAndBottom + sides, 2));
  },

  "cost-of-area"(text) {
    const [l, b, rate] = grab(
      text,
      new RegExp(
        `The floor of a room is ([\\d.]+) metres long and ([\\d.]+) metres wide\\. Find the cost of carpeting it at ${RUPEE}([\\d,]+) per square metre`,
      ),
      "cost-of-area",
    );
    return inr(round(l * b * rate, 2));
  },

  "right-triangle"(text) {
    const m = text.match(
      /The two legs of a right-angled triangle are ([\d.]+) cm and ([\d.]+) cm\. Find (its area, in square cm|the length of its hypotenuse, in cm)/,
    );
    if (!m) throw new Error("could not parse right-triangle");
    const a = Number(m[1]);
    const b = Number(m[2]);
    if (m[3].startsWith("its area")) return num(round((a * b) / 2, 2));
    return num(round(Math.sqrt(a * a + b * b), 2));
  },

  "cube-side"(text) {
    let m = text.match(/The volume of a cube is ([\d.]+) cubic cm\. Find its total surface area/);
    if (m) {
      const vol = Number(m[1]);
      const side = Math.round(Math.cbrt(vol));
      if (side ** 3 !== vol) throw new Error("volume is not a perfect cube");
      return num(6 * side * side);
    }
    m = text.match(/The total surface area of a cube is ([\d.]+) square cm\. Find its volume/);
    if (m) {
      const surface = Number(m[1]);
      const side = Math.round(Math.sqrt(surface / 6));
      if (6 * side * side !== surface) throw new Error("surface area does not give a whole side");
      return num(side ** 3);
    }
    throw new Error("could not parse cube-side");
  },

  /* -------------------------- Probability & Statistics -------------------------- */

  "two-dice"(text) {
    const m = text.match(
      /the sum of the numbers on them is (exactly (\d+)|(\d+) or more|(\d+) or less)/,
    );
    if (!m) throw new Error("could not parse two-dice");
    const exact = m[2] !== undefined;
    const atMost = m[4] !== undefined;
    const target = Number(m[2] ?? m[3] ?? m[4]);
    let fav = 0;
    for (let a = 1; a <= 6; a += 1) {
      for (let b = 1; b <= 6; b += 1) {
        const sum = a + b;
        if (exact ? sum === target : atMost ? sum <= target : sum >= target) fav += 1;
      }
    }
    return reduceFraction(fav, 36);
  },

  "balls-from-bag"(text) {
    const [r, b, g] = grab(
      text,
      /A bag contains (\d+) red, (\d+) blue and (\d+) green balls/,
      "balls-from-bag",
    );
    const total = r + b + g;
    if (/One ball is drawn at random/.test(text)) {
      if (/it is blue\?/.test(text)) return reduceFraction(b, total);
      return reduceFraction(r, total);
    }
    if (/Two balls are drawn at random together/.test(text)) {
      // Route: sequential probability rather than combinations.
      const p = (r / total) * ((r - 1) / (total - 1));
      // Express as a fraction over C(total, 2).
      const denom = (total * (total - 1)) / 2;
      const numer = Math.round(p * denom);
      if (Math.abs(numer / denom - p) > 1e-9) throw new Error("probability is not a clean fraction");
      return reduceFraction(numer, denom);
    }
    throw new Error("could not parse balls-from-bag");
  },

  "cards-draw"(text) {
    const m = text.match(
      /the card drawn is (a king|a queen|a jack|a heart|a diamond|a club|a face card|a red card|a black card|an ace|a spade|a red king|a black king|a black face card|a red face card|a numbered card \(2 to 10\))\?/,
    );
    if (!m) throw new Error("could not parse cards-draw");
    // Route: build the actual 52-card pack and filter it.
    const ranks = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"];
    const suits = [
      { name: "hearts", red: true },
      { name: "diamonds", red: true },
      { name: "spades", red: false },
      { name: "clubs", red: false },
    ];
    const deck = [];
    for (const s of suits) for (const r of ranks) deck.push({ rank: r, suit: s.name, red: s.red });
    if (deck.length !== 52) throw new Error("pack is not 52 cards");
    const tests = {
      "a king": (c) => c.rank === "K",
      "a queen": (c) => c.rank === "Q",
      "a jack": (c) => c.rank === "J",
      "a heart": (c) => c.suit === "hearts",
      "a diamond": (c) => c.suit === "diamonds",
      "a club": (c) => c.suit === "clubs",
      "a face card": (c) => ["J", "Q", "K"].includes(c.rank),
      "a red card": (c) => c.red,
      "a black card": (c) => !c.red,
      "an ace": (c) => c.rank === "A",
      "a spade": (c) => c.suit === "spades",
      "a red king": (c) => c.rank === "K" && c.red,
      "a black king": (c) => c.rank === "K" && !c.red,
      "a black face card": (c) => ["J", "Q", "K"].includes(c.rank) && !c.red,
      "a red face card": (c) => ["J", "Q", "K"].includes(c.rank) && c.red,
      "a numbered card (2 to 10)": (c) => !["J", "Q", "K", "A"].includes(c.rank),
    };
    const fav = deck.filter(tests[m[1]]).length;
    return reduceFraction(fav, 52);
  },

  "coin-toss"(text) {
    const m = text.match(
      /(\d+) fair coins are tossed together\. What is the probability of getting (exactly|at least) (\d+) heads/,
    );
    if (!m) throw new Error("could not parse coin-toss");
    const n = Number(m[1]);
    const exact = m[2] === "exactly";
    const k = Number(m[3]);
    // Route: enumerate all 2^n outcomes bit by bit.
    let fav = 0;
    for (let mask = 0; mask < 2 ** n; mask += 1) {
      let heads = 0;
      for (let bit = 0; bit < n; bit += 1) if (mask & (1 << bit)) heads += 1;
      if (exact ? heads === k : heads >= k) fav += 1;
    }
    return reduceFraction(fav, 2 ** n);
  },

  "committee-selection"(text) {
    const [pickM, pickW, m, w] = grab(
      text,
      /a committee of (\d+) (?:man|men) and (\d+) (?:woman|women) be formed from (\d+) men and (\d+) women/,
      "committee-selection",
    );
    // Route: factorial form of nCr rather than the iterative product.
    const c = (n, r) => factorialOf(n) / (factorialOf(r) * factorialOf(n - r));
    return num(Math.round(c(m, pickM) * c(w, pickW)));
  },

  "letter-arrangements"(text) {
    const m = text.match(/letters of the word ([A-Z]+) be arranged/);
    if (!m) throw new Error("could not parse letter-arrangements");
    const word = m[1];
    // Route: count letters from the printed word, then apply the multinomial
    // formula. For short words we also enumerate distinct permutations as a
    // cross-check so a wrong formula cannot hide.
    const counts = new Map();
    for (const ch of word) counts.set(ch, (counts.get(ch) || 0) + 1);
    let ways = factorialOf(word.length);
    for (const c of counts.values()) ways /= factorialOf(c);
    ways = Math.round(ways);
    if (word.length <= 8) {
      const seen = new Set();
      const permute = (prefix, rest) => {
        if (!rest.length) {
          seen.add(prefix);
          return;
        }
        for (let i = 0; i < rest.length; i += 1) {
          permute(prefix + rest[i], rest.slice(0, i) + rest.slice(i + 1));
        }
      };
      permute("", word);
      if (seen.size !== ways) throw new Error("multinomial and enumeration disagree");
    }
    return num(ways);
  },

  "central-tendency"(text) {
    const m = text.match(/Find the (mean|median|mode) of the following data: ([\d, ]+)\./);
    if (!m) throw new Error("could not parse central-tendency");
    const want = m[1];
    const data = m[2].split(",").map((s) => Number(s.trim()));
    if (want === "mean") {
      return num(round(data.reduce((a, b) => a + b, 0) / data.length, 2));
    }
    const sorted = [...data].sort((a, b) => a - b);
    if (want === "median") {
      const mid = sorted.length / 2;
      const value =
        sorted.length % 2 === 1 ? sorted[Math.floor(mid)] : (sorted[mid - 1] + sorted[mid]) / 2;
      return num(round(value, 2));
    }
    const tally = new Map();
    for (const v of sorted) tally.set(v, (tally.get(v) || 0) + 1);
    const top = [...tally.entries()].sort((a, b) => b[1] - a[1]);
    if (top.length > 1 && top[0][1] === top[1][1]) throw new Error("the data has no unique mode");
    return num(top[0][0]);
  },

  "at-least-one"(text) {
    const [good, bad, pick] = grab(
      text,
      /A box contains (\d+) good bulbs and (\d+) defective bulbs\. (\d+) bulbs are drawn at random together/,
      "at-least-one",
    );
    // Route: add up the cases with 1, 2, ... defectives instead of using the complement.
    const c = (n, r) => (r < 0 || r > n ? 0 : factorialOf(n) / (factorialOf(r) * factorialOf(n - r)));
    const total = c(good + bad, pick);
    let fav = 0;
    for (let d = 1; d <= pick; d += 1) fav += c(bad, d) * c(good, pick - d);
    return reduceFraction(Math.round(fav), Math.round(total));
  },

  /* --------------------------------- Series --------------------------------- */

  "series-arithmetic": solveSeries,
  "series-geometric": solveSeries,
  "series-second-difference": solveSeries,
  "series-multiply-add": solveSeries,
  "series-power-offset": solveSeries,
  "series-sum-of-two": solveSeries,
  "series-alternating": solveSeries,
  "series-missing-middle": solveSeries,

  /* ----------------------------- Coding & Decoding ----------------------------- */

  "code-fixed-shift": solveCode,
  "code-opposite-letter": solveCode,
  "code-reverse": solveCode,
  "code-progressive-shift": solveCode,
  "code-alternate-shift": solveCode,

  /* ------------------------------ Direction Sense ------------------------------ */

  "direction-net-distance"(text) {
    const { x, y } = simulateWalk(text);
    const d = Math.sqrt(x * x + y * y);
    if (!Number.isInteger(d)) throw new Error("the straight-line distance is not a whole number");
    return num(d);
  },

  "direction-final-facing"(text) {
    return FACING_LABELS[simulateWalk(text).facing];
  },

  "direction-bearing-from-start"(text) {
    const { x, y } = simulateWalk(text);
    if (x === 0 || y === 0) throw new Error("the end point lies on an axis, so there is no compound bearing");
    return BEARING_LABELS[`${y > 0 ? "north" : "south"}-${x > 0 ? "east" : "west"}`];
  },

  /* --------------------------- Ranking, Order & Position --------------------------- */

  "rank-both-ends"(text) {
    const [left, right] = grab(
      text,
      /Rahul is (\d+)th from the left end and (\d+)th from the right end/,
      "rank-both-ends",
    );
    // Route: build rows until one puts Rahul at both stated positions.
    for (let total = 1; total <= 200; total += 1) {
      const row = Array.from({ length: total }, (_, i) => i);
      const idx = left - 1;
      if (idx >= total) continue;
      if (row.length - idx === right) return num(total);
    }
    throw new Error("no row length fits both positions");
  },

  "rank-other-end"(text) {
    const [total, left] = grab(
      text,
      /In a row of (\d+) students, Sita is (\d+)th from the left end/,
      "rank-other-end",
    );
    // Route: build the row and count back from the far end.
    const row = Array.from({ length: total }, (_, i) => i + 1);
    const sita = row[left - 1];
    const fromRight = row.length - row.indexOf(sita);
    return num(fromRight);
  },

  "rank-between"(text) {
    const [total, left, right] = grab(
      text,
      /In a row of (\d+) students, Amit is (\d+)th from the left end and Bhavna is (\d+)th from the right end/,
      "rank-between",
    );
    const row = Array.from({ length: total }, (_, i) => i + 1);
    const amit = left - 1;
    const bhavna = total - right;
    if (bhavna <= amit) throw new Error("Bhavna is not to the right of Amit");
    return num(row.slice(amit + 1, bhavna).length);
  },

  "rank-interchange"(text) {
    const [, bRight, newLeft] = grab(
      text,
      /Karan is (\d+)th from the left end and Meena is (\d+)th from the right end\. They interchange their positions, and Karan then becomes (\d+)th from the left end/,
      "rank-interchange",
    );
    // Route: search for the row length in which Meena occupies the seat Karan
    // ends up in, counted from both ends.
    for (let total = 2; total <= 200; total += 1) {
      const meenaFromLeft = total - bRight + 1;
      if (meenaFromLeft === newLeft) return num(total);
    }
    throw new Error("no row length is consistent with the swap");
  },

  /* ------------------------------------ Puzzles ------------------------------------ */

  "puzzle-row-seating"(text) {
    const people = readCast(text, /Five students ([A-Z]), ([A-Z]), ([A-Z]), ([A-Z]) and ([A-Z]) are sitting/);
    const tests = [];
    collect(text, /([A-Z]) is sitting at the extreme left end\./g, (m) => (a) => a[0] === m[1]);
    collect(text, /([A-Z]) is sitting at the extreme right end\./g, (m) => (a) => a[4] === m[1]);
    collect(text, /([A-Z]) is sitting immediately to the left of ([A-Z])\./g, (m) => (a) =>
      a.indexOf(m[1]) + 1 === a.indexOf(m[2]));
    collect(text, /([A-Z]) is sitting immediately to the right of ([A-Z])\./g, (m) => (a) =>
      a.indexOf(m[1]) - 1 === a.indexOf(m[2]));
    collect(text, /Exactly (\d+) students? sits? between ([A-Z]) and ([A-Z])\./g, (m) => (a) =>
      Math.abs(a.indexOf(m[2]) - a.indexOf(m[3])) - 1 === Number(m[1]));
    collect(text, /([A-Z]) is sitting (\d+)\w\w from the left\./g, (m) => (a) =>
      a.indexOf(m[1]) === Number(m[2]) - 1);
    collect(text, /([A-Z]) is sitting (\d+)\w\w from the right\./g, (m) => (a) =>
      a.length - a.indexOf(m[1]) === Number(m[2]));
    function collect(src, re, build) {
      for (const m of src.matchAll(re)) tests.push(build(m));
    }
    if (tests.length < 2) throw new Error("too few clues were recognised");

    const fits = allArrangements(people).filter((a) => tests.every((t) => t(a)));
    if (fits.length === 0) throw new Error("no seating satisfies the clues as printed");

    let readAnswer;
    if (/in the middle of the row/.test(text)) readAnswer = (a) => a[2];
    else if (/at the extreme right end\?/.test(text)) readAnswer = (a) => a[4];
    else if (/at the extreme left end\?/.test(text)) readAnswer = (a) => a[0];
    else if (/2nd from the right\?/.test(text)) readAnswer = (a) => a[3];
    else throw new Error("the question being asked was not recognised");

    return uniqueAnswer(fits.map(readAnswer));
  },

  "puzzle-floors"(text) {
    const people = readCast(text, /Five people ([A-Z]), ([A-Z]), ([A-Z]), ([A-Z]) and ([A-Z]) live/);
    const tests = [];
    const floorOf = (a, n) => a.indexOf(n) + 1;
    const add = (re, build) => {
      for (const m of text.matchAll(re)) tests.push(build(m));
    };
    add(/([A-Z]) lives on floor (\d+)\./g, (m) => (a) => floorOf(a, m[1]) === Number(m[2]));
    add(/([A-Z]) lives immediately above ([A-Z])\./g, (m) => (a) =>
      floorOf(a, m[1]) === floorOf(a, m[2]) + 1);
    add(/([A-Z]) lives immediately below ([A-Z])\./g, (m) => (a) =>
      floorOf(a, m[1]) === floorOf(a, m[2]) - 1);
    add(/Exactly (\d+) floors? lies? between ([A-Z]) and ([A-Z])\./g, (m) => (a) =>
      Math.abs(floorOf(a, m[2]) - floorOf(a, m[3])) - 1 === Number(m[1]));
    add(/([A-Z]) lives on the topmost floor\./g, (m) => (a) => floorOf(a, m[1]) === 5);
    add(/([A-Z]) lives on the lowest floor\./g, (m) => (a) => floorOf(a, m[1]) === 1);
    if (tests.length < 2) throw new Error("too few clues were recognised");

    const fits = allArrangements(people).filter((a) => tests.every((t) => t(a)));
    if (fits.length === 0) throw new Error("no stacking satisfies the clues as printed");

    const [who] = grab2(text, /On which floor does ([A-Z]) live\?/);
    return uniqueAnswer(fits.map((a) => String(floorOf(a, who))));
  },

  "puzzle-comparison-order"(text) {
    const people = readCast(text, /Among five friends ([A-Z]), ([A-Z]), ([A-Z]), ([A-Z]) and ([A-Z]),/);
    const tests = [];
    for (const m of text.matchAll(/([A-Z]) is taller than ([A-Z])\./g)) {
      tests.push((a) => a.indexOf(m[1]) < a.indexOf(m[2]));
    }
    for (const m of text.matchAll(/([A-Z]) is shorter than ([A-Z])\./g)) {
      tests.push((a) => a.indexOf(m[1]) > a.indexOf(m[2]));
    }
    if (tests.length < 3) throw new Error("too few comparisons were recognised");

    const fits = allArrangements(people).filter((a) => tests.every((t) => t(a)));
    if (fits.length === 0) throw new Error("no ordering satisfies the comparisons as printed");

    let rank;
    if (/Who is the tallest\?/.test(text)) rank = 1;
    else if (/Who is the shortest\?/.test(text)) rank = 5;
    else {
      const m = text.match(/Who is the (\d+)\w\w tallest\?/);
      if (!m) throw new Error("the question being asked was not recognised");
      rank = Number(m[1]);
    }
    return uniqueAnswer(fits.map((a) => a[rank - 1]));
  },

  /* ------------------------------ Data Interpretation ------------------------------ */

  "di-share-of-total"(text) {
    const t = readTable(text);
    const key = grabKey(text, /The figure for ([A-E]) is what percentage/);
    // Route: scale the entry to a per-thousand figure first, then to a percentage.
    const perMille = (t.get(key) * 1000) / t.total;
    return num(round(perMille / 10, 2)) + "%";
  },

  "di-ratio-of-two"(text) {
    const t = readTable(text);
    const m = text.match(/ratio of the figure for ([A-E]) to the figure for ([A-E])\?/);
    if (!m) throw new Error("could not read which two entries are compared");
    let a = t.get(m[1]);
    let b = t.get(m[2]);
    // Route: strip common prime factors one at a time instead of using a gcd.
    for (const p of [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]) {
      while (a % p === 0 && b % p === 0) {
        a /= p;
        b /= p;
      }
    }
    return `${num(a)} : ${num(b)}`;
  },

  "di-average"(text) {
    const t = readTable(text);
    // Route: average of deviations from the first entry.
    const base = t.values[0];
    const mean = base + t.values.reduce((s, v) => s + (v - base), 0) / t.values.length;
    return num(round(mean, 2));
  },

  "di-highest-minus-lowest"(text) {
    const t = readTable(text);
    const sorted = [...t.values].sort((p, q) => p - q);
    return num(sorted[sorted.length - 1] - sorted[0]);
  },

  "di-above-average"(text) {
    const t = readTable(text);
    const mean = t.total / t.values.length;
    return num(t.values.filter((v) => v > mean).length);
  },

  "di-pie-angle"(text) {
    const t = readTable(text);
    const key = grabKey(text, /central angle, in degrees, of the sector for ([A-E])\?/);
    // Route: fraction of the circle, taken straight from the raw counts.
    return num(round((t.get(key) / t.total) * 360, 2));
  },

  "di-two-together"(text) {
    const t = readTable(text);
    const m = text.match(/The figures for ([A-E]) and ([A-E]) taken together/);
    if (!m) throw new Error("could not read which two entries are combined");
    // Route: work out the share of the other three and subtract from 100.
    const others = ["A", "B", "C", "D", "E"].filter((k) => k !== m[1] && k !== m[2]);
    const rest = others.reduce((s, k) => s + t.get(k), 0);
    return num(round(100 - (rest * 100) / t.total, 2)) + "%";
  },

  /* -------------------------------- Blood Relations -------------------------------- */

  "relation-statement-chain"(text) {
    const facts = [...text.matchAll(/([A-Z]) is the ([a-z-]+) of ([A-Z])\./g)].map((m) => [
      m[1], m[2], m[3],
    ]);
    if (facts.length === 0) throw new Error("no family statements found");
    const [x, y] = grabPair(text, /How is ([A-Z]) related to ([A-Z])\?/);
    return nameRelation(facts, x, y);
  },

  "relation-coded-expression"(text) {
    const legend = new Map();
    for (const m of text.matchAll(/A (\S) B means 'A is the ([a-z-]+) of B'/g)) {
      legend.set(m[1], m[2]);
    }
    if (legend.size !== 4) throw new Error(`the legend has ${legend.size} entries, not 4`);
    const expr = text.match(/in the expression ([A-Z](?: \S [A-Z])+)\?/);
    if (!expr) throw new Error("could not read the expression");
    const tokens = expr[1].split(" ");
    const facts = [];
    for (let i = 1; i < tokens.length; i += 2) {
      const rel = legend.get(tokens[i]);
      if (!rel) throw new Error(`the legend says nothing about "${tokens[i]}"`);
      facts.push([tokens[i - 1], rel, tokens[i + 1]]);
    }
    const [x, y] = grabPair(text, /how is ([A-Z]) related to ([A-Z])/);
    return nameRelation(facts, x, y);
  },

  /* ----------------------------------- Analogy ----------------------------------- */

  "analogy-uniform-shift": solveLetterAnalogy,
  "analogy-progressive-shift": solveLetterAnalogy,
  "analogy-reversal": solveLetterAnalogy,
  "analogy-opposite-letter": solveLetterAnalogy,

  "analogy-number-rule"(text) {
    const m = text.match(
      /In each of the pairs \((\d+), (\d+)\), \((\d+), (\d+)\), \((\d+), (\d+)\) the second number/,
    );
    if (!m) throw new Error("could not read the three number pairs");
    const [t] = grab(text, /in \((\d+), \?\)/, "analogy-number-rule");
    const pts = [
      [Number(m[1]), Number(m[2])],
      [Number(m[3]), Number(m[4])],
      [Number(m[5]), Number(m[6])],
    ];

    // Route: brute-force every integer cubic in a bounded catalogue and insist
    // that all the rules fitting the three pairs agree about the fourth.
    const predictions = new Set();
    for (let a = -4; a <= 4; a += 1) {
      for (let b = -6; b <= 6; b += 1) {
        for (let c = -12; c <= 12; c += 1) {
          const d0 = pts[0][1] - (a * pts[0][0] ** 3 + b * pts[0][0] ** 2 + c * pts[0][0]);
          if (d0 < -30 || d0 > 30) continue;
          const fits = pts.every(
            ([x, y]) => a * x ** 3 + b * x ** 2 + c * x + d0 === y,
          );
          if (fits) predictions.add(a * t ** 3 + b * t ** 2 + c * t + d0);
        }
      }
    }
    if (predictions.size === 0) throw new Error("no rule in the catalogue fits the three pairs");
    if (predictions.size > 1) {
      throw new Error(`the pairs allow more than one answer: ${[...predictions].join(", ")}`);
    }
    return num([...predictions][0]);
  },

  /* ---------------------------------- Syllogism ---------------------------------- */

  syllogism: solveSyllogism,

  /* ------------------------------ Clocks & Calendars ------------------------------ */

  "clock-hand-angle"(text) {
    const [h, m] = grab(text, /at (\d+):(\d\d)\?/, "clock-hand-angle");
    // Route: express each hand as a fraction of a full turn, then convert once.
    const minuteTurn = m / 60;
    const hourTurn = ((h % 12) + m / 60) / 12;
    let diff = Math.abs(minuteTurn - hourTurn) * 360;
    if (diff > 180) diff = 360 - diff;
    return num(round(diff, 2));
  },

  "calendar-weekday-of-date"(text) {
    const { d, m, y } = grabDate(text, /was (\d+) ([A-Z][a-z]+) (\d+)\?/, "calendar-weekday-of-date");
    return WEEKDAY_LABELS[doomsdayWeekday(d, m, y)];
  },

  "calendar-same-year"(text) {
    const [y] = grab(text, /same calendar as the year (\d+)\?/, "calendar-same-year");
    // Route: step forward comparing the real weekday of 1 January and the leap
    // flag, both taken from the platform's own date arithmetic.
    const startDay = new Date(Date.UTC(y, 0, 1)).getUTCDay();
    const startLeap = new Date(Date.UTC(y, 1, 29)).getUTCMonth() === 1;
    for (let cand = y + 1; cand <= y + 40; cand += 1) {
      const day = new Date(Date.UTC(cand, 0, 1)).getUTCDay();
      const leap = new Date(Date.UTC(cand, 1, 29)).getUTCMonth() === 1;
      if (day === startDay && leap === startLeap) return num(cand);
    }
    throw new Error("no repeating year found within 40 years");
  },

  "clock-gain-loss"(text) {
    const [rate] = grab(text, /clock (?:gains|loses) (\d+) minutes every hour/, "clock-gain-loss");
    const hours = text.includes("the next midnight")
      ? 24
      : grab(text, /correct time at (\d+):00\?/, "clock-gain-loss")[0];
    // Route: accumulate the drift one true hour at a time.
    let drift = 0;
    for (let i = 0; i < hours; i += 1) drift += rate;
    return num(drift);
  },

  "calendar-days-between"(text) {
    const m = text.match(
      /from (\d+) ([A-Z][a-z]+) (\d+) to (\d+) ([A-Z][a-z]+) (\d+),/,
    );
    if (!m) throw new Error("could not read the two dates");
    const from = { d: Number(m[1]), mo: MONTH_INDEX[m[2]], y: Number(m[3]) };
    const to = { d: Number(m[4]), mo: MONTH_INDEX[m[5]], y: Number(m[6]) };
    // Route: walk the calendar a day at a time with our own month lengths.
    let count = 0;
    const cur = { ...from };
    while (!(cur.d === to.d && cur.mo === to.mo && cur.y === to.y)) {
      cur.d += 1;
      if (cur.d > monthLength(cur.mo, cur.y)) {
        cur.d = 1;
        cur.mo += 1;
        if (cur.mo > 12) {
          cur.mo = 1;
          cur.y += 1;
        }
      }
      count += 1;
      if (count > 20000) throw new Error("the second date never arrives");
    }
    return num(count);
  },

  "clock-mirror-image"(text) {
    const [h, m] = grab(text, /shows the time as (\d+):(\d\d)\./, "clock-mirror-image");
    // Route: reflect each hand's angle about the 12-6 line separately, then read
    // the dial back off those two angles.
    const minuteAngle = (360 - m * 6) % 360;
    const hourAngle = (360 - (((h % 12) * 30 + m * 0.5) % 360)) % 360;
    const realMinute = Math.round(minuteAngle / 6) % 60;
    let realHour = Math.floor(hourAngle / 30);
    if (realHour === 0) realHour = 12;
    // The hour hand must sit inside the hour it names.
    const check = ((realHour % 12) * 30 + realMinute * 0.5) % 360;
    if (Math.abs(check - hourAngle) > 1e-6) {
      throw new Error("the two reflected hands disagree about the hour");
    }
    return `${realHour}:${String(realMinute).padStart(2, "0")}`;
  },

  "calendar-weekday-shift"(text) {
    const m = text.match(/If today is ([A-Z][a-z]+), what day of the week will it be after (\d+) days\?/);
    if (!m) throw new Error("could not read the starting day");
    const start = WEEKDAY_NAMES.indexOf(m[1]);
    if (start < 0) throw new Error(`unknown weekday "${m[1]}"`);
    // Route: step one day at a time rather than reducing modulo 7.
    let idx = start;
    for (let i = 0; i < Number(m[2]); i += 1) idx = (idx + 1) % 7;
    return WEEKDAY_LABELS[idx];
  },

  "clock-hands-meet"(text) {
    const [h] = grab(text, /minutes past (\d+) o'clock/, "clock-hands-meet");
    const wantOpposite = text.includes("opposite directions");
    // Route: solve the angle equation directly on exact rationals. In t minutes
    // past h the minute hand is at 6t degrees and the hour hand at 30h + 0.5t.
    // Setting the gap to 0 or 180 gives t = (30h - target) / 5.5.
    const target = wantOpposite ? 180 : 0;
    let t = (30 * h - target) / 5.5;
    while (t < 0) t += 720 / 11;
    if (t >= 60) throw new Error("the hands do not reach that position inside the hour");
    const elevenths = Math.round(t * 11);
    const whole = Math.floor(elevenths / 11);
    const frac = elevenths % 11;
    if (frac === 0) throw new Error("the answer is a whole number of minutes");
    return `${whole} ${frac}/11`;
  },

  "rank-class-position"(text) {
    const [total, fail, top] = grab(
      text,
      /In a class of (\d+) students, (\d+) students were absent from the examination and were therefore not ranked\. Among those who were ranked, Vijay stands (\d+)th from the top/,
      "rank-class-position",
    );
    // Route: build the actual ranked list and count from its other end.
    const ranked = Array.from({ length: total - fail }, (_, i) => i + 1);
    const vijay = ranked[top - 1];
    if (vijay === undefined) throw new Error("Vijay's rank is beyond the ranked list");
    return num(ranked.length - ranked.indexOf(vijay));
  },
};

/* ---------------------------------------------------------------------------
 * Coding & decoding
 *
 * The rule is never stated in the question, so it is inferred from the worked
 * example by testing a library of transformations. A question is accepted only
 * when every rule that explains the example also agrees on the answer.
 * ------------------------------------------------------------------------- */

const CODE_A = "A".charCodeAt(0);
const bump = (ch, k) => String.fromCharCode(((ch.charCodeAt(0) - CODE_A + k + 260) % 26) + CODE_A);

function codeRules() {
  const rules = [];
  for (let k = -25; k <= 25; k += 1) {
    if (k === 0) continue;
    rules.push([`shift${k}`, (w) => [...w].map((c) => bump(c, k)).join("")]);
    rules.push([`alt${k}`, (w) => [...w].map((c, i) => bump(c, i % 2 === 0 ? k : -k)).join("")]);
  }
  rules.push(["reverse", (w) => [...w].reverse().join("")]);
  rules.push(["opposite", (w) => [...w].map((c) => String.fromCharCode(2 * CODE_A + 25 - c.charCodeAt(0))).join("")]);
  rules.push(["progressive", (w) => [...w].map((c, i) => bump(c, i + 1)).join("")]);
  rules.push(["progressive-back", (w) => [...w].map((c, i) => bump(c, -(i + 1))).join("")]);
  rules.push(["reverse-then-shift1", (w) => [...w].reverse().map((c) => bump(c, 1)).join("")]);
  return rules;
}

const CODE_RULES = codeRules();

function solveCode(text) {
  const m = text.match(
    /In a certain code language, ([A-Z]+) is written as ([A-Z]+)\. How will ([A-Z]+) be written in the same code\?/,
  );
  if (!m) throw new Error("could not parse the coding question");
  const [, source, code, target] = m;
  const answers = new Map();
  for (const [name, fn] of CODE_RULES) {
    if (fn(source) === code) answers.set(name, fn(target));
  }
  if (answers.size === 0) throw new Error("no known rule turns the example word into its code");
  const distinct = new Set(answers.values());
  if (distinct.size > 1) {
    const detail = [...answers.entries()].map(([k, v]) => `${k}->${v}`).join(", ");
    throw new Error(`the coding rule is ambiguous: ${detail}`);
  }
  return [...distinct][0];
}

/* ---------------------------------------------------------------------------
 * Direction sense: re-parse the rendered walk and replay it on a grid.
 * ------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------
 * Puzzles: rebuild the clue list from the printed sentences and search every
 * arrangement. The answer counts as verified only when all the arrangements
 * that survive the clues agree, which also catches an under-specified puzzle.
 * ------------------------------------------------------------------------- */

function readCast(text, re) {
  const m = text.match(re);
  if (!m) throw new Error("could not read the five names");
  const people = m.slice(1, 6);
  if (new Set(people).size !== 5) throw new Error("the five names are not distinct");
  return people;
}

function grab2(text, re) {
  const m = text.match(re);
  if (!m) throw new Error("could not read the person the question asks about");
  return m.slice(1);
}

function allArrangements(items) {
  if (items.length <= 1) return [items];
  const out = [];
  for (let i = 0; i < items.length; i += 1) {
    const rest = [...items.slice(0, i), ...items.slice(i + 1)];
    for (const tail of allArrangements(rest)) out.push([items[i], ...tail]);
  }
  return out;
}

function uniqueAnswer(candidates) {
  const distinct = [...new Set(candidates)];
  if (distinct.length > 1) {
    throw new Error(`the clues leave more than one answer: ${distinct.join(", ")}`);
  }
  return distinct[0];
}

/* ---------------------------------------------------------------------------
 * Data interpretation: read the printed table back out of the question.
 * ------------------------------------------------------------------------- */

function readTable(text) {
  const entries = [...text.matchAll(/\b([A-E]): (\d+)/g)].map((m) => [m[1], Number(m[2])]);
  if (entries.length !== 5) {
    throw new Error(`the table has ${entries.length} entries, not 5`);
  }
  const map = new Map(entries);
  const values = entries.map(([, v]) => v);
  return {
    values,
    total: values.reduce((s, v) => s + v, 0),
    get(key) {
      if (!map.has(key)) throw new Error(`the table has no entry for ${key}`);
      return map.get(key);
    },
  };
}

function grabKey(text, re) {
  const m = text.match(re);
  if (!m) throw new Error("could not read which entry the question asks about");
  return m[1];
}

/* ---------------------------------------------------------------------------
 * Blood relations: rebuild the family from the sentences that were actually
 * printed and read the relation back off it. The kinship vocabulary has to
 * agree with the generator's — that is the definition of the answer — but the
 * graph here is built from typed edges and a fixed-point closure, so a garbled
 * chain, a swapped pair of names or a wrong key is still caught.
 * ------------------------------------------------------------------------- */

const RELATION_LABEL = {
  father: "वडील / Father",
  mother: "आई / Mother",
  son: "मुलगा / Son",
  daughter: "मुलगी / Daughter",
  brother: "भाऊ / Brother",
  sister: "बहीण / Sister",
  grandfather: "आजोबा / Grandfather",
  grandmother: "आजी / Grandmother",
  grandson: "नातू / Grandson",
  granddaughter: "नात / Granddaughter",
  uncle: "काका / मामा / Uncle",
  aunt: "आत्या / मावशी / Aunt",
  nephew: "पुतण्या / भाचा / Nephew",
  niece: "पुतणी / भाची / Niece",
  cousinBrother: "चुलत भाऊ / मामे भाऊ / Cousin brother",
  cousinSister: "चुलत बहीण / मामे बहीण / Cousin sister",
  husband: "पती / Husband",
  wife: "पत्नी / Wife",
  fatherInLaw: "सासरे / Father-in-law",
  motherInLaw: "सासू / Mother-in-law",
  sonInLaw: "जावई / Son-in-law",
  daughterInLaw: "सून / Daughter-in-law",
  brotherInLaw: "मेहुणा / Brother-in-law",
  sisterInLaw: "मेहुणी / Sister-in-law",
};

const MALE_RELATION = new Set(["father", "son", "brother", "husband"]);

function grabPair(text, re) {
  const m = text.match(re);
  if (!m) throw new Error("could not read the pair the question asks about");
  return [m[1], m[2]];
}

function nameRelation(facts, x, y) {
  const gender = new Map();
  const parentEdges = new Set(); // "parent>child"
  const spouseEdges = new Set(); // "a|b" both ways
  const statedSibs = [];

  const addParent = (p, c) => parentEdges.add(`${p}>${c}`);
  const addSpouse = (p, q) => {
    spouseEdges.add(`${p}|${q}`);
    spouseEdges.add(`${q}|${p}`);
  };

  for (const [p, rel, q] of facts) {
    gender.set(p, MALE_RELATION.has(rel) ? "M" : "F");
    if (rel === "father" || rel === "mother") addParent(p, q);
    else if (rel === "son" || rel === "daughter") addParent(q, p);
    else if (rel === "brother" || rel === "sister") statedSibs.push([p, q]);
    else if (rel === "husband" || rel === "wife") addSpouse(p, q);
    else throw new Error(`unknown relation "${rel}"`);
  }

  const parentsOf = (c) =>
    [...parentEdges].filter((e) => e.endsWith(`>${c}`)).map((e) => e.split(">")[0]);
  const spouseOf = (p) => {
    const hit = [...spouseEdges].find((e) => e.startsWith(`${p}|`));
    return hit ? hit.split("|")[1] : null;
  };

  for (let pass = 0; pass < 6; pass += 1) {
    for (const [p, q] of statedSibs) {
      for (const par of parentsOf(p)) addParent(par, q);
      for (const par of parentsOf(q)) addParent(par, p);
    }
    for (const edge of [...parentEdges]) {
      const [par, child] = edge.split(">");
      const sp = spouseOf(par);
      if (sp) addParent(sp, child);
    }
    const kids = new Set([...parentEdges].map((e) => e.split(">")[1]));
    for (const child of kids) {
      const ps = parentsOf(child);
      if (ps.length === 2 && gender.get(ps[0]) && gender.get(ps[1]) && gender.get(ps[0]) !== gender.get(ps[1])) {
        addSpouse(ps[0], ps[1]);
      }
    }
  }

  const isSibling = (p, q) => {
    if (p === q) return false;
    if (statedSibs.some(([m, n]) => (m === p && n === q) || (m === q && n === p))) return true;
    const a = parentsOf(p);
    return parentsOf(q).some((par) => a.includes(par));
  };

  const male = gender.get(x) === "M";
  const pick = (m, f) => RELATION_LABEL[male ? m : f];

  if (spouseOf(y) === x) return pick("husband", "wife");
  if (parentsOf(y).includes(x)) return pick("father", "mother");
  if (parentsOf(x).includes(y)) return pick("son", "daughter");
  if (isSibling(x, y)) return pick("brother", "sister");
  if (parentsOf(y).some((p) => parentsOf(p).includes(x))) return pick("grandfather", "grandmother");
  if (parentsOf(x).some((p) => parentsOf(p).includes(y))) return pick("grandson", "granddaughter");
  if (parentsOf(y).some((p) => isSibling(x, p))) return pick("uncle", "aunt");
  if (parentsOf(x).some((p) => isSibling(p, y))) return pick("nephew", "niece");
  if (parentsOf(x).some((px) => parentsOf(y).some((py) => isSibling(px, py)))) {
    return pick("cousinBrother", "cousinSister");
  }

  const sy = spouseOf(y);
  if (sy && parentsOf(sy).includes(x)) return pick("fatherInLaw", "motherInLaw");
  const sx = spouseOf(x);
  if (sx && parentsOf(sx).includes(y)) return pick("sonInLaw", "daughterInLaw");
  if (sy && isSibling(x, sy)) return pick("brotherInLaw", "sisterInLaw");
  if (sx && isSibling(sx, y)) return pick("brotherInLaw", "sisterInLaw");

  throw new Error(`no relation could be derived between ${x} and ${y}`);
}

/* ---------------------------------------------------------------------------
 * Letter analogies: work out which rules from a standard catalogue map the
 * first group to the second, then require every surviving rule to agree about
 * the fourth group. An item with two defensible answers is reported as unfair
 * rather than quietly accepted.
 * ------------------------------------------------------------------------- */

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const at = (i) => ALPHA[((i % 26) + 26) % 26];
const idxOf = (ch) => ALPHA.indexOf(ch);

function letterRuleCatalogue() {
  const rules = [];
  const rev = (w) => [...w].reverse().join("");
  const opp = (w) => [...w].map((ch) => at(25 - idxOf(ch))).join("");
  rules.push(rev);
  rules.push(opp);
  rules.push((w) => rev(opp(w)));
  rules.push((w) => opp(rev(w)));
  for (let k = 0; k < 26; k += 1) {
    rules.push((w) => [...w].map((ch) => at(idxOf(ch) + k)).join(""));
    rules.push((w) => rev([...w].map((ch) => at(idxOf(ch) + k)).join("")));
  }
  for (let s = 0; s < 26; s += 1) {
    for (let d = -6; d <= 6; d += 1) {
      if (d === 0) continue;
      rules.push((w) => [...w].map((ch, i) => at(idxOf(ch) + s + i * d)).join(""));
    }
  }
  return rules;
}

const LETTER_RULES = letterRuleCatalogue();

function solveLetterAnalogy(text) {
  const m = text.match(/([A-Z]{3,}) : ([A-Z]{3,}) :: ([A-Z]{3,}) : \?/);
  if (!m) throw new Error("could not read the analogy pair");
  const [, w1, c1, w2] = m;
  if (w1.length !== c1.length || w1.length !== w2.length) {
    throw new Error("the three letter groups are not the same length");
  }

  const predictions = new Set();
  for (const rule of LETTER_RULES) {
    if (rule(w1) === c1) predictions.add(rule(w2));
  }
  if (predictions.size === 0) throw new Error(`no catalogue rule turns ${w1} into ${c1}`);
  if (predictions.size > 1) {
    throw new Error(`${w1} : ${c1} allows more than one answer: ${[...predictions].join(", ")}`);
  }
  return [...predictions][0];
}

/* ---------------------------------------------------------------------------
 * Syllogism: re-read the four sentences and decide entailment by enumerating
 * every Venn arrangement. The semantics of "all/no/some" have to agree with the
 * generator's — they are the definition of the task — but the parsing, the term
 * matching and the set algebra below are written independently, so a wrong key,
 * a swapped conclusion or a mangled sentence is still caught.
 * ------------------------------------------------------------------------- */

const SYLLOGISM_VERDICT = {
  I: "फक्त निष्कर्ष I / Only conclusion I follows",
  II: "फक्त निष्कर्ष II / Only conclusion II follows",
  BOTH: "दोन्ही निष्कर्ष / Both conclusions follow",
  NEITHER: "एकही निष्कर्ष नाही / Neither conclusion follows",
};

function parseProposition(raw) {
  const s = raw.trim();
  let m = s.match(/^All (.+) are (.+)\.$/);
  if (m) return { kind: "all", x: m[1], y: m[2] };
  m = s.match(/^No (.+) is an? (.+)\.$/);
  if (m) return { kind: "no", x: m[1], y: m[2] };
  m = s.match(/^Some (.+) are not (.+)\.$/);
  if (m) return { kind: "someNot", x: m[1], y: m[2] };
  m = s.match(/^Some (.+) are (.+)\.$/);
  if (m) return { kind: "some", x: m[1], y: m[2] };
  throw new Error(`could not parse the proposition "${s}"`);
}

/** Singular and plural of the same term differ only by a suffix. */
function termIndexer() {
  const seen = [];
  return (word) => {
    for (let i = 0; i < seen.length; i += 1) {
      if (seen[i].startsWith(word) || word.startsWith(seen[i])) return i;
    }
    seen.push(word);
    if (seen.length > 3) throw new Error(`more than three terms appear: ${seen.join(", ")}`);
    return seen.length - 1;
  };
}

/** Every arrangement of three sets, as a set of occupied Venn regions. */
function vennArrangements() {
  const labels = ["a", "b", "ab", "c", "ac", "bc", "abc"];
  const out = [];
  for (let mask = 1; mask < 1 << labels.length; mask += 1) {
    const present = new Set(labels.filter((_, i) => (mask >> i) & 1));
    const occupies = (term) => [...present].some((l) => l.includes(term));
    if (!occupies("a") || !occupies("b") || !occupies("c")) continue;
    out.push(present);
  }
  return out;
}

const ARRANGEMENTS = vennArrangements();
const TERM_LETTER = ["a", "b", "c"];

function propositionHolds(prop, arrangement, index) {
  const xs = [...arrangement].filter((l) => l.includes(TERM_LETTER[index(prop.x)]));
  const y = TERM_LETTER[index(prop.y)];
  switch (prop.kind) {
    case "all":
      return xs.every((l) => l.includes(y));
    case "no":
      return xs.every((l) => !l.includes(y));
    case "some":
      return xs.some((l) => l.includes(y));
    default:
      return xs.some((l) => !l.includes(y));
  }
}

function solveSyllogism(text) {
  const stmts = text.match(/Statements: \(1\) (.+?) \(2\) (.+?)\n/);
  const concls = text.match(/Conclusions: \(I\) (.+?) \(II\) (.+?)\n/);
  if (!stmts || !concls) throw new Error("could not split the statements from the conclusions");

  const index = termIndexer();
  const parsed = [stmts[1], stmts[2], concls[1], concls[2]].map(parseProposition);
  // Fix the term order from the premises first so both sentences agree.
  for (const p of parsed) {
    index(p.x);
    index(p.y);
  }

  const [p1, p2, c1, c2] = parsed;
  const consistent = ARRANGEMENTS.filter(
    (arr) => propositionHolds(p1, arr, index) && propositionHolds(p2, arr, index),
  );
  if (consistent.length === 0) throw new Error("the two statements cannot both be true");

  const followsI = consistent.every((arr) => propositionHolds(c1, arr, index));
  const followsII = consistent.every((arr) => propositionHolds(c2, arr, index));

  if (followsI && followsII) return SYLLOGISM_VERDICT.BOTH;
  if (followsI) return SYLLOGISM_VERDICT.I;
  if (followsII) return SYLLOGISM_VERDICT.II;
  return SYLLOGISM_VERDICT.NEITHER;
}

/* ---------------------------------------------------------------------------
 * Calendars: the weekday is recovered with Conway's doomsday rule, which shares
 * no arithmetic with the generator's Zeller congruence.
 * ------------------------------------------------------------------------- */

const WEEKDAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];
const WEEKDAY_MR = [
  "रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार",
];
const WEEKDAY_LABELS = WEEKDAY_NAMES.map((d, i) => `${WEEKDAY_MR[i]} / ${d}`);

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_INDEX = Object.fromEntries(MONTH_NAMES.map((m, i) => [m, i + 1]));

const leapYear = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

function monthLength(m, y) {
  return [31, leapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
}

function grabDate(text, re, label) {
  const m = text.match(re);
  if (!m) throw new Error(`could not read a date for ${label}`);
  const mo = MONTH_INDEX[m[2]];
  if (!mo) throw new Error(`unknown month "${m[2]}"`);
  return { d: Number(m[1]), m: mo, y: Number(m[3]) };
}

function doomsdayWeekday(d, m, y) {
  const century = Math.floor(y / 100);
  const anchor = (5 * (century % 4) + 2) % 7;
  const yy = y % 100;
  const doomsday = (anchor + Math.floor(yy / 12) + (yy % 12) + Math.floor((yy % 12) / 4)) % 7;
  const leap = leapYear(y);
  const anchorDay = [
    leap ? 4 : 3, leap ? 29 : 28, 7, 4, 9, 6, 11, 8, 5, 10, 7, 12,
  ][m - 1];
  const offset = ((d - anchorDay) % 7 + 7) % 7;
  return (doomsday + offset) % 7;
}

const COMPASS = ["north", "east", "south", "west"];
const MOVE = { north: [0, 1], east: [1, 0], south: [0, -1], west: [-1, 0] };

// The expected option labels, spelled out here so a change in the generator's
// own map cannot silently agree with itself.
const FACING_LABELS = {
  north: "उत्तर / North",
  east: "पूर्व / East",
  south: "दक्षिण / South",
  west: "पश्चिम / West",
};
const BEARING_LABELS = {
  "north-east": "ईशान्य / North-East",
  "north-west": "वायव्य / North-West",
  "south-east": "आग्नेय / South-East",
  "south-west": "नैऋत्य / South-West",
};

function simulateWalk(text) {
  const start = text.match(/faces (north|east|south|west), and walks ([\d.]+) km/);
  if (!start) throw new Error("could not parse the start of the walk");
  let facing = start[1];
  let x = 0;
  let y = 0;
  const first = Number(start[2]);
  x += MOVE[facing][0] * first;
  y += MOVE[facing][1] * first;

  const turns = [...text.matchAll(/turns to his (left|right) and walks ([\d.]+) km/g)];
  if (turns.length === 0) throw new Error("the walk has no turns");
  for (const t of turns) {
    const delta = t[1] === "right" ? 1 : 3;
    facing = COMPASS[(COMPASS.indexOf(facing) + delta) % 4];
    const d = Number(t[2]);
    x += MOVE[facing][0] * d;
    y += MOVE[facing][1] * d;
  }
  return { x, y, facing };
}

/* ---------------------------------------------------------------------------
 * Number series
 *
 * Rather than replaying the generator's rule, every series is refitted against
 * a library of rule families. A question is only accepted when at least one
 * family fits all the visible terms AND every family that fits agrees on the
 * blank — which simultaneously checks the key and proves the series is not
 * ambiguous.
 * ------------------------------------------------------------------------- */

function parseSeries(text) {
  const m = text.match(/Find the (?:next|missing) term in the series: (.+)$/);
  if (!m) throw new Error("could not parse the series");
  const tokens = m[1].split(",").map((s) => s.trim());
  const blank = tokens.indexOf("?");
  if (blank < 0) throw new Error("the series has no blank");
  const values = tokens.map((t) => (t === "?" ? null : Number(t)));
  if (values.some((v) => v !== null && !Number.isFinite(v))) {
    throw new Error("the series contains a non-numeric term");
  }
  return { values, blank };
}

const CLOSE = (a, b) => Math.abs(a - b) < 1e-6;

function knownPoints(values) {
  const pts = [];
  values.forEach((v, i) => {
    if (v !== null) pts.push([i, v]);
  });
  return pts;
}

function lagrange(points, x) {
  let total = 0;
  for (let i = 0; i < points.length; i += 1) {
    let term = points[i][1];
    for (let j = 0; j < points.length; j += 1) {
      if (i === j) continue;
      term *= (x - points[j][0]) / (points[i][0] - points[j][0]);
    }
    total += term;
  }
  return total;
}

/** Polynomial of the given degree, fitted and then verified on the spare points. */
function fitPolynomial(values, blank, degree) {
  const pts = knownPoints(values);
  if (pts.length < degree + 2) return null;
  const basis = pts.slice(0, degree + 1);
  for (const [i, v] of pts) {
    if (!CLOSE(lagrange(basis, i), v)) return null;
  }
  return Math.round(lagrange(basis, blank));
}

function fitGeometric(values, blank) {
  const pts = knownPoints(values);
  if (pts.length < 3) return null;
  if (pts[0][1] === 0) return null;
  const r = pts[1][1] / pts[0][1];
  if (!Number.isFinite(r) || r === 0) return null;
  for (const [i, v] of pts) {
    if (!CLOSE(pts[0][1] * r ** (i - pts[0][0]), v)) return null;
  }
  return Math.round(pts[0][1] * r ** (blank - pts[0][0]));
}

/** Recurrence a(n+1) = k*a(n) + c; only meaningful when the terms are contiguous. */
function fitMultiplyAdd(values, blank) {
  if (values.slice(0, blank).some((v) => v === null)) return null;
  const v = values.slice(0, blank);
  if (v.length < 4) return null;
  if (v[1] === v[0]) return null;
  const k = (v[2] - v[1]) / (v[1] - v[0]);
  const c = v[1] - v[0] * k;
  if (!Number.isFinite(k)) return null;
  for (let i = 1; i < v.length; i += 1) {
    if (!CLOSE(v[i - 1] * k + c, v[i])) return null;
  }
  return Math.round(v[v.length - 1] * k + c);
}

function fitFibonacci(values, blank) {
  if (values.slice(0, blank).some((v) => v === null)) return null;
  const v = values.slice(0, blank);
  if (v.length < 4) return null;
  for (let i = 2; i < v.length; i += 1) {
    if (!CLOSE(v[i - 2] + v[i - 1], v[i])) return null;
  }
  return Math.round(v[v.length - 2] + v[v.length - 1]);
}

/** Two arithmetic series woven together, one on odd positions and one on even. */
function fitAlternating(values, blank) {
  const groups = [[], []];
  values.forEach((v, i) => {
    if (v !== null) groups[i % 2].push([i, v]);
  });
  if (groups[0].length < 3 || groups[1].length < 3) return null;
  for (const g of groups) {
    const step = (g[1][1] - g[0][1]) / (g[1][0] - g[0][0]);
    for (const [i, v] of g) {
      if (!CLOSE(g[0][1] + step * (i - g[0][0]), v)) return null;
    }
  }
  const g = groups[blank % 2];
  const step = (g[1][1] - g[0][1]) / (g[1][0] - g[0][0]);
  return Math.round(g[0][1] + step * (blank - g[0][0]));
}

/** Consecutive squares or cubes, shifted by a constant. */
function fitPowerOffset(values, blank) {
  const pts = knownPoints(values);
  if (pts.length < 4) return null;
  for (const power of [2, 3]) {
    for (let start = 1; start <= 40; start += 1) {
      const offset = pts[0][1] - (start + pts[0][0]) ** power;
      let ok = true;
      for (const [i, v] of pts) {
        if (!CLOSE((start + i) ** power + offset, v)) {
          ok = false;
          break;
        }
      }
      if (ok) return Math.round((start + blank) ** power + offset);
    }
  }
  return null;
}

function solveSeries(text) {
  const { values, blank } = parseSeries(text);
  const predictions = new Map();
  const record = (name, value) => {
    if (value === null || !Number.isFinite(value)) return;
    predictions.set(name, value);
  };
  record("linear", fitPolynomial(values, blank, 1));
  record("quadratic", fitPolynomial(values, blank, 2));
  record("cubic", fitPolynomial(values, blank, 3));
  record("geometric", fitGeometric(values, blank));
  record("multiply-add", fitMultiplyAdd(values, blank));
  record("fibonacci", fitFibonacci(values, blank));
  record("alternating", fitAlternating(values, blank));
  record("power-offset", fitPowerOffset(values, blank));

  if (predictions.size === 0) throw new Error("no known rule family fits this series");
  const distinct = new Set(predictions.values());
  if (distinct.size > 1) {
    const detail = [...predictions.entries()].map(([k, v]) => `${k}->${v}`).join(", ");
    throw new Error(`the series is ambiguous: ${detail}`);
  }
  return num([...distinct][0]);
}

function factorialOf(n) {
  let v = 1;
  for (let i = 2; i <= n; i += 1) v *= i;
  return v;
}

function reduceFraction(a, b) {
  const g = gcdOf(a, b);
  const n = a / g;
  const d = b / g;
  return d === 1 ? String(n) : `${n}/${d}`;
}

function gcdOf(a, b) {
  let x = a;
  let y = b;
  while (y) [x, y] = [y, x % y];
  return x;
}

function lcmOf(a, b) {
  return (a * b) / gcdOf(a, b);
}

/* ------------------------------------------ run ---------------------------------------------- */

function main() {
  if (!fs.existsSync(BANK)) {
    console.error("Bank not found. Run: node scripts/csat/build.mjs");
    process.exit(1);
  }
  const bank = JSON.parse(fs.readFileSync(BANK, "utf8"));
  const questions = bank.questions || [];

  const failures = [];
  const fail = (q, msg) => failures.push(`${q.id || "(no id)"} [${q.archetype}] ${msg}`);

  const seenIds = new Set();
  const seenEn = new Set();
  const seenMr = new Set();

  for (const q of questions) {
    /* ---- structure ---- */
    if (!q.id) {
      fail(q, "missing id");
      continue;
    }
    if (seenIds.has(q.id)) fail(q, "duplicate id");
    seenIds.add(q.id);

    if (!["moderate", "hard"].includes(q.difficulty)) fail(q, `bad difficulty "${q.difficulty}"`);
    if (!q.en?.text?.trim()) fail(q, "empty English text");
    if (!q.mr?.text?.trim()) fail(q, "empty Marathi text");
    if (!q.en?.explanation?.trim()) fail(q, "empty English explanation");
    if (!q.mr?.explanation?.trim()) fail(q, "empty Marathi explanation");

    const opts = q.options || {};
    const values = LETTERS.map((k) => opts[k]);
    if (values.some((v) => v === undefined || String(v).trim() === "")) {
      fail(q, "missing or empty option");
      continue;
    }
    if (new Set(values.map(String)).size !== 4) fail(q, "duplicate option values");
    if (!LETTERS.includes(q.correctAnswer)) {
      fail(q, `bad correctAnswer "${q.correctAnswer}"`);
      continue;
    }

    // Options must not be so close that rounding makes two of them equal.
    const numeric = values.map((v) =>
      parseFloat(String(v).replace(/,/g, "").replace(MINUS, "-").replace(/[^0-9.\-]/g, "")),
    );
    if (values.every((v) => NUMERIC_OPTION.test(String(v))) && numeric.every(Number.isFinite)) {
      for (let i = 0; i < 4; i += 1) {
        for (let j = i + 1; j < 4; j += 1) {
          if (Math.abs(numeric[i] - numeric[j]) < 0.02) {
            fail(q, `options ${LETTERS[i]} and ${LETTERS[j]} are indistinguishable`);
          }
        }
      }
    }

    /* ---- duplicates across the bank ---- */
    const enKey = q.en.text.replace(/\s+/g, " ").trim().toLowerCase();
    const mrKey = q.mr.text.replace(/\s+/g, " ").trim();
    if (seenEn.has(enKey)) fail(q, "duplicate English question text");
    if (seenMr.has(mrKey)) fail(q, "duplicate Marathi question text");
    seenEn.add(enKey);
    seenMr.add(mrKey);

    /* ---- language integrity ---- */
    if (DEVANAGARI.test(q.en.text)) fail(q, "Devanagari found in the English question");
    if (DEVANAGARI.test(q.en.explanation)) fail(q, "Devanagari found in the English explanation");
    if (!DEVANAGARI.test(q.mr.text)) fail(q, "Marathi question is not in Devanagari");
    if (!DEVANAGARI.test(q.mr.explanation)) fail(q, "Marathi explanation is not in Devanagari");

    /* ---- the two languages must pose the SAME problem ---- */
    if (!sameNumbers(numbersIn(q.en.text), numbersIn(q.mr.text))) {
      fail(
        q,
        `EN/MR question numbers differ: [${numbersIn(q.en.text)}] vs [${numbersIn(q.mr.text)}]`,
      );
    }

    /* ---- explanations must be worked, not one-liners ---- */
    for (const [lang, ex] of [["EN", q.en.explanation], ["MR", q.mr.explanation]]) {
      if (ex.length < 120) fail(q, `${lang} explanation is too short to be a worked solution`);
      if (!ex.includes("\n")) fail(q, `${lang} explanation has no worked steps`);
    }

    /* ---- the independent re-solve ---- */
    // Syllogism shapes all share one solver; everything else is registered by name.
    const solver = q.archetype.startsWith("syllogism-")
      ? SOLVERS.syllogism
      : SOLVERS[q.archetype];
    if (!solver) {
      fail(q, "no independent solver registered for this archetype");
      continue;
    }
    let expected;
    try {
      expected = solver(q.en.text);
    } catch (err) {
      fail(q, `solver error: ${err.message}`);
      continue;
    }
    const keyed = String(opts[q.correctAnswer]);
    if (expected !== keyed) {
      fail(q, `answer mismatch — solved "${expected}" but option ${q.correctAnswer} is "${keyed}"`);
      continue;
    }

    /* ---- the explanation must actually quote the answer ---- */
    if (/^\d+(\s*:\s*\d+)+$/.test(keyed) || /^\d+\/\d+$/.test(keyed)) {
      // Ratios and fractions are quoted verbatim rather than as a single number.
      if (!q.en.explanation.includes(keyed)) {
        fail(q, `English explanation never states the answer ratio ${keyed}`);
      }
      if (!q.mr.explanation.includes(keyed)) {
        fail(q, `Marathi explanation never states the answer ratio ${keyed}`);
      }
    } else if (NUMERIC_OPTION.test(keyed)) {
      const answerValue = parseFloat(
        keyed.replace(/,/g, "").replace(MINUS, "-").replace(/[^0-9.\-]/g, ""),
      );
      if (!Number.isFinite(answerValue)) {
        fail(q, `could not read a numeric value out of the keyed option "${keyed}"`);
      } else {
        if (!statesValue(q.en.explanation, answerValue)) {
          fail(q, `English explanation never states the answer value ${num(Math.abs(answerValue))}`);
        }
        if (!statesValue(q.mr.explanation, answerValue)) {
          fail(q, `Marathi explanation never states the answer value ${num(Math.abs(answerValue))}`);
        }
      }
    } else {
      // Word answers (code words, compass directions). Bilingual labels are
      // written "मराठी / English", so each explanation need only carry its side.
      if (!quotesWordAnswer(q.en.explanation, keyed)) {
        fail(q, `English explanation never states the answer "${keyed}"`);
      }
      if (!quotesWordAnswer(q.mr.explanation, keyed)) {
        fail(q, `Marathi explanation never states the answer "${keyed}"`);
      }
    }
  }

  /* ---- answer-key balance (a bank keyed 90% "C" would be gameable) ---- */
  const keyCount = { A: 0, B: 0, C: 0, D: 0 };
  for (const q of questions) if (keyCount[q.correctAnswer] !== undefined) keyCount[q.correctAnswer] += 1;

  console.log(`Checked ${questions.length} questions.`);
  console.log(
    "Answer key spread: " + LETTERS.map((k) => `${k}=${keyCount[k]}`).join("  "),
  );
  for (const k of LETTERS) {
    const share = questions.length ? keyCount[k] / questions.length : 0;
    if (share < 0.1 || share > 0.4) {
      failures.push(`answer key is unbalanced: ${k} is ${(share * 100).toFixed(0)}% of the bank`);
    }
  }

  if (failures.length === 0) {
    console.log("\nPASS — every question re-solved correctly and all invariants hold.");
    process.exit(0);
  }

  console.log(`\nFAIL — ${failures.length} problem(s):\n`);
  for (const f of failures.slice(0, 60)) console.log("  - " + f);
  if (failures.length > 60) console.log(`  ... and ${failures.length - 60} more`);
  process.exit(1);
}

main();
