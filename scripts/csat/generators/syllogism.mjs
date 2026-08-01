/**
 * Generator: Syllogism.
 *
 * Every question is checked by exhaustive model enumeration before it is
 * emitted: the verdict written into the explanation must match what the model
 * checker finds, so a mis-written template is dropped rather than shipped.
 *
 * Convention followed (the standard one in Indian competitive papers):
 *   All A are B      -> A is a subset of B
 *   No A is B        -> A and B share nothing
 *   Some A are B     -> A and B share at least one member
 *   Some A are not B -> at least one member of A lies outside B
 * Every named term is assumed to be non-empty.
 */

/* ------------------------------------------------------------------ *
 * Model checker
 * ------------------------------------------------------------------ */

// A model lists which of the seven non-empty membership regions exist.
// Bit 0 = in A, bit 1 = in B, bit 2 = in C.
const REGIONS = [1, 2, 3, 4, 5, 6, 7];

function holds(stmt, model) {
  const [kind, x, y] = stmt;
  const inX = (r) => (r & (1 << x)) !== 0;
  const inY = (r) => (r & (1 << y)) !== 0;
  switch (kind) {
    case "all":
      return model.every((r) => !inX(r) || inY(r));
    case "no":
      return model.every((r) => !(inX(r) && inY(r)));
    case "some":
      return model.some((r) => inX(r) && inY(r));
    case "someNot":
      return model.some((r) => inX(r) && !inY(r));
    default:
      throw new Error(`unknown statement kind ${kind}`);
  }
}

const MODELS = (() => {
  const out = [];
  for (let mask = 1; mask < 128; mask += 1) {
    const model = REGIONS.filter((_, i) => (mask & (1 << i)) !== 0);
    if (![0, 1, 2].every((term) => model.some((r) => (r & (1 << term)) !== 0))) continue;
    out.push(model);
  }
  return out;
})();

function entails(premises, conclusion) {
  let sawOne = false;
  for (const model of MODELS) {
    if (!premises.every((p) => holds(p, model))) continue;
    sawOne = true;
    if (!holds(conclusion, model)) return false;
  }
  if (!sawOne) throw new Error("the premises are contradictory");
  return true;
}

/* ------------------------------------------------------------------ *
 * Rendering
 * ------------------------------------------------------------------ */

const VERDICT = {
  I: "फक्त निष्कर्ष I / Only conclusion I follows",
  II: "फक्त निष्कर्ष II / Only conclusion II follows",
  BOTH: "दोन्ही निष्कर्ष / Both conclusions follow",
  NEITHER: "एकही निष्कर्ष नाही / Neither conclusion follows",
};
const VERDICT_ORDER = ["I", "II", "BOTH", "NEITHER"];

/** "a cat" / "an animal" — the reasoning reads badly without it. */
const a = (w) => (/^[aeiou]/i.test(w) ? `an ${w}` : `a ${w}`);
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function sentence(stmt, terms, lang) {
  const [kind, x, y] = stmt;
  const p = terms[x];
  const q = terms[y];
  if (lang === "en") {
    if (kind === "all") return `All ${p.pl} are ${q.pl}.`;
    if (kind === "no") return `No ${p.sg} is ${a(q.sg)}.`;
    if (kind === "some") return `Some ${p.pl} are ${q.pl}.`;
    return `Some ${p.pl} are not ${q.pl}.`;
  }
  if (kind === "all") return `सर्व ${p.mrPl} ${q.mrPl} आहेत.`;
  if (kind === "no") return `एकही ${p.mrSg} ${q.mrSg} नाही.`;
  if (kind === "some") return `काही ${p.mrPl} ${q.mrPl} आहेत.`;
  return `काही ${p.mrPl} ${q.mrPl} नाहीत.`;
}

/** One clause describing what a premise does to the sets. */
function restate(stmt, terms, lang) {
  const [kind, x, y] = stmt;
  const p = terms[x];
  const q = terms[y];
  if (lang === "en") {
    if (kind === "all") return `places the whole of ${p.pl} inside ${q.pl}`;
    if (kind === "no") return `keeps ${p.pl} and ${q.pl} completely apart`;
    if (kind === "some") return `guarantees only that ${p.pl} and ${q.pl} overlap somewhere`;
    return `guarantees at least one ${p.sg} lying outside ${q.pl}`;
  }
  if (kind === "all") return `सर्व ${p.mrPl} ${q.mrPl} या गटात येतात असे सांगते`;
  if (kind === "no") return `${p.mrPl} व ${q.mrPl} यांना पूर्णपणे वेगळे ठेवते`;
  if (kind === "some") return `फक्त एवढेच सांगते की ${p.mrPl} व ${q.mrPl} कुठेतरी एकमेकांत मिसळतात`;
  return `किमान एक ${p.mrSg} ${q.mrPl} या गटाबाहेर आहे एवढेच सांगते`;
}

/* ------------------------------------------------------------------ *
 * Term sets. Within a triple no singular may be a prefix of another
 * term, so the validator can pair singulars with plurals unambiguously.
 * ------------------------------------------------------------------ */

