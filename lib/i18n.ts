/**
 * UI localization for the Marathi / English language toggle.
 * Internal keys (categories, topic tags) stay English; only display strings switch.
 */
import type { Category, Language } from "./types";
import { CATEGORIES } from "./types";

const DEVANAGARI = /[\u0900-\u097F]/;

export const CATEGORY_LABELS: Record<Category, { en: string; mr: string }> = {
  "Indian Polity": { en: "Indian Polity", mr: "भारतीय राज्यव्यवस्था" },
  History: { en: "History", mr: "इतिहास" },
  Geography: { en: "Geography", mr: "भूगोल" },
  Science: { en: "Science", mr: "विज्ञान" },
  "Current Affairs": { en: "Current Affairs", mr: "चालू घडामोडी" },
  Economics: { en: "Economics", mr: "अर्थशास्त्र" },
  Aptitude: { en: "Aptitude", mr: "बुद्धिमत्ता चाचणी" },
  English: { en: "English", mr: "इंग्रजी" },
  Marathi: { en: "Marathi", mr: "मराठी" },
  Environment: { en: "Environment", mr: "पर्यावरण" },
};

/** Common PYQ / catalog topic display names (English storage key → labels). */
export const TOPIC_LABELS: Record<string, { en: string; mr: string }> = {
  "Acid, Base and Salt": { en: "Acid, Base and Salt", mr: "आम्ल, आम्लधर्मी आणि क्षार" },
  "Acids, Bases & Salts": { en: "Acids, Bases & Salts", mr: "आम्ल, आम्लधर्मी आणि क्षार" },
  "Agriculture & Soils": { en: "Agriculture & Soils", mr: "कृषी आणि मृदा" },
  "Agriculture Economy": { en: "Agriculture Economy", mr: "कृषी अर्थव्यवस्था" },
  "Algebra & Equations": { en: "Algebra & Equations", mr: "बीजगणित आणि समीकरणे" },
  "Analogy & Classification": { en: "Analogy & Classification", mr: "साधर्म्य आणि वर्गीकरण" },
  "Ancient India": { en: "Ancient India", mr: "प्राचीन भारत" },
  "Art, Literature & Culture": { en: "Art, Literature & Culture", mr: "कला, साहित्य आणि संस्कृती" },
  "Atom and its Structure": { en: "Atom and its Structure", mr: "अणू आणि अणूची रचना" },
  "Atomic Structure & Periodic Table": { en: "Atomic Structure & Periodic Table", mr: "अणुसंरचना आणि आवर्त सारणी" },
  "Awards & Honours": { en: "Awards & Honours", mr: "पुरस्कार आणि सन्मान" },
  "Biodiversity & Conservation": { en: "Biodiversity & Conservation", mr: "जैवविविधता आणि संवर्धन" },
  "Blood Relations": { en: "Blood Relations", mr: "रक्तसंबंध" },
  "Botany (Plant Biology)": { en: "Botany (Plant Biology)", mr: "वनस्पतीशास्त्र" },
  "British Expansion & Governors-General": { en: "British Expansion & Governors-General", mr: "ब्रिटिश विस्तार आणि गव्हर्नर-जनरल" },
  "Cell Biology & Genetics": { en: "Cell Biology & Genetics", mr: "पेशीविज्ञान आणि अनुवंशशास्त्र" },
  "Centre-State Relations": { en: "Centre-State Relations", mr: "केंद्र-राज्य संबंध" },
  "Chemical Bonding & Reactions": { en: "Chemical Bonding & Reactions", mr: "रासायनिक बंध आणि अभिक्रिया" },
  "Climate Change & Global Warming": { en: "Climate Change & Global Warming", mr: "हवामान बदल आणि जागतिक तापमानवृद्धी" },
  Climatology: { en: "Climatology", mr: "हवामानशास्त्र" },
  "Clocks & Calendars": { en: "Clocks & Calendars", mr: "घड्याळे आणि दिनदर्शिका" },
  "Coding-Decoding": { en: "Coding-Decoding", mr: "कोडिंग-डिकोडिंग" },
  "Concept of Matter and Chemical Classification": {
    en: "Concept of Matter and Chemical Classification",
    mr: "द्रव्याची संकल्पना आणि रासायनिक वर्गीकरण",
  },
  "Constitutional & Statutory Bodies": { en: "Constitutional & Statutory Bodies", mr: "संवैधानिक आणि वैधानिक संस्था" },
  "Constitutional Amendments": { en: "Constitutional Amendments", mr: "संविधान दुरुस्त्या" },
  "Constitutional Development (British Acts)": {
    en: "Constitutional Development (British Acts)",
    mr: "संवैधानिक विकास (ब्रिटिश कायदे)",
  },
  "Constitutional Framework & Preamble": { en: "Constitutional Framework & Preamble", mr: "संवैधानिक चौकट आणि प्रस्तावना" },
  "DPSP & Fundamental Duties": { en: "DPSP & Fundamental Duties", mr: "DPSP आणि मूलभूत कर्तव्ये" },
  "Data Interpretation": { en: "Data Interpretation", mr: "आकडेवारीचे विश्लेषण" },
  "Defence & Security": { en: "Defence & Security", mr: "संरक्षण आणि सुरक्षा" },
  "Direction Sense": { en: "Direction Sense", mr: "दिशाज्ञान" },
  "Diseases & Health": { en: "Diseases & Health", mr: "रोग आणि आरोग्य" },
  "Ecology & Ecosystems": { en: "Ecology & Ecosystems", mr: "परिस्थितिकी आणि परिसंस्था" },
  "Economic Planning & Five Year Plans": { en: "Economic Planning & Five Year Plans", mr: "आर्थिक नियोजन आणि पंचवार्षिक योजना" },
  "Elections & Representation": { en: "Elections & Representation", mr: "निवडणुका आणि प्रतिनिधित्व" },
  Electricity: { en: "Electricity", mr: "विद्युत" },
  "Electricity & Magnetism": { en: "Electricity & Magnetism", mr: "विद्युत आणि चुंबकत्व" },
  "Electricity Numerical Worksheet": { en: "Electricity Numerical Worksheet", mr: "विद्युत संख्यात्मक सराव" },
  "Environmental Laws & Conventions": { en: "Environmental Laws & Conventions", mr: "पर्यावरण कायदे आणि आंतरराष्ट्रीय करार" },
  "Fundamental Rights": { en: "Fundamental Rights", mr: "मूलभूत अधिकार" },
  "GK 2025-26 Marathon": { en: "GK 2025-26 Marathon", mr: "GK २०२५-२६ मॅरेथॉन" },
  "Gandhian Mass Movements": { en: "Gandhian Mass Movements", mr: "गांधीवादी जनआंदोलने" },
  "Geomorphology & Physical Geography": { en: "Geomorphology & Physical Geography", mr: "भूआकृतिशास्त्र आणि भौतिक भूगोल" },
  "Government Schemes & Yojanas": { en: "Government Schemes & Yojanas", mr: "शासकीय योजना" },
  Grammar: { en: "Grammar", mr: "व्याकरण" },
  "Growth, Inflation & Indicators": { en: "Growth, Inflation & Indicators", mr: "वृद्धी, महागाई आणि निर्देशक" },
  "Heat & Thermodynamics": { en: "Heat & Thermodynamics", mr: "उष्णता आणि ऊष्मागतिकी" },
  "Home Rule Movement": { en: "Home Rule Movement", mr: "होमरूल आंदोलन" },
  "Human Physiology": { en: "Human Physiology", mr: "मानवी शरीरक्रियाशास्त्र" },
  "Idioms & Phrases": { en: "Idioms & Phrases", mr: "म्हणी आणि वाक्प्रचार" },
  "India Defence Exercises": { en: "India Defence Exercises", mr: "भारताचे संरक्षण सराव" },
  "Indian Physical Geography": { en: "Indian Physical Geography", mr: "भारताचा भौतिक भूगोल" },
  "Indian Rivers & Drainage": { en: "Indian Rivers & Drainage", mr: "भारतीय नद्या आणि अपवाह" },
  "Industry, Trade & Reforms": { en: "Industry, Trade & Reforms", mr: "उद्योग, व्यापार आणि सुधारणा" },
  "International Affairs & Summits": { en: "International Affairs & Summits", mr: "आंतरराष्ट्रीय व्यवहार आणि शिखर परिषदा" },
  Judiciary: { en: "Judiciary", mr: "न्यायव्यवस्था" },
  Light: { en: "Light", mr: "प्रकाश" },
  "Magnetism and Electromagnetic Spectrum": {
    en: "Magnetism and Electromagnetic Spectrum",
    mr: "चुंबकत्व आणि विद्युतचुंबकीय वर्णपट",
  },
  "Maharashtra Districts & Administration": {
    en: "Maharashtra Districts & Administration",
    mr: "महाराष्ट्राचे जिल्हे आणि प्रशासन",
  },
  "Maharashtra Physical Geography": { en: "Maharashtra Physical Geography", mr: "महाराष्ट्राचा भौतिक भूगोल" },
  "Maharashtra Rivers & Dams": { en: "Maharashtra Rivers & Dams", mr: "महाराष्ट्राच्या नद्या आणि धरणे" },
  "Maharashtra Social Reformers": { en: "Maharashtra Social Reformers", mr: "महाराष्ट्राचे सामाजिक सुधारक" },
  "Maharashtra in Freedom Struggle": { en: "Maharashtra in Freedom Struggle", mr: "स्वातंत्र्य संग्रामातील महाराष्ट्र" },
  "Maratha Empire": { en: "Maratha Empire", mr: "मराठा साम्राज्य" },
  "Mechanics & Motion": { en: "Mechanics & Motion", mr: "यांत्रिकी आणि गती" },
  "Medieval India": { en: "Medieval India", mr: "मध्ययुगीन भारत" },
  "Mensuration & Geometry": { en: "Mensuration & Geometry", mr: "क्षेत्रमिती आणि भूमिती" },
  "Metals & Materials": { en: "Metals & Materials", mr: "धातू आणि पदार्थ" },
  "Minerals & Industries": { en: "Minerals & Industries", mr: "खनिजे आणि उद्योग" },
  "Modern & Nuclear Physics": { en: "Modern & Nuclear Physics", mr: "आधुनिक आणि अणुभौतिकी" },
  "Money & Banking": { en: "Money & Banking", mr: "पैसा आणि बँकिंग" },
  "National Appointments & Reports": { en: "National Appointments & Reports", mr: "राष्ट्रीय नियुक्त्या आणि अहवाल" },
  "National Income": { en: "National Income", mr: "राष्ट्रीय उत्पन्न" },
  "Number & Letter Series": { en: "Number & Letter Series", mr: "संख्या आणि अक्षर मालिका" },
  "Number System & Simplification": { en: "Number System & Simplification", mr: "संख्या पद्धती आणि सरलीकरण" },
  Nutrition: { en: "Nutrition", mr: "पोषण" },
  Oceanography: { en: "Oceanography", mr: "समुद्रशास्त्र" },
  "Optics & Sound": { en: "Optics & Sound", mr: "प्रकाशशास्त्र आणि ध्वनी" },
  "Organic Chemistry": { en: "Organic Chemistry", mr: "सेंद्रिय रसायनशास्त्र" },
  Other: { en: "Other", mr: "इतर" },
  "Panchayati Raj": { en: "Panchayati Raj", mr: "पंचायती राज" },
  Parliament: { en: "Parliament", mr: "संसद" },
  "Percentage, Profit & Loss": { en: "Percentage, Profit & Loss", mr: "टक्केवारी, नफा आणि तोटा" },
  "Persons in News & Books": { en: "Persons in News & Books", mr: "बातम्यांतील व्यक्ती आणि पुस्तके" },
  Pollution: { en: "Pollution", mr: "प्रदूषण" },
  "Population & Census": { en: "Population & Census", mr: "लोकसंख्या आणि जनगणना" },
  "Population & Demography": { en: "Population & Demography", mr: "लोकसंख्या आणि लोकसंख्याशास्त्र" },
  "Post-Independence India": { en: "Post-Independence India", mr: "स्वातंत्र्योत्तर भारत" },
  "Poverty & Unemployment": { en: "Poverty & Unemployment", mr: "दारिद्र्य आणि बेरोजगारी" },
  "Probability & Statistics": { en: "Probability & Statistics", mr: "संभाव्यता आणि सांख्यिकी" },
  "Public Finance & Budget": { en: "Public Finance & Budget", mr: "सार्वजनिक वित्त आणि अर्थसंकल्प" },
  Puzzles: { en: "Puzzles", mr: "कोडी" },
  "Ranking & Ordering": { en: "Ranking & Ordering", mr: "स्थानक्रम आणि क्रमवारी" },
  "Ratio, Proportion & Averages": { en: "Ratio, Proportion & Averages", mr: "गुणोत्तर, प्रमाण आणि सरासरी" },
  "Reading Comprehension": { en: "Reading Comprehension", mr: "उतारा वाचन" },
  "Renewable Energy": { en: "Renewable Energy", mr: "नवीकरणीय ऊर्जा" },
  "Revolt of 1857": { en: "Revolt of 1857", mr: "१८५७ चा उठाव" },
  "Revolutionary Movement": { en: "Revolutionary Movement", mr: "क्रांतिकारी आंदोलन" },
  "Rise of Nationalism & INC": { en: "Rise of Nationalism & INC", mr: "राष्ट्रवादाचा उदय आणि काँग्रेस" },
  "Science & Technology (IT/Space)": { en: "Science & Technology (IT/Space)", mr: "विज्ञान आणि तंत्रज्ञान (IT/अंतरिक्ष)" },
  "Sentence Correction & Usage": { en: "Sentence Correction & Usage", mr: "वाक्यशुद्धी आणि वापर" },
  "Simple & Compound Interest": { en: "Simple & Compound Interest", mr: "सरळ व्याज आणि चक्रवाढ व्याज" },
  "Socio-Religious Reform Movements": { en: "Socio-Religious Reform Movements", mr: "सामाजिक-धार्मिक सुधारणा चळवळी" },
  "Sound Numerical": { en: "Sound Numerical", mr: "ध्वनी संख्यात्मक" },
  Sports: { en: "Sports", mr: "क्रीडा" },
  "State Government": { en: "State Government", mr: "राज्य शासन" },
  "Surface Tension": { en: "Surface Tension", mr: "पृष्ठताण" },
  "Swadeshi & Partition of Bengal (1905)": {
    en: "Swadeshi & Partition of Bengal (1905)",
    mr: "स्वदेशी आणि बंगालची फाळणी (१९०५)",
  },
  "Syllogism & Logical Deduction": { en: "Syllogism & Logical Deduction", mr: "न्यायवाक्यशास्त्र आणि तार्किक निष्कर्ष" },
  Taxation: { en: "Taxation", mr: "करप्रणाली" },
  "Time & Work": { en: "Time & Work", mr: "वेळ आणि काम" },
  "Time, Speed & Distance": { en: "Time, Speed & Distance", mr: "वेळ, वेग आणि अंतर" },
  "Trade Union & Labour Movement": { en: "Trade Union & Labour Movement", mr: "कामगार संघटना आणि कामगार चळवळ" },
  "Tribal & Peasant Uprisings": { en: "Tribal & Peasant Uprisings", mr: "आदिवासी आणि शेतकरी उठाव" },
  "Union Executive": { en: "Union Executive", mr: "केंद्रीय कार्यकारी" },
  "Urban Local Bodies": { en: "Urban Local Bodies", mr: "नागरी स्थानिक स्वराज्य संस्था" },
  Vocabulary: { en: "Vocabulary", mr: "शब्दसंग्रह" },
  "World Geography & Locations": { en: "World Geography & Locations", mr: "जागतिक भूगोल आणि स्थान" },
  "Zoology (Animal Biology)": { en: "Zoology (Animal Biology)", mr: "प्राणिशास्त्र" },
};

