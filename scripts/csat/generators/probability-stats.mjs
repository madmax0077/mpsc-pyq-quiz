/**
 * Generator: Probability & Statistics.
 *
 * Probability answers are given as reduced fractions like "5/12", which read
 * identically in both languages.
 */

import { isClean, num, round } from "../lib/util.mjs";
import { gcd } from "../lib/math.mjs";

const frac = (a, b) => {
  const g = gcd(a, b);
  const n = a / g;
  const d = b / g;
  return d === 1 ? String(n) : `${n}/${d}`;
};

const nCr = (n, r) => {
  if (r < 0 || r > n) return 0;
  let v = 1;
  for (let i = 1; i <= r; i += 1) v = (v * (n - r + i)) / i;
  return Math.round(v);
};

const factorial = (n) => {
  let v = 1;
  for (let i = 2; i <= n; i += 1) v *= i;
  return v;
};

/* ------------------------------------------------------------------ *
 * 1. Two dice
 * ------------------------------------------------------------------ */
const twoDice = {
  id: "two-dice",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const target of [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
      for (const mode of ["equals", "atleast", "atmost"]) out.push({ target, mode });
    }
    return out;
  },
  make({ target, mode }) {
    let favourable = 0;
    const pairs = [];
    for (let a = 1; a <= 6; a += 1) {
      for (let b = 1; b <= 6; b += 1) {
        const sum = a + b;
        const hit =
          mode === "equals" ? sum === target : mode === "atleast" ? sum >= target : sum <= target;
        if (hit) {
          favourable += 1;
          if (pairs.length < 8) pairs.push(`(${a},${b})`);
        }
      }
    }
    if (favourable === 0 || favourable === 36) return null;

    const correct = frac(favourable, 36);
    const distractors = [frac(favourable, 12), frac(36 - favourable, 36), frac(favourable + 2, 36)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    const qEn =
      mode === "equals"
        ? `Two dice are thrown together. What is the probability that the sum of the numbers on them is exactly ${num(target)}?`
        : mode === "atleast"
          ? `Two dice are thrown together. What is the probability that the sum of the numbers on them is ${num(target)} or more?`
          : `Two dice are thrown together. What is the probability that the sum of the numbers on them is ${num(target)} or less?`;
    const qMr =
      mode === "equals"
        ? `दोन फासे एकत्र टाकले असता त्यांवरील संख्यांची बेरीज नेमकी ${num(target)} येण्याची संभाव्यता किती?`
        : mode === "atleast"
          ? `दोन फासे एकत्र टाकले असता त्यांवरील संख्यांची बेरीज ${num(target)} किंवा त्याहून अधिक येण्याची संभाव्यता किती?`
          : `दोन फासे एकत्र टाकले असता त्यांवरील संख्यांची बेरीज ${num(target)} किंवा त्याहून कमी येण्याची संभाव्यता किती?`;

    const condEn =
      mode === "equals"
        ? `add up to exactly ${num(target)}`
        : mode === "atleast"
          ? `add up to ${num(target)} or more`
          : `add up to ${num(target)} or less`;
    const condMr =
      mode === "equals"
        ? `बेरीज नेमकी ${num(target)} येते`
        : mode === "atleast"
          ? `बेरीज ${num(target)} किंवा अधिक येते`
          : `बेरीज ${num(target)} किंवा कमी येते`;

    return {
      correct,
      distractors,
      en: {
        text: qEn,
        explanation: `Each die can show 6 faces, so throwing two gives 6 × 6 = 36 equally likely outcomes. Treat the dice as distinguishable — (2,3) and (3,2) are separate outcomes.\nCount the outcomes that ${condEn}: ${pairs.join(", ")}${favourable > pairs.length ? " and so on" : ""}.\nThere are ${num(favourable)} such outcomes in all.\nProbability = favourable ÷ total = ${num(favourable)}/36 = ${correct}.\nThe commonest error is treating (2,3) and (3,2) as one outcome, which undercounts the numerator.`,
      },
      mr: {
        text: qMr,
        explanation: `प्रत्येक फाशावर 6 बाजू असतात, म्हणून दोन फासे टाकल्यास 6 × 6 = 36 समसंभाव्य निष्पत्ती मिळतात. दोन्ही फासे वेगळे मानावेत — (2,3) व (3,2) या स्वतंत्र निष्पत्ती आहेत.\nज्यांची ${condMr} अशा निष्पत्ती मोजा: ${pairs.join(", ")}${favourable > pairs.length ? " वगैरे" : ""}.\nअशा एकूण ${num(favourable)} निष्पत्ती आहेत.\nसंभाव्यता = अनुकूल ÷ एकूण = ${num(favourable)}/36 = ${correct}.\n(2,3) व (3,2) एकच मानणे ही नेहमीची चूक असून त्यामुळे अंश कमी मोजला जातो.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 2. Drawing balls from a bag
 * ------------------------------------------------------------------ */
const ballsFromBag = {
  id: "balls-from-bag",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const r of [3, 4, 5, 6, 7, 8]) {
      for (const b of [2, 3, 4, 5, 6]) {
        for (const g of [2, 3, 4, 5]) {
          for (const want of ["one-red", "two-red", "one-blue"]) out.push({ r, b, g, want });
        }
      }
    }
    return out;
  },
  make({ r, b, g, want }) {
    const total = r + b + g;
    if (want === "one-red") {
      const correct = frac(r, total);
      const distractors = [frac(b, total), frac(g, total), frac(r + b, total)];
      if (new Set([correct, ...distractors]).size !== 4) return null;
      return {
        correct,
        distractors,
        en: {
          text: `A bag contains ${num(r)} red, ${num(b)} blue and ${num(g)} green balls. One ball is drawn at random. What is the probability that it is red?`,
          explanation: `Total number of balls = ${num(r)} + ${num(b)} + ${num(g)} = ${num(total)}.\nEvery ball is equally likely to be drawn, so each of the ${num(total)} outcomes carries the same weight.\nFavourable outcomes (a red ball) = ${num(r)}.\nProbability = ${num(r)}/${num(total)} = ${correct}.\nThe denominator must be the TOTAL number of balls, not the number of colours — a slip that turns an easy mark into a lost one.`,
        },
        mr: {
          text: `एका पिशवीत ${num(r)} लाल, ${num(b)} निळे व ${num(g)} हिरवे चेंडू आहेत. त्यातून एक चेंडू यादृच्छिकपणे काढला. तो लाल असण्याची संभाव्यता किती?`,
          explanation: `एकूण चेंडू = ${num(r)} + ${num(b)} + ${num(g)} = ${num(total)}.\nप्रत्येक चेंडू निघण्याची शक्यता सारखीच असते, म्हणून ${num(total)} पैकी प्रत्येक निष्पत्तीचे वजन समान.\nअनुकूल निष्पत्ती (लाल चेंडू) = ${num(r)}.\nसंभाव्यता = ${num(r)}/${num(total)} = ${correct}.\nछेदात एकूण चेंडूंची संख्या यावी, रंगांची संख्या नव्हे — या चुकीमुळे सोपा गुण हातचा जातो.`,
        },
      };
    }
    if (want === "one-blue") {
      const correct = frac(b, total);
      const distractors = [frac(r, total), frac(g, total), frac(b + g, total)];
      if (new Set([correct, ...distractors]).size !== 4) return null;
      return {
        correct,
        distractors,
        en: {
          text: `A bag contains ${num(r)} red, ${num(b)} blue and ${num(g)} green balls. One ball is drawn at random. What is the probability that it is blue?`,
          explanation: `Total number of balls = ${num(r)} + ${num(b)} + ${num(g)} = ${num(total)}.\nEvery ball is equally likely to be drawn.\nFavourable outcomes (a blue ball) = ${num(b)}.\nProbability = ${num(b)}/${num(total)} = ${correct}.\nKeep the denominator as the total number of balls.`,
        },
        mr: {
          text: `एका पिशवीत ${num(r)} लाल, ${num(b)} निळे व ${num(g)} हिरवे चेंडू आहेत. त्यातून एक चेंडू यादृच्छिकपणे काढला. तो निळा असण्याची संभाव्यता किती?`,
          explanation: `एकूण चेंडू = ${num(r)} + ${num(b)} + ${num(g)} = ${num(total)}.\nप्रत्येक चेंडू निघण्याची शक्यता सारखीच असते.\nअनुकूल निष्पत्ती (निळा चेंडू) = ${num(b)}.\nसंभाव्यता = ${num(b)}/${num(total)} = ${correct}.\nछेदात एकूण चेंडूंची संख्या ठेवा.`,
        },
      };
    }
    const fav = nCr(r, 2);
    const all = nCr(total, 2);
    if (fav === 0) return null;
    const correct = frac(fav, all);
    const distractors = [frac(nCr(b, 2) || 1, all), frac(r, total), frac(fav + 1, all)];
    if (new Set([correct, ...distractors]).size !== 4) return null;
    return {
      correct,
      distractors,
      en: {
        text: `A bag contains ${num(r)} red, ${num(b)} blue and ${num(g)} green balls. Two balls are drawn at random together. What is the probability that both are red?`,
        explanation: `Total number of balls = ${num(total)}.\nDrawing two balls together means order does not matter, so use combinations.\nTotal ways to choose any 2 balls = C(${num(total)}, 2) = (${num(total)} × ${num(total - 1)})/2 = ${num(all)}.\nWays to choose 2 red balls out of ${num(r)} = C(${num(r)}, 2) = (${num(r)} × ${num(r - 1)})/2 = ${num(fav)}.\nProbability = ${num(fav)}/${num(all)} = ${correct}.\nBecause the balls are drawn together (without replacement), the second draw has one fewer ball available — that is why it is ${num(r)} × ${num(r - 1)} and not ${num(r)} × ${num(r)}.`,
      },
      mr: {
        text: `एका पिशवीत ${num(r)} लाल, ${num(b)} निळे व ${num(g)} हिरवे चेंडू आहेत. त्यातून एकाच वेळी दोन चेंडू यादृच्छिकपणे काढले. दोन्ही लाल असण्याची संभाव्यता किती?`,
        explanation: `एकूण चेंडू = ${num(total)}.\nदोन चेंडू एकाच वेळी काढल्याने क्रम महत्त्वाचा नाही, म्हणून संयोग (combinations) वापरा.\nकोणतेही 2 चेंडू निवडण्याचे एकूण मार्ग = C(${num(total)}, 2) = (${num(total)} × ${num(total - 1)})/2 = ${num(all)}.\n${num(r)} लाल चेंडूंपैकी 2 निवडण्याचे मार्ग = C(${num(r)}, 2) = (${num(r)} × ${num(r - 1)})/2 = ${num(fav)}.\nसंभाव्यता = ${num(fav)}/${num(all)} = ${correct}.\nचेंडू एकत्र काढले जात असल्याने (पुन्हा न ठेवता) दुसऱ्या वेळी एक चेंडू कमी उपलब्ध असतो — म्हणूनच ${num(r)} × ${num(r - 1)} येते, ${num(r)} × ${num(r)} नाही.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 3. Cards
 * ------------------------------------------------------------------ */
const cards = {
  id: "cards-draw",
  difficulty: "moderate",
  cases() {
    return [
      { kind: "king", fav: 4, en: "a king", mr: "राजा (king)" },
      { kind: "queen", fav: 4, en: "a queen", mr: "राणी (queen)" },
      { kind: "jack", fav: 4, en: "a jack", mr: "गुलाम (jack)" },
      { kind: "heart", fav: 13, en: "a heart", mr: "बदाम (heart)" },
      { kind: "diamond", fav: 13, en: "a diamond", mr: "चौकट (diamond)" },
      { kind: "club", fav: 13, en: "a club", mr: "किलवर (club)" },
      { kind: "face", fav: 12, en: "a face card", mr: "चित्र असलेले पान (face card)" },
      { kind: "red", fav: 26, en: "a red card", mr: "लाल रंगाचे पान" },
      { kind: "black", fav: 26, en: "a black card", mr: "काळ्या रंगाचे पान" },
      { kind: "ace", fav: 4, en: "an ace", mr: "एक्का (ace)" },
      { kind: "spade", fav: 13, en: "a spade", mr: "इस्पिक (spade)" },
      { kind: "red-king", fav: 2, en: "a red king", mr: "लाल रंगाचा राजा" },
      { kind: "black-king", fav: 2, en: "a black king", mr: "काळ्या रंगाचा राजा" },
      { kind: "black-face", fav: 6, en: "a black face card", mr: "काळ्या रंगाचे चित्र असलेले पान" },
      { kind: "red-face", fav: 6, en: "a red face card", mr: "लाल रंगाचे चित्र असलेले पान" },
      { kind: "numbered", fav: 36, en: "a numbered card (2 to 10)", mr: "क्रमांक असलेले पान (2 ते 10)" },
    ];
  },
  make({ fav, en, mr }) {
    const correct = frac(fav, 52);
    const distractors = [frac(52 - fav, 52), frac(fav, 26), frac(fav * 2, 52)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `One card is drawn at random from a well-shuffled pack of 52 playing cards. What is the probability that the card drawn is ${en}?`,
        explanation: `A standard pack has 52 cards: 4 suits of 13 each, with 26 red (hearts and diamonds) and 26 black (spades and clubs). The 12 face cards are the jacks, queens and kings.\nTotal possible outcomes = 52, all equally likely because the pack is well shuffled.\nFavourable outcomes = ${num(fav)}.\nProbability = ${num(fav)}/52 = ${correct}.\nKnowing the composition of the pack by heart is what makes these questions instant.`,
      },
      mr: {
        text: `52 पानांच्या व्यवस्थित पिसलेल्या कॅटातून एक पान यादृच्छिकपणे काढले. काढलेले पान ${mr} असण्याची संभाव्यता किती?`,
        explanation: `प्रमाणित कॅटात 52 पाने असतात: 4 प्रकार, प्रत्येकी 13 पाने; त्यात 26 लाल (बदाम व चौकट) व 26 काळी (इस्पिक व किलवर). चित्र असलेली 12 पाने म्हणजे गुलाम, राणी व राजा.\nएकूण शक्य निष्पत्ती = 52, आणि कॅट व्यवस्थित पिसलेला असल्याने सर्व समसंभाव्य.\nअनुकूल निष्पत्ती = ${num(fav)}.\nसंभाव्यता = ${num(fav)}/52 = ${correct}.\nकॅटाची रचना पाठ असल्यास अशी उदाहरणे क्षणात सुटतात.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 4. Coins
 * ------------------------------------------------------------------ */
const coins = {
  id: "coin-toss",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const n of [2, 3, 4, 5, 6]) {
      for (const k of [0, 1, 2, 3, 4, 5]) {
        for (const mode of ["exactly", "atleast"]) {
          if (k <= n) out.push({ n, k, mode });
        }
      }
    }
    return out;
  },
  make({ n, k, mode }) {
    const total = 2 ** n;
    let fav = 0;
    if (mode === "exactly") {
      fav = nCr(n, k);
    } else {
      for (let i = k; i <= n; i += 1) fav += nCr(n, i);
    }
    if (fav === 0 || fav === total) return null;

    const correct = frac(fav, total);
    const distractors = [frac(total - fav, total), frac(nCr(n, k), total * 2), frac(k, n)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    const qEn =
      mode === "exactly"
        ? `${num(n)} fair coins are tossed together. What is the probability of getting exactly ${num(k)} heads?`
        : `${num(n)} fair coins are tossed together. What is the probability of getting at least ${num(k)} heads?`;
    const qMr =
      mode === "exactly"
        ? `${num(n)} नाणी एकत्र उडवली असता नेमकी ${num(k)} छापे येण्याची संभाव्यता किती?`
        : `${num(n)} नाणी एकत्र उडवली असता किमान ${num(k)} छापे येण्याची संभाव्यता किती?`;

    const countEn =
      mode === "exactly"
        ? `Number of ways of getting exactly ${num(k)} heads out of ${num(n)} tosses = C(${num(n)}, ${num(k)}) = ${num(fav)}.`
        : `"At least ${num(k)}" means ${num(k)} or more, so add the counts: ${Array.from({ length: n - k + 1 }, (_, i) => `C(${num(n)}, ${num(k + i)}) = ${num(nCr(n, k + i))}`).join(" plus ")}, giving ${num(fav)} in all.`;
    const countMr =
      mode === "exactly"
        ? `${num(n)} नाण्यांपैकी नेमकी ${num(k)} छापे येण्याचे मार्ग = C(${num(n)}, ${num(k)}) = ${num(fav)}.`
        : `"किमान ${num(k)}" म्हणजे ${num(k)} किंवा अधिक, म्हणून बेरीज करा: ${Array.from({ length: n - k + 1 }, (_, i) => `C(${num(n)}, ${num(k + i)}) = ${num(nCr(n, k + i))}`).join(" अधिक ")}, एकूण ${num(fav)}.`;

    return {
      correct,
      distractors,
      en: {
        text: qEn,
        explanation: `Each coin lands in one of 2 ways, so ${num(n)} coins give 2^${num(n)} = ${num(total)} equally likely outcomes.\n${countEn}\nProbability = ${num(fav)}/${num(total)} = ${correct}.\nUse combinations rather than listing outcomes — C(n, k) counts exactly how many arrangements have k heads among n tosses.`,
      },
      mr: {
        text: qMr,
        explanation: `प्रत्येक नाणे 2 प्रकारे पडू शकते, म्हणून ${num(n)} नाण्यांच्या 2^${num(n)} = ${num(total)} समसंभाव्य निष्पत्ती होतात.\n${countMr}\nसंभाव्यता = ${num(fav)}/${num(total)} = ${correct}.\nसर्व निष्पत्ती लिहीत बसण्याऐवजी संयोग वापरा — C(n, k) हे n पैकी k छापे येण्याचे मार्ग नेमके मोजते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 5. Selecting a committee
 * ------------------------------------------------------------------ */
const committee = {
  id: "committee-selection",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const m of [5, 6, 7, 8, 9, 10]) {
      for (const w of [3, 4, 5, 6]) {
        for (const pickM of [1, 2, 3, 4]) {
          for (const pickW of [1, 2, 3]) {
            if (pickM <= m && pickW <= w) out.push({ m, w, pickM, pickW });
          }
        }
      }
    }
    return out;
  },
  make({ m, w, pickM, pickW }) {
    const ways = nCr(m, pickM) * nCr(w, pickW);
    if (ways === 0) return null;

    const correct = num(ways);
    const distractors = [
      num(nCr(m, pickM) + nCr(w, pickW)),
      num(nCr(m + w, pickM + pickW)),
      num(nCr(m, pickW) * nCr(w, pickM) || ways + 3),
    ];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    const womenWord = pickW === 1 ? "woman" : "women";
    const menWord = pickM === 1 ? "man" : "men";
    const womenMr = pickW === 1 ? "स्त्री" : "स्त्रिया";

    return {
      correct,
      distractors,
      en: {
        text: `In how many ways can a committee of ${num(pickM)} ${menWord} and ${num(pickW)} ${womenWord} be formed from ${num(m)} men and ${num(w)} women?`,
        explanation: `A committee has no ranking inside it, so order does not matter and we use combinations.\nChoosing ${num(pickM)} ${menWord} from ${num(m)}: C(${num(m)}, ${num(pickM)}) = ${num(nCr(m, pickM))} ways.\nChoosing ${num(pickW)} ${womenWord} from ${num(w)}: C(${num(w)}, ${num(pickW)}) = ${num(nCr(w, pickW))} ways.\nEvery choice of men can pair with every choice of women, so MULTIPLY: ${num(nCr(m, pickM))} × ${num(nCr(w, pickW))} = ${num(ways)}.\nAdding the two would give ${num(nCr(m, pickM) + nCr(w, pickW))} — addition is for "either/or" situations, multiplication for "this AND that".`,
      },
      mr: {
        text: `${num(m)} पुरुष व ${num(w)} स्त्रिया यांच्यामधून ${num(pickM)} पुरुष व ${num(pickW)} ${womenMr} यांची समिती किती प्रकारे तयार करता येईल?`,
        explanation: `समितीत अंतर्गत क्रम नसतो, म्हणून क्रम महत्त्वाचा नाही व संयोग वापरतात.\n${num(m)} पुरुषांपैकी ${num(pickM)} निवडणे: C(${num(m)}, ${num(pickM)}) = ${num(nCr(m, pickM))} प्रकारे.\n${num(w)} स्त्रियांपैकी ${num(pickW)} निवडणे: C(${num(w)}, ${num(pickW)}) = ${num(nCr(w, pickW))} प्रकारे.\nपुरुषांची प्रत्येक निवड स्त्रियांच्या प्रत्येक निवडीशी जोडली जाऊ शकते, म्हणून गुणाकार करा: ${num(nCr(m, pickM))} × ${num(nCr(w, pickW))} = ${num(ways)}.\nबेरीज केल्यास ${num(nCr(m, pickM) + nCr(w, pickW))} येते — बेरीज "किंवा" साठी तर गुणाकार "आणि" साठी वापरतात.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 6. Arranging the letters of a word
 * ------------------------------------------------------------------ */
const arrangements = {
  id: "letter-arrangements",
  difficulty: "hard",
  cases() {
    const words = [
      "LEADER", "SCHOOL", "BANANA", "PENCIL", "LETTER", "GARDEN", "SUCCESS",
      "MONDAY", "ARRANGE", "BALLOON", "COMMITTEE", "MISSISSIPPI", "MATHEMATICS",
      "ASSASSINATION", "CALCUTTA", "INSTITUTE", "EXPERIMENT", "DAUGHTER",
      "FATHER", "SISTER", "BROTHER", "ACCOUNT", "BOOKKEEP", "PARALLEL",
      "APPLE", "ORANGE", "TEACHER", "STUDENT", "NUMBER", "PATTERN",
    ];
    return words.map((word) => {
      const counts = new Map();
      for (const ch of word) counts.set(ch, (counts.get(ch) || 0) + 1);
      const repeats = [...counts.values()].filter((c) => c > 1).sort((a, b) => b - a);
      return { word, letters: word.length, repeats };
    });
  },
  make({ word, letters, repeats }) {
    const denom = repeats.reduce((acc, r) => acc * factorial(r), 1) || 1;
    const ways = factorial(letters) / denom;
    if (!Number.isInteger(ways)) return null;

    const correct = num(ways);
    const distractors = [num(factorial(letters)), num(round(ways / 2, 0)), num(factorial(letters - 1))];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    const repeatEn = repeats.length
      ? `The letters are not all distinct, and repeated letters cannot be told apart, so divide by the factorial of each repeat count: ${repeats.map((r) => `${num(r)}!`).join(" × ")} = ${num(denom)}.`
      : `All ${num(letters)} letters are distinct, so there is nothing to divide by.`;
    const repeatMr = repeats.length
      ? `सर्व अक्षरे वेगळी नाहीत, आणि पुनरावृत्त अक्षरे एकमेकांपासून ओळखता येत नाहीत, म्हणून प्रत्येक पुनरावृत्तीच्या क्रमगुणिताने भागा: ${repeats.map((r) => `${num(r)}!`).join(" × ")} = ${num(denom)}.`
      : `सर्व ${num(letters)} अक्षरे वेगवेगळी आहेत, म्हणून कशानेही भागण्याची गरज नाही.`;

    return {
      correct,
      distractors,
      en: {
        text: `In how many different ways can the letters of the word ${word} be arranged?`,
        explanation: `The word ${word} has ${num(letters)} letters.\nIf every letter were distinct there would be ${num(letters)}! = ${num(factorial(letters))} arrangements.\n${repeatEn}\nNumber of arrangements = ${num(factorial(letters))} ÷ ${num(denom)} = ${num(ways)}.\nSwapping two identical letters produces the same word, which is exactly why the division is needed.`,
      },
      mr: {
        text: `${word} या शब्दातील अक्षरांची पुनर्रचना किती वेगवेगळ्या प्रकारे करता येईल?`,
        explanation: `${word} या शब्दात ${num(letters)} अक्षरे आहेत.\nसर्व अक्षरे वेगळी असती तर ${num(letters)}! = ${num(factorial(letters))} रचना झाल्या असत्या.\n${repeatMr}\nरचनांची संख्या = ${num(factorial(letters))} ÷ ${num(denom)} = ${num(ways)}.\nदोन सारखी अक्षरे अदलाबदल केल्यास तोच शब्द तयार होतो, म्हणूनच हा भागाकार आवश्यक ठरतो.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 7. Mean, median and mode
 * ------------------------------------------------------------------ */
const centralTendency = {
  id: "central-tendency",
  difficulty: "moderate",
  cases() {
    const out = [];
    const sets = [
      [4, 7, 7, 9, 13], [2, 5, 5, 8, 10], [6, 8, 8, 11, 17], [3, 3, 7, 9, 13],
      [5, 9, 11, 11, 14], [12, 15, 15, 18, 25], [7, 7, 10, 14, 22], [1, 4, 4, 6, 10],
      [8, 11, 11, 16, 19], [6, 6, 9, 12, 17], [10, 13, 13, 16, 23], [2, 6, 6, 9, 12],
      [9, 12, 12, 15, 21], [3, 8, 8, 10, 16], [11, 14, 14, 17, 24], [5, 5, 9, 12, 18],
      [4, 6, 6, 10, 14], [8, 8, 13, 15, 21], [1, 5, 5, 9, 15], [7, 10, 10, 13, 20],
      [2, 2, 8, 11, 17], [9, 9, 12, 16, 22], [4, 9, 9, 12, 16], [6, 10, 10, 14, 20],
    ];
    for (const data of sets) {
      for (const want of ["mean", "median", "mode"]) out.push({ data, want });
    }
    return out;
  },
  make({ data, want }) {
    const sorted = [...data].sort((a, b) => a - b);
    const sum = sorted.reduce((a, b) => a + b, 0);
    const mean = sum / sorted.length;
    const median = sorted[(sorted.length - 1) / 2];
    const counts = new Map();
    for (const v of sorted) counts.set(v, (counts.get(v) || 0) + 1);
    let mode = null;
    let best = 1;
    for (const [v, c] of counts) {
      if (c > best) {
        best = c;
        mode = v;
      }
    }
    if (mode === null) return null;
    if (!isClean(mean)) return null;

    const values = { mean: round(mean, 2), median, mode };
    const ans = values[want];
    const others = ["mean", "median", "mode"].filter((k) => k !== want).map((k) => values[k]);

    const correct = num(ans);
    const distractors = [num(others[0]), num(others[1]), num(sum)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    const nameEn = { mean: "mean", median: "median", mode: "mode" }[want];
    const nameMr = { mean: "सरासरी (mean)", median: "मध्यगा (median)", mode: "बहुलक (mode)" }[want];

    const howEn = {
      mean: `The mean is the total divided by how many values there are: (${sorted.join(" + ")}) ÷ ${num(sorted.length)} = ${num(sum)} ÷ ${num(sorted.length)} = ${num(round(mean, 2))}.`,
      median: `The median is the middle value once the data is arranged in order. Sorted: ${sorted.join(", ")}. With ${num(sorted.length)} values the middle one is the ${num((sorted.length + 1) / 2)}rd, which is ${num(median)}.`,
      mode: `The mode is the value that occurs most often. Here ${num(mode)} appears ${num(best)} times while every other value appears once, so the mode is ${num(mode)}.`,
    }[want];
    const howMr = {
      mean: `सरासरी = सर्व किंमतींची बेरीज ÷ किंमतींची संख्या: (${sorted.join(" + ")}) ÷ ${num(sorted.length)} = ${num(sum)} ÷ ${num(sorted.length)} = ${num(round(mean, 2))}.`,
      median: `मध्यगा म्हणजे चढत्या क्रमाने मांडल्यावर मधली किंमत. क्रमाने: ${sorted.join(", ")}. ${num(sorted.length)} किंमती असल्याने मधली म्हणजे ${num((sorted.length + 1) / 2)} वी, ती ${num(median)} आहे.`,
      mode: `बहुलक म्हणजे सर्वाधिक वेळा येणारी किंमत. येथे ${num(mode)} ही ${num(best)} वेळा येते तर इतर प्रत्येक किंमत एकदाच येते, म्हणून बहुलक ${num(mode)} आहे.`,
    }[want];

    return {
      correct,
      distractors,
      en: {
        text: `Find the ${nameEn} of the following data: ${data.join(", ")}.`,
        explanation: `${howEn}\nSo the ${nameEn} is ${num(ans)}.\nFor reference, this data set has a mean of ${num(round(mean, 2))}, a median of ${num(median)} and a mode of ${num(mode)} — read the question carefully, because all three are offered as options.`,
      },
      mr: {
        text: `पुढील माहितीची ${nameMr} काढा: ${data.join(", ")}.`,
        explanation: `${howMr}\nम्हणून ${nameMr} ${num(ans)} आहे.\nसंदर्भासाठी: या माहितीची सरासरी ${num(round(mean, 2))}, मध्यगा ${num(median)} व बहुलक ${num(mode)} आहे — प्रश्न नीट वाचा, कारण तिन्ही पर्यायांत दिलेले आहेत.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 8. At least one — using the complement
 * ------------------------------------------------------------------ */
const atLeastOne = {
  id: "at-least-one",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const good of [3, 4, 5, 6, 7, 8, 9]) {
      for (const bad of [2, 3, 4, 5]) {
        for (const pick of [2, 3, 4]) {
          if (pick <= good + bad) out.push({ good, bad, pick });
        }
      }
    }
    return out;
  },
  make({ good, bad, pick }) {
    const total = good + bad;
    if (pick > total) return null;
    const allGood = nCr(good, pick);
    const allWays = nCr(total, pick);
    if (allWays === 0 || allGood === 0) return null;
    const favourable = allWays - allGood;
    if (favourable <= 0) return null;

    const correct = frac(favourable, allWays);
    const distractors = [frac(allGood, allWays), frac(bad, total), frac(nCr(bad, pick) || 1, allWays)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `A box contains ${num(good)} good bulbs and ${num(bad)} defective bulbs. ${num(pick)} bulbs are drawn at random together. What is the probability that at least one of them is defective?`,
        explanation: `"At least one defective" covers several cases — one defective, two defective, and so on — so counting them directly is slow. Use the complement instead.\nThe opposite of "at least one defective" is "none defective", i.e. all ${num(pick)} bulbs are good.\nTotal ways to draw ${num(pick)} bulbs from ${num(total)} = C(${num(total)}, ${num(pick)}) = ${num(allWays)}.\nWays to draw ${num(pick)} good bulbs from ${num(good)} = C(${num(good)}, ${num(pick)}) = ${num(allGood)}.\nP(none defective) = ${num(allGood)}/${num(allWays)}.\nP(at least one defective) = 1 − ${num(allGood)}/${num(allWays)} = ${num(favourable)}/${num(allWays)} = ${correct}.\nWhenever a question says "at least one", reach for the complement first — it is almost always the shorter route.`,
      },
      mr: {
        text: `एका पेटीत ${num(good)} चांगले व ${num(bad)} सदोष बल्ब आहेत. त्यातून एकाच वेळी ${num(pick)} बल्ब यादृच्छिकपणे काढले. त्यांपैकी किमान एक सदोष असण्याची संभाव्यता किती?`,
        explanation: `"किमान एक सदोष" यात एक सदोष, दोन सदोष अशा अनेक शक्यता येतात, म्हणून त्या थेट मोजणे वेळखाऊ ठरते. त्याऐवजी पूरक घटना वापरा.\n"किमान एक सदोष" याच्या उलट म्हणजे "एकही सदोष नाही", म्हणजे सर्व ${num(pick)} बल्ब चांगले.\n${num(total)} पैकी ${num(pick)} बल्ब काढण्याचे एकूण मार्ग = C(${num(total)}, ${num(pick)}) = ${num(allWays)}.\n${num(good)} चांगल्यांपैकी ${num(pick)} काढण्याचे मार्ग = C(${num(good)}, ${num(pick)}) = ${num(allGood)}.\nP(एकही सदोष नाही) = ${num(allGood)}/${num(allWays)}.\nP(किमान एक सदोष) = 1 − ${num(allGood)}/${num(allWays)} = ${num(favourable)}/${num(allWays)} = ${correct}.\nप्रश्नात "किमान एक" असे शब्द दिसताच आधी पूरक घटनेचा विचार करावा — तोच जवळजवळ नेहमी सर्वात कमी वेळेचा मार्ग असतो.`,
      },
    };
  },
};

export const topicId = "probability-stats";

export const archetypes = [
  twoDice,
  ballsFromBag,
  cards,
  coins,
  committee,
  arrangements,
  centralTendency,
  atLeastOne,
];
