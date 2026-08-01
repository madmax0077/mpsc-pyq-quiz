/**
 * Generator: Data Interpretation.
 *
 * The whole data set is printed inside the question, so the validator can read
 * the table back out of the rendered text and recompute the answer for itself.
 * Splits are built from percentage shares of a round total, which keeps the
 * arithmetic clean the way a real DI set does.
 */

import { num, pct, round } from "../lib/util.mjs";

const KEYS = ["A", "B", "C", "D", "E"];

const SHARES = [
  [20, 15, 25, 18, 22],
  [24, 16, 20, 28, 12],
  [30, 10, 25, 15, 20],
  [18, 22, 20, 26, 14],
  [25, 30, 20, 15, 10],
  [12, 28, 20, 24, 16],
  [35, 15, 20, 10, 20],
  [22, 18, 26, 14, 20],
];

const TOTALS = [1000, 1500, 2000, 2500, 3000];

const CONTEXTS = [
  {
    en: "the number of candidates who appeared for a competitive examination from five centres",
    mr: "पाच केंद्रांवरून स्पर्धा परीक्षेस बसलेल्या उमेदवारांची संख्या",
    unitEn: "candidates",
    unitMr: "उमेदवार",
  },
  {
    en: "the number of books issued by five branches of a district library in a month",
    mr: "जिल्हा ग्रंथालयाच्या पाच शाखांतून एका महिन्यात दिलेल्या पुस्तकांची संख्या",
    unitEn: "books",
    unitMr: "पुस्तके",
  },
  {
    en: "the number of saplings planted by five gram panchayats during a plantation drive",
    mr: "वृक्षारोपण मोहिमेत पाच ग्रामपंचायतींनी लावलेल्या रोपांची संख्या",
    unitEn: "saplings",
    unitMr: "रोपे",
  },
  {
    en: "the number of litres of milk collected by five dairy centres in a day",
    mr: "पाच दूध संकलन केंद्रांनी एका दिवसात जमा केलेल्या दुधाची लिटरमधील संख्या",
    unitEn: "litres",
    unitMr: "लिटर",
  },
  {
    en: "the number of tickets sold at five counters of a state transport depot",
    mr: "राज्य परिवहन आगाराच्या पाच खिडक्यांवर विकल्या गेलेल्या तिकिटांची संख्या",
    unitEn: "tickets",
    unitMr: "तिकिटे",
  },
];

function dataset({ share, total, ctx }) {
  const shares = SHARES[share];
  const values = shares.map((p) => (total * p) / 100);
  if (values.some((v) => !Number.isInteger(v))) return null;
  const context = CONTEXTS[ctx];
  const listEn = KEYS.map((k, i) => `${k}: ${num(values[i])}`).join(", ");
  return { shares, values, total, context, listEn };
}

function preamble(d, lang) {
  return lang === "en"
    ? `The following figures show ${d.context.en} A, B, C, D and E. ${d.listEn}.`
    : `पुढील आकडेवारी A, B, C, D व E या पाच ठिकाणांसाठी ${d.context.mr} दर्शवते. ${d.listEn}.`;
}

const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));

/* ------------------------------------------------------------------ *
 * 1. Share of the total
 * ------------------------------------------------------------------ */