export const CSAT_STREAM_LABELS: Record<string, { en: string; mr: string; blurbEn: string; blurbMr: string }> = {
  quant: {
    en: "Quantitative Aptitude",
    mr: "संख्यात्मक क्षमता",
    blurbEn:
      "Numbers, percentages, ratios, algebra, geometry, time-work, speed and interest — the calculation half of CSAT.",
    blurbMr:
      "संख्या, टक्केवारी, गुणोत्तर, बीजगणित, भूमिती, वेळ-काम, वेग आणि व्याज — CSAT चा गणितीय भाग.",
  },
  reasoning: {
    en: "Logical Reasoning",
    mr: "तार्किक विचारक्षमता",
    blurbEn:
      "Series, coding-decoding, syllogism, puzzles, direction, blood relations and calendars — the thinking half.",
    blurbMr:
      "मालिका, कोडिंग-डिकोडिंग, न्यायवाक्यशास्त्र, कोडी, दिशाज्ञान, रक्तसंबंध आणि दिनदर्शिका — विचारक्षमतेचा भाग.",
  },
  comprehension: {
    en: "Comprehension & Data Interpretation",
    mr: "उतारा वाचन आणि आकडेवारीचे विश्लेषण",
    blurbEn: "Reading passages and reading charts — the two skills that decide the CSAT qualifying paper.",
    blurbMr: "उतारे वाचणे आणि तक्ते समजून घेणे — CSAT पात्रता पेपर ठरवणारी दोन कौशल्ये.",
  },
};

