/**
 * Generator: Blood Relations.
 *
 * Each question states a short chain of family facts, either as plain
 * sentences or through a symbol legend. The answer is derived by building the
 * family graph and reading the relation off it, never by hand, so the option
 * key and the explanation can never drift apart.
 *
 * Two standing assumptions, the ones every Indian competitive paper uses:
 *   - brothers and sisters share the same parents;
 *   - the spouse of a parent is also a parent of that child.
 */

/* ------------------------------------------------------------------ *
 * Family engine
 * ------------------------------------------------------------------ */

const MALE = new Set(["father", "son", "brother", "husband"]);

export function buildFamily(facts) {
  const gender = {};
  const parents = {};
  const children = {};
  const spouse = {};
  const sibPairs = [];

  const ensure = (p) => {
    if (!parents[p]) parents[p] = new Set();
    if (!children[p]) children[p] = new Set();
  };
  const link = (parent, child) => {
    ensure(parent);
    ensure(child);
    parents[child].add(parent);
    children[parent].add(child);
  };

  for (const [x, rel, y] of facts) {
    ensure(x);
    ensure(y);
    gender[x] = MALE.has(rel) ? "M" : "F";
    switch (rel) {
      case "father":
      case "mother":
        link(x, y);
        break;
      case "son":
      case "daughter":
        link(y, x);
        break;
      case "brother":
      case "sister":
        sibPairs.push([x, y]);
        break;
      case "husband":
      case "wife":
        spouse[x] = y;
        spouse[y] = x;
        break;
      default:
        throw new Error(`unknown relation ${rel}`);
    }
  }

  // Close the graph: stated siblings share parents, a parent's spouse is also a
  // parent, and the two parents of one child are a couple.
  for (let pass = 0; pass < 6; pass += 1) {
    for (const [x, y] of sibPairs) {
      for (const p of [...parents[x]]) link(p, y);
      for (const p of [...parents[y]]) link(p, x);
    }
    for (const child of Object.keys(parents)) {
      for (const p of [...parents[child]]) {
        if (spouse[p]) link(spouse[p], child);
      }
      const ps = [...parents[child]];
      if (ps.length === 2 && gender[ps[0]] && gender[ps[1]] && gender[ps[0]] !== gender[ps[1]]) {
        spouse[ps[0]] = ps[1];
        spouse[ps[1]] = ps[0];
      }
    }
  }

  const statedSibling = (x, y) =>
    sibPairs.some(([m, n]) => (m === x && n === y) || (m === y && n === x));
  const siblings = (x, y) => {
    if (x === y) return false;
    if (statedSibling(x, y)) return true;
    return [...(parents[x] || [])].some((p) => parents[y] && parents[y].has(p));
  };

  return { gender, parents, children, spouse, siblings };
}

/**
 * Name the relation of x to y ("x is y's ..."), and describe the route taken so
 * the explanation can walk a student through it.
 */
export function relationOf(g, x, y) {
  const male = g.gender[x] === "M";
  const par = (p) => (g.gender[p] === "M" ? "father" : "mother");

  if (g.spouse[y] === x) return { key: male ? "husband" : "wife", via: null };
  if (g.parents[y] && g.parents[y].has(x)) return { key: male ? "father" : "mother", via: null };
  if (g.parents[x] && g.parents[x].has(y)) return { key: male ? "son" : "daughter", via: null };
  if (g.siblings(x, y)) return { key: male ? "brother" : "sister", via: null };

  for (const p of g.parents[y] || []) {
    if (g.parents[p] && g.parents[p].has(x)) {
      return { key: male ? "grandfather" : "grandmother", via: { mid: p, role: par(p) } };
    }
  }
  for (const p of g.parents[x] || []) {
    if (g.parents[p] && g.parents[p].has(y)) {
      return { key: male ? "grandson" : "granddaughter", via: { mid: p, role: par(p) } };
    }
  }
  for (const p of g.parents[y] || []) {
    if (g.siblings(x, p)) {
      return { key: male ? "uncle" : "aunt", via: { mid: p, role: par(p) } };
    }
  }
  for (const p of g.parents[x] || []) {
    if (g.siblings(p, y)) {
      return { key: male ? "nephew" : "niece", via: { mid: p, role: par(p) } };
    }
  }
  for (const px of g.parents[x] || []) {
    for (const py of g.parents[y] || []) {
      if (g.siblings(px, py)) {
        return {
          key: male ? "cousinBrother" : "cousinSister",
          via: { mid: px, role: par(px), other: py, otherRole: par(py) },
        };
      }
    }
  }

  const sy = g.spouse[y];
  if (sy && g.parents[sy] && g.parents[sy].has(x)) {
    return { key: male ? "fatherInLaw" : "motherInLaw", via: { mid: sy } };
  }
  const sx = g.spouse[x];
  if (sx && g.parents[sx] && g.parents[sx].has(y)) {
    return { key: male ? "sonInLaw" : "daughterInLaw", via: { mid: sx } };
  }
  if (sy && g.siblings(x, sy)) {
    return { key: male ? "brotherInLaw" : "sisterInLaw", via: { mid: sy } };
  }
  if (sx && g.siblings(sx, y)) {
    return { key: male ? "brotherInLaw" : "sisterInLaw", via: { mid: sx } };
  }

  return null;
}

