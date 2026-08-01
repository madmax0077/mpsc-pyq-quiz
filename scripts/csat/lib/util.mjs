/**
 * Shared helpers for the CSAT question-bank generators.
 *
 * Everything here is deterministic: the bank is rebuilt from a fixed seed so
 * regenerating produces byte-identical output unless a generator changes.
 */

/** Deterministic PRNG (mulberry32). */
export function makeRng(seed) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

export function shuffle(rng, input) {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Round to at most `dp` decimals, returning a Number. */
export function round(n, dp = 2) {
  const f = 10 ** dp;
  return Math.round((n + Number.EPSILON) * f) / f;
}

/** True when the value is "clean" enough to display (<= 2 decimals). */
export function isClean(n, dp = 2) {
  return Math.abs(n - round(n, dp)) < 1e-9;
}

/** Format a number: strip trailing zeros, keep at most 2 decimals. */
export function num(n) {
  const r = round(n, 2);
  if (Number.isInteger(r)) return String(r);
  return String(r).replace(/0+$/, "").replace(/\.$/, "");
}

/** Indian digit grouping: 1234567 -> "12,34,567". */
export function groupIndian(n) {
  const neg = n < 0;
  const [intPart, decPart] = Math.abs(n).toFixed(2).split(".");
  let out;
  if (intPart.length <= 3) {
    out = intPart;
  } else {
    const last3 = intPart.slice(-3);
    const rest = intPart.slice(0, -3);
    out = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + "," + last3;
  }
  const dec = decPart === "00" ? "" : "." + decPart.replace(/0$/, "");
  return (neg ? "-" : "") + out + dec;
}

/** Rupee amount, language-neutral. */
export function inr(n) {
  return "\u20B9" + groupIndian(n);
}

/** Percentage string, language-neutral. */
export function pct(n) {
  return num(n) + "%";
}

/**
 * Number for use inside prose, using the typographic minus so a negative value
 * does not sit next to the ASCII hyphen used nowhere else in the sentence.
 */
export function sgn(n) {
  const r = round(n, 2);
  return r < 0 ? "\u2212" + num(-r) : num(r);
}

/** Signed percentage; used where the sign carries the meaning. */
export function signedPct(n) {
  const r = round(n, 2);
  if (r === 0) return "0%";
  return (r > 0 ? "+" : "\u2212") + num(Math.abs(r)) + "%";
}

const LETTERS = ["A", "B", "C", "D"];

/**
 * Turn a correct value plus distractors into a shuffled A-D option map.
 *
 * Returns null when the distractors are not usable (duplicates, or too close
 * to the correct value to be distinguishable after rounding) so the caller can
 * discard the candidate question rather than emit an ambiguous one.
 */
export function buildOptions(rng, correct, distractors, { minGap = 0 } = {}) {
  const values = [correct, ...distractors];
  const seen = new Set();
  for (const v of values) {
    if (v === null || v === undefined || v === "") return null;
    const k = String(v);
    if (seen.has(k)) return null;
    seen.add(k);
  }
  if (values.length !== 4) return null;

  if (minGap > 0) {
    const nums = values.map((v) => parseFloat(String(v).replace(/[^0-9.\-\u2212]/g, "").replace("\u2212", "-")));
    if (nums.every((x) => Number.isFinite(x))) {
      for (let i = 0; i < nums.length; i += 1) {
        for (let j = i + 1; j < nums.length; j += 1) {
          if (Math.abs(nums[i] - nums[j]) < minGap) return null;
        }
      }
    }
  }

  const order = shuffle(rng, values);
  const options = {};
  order.forEach((v, i) => {
    options[LETTERS[i]] = String(v);
  });
  const correctAnswer = LETTERS[order.indexOf(correct)];
  return { options, correctAnswer };
}

/** Stable signature so the same parameters are never emitted twice. */
export function signature(archetype, params) {
  return archetype + "|" + JSON.stringify(params, Object.keys(params).sort());
}
