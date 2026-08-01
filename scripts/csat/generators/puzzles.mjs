/**
 * Generator: Arrangement puzzles (row seating, floors, comparison order).
 *
 * A target arrangement is chosen first, clues are read off it, and the clue set
 * is kept only when a brute-force search over all 120 arrangements finds
 * exactly one that fits. That guarantees the puzzle is solvable and has a
 * single answer before it is ever written out.
 */

const NAME_SETS = [
  ["P", "Q", "R", "S", "T"],
  ["A", "B", "C", "D", "E"],
  ["K", "L", "M", "N", "O"],
  ["V", "W", "X", "Y", "Z"],
];

const ORDERS = [
  [2, 0, 4, 1, 3],
  [1, 3, 0, 4, 2],
  [4, 2, 1, 3, 0],
  [0, 4, 3, 2, 1],
  [3, 1, 4, 0, 2],
  [2, 4, 0, 3, 1],
  [1, 0, 3, 4, 2],
  [4, 3, 2, 0, 1],
  [0, 2, 4, 1, 3],
  [3, 4, 1, 2, 0],
];

const ord = (n) => `${n}${["th", "st", "nd", "rd"][n] || "th"}`;

function permutations(items) {
  if (items.length <= 1) return [items];
  const out = [];
  for (let i = 0; i < items.length; i += 1) {
    const rest = [...items.slice(0, i), ...items.slice(i + 1)];
    for (const p of permutations(rest)) out.push([items[i], ...p]);
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * Row seating
 * ------------------------------------------------------------------ */

function seatCheck(clue, arr) {
  const at = (n) => arr.indexOf(n);
  switch (clue.kind) {
    case "leftEnd":
      return arr[0] === clue.a;
    case "rightEnd":
      return arr[arr.length - 1] === clue.a;
    case "immLeft":
      return at(clue.a) + 1 === at(clue.b);
    case "immRight":
      return at(clue.a) - 1 === at(clue.b);
    case "gap":
      return Math.abs(at(clue.a) - at(clue.b)) - 1 === clue.n;
    case "nthLeft":
      return at(clue.a) === clue.n - 1;
    default:
      return arr.length - at(clue.a) === clue.n;
  }
}

function seatSentence(clue, lang) {
  const en = lang === "en";
  switch (clue.kind) {
    case "leftEnd":
      return en
        ? `${clue.a} is sitting at the extreme left end.`
        : `${clue.a} हा अगदी डाव्या टोकाला बसला आहे.`;
    case "rightEnd":
      return en
        ? `${clue.a} is sitting at the extreme right end.`
        : `${clue.a} हा अगदी उजव्या टोकाला बसला आहे.`;
    case "immLeft":
      return en
        ? `${clue.a} is sitting immediately to the left of ${clue.b}.`
        : `${clue.a} हा ${clue.b} च्या लगेच डावीकडे बसला आहे.`;
    case "immRight":
      return en
        ? `${clue.a} is sitting immediately to the right of ${clue.b}.`
        : `${clue.a} हा ${clue.b} च्या लगेच उजवीकडे बसला आहे.`;
    case "gap":
      return en
        ? `Exactly ${clue.n} student${clue.n === 1 ? "" : "s"} sit${clue.n === 1 ? "s" : ""} between ${clue.a} and ${clue.b}.`
        : `${clue.a} व ${clue.b} यांच्यामध्ये नेमके ${clue.n} विद्यार्थी बसले आहेत.`;
    case "nthLeft":
      return en
        ? `${clue.a} is sitting ${ord(clue.n)} from the left.`
        : `${clue.a} हा डावीकडून ${clue.n} व्या क्रमांकावर बसला आहे.`;
    default:
      return en
        ? `${clue.a} is sitting ${ord(clue.n)} from the right.`
        : `${clue.a} हा उजवीकडून ${clue.n} व्या क्रमांकावर बसला आहे.`;
  }
}

function seatCluePool(order) {
  const p = order;
  return [
    { kind: "immLeft", a: p[0], b: p[1] },
    { kind: "immLeft", a: p[1], b: p[2] },
    { kind: "immRight", a: p[3], b: p[2] },
    { kind: "immRight", a: p[4], b: p[3] },
    { kind: "leftEnd", a: p[0] },
    { kind: "rightEnd", a: p[4] },
    { kind: "gap", a: p[0], b: p[2], n: 1 },
    { kind: "gap", a: p[1], b: p[4], n: 2 },
    { kind: "nthLeft", a: p[2], n: 3 },
    { kind: "nthRight", a: p[1], n: 4 },
  ];
}

// Four clues, because three rarely pin a row of five down to one arrangement.
const SEAT_RECIPES = [
  [4, 1, 7, 3],
  [5, 0, 8, 6],
  [8, 3, 6, 0],
  [0, 7, 5, 2],
  [2, 9, 4, 3],
  [6, 3, 9, 1],
  [1, 5, 8, 7],
  [4, 2, 7, 9],
  [8, 0, 3, 7],
  [5, 1, 6, 2],
];

const SEAT_QUERIES = [
  {
    key: "middle",
    en: "Who is sitting in the middle of the row?",
    mr: "रांगेच्या मध्यभागी कोण बसला आहे?",
    answer: (arr) => arr[2],
  },
  {
    key: "rightEnd",
    en: "Who is sitting at the extreme right end?",
    mr: "अगदी उजव्या टोकाला कोण बसला आहे?",
    answer: (arr) => arr[4],
  },
  {
    key: "leftEnd",
    en: "Who is sitting at the extreme left end?",
    mr: "अगदी डाव्या टोकाला कोण बसला आहे?",
    answer: (arr) => arr[0],
  },
  {
    key: "secondRight",
    en: "Who is sitting 2nd from the right?",
    mr: "उजवीकडून 2 ऱ्या क्रमांकावर कोण बसला आहे?",
    answer: (arr) => arr[3],
  },
];

const rowSeating = {
  id: "puzzle-row-seating",
  difficulty: "hard",
  cases() {
    const out = [];
    for (let o = 0; o < ORDERS.length; o += 1) {
      for (let r = 0; r < SEAT_RECIPES.length; r += 1) {
        out.push({ o, r, q: (o + r) % SEAT_QUERIES.length, names: (o + r) % NAME_SETS.length });
      }
    }
    return out;
  },
  make({ o, r, q, names }) {
    const people = NAME_SETS[names];
    const target = ORDERS[o].map((i) => people[i]);
    const pool = seatCluePool(target);
    const clues = SEAT_RECIPES[r].map((i) => pool[i]);

    const fits = permutations(people).filter((arr) => clues.every((c) => seatCheck(c, arr)));
    if (fits.length !== 1) return null;

    const query = SEAT_QUERIES[q];
    const correct = query.answer(target);
    const distractors = people.filter((n) => n !== correct).slice(0, 3);
    if (new Set([correct, ...distractors]).size !== 4) return null;

    const clueEn = clues.map((c) => seatSentence(c, "en")).join(" ");
    const clueMr = clues.map((c) => seatSentence(c, "mr")).join(" ");
    const orderEn = target.join(", ");

    return {
      correct,
      distractors,
      en: {
        text: `Five students ${people.slice(0, 4).join(", ")} and ${people[4]} are sitting in a row facing north. ${clueEn}\n${query.en}`,
        explanation: `Draw five blank seats and fill in the clue that fixes a definite position before touching the relative ones.\nThe clues are: ${clueEn}\nA clue naming an end or a numbered seat anchors the row; the "immediately to the left or right" clues then attach the neighbours to that anchor, and the clue counting people in between decides what is left.\nWorking through them, only one seating satisfies every clue, and from left to right it is ${orderEn}.\nReading the answer off that row, ${correct} is the one the question asks for.\nEveryone faces north here, so left and right are the same as yours; if the row were said to face south, every left and right in the clues would have to be flipped.`,
      },
      mr: {
        text: `${people.slice(0, 4).join(", ")} व ${people[4]} हे पाच विद्यार्थी उत्तरेकडे तोंड करून एका रांगेत बसले आहेत. ${clueMr}\n${query.mr}`,
        explanation: `पाच रिकाम्या जागा काढा आणि सापेक्ष सूचना हाताळण्यापूर्वी निश्चित जागा ठरवणारी सूचना आधी भरा.\nसूचना अशा आहेत: ${clueMr}\nटोक किंवा क्रमांक सांगणारी सूचना रांगेला आधार देते; "लगेच डावीकडे किंवा उजवीकडे" या सूचना त्या आधाराला शेजारी जोडतात आणि मधल्या व्यक्तींची संख्या सांगणारी सूचना उरलेले ठरवते.\nया क्रमाने सोडवल्यास सर्व अटी पूर्ण करणारी एकच मांडणी मिळते आणि डावीकडून उजवीकडे ती ${orderEn} अशी आहे.\nया रांगेवरून वाचल्यास प्रश्नात विचारलेले उत्तर ${correct} हे आहे.\nयेथे सर्वजण उत्तरेकडे तोंड करून आहेत, म्हणून डावे-उजवे तुमच्याच बाजूचे; रांग दक्षिणेकडे तोंड करून असती तर सूचनांतील प्रत्येक डावे-उजवे उलटे करावे लागले असते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * Floors
 * ------------------------------------------------------------------ */

function floorCheck(clue, arr) {
  // arr[0] is floor 1 (the ground floor) and arr[4] is floor 5.
  const floorOf = (n) => arr.indexOf(n) + 1;
  switch (clue.kind) {
    case "on":
      return floorOf(clue.a) === clue.n;
    case "above":
      return floorOf(clue.a) === floorOf(clue.b) + 1;
    case "below":
      return floorOf(clue.a) === floorOf(clue.b) - 1;
    case "gap":
      return Math.abs(floorOf(clue.a) - floorOf(clue.b)) - 1 === clue.n;
    case "top":
      return floorOf(clue.a) === 5;
    default:
      return floorOf(clue.a) === 1;
  }
}

function floorSentence(clue, lang) {
  const en = lang === "en";
  switch (clue.kind) {
    case "on":
      return en
        ? `${clue.a} lives on floor ${clue.n}.`
        : `${clue.a} हा ${clue.n} व्या मजल्यावर राहतो.`;
    case "above":
      return en
        ? `${clue.a} lives immediately above ${clue.b}.`
        : `${clue.a} हा ${clue.b} च्या लगेच वरच्या मजल्यावर राहतो.`;
    case "below":
      return en
        ? `${clue.a} lives immediately below ${clue.b}.`
        : `${clue.a} हा ${clue.b} च्या लगेच खालच्या मजल्यावर राहतो.`;
    case "gap":
      return en
        ? `Exactly ${clue.n} floor${clue.n === 1 ? "" : "s"} lie${clue.n === 1 ? "s" : ""} between ${clue.a} and ${clue.b}.`
        : `${clue.a} व ${clue.b} यांच्यामध्ये नेमके ${clue.n} मजले आहेत.`;
    case "top":
      return en
        ? `${clue.a} lives on the topmost floor.`
        : `${clue.a} हा सर्वात वरच्या मजल्यावर राहतो.`;
    default:
      return en
        ? `${clue.a} lives on the lowest floor.`
        : `${clue.a} हा सर्वात खालच्या मजल्यावर राहतो.`;
  }
}

function floorCluePool(order) {
  const p = order;
  return [
    { kind: "bottom", a: p[0] },
    { kind: "top", a: p[4] },
    { kind: "above", a: p[1], b: p[0] },
    { kind: "above", a: p[3], b: p[2] },
    { kind: "below", a: p[2], b: p[3] },
    { kind: "gap", a: p[0], b: p[3], n: 2 },
    { kind: "gap", a: p[1], b: p[4], n: 2 },
    { kind: "on", a: p[2], n: 3 },
    { kind: "on", a: p[1], n: 2 },
  ];
}

const FLOOR_RECIPES = [
  [1, 2, 5, 8],
  [0, 3, 6, 7],
  [7, 2, 6, 0],
  [8, 4, 1, 5],
  [5, 3, 0, 7],
  [6, 7, 2, 4],
  [1, 4, 8, 6],
  [0, 5, 3, 8],
  [2, 6, 8, 4],
  [3, 1, 5, 7],
];

const floors = {
  id: "puzzle-floors",
  difficulty: "hard",
  cases() {
    const out = [];
    for (let o = 0; o < ORDERS.length; o += 1) {
      for (let r = 0; r < FLOOR_RECIPES.length; r += 1) {
        out.push({ o, r, ask: (o + r) % 5, names: (o + r + 1) % NAME_SETS.length });
      }
    }
    return out;
  },
  make({ o, r, ask, names }) {
    const people = NAME_SETS[names];
    const target = ORDERS[o].map((i) => people[i]); // index 0 = floor 1
    const pool = floorCluePool(target);
    const clues = FLOOR_RECIPES[r].map((i) => pool[i]);

    const fits = permutations(people).filter((arr) => clues.every((c) => floorCheck(c, arr)));
    if (fits.length !== 1) return null;

    const person = people[ask];
    const floor = target.indexOf(person) + 1;
    const correct = String(floor);
    const distractors = [1, 2, 3, 4, 5].filter((f) => f !== floor).slice(0, 3).map(String);
    if (new Set([correct, ...distractors]).size !== 4) return null;

    const clueEn = clues.map((c) => floorSentence(c, "en")).join(" ");
    const clueMr = clues.map((c) => floorSentence(c, "mr")).join(" ");
    const stackEn = target.map((n, i) => `floor ${i + 1}: ${n}`).join(", ");
    const stackMr = target.map((n, i) => `मजला ${i + 1}: ${n}`).join(", ");

    return {
      correct,
      distractors,
      en: {
        text: `Five people ${people.slice(0, 4).join(", ")} and ${people[4]} live on five different floors of the same building, the lowest floor being numbered 1 and the topmost 5. ${clueEn}\nOn which floor does ${person} live?`,
        explanation: `Write the floors in a column from 5 at the top down to 1 at the bottom, so "above" and "below" mean what they say on the page.\nThe clues are: ${clueEn}\nStart from the clue that names an actual floor number or an end of the building, then use the "immediately above or below" clues to hang the neighbours on it; a clue counting the floors in between fixes whatever is still loose.\nOnly one stacking satisfies every clue: ${stackEn}.\nSo ${person} lives on floor ${floor}.\nCount floors as the question defines them — here floor 1 is the lowest, and treating the topmost as floor 1 turns every answer upside down.`,
      },
      mr: {
        text: `${people.slice(0, 4).join(", ")} व ${people[4]} या पाच व्यक्ती एकाच इमारतीच्या पाच वेगवेगळ्या मजल्यांवर राहतात; सर्वात खालचा मजला 1 व सर्वात वरचा 5 असा क्रमांक आहे. ${clueMr}\n${person} कोणत्या मजल्यावर राहतो?`,
        explanation: `वरून 5 पासून खाली 1 पर्यंत मजले एका स्तंभात लिहा, म्हणजे "वर" व "खाली" या शब्दांचा अर्थ कागदावर तसाच दिसेल.\nसूचना अशा आहेत: ${clueMr}\nप्रत्यक्ष मजला क्रमांक किंवा इमारतीचे टोक सांगणाऱ्या सूचनेपासून सुरुवात करा, मग "लगेच वर किंवा खाली" या सूचनांनी शेजारी जोडा; मधल्या मजल्यांची संख्या सांगणारी सूचना उरलेले निश्चित करते.\nसर्व सूचना पूर्ण करणारी एकच मांडणी मिळते: ${stackMr}.\nम्हणून ${person} हा ${floor} व्या मजल्यावर राहतो.\nप्रश्नात दिलेल्या पद्धतीनेच मजले मोजा — येथे 1 हा सर्वात खालचा मजला आहे, आणि सर्वात वरचा मजला 1 धरल्यास प्रत्येक उत्तर उलटे होते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * Comparison order
 * ------------------------------------------------------------------ */

const COMPARE_QUERIES = [
  { rank: 1, en: "Who is the tallest?", mr: "सर्वात उंच कोण आहे?" },
  { rank: 2, en: "Who is the 2nd tallest?", mr: "उंचीनुसार 2 ऱ्या क्रमांकावर कोण आहे?" },
  { rank: 3, en: "Who is the 3rd tallest?", mr: "उंचीनुसार 3 ऱ्या क्रमांकावर कोण आहे?" },
  { rank: 5, en: "Who is the shortest?", mr: "सर्वात कमी उंच कोण आहे?" },
];

const comparisonOrder = {
  id: "puzzle-comparison-order",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (let o = 0; o < ORDERS.length; o += 1) {
      for (let q = 0; q < COMPARE_QUERIES.length; q += 1) {
        for (let s = 0; s < 2; s += 1) {
          out.push({ o, q, style: s, names: (o + q) % NAME_SETS.length });
        }
      }
    }
    return out;
  },
  make({ o, q, style, names }) {
    const people = NAME_SETS[names];
    // Tallest first.
    const target = ORDERS[o].map((i) => people[i]);
    const pairs = [];
    for (let i = 0; i < 4; i += 1) pairs.push([target[i], target[i + 1]]);

    // Two ways of stating the same chain, so the wording varies.
    const clues = pairs.map(([hi, lo], i) =>
      style === 0 || i % 2 === 0
        ? { kind: "taller", a: hi, b: lo }
        : { kind: "shorter", a: lo, b: hi },
    );

    const fits = permutations(people).filter((arr) =>
      clues.every((c) =>
        c.kind === "taller"
          ? arr.indexOf(c.a) < arr.indexOf(c.b)
          : arr.indexOf(c.a) > arr.indexOf(c.b),
      ),
    );
    if (fits.length !== 1) return null;

    const query = COMPARE_QUERIES[q];
    const correct = target[query.rank - 1];
    const distractors = people.filter((n) => n !== correct).slice(0, 3);
    if (new Set([correct, ...distractors]).size !== 4) return null;

    const clueEn = clues
      .map((c) =>
        c.kind === "taller" ? `${c.a} is taller than ${c.b}.` : `${c.a} is shorter than ${c.b}.`,
      )
      .join(" ");
    const clueMr = clues
      .map((c) =>
        c.kind === "taller"
          ? `${c.a} हा ${c.b} पेक्षा उंच आहे.`
          : `${c.a} हा ${c.b} पेक्षा कमी उंच आहे.`,
      )
      .join(" ");

    return {
      correct,
      distractors,
      en: {
        text: `Among five friends ${people.slice(0, 4).join(", ")} and ${people[4]}, no two are of the same height. ${clueEn}\n${query.en}`,
        explanation: `Turn every comparison into a single line with the taller person on the left, then join the lines into one chain.\nThe clues are: ${clueEn}\nA sentence saying someone is shorter than another is the same information written backwards, so rewrite it the same way round before joining.\nLinking the comparisons end to end gives the order from tallest to shortest: ${target.join(" > ")}.\nReading the position the question asks for, the answer is ${correct}.\nOnly do this when every pair is linked into one chain; if two people are never compared, even indirectly, the order is not fixed and the question would have no single answer.`,
      },
      mr: {
        text: `${people.slice(0, 4).join(", ")} व ${people[4]} या पाच मित्रांपैकी कोणाचीही उंची सारखी नाही. ${clueMr}\n${query.mr}`,
        explanation: `प्रत्येक तुलना एका ओळीत लिहा, डावीकडे जास्त उंच व्यक्ती ठेवा आणि मग सर्व ओळी जोडून एक साखळी करा.\nसूचना अशा आहेत: ${clueMr}\n"कमी उंच आहे" असे सांगणारे वाक्य म्हणजे तीच माहिती उलट लिहिलेली असते, म्हणून जोडण्यापूर्वी ती एकाच पद्धतीने लिहून घ्या.\nतुलना एकमेकांना जोडल्यास सर्वात उंच ते सर्वात कमी उंच असा क्रम मिळतो: ${target.join(" > ")}.\nप्रश्नात विचारलेल्या क्रमांकावरील व्यक्ती पाहिल्यास उत्तर ${correct} आहे.\nसर्व जोड्या एकाच साखळीत जोडल्या गेल्या असतील तरच हे करता येते; दोन व्यक्तींची तुलना अप्रत्यक्षपणेही झाली नसेल तर क्रम निश्चित होत नाही आणि प्रश्नाला एकच उत्तर उरत नाही.`,
      },
    };
  },
};

export const topicId = "puzzles";

export const archetypes = [rowSeating, floors, comparisonOrder];