/* ------------------------------------------------------------------ *
 * Labels
 * ------------------------------------------------------------------ */

export const LABEL = {
  father: "वडील / Father",
  mother: "आई / Mother",
  son: "मुलगा / Son",
  daughter: "मुलगी / Daughter",
  brother: "भाऊ / Brother",
  sister: "बहीण / Sister",
  grandfather: "आजोबा / Grandfather",
  grandmother: "आजी / Grandmother",
  grandson: "नातू / Grandson",
  granddaughter: "नात / Granddaughter",
  uncle: "काका / मामा / Uncle",
  aunt: "आत्या / मावशी / Aunt",
  nephew: "पुतण्या / भाचा / Nephew",
  niece: "पुतणी / भाची / Niece",
  cousinBrother: "चुलत भाऊ / मामे भाऊ / Cousin brother",
  cousinSister: "चुलत बहीण / मामे बहीण / Cousin sister",
  husband: "पती / Husband",
  wife: "पत्नी / Wife",
  fatherInLaw: "सासरे / Father-in-law",
  motherInLaw: "सासू / Mother-in-law",
  sonInLaw: "जावई / Son-in-law",
  daughterInLaw: "सून / Daughter-in-law",
  brotherInLaw: "मेहुणा / Brother-in-law",
  sisterInLaw: "मेहुणी / Sister-in-law",
};

const NAME_EN = {
  father: "father", mother: "mother", son: "son", daughter: "daughter",
  brother: "brother", sister: "sister", grandfather: "grandfather",
  grandmother: "grandmother", grandson: "grandson", granddaughter: "granddaughter",
  uncle: "uncle", aunt: "aunt", nephew: "nephew", niece: "niece",
  cousinBrother: "cousin brother", cousinSister: "cousin sister",
  husband: "husband", wife: "wife", fatherInLaw: "father-in-law",
  motherInLaw: "mother-in-law", sonInLaw: "son-in-law",
  daughterInLaw: "daughter-in-law", brotherInLaw: "brother-in-law",
  sisterInLaw: "sister-in-law",
};
const NAME_MR = {
  father: "वडील", mother: "आई", son: "मुलगा", daughter: "मुलगी",
  brother: "भाऊ", sister: "बहीण", grandfather: "आजोबा", grandmother: "आजी",
  grandson: "नातू", granddaughter: "नात", uncle: "काका", aunt: "मावशी",
  nephew: "भाचा", niece: "भाची", cousinBrother: "चुलत भाऊ",
  cousinSister: "चुलत बहीण", husband: "पती", wife: "पत्नी",
  fatherInLaw: "सासरे", motherInLaw: "सासू", sonInLaw: "जावई",
  daughterInLaw: "सून", brotherInLaw: "मेहुणा", sisterInLaw: "मेहुणी",
};

/**
 * Marathi agreement, kept in one table: the pronoun and the verb follow the
 * person, the genitive follows the relation word, and the elder male relations
 * take the honorific plural. Every Marathi sentence in this file is built from
 * here so no line can drift into "A हा B चा बहीण आहे".
 */