const shareOfTotal = {
  id: "di-share-of-total",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (let share = 0; share < SHARES.length; share += 1) {
      for (let t = 0; t < TOTALS.length; t += 1) {
        out.push({ share, total: TOTALS[t], ctx: (share + t) % CONTEXTS.length, pickIndex: (share + t) % 5 });
      }
    }
    return out;
  },
  make(params) {
    const d = dataset(params);
    if (!d) return null;
    const i = params.pickIndex;
    const p = d.shares[i];
    const correct = pct(p);
    const distractors = [pct(p + 5), pct(p - 4), pct(round((d.values[i] * 100) / (d.total - d.values[i]), 2))];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `${preamble(d, "en")}\nThe figure for ${KEYS[i]} is what percentage of the total for all five?`,
        explanation: `Add the whole row first — a share question is meaningless until you know what it is a share of.\nTotal = ${d.values.map(num).join(" + ")} = ${num(d.total)} ${d.context.unitEn}.\n${KEYS[i]} accounts for ${num(d.values[i])} of these.\nPercentage = (${num(d.values[i])} ÷ ${num(d.total)}) × 100 = ${num(p)}%.\nSo ${KEYS[i]} makes up ${num(p)}% of the total.\nDivide by the TOTAL, not by the rest of the row; dividing by ${num(d.total - d.values[i])} instead is the trap sitting in the options.`,
      },
      mr: {
        text: `${preamble(d, "mr")}\n${KEYS[i]} चा आकडा पाचही ठिकाणांच्या एकूण आकड्याच्या किती टक्के आहे?`,
        explanation: `प्रथम संपूर्ण ओळ बेरीज करा — कशाचा वाटा हे माहीत असल्याशिवाय टक्केवारीला अर्थ नाही.\nएकूण = ${d.values.map(num).join(" + ")} = ${num(d.total)} ${d.context.unitMr}.\nयांपैकी ${KEYS[i]} चा वाटा ${num(d.values[i])} आहे.\nटक्केवारी = (${num(d.values[i])} ÷ ${num(d.total)}) × 100 = ${num(p)}%.\nम्हणून एकूण आकड्याच्या ${num(p)}% इतका वाटा ${KEYS[i]} चा आहे.\nभागाकार एकूण संख्येने करा, उरलेल्या बेरजेने नाही; ${num(d.total - d.values[i])} ने भागणे हाच पर्यायांत ठेवलेला सापळा आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 2. Ratio of two entries
 * ------------------------------------------------------------------ */
const ratioOfTwo = {
  id: "di-ratio-of-two",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (let share = 0; share < SHARES.length; share += 1) {
      for (let t = 0; t < TOTALS.length; t += 1) {
        for (const [i, j] of [[0, 1], [2, 3], [1, 4], [0, 3]]) {
          out.push({ share, total: TOTALS[t], ctx: (share + t + i) % CONTEXTS.length, i, j });
        }
      }
    }
    return out;
  },
  make(params) {
    const d = dataset(params);
    if (!d) return null;
    const { i, j } = params;
    const a = d.values[i];
    const b = d.values[j];
    const g = gcd(a, b);
    const correct = `${num(a / g)} : ${num(b / g)}`;
    const distractors = [
      `${num(b / g)} : ${num(a / g)}`,
      `${num(a / g + 1)} : ${num(b / g)}`,
      `${num(a / g)} : ${num(b / g + 1)}`,
    ];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `${preamble(d, "en")}\nWhat is the ratio of the figure for ${KEYS[i]} to the figure for ${KEYS[j]}?`,
        explanation: `Write the two numbers down in the order the question names them, then cancel.\n${KEYS[i]} stands at ${num(a)} and ${KEYS[j]} at ${num(b)}, so the ratio starts as ${num(a)} : ${num(b)}.\nThe largest number dividing both is ${num(g)}.\nDividing each side by ${num(g)}: ${num(a)} ÷ ${num(g)} = ${num(a / g)} and ${num(b)} ÷ ${num(g)} = ${num(b / g)}.\nSo the ratio in its lowest terms is ${correct}.\nOrder matters in a ratio — writing it the other way round gives ${num(b / g)} : ${num(a / g)}, which is a different answer and is offered as an option.`,
      },
      mr: {
        text: `${preamble(d, "mr")}\n${KEYS[i]} चा आकडा व ${KEYS[j]} चा आकडा यांचे गुणोत्तर किती?`,
        explanation: `प्रश्नात ज्या क्रमाने नावे आली आहेत त्याच क्रमाने दोन्ही संख्या लिहा आणि मग सोपे करा.\n${KEYS[i]} = ${num(a)} व ${KEYS[j]} = ${num(b)}, म्हणून गुणोत्तर सुरुवातीला ${num(a)} : ${num(b)} असे येते.\nदोन्हींना भाग जाणारी सर्वात मोठी संख्या ${num(g)} आहे.\nदोन्ही बाजूंना ${num(g)} ने भागल्यास: ${num(a)} ÷ ${num(g)} = ${num(a / g)} व ${num(b)} ÷ ${num(g)} = ${num(b / g)}.\nम्हणून लघुतम रूपातील गुणोत्तर ${correct} आहे.\nगुणोत्तरात क्रम महत्त्वाचा असतो — उलट लिहिल्यास ${num(b / g)} : ${num(a / g)} येते, जे वेगळे उत्तर असून पर्यायांत ठेवलेले आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 3. Average across the five
 * ------------------------------------------------------------------ */
const averageOfRow = {
  id: "di-average",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (let share = 0; share < SHARES.length; share += 1) {
      for (let t = 0; t < TOTALS.length; t += 1) {
        out.push({ share, total: TOTALS[t], ctx: (share + t + 2) % CONTEXTS.length });
      }
    }
    return out;
  },
  make(params) {
    const d = dataset(params);
    if (!d) return null;
    const avg = d.total / 5;
    const correct = num(avg);
    const distractors = [num(d.total / 4), num(avg + 50), num(round(d.total / 6, 2))];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `${preamble(d, "en")}\nWhat is the average of the five figures?`,
        explanation: `An average needs the full sum and the correct count; both are easy to get wrong in a hurry.\nSum = ${d.values.map(num).join(" + ")} = ${num(d.total)}.\nThere are 5 entries, so divide by 5.\nAverage = ${num(d.total)} ÷ 5 = ${num(avg)}.\nSo the average works out to ${num(avg)} ${d.context.unitEn}.\nCount the entries rather than assuming — dividing ${num(d.total)} by 4 gives ${num(d.total / 4)}, which is sitting in the options for exactly that slip.`,
      },
      mr: {
        text: `${preamble(d, "mr")}\nया पाच आकड्यांची सरासरी किती?`,
        explanation: `सरासरीसाठी पूर्ण बेरीज व अचूक संख्या दोन्ही लागतात; घाईत दोन्हींमध्ये चूक होते.\nबेरीज = ${d.values.map(num).join(" + ")} = ${num(d.total)}.\nनोंदी 5 आहेत, म्हणून 5 ने भागा.\nसरासरी = ${num(d.total)} ÷ 5 = ${num(avg)}.\nम्हणून सरासरी ${num(avg)} ${d.context.unitMr} येते.\nनोंदी गृहीत न धरता मोजा — ${num(d.total)} ला 4 ने भागल्यास ${num(d.total / 4)} येते आणि नेमक्या याच चुकीसाठी तो पर्याय ठेवलेला आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 4. Gap between the biggest and the smallest
 * ------------------------------------------------------------------ */
const spread = {
  id: "di-highest-minus-lowest",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (let share = 0; share < SHARES.length; share += 1) {
      for (let t = 0; t < TOTALS.length; t += 1) {
        out.push({ share, total: TOTALS[t], ctx: (share + t + 3) % CONTEXTS.length });
      }
    }
    return out;
  },
  make(params) {
    const d = dataset(params);
    if (!d) return null;
    const hi = Math.max(...d.values);
    const lo = Math.min(...d.values);
    const gap = hi - lo;
    if (gap === 0) return null;
    const correct = num(gap);
    const distractors = [num(hi + lo), num(gap / 2), num(gap + 100)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    const hiKey = KEYS[d.values.indexOf(hi)];
    const loKey = KEYS[d.values.indexOf(lo)];

    return {
      correct,
      distractors,
      en: {
        text: `${preamble(d, "en")}\nBy how much does the highest figure exceed the lowest?`,
        explanation: `Scan the whole row before doing any arithmetic; the largest and smallest values are rarely at the ends.\nThe highest figure is ${num(hi)}, at ${hiKey}.\nThe lowest is ${num(lo)}, at ${loKey}.\nDifference = ${num(hi)} − ${num(lo)} = ${num(gap)}.\nSo the highest exceeds the lowest by ${num(gap)} ${d.context.unitEn}.\nThe question asks for a difference, not a total; adding the two gives ${num(hi + lo)} and that option is there to catch a careless read.`,
      },
      mr: {
        text: `${preamble(d, "mr")}\nसर्वात मोठा आकडा सर्वात लहान आकड्यापेक्षा किती जास्त आहे?`,
        explanation: `कोणतीही आकडेमोड करण्यापूर्वी संपूर्ण ओळ नजरेखालून घाला; सर्वात मोठे व सर्वात लहान मूल्य क्वचितच टोकांना असते.\nसर्वात मोठा आकडा ${num(hi)} असून तो ${hiKey} चा आहे.\nसर्वात लहान आकडा ${num(lo)} असून तो ${loKey} चा आहे.\nफरक = ${num(hi)} − ${num(lo)} = ${num(gap)}.\nम्हणून सर्वात मोठा आकडा सर्वात लहानापेक्षा ${num(gap)} ${d.context.unitMr} जास्त आहे.\nप्रश्नात फरक विचारला आहे, बेरीज नाही; बेरीज केल्यास ${num(hi + lo)} येते आणि घाईत वाचणाऱ्यांसाठी तो पर्याय ठेवलेला आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 5. How many are above the average
 * ------------------------------------------------------------------ */
const aboveAverage = {
  id: "di-above-average",
  difficulty: "hard",
  cases() {
    const out = [];
    for (let share = 0; share < SHARES.length; share += 1) {
      for (let t = 0; t < TOTALS.length; t += 1) {
        out.push({ share, total: TOTALS[t], ctx: (share + t + 4) % CONTEXTS.length });
      }
    }
    return out;
  },
  make(params) {
    const d = dataset(params);
    if (!d) return null;
    const avg = d.total / 5;
    const count = d.values.filter((v) => v > avg).length;
    if (count === 0 || count === 5) return null;
    const correct = num(count);
    const distractors = [1, 2, 3, 4].filter((n) => n !== count).slice(0, 3).map(num);
    if (new Set([correct, ...distractors]).size !== 4) return null;

    const above = KEYS.filter((_, i) => d.values[i] > avg).join(", ");

    return {
      correct,
      distractors,
      en: {
        text: `${preamble(d, "en")}\nHow many of the five figures are above the average of all five?`,
        explanation: `Work out the average once, then compare each entry against it — do not judge by eye.\nSum = ${num(d.total)}, so the average is ${num(d.total)} ÷ 5 = ${num(avg)}.\nComparing each figure with ${num(avg)}: ${KEYS.map((k, i) => `${k} ${num(d.values[i])}`).join(", ")}.\nThe ones standing above ${num(avg)} are ${above}.\nThat makes ${num(count)} figures above the average.\nEntries exactly equal to the average are not "above" it, which is the distinction these questions are usually testing.`,
      },
      mr: {
        text: `${preamble(d, "mr")}\nपाचपैकी किती आकडे सर्वांच्या सरासरीपेक्षा जास्त आहेत?`,
        explanation: `सरासरी एकदाच काढा आणि मग प्रत्येक नोंद तिच्याशी ताडून पाहा — नुसत्या नजरेने ठरवू नका.\nबेरीज = ${num(d.total)}, म्हणून सरासरी = ${num(d.total)} ÷ 5 = ${num(avg)}.\nप्रत्येक आकड्याची ${num(avg)} शी तुलना: ${KEYS.map((k, i) => `${k} ${num(d.values[i])}`).join(", ")}.\n${num(avg)} पेक्षा जास्त असलेले आकडे ${above} हे आहेत.\nम्हणजे सरासरीपेक्षा जास्त असलेले ${num(count)} आकडे आहेत.\nसरासरीएवढा असलेला आकडा "जास्त" धरला जात नाही, आणि नेमका हाच फरक अशा प्रश्नांत तपासला जातो.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 6. Central angle in a pie chart
 * ------------------------------------------------------------------ */
const pieAngle = {
  id: "di-pie-angle",
  difficulty: "hard",
  cases() {
    const out = [];
    for (let share = 0; share < SHARES.length; share += 1) {
      for (let t = 0; t < TOTALS.length; t += 1) {
        out.push({ share, total: TOTALS[t], ctx: (share + t) % CONTEXTS.length, pickIndex: (share + t + 2) % 5 });
      }
    }
    return out;
  },
  make(params) {
    const d = dataset(params);
    if (!d) return null;
    const i = params.pickIndex;
    const p = d.shares[i];
    const angle = round((p * 360) / 100, 2);
    const correct = num(angle);
    const distractors = [num(p), num(round(angle / 2, 2)), num(round(360 - angle, 2))];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `${preamble(d, "en")}\nIf these figures are shown as a pie chart, what is the central angle, in degrees, of the sector for ${KEYS[i]}?`,
        explanation: `A pie chart turns shares of the total into shares of one full turn, so find the share first.\nTotal = ${num(d.total)}, and ${KEYS[i]} contributes ${num(d.values[i])}.\nShare = (${num(d.values[i])} ÷ ${num(d.total)}) × 100 = ${num(p)}%.\nA whole circle is 360°, so multiply that share by 360: ${num(p)}% of 360 = (${num(p)} ÷ 100) × 360 = ${num(angle)}.\nSo the sector for ${KEYS[i]} has a central angle of ${num(angle)} degrees.\nA percentage and an angle are different quantities — quoting ${num(p)} as the angle is the standard mistake, and it is in the options.`,
      },
      mr: {
        text: `${preamble(d, "mr")}\nही आकडेवारी वृत्तालेखाने (पाय चार्ट) दाखवल्यास ${KEYS[i]} च्या भागाचा मध्यवर्ती कोन किती अंश असेल?`,
        explanation: `वृत्तालेख एकूण संख्येतील वाटा पूर्ण वर्तुळातील वाट्यात बदलतो, म्हणून आधी वाटा काढा.\nएकूण = ${num(d.total)} आणि ${KEYS[i]} चा वाटा ${num(d.values[i])} आहे.\nवाटा = (${num(d.values[i])} ÷ ${num(d.total)}) × 100 = ${num(p)}%.\nपूर्ण वर्तुळ 360° असते, म्हणून हा वाटा 360 ने गुणा: 360 च्या ${num(p)}% = (${num(p)} ÷ 100) × 360 = ${num(angle)}.\nम्हणून ${KEYS[i]} च्या भागाचा मध्यवर्ती कोन ${num(angle)} अंश आहे.\nटक्केवारी व कोन या वेगळ्या राशी आहेत — ${num(p)} हाच कोन सांगणे ही नेहमीची चूक असून तो पर्याय दिलेला आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 7. Two entries taken together
 * ------------------------------------------------------------------ */
const twoTogether = {
  id: "di-two-together",
  difficulty: "hard",
  cases() {
    const out = [];
    for (let share = 0; share < SHARES.length; share += 1) {
      for (let t = 0; t < TOTALS.length; t += 1) {
        for (const [i, j] of [[0, 2], [1, 3], [3, 4]]) {
          out.push({ share, total: TOTALS[t], ctx: (share + t + i) % CONTEXTS.length, i, j });
        }
      }
    }
    return out;
  },
  make(params) {
    const d = dataset(params);
    if (!d) return null;
    const { i, j } = params;
    const sum = d.values[i] + d.values[j];
    const p = d.shares[i] + d.shares[j];
    const correct = pct(p);
    const distractors = [pct(d.shares[i]), pct(100 - p), pct(p + 6)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `${preamble(d, "en")}\nThe figures for ${KEYS[i]} and ${KEYS[j]} taken together are what percentage of the total for all five?`,
        explanation: `Combine the two entries before dividing; percentages of separate parts can be added, but only once both refer to the same total.\n${KEYS[i]} is ${num(d.values[i])} and ${KEYS[j]} is ${num(d.values[j])}, so together they come to ${num(sum)}.\nThe total for all five is ${num(d.total)}.\nPercentage = (${num(sum)} ÷ ${num(d.total)}) × 100 = ${num(p)}%.\nSo the two together account for ${num(p)}% of the total.\nThe remaining three centres then account for ${num(100 - p)}%, and mixing those two figures up is what the wrong options rely on.`,
      },
      mr: {
        text: `${preamble(d, "mr")}\n${KEYS[i]} व ${KEYS[j]} यांचे आकडे मिळून पाचही ठिकाणांच्या एकूण आकड्याच्या किती टक्के होतात?`,
        explanation: `भागाकाराआधी दोन्ही नोंदी एकत्र करा; वेगवेगळ्या भागांच्या टक्केवारींची बेरीज करता येते, पण दोन्ही एकाच एकूण संख्येवर आधारित असतील तरच.\n${KEYS[i]} = ${num(d.values[i])} व ${KEYS[j]} = ${num(d.values[j])}, म्हणून दोन्ही मिळून ${num(sum)} होतात.\nपाचही ठिकाणांची एकूण संख्या ${num(d.total)} आहे.\nटक्केवारी = (${num(sum)} ÷ ${num(d.total)}) × 100 = ${num(p)}%.\nम्हणून दोघे मिळून एकूण संख्येच्या ${num(p)}% भरतात.\nउरलेली तीन ठिकाणे मग ${num(100 - p)}% भरतात, आणि या दोन आकड्यांची गल्लत होणे यावरच चुकीचे पर्याय अवलंबून आहेत.`,
      },
    };
  },
};

export const topicId = "data-interpretation";

export const archetypes = [
  shareOfTotal,
  ratioOfTwo,
  averageOfRow,
  spread,
  aboveAverage,
  pieAngle,
  twoTogether,
];