const TRIPLES = [
  [
    { pl: "pens", sg: "pen", mrPl: "पेन", mrSg: "पेन" },
    { pl: "erasers", sg: "eraser", mrPl: "खोडरबर", mrSg: "खोडरबर" },
    { pl: "books", sg: "book", mrPl: "पुस्तके", mrSg: "पुस्तक" },
  ],
  [
    { pl: "cats", sg: "cat", mrPl: "मांजरी", mrSg: "मांजर" },
    { pl: "animals", sg: "animal", mrPl: "प्राणी", mrSg: "प्राणी" },
    { pl: "dogs", sg: "dog", mrPl: "कुत्रे", mrSg: "कुत्रा" },
  ],
  [
    { pl: "roses", sg: "rose", mrPl: "गुलाब", mrSg: "गुलाब" },
    { pl: "flowers", sg: "flower", mrPl: "फुले", mrSg: "फूल" },
    { pl: "trees", sg: "tree", mrPl: "झाडे", mrSg: "झाड" },
  ],
  [
    { pl: "doctors", sg: "doctor", mrPl: "डॉक्टर", mrSg: "डॉक्टर" },
    { pl: "teachers", sg: "teacher", mrPl: "शिक्षक", mrSg: "शिक्षक" },
    { pl: "engineers", sg: "engineer", mrPl: "अभियंते", mrSg: "अभियंता" },
  ],
  [
    { pl: "cars", sg: "car", mrPl: "कार", mrSg: "कार" },
    { pl: "vehicles", sg: "vehicle", mrPl: "वाहने", mrSg: "वाहन" },
    { pl: "buses", sg: "bus", mrPl: "बस", mrSg: "बस" },
  ],
  [
    { pl: "sparrows", sg: "sparrow", mrPl: "चिमण्या", mrSg: "चिमणी" },
    { pl: "birds", sg: "bird", mrPl: "पक्षी", mrSg: "पक्षी" },
    { pl: "crows", sg: "crow", mrPl: "कावळे", mrSg: "कावळा" },
  ],
  [
    { pl: "mangoes", sg: "mango", mrPl: "आंबे", mrSg: "आंबा" },
    { pl: "fruits", sg: "fruit", mrPl: "फळे", mrSg: "फळ" },
    { pl: "apples", sg: "apple", mrPl: "सफरचंद", mrSg: "सफरचंद" },
  ],
  [
    { pl: "chairs", sg: "chair", mrPl: "खुर्च्या", mrSg: "खुर्ची" },
    { pl: "wooden objects", sg: "wooden object", mrPl: "लाकडी वस्तू", mrSg: "लाकडी वस्तू" },
    { pl: "tables", sg: "table", mrPl: "टेबल", mrSg: "टेबल" },
  ],
  [
    { pl: "students", sg: "student", mrPl: "विद्यार्थी", mrSg: "विद्यार्थी" },
    { pl: "players", sg: "player", mrPl: "खेळाडू", mrSg: "खेळाडू" },
    { pl: "singers", sg: "singer", mrPl: "गायक", mrSg: "गायक" },
  ],
  [
    { pl: "rings", sg: "ring", mrPl: "अंगठ्या", mrSg: "अंगठी" },
    { pl: "ornaments", sg: "ornament", mrPl: "दागिने", mrSg: "दागिना" },
    { pl: "chains", sg: "chain", mrPl: "साखळ्या", mrSg: "साखळी" },
  ],
];

const A = 0;
const B = 1;
const C = 2;

/* ------------------------------------------------------------------ *
 * Shapes: premises, conclusions, and the reasoning that goes with them
 * ------------------------------------------------------------------ */