export const CSAT_TOPIC_LABELS: Record<string, { en: string; mr: string }> = {
  "number-system": { en: "Number System & Simplification", mr: "संख्या पद्धती आणि सरलीकरण" },
  "percentage-profit-loss": { en: "Percentage, Profit & Loss", mr: "टक्केवारी, नफा आणि तोटा" },
  "ratio-average": { en: "Ratio, Proportion & Averages", mr: "गुणोत्तर, प्रमाण आणि सरासरी" },
  algebra: { en: "Algebra & Equations", mr: "बीजगणित आणि समीकरणे" },
  mensuration: { en: "Mensuration & Geometry", mr: "क्षेत्रमिती आणि भूमिती" },
  "time-work": { en: "Time & Work", mr: "वेळ आणि काम" },
  "speed-distance": { en: "Time, Speed & Distance", mr: "वेळ, वेग आणि अंतर" },
  interest: { en: "Simple & Compound Interest", mr: "सरळ व्याज आणि चक्रवाढ व्याज" },
  "probability-stats": { en: "Probability & Statistics", mr: "संभाव्यता आणि सांख्यिकी" },
  series: { en: "Number & Letter Series", mr: "संख्या आणि अक्षर मालिका" },
  "coding-decoding": { en: "Coding-Decoding", mr: "कोडिंग-डिकोडिंग" },
  syllogism: { en: "Syllogism & Logical Deduction", mr: "न्यायवाक्यशास्त्र आणि तार्किक निष्कर्ष" },
  analogy: { en: "Analogy & Classification", mr: "साधर्म्य आणि वर्गीकरण" },
  puzzles: { en: "Puzzles & Seating Arrangement", mr: "कोडी आणि आसन व्यवस्था" },
  direction: { en: "Direction Sense", mr: "दिशाज्ञान" },
  "blood-relations": { en: "Blood Relations", mr: "रक्तसंबंध" },
  ranking: { en: "Ranking & Ordering", mr: "स्थानक्रम आणि क्रमवारी" },
  "clocks-calendars": { en: "Clocks & Calendars", mr: "घड्याळे आणि दिनदर्शिका" },
  "data-interpretation": { en: "Data Interpretation", mr: "आकडेवारीचे विश्लेषण" },
  "reading-comprehension": { en: "Reading Comprehension", mr: "उतारा वाचन" },
};

