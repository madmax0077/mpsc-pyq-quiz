/**
 * Generator: Mensuration — areas, perimeters, volumes and surface areas.
 *
 * Circles use 22/7 and are parameterised so the radius is a multiple of 7,
 * which keeps every answer exact.
 */

import { inr, isClean, num, round } from "../lib/util.mjs";

const PI = 22 / 7;

/* ------------------------------------------------------------------ *
 * 1. Rectangle from perimeter and a ratio
 * ------------------------------------------------------------------ */
const rectangleRatio = {
  id: "rectangle-from-ratio",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const [a, b] of [[3, 2], [4, 3], [5, 3], [5, 4], [7, 5], [3, 1], [5, 2]]) {
      for (const k of [4, 5, 6, 8, 10, 12]) out.push({ a, b, k });
    }
    return out;
  },
  make({ a, b, k }) {
    const l = a * k;
    const w = b * k;
    const perimeter = 2 * (l + w);
    const area = l * w;

    const correct = num(area);
    const distractors = [num(perimeter), num(l + w), num(2 * area)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `The length and the breadth of a rectangle are in the ratio ${num(a)} : ${num(b)} and its perimeter is ${num(perimeter)} metres. Find its area, in square metres.`,
        explanation: `Let the length be ${num(a)}x and the breadth be ${num(b)}x metres.\nPerimeter = 2(length + breadth) = 2(${num(a)}x + ${num(b)}x) = ${num(2 * (a + b))}x.\nSo ${num(2 * (a + b))}x = ${num(perimeter)}, giving x = ${num(k)}.\nLength = ${num(a)} × ${num(k)} = ${num(l)} m and breadth = ${num(b)} × ${num(k)} = ${num(w)} m.\nArea = length × breadth = ${num(l)} × ${num(w)} = ${num(area)} square metres.\nRemember the perimeter formula has the factor 2 on the OUTSIDE — half of ${num(perimeter)} is ${num(l + w)}, which is length + breadth, not the area.`,
      },
      mr: {
        text: `एका आयताच्या लांबी व रुंदीचे गुणोत्तर ${num(a)} : ${num(b)} असून त्याची परिमिती ${num(perimeter)} मीटर आहे. तर त्याचे क्षेत्रफळ किती चौरस मीटर?`,
        explanation: `लांबी ${num(a)}x व रुंदी ${num(b)}x मीटर धरा.\nपरिमिती = 2(लांबी + रुंदी) = 2(${num(a)}x + ${num(b)}x) = ${num(2 * (a + b))}x.\nम्हणून ${num(2 * (a + b))}x = ${num(perimeter)}, यातून x = ${num(k)}.\nलांबी = ${num(a)} × ${num(k)} = ${num(l)} मी व रुंदी = ${num(b)} × ${num(k)} = ${num(w)} मी.\nक्षेत्रफळ = लांबी × रुंदी = ${num(l)} × ${num(w)} = ${num(area)} चौरस मीटर.\nपरिमितीच्या सूत्रात 2 हा बाहेर असतो — ${num(perimeter)} चा निम्मा ${num(l + w)} म्हणजे लांबी + रुंदी, क्षेत्रफळ नव्हे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 2. Circle: area and circumference
 * ------------------------------------------------------------------ */
const circle = {
  id: "circle-area-circumference",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const r of [7, 14, 21, 28, 35, 42]) {
      for (const want of ["area", "circumference"]) out.push({ r, want });
    }
    return out;
  },
  make({ r, want }) {
    const area = PI * r * r;
    const circ = 2 * PI * r;
    if (!isClean(area) || !isClean(circ)) return null;

    if (want === "area") {
      const correct = num(round(area, 2));
      const distractors = [num(round(circ, 2)), num(round(PI * 2 * r * r, 2)), num(round(area / 2, 2))];
      if (new Set([correct, ...distractors]).size !== 4) return null;
      return {
        correct,
        distractors,
        en: {
          text: `Find the area of a circle whose radius is ${num(r)} cm. (Take π = 22/7.)`,
          explanation: `Area of a circle = πr².\n= (22/7) × ${num(r)} × ${num(r)}.\nSince ${num(r)} is a multiple of 7, the 7 in the denominator cancels neatly: ${num(r)}/7 = ${num(r / 7)}.\n= 22 × ${num(r / 7)} × ${num(r)} = ${num(round(area, 2))} square cm.\nNote that the radius is SQUARED for area but not for circumference — the circumference here would be ${num(round(circ, 2))} cm, which is the trap option.`,
        },
        mr: {
          text: `ज्या वर्तुळाची त्रिज्या ${num(r)} सेमी आहे त्याचे क्षेत्रफळ काढा. (π = 22/7 घ्या.)`,
          explanation: `वर्तुळाचे क्षेत्रफळ = πr².\n= (22/7) × ${num(r)} × ${num(r)}.\n${num(r)} ही 7 च्या पटीत असल्याने छेदातील 7 सहज रद्द होतो: ${num(r)}/7 = ${num(r / 7)}.\n= 22 × ${num(r / 7)} × ${num(r)} = ${num(round(area, 2))} चौरस सेमी.\nक्षेत्रफळासाठी त्रिज्येचा वर्ग करावा लागतो, परिघासाठी नाही — येथे परिघ ${num(round(circ, 2))} सेमी आला असता, जो सापळा पर्याय आहे.`,
        },
      };
    }
    const correct = num(round(circ, 2));
    const distractors = [num(round(area, 2)), num(round(PI * r, 2)), num(round(circ * 2, 2))];
    if (new Set([correct, ...distractors]).size !== 4) return null;
    return {
      correct,
      distractors,
      en: {
        text: `Find the circumference of a circle whose radius is ${num(r)} cm. (Take π = 22/7.)`,
        explanation: `Circumference of a circle = 2πr.\n= 2 × (22/7) × ${num(r)}.\n${num(r)}/7 = ${num(r / 7)}, so this becomes 2 × 22 × ${num(r / 7)}.\n= ${num(round(circ, 2))} cm.\nUsing πr instead of 2πr gives ${num(round(PI * r, 2))} — the factor of 2 is what distinguishes circumference from the semicircular arc.`,
      },
      mr: {
        text: `ज्या वर्तुळाची त्रिज्या ${num(r)} सेमी आहे त्याचा परिघ काढा. (π = 22/7 घ्या.)`,
        explanation: `वर्तुळाचा परिघ = 2πr.\n= 2 × (22/7) × ${num(r)}.\n${num(r)}/7 = ${num(r / 7)}, म्हणून हे 2 × 22 × ${num(r / 7)} असे होते.\n= ${num(round(circ, 2))} सेमी.\n2πr ऐवजी πr घेतल्यास ${num(round(PI * r, 2))} येते — 2 हा घटकच परिघ व अर्धवर्तुळाकार कमान यांतील फरक ठरवतो.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 3. Cuboid volume and surface area
 * ------------------------------------------------------------------ */
const cuboid = {
  id: "cuboid-volume-surface",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const l of [6, 8, 10, 12, 15]) {
      for (const b of [4, 5, 6, 8, 9]) {
        for (const h of [3, 4, 5, 6]) {
          for (const want of ["volume", "surface"]) out.push({ l, b, h, want });
        }
      }
    }
    return out;
  },
  make({ l, b, h, want }) {
    const vol = l * b * h;
    const surface = 2 * (l * b + b * h + h * l);

    if (want === "volume") {
      const correct = num(vol);
      const distractors = [num(surface), num(l + b + h), num(l * b)];
      if (new Set([correct, ...distractors]).size !== 4) return null;
      return {
        correct,
        distractors,
        en: {
          text: `Find the volume of a cuboid whose length, breadth and height are ${num(l)} cm, ${num(b)} cm and ${num(h)} cm respectively, in cubic cm.`,
          explanation: `Volume of a cuboid = length × breadth × height.\n= ${num(l)} × ${num(b)} × ${num(h)}.\n= ${num(l * b)} × ${num(h)} = ${num(vol)} cubic cm.\nVolume is measured in CUBIC units because three lengths are multiplied; the total surface area of the same box would be ${num(surface)} square cm, which is a different quantity entirely.`,
        },
        mr: {
          text: `ज्या इष्टिकाचितीची लांबी, रुंदी व उंची अनुक्रमे ${num(l)} सेमी, ${num(b)} सेमी व ${num(h)} सेमी आहे तिचे घनफळ किती घन सेमी?`,
          explanation: `इष्टिकाचितीचे घनफळ = लांबी × रुंदी × उंची.\n= ${num(l)} × ${num(b)} × ${num(h)}.\n= ${num(l * b)} × ${num(h)} = ${num(vol)} घन सेमी.\nतीन लांबींचा गुणाकार होत असल्याने घनफळ घन एककांत मोजतात; याच खोक्याचे एकूण पृष्ठफळ ${num(surface)} चौरस सेमी झाले असते, जी पूर्णपणे वेगळी गोष्ट आहे.`,
        },
      };
    }
    const correct = num(surface);
    const distractors = [num(vol), num(surface / 2), num(2 * (l * b + b * h))];
    if (new Set([correct, ...distractors]).size !== 4) return null;
    return {
      correct,
      distractors,
      en: {
        text: `Find the total surface area of a cuboid whose length, breadth and height are ${num(l)} cm, ${num(b)} cm and ${num(h)} cm respectively, in square cm.`,
        explanation: `A cuboid has six faces in three matching pairs, so the total surface area = 2(lb + bh + hl).\nlb = ${num(l)} × ${num(b)} = ${num(l * b)}.\nbh = ${num(b)} × ${num(h)} = ${num(b * h)}.\nhl = ${num(h)} × ${num(l)} = ${num(h * l)}.\nSum = ${num(l * b)} + ${num(b * h)} + ${num(h * l)} = ${num(l * b + b * h + h * l)}.\nTotal surface area = 2 × ${num(l * b + b * h + h * l)} = ${num(surface)} square cm.\nMissing the factor 2 counts only one face of each pair and gives ${num(surface / 2)}.`,
      },
      mr: {
        text: `ज्या इष्टिकाचितीची लांबी, रुंदी व उंची अनुक्रमे ${num(l)} सेमी, ${num(b)} सेमी व ${num(h)} सेमी आहे तिचे एकूण पृष्ठफळ किती चौरस सेमी?`,
        explanation: `इष्टिकाचितीला सहा पृष्ठे असून ती तीन समान जोड्यांत असतात, म्हणून एकूण पृष्ठफळ = 2(lb + bh + hl).\nlb = ${num(l)} × ${num(b)} = ${num(l * b)}.\nbh = ${num(b)} × ${num(h)} = ${num(b * h)}.\nhl = ${num(h)} × ${num(l)} = ${num(h * l)}.\nबेरीज = ${num(l * b)} + ${num(b * h)} + ${num(h * l)} = ${num(l * b + b * h + h * l)}.\nएकूण पृष्ठफळ = 2 × ${num(l * b + b * h + h * l)} = ${num(surface)} चौरस सेमी.\n2 हा घटक विसरल्यास प्रत्येक जोडीतील एकच पृष्ठ मोजले जाते व ${num(surface / 2)} असे उत्तर येते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 4. Cylinder
 * ------------------------------------------------------------------ */
const cylinder = {
  id: "cylinder-volume-curved",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const r of [7, 14, 21]) {
      for (const h of [10, 12, 15, 20, 25, 30]) {
        for (const want of ["volume", "curved"]) out.push({ r, h, want });
      }
    }
    return out;
  },
  make({ r, h, want }) {
    const vol = PI * r * r * h;
    const curved = 2 * PI * r * h;
    if (!isClean(vol) || !isClean(curved)) return null;

    if (want === "volume") {
      const correct = num(round(vol, 2));
      const distractors = [num(round(curved, 2)), num(round(vol / h, 2)), num(round(vol * 2, 2))];
      if (new Set([correct, ...distractors]).size !== 4) return null;
      return {
        correct,
        distractors,
        en: {
          text: `Find the volume of a right circular cylinder of radius ${num(r)} cm and height ${num(h)} cm, in cubic cm. (Take π = 22/7.)`,
          explanation: `A cylinder is a circle extended through a height, so its volume = (area of the base) × height = πr²h.\nArea of the base = (22/7) × ${num(r)} × ${num(r)} = ${num(round(PI * r * r, 2))} square cm.\nVolume = ${num(round(PI * r * r, 2))} × ${num(h)} = ${num(round(vol, 2))} cubic cm.\nThe curved surface area of the same cylinder is 2πrh = ${num(round(curved, 2))} square cm — one is a volume and the other an area, so check which the question wants.`,
        },
        mr: {
          text: `${num(r)} सेमी त्रिज्या व ${num(h)} सेमी उंची असलेल्या वृत्तचितीचे घनफळ किती घन सेमी? (π = 22/7 घ्या.)`,
          explanation: `वृत्तचिती म्हणजे वर्तुळ उंचीभर वाढवलेले, म्हणून तिचे घनफळ = (तळाचे क्षेत्रफळ) × उंची = πr²h.\nतळाचे क्षेत्रफळ = (22/7) × ${num(r)} × ${num(r)} = ${num(round(PI * r * r, 2))} चौरस सेमी.\nघनफळ = ${num(round(PI * r * r, 2))} × ${num(h)} = ${num(round(vol, 2))} घन सेमी.\nयाच वृत्तचितीचे वक्रपृष्ठफळ 2πrh = ${num(round(curved, 2))} चौरस सेमी आहे — एक घनफळ तर दुसरे क्षेत्रफळ, म्हणून प्रश्नात काय विचारले आहे ते तपासा.`,
        },
      };
    }
    const correct = num(round(curved, 2));
    const distractors = [num(round(vol, 2)), num(round(curved / 2, 2)), num(round(curved + 2 * PI * r * r, 2))];
    if (new Set([correct, ...distractors]).size !== 4) return null;
    return {
      correct,
      distractors,
      en: {
        text: `Find the curved surface area of a right circular cylinder of radius ${num(r)} cm and height ${num(h)} cm, in square cm. (Take π = 22/7.)`,
        explanation: `Unroll the curved surface and it becomes a rectangle: its width is the circumference of the base and its height is the height of the cylinder.\nCurved surface area = 2πrh.\n= 2 × (22/7) × ${num(r)} × ${num(h)}.\n= ${num(round(2 * PI * r, 2))} × ${num(h)} = ${num(round(curved, 2))} square cm.\nThis excludes the two circular ends. Including them would give the TOTAL surface area, ${num(round(curved + 2 * PI * r * r, 2))} square cm.`,
      },
      mr: {
        text: `${num(r)} सेमी त्रिज्या व ${num(h)} सेमी उंची असलेल्या वृत्तचितीचे वक्रपृष्ठफळ किती चौरस सेमी? (π = 22/7 घ्या.)`,
        explanation: `वक्रपृष्ठ उलगडल्यास त्याचा आयत होतो: त्याची रुंदी म्हणजे तळाचा परिघ आणि उंची म्हणजे वृत्तचितीची उंची.\nवक्रपृष्ठफळ = 2πrh.\n= 2 × (22/7) × ${num(r)} × ${num(h)}.\n= ${num(round(2 * PI * r, 2))} × ${num(h)} = ${num(round(curved, 2))} चौरस सेमी.\nयात दोन्ही वर्तुळाकार तोंडे धरलेली नाहीत. ती धरल्यास एकूण पृष्ठफळ ${num(round(curved + 2 * PI * r * r, 2))} चौरस सेमी होते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 5. Square from its diagonal
 * ------------------------------------------------------------------ */
const squareDiagonal = {
  id: "square-diagonal",
  difficulty: "moderate",
  cases() {
    return [6, 8, 10, 12, 14, 16, 18, 20, 24, 30].map((d) => ({ d }));
  },
  make({ d }) {
    const area = (d * d) / 2;
    if (!isClean(area)) return null;

    const correct = num(round(area, 2));
    const distractors = [num(d * d), num(round(area / 2, 2)), num(4 * d)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `The diagonal of a square is ${num(d)} cm. Find the area of the square, in square cm.`,
        explanation: `A diagonal cuts the square into two right-angled triangles, with the diagonal as the hypotenuse.\nIf the side is a, then by Pythagoras a² + a² = ${num(d)}², so 2a² = ${num(d * d)}.\nThat gives a² = ${num(d * d)}/2 = ${num(round(area, 2))}, and a² is exactly the area of the square.\nSo the area = ${num(round(area, 2))} square cm — you never need to find the side itself.\nShortcut worth memorising: area of a square = d²/2 where d is the diagonal. Answering ${num(d * d)} forgets to halve.`,
      },
      mr: {
        text: `एका चौरसाचा कर्ण ${num(d)} सेमी आहे. तर त्या चौरसाचे क्षेत्रफळ किती चौरस सेमी?`,
        explanation: `कर्णामुळे चौरसाचे दोन काटकोन त्रिकोण होतात आणि कर्ण हा कर्णभुजा ठरतो.\nबाजू a धरल्यास पायथागोरसनुसार a² + a² = ${num(d)}², म्हणजे 2a² = ${num(d * d)}.\nयातून a² = ${num(d * d)}/2 = ${num(round(area, 2))}, आणि a² हेच चौरसाचे क्षेत्रफळ आहे.\nम्हणून क्षेत्रफळ = ${num(round(area, 2))} चौरस सेमी — बाजू प्रत्यक्ष काढण्याची गरजच नाही.\nपाठ करण्यासारखे सूत्र: चौरसाचे क्षेत्रफळ = d²/2, जेथे d हा कर्ण. ${num(d * d)} असे उत्तर देणे म्हणजे निम्मे करायचे विसरणे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 6. Path running around a rectangular field
 * ------------------------------------------------------------------ */
const pathAround = {
  id: "path-around-field",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const l of [40, 50, 60, 75, 80, 100]) {
      for (const b of [30, 35, 40, 50, 60]) {
        for (const w of [2, 2.5, 3, 5]) {
          if (l > b) out.push({ l, b, w });
        }
      }
    }
    return out;
  },
  make({ l, b, w }) {
    const outerL = l + 2 * w;
    const outerB = b + 2 * w;
    const pathArea = outerL * outerB - l * b;
    if (!isClean(pathArea)) return null;

    const correct = num(round(pathArea, 2));
    const distractors = [
      num(round((l + w) * (b + w) - l * b, 2)),
      num(round(outerL * outerB, 2)),
      num(round(2 * w * (l + b), 2)),
    ];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `A rectangular field is ${num(l)} metres long and ${num(b)} metres wide. A path of uniform width ${num(w)} metres runs all around it on the OUTSIDE. Find the area of the path, in square metres.`,
        explanation: `The path adds ${num(w)} metres on EVERY side, so each dimension grows by 2 × ${num(w)} = ${num(2 * w)} metres — once at each end.\nOuter length = ${num(l)} + ${num(2 * w)} = ${num(outerL)} m.\nOuter breadth = ${num(b)} + ${num(2 * w)} = ${num(outerB)} m.\nArea including the path = ${num(outerL)} × ${num(outerB)} = ${num(round(outerL * outerB, 2))} square m.\nArea of the field alone = ${num(l)} × ${num(b)} = ${num(l * b)} square m.\nArea of the path = ${num(round(outerL * outerB, 2))} − ${num(l * b)} = ${num(round(pathArea, 2))} square m.\nAdding only one width instead of two is the classic error and would give ${num(round((l + w) * (b + w) - l * b, 2))}.`,
      },
      mr: {
        text: `एका आयताकृती शेताची लांबी ${num(l)} मीटर व रुंदी ${num(b)} मीटर आहे. त्याच्या बाहेरून चारही बाजूंनी ${num(w)} मीटर रुंदीचा सारखा रस्ता आहे. तर त्या रस्त्याचे क्षेत्रफळ किती चौरस मीटर?`,
        explanation: `रस्ता प्रत्येक बाजूला ${num(w)} मीटर वाढवतो, म्हणून प्रत्येक मापात दोन्ही टोकांना मिळून 2 × ${num(w)} = ${num(2 * w)} मीटरची वाढ होते.\nबाहेरील लांबी = ${num(l)} + ${num(2 * w)} = ${num(outerL)} मी.\nबाहेरील रुंदी = ${num(b)} + ${num(2 * w)} = ${num(outerB)} मी.\nरस्त्यासह एकूण क्षेत्रफळ = ${num(outerL)} × ${num(outerB)} = ${num(round(outerL * outerB, 2))} चौरस मी.\nफक्त शेताचे क्षेत्रफळ = ${num(l)} × ${num(b)} = ${num(l * b)} चौरस मी.\nरस्त्याचे क्षेत्रफळ = ${num(round(outerL * outerB, 2))} − ${num(l * b)} = ${num(round(pathArea, 2))} चौरस मी.\nदोन ऐवजी एकच रुंदी मिळवणे ही नेहमीची चूक असून त्यातून ${num(round((l + w) * (b + w) - l * b, 2))} असे उत्तर येते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 7. Cost of carpeting or painting
 * ------------------------------------------------------------------ */
const costOfWork = {
  id: "cost-of-area",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const l of [8, 10, 12, 15, 20]) {
      for (const b of [6, 8, 9, 10, 12]) {
        for (const rate of [25, 40, 50, 75, 120]) out.push({ l, b, rate });
      }
    }
    return out;
  },
  make({ l, b, rate }) {
    const area = l * b;
    const cost = area * rate;

    const correct = inr(cost);
    const distractors = [inr(area), inr(round(2 * (l + b) * rate, 2)), inr(round(cost / 2, 2))];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `The floor of a room is ${num(l)} metres long and ${num(b)} metres wide. Find the cost of carpeting it at ${inr(rate)} per square metre.`,
        explanation: `First find how much carpet is needed, which is the AREA of the floor.\nArea = ${num(l)} × ${num(b)} = ${num(area)} square metres.\nThe rate is given per square metre, so multiply the area by the rate.\nCost = ${num(area)} × ${num(rate)} = ${inr(cost)}.\nUsing the perimeter (${num(2 * (l + b))} m) instead of the area would give ${inr(round(2 * (l + b) * rate, 2))} — perimeter is for fencing or skirting, area is for carpeting.`,
      },
      mr: {
        text: `एका खोलीच्या जमिनीची लांबी ${num(l)} मीटर व रुंदी ${num(b)} मीटर आहे. प्रति चौरस मीटर ${inr(rate)} दराने त्यावर गालिचा घालण्याचा खर्च किती?`,
        explanation: `प्रथम किती गालिचा लागेल ते काढा, म्हणजेच जमिनीचे क्षेत्रफळ.\nक्षेत्रफळ = ${num(l)} × ${num(b)} = ${num(area)} चौरस मीटर.\nदर प्रति चौरस मीटर दिला आहे, म्हणून क्षेत्रफळाला दराने गुणा.\nखर्च = ${num(area)} × ${num(rate)} = ${inr(cost)}.\nक्षेत्रफळाऐवजी परिमिती (${num(2 * (l + b))} मी) घेतल्यास ${inr(round(2 * (l + b) * rate, 2))} येते — परिमिती कुंपणासाठी तर क्षेत्रफळ गालिच्यासाठी वापरतात.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 8. Right-angled triangle
 * ------------------------------------------------------------------ */
const rightTriangle = {
  id: "right-triangle",
  difficulty: "moderate",
  cases() {
    const out = [];
    const triples = [
      [3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17],
      [12, 16, 20], [7, 24, 25], [10, 24, 26], [20, 21, 29], [15, 20, 25],
      [9, 40, 41], [12, 35, 37],
    ];
    for (const [a, b, c] of triples) {
      for (const want of ["area", "hypotenuse"]) out.push({ a, b, c, want });
    }
    return out;
  },
  make({ a, b, c, want }) {
    const area = (a * b) / 2;
    if (want === "area") {
      const correct = num(area);
      const distractors = [num(a * b), num(a + b + c), num(round(area / 2, 2))];
      if (new Set([correct, ...distractors]).size !== 4) return null;
      return {
        correct,
        distractors,
        en: {
          text: `The two legs of a right-angled triangle are ${num(a)} cm and ${num(b)} cm. Find its area, in square cm.`,
          explanation: `In a right-angled triangle the two legs are perpendicular to each other, so one can serve as the base and the other as the height.\nArea = ½ × base × height = ½ × ${num(a)} × ${num(b)}.\n= ${num(a * b)}/2 = ${num(area)} square cm.\nThere is no need for the hypotenuse at all (it is ${num(c)} cm here).\nForgetting the ½ gives ${num(a * b)}, which is the area of the rectangle formed by the two legs, i.e. twice the triangle.`,
        },
        mr: {
          text: `एका काटकोन त्रिकोणाच्या दोन बाजू ${num(a)} सेमी व ${num(b)} सेमी आहेत. तर त्याचे क्षेत्रफळ किती चौरस सेमी?`,
          explanation: `काटकोन त्रिकोणात दोन्ही बाजू एकमेकांना लंब असतात, म्हणून एक पाया व दुसरी उंची म्हणून घेता येते.\nक्षेत्रफळ = ½ × पाया × उंची = ½ × ${num(a)} × ${num(b)}.\n= ${num(a * b)}/2 = ${num(area)} चौरस सेमी.\nयासाठी कर्णाची गरजच नाही (येथे तो ${num(c)} सेमी आहे).\n½ विसरल्यास ${num(a * b)} येते, जे दोन बाजूंनी तयार होणाऱ्या आयताचे क्षेत्रफळ असून त्रिकोणाच्या दुप्पट आहे.`,
        },
      };
    }
    const correct = num(c);
    const distractors = [num(a + b), num(round(Math.sqrt(a * a + b * b) + 2, 2)), num(area)];
    if (new Set([correct, ...distractors]).size !== 4) return null;
    return {
      correct,
      distractors,
      en: {
        text: `The two legs of a right-angled triangle are ${num(a)} cm and ${num(b)} cm. Find the length of its hypotenuse, in cm.`,
        explanation: `By Pythagoras' theorem, the square on the hypotenuse equals the sum of the squares on the other two sides.\nh² = ${num(a)}² + ${num(b)}² = ${num(a * a)} + ${num(b * b)} = ${num(a * a + b * b)}.\nh = √${num(a * a + b * b)} = ${num(c)} cm.\nThe hypotenuse must be longer than either leg but shorter than their sum (${num(a + b)}), which is a quick way to rule out wrong options.\n${num(a)}, ${num(b)}, ${num(c)} is a Pythagorean triple worth recognising on sight.`,
      },
      mr: {
        text: `एका काटकोन त्रिकोणाच्या दोन बाजू ${num(a)} सेमी व ${num(b)} सेमी आहेत. तर त्याच्या कर्णाची लांबी किती सेमी?`,
        explanation: `पायथागोरसच्या प्रमेयानुसार कर्णावरील वर्ग = इतर दोन बाजूंवरील वर्गांची बेरीज.\nह² = ${num(a)}² + ${num(b)}² = ${num(a * a)} + ${num(b * b)} = ${num(a * a + b * b)}.\nह = √${num(a * a + b * b)} = ${num(c)} सेमी.\nकर्ण दोन्ही बाजूंपेक्षा मोठा पण त्यांच्या बेरजेपेक्षा (${num(a + b)}) लहान असतो, यावरून चुकीचे पर्याय लगेच बाद करता येतात.\n${num(a)}, ${num(b)}, ${num(c)} ही पायथागोरस त्रिकुटी असून ती पाहताक्षणी ओळखता यावी.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 9. Cube from volume or surface area
 * ------------------------------------------------------------------ */
const cube = {
  id: "cube-side",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const a of [3, 4, 5, 6, 7, 8, 9, 10, 12]) {
      for (const given of ["volume", "surface"]) out.push({ a, given });
    }
    return out;
  },
  make({ a, given }) {
    const vol = a ** 3;
    const surface = 6 * a * a;

    if (given === "volume") {
      const correct = num(surface);
      const distractors = [num(vol), num(a * a), num(4 * a * a)];
      if (new Set([correct, ...distractors]).size !== 4) return null;
      return {
        correct,
        distractors,
        en: {
          text: `The volume of a cube is ${num(vol)} cubic cm. Find its total surface area, in square cm.`,
          explanation: `Work back to the side first — with a cube every dimension is the same, so one number unlocks everything.\nVolume = a³, so a³ = ${num(vol)} and a = ${num(a)} cm.\nA cube has 6 identical square faces, each of area a² = ${num(a * a)} square cm.\nTotal surface area = 6 × ${num(a * a)} = ${num(surface)} square cm.\nGoing from a volume to an area always means passing through the side; the two can never be compared directly.`,
        },
        mr: {
          text: `एका घनाचे घनफळ ${num(vol)} घन सेमी आहे. तर त्याचे एकूण पृष्ठफळ किती चौरस सेमी?`,
          explanation: `प्रथम बाजू काढा — घनात सर्व मापे सारखीच असल्याने एका संख्येवरून सर्व काही मिळते.\nघनफळ = a³, म्हणून a³ = ${num(vol)} आणि a = ${num(a)} सेमी.\nघनाला 6 सारखी चौरस पृष्ठे असतात, प्रत्येकाचे क्षेत्रफळ a² = ${num(a * a)} चौरस सेमी.\nएकूण पृष्ठफळ = 6 × ${num(a * a)} = ${num(surface)} चौरस सेमी.\nघनफळावरून पृष्ठफळाकडे जाताना नेहमी बाजूमधून जावे लागते; दोघांची थेट तुलना कधीच करता येत नाही.`,
        },
      };
    }
    const correct = num(vol);
    const distractors = [num(surface), num(a * a), num(3 * a)];
    if (new Set([correct, ...distractors]).size !== 4) return null;
    return {
      correct,
      distractors,
      en: {
        text: `The total surface area of a cube is ${num(surface)} square cm. Find its volume, in cubic cm.`,
        explanation: `A cube has 6 equal faces, so the area of one face = ${num(surface)} ÷ 6 = ${num(a * a)} square cm.\nEach face is a square of side a, so a² = ${num(a * a)} and a = ${num(a)} cm.\nVolume = a³ = ${num(a)}³ = ${num(vol)} cubic cm.\nDivide by 6 before taking the square root — dividing by 4 or not at all is the usual slip.`,
      },
      mr: {
        text: `एका घनाचे एकूण पृष्ठफळ ${num(surface)} चौरस सेमी आहे. तर त्याचे घनफळ किती घन सेमी?`,
        explanation: `घनाला 6 समान पृष्ठे असतात, म्हणून एका पृष्ठाचे क्षेत्रफळ = ${num(surface)} ÷ 6 = ${num(a * a)} चौरस सेमी.\nप्रत्येक पृष्ठ हा a बाजूचा चौरस आहे, म्हणून a² = ${num(a * a)} व a = ${num(a)} सेमी.\nघनफळ = a³ = ${num(a)}³ = ${num(vol)} घन सेमी.\nवर्गमूळ घेण्यापूर्वी 6 ने भागावे — 4 ने भागणे किंवा मुळीच न भागणे ही नेहमीची चूक आहे.`,
      },
    };
  },
};

export const topicId = "mensuration";

export const archetypes = [
  rectangleRatio,
  circle,
  cuboid,
  cylinder,
  squareDiagonal,
  pathAround,
  costOfWork,
  rightTriangle,
  cube,
];
