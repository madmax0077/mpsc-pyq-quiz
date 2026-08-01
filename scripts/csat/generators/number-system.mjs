/**
 * Generator: Number System & Simplification.
 *
 * Covers HCF/LCM, remainders, unit digits, factors, divisibility and the
 * standard MPSC two-digit and successive-division patterns.
 */

import { isClean, num } from "../lib/util.mjs";
import {
  countFactors,
  gcd,
  gcdAll,
  lcmAll,
  powMod,
  primeFactors,
  trailingZerosFactorial,
  unitDigit,
} from "../lib/math.mjs";

/* ------------------------------------------------------------------ *
 * 1. HCF x LCM = product of the two numbers
 * ------------------------------------------------------------------ */
const hcfLcmProduct = {
  id: "hcf-lcm-product",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const h of [4, 6, 8, 9, 11, 12, 13, 15, 16]) {
      for (const [m, n] of [[3, 5], [4, 7], [5, 8], [7, 9], [3, 11], [5, 12], [8, 9], [7, 11]]) {
        out.push({ h, m, n });
      }
    }
    return out;
  },
  make({ h, m, n }) {
    if (gcd(m, n) !== 1) return null;
    const a = h * m;
    const b = h * n;
    const l = h * m * n;

    const correct = num(b);
    const distractors = [num(l - a), num(Math.round(l / h)), num(a + h)];

    return {
      correct,
      distractors,
      en: {
        text: `The HCF and the LCM of two numbers are ${num(h)} and ${num(l)} respectively. If one of the numbers is ${num(a)}, find the other number.`,
        explanation: `For any two numbers, HCF × LCM = the product of the numbers.\nSo ${num(h)} × ${num(l)} = ${num(a)} × (the other number).\nProduct of HCF and LCM = ${num(h * l)}.\nThe other number = ${num(h * l)} ÷ ${num(a)} = ${num(b)}.\nCheck: HCF of ${num(a)} and ${num(b)} is ${num(h)} and their LCM is ${num(l)}, so the pair fits.\nThis identity holds only for TWO numbers — it does not extend to three.`,
      },
      mr: {
        text: `दोन संख्यांचा मसावि ${num(h)} आणि लसावि ${num(l)} आहे. जर त्यांपैकी एक संख्या ${num(a)} असेल, तर दुसरी संख्या कोणती?`,
        explanation: `कोणत्याही दोन संख्यांसाठी मसावि × लसावि = त्या दोन संख्यांचा गुणाकार.\nम्हणून ${num(h)} × ${num(l)} = ${num(a)} × (दुसरी संख्या).\nमसावि व लसावि यांचा गुणाकार = ${num(h * l)}.\nदुसरी संख्या = ${num(h * l)} ÷ ${num(a)} = ${num(b)}.\nपडताळणी: ${num(a)} व ${num(b)} यांचा मसावि ${num(h)} आणि लसावि ${num(l)} येतो, म्हणून ही जोडी बरोबर आहे.\nहे सूत्र फक्त दोनच संख्यांसाठी लागू होते, तीन संख्यांसाठी नाही.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 2. Least number leaving the same remainder with several divisors
 * ------------------------------------------------------------------ */
const lcmRemainder = {
  id: "lcm-remainder",
  difficulty: "moderate",
  cases() {
    const out = [];
    const sets = [[6, 8, 12], [5, 6, 9], [4, 6, 10], [8, 12, 16], [9, 12, 15], [6, 10, 15], [7, 8, 12], [5, 8, 12]];
    for (const s of sets) {
      for (const r of [3, 4, 5, 7]) {
        if (r < Math.min(...s)) out.push({ s, r });
      }
    }
    return out;
  },
  make({ s, r }) {
    const l = lcmAll(s);
    const ans = l + r;

    const correct = num(ans);
    const distractors = [num(l), num(l - r), num(s.reduce((a, b) => a * b, 1) + r)];

    return {
      correct,
      distractors,
      en: {
        text: `Find the least number which, when divided by ${s[0]}, ${s[1]} and ${s[2]}, leaves a remainder of ${num(r)} in each case.`,
        explanation: `If the remainder is the same every time, the number is (a common multiple) + (that remainder).\nThe smallest such common multiple is the LCM of ${s.join(", ")}.\nLCM of ${s.join(", ")} = ${num(l)}.\nRequired number = ${num(l)} + ${num(r)} = ${num(ans)}.\nCheck: ${num(ans)} ÷ ${s[0]} leaves ${num(ans % s[0])}, ÷ ${s[1]} leaves ${num(ans % s[1])}, ÷ ${s[2]} leaves ${num(ans % s[2])}.\nAnswering ${num(l)} forgets to add the remainder back.`,
      },
      mr: {
        text: `${s[0]}, ${s[1]} व ${s[2]} या संख्यांनी भागल्यास प्रत्येक वेळी ${num(r)} बाकी उरेल अशी लघुत्तम संख्या कोणती?`,
        explanation: `प्रत्येक वेळी बाकी सारखीच असेल, तर ती संख्या = (सामाईक विभाज्य संख्या) + (ती बाकी).\nअशी सर्वात लहान सामाईक विभाज्य संख्या म्हणजे ${s.join(", ")} यांचा लसावि.\n${s.join(", ")} यांचा लसावि = ${num(l)}.\nआवश्यक संख्या = ${num(l)} + ${num(r)} = ${num(ans)}.\nपडताळणी: ${num(ans)} ÷ ${s[0]} मध्ये ${num(ans % s[0])} बाकी, ÷ ${s[1]} मध्ये ${num(ans % s[1])} बाकी, ÷ ${s[2]} मध्ये ${num(ans % s[2])} बाकी.\nफक्त ${num(l)} उत्तर दिल्यास बाकी मिळवायची राहून जाते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 3. Greatest number dividing several numbers leaving given remainders
 * ------------------------------------------------------------------ */
const hcfRemainder = {
  id: "hcf-remainder",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const g of [12, 14, 15, 16, 18, 21, 24, 25]) {
      for (const [k1, k2, k3] of [[3, 5, 8], [4, 7, 9], [5, 9, 14], [6, 11, 17], [7, 10, 13]]) {
        out.push({ g, k1, k2, k3 });
      }
    }
    return out;
  },
  make({ g, k1, k2, k3 }) {
    const r1 = 2;
    const r2 = 5;
    const r3 = 7;
    if (r1 >= g || r2 >= g || r3 >= g) return null;
    const A = g * k1 + r1;
    const B = g * k2 + r2;
    const C = g * k3 + r3;
    // The construction only guarantees g divides the differences; confirm it is
    // actually the GREATEST such number before using it as the key.
    if (gcdAll([A - r1, B - r2, C - r3]) !== g) return null;

    const correct = num(g);
    const distractors = [num(gcdAll([A, B, C])), num(g * 2), num(gcdAll([B - A, C - B]))];

    return {
      correct,
      distractors,
      en: {
        text: `Find the greatest number that divides ${num(A)}, ${num(B)} and ${num(C)} leaving remainders ${num(r1)}, ${num(r2)} and ${num(r3)} respectively.`,
        explanation: `If a number divides ${num(A)} leaving ${num(r1)}, then it divides ${num(A)} − ${num(r1)} = ${num(A - r1)} exactly.\nSimilarly it divides ${num(B)} − ${num(r2)} = ${num(B - r2)} and ${num(C)} − ${num(r3)} = ${num(C - r3)} exactly.\nSo the required number is the HCF of ${num(A - r1)}, ${num(B - r2)} and ${num(C - r3)}.\nHCF = ${num(g)}.\nCheck: ${num(A)} ÷ ${num(g)} leaves ${num(A % g)}, ${num(B)} ÷ ${num(g)} leaves ${num(B % g)}, ${num(C)} ÷ ${num(g)} leaves ${num(C % g)}.\nTaking the HCF of the original numbers instead of the reduced ones is the standard error.`,
      },
      mr: {
        text: `${num(A)}, ${num(B)} व ${num(C)} या संख्यांना भागल्यास अनुक्रमे ${num(r1)}, ${num(r2)} व ${num(r3)} बाकी उरेल अशी महत्तम संख्या कोणती?`,
        explanation: `एखादी संख्या ${num(A)} ला भागून ${num(r1)} बाकी ठेवत असेल, तर ती ${num(A)} − ${num(r1)} = ${num(A - r1)} ला पूर्ण भागते.\nत्याचप्रमाणे ती ${num(B)} − ${num(r2)} = ${num(B - r2)} व ${num(C)} − ${num(r3)} = ${num(C - r3)} यांनाही पूर्ण भागते.\nम्हणून आवश्यक संख्या = ${num(A - r1)}, ${num(B - r2)} व ${num(C - r3)} यांचा मसावि.\nमसावि = ${num(g)}.\nपडताळणी: ${num(A)} ÷ ${num(g)} मध्ये ${num(A % g)} बाकी, ${num(B)} ÷ ${num(g)} मध्ये ${num(B % g)} बाकी, ${num(C)} ÷ ${num(g)} मध्ये ${num(C % g)} बाकी.\nमूळ संख्यांचा मसावि घेणे ही नेहमीची चूक आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 4. Unit digit of a large power
 * ------------------------------------------------------------------ */
const unitDigitPower = {
  id: "unit-digit-power",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const a of [2, 3, 4, 7, 8, 9, 12, 13, 17, 23]) {
      for (const n of [23, 34, 47, 58, 61, 75, 82, 99, 105]) {
        out.push({ a, n });
      }
    }
    return out;
  },
  make({ a, n }) {
    const d = unitDigit(a, n);
    const cycle = [];
    for (let i = 1; i <= 4; i += 1) cycle.push(powMod(a % 10, i, 10));
    const cycleLen = new Set(cycle).size === 1 ? 1 : cycle.length;
    const pos = cycleLen === 1 ? 1 : ((n - 1) % cycleLen) + 1;

    const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== d);
    const distractors = [num(pool[(a + 1) % pool.length]), num(pool[(n + 3) % pool.length]), num(pool[(a + n) % pool.length])];

    return {
      correct: num(d),
      distractors,
      en: {
        text: `Find the digit in the unit's place of ${num(a)}^${num(n)}.`,
        explanation: `Only the last digit of the base matters, so work with ${num(a % 10)}.\nThe unit digits of successive powers of ${num(a % 10)} repeat in the cycle ${cycle.join(", ")} — a cycle of length ${num(cycleLen)}.\nDivide the exponent by the cycle length: ${num(n)} ÷ ${num(cycleLen)} leaves a remainder of ${num(n % cycleLen)}.\nA remainder of ${num(n % cycleLen)} points to position ${num(pos)} in the cycle, which is ${num(d)}.\nSo the unit digit of ${num(a)}^${num(n)} is ${num(d)}.\nWhen the remainder is 0, take the LAST term of the cycle, not the first — that slip is the usual mistake.`,
      },
      mr: {
        text: `${num(a)}^${num(n)} या संख्येच्या एकक स्थानी कोणता अंक असेल?`,
        explanation: `फक्त पायाचा शेवटचा अंक महत्त्वाचा असतो, म्हणून ${num(a % 10)} घ्या.\n${num(a % 10)} च्या क्रमवार घातांकांचे एकक अंक ${cycle.join(", ")} या आवर्तनात पुन्हा पुन्हा येतात — आवर्तनाची लांबी ${num(cycleLen)}.\nघातांकाला आवर्तन लांबीने भागा: ${num(n)} ÷ ${num(cycleLen)} मध्ये ${num(n % cycleLen)} बाकी.\n${num(n % cycleLen)} ही बाकी आवर्तनातील ${num(pos)} व्या स्थानाकडे निर्देश करते, तेथे ${num(d)} आहे.\nम्हणून ${num(a)}^${num(n)} च्या एकक स्थानी ${num(d)} हा अंक येतो.\nबाकी 0 आल्यास आवर्तनातील शेवटचा अंक घ्यावा, पहिला नाही — हीच नेहमीची चूक आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 5. Remainder of a large power
 * ------------------------------------------------------------------ */
const remainderPower = {
  id: "remainder-power",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const a of [2, 3, 5, 6, 7, 8, 10, 11]) {
      for (const m of [7, 9, 11, 13]) {
        for (const n of [25, 40, 53, 64]) {
          if (a % m !== 0) out.push({ a, m, n });
        }
      }
    }
    return out;
  },
  make({ a, m, n }) {
    const r = powMod(a, n, m);
    // Cycle of a^k mod m
    const cycle = [];
    for (let k = 1; k <= 12; k += 1) {
      const v = powMod(a, k, m);
      if (k > 1 && v === cycle[0] && cycle.length > 0) break;
      cycle.push(v);
    }
    const len = cycle.length;
    const pos = ((n - 1) % len) + 1;

    const pool = [];
    for (let x = 0; x < m; x += 1) if (x !== r) pool.push(x);
    const distractors = [num(pool[a % pool.length]), num(pool[(n + 1) % pool.length]), num(pool[(a + m) % pool.length])];

    return {
      correct: num(r),
      distractors,
      en: {
        text: `Find the remainder when ${num(a)}^${num(n)} is divided by ${num(m)}.`,
        explanation: `Look at the remainders of successive powers of ${num(a)} when divided by ${num(m)}:\n${cycle.map((v, i) => `${num(a)}^${num(i + 1)} leaves ${num(v)}`).join(", ")}.\nThe pattern repeats with a cycle of length ${num(len)}.\nDivide the exponent by the cycle length: ${num(n)} ÷ ${num(len)} leaves a remainder of ${num(n % len)}, i.e. position ${num(pos)} in the cycle.\nThat position holds ${num(r)}, so ${num(a)}^${num(n)} leaves a remainder of ${num(r)} when divided by ${num(m)}.\nNever try to compute ${num(a)}^${num(n)} itself — finding the cycle is the whole technique.`,
      },
      mr: {
        text: `${num(a)}^${num(n)} या संख्येला ${num(m)} ने भागल्यास किती बाकी उरेल?`,
        explanation: `${num(a)} च्या क्रमवार घातांकांना ${num(m)} ने भागल्यावर उरणाऱ्या बाक्या पाहा:\n${cycle.map((v, i) => `${num(a)}^${num(i + 1)} मध्ये ${num(v)} बाकी`).join(", ")}.\nहा नमुना ${num(len)} लांबीच्या आवर्तनात पुन्हा येतो.\nघातांकाला आवर्तन लांबीने भागा: ${num(n)} ÷ ${num(len)} मध्ये ${num(n % len)} बाकी, म्हणजे आवर्तनातील ${num(pos)} वे स्थान.\nत्या स्थानी ${num(r)} आहे, म्हणून ${num(a)}^${num(n)} ला ${num(m)} ने भागल्यास ${num(r)} बाकी उरते.\n${num(a)}^${num(n)} ही संख्या प्रत्यक्ष काढण्याचा प्रयत्न करू नये — आवर्तन शोधणे हेच खरे तंत्र आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 6. Least digit that makes a number divisible
 * ------------------------------------------------------------------ */
const missingDigit = {
  id: "missing-digit-divisible",
  difficulty: "moderate",
  cases() {
    const out = [];
    const stems = [
      "4573*2", "6*2158", "37*294", "51824*", "9*4736", "283*15",
      "7261*4", "*46293", "83*512", "5197*6",
    ];
    for (const stem of stems) {
      for (const d of [9, 11, 6]) out.push({ stem, d });
    }
    return out;
  },
  make({ stem, d }) {
    let answer = null;
    for (let x = 0; x <= 9; x += 1) {
      const candidate = Number(stem.replace("*", String(x)));
      if (candidate % d === 0) {
        answer = x;
        break;
      }
    }
    if (answer === null) return null;
    if (stem.startsWith("*") && answer === 0) return null;

    const pool = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter((x) => x !== answer);
    const distractors = [num(pool[0]), num(pool[3]), num(pool[6])];
    const full = Number(stem.replace("*", String(answer)));

    const rule =
      d === 9
        ? {
            en: "A number is divisible by 9 when the sum of its digits is divisible by 9.",
            mr: "एखाद्या संख्येच्या अंकांची बेरीज 9 ने भाग जात असेल, तर ती संख्या 9 ने भाग जाते.",
          }
        : d === 11
          ? {
              en: "A number is divisible by 11 when the difference between the sum of the digits in odd places and the sum in even places is 0 or a multiple of 11.",
              mr: "विषम स्थानांवरील अंकांची बेरीज व सम स्थानांवरील अंकांची बेरीज यांतील फरक 0 किंवा 11 चा पट असेल, तर ती संख्या 11 ने भाग जाते.",
            }
          : {
              en: "A number is divisible by 6 when it is divisible by both 2 and 3 — the last digit must be even and the digit sum must be a multiple of 3.",
              mr: "एखादी संख्या 2 व 3 या दोन्हींनी भाग जात असेल तरच ती 6 ने भाग जाते — शेवटचा अंक सम असावा व अंकांची बेरीज 3 च्या पटीत असावी.",
            };

    const digitSum = String(full).split("").reduce((a, c) => a + Number(c), 0);

    return {
      correct: num(answer),
      distractors,
      en: {
        text: `What is the least digit that should replace * so that the number ${stem} becomes divisible by ${num(d)}?`,
        explanation: `${rule.en}\nTry the digits 0, 1, 2, ... in turn and stop at the first one that works.\nPutting ${num(answer)} in place of * gives ${num(full)}.\nIts digits add up to ${num(digitSum)}, and ${num(full)} ÷ ${num(d)} = ${num(full / d)} exactly, with no remainder.\nSo the least digit required is ${num(answer)}.\nThe question asks for the LEAST such digit, so stop at the first one that works rather than quoting a larger valid digit.`,
      },
      mr: {
        text: `${stem} ही संख्या ${num(d)} ने पूर्ण भाग जावी यासाठी * च्या जागी कोणता लघुत्तम अंक ठेवावा?`,
        explanation: `${rule.mr}\n0, 1, 2, ... असे अंक क्रमाने तपासा आणि जो पहिल्यांदा जुळेल तेथे थांबा.\n* च्या जागी ${num(answer)} ठेवल्यास संख्या ${num(full)} होते.\nतिच्या अंकांची बेरीज ${num(digitSum)} आहे, आणि ${num(full)} ÷ ${num(d)} = ${num(full / d)} असा पूर्ण भाग जातो, बाकी शून्य.\nम्हणून आवश्यक लघुत्तम अंक ${num(answer)} आहे.\nप्रश्नात लघुत्तम अंक विचारला आहे, म्हणून पहिला जुळणारा अंक घ्यावा, मोठा नाही.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 7. Number of factors
 * ------------------------------------------------------------------ */
const factorCount = {
  id: "factor-count",
  difficulty: "moderate",
  cases() {
    return [
      36, 48, 60, 72, 84, 96, 120, 144, 180, 200,
      210, 240, 252, 288, 300, 360, 400, 450, 504, 600,
    ].map((n) => ({ n }));
  },
  make({ n }) {
    const pf = primeFactors(n);
    const total = countFactors(n);
    const written = pf.map(([p, e]) => (e === 1 ? `${p}` : `${p}^${e}`)).join(" × ");
    const product = pf.map(([, e]) => `(${e} + 1)`).join(" × ");

    const distractors = [num(total - 2), num(total + 2), num(pf.length)];

    return {
      correct: num(total),
      distractors,
      en: {
        text: `How many factors does the number ${num(n)} have?`,
        explanation: `First write ${num(n)} as a product of primes: ${num(n)} = ${written}.\nIf a number is p^a × q^b × ..., its total number of factors is (a + 1)(b + 1)....\nHere that gives ${product} = ${num(total)}.\nSo ${num(n)} has ${num(total)} factors in all, counting 1 and ${num(n)} themselves.\nAdd 1 to each exponent before multiplying — using the exponents directly is the usual slip.`,
      },
      mr: {
        text: `${num(n)} या संख्येला एकूण किती अवयव आहेत?`,
        explanation: `प्रथम ${num(n)} ची मूळ अवयवांत मांडणी करा: ${num(n)} = ${written}.\nएखादी संख्या p^a × q^b × ... अशी असल्यास तिच्या अवयवांची संख्या = (a + 1)(b + 1)... असते.\nयेथे ${product} = ${num(total)}.\nम्हणून ${num(n)} ला एकूण ${num(total)} अवयव आहेत, यात 1 व ${num(n)} हे दोन्ही मोजले आहेत.\nगुणाकार करण्यापूर्वी प्रत्येक घातांकात 1 मिळवावा — घातांक तसेच वापरणे ही नेहमीची चूक आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 8. Standard summation series
 * ------------------------------------------------------------------ */
const sumSeries = {
  id: "sum-series",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const kind of ["natural", "odd", "even", "squares"]) {
      for (const n of [15, 20, 25, 30, 40, 45, 50, 60]) out.push({ kind, n });
    }
    return out;
  },
  make({ kind, n }) {
    let ans;
    let formula;
    let label;
    if (kind === "natural") {
      ans = (n * (n + 1)) / 2;
      formula = { en: `n(n + 1)/2 = ${n} × ${n + 1} / 2`, mr: `n(n + 1)/2 = ${n} × ${n + 1} / 2` };
      label = { en: "natural numbers", mr: "नैसर्गिक संख्यांची" };
    } else if (kind === "odd") {
      ans = n * n;
      formula = { en: `n² = ${n}²`, mr: `n² = ${n}²` };
      label = { en: "odd natural numbers", mr: "विषम नैसर्गिक संख्यांची" };
    } else if (kind === "even") {
      ans = n * (n + 1);
      formula = { en: `n(n + 1) = ${n} × ${n + 1}`, mr: `n(n + 1) = ${n} × ${n + 1}` };
      label = { en: "even natural numbers", mr: "सम नैसर्गिक संख्यांची" };
    } else {
      ans = (n * (n + 1) * (2 * n + 1)) / 6;
      formula = {
        en: `n(n + 1)(2n + 1)/6 = ${n} × ${n + 1} × ${2 * n + 1} / 6`,
        mr: `n(n + 1)(2n + 1)/6 = ${n} × ${n + 1} × ${2 * n + 1} / 6`,
      };
      label = { en: "squares of the first natural numbers", mr: "नैसर्गिक संख्यांच्या वर्गांची" };
    }
    if (!Number.isInteger(ans)) return null;

    const distractors = [num(ans + n), num(ans - n), num(Math.round(ans * 2))];

    const qEn =
      kind === "squares"
        ? `Find the sum of the squares of the first ${num(n)} natural numbers.`
        : `Find the sum of the first ${num(n)} ${label.en}.`;
    const qMr =
      kind === "squares"
        ? `पहिल्या ${num(n)} नैसर्गिक संख्यांच्या वर्गांची बेरीज किती?`
        : `पहिल्या ${num(n)} ${label.mr} बेरीज किती?`;

    return {
      correct: num(ans),
      distractors,
      en: {
        text: qEn,
        explanation: `Use the standard summation formula for this series.\nSum = ${formula.en}.\nWorking it out: ${num(ans)}.\nSo the required sum is ${num(ans)}.\nThese four formulas — n(n+1)/2 for naturals, n² for odds, n(n+1) for evens and n(n+1)(2n+1)/6 for squares — are worth memorising, because adding term by term is far too slow in the exam.`,
      },
      mr: {
        text: qMr,
        explanation: `या श्रेणीसाठी प्रमाणित बेरजेचे सूत्र वापरा.\nबेरीज = ${formula.mr}.\nगणन केल्यावर: ${num(ans)}.\nम्हणून आवश्यक बेरीज ${num(ans)} आहे.\nनैसर्गिक संख्यांसाठी n(n+1)/2, विषमांसाठी n², समांसाठी n(n+1) आणि वर्गांसाठी n(n+1)(2n+1)/6 ही चार सूत्रे पाठ असावीत, कारण एक एक पद जोडत बसणे परीक्षेत फार वेळखाऊ ठरते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 9. Two-digit number and its reversal
 * ------------------------------------------------------------------ */
const digitReversal = {
  id: "two-digit-reversal",
  difficulty: "hard",
  cases() {
    const out = [];
    for (let t = 1; t <= 8; t += 1) {
      for (let u = t + 1; u <= 9; u += 1) {
        out.push({ t, u });
      }
    }
    return out;
  },
  make({ t, u }) {
    if (u <= t) return null;
    const s = t + u;
    const diff = 9 * (u - t);
    const original = 10 * t + u;
    const reversed = 10 * u + t;

    const distractors = [num(reversed), num(10 * u + t - 9), num(original + 9)];
    if (new Set([num(original), ...distractors]).size !== 4) return null;

    return {
      correct: num(original),
      distractors,
      en: {
        text: `The sum of the digits of a two-digit number is ${num(s)}. When the digits are interchanged, the new number is ${num(diff)} more than the original number. Find the original number.`,
        explanation: `Let the tens digit be t and the units digit be u, so the number is 10t + u.\nGiven t + u = ${num(s)}.\nReversing gives 10u + t, and the increase is (10u + t) − (10t + u) = 9(u − t).\nSo 9(u − t) = ${num(diff)}, which means u − t = ${num(u - t)}.\nSolving t + u = ${num(s)} together with u − t = ${num(u - t)}: u = ${num(u)} and t = ${num(t)}.\nThe original number is ${num(original)} and the reversed number is ${num(reversed)} — a difference of exactly ${num(diff)}.\nThe difference between a two-digit number and its reversal is ALWAYS a multiple of 9, which is a useful sanity check.`,
      },
      mr: {
        text: `एका दोन अंकी संख्येच्या अंकांची बेरीज ${num(s)} आहे. अंकांची अदलाबदल केल्यास नवीन संख्या मूळ संख्येपेक्षा ${num(diff)} ने मोठी होते. तर मूळ संख्या कोणती?`,
        explanation: `दशक स्थानचा अंक t व एकक स्थानचा अंक u धरा, म्हणजे संख्या 10t + u होते.\nदिले आहे की t + u = ${num(s)}.\nअंकांची अदलाबदल केल्यास 10u + t मिळते, आणि वाढ = (10u + t) − (10t + u) = 9(u − t).\nम्हणून 9(u − t) = ${num(diff)}, म्हणजे u − t = ${num(u - t)}.\nt + u = ${num(s)} व u − t = ${num(u - t)} ही समीकरणे सोडवल्यास u = ${num(u)} व t = ${num(t)}.\nमूळ संख्या ${num(original)} आणि उलट केलेली संख्या ${num(reversed)} — फरक नेमका ${num(diff)}.\nदोन अंकी संख्या व तिची उलट संख्या यांतील फरक नेहमी 9 च्या पटीत असतो, ही पडताळणीसाठी उपयुक्त गोष्ट आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 10. Successive division
 * ------------------------------------------------------------------ */
const successiveDivision = {
  id: "successive-division",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const a of [5, 6, 7, 8, 9]) {
      for (const b of [4, 5, 6, 7, 8]) {
        for (const r1 of [1, 2, 3]) {
          for (const r2 of [2, 3, 4]) {
            if (r1 < a && r2 < b) out.push({ a, b, r1, r2 });
          }
        }
      }
    }
    return out;
  },
  make({ a, b, r1, r2 }) {
    const ans = a * r2 + r1;
    if (ans >= a * b) return null;

    const distractors = [num(r1 + r2), num(b * r1 + r2), num(a * r1 + r2)];
    if (new Set([num(ans), ...distractors]).size !== 4) return null;

    return {
      correct: num(ans),
      distractors,
      en: {
        text: `A number, when divided by ${num(a)}, leaves a remainder of ${num(r1)}. The quotient so obtained, when divided by ${num(b)}, leaves a remainder of ${num(r2)}. What remainder will the original number leave when divided by ${num(a * b)}?`,
        explanation: `Work backwards. Let the second quotient be k.\nThe first quotient = ${num(b)}k + ${num(r2)}.\nThe original number = ${num(a)} × (first quotient) + ${num(r1)} = ${num(a)}(${num(b)}k + ${num(r2)}) + ${num(r1)}.\nExpanding: ${num(a * b)}k + ${num(a)} × ${num(r2)} + ${num(r1)} = ${num(a * b)}k + ${num(ans)}.\nThe ${num(a * b)}k part is exactly divisible by ${num(a * b)}, so the remainder is ${num(ans)}.\nCheck with k = 1: the number is ${num(a * b + ans)}, and ${num(a * b + ans)} ÷ ${num(a * b)} leaves ${num(ans)}.\nSimply adding the two remainders to get ${num(r1 + r2)} ignores that the second remainder sits in the quotient and must be multiplied by ${num(a)}.`,
      },
      mr: {
        text: `एका संख्येला ${num(a)} ने भागल्यास ${num(r1)} बाकी उरते. मिळालेल्या भागाकाराला ${num(b)} ने भागल्यास ${num(r2)} बाकी उरते. तर मूळ संख्येला ${num(a * b)} ने भागल्यास किती बाकी उरेल?`,
        explanation: `उलट क्रमाने सोडवा. दुसरा भागाकार k धरा.\nपहिला भागाकार = ${num(b)}k + ${num(r2)}.\nमूळ संख्या = ${num(a)} × (पहिला भागाकार) + ${num(r1)} = ${num(a)}(${num(b)}k + ${num(r2)}) + ${num(r1)}.\nविस्तार केल्यास: ${num(a * b)}k + ${num(a)} × ${num(r2)} + ${num(r1)} = ${num(a * b)}k + ${num(ans)}.\n${num(a * b)}k हा भाग ${num(a * b)} ने पूर्ण भाग जातो, म्हणून बाकी ${num(ans)} उरते.\nk = 1 घेऊन पडताळणी: संख्या ${num(a * b + ans)} होते, आणि ${num(a * b + ans)} ÷ ${num(a * b)} मध्ये ${num(ans)} बाकी उरते.\nदोन्ही बाक्या नुसत्या बेरीज करून ${num(r1 + r2)} घेणे चुकीचे आहे, कारण दुसरी बाकी भागाकारात असल्याने तिला ${num(a)} ने गुणावे लागते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 11. Trailing zeros in a factorial
 * ------------------------------------------------------------------ */
const factorialZeros = {
  id: "factorial-zeros",
  difficulty: "hard",
  cases() {
    return [25, 30, 40, 50, 60, 75, 80, 90, 100, 120, 125, 150].map((n) => ({ n }));
  },
  make({ n }) {
    const ans = trailingZerosFactorial(n);
    const terms = [];
    for (let p = 5; p <= n; p *= 5) terms.push(`⌊${num(n)}/${num(p)}⌋ = ${num(Math.floor(n / p))}`);

    const distractors = [num(Math.floor(n / 5)), num(ans + 2), num(Math.floor(n / 10))];
    if (new Set([num(ans), ...distractors]).size !== 4) return null;

    return {
      correct: num(ans),
      distractors,
      en: {
        text: `How many zeros are there at the end of ${num(n)}! (${num(n)} factorial)?`,
        explanation: `A trailing zero comes from a factor of 10, and 10 = 2 × 5.\nIn a factorial there are always far more 2s than 5s, so the number of zeros equals the number of 5s.\nCount the multiples of 5, then 25, then 125, and so on:\n${terms.join(", ")}.\nTotal = ${terms.map((t) => t.split("= ")[1]).join(" + ")} = ${num(ans)}.\nSo ${num(n)}! ends in ${num(ans)} zeros.\nStopping at ${num(Math.floor(n / 5))} misses the extra 5s hidden inside 25, 125 and so on.`,
      },
      mr: {
        text: `${num(n)}! (${num(n)} क्रमगुणित) या संख्येच्या शेवटी किती शून्ये असतील?`,
        explanation: `शेवटचे शून्य 10 या अवयवामुळे येते, आणि 10 = 2 × 5.\nक्रमगुणितात 2 चे अवयव 5 पेक्षा नेहमीच खूप जास्त असतात, म्हणून शून्यांची संख्या = 5 च्या अवयवांची संख्या.\n5 चे पट, नंतर 25 चे, नंतर 125 चे असे मोजा:\n${terms.join(", ")}.\nएकूण = ${terms.map((t) => t.split("= ")[1]).join(" + ")} = ${num(ans)}.\nम्हणून ${num(n)}! च्या शेवटी ${num(ans)} शून्ये येतात.\n${num(Math.floor(n / 5))} वर थांबल्यास 25, 125 यांमध्ये दडलेले जादा 5 मोजायचे राहून जातात.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 12. Counting multiples in a range
 * ------------------------------------------------------------------ */
const countMultiples = {
  id: "count-multiples",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const N of [200, 300, 400, 500, 600, 1000]) {
      for (const [p, q] of [[4, 6], [3, 5], [6, 8], [4, 10], [5, 7], [3, 7], [6, 9]]) {
        out.push({ N, p, q });
      }
    }
    return out;
  },
  make({ N, p, q }) {
    const byP = Math.floor(N / p);
    const byQ = Math.floor(N / q);
    const l = (p * q) / gcd(p, q);
    const byBoth = Math.floor(N / l);
    const ans = byP + byQ - byBoth;

    const distractors = [num(byP + byQ), num(byP + byQ - 2 * byBoth), num(byBoth)];
    if (new Set([num(ans), ...distractors]).size !== 4) return null;

    return {
      correct: num(ans),
      distractors,
      en: {
        text: `How many numbers from 1 to ${num(N)} are divisible by ${num(p)} or by ${num(q)}?`,
        explanation: `Numbers divisible by ${num(p)}: ⌊${num(N)}/${num(p)}⌋ = ${num(byP)}.\nNumbers divisible by ${num(q)}: ⌊${num(N)}/${num(q)}⌋ = ${num(byQ)}.\nNumbers divisible by both are the multiples of their LCM, which is ${num(l)}: ⌊${num(N)}/${num(l)}⌋ = ${num(byBoth)}.\nThose ${num(byBoth)} numbers have been counted twice, so subtract them once.\nAnswer = ${num(byP)} + ${num(byQ)} − ${num(byBoth)} = ${num(ans)}.\nSubtract the overlap using the LCM, not the product ${num(p * q)}, unless the two divisors happen to be coprime.`,
      },
      mr: {
        text: `1 ते ${num(N)} या संख्यांपैकी किती संख्यांना ${num(p)} ने किंवा ${num(q)} ने भाग जातो?`,
        explanation: `${num(p)} ने भाग जाणाऱ्या संख्या: ⌊${num(N)}/${num(p)}⌋ = ${num(byP)}.\n${num(q)} ने भाग जाणाऱ्या संख्या: ⌊${num(N)}/${num(q)}⌋ = ${num(byQ)}.\nदोन्हींनी भाग जाणाऱ्या संख्या म्हणजे त्यांच्या लसाविचे पट, लसावि = ${num(l)}: ⌊${num(N)}/${num(l)}⌋ = ${num(byBoth)}.\nया ${num(byBoth)} संख्या दोनदा मोजल्या गेल्या आहेत, म्हणून त्या एकदा वजा करा.\nउत्तर = ${num(byP)} + ${num(byQ)} − ${num(byBoth)} = ${num(ans)}.\nसामाईक भाग वजा करताना लसावि वापरावा, ${num(p * q)} हा गुणाकार नाही — दोन्ही विभाजक सहमूळ असतील तरच गुणाकार चालतो.`,
      },
    };
  },
};

export const topicId = "number-system";

export const archetypes = [
  hcfLcmProduct,
  lcmRemainder,
  hcfRemainder,
  unitDigitPower,
  remainderPower,
  missingDigit,
  factorCount,
  sumSeries,
  digitReversal,
  successiveDivision,
  factorialZeros,
  countMultiples,
];
