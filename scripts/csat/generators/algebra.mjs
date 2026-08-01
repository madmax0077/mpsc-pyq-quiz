/**
 * Generator: Algebra & Equations — linear systems, quadratics, identities,
 * ages and progressions.
 */

import { isClean, num, round } from "../lib/util.mjs";
import { gcd } from "../lib/math.mjs";

/* ------------------------------------------------------------------ *
 * 1. Simultaneous linear equations
 * ------------------------------------------------------------------ */
const linearSystem = {
  id: "linear-system",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (let x = 2; x <= 9; x += 1) {
      for (let y = 1; y <= 8; y += 1) {
        for (const [a, b] of [[2, 3], [3, 2], [4, 5], [5, 3], [3, 7], [2, 5]]) {
          if (x !== y) out.push({ x, y, a, b });
        }
      }
    }
    return out;
  },
  make({ x, y, a, b }) {
    const c1 = a * x + b * y;
    const c2 = b * x - a * y;
    if (c2 <= 0) return null;

    const correct = num(x);
    const distractors = [num(y), num(x + y), num(Math.abs(x - y)) === num(x) ? num(x + 2) : num(Math.abs(x - y))];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `Solve the equations ${num(a)}x + ${num(b)}y = ${num(c1)} and ${num(b)}x − ${num(a)}y = ${num(c2)}. What is the value of x?`,
        explanation: `Use elimination. Multiply the first equation by ${num(a)} and the second by ${num(b)} so that the y terms cancel:\n  ${num(a * a)}x + ${num(a * b)}y = ${num(a * c1)}\n  ${num(b * b)}x − ${num(a * b)}y = ${num(b * c2)}\nAdding the two removes y altogether: ${num(a * a + b * b)}x = ${num(a * c1 + b * c2)}.\nx = ${num(a * c1 + b * c2)} ÷ ${num(a * a + b * b)} = ${num(x)}.\nSubstituting back into the first equation: ${num(a)}(${num(x)}) + ${num(b)}y = ${num(c1)}, giving y = ${num(y)}.\nCheck both equations: ${num(a)}(${num(x)}) + ${num(b)}(${num(y)}) = ${num(c1)} and ${num(b)}(${num(x)}) − ${num(a)}(${num(y)}) = ${num(c2)}. Always substitute into BOTH, since an arithmetic slip often satisfies only one.`,
      },
      mr: {
        text: `${num(a)}x + ${num(b)}y = ${num(c1)} आणि ${num(b)}x − ${num(a)}y = ${num(c2)} ही समीकरणे सोडवा. x ची किंमत किती?`,
        explanation: `निरसन पद्धत वापरा. पहिल्या समीकरणाला ${num(a)} ने व दुसऱ्याला ${num(b)} ने गुणा, म्हणजे y ची पदे रद्द होतील:\n  ${num(a * a)}x + ${num(a * b)}y = ${num(a * c1)}\n  ${num(b * b)}x − ${num(a * b)}y = ${num(b * c2)}\nदोन्ही मिळवल्यास y पूर्णपणे नाहीसा होतो: ${num(a * a + b * b)}x = ${num(a * c1 + b * c2)}.\nx = ${num(a * c1 + b * c2)} ÷ ${num(a * a + b * b)} = ${num(x)}.\nपहिल्या समीकरणात परत ठेवल्यास: ${num(a)}(${num(x)}) + ${num(b)}y = ${num(c1)}, यातून y = ${num(y)}.\nदोन्ही समीकरणे तपासा: ${num(a)}(${num(x)}) + ${num(b)}(${num(y)}) = ${num(c1)} व ${num(b)}(${num(x)}) − ${num(a)}(${num(y)}) = ${num(c2)}. नेहमी दोन्हींत पडताळणी करावी, कारण गणिती चूक अनेकदा एकाच समीकरणात जुळते.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 2. Sum and product of the roots of a quadratic
 * ------------------------------------------------------------------ */
const quadraticRoots = {
  id: "quadratic-roots",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (let p = 1; p <= 9; p += 1) {
      for (let q = 1; q <= 9; q += 1) {
        for (const want of ["sum-squares", "reciprocal-sum"]) {
          if (p !== q) out.push({ p, q, want });
        }
      }
    }
    return out;
  },
  make({ p, q, want }) {
    const b = -(p + q);
    const c = p * q;
    const sum = p + q;

    if (want === "sum-squares") {
      const ans = p * p + q * q;
      const correct = num(ans);
      const distractors = [num(sum * sum), num(sum * sum + 2 * c), num(Math.abs(p - q) ** 2)];
      if (new Set([correct, ...distractors]).size !== 4) return null;
      return {
        correct,
        distractors,
        en: {
          text: `If α and β are the roots of the equation x² ${b < 0 ? "−" : "+"} ${num(Math.abs(b))}x + ${num(c)} = 0, find the value of α² + β².`,
          explanation: `You do not need the roots themselves. For x² + bx + c = 0, the sum of the roots is −b and the product is c.\nHere α + β = ${num(sum)} and αβ = ${num(c)}.\nUse the identity α² + β² = (α + β)² − 2αβ.\n= (${num(sum)})² − 2(${num(c)}) = ${num(sum * sum)} − ${num(2 * c)} = ${num(ans)}.\nThe roots happen to be ${num(p)} and ${num(q)}, and indeed ${num(p)}² + ${num(q)}² = ${num(ans)}.\nForgetting the −2αβ term and answering ${num(sum * sum)} is the standard mistake.`,
        },
        mr: {
          text: `जर α व β ही x² ${b < 0 ? "−" : "+"} ${num(Math.abs(b))}x + ${num(c)} = 0 या समीकरणाची मुळे असतील, तर α² + β² ची किंमत काढा.`,
          explanation: `मुळे प्रत्यक्ष काढण्याची गरज नाही. x² + bx + c = 0 साठी मुळांची बेरीज = −b आणि गुणाकार = c.\nयेथे α + β = ${num(sum)} व αβ = ${num(c)}.\nα² + β² = (α + β)² − 2αβ ही नित्यसमानता वापरा.\n= (${num(sum)})² − 2(${num(c)}) = ${num(sum * sum)} − ${num(2 * c)} = ${num(ans)}.\nप्रत्यक्षात मुळे ${num(p)} व ${num(q)} आहेत, आणि ${num(p)}² + ${num(q)}² = ${num(ans)} हे जुळते.\n−2αβ हे पद विसरून ${num(sum * sum)} असे उत्तर देणे ही नेहमीची चूक आहे.`,
        },
      };
    }

    const value = sum / c;
    if (!isClean(value)) return null;
    const correct = num(round(value, 2));
    const distractors = [num(round(c / sum, 2)), num(sum), num(c)];
    if (new Set([correct, ...distractors]).size !== 4) return null;
    return {
      correct,
      distractors,
      en: {
        text: `If α and β are the roots of the equation x² ${b < 0 ? "−" : "+"} ${num(Math.abs(b))}x + ${num(c)} = 0, find the value of 1/α + 1/β.`,
        explanation: `For x² + bx + c = 0 the sum of the roots is −b and the product is c.\nHere α + β = ${num(sum)} and αβ = ${num(c)}.\nCombine the two fractions: 1/α + 1/β = (β + α)/(αβ).\n= ${num(sum)} / ${num(c)} = ${num(round(value, 2))}.\nThe roots are ${num(p)} and ${num(q)}, and 1/${num(p)} + 1/${num(q)} = ${num(round(value, 2))}, which confirms it.\nNote the sum goes on TOP and the product underneath — inverting that gives ${num(round(c / sum, 2))}, the trap option.`,
      },
      mr: {
        text: `जर α व β ही x² ${b < 0 ? "−" : "+"} ${num(Math.abs(b))}x + ${num(c)} = 0 या समीकरणाची मुळे असतील, तर 1/α + 1/β ची किंमत काढा.`,
        explanation: `x² + bx + c = 0 साठी मुळांची बेरीज = −b आणि गुणाकार = c.\nयेथे α + β = ${num(sum)} व αβ = ${num(c)}.\nदोन्ही अपूर्णांक एकत्र करा: 1/α + 1/β = (β + α)/(αβ).\n= ${num(sum)} / ${num(c)} = ${num(round(value, 2))}.\nमुळे ${num(p)} व ${num(q)} आहेत, आणि 1/${num(p)} + 1/${num(q)} = ${num(round(value, 2))} हे जुळते.\nबेरीज वर व गुणाकार खाली येतो — उलट केल्यास ${num(round(c / sum, 2))} हा सापळा येतो.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 3. Ages
 * ------------------------------------------------------------------ */
const ages = {
  id: "age-problem",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const k1 of [3, 4, 5, 6]) {
      for (const k2 of [2, 3]) {
        for (const years of [4, 5, 6, 8, 10, 12]) {
          if (k1 > k2) out.push({ k1, k2, years });
        }
      }
    }
    return out;
  },
  make({ k1, k2, years }) {
    // Now: father = k1 * son. After `years`: father + years = k2 * (son + years)
    // k1*s + years = k2*s + k2*years  =>  s(k1 - k2) = years(k2 - 1)
    const son = (years * (k2 - 1)) / (k1 - k2);
    if (!Number.isInteger(son) || son < 4 || son > 40) return null;
    const father = k1 * son;
    if (father - son < 16) return null;

    const correct = num(son);
    const distractors = [num(father), num(son + years), num(father - son)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `A father is at present ${num(k1)} times as old as his son. After ${num(years)} years he will be ${num(k2)} times as old as his son. What is the son's present age, in years?`,
        explanation: `Let the son's present age be s years, so the father's present age is ${num(k1)}s.\nEveryone ages by the same amount, so after ${num(years)} years the son is (s + ${num(years)}) and the father is (${num(k1)}s + ${num(years)}).\nThe condition gives: ${num(k1)}s + ${num(years)} = ${num(k2)}(s + ${num(years)}).\n${num(k1)}s + ${num(years)} = ${num(k2)}s + ${num(k2 * years)}.\n${num(k1 - k2)}s = ${num(k2 * years - years)}, so s = ${num(son)}.\nSo the son is ${num(son)} and the father is ${num(father)}. Check: in ${num(years)} years they will be ${num(son + years)} and ${num(father + years)}, and ${num(father + years)} = ${num(k2)} × ${num(son + years)}.\nAdd ${num(years)} to BOTH ages — adding it to only one is the commonest error in age problems.`,
      },
      mr: {
        text: `सध्या वडिलांचे वय मुलाच्या वयाच्या ${num(k1)} पट आहे. ${num(years)} वर्षांनंतर ते मुलाच्या वयाच्या ${num(k2)} पट होईल. तर मुलाचे सध्याचे वय किती वर्षे?`,
        explanation: `मुलाचे सध्याचे वय s वर्षे धरा, म्हणजे वडिलांचे वय ${num(k1)}s होईल.\nदोघांचेही वय सारख्याच प्रमाणात वाढते, म्हणून ${num(years)} वर्षांनी मुलगा (s + ${num(years)}) व वडील (${num(k1)}s + ${num(years)}) वर्षांचे होतील.\nअटीनुसार: ${num(k1)}s + ${num(years)} = ${num(k2)}(s + ${num(years)}).\n${num(k1)}s + ${num(years)} = ${num(k2)}s + ${num(k2 * years)}.\n${num(k1 - k2)}s = ${num(k2 * years - years)}, म्हणून s = ${num(son)}.\nम्हणजे मुलगा ${num(son)} व वडील ${num(father)} वर्षांचे आहेत. पडताळणी: ${num(years)} वर्षांनी ते ${num(son + years)} व ${num(father + years)} होतील, आणि ${num(father + years)} = ${num(k2)} × ${num(son + years)}.\n${num(years)} हे दोघांच्याही वयात मिळवावे — फक्त एकाच्या वयात मिळवणे ही वयाच्या उदाहरणांतील सर्वात सामान्य चूक आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 4. x + 1/x identities
 * ------------------------------------------------------------------ */
const reciprocalIdentity = {
  id: "reciprocal-identity",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const k of [3, 4, 5, 6, 7, 8, 9, 10]) {
      for (const want of ["square", "cube"]) out.push({ k, want });
    }
    return out;
  },
  make({ k, want }) {
    if (want === "square") {
      const ans = k * k - 2;
      const correct = num(ans);
      const distractors = [num(k * k), num(k * k + 2), num(ans - 2)];
      if (new Set([correct, ...distractors]).size !== 4) return null;
      return {
        correct,
        distractors,
        en: {
          text: `If x + 1/x = ${num(k)}, find the value of x² + 1/x².`,
          explanation: `Square both sides of the given equation.\n(x + 1/x)² = x² + 2 × x × (1/x) + 1/x² = x² + 2 + 1/x².\nSo x² + 1/x² = (x + 1/x)² − 2.\n= ${num(k)}² − 2 = ${num(k * k)} − 2 = ${num(ans)}.\nThe middle term is exactly 2 because x and 1/x multiply to 1 — that is what makes this family of identities so quick.\nAnswering ${num(k * k)} forgets to subtract that middle term.`,
        },
        mr: {
          text: `जर x + 1/x = ${num(k)} असेल, तर x² + 1/x² ची किंमत काढा.`,
          explanation: `दिलेल्या समीकरणाच्या दोन्ही बाजूंचा वर्ग करा.\n(x + 1/x)² = x² + 2 × x × (1/x) + 1/x² = x² + 2 + 1/x².\nम्हणून x² + 1/x² = (x + 1/x)² − 2.\n= ${num(k)}² − 2 = ${num(k * k)} − 2 = ${num(ans)}.\nमधले पद नेमके 2 येते कारण x व 1/x यांचा गुणाकार 1 असतो — यामुळेच ही नित्यसमानतांची मालिका खूप जलद आहे.\n${num(k * k)} असे उत्तर देणे म्हणजे ते मधले पद वजा करायचे विसरणे.`,
        },
      };
    }
    const ans = k * k * k - 3 * k;
    const correct = num(ans);
    const distractors = [num(k * k * k), num(k * k * k + 3 * k), num(k * k - 2)];
    if (new Set([correct, ...distractors]).size !== 4) return null;
    return {
      correct,
      distractors,
      en: {
        text: `If x + 1/x = ${num(k)}, find the value of x³ + 1/x³.`,
        explanation: `Cube both sides of the given equation.\n(x + 1/x)³ = x³ + 1/x³ + 3(x + 1/x), because the cross terms 3x²(1/x) and 3x(1/x²) simplify to 3x and 3/x.\nRearranging: x³ + 1/x³ = (x + 1/x)³ − 3(x + 1/x).\n= ${num(k)}³ − 3(${num(k)}) = ${num(k * k * k)} − ${num(3 * k)} = ${num(ans)}.\nThe correction term is 3 times the ORIGINAL expression, not 3 alone — that is the detail most candidates get wrong.`,
      },
      mr: {
        text: `जर x + 1/x = ${num(k)} असेल, तर x³ + 1/x³ ची किंमत काढा.`,
        explanation: `दिलेल्या समीकरणाच्या दोन्ही बाजूंचा घन करा.\n(x + 1/x)³ = x³ + 1/x³ + 3(x + 1/x), कारण 3x²(1/x) व 3x(1/x²) ही मधली पदे सोपी होऊन 3x व 3/x होतात.\nपुनर्रचना केल्यास: x³ + 1/x³ = (x + 1/x)³ − 3(x + 1/x).\n= ${num(k)}³ − 3(${num(k)}) = ${num(k * k * k)} − ${num(3 * k)} = ${num(ans)}.\nदुरुस्तीचे पद हे मूळ पदाच्या 3 पट असते, फक्त 3 नाही — हाच तपशील बहुतेकांचा चुकतो.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 5. Arithmetic progression
 * ------------------------------------------------------------------ */
const arithmeticProgression = {
  id: "arithmetic-progression",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (const a of [3, 5, 7, 8, 11, 12]) {
      for (const d of [2, 3, 4, 5, 6, 7]) {
        for (const n of [12, 15, 18, 20, 25, 30]) {
          for (const want of ["term", "sum"]) out.push({ a, d, n, want });
        }
      }
    }
    return out;
  },
  make({ a, d, n, want }) {
    const term = a + (n - 1) * d;
    const sum = (n * (2 * a + (n - 1) * d)) / 2;
    if (want === "term") {
      const correct = num(term);
      const distractors = [num(a + n * d), num(a + (n - 1) * d + d), num(n * d)];
      if (new Set([correct, ...distractors]).size !== 4) return null;
      return {
        correct,
        distractors,
        en: {
          text: `Find the ${num(n)}th term of the arithmetic progression ${num(a)}, ${num(a + d)}, ${num(a + 2 * d)}, ${num(a + 3 * d)}, ...`,
          explanation: `First identify the common difference: ${num(a + d)} − ${num(a)} = ${num(d)}, and the same gap repeats throughout.\nThe nth term of an AP is aₙ = a + (n − 1)d, where a is the first term.\nHere a = ${num(a)}, d = ${num(d)} and n = ${num(n)}.\naₙ = ${num(a)} + (${num(n)} − 1) × ${num(d)} = ${num(a)} + ${num(n - 1)} × ${num(d)} = ${num(a)} + ${num((n - 1) * d)} = ${num(term)}.\nIt is (n − 1)d and not nd, because the first term needs no step added to it. Using nd would give ${num(a + n * d)}.`,
        },
        mr: {
          text: `${num(a)}, ${num(a + d)}, ${num(a + 2 * d)}, ${num(a + 3 * d)}, ... या अंकगणिती श्रेढीचे ${num(n)} वे पद काढा.`,
          explanation: `प्रथम सामाईक फरक ओळखा: ${num(a + d)} − ${num(a)} = ${num(d)}, आणि हाच फरक पुढेही कायम राहतो.\nअंकगणिती श्रेढीचे n वे पद = a + (n − 1)d, येथे a हे पहिले पद आहे.\nयेथे a = ${num(a)}, d = ${num(d)} व n = ${num(n)}.\nn वे पद = ${num(a)} + (${num(n)} − 1) × ${num(d)} = ${num(a)} + ${num(n - 1)} × ${num(d)} = ${num(a)} + ${num((n - 1) * d)} = ${num(term)}.\n(n − 1)d असते, nd नाही, कारण पहिल्या पदात कोणतीही वाढ मिळवावी लागत नाही. nd घेतल्यास ${num(a + n * d)} असे चुकीचे उत्तर येते.`,
        },
      };
    }
    if (!Number.isInteger(sum)) return null;
    const correct = num(sum);
    const distractors = [num(term), num(round(sum + n, 2)), num(n * a)];
    if (new Set([correct, ...distractors]).size !== 4) return null;
    return {
      correct,
      distractors,
      en: {
        text: `Find the sum of the first ${num(n)} terms of the arithmetic progression ${num(a)}, ${num(a + d)}, ${num(a + 2 * d)}, ${num(a + 3 * d)}, ...`,
        explanation: `The common difference is ${num(a + d)} − ${num(a)} = ${num(d)}.\nThe sum of the first n terms is Sₙ = n/2 × [2a + (n − 1)d].\n= ${num(n)}/2 × [2(${num(a)}) + (${num(n)} − 1)(${num(d)})].\n= ${num(n)}/2 × [${num(2 * a)} + ${num((n - 1) * d)}] = ${num(n)}/2 × ${num(2 * a + (n - 1) * d)} = ${num(sum)}.\nEquivalently, the last term is ${num(term)} and Sₙ = n/2 × (first + last) = ${num(n)}/2 × (${num(a)} + ${num(term)}) = ${num(sum)} — a useful cross-check.\nThe ${num(n)}th TERM is ${num(term)}; do not confuse the term with the sum.`,
      },
      mr: {
        text: `${num(a)}, ${num(a + d)}, ${num(a + 2 * d)}, ${num(a + 3 * d)}, ... या अंकगणिती श्रेढीच्या पहिल्या ${num(n)} पदांची बेरीज काढा.`,
        explanation: `सामाईक फरक = ${num(a + d)} − ${num(a)} = ${num(d)}.\nपहिल्या n पदांची बेरीज = n/2 × [2a + (n − 1)d].\n= ${num(n)}/2 × [2(${num(a)}) + (${num(n)} − 1)(${num(d)})].\n= ${num(n)}/2 × [${num(2 * a)} + ${num((n - 1) * d)}] = ${num(n)}/2 × ${num(2 * a + (n - 1) * d)} = ${num(sum)}.\nदुसऱ्या पद्धतीने, शेवटचे पद ${num(term)} असून बेरीज = n/2 × (पहिले + शेवटचे) = ${num(n)}/2 × (${num(a)} + ${num(term)}) = ${num(sum)} — ही उपयुक्त पडताळणी आहे.\n${num(n)} वे पद ${num(term)} आहे; पद व बेरीज यांची गल्लत करू नये.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 6. Algebraic identity on a + b and ab
 * ------------------------------------------------------------------ */
const sumProductIdentity = {
  id: "sum-product-identity",
  difficulty: "moderate",
  cases() {
    const out = [];
    for (let a = 2; a <= 12; a += 1) {
      for (let b = 1; b < a; b += 1) {
        for (const want of ["squares", "cubes"]) out.push({ a, b, want });
      }
    }
    return out;
  },
  make({ a, b, want }) {
    const s = a + b;
    const p = a * b;
    if (want === "squares") {
      const ans = a * a + b * b;
      const correct = num(ans);
      const distractors = [num(s * s), num(s * s + 2 * p), num((a - b) ** 2)];
      if (new Set([correct, ...distractors]).size !== 4) return null;
      return {
        correct,
        distractors,
        en: {
          text: `If a + b = ${num(s)} and ab = ${num(p)}, find the value of a² + b².`,
          explanation: `Expanding (a + b)² gives a² + 2ab + b², so a² + b² = (a + b)² − 2ab.\n= (${num(s)})² − 2(${num(p)}).\n= ${num(s * s)} − ${num(2 * p)} = ${num(ans)}.\nThe actual values are a = ${num(a)} and b = ${num(b)}, and ${num(a)}² + ${num(b)}² = ${num(ans)} — but note you never needed to find them.\nBeing able to reach the answer from the sum and product alone is the whole point of these identities.`,
        },
        mr: {
          text: `जर a + b = ${num(s)} आणि ab = ${num(p)} असेल, तर a² + b² ची किंमत काढा.`,
          explanation: `(a + b)² चा विस्तार a² + 2ab + b² असतो, म्हणून a² + b² = (a + b)² − 2ab.\n= (${num(s)})² − 2(${num(p)}).\n= ${num(s * s)} − ${num(2 * p)} = ${num(ans)}.\nप्रत्यक्ष किंमती a = ${num(a)} व b = ${num(b)} आहेत, आणि ${num(a)}² + ${num(b)}² = ${num(ans)} — पण त्या शोधण्याची गरजच पडली नाही हे लक्षात घ्या.\nफक्त बेरीज व गुणाकारावरून उत्तर मिळवता येणे हाच या नित्यसमानतांचा मुख्य उपयोग आहे.`,
        },
      };
    }
    const ans = a ** 3 + b ** 3;
    const correct = num(ans);
    const distractors = [num(s ** 3), num(s ** 3 - p), num(a ** 3 - b ** 3)];
    if (new Set([correct, ...distractors]).size !== 4) return null;
    return {
      correct,
      distractors,
      en: {
        text: `If a + b = ${num(s)} and ab = ${num(p)}, find the value of a³ + b³.`,
        explanation: `Use the identity a³ + b³ = (a + b)³ − 3ab(a + b).\n= (${num(s)})³ − 3(${num(p)})(${num(s)}).\n= ${num(s ** 3)} − ${num(3 * p * s)} = ${num(ans)}.\nCheck with the actual values a = ${num(a)} and b = ${num(b)}: ${num(a)}³ + ${num(b)}³ = ${num(a ** 3)} + ${num(b ** 3)} = ${num(ans)}.\nThe correction term is 3ab(a + b), which involves the sum as well — leaving out the (a + b) factor is the usual slip.`,
      },
      mr: {
        text: `जर a + b = ${num(s)} आणि ab = ${num(p)} असेल, तर a³ + b³ ची किंमत काढा.`,
        explanation: `a³ + b³ = (a + b)³ − 3ab(a + b) ही नित्यसमानता वापरा.\n= (${num(s)})³ − 3(${num(p)})(${num(s)}).\n= ${num(s ** 3)} − ${num(3 * p * s)} = ${num(ans)}.\nप्रत्यक्ष किंमतींनी पडताळणी: a = ${num(a)}, b = ${num(b)}, म्हणून ${num(a)}³ + ${num(b)}³ = ${num(a ** 3)} + ${num(b ** 3)} = ${num(ans)}.\nदुरुस्तीचे पद 3ab(a + b) असे असून त्यात बेरीजही येते — (a + b) हा घटक वगळणे ही नेहमीची चूक आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 7. Remainder theorem
 * ------------------------------------------------------------------ */
const remainderTheorem = {
  id: "remainder-theorem",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const p of [2, 3, 4, 5]) {
      for (const q of [1, 2, 3, 6, 7]) {
        for (const r of [1, 2, 3, 4, 5]) {
          for (const a of [1, 2, 3, -1, -2]) out.push({ p, q, r, a });
        }
      }
    }
    return out;
  },
  make({ p, q, r, a }) {
    const value = p * a ** 3 + q * a ** 2 - r * a + 5;
    const sign = a >= 0 ? "−" : "+";
    const shown = Math.abs(a);

    const correct = num(value);
    const distractors = [num(value + r), num(p + q - r + 5), num(-value === value ? value + 7 : -value)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `Find the remainder when the polynomial ${num(p)}x³ + ${num(q)}x² − ${num(r)}x + 5 is divided by (x ${sign} ${num(shown)}).`,
        explanation: `By the remainder theorem, the remainder on dividing a polynomial f(x) by (x − k) is simply f(k).\nHere the divisor is (x ${sign} ${num(shown)}), so k = ${num(a)}. Note the sign flips: (x ${sign} ${num(shown)}) means x = ${num(a)}.\nSubstitute x = ${num(a)}:\nf(${num(a)}) = ${num(p)}(${num(a)})³ + ${num(q)}(${num(a)})² − ${num(r)}(${num(a)}) + 5.\n= ${num(p * a ** 3)} + ${num(q * a ** 2)} ${-r * a >= 0 ? "+" : "−"} ${num(Math.abs(r * a))} + 5 = ${num(value)}.\nSo the remainder is ${num(value)}. There is no need to carry out the long division at all — reading k with the wrong sign is the only real risk here.`,
      },
      mr: {
        text: `${num(p)}x³ + ${num(q)}x² − ${num(r)}x + 5 या बहुपदीला (x ${sign} ${num(shown)}) ने भागल्यास किती बाकी उरेल?`,
        explanation: `शेष प्रमेयानुसार, f(x) या बहुपदीला (x − k) ने भागल्यास बाकी म्हणजे फक्त f(k).\nयेथे भाजक (x ${sign} ${num(shown)}) आहे, म्हणून k = ${num(a)}. चिन्ह उलटते हे लक्षात ठेवा: (x ${sign} ${num(shown)}) म्हणजे x = ${num(a)}.\nx = ${num(a)} ठेवा:\nf(${num(a)}) = ${num(p)}(${num(a)})³ + ${num(q)}(${num(a)})² − ${num(r)}(${num(a)}) + 5.\n= ${num(p * a ** 3)} + ${num(q * a ** 2)} ${-r * a >= 0 ? "+" : "−"} ${num(Math.abs(r * a))} + 5 = ${num(value)}.\nम्हणून बाकी ${num(value)} आहे. प्रत्यक्ष भागाकार करण्याची गरजच नाही — k चे चिन्ह चुकणे हाच येथील खरा धोका आहे.`,
      },
    };
  },
};

/* ------------------------------------------------------------------ *
 * 8. Geometric progression
 * ------------------------------------------------------------------ */
const geometricProgression = {
  id: "geometric-progression",
  difficulty: "hard",
  cases() {
    const out = [];
    for (const a of [2, 3, 4, 5, 6]) {
      for (const r of [2, 3]) {
        for (const n of [5, 6, 7, 8]) out.push({ a, r, n });
      }
    }
    return out;
  },
  make({ a, r, n }) {
    const term = a * r ** (n - 1);
    if (term > 100000) return null;
    const sum = (a * (r ** n - 1)) / (r - 1);

    const correct = num(term);
    const distractors = [num(a * r ** n), num(sum), num(a * r * n)];
    if (new Set([correct, ...distractors]).size !== 4) return null;

    return {
      correct,
      distractors,
      en: {
        text: `Find the ${num(n)}th term of the geometric progression ${num(a)}, ${num(a * r)}, ${num(a * r * r)}, ${num(a * r ** 3)}, ...`,
        explanation: `Identify the common ratio by dividing any term by the one before it: ${num(a * r)} ÷ ${num(a)} = ${num(r)}.\nThe nth term of a GP is aₙ = a × r^(n−1).\nHere a = ${num(a)}, r = ${num(r)} and n = ${num(n)}.\naₙ = ${num(a)} × ${num(r)}^(${num(n)} − 1) = ${num(a)} × ${num(r)}^${num(n - 1)} = ${num(a)} × ${num(r ** (n - 1))} = ${num(term)}.\nThe exponent is (n − 1), not n — the first term carries r⁰ = 1. Using r^n would give ${num(a * r ** n)}.\nFor comparison, the SUM of these ${num(n)} terms would be ${num(sum)}, which is a different question.`,
      },
      mr: {
        text: `${num(a)}, ${num(a * r)}, ${num(a * r * r)}, ${num(a * r ** 3)}, ... या भूमिती श्रेढीचे ${num(n)} वे पद काढा.`,
        explanation: `कोणतेही पद त्याच्या आधीच्या पदाने भागून सामाईक गुणोत्तर काढा: ${num(a * r)} ÷ ${num(a)} = ${num(r)}.\nभूमिती श्रेढीचे n वे पद = a × r^(n−1).\nयेथे a = ${num(a)}, r = ${num(r)} व n = ${num(n)}.\nn वे पद = ${num(a)} × ${num(r)}^(${num(n)} − 1) = ${num(a)} × ${num(r)}^${num(n - 1)} = ${num(a)} × ${num(r ** (n - 1))} = ${num(term)}.\nघातांक (n − 1) असतो, n नाही — पहिल्या पदाला r⁰ = 1 लागतो. r^n घेतल्यास ${num(a * r ** n)} असे चुकीचे उत्तर येते.\nतुलनेसाठी, या ${num(n)} पदांची बेरीज ${num(sum)} झाली असती, जो वेगळा प्रश्न आहे.`,
      },
    };
  },
};

export const topicId = "algebra";

export const archetypes = [
  linearSystem,
  quadraticRoots,
  ages,
  reciprocalIdentity,
  arithmeticProgression,
  sumProductIdentity,
  remainderTheorem,
  geometricProgression,
];