const MR_FORM = {
  father: { p: "हे", g: "चे", v: "आहेत" },
  mother: { p: "ही", g: "ची", v: "आहे" },
  son: { p: "हा", g: "चा", v: "आहे" },
  daughter: { p: "ही", g: "ची", v: "आहे" },
  brother: { p: "हा", g: "चा", v: "आहे" },
  sister: { p: "ही", g: "ची", v: "आहे" },
  grandfather: { p: "हे", g: "चे", v: "आहेत" },
  grandmother: { p: "ही", g: "ची", v: "आहे" },
  grandson: { p: "हा", g: "चा", v: "आहे" },
  granddaughter: { p: "ही", g: "ची", v: "आहे" },
  uncle: { p: "हे", g: "चे", v: "आहेत" },
  aunt: { p: "ही", g: "ची", v: "आहे" },
  nephew: { p: "हा", g: "चा", v: "आहे" },
  niece: { p: "ही", g: "ची", v: "आहे" },
  cousinBrother: { p: "हा", g: "चा", v: "आहे" },
  cousinSister: { p: "ही", g: "ची", v: "आहे" },
  husband: { p: "हा", g: "चा", v: "आहे" },
  wife: { p: "ही", g: "ची", v: "आहे" },
  fatherInLaw: { p: "हे", g: "चे", v: "आहेत" },
  motherInLaw: { p: "ही", g: "ची", v: "आहे" },
  sonInLaw: { p: "हा", g: "चा", v: "आहे" },
  daughterInLaw: { p: "ही", g: "ची", v: "आहे" },
  brotherInLaw: { p: "हा", g: "चा", v: "आहे" },
  sisterInLaw: { p: "ही", g: "ची", v: "आहे" },
};

/** "P हा Q चा भाऊ आहे", "P हे Q चे वडील आहेत". */
function mrRel(p, q, key) {
  const f = MR_FORM[key];
  return `${p} ${f.p} ${q} ${f.g} ${NAME_MR[key]} ${f.v}`;
}

const NEIGHBOURS = {
  father: ["brother", "son", "uncle"],
  mother: ["sister", "daughter", "aunt"],
  son: ["brother", "nephew", "grandson"],
  daughter: ["sister", "niece", "granddaughter"],
  brother: ["cousinBrother", "son", "nephew"],
  sister: ["cousinSister", "daughter", "niece"],
  grandfather: ["father", "uncle", "brother"],
  grandmother: ["mother", "aunt", "sister"],
  grandson: ["son", "nephew", "brother"],
  granddaughter: ["daughter", "niece", "sister"],
  uncle: ["father", "brother", "grandfather"],
  aunt: ["mother", "sister", "grandmother"],
  nephew: ["son", "brother", "grandson"],
  niece: ["daughter", "sister", "granddaughter"],
  cousinBrother: ["brother", "nephew", "uncle"],
  cousinSister: ["sister", "niece", "aunt"],
  husband: ["brotherInLaw", "father", "sonInLaw"],
  wife: ["sisterInLaw", "mother", "daughterInLaw"],
  fatherInLaw: ["father", "grandfather", "uncle"],
  motherInLaw: ["mother", "grandmother", "aunt"],
  sonInLaw: ["son", "brotherInLaw", "nephew"],
  daughterInLaw: ["daughter", "sisterInLaw", "niece"],
  brotherInLaw: ["brother", "cousinBrother", "sonInLaw"],
  sisterInLaw: ["sister", "cousinSister", "daughterInLaw"],
};

/* ------------------------------------------------------------------ *
 * Chains
 * ------------------------------------------------------------------ */

const CHAINS = [
  [[0, "father", 1], [1, "sister", 2], [2, "mother", 3]],
  [[0, "mother", 1], [1, "brother", 2], [2, "father", 3]],
  [[0, "brother", 1], [1, "daughter", 2], [2, "father", 3]],
  [[0, "son", 1], [1, "sister", 2], [2, "son", 3]],
  [[0, "husband", 1], [1, "mother", 2], [2, "sister", 3]],
  [[0, "daughter", 1], [1, "wife", 2], [2, "brother", 3]],
  [[0, "father", 1], [1, "husband", 2]],
  [[0, "mother", 1], [1, "wife", 2]],
  [[0, "wife", 1], [1, "son", 2]],
  [[0, "son", 1], [1, "husband", 2]],
  [[0, "brother", 1], [1, "wife", 2]],
  [[0, "sister", 1], [1, "husband", 2]],
  [[0, "son", 1], [1, "brother", 2], [2, "father", 3]],
  [[0, "daughter", 1], [1, "sister", 2], [2, "mother", 3]],
  [[0, "brother", 1], [1, "father", 2]],
  [[0, "sister", 1], [1, "mother", 2]],
  [[0, "daughter", 1], [1, "father", 2]],
  [[0, "son", 1], [1, "daughter", 2]],
  [[0, "brother", 1], [1, "son", 2], [2, "sister", 3]],
  [[0, "mother", 1], [1, "father", 2], [2, "brother", 3]],
  [[0, "father", 1], [1, "mother", 2]],
  [[0, "sister", 1], [1, "son", 2], [2, "brother", 3]],
];

