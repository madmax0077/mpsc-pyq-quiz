/**
 * Generator: Number & Letter Series.
 *
 * Every series shows at least five terms so that the underlying rule is
 * over-determined; the validator independently refits the terms against a
 * library of rule families and rejects anything ambiguous.
 */

import { num } from "../lib/util.mjs";

const listOf = (terms) => terms.join(", ");

/* ------------------------------------------------------------------ *
 * 1. Constant difference
 * ------------------------------------------------------------------ */
const arithmetic = {
  id: "series-arithmetic",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const a of [4, 7, 9, 11, 13, 17, 23]) {
      for (const d of [6, 7, 8, 9, 11, 12, 13]) out.push({ a, d });
    }
    return out;
  },
  make({ a, d }) {
    const terms = [];
    for (let i = 0; i < 5; i += 1) terms.push(a + i * d);
    const next = a + 5 * d;

    const correct = num(next);
    const distractors = [num(next + d), num(next - 1), num(next + 2)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `Find the next term in the series: ${listOf(terms)}, ?`,
        explanation: `Start by taking the differences between consecutive terms.\n${terms[1]} − ${terms[0]} = ${num(d)}, ${terms[2]} − ${terms[1]} = ${num(d)}, ${terms[3]} − ${terms[2]} = ${num(d)}, ${terms[4]} − ${terms[3]} = ${num(d)}.\nThe difference is constant at ${num(d)}, so this is an arithmetic series.\nThe next term = ${num(terms[4])} + ${num(d)} = ${num(next)}.\nAlways compute the differences first — if they come out constant, the series is settled in seconds and you can move on.`,
      },
      mr: {
        text: `पुढील श्रेणीतील पुढचे पद कोणते: ${listOf(terms)}, ?`,
        explanation: `प्रथम लागोपाठच्या पदांतील फरक काढा.\n${terms[1]} − ${terms[0]} = ${num(d)}, ${terms[2]} − ${terms[1]} = ${num(d)}, ${terms[3]} − ${terms[2]} = ${num(d)}, ${terms[4]} − ${terms[3]} = ${num(d)}.\nफरक सर्वत्र ${num(d)} असा स्थिर आहे, म्हणून ही अंकगणिती श्रेणी आहे.\nपुढचे पद = ${num(terms[4])} + ${num(d)} = ${num(next)}.\nनेहमी आधी फरक काढावेत — ते स्थिर आले की श्रेणी क्षणात सुटते आणि वेळ वाचतो.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 2. Constant ratio
 * ------------------------------------------------------------------ */
const geometric = {
  id: "series-geometric",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const a of [2, 3, 4, 5, 6, 7, 8]) {
      for (const r of [2, 3]) out.push({ a, r });
    }
    return out;
  },
  make({ a, r }) {
    const terms = [];
    for (let i = 0; i < 5; i += 1) terms.push(a * r ** i);
    const next = a * r ** 5;
    if (next > 200000) return null;

    const correct = num(next);
    const distractors = [num(next * r), num(terms[4] + terms[3]), num(next + a)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `Find the next term in the series: ${listOf(terms)}, ?`,
        explanation: `The differences here are not constant, so try dividing each term by the one before it.\n${terms[1]} ÷ ${terms[0]} = ${num(r)}, ${terms[2]} ÷ ${terms[1]} = ${num(r)}, ${terms[3]} ÷ ${terms[2]} = ${num(r)}, ${terms[4]} ÷ ${terms[3]} = ${num(r)}.\nThe ratio is constant at ${num(r)}, so this is a geometric series.\nThe next term = ${num(terms[4])} × ${num(r)} = ${num(next)}.\nWhen the terms grow quickly, check ratios before differences — that ordering saves time.`,
      },
      mr: {
        text: `पुढील श्रेणीतील पुढचे पद कोणते: ${listOf(terms)}, ?`,
        explanation: `येथे फरक स्थिर नाहीत, म्हणून प्रत्येक पदाला त्याच्या आधीच्या पदाने भागून पाहा.\n${terms[1]} ÷ ${terms[0]} = ${num(r)}, ${terms[2]} ÷ ${terms[1]} = ${num(r)}, ${terms[3]} ÷ ${terms[2]} = ${num(r)}, ${terms[4]} ÷ ${terms[3]} = ${num(r)}.\nगुणोत्तर सर्वत्र ${num(r)} असे स्थिर आहे, म्हणून ही भूमिती श्रेणी आहे.\nपुढचे पद = ${num(terms[4])} × ${num(r)} = ${num(next)}.\nपदे झपाट्याने वाढत असतील तर आधी गुणोत्तर तपासावे, नंतर फरक — या क्रमाने वेळ वाचतो.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 3. Differences themselves form an arithmetic progression
 * ------------------------------------------------------------------ */
const secondDifference = {
  id: "series-second-difference",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const a of [3, 5, 6, 8, 10, 12]) {
      for (const d0 of [2, 3, 4, 5]) {
        for (const step of [2, 3, 4, 5]) out.push({ a, d0, step });
      }
    }
    return out;
  },
  make({ a, d0, step }) {
    const terms = [a];
    const diffs = [];
    for (let i = 0; i < 5; i += 1) {
      const d = d0 + i * step;
      diffs.push(d);
      terms.push(terms[terms.length - 1] + d);
    }
    const shown = terms.slice(0, 5);
    const next = terms[5];

    const correct = num(next);
    const distractors = [num(shown[4] + diffs[3]), num(next + step), num(next - 1)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `Find the next term in the series: ${listOf(shown)}, ?`,
        explanation: `The differences between consecutive terms are ${diffs.slice(0, 4).join(", ")} — not constant, so look one level deeper.\nThe differences OF those differences are ${num(step)}, ${num(step)}, ${num(step)} — constant.\nSo the gaps themselves grow by ${num(step)} each time.\nThe next gap = ${num(diffs[3])} + ${num(step)} = ${num(diffs[4])}.\nThe next term = ${num(shown[4])} + ${num(diffs[4])} = ${num(next)}.\nWhen the first differences are not constant, take the second differences before abandoning the idea — a great many exam series are of exactly this type.`,
      },
      mr: {
        text: `पुढील श्रेणीतील पुढचे पद कोणते: ${listOf(shown)}, ?`,
        explanation: `लागोपाठच्या पदांतील फरक ${diffs.slice(0, 4).join(", ")} असे आहेत — ते स्थिर नाहीत, म्हणून आणखी एक पायरी खोल पाहा.\nया फरकांचे फरक ${num(step)}, ${num(step)}, ${num(step)} असे स्थिर आहेत.\nम्हणजे प्रत्येक वेळी अंतर ${num(step)} ने वाढते.\nपुढचे अंतर = ${num(diffs[3])} + ${num(step)} = ${num(diffs[4])}.\nपुढचे पद = ${num(shown[4])} + ${num(diffs[4])} = ${num(next)}.\nपहिले फरक स्थिर नसतील तर लगेच हार न मानता दुसरे फरक काढावेत — परीक्षेतील पुष्कळ श्रेणी नेमक्या याच प्रकारच्या असतात.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 4. Multiply and add
 * ------------------------------------------------------------------ */
const multiplyAdd = {
  id: "series-multiply-add",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const a of [2, 3, 4, 5, 6]) {
      for (const k of [2, 3]) {
        for (const c of [1, 2, 3, 4, 5, -1]) out.push({ a, k, c });
      }
    }
    return out;
  },
  make({ a, k, c }) {
    const terms = [a];
    for (let i = 0; i < 5; i += 1) terms.push(terms[terms.length - 1] * k + c);
    const shown = terms.slice(0, 5);
    const next = terms[5];
    if (next > 100000 || shown.some((t) => t <= 0)) return null;

    const correct = num(next);
    const distractors = [num(shown[4] * k), num(next + k), num(shown[4] + shown[3])];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    const cSign = c >= 0 ? `add ${num(c)}` : `subtract ${num(-c)}`;
    const cSignMr = c >= 0 ? `${num(c)} मिळवा` : `${num(-c)} वजा करा`;

    return {
      correct,
      distractors,
      en: {
        text: `Find the next term in the series: ${listOf(shown)}, ?`,
        explanation: `The differences (${shown[1] - shown[0]}, ${shown[2] - shown[1]}, ${shown[3] - shown[2]}, ${shown[4] - shown[3]}) are not constant, and neither are the ratios, so test a two-step rule of the form "multiply, then add".\nTry multiplying by ${num(k)} and then ${cSign}:\n${num(shown[0])} × ${num(k)} ${c >= 0 ? "+" : "−"} ${num(Math.abs(c))} = ${num(shown[1])} ✓\n${num(shown[1])} × ${num(k)} ${c >= 0 ? "+" : "−"} ${num(Math.abs(c))} = ${num(shown[2])} ✓\n${num(shown[2])} × ${num(k)} ${c >= 0 ? "+" : "−"} ${num(Math.abs(c))} = ${num(shown[3])} ✓\n${num(shown[3])} × ${num(k)} ${c >= 0 ? "+" : "−"} ${num(Math.abs(c))} = ${num(shown[4])} ✓\nThe rule holds throughout, so the next term = ${num(shown[4])} × ${num(k)} ${c >= 0 ? "+" : "−"} ${num(Math.abs(c))} = ${num(next)}.\nWhen neither differences nor ratios work, a combined multiply-and-add rule is the next thing to try.`,
      },
      mr: {
        text: `पुढील श्रेणीतील पुढचे पद कोणते: ${listOf(shown)}, ?`,
        explanation: `फरक (${shown[1] - shown[0]}, ${shown[2] - shown[1]}, ${shown[3] - shown[2]}, ${shown[4] - shown[3]}) स्थिर नाहीत आणि गुणोत्तरेही स्थिर नाहीत, म्हणून "गुणा आणि मग मिळवा" अशा दोन पायऱ्यांच्या नियमाची चाचणी घ्या.\n${num(k)} ने गुणून नंतर ${cSignMr}:\n${num(shown[0])} × ${num(k)} ${c >= 0 ? "+" : "−"} ${num(Math.abs(c))} = ${num(shown[1])} ✓\n${num(shown[1])} × ${num(k)} ${c >= 0 ? "+" : "−"} ${num(Math.abs(c))} = ${num(shown[2])} ✓\n${num(shown[2])} × ${num(k)} ${c >= 0 ? "+" : "−"} ${num(Math.abs(c))} = ${num(shown[3])} ✓\n${num(shown[3])} × ${num(k)} ${c >= 0 ? "+" : "−"} ${num(Math.abs(c))} = ${num(shown[4])} ✓\nनियम सर्वत्र लागू होतो, म्हणून पुढचे पद = ${num(shown[4])} × ${num(k)} ${c >= 0 ? "+" : "−"} ${num(Math.abs(c))} = ${num(next)}.\nफरक व गुणोत्तर दोन्ही चालत नसतील, तेव्हा गुणाकार-अधिक-बेरीज हा एकत्रित नियम तपासावा.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 5. Squares and cubes with an offset
 * ------------------------------------------------------------------ */
const powerOffset = {
  id: "series-power-offset",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const start of [2, 3, 4, 5, 6]) {
      for (const off of [0, 1, 2, 3, -1, -2]) {
        for (const power of [2, 3]) out.push({ start, off, power });
      }
    }
    return out;
  },
  make({ start, off, power }) {
    const bases = [];
    for (let i = 0; i < 6; i += 1) bases.push(start + i);
    const all = bases.map((b) => b ** power + off);
    const shown = all.slice(0, 5);
    const next = all[5];
    if (shown.some((t) => t <= 0)) return null;
    if (next > 200000) return null;

    const correct = num(next);
    const distractors = [num(bases[5] ** power), num(next + 1), num(shown[4] + (shown[4] - shown[3]))];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    const word = power === 2 ? "squares" : "cubes";
    const wordMr = power === 2 ? "वर्ग" : "घन";
    const offEn = off === 0 ? "" : off > 0 ? ` plus ${num(off)}` : ` minus ${num(-off)}`;
    const offMr = off === 0 ? "" : off > 0 ? ` अधिक ${num(off)}` : ` वजा ${num(-off)}`;

    return {
      correct,
      distractors,
      en: {
        text: `Find the next term in the series: ${listOf(shown)}, ?`,
        explanation: `The terms grow too fast for a constant difference, so compare them against the ${word} of small whole numbers.\n${bases
          .slice(0, 5)
          .map((b, i) => `${num(b)}${power === 2 ? "²" : "³"} = ${num(b ** power)}, and ${num(b ** power)}${offEn} = ${num(shown[i])}`)
          .join("\n")}\nSo each term is the ${power === 2 ? "square" : "cube"} of ${num(bases[0])}, ${num(bases[1])}, ${num(bases[2])}, ... taken in order${offEn}.\nThe next base is ${num(bases[5])}, so the next term = ${num(bases[5])}${power === 2 ? "²" : "³"}${offEn} = ${num(bases[5] ** power)}${off === 0 ? "" : off > 0 ? ` + ${num(off)}` : ` − ${num(-off)}`} = ${num(next)}.\nKeeping the squares up to 30 and the cubes up to 15 in memory turns these questions into instant marks.`,
      },
      mr: {
        text: `पुढील श्रेणीतील पुढचे पद कोणते: ${listOf(shown)}, ?`,
        explanation: `पदे इतक्या वेगाने वाढतात की स्थिर फरक शक्य नाही, म्हणून लहान संख्यांच्या ${wordMr}ांशी तुलना करा.\n${bases
          .slice(0, 5)
          .map((b, i) => `${num(b)}${power === 2 ? "²" : "³"} = ${num(b ** power)}, आणि ${num(b ** power)}${offMr} = ${num(shown[i])}`)
          .join("\n")}\nम्हणजे प्रत्येक पद हे ${num(bases[0])}, ${num(bases[1])}, ${num(bases[2])}, ... यांचा क्रमवार ${wordMr}${offMr} आहे.\nपुढचा आधार ${num(bases[5])} आहे, म्हणून पुढचे पद = ${num(bases[5])}${power === 2 ? "²" : "³"}${offMr} = ${num(bases[5] ** power)}${off === 0 ? "" : off > 0 ? ` + ${num(off)}` : ` − ${num(-off)}`} = ${num(next)}.\n30 पर्यंतचे वर्ग व 15 पर्यंतचे घन पाठ असतील तर असे प्रश्न क्षणात सुटतात.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 6. Fibonacci-style: each term is the sum of the two before it
 * ------------------------------------------------------------------ */
const fibonacciLike = {
  id: "series-sum-of-two",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const a of [1, 2, 3, 4, 5, 6, 7]) {
      for (const b of [3, 4, 5, 7, 8, 9, 11]) {
        if (b > a) out.push({ a, b });
      }
    }
    return out;
  },
  make({ a, b }) {
    // Six visible terms, not five: with only five a cubic also fits the series
    // and predicts a different next term, which would make the question unfair.
    const terms = [a, b];
    for (let i = 0; i < 5; i += 1) terms.push(terms[terms.length - 1] + terms[terms.length - 2]);
    const shown = terms.slice(0, 6);
    const next = terms[6];

    const correct = num(next);
    const distractors = [num(shown[5] * 2), num(next + 1), num(shown[5] + shown[3])];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `Find the next term in the series: ${listOf(shown)}, ?`,
        explanation: `The differences are not constant and the ratios drift, so try adding pairs of earlier terms.\n${num(shown[0])} + ${num(shown[1])} = ${num(shown[2])} ✓\n${num(shown[1])} + ${num(shown[2])} = ${num(shown[3])} ✓\n${num(shown[2])} + ${num(shown[3])} = ${num(shown[4])} ✓\n${num(shown[3])} + ${num(shown[4])} = ${num(shown[5])} ✓\nEvery term is the sum of the two terms immediately before it — a Fibonacci-style pattern.\nThe next term = ${num(shown[4])} + ${num(shown[5])} = ${num(next)}.\nWhenever the ratios of a series creep slowly towards about 1.6, suspect this pattern straight away.`,
      },
      mr: {
        text: `पुढील श्रेणीतील पुढचे पद कोणते: ${listOf(shown)}, ?`,
        explanation: `फरक स्थिर नाहीत आणि गुणोत्तरेही हळूहळू बदलतात, म्हणून आधीच्या पदांच्या जोड्या मिळवून पाहा.\n${num(shown[0])} + ${num(shown[1])} = ${num(shown[2])} ✓\n${num(shown[1])} + ${num(shown[2])} = ${num(shown[3])} ✓\n${num(shown[2])} + ${num(shown[3])} = ${num(shown[4])} ✓\n${num(shown[3])} + ${num(shown[4])} = ${num(shown[5])} ✓\nप्रत्येक पद हे त्याच्या आधीच्या दोन पदांची बेरीज आहे — म्हणजे फिबोनाची प्रकारचा नमुना.\nपुढचे पद = ${num(shown[4])} + ${num(shown[5])} = ${num(next)}.\nएखाद्या श्रेणीची गुणोत्तरे हळूहळू सुमारे 1.6 कडे सरकत असतील, तर लगेच या नमुन्याचा संशय घ्यावा.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 7. Two interleaved series
 * ------------------------------------------------------------------ */
const alternating = {
  id: "series-alternating",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const a1 of [3, 5, 7, 9, 11]) {
      for (const d1 of [4, 5, 6, 7]) {
        for (const a2 of [2, 4, 6, 8]) {
          for (const d2 of [8, 9, 10, 12]) {
            if (d1 !== d2) out.push({ a1, d1, a2, d2 });
          }
        }
      }
    }
    return out;
  },
  make({ a1, d1, a2, d2 }) {
    // Odd positions follow one AP, even positions another.
    const odd = [a1, a1 + d1, a1 + 2 * d1, a1 + 3 * d1];
    const even = [a2, a2 + d2, a2 + 3 * d2 - d2, a2 + 3 * d2];
    even[2] = a2 + 2 * d2;
    const shown = [odd[0], even[0], odd[1], even[1], odd[2], even[2]];
    const next = odd[3];
    if (new Set(shown).size !== shown.length) return null;

    const correct = num(next);
    const distractors = [num(even[2] + d2), num(next + d1), num(shown[5] + d1)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `Find the next term in the series: ${listOf(shown)}, ?`,
        explanation: `The terms rise and fall irregularly, which is the signature of TWO series woven together. Split them by position.\nTerms in the 1st, 3rd and 5th positions: ${num(shown[0])}, ${num(shown[2])}, ${num(shown[4])} — each is ${num(d1)} more than the one before.\nTerms in the 2nd, 4th and 6th positions: ${num(shown[1])}, ${num(shown[3])}, ${num(shown[5])} — each is ${num(d2)} more than the one before.\nThe missing term sits in the 7th position, so it belongs to the FIRST series.\nIt follows ${num(shown[4])}, so it equals ${num(shown[4])} + ${num(d1)} = ${num(next)}.\nWhen a series zig-zags, always try separating the odd-numbered and even-numbered positions before anything else.`,
      },
      mr: {
        text: `पुढील श्रेणीतील पुढचे पद कोणते: ${listOf(shown)}, ?`,
        explanation: `पदे अनियमितपणे वरखाली होत आहेत, हे दोन श्रेणी एकमेकांत गुंफल्याचे लक्षण आहे. स्थानानुसार त्या वेगळ्या करा.\n1, 3 व 5 व्या स्थानांवरील पदे: ${num(shown[0])}, ${num(shown[2])}, ${num(shown[4])} — प्रत्येक आधीच्यापेक्षा ${num(d1)} ने मोठे.\n2, 4 व 6 व्या स्थानांवरील पदे: ${num(shown[1])}, ${num(shown[3])}, ${num(shown[5])} — प्रत्येक आधीच्यापेक्षा ${num(d2)} ने मोठे.\nहरवलेले पद 7 व्या स्थानी आहे, म्हणून ते पहिल्या श्रेणीतील आहे.\nते ${num(shown[4])} नंतर येते, म्हणून ते ${num(shown[4])} + ${num(d1)} = ${num(next)} इतके आहे.\nश्रेणी वरखाली होत असेल, तर इतर काहीही करण्यापूर्वी विषम व सम स्थाने वेगळी करून पाहावीत.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 8. A missing term in the middle
 * ------------------------------------------------------------------ */
const missingMiddle = {
  id: "series-missing-middle",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const a of [4, 6, 7, 9, 12, 15]) {
      for (const d0 of [3, 4, 5, 6]) {
        for (const step of [2, 3, 4]) out.push({ a, d0, step });
      }
    }
    return out;
  },
  make({ a, d0, step }) {
    const terms = [a];
    const diffs = [];
    for (let i = 0; i < 5; i += 1) {
      const d = d0 + i * step;
      diffs.push(d);
      terms.push(terms[terms.length - 1] + d);
    }
    const hidden = terms[3];
    const display = terms.map((t, i) => (i === 3 ? "?" : String(t)));

    const correct = num(hidden);
    const distractors = [num(hidden + step), num(hidden - step), num(terms[2] + diffs[1])];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `Find the missing term in the series: ${display.join(", ")}`,
        explanation: `Work out the gaps you CAN see, on both sides of the blank.\n${num(terms[1])} − ${num(terms[0])} = ${num(diffs[0])}, ${num(terms[2])} − ${num(terms[1])} = ${num(diffs[1])}.\nThe gaps are growing by ${num(step)} each time, so the pattern of gaps is ${diffs.join(", ")}.\nThe gap just before the blank is ${num(diffs[2])}, so the missing term = ${num(terms[2])} + ${num(diffs[2])} = ${num(hidden)}.\nCheck forwards: the next gap should be ${num(diffs[3])}, and ${num(hidden)} + ${num(diffs[3])} = ${num(terms[4])}, which matches the given term.\nWith a middle blank always verify from BOTH sides — that is what makes the answer certain rather than merely plausible.`,
      },
      mr: {
        text: `पुढील श्रेणीतील हरवलेले पद कोणते: ${display.join(", ")}`,
        explanation: `रिकाम्या जागेच्या दोन्ही बाजूंना दिसणारी अंतरे काढा.\n${num(terms[1])} − ${num(terms[0])} = ${num(diffs[0])}, ${num(terms[2])} − ${num(terms[1])} = ${num(diffs[1])}.\nअंतरे प्रत्येक वेळी ${num(step)} ने वाढत आहेत, म्हणून अंतरांचा क्रम ${diffs.join(", ")} असा होतो.\nरिकाम्या जागेच्या आधीचे अंतर ${num(diffs[2])} आहे, म्हणून हरवलेले पद = ${num(terms[2])} + ${num(diffs[2])} = ${num(hidden)}.\nपुढून पडताळणी: पुढचे अंतर ${num(diffs[3])} असावे, आणि ${num(hidden)} + ${num(diffs[3])} = ${num(terms[4])}, जे दिलेल्या पदाशी जुळते.\nमधले पद हरवलेले असल्यास नेहमी दोन्ही बाजूंनी पडताळणी करावी — त्यामुळेच उत्तर निश्चित होते, नुसते शक्य नाही.`,
      },
    };
  },
};

export const topicId = "series";

export const archetypes = [
  arithmetic,
  geometric,
  secondDifference,
  multiplyAdd,
  powerOffset,
  fibonacciLike,
  alternating,
  missingMiddle,
];
