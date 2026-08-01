/**
 * Generator: Clocks & Calendars.
 *
 * Clock questions are stated with an explicit H:MM so the validator can read
 * the time straight out of the sentence; calendar questions always name the
 * full date, so the validator can rebuild the weekday by its own algorithm.
 */

import { num, round } from "../lib/util.mjs";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTHS_MR = [
  "जानेवारी", "फेब्रुवारी", "मार्च", "एप्रिल", "मे", "जून",
  "जुलै", "ऑगस्ट", "सप्टेंबर", "ऑक्टोबर", "नोव्हेंबर", "डिसेंबर",
];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAYS_MR = ["रविवार", "सोमवार", "मंगळवार", "बुधवार", "गुरुवार", "शुक्रवार", "शनिवार"];

/** Options carry both scripts because a weekday cannot be written neutrally. */
const DAY_LABEL = DAYS.map((d, i) => `${DAYS_MR[i]} / ${d}`);

const isLeap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

/** Zeller's congruence — the validator deliberately uses a different method. */
function weekdayIndex(d, m, y) {
  let mm = m;
  let yy = y;
  if (mm < 3) {
    mm += 12;
    yy -= 1;
  }
  const k = yy % 100;
  const j = Math.floor(yy / 100);
  const h =
    (d + Math.floor((13 * (mm + 1)) / 5) + k + Math.floor(k / 4) + Math.floor(j / 4) + 5 * j) % 7;
  return (h + 6) % 7; // Zeller: 0 = Saturday. Shift so 0 = Sunday.
}

const pad2 = (n) => String(n).padStart(2, "0");
const clockTime = (h, m) => `${h}:${pad2(m)}`;

/** Three weekdays other than the answer, taken in a stable order. */
function dayDistractors(idx) {
  return [1, 3, 5].map((off) => DAY_LABEL[(idx + off) % 7]);
}

/* ------------------------------------------------------------------ *
 * 1. Angle between the two hands
 * ------------------------------------------------------------------ */
