/**
 * Generator: Analogy (letter groups and number pairs).
 *
 * Letter analogies are emitted only in shapes whose relation the validator can
 * pin down uniquely against a catalogue of standard rules, so no item has two
 * defensible answers. Number analogies show three worked pairs, which is enough
 * to fix a single rule.
 */

import { num } from "../lib/util.mjs";

const CODE_A = "A".charCodeAt(0);
const letterAt = (i) => String.fromCharCode(CODE_A + (((i % 26) + 26) % 26));
const posOf = (ch) => ch.charCodeAt(0) - CODE_A; // 0-based
const rank = (ch) => posOf(ch) + 1; // 1-based, as students count

const WORDS = [
  "LAMP", "BOOK", "STAR", "FROG", "DESK", "RING", "SHIP", "TREE", "WIND", "GOLD",
  "HAND", "LEAF", "MOON", "NOSE", "PARK", "ROAD", "SALT", "TIME", "FISH", "BIRD",
  "CARD", "DOOR", "FIRE", "GATE", "HILL", "KITE", "LION", "MILK", "NAIL", "OVEN",
  "PLUM", "RACE", "SONG", "TANK", "UNIT", "VOTE", "WOLF", "YARD", "ZONE", "BEAM",
  "CLUB", "DRUM", "ECHO", "FARM", "GLOW", "HERB", "IRON", "JADE", "KEEP", "LACE",
];

const PAIRS = WORDS.map((w, i) => [w, WORDS[(i + 11) % WORDS.length]]);

const shiftWord = (w, fn) =>
  [...w].map((ch, i) => letterAt(posOf(ch) + fn(i))).join("");
const reverseWord = (w) => [...w].reverse().join("");
const oppositeWord = (w) => [...w].map((ch) => letterAt(25 - posOf(ch))).join("");

const spell = (w) => [...w].map((ch) => `${ch}(${rank(ch)})`).join(", ");

/**
 * Some letter groups happen to satisfy two standard rules at once — SALT to
 * HZOG is both "opposite letter" and "reverse, then shift by 14". Such an item
 * has no single defensible answer, so it is dropped before it is written out.
 */
function hasOneAnswer(w1, c1, w2) {
  const families = [
    (w) => reverseWord(w),
    (w) => oppositeWord(w),
    (w) => reverseWord(oppositeWord(w)),
    (w) => oppositeWord(reverseWord(w)),
  ];
  for (let k = 0; k < 26; k += 1) {
    families.push((w) => shiftWord(w, () => k));
    families.push((w) => reverseWord(shiftWord(w, () => k)));
  }
  for (let s = 0; s < 26; s += 1) {
    for (let d = -6; d <= 6; d += 1) {
      if (d === 0) continue;
      families.push((w) => shiftWord(w, (i) => s + i * d));
    }
  }
  const answers = new Set();
  for (const f of families) {
    if (f(w1) === c1) answers.add(f(w2));
  }
  return answers.size === 1;
}

const FRAME_EN = "In the following, the second group of letters is related to the first in a certain way. Find the group that completes the pair in the same way.";
const FRAME_MR = "पुढील उदाहरणात दुसरा अक्षरगट पहिल्या अक्षरगटाशी एका विशिष्ट प्रकारे संबंधित आहे. त्याच प्रकारे दुसरी जोडी पूर्ण करणारा अक्षरगट शोधा.";

/* ------------------------------------------------------------------ *
 * 1. Same shift applied to every letter
 * ------------------------------------------------------------------ */
