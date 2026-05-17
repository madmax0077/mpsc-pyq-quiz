/**
 * Maharashtra river PYQs (Previous-Year Questions) extracted from the
 * MPSC question papers we already host in /public.
 *
 * These are real questions actually asked in MPSC prelims/mains across
 * multiple cadres (Civil Services, Group B, Group C, PSI, STI, Sub-Ord.
 * Group B, Asst., Excise) from 2010 through 2025.  Each entry is tagged
 * with the source exam so the quiz can display it next to the question.
 *
 * Source files live in /public — see `_curate_river_pyqs.js`.
 */

export interface RiverPyq {
  /** Stable id for the question (sourceFile + sourceId). */
  id: string;
  /** Original MPSC paper this question came from. */
  exam: string;
  /** Year of the exam, extracted from `exam`. */
  year: number;
  /** Short topic / category tag for the question. */
  topic: string;
  /** Full question text. */
  text: string;
  /** Four answer options keyed A, B, C, D. */
  options: { A: string; B: string; C: string; D: string };
  /** Correct option letter A | B | C | D. */
  answer: "A" | "B" | "C" | "D";
}

export const RIVER_PYQS: readonly RiverPyq[] = [
  {
    id: "asst2011_en_82",
    exam: "MPSC Asst. Pre 2011",
    year: 2011,
    topic: "Maharashtra river basins",
    text: "When we travel from west to east in Maharashtra, we cross different river basins. They are in the following sequence:",
    options: {
      A: "Bhima, Vainaganga, Seena, Savitri",
      B: "Vainaganga, Seena, Bhima, Savitri",
      C: "Savitri, Bhima, Seena, Vainaganga",
      D: "Vainaganga, Bhima, Seena, Savitri",
    },
    answer: "C",
  },
  {
    id: "asst2011_en_85",
    exam: "MPSC Asst. Pre 2011",
    year: 2011,
    topic: "Wardha tributaries",
    text: "________ is a tributary of the river Wardha.",
    options: { A: "Penganga", B: "Bhima", C: "Yerala", D: "Panchganga" },
    answer: "A",
  },
  {
    id: "asst2011_en_92",
    exam: "MPSC Asst. Pre 2011",
    year: 2011,
    topic: "West-flowing rivers",
    text: "Which of the following is not a west-flowing river?",
    options: { A: "Vaitarana", B: "Tanasa", C: "Koyana", D: "Shastri" },
    answer: "C",
  },
  {
    id: "cs_pre_2023_q31",
    exam: "MPSC Civil Services Pre 2023",
    year: 2023,
    topic: "Hill ranges & river basins",
    text:
      "Which of the following is/are correct statements?\n" +
      "In Maharashtra, in order from north, the major hill ranges on the plateau and the river basins to their south are as follows:\n" +
      "a. Tapi–Purna basin to the south of the Satpura mountain range.\n" +
      "b. Godavari river valley to the south of Satmala–Ajintha hills.\n" +
      "c. Harishchandra–Balaghat hill and Bhima river basin to its south.\n" +
      "d. Shambhu–Mahadeva hills and Krishna river basin to its south.",
    options: {
      A: "Only (a)",
      B: "All are correct",
      C: "Only (a) and (b)",
      D: "Only (a) and (c)",
    },
    answer: "B",
  },
  {
    id: "cs_pre_2023_q33",
    exam: "MPSC Civil Services Pre 2023",
    year: 2023,
    topic: "Krishna / Godavari vs Kaveri",
    text:
      "As compared to the Godavari and Krishna rivers, the course of the Kaveri river receives large volume of water during winter, because",
    options: {
      A: "the course of the river Kaveri receives heavy rainfall from the south-west monsoons",
      B: "the course of the river Kaveri receives heavy rainfall from the north-east monsoons",
      C: "the course of the river Kaveri receives rainfall from both south-west and north-east monsoons",
      D: "the tributaries of the Kaveri provide large volume of water to the course of the Kaveri",
    },
    answer: "B",
  },
  {
    id: "cs2024_q24",
    exam: "MPSC Civil Services Combined 2024",
    year: 2024,
    topic: "Maharashtra drainage pattern",
    text:
      "Which type of drainage pattern is found in Maharashtra?\n" +
      "(a) Dendritic   (b) Parallel   (c) Indefinite   (d) Trellis",
    options: {
      A: "(a), (b) and (c)",
      B: "(b), (c) and (d)",
      C: "(a), (c) and (d)",
      D: "All of the above",
    },
    answer: "A",
  },
  {
    id: "csg_pre_2025_q18",
    exam: "MPSC Gazetted CS Pre 2025",
    year: 2025,
    topic: "Maharashtra river confluences",
    text:
      "Match the following.\n" +
      "River Confluence  —  Rivers\n" +
      "a. Prakashe   —  I.  Tapi–Panzara\n" +
      "b. Mudavad    —  II. Tapi–Gomati\n" +
      "c. Mahuli     —  III. Bhima–Indrayani\n" +
      "d. Tulapur    —  IV. Krishna–Venna",
    options: {
      A: "a-I, b-II, c-III, d-IV",
      B: "a-II, b-I, c-IV, d-III",
      C: "a-III, b-IV, c-II, d-I",
      D: "a-IV, b-III, c-II, d-I",
    },
    answer: "B",
  },
  {
    id: "excise_pre_2017_q19",
    exam: "MPSC Excise Sub-Ord. Pre 2017",
    year: 2017,
    topic: "Tapi / Wardha–Wainganga basin slope",
    text:
      "Consider the statements:\n" +
      "a. The area occupied by the Tapi river basin in north Maharashtra has an eastward slope.\n" +
      "b. The area occupied by the Wardha–Wainganga river basin slopes towards the south direction.\n" +
      "c. The area occupied by the remaining plateau river basin slopes towards the east direction.\n" +
      "Which one of the above statements is NOT correct?",
    options: { A: "Only a", B: "Only b", C: "Only c", D: "Only b and c" },
    answer: "A",
  },
  {
    id: "excise_pre_2017_q25",
    exam: "MPSC Excise Sub-Ord. Pre 2017",
    year: 2017,
    topic: "Wardha tributaries",
    text: "Which of the following is a tributary of River Wardha?",
    options: { A: "Nirguda", B: "Manyad", C: "Sindphana", D: "Girja" },
    answer: "A",
  },
  {
    id: "excise_pre_2017_q26",
    exam: "MPSC Excise Sub-Ord. Pre 2017",
    year: 2017,
    topic: "South Konkan rivers N–S",
    text:
      "Arrange the sequence of rivers in South Konkan from North to South.\n" +
      "a. Vaitarna   b. Savitri   c. Ulhas   d. Vashisthi",
    options: { A: "c, a, b, d", B: "a, c, d, b", C: "b, d, a, c", D: "a, c, b, d" },
    answer: "D",
  },
  {
    id: "gb_combine_pre_2024_q12",
    exam: "MPSC Group B Combined Pre 2024",
    year: 2024,
    topic: "Shambhu Mahadev range rivers",
    text: "The mountain range of Shambhu Mahadev lies between ______ rivers.",
    options: {
      A: "Tapi – Godavari",
      B: "Godavari – Bhima",
      C: "Bhima – Krishna",
      D: "Koyna – Krishna",
    },
    answer: "C",
  },
  {
    id: "gb_combine_pre_2024_q14",
    exam: "MPSC Group B Combined Pre 2024",
    year: 2024,
    topic: "Bhima / Painganga / Manjara",
    text:
      "Which of the following statement/s is/are correct?\n" +
      "a. Bhima river basin is a separate river basin in Maharashtra.\n" +
      "b. Painganga river rises in Ajanta range.\n" +
      "c. River Manjara is the tributary of Krishna.\n" +
      "d. Sindphana river is a northern tributary of Godavari.",
    options: {
      A: "Only a and b",
      B: "Only b",
      C: "c and d",
      D: "a, b and c",
    },
    answer: "A",
  },
  {
    id: "gb_pre_2025_q11",
    exam: "MPSC Group B Pre 2025",
    year: 2025,
    topic: "Shambhu Mahadev & river basins",
    text:
      "Consider the following statements:\n" +
      "(a) The range extending from Raireshwar to Shingnapur is called Shambhu–Mahadev mountain range.\n" +
      "(b) The river basins of Narmada and Tapi are separated by the Satpura mountain range.\n" +
      "(c) The Godavari and Bhima river basins are separated by the Harishchandra–Balaghat mountain range.\n" +
      "(d) The Satmala–Ajantha mountain range separates the Godavari and Tapi river basins.\n" +
      "Which of the statements given above is/are correct?",
    options: {
      A: "Only (a)",
      B: "Statements (a) and (b)",
      C: "Statements (a), (b) and (c)",
      D: "All of the above statements are correct",
    },
    answer: "D",
  },
  {
    id: "gb_pre_2025_q20",
    exam: "MPSC Group B Pre 2025",
    year: 2025,
    topic: "Vaitarna/Tansa, Krishna, Manyad",
    text:
      "Which of the following statements are true?\n" +
      "(a) Vaitarna and Tansa are the tributaries of river Ulhas.\n" +
      "(b) Krishna river basin is to the South of Khanapur plateau.\n" +
      "(c) Manyad river basin is in Godavari river basin.",
    options: {
      A: "Only Statement (a)",
      B: "Statements (a) and (b)",
      C: "Statements (a), (b) and (c)",
      D: "Statements (b) and (c)",
    },
    answer: "D",
  },
  {
    id: "gc_pre_2021_q44",
    exam: "MPSC Group C Pre 2021",
    year: 2021,
    topic: "First hydropower station in Maharashtra",
    text: "Which is the first hydropower station in Maharashtra?",
    options: { A: "Veer", B: "Radhanagari", C: "Koyna", D: "Khopoli" },
    answer: "D",
  },
  {
    id: "gc_pre_2021_q52",
    exam: "MPSC Group C Pre 2021",
    year: 2021,
    topic: "Wilson Dam / Arthur Lake",
    text: "Which dam and its reservoir are known as Wilson Dam and Arthur Lake respectively?",
    options: {
      A: "Upper Wardha dam",
      B: "Lower Wardha dam",
      C: "Ujjani dam",
      D: "Bhandardara dam",
    },
    answer: "D",
  },
  {
    id: "gc_pre_2024_q19",
    exam: "MPSC Group C Pre 2024",
    year: 2024,
    topic: "Hydroelectric projects by district",
    text:
      "Match the following:\n" +
      "Districts  —  Hydroelectric Project\n" +
      "(a) Solapur  —  (i)  Kanher\n" +
      "(b) Satara   —  (ii) Bhira\n" +
      "(c) Raigad   —  (iii) Warna\n" +
      "(d) Sangli   —  (iv) Ujjani",
    options: {
      A: "a-i, b-ii, c-iii, d-iv",
      B: "a-iv, b-ii, c-iii, d-i",
      C: "a-iv, b-i, c-iii, d-ii",
      D: "a-iv, b-i, c-ii, d-iii",
    },
    answer: "D",
  },
  {
    id: "gc_pre_2025_q15",
    exam: "MPSC Group C Pre 2025",
    year: 2025,
    topic: "Yamuna tributaries E–W",
    text:
      "Arrange these tributaries of Yamuna river from East to West direction.\n" +
      "Rivers — Sindh, Chambal, Betwa, Ken",
    options: {
      A: "Sindh, Chambal, Ken, Betwa",
      B: "Ken, Betwa, Sindh, Chambal",
      C: "Ken, Sindh, Betwa, Chambal",
      D: "Ken, Chambal, Betwa, Sindh",
    },
    answer: "B",
  },
  {
    id: "psi23_65",
    exam: "MPSC PSI Main 2023",
    year: 2023,
    topic: "Bhima tributaries",
    text: "Which of the following is NOT a tributary of Bhima river?",
    options: { A: "Sina", B: "Man", C: "Bhama", D: "Terna" },
    answer: "D",
  },
  {
    id: "psi23_69",
    exam: "MPSC PSI Main 2023",
    year: 2023,
    topic: "Krishna tributaries",
    text: "Which of the following is the correct pair of tributaries of river Krishna?",
    options: {
      A: "Arkavati – Bhavani",
      B: "Koyana – Pranhita",
      C: "Musi – Hemavati",
      D: "Malprabha – Tungabhadra",
    },
    answer: "D",
  },
  {
    id: "psi_pre_2010_q40",
    exam: "MPSC PSI Pre 2010",
    year: 2010,
    topic: "Konkan creeks N–S",
    text: "Arrange the creeks in Konkan from North to South direction.",
    options: {
      A: "Rajapuri, Dabhol, Jaigad, Terekhol",
      B: "Dabhol, Rajapuri, Jaigad, Terekhol",
      C: "Dabhol, Jaigad, Rajapuri, Terekhol",
      D: "Terekhol, Jaigad, Dabhol, Rajapuri",
    },
    answer: "A",
  },
  {
    id: "psi_pre_2010_q148",
    exam: "MPSC PSI Pre 2010",
    year: 2010,
    topic: "Westward-flowing river of Maharashtra",
    text: "Which of the following rivers in Maharashtra is flowing westward?",
    options: { A: "Tapi", B: "Godavari", C: "Krishna", D: "Bhima" },
    answer: "A",
  },
  {
    id: "sb_pre_2020_q30",
    exam: "MPSC Sub-Ord. Group B Pre 2020",
    year: 2020,
    topic: "Tapi–Purna basin rivers N–S",
    text: "In Tapi – Purna river basin, which of the following sequence of rivers from North to South is correct?",
    options: {
      A: "Girna, Bori, Panzara, Burai, Gomati",
      B: "Gomati, Burai, Panzara, Bori, Girna",
      C: "Gomati, Burai, Girna, Bori, Panzara",
      D: "Gomati, Panzara, Girna, Burai, Bori",
    },
    answer: "B",
  },
  {
    id: "sb_pre_2021_q35",
    exam: "MPSC Sub-Ord. Group B Pre 2021",
    year: 2021,
    topic: "Godavari tributaries (length)",
    text: "Which of the following options shows the correct ascending order by length of the tributaries of Godavari river?",
    options: {
      A: "Pranhita, Pravara, Wardha, Manjra",
      B: "Manjra, Wardha, Pravara, Pranhita",
      C: "Pranhita, Wardha, Pravara, Manjra",
      D: "Manjra, Pravara, Wardha, Pranhita",
    },
    answer: "A",
  },
  {
    id: "sb_pre_2021_q37",
    exam: "MPSC Sub-Ord. Group B Pre 2021",
    year: 2021,
    topic: "Central Konkan creeks",
    text: "Which creeks are included in the 'Central Konkan' of Maharashtra's Konkan Regional Division?",
    options: {
      A: "Deogarh, Achara and Karli creeks",
      B: "Rajapuri, Bankot and Kelshi creeks",
      C: "Dharamtar, Kalawal and Terekhol creeks",
      D: "Dahanu, Vasai and Datiware creeks",
    },
    answer: "B",
  },
  {
    id: "sb_pre_2022_q55",
    exam: "MPSC Sub-Ord. Group B Pre 2022",
    year: 2022,
    topic: "Ukai project — river",
    text: "The multipurpose project of Gujarat 'Ukai' is situated on which river?",
    options: { A: "Sabarmati", B: "Tapti", C: "Mahi", D: "Narmada" },
    answer: "B",
  },
  {
    id: "ts_pre_2022_q66",
    exam: "MPSC Tax Asst. Pre 2022",
    year: 2022,
    topic: "Length of Tapi river",
    text: "The total length of Tapi River is:",
    options: { A: "540 km", B: "762 km", C: "900 km", D: "724 km" },
    answer: "D",
  },
  {
    id: "ts_pre_2022_q68",
    exam: "MPSC Tax Asst. Pre 2022",
    year: 2022,
    topic: "Hill between Bhima & Godavari",
    text: "_______ hill is situated between Bhima river and Godavari river.",
    options: {
      A: "Mahadev hill",
      B: "Satmala – Ajentha",
      C: "Harishchandra – Balaghat",
      D: "Satpuda",
    },
    answer: "C",
  },
] as const;
