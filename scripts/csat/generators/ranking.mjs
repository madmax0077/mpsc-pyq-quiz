/**
 * Generator: Ranking, Order & Position.
 *
 * The validator re-solves each of these by building an actual row of people
 * and reading positions off it, so the off-by-one traps are checked for real.
 */

import { num } from "../lib/util.mjs";

/* ------------------------------------------------------------------ *
 * 1. Position from both ends gives the total
 * ------------------------------------------------------------------ */
const bothEnds = {
  id: "rank-both-ends",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (let left = 7; left <= 18; left += 2) {
      for (let right = 8; right <= 20; right += 3) out.push({ left, right });
    }
    return out;
  },
  make({ left, right }) {
    const total = left + right - 1;

    const correct = num(total);
    const distractors = [num(left + right), num(left + right + 1), num(total - 2)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `In a row of students, Rahul is ${num(left)}th from the left end and ${num(right)}th from the right end. How many students are there in the row?`,
        explanation: `Being ${num(left)}th from the left means there are ${num(left - 1)} students to his left.\nBeing ${num(right)}th from the right means there are ${num(right - 1)} students to his right.\nThe row is everyone on his left, plus Rahul himself, plus everyone on his right:\nTotal = ${num(left - 1)} + 1 + ${num(right - 1)} = ${num(total)}.\nThe usual shortcut is Total = (position from left) + (position from right) − 1, and the −1 is there because Rahul gets counted from both ends.\nSimply adding the two positions gives ${num(left + right)}, which counts him twice.`,
      },
      mr: {
        text: `एका रांगेत राहुल डाव्या टोकाकडून ${num(left)} वा आणि उजव्या टोकाकडून ${num(right)} वा आहे. तर रांगेत एकूण किती विद्यार्थी आहेत?`,
        explanation: `डावीकडून ${num(left)} वा असणे म्हणजे त्याच्या डावीकडे ${num(left - 1)} विद्यार्थी आहेत.\nउजवीकडून ${num(right)} वा असणे म्हणजे त्याच्या उजवीकडे ${num(right - 1)} विद्यार्थी आहेत.\nसंपूर्ण रांग = डावीकडचे सर्व + स्वतः राहुल + उजवीकडचे सर्व:\nएकूण = ${num(left - 1)} + 1 + ${num(right - 1)} = ${num(total)}.\nनेहमीचे सूत्र म्हणजे एकूण = (डावीकडून स्थान) + (उजवीकडून स्थान) − 1, आणि −1 अशासाठी की राहुल दोन्ही टोकांकडून मोजला जातो.\nदोन्ही स्थाने नुसती मिळवल्यास ${num(left + right)} येते, ज्यात तो दोनदा मोजला जातो.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 2. Position from the other end
 * ------------------------------------------------------------------ */
const otherEnd = {
  id: "rank-other-end",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const total of [25, 30, 32, 35, 40, 42, 45, 48, 50]) {
      for (const left of [7, 9, 11, 14, 16, 18, 21, 23]) {
        if (left < total) out.push({ total, left });
      }
    }
    return out;
  },
  make({ total, left }) {
    const right = total - left + 1;

    const correct = num(right);
    const distractors = [num(total - left), num(right + 1), num(left)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `In a row of ${num(total)} students, Sita is ${num(left)}th from the left end. What is her position from the right end?`,
        explanation: `Being ${num(left)}th from the left means ${num(left)} students have been counted up to and including Sita.\nThat leaves ${num(total)} − ${num(left)} = ${num(total - left)} students to her right.\nCounting from the right end, those ${num(total - left)} students come first and Sita is the very next one.\nSo her position from the right = ${num(total - left)} + 1 = ${num(right)}.\nThe formula is (position from right) = Total − (position from left) + 1. Stopping at ${num(total - left)} forgets to count Sita herself, and that off-by-one is what the question is testing.`,
      },
      mr: {
        text: `${num(total)} विद्यार्थ्यांच्या रांगेत सीता डाव्या टोकाकडून ${num(left)} वी आहे. तर उजव्या टोकाकडून तिचे स्थान कितवे?`,
        explanation: `डावीकडून ${num(left)} वी असणे म्हणजे सीतेसह ${num(left)} विद्यार्थी मोजून झाले आहेत.\nम्हणजे तिच्या उजवीकडे ${num(total)} − ${num(left)} = ${num(total - left)} विद्यार्थी उरतात.\nउजव्या टोकाकडून मोजायला सुरुवात केल्यास ते ${num(total - left)} विद्यार्थी आधी येतात आणि लगेच सीता येते.\nम्हणून उजवीकडून तिचे स्थान = ${num(total - left)} + 1 = ${num(right)}.\nसूत्र: (उजवीकडून स्थान) = एकूण − (डावीकडून स्थान) + 1. ${num(total - left)} वर थांबल्यास स्वतः सीता मोजायची राहून जाते, आणि हीच एका अंकाची चूक प्रश्नात तपासली जाते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 3. How many stand between two people
 * ------------------------------------------------------------------ */
const between = {
  id: "rank-between",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const total of [30, 35, 40, 45, 50]) {
      for (const left of [6, 8, 10, 12, 15]) {
        for (const right of [9, 11, 13, 16, 20]) {
          out.push({ total, left, right });
        }
      }
    }
    return out;
  },
  make({ total, left, right }) {
    const posA = left;
    const posB = total - right + 1;
    const gap = posB - posA - 1;
    if (gap <= 0) return null;

    const correct = num(gap);
    const distractors = [num(gap + 1), num(gap + 2), num(posB - posA)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `In a row of ${num(total)} students, Amit is ${num(left)}th from the left end and Bhavna is ${num(right)}th from the right end. How many students are standing between Amit and Bhavna?`,
        explanation: `Put both students on the same scale before comparing them — mixing "from the left" with "from the right" is what causes mistakes here.\nAmit's position from the left = ${num(posA)}.\nBhavna is ${num(right)}th from the right, so her position from the left = ${num(total)} − ${num(right)} + 1 = ${num(posB)}.\nThe students between them occupy the positions from ${num(posA + 1)} to ${num(posB - 1)}.\nCount = ${num(posB)} − ${num(posA)} − 1 = ${num(gap)}.\nSubtract 1 because "between" excludes both Amit and Bhavna themselves; without it you would get ${num(posB - posA)}.`,
      },
      mr: {
        text: `${num(total)} विद्यार्थ्यांच्या रांगेत अमित डाव्या टोकाकडून ${num(left)} वा आहे आणि भावना उजव्या टोकाकडून ${num(right)} वी आहे. तर अमित व भावना यांच्यामध्ये किती विद्यार्थी उभे आहेत?`,
        explanation: `तुलना करण्यापूर्वी दोघांची स्थाने एकाच बाजूने मोजा — "डावीकडून" व "उजवीकडून" यांची सरमिसळ हीच येथील चुकांचे कारण असते.\nअमितचे डावीकडून स्थान = ${num(posA)}.\nभावना उजवीकडून ${num(right)} वी आहे, म्हणून तिचे डावीकडून स्थान = ${num(total)} − ${num(right)} + 1 = ${num(posB)}.\nत्यांच्यामधील विद्यार्थी ${num(posA + 1)} ते ${num(posB - 1)} या स्थानांवर आहेत.\nसंख्या = ${num(posB)} − ${num(posA)} − 1 = ${num(gap)}.\n1 वजा करावा लागतो कारण "मध्ये" या शब्दात अमित व भावना हे दोघे धरले जात नाहीत; तो वजा न केल्यास ${num(posB - posA)} असे चुकीचे उत्तर येते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 4. Two people interchange places
 * ------------------------------------------------------------------ */
const interchange = {
  id: "rank-interchange",
  difficulty: "hard",
  cases() {
    const out = [];
    for (let aLeft = 5; aLeft <= 14; aLeft += 1) {
      for (let bRight = 6; bRight <= 18; bRight += 1) {
        for (let newLeft = 15; newLeft <= 28; newLeft += 3) {
          out.push({ aLeft, bRight, newLeft });
        }
      }
    }
    return out;
  },
  make({ aLeft, bRight, newLeft }) {
    // After the swap, A stands where B stood, so B's position from the left is newLeft.
    if (newLeft <= aLeft) return null;
    const total = newLeft + bRight - 1;
    if (total < newLeft || total > 60) return null;

    const correct = num(total);
    const distractors = [num(newLeft + bRight), num(aLeft + bRight - 1), num(total - 1)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `In a row of students, Karan is ${num(aLeft)}th from the left end and Meena is ${num(bRight)}th from the right end. They interchange their positions, and Karan then becomes ${num(newLeft)}th from the left end. How many students are there in the row?`,
        explanation: `The key idea is that swapping does not move anybody else — Karan simply steps into the exact spot Meena was standing in.\nSo Meena's original position from the left must have been ${num(newLeft)}.\nWe also know Meena was ${num(bRight)}th from the right.\nApplying the standard rule to Meena: Total = (position from left) + (position from right) − 1.\nTotal = ${num(newLeft)} + ${num(bRight)} − 1 = ${num(total)}.\nKaran's original position of ${num(aLeft)}th is not needed at all — it is there to see whether you have understood which person the two facts now describe.`,
      },
      mr: {
        text: `एका रांगेत करण डाव्या टोकाकडून ${num(aLeft)} वा आहे आणि मीना उजव्या टोकाकडून ${num(bRight)} वी आहे. दोघांनी आपापल्या जागा बदलल्यानंतर करण डाव्या टोकाकडून ${num(newLeft)} वा होतो. तर रांगेत एकूण किती विद्यार्थी आहेत?`,
        explanation: `मुख्य मुद्दा असा की जागा बदलल्याने इतर कोणीही हलत नाही — करण नेमका मीना उभी होती त्याच जागी जातो.\nम्हणून मीनाचे मूळ स्थान डावीकडून ${num(newLeft)} वे असले पाहिजे.\nतसेच मीना उजवीकडून ${num(bRight)} वी होती हेही आपल्याला माहीत आहे.\nमीनासाठी नेहमीचे सूत्र लावा: एकूण = (डावीकडून स्थान) + (उजवीकडून स्थान) − 1.\nएकूण = ${num(newLeft)} + ${num(bRight)} − 1 = ${num(total)}.\nकरणचे मूळ ${num(aLeft)} वे स्थान येथे मुळीच लागत नाही — आता ही दोन्ही माहिती कोणत्या व्यक्तीची आहे हे समजले का, हे तपासण्यासाठीच ते दिले आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 5. Rank in a class from the top and the bottom
 * ------------------------------------------------------------------ */
const classRank = {
  id: "rank-class-position",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const total of [40, 45, 50, 55, 60]) {
      for (const top of [8, 12, 15, 18, 22, 25]) {
        for (const fail of [3, 5, 6, 8]) {
          if (top < total - fail) out.push({ total, top, fail });
        }
      }
    }
    return out;
  },
  make({ total, top, fail }) {
    // `fail` students did not appear in the ranking at all.
    const ranked = total - fail;
    const bottom = ranked - top + 1;
    if (bottom <= 1) return null;

    const correct = num(bottom);
    const distractors = [num(total - top + 1), num(ranked - top), num(bottom + fail)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `In a class of ${num(total)} students, ${num(fail)} students were absent from the examination and were therefore not ranked. Among those who were ranked, Vijay stands ${num(top)}th from the top. What is his rank from the bottom?`,
        explanation: `Only the students who were actually ranked can be counted, so start by removing the absentees.\nNumber of students ranked = ${num(total)} − ${num(fail)} = ${num(ranked)}.\nVijay is ${num(top)}th from the top among these ${num(ranked)} students.\nRank from the bottom = ${num(ranked)} − ${num(top)} + 1 = ${num(bottom)}.\nUsing the full class strength of ${num(total)} would give ${num(total - top + 1)}, which wrongly places the ${num(fail)} absent students below him in the ranking.`,
      },
      mr: {
        text: `${num(total)} विद्यार्थ्यांच्या वर्गात ${num(fail)} विद्यार्थी परीक्षेला गैरहजर होते, त्यामुळे त्यांना क्रमांक मिळाला नाही. क्रमांक मिळालेल्यांमध्ये विजयचा वरून ${num(top)} वा क्रमांक आहे. तर खालून त्याचा क्रमांक कितवा?`,
        explanation: `ज्यांना प्रत्यक्ष क्रमांक मिळाला त्यांचीच गणना करावी, म्हणून प्रथम गैरहजर विद्यार्थी वगळा.\nक्रमांक मिळालेले विद्यार्थी = ${num(total)} − ${num(fail)} = ${num(ranked)}.\nया ${num(ranked)} विद्यार्थ्यांमध्ये विजय वरून ${num(top)} वा आहे.\nखालून क्रमांक = ${num(ranked)} − ${num(top)} + 1 = ${num(bottom)}.\nसंपूर्ण ${num(total)} ही संख्या वापरल्यास ${num(total - top + 1)} येते, ज्यात गैरहजर ${num(fail)} विद्यार्थी चुकीने त्याच्या खाली गृहीत धरले जातात.`,
      },
    };
  },
};

export const topicId = "ranking";

export const archetypes = [bothEnds, otherEnd, between, interchange, classRank];
