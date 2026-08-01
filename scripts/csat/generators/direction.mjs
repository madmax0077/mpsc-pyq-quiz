/**
 * Generator: Direction Sense.
 *
 * Every walk is described with a fixed sentence pattern so the validator can
 * re-parse the rendered text and simulate the route on a coordinate grid.
 */

import { num } from "../lib/util.mjs";

const DIRS = ["north", "east", "south", "west"];
const DIRS_MR = { north: "उत्तर", east: "पूर्व", south: "दक्षिण", west: "पश्चिम" };
const STEP = { north: [0, 1], east: [1, 0], south: [0, -1], west: [-1, 0] };

const turnRight = (d) => DIRS[(DIRS.indexOf(d) + 1) % 4];
const turnLeft = (d) => DIRS[(DIRS.indexOf(d) + 3) % 4];

/**
 * Options carry both languages ("उत्तर / North") because a compass direction
 * cannot be written language-neutrally the way a number can.
 */
const FACING_LABEL = {
  north: "उत्तर / North",
  east: "पूर्व / East",
  south: "दक्षिण / South",
  west: "पश्चिम / West",
};
const BEARING_LABEL = {
  "north-east": "ईशान्य / North-East",
  "north-west": "वायव्य / North-West",
  "south-east": "आग्नेय / South-East",
  "south-west": "नैऋत्य / South-West",
};

/** Compass name for a displacement, used only when both components are non-zero. */
function bearing(dx, dy) {
  const ns = dy > 0 ? "north" : "south";
  const ew = dx > 0 ? "east" : "west";
  return `${ns}-${ew}`;
}

/** Render the walk as sentences and simulate it at the same time. */
function walk(startDir, legs) {
  let dir = startDir;
  let x = 0;
  let y = 0;
  const en = [];
  const mr = [];
  legs.forEach((leg, i) => {
    if (i > 0) {
      dir = leg.turn === "right" ? turnRight(dir) : turnLeft(dir);
    }
    const [sx, sy] = STEP[dir];
    x += sx * leg.d;
    y += sy * leg.d;
    if (i === 0) {
      en.push(`A man starts from point P, faces ${dir}, and walks ${num(leg.d)} km.`);
      mr.push(`एक माणूस प या ठिकाणाहून ${DIRS_MR[dir]} दिशेला तोंड करून ${num(leg.d)} किमी चालतो.`);
    } else {
      en.push(`He then turns to his ${leg.turn} and walks ${num(leg.d)} km.`);
      mr.push(`नंतर तो आपल्या ${leg.turn === "right" ? "उजव्या" : "डाव्या"} बाजूला वळून ${num(leg.d)} किमी चालतो.`);
    }
  });
  return { en: en.join(" "), mr: mr.join(" "), x, y, dir };
}

/* ------------------------------------------------------------------ *
 * 1. Straight-line distance back to the start
 * ------------------------------------------------------------------ */