const UI = {
  liveStudyArena: { en: "Live Study Arena", mr: "थेट अभ्यास कक्ष" },
  heroTitle: { en: "LET THE BRAIN BATTLE BEGIN", mr: "सराव सुरु करा, प्रगती वाढवा" },
  heroSubtitle: {
    en: "Pick a mode, solve focused sets, and watch your preparation turn into daily momentum. PYQs, topic tests, notes and leaderboard now feel like one clean study cockpit.",
    mr: "मोड निवडा, लक्ष केंद्रित संच सोडवा आणि रोजच्या सरावातून गती वाढवा. मागील प्रश्न, टॉपिक चाचण्या, नोट्स आणि लीडरबोर्ड — एकाच स्वच्छ अभ्यास मंचावर.",
  },
  chipTopicSets: { en: "5-question topic sets", mr: "५-प्रश्नांचे विषय संच" },
  chipLang: { en: "Marathi + English", mr: "मराठी + इंग्रजी" },
  chipRank: { en: "Daily rank push", mr: "दैनिक क्रमवारी" },
  notes: { en: "Notes", mr: "नोट्स" },
  leaderboard: { en: "Leaderboard", mr: "लीडरबोर्ड" },
  map: { en: "Map", mr: "नकाशा" },
  census: { en: "Census", mr: "जनगणना" },
  rivers: { en: "Rivers", mr: "नद्या" },
  exams: { en: "Exams", mr: "परीक्षा" },
  about: { en: "About", mr: "आमच्याबद्दल" },
  contact: { en: "Contact", mr: "संपर्क" },
  donate: { en: "Donate", mr: "दान करा" },
  guestMode: { en: "Guest mode", mr: "अतिथी मोड" },
  signIn: { en: "Sign in", mr: "साइन इन" },
  logout: { en: "Logout", mr: "बाहेर पडा" },
  name: { en: "Name", mr: "नाव" },
  backToHome: { en: "Back to Home", mr: "मुख्यपृष्ठावर जा" },
  newBadge: { en: "New", mr: "नवीन" },
  free: { en: "Free", mr: "मोफत" },
  mockTest: { en: "Mock Test", mr: "मॉक टेस्ट" },
  mockTimed: { en: "Timed · Set A pattern", mr: "वेळेनुसार · सेट A पद्धत" },
  mockDesc: {
    en: "Full-length 100-question mock in real exam conditions — choose Rajyaseva, Combine Group B or Group C. Real subject weightage, a countdown timer and 1/4 negative marking. Current Affairs comes from the GK Marathon set.",
    mr: "खऱ्या परीक्षेसारखी पूर्ण १०० प्रश्नांची मॉक टेस्ट — राज्यसेवा, एकत्रित गट B किंवा गट C निवडा. खरे विषयवार वजन, काउंटडाउन टाइमर आणि १/४ नकारात्मक गुणांकन. चालू घडामोडी GK मॅरेथॉन संचातून घेतल्या जातात.",
  },
  mockStart: { en: "Start a mock test", mr: "मॉक टेस्ट सुरु करा" },
  negativeMarking: { en: "Negative marking", mr: "नकारात्मक गुणांकन" },
  randomised: { en: "Randomised each attempt", mr: "प्रत्येक प्रयत्नात वेगळे प्रश्न" },
  subjectWise: { en: "📚 Subject Wise", mr: "📚 विषयनिहाय" },
  subjectWiseDesc: {
    en: "Practice by full exam papers or subjects like History, Geography, Polity, Science and more.",
    mr: "पूर्ण प्रश्नपत्रिकांचा किंवा इतिहास, भूगोल, राज्यव्यवस्था, विज्ञान अशा विषयांचा सराव करा.",
  },
  startPracticing: { en: "Start Practicing", mr: "सराव सुरु करा" },
  topicWisePyq: { en: "🎯 Topic Wise (PYQ)", mr: "🎯 टॉपिकनुसार (मागील प्रश्न)" },
  topicWiseDesc: {
    en: "Previous-year questions segregated into granular topics. Pick a subject, then drill into a specific topic.",
    mr: "मागील वर्षांचे प्रश्न सूक्ष्म टॉपिकमध्ये विभागलेले आहेत. विषय निवडा आणि नंतर विशिष्ट टॉपिकचा सराव करा.",
  },
  exploreTopics: { en: "Explore Topics", mr: "टॉपिक पहा" },
  topicTests: { en: "📖 Topic Tests", mr: "📖 टॉपिक चाचण्या" },
  otherThanPyq: { en: "Other than PYQ", mr: "PYQ व्यतिरिक्त" },
  topicTestsDesc: {
    en: "Curated chapter-wise practice sets — Science tests, key schemes, newspapers and more, kept separate from PYQ.",
    mr: "प्रकरणनिहाय सराव संच — विज्ञान चाचण्या, महत्त्वाच्या योजना, वृत्तपत्रे इत्यादी; हे PYQ पासून वेगळे ठेवले आहेत.",
  },
  browseTests: { en: "Browse Tests", mr: "चाचण्या पहा" },
  gkMarathon: { en: "GK 2025-26 Marathon", mr: "GK २०२५-२६ मॅरेथॉन" },
  currentAffairs: { en: "Current Affairs", mr: "चालू घडामोडी" },
  gkDesc: {
    en: "Last 6 months Current Affairs (2025-26) — the most-asked GK MCQs covering sports, science, awards, politics, schemes and economy. Practice in 5-question sets.",
    mr: "गेल्या ६ महिन्यांच्या चालू घडामोडी (२०२५-२६) — क्रीडा, विज्ञान, पुरस्कार, राजकारण, योजना आणि अर्थव्यवस्था यांवरील महत्त्वाचे GK प्रश्न. ५ प्रश्नांच्या संचांत सराव करा.",
  },
  verified: { en: "264 verified", mr: "२६४ पडताळलेले" },
  fiveQSets: { en: "5-Q sets", mr: "५-प्रश्न संच" },
  examReady: { en: "Exam-ready", mr: "परीक्षेसाठी तयार" },
  startMarathon: { en: "Start the marathon", mr: "मॅरेथॉन सुरु करा" },
  rtoAmvi: { en: "🚗 RTO AMVI", mr: "🚗 आरटीओ AMVI" },
  rtoDesc: {
    en: "Assistant Motor Vehicle Inspector exam preparation. Section: Automobile Engineering — practice past paper MCQs covering IC engines, fuels, gears, brakes, fluid mechanics, vehicle layout and more.",
    mr: "सहाय्यक मोटार वाहन निरीक्षक परीक्षेची तयारी. विभाग: ऑटोमोबाइल अभियांत्रिकी — IC इंजिन, इंधन, गिअर्स, ब्रेक्स इत्यादींवरील मागील प्रश्नपत्रिकांचा सराव.",
  },
  openRto: { en: "Open RTO AMVI section", mr: "आरटीओ AMVI विभाग उघडा" },
  notesTitle: { en: "📝 Notes", mr: "📝 नोट्स" },
  readOnly: { en: "Read-only", mr: "केवळ वाचनासाठी" },
  notesDesc: {
    en: "Curated revision notes by Don't know Academy. First in the series: वृत्तपत्र — संस्थापक व संपादक (70+ newspapers, 50+ editors, 100 MCQs with answers).",
    mr: "Don't know Academy यांच्या निवडक पुनरावृत्ती नोट्स. मालिकेतील पहिला भाग: वृत्तपत्र — संस्थापक व संपादक (७०+ वृत्तपत्रे, ५०+ संपादक, १०० MCQ उत्तरांसह).",
  },
  openNotes: { en: "Open Notes", mr: "नोट्स उघडा" },
  csatTitle: { en: "CSAT & Aptitude", mr: "CSAT आणि बुद्धिमत्ता चाचणी" },
  csatDesc: {
    en: "For MPSC and UPSC CSAT. Every CSAT topic explained in depth — concepts, formulas, shortcuts and traps — followed by 3,800+ solved practice questions with explanations in Marathi and English, plus a timed combined speed test for the qualifying aptitude paper.",
    mr: "MPSC आणि UPSC CSAT साठी. प्रत्येक CSAT विषय सखोलपणे स्पष्ट केला आहे — संकल्पना, सूत्रे, शॉर्टकट आणि सापळे. त्यानंतर मराठी व इंग्रजीत ३,८००+ सोडवलेले सराव प्रश्न, तसेच पात्रता पेपरसाठी वेळेनुसार एकत्रित स्पीड टेस्ट.",
  },
  deepLessons: { en: "Deep topic lessons", mr: "सखोल विषयधडे" },
  topicPractice: { en: "Topic-wise practice", mr: "टॉपिकनुसार सराव" },
  speedTest: { en: "Combined speed test", mr: "एकत्रित स्पीड टेस्ट" },
  openCsat: { en: "Open CSAT training", mr: "CSAT प्रशिक्षण उघडा" },
  topicsLabel: { en: "Topics", mr: "विषय" },
  riversTitle: { en: "Rivers of Maharashtra", mr: "महाराष्ट्राच्या नद्या" },
  districtMap: { en: "District-wise 2D map", mr: "जिल्हानिहाय २D नकाशा" },
  mpscPyqs: { en: "MPSC PYQs", mr: "MPSC मागील प्रश्न" },
  riversDesc: {
    en: "Every major river plotted with names on a clean district-aware 2D map — Godavari, Krishna, Tapi & 14 Konkan rivers, basin-colour-coded. Plus a curated MPSC Previous-Year Questions quiz on Maharashtra rivers from 2010 – 2025 papers, tagged by exam & year.",
    mr: "प्रत्येक प्रमुख नदी जिल्हानिहाय २D नकाशावर दाखवली आहे — गोदावरी, कृष्णा, तापी आणि १४ कोकण नद्या. तसेच २०१० ते २०२५ च्या MPSC प्रश्नपत्रिकांतील महाराष्ट्राच्या नद्यांवरील मागील प्रश्नांची क्विझ.",
  },
  practiceBySubject: { en: "Practice by Subject", mr: "विषयनिहाय सराव" },
  viewTopics: { en: "View Topics", mr: "टॉपिक पहा" },
  allQuizzes: { en: "All Quizzes", mr: "सर्व प्रश्नसंच" },
  autoPastPapers: { en: "Automobile Engineering — Past Papers", mr: "ऑटोमोबाइल अभियांत्रिकी — मागील प्रश्नपत्रिका" },
  topicWisePractice: { en: "Topic Wise Practice", mr: "टॉपिकनुसार सराव" },
  topicTestsHeading: { en: "Topic Tests", mr: "टॉपिक चाचण्या" },
  startPractice: { en: "Start Practice", mr: "सराव सुरु करा" },
  reviewAll: { en: "Review All", mr: "सर्व पुन्हा पहा" },
  myStats: { en: "My Stats", mr: "माझी प्रगती" },
  submitQuiz: { en: "Submit Quiz", mr: "क्विझ जमा करा" },
  answered: { en: "answered", mr: "उत्तरे दिले" },
  backToQuizzes: { en: "Back to Quizzes", mr: "प्रश्नसंचकडे परत जा" },
  submitSet: { en: "Submit Set", mr: "संच जमा करा" },
  submitReport: { en: "Submit Report", mr: "तक्रार जमा करा" },
  submitting: { en: "Submitting...", mr: "जमा होत आहे..." },
  noQuizzes: { en: "No quizzes available", mr: "मराठी प्रश्नसंच उपलब्ध नाहीत" },
  noQuizzesHint: {
    en: "Switch to Admin Mode to create your first quiz.",
    mr: "मराठी प्रश्नसंच लवकरच जोडले जातील.",
  },
  questions: { en: "questions", mr: "प्रश्न" },
  sets: { en: "sets", mr: "संच" },
  todayLeaderboard: { en: "Today's Leaderboard", mr: "आजचा लीडरबोर्ड" },
  csatTraining: { en: "CSAT Training", mr: "CSAT प्रशिक्षण" },
  csatHome: { en: "CSAT & Aptitude", mr: "CSAT आणि बुद्धिमत्ता चाचणी" },
  backToCsat: { en: "Back to CSAT home", mr: "CSAT मुख्यपृष्ठावर जा" },
  openLesson: { en: "Open lesson", mr: "धडा उघडा" },
  practice: { en: "Practice", mr: "सराव" },
  lessonOnly: { en: "Lesson only", mr: "केवळ धडा" },
  minRead: { en: "min read", mr: "मि. वाचन" },
  openMapQuiz: { en: "Open map & take the quiz", mr: "नकाशा उघडा आणि क्विझ द्या" },
  censusTitle: { en: "Census 2011 Memory Game", mr: "जनगणना २०११ मेमरी गेम" },
  censusDesc: {
    en: "Memorize all 35 districts — population, sex ratio, child sex ratio (0–6), literacy, density & decadal growth. 4 game modes: Top-10/Bottom-10 reveal, Rank Race, MCQ Quiz and Flashcards.",
    mr: "सर्व ३५ जिल्हे लक्षात ठेवा — लोकसंख्या, लिंगगुणोत्तर, बाल लिंगगुणोत्तर (०–६), साक्षरता, घनता आणि दशकीय वाढ. ४ गेम मोड: टॉप/बॉटम १०, रँक रेस, MCQ क्विझ आणि फ्लॅशकार्ड.",
  },
  playGame: { en: "Play the game", mr: "खेळ सुरु करा" },
  logoTip: {
    en: "💡 Click the logo at any time to return to this screen",
    mr: "💡 कधीही लोगोवर क्लिक करून या पडद्यावर परत या",
  },
  footerTagline: { en: "Free PYQ practice for MPSC aspirants", mr: "MPSC उमेदवारांसाठी मोफत PYQ सराव" },
  studyGuides: { en: "Study guides", mr: "अभ्यास मार्गदर्शिका" },
  privacy: { en: "Privacy", mr: "गोपनीयता" },
  terms: { en: "Terms", mr: "अटी" },
  disclaimer: { en: "Disclaimer", mr: "अस्वीकरण" },
  leaderboardTileTitle: { en: "Today's Leaderboard", mr: "आजचा लीडरबोर्ड" },
  leaderboardTileDesc: {
    en: "See today's top 5 scorers and check your rank.",
    mr: "आजचे अव्वल ५ विद्यार्थी पहा आणि आपली क्रमवारी तपासा.",
  },
  live: { en: "● LIVE", mr: "● थेट" },
  csatHomeIntro: {
    en: "A complete CSAT workshop for MPSC and UPSC — topic lessons, practice sets and timed speed tests covering what CSAT (Prelims Paper II) expects for the qualifying paper.",
    mr: "MPSC आणि UPSC साठी संपूर्ण CSAT कार्यशाळा — विषयधडे, सराव संच आणि वेळेनुसार स्पीड टेस्ट. यात CSAT (प्रारंभिक पेपर II) पात्रता पेपरसाठी आवश्यक कौशल्ये समाविष्ट आहेत.",
  },
  csatTopicsArrow: { en: "topics →", mr: "टॉपिक →" },
  csatSpeedBlurb: {
    en: "A timed mixed test across all topics with negative marking, just like the real qualifying paper.",
    mr: "सर्व टॉपिक मिसळून, नकारात्मक गुणांकनासह वेळेनुसार चाचणी — खऱ्या पात्रता पेपरसारखी.",
  },
  backToTopics: { en: "Back to topics", mr: "टॉपिककडे परत जा" },
  backToHomeShort: { en: "Back to home", mr: "मुख्यपृष्ठावर जा" },
} as const;