const SHAPES = [
  {
    key: "chain-all",
    p: [["all", A, B], ["all", B, C]],
    c: [["all", A, C], ["some", C, A]],
    reasonI: {
      en: (t) => `Every ${t[A].sg} is inside ${t[B].pl}, and every ${t[B].sg} is inside ${t[C].pl}, so following the chain outward every ${t[A].sg} must land inside ${t[C].pl} as well. Conclusion I is certain.`,
      mr: (t) => `प्रत्येक ${t[A].mrSg} ${t[B].mrPl} या गटात आहे आणि प्रत्येक ${t[B].mrSg} ${t[C].mrPl} या गटात आहे, म्हणून साखळी पुढे नेल्यास प्रत्येक ${t[A].mrSg} ${t[C].mrPl} या गटातच येतो. निष्कर्ष I निश्चित आहे.`,
    },
    reasonII: {
      en: (t) => `Since ${t[A].pl} exist and all of them are ${t[C].pl}, there is definitely something that is both, so "Some ${t[C].pl} are ${t[A].pl}" is certain too.`,
      mr: (t) => `${t[A].mrPl} अस्तित्वात आहेत आणि ते सर्व ${t[C].mrPl} आहेत, म्हणून दोन्ही असलेली गोष्ट नक्कीच आहे; त्यामुळे "काही ${t[C].mrPl} ${t[A].mrPl} आहेत" हेही निश्चित आहे.`,
    },
    trap: {
      en: () => `The common slip is to reject conclusion II because the statements never mention that direction — but "all" always allows the weaker "some" to be read back.`,
      mr: () => `विधानांत ती दिशा आलेली नाही म्हणून निष्कर्ष II नाकारणे ही नेहमीची चूक आहे — "सर्व" वरून उलट दिशेने कमकुवत "काही" नेहमी काढता येते.`,
    },
  },
  {
    key: "all-no",
    p: [["all", A, B], ["no", B, C]],
    c: [["no", A, C], ["some", A, C]],
    reasonI: {
      en: (t) => `All ${t[A].pl} sit inside ${t[B].pl}, and ${t[B].pl} shares nothing with ${t[C].pl}, so no ${t[A].sg} can reach ${t[C].pl}. Conclusion I is certain.`,
      mr: (t) => `सर्व ${t[A].mrPl} ${t[B].mrPl} या गटात आहेत आणि ${t[B].mrPl} व ${t[C].mrPl} यांच्यात काहीही समान नाही, म्हणून कोणताही ${t[A].mrSg} ${t[C].mrPl} या गटापर्यंत पोहोचू शकत नाही. निष्कर्ष I निश्चित आहे.`,
    },
    reasonII: {
      en: () => `Conclusion II claims the exact opposite of what has just been proved, so it cannot follow.`,
      mr: () => `नुकत्याच सिद्ध झालेल्या गोष्टीच्या अगदी उलट दावा निष्कर्ष II करतो, म्हणून तो निघू शकत नाही.`,
    },
    trap: {
      en: () => `Two conclusions that contradict each other can never both follow — spotting such a pair saves time in the exam.`,
      mr: () => `परस्परविरोधी असलेले दोन निष्कर्ष कधीच दोन्ही निघू शकत नाहीत — अशी जोडी ओळखली की परीक्षेत वेळ वाचतो.`,
    },
  },
  {
    key: "some-all",
    p: [["some", A, B], ["all", B, C]],
    c: [["some", A, C], ["all", A, C]],
    reasonI: {
      en: (t) => `At least one thing is both ${a(t[A].sg)} and ${a(t[B].sg)}; being ${a(t[B].sg)} it is also ${a(t[C].sg)}, so that thing is ${a(t[A].sg)} and ${a(t[C].sg)} at once. Conclusion I is certain.`,
      mr: (t) => `किमान एक गोष्ट ${t[A].mrSg} आणि ${t[B].mrSg} अशी दोन्ही आहे; ती ${t[B].mrSg} असल्याने ${t[C].mrSg} सुद्धा आहे, म्हणून ती गोष्ट एकाच वेळी ${t[A].mrSg} व ${t[C].mrSg} ठरते. निष्कर्ष I निश्चित आहे.`,
    },
    reasonII: {
      en: (t) => `The overlap covers only part of ${t[A].pl}; the rest may lie completely outside ${t[C].pl}, so "All" is far too strong.`,
      mr: (t) => `हा छेद ${t[A].mrPl} च्या फक्त काही भागापुरता आहे; उरलेला भाग ${t[C].mrPl} च्या पूर्ण बाहेर असू शकतो, म्हणून "सर्व" हे विधान खूपच जास्त आहे.`,
    },
    trap: {
      en: () => `A "some" premise can never be stretched into an "all" conclusion, however natural the picture looks.`,
      mr: () => `चित्र कितीही स्वाभाविक वाटले तरी "काही" या विधानावरून "सर्व" असा निष्कर्ष कधीच काढता येत नाही.`,
    },
  },
  {
    key: "all-some-none",
    p: [["all", A, B], ["some", B, C]],
    c: [["some", A, C], ["no", A, C]],
    reasonI: {
      en: (t) => `The ${t[B].pl} that are ${t[C].pl} need not be the ones that are ${t[A].pl}; that overlap can sit entirely in the part of ${t[B].pl} lying outside ${t[A].pl}. So conclusion I is not certain.`,
      mr: (t) => `जे ${t[B].mrPl} ${t[C].mrPl} आहेत तेच ${t[A].mrPl} असतील असे नाही; तो छेद ${t[A].mrPl} या गटाबाहेरील ${t[B].mrPl} या गटाच्या भागात पूर्णपणे असू शकतो. म्हणून निष्कर्ष I निश्चित नाही.`,
    },
    reasonII: {
      en: (t) => `Equally, nothing forbids some ${t[A].pl} from also being ${t[C].pl}, so the flat denial in conclusion II is not certain either.`,
      mr: (t) => `त्याचप्रमाणे काही ${t[A].mrPl} हे ${t[C].mrPl} असण्यास कोणतीही आडकाठी नाही, म्हणून निष्कर्ष II मधील सरसकट नकारही निश्चित नाही.`,
    },
    trap: {
      en: () => `When both a possibility and its denial survive, the correct answer is that neither conclusion follows.`,
      mr: () => `जेव्हा एखादी शक्यता व तिचा नकार दोन्ही टिकतात, तेव्हा एकही निष्कर्ष निघत नाही हेच बरोबर उत्तर असते.`,
    },
  },
  {
    key: "no-allc",
    p: [["no", A, B], ["all", C, B]],
    c: [["no", A, C], ["someNot", C, A]],
    reasonI: {
      en: (t) => `All ${t[C].pl} live inside ${t[B].pl}, and ${t[A].pl} are shut out of ${t[B].pl} altogether, so ${t[A].pl} and ${t[C].pl} cannot meet. Conclusion I is certain.`,
      mr: (t) => `सर्व ${t[C].mrPl} ${t[B].mrPl} या गटात आहेत आणि ${t[A].mrPl} ${t[B].mrPl} या गटापासून पूर्णपणे बाहेर आहेत, म्हणून ${t[A].mrPl} व ${t[C].mrPl} कधीच भेटू शकत नाहीत. निष्कर्ष I निश्चित आहे.`,
    },
    reasonII: {
      en: (t) => `${cap(t[C].pl)} exist and none of them is ${a(t[A].sg)}, so at least one ${t[C].sg} is certainly not ${a(t[A].sg)}. Conclusion II is certain.`,
      mr: (t) => `${t[C].mrPl} अस्तित्वात आहेत आणि त्यांपैकी एकही ${t[A].mrSg} नाही, म्हणून किमान एक ${t[C].mrSg} हा ${t[A].mrSg} नाही हे निश्चित. निष्कर्ष II निश्चित आहे.`,
    },
    trap: {
      en: () => `"No X is Y" quietly guarantees "Some X are not Y" as long as X exists — that hidden step is what makes conclusion II safe.`,
      mr: () => `X अस्तित्वात असेल तर "एकही X हा Y नाही" यातून आपोआप "काही X हे Y नाहीत" मिळते — हीच लपलेली पायरी निष्कर्ष II ला सुरक्षित करते.`,
    },
  },
  {
    key: "somenot-all",
    p: [["someNot", A, B], ["all", B, C]],
    c: [["someNot", A, C], ["all", A, C]],
    reasonI: {
      en: (t) => `We know some ${t[A].sg} is outside ${t[B].pl}, but the set of ${t[C].pl} is larger and contains ${t[B].pl}, so that ${t[A].sg} may still fall inside ${t[C].pl}. Conclusion I is not certain.`,
      mr: (t) => `काही ${t[A].mrSg} ${t[B].mrPl} या गटाबाहेर आहे एवढेच माहीत आहे, पण ${t[C].mrPl} हा ${t[B].mrPl} या गटाला सामावणारा मोठा संच आहे, त्यामुळे तो ${t[A].mrSg} तरीही ${t[C].mrPl} या गटात असू शकतो. निष्कर्ष I निश्चित नाही.`,
    },
    reasonII: {
      en: (t) => `Nothing at all is said about where the remaining ${t[A].pl} sit, so a sweeping "All ${t[A].pl} are ${t[C].pl}" cannot be drawn either.`,
      mr: (t) => `उरलेले ${t[A].mrPl} कोठे आहेत याबद्दल काहीच सांगितलेले नाही, म्हणून "सर्व ${t[A].mrPl} ${t[C].mrPl} आहेत" असा व्यापक निष्कर्षही काढता येत नाही.`,
    },
    trap: {
      en: () => `Being outside the smaller set never proves you are outside the larger one that contains it.`,
      mr: () => `लहान संचाच्या बाहेर असणे म्हणजे त्याला सामावणाऱ्या मोठ्या संचाच्याही बाहेर असणे, असे कधीच सिद्ध होत नाही.`,
    },
  },
  {
    key: "two-alls-same-parent",
    p: [["all", A, B], ["all", C, B]],
    c: [["some", A, C], ["no", A, C]],
    reasonI: {
      en: (t) => `Both ${t[A].pl} and ${t[C].pl} sit inside ${t[B].pl}, but two groups inside the same larger group need not touch each other, so conclusion I is not certain.`,
      mr: (t) => `${t[A].mrPl} व ${t[C].mrPl} दोन्ही ${t[B].mrPl} या गटात आहेत, पण एकाच मोठ्या गटातील दोन उपगट एकमेकांना स्पर्श करतीलच असे नाही, म्हणून निष्कर्ष I निश्चित नाही.`,
    },
    reasonII: {
      en: () => `They may equally well overlap or even coincide, so the denial in conclusion II is not certain either.`,
      mr: () => `ते एकमेकांत मिसळू शकतात किंवा अगदी एकच असू शकतात, म्हणून निष्कर्ष II मधील नकारही निश्चित नाही.`,
    },
    trap: {
      en: () => `Sharing a parent set proves nothing about the two smaller sets — this shape is built to look like a link when there is none.`,
      mr: () => `एकच मोठा संच सामाईक असणे यावरून दोन लहान संचांबद्दल काहीही सिद्ध होत नाही — दुवा नसताना दुवा दिसावा अशी ही रचना असते.`,
    },
  },
  {
    key: "some-no",
    p: [["some", A, B], ["no", B, C]],
    c: [["someNot", A, C], ["no", A, C]],
    reasonI: {
      en: (t) => `Take the thing that is both ${a(t[A].sg)} and ${a(t[B].sg)}. Being ${a(t[B].sg)} it is barred from ${t[C].pl}, so it is ${a(t[A].sg)} that is not ${a(t[C].sg)}. Conclusion I is certain.`,
      mr: (t) => `${t[A].mrSg} व ${t[B].mrSg} दोन्ही असलेली गोष्ट घ्या. ती ${t[B].mrSg} असल्याने ${t[C].mrPl} या गटात येऊ शकत नाही, म्हणजे ती ${t[C].mrSg} नसलेली ${t[A].mrSg} आहे. निष्कर्ष I निश्चित आहे.`,
    },
    reasonII: {
      en: (t) => `The ${t[A].pl} lying outside ${t[B].pl} are unconstrained and could easily be ${t[C].pl}, so the blanket denial in conclusion II fails.`,
      mr: (t) => `${t[B].mrPl} या गटाबाहेरील ${t[A].mrPl} वर कोणतेही बंधन नाही व ते सहज ${t[C].mrPl} असू शकतात, म्हणून निष्कर्ष II मधील सरसकट नकार टिकत नाही.`,
    },
    trap: {
      en: () => `A guaranteed exception ("some are not") is a much weaker and therefore much safer claim than a total ban ("no").`,
      mr: () => `"काही नाहीत" हा खात्रीचा अपवाद "एकही नाही" या संपूर्ण बंदीपेक्षा कमकुवत आणि म्हणूनच अधिक सुरक्षित दावा असतो.`,
    },
  },
  {
    key: "no-some",
    p: [["no", A, B], ["some", B, C]],
    c: [["someNot", C, A], ["no", A, C]],
    reasonI: {
      en: (t) => `Some ${t[C].sg} is ${a(t[B].sg)}, and no ${t[B].sg} is ${a(t[A].sg)}, so that ${t[C].sg} is certainly not ${a(t[A].sg)}. Conclusion I is certain.`,
      mr: (t) => `काही ${t[C].mrSg} हा ${t[B].mrSg} आहे आणि एकही ${t[B].mrSg} ${t[A].mrSg} नाही, म्हणून तो ${t[C].mrSg} नक्कीच ${t[A].mrSg} नाही. निष्कर्ष I निश्चित आहे.`,
    },
    reasonII: {
      en: (t) => `The other ${t[C].pl}, the ones outside ${t[B].pl}, are free to be ${t[A].pl}, so the total ban in conclusion II is not certain.`,
      mr: (t) => `${t[B].mrPl} या गटाबाहेरील इतर ${t[C].mrPl} हे ${t[A].mrPl} असू शकतात, म्हणून निष्कर्ष II मधील संपूर्ण बंदी निश्चित नाही.`,
    },
    trap: {
      en: () => `Check which way round the conclusion is written; "Some ... are not" and "No ... is" are graded very differently.`,
      mr: () => `निष्कर्ष कोणत्या क्रमाने लिहिला आहे ते पाहा; "काही ... नाहीत" व "एकही ... नाही" यांचे मूल्यमापन खूप वेगळे होते.`,
    },
  },
  {
    key: "chain-all-converse",
    p: [["all", A, B], ["all", B, C]],
    c: [["some", C, A], ["all", C, A]],
    reasonI: {
      en: (t) => `Every ${t[A].sg} ends up inside ${t[C].pl}, and ${t[A].pl} exist, so there is certainly ${a(t[C].sg)} that is ${a(t[A].sg)}. Conclusion I is certain.`,
      mr: (t) => `प्रत्येक ${t[A].mrSg} शेवटी ${t[C].mrPl} या गटात येतो आणि ${t[A].mrPl} अस्तित्वात आहेत, म्हणून ${t[A].mrSg} असलेला ${t[C].mrSg} नक्कीच आहे. निष्कर्ष I निश्चित आहे.`,
    },
    reasonII: {
      en: (t) => `The set of ${t[C].pl} is the outermost one here and may be far bigger than ${t[A].pl}, so "All ${t[C].pl} are ${t[A].pl}" reverses the chain and does not follow.`,
      mr: (t) => `येथे ${t[C].mrPl} हा सर्वात बाहेरचा संच असून तो ${t[A].mrPl} पेक्षा कितीतरी मोठा असू शकतो, म्हणून "सर्व ${t[C].mrPl} ${t[A].mrPl} आहेत" हे साखळी उलटी करते व निघत नाही.`,
    },
    trap: {
      en: () => `An "all" statement runs in one direction only; reversing it is the single most common syllogism error.`,
      mr: () => `"सर्व" हे विधान एकाच दिशेने चालते; ते उलटे करणे ही न्यायवाक्यातील सर्वात नेहमीची चूक आहे.`,
    },
  },
  {
    key: "some-some",
    p: [["some", A, B], ["some", B, C]],
    c: [["some", A, C], ["no", A, C]],
    reasonI: {
      en: (t) => `Two separate overlaps need not share a member: the ${t[B].pl} that are ${t[A].pl} can be completely different ${t[B].pl} from the ones that are ${t[C].pl}. Conclusion I is not certain.`,
      mr: (t) => `दोन वेगवेगळ्या छेदांत एकच घटक असेलच असे नाही: ${t[A].mrPl} असलेले ${t[B].mrPl} आणि ${t[C].mrPl} असलेले ${t[B].mrPl} हे पूर्णपणे वेगळे असू शकतात. निष्कर्ष I निश्चित नाही.`,
    },
    reasonII: {
      en: (t) => `But they could also be the very same ${t[B].pl}, which would make some ${t[A].pl} ${t[C].pl}, so conclusion II is not certain either.`,
      mr: (t) => `पण ते तेच ${t[B].mrPl} असूही शकतात, आणि मग काही ${t[A].mrPl} हे ${t[C].mrPl} ठरतील, म्हणून निष्कर्ष II सुद्धा निश्चित नाही.`,
    },
    trap: {
      en: () => `"Some + some" never produces a definite conclusion; the two overlaps simply cannot be forced to meet.`,
      mr: () => `"काही + काही" यातून कधीच निश्चित निष्कर्ष निघत नाही; दोन छेदांना भेटायला भाग पाडता येत नाही.`,
    },
  },
  {
    key: "no-no",
    p: [["no", A, B], ["no", B, C]],
    c: [["no", A, C], ["some", A, C]],
    reasonI: {
      en: (t) => `Both statements only say what ${t[B].pl} are kept away from; they say nothing about how ${t[A].pl} and ${t[C].pl} sit relative to each other, so conclusion I is not certain.`,
      mr: (t) => `दोन्ही विधाने फक्त ${t[B].mrPl} या गटापासून कोण दूर आहे एवढेच सांगतात; ${t[A].mrPl} व ${t[C].mrPl} यांचा परस्परसंबंध काहीच सांगत नाहीत, म्हणून निष्कर्ष I निश्चित नाही.`,
    },
    reasonII: {
      en: () => `They may overlap, but they need not, so conclusion II is not certain either.`,
      mr: () => `ते एकमेकांत मिसळू शकतात, पण मिसळतीलच असे नाही, म्हणून निष्कर्ष II सुद्धा निश्चित नाही.`,
    },
    trap: {
      en: () => `Two negative premises never combine into a conclusion — when both statements are negative, the answer is almost always that nothing follows.`,
      mr: () => `दोन नकारार्थी विधानांतून कधीच निष्कर्ष निघत नाही — दोन्ही विधाने नकारार्थी असतील तर बहुतेक वेळा काहीच निघत नाही.`,
    },
  },
  {
    key: "shared-child",
    p: [["all", B, A], ["all", B, C]],
    c: [["some", A, C], ["some", C, A]],
    reasonI: {
      en: (t) => `Every ${t[B].sg} is both ${a(t[A].sg)} and ${a(t[C].sg)}, and ${t[B].pl} exist, so ${t[A].pl} and ${t[C].pl} certainly share those members. Conclusion I is certain.`,
      mr: (t) => `प्रत्येक ${t[B].mrSg} हा ${t[A].mrSg} व ${t[C].mrSg} दोन्ही आहे आणि ${t[B].mrPl} अस्तित्वात आहेत, म्हणून ${t[A].mrPl} व ${t[C].mrPl} यांच्यात ते घटक नक्कीच सामाईक आहेत. निष्कर्ष I निश्चित आहे.`,
    },
    reasonII: {
      en: () => `"Some" reads the same way in both directions, so conclusion II is certain for exactly the same reason.`,
      mr: () => `"काही" हे दोन्ही दिशांनी सारखेच चालते, म्हणून त्याच कारणाने निष्कर्ष II सुद्धा निश्चित आहे.`,
    },
    trap: {
      en: () => `Here the middle term is the smaller set inside both others, and that is exactly the arrangement which does force an overlap.`,
      mr: () => `येथे मधला पद दोन्ही संचांच्या आत असलेला लहान संच आहे, आणि नेमकी हीच रचना छेद घडवून आणते.`,
    },
  },
  {
    key: "all-somenot",
    p: [["all", A, B], ["someNot", C, B]],
    c: [["someNot", C, A], ["all", C, A]],
    reasonI: {
      en: (t) => `Some ${t[C].sg} lies outside ${t[B].pl}. Since every ${t[A].sg} lies inside ${t[B].pl}, that ${t[C].sg} cannot be ${a(t[A].sg)}. Conclusion I is certain.`,
      mr: (t) => `काही ${t[C].mrSg} ${t[B].mrPl} या गटाबाहेर आहे. प्रत्येक ${t[A].mrSg} ${t[B].mrPl} या गटात असल्याने तो ${t[C].mrSg} ${t[A].mrSg} असू शकत नाही. निष्कर्ष I निश्चित आहे.`,
    },
    reasonII: {
      en: (t) => `That same ${t[C].sg} is not ${a(t[A].sg)}, which directly refutes "All ${t[C].pl} are ${t[A].pl}".`,
      mr: (t) => `तोच ${t[C].mrSg} ${t[A].mrSg} नाही, त्यामुळे "सर्व ${t[C].mrPl} ${t[A].mrPl} आहेत" हे थेट खोटे ठरते.`,
    },
    trap: {
      en: () => `Being outside the bigger set is enough to be outside every set contained in it — that is the whole of this question.`,
      mr: () => `मोठ्या संचाच्या बाहेर असणे म्हणजे त्यात सामावलेल्या प्रत्येक संचाच्याही बाहेर असणे — या प्रश्नाचा गाभा एवढाच आहे.`,
    },
  },
  {
    key: "someb-all",
    p: [["some", B, A], ["all", B, C]],
    c: [["some", A, C], ["some", C, A]],
    reasonI: {
      en: (t) => `Some ${t[B].sg} is ${a(t[A].sg)}, and every ${t[B].sg} is ${a(t[C].sg)}, so that same thing is ${a(t[A].sg)} and ${a(t[C].sg)} at once. Conclusion I is certain.`,
      mr: (t) => `काही ${t[B].mrSg} हा ${t[A].mrSg} आहे आणि प्रत्येक ${t[B].mrSg} ${t[C].mrSg} आहे, म्हणून तीच गोष्ट एकाच वेळी ${t[A].mrSg} व ${t[C].mrSg} आहे. निष्कर्ष I निश्चित आहे.`,
    },
    reasonII: {
      en: () => `The same shared member proves conclusion II, since "some" can be read from either end.`,
      mr: () => `तोच सामाईक घटक निष्कर्ष II सुद्धा सिद्ध करतो, कारण "काही" कोणत्याही टोकापासून वाचता येते.`,
    },
    trap: {
      en: (t) => `Notice that the common term ${t[B].pl} is the subject of both statements, which is what lets the link go through.`,
      mr: (t) => `${t[B].mrPl} हा दोन्ही विधानांचा कर्ता आहे हे लक्षात घ्या, त्यामुळेच दुवा जुळतो.`,
    },
  },
  {
    key: "all-noc",
    p: [["all", A, B], ["no", C, B]],
    c: [["no", C, A], ["someNot", A, C]],
    reasonI: {
      en: (t) => `${cap(t[C].pl)} are shut out of ${t[B].pl}, and all ${t[A].pl} are inside ${t[B].pl}, so no ${t[C].sg} can be ${a(t[A].sg)}. Conclusion I is certain.`,
      mr: (t) => `${t[C].mrPl} ${t[B].mrPl} या गटापासून पूर्ण बाहेर आहेत आणि सर्व ${t[A].mrPl} ${t[B].mrPl} या गटात आहेत, म्हणून कोणताही ${t[C].mrSg} ${t[A].mrSg} असू शकत नाही. निष्कर्ष I निश्चित आहे.`,
    },
    reasonII: {
      en: (t) => `${cap(t[A].pl)} exist and none of them is ${a(t[C].sg)}, so at least one ${t[A].sg} is certainly not ${a(t[C].sg)}. Conclusion II is certain.`,
      mr: (t) => `${t[A].mrPl} अस्तित्वात आहेत आणि त्यांपैकी एकही ${t[C].mrSg} नाही, म्हणून किमान एक ${t[A].mrSg} ${t[C].mrSg} नाही हे निश्चित. निष्कर्ष II निश्चित आहे.`,
    },
    trap: {
      en: () => `Once a total separation is proved, both the "no" form and the weaker "some are not" form become safe.`,
      mr: () => `संपूर्ण वेगळेपणा सिद्ध झाला की "एकही नाही" आणि त्याहून कमकुवत "काही नाहीत" ही दोन्ही रूपे सुरक्षित होतात.`,
    },
  },
  {
    key: "all-no-reversed",
    p: [["all", A, B], ["no", B, C]],
    c: [["some", A, C], ["no", A, C]],
    reasonI: {
      en: (t) => `Conclusion I asserts an overlap that the second statement forbids, because everything in ${t[A].pl} is inside ${t[B].pl}. It does not follow.`,
      mr: (t) => `निष्कर्ष I छेद असल्याचा दावा करतो, पण दुसरे विधान तो नाकारते, कारण ${t[A].mrPl} या गटातील सर्व काही ${t[B].mrPl} या गटात आहे. तो निघत नाही.`,
    },
    reasonII: {
      en: (t) => `All ${t[A].pl} sit inside ${t[B].pl} and ${t[B].pl} touches no ${t[C].sg}, so no ${t[A].sg} can be ${a(t[C].sg)}. Conclusion II is certain.`,
      mr: (t) => `सर्व ${t[A].mrPl} ${t[B].mrPl} या गटात आहेत व ${t[B].mrPl} या गटाचा कोणत्याही ${t[C].mrSg} शी संबंध नाही, म्हणून कोणताही ${t[A].mrSg} ${t[C].mrSg} असू शकत नाही. निष्कर्ष II निश्चित आहे.`,
    },
    trap: {
      en: () => `Always test both conclusions before answering; here the true one is deliberately placed second.`,
      mr: () => `उत्तर देण्यापूर्वी दोन्ही निष्कर्ष तपासा; येथे खरा निष्कर्ष मुद्दाम दुसऱ्या क्रमांकावर ठेवला आहे.`,
    },
  },
  {
    key: "some-all-reversed",
    p: [["some", A, B], ["all", B, C]],
    c: [["all", A, C], ["some", A, C]],
    reasonI: {
      en: (t) => `Only part of ${t[A].pl} is known to touch ${t[B].pl}; the rest may sit outside ${t[C].pl} entirely, so "All" does not follow.`,
      mr: (t) => `${t[A].mrPl} चा फक्त काही भाग ${t[B].mrPl} ला स्पर्श करतो एवढेच माहीत आहे; उरलेला भाग ${t[C].mrPl} च्या पूर्ण बाहेर असू शकतो, म्हणून "सर्व" निघत नाही.`,
    },
    reasonII: {
      en: (t) => `The shared member is ${a(t[B].sg)}, hence also ${a(t[C].sg)}, so some ${t[A].sg} is definitely ${a(t[C].sg)}. Conclusion II is certain.`,
      mr: (t) => `सामाईक घटक ${t[B].mrSg} आहे, म्हणून तो ${t[C].mrSg} सुद्धा आहे, त्यामुळे काही ${t[A].mrSg} नक्कीच ${t[C].mrSg} आहे. निष्कर्ष II निश्चित आहे.`,
    },
    trap: {
      en: () => `Between the "all" and the "some" version of the same idea, only the weaker one survives a "some" premise.`,
      mr: () => `एकाच कल्पनेच्या "सर्व" व "काही" या रूपांपैकी "काही" या विधानावरून फक्त कमकुवत रूपच टिकते.`,
    },
  },
  {
    key: "no-allc-reversed",
    p: [["no", A, B], ["all", C, B]],
    c: [["some", A, C], ["no", A, C]],
    reasonI: {
      en: (t) => `An overlap is impossible: ${t[C].pl} live inside ${t[B].pl} and ${t[A].pl} are excluded from ${t[B].pl}. Conclusion I does not follow.`,
      mr: (t) => `छेद अशक्य आहे: ${t[C].mrPl} ${t[B].mrPl} या गटात आहेत व ${t[A].mrPl} ${t[B].mrPl} या गटातून वगळलेले आहेत. निष्कर्ष I निघत नाही.`,
    },
    reasonII: {
      en: () => `That same exclusion proves the separation outright, so conclusion II is certain.`,
      mr: () => `तेच वगळणे थेट संपूर्ण वेगळेपणा सिद्ध करते, म्हणून निष्कर्ष II निश्चित आहे.`,
    },
    trap: {
      en: () => `Draw the smaller set inside the bigger one first; the answer usually becomes visible before any rule is applied.`,
      mr: () => `प्रथम लहान संच मोठ्या संचाच्या आत काढा; कोणताही नियम लावण्यापूर्वीच उत्तर बहुधा दिसू लागते.`,
    },
  },
  {
    key: "all-somenot-reversed",
    p: [["all", A, B], ["someNot", C, B]],
    c: [["all", C, A], ["someNot", C, A]],
    reasonI: {
      en: (t) => `At least one ${t[C].sg} is outside ${t[B].pl} and therefore outside ${t[A].pl}, which kills the claim that all ${t[C].pl} are ${t[A].pl}.`,
      mr: (t) => `किमान एक ${t[C].mrSg} ${t[B].mrPl} या गटाबाहेर आणि म्हणून ${t[A].mrPl} या गटाच्याही बाहेर आहे, त्यामुळे सर्व ${t[C].mrPl} ${t[A].mrPl} आहेत हा दावा टिकत नाही.`,
    },
    reasonII: {
      en: (t) => `That same ${t[C].sg} is a guaranteed exception, so "Some ${t[C].pl} are not ${t[A].pl}" is certain.`,
      mr: (t) => `तोच ${t[C].mrSg} खात्रीचा अपवाद आहे, म्हणून "काही ${t[C].mrPl} ${t[A].mrPl} नाहीत" हे निश्चित आहे.`,
    },
    trap: {
      en: () => `One counterexample destroys an "all" claim and at the same time establishes a "some are not" claim.`,
      mr: () => `एकच प्रतिउदाहरण "सर्व" चा दावा मोडते आणि त्याच वेळी "काही नाहीत" हा दावा सिद्ध करते.`,
    },
  },
];