const LETTER_SETS = [
  ["P", "Q", "R", "S"],
  ["A", "B", "C", "D"],
  ["K", "L", "M", "N"],
  ["T", "U", "V", "W"],
  ["E", "F", "G", "H"],
];

const SYMBOLS = ["+", "\u2212", "\u00D7", "\u00F7"];

function factsFor(chain, names) {
  return chain.map(([x, rel, y]) => [names[x], rel, names[y]]);
}

/** The person the question asks about is always the first, measured against the last. */
function endpoints(chain, names) {
  const last = chain[chain.length - 1];
  return [names[chain[0][0]], names[last[2]]];
}

function solveChain(chain, names) {
  const facts = factsFor(chain, names);
  const g = buildFamily(facts);
  const [x, y] = endpoints(chain, names);
  const rel = relationOf(g, x, y);
  if (!rel) return null;
  return { facts, g, x, y, rel };
}

/** Narrate how the links join up, using the intermediate people by name. */
function narrate(solved, lang) {
  const { g, x, y, rel } = solved;
  const en = lang === "en";
  const nm = en ? NAME_EN : NAME_MR;
  const v = rel.via;
  const key = rel.key;

  if (!v) {
    if (["father", "mother", "son", "daughter"].includes(key)) {
      return en
        ? `Following the links, ${x} turns out to be a direct parent-child step away from ${y}.`
        : `दुवे जोडल्यावर ${x} व ${y} यांच्यात थेट पालक-अपत्य असे एकच पाऊल उरते.`;
    }
    if (["brother", "sister"].includes(key)) {
      return en
        ? `Following the links, ${x} and ${y} end up with the same parents, which makes them siblings.`
        : `दुवे जोडल्यावर ${x} व ${y} यांचे आई-वडील एकच ठरतात, म्हणजे ते भावंडे आहेत.`;
    }
    return en
      ? `Following the links, ${x} and ${y} are married to each other.`
      : `दुवे जोडल्यावर ${x} व ${y} हे पती-पत्नी असल्याचे स्पष्ट होते.`;
  }

  if (["grandfather", "grandmother"].includes(key)) {
    const own = g.gender[x] === "M" ? "father" : "mother";
    return en
      ? `${v.mid} is the ${nm[v.role]} of ${y}, and ${x} is the ${nm[own]} of ${v.mid}, so ${x} stands one generation above ${y}'s parent.`
      : `${mrRel(v.mid, y, v.role)} आणि ${mrRel(x, v.mid, own)}, म्हणजे ${x} ही व्यक्ती ${y} च्या पालकांच्याही एक पिढी वर आहे.`;
  }
  if (["grandson", "granddaughter"].includes(key)) {
    return en
      ? `${v.mid} is the ${nm[v.role]} of ${x}, and ${y} is a parent of ${v.mid}, so ${x} is two generations below ${y}.`
      : `${mrRel(v.mid, x, v.role)} आणि ${y} हे ${v.mid} चे पालक आहेत, म्हणजे ${x} ही व्यक्ती ${y} पेक्षा दोन पिढ्या खाली आहे.`;
  }
  if (["uncle", "aunt"].includes(key)) {
    return en
      ? `${v.mid} is the ${nm[v.role]} of ${y}, and ${x} is a sibling of ${v.mid}, so ${x} is a sibling of ${y}'s parent.`
      : `${mrRel(v.mid, y, v.role)} आणि ${x} व ${v.mid} ही भावंडे आहेत, म्हणजे ${x} ही व्यक्ती ${y} च्या पालकाचे भावंड ठरते.`;
  }
  if (["nephew", "niece"].includes(key)) {
    return en
      ? `${v.mid} is a parent of ${x} and a sibling of ${y}, so ${x} is the child of ${y}'s own brother or sister.`
      : `${mrRel(v.mid, x, v.role)} आणि ${v.mid} व ${y} ही भावंडे आहेत, म्हणजे ${x} ही व्यक्ती ${y} च्याच भावंडाचे अपत्य आहे.`;
  }
  if (["cousinBrother", "cousinSister"].includes(key)) {
    return en
      ? `${v.mid} is the ${nm[v.role]} of ${x} and ${v.other} is the ${nm[v.otherRole]} of ${y}, and those two are brother and sister, so ${x} and ${y} are children of two siblings.`
      : `${mrRel(v.mid, x, v.role)} व ${mrRel(v.other, y, v.otherRole)}, आणि ही दोघे भावंडे आहेत, म्हणजे ${x} व ${y} ही दोन भावंडांची अपत्ये आहेत.`;
  }
  if (["fatherInLaw", "motherInLaw"].includes(key)) {
    const own = g.gender[x] === "M" ? "father" : "mother";
    return en
      ? `${v.mid} is married to ${y}, and ${x} is a parent of ${v.mid}, so ${x} is a parent of ${y}'s spouse.`
      : `${v.mid} व ${y} हे पती-पत्नी आहेत आणि ${mrRel(x, v.mid, own)}, म्हणजे ${x} ही व्यक्ती ${y} च्या जोडीदाराचे पालक ठरते.`;
  }
  if (["sonInLaw", "daughterInLaw"].includes(key)) {
    return en
      ? `${v.mid} is a child of ${y}, and ${x} is married to ${v.mid}, so ${x} has married into ${y}'s family.`
      : `${v.mid} हे ${y} चे अपत्य आहे आणि ${x} व ${v.mid} हे पती-पत्नी आहेत, म्हणजे ${x} ही व्यक्ती विवाहाने ${y} च्या कुटुंबात आली आहे.`;
  }
  return en
    ? `${v.mid} links the two: ${x} and ${v.mid} are siblings, and the marriage tie carries the relation across to ${y}.`
    : `${v.mid} ही व्यक्ती दोघांना जोडते: ${x} व ${v.mid} ही भावंडे आहेत आणि विवाहाच्या नात्याने हा संबंध ${y} पर्यंत पोहोचतो.`;
}