const handAngle = {
  id: "clock-hand-angle",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (let h = 1; h <= 12; h += 1) {
      for (const m of [10, 20, 24, 30, 36, 40, 48, 50]) out.push({ h, m });
    }
    return out;
  },
  make({ h, m }) {
    const hourDeg = (h % 12) * 30 + m * 0.5;
    const minDeg = m * 6;
    let angle = Math.abs(hourDeg - minDeg);
    if (angle > 180) angle = 360 - angle;
    angle = round(angle, 2);
    if (angle === 0 || angle === 180) return null; // reflex distractor would collide

    const wrong1 = round(360 - angle, 2);
    const wrong2 = round(Math.abs((h % 12) * 30 - m * 6), 2);
    const wrong3 = round(angle + 15, 2);
    const distractors = [num(wrong1), num(wrong2), num(wrong3)];
    const correct = num(angle);
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `What is the angle, in degrees, between the hour hand and the minute hand of a clock at ${clockTime(h, m)}?`,
        explanation: `Measure both hands from the 12 mark and then subtract — never try to eyeball it.\nThe minute hand covers the full 360° in 60 minutes, so it moves 6° per minute. At ${num(m)} minutes it is at ${num(m)} × 6 = ${num(minDeg)}° from 12.\nThe hour hand covers 360° in 12 hours, so it moves 30° per hour AND an extra 0.5° per minute. This half-degree drift is the step almost everyone forgets.\nAt ${clockTime(h, m)} the hour hand is at ${num(h % 12)} × 30 + ${num(m)} × 0.5 = ${num((h % 12) * 30)} + ${num(m * 0.5)} = ${num(hourDeg)}° from 12.\nDifference = |${num(hourDeg)} − ${num(minDeg)}| = ${num(Math.abs(hourDeg - minDeg))}°.\nA clock angle is always reported as the smaller of the two arcs, so the answer is ${num(angle)}°.`,
      },
      mr: {
        text: `घड्याळात ${clockTime(h, m)} वाजता तास काटा व मिनिट काटा यांच्यातील कोन किती अंश असेल?`,
        explanation: `दोन्ही काटे १२ च्या खुणेपासून किती अंश गेले ते मोजा आणि मग वजाबाकी करा — अंदाजाने उत्तर काढू नका.\nमिनिट काटा ६० मिनिटांत पूर्ण 360° फिरतो, म्हणजे दर मिनिटाला 6°. ${num(m)} मिनिटांना तो १२ पासून ${num(m)} × 6 = ${num(minDeg)}° वर असतो.\nतास काटा १२ तासांत 360° फिरतो, म्हणजे दर तासाला 30° आणि वर दर मिनिटाला आणखी 0.5°. हा अर्ध्या अंशाचा सरकाव विसरणे ही सर्वात नेहमीची चूक आहे.\n${clockTime(h, m)} वाजता तास काटा ${num(h % 12)} × 30 + ${num(m)} × 0.5 = ${num((h % 12) * 30)} + ${num(m * 0.5)} = ${num(hourDeg)}° वर असतो.\nफरक = |${num(hourDeg)} − ${num(minDeg)}| = ${num(Math.abs(hourDeg - minDeg))}°.\nघड्याळातील कोन नेहमी दोन कमानींपैकी लहान कमान म्हणून सांगतात, म्हणून उत्तर ${num(angle)}° आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 2. Weekday of a given date
 * ------------------------------------------------------------------ */
const weekdayOfDate = {
  id: "calendar-weekday-of-date",
  difficulty: "hard",
  cases() {
    const out = [];
    const dates = [
      [15, 8, 1947], [26, 1, 1950], [2, 10, 1869], [14, 4, 1891], [19, 2, 1630],
      [1, 5, 1960], [15, 8, 2025], [26, 1, 2026], [1, 1, 2000], [29, 2, 2024],
      [31, 12, 1999], [4, 7, 1776], [12, 1, 1863], [23, 7, 1856], [6, 12, 1956],
      [3, 3, 2001], [17, 9, 2014], [11, 11, 1918], [25, 12, 1990], [9, 8, 1942],
      [30, 1, 1948], [20, 5, 2011], [7, 6, 1893], [28, 2, 2100], [13, 4, 1919],
    ];
    for (const [d, m, y] of dates) out.push({ d, m, y });
    return out;
  },
  make({ d, m, y }) {
    const idx = weekdayIndex(d, m, y);
    const correct = DAY_LABEL[idx];
    const distractors = dayDistractors(idx);

    // Odd-day working, shown the way MPSC answer keys present it.
    const prev = y - 1;
    const oddCentury = Math.floor(prev / 100);
    const oddInYears =
      (prev + Math.floor(prev / 4) - Math.floor(prev / 100) + Math.floor(prev / 400)) % 7;
    const monthDays = [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    let daysThisYear = 0;
    for (let i = 0; i < m - 1; i += 1) daysThisYear += monthDays[i];
    daysThisYear += d;
    const total = (oddInYears + (daysThisYear % 7)) % 7;

    return {
      correct,
      distractors,
      en: {
        text: `What day of the week was ${num(d)} ${MONTHS[m - 1]} ${num(y)}?`,
        explanation: `Weekday questions are solved by counting "odd days" — the remainder left after removing whole weeks.\nStep 1: take the completed years, ${num(prev)}. The odd days in them are (${num(prev)} + ${num(prev)}/4 − ${num(prev)}/100 + ${num(prev)}/400) mod 7, where each division is a whole-number count of leap years added or removed. That comes to ${num(oddInYears)}.\nStep 2: count the days elapsed in ${num(y)} itself up to the date. ${num(y)} is ${isLeap(y) ? "a leap year, so February has 29 days" : "not a leap year, so February has 28 days"}. Adding the completed months and then ${num(d)} gives ${num(daysThisYear)} days.\nStep 3: ${num(daysThisYear)} mod 7 = ${num(daysThisYear % 7)} odd days.\nStep 4: total odd days = (${num(oddInYears)} + ${num(daysThisYear % 7)}) mod 7 = ${num(total)}.\nCounting 0 as Sunday, ${num(total)} odd days lands on ${DAYS[idx]}.\nThe century correction is the part people drop — remember that ${num(oddCentury * 100)}–style century years are leap only when divisible by 400.`,
      },
      mr: {
        text: `${num(d)} ${MONTHS_MR[m - 1]} ${num(y)} या दिवशी आठवड्याचा कोणता वार होता?`,
        explanation: `वार काढण्याचे प्रश्न "विषम दिवस" मोजून सोडवतात — पूर्ण आठवडे वजा केल्यावर उरणारी बाकी म्हणजे विषम दिवस.\nपायरी १: पूर्ण झालेली वर्षे ${num(prev)} घ्या. त्यांतील विषम दिवस = (${num(prev)} + ${num(prev)}/4 − ${num(prev)}/100 + ${num(prev)}/400) याची 7 ने बाकी, जिथे प्रत्येक भागाकार लीप वर्षांची पूर्णांक संख्या दर्शवतो. ही बाकी ${num(oddInYears)} येते.\nपायरी २: ${num(y)} या वर्षातील दिनांकापर्यंतचे दिवस मोजा. ${num(y)} हे ${isLeap(y) ? "लीप वर्ष असल्याने फेब्रुवारीत 29 दिवस" : "लीप वर्ष नसल्याने फेब्रुवारीत 28 दिवस"} आहेत. पूर्ण महिने अधिक ${num(d)} मिळून ${num(daysThisYear)} दिवस होतात.\nपायरी ३: ${num(daysThisYear)} ला 7 ने भागल्यास बाकी ${num(daysThisYear % 7)} विषम दिवस.\nपायरी ४: एकूण विषम दिवस = (${num(oddInYears)} + ${num(daysThisYear % 7)}) ची 7 ने बाकी = ${num(total)}.\n0 म्हणजे रविवार धरल्यास ${num(total)} विषम दिवस ${DAYS_MR[idx]} या वारावर येतात.\nशतकाची दुरुस्ती नेमकी विसरली जाते — ${num(occBase(oddCentury))} सारखी शताब्दी वर्षे 400 ने भाग जात असतील तरच लीप असतात हे लक्षात ठेवा.`,
      },
    };
  },
};

// Keeps the century figure identical on both sides of the bilingual pair.
function occBase(oddCentury) {
  return oddCentury * 100;
}

/* ------------------------------------------------------------------ *
 * 3. Which year repeats a given year's calendar
 * ------------------------------------------------------------------ */
const sameCalendarYear = {
  id: "calendar-same-year",
  difficulty: "hard",
  cases() {
    const out = [];
    for (let y = 1994; y <= 2030; y += 1) out.push({ y });
    return out;
  },
  make({ y }) {
    let repeat = y + 1;
    while (
      repeat < y + 40 &&
      !(isLeap(repeat) === isLeap(y) && weekdayIndex(1, 1, repeat) === weekdayIndex(1, 1, y))
    ) {
      repeat += 1;
    }
    if (repeat >= y + 40) return null;

    const gap = repeat - y;
    const correct = num(repeat);
    const distractors = [num(repeat + 1), num(repeat - 1), num(y + (gap === 6 ? 11 : 6))];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `Which of the following years will have exactly the same calendar as the year ${num(y)}?`,
        explanation: `Two years share a calendar only when both conditions hold: they start on the same weekday AND they are both leap or both ordinary.\n${num(y)} is ${isLeap(y) ? "a leap year" : "an ordinary year"} and 1 January ${num(y)} falls on ${DAYS[weekdayIndex(1, 1, y)]}.\nAn ordinary year pushes the starting weekday forward by 1 day and a leap year by 2 days, so you add those shifts year by year until the total is a multiple of 7.\nWalking forward from ${num(y)}, the shifts return to a multiple of 7 after ${num(gap)} years, and the leap status matches again at the same point.\n1 January ${num(repeat)} is therefore also a ${DAYS[weekdayIndex(1, 1, repeat)]}, and ${num(repeat)} is ${isLeap(repeat) ? "a leap year" : "an ordinary year"} just like ${num(y)}.\nSo the calendar of ${num(y)} repeats in ${num(repeat)}.\nThe usual trap is quoting a fixed gap such as 11 or 6 years for every case — the gap depends on where the year sits in the leap cycle.`,
      },
      mr: {
        text: `पुढीलपैकी कोणत्या वर्षाचे दिनदर्शिका (कॅलेंडर) ${num(y)} या वर्षासारखीच अगदी तंतोतंत असेल?`,
        explanation: `दोन वर्षांचे कॅलेंडर तेव्हाच सारखे असते जेव्हा दोन्ही अटी पूर्ण होतात: दोन्ही वर्षे एकाच वारी सुरू होतात आणि दोन्ही लीप किंवा दोन्ही सामान्य असतात.\n${num(y)} हे ${isLeap(y) ? "लीप वर्ष" : "सामान्य वर्ष"} असून 1 जानेवारी ${num(y)} रोजी ${DAYS_MR[weekdayIndex(1, 1, y)]} होता.\nसामान्य वर्ष सुरुवातीचा वार 1 दिवसाने पुढे सरकवते तर लीप वर्ष 2 दिवसांनी, म्हणून हे सरकाव वर्षानुवर्षे बेरीज करत जा आणि बेरीज 7 च्या पटीत कधी येते ते पाहा.\n${num(y)} पासून पुढे मोजल्यास ${num(gap)} वर्षांनी ही बेरीज 7 च्या पटीत येते आणि त्याच ठिकाणी लीप-स्थितीही जुळते.\nम्हणून 1 जानेवारी ${num(repeat)} रोजीसुद्धा ${DAYS_MR[weekdayIndex(1, 1, repeat)]} येतो आणि ${num(y)} प्रमाणेच ${num(repeat)} हे ${isLeap(repeat) ? "लीप वर्ष" : "सामान्य वर्ष"} आहे.\nम्हणून ${num(y)} चे कॅलेंडर ${num(repeat)} मध्ये पुन्हा येते.\nप्रत्येक वेळी 11 किंवा 6 वर्षांचे ठराविक अंतर सांगणे हा नेहमीचा सापळा आहे — हे अंतर वर्ष लीप चक्रात कोठे आहे यावर अवलंबून बदलते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 4. A clock that gains or loses time
 * ------------------------------------------------------------------ */
const gainingClock = {
  id: "clock-gain-loss",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const rate of [2, 3, 4, 5, 6]) {
      for (const hours of [6, 8, 9, 12, 15, 18, 24]) {
        for (const dir of ["gains", "loses"]) out.push({ rate, hours, dir });
      }
    }
    return out;
  },
  make({ rate, hours, dir }) {
    // The clock is set right at midnight; how many minutes off is it later?
    const drift = rate * hours;
    const correct = num(drift);
    const distractors = [num(rate * (hours + 1)), num(Math.round(drift / 2)), num(drift + 60)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    const trueTime = hours === 24 ? "the next midnight" : `${num(hours)}:00`;
    const trueTimeMr = hours === 24 ? "पुढच्या मध्यरात्री" : `${num(hours)}:00 वाजता`;

    return {
      correct,
      distractors,
      en: {
        text: `A clock ${dir} ${num(rate)} minutes every hour. It is set to the correct time at midnight. By how many minutes will it be ${dir === "gains" ? "ahead of" : "behind"} the correct time at ${trueTime}?`,
        explanation: `Work with the error per hour and scale it — do not try to track the clock face itself.\nThe clock ${dir} ${num(rate)} minutes in each TRUE hour, so the error grows steadily with real time, not with the time shown on the dial.\nFrom midnight to ${trueTime} the true elapsed time is ${num(hours)} hours.\nTotal error = ${num(rate)} × ${num(hours)} = ${num(drift)} minutes.\nSo the clock reads ${num(drift)} minutes ${dir === "gains" ? "ahead of" : "behind"} the correct time.\nNote the wording carefully: had the question said the clock ${dir} ${num(rate)} minutes per hour "as shown on the faulty clock", the ${num(hours)} hours would have to be converted to true hours first, which changes the answer.`,
      },
      mr: {
        text: `एक घड्याळ दर तासाला ${num(rate)} मिनिटे ${dir === "gains" ? "पुढे जाते" : "मागे पडते"}. ते मध्यरात्री अचूक वेळेवर लावले आहे. तर ${trueTimeMr} ते अचूक वेळेच्या किती मिनिटे ${dir === "gains" ? "पुढे" : "मागे"} असेल?`,
        explanation: `दर तासाची चूक घेऊन तिचे प्रमाण वाढवा — घड्याळाच्या तबकडीचा मागोवा घेत बसू नका.\nहे घड्याळ प्रत्येक खऱ्या तासात ${num(rate)} मिनिटे ${dir === "gains" ? "पुढे जाते" : "मागे पडते"}, म्हणजे चूक खऱ्या वेळेनुसार वाढते, तबकडीवर दिसणाऱ्या वेळेनुसार नाही.\nमध्यरात्रीपासून ${trueTimeMr} पर्यंत खरी गेलेली वेळ ${num(hours)} तास आहे.\nएकूण चूक = ${num(rate)} × ${num(hours)} = ${num(drift)} मिनिटे.\nम्हणून घड्याळ अचूक वेळेपेक्षा ${num(drift)} मिनिटे ${dir === "gains" ? "पुढे" : "मागे"} दाखवेल.\nप्रश्नाची भाषा नीट वाचा: जर "बिघडलेल्या घड्याळावर दिसणाऱ्या" दर तासाला ${num(rate)} मिनिटे असे म्हटले असते, तर ${num(hours)} तास आधी खऱ्या तासांत रूपांतरित करावे लागले असते आणि उत्तर बदलले असते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 5. Days between two dates
 * ------------------------------------------------------------------ */
const daysBetween = {
  id: "calendar-days-between",
  difficulty: "moderate",
  cases() {
    const out = [];
    const pairs = [
      [[1, 1, 2024], [15, 3, 2024]], [[15, 8, 2025], [26, 1, 2026]],
      [[1, 6, 2023], [1, 9, 2023]], [[10, 2, 2024], [10, 5, 2024]],
      [[5, 3, 2022], [5, 7, 2022]], [[20, 11, 2021], [20, 2, 2022]],
      [[28, 2, 2020], [28, 4, 2020]], [[1, 4, 2025], [31, 12, 2025]],
      [[12, 9, 2019], [12, 1, 2020]], [[30, 6, 2018], [30, 9, 2018]],
      [[14, 1, 2026], [14, 6, 2026]], [[2, 10, 2024], [25, 12, 2024]],
      [[26, 1, 2023], [15, 8, 2023]], [[7, 7, 2027], [7, 11, 2027]],
      [[3, 5, 2020], [3, 8, 2020]], [[19, 2, 2025], [19, 10, 2025]],
    ];
    for (const [a, b] of pairs) out.push({ a, b });
    return out;
  },
  make({ a, b }) {
    const toUtc = ([d, m, y]) => Date.UTC(y, m - 1, d);
    const gap = Math.round((toUtc(b) - toUtc(a)) / 86400000);
    if (gap <= 0) return null;

    const correct = num(gap);
    const distractors = [num(gap + 1), num(gap - 1), num(gap + 7)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    const fmt = ([d, m, y]) => `${num(d)} ${MONTHS[m - 1]} ${num(y)}`;
    const fmtMr = ([d, m, y]) => `${num(d)} ${MONTHS_MR[m - 1]} ${num(y)}`;
    const idxA = weekdayIndex(a[0], a[1], a[2]);
    const idxB = weekdayIndex(b[0], b[1], b[2]);

    return {
      correct,
      distractors,
      en: {
        text: `How many days are there from ${fmt(a)} to ${fmt(b)}, counting the last day but not the first?`,
        explanation: `Count month by month instead of guessing, and settle the leap-year question before you start.\nFrom ${fmt(a)} to ${fmt(b)} you cross ${isLeap(a[2]) || isLeap(b[2]) ? "at least one leap year, so February gets 29 days where it applies" : "no leap year, so February has its usual 28 days"}.\nAdd the days remaining in the first month, then the full months in between, then the days used in the final month.\nThat total comes to ${num(gap)} days.\nAs a check, ${fmt(a)} was a ${DAYS[idxA]} and ${fmt(b)} is a ${DAYS[idxB]}; ${num(gap)} mod 7 = ${num(gap % 7)}, and moving ${num(gap % 7)} days on from ${DAYS[idxA]} does land on ${DAYS[idxB]}.\nThe phrase "counting the last day but not the first" is what fixes the answer — the same two dates would give ${num(gap + 1)} if both ends were counted.`,
      },
      mr: {
        text: `${fmtMr(a)} पासून ${fmtMr(b)} पर्यंत किती दिवस होतात? (शेवटचा दिवस मोजा, पहिला दिवस मोजू नका.)`,
        explanation: `अंदाज न लावता महिन्यागणिक मोजा आणि सुरुवातीलाच लीप वर्षाचा प्रश्न निकाली काढा.\n${fmtMr(a)} ते ${fmtMr(b)} या कालावधीत ${isLeap(a[2]) || isLeap(b[2]) ? "किमान एक लीप वर्ष येते, म्हणून लागू तिथे फेब्रुवारीला 29 दिवस धरा" : "एकही लीप वर्ष येत नाही, म्हणून फेब्रुवारीला नेहमीचे 28 दिवस धरा"}.\nपहिल्या महिन्यातील उरलेले दिवस, मधले पूर्ण महिने आणि शेवटच्या महिन्यातील दिवस अशी बेरीज करा.\nही बेरीज ${num(gap)} दिवस येते.\nपडताळणी म्हणून: ${fmtMr(a)} रोजी ${DAYS_MR[idxA]} होता व ${fmtMr(b)} रोजी ${DAYS_MR[idxB]} आहे; ${num(gap)} ला 7 ने भागल्यास बाकी ${num(gap % 7)} येते आणि ${DAYS_MR[idxA]} पासून ${num(gap % 7)} दिवस पुढे गेल्यास खरोखर ${DAYS_MR[idxB]} येतो.\n"शेवटचा दिवस मोजा, पहिला नाही" या वाक्यानेच उत्तर ठरते — दोन्ही टोके मोजली असती तर तेच दिनांक ${num(gap + 1)} दिवस देतात.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 6. Mirror image of a clock time
 * ------------------------------------------------------------------ */
const mirrorImage = {
  id: "clock-mirror-image",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (let h = 1; h <= 11; h += 1) {
      for (const m of [10, 15, 20, 25, 35, 40, 45, 50]) out.push({ h, m });
    }
    return out;
  },
  make({ h, m }) {
    // Mirror about the 12-6 line: total minutes from 12 subtract from 720.
    const mins = (h % 12) * 60 + m;
    const mirror = (720 - mins) % 720;
    const mh = Math.floor(mirror / 60) === 0 ? 12 : Math.floor(mirror / 60);
    const mm = mirror % 60;
    const correct = clockTime(mh, mm);

    const wrong1 = clockTime(mh === 1 ? 12 : mh - 1, mm);
    const wrong2 = clockTime(mh === 12 ? 1 : mh + 1, mm);
    const wrong3 = clockTime(mh, (mm + 30) % 60);
    const distractors = [wrong1, wrong2, wrong3];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `A clock seen in a mirror shows the time as ${clockTime(h, m)}. What is the correct time?`,
        explanation: `A mirror flips the dial about the vertical 12–6 line, so a time and its reflection always add up to 12 hours.\nWrite the mirrored reading as minutes past 12: ${num(h % 12)} × 60 + ${num(m)} = ${num(mins)} minutes.\nA full half-turn of the dial is 12 × 60 = 720 minutes, so the real time is 720 − ${num(mins)} = ${num(mirror === 0 ? 720 : mirror)} minutes past 12.\nConverting back, ${num(mirror === 0 ? 720 : mirror)} minutes is ${num(mh)} hours and ${num(mm)} minutes, that is ${correct}.\nThe quick version of the same rule is to subtract the given time from 11:60, which is why ${clockTime(h, m)} pairs with ${correct}.\nUse 23:60 instead of 11:60 only when the question is set on a 24-hour dial.`,
      },
      mr: {
        text: `आरशात पाहिले असता घड्याळात ${clockTime(h, m)} अशी वेळ दिसते. तर खरी वेळ किती?`,
        explanation: `आरसा तबकडी 12–6 या उभ्या रेषेभोवती उलटवतो, म्हणून वेळ आणि तिचे प्रतिबिंब यांची बेरीज नेहमी 12 तास होते.\nआरशातील वेळ 12 पासूनची मिनिटे म्हणून लिहा: ${num(h % 12)} × 60 + ${num(m)} = ${num(mins)} मिनिटे.\nतबकडीचे अर्धे वर्तुळ म्हणजे 12 × 60 = 720 मिनिटे, म्हणून खरी वेळ = 720 − ${num(mins)} = ${num(mirror === 0 ? 720 : mirror)} मिनिटे (12 नंतर).\nपरत रूपांतर केल्यास ${num(mirror === 0 ? 720 : mirror)} मिनिटे म्हणजे ${num(mh)} तास ${num(mm)} मिनिटे, म्हणजेच ${correct}.\nयाच नियमाची झटपट पद्धत म्हणजे दिलेली वेळ 11:60 मधून वजा करणे, म्हणूनच ${clockTime(h, m)} ची जोडी ${correct} शी लागते.\n24 तासांची तबकडी असेल तरच 11:60 ऐवजी 23:60 वापरा.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 7. Weekday a given number of days later
 * ------------------------------------------------------------------ */
const weekdayShift = {
  id: "calendar-weekday-shift",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (let start = 0; start < 7; start += 1) {
      for (const n of [45, 61, 75, 100, 123, 150, 200, 250, 300, 365, 400, 500]) {
        out.push({ start, n });
      }
    }
    return out;
  },
  make({ start, n }) {
    const idx = (start + (n % 7)) % 7;
    const correct = DAY_LABEL[idx];
    const distractors = dayDistractors(idx);

    return {
      correct,
      distractors,
      en: {
        text: `If today is ${DAYS[start]}, what day of the week will it be after ${num(n)} days?`,
        explanation: `Only the leftover days beyond whole weeks can change the answer, so reduce the count modulo 7 first.\n${num(n)} ÷ 7 = ${num(Math.floor(n / 7))} complete weeks with a remainder of ${num(n % 7)}.\nThose ${num(Math.floor(n / 7))} weeks land you back on ${DAYS[start]} every time, so they can be ignored entirely.\nNow move ${num(n % 7)} day${n % 7 === 1 ? "" : "s"} forward from ${DAYS[start]}.\nThat gives ${DAYS[idx]}.\nHad the question said "${num(n)} days ago" you would count the same ${num(n % 7)} days backwards instead, which usually gives a different day — read the direction before you count.`,
      },
      mr: {
        text: `आज ${DAYS_MR[start]} असेल, तर ${num(n)} दिवसांनंतर आठवड्याचा कोणता वार असेल?`,
        explanation: `पूर्ण आठवड्यांपलीकडे उरणारे दिवसच उत्तर बदलू शकतात, म्हणून प्रथम संख्येला 7 ने भागून बाकी काढा.\n${num(n)} ÷ 7 = ${num(Math.floor(n / 7))} पूर्ण आठवडे आणि बाकी ${num(n % 7)}.\nते ${num(Math.floor(n / 7))} आठवडे प्रत्येक वेळी तुम्हाला पुन्हा ${DAYS_MR[start]} वरच आणून सोडतात, म्हणून त्यांचा विचारच करू नका.\nआता ${DAYS_MR[start]} पासून ${num(n % 7)} दिवस पुढे मोजा.\nत्यातून ${DAYS_MR[idx]} मिळतो.\nप्रश्नात "${num(n)} दिवसांपूर्वी" असे असते तर तेच ${num(n % 7)} दिवस मागे मोजावे लागले असते आणि वार बहुधा वेगळा आला असता — मोजण्याआधी दिशा वाचा.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 8. When do the hands coincide / oppose between two hours
 * ------------------------------------------------------------------ */
const handsMeet = {
  id: "clock-hands-meet",
  difficulty: "hard",
  cases() {
    const out = [];
    for (let h = 1; h <= 11; h += 1) {
      for (const mode of ["together", "opposite"]) out.push({ h, mode });
    }
    return out;
  },
  make({ h, mode }) {
    // Minute hand gains 55 minute-spaces on the hour hand every 60 minutes.
    const need = mode === "together" ? 5 * h : 5 * h - 30;
    const adjusted = ((need % 60) + 60) % 60;
    const exact = (adjusted * 60) / 55;
    if (exact >= 60) return null;

    const whole = Math.floor(exact);
    const fracNum = Math.round((exact - whole) * 11);
    if (fracNum === 0 || fracNum === 11) return null;
    const correct = `${num(whole)} ${num(fracNum)}/11`;

    const distractors = [
      `${num(whole + 1)} ${num(fracNum)}/11`,
      `${num(whole)} ${num(((fracNum + 4) % 10) + 1)}/11`,
      `${num(adjusted)} 0/11`.replace(" 0/11", ""),
    ];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    const modeEn = mode === "together" ? "coincide" : "point in exactly opposite directions";
    const modeMr = mode === "together" ? "एकमेकांवर येतील" : "अगदी विरुद्ध दिशेला असतील";

    return {
      correct,
      distractors,
      en: {
        text: `At how many minutes past ${num(h)} o'clock will the two hands of a clock ${modeEn}?`,
        explanation: `Measure everything in minute-spaces, the 60 small divisions on the dial.\nAt exactly ${num(h)} o'clock the hour hand is ${num(5 * h)} minute-spaces ahead of the minute hand.\nTo ${modeEn}, the minute hand must end up ${mode === "together" ? "level with" : "30 spaces away from"} the hour hand, so it has to gain ${num(adjusted)} minute-spaces on it.\nIn 60 minutes the minute hand gains 60 − 5 = 55 spaces on the hour hand, so gaining 1 space takes 60/55 minutes.\nTime needed = ${num(adjusted)} × 60/55 = ${num(whole)} ${num(fracNum)}/11 minutes.\nSo the hands ${modeEn} at ${num(whole)} ${num(fracNum)}/11 minutes past ${num(h)}.\nThe elevenths in the answer are the giveaway that you used the 55-space relative gain — a whole-number answer here almost always means the relative speed was forgotten.`,
      },
      mr: {
        text: `${num(h)} वाजल्यानंतर किती मिनिटांनी घड्याळाचे दोन्ही काटे ${modeMr}?`,
        explanation: `सर्व मोजमाप मिनिट-खणांत करा, म्हणजे तबकडीवरील 60 लहान भागांत.\nबरोबर ${num(h)} वाजता तास काटा मिनिट काट्याच्या ${num(5 * h)} मिनिट-खण पुढे असतो.\nकाटे ${modeMr} यासाठी मिनिट काटा तास काट्यापासून ${mode === "together" ? "बरोबर त्याच जागी" : "30 खण दूर"} यायला हवा, म्हणजे त्याने ${num(adjusted)} मिनिट-खण भरून काढायचे आहेत.\n60 मिनिटांत मिनिट काटा तास काट्यावर 60 − 5 = 55 खण मिळवतो, म्हणून 1 खण मिळवायला 60/55 मिनिटे लागतात.\nलागणारा वेळ = ${num(adjusted)} × 60/55 = ${num(whole)} ${num(fracNum)}/11 मिनिटे.\nम्हणून ${num(h)} वाजून ${num(whole)} ${num(fracNum)}/11 मिनिटांनी काटे ${modeMr}.\nउत्तरात अकरावा भाग येणे हेच तुम्ही 55 खणांचा सापेक्ष वेग वापरल्याचे लक्षण आहे — इथे पूर्णांक उत्तर आले तर बहुधा सापेक्ष वेग विसरला गेला आहे.`,
      },
    };
  },
};

export const topicId = "clocks-calendars";

export const archetypes = [
  handAngle,
  weekdayOfDate,
  sameCalendarYear,
  gainingClock,
  daysBetween,
  mirrorImage,
  weekdayShift,
  handsMeet,
];