function verdictFor(followsI, followsII) {
  if (followsI && followsII) return "BOTH";
  if (followsI) return "I";
  if (followsII) return "II";
  return "NEITHER";
}

const VERDICT_LINE_EN = {
  I: "Only conclusion I follows.",
  II: "Only conclusion II follows.",
  BOTH: "Both conclusions follow.",
  NEITHER: "Neither conclusion follows.",
};
const VERDICT_LINE_MR = {
  I: "म्हणून फक्त निष्कर्ष I निघतो.",
  II: "म्हणून फक्त निष्कर्ष II निघतो.",
  BOTH: "म्हणून दोन्ही निष्कर्ष निघतात.",
  NEITHER: "म्हणून एकही निष्कर्ष नाही, असे उत्तर येते.",
};

function makeArchetype(shape, difficulty) {
  return {
    id: `syllogism-${shape.key}`,
    difficulty,
    cases() {
      return TRIPLES.map((_, i) => ({ triple: i }));
    },
    make({ triple }) {
      const t = TRIPLES[triple];
      const key = verdictFor(entails(shape.p, shape.c[0]), entails(shape.p, shape.c[1]));
      const correct = VERDICT[key];
      const distractors = VERDICT_ORDER.filter((k) => k !== key).map((k) => VERDICT[k]);

      const en = (s) => sentence(s, t, "en");
      const mr = (s) => sentence(s, t, "mr");

      return {
        correct,
        distractors,
        en: {
          text: `Statements: (1) ${en(shape.p[0])} (2) ${en(shape.p[1])}\nConclusions: (I) ${en(shape.c[0])} (II) ${en(shape.c[1])}\nWhich of the conclusions follows from the statements?`,
          explanation: `Take the statements as true even where they clash with real life, and ask only what they force to be true.\nStatement 1 ${restate(shape.p[0], t, "en")}, and statement 2 ${restate(shape.p[1], t, "en")}.\n${shape.reasonI.en(t)}\n${shape.reasonII.en(t)}\n${VERDICT_LINE_EN[key]}\n${shape.trap.en(t)}`,
        },
        mr: {
          text: `विधाने: (1) ${mr(shape.p[0])} (2) ${mr(shape.p[1])}\nनिष्कर्ष: (I) ${mr(shape.c[0])} (II) ${mr(shape.c[1])}\nविधानांवरून कोणता निष्कर्ष निघतो?`,
          explanation: `विधाने वास्तवाशी जुळत नसली तरी ती खरी मानून चाला आणि त्यांतून काय अपरिहार्यपणे सिद्ध होते तेवढेच पाहा.\nविधान 1 ${restate(shape.p[0], t, "mr")}, तर विधान 2 ${restate(shape.p[1], t, "mr")}.\n${shape.reasonI.mr(t)}\n${shape.reasonII.mr(t)}\n${VERDICT_LINE_MR[key]}\n${shape.trap.mr(t)}`,
        },
      };
    },
  };
}

export const topicId = "syllogism";

export const archetypes = SHAPES.map((s, i) =>
  makeArchetype(s, i % 3 === 0 ? "moderate" : "hard"),
);