const RULE_NOTE_EN = "Two rules do the quiet work here: brothers and sisters share the same parents, and the husband or wife of a parent counts as a parent of that child.";
const RULE_NOTE_MR = "येथे दोन नियम पडद्यामागे काम करतात: भाऊ-बहिणींचे आई-वडील एकच असतात आणि पालकाचा जोडीदार त्या अपत्याचा पालकच मानला जातो.";

const TRAP_EN = "Answer the direction that was asked. Swapping the two people turns a nephew into an uncle, and that reversal is the most common mistake in this topic.";
const TRAP_MR = "प्रश्नात विचारलेली दिशाच उत्तरात द्या. दोन व्यक्ती अदलाबदल केल्या की भाचा हा मामा होतो, आणि हीच उलटापालट या घटकातील सर्वात नेहमीची चूक आहे.";

function optionsFor(key) {
  const alts = NEIGHBOURS[key] || [];
  const distractors = alts.slice(0, 3).map((k) => LABEL[k]);
  if (distractors.length < 3) return null;
  if (new Set([LABEL[key], ...distractors]).size !== 4) return null;
  return distractors;
}

/* ------------------------------------------------------------------ *
 * 1. Plain statement chain
 * ------------------------------------------------------------------ */
const statementChain = {
  id: "relation-statement-chain",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (let c = 0; c < CHAINS.length; c += 1) {
      for (let s = 0; s < LETTER_SETS.length; s += 1) out.push({ chain: c, set: s });
    }
    return out;
  },
  make({ chain, set }) {
    const names = LETTER_SETS[set];
    const solved = solveChain(CHAINS[chain], names);
    if (!solved) return null;
    const distractors = optionsFor(solved.rel.key);
    if (!distractors) return null;

    const en = solved.facts.map(([p, r, q]) => `${p} is the ${NAME_EN[r]} of ${q}.`).join(" ");
    const mr = solved.facts.map(([p, r, q]) => `${mrRel(p, q, r)}.`).join(" ");

    return {
      correct: LABEL[solved.rel.key],
      distractors,
      en: {
        text: `${en} How is ${solved.x} related to ${solved.y}?`,
        explanation: `Sketch the family as you read, putting each generation on its own line and marking men and women separately.\n${en}\n${RULE_NOTE_EN}\n${narrate(solved, "en")}\nSo ${solved.x} is the ${NAME_EN[solved.rel.key]} of ${solved.y}.\n${TRAP_EN}`,
      },
      mr: {
        text: `${mr} तर ${solved.x} चे ${solved.y} शी नाते काय?`,
        explanation: `वाचता वाचता कुटुंबाची आकृती काढा, प्रत्येक पिढी वेगळ्या ओळीत लिहा आणि पुरुष व स्त्री वेगळ्या खुणांनी दाखवा.\n${mr}\n${RULE_NOTE_MR}\n${narrate(solved, "mr")}\nम्हणून ${mrRel(solved.x, solved.y, solved.rel.key)}.\n${TRAP_MR}`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 2. Symbol legend
 * ------------------------------------------------------------------ */
const codedExpression = {
  id: "relation-coded-expression",
  difficulty: "hard",
  cases() {
    const out = [];
    for (let c = 0; c < CHAINS.length; c += 1) {
      for (let s = 0; s < LETTER_SETS.length; s += 1) out.push({ chain: c, set: s });
    }
    return out;
  },
  make({ chain, set }) {
    const names = LETTER_SETS[set];
    const solved = solveChain(CHAINS[chain], names);
    if (!solved) return null;
    const distractors = optionsFor(solved.rel.key);
    if (!distractors) return null;

    // The legend must cover the relations used, padded out to four entries.
    const used = [...new Set(solved.facts.map(([, r]) => r))];
    const fillers = ["father", "mother", "brother", "sister", "son", "daughter", "husband", "wife"];
    const legendRels = [...used];
    for (const f of fillers) {
      if (legendRels.length >= 4) break;
      if (!legendRels.includes(f)) legendRels.push(f);
    }
    if (legendRels.length !== 4) return null;

    const symbolOf = {};
    legendRels.forEach((r, i) => {
      symbolOf[r] = SYMBOLS[i];
    });

    const legendEn = legendRels
      .map((r) => `A ${symbolOf[r]} B means 'A is the ${NAME_EN[r]} of B'`)
      .join(", ");
    const legendMr = legendRels
      .map((r) => `A ${symbolOf[r]} B म्हणजे '${mrRel("A", "B", r)}'`)
      .join(", ");

    let expr = solved.facts[0][0];
    for (const [, rel, q] of solved.facts) expr += ` ${symbolOf[rel]} ${q}`;

    const readingEn = solved.facts
      .map(([p, r, q]) => `${p} ${symbolOf[r]} ${q} says ${p} is the ${NAME_EN[r]} of ${q}`)
      .join("; ");
    const readingMr = solved.facts
      .map(([p, r, q]) => `${p} ${symbolOf[r]} ${q} म्हणजे ${mrRel(p, q, r)}`)
      .join("; ");

    return {
      correct: LABEL[solved.rel.key],
      distractors,
      en: {
        text: `If ${legendEn}, then how is ${solved.x} related to ${solved.y} in the expression ${expr}?`,
        explanation: `Translate the symbols into ordinary sentences first; the expression is only shorthand and is not meant to be calculated.\nReading it left to right: ${readingEn}.\n${RULE_NOTE_EN}\n${narrate(solved, "en")}\nSo ${solved.x} is the ${NAME_EN[solved.rel.key]} of ${solved.y}.\n${TRAP_EN}`,
      },
      mr: {
        text: `जर ${legendMr}, तर ${expr} या मांडणीत ${solved.x} चे ${solved.y} शी नाते काय?`,
        explanation: `प्रथम चिन्हांचे साध्या वाक्यांत रूपांतर करा; ही मांडणी म्हणजे फक्त संक्षिप्त लेखन आहे, ती सोडवायची गणिती क्रिया नाही.\nडावीकडून उजवीकडे वाचल्यास: ${readingMr}.\n${RULE_NOTE_MR}\n${narrate(solved, "mr")}\nम्हणून ${mrRel(solved.x, solved.y, solved.rel.key)}.\n${TRAP_MR}`,
      },
    };
  },
};

export const topicId = "blood-relations";

export const archetypes = [statementChain, codedExpression];