const uniformShift = {
  id: "analogy-uniform-shift",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const k of [2, 3, 4, 5, 6, 7, 8, 9]) {
      for (let i = 0; i < PAIRS.length; i += 1) out.push({ k, pair: i });
    }
    return out;
  },
  make({ k, pair }) {
    const [w1, w2] = PAIRS[pair];
    const c1 = shiftWord(w1, () => k);
    const correct = shiftWord(w2, () => k);
    const distractors = [
      shiftWord(w2, () => k + 1),
      shiftWord(w2, () => k - 1),
      reverseWord(correct),
    ];
    if (new Set([correct, ...distractors]).size !== 4) return null;
    if (!hasOneAnswer(w1, c1, w2)) return null;

    const steps = [...w2]
      .map((ch) => `${ch}(${rank(ch)}) + ${num(k)} = ${letterAt(posOf(ch) + k)}(${rank(letterAt(posOf(ch) + k))})`)
      .join(", ");

    return {
      correct,
      distractors,
      en: {
        text: `${FRAME_EN}\n${w1} : ${c1} :: ${w2} : ?`,
        explanation: `Convert the letters into their alphabet numbers; guessing at letter shapes is what makes these questions feel hard.\n${w1} is ${spell(w1)} and ${c1} is ${spell(c1)}.\nComparing them position by position, every letter has moved forward by the same ${num(k)} places, so the rule is "+${num(k)} to each letter".\nApply that rule to ${w2}: ${steps}.\nThe answer is therefore ${correct}.\nCount forward past Z by wrapping round to A — forgetting the wrap is the single biggest source of wrong options here.`,
      },
      mr: {
        text: `${FRAME_MR}\n${w1} : ${c1} :: ${w2} : ?`,
        explanation: `अक्षरे त्यांच्या वर्णक्रमांकात रूपांतरित करा; नुसत्या अक्षरांकडे पाहून अंदाज लावल्यानेच हे प्रश्न कठीण वाटतात.\n${w1} म्हणजे ${spell(w1)} आणि ${c1} म्हणजे ${spell(c1)}.\nस्थानानुसार तुलना केल्यास प्रत्येक अक्षर तेवढ्याच म्हणजे ${num(k)} जागा पुढे सरकले आहे, म्हणून नियम "प्रत्येक अक्षराला +${num(k)}" असा आहे.\nहाच नियम ${w2} ला लावा: ${steps}.\nम्हणून उत्तर ${correct} आहे.\nZ च्या पुढे मोजताना पुन्हा A पासून सुरुवात करा — हे वळण विसरणे हेच येथील चुकीच्या पर्यायांचे मुख्य कारण असते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 2. Shift that grows along the word
 * ------------------------------------------------------------------ */
const progressiveShift = {
  id: "analogy-progressive-shift",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const [s, d] of [[1, 1], [2, 1], [1, 2], [3, 2], [2, 3], [4, 1], [3, 1], [5, 1], [1, 3]]) {
      for (let i = 0; i < PAIRS.length; i += 2) out.push({ s, d, pair: i });
    }
    return out;
  },
  make({ s, d, pair }) {
    const fn = (i) => s + i * d;
    const [w1, w2] = PAIRS[pair];
    const c1 = shiftWord(w1, fn);
    const correct = shiftWord(w2, fn);
    const distractors = [
      shiftWord(w2, () => s),
      shiftWord(w2, (i) => s + i * (d + 1)),
      shiftWord(w2, (i) => s + (w2.length - 1 - i) * d),
    ];
    if (new Set([correct, ...distractors]).size !== 4) return null;
    if (!hasOneAnswer(w1, c1, w2)) return null;

    const shifts = [...w1].map((_, i) => `+${num(fn(i))}`).join(", ");
    const steps = [...w2]
      .map((ch, i) => `${ch}(${rank(ch)}) + ${num(fn(i))} = ${letterAt(posOf(ch) + fn(i))}`)
      .join(", ");

    return {
      correct,
      distractors,
      en: {
        text: `${FRAME_EN}\n${w1} : ${c1} :: ${w2} : ?`,
        explanation: `Line the two groups up letter by letter and work out each shift separately — here they are not all the same.\n${w1} is ${spell(w1)} and ${c1} is ${spell(c1)}.\nThe shifts turn out to be ${shifts}, so the movement grows by ${num(d)} at every step, starting from ${num(s)}.\nApply the same growing pattern to ${w2}: ${steps}.\nThat gives ${correct}.\nAlways check every position before deciding on a rule; a single equal-looking pair at the start tempts you into assuming a constant shift.`,
      },
      mr: {
        text: `${FRAME_MR}\n${w1} : ${c1} :: ${w2} : ?`,
        explanation: `दोन्ही गट अक्षरागणिक समोरासमोर मांडा आणि प्रत्येक सरकाव स्वतंत्रपणे काढा — येथे सर्व सरकाव सारखे नाहीत.\n${w1} म्हणजे ${spell(w1)} आणि ${c1} म्हणजे ${spell(c1)}.\nसरकाव ${shifts} असे येतात, म्हणजे ${num(s)} पासून सुरुवात होऊन प्रत्येक पायरीला सरकाव ${num(d)} ने वाढतो.\nतोच वाढता नियम ${w2} ला लावा: ${steps}.\nत्यातून ${correct} मिळते.\nनियम ठरवण्यापूर्वी प्रत्येक स्थान तपासा; सुरुवातीची एखादी सारखी दिसणारी जोडी सरकाव स्थिर आहे असे गृहीत धरायला भाग पाडते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 3. The group written backwards
 * ------------------------------------------------------------------ */
const reversal = {
  id: "analogy-reversal",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (let i = 0; i < PAIRS.length; i += 1) out.push({ pair: i });
    return out;
  },
  make({ pair }) {
    const [w1, w2] = PAIRS[pair];
    const c1 = reverseWord(w1);
    const correct = reverseWord(w2);
    if (correct === w2) return null;
    const distractors = [
      shiftWord(w2, () => 1),
      oppositeWord(w2),
      reverseWord(shiftWord(w2, () => 1)),
    ];
    if (new Set([correct, ...distractors]).size !== 4) return null;
    if (!hasOneAnswer(w1, c1, w2)) return null;

    return {
      correct,
      distractors,
      en: {
        text: `${FRAME_EN}\n${w1} : ${c1} :: ${w2} : ?`,
        explanation: `Before reaching for alphabet numbers, check whether the same letters have simply been rearranged.\n${w1} and ${c1} use exactly the same four letters, so no letter has been shifted at all — only the order has changed.\nReading ${w1} from the last letter to the first gives ${c1}, which confirms the rule is a straight reversal.\nReversing ${w2} the same way gives ${correct}.\nSo the answer is ${correct}.\nWhen the pair contains the same set of letters, the rule is always a rearrangement; computing shifts in that case wastes a minute and usually produces a wrong option.`,
      },
      mr: {
        text: `${FRAME_MR}\n${w1} : ${c1} :: ${w2} : ?`,
        explanation: `वर्णक्रमांक काढायला सुरुवात करण्यापूर्वी तीच अक्षरे नुसती फेरमांडणी करून लिहिली आहेत का ते तपासा.\n${w1} व ${c1} यांत नेमकी तीच चार अक्षरे आहेत, म्हणजे एकही अक्षर सरकलेले नाही — फक्त क्रम बदलला आहे.\n${w1} शेवटच्या अक्षरापासून सुरुवातीकडे वाचल्यास ${c1} मिळते, यावरून नियम म्हणजे नुसते उलटे लिहिणे हे नक्की होते.\n${w2} तसेच उलटे लिहिल्यास ${correct} मिळते.\nम्हणून उत्तर ${correct} आहे.\nजोडीत तीच अक्षरे असतील तेव्हा नियम नेहमी फेरमांडणीचाच असतो; अशा वेळी सरकाव मोजत बसणे वेळ वाया घालवते आणि बहुधा चुकीचा पर्याय निवडायला लावते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 4. Each letter replaced by its opposite in the alphabet
 * ------------------------------------------------------------------ */
const opposite = {
  id: "analogy-opposite-letter",
  difficulty: "hard",
  cases() {
    const out = [];
    for (let i = 0; i < PAIRS.length; i += 1) out.push({ pair: i });
    return out;
  },
  make({ pair }) {
    const [w1, w2] = PAIRS[pair];
    const c1 = oppositeWord(w1);
    const correct = oppositeWord(w2);
    if (correct === w2) return null;
    const distractors = [reverseWord(w2), shiftWord(w2, () => 13), reverseWord(correct)];
    if (new Set([correct, ...distractors]).size !== 4) return null;
    if (!hasOneAnswer(w1, c1, w2)) return null;

    const steps = [...w2]
      .map((ch) => `${ch}(${rank(ch)}) becomes ${letterAt(25 - posOf(ch))}(${27 - rank(ch)})`)
      .join(", ");

    return {
      correct,
      distractors,
      en: {
        text: `${FRAME_EN}\n${w1} : ${c1} :: ${w2} : ?`,
        explanation: `Write the alphabet ranks of both groups and look at what each pair of numbers adds up to.\n${w1} is ${spell(w1)} and ${c1} is ${spell(c1)}.\nEvery matching pair of ranks adds up to 27, which means each letter has been replaced by its opposite counted from the other end of the alphabet: A with Z, B with Y, and so on.\nApplying the same rule to ${w2}: ${steps}.\nSo the answer is ${correct}.\nThe test for this rule is the constant total of 27; a constant DIFFERENCE would have meant an ordinary shift instead.`,
      },
      mr: {
        text: `${FRAME_MR}\n${w1} : ${c1} :: ${w2} : ?`,
        explanation: `दोन्ही गटांचे वर्णक्रमांक लिहा आणि प्रत्येक जोडीची बेरीज किती होते ते पाहा.\n${w1} म्हणजे ${spell(w1)} आणि ${c1} म्हणजे ${spell(c1)}.\nप्रत्येक जुळणाऱ्या क्रमांकांची बेरीज 27 येते, म्हणजे प्रत्येक अक्षराच्या जागी वर्णमालेच्या दुसऱ्या टोकाकडून मोजलेले विरुद्ध अक्षर आले आहे: A च्या जागी Z, B च्या जागी Y, याप्रमाणे.\nहाच नियम ${w2} ला लावल्यास: ${steps}.\nम्हणून उत्तर ${correct} आहे.\nया नियमाची खूण म्हणजे 27 ही स्थिर बेरीज; स्थिर वजाबाकी आली असती तर तो साधा सरकाव ठरला असता.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 5. Number pairs following one rule
 * ------------------------------------------------------------------ */
const NUMBER_RULES = [
  { f: (n) => n * n + 1, en: "square the number and add 1", mr: "संख्येचा वर्ग करून त्यात 1 मिळवणे", show: (n) => `${num(n)}² + 1` },
  { f: (n) => n * n - 1, en: "square the number and subtract 1", mr: "संख्येचा वर्ग करून त्यातून 1 वजा करणे", show: (n) => `${num(n)}² − 1` },
  { f: (n) => n * n + n, en: "square the number and add the number itself", mr: "संख्येचा वर्ग करून त्यात तीच संख्या मिळवणे", show: (n) => `${num(n)}² + ${num(n)}` },
  { f: (n) => n * n - n, en: "square the number and subtract the number itself", mr: "संख्येचा वर्ग करून त्यातून तीच संख्या वजा करणे", show: (n) => `${num(n)}² − ${num(n)}` },
  { f: (n) => n * n * n, en: "cube the number", mr: "संख्येचा घन करणे", show: (n) => `${num(n)}³` },
  { f: (n) => n * n * n + n, en: "cube the number and add the number itself", mr: "संख्येचा घन करून त्यात तीच संख्या मिळवणे", show: (n) => `${num(n)}³ + ${num(n)}` },
  { f: (n) => 2 * n * n, en: "square the number and double it", mr: "संख्येचा वर्ग करून तो दुप्पट करणे", show: (n) => `2 × ${num(n)}²` },
  { f: (n) => n * n + 2 * n, en: "square the number and add twice the number", mr: "संख्येचा वर्ग करून त्यात संख्येच्या दुप्पट मिळवणे", show: (n) => `${num(n)}² + 2 × ${num(n)}` },
  { f: (n) => n * n * n - n, en: "cube the number and subtract the number itself", mr: "संख्येचा घन करून त्यातून तीच संख्या वजा करणे", show: (n) => `${num(n)}³ − ${num(n)}` },
  { f: (n) => 3 * n * n, en: "square the number and multiply by 3", mr: "संख्येचा वर्ग करून तो तिप्पट करणे", show: (n) => `3 × ${num(n)}²` },
  { f: (n) => n * (n + 1), en: "multiply the number by the next integer", mr: "संख्येला पुढच्या पूर्णांकाशी गुणणे", show: (n) => `${num(n)} × ${num(n + 1)}` },
  { f: (n) => n * (n - 1), en: "multiply the number by the previous integer", mr: "संख्येला मागील पूर्णांकाशी गुणणे", show: (n) => `${num(n)} × ${num(n - 1)}` },
];

const numberRule = {
  id: "analogy-number-rule",
  difficulty: "hard",
  cases() {
    const out = [];
    for (let r = 0; r < NUMBER_RULES.length; r += 1) {
      for (const start of [2, 3, 4, 5, 6, 7, 8]) out.push({ r, start });
    }
    return out;
  },
  make({ r, start }) {
    const rule = NUMBER_RULES[r];
    const xs = [start, start + 2, start + 4];
    const target = start + 6;
    const ys = xs.map(rule.f);
    const answer = rule.f(target);
    if (answer > 5000) return null;

    const correct = num(answer);
    const distractors = [num(answer + target), num(answer - target), num(rule.f(target + 1))];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    const pairsEn = xs.map((x, i) => `(${num(x)}, ${num(ys[i])})`).join(", ");
    const checks = xs
      .map((x, i) => `${rule.show(x)} = ${num(ys[i])}`)
      .join("; ");

    return {
      correct,
      distractors,
      en: {
        text: `In each of the pairs ${pairsEn} the second number is obtained from the first by the same rule. What number should replace the question mark in (${num(target)}, ?)`,
        explanation: `Test the pairs against squares and cubes before trying anything clever — competitive papers almost always use one of those.\nCompare each second number with the square of the first: for ${num(xs[0])} the square is ${num(xs[0] * xs[0])} while the pair shows ${num(ys[0])}, which points at ${rule.en}.\nCheck that guess on all three pairs: ${checks}. It holds every time, so the rule is settled.\nNow apply it to ${num(target)}: ${rule.show(target)} = ${num(answer)}.\nSo the question mark stands for ${num(answer)}.\nA rule that fits only the first pair is worthless; confirming it on the remaining pairs is what separates a safe answer from a guess.`,
      },
      mr: {
        text: `${pairsEn} या प्रत्येक जोडीत दुसरी संख्या पहिल्या संख्येपासून एकाच नियमाने मिळवली आहे. तर (${num(target)}, ?) या जोडीत प्रश्नचिन्हाच्या जागी कोणती संख्या येईल?`,
        explanation: `काहीतरी क्लिष्ट शोधण्यापूर्वी वर्ग व घन यांच्याशी जोड्या पडताळून पाहा — स्पर्धा परीक्षांत बहुधा यांपैकीच एक नियम असतो.\nप्रत्येक दुसऱ्या संख्येची पहिल्या संख्येच्या वर्गाशी तुलना करा: ${num(xs[0])} चा वर्ग ${num(xs[0] * xs[0])} आहे, तर जोडीत ${num(ys[0])} दिसते, यावरून ${rule.mr} असा नियम सुचतो.\nहा अंदाज तिन्ही जोड्यांवर तपासा: ${checks}. तो प्रत्येक वेळी जुळतो, म्हणून नियम पक्का होतो.\nआता तोच नियम ${num(target)} ला लावा: ${rule.show(target)} = ${num(answer)}.\nम्हणून प्रश्नचिन्हाच्या जागी ${num(answer)} येईल.\nफक्त पहिल्या जोडीला जुळणारा नियम निरुपयोगी असतो; उरलेल्या जोड्यांवर तो तपासणे हेच अंदाज व खात्रीशीर उत्तर यांतील अंतर आहे.`,
      },
    };
  },
};

export const topicId = "analogy";

export const archetypes = [uniformShift, progressiveShift, reversal, opposite, numberRule];
