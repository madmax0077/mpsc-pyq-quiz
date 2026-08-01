/**
 * Generator: Percentage, Profit & Loss.
 *
 * Each archetype enumerates parameter combinations and derives the question
 * text, the four options and the worked explanation from the SAME numbers, in
 * both English and Marathi. Options are language-neutral (amounts, ratios and
 * percentages) so the two languages can never disagree on the answer.
 *
 * Distractors are deliberately the results of the classic mistakes for that
 * archetype (adding percentages without the cross term, applying profit to the
 * selling price instead of the cost price, and so on).
 */

import { inr, isClean, num, pct, round, sgn, signedPct } from "../lib/util.mjs";

/* ------------------------------------------------------------------ *
 * 1. Net effect of two successive percentage changes
 * ------------------------------------------------------------------ */
const successiveChange = {
  id: "successive-change",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const a of [10, 15, 20, 25, 30, 40, 50]) {
      for (const b of [-5, -10, -15, -20, -25, -30, 10, 20]) {
        out.push({ a, b });
      }
    }
    return out;
  },
  make({ a, b }) {
    const net = a + b + (a * b) / 100;
    if (!isClean(net) || net === 0) return null;
    const p1 = 100 * (1 + a / 100);
    const p2 = p1 * (1 + b / 100);

    const correct = signedPct(net);
    const distractors = [signedPct(a + b), signedPct(a + b - (a * b) / 100), signedPct(-net)];

    const second =
      b < 0
        ? { en: `decreased by ${num(-b)}%`, mr: `${num(-b)}% ने कमी केली` }
        : { en: `further increased by ${num(b)}%`, mr: `पुन्हा ${num(b)}% ने वाढवली` };

    return {
      correct,
      distractors,
      en: {
        text: `The price of a commodity is first increased by ${num(a)}% and then ${second.en}. What is the net percentage change in the price? (A positive value means an increase and a negative value means a decrease.)`,
        explanation: `Take the original price as 100.\nAfter the first change: 100 × ${num(1 + a / 100)} = ${num(p1)}.\nAfter the second change: ${num(p1)} × ${num(1 + b / 100)} = ${num(p2)}.\nNet change = ${num(p2)} − 100 = ${sgn(net)}, i.e. ${correct}.\nShortcut — for two successive changes of a% and b%, net = a + b + ab/100 = ${num(a)} + (${sgn(b)}) + (${num(a)} × ${sgn(b)})/100 = ${sgn(net)}%.\nNote that simply adding ${num(a)} and ${sgn(b)} to get ${sgn(a + b)}% ignores the cross term and is the usual mistake.`,
      },
      mr: {
        text: `एका वस्तूची किंमत प्रथम ${num(a)}% ने वाढवली आणि नंतर ${second.mr}. किंमतीत निव्वळ किती टक्के बदल झाला? (धन चिन्ह वाढ दर्शवते व ऋण चिन्ह घट दर्शवते.)`,
        explanation: `मूळ किंमत 100 धरा.\nपहिल्या बदलानंतर: 100 × ${num(1 + a / 100)} = ${num(p1)}.\nदुसऱ्या बदलानंतर: ${num(p1)} × ${num(1 + b / 100)} = ${num(p2)}.\nनिव्वळ बदल = ${num(p2)} − 100 = ${sgn(net)}, म्हणजेच ${correct}.\nसूत्र — a% व b% असे दोन क्रमवार बदल असल्यास निव्वळ बदल = a + b + ab/100 = ${num(a)} + (${sgn(b)}) + (${num(a)} × ${sgn(b)})/100 = ${sgn(net)}%.\nफक्त ${num(a)} व ${sgn(b)} यांची बेरीज करून ${sgn(a + b)}% घेणे ही नेहमीची चूक आहे, कारण त्यात गुणाकाराचे पद वगळले जाते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 2. Mark-up followed by a discount
 * ------------------------------------------------------------------ */
const markupDiscount = {
  id: "markup-discount",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const m of [20, 25, 30, 40, 50, 60, 80]) {
      for (const d of [10, 15, 20, 25, 30, 40]) {
        out.push({ m, d });
      }
    }
    return out;
  },
  make({ m, d }) {
    const profit = m - d - (m * d) / 100;
    if (!isClean(profit) || profit === 0) return null;
    const mp = 100 + m;
    const sp = (mp * (100 - d)) / 100;

    const correct = signedPct(profit);
    const distractors = [signedPct(m - d), signedPct(-(m - d)), signedPct(m - d + (m * d) / 100)];

    return {
      correct,
      distractors,
      en: {
        text: `A shopkeeper marks his goods ${num(m)}% above the cost price and then allows a discount of ${num(d)}% on the marked price. Find his profit or loss percent. (A negative value indicates a loss.)`,
        explanation: `Let the cost price be 100.\nMarked price = 100 + ${num(m)} = ${num(mp)}.\nDiscount is calculated on the marked price, so selling price = ${num(mp)} × (100 − ${num(d)})/100 = ${num(mp)} × ${num((100 - d) / 100)} = ${num(sp)}.\nProfit = ${num(sp)} − 100 = ${sgn(profit)} on a cost of 100, i.e. ${correct}.\nRemember: the discount is taken on the marked price, while profit is measured on the cost price. Mixing the two bases gives ${sgn(m - d)}%, which is wrong.`,
      },
      mr: {
        text: `एका दुकानदाराने आपल्या मालावर खरेदी किंमतीपेक्षा ${num(m)}% अधिक छापील किंमत लावली आणि नंतर छापील किंमतीवर ${num(d)}% सूट दिली. त्याचा नफा किंवा तोटा किती टक्के? (ऋण चिन्ह तोटा दर्शवते.)`,
        explanation: `खरेदी किंमत 100 धरा.\nछापील किंमत = 100 + ${num(m)} = ${num(mp)}.\nसूट छापील किंमतीवर मोजली जाते, म्हणून विक्री किंमत = ${num(mp)} × (100 − ${num(d)})/100 = ${num(mp)} × ${num((100 - d) / 100)} = ${num(sp)}.\nनफा = ${num(sp)} − 100 = ${sgn(profit)}, म्हणजे 100 च्या खरेदी किंमतीवर ${correct}.\nलक्षात ठेवा: सूट छापील किंमतीवर आणि नफा खरेदी किंमतीवर मोजतात. दोन्ही एकत्र केल्यास ${sgn(m - d)}% असे चुकीचे उत्तर येते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 3. Two articles at the same selling price, equal gain and loss percent
 * ------------------------------------------------------------------ */
const sameSpEqualGainLoss = {
  id: "same-sp-equal-gain-loss",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const x of [10, 12, 15, 20, 25, 30]) {
      for (const sp of [480, 660, 840, 960, 1200, 1980]) {
        out.push({ x, sp });
      }
    }
    return out;
  },
  make({ x, sp }) {
    const lossPct = (x * x) / 100;
    if (!isClean(lossPct)) return null;
    const cp1 = (sp * 100) / (100 + x);
    const cp2 = (sp * 100) / (100 - x);
    const totalCp = cp1 + cp2;
    const totalSp = 2 * sp;

    const correct = signedPct(-lossPct);
    const distractors = ["0%", signedPct(lossPct), signedPct(-2 * lossPct)];

    return {
      correct,
      distractors,
      en: {
        text: `A man sells two articles for ${inr(sp)} each. On one of them he gains ${num(x)}% and on the other he loses ${num(x)}%. Find his overall profit or loss percent. (A negative value indicates a loss.)`,
        explanation: `Cost of the article sold at a gain = ${inr(sp)} × 100/(100 + ${num(x)}) = ${inr(round(cp1, 2))}.\nCost of the article sold at a loss = ${inr(sp)} × 100/(100 − ${num(x)}) = ${inr(round(cp2, 2))}.\nTotal cost = ${inr(round(totalCp, 2))}, total selling price = 2 × ${inr(sp)} = ${inr(totalSp)}.\nSince the total cost exceeds the total selling price, there is a loss of ${inr(round(totalCp - totalSp, 2))}, which is ${num(lossPct)}% of the cost.\nShortcut — whenever two items are sold at the SAME price with equal gain and loss percent x, the result is always a loss of x²/100 = ${num(x)}²/100 = ${num(lossPct)}%. It is never zero, so "no profit no loss" is the trap option here.`,
      },
      mr: {
        text: `एका माणसाने दोन वस्तू प्रत्येकी ${inr(sp)} या दराने विकल्या. एका वस्तूवर त्याला ${num(x)}% नफा झाला आणि दुसऱ्या वस्तूवर ${num(x)}% तोटा झाला. एकूण नफा किंवा तोटा किती टक्के? (ऋण चिन्ह तोटा दर्शवते.)`,
        explanation: `नफ्यात विकलेल्या वस्तूची खरेदी किंमत = ${inr(sp)} × 100/(100 + ${num(x)}) = ${inr(round(cp1, 2))}.\nतोट्यात विकलेल्या वस्तूची खरेदी किंमत = ${inr(sp)} × 100/(100 − ${num(x)}) = ${inr(round(cp2, 2))}.\nएकूण खरेदी किंमत = ${inr(round(totalCp, 2))}, एकूण विक्री किंमत = 2 × ${inr(sp)} = ${inr(totalSp)}.\nएकूण खरेदी किंमत विक्री किंमतीपेक्षा जास्त असल्याने ${inr(round(totalCp - totalSp, 2))} इतका तोटा होतो, जो खरेदी किंमतीच्या ${num(lossPct)}% आहे.\nसूत्र — दोन वस्तू एकाच किंमतीला विकल्या आणि नफा व तोट्याची टक्केवारी समान x असेल, तर नेहमी x²/100 = ${num(x)}²/100 = ${num(lossPct)}% इतका तोटाच होतो. तो कधीही शून्य नसतो, म्हणून "ना नफा ना तोटा" हा पर्याय हा सापळा आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 4. Selling price needed for a target profit, given a loss-making sale
 * ------------------------------------------------------------------ */
const spFromLossToProfit = {
  id: "sp-from-loss-to-profit",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const cp of [400, 500, 600, 750, 800, 1200, 1500, 2400]) {
      for (const loss of [10, 12, 15, 20, 25]) {
        for (const target of [10, 15, 20, 25, 30]) {
          out.push({ cp, loss, target });
        }
      }
    }
    return out;
  },
  make({ cp, loss, target }) {
    const sp1 = (cp * (100 - loss)) / 100;
    const sp2 = (cp * (100 + target)) / 100;
    if (!Number.isInteger(sp1) || !Number.isInteger(sp2)) return null;

    const wrong1 = round((sp1 * (100 + target)) / 100, 2);
    const wrong3 = round((cp * (100 + target + loss)) / 100, 2);

    const correct = inr(sp2);
    const distractors = [inr(wrong1), inr(cp), inr(wrong3)];

    return {
      correct,
      distractors,
      en: {
        text: `By selling an article for ${inr(sp1)} a man loses ${num(loss)}%. At what price should he sell the same article in order to gain ${num(target)}%?`,
        explanation: `A loss of ${num(loss)}% means the selling price is (100 − ${num(loss)}) = ${num(100 - loss)}% of the cost price.\nSo cost price = ${inr(sp1)} × 100/${num(100 - loss)} = ${inr(cp)}.\nFor a gain of ${num(target)}%, selling price = ${inr(cp)} × (100 + ${num(target)})/100 = ${inr(cp)} × ${num((100 + target) / 100)} = ${inr(sp2)}.\nThe common error is to add ${num(target)}% to the loss-making price of ${inr(sp1)}, which gives ${inr(wrong1)}. Profit must always be reckoned on the cost price, not on an earlier selling price.`,
      },
      mr: {
        text: `एक वस्तू ${inr(sp1)} या किंमतीला विकल्यास एका माणसाला ${num(loss)}% तोटा होतो. ${num(target)}% नफा मिळवण्यासाठी त्याने ती वस्तू किती किंमतीला विकावी?`,
        explanation: `${num(loss)}% तोटा म्हणजे विक्री किंमत ही खरेदी किंमतीच्या (100 − ${num(loss)}) = ${num(100 - loss)}% इतकी आहे.\nम्हणून खरेदी किंमत = ${inr(sp1)} × 100/${num(100 - loss)} = ${inr(cp)}.\n${num(target)}% नफ्यासाठी विक्री किंमत = ${inr(cp)} × (100 + ${num(target)})/100 = ${inr(cp)} × ${num((100 + target) / 100)} = ${inr(sp2)}.\nतोट्याच्या ${inr(sp1)} या किंमतीत ${num(target)}% मिळवणे ही नेहमीची चूक असून त्यातून ${inr(wrong1)} असे उत्तर येते. नफा नेहमी खरेदी किंमतीवर मोजावा, आधीच्या विक्री किंमतीवर नाही.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 5. Single discount equivalent to two successive discounts
 * ------------------------------------------------------------------ */
const successiveDiscount = {
  id: "successive-discount-single",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const d1 of [10, 15, 20, 25, 30, 40]) {
      for (const d2 of [5, 10, 12, 15, 20, 25]) {
        out.push({ d1, d2 });
      }
    }
    return out;
  },
  make({ d1, d2 }) {
    const single = d1 + d2 - (d1 * d2) / 100;
    if (!isClean(single)) return null;
    const naive = d1 + d2;
    const over = round(d1 + d2 - (d1 * d2) / 50, 2);
    const cross = round((d1 * d2) / 100, 2);

    const correct = pct(single);
    const distractors = [pct(naive), pct(over), pct(cross)];

    return {
      correct,
      distractors,
      en: {
        text: `Find the single discount that is equivalent to two successive discounts of ${num(d1)}% and ${num(d2)}%.`,
        explanation: `Take the marked price as 100.\nAfter the first discount: 100 × (100 − ${num(d1)})/100 = ${num(100 - d1)}.\nThe second discount applies to ${num(100 - d1)}, not to 100: ${num(100 - d1)} × (100 − ${num(d2)})/100 = ${num(((100 - d1) * (100 - d2)) / 100)}.\nTotal reduction = 100 − ${num(((100 - d1) * (100 - d2)) / 100)} = ${num(single)}, so the equivalent single discount is ${correct}.\nAdding the two discounts to get ${num(naive)}% is wrong because the second discount is charged on an already reduced amount.`,
      },
      mr: {
        text: `${num(d1)}% व ${num(d2)}% अशा दोन क्रमवार सवलतींच्या समतुल्य एकच सवलत किती टक्के असेल?`,
        explanation: `छापील किंमत 100 धरा.\nपहिल्या सवलतीनंतर: 100 × (100 − ${num(d1)})/100 = ${num(100 - d1)}.\nदुसरी सवलत 100 वर नव्हे तर ${num(100 - d1)} वर लागते: ${num(100 - d1)} × (100 − ${num(d2)})/100 = ${num(((100 - d1) * (100 - d2)) / 100)}.\nएकूण घट = 100 − ${num(((100 - d1) * (100 - d2)) / 100)} = ${num(single)}, म्हणून समतुल्य एकच सवलत ${correct} आहे.\nदोन्ही सवलती बेरीज करून ${num(naive)}% घेणे चुकीचे आहे, कारण दुसरी सवलत आधीच कमी झालेल्या रकमेवर लागते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 6. "x% more than" reversed into "how much percent less than"
 * ------------------------------------------------------------------ */
const moreThanLessThan = {
  id: "more-than-less-than",
  difficulty: "moderate",
  cases() {
    return [20, 25, 30, 40, 50, 60, 75, 100, 150, 200, 300].map((x) => ({ x }));
  },
  make({ x }) {
    const ans = (x / (100 + x)) * 100;
    if (!isClean(ans)) return null;
    const reverse = x < 100 ? round((x / (100 - x)) * 100, 2) : null;

    const correct = pct(round(ans, 2));
    const distractors = [pct(x), pct(round(x / 2, 2)), reverse === null ? pct(round(ans + 10, 2)) : pct(reverse)];

    return {
      correct,
      distractors,
      en: {
        text: `A's income is ${num(x)}% more than B's income. B's income is what percent less than A's income?`,
        explanation: `Let B's income be 100.\nThen A's income = 100 + ${num(x)} = ${num(100 + x)}.\nB earns ${num(x)} less than A, and that shortfall must now be expressed as a percentage of A's income, not B's.\nRequired percentage = (${num(x)} / ${num(100 + x)}) × 100 = ${num(round(ans, 2))}%.\nAnswering ${num(x)}% is the standard trap: the two percentages use different bases, so they are not the same number.`,
      },
      mr: {
        text: `अ चे उत्पन्न ब च्या उत्पन्नापेक्षा ${num(x)}% ने जास्त आहे. तर ब चे उत्पन्न अ च्या उत्पन्नापेक्षा किती टक्के कमी आहे?`,
        explanation: `ब चे उत्पन्न 100 धरा.\nमग अ चे उत्पन्न = 100 + ${num(x)} = ${num(100 + x)}.\nब चे उत्पन्न अ पेक्षा ${num(x)} ने कमी आहे, आणि ही तूट आता अ च्या उत्पन्नाच्या तुलनेत मांडायची आहे, ब च्या नव्हे.\nआवश्यक टक्केवारी = (${num(x)} / ${num(100 + x)}) × 100 = ${num(round(ans, 2))}%.\n${num(x)}% असे उत्तर देणे हा नेहमीचा सापळा आहे, कारण दोन्ही टक्केवारींचा आधार वेगळा आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 7. Cost price of n articles equals selling price of m articles
 * ------------------------------------------------------------------ */
const cpEqualsSp = {
  id: "cp-articles-equals-sp-articles",
  difficulty: "moderate",
  cases() {
    const out = [];
    const pairs = [
      [20, 16], [25, 20], [18, 15], [15, 12], [36, 30], [11, 10],
      [21, 18], [24, 20], [30, 25], [22, 20], [45, 36], [16, 12],
    ];
    for (const [n, m] of pairs) out.push({ n, m });
    return out;
  },
  make({ n, m }) {
    const profit = ((n - m) / m) * 100;
    if (!isClean(profit)) return null;
    const wrongBase = round(((n - m) / n) * 100, 2);

    const correct = pct(round(profit, 2));
    const distractors = [pct(wrongBase), pct(round((n / m) * 100, 2)), pct(round(n - m, 2))];

    return {
      correct,
      distractors,
      en: {
        text: `The cost price of ${num(n)} articles is equal to the selling price of ${num(m)} articles. Find the profit percent.`,
        explanation: `Let the cost price of one article be 1, so the cost of ${num(n)} articles = ${num(n)}.\nThis same amount is the selling price of ${num(m)} articles, so the selling price of one article = ${num(n)}/${num(m)}.\nProfit on one article = ${num(n)}/${num(m)} − 1 = ${num(n - m)}/${num(m)}.\nProfit% = (${num(n - m)}/${num(m)}) × 100 = ${num(round(profit, 2))}%.\nDividing by ${num(n)} instead of ${num(m)} gives ${num(wrongBase)}% — profit is always measured on the cost, and here the cost corresponds to ${num(m)} articles' worth of selling price.`,
      },
      mr: {
        text: `${num(n)} वस्तूंची खरेदी किंमत ही ${num(m)} वस्तूंच्या विक्री किंमतीएवढी आहे. तर नफा किती टक्के?`,
        explanation: `एका वस्तूची खरेदी किंमत 1 धरा, म्हणजे ${num(n)} वस्तूंची खरेदी किंमत = ${num(n)}.\nहीच रक्कम ${num(m)} वस्तूंची विक्री किंमत आहे, म्हणून एका वस्तूची विक्री किंमत = ${num(n)}/${num(m)}.\nएका वस्तूवरील नफा = ${num(n)}/${num(m)} − 1 = ${num(n - m)}/${num(m)}.\nनफा% = (${num(n - m)}/${num(m)}) × 100 = ${num(round(profit, 2))}%.\n${num(m)} ऐवजी ${num(n)} ने भागल्यास ${num(wrongBase)}% असे चुकीचे उत्तर येते. नफा नेहमी खरेदी किंमतीवर मोजतात.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 8. Dishonest shopkeeper using a false weight
 * ------------------------------------------------------------------ */
const falseWeight = {
  id: "false-weight",
  difficulty: "hard",
  cases() {
    return [800, 750, 900, 960, 875, 640, 500, 850].map((w) => ({ w }));
  },
  make({ w }) {
    const gain = ((1000 - w) / w) * 100;
    const wrongBase = ((1000 - w) / 1000) * 100;

    const correct = pct(round(gain, 2));
    const distractors = [
      pct(round(wrongBase, 2)),
      pct(round((w / 1000) * 100, 2)),
      pct(round(gain / 2, 2)),
    ];

    return {
      correct,
      distractors,
      en: {
        text: `A dishonest shopkeeper professes to sell his goods at cost price, but he uses a weight of ${num(w)} g in place of 1 kg. Find his gain percent.`,
        explanation: `He charges the customer for 1000 g but actually hands over only ${num(w)} g.\nSo his cost is the cost of ${num(w)} g, while his receipt is the price of 1000 g.\nTaking the cost of 1 g as 1: cost = ${num(w)}, selling price = 1000, gain = 1000 − ${num(w)} = ${num(1000 - w)}.\nGain% = (${num(1000 - w)} / ${num(w)}) × 100 = ${num(round(gain, 2))}%.\nThe gain must be divided by what the goods actually cost him (${num(w)}), not by 1000. Dividing by 1000 gives ${num(round(wrongBase, 2))}%, which is the usual error.`,
      },
      mr: {
        text: `एक अप्रामाणिक दुकानदार आपला माल खरेदी किंमतीलाच विकतो असे सांगतो, परंतु 1 किलोऐवजी तो ${num(w)} ग्रॅमचे वजन वापरतो. त्याचा नफा किती टक्के?`,
        explanation: `तो ग्राहकाकडून 1000 ग्रॅमचे पैसे घेतो, पण प्रत्यक्षात फक्त ${num(w)} ग्रॅम देतो.\nम्हणजे त्याचा खर्च ${num(w)} ग्रॅमचा असतो, तर मिळकत 1000 ग्रॅमची असते.\n1 ग्रॅमची किंमत 1 धरल्यास: खरेदी = ${num(w)}, विक्री = 1000, नफा = 1000 − ${num(w)} = ${num(1000 - w)}.\nनफा% = (${num(1000 - w)} / ${num(w)}) × 100 = ${num(round(gain, 2))}%.\nनफा हा त्याला प्रत्यक्षात पडलेल्या खर्चाने (${num(w)}) भागावा, 1000 ने नाही. 1000 ने भागल्यास ${num(round(wrongBase, 2))}% असे चुकीचे उत्तर येते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 9. Income, expenditure and savings
 * ------------------------------------------------------------------ */
const savings = {
  id: "income-expenditure-savings",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const p of [60, 65, 70, 75, 80]) {
      for (const i of [10, 15, 20, 25, 30]) {
        for (const e of [5, 10, 15, 20]) {
          out.push({ p, i, e });
        }
      }
    }
    return out;
  },
  make({ p, i, e }) {
    const s0 = 100 - p;
    const i1 = 100 + i;
    const e1 = (p * (100 + e)) / 100;
    const s1 = i1 - e1;
    const ans = ((s1 - s0) / s0) * 100;
    if (!isClean(ans) || ans === 0) return null;
    if (Math.abs(ans) < 1) return null;

    const correct = signedPct(round(ans, 2));
    const distractors = [signedPct(i - e), signedPct(round(-ans, 2)), signedPct(round(ans / 2, 2))];

    return {
      correct,
      distractors,
      en: {
        text: `A man spends ${num(p)}% of his income. His income increases by ${num(i)}% and at the same time his expenditure increases by ${num(e)}%. By what percent do his savings change? (A negative value indicates a fall.)`,
        explanation: `Take the original income as 100.\nOriginal expenditure = ${num(p)}, so original savings = 100 − ${num(p)} = ${num(s0)}.\nNew income = 100 × ${num(i1 / 100)} = ${num(i1)}.\nNew expenditure = ${num(p)} × ${num((100 + e) / 100)} = ${num(e1)}.\nNew savings = ${num(i1)} − ${num(e1)} = ${num(s1)}.\nChange in savings = ${num(s1)} − ${num(s0)} = ${sgn(round(s1 - s0, 2))}.\nPercentage change = (${sgn(round(s1 - s0, 2))} / ${num(s0)}) × 100 = ${sgn(round(ans, 2))}%, i.e. ${correct}.\nThe change must be divided by the ORIGINAL savings of ${num(s0)}, not by the income. Note also that savings move far more sharply than income does, because savings are a small base.`,
      },
      mr: {
        text: `एक माणूस आपल्या उत्पन्नाच्या ${num(p)}% खर्च करतो. त्याचे उत्पन्न ${num(i)}% ने वाढते आणि त्याच वेळी त्याचा खर्च ${num(e)}% ने वाढतो. तर त्याच्या बचतीत किती टक्के बदल होतो? (ऋण चिन्ह घट दर्शवते.)`,
        explanation: `मूळ उत्पन्न 100 धरा.\nमूळ खर्च = ${num(p)}, म्हणून मूळ बचत = 100 − ${num(p)} = ${num(s0)}.\nनवीन उत्पन्न = 100 × ${num(i1 / 100)} = ${num(i1)}.\nनवीन खर्च = ${num(p)} × ${num((100 + e) / 100)} = ${num(e1)}.\nनवीन बचत = ${num(i1)} − ${num(e1)} = ${num(s1)}.\nबचतीतील बदल = ${num(s1)} − ${num(s0)} = ${sgn(round(s1 - s0, 2))}.\nटक्केवारी बदल = (${sgn(round(s1 - s0, 2))} / ${num(s0)}) × 100 = ${sgn(round(ans, 2))}%, म्हणजेच ${correct}.\nहा बदल मूळ बचतीने (${num(s0)}) भागावा, उत्पन्नाने नाही. बचतीचा आधार लहान असल्याने उत्पन्नापेक्षा बचतीत खूप मोठा बदल दिसतो.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 10. Examination — failed in one, other, or both
 * ------------------------------------------------------------------ */
const examFailBoth = {
  id: "exam-fail-both",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const x of [30, 35, 40, 42, 45, 52]) {
      for (const y of [25, 28, 30, 35, 38]) {
        for (const z of [12, 15, 18, 20, 22]) {
          if (z < Math.min(x, y) && x + y - z < 100) out.push({ x, y, z });
        }
      }
    }
    return out;
  },
  make({ x, y, z }) {
    const failedAtLeastOne = x + y - z;
    const passedBoth = 100 - failedAtLeastOne;
    if (passedBoth <= 0) return null;

    const correct = pct(passedBoth);
    const distractors = [pct(100 - x - y), pct(failedAtLeastOne), pct(100 - x - y + z * 2)];

    return {
      correct,
      distractors,
      en: {
        text: `In an examination ${num(x)}% of the students failed in Mathematics and ${num(y)}% failed in English. If ${num(z)}% of the students failed in both subjects, what percentage of the students passed in both subjects?`,
        explanation: `Students who failed in at least one subject = failed in Maths + failed in English − failed in both.\n= ${num(x)} + ${num(y)} − ${num(z)} = ${num(failedAtLeastOne)}%.\nThe subtraction is needed because the ${num(z)}% who failed both have been counted twice, once in each subject total.\nPassed in both subjects = 100 − ${num(failedAtLeastOne)} = ${num(passedBoth)}%.\nForgetting to add back the overlap gives 100 − ${num(x)} − ${num(y)} = ${num(100 - x - y)}%, which is the usual mistake.`,
      },
      mr: {
        text: `एका परीक्षेत ${num(x)}% विद्यार्थी गणितात नापास झाले आणि ${num(y)}% विद्यार्थी इंग्रजीत नापास झाले. जर ${num(z)}% विद्यार्थी दोन्ही विषयांत नापास झाले असतील, तर किती टक्के विद्यार्थी दोन्ही विषयांत उत्तीर्ण झाले?`,
        explanation: `किमान एका विषयात नापास झालेले विद्यार्थी = गणितात नापास + इंग्रजीत नापास − दोन्हींत नापास.\n= ${num(x)} + ${num(y)} − ${num(z)} = ${num(failedAtLeastOne)}%.\nदोन्हींत नापास झालेले ${num(z)}% दोन्ही बेरजांमध्ये दोनदा मोजले जातात, म्हणून ते एकदा वजा करावे लागतात.\nदोन्ही विषयांत उत्तीर्ण = 100 − ${num(failedAtLeastOne)} = ${num(passedBoth)}%.\nसामाईक भाग वजा न करता 100 − ${num(x)} − ${num(y)} = ${num(100 - x - y)}% असे उत्तर काढणे ही नेहमीची चूक आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 11. Profit stated on selling price, converted to cost price
 * ------------------------------------------------------------------ */
const profitOnSp = {
  id: "profit-on-sp-to-cp",
  difficulty: "hard",
  cases() {
    return [10, 20, 25, 30, 40, 50, 60].map((p) => ({ p }));
  },
  make({ p }) {
    const ans = (p / (100 - p)) * 100;
    const correct = pct(round(ans, 2));
    const distractors = [pct(p), pct(round((p / (100 + p)) * 100, 2)), pct(round(p * 2, 2))];

    return {
      correct,
      distractors,
      en: {
        text: `A trader's profit is ${num(p)}% of his selling price. What is his profit as a percentage of the cost price?`,
        explanation: `Take the selling price as 100.\nProfit = ${num(p)}% of the selling price = ${num(p)}.\nCost price = selling price − profit = 100 − ${num(p)} = ${num(100 - p)}.\nProfit% on cost = (${num(p)} / ${num(100 - p)}) × 100 = ${num(round(ans, 2))}%.\nUnless a question says otherwise, profit percent always means profit measured on the COST price, so a profit quoted on the selling price must be converted first. Leaving it as ${num(p)}% is the trap.`,
      },
      mr: {
        text: `एका व्यापाऱ्याचा नफा त्याच्या विक्री किंमतीच्या ${num(p)}% इतका आहे. तर खरेदी किंमतीच्या तुलनेत त्याचा नफा किती टक्के?`,
        explanation: `विक्री किंमत 100 धरा.\nनफा = विक्री किंमतीच्या ${num(p)}% = ${num(p)}.\nखरेदी किंमत = विक्री किंमत − नफा = 100 − ${num(p)} = ${num(100 - p)}.\nखरेदी किंमतीवरील नफा% = (${num(p)} / ${num(100 - p)}) × 100 = ${num(round(ans, 2))}%.\nप्रश्नात वेगळे सांगितले नसेल तर नफा टक्केवारी नेहमी खरेदी किंमतीवर असते, म्हणून विक्री किंमतीवर दिलेला नफा आधी रूपांतरित करावा लागतो. तो ${num(p)}% असाच ठेवणे हा सापळा आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 12. Price rise and the consumption cut that offsets it
 * ------------------------------------------------------------------ */
const consumptionCut = {
  id: "price-rise-consumption-cut",
  difficulty: "moderate",
  cases() {
    return [10, 20, 25, 30, 50, 60, 100, 150].map((x) => ({ x }));
  },
  make({ x }) {
    const ans = (x / (100 + x)) * 100;
    if (!isClean(ans)) return null;

    const correct = pct(round(ans, 2));
    const distractors = [pct(x), pct(round((x / (100 - x)) * 100, 2)) , pct(round(100 - ans, 2))];
    if (x >= 100) distractors[1] = pct(round(x / 2, 2));

    return {
      correct,
      distractors,
      en: {
        text: `The price of sugar rises by ${num(x)}%. By what percent must a family reduce its consumption of sugar so that its total expenditure on sugar remains unchanged?`,
        explanation: `Let the original price be 100 per unit and the original consumption be 1 unit, so the expenditure is 100.\nNew price = ${num(100 + x)} per unit.\nTo keep the expenditure at 100, the new consumption = 100/${num(100 + x)} units.\nReduction in consumption = 1 − 100/${num(100 + x)} = ${num(x)}/${num(100 + x)} units.\nPercentage reduction = (${num(x)}/${num(100 + x)}) × 100 = ${num(round(ans, 2))}%.\nCutting consumption by the same ${num(x)}% would not work, because the cut is measured against the original consumption while the rise was measured against the original price — the bases differ.`,
      },
      mr: {
        text: `साखरेची किंमत ${num(x)}% ने वाढली. साखरेवरील एकूण खर्च पूर्वीइतकाच राहावा यासाठी कुटुंबाने साखरेचा वापर किती टक्क्यांनी कमी करावा?`,
        explanation: `मूळ किंमत प्रति नग 100 आणि मूळ वापर 1 नग धरा, म्हणजे खर्च 100 होतो.\nनवीन किंमत = प्रति नग ${num(100 + x)}.\nखर्च 100 इतकाच ठेवायचा असल्यास नवीन वापर = 100/${num(100 + x)} नग.\nवापरातील घट = 1 − 100/${num(100 + x)} = ${num(x)}/${num(100 + x)} नग.\nटक्केवारी घट = (${num(x)}/${num(100 + x)}) × 100 = ${num(round(ans, 2))}%.\nतितक्याच म्हणजे ${num(x)}% ने वापर कमी करून चालणार नाही, कारण घट मूळ वापराच्या तुलनेत तर वाढ मूळ किंमतीच्या तुलनेत मोजली जाते — दोन्हींचा आधार वेगळा आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 13. Price reduction lets the buyer get more quantity
 * ------------------------------------------------------------------ */
const extraQuantity = {
  id: "price-cut-extra-quantity",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const x of [10, 20, 25, 40, 50]) {
      for (const m of [600, 800, 900, 1200, 1500, 2400]) {
        for (const q of [3, 4, 5, 6, 8]) {
          out.push({ x, m, q });
        }
      }
    }
    return out;
  },
  make({ x, m, q }) {
    const reduced = (m * x) / 100 / q;
    const original = (reduced * 100) / (100 - x);
    if (!isClean(reduced) || !isClean(original)) return null;
    if (reduced < 5 || reduced > 400) return null;

    const correct = inr(round(reduced, 2));
    const distractors = [
      inr(round(original, 2)),
      inr(round(m / q, 2)),
      inr(round((m * (100 - x)) / 100 / q, 2)),
    ];

    return {
      correct,
      distractors,
      en: {
        text: `A reduction of ${num(x)}% in the price of rice enables a man to buy ${num(q)} kg more rice for ${inr(m)}. Find the reduced price per kg.`,
        explanation: `The money spent is unchanged at ${inr(m)}. Because the price fell by ${num(x)}%, the amount saved on the original purchase is ${num(x)}% of ${inr(m)} = ${inr(round((m * x) / 100, 2))}.\nThat saving is exactly what buys the extra ${num(q)} kg.\nSo the reduced price per kg = ${inr(round((m * x) / 100, 2))} / ${num(q)} = ${correct}.\nCheck: the original price = ${correct} × 100/(100 − ${num(x)}) = ${inr(round(original, 2))}. At the original price ${inr(m)} buys ${num(round(m / original, 2))} kg, and at the reduced price it buys ${num(round(m / reduced, 2))} kg — a difference of exactly ${num(q)} kg.`,
      },
      mr: {
        text: `तांदळाच्या किंमतीत ${num(x)}% घट झाल्याने एका माणसाला ${inr(m)} मध्ये ${num(q)} किलो तांदूळ जास्त मिळतो. तर घटलेली किंमत प्रति किलो किती?`,
        explanation: `खर्च होणारी रक्कम ${inr(m)} तितकीच राहते. किंमत ${num(x)}% ने घटल्यामुळे वाचलेली रक्कम = ${inr(m)} च्या ${num(x)}% = ${inr(round((m * x) / 100, 2))}.\nहीच वाचलेली रक्कम जास्तीचा ${num(q)} किलो तांदूळ विकत घेते.\nम्हणून घटलेली किंमत प्रति किलो = ${inr(round((m * x) / 100, 2))} / ${num(q)} = ${correct}.\nपडताळणी: मूळ किंमत = ${correct} × 100/(100 − ${num(x)}) = ${inr(round(original, 2))}. मूळ किंमतीला ${inr(m)} मध्ये ${num(round(m / original, 2))} किलो, तर घटलेल्या किंमतीला ${num(round(m / reduced, 2))} किलो मिळतात — फरक नेमका ${num(q)} किलो.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 14. Mark-up required to still make a profit after a discount
 * ------------------------------------------------------------------ */
const markupNeeded = {
  id: "markup-needed-for-profit",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const d of [10, 20, 25, 30, 40]) {
      for (const p of [8, 17, 20, 25, 30, 35, 50]) {
        out.push({ d, p });
      }
    }
    return out;
  },
  make({ d, p }) {
    const markup = ((100 + p) / (100 - d) - 1) * 100;
    if (!isClean(markup)) return null;

    const correct = pct(round(markup, 2));
    const distractors = [
      pct(round(p + d, 2)),
      pct(round(p + d + (p * d) / 100, 2)),
      pct(round(((100 + p) / (100 - d)) * 100, 2)),
    ];

    return {
      correct,
      distractors,
      en: {
        text: `At what percent above the cost price must an article be marked so that, after allowing a discount of ${num(d)}%, a profit of ${num(p)}% is still earned?`,
        explanation: `Let the cost price be 100. The required selling price = 100 + ${num(p)} = ${num(100 + p)}.\nThe selling price is what remains after a ${num(d)}% discount on the marked price, so it is (100 − ${num(d)}) = ${num(100 - d)}% of the marked price.\nMarked price = ${num(100 + p)} × 100/${num(100 - d)} = ${num(round(100 + markup, 2))}.\nThat is ${num(round(markup, 2))} above the cost price of 100, so the mark-up must be ${correct}.\nSimply adding the discount and the profit to get ${num(p + d)}% is not enough, because the discount is charged on the larger marked price rather than on the cost price.`,
      },
      mr: {
        text: `${num(d)}% सूट दिल्यानंतरही ${num(p)}% नफा मिळावा यासाठी वस्तूची छापील किंमत खरेदी किंमतीपेक्षा किती टक्के अधिक ठेवावी?`,
        explanation: `खरेदी किंमत 100 धरा. आवश्यक विक्री किंमत = 100 + ${num(p)} = ${num(100 + p)}.\nछापील किंमतीवर ${num(d)}% सूट दिल्यानंतर उरणारी रक्कम म्हणजे विक्री किंमत, म्हणजेच ती छापील किंमतीच्या (100 − ${num(d)}) = ${num(100 - d)}% आहे.\nछापील किंमत = ${num(100 + p)} × 100/${num(100 - d)} = ${num(round(100 + markup, 2))}.\nही 100 या खरेदी किंमतीपेक्षा ${num(round(markup, 2))} ने जास्त आहे, म्हणून छापील किंमत ${correct} ने अधिक ठेवावी.\nसूट व नफा नुसते बेरीज करून ${num(p + d)}% घेणे पुरेसे नाही, कारण सूट ही मोठ्या छापील किंमतीवर लागते, खरेदी किंमतीवर नाही.`,
      },
    };
  },
};

export const topicId = "percentage-profit-loss";

export const archetypes = [
  successiveChange,
  markupDiscount,
  sameSpEqualGainLoss,
  spFromLossToProfit,
  successiveDiscount,
  moreThanLessThan,
  cpEqualsSp,
  falseWeight,
  savings,
  examFailBoth,
  profitOnSp,
  consumptionCut,
  extraQuantity,
  markupNeeded,
];
