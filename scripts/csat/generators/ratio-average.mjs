/**
 * Generator: Ratio, Proportion & Averages (including mixtures and alligation).
 */

import { inr, isClean, num, round } from "../lib/util.mjs";
import { gcd, gcdAll, simplifyRatio } from "../lib/math.mjs";

const ratioStr = (list) => simplifyRatio(list).join(" : ");

/* ------------------------------------------------------------------ *
 * 1. Dividing an amount in a given ratio
 * ------------------------------------------------------------------ */
const ratioShare = {
  id: "ratio-share",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const [a, b, c] of [[2, 3, 5], [3, 4, 5], [1, 2, 4], [4, 5, 6], [2, 5, 7], [3, 5, 8], [1, 3, 5], [5, 6, 9]]) {
      for (const unit of [120, 250, 400, 600, 900]) out.push({ a, b, c, unit });
    }
    return out;
  },
  make({ a, b, c, unit }) {
    if (gcdAll([a, b, c]) !== 1) return null;
    const total = (a + b + c) * unit;
    const shareB = b * unit;
    const diff = (c - a) * unit;
    if (diff <= 0) return null;

    const correct = inr(shareB);
    const distractors = [inr(a * unit), inr(c * unit), inr(round(total / 3, 2))];

    return {
      correct,
      distractors,
      en: {
        text: `A sum of ${inr(total)} is divided among A, B and C in the ratio ${a} : ${b} : ${c}. Find B's share.`,
        explanation: `Let the shares be ${a}x, ${b}x and ${c}x.\nTotal = ${a}x + ${b}x + ${c}x = ${num(a + b + c)}x = ${inr(total)}.\nSo x = ${inr(total)} ÷ ${num(a + b + c)} = ${inr(unit)}.\nB's share = ${b}x = ${b} × ${inr(unit)} = ${inr(shareB)}.\nCheck: A gets ${inr(a * unit)}, B gets ${inr(shareB)}, C gets ${inr(c * unit)}, and these add back to ${inr(total)}.\nAlways divide the total by the SUM of the ratio terms, not by the number of people.`,
      },
      mr: {
        text: `${inr(total)} ही रक्कम अ, ब व क यांच्यात ${a} : ${b} : ${c} या गुणोत्तरात वाटली आहे. तर ब चा वाटा किती?`,
        explanation: `वाटे ${a}x, ${b}x व ${c}x असे धरा.\nएकूण = ${a}x + ${b}x + ${c}x = ${num(a + b + c)}x = ${inr(total)}.\nम्हणून x = ${inr(total)} ÷ ${num(a + b + c)} = ${inr(unit)}.\nब चा वाटा = ${b}x = ${b} × ${inr(unit)} = ${inr(shareB)}.\nपडताळणी: अ ला ${inr(a * unit)}, ब ला ${inr(shareB)}, क ला ${inr(c * unit)} मिळतात आणि यांची बेरीज ${inr(total)} होते.\nएकूण रक्कम गुणोत्तराच्या पदांच्या बेरजेने भागावी, माणसांच्या संख्येने नाही.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 2. Ratio that changes when a constant is added to both terms
 * ------------------------------------------------------------------ */
const ratioChange = {
  id: "ratio-change",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const k of [3, 4, 5, 6, 7, 8, 9, 12]) {
      for (const [a, b] of [[2, 3], [3, 4], [4, 5], [3, 5], [5, 7], [2, 5]]) {
        for (const add of [4, 6, 8, 10]) out.push({ k, a, b, add });
      }
    }
    return out;
  },
  make({ k, a, b, add }) {
    const x = a * k;
    const y = b * k;
    const nx = x + add;
    const ny = y + add;
    const g = gcd(nx, ny);
    const c = nx / g;
    const d = ny / g;
    if (c === a && d === b) return null;
    if (c > 30 || d > 30) return null;

    const correct = num(x);
    const distractors = [num(y), num(x + add), num(y - add)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `Two numbers are in the ratio ${a} : ${b}. If ${num(add)} is added to each of them, the ratio becomes ${c} : ${d}. Find the smaller number.`,
        explanation: `Let the numbers be ${a}x and ${b}x — using a single variable is what makes ratio problems tractable.\nAfter adding ${num(add)} to each: (${a}x + ${num(add)}) : (${b}x + ${num(add)}) = ${c} : ${d}.\nCross-multiplying: ${d}(${a}x + ${num(add)}) = ${c}(${b}x + ${num(add)}).\nThat gives ${num(d * a)}x + ${num(d * add)} = ${num(c * b)}x + ${num(c * add)}, so ${num(Math.abs(d * a - c * b))}x = ${num(Math.abs(c * add - d * add))} and x = ${num(k)}.\nThe numbers are ${a} × ${num(k)} = ${num(x)} and ${b} × ${num(k)} = ${num(y)}, so the smaller one is ${num(x)}.\nCheck: (${num(x)} + ${num(add)}) : (${num(y)} + ${num(add)}) = ${num(nx)} : ${num(ny)} = ${c} : ${d}.`,
      },
      mr: {
        text: `दोन संख्यांचे गुणोत्तर ${a} : ${b} आहे. प्रत्येक संख्येत ${num(add)} मिळवल्यास गुणोत्तर ${c} : ${d} होते. तर लहान संख्या कोणती?`,
        explanation: `संख्या ${a}x व ${b}x अशा धरा — एकाच चलात मांडणी केल्यानेच गुणोत्तराची उदाहरणे सोपी होतात.\nप्रत्येकात ${num(add)} मिळवल्यावर: (${a}x + ${num(add)}) : (${b}x + ${num(add)}) = ${c} : ${d}.\nतिरकस गुणाकार: ${d}(${a}x + ${num(add)}) = ${c}(${b}x + ${num(add)}).\nयातून ${num(d * a)}x + ${num(d * add)} = ${num(c * b)}x + ${num(c * add)}, म्हणून ${num(Math.abs(d * a - c * b))}x = ${num(Math.abs(c * add - d * add))} आणि x = ${num(k)}.\nसंख्या ${a} × ${num(k)} = ${num(x)} व ${b} × ${num(k)} = ${num(y)}, म्हणून लहान संख्या ${num(x)}.\nपडताळणी: (${num(x)} + ${num(add)}) : (${num(y)} + ${num(add)}) = ${num(nx)} : ${num(ny)} = ${c} : ${d}.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 3. Average changes when one value is replaced
 * ------------------------------------------------------------------ */
const averageReplacement = {
  id: "average-replacement",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const n of [8, 10, 12, 15, 16, 20]) {
      for (const d of [1, 1.5, 2, 2.5, 3]) {
        for (const w of [45, 50, 55, 60, 65]) out.push({ n, d, w });
      }
    }
    return out;
  },
  make({ n, d, w }) {
    const newWeight = w + n * d;
    if (!isClean(newWeight)) return null;

    const correct = num(newWeight);
    const distractors = [num(w + d), num(w + n), num(w + 2 * n * d)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `The average weight of ${num(n)} students increases by ${num(d)} kg when a student weighing ${num(w)} kg is replaced by a new student. What is the weight of the new student, in kg?`,
        explanation: `The number of students does not change, only the total weight does.\nIf the average of ${num(n)} students rises by ${num(d)} kg, the total weight rises by ${num(n)} × ${num(d)} = ${num(n * d)} kg.\nThat entire rise comes from swapping one student for another.\nSo the new student is ${num(n * d)} kg heavier than the one who left.\nWeight of the new student = ${num(w)} + ${num(n * d)} = ${num(newWeight)} kg.\nA common error is to add just ${num(d)} kg — but the increase of ${num(d)} kg applies to every one of the ${num(n)} students.`,
      },
      mr: {
        text: `${num(n)} विद्यार्थ्यांपैकी ${num(w)} किलो वजनाच्या विद्यार्थ्याच्या जागी नवीन विद्यार्थी आल्यास सरासरी वजन ${num(d)} किलोने वाढते. तर नवीन विद्यार्थ्याचे वजन किती किलो?`,
        explanation: `विद्यार्थ्यांची संख्या बदलत नाही, फक्त एकूण वजन बदलते.\n${num(n)} विद्यार्थ्यांची सरासरी ${num(d)} किलोने वाढली, तर एकूण वजन ${num(n)} × ${num(d)} = ${num(n * d)} किलोने वाढते.\nही संपूर्ण वाढ एका विद्यार्थ्याच्या जागी दुसरा आल्यामुळेच झाली आहे.\nम्हणून नवीन विद्यार्थी गेलेल्या विद्यार्थ्यापेक्षा ${num(n * d)} किलोने जड आहे.\nनवीन विद्यार्थ्याचे वजन = ${num(w)} + ${num(n * d)} = ${num(newWeight)} किलो.\nफक्त ${num(d)} किलो मिळवणे ही नेहमीची चूक आहे — कारण ${num(d)} किलोची वाढ ${num(n)} विद्यार्थ्यांपैकी प्रत्येकाला लागू होते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 4. Combined average of two groups
 * ------------------------------------------------------------------ */
const combinedAverage = {
  id: "combined-average",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const [n1, n2] of [[20, 30], [15, 25], [24, 36], [12, 18], [30, 20], [40, 10], [25, 15]]) {
      for (const [a1, a2] of [[60, 70], [45, 55], [72, 62], [80, 65], [50, 75]]) {
        out.push({ n1, n2, a1, a2 });
      }
    }
    return out;
  },
  make({ n1, n2, a1, a2 }) {
    const total = n1 * a1 + n2 * a2;
    const avg = total / (n1 + n2);
    if (!isClean(avg)) return null;

    const correct = num(round(avg, 2));
    const distractors = [num(round((a1 + a2) / 2, 2)), num(a1), num(a2)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `In a class, ${num(n1)} boys have an average score of ${num(a1)} marks and ${num(n2)} girls have an average score of ${num(a2)} marks. Find the average score of the whole class.`,
        explanation: `Averages cannot simply be averaged again unless the two groups are the same size.\nTotal marks of the boys = ${num(n1)} × ${num(a1)} = ${num(n1 * a1)}.\nTotal marks of the girls = ${num(n2)} × ${num(a2)} = ${num(n2 * a2)}.\nCombined total = ${num(total)} over ${num(n1)} + ${num(n2)} = ${num(n1 + n2)} students.\nClass average = ${num(total)} ÷ ${num(n1 + n2)} = ${num(round(avg, 2))}.\nTaking the plain average of ${num(a1)} and ${num(a2)} would give ${num(round((a1 + a2) / 2, 2))}, which is only right when the groups are equal in size.`,
      },
      mr: {
        text: `एका वर्गात ${num(n1)} मुलांचे सरासरी गुण ${num(a1)} आहेत आणि ${num(n2)} मुलींचे सरासरी गुण ${num(a2)} आहेत. तर संपूर्ण वर्गाचे सरासरी गुण किती?`,
        explanation: `दोन्ही गटांची संख्या समान असल्याशिवाय सरासरींची पुन्हा सरासरी काढता येत नाही.\nमुलांचे एकूण गुण = ${num(n1)} × ${num(a1)} = ${num(n1 * a1)}.\nमुलींचे एकूण गुण = ${num(n2)} × ${num(a2)} = ${num(n2 * a2)}.\nएकत्रित एकूण = ${num(total)} आणि एकूण विद्यार्थी = ${num(n1)} + ${num(n2)} = ${num(n1 + n2)}.\nवर्गाची सरासरी = ${num(total)} ÷ ${num(n1 + n2)} = ${num(round(avg, 2))}.\n${num(a1)} व ${num(a2)} यांची साधी सरासरी घेतल्यास ${num(round((a1 + a2) / 2, 2))} येते, जे दोन्ही गट समान असतील तेव्हाच बरोबर असते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 5. Alligation — mixing two grades to reach a mean price
 * ------------------------------------------------------------------ */
const alligation = {
  id: "alligation",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const cheap of [20, 24, 30, 36, 40, 45]) {
      for (const dear of [50, 60, 72, 80, 90]) {
        for (const mean of [35, 42, 48, 54, 64]) {
          if (mean > cheap && mean < dear) out.push({ cheap, dear, mean });
        }
      }
    }
    return out;
  },
  make({ cheap, dear, mean }) {
    const p1 = dear - mean;
    const p2 = mean - cheap;
    const g = gcd(p1, p2);
    const r1 = p1 / g;
    const r2 = p2 / g;
    if (r1 > 25 || r2 > 25) return null;

    const correct = `${r1} : ${r2}`;
    const distractors = [`${r2} : ${r1}`, `${p2} : ${p1}`, `${r1 + 1} : ${r2}`];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `In what ratio must rice costing ${inr(cheap)} per kg be mixed with rice costing ${inr(dear)} per kg so that the mixture is worth ${inr(mean)} per kg?`,
        explanation: `Use the rule of alligation. Place the two prices on either side and the mean price in the middle.\nQuantity of cheaper ÷ Quantity of dearer = (price of dearer − mean) ÷ (mean − price of cheaper).\n= (${num(dear)} − ${num(mean)}) ÷ (${num(mean)} − ${num(cheap)}) = ${num(p1)} ÷ ${num(p2)}.\nIn lowest terms that is ${r1} : ${r2}.\nCheck with ${num(r1)} kg and ${num(r2)} kg: total cost = ${num(r1)} × ${num(cheap)} + ${num(r2)} × ${num(dear)} = ${num(r1 * cheap + r2 * dear)} for ${num(r1 + r2)} kg, i.e. ${inr(round((r1 * cheap + r2 * dear) / (r1 + r2), 2))} per kg.\nNote the cross-over: the CHEAPER quantity is paired with the difference on the DEARER side. Reversing this gives ${r2} : ${r1}, the usual trap.`,
      },
      mr: {
        text: `प्रति किलो ${inr(cheap)} किंमतीचा तांदूळ आणि प्रति किलो ${inr(dear)} किंमतीचा तांदूळ कोणत्या गुणोत्तरात मिसळल्यास मिश्रणाची किंमत प्रति किलो ${inr(mean)} होईल?`,
        explanation: `मिश्रणाचा (alligation) नियम वापरा. दोन्ही किंमती दोन बाजूंना व सरासरी किंमत मध्ये ठेवा.\nस्वस्त मालाचे प्रमाण ÷ महाग मालाचे प्रमाण = (महाग किंमत − सरासरी) ÷ (सरासरी − स्वस्त किंमत).\n= (${num(dear)} − ${num(mean)}) ÷ (${num(mean)} − ${num(cheap)}) = ${num(p1)} ÷ ${num(p2)}.\nलघुतम रूपात हे ${r1} : ${r2} असे होते.\n${num(r1)} किलो व ${num(r2)} किलो घेऊन पडताळणी: एकूण किंमत = ${num(r1)} × ${num(cheap)} + ${num(r2)} × ${num(dear)} = ${num(r1 * cheap + r2 * dear)}, आणि ${num(r1 + r2)} किलोसाठी म्हणजे प्रति किलो ${inr(round((r1 * cheap + r2 * dear) / (r1 + r2), 2))}.\nक्रॉस पद्धत लक्षात ठेवा: स्वस्त मालाचे प्रमाण महाग बाजूच्या फरकाशी जोडले जाते. उलट केल्यास ${r2} : ${r1} असा नेहमीचा सापळा येतो.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 6. Repeated replacement from a vessel
 * ------------------------------------------------------------------ */
const mixtureReplacement = {
  id: "mixture-replacement",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const V of [40, 50, 60, 80, 100, 120]) {
      for (const frac of [4, 5, 6, 8, 10]) {
        for (const n of [2, 3]) out.push({ V, frac, n });
      }
    }
    return out;
  },
  make({ V, frac, n }) {
    const x = V / frac;
    if (!Number.isInteger(x)) return null;
    const left = V * (1 - x / V) ** n;
    if (!isClean(left)) return null;

    const correct = num(round(left, 2));
    const distractors = [
      num(round(V - n * x, 2)),
      num(round(V * (1 - (n * x) / V), 2)),
      num(round(V - x, 2)),
    ];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `A vessel contains ${num(V)} litres of pure milk. ${num(x)} litres are drawn out and replaced by water. This operation is repeated ${num(n)} times in all. How much pure milk remains in the vessel, in litres?`,
        explanation: `Each time, ${num(x)} litres out of ${num(V)} litres is removed, so the fraction of milk that SURVIVES one operation is (1 − ${num(x)}/${num(V)}) = ${num(round(1 - x / V, 4))}.\nCrucially, after the first replacement the liquid drawn out is a mixture, not pure milk — which is why you multiply the fraction rather than subtracting ${num(x)} each time.\nAfter ${num(n)} operations, milk left = ${num(V)} × (1 − ${num(x)}/${num(V)})^${num(n)}.\n= ${num(V)} × ${num(round((1 - x / V) ** n, 4))} = ${num(round(left, 2))} litres.\nSubtracting ${num(n)} × ${num(x)} = ${num(n * x)} litres would give ${num(V - n * x)} litres, which is the standard mistake.`,
      },
      mr: {
        text: `एका भांड्यात ${num(V)} लिटर शुद्ध दूध आहे. त्यातून ${num(x)} लिटर काढून त्याजागी तेवढेच पाणी टाकले जाते. ही क्रिया एकूण ${num(n)} वेळा केली जाते. तर भांड्यात किती लिटर शुद्ध दूध शिल्लक राहील?`,
        explanation: `प्रत्येक वेळी ${num(V)} लिटरपैकी ${num(x)} लिटर काढले जाते, म्हणून एका क्रियेनंतर शिल्लक राहणाऱ्या दुधाचे प्रमाण = (1 − ${num(x)}/${num(V)}) = ${num(round(1 - x / V, 4))}.\nमहत्त्वाचे: पहिल्या बदलानंतर काढले जाणारे द्रव हे मिश्रण असते, शुद्ध दूध नव्हे — म्हणूनच दरवेळी ${num(x)} वजा न करता या अपूर्णांकाचा गुणाकार करावा लागतो.\n${num(n)} क्रियांनंतर शिल्लक दूध = ${num(V)} × (1 − ${num(x)}/${num(V)})^${num(n)}.\n= ${num(V)} × ${num(round((1 - x / V) ** n, 4))} = ${num(round(left, 2))} लिटर.\n${num(n)} × ${num(x)} = ${num(n * x)} लिटर वजा केल्यास ${num(V - n * x)} लिटर असे चुकीचे उत्तर येते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 7. Adding water to a milk-water mixture
 * ------------------------------------------------------------------ */
const addWater = {
  id: "mixture-add-water",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const [a, b] of [[3, 2], [4, 1], [5, 3], [7, 3], [2, 1], [5, 2], [3, 1]]) {
      for (const unit of [4, 5, 6, 8, 10]) {
        for (const add of [5, 6, 10, 12] ) out.push({ a, b, unit, add });
      }
    }
    return out;
  },
  make({ a, b, unit, add }) {
    const milk = a * unit;
    const water = b * unit + add;
    const g = gcd(milk, water);
    const r1 = milk / g;
    const r2 = water / g;
    if (r1 > 40 || r2 > 40) return null;
    const total = (a + b) * unit;

    const correct = `${r1} : ${r2}`;
    const distractors = [`${r2} : ${r1}`, `${a} : ${b}`, `${milk} : ${b * unit}`];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `${num(total)} litres of a mixture contains milk and water in the ratio ${a} : ${b}. If ${num(add)} litres of water is added to it, what is the new ratio of milk to water?`,
        explanation: `Split the ${num(total)} litres in the ratio ${a} : ${b}. The parts total ${num(a + b)}, so one part = ${num(total)} ÷ ${num(a + b)} = ${num(unit)} litres.\nMilk = ${a} × ${num(unit)} = ${num(milk)} litres, water = ${b} × ${num(unit)} = ${num(b * unit)} litres.\nAdding water does not change the milk, so milk stays at ${num(milk)} litres.\nNew water = ${num(b * unit)} + ${num(add)} = ${num(water)} litres.\nNew ratio = ${num(milk)} : ${num(water)} = ${r1} : ${r2} in lowest terms.\nThe quantity that is NOT added stays fixed — anchoring on it is what keeps these problems simple.`,
      },
      mr: {
        text: `${num(total)} लिटर मिश्रणात दूध व पाणी ${a} : ${b} या गुणोत्तरात आहे. त्यात ${num(add)} लिटर पाणी मिसळल्यास दूध व पाणी यांचे नवीन गुणोत्तर काय होईल?`,
        explanation: `${num(total)} लिटर ${a} : ${b} या गुणोत्तरात विभागा. पदांची बेरीज ${num(a + b)}, म्हणून एक भाग = ${num(total)} ÷ ${num(a + b)} = ${num(unit)} लिटर.\nदूध = ${a} × ${num(unit)} = ${num(milk)} लिटर, पाणी = ${b} × ${num(unit)} = ${num(b * unit)} लिटर.\nपाणी मिसळल्याने दुधाचे प्रमाण बदलत नाही, म्हणून दूध ${num(milk)} लिटरच राहते.\nनवीन पाणी = ${num(b * unit)} + ${num(add)} = ${num(water)} लिटर.\nनवीन गुणोत्तर = ${num(milk)} : ${num(water)} = लघुतम रूपात ${r1} : ${r2}.\nजी गोष्ट मिसळली जात नाही ती स्थिर राहते — तिच्यावर लक्ष ठेवल्यास अशी उदाहरणे सोपी होतात.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 8. Fourth proportional / mean proportional
 * ------------------------------------------------------------------ */
const proportional = {
  id: "proportional",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const [a, b, c] of [[4, 6, 10], [5, 8, 15], [6, 9, 14], [3, 7, 12], [8, 12, 20], [9, 15, 24], [7, 14, 18], [10, 16, 25]]) {
      out.push({ kind: "fourth", a, b, c });
    }
    for (const [a, b] of [[4, 9], [9, 16], [16, 25], [8, 18], [12, 27], [5, 20], [3, 27], [6, 24]]) {
      out.push({ kind: "mean", a, b });
    }
    return out;
  },
  make(params) {
    if (params.kind === "fourth") {
      const { a, b, c } = params;
      const d = (b * c) / a;
      if (!isClean(d)) return null;
      const correct = num(round(d, 2));
      const distractors = [num(round((a * c) / b, 2)), num(round((a * b) / c, 2)), num(round(d + a, 2))];
      if (new Set([correct, ...distractors]).size !== 4) return null;
      return {
        correct,
        distractors,
        en: {
          text: `Find the fourth proportional to ${num(a)}, ${num(b)} and ${num(c)}.`,
          explanation: `The fourth proportional d satisfies ${num(a)} : ${num(b)} :: ${num(c)} : d.\nIn a proportion the product of the extremes equals the product of the means, so ${num(a)} × d = ${num(b)} × ${num(c)}.\n${num(a)}d = ${num(b * c)}.\nd = ${num(b * c)} ÷ ${num(a)} = ${num(round(d, 2))}.\nKeep the order of the terms as given — swapping ${num(b)} and ${num(c)} produces a different and wrong value.`,
        },
        mr: {
          text: `${num(a)}, ${num(b)} व ${num(c)} यांची चौथी प्रमाणसंख्या काढा.`,
          explanation: `चौथी प्रमाणसंख्या d साठी ${num(a)} : ${num(b)} :: ${num(c)} : d असे असते.\nप्रमाणात टोकांचा गुणाकार = मध्यांचा गुणाकार, म्हणून ${num(a)} × d = ${num(b)} × ${num(c)}.\n${num(a)}d = ${num(b * c)}.\nd = ${num(b * c)} ÷ ${num(a)} = ${num(round(d, 2))}.\nपदांचा क्रम दिल्याप्रमाणेच ठेवावा — ${num(b)} व ${num(c)} यांची अदलाबदल केल्यास वेगळे व चुकीचे उत्तर येते.`,
        },
      };
    }
    const { a, b } = params;
    const m = Math.sqrt(a * b);
    if (!Number.isInteger(m)) return null;
    const correct = num(m);
    const distractors = [num(round((a + b) / 2, 2)), num(a + b), num(round(m + 2, 2))];
    if (new Set([correct, ...distractors]).size !== 4) return null;
    return {
      correct,
      distractors,
      en: {
        text: `Find the mean proportional between ${num(a)} and ${num(b)}.`,
        explanation: `The mean proportional m satisfies ${num(a)} : m :: m : ${num(b)}.\nSo m × m = ${num(a)} × ${num(b)} = ${num(a * b)}.\nm = √${num(a * b)} = ${num(m)}.\nThe mean proportional is the GEOMETRIC mean, not the arithmetic mean — the arithmetic mean here would be ${num(round((a + b) / 2, 2))}, which is a different quantity.`,
      },
      mr: {
        text: `${num(a)} व ${num(b)} यांच्यातील मध्यम प्रमाणसंख्या काढा.`,
        explanation: `मध्यम प्रमाणसंख्या m साठी ${num(a)} : m :: m : ${num(b)} असे असते.\nम्हणून m × m = ${num(a)} × ${num(b)} = ${num(a * b)}.\nm = √${num(a * b)} = ${num(m)}.\nमध्यम प्रमाणसंख्या ही गुणोत्तरी (geometric) सरासरी असते, अंकगणिती सरासरी नव्हे — येथे अंकगणिती सरासरी ${num(round((a + b) / 2, 2))} आली असती, जी वेगळी गोष्ट आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 9. Chaining two ratios into one
 * ------------------------------------------------------------------ */
const chainRatio = {
  id: "chain-ratio",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const [a, b] of [[2, 3], [3, 4], [4, 5], [5, 6], [3, 5], [2, 5], [4, 7]]) {
      for (const [c, d] of [[2, 3], [3, 4], [4, 5], [5, 7], [6, 7], [3, 8]]) {
        out.push({ a, b, c, d });
      }
    }
    return out;
  },
  make({ a, b, c, d }) {
    const A = a * c;
    const B = b * c;
    const C = b * d;
    const parts = simplifyRatio([A, B, C]);
    if (parts.some((p) => p > 60)) return null;

    const correct = parts.join(" : ");
    const distractors = [
      simplifyRatio([a, b, d]).join(" : "),
      simplifyRatio([a * d, b * d, b * c]).join(" : "),
      [a, b, c].join(" : "),
    ];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `If A : B = ${a} : ${b} and B : C = ${c} : ${d}, find A : B : C.`,
        explanation: `B appears in both ratios but with different values — ${b} in the first and ${c} in the second. Make them agree.\nMultiply the first ratio throughout by ${num(c)}: A : B = ${num(A)} : ${num(B)}.\nMultiply the second ratio throughout by ${num(b)}: B : C = ${num(B)} : ${num(C)}.\nNow B is ${num(B)} in both, so they can be joined: A : B : C = ${num(A)} : ${num(B)} : ${num(C)}.\nIn lowest terms this is ${correct}.\nYou may not simply write ${a} : ${b} : ${d} — that ignores the fact that the two ratios measure B on different scales.`,
      },
      mr: {
        text: `जर अ : ब = ${a} : ${b} आणि ब : क = ${c} : ${d} असेल, तर अ : ब : क काढा.`,
        explanation: `ब हे दोन्ही गुणोत्तरांत येते पण वेगवेगळ्या मूल्यांसह — पहिल्यात ${b} व दुसऱ्यात ${c}. ती समान करावी लागतील.\nपहिले गुणोत्तर ${num(c)} ने गुणा: अ : ब = ${num(A)} : ${num(B)}.\nदुसरे गुणोत्तर ${num(b)} ने गुणा: ब : क = ${num(B)} : ${num(C)}.\nआता दोन्हीकडे ब = ${num(B)} आहे, म्हणून ती जोडता येतात: अ : ब : क = ${num(A)} : ${num(B)} : ${num(C)}.\nलघुतम रूपात ${correct}.\nसरळ ${a} : ${b} : ${d} असे लिहिता येणार नाही, कारण दोन्ही गुणोत्तरांत ब चे मापन वेगळ्या प्रमाणात झाले आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 10. Incomes in one ratio, expenditures in another, equal savings
 * ------------------------------------------------------------------ */
const incomeRatioSavings = {
  id: "income-ratio-savings",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const [i1, i2] of [[3, 4], [4, 5], [5, 6], [5, 7], [7, 9], [2, 3]]) {
      for (const [e1, e2] of [[1, 2], [2, 3], [3, 4], [3, 5], [4, 5]]) {
        for (const s of [600, 900, 1200, 1500, 2400]) out.push({ i1, i2, e1, e2, s });
      }
    }
    return out;
  },
  make({ i1, i2, e1, e2, s }) {
    // i1*x - e1*y = s and i2*x - e2*y = s
    const det = i1 * -e2 - -e1 * i2;
    if (det === 0) return null;
    const x = (s * -e2 - -e1 * s) / det;
    const y = (i1 * s - s * i2) / det;
    if (x <= 0 || y <= 0) return null;
    if (!Number.isInteger(x) || !Number.isInteger(y)) return null;
    const incomeA = i1 * x;
    if (incomeA < 1000 || incomeA > 200000) return null;

    const correct = inr(incomeA);
    const distractors = [inr(i2 * x), inr(e1 * y), inr(incomeA + s)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `The incomes of A and B are in the ratio ${i1} : ${i2} and their expenditures are in the ratio ${e1} : ${e2}. If each of them saves ${inr(s)}, find A's income.`,
        explanation: `Use a DIFFERENT variable for each ratio — this is the key step, because incomes and expenditures scale independently.\nLet the incomes be ${i1}x and ${i2}x, and the expenditures be ${e1}y and ${e2}y.\nSavings = income − expenditure, and both savings equal ${inr(s)}:\n  ${i1}x − ${e1}y = ${num(s)}\n  ${i2}x − ${e2}y = ${num(s)}\nSolving these two equations together gives x = ${num(x)} and y = ${num(y)}.\nA's income = ${i1}x = ${i1} × ${num(x)} = ${inr(incomeA)}.\nCheck: A spends ${e1} × ${num(y)} = ${inr(e1 * y)} and saves ${inr(incomeA - e1 * y)}.\nUsing the same variable x for both ratios is the classic error and makes the problem unsolvable.`,
      },
      mr: {
        text: `अ व ब यांच्या उत्पन्नांचे गुणोत्तर ${i1} : ${i2} आहे आणि त्यांच्या खर्चांचे गुणोत्तर ${e1} : ${e2} आहे. दोघेही प्रत्येकी ${inr(s)} बचत करत असतील, तर अ चे उत्पन्न किती?`,
        explanation: `दोन्ही गुणोत्तरांसाठी वेगवेगळे चल वापरा — हीच मुख्य पायरी आहे, कारण उत्पन्न व खर्च स्वतंत्रपणे बदलतात.\nउत्पन्ने ${i1}x व ${i2}x आणि खर्च ${e1}y व ${e2}y असे धरा.\nबचत = उत्पन्न − खर्च, आणि दोघांची बचत ${inr(s)} आहे:\n  ${i1}x − ${e1}y = ${num(s)}\n  ${i2}x − ${e2}y = ${num(s)}\nही दोन समीकरणे एकत्र सोडवल्यास x = ${num(x)} व y = ${num(y)}.\nअ चे उत्पन्न = ${i1}x = ${i1} × ${num(x)} = ${inr(incomeA)}.\nपडताळणी: अ चा खर्च ${e1} × ${num(y)} = ${inr(e1 * y)} आणि बचत ${inr(incomeA - e1 * y)}.\nदोन्ही गुणोत्तरांसाठी एकच चल x वापरणे ही नेहमीची चूक असून त्यामुळे उदाहरण सुटतच नाही.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 11. Average of a set after a wrong reading is corrected
 * ------------------------------------------------------------------ */
const correctedAverage = {
  id: "corrected-average",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const n of [10, 12, 15, 20, 25]) {
      for (const avg of [40, 45, 52, 60, 75]) {
        for (const [wrong, right] of [[26, 62], [35, 53], [18, 81], [46, 64], [27, 72]]) {
          out.push({ n, avg, wrong, right });
        }
      }
    }
    return out;
  },
  make({ n, avg, wrong, right }) {
    const correctedTotal = n * avg - wrong + right;
    const newAvg = correctedTotal / n;
    if (!isClean(newAvg)) return null;

    const correct = num(round(newAvg, 2));
    const distractors = [num(avg), num(round(avg + (right - wrong), 2)), num(round(newAvg + 1, 2))];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `The average of ${num(n)} observations was calculated as ${num(avg)}. It was later found that one observation was read as ${num(wrong)} instead of the correct value ${num(right)}. Find the correct average.`,
        explanation: `Work through the TOTAL, never through the average directly.\nWrong total = ${num(n)} × ${num(avg)} = ${num(n * avg)}.\nOne value was understated by ${num(right)} − ${num(wrong)} = ${num(right - wrong)}.\nCorrect total = ${num(n * avg)} + ${num(right - wrong)} = ${num(correctedTotal)}.\nCorrect average = ${num(correctedTotal)} ÷ ${num(n)} = ${num(round(newAvg, 2))}.\nAdding the full difference of ${num(right - wrong)} to the average gives ${num(round(avg + (right - wrong), 2))} — wrong, because the correction is shared across all ${num(n)} observations.`,
      },
      mr: {
        text: `${num(n)} निरीक्षणांची सरासरी ${num(avg)} अशी काढण्यात आली. नंतर असे आढळले की एक निरीक्षण ${num(right)} ऐवजी चुकून ${num(wrong)} असे घेतले गेले होते. तर बरोबर सरासरी किती?`,
        explanation: `सरासरीवर नव्हे तर एकूण बेरजेवर काम करा.\nचुकीची एकूण बेरीज = ${num(n)} × ${num(avg)} = ${num(n * avg)}.\nएक मूल्य ${num(right)} − ${num(wrong)} = ${num(right - wrong)} ने कमी घेतले गेले.\nबरोबर एकूण बेरीज = ${num(n * avg)} + ${num(right - wrong)} = ${num(correctedTotal)}.\nबरोबर सरासरी = ${num(correctedTotal)} ÷ ${num(n)} = ${num(round(newAvg, 2))}.\nसरासरीत सरळ ${num(right - wrong)} मिळवल्यास ${num(round(avg + (right - wrong), 2))} येते, जे चुकीचे आहे — कारण ही दुरुस्ती सर्व ${num(n)} निरीक्षणांत विभागली जाते.`,
      },
    };
  },
};

export const topicId = "ratio-average";

export const archetypes = [
  ratioShare,
  ratioChange,
  averageReplacement,
  combinedAverage,
  alligation,
  mixtureReplacement,
  addWater,
  proportional,
  chainRatio,
  incomeRatioSavings,
  correctedAverage,
];