const netDistance = {
  id: "direction-net-distance",
  difficulty: "hard",
  cases() {
    const out = [];
    const triples = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20]];
    for (const [p, q] of triples) {
      for (const startDir of DIRS) {
        for (const back of [2, 3, 4, 5]) {
          out.push({ p, q, startDir, back });
        }
      }
    }
    return out;
  },
  make({ p, q, startDir, back }) {
    // Walk forward (p + back), turn right and walk q, turn right and walk back.
    // The two right turns leave a net displacement of p forward and q sideways.
    const legs = [
      { d: p + back },
      { turn: "right", d: q },
      { turn: "right", d: back },
    ];
    const w = walk(startDir, legs);
    const dist = Math.sqrt(w.x * w.x + w.y * w.y);
    if (!Number.isInteger(dist)) return null;

    const total = legs.reduce((s, l) => s + l.d, 0);
    const correct = num(dist);
    const distractors = [num(total), num(p + q), num(Math.abs(p - q) + back)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `${w.en} How far, in km, is he now from point P in a straight line?`,
        explanation: `Track the two directions separately rather than trying to picture the whole path at once.\nHe first walks ${num(p + back)} km, then after two right turns the last leg of ${num(back)} km takes him back along the same axis, so his net travel on that axis is ${num(p + back)} − ${num(back)} = ${num(p)} km.\nOn the other axis he has moved ${num(q)} km, and nothing cancels it.\nSo he is ${num(p)} km away in one direction and ${num(q)} km in a perpendicular direction — the straight-line distance is the hypotenuse of a right triangle.\nDistance = √(${num(p)}² + ${num(q)}²) = √(${num(p * p)} + ${num(q * q)}) = √${num(p * p + q * q)} = ${num(dist)} km.\nThe total distance WALKED is ${num(total)} km, but the question asks for the straight-line gap, which is always smaller.`,
      },
      mr: {
        text: `${w.mr} तर आता तो प या ठिकाणापासून सरळ रेषेत किती किमी अंतरावर आहे?`,
        explanation: `संपूर्ण मार्ग एकदम डोळ्यासमोर आणण्यापेक्षा दोन्ही दिशा स्वतंत्रपणे मोजा.\nतो प्रथम ${num(p + back)} किमी चालतो, नंतर दोन उजव्या वळणांनंतरचा ${num(back)} किमीचा शेवटचा टप्पा त्याला त्याच अक्षावर मागे आणतो, म्हणून त्या अक्षावरील निव्वळ प्रवास ${num(p + back)} − ${num(back)} = ${num(p)} किमी.\nदुसऱ्या अक्षावर तो ${num(q)} किमी सरकला असून ते कशानेही रद्द होत नाही.\nम्हणजे तो एका दिशेने ${num(p)} किमी व त्याला लंब दिशेने ${num(q)} किमी अंतरावर आहे — सरळ रेषेतील अंतर म्हणजे काटकोन त्रिकोणाचा कर्ण.\nअंतर = √(${num(p)}² + ${num(q)}²) = √(${num(p * p)} + ${num(q * q)}) = √${num(p * p + q * q)} = ${num(dist)} किमी.\nप्रत्यक्ष चाललेले एकूण अंतर ${num(total)} किमी आहे, पण प्रश्नात सरळ रेषेतील अंतर विचारले असून ते नेहमी कमीच असते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 2. Which way is he facing at the end
 * ------------------------------------------------------------------ */
const finalFacing = {
  id: "direction-final-facing",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const startDir of DIRS) {
      for (const t1 of ["left", "right"]) {
        for (const t2 of ["left", "right"]) {
          for (const t3 of ["left", "right"]) {
            out.push({ startDir, t1, t2, t3 });
          }
        }
      }
    }
    return out;
  },
  make({ startDir, t1, t2, t3 }) {
    const legs = [
      { d: 5 },
      { turn: t1, d: 3 },
      { turn: t2, d: 6 },
      { turn: t3, d: 4 },
    ];
    const w = walk(startDir, legs);
    const answer = FACING_LABEL[w.dir];

    const distractors = DIRS.filter((d) => d !== w.dir).map((d) => FACING_LABEL[d]);
    if (new Set([answer, ...distractors]).size !== 4) return null;

    // Rebuild the running direction for the explanation.
    const seq = [startDir];
    let cur = startDir;
    for (const t of [t1, t2, t3]) {
      cur = t === "right" ? turnRight(cur) : turnLeft(cur);
      seq.push(cur);
    }

    return {
      correct: answer,
      distractors: distractors,
      en: {
        text: `${w.en} In which direction is he facing now?`,
        explanation: `The distances are irrelevant here — only the turns change the direction he faces.\nStart the compass at ${startDir}.\nTurning to his ${t1} from ${seq[0]} makes him face ${seq[1]}.\nTurning to his ${t2} from ${seq[1]} makes him face ${seq[2]}.\nTurning to his ${t3} from ${seq[2]} makes him face ${seq[3]}.\nSo he is finally facing ${w.dir}.\nKeep in mind that left and right are from the WALKER's point of view, so a right turn always moves the compass one quarter clockwise: north to east to south to west.`,
      },
      mr: {
        text: `${w.mr} तर आता त्याचे तोंड कोणत्या दिशेला आहे?`,
        explanation: `येथे अंतरे बिनमहत्त्वाची आहेत — फक्त वळणांमुळेच तोंडाची दिशा बदलते.\nसुरुवातीला तोंड ${DIRS_MR[startDir]} दिशेला.\n${DIRS_MR[seq[0]]} कडून ${t1 === "right" ? "उजवीकडे" : "डावीकडे"} वळल्यावर तोंड ${DIRS_MR[seq[1]]} दिशेला होते.\n${DIRS_MR[seq[1]]} कडून ${t2 === "right" ? "उजवीकडे" : "डावीकडे"} वळल्यावर तोंड ${DIRS_MR[seq[2]]} दिशेला होते.\n${DIRS_MR[seq[2]]} कडून ${t3 === "right" ? "उजवीकडे" : "डावीकडे"} वळल्यावर तोंड ${DIRS_MR[seq[3]]} दिशेला होते.\nम्हणून शेवटी त्याचे तोंड ${DIRS_MR[seq[3]]} दिशेला आहे.\nडावे-उजवे हे चालणाऱ्याच्या दृष्टिकोनातून असते हे लक्षात ठेवा, म्हणून उजवे वळण होकायंत्र नेहमी एक चतुर्थांश घड्याळाच्या दिशेने फिरवते: उत्तर ते पूर्व ते दक्षिण ते पश्चिम.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 3. In which direction is he from the starting point
 * ------------------------------------------------------------------ */
const bearingFromStart = {
  id: "direction-bearing-from-start",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const startDir of DIRS) {
      for (const a of [4, 6, 8, 10]) {
        for (const b of [3, 5, 7, 9]) {
          for (const t of ["left", "right"]) out.push({ startDir, a, b, t });
        }
      }
    }
    return out;
  },
  make({ startDir, a, b, t }) {
    const legs = [{ d: a }, { turn: t, d: b }];
    const w = walk(startDir, legs);
    if (w.x === 0 || w.y === 0) return null;
    const key = bearing(w.x, w.y);
    const answer = BEARING_LABEL[key];

    const all = ["north-east", "north-west", "south-east", "south-west"];
    const distractors = all.filter((d) => d !== key).map((d) => BEARING_LABEL[d]);
    if (new Set([answer, ...distractors]).size !== 4) return null;

    const firstAxis = ["north", "south"].includes(startDir) ? "north-south" : "east-west";
    const secondDir = t === "right" ? turnRight(startDir) : turnLeft(startDir);
    const answerMr = answer.split("/")[0].trim();

    return {
      correct: answer,
      distractors,
      en: {
        text: `${w.en} In which direction is he now from point P?`,
        explanation: `Put point P at the origin and treat north as up and east as right.\nHis first leg of ${num(a)} km takes him ${num(a)} km ${startDir} along the ${firstAxis} axis.\nAfter turning to his ${t} he is facing ${secondDir}, and the second leg of ${num(b)} km moves him along the other axis.\nAdding the two legs, he ends up ${num(Math.abs(w.y))} km to the ${w.y > 0 ? "north" : "south"} and ${num(Math.abs(w.x))} km to the ${w.x > 0 ? "east" : "west"} of P.\nWhen a point lies both to the ${w.y > 0 ? "north" : "south"} and to the ${w.x > 0 ? "east" : "west"}, its direction is ${key}.\nThe question asks where HE is relative to P, not where P is relative to him — those two are exact opposites, and mixing them up is the classic error.`,
      },
      mr: {
        text: `${w.mr} तर आता तो प या ठिकाणापासून कोणत्या दिशेला आहे?`,
        explanation: `प हे ठिकाण आरंभबिंदू धरा आणि उत्तर वर, पूर्व उजवीकडे असे मानून आकृती काढा.\nपहिल्या ${num(a)} किमीच्या टप्प्यात तो ${DIRS_MR[startDir]} दिशेने ${num(a)} किमी जातो.\n${t === "right" ? "उजवीकडे" : "डावीकडे"} वळल्यानंतर दुसऱ्या ${num(b)} किमीच्या टप्प्यात तो दुसऱ्या अक्षावर सरकतो.\nदोन्ही टप्पे मिळून तो प पासून ${num(Math.abs(w.y))} किमी ${w.y > 0 ? "उत्तरेला" : "दक्षिणेला"} व ${num(Math.abs(w.x))} किमी ${w.x > 0 ? "पूर्वेला" : "पश्चिमेला"} पोहोचतो.\nएखादा बिंदू ${w.y > 0 ? "उत्तरेला" : "दक्षिणेला"} व ${w.x > 0 ? "पूर्वेला" : "पश्चिमेला"} अशा दोन्ही बाजूंना असेल, तेव्हा त्याची दिशा ${answerMr} असते.\nप्रश्नात तो प च्या सापेक्ष कोठे आहे असे विचारले आहे, प तो कोठे आहे असे नाही — या दोन दिशा नेमक्या विरुद्ध असतात आणि त्यांची गल्लत होणे ही नेहमीची चूक आहे.`,
      },
    };
  },
};

export const topicId = "direction";

export const archetypes = [netDistance, finalFacing, bearingFromStart];