export type UiKey = keyof typeof UI;

export function t(key: UiKey, language: Language): string {
  const row = UI[key];
  return language === "marathi" ? row.mr : row.en;
}

export function categoryLabel(cat: string, language: Language): string {
  if ((CATEGORIES as readonly string[]).includes(cat)) {
    const row = CATEGORY_LABELS[cat as Category];
    return language === "marathi" ? row.mr : row.en;
  }
  return cat;
}

export function topicLabel(topic: string | undefined | null, language: Language): string {
  if (!topic) return "";
  if (language !== "marathi") return topic;
  if (DEVANAGARI.test(topic)) return topic;
  return TOPIC_LABELS[topic]?.mr ?? topic;
}

export function csatStreamLabel(streamId: string, language: Language): string {
  const row = CSAT_STREAM_LABELS[streamId];
  if (!row) return streamId;
  return language === "marathi" ? row.mr : row.en;
}

export function csatStreamBlurb(streamId: string, fallback: string, language: Language): string {
  const row = CSAT_STREAM_LABELS[streamId];
  if (!row) return fallback;
  return language === "marathi" ? row.blurbMr : row.blurbEn;
}

export function csatTopicLabel(topicId: string, fallback: string, language: Language): string {
  const row = CSAT_TOPIC_LABELS[topicId];
  if (!row) return fallback;
  return language === "marathi" ? row.mr : row.en;
}

const LANG_STORAGE_KEY = "mcq_ui_language";

export function loadSavedLanguage(): Language {
  if (typeof window === "undefined") return "english";
  try {
    const v = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (v === "marathi" || v === "english") return v;
  } catch {
    /* ignore */
  }
  return "english";
}

export function saveLanguage(language: Language): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, language);
  } catch {
    /* ignore */
  }
}
