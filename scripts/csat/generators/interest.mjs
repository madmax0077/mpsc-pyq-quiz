/**
 * Generator: Simple & Compound Interest.
 */

import { inr, isClean, num, pct, round } from "../lib/util.mjs";

/* ------------------------------------------------------------------ *
 * 1. Plain simple interest
 * ------------------------------------------------------------------ */
const siBasic = {
  id: "si-basic",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const p of [4000, 5000, 6400, 7500, 9000, 12000, 15000, 24000]) {
      for (const r of [5, 6, 7.5, 8, 9, 10, 12]) {
        for (const t of [2, 3, 4, 5]) out.push({ p, r, t });
      }
    }
    return out;
  },
  make({ p, r, t }) {
    const si = (p * r * t) / 100;
    if (!isClean(si)) return null;

    const correct = inr(round(si, 2));
    const distractors = [inr(round(p + si, 2)), inr(round((p * r) / 100, 2)), inr(round(si * 2, 2))];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `Find the simple interest on ${inr(p)} at ${num(r)}% per annum for ${num(t)} years.`,
        explanation: `Simple interest is charged on the original principal every year, so it never changes from year to year.\nSI = (P × R × T) / 100.\n= (${num(p)} × ${num(r)} × ${num(t)}) / 100.\n= ${num(p * r)} × ${num(t)} / 100 = ${inr(round(si, 2))}.\nThe interest for one year alone would be ${inr(round((p * r) / 100, 2))}, and over ${num(t)} years that simply repeats.\nNote the question asks for the INTEREST, not the amount — the amount would be ${inr(p)} + ${inr(round(si, 2))} = ${inr(round(p + si, 2))}.`,
      },
      mr: {
        text: `${inr(p)} या मुद्दलावर ${num(r)}% वार्षिक दराने ${num(t)} वर्षांचे सरळव्याज किती?`,
        explanation: `सरळव्याज दरवर्षी मूळ मुद्दलावरच आकारले जाते, म्हणून ते दरवर्षी सारखेच राहते.\nसरळव्याज = (मुद्दल × दर × मुदत) / 100.\n= (${num(p)} × ${num(r)} × ${num(t)}) / 100.\n= ${num(p * r)} × ${num(t)} / 100 = ${inr(round(si, 2))}.\nएका वर्षाचे व्याज ${inr(round((p * r) / 100, 2))} होते आणि ${num(t)} वर्षांत तेच पुन्हा पुन्हा मिळते.\nप्रश्नात व्याज विचारले आहे, रास नाही — रास ${inr(p)} + ${inr(round(si, 2))} = ${inr(round(p + si, 2))} झाली असती.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 2. Finding the rate from the interest
 * ------------------------------------------------------------------ */
const siFindRate = {
  id: "si-find-rate",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const p of [2500, 4000, 5000, 6000, 8000, 12500]) {
      for (const r of [4, 5, 6, 8, 9, 12]) {
        for (const t of [2, 3, 4, 5]) out.push({ p, r, t });
      }
    }
    return out;
  },
  make({ p, r, t }) {
    const si = (p * r * t) / 100;
    if (!Number.isInteger(si)) return null;

    const correct = pct(r);
    const distractors = [pct(round(r * t, 2)), pct(round(r / 2, 2)), pct(round(r + 2, 2))];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `A sum of ${inr(p)} earns a simple interest of ${inr(si)} in ${num(t)} years. Find the rate of interest per annum.`,
        explanation: `Start from SI = (P × R × T) / 100 and rearrange for R:\nR = (SI × 100) / (P × T).\n= (${num(si)} × 100) / (${num(p)} × ${num(t)}).\n= ${num(si * 100)} / ${num(p * t)} = ${num(r)}.\nSo the rate is ${pct(r)} per annum.\nThe rate is always PER ANNUM. Dividing only by the principal without dividing by the ${num(t)} years would give ${pct(round(r * t, 2))}, which is the total rate for the whole period, not the annual one.`,
      },
      mr: {
        text: `${inr(p)} या रकमेवर ${num(t)} वर्षांत ${inr(si)} इतके सरळव्याज मिळते. तर वार्षिक व्याजदर किती?`,
        explanation: `सरळव्याज = (मुद्दल × दर × मुदत) / 100 या सूत्रावरून दर काढा:\nदर = (व्याज × 100) / (मुद्दल × मुदत).\n= (${num(si)} × 100) / (${num(p)} × ${num(t)}).\n= ${num(si * 100)} / ${num(p * t)} = ${num(r)}.\nम्हणून व्याजदर ${pct(r)} वार्षिक आहे.\nव्याजदर नेहमी वार्षिक असतो. ${num(t)} वर्षांनी न भागल्यास ${pct(round(r * t, 2))} येते, जो संपूर्ण मुदतीचा एकत्रित दर आहे, वार्षिक नाही.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 3. A sum that multiplies itself under simple interest
 * ------------------------------------------------------------------ */
const siMultiply = {
  id: "si-multiplies",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const k of [2, 3, 4]) {
      for (const t of [5, 6, 8, 10, 12, 15, 16, 20, 25]) out.push({ k, t });
    }
    return out;
  },
  make({ k, t }) {
    const r = ((k - 1) * 100) / t;
    if (!isClean(r)) return null;

    const correct = pct(round(r, 2));
    const distractors = [pct(round((k * 100) / t, 2)), pct(round(r / 2, 2)), pct(round(100 / t, 2))];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    const word = { 2: "double", 3: "treble", 4: "become four times" }[k];
    const wordMr = { 2: "दुप्पट", 3: "तिप्पट", 4: "चौपट" }[k];

    return {
      correct,
      distractors,
      en: {
        text: `At what rate of simple interest per annum will a sum of money ${word} itself in ${num(t)} years?`,
        explanation: `Take the principal as 100 — with percentages, choosing 100 removes all the arithmetic.\nTo ${word}, the amount must reach ${num(k * 100)}, so the interest earned must be ${num(k * 100)} − 100 = ${num((k - 1) * 100)}.\nUsing SI = (P × R × T)/100: ${num((k - 1) * 100)} = (100 × R × ${num(t)}) / 100 = ${num(t)}R.\nR = ${num((k - 1) * 100)} ÷ ${num(t)} = ${num(round(r, 2))}.\nSo the rate is ${pct(round(r, 2))} per annum.\nThe interest needed is ${num((k - 1) * 100)}, not ${num(k * 100)} — the original principal is already there and does not have to be earned.`,
      },
      mr: {
        text: `कोणत्या वार्षिक सरळव्याज दराने एखादी रक्कम ${num(t)} वर्षांत ${wordMr} होईल?`,
        explanation: `मुद्दल 100 धरा — टक्केवारीच्या उदाहरणांत 100 घेतल्याने गणित सोपे होते.\n${wordMr} होण्यासाठी रास ${num(k * 100)} व्हावी लागेल, म्हणून मिळणारे व्याज ${num(k * 100)} − 100 = ${num((k - 1) * 100)} असले पाहिजे.\nसरळव्याज = (मुद्दल × दर × मुदत)/100 वापरून: ${num((k - 1) * 100)} = (100 × दर × ${num(t)}) / 100 = ${num(t)} × दर.\nदर = ${num((k - 1) * 100)} ÷ ${num(t)} = ${num(round(r, 2))}.\nम्हणून व्याजदर ${pct(round(r, 2))} वार्षिक आहे.\nआवश्यक व्याज ${num((k - 1) * 100)} आहे, ${num(k * 100)} नाही — मूळ मुद्दल आधीच आपल्याकडे असते, ते कमवावे लागत नाही.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 4. Compound interest over a few years
 * ------------------------------------------------------------------ */
const ciBasic = {
  id: "ci-basic",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const p of [5000, 8000, 10000, 12500, 15625, 16000, 20000, 25000]) {
      for (const r of [4, 5, 8, 10, 12, 20]) {
        for (const t of [2, 3]) out.push({ p, r, t });
      }
    }
    return out;
  },
  make({ p, r, t }) {
    const amount = p * (1 + r / 100) ** t;
    const ci = amount - p;
    if (!isClean(ci) || !isClean(amount)) return null;
    const si = (p * r * t) / 100;

    const correct = inr(round(ci, 2));
    const distractors = [inr(round(si, 2)), inr(round(amount, 2)), inr(round(ci + si, 2))];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `Find the compound interest on ${inr(p)} at ${num(r)}% per annum for ${num(t)} years, compounded annually.`,
        explanation: `Under compound interest each year's interest is added to the principal, so the next year earns interest on a larger base.\nAmount = P(1 + R/100)^T = ${num(p)} × (1 + ${num(r)}/100)^${num(t)} = ${num(p)} × ${num(round((1 + r / 100) ** t, 6))}.\nAmount = ${inr(round(amount, 2))}.\nCompound interest = Amount − Principal = ${inr(round(amount, 2))} − ${inr(p)} = ${inr(round(ci, 2))}.\nSimple interest over the same period would have been only ${inr(round(si, 2))}; the extra ${inr(round(ci - si, 2))} is the interest earned on the interest.\nRemember to subtract the principal — quoting ${inr(round(amount, 2))} answers a different question.`,
      },
      mr: {
        text: `${inr(p)} या मुद्दलावर ${num(r)}% वार्षिक दराने ${num(t)} वर्षांचे चक्रवाढ व्याज किती? (व्याज वार्षिक चक्रवाढ.)`,
        explanation: `चक्रवाढ व्याजात दरवर्षीचे व्याज मुद्दलात मिळवले जाते, त्यामुळे पुढील वर्षी मोठ्या रकमेवर व्याज मिळते.\nरास = मुद्दल(1 + दर/100)^मुदत = ${num(p)} × (1 + ${num(r)}/100)^${num(t)} = ${num(p)} × ${num(round((1 + r / 100) ** t, 6))}.\nरास = ${inr(round(amount, 2))}.\nचक्रवाढ व्याज = रास − मुद्दल = ${inr(round(amount, 2))} − ${inr(p)} = ${inr(round(ci, 2))}.\nतेवढ्याच मुदतीचे सरळव्याज फक्त ${inr(round(si, 2))} झाले असते; जादा ${inr(round(ci - si, 2))} म्हणजे व्याजावर मिळालेले व्याज.\nमुद्दल वजा करायला विसरू नये — ${inr(round(amount, 2))} हे उत्तर वेगळ्याच प्रश्नाचे आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 5. Difference between CI and SI
 * ------------------------------------------------------------------ */
const ciSiDifference = {
  id: "ci-si-difference",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const p of [5000, 8000, 10000, 12000, 15000, 20000, 25000, 40000]) {
      for (const r of [4, 5, 8, 10, 12, 15]) {
        for (const t of [2, 3]) out.push({ p, r, t });
      }
    }
    return out;
  },
  make({ p, r, t }) {
    const ci = p * (1 + r / 100) ** t - p;
    const si = (p * r * t) / 100;
    const diff = ci - si;
    if (!isClean(diff) || diff <= 0) return null;

    const correct = inr(round(diff, 2));
    const distractors = [inr(round(diff * 2, 2)), inr(round(si, 2)), inr(round(ci, 2))];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    const formula =
      t === 2
        ? {
            en: `For 2 years there is a neat shortcut: difference = P(R/100)² = ${num(p)} × (${num(r)}/100)² = ${inr(round(p * (r / 100) ** 2, 2))}.`,
            mr: `दोन वर्षांसाठी सोपे सूत्र आहे: फरक = मुद्दल × (दर/100)² = ${num(p)} × (${num(r)}/100)² = ${inr(round(p * (r / 100) ** 2, 2))}.`,
          }
        : {
            en: `For 3 years the shortcut is: difference = P(R/100)²(3 + R/100) = ${inr(round(p * (r / 100) ** 2 * (3 + r / 100), 2))}.`,
            mr: `तीन वर्षांसाठी सूत्र: फरक = मुद्दल × (दर/100)² × (3 + दर/100) = ${inr(round(p * (r / 100) ** 2 * (3 + r / 100), 2))}.`,
          };

    return {
      correct,
      distractors,
      en: {
        text: `Find the difference between the compound interest and the simple interest on ${inr(p)} at ${num(r)}% per annum for ${num(t)} years.`,
        explanation: `Simple interest = (P × R × T)/100 = (${num(p)} × ${num(r)} × ${num(t)})/100 = ${inr(round(si, 2))}.\nCompound interest = P(1 + R/100)^T − P = ${inr(round(p * (1 + r / 100) ** t, 2))} − ${inr(p)} = ${inr(round(ci, 2))}.\nDifference = ${inr(round(ci, 2))} − ${inr(round(si, 2))} = ${inr(round(diff, 2))}.\n${formula.en}\nThe difference arises purely because compound interest also earns interest on the earlier interest, which is why CI is always the larger of the two.`,
      },
      mr: {
        text: `${inr(p)} या मुद्दलावर ${num(r)}% वार्षिक दराने ${num(t)} वर्षांच्या चक्रवाढ व्याज व सरळव्याज यांतील फरक किती?`,
        explanation: `सरळव्याज = (मुद्दल × दर × मुदत)/100 = (${num(p)} × ${num(r)} × ${num(t)})/100 = ${inr(round(si, 2))}.\nचक्रवाढ व्याज = मुद्दल(1 + दर/100)^मुदत − मुद्दल = ${inr(round(p * (1 + r / 100) ** t, 2))} − ${inr(p)} = ${inr(round(ci, 2))}.\nफरक = ${inr(round(ci, 2))} − ${inr(round(si, 2))} = ${inr(round(diff, 2))}.\n${formula.mr}\nहा फरक केवळ यामुळे येतो की चक्रवाढ व्याजात आधीच्या व्याजावरही व्याज मिळते, म्हणूनच चक्रवाढ व्याज नेहमी जास्त असते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 6. Compounded half-yearly
 * ------------------------------------------------------------------ */
const ciHalfYearly = {
  id: "ci-half-yearly",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const p of [4000, 8000, 10000, 12000, 16000, 20000, 25000]) {
      for (const r of [8, 10, 12, 20]) {
        for (const t of [1.5, 2]) out.push({ p, r, t });
      }
    }
    return out;
  },
  make({ p, r, t }) {
    const n = t * 2;
    const halfRate = r / 2;
    const amount = p * (1 + halfRate / 100) ** n;
    const ci = amount - p;
    if (!isClean(ci)) return null;
    const annual = p * (1 + r / 100) ** t - p;

    const correct = inr(round(ci, 2));
    const distractors = [inr(round(annual, 2)), inr(round(amount, 2)), inr(round((p * r * t) / 100, 2))];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `Find the compound interest on ${inr(p)} at ${num(r)}% per annum for ${num(t)} years when the interest is compounded half-yearly.`,
        explanation: `When interest is compounded half-yearly, HALVE the rate and DOUBLE the number of periods.\nRate per half-year = ${num(r)}/2 = ${num(halfRate)}%.\nNumber of half-years = ${num(t)} × 2 = ${num(n)}.\nAmount = ${num(p)} × (1 + ${num(halfRate)}/100)^${num(n)} = ${num(p)} × ${num(round((1 + halfRate / 100) ** n, 6))} = ${inr(round(amount, 2))}.\nCompound interest = ${inr(round(amount, 2))} − ${inr(p)} = ${inr(round(ci, 2))}.\nCompounding more often always yields more: yearly compounding would have given only ${inr(round(annual, 2))}.`,
      },
      mr: {
        text: `${inr(p)} या मुद्दलावर ${num(r)}% वार्षिक दराने ${num(t)} वर्षांचे चक्रवाढ व्याज किती? (व्याज सहामाही चक्रवाढ.)`,
        explanation: `व्याज सहामाही चक्रवाढ असेल तर दर निम्मा करावा आणि मुदतीची संख्या दुप्पट करावी.\nसहामाही दर = ${num(r)}/2 = ${num(halfRate)}%.\nसहामाहींची संख्या = ${num(t)} × 2 = ${num(n)}.\nरास = ${num(p)} × (1 + ${num(halfRate)}/100)^${num(n)} = ${num(p)} × ${num(round((1 + halfRate / 100) ** n, 6))} = ${inr(round(amount, 2))}.\nचक्रवाढ व्याज = ${inr(round(amount, 2))} − ${inr(p)} = ${inr(round(ci, 2))}.\nजितक्या वारंवार चक्रवाढ होते तितके व्याज जास्त मिळते: वार्षिक चक्रवाढीत फक्त ${inr(round(annual, 2))} मिळाले असते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 7. Recovering the principal from the amount
 * ------------------------------------------------------------------ */
const ciFindPrincipal = {
  id: "ci-find-principal",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const p of [4000, 5000, 6250, 8000, 10000, 12500, 15625, 20000]) {
      for (const r of [4, 5, 8, 10, 20]) {
        for (const t of [2, 3]) out.push({ p, r, t });
      }
    }
    return out;
  },
  make({ p, r, t }) {
    const amount = p * (1 + r / 100) ** t;
    if (!Number.isInteger(amount)) return null;

    const correct = inr(p);
    const distractors = [
      inr(round(amount - (amount * r * t) / 100, 2)),
      inr(round(amount / (1 + (r * t) / 100), 2)),
      inr(round(amount - p, 2)),
    ];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `A sum of money amounts to ${inr(amount)} in ${num(t)} years at ${num(r)}% per annum compound interest. Find the sum.`,
        explanation: `Here the amount is known and the principal has to be recovered, so divide instead of multiplying.\nAmount = P(1 + R/100)^T, so P = Amount ÷ (1 + R/100)^T.\n(1 + ${num(r)}/100)^${num(t)} = ${num(round((1 + r / 100) ** t, 6))}.\nP = ${num(amount)} ÷ ${num(round((1 + r / 100) ** t, 6))} = ${inr(p)}.\nCheck: ${inr(p)} growing at ${num(r)}% for ${num(t)} years reaches ${inr(round(amount, 2))}, which matches.\nDo not subtract ${num(r * t)}% from the amount — percentage growth cannot be undone by subtracting the same percentage.`,
      },
      mr: {
        text: `एका रकमेची ${num(r)}% वार्षिक चक्रवाढ व्याजदराने ${num(t)} वर्षांत ${inr(amount)} इतकी रास होते. तर ती मूळ रक्कम किती?`,
        explanation: `येथे रास माहीत असून मुद्दल काढायचे आहे, म्हणून गुणाकाराऐवजी भागाकार करावा.\nरास = मुद्दल(1 + दर/100)^मुदत, म्हणून मुद्दल = रास ÷ (1 + दर/100)^मुदत.\n(1 + ${num(r)}/100)^${num(t)} = ${num(round((1 + r / 100) ** t, 6))}.\nमुद्दल = ${num(amount)} ÷ ${num(round((1 + r / 100) ** t, 6))} = ${inr(p)}.\nपडताळणी: ${inr(p)} ही रक्कम ${num(r)}% दराने ${num(t)} वर्षांत ${inr(round(amount, 2))} होते, जे जुळते.\nरकमेतून ${num(r * t)}% वजा करू नये — टक्केवारीने झालेली वाढ तितकीच टक्केवारी वजा करून मागे फिरवता येत नाही.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 8. A sum split into two parts lent at different rates
 * ------------------------------------------------------------------ */
const twoParts = {
  id: "si-two-parts",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const total of [3000, 4000, 6000, 8000, 10000, 12000]) {
      for (const r1 of [4, 5, 6]) {
        for (const r2 of [8, 9, 10, 12]) {
          for (const t of [2, 3]) out.push({ total, r1, r2, t });
        }
      }
    }
    return out;
  },
  make({ total, r1, r2, t }) {
    // Equal interest from both parts: x*r1 = (total - x)*r2
    const x = (total * r2) / (r1 + r2);
    if (!Number.isInteger(x)) return null;
    const interest = (x * r1 * t) / 100;
    if (!isClean(interest)) return null;

    const correct = inr(x);
    const distractors = [inr(total - x), inr(round(total / 2, 2)), inr(round(interest, 2))];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `A sum of ${inr(total)} is divided into two parts. One part is lent at ${num(r1)}% per annum and the other at ${num(r2)}% per annum simple interest. If the interest earned from both parts in ${num(t)} years is the same, find the part lent at ${num(r1)}%.`,
        explanation: `Let the part lent at ${num(r1)}% be x, so the other part is (${num(total)} − x).\nThe time is the same for both, so equal interest means the products (principal × rate) must be equal:\n  x × ${num(r1)} = (${num(total)} − x) × ${num(r2)}.\n${num(r1)}x = ${num(total * r2)} − ${num(r2)}x.\n${num(r1 + r2)}x = ${num(total * r2)}, so x = ${inr(x)}.\nCheck: ${inr(x)} at ${num(r1)}% for ${num(t)} years gives ${inr(round(interest, 2))}, and ${inr(total - x)} at ${num(r2)}% for ${num(t)} years gives ${inr(round(((total - x) * r2 * t) / 100, 2))} — equal, as required.\nThe LARGER part must be lent at the LOWER rate to keep the two interests equal, which is a quick way to check your answer.`,
      },
      mr: {
        text: `${inr(total)} ही रक्कम दोन भागांत विभागली आहे. एक भाग ${num(r1)}% वार्षिक दराने व दुसरा भाग ${num(r2)}% वार्षिक सरळव्याज दराने दिला आहे. ${num(t)} वर्षांत दोन्ही भागांचे व्याज समान असल्यास, ${num(r1)}% दराने दिलेला भाग किती?`,
        explanation: `${num(r1)}% दराने दिलेला भाग x धरा, म्हणजे दुसरा भाग (${num(total)} − x) होतो.\nदोन्हींची मुदत सारखीच असल्याने व्याज समान असण्यासाठी (मुद्दल × दर) हे गुणाकार समान असले पाहिजेत:\n  x × ${num(r1)} = (${num(total)} − x) × ${num(r2)}.\n${num(r1)}x = ${num(total * r2)} − ${num(r2)}x.\n${num(r1 + r2)}x = ${num(total * r2)}, म्हणून x = ${inr(x)}.\nपडताळणी: ${inr(x)} वर ${num(r1)}% दराने ${num(t)} वर्षांचे व्याज ${inr(round(interest, 2))} आणि ${inr(total - x)} वर ${num(r2)}% दराने ${inr(round(((total - x) * r2 * t) / 100, 2))} — दोन्ही समान.\nव्याज समान राहण्यासाठी मोठा भाग कमी दराने द्यावा लागतो, ही उत्तराची झटपट पडताळणी आहे.`,
      },
    };
  },
};

export const topicId = "interest";

export const archetypes = [
  siBasic,
  siFindRate,
  siMultiply,
  ciBasic,
  ciSiDifference,
  ciHalfYearly,
  ciFindPrincipal,
  twoParts,
];
