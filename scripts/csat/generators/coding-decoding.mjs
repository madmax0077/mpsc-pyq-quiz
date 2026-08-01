/**
 * Generator: Coding & Decoding.
 *
 * Each question shows one worked example and asks for a second word under the
 * same rule. The validator independently infers the rule from the example by
 * testing a library of transformations, and rejects any question where two
 * different rules fit the example but disagree on the answer.
 */

const A = "A".charCodeAt(0);

const shiftLetter = (ch, k) => String.fromCharCode(((ch.charCodeAt(0) - A + k + 260) % 26) + A);
const shiftWord = (w, k) => [...w].map((c) => shiftLetter(c, k)).join("");
const oppositeWord = (w) => [...w].map((c) => String.fromCharCode(2 * A + 25 - c.charCodeAt(0))).join("");
const reverseWord = (w) => [...w].reverse().join("");
const progressiveWord = (w) => [...w].map((c, i) => shiftLetter(c, i + 1)).join("");
const alternateWord = (w, k) => [...w].map((c, i) => shiftLetter(c, i % 2 === 0 ? k : -k)).join("");

const WORDS = [
  "TIGER", "HORSE", "PENCIL", "GARDEN", "SILVER", "MARKET", "WINTER", "FLOWER",
  "BASKET", "CANDLE", "DOCTOR", "ENGINE", "FARMER", "GOLDEN", "HUNTER", "JACKET",
  "LADDER", "MASTER", "NUMBER", "ORANGE", "PALACE", "RABBIT", "SIMPLE", "TEMPLE",
  "VELVET", "WONDER", "YELLOW", "BRIDGE", "CIRCLE", "MONKEY",
];

/** Build the standard two-word question in both languages. */
function frame({ source, code, target, answer, distractors, ruleEn, ruleMr, closeEn, closeMr }) {
  return {
    correct: answer,
    distractors,
    en: {
      text: `In a certain code language, ${source} is written as ${code}. How will ${target} be written in the same code?`,
      explanation: `Line up the given word against its code, letter by letter:\n${[...source]
        .map((c, i) => `${c} → ${code[i]}`)
        .join(", ")}.\n${ruleEn}\nNow apply exactly the same rule to ${target}:\n${[...target]
        .map((c, i) => `${c} → ${answer[i]}`)
        .join(", ")}.\nSo ${target} is written as ${answer}.\n${closeEn}`,
    },
    mr: {
      text: `एका सांकेतिक भाषेत ${source} हा शब्द ${code} असा लिहितात. तर त्याच संकेतानुसार ${target} हा शब्द कसा लिहिला जाईल?`,
      explanation: `दिलेला शब्द व त्याचा संकेत अक्षरशः एकाखाली एक मांडा:\n${[...source]
        .map((c, i) => `${c} → ${code[i]}`)
        .join(", ")}.\n${ruleMr}\nआता तोच नियम ${target} या शब्दाला लावा:\n${[...target]
        .map((c, i) => `${c} → ${answer[i]}`)
        .join(", ")}.\nम्हणून ${target} हा शब्द ${answer} असा लिहिला जाईल.\n${closeMr}`,
    },
  };
}

/* ------------------------------------------------------------------ *
 * 1. Every letter moved forward or backward by a fixed amount
 * ------------------------------------------------------------------ */
