/**
 * Generator: Time & Work, including pipes and cisterns.
 *
 * Every option is a bare number; the unit (days, hours, rupees) is stated in
 * the question so that options stay language-neutral.
 */

import { inr, isClean, num, round } from "../lib/util.mjs";
import { gcd } from "../lib/math.mjs";

/* ------------------------------------------------------------------ *
 * 1. Two people working together
 * ------------------------------------------------------------------ */
const togetherTwo = {
  id: "work-together-two",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const a of [6, 8, 10, 12, 15, 16, 18, 20, 24, 30]) {
      for (const b of [4, 6, 9, 12, 15, 20, 24, 30, 36]) {
        if (a !== b) out.push({ a, b });
      }
    }
    return out;
  },
  make({ a, b }) {
    const t = (a * b) / (a + b);
    if (!isClean(t)) return null;
    const lcmWork = (a * b) / gcd(a, b);

    const correct = num(round(t, 2));
    const distractors = [num(round((a + b) / 2, 2)), num(a + b), num(round(Math.abs(a - b), 2))];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `A can complete a piece of work in ${num(a)} days and B can complete the same work in ${num(b)} days. Working together, in how many days will they complete the work?`,
        explanation: `Never add or average the days — add the daily WORK instead.\nTake the total work as ${num(lcmWork)} units (the LCM of ${num(a)} and ${num(b)}).\nA does ${num(lcmWork)} ÷ ${num(a)} = ${num(lcmWork / a)} units a day.\nB does ${num(lcmWork)} ÷ ${num(b)} = ${num(lcmWork / b)} units a day.\nTogether they do ${num(lcmWork / a)} + ${num(lcmWork / b)} = ${num(lcmWork / a + lcmWork / b)} units a day.\nTime = ${num(lcmWork)} ÷ ${num(lcmWork / a + lcmWork / b)} = ${num(round(t, 2))} days.\nSanity check: the answer must be smaller than ${num(Math.min(a, b))}, because two people are faster than the quicker of them alone.`,
      },
      mr: {
        text: `अ हे काम ${num(a)} दिवसांत पूर्ण करतो आणि ब तेच काम ${num(b)} दिवसांत पूर्ण करतो. दोघे एकत्र काम केल्यास ते काम किती दिवसांत पूर्ण होईल?`,
        explanation: `दिवसांची बेरीज किंवा सरासरी कधीही घेऊ नये — रोजच्या कामाची बेरीज करावी.\nएकूण काम ${num(lcmWork)} एकके धरा (${num(a)} व ${num(b)} यांचा लसावि).\nअ रोज ${num(lcmWork)} ÷ ${num(a)} = ${num(lcmWork / a)} एकके करतो.\nब रोज ${num(lcmWork)} ÷ ${num(b)} = ${num(lcmWork / b)} एकके करतो.\nदोघे मिळून रोज ${num(lcmWork / a)} + ${num(lcmWork / b)} = ${num(lcmWork / a + lcmWork / b)} एकके करतात.\nवेळ = ${num(lcmWork)} ÷ ${num(lcmWork / a + lcmWork / b)} = ${num(round(t, 2))} दिवस.\nपडताळणी: उत्तर ${num(Math.min(a, b))} पेक्षा कमीच असले पाहिजे, कारण दोघे मिळून एकट्यापेक्षा वेगाने काम करतात.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 2. Third worker from a pair
 * ------------------------------------------------------------------ */
const thirdWorker = {
  id: "work-find-second",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const a of [10, 12, 15, 18, 20, 24, 30, 36]) {
      for (const t of [4, 5, 6, 8, 9, 10, 12]) {
        if (t < a) out.push({ a, t });
      }
    }
    return out;
  },
  make({ a, t }) {
    const b = (a * t) / (a - t);
    if (!isClean(b) || b <= 0) return null;
    const lcmWork = a * t;

    const correct = num(round(b, 2));
    const distractors = [num(a - t), num(a + t), num(round(b + t, 2))];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `A and B together can complete a piece of work in ${num(t)} days. A alone can complete it in ${num(a)} days. In how many days can B alone complete the work?`,
        explanation: `Rates subtract just as they add. B's rate = (combined rate) − (A's rate).\nCombined: 1/${num(t)} of the work per day.\nA alone: 1/${num(a)} of the work per day.\nB's rate = 1/${num(t)} − 1/${num(a)} = (${num(a)} − ${num(t)}) / ${num(a * t)} = ${num(a - t)}/${num(lcmWork)}.\nSo B alone takes ${num(lcmWork)} ÷ ${num(a - t)} = ${num(round(b, 2))} days.\nSubtracting the days instead of the rates would give ${num(a - t)} days, which is the standard error — days are not additive, rates are.`,
      },
      mr: {
        text: `अ व ब मिळून एक काम ${num(t)} दिवसांत पूर्ण करतात. अ एकटा तेच काम ${num(a)} दिवसांत पूर्ण करतो. तर ब एकटा ते काम किती दिवसांत पूर्ण करेल?`,
        explanation: `जशी कामाच्या गतीची बेरीज होते, तशीच वजाबाकीही होते. ब ची गती = (एकत्रित गती) − (अ ची गती).\nएकत्रित: रोज कामाचा 1/${num(t)} भाग.\nअ एकटा: रोज कामाचा 1/${num(a)} भाग.\nब ची गती = 1/${num(t)} − 1/${num(a)} = (${num(a)} − ${num(t)}) / ${num(a * t)} = ${num(a - t)}/${num(lcmWork)}.\nम्हणून ब एकटा ${num(lcmWork)} ÷ ${num(a - t)} = ${num(round(b, 2))} दिवस घेतो.\nगतींऐवजी दिवस वजा केल्यास ${num(a - t)} दिवस असे चुकीचे उत्तर येते — दिवसांची बेरीज-वजाबाकी होत नाही, गतीची होते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 3. One leaves partway through
 * ------------------------------------------------------------------ */
const oneLeaves = {
  id: "work-one-leaves",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const a of [12, 15, 18, 20, 24, 30]) {
      for (const b of [10, 12, 16, 20, 24, 36]) {
        for (const n of [3, 4, 5, 6]) {
          if (a !== b) out.push({ a, b, n });
        }
      }
    }
    return out;
  },
  make({ a, b, n }) {
    const doneTogether = n * (1 / a + 1 / b);
    if (doneTogether >= 1) return null;
    const remaining = 1 - doneTogether;
    const more = remaining * b;
    if (!isClean(more) || more <= 0) return null;
    const lcmWork = (a * b) / gcd(a, b);

    const correct = num(round(more, 2));
    const distractors = [num(round(remaining * a, 2)), num(b - n), num(round(more + n, 2))];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `A can do a piece of work in ${num(a)} days and B can do it in ${num(b)} days. They begin together, but A leaves after ${num(n)} days. In how many more days will B finish the remaining work?`,
        explanation: `Take the total work as ${num(lcmWork)} units.\nA does ${num(lcmWork / a)} units a day and B does ${num(lcmWork / b)} units a day, so together they do ${num(lcmWork / a + lcmWork / b)} units a day.\nIn ${num(n)} days together they finish ${num(n)} × ${num(lcmWork / a + lcmWork / b)} = ${num(n * (lcmWork / a + lcmWork / b))} units.\nRemaining work = ${num(lcmWork)} − ${num(n * (lcmWork / a + lcmWork / b))} = ${num(round(remaining * lcmWork, 2))} units.\nB alone clears this at ${num(lcmWork / b)} units a day, needing ${num(round(remaining * lcmWork, 2))} ÷ ${num(lcmWork / b)} = ${num(round(more, 2))} more days.\nThe question asks for the ADDITIONAL days, not the total — the total elapsed time would be ${num(round(n + more, 2))} days.`,
      },
      mr: {
        text: `अ एक काम ${num(a)} दिवसांत करतो व ब तेच काम ${num(b)} दिवसांत करतो. दोघे एकत्र काम सुरू करतात, पण ${num(n)} दिवसांनंतर अ काम सोडून जातो. तर उरलेले काम ब आणखी किती दिवसांत पूर्ण करेल?`,
        explanation: `एकूण काम ${num(lcmWork)} एकके धरा.\nअ रोज ${num(lcmWork / a)} एकके व ब रोज ${num(lcmWork / b)} एकके करतो, म्हणून दोघे मिळून रोज ${num(lcmWork / a + lcmWork / b)} एकके करतात.\n${num(n)} दिवसांत ते ${num(n)} × ${num(lcmWork / a + lcmWork / b)} = ${num(n * (lcmWork / a + lcmWork / b))} एकके काम करतात.\nउरलेले काम = ${num(lcmWork)} − ${num(n * (lcmWork / a + lcmWork / b))} = ${num(round(remaining * lcmWork, 2))} एकके.\nब एकटा रोज ${num(lcmWork / b)} एकके करतो, म्हणून त्याला ${num(round(remaining * lcmWork, 2))} ÷ ${num(lcmWork / b)} = ${num(round(more, 2))} दिवस लागतील.\nप्रश्नात आणखी किती दिवस असे विचारले आहे, एकूण किती नाही — एकूण वेळ ${num(round(n + more, 2))} दिवस झाला असता.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 4. Efficiency stated as a percentage
 * ------------------------------------------------------------------ */
const efficiencyPercent = {
  id: "work-efficiency-percent",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const x of [20, 25, 50, 60, 100, 150]) {
      for (const b of [12, 15, 18, 20, 24, 25, 30, 36, 40, 50]) out.push({ x, b });
    }
    return out;
  },
  make({ x, b }) {
    const aDays = (b * 100) / (100 + x);
    if (!isClean(aDays)) return null;

    const correct = num(round(aDays, 2));
    const distractors = [num(round((b * (100 - x)) / 100, 2)), num(round(b - x, 2)), num(round((b * (100 + x)) / 100, 2))];
    if (new Set([correct, ...distractors]).size !== 4) return null;
    if (distractors.some((d) => parseFloat(d) <= 0)) return null;

    return {
      correct,
      distractors,
      en: {
        text: `A is ${num(x)}% more efficient than B. If B alone can complete a piece of work in ${num(b)} days, in how many days can A alone complete it?`,
        explanation: `Efficiency and time taken are inversely proportional — the more efficient worker takes proportionally less time.\nIf B's efficiency is 100, then A's efficiency is 100 + ${num(x)} = ${num(100 + x)}.\nSo efficiency ratio A : B = ${num(100 + x)} : 100, which means the time ratio A : B = 100 : ${num(100 + x)}.\nA's time = ${num(b)} × 100/${num(100 + x)} = ${num(round(aDays, 2))} days.\nDo NOT reduce B's ${num(b)} days by ${num(x)}% — that would give ${num(round((b * (100 - x)) / 100, 2))} days. A rise of ${num(x)}% in efficiency is not a fall of ${num(x)}% in time.`,
      },
      mr: {
        text: `अ हा ब पेक्षा ${num(x)}% अधिक कार्यक्षम आहे. ब एकटा एक काम ${num(b)} दिवसांत पूर्ण करत असेल, तर अ एकटा ते काम किती दिवसांत पूर्ण करेल?`,
        explanation: `कार्यक्षमता व लागणारा वेळ हे व्यस्त प्रमाणात असतात — जास्त कार्यक्षम व्यक्तीला त्या प्रमाणात कमी वेळ लागतो.\nब ची कार्यक्षमता 100 धरल्यास अ ची कार्यक्षमता 100 + ${num(x)} = ${num(100 + x)}.\nम्हणून कार्यक्षमतेचे गुणोत्तर अ : ब = ${num(100 + x)} : 100, आणि वेळेचे गुणोत्तर अ : ब = 100 : ${num(100 + x)}.\nअ चा वेळ = ${num(b)} × 100/${num(100 + x)} = ${num(round(aDays, 2))} दिवस.\nब चे ${num(b)} दिवस ${num(x)}% ने कमी करू नयेत — त्यातून ${num(round((b * (100 - x)) / 100, 2))} दिवस असे चुकीचे उत्तर येते. कार्यक्षमतेत ${num(x)}% वाढ म्हणजे वेळेत ${num(x)}% घट नव्हे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 5. Two filling pipes and one emptying pipe
 * ------------------------------------------------------------------ */
const pipesNet = {
  id: "pipes-fill-empty",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const a of [10, 12, 15, 20, 24]) {
      for (const b of [15, 20, 24, 30, 36]) {
        for (const c of [20, 30, 40, 60] ) out.push({ a, b, c });
      }
    }
    return out;
  },
  make({ a, b, c }) {
    const rate = 1 / a + 1 / b - 1 / c;
    if (rate <= 0) return null;
    const t = 1 / rate;
    if (!isClean(t)) return null;

    const correct = num(round(t, 2));
    const distractors = [
      num(round(1 / (1 / a + 1 / b), 2)),
      num(round(a + b - c, 2)),
      num(round(1 / (1 / a + 1 / b + 1 / c), 2)),
    ];
    if (new Set([correct, ...distractors]).size !== 4) return null;
    if (distractors.some((d) => parseFloat(d) <= 0)) return null;

    return {
      correct,
      distractors,
      en: {
        text: `Two pipes can fill a tank in ${num(a)} hours and ${num(b)} hours respectively, while a third pipe can empty the full tank in ${num(c)} hours. If all three pipes are opened together, in how many hours will the tank be filled?`,
        explanation: `Work in "tank per hour" and give the emptying pipe a negative sign.\nFirst pipe: +1/${num(a)} of the tank per hour.\nSecond pipe: +1/${num(b)} per hour.\nWaste pipe: −1/${num(c)} per hour.\nNet rate = 1/${num(a)} + 1/${num(b)} − 1/${num(c)} = ${num(round(rate, 5))} of the tank per hour.\nTime = 1 ÷ ${num(round(rate, 5))} = ${num(round(t, 2))} hours.\nIgnoring the outlet gives ${num(round(1 / (1 / a + 1 / b), 2))} hours. Also note that if the emptying rate were the larger one, the tank would never fill at all.`,
      },
      mr: {
        text: `दोन नळ एक टाकी अनुक्रमे ${num(a)} तास व ${num(b)} तासांत भरतात, तर तिसरा नळ भरलेली टाकी ${num(c)} तासांत रिकामी करतो. तिन्ही नळ एकाच वेळी उघडल्यास टाकी किती तासांत भरेल?`,
        explanation: `"प्रति तास टाकीचा किती भाग" या भाषेत काम करा आणि रिकाम्या करणाऱ्या नळाला ऋण चिन्ह द्या.\nपहिला नळ: दर तासाला +1/${num(a)} टाकी.\nदुसरा नळ: दर तासाला +1/${num(b)}.\nरिकामा करणारा नळ: दर तासाला −1/${num(c)}.\nनिव्वळ गती = 1/${num(a)} + 1/${num(b)} − 1/${num(c)} = दर तासाला टाकीचा ${num(round(rate, 5))} भाग.\nवेळ = 1 ÷ ${num(round(rate, 5))} = ${num(round(t, 2))} तास.\nरिकामा करणारा नळ विचारात न घेतल्यास ${num(round(1 / (1 / a + 1 / b), 2))} तास येतात. तसेच रिकामे करण्याची गती जास्त असती तर टाकी कधीच भरली नसती.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 6. Cistern with a leak
 * ------------------------------------------------------------------ */
const leak = {
  id: "pipes-leak",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const a of [3, 4, 5, 6, 8, 9, 10, 12]) {
      for (const extra of [0.5, 1, 1.5, 2, 3]) out.push({ a, extra });
    }
    return out;
  },
  make({ a, extra }) {
    const b = a + extra;
    const t = (a * b) / (b - a);
    if (!isClean(t)) return null;

    const correct = num(round(t, 2));
    const distractors = [num(round(a * b, 2)), num(round(b - a, 2)), num(round(a + b, 2))];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `A pipe can fill a cistern in ${num(a)} hours, but because of a leak in the bottom it actually takes ${num(b)} hours to fill. In how many hours can the leak alone empty the full cistern?`,
        explanation: `Filling rate without the leak = 1/${num(a)} of the cistern per hour.\nActual filling rate with the leak = 1/${num(b)} per hour.\nThe difference is what the leak drains away: 1/${num(a)} − 1/${num(b)} = (${num(b)} − ${num(a)}) / ${num(round(a * b, 2))} = ${num(round(1 / a - 1 / b, 5))} per hour.\nSo the leak alone empties the cistern in 1 ÷ ${num(round(1 / a - 1 / b, 5))} = ${num(round(t, 2))} hours.\nThe leak's time is always LONGER than the filling time — if it were shorter the cistern could never fill, so that is a quick sanity check.`,
      },
      mr: {
        text: `एक नळ एक हौद ${num(a)} तासांत भरतो, पण तळाला गळती असल्यामुळे तो प्रत्यक्षात ${num(b)} तासांत भरतो. तर एकटी गळती भरलेला हौद किती तासांत रिकामा करेल?`,
        explanation: `गळतीशिवाय भरण्याची गती = दर तासाला हौदाचा 1/${num(a)} भाग.\nगळतीसह प्रत्यक्ष भरण्याची गती = दर तासाला 1/${num(b)} भाग.\nया दोहोंतील फरक म्हणजे गळतीने वाहून जाणारे पाणी: 1/${num(a)} − 1/${num(b)} = (${num(b)} − ${num(a)}) / ${num(round(a * b, 2))} = दर तासाला ${num(round(1 / a - 1 / b, 5))} भाग.\nम्हणून एकटी गळती हौद 1 ÷ ${num(round(1 / a - 1 / b, 5))} = ${num(round(t, 2))} तासांत रिकामा करते.\nगळतीचा वेळ नेहमी भरण्याच्या वेळेपेक्षा जास्तच असतो — कमी असता तर हौद कधीच भरला नसता, ही झटपट पडताळणी आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 7. Men, days and hours
 * ------------------------------------------------------------------ */
const menDaysHours = {
  id: "men-days-hours",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const m1 of [12, 15, 16, 18, 20, 24]) {
      for (const d1 of [8, 10, 12, 15, 16]) {
        for (const h1 of [6, 8, 9]) {
          for (const m2 of [10, 12, 16, 20, 24, 30]) {
            for (const h2 of [6, 8, 10]) {
              if (m1 !== m2 || h1 !== h2) out.push({ m1, d1, h1, m2, h2 });
            }
          }
        }
      }
    }
    return out;
  },
  make({ m1, d1, h1, m2, h2 }) {
    const d2 = (m1 * d1 * h1) / (m2 * h2);
    if (!isClean(d2) || d2 <= 0) return null;

    const correct = num(round(d2, 2));
    const distractors = [
      num(round((m1 * d1) / m2, 2)),
      num(round((d1 * h1) / h2, 2)),
      num(round((m2 * d1 * h2) / (m1 * h1), 2)),
    ];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `If ${num(m1)} men working ${num(h1)} hours a day can complete a piece of work in ${num(d1)} days, in how many days can ${num(m2)} men working ${num(h2)} hours a day complete the same work?`,
        explanation: `The total labour required is fixed, so men × days × hours stays constant:\n${num(m1)} × ${num(d1)} × ${num(h1)} = ${num(m2)} × d × ${num(h2)}.\nLeft side = ${num(m1 * d1 * h1)} man-hours.\nRight side = ${num(m2 * h2)}d.\nd = ${num(m1 * d1 * h1)} ÷ ${num(m2 * h2)} = ${num(round(d2, 2))} days.\nMore men or longer hours must REDUCE the days — check the direction of your answer before moving on, since flipping the fraction is the commonest slip here.`,
      },
      mr: {
        text: `${num(m1)} माणसे रोज ${num(h1)} तास काम करून एक काम ${num(d1)} दिवसांत पूर्ण करतात. तर ${num(m2)} माणसे रोज ${num(h2)} तास काम करून तेच काम किती दिवसांत पूर्ण करतील?`,
        explanation: `एकूण लागणारे श्रम ठरलेले असतात, म्हणून माणसे × दिवस × तास हा गुणाकार स्थिर राहतो:\n${num(m1)} × ${num(d1)} × ${num(h1)} = ${num(m2)} × d × ${num(h2)}.\nडावी बाजू = ${num(m1 * d1 * h1)} मनुष्य-तास.\nउजवी बाजू = ${num(m2 * h2)}d.\nd = ${num(m1 * d1 * h1)} ÷ ${num(m2 * h2)} = ${num(round(d2, 2))} दिवस.\nजास्त माणसे किंवा जास्त तास असल्यास दिवस कमीच झाले पाहिजेत — उत्तराची दिशा तपासा, कारण अपूर्णांक उलटा घेणे ही येथील सर्वात सामान्य चूक आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 8. Sharing wages in the ratio of work done
 * ------------------------------------------------------------------ */
const wagesShare = {
  id: "work-wages-share",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const a of [6, 8, 10, 12, 15, 20]) {
      for (const b of [12, 15, 20, 24, 30]) {
        for (const w of [3000, 4500, 6000, 7200, 9000]) {
          if (a !== b) out.push({ a, b, w });
        }
      }
    }
    return out;
  },
  make({ a, b, w }) {
    const share = (w * (1 / a)) / (1 / a + 1 / b);
    if (!isClean(share)) return null;
    const rb = a;
    const ra = b;
    const g = gcd(ra, rb);

    const correct = inr(round(share, 2));
    const distractors = [inr(round(w - share, 2)), inr(round(w / 2, 2)), inr(round((w * a) / (a + b), 2))];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `A can do a piece of work in ${num(a)} days and B can do it in ${num(b)} days. They work together and complete it, receiving ${inr(w)} in all. What is A's share of the wages, in rupees?`,
        explanation: `Wages are divided in the ratio of the WORK done, which is the ratio of the daily rates — not the ratio of the days.\nA's rate = 1/${num(a)}, B's rate = 1/${num(b)}.\nRatio A : B = 1/${num(a)} : 1/${num(b)} = ${num(b)} : ${num(a)} = ${num(ra / g)} : ${num(rb / g)}.\nTotal parts = ${num(ra / g + rb / g)}.\nA's share = ${inr(w)} × ${num(ra / g)}/${num(ra / g + rb / g)} = ${inr(round(share, 2))}.\nNotice the inversion: the FASTER worker earns more, so the ratio of wages is the reverse of the ratio of days.`,
      },
      mr: {
        text: `अ एक काम ${num(a)} दिवसांत करतो व ब तेच काम ${num(b)} दिवसांत करतो. दोघे एकत्र काम पूर्ण करतात आणि त्यांना एकूण ${inr(w)} मजुरी मिळते. तर अ चा मजुरीतील वाटा किती रुपये?`,
        explanation: `मजुरी ही केलेल्या कामाच्या प्रमाणात वाटली जाते, म्हणजे रोजच्या गतीच्या गुणोत्तरात — दिवसांच्या गुणोत्तरात नाही.\nअ ची गती = 1/${num(a)}, ब ची गती = 1/${num(b)}.\nगुणोत्तर अ : ब = 1/${num(a)} : 1/${num(b)} = ${num(b)} : ${num(a)} = ${num(ra / g)} : ${num(rb / g)}.\nएकूण भाग = ${num(ra / g + rb / g)}.\nअ चा वाटा = ${inr(w)} × ${num(ra / g)}/${num(ra / g + rb / g)} = ${inr(round(share, 2))}.\nउलटापालट लक्षात घ्या: जो जलद काम करतो त्याला जास्त मजुरी मिळते, म्हणून मजुरीचे गुणोत्तर दिवसांच्या गुणोत्तराच्या उलट असते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 9. Working on alternate days
 * ------------------------------------------------------------------ */
const alternateDays = {
  id: "work-alternate-days",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const a of [8, 10, 12, 16, 18, 20]) {
      for (const b of [12, 15, 20, 24, 30]) {
        if (a !== b) out.push({ a, b });
      }
    }
    return out;
  },
  make({ a, b }) {
    // Simulate: A works on day 1, B on day 2, and so on.
    const total = (a * b) / gcd(a, b);
    const rateA = total / a;
    const rateB = total / b;
    let done = 0;
    let days = 0;
    let guard = 0;
    while (done < total && guard < 500) {
      guard += 1;
      const rate = days % 2 === 0 ? rateA : rateB;
      if (done + rate >= total) {
        days += (total - done) / rate;
        done = total;
        break;
      }
      done += rate;
      days += 1;
    }
    if (guard >= 500) return null;
    if (!isClean(days)) return null;

    const correct = num(round(days, 2));
    const distractors = [
      num(round((a * b) / (a + b), 2)),
      num(round((a + b) / 2, 2)),
      num(round(days + 1, 2)),
    ];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `A can complete a piece of work in ${num(a)} days and B can complete it in ${num(b)} days. They work on alternate days, with A starting on the first day. In how many days will the work be completed?`,
        explanation: `Take the total work as ${num(total)} units, so A does ${num(rateA)} units a day and B does ${num(rateB)} units a day.\nWorking alternately, a PAIR of days (A then B) finishes ${num(rateA)} + ${num(rateB)} = ${num(rateA + rateB)} units.\nRepeat those pairs until the work left is less than one more day's output, then finish with a part-day.\nCarrying this out, the work is completed in ${num(round(days, 2))} days.\nNote this is different from working together, which would take ${num(round((a * b) / (a + b), 2))} days — on alternate days only one person works each day.\nWho starts matters: if the slower worker began, the total could differ.`,
      },
      mr: {
        text: `अ एक काम ${num(a)} दिवसांत पूर्ण करतो व ब तेच काम ${num(b)} दिवसांत पूर्ण करतो. ते आलटून पालटून काम करतात आणि पहिल्या दिवशी अ काम सुरू करतो. तर काम किती दिवसांत पूर्ण होईल?`,
        explanation: `एकूण काम ${num(total)} एकके धरा, म्हणजे अ रोज ${num(rateA)} एकके व ब रोज ${num(rateB)} एकके करतो.\nआलटून पालटून काम करताना दोन दिवसांच्या एका जोडीत (अ नंतर ब) ${num(rateA)} + ${num(rateB)} = ${num(rateA + rateB)} एकके काम होते.\nअशा जोड्या पुन्हा पुन्हा घ्या आणि उरलेले काम एका दिवसाच्या कामापेक्षा कमी झाले की शेवटचा अर्धा दिवस मोजा.\nअसे केल्यास काम ${num(round(days, 2))} दिवसांत पूर्ण होते.\nहे एकत्र काम करण्यापेक्षा वेगळे आहे — एकत्र काम केल्यास ${num(round((a * b) / (a + b), 2))} दिवस लागले असते, कारण आलटून पालटून काम करताना रोज एकच व्यक्ती काम करते.\nकोण सुरुवात करतो हे महत्त्वाचे असते: हळू काम करणाऱ्याने सुरुवात केली असती तर एकूण दिवस बदलू शकले असते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 10. Three people working together
 * ------------------------------------------------------------------ */
const togetherThree = {
  id: "work-together-three",
  difficulty: "moderate",
  cases() {
    const out = [];
    const triples = [
      [6, 12, 24], [10, 15, 30], [12, 15, 20], [8, 12, 24], [6, 9, 18],
      [4, 6, 12], [12, 18, 36], [10, 20, 20], [15, 20, 12], [9, 12, 18],
      [20, 30, 60], [5, 10, 20], [12, 24, 8], [16, 24, 48],
    ];
    for (const [a, b, c] of triples) out.push({ a, b, c });
    return out;
  },
  make({ a, b, c }) {
    const rate = 1 / a + 1 / b + 1 / c;
    const t = 1 / rate;
    if (!isClean(t)) return null;

    const correct = num(round(t, 2));
    const distractors = [
      num(round((a + b + c) / 3, 2)),
      num(round(1 / (1 / a + 1 / b), 2)),
      num(round(t * 2, 2)),
    ];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `A, B and C can individually complete a piece of work in ${num(a)}, ${num(b)} and ${num(c)} days respectively. Working together, in how many days will they complete it?`,
        explanation: `Add the daily rates, never the days.\nA does 1/${num(a)}, B does 1/${num(b)} and C does 1/${num(c)} of the work per day.\nCombined rate = 1/${num(a)} + 1/${num(b)} + 1/${num(c)} = ${num(round(rate, 5))} of the work per day.\nTime = 1 ÷ ${num(round(rate, 5))} = ${num(round(t, 2))} days.\nThe answer must be less than ${num(Math.min(a, b, c))}, the fastest individual time. Averaging the three days would give ${num(round((a + b + c) / 3, 2))}, which is far too slow and is the trap here.`,
      },
      mr: {
        text: `अ, ब व क हे एक काम स्वतंत्रपणे अनुक्रमे ${num(a)}, ${num(b)} व ${num(c)} दिवसांत पूर्ण करतात. तिघे एकत्र काम केल्यास ते काम किती दिवसांत पूर्ण होईल?`,
        explanation: `रोजच्या गतींची बेरीज करा, दिवसांची नाही.\nअ रोज कामाचा 1/${num(a)} भाग, ब 1/${num(b)} भाग व क 1/${num(c)} भाग करतो.\nएकत्रित गती = 1/${num(a)} + 1/${num(b)} + 1/${num(c)} = दर दिवशी कामाचा ${num(round(rate, 5))} भाग.\nवेळ = 1 ÷ ${num(round(rate, 5))} = ${num(round(t, 2))} दिवस.\nउत्तर ${num(Math.min(a, b, c))} या सर्वात कमी वैयक्तिक वेळेपेक्षा कमीच असले पाहिजे. तिन्ही दिवसांची सरासरी घेतल्यास ${num(round((a + b + c) / 3, 2))} येते, जे खूपच जास्त असून हाच येथील सापळा आहे.`,
      },
    };
  },
};

export const topicId = "time-work";

export const archetypes = [
  togetherTwo,
  thirdWorker,
  oneLeaves,
  efficiencyPercent,
  pipesNet,
  leak,
  menDaysHours,
  wagesShare,
  alternateDays,
  togetherThree,
];
