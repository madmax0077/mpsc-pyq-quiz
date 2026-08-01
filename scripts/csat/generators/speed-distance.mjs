/**
 * Generator: Time, Speed & Distance — including trains, boats and streams.
 *
 * Options are bare numbers; the unit is always stated in the question.
 */

import { isClean, num, round } from "../lib/util.mjs";
import { gcd } from "../lib/math.mjs";

/* ------------------------------------------------------------------ *
 * 1. Average speed over two equal distances
 * ------------------------------------------------------------------ */
const averageSpeed = {
  id: "average-speed-two-legs",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const s1 of [20, 30, 40, 45, 50, 60]) {
      for (const s2 of [15, 24, 30, 36, 60, 80, 90]) {
        if (s1 !== s2) out.push({ s1, s2 });
      }
    }
    return out;
  },
  make({ s1, s2 }) {
    const avg = (2 * s1 * s2) / (s1 + s2);
    if (!isClean(avg)) return null;

    const correct = num(round(avg, 2));
    const distractors = [num(round((s1 + s2) / 2, 2)), num(s1 + s2), num(round(Math.abs(s1 - s2), 2))];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `A man travels from town P to town Q at ${num(s1)} km/hr and returns along the same road at ${num(s2)} km/hr. Find his average speed for the whole journey, in km/hr.`,
        explanation: `Average speed is total distance ÷ total time — it is never the plain average of the two speeds unless the TIMES are equal, and here the DISTANCES are equal instead.\nLet the one-way distance be d km. Total distance = 2d.\nTime out = d/${num(s1)} hours, time back = d/${num(s2)} hours, so total time = d(1/${num(s1)} + 1/${num(s2)}) = ${num(round(1 / s1 + 1 / s2, 5))}d hours.\nAverage speed = 2d ÷ ${num(round(1 / s1 + 1 / s2, 5))}d = ${num(round(avg, 2))} km/hr — the d cancels, which is why the distance is never needed.\nShortcut for equal distances: 2s₁s₂/(s₁ + s₂) = (2 × ${num(s1)} × ${num(s2)})/(${num(s1)} + ${num(s2)}) = ${num(round(avg, 2))}.\nThe simple average ${num(round((s1 + s2) / 2, 2))} is always too high, because more time is spent at the slower speed.`,
      },
      mr: {
        text: `एक माणूस प क्षेत्रापासून फ क्षेत्रापर्यंत ${num(s1)} किमी/तास वेगाने जातो आणि त्याच रस्त्याने ${num(s2)} किमी/तास वेगाने परत येतो. तर संपूर्ण प्रवासाचा त्याचा सरासरी वेग किती किमी/तास?`,
        explanation: `सरासरी वेग = एकूण अंतर ÷ एकूण वेळ. वेळ समान असल्याशिवाय दोन वेगांची साधी सरासरी घेता येत नाही, आणि येथे तर अंतर समान आहे.\nएका बाजूचे अंतर d किमी धरा. एकूण अंतर = 2d.\nजाताना वेळ = d/${num(s1)} तास, येताना वेळ = d/${num(s2)} तास, म्हणून एकूण वेळ = d(1/${num(s1)} + 1/${num(s2)}) = ${num(round(1 / s1 + 1 / s2, 5))}d तास.\nसरासरी वेग = 2d ÷ ${num(round(1 / s1 + 1 / s2, 5))}d = ${num(round(avg, 2))} किमी/तास — d रद्द होतो, म्हणूनच अंतर माहीत असण्याची गरज नसते.\nसमान अंतरासाठी सूत्र: 2s₁s₂/(s₁ + s₂) = (2 × ${num(s1)} × ${num(s2)})/(${num(s1)} + ${num(s2)}) = ${num(round(avg, 2))}.\nसाधी सरासरी ${num(round((s1 + s2) / 2, 2))} नेहमीच जास्त येते, कारण कमी वेगाने जास्त वेळ जातो.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 2. Train crossing a pole
 * ------------------------------------------------------------------ */
const trainPole = {
  id: "train-cross-pole",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const len of [120, 150, 180, 200, 240, 250, 300, 360]) {
      for (const kmph of [36, 45, 54, 60, 72, 90]) out.push({ len, kmph });
    }
    return out;
  },
  make({ len, kmph }) {
    const ms = (kmph * 5) / 18;
    const t = len / ms;
    if (!isClean(t)) return null;

    const correct = num(round(t, 2));
    const distractors = [num(round(len / kmph, 2)), num(round(t * 2, 2)), num(round(t + 6, 2))];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `A train ${num(len)} metres long is running at a speed of ${num(kmph)} km/hr. How many seconds will it take to cross an electric pole?`,
        explanation: `A pole has no length, so the train only has to cover its OWN length.\nFirst make the units agree. To convert km/hr into m/s, multiply by 5/18:\n${num(kmph)} × 5/18 = ${num(round(ms, 2))} m/s.\nTime = distance ÷ speed = ${num(len)} ÷ ${num(round(ms, 2))} = ${num(round(t, 2))} seconds.\nForgetting the 5/18 conversion is the single most common mistake in train problems — it would give ${num(round(len / kmph, 2))}, which is not in seconds at all.`,
      },
      mr: {
        text: `${num(len)} मीटर लांबीची एक रेल्वेगाडी ${num(kmph)} किमी/तास वेगाने धावत आहे. ती विजेचा खांब ओलांडण्यास किती सेकंद घेईल?`,
        explanation: `खांबाला लांबी नसते, म्हणून गाडीला फक्त स्वतःची लांबी पार करावी लागते.\nप्रथम एकके जुळवा. किमी/तास चे मी/सेकंद करण्यासाठी 5/18 ने गुणा:\n${num(kmph)} × 5/18 = ${num(round(ms, 2))} मी/सेकंद.\nवेळ = अंतर ÷ वेग = ${num(len)} ÷ ${num(round(ms, 2))} = ${num(round(t, 2))} सेकंद.\n5/18 चे रूपांतर विसरणे ही रेल्वेच्या उदाहरणांतील सर्वात मोठी चूक आहे — त्यातून ${num(round(len / kmph, 2))} असे उत्तर येते, जे सेकंदांत नसतेच.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 3. Train crossing a platform
 * ------------------------------------------------------------------ */
const trainPlatform = {
  id: "train-cross-platform",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const len of [120, 150, 180, 200, 240, 300]) {
      for (const plat of [130, 150, 200, 220, 250, 300, 400]) {
        for (const kmph of [36, 45, 54, 72]) out.push({ len, plat, kmph });
      }
    }
    return out;
  },
  make({ len, plat, kmph }) {
    const ms = (kmph * 5) / 18;
    const t = (len + plat) / ms;
    if (!isClean(t)) return null;

    const correct = num(round(t, 2));
    const distractors = [
      num(round(len / ms, 2)),
      num(round(plat / ms, 2)),
      num(round((len + plat) / kmph, 2)),
    ];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `A train ${num(len)} metres long, running at ${num(kmph)} km/hr, crosses a platform ${num(plat)} metres long. How many seconds does it take?`,
        explanation: `To cross a platform, the train must cover its own length PLUS the length of the platform — the last carriage has to clear the far end.\nTotal distance = ${num(len)} + ${num(plat)} = ${num(len + plat)} metres.\nSpeed in m/s = ${num(kmph)} × 5/18 = ${num(round(ms, 2))} m/s.\nTime = ${num(len + plat)} ÷ ${num(round(ms, 2))} = ${num(round(t, 2))} seconds.\nUsing only the train's length gives ${num(round(len / ms, 2))} seconds, which is the answer for crossing a pole, not a platform.`,
      },
      mr: {
        text: `${num(len)} मीटर लांबीची एक रेल्वेगाडी ${num(kmph)} किमी/तास वेगाने धावत असून ती ${num(plat)} मीटर लांबीचा फलाट ओलांडते. यास किती सेकंद लागतील?`,
        explanation: `फलाट ओलांडण्यासाठी गाडीला स्वतःची लांबी अधिक फलाटाची लांबी असे अंतर पार करावे लागते — शेवटचा डबा फलाटाच्या दुसऱ्या टोकापलीकडे जावा लागतो.\nएकूण अंतर = ${num(len)} + ${num(plat)} = ${num(len + plat)} मीटर.\nमी/सेकंद मधील वेग = ${num(kmph)} × 5/18 = ${num(round(ms, 2))} मी/सेकंद.\nवेळ = ${num(len + plat)} ÷ ${num(round(ms, 2))} = ${num(round(t, 2))} सेकंद.\nफक्त गाडीची लांबी घेतल्यास ${num(round(len / ms, 2))} सेकंद येतात, जे खांब ओलांडण्याचे उत्तर आहे, फलाटाचे नाही.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 4. Two trains crossing each other
 * ------------------------------------------------------------------ */
const twoTrains = {
  id: "two-trains-cross",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const l1 of [120, 150, 180, 200]) {
      for (const l2 of [130, 150, 200, 250]) {
        for (const s1 of [42, 54, 60, 72]) {
          for (const s2 of [36, 45, 48, 63]) {
            for (const dir of ["opposite", "same"]) out.push({ l1, l2, s1, s2, dir });
          }
        }
      }
    }
    return out;
  },
  make({ l1, l2, s1, s2, dir }) {
    if (dir === "same" && s1 === s2) return null;
    const rel = dir === "opposite" ? s1 + s2 : Math.abs(s1 - s2);
    const relMs = (rel * 5) / 18;
    const t = (l1 + l2) / relMs;
    if (!isClean(t)) return null;

    const other = dir === "opposite" ? Math.abs(s1 - s2) : s1 + s2;
    const otherT = (l1 + l2) / ((other * 5) / 18);

    const correct = num(round(t, 2));
    const distractors = [
      num(round(otherT, 2)),
      num(round(l1 / relMs, 2)),
      num(round(t / 2, 2)),
    ];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    const dirEn = dir === "opposite" ? "in opposite directions" : "in the same direction";
    const dirMr = dir === "opposite" ? "विरुद्ध दिशेने" : "एकाच दिशेने";
    const relEn =
      dir === "opposite"
        ? `When two bodies move in opposite directions their speeds ADD, so the relative speed = ${num(s1)} + ${num(s2)} = ${num(rel)} km/hr.`
        : `When two bodies move in the same direction their speeds SUBTRACT, so the relative speed = ${num(s1)} − ${num(s2)} = ${num(rel)} km/hr, taking the difference.`;
    const relMr =
      dir === "opposite"
        ? `दोन वस्तू विरुद्ध दिशेने जात असतील तर त्यांचे वेग मिळवले जातात, म्हणून सापेक्ष वेग = ${num(s1)} + ${num(s2)} = ${num(rel)} किमी/तास.`
        : `दोन वस्तू एकाच दिशेने जात असतील तर त्यांचे वेग वजा केले जातात, म्हणून सापेक्ष वेग = ${num(s1)} − ${num(s2)} = ${num(rel)} किमी/तास, म्हणजे फरक.`;

    return {
      correct,
      distractors,
      en: {
        text: `Two trains of lengths ${num(l1)} metres and ${num(l2)} metres are running ${dirEn} at ${num(s1)} km/hr and ${num(s2)} km/hr respectively. How many seconds will they take to cross each other completely?`,
        explanation: `${relEn}\nConvert to m/s: ${num(rel)} × 5/18 = ${num(round(relMs, 2))} m/s.\nTo cross each other completely, the distance covered is the SUM of both lengths = ${num(l1)} + ${num(l2)} = ${num(l1 + l2)} metres.\nTime = ${num(l1 + l2)} ÷ ${num(round(relMs, 2))} = ${num(round(t, 2))} seconds.\nUsing the wrong combination of speeds would give ${num(round(otherT, 2))} seconds — deciding whether to add or subtract is the whole difficulty in these questions.`,
      },
      mr: {
        text: `${num(l1)} मीटर व ${num(l2)} मीटर लांबीच्या दोन रेल्वेगाड्या ${dirMr} अनुक्रमे ${num(s1)} किमी/तास व ${num(s2)} किमी/तास वेगाने धावत आहेत. त्या एकमेकींना पूर्णपणे ओलांडण्यास किती सेकंद घेतील?`,
        explanation: `${relMr}\nमी/सेकंद मध्ये रूपांतर: ${num(rel)} × 5/18 = ${num(round(relMs, 2))} मी/सेकंद.\nएकमेकींना पूर्ण ओलांडण्यासाठी पार करावयाचे अंतर = दोन्ही लांबींची बेरीज = ${num(l1)} + ${num(l2)} = ${num(l1 + l2)} मीटर.\nवेळ = ${num(l1 + l2)} ÷ ${num(round(relMs, 2))} = ${num(round(t, 2))} सेकंद.\nवेगांची चुकीची जोडणी केल्यास ${num(round(otherT, 2))} सेकंद येतात — बेरीज करायची की वजाबाकी हे ठरवणे हेच या प्रश्नांतील खरे आव्हान आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 5. Boat in a stream — time for a round trip leg
 * ------------------------------------------------------------------ */
const boatStream = {
  id: "boat-stream-time",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const b of [8, 10, 12, 15, 18, 20]) {
      for (const s of [2, 3, 4, 5, 6]) {
        for (const d of [30, 36, 48, 60, 72, 84]) {
          if (b > s) out.push({ b, s, d });
        }
      }
    }
    return out;
  },
  make({ b, s, d }) {
    const down = b + s;
    const up = b - s;
    const t = d / down + d / up;
    if (!isClean(t)) return null;

    const correct = num(round(t, 2));
    const distractors = [
      num(round((2 * d) / b, 2)),
      num(round(d / down, 2)),
      num(round(d / up, 2)),
    ];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `The speed of a boat in still water is ${num(b)} km/hr and the speed of the stream is ${num(s)} km/hr. How many hours will the boat take to go ${num(d)} km downstream and return to the starting point?`,
        explanation: `Downstream the stream helps, so the effective speed = ${num(b)} + ${num(s)} = ${num(down)} km/hr.\nUpstream the stream opposes, so the effective speed = ${num(b)} − ${num(s)} = ${num(up)} km/hr.\nTime downstream = ${num(d)} ÷ ${num(down)} = ${num(round(d / down, 2))} hours.\nTime upstream = ${num(d)} ÷ ${num(up)} = ${num(round(d / up, 2))} hours.\nTotal = ${num(round(d / down, 2))} + ${num(round(d / up, 2))} = ${num(round(t, 2))} hours.\nThe round trip always takes LONGER than ${num(round((2 * d) / b, 2))} hours (the still-water time), because the time lost going against the current outweighs the time saved with it.`,
      },
      mr: {
        text: `संथ पाण्यात एका नावेचा वेग ${num(b)} किमी/तास असून प्रवाहाचा वेग ${num(s)} किमी/तास आहे. ती नाव प्रवाहाच्या दिशेने ${num(d)} किमी जाऊन पुन्हा सुरुवातीच्या ठिकाणी परत येण्यास किती तास घेईल?`,
        explanation: `प्रवाहाच्या दिशेने जाताना प्रवाह मदत करतो, म्हणून प्रत्यक्ष वेग = ${num(b)} + ${num(s)} = ${num(down)} किमी/तास.\nप्रवाहाविरुद्ध जाताना प्रवाह अडथळा ठरतो, म्हणून प्रत्यक्ष वेग = ${num(b)} − ${num(s)} = ${num(up)} किमी/तास.\nप्रवाहाच्या दिशेने वेळ = ${num(d)} ÷ ${num(down)} = ${num(round(d / down, 2))} तास.\nप्रवाहाविरुद्ध वेळ = ${num(d)} ÷ ${num(up)} = ${num(round(d / up, 2))} तास.\nएकूण = ${num(round(d / down, 2))} + ${num(round(d / up, 2))} = ${num(round(t, 2))} तास.\nहा फेरा नेहमी ${num(round((2 * d) / b, 2))} तासांपेक्षा (संथ पाण्यातील वेळ) जास्तच लागतो, कारण प्रवाहाविरुद्ध गमावलेला वेळ प्रवाहासोबत वाचलेल्या वेळेपेक्षा जास्त असतो.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 6. Finding boat and stream speeds from two journeys
 * ------------------------------------------------------------------ */
const boatFindSpeed = {
  id: "boat-find-speed",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const b of [9, 10, 12, 14, 15, 18]) {
      for (const s of [2, 3, 4, 5, 6]) {
        for (const t of [2, 3, 4]) {
          if (b > s + 1) out.push({ b, s, t });
        }
      }
    }
    return out;
  },
  make({ b, s, t }) {
    const dDown = (b + s) * t;
    const dUp = (b - s) * t;
    if (!Number.isInteger(dDown) || !Number.isInteger(dUp)) return null;

    const correct = num(s);
    const distractors = [num(b), num(round((dDown + dUp) / (2 * t), 2)), num(round(s * 2, 2))];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `A boat covers ${num(dDown)} km downstream in ${num(t)} hours and ${num(dUp)} km upstream in the same ${num(t)} hours. Find the speed of the stream, in km/hr.`,
        explanation: `Downstream speed = ${num(dDown)} ÷ ${num(t)} = ${num(b + s)} km/hr.\nUpstream speed = ${num(dUp)} ÷ ${num(t)} = ${num(b - s)} km/hr.\nDownstream speed is (boat + stream) and upstream speed is (boat − stream), so:\n  Speed of the stream = (downstream − upstream) ÷ 2 = (${num(b + s)} − ${num(b - s)}) ÷ 2 = ${num(s)} km/hr.\n  Speed of the boat in still water = (downstream + upstream) ÷ 2 = (${num(b + s)} + ${num(b - s)}) ÷ 2 = ${num(b)} km/hr.\nThese two half-sum and half-difference formulas answer almost every boat-and-stream question. Note the question asks for the STREAM, so the answer is ${num(s)}, not ${num(b)}.`,
      },
      mr: {
        text: `एक नाव प्रवाहाच्या दिशेने ${num(dDown)} किमी अंतर ${num(t)} तासांत आणि प्रवाहाविरुद्ध ${num(dUp)} किमी अंतर तेवढ्याच ${num(t)} तासांत पार करते. तर प्रवाहाचा वेग किती किमी/तास?`,
        explanation: `प्रवाहाच्या दिशेने वेग = ${num(dDown)} ÷ ${num(t)} = ${num(b + s)} किमी/तास.\nप्रवाहाविरुद्ध वेग = ${num(dUp)} ÷ ${num(t)} = ${num(b - s)} किमी/तास.\nप्रवाहाच्या दिशेने वेग = (नाव + प्रवाह) आणि प्रवाहाविरुद्ध वेग = (नाव − प्रवाह), म्हणून:\n  प्रवाहाचा वेग = (अनुकूल − प्रतिकूल) ÷ 2 = (${num(b + s)} − ${num(b - s)}) ÷ 2 = ${num(s)} किमी/तास.\n  संथ पाण्यातील नावेचा वेग = (अनुकूल + प्रतिकूल) ÷ 2 = (${num(b + s)} + ${num(b - s)}) ÷ 2 = ${num(b)} किमी/तास.\nअर्धी बेरीज व अर्धा फरक ही दोन सूत्रे नाव-प्रवाहाची जवळपास सर्व उदाहरणे सोडवतात. प्रश्नात प्रवाहाचा वेग विचारला आहे, म्हणून उत्तर ${num(s)} आहे, ${num(b)} नाही.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 7. Late at one speed, early at another
 * ------------------------------------------------------------------ */
const lateEarly = {
  id: "late-early-distance",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const s1 of [3, 4, 5, 6, 10, 15]) {
      for (const s2 of [4, 5, 6, 8, 12, 20]) {
        for (const late of [10, 12, 15, 20, 30]) {
          for (const early of [5, 8, 10, 15, 20]) {
            if (s2 > s1) out.push({ s1, s2, late, early });
          }
        }
      }
    }
    return out;
  },
  make({ s1, s2, late, early }) {
    // d/s1 - d/s2 = (late + early)/60
    const gap = (late + early) / 60;
    const d = gap / (1 / s1 - 1 / s2);
    if (!isClean(d) || d <= 0 || d > 200) return null;

    const correct = num(round(d, 2));
    const distractors = [
      num(round(d + s1, 2)),
      num(round(gap * s1 * s2, 2)),
      num(round(d / 2, 2)),
    ];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `A student walking from home to school at ${num(s1)} km/hr reaches ${num(late)} minutes late. Walking at ${num(s2)} km/hr, he reaches ${num(early)} minutes early. Find the distance from his home to the school, in km.`,
        explanation: `Both journeys cover the same distance but take different times, and the GAP between those times is what the two delays give you.\nHe is ${num(late)} minutes late in one case and ${num(early)} minutes early in the other, so the slower walk takes ${num(late)} + ${num(early)} = ${num(late + early)} minutes longer.\nConvert to hours: ${num(late + early)}/60 = ${num(round(gap, 4))} hours.\nIf the distance is d km, then d/${num(s1)} − d/${num(s2)} = ${num(round(gap, 4))}.\nd(1/${num(s1)} − 1/${num(s2)}) = ${num(round(gap, 4))}, and 1/${num(s1)} − 1/${num(s2)} = ${num(round(1 / s1 - 1 / s2, 5))}.\nd = ${num(round(gap, 4))} ÷ ${num(round(1 / s1 - 1 / s2, 5))} = ${num(round(d, 2))} km.\nAdd the two delays rather than subtracting them — one is late and the other early, so they lie on opposite sides of the scheduled time.`,
      },
      mr: {
        text: `एक विद्यार्थी घरातून शाळेत ${num(s1)} किमी/तास वेगाने चालत गेल्यास ${num(late)} मिनिटे उशिरा पोहोचतो. ${num(s2)} किमी/तास वेगाने चालल्यास तो ${num(early)} मिनिटे लवकर पोहोचतो. तर त्याच्या घरापासून शाळेचे अंतर किती किमी?`,
        explanation: `दोन्ही प्रवासांत अंतर सारखेच आहे पण वेळ वेगळा लागतो, आणि या वेळांतील फरक दोन्ही विलंबांवरून मिळतो.\nएका वेळी तो ${num(late)} मिनिटे उशिरा व दुसऱ्या वेळी ${num(early)} मिनिटे लवकर पोहोचतो, म्हणून हळू चालण्यास ${num(late)} + ${num(early)} = ${num(late + early)} मिनिटे जास्त लागतात.\nतासांत रूपांतर: ${num(late + early)}/60 = ${num(round(gap, 4))} तास.\nअंतर d किमी धरल्यास d/${num(s1)} − d/${num(s2)} = ${num(round(gap, 4))}.\nd(1/${num(s1)} − 1/${num(s2)}) = ${num(round(gap, 4))}, आणि 1/${num(s1)} − 1/${num(s2)} = ${num(round(1 / s1 - 1 / s2, 5))}.\nd = ${num(round(gap, 4))} ÷ ${num(round(1 / s1 - 1 / s2, 5))} = ${num(round(d, 2))} किमी.\nदोन्ही विलंब वजा न करता बेरीज करावेत — एक उशिरा व दुसरा लवकर असल्याने ते ठरलेल्या वेळेच्या दोन विरुद्ध बाजूंना असतात.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 8. Speed reduced in a ratio, time increases
 * ------------------------------------------------------------------ */
const speedRatioTime = {
  id: "speed-ratio-time",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const [p, q] of [[3, 4], [4, 5], [5, 6], [2, 3], [5, 7], [7, 8], [3, 5]]) {
      for (const extra of [10, 15, 20, 24, 30, 40, 45]) out.push({ p, q, extra });
    }
    return out;
  },
  make({ p, q, extra }) {
    // New speed is p/q of the original, so new time is q/p of the original.
    // t(q/p - 1) = extra minutes
    const t = extra / (q / p - 1);
    if (!isClean(t)) return null;
    if (t < 10 || t > 400) return null;

    const correct = num(round(t, 2));
    const distractors = [
      num(round((t * q) / p, 2)),
      num(round(extra * (q / p), 2)),
      num(round(t + extra, 2)),
    ];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `Walking at ${p}/${q} of his usual speed, a man reaches his office ${num(extra)} minutes later than usual. What is his usual time to reach the office, in minutes?`,
        explanation: `Speed and time are inversely proportional over a fixed distance.\nIf the speed becomes ${p}/${q} of the usual, the time becomes ${q}/${p} of the usual.\nLet the usual time be t minutes. New time = ${q}t/${p}.\nExtra time = ${q}t/${p} − t = t(${q}/${p} − 1) = t × ${num(round(q / p - 1, 4))}.\nSo t × ${num(round(q / p - 1, 4))} = ${num(extra)}, giving t = ${num(extra)} ÷ ${num(round(q / p - 1, 4))} = ${num(round(t, 2))} minutes.\nInvert the fraction when moving from speed to time. Using ${p}/${q} for the time as well is the standard error.`,
      },
      mr: {
        text: `नेहमीच्या वेगाच्या ${p}/${q} इतक्या वेगाने चालल्यास एक माणूस कार्यालयात नेहमीपेक्षा ${num(extra)} मिनिटे उशिरा पोहोचतो. तर त्याला कार्यालयात पोहोचण्यास नेहमी किती मिनिटे लागतात?`,
        explanation: `ठरलेल्या अंतरासाठी वेग व वेळ हे व्यस्त प्रमाणात असतात.\nवेग नेहमीच्या ${p}/${q} इतका झाला, तर वेळ नेहमीच्या ${q}/${p} इतका होतो.\nनेहमीचा वेळ t मिनिटे धरा. नवीन वेळ = ${q}t/${p}.\nजादा वेळ = ${q}t/${p} − t = t(${q}/${p} − 1) = t × ${num(round(q / p - 1, 4))}.\nम्हणून t × ${num(round(q / p - 1, 4))} = ${num(extra)}, यातून t = ${num(extra)} ÷ ${num(round(q / p - 1, 4))} = ${num(round(t, 2))} मिनिटे.\nवेगावरून वेळ काढताना अपूर्णांक उलटा करावा. वेळेसाठीही ${p}/${q} वापरणे ही नेहमीची चूक आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 9. Catching up after a head start
 * ------------------------------------------------------------------ */
const catchUp = {
  id: "catch-up",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const s1 of [30, 36, 40, 45, 50]) {
      for (const s2 of [45, 54, 60, 72, 80, 90]) {
        for (const head of [1, 1.5, 2, 3]) {
          if (s2 > s1) out.push({ s1, s2, head });
        }
      }
    }
    return out;
  },
  make({ s1, s2, head }) {
    const lead = s1 * head;
    const t = lead / (s2 - s1);
    const dist = s2 * t;
    if (!isClean(t) || !isClean(dist)) return null;
    if (dist > 1200) return null;

    const correct = num(round(dist, 2));
    const distractors = [
      num(round(t, 2)),
      num(round(lead, 2)),
      num(round(s1 * t, 2) + 1),
    ];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `A thief escapes on a motorcycle at ${num(s1)} km/hr. After ${num(head)} hours a police jeep starts from the same point in pursuit at ${num(s2)} km/hr. At what distance from the starting point, in km, will the jeep overtake the thief?`,
        explanation: `First find the head start. In ${num(head)} hours the thief covers ${num(s1)} × ${num(head)} = ${num(lead)} km before the chase even begins.\nOnce the jeep sets off, the gap closes at the relative speed = ${num(s2)} − ${num(s1)} = ${num(s2 - s1)} km/hr.\nTime to close a gap of ${num(lead)} km = ${num(lead)} ÷ ${num(s2 - s1)} = ${num(round(t, 2))} hours.\nIn that time the jeep travels ${num(s2)} × ${num(round(t, 2))} = ${num(round(dist, 2))} km.\nCheck: the thief has then been riding for ${num(head)} + ${num(round(t, 2))} = ${num(round(head + t, 2))} hours, covering ${num(s1)} × ${num(round(head + t, 2))} = ${num(round(s1 * (head + t), 2))} km — the same point.\nThe question asks for the DISTANCE, not the time, so ${num(round(t, 2))} hours is the trap answer.`,
      },
      mr: {
        text: `एक चोर मोटारसायकलवरून ${num(s1)} किमी/तास वेगाने पळून जातो. ${num(head)} तासांनंतर पोलिसांची जीप त्याच ठिकाणाहून ${num(s2)} किमी/तास वेगाने त्याचा पाठलाग सुरू करते. तर सुरुवातीच्या ठिकाणापासून किती किमी अंतरावर जीप चोराला गाठेल?`,
        explanation: `प्रथम आघाडी काढा. पाठलाग सुरू होण्यापूर्वीच ${num(head)} तासांत चोर ${num(s1)} × ${num(head)} = ${num(lead)} किमी अंतर कापतो.\nजीप निघाल्यावर हे अंतर सापेक्ष वेगाने कमी होते = ${num(s2)} − ${num(s1)} = ${num(s2 - s1)} किमी/तास.\n${num(lead)} किमीचे अंतर भरून काढण्यास वेळ = ${num(lead)} ÷ ${num(s2 - s1)} = ${num(round(t, 2))} तास.\nएवढ्या वेळात जीप ${num(s2)} × ${num(round(t, 2))} = ${num(round(dist, 2))} किमी अंतर कापते.\nपडताळणी: तोपर्यंत चोर ${num(head)} + ${num(round(t, 2))} = ${num(round(head + t, 2))} तास प्रवास करून ${num(s1)} × ${num(round(head + t, 2))} = ${num(round(s1 * (head + t), 2))} किमी अंतरावर असतो — म्हणजे तेच ठिकाण.\nप्रश्नात अंतर विचारले आहे, वेळ नाही, म्हणून ${num(round(t, 2))} तास हा सापळा आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 10. Train crossing a moving man
 * ------------------------------------------------------------------ */
const trainMan = {
  id: "train-cross-man",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const len of [150, 180, 200, 240, 250, 300]) {
      for (const ts of [45, 54, 63, 72, 81]) {
        for (const ms of [3, 6, 9]) {
          for (const dir of ["same", "opposite"]) out.push({ len, ts, ms, dir });
        }
      }
    }
    return out;
  },
  make({ len, ts, ms, dir }) {
    const rel = dir === "same" ? ts - ms : ts + ms;
    if (rel <= 0) return null;
    const relMs = (rel * 5) / 18;
    const t = len / relMs;
    if (!isClean(t)) return null;

    const correct = num(round(t, 2));
    const distractors = [
      num(round(len / ((ts * 5) / 18), 2)),
      num(round(len / (((dir === "same" ? ts + ms : ts - ms) * 5) / 18), 2)),
      num(round(t + 4, 2)),
    ];
    if (distractors.some((d) => !Number.isFinite(parseFloat(d)) || parseFloat(d) <= 0)) return null;
    if (new Set([correct, ...distractors]).size !== 4) return null;

    const dirEn = dir === "same" ? "in the same direction as the train" : "in the direction opposite to that of the train";
    const dirMr = dir === "same" ? "गाडीच्याच दिशेने" : "गाडीच्या विरुद्ध दिशेने";
    const sign = dir === "same" ? "−" : "+";

    return {
      correct,
      distractors,
      en: {
        text: `A train ${num(len)} metres long is running at ${num(ts)} km/hr. A man is running at ${num(ms)} km/hr ${dirEn}. How many seconds will the train take to pass the man?`,
        explanation: `The man has no length, so the train covers only its own ${num(len)} metres — but it does so at the speed RELATIVE to the man.\nRelative speed = ${num(ts)} ${sign} ${num(ms)} = ${num(rel)} km/hr${dir === "same" ? ", subtracting because they move the same way" : ", adding because they move towards each other"}.\nIn m/s: ${num(rel)} × 5/18 = ${num(round(relMs, 2))} m/s.\nTime = ${num(len)} ÷ ${num(round(relMs, 2))} = ${num(round(t, 2))} seconds.\nUsing the train's own speed of ${num(ts)} km/hr instead of the relative speed gives ${num(round(len / ((ts * 5) / 18), 2))} seconds, which ignores the man's motion altogether.`,
      },
      mr: {
        text: `${num(len)} मीटर लांबीची एक रेल्वेगाडी ${num(ts)} किमी/तास वेगाने धावत आहे. एक माणूस ${dirMr} ${num(ms)} किमी/तास वेगाने धावत आहे. तर गाडीला त्या माणसाला ओलांडण्यास किती सेकंद लागतील?`,
        explanation: `माणसाला लांबी नसते, म्हणून गाडीला फक्त स्वतःची ${num(len)} मीटर लांबी पार करावी लागते — पण ती माणसाच्या सापेक्ष वेगाने.\nसापेक्ष वेग = ${num(ts)} ${sign} ${num(ms)} = ${num(rel)} किमी/तास${dir === "same" ? ", दोघे एकाच दिशेने असल्याने वजाबाकी" : ", दोघे समोरासमोर असल्याने बेरीज"}.\nमी/सेकंद मध्ये: ${num(rel)} × 5/18 = ${num(round(relMs, 2))} मी/सेकंद.\nवेळ = ${num(len)} ÷ ${num(round(relMs, 2))} = ${num(round(t, 2))} सेकंद.\nसापेक्ष वेगाऐवजी गाडीचा स्वतःचा ${num(ts)} किमी/तास वेग वापरल्यास ${num(round(len / ((ts * 5) / 18), 2))} सेकंद येतात, ज्यात माणसाची गती विचारातच घेतली जात नाही.`,
      },
    };
  },
};

export const topicId = "speed-distance";

export const archetypes = [
  averageSpeed,
  trainPole,
  trainPlatform,
  twoTrains,
  boatStream,
  boatFindSpeed,
  lateEarly,
  speedRatioTime,
  catchUp,
  trainMan,
];