const fixedShift = {
  id: "code-fixed-shift",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (let i = 0; i < WORDS.length; i += 2) {
      for (const k of [2, 3, 4, 5, -2, -3]) {
        out.push({ si: i, ti: (i + 7) % WORDS.length, k });
      }
    }
    return out;
  },
  make({ si, ti, k }) {
    const source = WORDS[si];
    const target = WORDS[ti];
    if (source === target || source.length !== target.length) return null;
    const code = shiftWord(source, k);
    const answer = shiftWord(target, k);

    const distractors = [shiftWord(target, -k), shiftWord(target, k + 1), reverseWord(answer)];
    if (new Set([answer, ...distractors]).size !== 4) return null;

    const dir = k > 0 ? "forward" : "backward";
    const dirMr = k > 0 ? "पुढे" : "मागे";
    const size = Math.abs(k);

    return frame({
      source,
      code,
      target,
      answer,
      distractors,
      ruleEn: `Each letter has moved ${size} place${size > 1 ? "s" : ""} ${dir} in the alphabet, and the same shift applies to every letter of the word.`,
      ruleMr: `प्रत्येक अक्षर वर्णमालेत ${size} स्थान${size > 1 ? "े" : ""} ${dirMr} सरकले आहे, आणि हाच बदल शब्दातील प्रत्येक अक्षराला लागू होतो.`,
      closeEn: `Check the direction carefully — shifting ${size} the other way would give ${shiftWord(target, -k)}, which is offered as a distractor.`,
      closeMr: `दिशा नीट तपासा — ${size} स्थाने उलट दिशेने सरकवल्यास ${shiftWord(target, -k)} येते, जो पर्यायांत सापळा म्हणून दिला आहे.`,
    });
  },
};

/* ------------------------------------------------------------------ *
 * 2. Opposite letters (A becomes Z)
 * ------------------------------------------------------------------ */
const opposite = {
  id: "code-opposite-letter",
  difficulty: "hard",
  cases() {
    const out = [];
    for (let i = 0; i < WORDS.length; i += 1) {
      out.push({ si: i, ti: (i + 11) % WORDS.length });
    }
    return out;
  },
  make({ si, ti }) {
    const source = WORDS[si];
    const target = WORDS[ti];
    if (source === target || source.length !== target.length) return null;
    const code = oppositeWord(source);
    const answer = oppositeWord(target);

    const distractors = [reverseWord(target), shiftWord(target, 1), reverseWord(answer)];
    if (new Set([answer, ...distractors]).size !== 4) return null;

    return frame({
      source,
      code,
      target,
      answer,
      distractors,
      ruleEn: `Each letter has been replaced by its OPPOSITE in the alphabet: A pairs with Z, B with Y, C with X and so on. The two positions in any pair always add up to 27.`,
      ruleMr: `प्रत्येक अक्षराच्या जागी वर्णमालेतील त्याचे विरुद्ध अक्षर आले आहे: A ची जोडी Z शी, B ची Y शी, C ची X शी अशी. कोणत्याही जोडीतील दोन्ही स्थानांची बेरीज नेहमी 27 येते.`,
      closeEn: `The quickest way to apply this rule is to remember the pairs A-Z, B-Y, C-X, D-W, E-V and M-N; the rest follow by counting from the nearer end.`,
      closeMr: `हा नियम पटकन लावण्यासाठी A-Z, B-Y, C-X, D-W, E-V आणि M-N या जोड्या लक्षात ठेवाव्यात; उरलेली अक्षरे जवळच्या टोकापासून मोजून मिळतात.`,
    });
  },
};

/* ------------------------------------------------------------------ *
 * 3. The word written backwards
 * ------------------------------------------------------------------ */
const reversed = {
  id: "code-reverse",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (let i = 0; i < WORDS.length; i += 1) {
      out.push({ si: i, ti: (i + 5) % WORDS.length });
    }
    return out;
  },
  make({ si, ti }) {
    const source = WORDS[si];
    const target = WORDS[ti];
    if (source === target || source.length !== target.length) return null;
    if (source === reverseWord(source)) return null;
    const code = reverseWord(source);
    const answer = reverseWord(target);

    const distractors = [shiftWord(target, 1), oppositeWord(target), shiftWord(answer, 1)];
    if (new Set([answer, ...distractors]).size !== 4) return null;

    return frame({
      source,
      code,
      target,
      answer,
      distractors,
      ruleEn: `No letter has changed — only the ORDER has. The code is simply the word written backwards, with the first letter becoming the last.`,
      ruleMr: `कोणतेही अक्षर बदललेले नाही — फक्त क्रम बदलला आहे. संकेत म्हणजे तोच शब्द उलट्या क्रमाने लिहिलेला, पहिले अक्षर शेवटी जाते.`,
      closeEn: `Before hunting for an alphabet shift, always check whether the code uses exactly the same set of letters — if it does, the rule is about order, not substitution.`,
      closeMr: `वर्णमालेतील सरकाव शोधण्यापूर्वी संकेतात तीच अक्षरे आहेत का ते तपासा — तशी असतील तर नियम क्रमाचा असतो, अक्षरबदलाचा नाही.`,
    });
  },
};

