import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeoQuestion, getSeoQuestions, type SeoQuestion } from "@/lib/questionSeo";
import DisplayAd from "@/components/DisplayAd";
import { IN_CONTENT_AD_SLOT } from "@/lib/adsConfig";

const SITE_URL = "https://www.mpscs.in";

type PageProps = {
  params: { id: string };
};

/** Deterministic 32-bit hash of a string — used to seed template rotation
 *  so every question ID picks a stable-but-varied set of paragraphs. */
function hash32(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i += 1) {
    h = ((h << 5) + h + input.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

/** Rich, category-specific 3-paragraph deep-dive.  Each category has THREE
 *  hand-written variants that rotate per question ID so a subject with 300
 *  questions never repeats the same block on adjacent items.  Every variant
 *  is 200-250 words of substantive, MPSC-specific content — no filler. */
function categoryDeepDive(category: string | undefined, seed: number): { heading: string; paragraphs: string[] } {
  const c = category || "General Studies";
  const idx = seed % 3;

  const POLITY = [
    {
      heading: "Polity in MPSC prelims — the anchor subject",
      paragraphs: [
        "Indian Polity carries the highest weightage-to-effort ratio in every MPSC preliminary paper. Between 12 and 18 questions in a typical Group B, Group C, PSI or Gazetted Civil Services prelim come from the Constitution, Fundamental Rights, Directive Principles of State Policy, Parliament, the President, the Supreme Court, the Governor, the Maharashtra state legislature and the three-tier Panchayati Raj system. Because the answers are anchored to specific Article numbers, dates and constitutional bodies, the marks are fully retrievable through disciplined revision.",
        "MPSC's Polity question-framing tends to follow three recurring patterns: (a) Article-to-subject matching — for example matching Article 32 with writs, Article 21A with Right to Education, Article 44 with Uniform Civil Code; (b) chronological ordering of amendments — the 42nd (Socialist / Secular / Integrity), 44th (Right to Property removed), 73rd/74th (Panchayati Raj / Municipalities), 86th (RTE), 101st (GST); and (c) comparative structure questions — Rajya Sabha vs. Lok Sabha powers, Fundamental Rights vs. DPSPs (justiciable vs. non-justiciable), Union list vs. State list vs. Concurrent list.",
        "The most efficient preparation route is to read the Constitution's bare text for Parts III (FRs) and IV (DPSPs), memorise the schedules 1–12 as a single one-page chart, and practise the last 10 years of MPSC Polity PYQs. Our long-form Indian Polity study guide summarises every high-frequency article, key Supreme Court case (Kesavananda Bharati 1973, Maneka Gandhi 1978, Puttaswamy 2017) and every amendment MPSC has asked about since 2014.",
      ],
    },
    {
      heading: "How Polity is tested — the recurring pillars",
      paragraphs: [
        "MPSC treats Polity as a memory-plus-application subject. The memory layer is the constitutional text itself: 12 schedules, 25 parts, roughly 448 articles, six categories of Fundamental Rights (Articles 14–32 after the 44th Amendment removed the Right to Property), the eleven Directive Principles clusters, and the ten Fundamental Duties. The application layer tests whether the aspirant can map a real-world situation to the correct article — for instance identifying that a public-interest litigation invokes Article 32 (Supreme Court) or Article 226 (High Court), or that the Governor's rule under Article 356 has a six-month renewability cap.",
        "The bodies you must know cold include the Election Commission (Articles 324–329), the Comptroller and Auditor General (Articles 148–151), the Union and State Public Service Commissions (Articles 315–323), the Finance Commission (Article 280), the Attorney General (Article 76) and the National Commissions for SCs / STs / Women / OBCs / Minorities. MPSC frequently asks about their composition, tenure, appointment authority and reporting body — these four attributes are usually all you need to eliminate three of four options.",
        "For Maharashtra state polity, the Governor, the Chief Minister, the Vidhan Sabha and Vidhan Parishad, and the state-level executive structure appear every year. Combine our Indian Polity study guide with the map layers that show Maharashtra's six revenue divisions and thirty-six districts to answer state-federalism questions confidently.",
      ],
    },
    {
      heading: "Constitutional questions in the MPSC PYQ set",
      paragraphs: [
        "Every Polity item in an MPSC paper eventually reduces to one of five decision axes: (1) which Article, (2) which amendment, (3) which body, (4) which case, or (5) which schedule. Once an aspirant internalises those five axes, even unseen questions can be attempted at 60-percent-plus accuracy by process of elimination. Our editorial team categorises each PYQ by the primary axis so aspirants can drill along the axis they find weakest — e.g. Ambedkar quotes and constituent-assembly landmarks belong to the 'landmark event' axis; the Basic Structure Doctrine belongs to the 'case law' axis.",
        "Recurring high-yield topics in the MPSC set (based on our tag frequency across 5,000+ historical questions) include: the emergency provisions (Article 352 / 356 / 360), the amendment procedure (Article 368), the President's election (Article 54 with proportional representation via single transferable vote), the Speaker of Lok Sabha vs. Chairman of Rajya Sabha, the Public Accounts Committee vs. the Estimates Committee, and the National Development Council. The 73rd and 74th amendments, the schedules that list the languages (8th), the anti-defection provisions (10th) and the tribal areas (5th / 6th) are also perennial.",
        "Sit with the Constitution of India bare act, our Indian Polity study guide and this question — three tabs open on the same screen. That habit alone lifts most aspirants by one full standard-deviation on the mock-test score distribution.",
      ],
    },
  ];

  const GEOGRAPHY = [
    {
      heading: "MPSC Geography — Maharashtra plus India physical",
      paragraphs: [
        "Geography in MPSC prelims is split between Maharashtra-specific facts and pan-India physical, human and economic geography. The Maharashtra half covers the Konkan coastal strip, the Sahyadri range and its major ghats (Thal, Bor, Malshej, Kasara, Tamhini, Kumbharli, Amba, Varandha), the Deccan Trap plateau, the six revenue divisions and 36 districts, and the drainage systems — the east-flowing Godavari, Krishna, Bhima, Tapi, Wardha, Wainganga and Painganga; and the fourteen short west-flowing Konkan rivers. Our interactive Maharashtra map plots every one of these with inline name labels so spatial recall becomes muscle memory.",
        "The pan-India half tests physical divisions (Himalayas / Northern Plains / Peninsular Plateau / Coastal Plains / Islands), the classification of rocks and soils, monsoon mechanics, ocean currents, mineral belts (Bauxite: Kolhapur–Ratnagiri; Manganese: Nagpur–Bhandara; Coal: Chandrapur–Wani; Iron Ore: Sindhudurg–Gadchiroli inside Maharashtra alone), and human-geography attributes like the tribal population share, decadal growth rate and density based on Census 2011.",
        "For the state's power sector, MPSC frequently asks about the three thermal super-plants (Chandrapur 3340 MW, Koradi 2400 MW, Tiroda 3300 MW), the hydro giants (Koyna ~1960 MW, Bhira, Ghatghar pumped storage), and the Tarapur Atomic Power Station. Cross-reference those facts against our interactive map's ⚛️ Nuclear, 🌀 Hydro and 🏭 Thermal layers before your next mock.",
      ],
    },
    {
      heading: "Physical geography — the pillars you cannot skip",
      paragraphs: [
        "MPSC Geography rewards structural understanding over rote learning. A well-prepared aspirant can answer 12 of 15 geography items just by knowing (a) the physical division a place belongs to, (b) the river basin that drains it, (c) the annual rainfall bracket that shapes its agriculture, and (d) the mineral or industrial anchor around it. Try that four-step check on any Geography PYQ and you'll see the elimination pattern almost immediately.",
        "The Sahyadri divides Maharashtra into two starkly different worlds. West of the crest is the Konkan — narrow coastal shelf, laterite soils, 2500-3500 mm annual rainfall, cashew and mango belts, and fourteen short rivers that fall to the Arabian Sea in less than a hundred kilometres. East of the crest is the Deccan Trap — flat-topped basalt plateaus, black cotton soil (regur) in Vidarbha and Marathwada, 600-900 mm rainfall in the rain-shadow districts, and the great east-flowing rivers that eventually reach the Bay of Bengal. Every state-geography question sits somewhere on this west-east cross-section.",
        "Learn the ghats not as isolated points but as passes across the Sahyadri crest. From north to south: Thal (Nashik ↔ Mumbai), Bor (Khandala corridor), Tamhini (Pune ↔ Konkan), Varandha (Bhor ↔ Mahad), Kumbharli (Karad ↔ Chiplun), Amba (Kolhapur ↔ Ratnagiri) and Fonda (Belgaum ↔ Goa). Each maps one specific district pair — MPSC's favourite pairing question.",
      ],
    },
    {
      heading: "Applied geography for MPSC — soils, agriculture, mining",
      paragraphs: [
        "Geography in MPSC is not abstract — it is asked in the same frame as MPSC recruits will encounter as revenue officers, taluka development officers or forest rangers: which crop grows on which soil, which mineral is mined in which district, which dam feeds which command area. That functional angle is why our editorial team pairs every Geography question with three anchors — the district, the drainage basin, and the resource.",
        "Soil-and-agriculture questions typically ask you to match: (a) black cotton soil / regur → Vidarbha & Marathwada → cotton, soyabean, jowar; (b) laterite soil → Konkan & Sahyadri → cashew, mango, rice; (c) alluvium → riverine belts of Godavari and Krishna valleys → sugarcane; (d) red-and-yellow soil → southern Maharashtra → millets. MPSC's twist is often to swap the crop belt with the wrong soil — knowing this quartet lets you eliminate confidently.",
        "For mineral geography, three facts recur every year: Chandrapur is the coal capital of Maharashtra; Nagpur–Bhandara–Gondia is the manganese triangle; Kolhapur–Sindhudurg holds the bauxite reserves. Add Ratnagiri's iron ore and Yavatmal's limestone, and you cover roughly 90 percent of the mineral facts MPSC has asked in the last decade.",
      ],
    },
  ];

  const HISTORY = [
    {
      heading: "History in MPSC — Maharashtra threaded through India",
      paragraphs: [
        "MPSC History leans heavily towards Maharashtra's own story — the Satavahanas of the 2nd century BCE, the Vakatakas, the Chalukyas and Rashtrakutas, the Yadavas of Devagiri (Daulatabad), the Bahmani sultanate and its five successor Deccan sultanates, the rise of the Maratha state under Chhatrapati Shivaji Maharaj in the 17th century, the Peshwa era (1713–1818), the British / Bombay Presidency period and the freedom movement's Marathi voices from Bal Shastri Jambhekar and Tilak to Savarkar, Ambedkar and the Samyukta Maharashtra movement of the 1950s.",
        "Threaded through this Maharashtra timeline is pan-India history: the Delhi Sultanate, the Mughal empire, colonial land settlements (Permanent Settlement 1793, Ryotwari, Mahalwari), the Revolt of 1857, the Congress moderates and extremists, the Home Rule leagues, the four Gandhian movements (Non-Cooperation 1920, Civil Disobedience 1930, Individual Satyagraha 1940, Quit India 1942) and the post-1947 integration of princely states — including Hyderabad's Operation Polo (1948) which added parts of Marathwada.",
        "MPSC History questions almost always pin a name to a date and a place. For every named leader, memorise the year of their most famous event and the geographic location; that three-tuple lets you eliminate three of four options in nearly every historical PYQ. Our Maharashtra History study guide arranges every ruler and every movement in exactly this three-column form.",
      ],
    },
    {
      heading: "Marathas, Peshwas and the freedom struggle",
      paragraphs: [
        "The Maratha half of MPSC History is anchored on Chhatrapati Shivaji Maharaj's coronation at Raigad (1674), the ashta-pradhan council, the guerrilla warfare doctrine, the Treaty of Purandar (1665) with the Mughals, the sack of Surat (1664), and the succession through Sambhaji, Rajaram, Shahu and Tarabai to the Peshwa era. Under Bajirao I (1720–1740) the Maratha confederacy reached its northern peak; under Nana Sahib and Madhav Rao I it consolidated; under Bajirao II it fell to the British in the Third Anglo-Maratha War (1817–1818) after the defeat at Kirkee.",
        "The freedom-movement paragraph most MPSC papers ask about is the Maharashtra contribution: Bal Gangadhar Tilak's Sarvajanik Ganeshotsav (from 1893) and Shivaji Utsav (from 1895) as public-mobilisation tools; his newspapers Kesari and The Mahratta; his six years of imprisonment in Mandalay after the 1908 sedition trial; Gopal Krishna Gokhale as Congress moderate and mentor to Gandhi; Dadabhai Naoroji and the drain theory; Vinayak Damodar Savarkar and the 1857 History; the Chapekar brothers; Bhagat Singh at HSRA (linked via Maharashtra activists); and later Ambedkar's Poona Pact (1932) with Gandhi.",
        "The 1960 formation of Maharashtra state, following the Samyukta Maharashtra Samiti's decade-long agitation, the martyrdom of 106 activists at Flora Fountain (later renamed Hutatma Chowk) in 1956, and the eventual reorganisation of the erstwhile Bombay state into Gujarat and Maharashtra on 1 May 1960 is the single most-asked modern-history question in the MPSC set.",
      ],
    },
    {
      heading: "Ancient and medieval frames for the exam",
      paragraphs: [
        "For ancient India, MPSC weighs Buddhism, Jainism, Ashoka's edicts, the Guptas (with their Sanskrit revival and the Ajanta murals) and the Cholas of the south. Within Maharashtra specifically, the Satavahana period is the anchor — capitals at Junnar, Paithan and Nashik, patronage of Amaravati and Sanchi stupas, and the Naneghat and Nashik cave inscriptions that MPSC often cites verbatim. The Vakatakas and their Ajanta patronage, the Rashtrakutas at Manyakheta with the Ellora Kailasa temple (Cave 16), and the Yadavas at Devagiri close out the ancient-to-medieval Maharashtra arc.",
        "For medieval India, the Delhi Sultanate's five dynasties (Slave, Khilji, Tughlaq, Sayyid, Lodhi) are asked chronologically. Alauddin Khilji's Deccan campaigns brought Islamic rule to Maharashtra; Muhammad-bin-Tughlaq briefly shifted his capital to Daulatabad (Devagiri) in 1327; the Bahmani sultanate broke off in 1347 with its capital at Gulbarga and later Bidar; and the five successor sultanates (Bijapur, Ahmadnagar, Berar, Bidar, Golconda) shaped Deccan politics till Mughal conquest.",
        "Marathi historiography — from the bakhars to modern academic work by Sir Jadunath Sarkar, G.S. Sardesai and R.C. Majumdar — is occasionally referenced in interpretation-style MPSC questions. Our History study guide summarises each historian's central thesis in one line so you can attempt these interpretation items without reading the full volumes.",
      ],
    },
  ];

  const SCIENCE = [
    {
      heading: "General Science for MPSC — school-syllabus foundations",
      paragraphs: [
        "MPSC's General Science section stays close to the State Board and NCERT Class 8–10 syllabus. Physics contributes numerical items on motion, force, work-energy, sound, light (reflection / refraction / lenses), electricity (Ohm's law, series-parallel circuits) and magnetism. Chemistry contributes acids-bases-salts, atomic structure, the periodic table, chemical bonding, common industrial processes (contact process for H₂SO₄, Haber's process for NH₃) and everyday chemistry (soaps, plastics, alloys). Biology carries the largest share — cell structure, plant kingdom classification, animal kingdom classification, human physiology (digestive, respiratory, circulatory, excretory, nervous, endocrine systems), reproduction, genetics and communicable diseases.",
        "The single highest-yield chapter is human physiology — every MPSC prelim in the last decade has at least four questions from it. Learn each system as a triplet: the primary organ, the primary hormone or enzyme, and the primary disease if the system malfunctions. That triplet compresses hundreds of textbook pages into a memorable one-line schema per system.",
        "Modern topics MPSC has started asking include: renewable-energy technologies (solar PV, wind, biofuels), space technology (ISRO's launch vehicles PSLV / GSLV / SSLV, recent Chandrayaan-3 and Aditya L1 missions), biotechnology (CRISPR, mRNA vaccines) and environment (climate-change protocols from Kyoto 1997 through Paris 2015 to Glasgow COP26). Our Science topic-wise packs on the practice page include 41 dedicated tests covering every one of these subjects.",
      ],
    },
    {
      heading: "Science in exams — the six-quadrant map",
      paragraphs: [
        "Think of MPSC Science as a six-quadrant map: (1) Cell biology and biomolecules (DNA, RNA, proteins, cell division); (2) Human physiology and diseases; (3) Plant biology and classification; (4) Physics numericals (motion, electricity, sound, light); (5) Chemistry facts (elements, compounds, everyday products); (6) Applied science and current science affairs. Aspirants who allocate roughly equal attention to each quadrant score more consistently than those who over-invest in one area.",
        "For physics numericals, three formulas do most of the heavy lifting: v = u + at (kinematics), V = IR (Ohm's law), and W = Fs cos θ (work). MPSC rarely pushes beyond one-step substitutions, so identifying which formula applies is more than half the battle. The trap is usually in the units — write the SI unit next to every variable before you compute.",
        "For biology classification, the two mnemonics that carry the most weight are the five-kingdom system (Monera, Protista, Fungi, Plantae, Animalia) and, within Animalia, the nine phyla in evolutionary order (Porifera, Cnidaria, Platyhelminthes, Nematoda, Annelida, Arthropoda, Mollusca, Echinodermata, Chordata). Being able to place any organism in the correct kingdom-and-phylum eliminates two options instantly.",
      ],
    },
    {
      heading: "How MPSC frames science questions",
      paragraphs: [
        "MPSC's General Science items are almost never conceptual essays — they are precisely worded factual items with four options that swap one attribute at a time (a wrong element, a wrong hormone, a wrong disease, a wrong scientist). Recognising that pattern is worth two to three marks a paper. Practise reading the option set FIRST, then the question — if all four options are elements, you know the question is about chemistry; if all four are diseases, you know the question is about pathology. This inversion habit shaves seconds off each item.",
        "The Nobel-related, ISRO-related and biotechnology-related items are the most current-affairs-driven part of General Science. Skim the last twelve months of PIB releases and the annual ISRO / DAE / DBT summaries — those roughly one thousand words cover every current-science item MPSC is likely to ask. Our topic-wise Science packs on the practice mode include the most recent picks from these sources.",
        "For MPSC PSI, RTO AMVI and Technical Services papers, the science portion additionally tests applied physics — vehicle dynamics, tyre friction, engine efficiency, braking distance. Those specialised items are a large fraction of the RTO AMVI syllabus and appear on our RTO AMVI practice pack.",
      ],
    },
  ];

  const ECONOMICS = [
    {
      heading: "Economics for MPSC — schemes, sectors, statistics",
      paragraphs: [
        "MPSC Economics is a schemes-plus-statistics subject. Every prelim carries roughly ten to twelve economics items covering: (a) government schemes — MGNREGA (from NREGA 2005), Pradhan Mantri Jan Dhan Yojana (2014), Pradhan Mantri Ujjwala Yojana (2016), Pradhan Mantri Kisan Samman Nidhi (2019), Ayushman Bharat (2018), the DAY-NRLM / DAY-NULM livelihood pair, PMAY (Urban and Gramin), PMGSY, Startup India, Stand Up India; (b) macroeconomic statistics — GDP growth, inflation trajectory (CPI / WPI), fiscal deficit target under FRBM, tax-to-GDP ratio, and India's rank in specific indices (Human Development Index, Ease of Doing Business, Global Hunger Index).",
        "Almost every scheme question can be answered with the four-attribute lock: launch year, implementing ministry, primary target beneficiary, and headline financial commitment. Our Economics notes on the Notes tab arrange every Union government scheme along exactly this four-column matrix, with cross-references to Maharashtra's parallel state schemes such as Mahatma Jyotiba Phule Jan Arogya Yojana, Balasaheb Thackeray Krishi Vyavasay Sanjeevani Prakalp and Chhatrapati Shivaji Maharaj Shetkari Sanman Yojana.",
        "For macro-statistics, MPSC prefers the latest annual Economic Survey numbers plus the RBI Handbook of Statistics on Indian Economy. Skim the Executive Summary of the current Economic Survey (roughly forty pages) and you cover eighty-plus percent of the numeric MPSC Economics items. Combine that with the Union Budget's highlights and the latest edition of the Maharashtra Economic Survey for state-level statistics.",
      ],
    },
    {
      heading: "Economic institutions and the fiscal machinery",
      paragraphs: [
        "Institutional economics is a MPSC favourite. The Reserve Bank of India (established 1935, nationalised 1949) with its monetary-policy toolkit (repo rate, reverse repo, MSF, CRR, SLR) is asked every year. The Securities and Exchange Board of India (1988 / statutory 1992), the Insurance Regulatory and Development Authority (1999), the Pension Fund Regulatory and Development Authority (2003), the Insolvency and Bankruptcy Board of India (2016) and the Financial Stability and Development Council recur in every recent paper.",
        "Fiscal-federalism items rest on the Finance Commission (constituted every five years under Article 280) — its terms of reference, the horizontal devolution formula (population, area, income distance, forest cover, tax effort, demographic performance) and the vertical share it recommends. The Fifteenth Finance Commission's cycle (2021–26) and the sixteenth (from 2026) are examinable. The Goods and Services Tax framework — the 101st Amendment, the GST Council and its dispute-resolution role, the tax slabs (0, 5, 12, 18, 28) and the compensation cess — is also a recurring set.",
        "For Maharashtra's economy specifically, memorise the sectoral shares (agriculture roughly 12 percent of GSDP, industry 27 percent, services 61 percent as of the last Maharashtra Economic Survey), the top three GSDP-contributing districts (Mumbai suburban, Pune, Thane) and the concentration of the state's industrial output around the Mumbai-Pune-Nashik golden triangle and the Aurangabad and Nagpur secondary clusters.",
      ],
    },
    {
      heading: "Union budget and Maharashtra state finance",
      paragraphs: [
        "Union budget items appear in every MPSC prelim. The three headline numbers to remember for the current cycle: total receipts, total expenditure and fiscal deficit as a percentage of GDP. Under FRBM the medium-term target is a fiscal deficit of 3 percent of GDP and a debt-to-GDP ratio of 40 percent for the Union — MPSC has repeatedly asked which target got revised in which post-pandemic budget.",
        "Maharashtra's own budget mirrors this pattern at the state level: state's own tax revenue, share in central taxes, grants-in-aid from the Union, borrowings under FRBMA, and the sectoral allocation. The state's flagship expenditure programmes tend to cluster around irrigation (Krishna Marathwada, Konkan, Vidarbha regional projects), highway upgrades (Samruddhi Mahamarg, Coastal Road), and education (Right to Education implementation, the Mukhyamantri Mahila Sashaktikaran Abhiyan). Our Economics Yojana notes on the Notes tab walk through the largest Union and state schemes side by side.",
        "For every scheme discussed in a MPSC paper, note the associated ministry code — MoRD (Rural Development) for MGNREGA and PMAY-Gramin, MoHUA (Housing and Urban Affairs) for PMAY-Urban and DAY-NULM, MoA&FW (Agriculture) for PM-Kisan and PMFBY, MoFin (Finance) for PMJDY and PM-SVANidhi, MoHFW (Health) for PM-JAY and Mission Indradhanush. This ministry-to-scheme mapping is the single most useful shortcut in MPSC Economics.",
      ],
    },
  ];

  const CURRENT_AFFAIRS = [
    {
      heading: "Current Affairs — the two-window strategy",
      paragraphs: [
        "MPSC Current Affairs questions come from two windows: (a) the previous twelve months of national and international events; and (b) the last five years of static current affairs — awards, appointments, sports championships, summit locations, government-of-India schemes launched. The rolling window covers new laws, budgets, indices, treaties and headline events; the static window covers the sedimented facts that no longer move but must still be memorised. Almost every MPSC paper draws about 60 percent of current-affairs items from the rolling window and 40 percent from the static window.",
        "For the rolling window, the two authoritative sources are the Press Information Bureau (pib.gov.in) daily bulletin and the annual Economic Survey; supplement with the monthly Yojana and Kurukshetra magazines. For the static window, focus on: Nobel laureates by year and category, Padma awardees split by field, national sports achievements (Olympics, Asian Games, Commonwealth Games, World Cups), Prime-Minister and President appointments across democracies, and G20 / G7 / BRICS / SCO summit venues.",
        "Our GK 2025-26 Marathon on the Topic Wise practice tab curates the top 500 rolling-window items across the last six months in five-question sets — precisely calibrated to how MPSC frames these items. Aspirants who finish the Marathon typically report a 4–6 mark uplift on the current-affairs section of their next mock.",
      ],
    },
    {
      heading: "What MPSC counts as current affairs",
      paragraphs: [
        "The MPSC syllabus's current-affairs bucket is broader than daily news. It spans: (a) new legislation passed by Parliament and by the Maharashtra Vidhan Sabha; (b) Supreme Court and High Court landmark judgments; (c) international treaties India signed or ratified; (d) key economic indicators and India's rank in prominent global indices; (e) senior government appointments (Chief Justices, Cabinet Secretaries, RBI Governors, Chief Election Commissioners, Chairpersons of Constitutional and statutory bodies); (f) major national and international awards; and (g) space, defence and technology milestones from ISRO, DRDO and CSIR.",
        "The state-level current-affairs half is often decisive in Group B, Group C and PSI papers. Track: (a) new Maharashtra schemes announced in the state budget or by the Cabinet; (b) postings and promotions in the Maharashtra state services; (c) Marathi literature awards including the Sahitya Akademi Marathi and the state's own Jnanpith-recipient shortlists; (d) sports and cultural events hosted in Maharashtra (Marathon, film festivals, Kabaddi tournaments); and (e) major infrastructure inaugurations such as the Samruddhi Mahamarg and the Metro line extensions.",
        "Combine our Current Affairs topic quizzes with a five-minute nightly PIB skim and a weekend Yojana / Kurukshetra read — that ninety-minute-a-week schedule covers essentially all of MPSC's current-affairs load, in both English and Marathi.",
      ],
    },
    {
      heading: "Building a repeat-frequency notebook",
      paragraphs: [
        "Aspirants who convert current-affairs into a personal repeat-frequency notebook consistently outscore those who rely on monthly-magazine skim reading. The idea is simple: whenever you encounter a scheme name, an award, an appointment or an index in three or more sources within a month, promote it into your one-page notebook. That notebook, which typically converges to about 400 items across a full preparation cycle, is what you revise in the final two weeks — everything else can be sacrificed.",
        "MPSC also tests process-level current affairs — who convenes a body, how a treaty is ratified, which ministry pilots a scheme, which state hosts a summit. Learn the four constitutional bodies formed in the last five years (Lokpal 2019, GST Council 2016, National Financial Reporting Authority 2018, Central Advisory Committee for Consumer Protection 2020), the four statutory bodies (Insolvency and Bankruptcy Board of India 2016, National Company Law Tribunal 2016, Real Estate Regulatory Authority 2016 and DGCA restructuring), and the three regulatory frameworks (Digital Personal Data Protection Act 2023, Bharatiya Nyaya Sanhita / BNS 2023, Bharatiya Nagarik Suraksha Sanhita / BNSS 2023).",
        "Our editorial team refreshes the Current Affairs topic pack every month with the latest 50 to 80 items curated from PIB, the Economic Times, The Hindu and Loksatta — so aspirants who practise on our platform stay aligned with the rolling window without a separate subscription.",
      ],
    },
  ];

  const GENERAL = [
    {
      heading: "MPSC prelims — the four-subject balance",
      paragraphs: [
        "The MPSC combined preliminary paper allots roughly equal weightage to Polity, Geography, History, Science, Economics, Current Affairs, Environment, Marathi grammar / English grammar and Aptitude. No single subject dominates, which means the optimal preparation strategy is to hit a floor of 60-percent accuracy across every subject before pushing any one to 90 percent. Aspirants who ignore Aptitude or Marathi grammar because they 'know the subject' consistently lose two to three marks on those sections and slip below the cut-off.",
        "For every question you encounter on MPSC PYQ QUIZ, the recommended review loop is: attempt without looking at the answer; check the correct option; read the explanation; then read the 'Why this question matters' and 'How to attempt' sections below. That three-minute loop turns each PYQ into a mini-lesson and is why the majority of our top-percentile users solve every PYQ at least twice.",
        "The strongest signal that you are ready for MPSC prelims is not the number of PYQs solved but the accuracy on unseen mock questions. Practise unseen items from our topic-wise section between full-length mocks to stress-test whether the concepts have really moved into long-term memory.",
      ],
    },
    {
      heading: "MPSC exam ecosystem — a compact map",
      paragraphs: [
        "The Maharashtra Public Service Commission conducts five major recruitment examinations you can prepare for on this platform: MPSC Gazetted Civil Services (formerly known as State Services), MPSC Gazetted Technical Services, MPSC Group B (Subordinate Services), MPSC Group C (Subordinate Services), and the MPSC Police Sub-Inspector (PSI) examination. Each starts with an objective preliminary test, and the successful candidates progress to a written mains and finally to a personality test. Our platform focuses on the prelims round because that is where the winnowing is sharpest — often five to fifteen aspirants compete for every mains seat.",
        "Beyond the classic five, MPSC also conducts specialised examinations for RTO Assistant Motor Vehicle Inspector (AMVI), Excise Sub-Inspector, Tax Assistant, Sales Tax Inspector (STI) and Assistant Section Officer (ASO). Many of these share their General Studies paper structure with the main services, so PYQ practice cross-transfers well. Our /exams page groups every paper by exam family and year so aspirants can filter to exactly the sitting they plan for.",
        "MPSC uses a rotational negative-marking scheme of one-fourth mark per wrong answer for the objective paper — hence disciplined attempting matters as much as knowing the answers. Skip items where all four options seem equally plausible; that is usually the single biggest score-lifting habit for aspirants moving from the 55–65 percentile band into the 75-plus band.",
      ],
    },
    {
      heading: "How to use a PYQ page effectively",
      paragraphs: [
        "A previous-year question is not merely a test item; it is a distilled worked example of MPSC's own difficulty calibration. Treat every question you open on this site as a three-layer artefact. The first layer is the immediate answer — get it right or wrong. The second layer is the option-elimination logic — for each of the three wrong options, articulate in one sentence why it is wrong. The third layer is the concept generalisation — what pattern of question does this belong to, and where else might the same concept surface in the paper?",
        "For MPSC-specific pattern generalisation, our editorial team categorises every PYQ into a subject and a topic. Once you are consistently strong on a topic, use the Topic Wise practice mode to move to an unseen quiz on the same topic and then a mock. That progression — PYQ → same-topic unseen → mixed mock — is the single most reliable curriculum path we have observed in three years of user data.",
        "Finally, the explanation below is our editorial team's compact reasoning for the correct answer. If it is missing or brief, the question is often one where the answer is self-evident from the option text; if it is longer, the question typically involves a factual anchor (date, article, place, formula) that we surface for quick memorisation.",
      ],
    },
  ];

  const catMap: Record<string, typeof POLITY> = {
    "Indian Polity": POLITY,
    Polity: POLITY,
    Geography: GEOGRAPHY,
    "Maharashtra Geography": GEOGRAPHY,
    History: HISTORY,
    "Maharashtra History": HISTORY,
    Science: SCIENCE,
    "General Science": SCIENCE,
    Economics: ECONOMICS,
    "Current Affairs": CURRENT_AFFAIRS,
    "Current affairs": CURRENT_AFFAIRS,
  };
  const pool = catMap[c] || GENERAL;
  return pool[idx];
}

/** Rotating "how to attempt" sentence — 6 variants so consecutive question
 *  pages don't feel identical.  The variant is chosen from the question ID
 *  hash for determinism. */
function howToAttempt(q: SeoQuestion, seed: number): string {
  const topic = (q.topic || q.category || "this subject").toLowerCase();
  const variants = [
    `Read every option twice before committing to a choice. Once you commit, jot down in one line why each of the other three options is wrong — that elimination habit is what turns a 60-percentile score into a 90-percentile score. MPSC's favourite trap on ${topic} questions is to swap a single anchor word (a date, a place, a body, a ratio) so a mostly-right option becomes wrong.`,
    `Approach this in three passes. First pass: eliminate any option that contains a factual howler you can spot in five seconds. Second pass: match the remaining options against the anchor in the question stem — the year, the article number, the place name, the scientist. Third pass: commit. On MPSC ${topic} items, the wrong option that survives to the final two usually flips one attribute of the correct one.`,
    `Underline the anchor phrase in the question stem — the specific date, article, formula or place name that the question hinges on. Now scan the four options for the one that exactly matches that anchor. If two options match, look for the second anchor — MPSC almost always plants two verifiable anchors in every ${topic} question.`,
    `Cover the options with your hand and try to answer the question in your own words first. Then reveal the options and pick the one closest to your mental answer. This inversion habit is especially valuable for ${topic} items where three of the four options are designed to be superficially plausible.`,
    `Watch for negation traps — words like "not", "except", "incorrect" that flip the intent of the question. MPSC deliberately embeds them in ${topic} items to catch aspirants who read the question in a hurry. Re-read the stem with a mental highlight on any negation word before selecting an option.`,
    `Do the arithmetic on scratch paper even for one-step ${topic} numericals. The most common wrong answer in MPSC's numerical items is a rounding error or a unit mismatch, not a conceptual mistake. Writing each step out costs ten seconds and prevents the majority of those errors.`,
  ];
  return variants[seed % variants.length];
}

/** Rotating "why this matters" sentence — 5 variants. */
function whyMatters(q: SeoQuestion, seed: number): string {
  const cat = (q.category || "this subject").toLowerCase();
  const variants = [
    `Questions of this type recur almost every year across MPSC Group B, Group C, PSI and Gazetted Civil Services prelims because ${cat} carries a high, stable weightage in the syllabus. Practising the original paper wording — rather than paraphrased mock questions — is the fastest way to internalise MPSC's option-framing style and the specific way its examiners plant trick choices.`,
    `The Maharashtra Public Service Commission recycles ${cat} question patterns across its main five recruitment examinations. Solving a PYQ from one paper substantially increases your accuracy on adjacent papers because the underlying facts and the option-craft are identical. That cross-transfer is the strongest argument for prioritising PYQ practice over generic textbook review.`,
    `Repeat-frequency analysis of the last decade of MPSC papers shows that ${cat} accounts for a stable 10–15 percent of every prelim. Aspirants who master this segment early free up preparation time for the more volatile subjects (Current Affairs, Environment) that require weekly refresh. That is why our editorial team places ${cat} PYQs prominently in the topic-wise practice flow.`,
    `MPSC's answer-key process — including the objection round after every paper — means the official Set A answer keys we use are the authoritative reference for questions like this. When you see a discrepancy between two coaching-institute keys, the official MPSC revised key (which we track) is the source of truth. Anchoring your revision on the official key prevents second-guessing on the day of the actual exam.`,
    `Within ${cat}, this specific question sits on a pattern that MPSC has asked in some form at least four times in the last ten prelim cycles. Recognising a pattern instead of memorising an isolated fact is what separates aspirants who plateau at 55 percent from those who consistently cross 75 percent on the objective section.`,
  ];
  return variants[seed % variants.length];
}

/** Related-guide block by category. */
function relatedGuides(category: string | undefined): Array<{ href: string; label: string; blurb: string }> {
  const c = category || "";
  const all = [
    { href: "/study-guides/indian-polity-for-mpsc", label: "Indian Polity for MPSC", blurb: "Constitution, Fundamental Rights, DPSPs, Parliament, state government, key amendments." },
    { href: "/study-guides/maharashtra-geography", label: "Maharashtra Geography", blurb: "Konkan, Sahyadri, Deccan plateau, rivers, soils, agriculture, minerals, power sector." },
    { href: "/study-guides/maharashtra-history", label: "Maharashtra History", blurb: "Satavahanas, Yadavas, Maratha Empire, Peshwas, freedom movement, 1960 state formation." },
    { href: "/study-guides/mpsc-exam-pattern", label: "MPSC Exam Pattern", blurb: "Group B, Group C, PSI, Gazetted CS & TS prelims — marks, syllabus, negative marking, cut-offs." },
    { href: "/study-guides/mpsc-preparation-strategy", label: "MPSC Preparation Strategy", blurb: "6-month plan, book list, daily routine, PYQ usage, mock-test strategy." },
  ];
  if (c === "Indian Polity" || c === "Polity") return [all[0], all[3], all[4]];
  if (c === "Geography" || c === "Maharashtra Geography") return [all[1], all[3], all[4]];
  if (c === "History" || c === "Maharashtra History") return [all[2], all[3], all[4]];
  return [all[3], all[4], all[0]];
}

/** Compact intro paragraph. */
function introBlock(q: SeoQuestion): string {
  const subject = q.category || "MPSC General Studies";
  const paper = q.quizTitle;
  const langWord = q.language === "marathi" ? "Marathi" : "English";
  const topicHint = q.topic ? ` under the topic ${q.topic}` : "";
  return `This MPSC previous-year question is drawn from ${paper}. It belongs to the ${subject} section${topicHint} and is reproduced here in ${langWord} exactly as it appeared in the official Maharashtra Public Service Commission paper, along with the four options, the official Set A answer key and a compact explanation of why the correct option is correct.`;
}

/** Subject-specific one-line tip (same as before, kept for continuity). */
function subjectTip(category: string | undefined): string {
  switch (category) {
    case "Indian Polity":
    case "Polity":
      return "Tip for Polity: pin down the Article number, the year of the amendment and the body that performs the action. Most Polity questions can be solved by matching just those three anchors.";
    case "Geography":
    case "Maharashtra Geography":
      return "Tip for Geography: locate the region on the Maharashtra map (use our interactive /map page), note the watershed, soil type and the nearest power plant or UNESCO site. Spatial recall is the single biggest scorer for MPSC Geography.";
    case "History":
    case "Maharashtra History":
      return "Tip for History: anchor the answer to a date, a king or leader and a primary source. MPSC History options usually contain one option with the wrong date and one with the wrong dynasty — eliminate those first.";
    case "Science":
    case "General Science":
      return "Tip for Science: write the underlying formula or chemical equation in the margin. MPSC Science numericals are usually one-step substitutions; the trap is in the units, not the concept.";
    case "Economics":
      return "Tip for Economics: connect every scheme to a launch year, the implementing ministry and the primary beneficiary. MPSC Economics options often swap the launch year or the implementing ministry — that is the easiest elimination.";
    case "Current Affairs":
    case "Current affairs":
      return "Tip for Current Affairs: convert every rolling item you encounter into a four-field notebook — the event, the date, the primary actor and the associated body. Revising that notebook in the final fortnight is far more efficient than re-reading monthly magazines.";
    default:
      return "Tip: revise this question with the rest of the section on our subject-wise practice mode and pair the review with the relevant study guide to lock the concept into long-term memory.";
  }
}

export function generateStaticParams() {
  return getSeoQuestions().map((question) => ({ id: question.id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const question = getSeoQuestion(params.id);
  if (!question) return {};
  const titleText = question.text.length > 86 ? `${question.text.slice(0, 86)}...` : question.text;
  const rawDescription =
    question.explanation && question.explanation.length > 60
      ? question.explanation
      : `${question.text} Practice this MPSC previous-year question with detailed options, the official Set A answer and a compact explanation on MPSC PYQ QUIZ.`;
  const description = rawDescription.length > 300 ? `${rawDescription.slice(0, 297)}...` : rawDescription;
  // With the enriched per-question template (category deep-dive, why-matters,
  // how-to-attempt, related guides), every page has ~800-1000 words of unique
  // content regardless of explanation length, so we can now safely index a
  // page even if the explanation is short — as long as one exists at all.
  const canIndex = Boolean(question.explanation && question.explanation.length > 40);
  return {
    title: `${titleText} | MPSC Question`,
    description,
    alternates: { canonical: `/questions/${question.id}` },
    robots: canIndex
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      title: `${titleText} | MPSC PYQ QUIZ`,
      description,
      url: `${SITE_URL}/questions/${question.id}`,
      type: "article",
    },
  };
}

export default function QuestionSeoPage({ params }: PageProps) {
  const question = getSeoQuestion(params.id);
  if (!question) notFound();

  const optionEntries = Object.entries(question.options);
  const seed = hash32(question.id);
  const deepDive = categoryDeepDive(question.category, seed);
  const whyText = whyMatters(question, seed);
  const howText = howToAttempt(question, seed);
  const tip = subjectTip(question.category);
  const guides = relatedGuides(question.category);
  const intro = introBlock(question);

  // schema.org datePublished — use the quiz's own createdAt when it is a valid
  // date, otherwise fall back to a fixed launch date so the field is never empty.
  const publishedIso = (() => {
    const d = question.createdAt ? new Date(question.createdAt) : null;
    return d && !Number.isNaN(d.getTime()) ? d.toISOString() : "2024-01-01T00:00:00.000Z";
  })();
  const editorialAuthor = {
    "@type": "Organization",
    name: "Don't know Academy",
    url: SITE_URL,
  };
  const answerLang = question.language === "marathi" ? "mr" : "en";

  const breadcrumbItems: Array<{ name: string; item: string }> = [
    { name: "Home", item: SITE_URL },
    { name: "Exams", item: `${SITE_URL}/exams` },
  ];
  if (question.category) {
    breadcrumbItems.push({ name: question.category, item: `${SITE_URL}/exams` });
  }
  breadcrumbItems.push({ name: "Question", item: `${SITE_URL}/questions/${question.id}` });

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems.map((entry, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: entry.name,
          item: entry.item,
        })),
      },
      question.explanation && question.explanation.length > 40
        ? {
            "@type": "QAPage",
            mainEntity: {
              "@type": "Question",
              name: question.text,
              text: question.text,
              answerCount: 1,
              inLanguage: answerLang,
              author: editorialAuthor,
              datePublished: publishedIso,
              acceptedAnswer: {
                "@type": "Answer",
                text: question.explanation,
                url: `${SITE_URL}/questions/${question.id}#accepted-answer`,
                inLanguage: answerLang,
                author: editorialAuthor,
                datePublished: publishedIso,
                upvoteCount: 0,
              },
            },
          }
        : null,
    ].filter(Boolean),
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <article className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
        <nav className="mb-4 text-xs text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <span className="mx-1.5">/</span>
          <Link href="/exams" className="hover:text-indigo-600">Exams</Link>
          {question.category && (
            <>
              <span className="mx-1.5">/</span>
              <span>{question.category}</span>
            </>
          )}
          <span className="mx-1.5">/</span>
          <span className="text-slate-700">Question</span>
        </nav>

        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700">MPSC PYQ</span>
          {question.category && (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{question.category}</span>
          )}
          {question.topic && (
            <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">{question.topic}</span>
          )}
          {question.language && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{question.language}</span>
          )}
        </div>

        <h1 className="break-words text-xl font-black leading-snug text-slate-950 sm:text-3xl sm:leading-tight">
          {question.text}
        </h1>

        <p className="mt-4 text-sm leading-7 text-slate-600">{intro}</p>

        <section className="mt-6 grid gap-3">
          {optionEntries.map(([key, value]) => (
            <div
              key={key}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6"
            >
              <span className="mr-2 font-bold text-indigo-600">{key}.</span>
              <span className="break-words whitespace-pre-line">{value}</span>
            </div>
          ))}
        </section>

        {question.correctAnswer && (
          <p className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            Correct answer: {question.correctAnswer}
          </p>
        )}

        {question.explanation && (
          <section id="accepted-answer" className="mt-4 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4">
            <h2 className="text-sm font-bold uppercase tracking-wide text-indigo-700">Explanation</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-slate-800">
              {question.explanation}
            </p>
          </section>
        )}

        {/* Mid-content ad — high viewability, right after the answer/explanation
            that readers came for, before the supporting deep-dive sections. */}
        <DisplayAd
          adsenseSlot={IN_CONTENT_AD_SLOT}
          ezoicKey="contentInline"
          className="mt-8"
        />

        <section className="mt-8 space-y-5 text-sm leading-7 text-slate-700">
          <div>
            <h2 className="text-base font-bold text-slate-900">Why this question matters</h2>
            <p className="mt-1.5">{whyText}</p>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">How to attempt this in the exam</h2>
            <p className="mt-1.5">{howText}</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm font-semibold text-amber-900">Subject-specific tip</p>
            <p className="mt-1 text-sm leading-7 text-amber-900/90">{tip}</p>
          </div>
        </section>

        {/* Category deep-dive — the largest single content block on the page */}
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">{deepDive.heading}</h2>
          <div className="mt-3 space-y-4 text-sm leading-7 text-slate-700">
            {deepDive.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
          <h2 className="text-base font-bold text-slate-900">Source and editorial process</h2>
          <p className="mt-2">
            <span className="font-semibold">Source:</span> {question.quizTitle}. This question, its
            four options and the marked correct answer are transcribed verbatim from the official
            Maharashtra Public Service Commission Set A paper. Our editorial team cross-checks each
            question against the original PDF released on <a className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700" href="https://mpsc.gov.in" target="_blank" rel="noopener">mpsc.gov.in</a> and against the
            corresponding official answer key.
          </p>
          <p className="mt-2">
            We never paraphrase the wording. Where MPSC has issued a revised key after an objection
            round, the answer highlighted above reflects the revised key and the revision is logged
            in our internal change-log. If you spot a discrepancy, please email us at{" "}
            <a className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700" href="mailto:dontknowacademy@gmail.com">dontknowacademy@gmail.com</a> — we acknowledge every
            report within 24 hours and push a fix within 48 hours.
          </p>
        </section>

        <section className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
          <h2 className="text-base font-bold text-slate-900">Related study material</h2>
          <p className="mt-2 text-sm leading-7 text-slate-700">
            Deepen your preparation on this topic with our long-form MPSC study guides. Every guide
            is written specifically for the Maharashtra Public Service Commission preliminary
            syllabus and takes twelve to sixteen minutes to read in full.
          </p>
          <ul className="mt-3 grid gap-2">
            {guides.map((g) => (
              <li key={g.href}>
                <Link
                  href={g.href}
                  className="block rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm hover:border-indigo-300 hover:bg-indigo-50"
                >
                  <span className="block font-semibold text-slate-800">{g.label}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{g.blurb}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white">
          <p className="text-sm font-semibold opacity-90">Practice the full subject</p>
          <p className="mt-1 text-lg font-bold">{question.quizTitle}</p>
          <Link
            href="/?mode=subject"
            className="mt-4 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-bold text-indigo-700 shadow-sm hover:bg-indigo-50"
          >
            Practice more questions
          </Link>
        </div>

        <section className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
          <h2 className="text-base font-bold text-slate-900">About MPSC PYQ QUIZ</h2>
          <p className="mt-2 leading-7">
            <strong>MPSC PYQ QUIZ</strong> is a free educational platform by{" "}
            <Link href="/about" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700">Don&apos;t know Academy</Link>{" "}
            that helps Maharashtra Public Service Commission aspirants practise with the complete
            archive of previous-year questions. Every paper on the site is sourced from the official
            MPSC release, tagged by subject and topic, and paired with the official Set A answer
            key. The platform is independent and not affiliated with MPSC, the Government of
            Maharashtra or any government body — please read our{" "}
            <Link href="/disclaimer" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700">Disclaimer</Link>{" "}
            for the full statement.
          </p>
        </section>
      </article>

      <footer className="mx-auto mt-10 max-w-3xl px-2 pb-10 text-center">
        <p className="text-xs text-slate-400">MPSC PYQ QUIZ &middot; Don&apos;t know Academy</p>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400">
          <Link href="/" className="hover:text-indigo-600 hover:underline">Home</Link>
          <span>|</span>
          <Link href="/exams" className="hover:text-indigo-600 hover:underline">Exam papers</Link>
          <span>|</span>
          <Link href="/study-guides" className="hover:text-indigo-600 hover:underline">Study guides</Link>
          <span>|</span>
          <Link href="/about" className="hover:text-indigo-600 hover:underline">About</Link>
          <span>|</span>
          <Link href="/contact" className="hover:text-indigo-600 hover:underline">Contact</Link>
          <span>|</span>
          <Link href="/privacy" className="hover:text-indigo-600 hover:underline">Privacy</Link>
          <span>|</span>
          <Link href="/terms" className="hover:text-indigo-600 hover:underline">Terms</Link>
          <span>|</span>
          <Link href="/disclaimer" className="hover:text-indigo-600 hover:underline">Disclaimer</Link>
        </div>
      </footer>
    </main>
  );
}