/* ------------------------------------------------------------------ *
 * 4. A shift that grows along the word
 * ------------------------------------------------------------------ */
const progressive = {
  id: "code-progressive-shift",
  difficulty: "hard",
  cases() {
    const out = [];
    for (let i = 0; i < WORDS.length; i += 1) {
      out.push({ si: i, ti: (i + 13) % WORDS.length });
    }
    return out;
  },
  make({ si, ti }) {
    const source = WORDS[si];
    const target = WORDS[ti];
    if (source === target || source.length !== target.length) return null;
    const code = progressiveWord(source);
    const answer = progressiveWord(target);

    const distractors = [shiftWord(target, 1), shiftWord(target, 2), reverseWord(answer)];
    if (new Set([answer, ...distractors]).size !== 4) return null;

    return frame({
      source,
      code,
      target,
      answer,
      distractors,
      ruleEn: `The shift is not the same throughout. The 1st letter moves 1 place forward, the 2nd moves 2 places, the 3rd moves 3, and so on — the shift equals the position of the letter.`,
      ruleMr: `सरकाव सर्वत्र सारखा नाही. पहिले अक्षर 1 स्थान पुढे, दुसरे 2 स्थाने, तिसरे 3 स्थाने असे सरकते — म्हणजे सरकाव त्या अक्षराच्या स्थानाइतका असतो.`,
      closeEn: `Whenever the first two letters shift by different amounts, stop looking for a fixed shift and check whether the shift is tracking the letter's position.`,
      closeMr: `पहिली दोन अक्षरे वेगवेगळ्या प्रमाणात सरकत असतील, तर स्थिर सरकाव शोधणे थांबवा आणि सरकाव अक्षराच्या स्थानाबरोबर वाढतो का ते तपासा.`,
    });
  },
};

/* ------------------------------------------------------------------ *
 * 5. Alternate letters shifted in opposite directions
 * ------------------------------------------------------------------ */
const alternate = {
  id: "code-alternate-shift",
  difficulty: "hard",
  cases() {
    const out = [];
    for (let i = 0; i < WORDS.length; i += 1) {
      for (const k of [1, 2, 3]) out.push({ si: i, ti: (i + 9) % WORDS.length, k });
    }
    return out;
  },
  make({ si, ti, k }) {
    const source = WORDS[si];
    const target = WORDS[ti];
    if (source === target || source.length !== target.length) return null;
    const code = alternateWord(source, k);
    const answer = alternateWord(target, k);

    const distractors = [shiftWord(target, k), shiftWord(target, -k), alternateWord(target, -k)];
    if (new Set([answer, ...distractors]).size !== 4) return null;

    return frame({
      source,
      code,
      target,
      answer,
      distractors,
      ruleEn: `The letters in the odd positions (1st, 3rd, 5th) move ${k} place${k > 1 ? "s" : ""} forward, while the letters in the even positions (2nd, 4th, 6th) move ${k} place${k > 1 ? "s" : ""} backward.`,
      ruleMr: `विषम स्थानांवरील अक्षरे (1 ले, 3 रे, 5 वे) ${k} स्थान${k > 1 ? "े" : ""} पुढे सरकतात, तर सम स्थानांवरील अक्षरे (2 रे, 4 थे, 6 वे) ${k} स्थान${k > 1 ? "े" : ""} मागे सरकतात.`,
      closeEn: `Applying the same forward shift to every letter would give ${shiftWord(target, k)} — the alternating direction is the whole point of this pattern.`,
      closeMr: `प्रत्येक अक्षराला एकाच दिशेने सरकाव दिल्यास ${shiftWord(target, k)} येते — आलटून पालटून बदलणारी दिशा हाच या नमुन्याचा गाभा आहे.`,
    });
  },
};

export const topicId = "coding-decoding";

export const archetypes = [fixedShift, opposite, reversed, progressive, alternate];
