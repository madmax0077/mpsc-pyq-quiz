import Link from "next/link";
import type { Metadata } from "next";
import DisplayAd from "@/components/DisplayAd";
import StudyGuideCallout from "@/components/StudyGuideCallout";
import StudyGuideLangTabs from "@/components/StudyGuideLangTabs";
import StudyGuideShell from "@/components/StudyGuideShell";
import StudyGuideTable from "@/components/StudyGuideTable";
import { IN_CONTENT_AD_SLOT } from "@/lib/adsConfig";

export const metadata: Metadata = {
  title:
    "Talathi Bharti 2026 — 1539 Posts, Strategy Guide (English + Marathi) | तलाठी भरती",
  description:
    "Bilingual Talathi Bharti 2026 guide in English and Marathi: about 1,539 Gram Mahsul Adhikari posts, Group C Combined exam reality, Land Revenue advantage, and a 90-day preparation plan.",
  keywords: [
    "Talathi Bharti 2026",
    "तलाठी भरती 2026",
    "MPSC Talathi 2026",
    "1539 Talathi posts",
    "Gram Mahsul Adhikari",
    "तलाठी परीक्षा तयारी",
    "Maharashtra Land Revenue Code",
    "MPSC Group C Talathi",
    "तलाठी अभ्यास योजना",
  ],
  alternates: { canonical: "/study-guides/mpsc-talathi-bharti-2026" },
};

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "How many Talathi vacancies are there in 2026? / २०२६ मध्ये तलाठीच्या किती जागा आहेत?",
    a: "MPSC’s Group C corrigendum added about 1,539 Talathi (Gram Mahsul Adhikari) posts. Always confirm the exact number on mpsc.gov.in. एमपीएससीच्या गट-क दुरुस्तीपत्रकानुसार सुमारे १,५३९ तलाठी (ग्राम महसूल अधिकारी) जागा आहेत. अचूक आकडा mpsc.gov.in वर तपासा.",
  },
  {
    q: "Is Talathi a separate exam in 2026? / २०२६ मध्ये तलाठी स्वतंत्र परीक्षा आहे का?",
    a: "For 2026, Talathi is part of the Maharashtra Group-C Services Combined framework. Start with Combined prelims preparation. २०२६ मध्ये तलाठी महाराष्ट्र गट-क सेवा Combined चौकटीत आहे. आधी Combined पूर्वपरीक्षेनुसार तयारी करा.",
  },
  {
    q: "What gives the biggest scoring advantage? / गुणवाढीसाठी सर्वात उपयुक्त काय आहे?",
    a: "Maharashtra Land Revenue Code basics, 7/12 extract logic, and mutation vocabulary. Generic Group C aspirants often skip these. महाराष्ट्र जमीन महसूल संहिता, सात-बारा आणि फेरफार यांची समज. सामान्य गट-क उमेदवार हे विषय सहसा वगळतात.",
  },
  {
    q: "Where can I practise for free? / मोफत सराव कुठे करता येईल?",
    a: "On mpscs.in — Group C previous year papers, timed mocks, and Maharashtra History, Geography and Polity guides. mpscs.in वर गट-क मागील पेपर्स, मॉक टेस्ट आणि महाराष्ट्र इतिहास, भूगोल व राज्यव्यवस्था मार्गदर्शक उपलब्ध आहेत.",
  },
];

function EnglishBody() {
  return (
    <>
      <h2>Talathi Bharti 2026: 1,539 Village Posts, One Combined Exam Gate</h2>
      <p className="!mt-2 !text-sm !text-slate-500 dark:!text-slate-400">
        Last updated: August 2026 · Reading time: about 16 minutes
      </p>

      <p>
        Every monsoon, somewhere in rural Maharashtra, a farmer walks into a Talathi office with a
        crumpled photocopy of a 7/12 extract and a question that can change his family’s next ten
        years: <em>Is this my land? Can I sell it? Will the bank accept this mutation?</em> The
        officer who answers is not the District Collector. It is the{" "}
        <strong>Talathi — Gram Mahsul Adhikari</strong> — the village-level revenue officer of the
        state.
      </p>
      <p>
        That is why <strong>Talathi Bharti 2026</strong> is not just another Group C post. The work
        is local, the public respect is real, and the competition is intense. This year, MPSC’s Group
        C corrigendum brought <strong>about 1,539 Talathi posts</strong> into the Combined
        recruitment process. That number was large enough to revive many unfinished study plans across
        Maharashtra.
      </p>

      <StudyGuideCallout>
        <strong>Important reality:</strong> more vacancies do not make the exam easier. They usually
        mean more applications and a larger Combined candidate pool. Selected candidates focus on a
        Talathi-specific advantage — especially the{" "}
        <strong>Maharashtra Land Revenue Code</strong> and land-record concepts.
      </StudyGuideCallout>

      <p>
        This bilingual guide explains that advantage clearly. You can practise for free on{" "}
        <Link href="/">mpscs.in</Link>. For the basic syllabus overview, also read{" "}
        <Link href="/study-guides/mpsc-talathi-exam">MPSC Talathi Exam</Link>.
      </p>

      <DisplayAd
        adsenseSlot={IN_CONTENT_AD_SLOT}
        ezoicKey="contentInline"
        className="my-8 not-prose"
      />

      <h3>1. What candidates are searching for</h3>
      <ul>
        <li>Talathi Bharti 2026 / तलाठी भरती 2026</li>
        <li>MPSC Talathi vacancy / 1,539 posts</li>
        <li>Talathi syllabus and exam pattern</li>
        <li>Talathi versus Group C</li>
      </ul>

      <h3>2. The 2026 reality: Talathi inside Group C Combined</h3>
      <p>
        In 2026, Talathi recruitment is linked to the larger Group C Combined process. Many reports
        mention an offline OMR prelims window around <strong>25 October 2026</strong>, but you should
        confirm the date in the official PDF. You are competing in a Combined candidate pool, so
        prepare first for{" "}
        <Link href="/study-guides/mpsc-group-c-exam-pattern-2026">Group C prelims</Link>, then build
        your revenue-subject advantage.
      </p>
      <p>
        Official source:{" "}
        <a href="https://mpsc.gov.in" target="_blank" rel="noopener noreferrer">
          mpsc.gov.in
        </a>
        .
      </p>

      <h3>3. Why Talathi attracts a different kind of aspirant</h3>
      <p>
        Salary alone does not explain the demand. Culture does. The post is tied to crop seasons,
        farm loans, inheritance disputes, survey corrections and the quiet authority of land records.
        The common mistake is to admire the post and neglect exam practice. Respect for the job will
        not fill your OMR sheet.
      </p>

      <h3>4. Scoring map</h3>
      <StudyGuideTable
        headers={["Section", "What it tests", "What toppers do"]}
        rows={[
          ["Marathi", "Grammar, vocabulary and comprehension", "Study 30–40 minutes every day"],
          ["English", "Grammar and reading passages", "Focus on error spotting more than word lists"],
          [
            "General Knowledge",
            "Maharashtra history and geography, polity, science, current affairs and revenue basics",
            "Give priority to Maharashtra topics and Land Revenue notes",
          ],
          ["Maths / Intelligence", "Speed arithmetic and reasoning", "Practise a short set every day"],
        ]}
      />
      <p>
        Use the{" "}
        <Link href="/study-guides/mpsc-group-c-subject-wise-weightage">subject-wise weightage</Link>{" "}
        guide to plan your weekly marks target.
      </p>

      <h3>5. Your real advantage: Land Revenue literacy</h3>
      <h4>7/12 (सात-बारा)</h4>
      <p>What it shows, why banks ask for it, and the common doubts students must clear.</p>
      <h4>Mutation / फेरफार</h4>
      <p>When ownership changes in the land record and why that entry matters.</p>
      <h4>Survey number and gat number</h4>
      <p>Basic meaning and how these numbers are used in village land records.</p>
      <h4>Maharashtra Land Revenue Code</h4>
      <p>Selected definitions and officer-related terms that help in exam questions.</p>
      <h4>Crop inspection and damage assessment</h4>
      <p>Local administration words linked to crop inspection and compensation work.</p>
      <p>
        You do not need to become a revenue lawyer. You simply need to understand the professional
        language of the Talathi’s work.
      </p>

      <h3>6. Cut-off thinking without fake predictions</h3>
      <ul>
        <li>When negative marking applies, accuracy matters more than blind attempts</li>
        <li>Your own mock-test score range is more useful than a viral “safe score”</li>
        <li>Prepare for a difficult paper, not an easy one</li>
      </ul>
      <p>
        Read the <Link href="/study-guides/mpsc-negative-marking">negative marking</Link> guide once,
        then apply the same rule in every mock test.
      </p>

      <h3>7. A practical 90-day plan</h3>
      <h4>Days 1–30 — Foundation</h4>
      <ul>
        <li>Practise Marathi and English grammar every day</li>
        <li>Build a base in Maharashtra Geography and History</li>
        <li>Solve arithmetic and about 15 reasoning questions daily</li>
        <li>Start a short Land Revenue glossary</li>
        <li>Take one sectional test every weekend</li>
      </ul>
      <h4>Days 31–60 — Pattern and pressure</h4>
      <ul>
        <li>
          Solve timed <Link href="/exams">Group C previous year papers</Link>
        </li>
        <li>Cover Maharashtra schemes and limited national current affairs</li>
        <li>
          Revise polity from <Link href="/study-guides/indian-polity-for-mpsc">Indian Polity</Link>
        </li>
        <li>
          Take two mock tests each week in <Link href="/?mode=mock">mock mode</Link>
        </li>
      </ul>
      <h4>Days 61–90 — Selection mode</h4>
      <ul>
        <li>Revise only from your error notebook</li>
        <li>Practise OMR discipline and revise Land Revenue notes</li>
        <li>Protect your sleep in the final 10 days</li>
      </ul>

      <h3>8. Common mistakes</h3>
      <ol>
        <li>Relying only on old district Talathi PDFs and ignoring Combined pattern changes</li>
        <li>Collecting many PDFs but completing no timed papers</li>
        <li>Ignoring Marathi because you already speak it</li>
        <li>Studying national current affairs like a UPSC aspirant and skipping Maharashtra administration</li>
        <li>Waiting for final vacancy clarity before starting mock tests</li>
      </ol>

      <h3>9. Free practice on this site</h3>
      <ul>
        <li>
          <Link href="/exams">Exam papers hub</Link>
        </li>
        <li>
          <Link href="/?mode=mock">Mock tests</Link>
        </li>
        <li>
          <Link href="/study-guides/maharashtra-geography">Maharashtra Geography</Link>
          {" · "}
          <Link href="/study-guides/maharashtra-history">Maharashtra History</Link>
          {" · "}
          <Link href="/study-guides/mpsc-talathi-exam">Talathi overview</Link>
        </li>
      </ul>

      <h3>Conclusion</h3>
      <p>
        About 1,539 posts can change family conversations at the dinner table. They cannot rescue an
        unprepared answer sheet. Build Combined prelims fitness, protect your language marks, and
        develop the Land Revenue advantage while others are still debating vacancy graphics.
      </p>
    </>
  );
}

function MarathiBody() {
  return (
    <>
      <h2>तलाठी भरती २०२६: १,५३९ गावपातळीच्या जागा, एक Combined परीक्षा दरवाजा</h2>
      <p className="!mt-2 !text-sm !text-slate-500 dark:!text-slate-400">
        अद्यतन: ऑगस्ट २०२६ · अंदाजे वाचन वेळ: १६ मिनिटे
      </p>

      <p>
        प्रत्येक पावसाळ्यात महाराष्ट्रातील एखाद्या गावात शेतकरी तलाठी कार्यालयात येतो. हातात सात-बाराची
        झेरॉक्स असते आणि एकच प्रश्न असतो: <em>ही जमीन माझी आहे का? मी ती विकू शकतो का? बँक हा फेरफार
        स्वीकारेल का?</em> या प्रश्नाचे उत्तर जिल्हाधिकारी देत नाही. उत्तर देतो{" "}
        <strong>तलाठी — ग्राम महसूल अधिकारी</strong>. तो राज्याच्या महसूल व्यवस्थेतील गावपातळीवरील
        महत्त्वाचा अधिकारी असतो.
      </p>
      <p>
        म्हणूनच <strong>तलाठी भरती २०२६</strong> ही फक्त आणखी एक गट-क जागा नाही. हे काम स्थानिक आहे,
        समाजातील मान सन्मान स्पष्ट आहे आणि स्पर्धा तीव्र आहे. यावर्षी एमपीएससीच्या गट-क
        दुरुस्तीपत्रकानुसार <strong>सुमारे १,५३९ तलाठी जागा</strong> Combined भरती प्रक्रियेत आल्या.
        हा आकडा पुरेसा मोठा होता की राज्यातील अनेक अर्धवट अभ्यास योजना पुन्हा सुरू झाल्या.
      </p>

      <StudyGuideCallout>
        <strong>महत्त्वाचे वास्तव:</strong> जागा जास्त असल्यामुळे परीक्षा आपोआप सोपी होत नाही. उलट,
        अर्ज जास्त होतात आणि Combined उमेदवारांचा समूह मोठा होतो. निवड होणाऱ्या उमेदवारांना तलाठीची
        खास तयारी लागते — विशेषतः <strong>महाराष्ट्र जमीन महसूल संहिता</strong> आणि जमिनीच्या
        नोंदींची समज.
      </StudyGuideCallout>

      <p>
        हे द्विभाषिक मार्गदर्शक तीच तयारी स्पष्ट करते. मोफत सरावासाठी{" "}
        <Link href="/">mpscs.in</Link> वापरा. अभ्यासक्रमाच्या मूलभूत माहितीसाठी{" "}
        <Link href="/study-guides/mpsc-talathi-exam">MPSC Talathi Exam</Link> पण वाचा.
      </p>

      <DisplayAd
        adsenseSlot={IN_CONTENT_AD_SLOT}
        ezoicKey="contentInline"
        className="my-8 not-prose"
      />

      <h3>१. उमेदवार काय शोधत आहेत</h3>
      <ul>
        <li>तलाठी भरती २०२६ / Talathi Bharti 2026</li>
        <li>एमपीएससी तलाठी जागा / १,५३९ जागा</li>
        <li>तलाठी अभ्यासक्रम आणि परीक्षा पद्धत</li>
        <li>तलाठी आणि गट-क यातील संबंध</li>
      </ul>

      <h3>२. २०२६ चे वास्तव: तलाठी आता Group C Combined मध्ये</h3>
      <p>
        २०२६ मध्ये तलाठी भरती गट-क Combined प्रक्रियेशी जोडलेली आहे. Offline OMR पूर्वपरीक्षेची
        तारीख अनेक ठिकाणी <strong>२५ ऑक्टोबर २०२६</strong> अशी नमूद आहे, पण अधिकृत PDF वरूनच
        खात्री करा. तुम्ही आता Combined उमेदवार समुदायात स्पर्धा करत आहात. म्हणून आधी{" "}
        <Link href="/study-guides/mpsc-group-c-exam-pattern-2026">गट-क पूर्वपरीक्षा</Link> पद्धतीने
        तयारी करा आणि नंतर महसूल विषयातील फरक स्पष्ट करा.
      </p>
      <p>
        अधिकृत स्रोत:{" "}
        <a href="https://mpsc.gov.in" target="_blank" rel="noopener noreferrer">
          mpsc.gov.in
        </a>
        .
      </p>

      <h3>३. तलाठी पदाला वेगळी ओढ का आहे</h3>
      <p>
        फक्त पगारामुळे ही ओढ निर्माण होत नाही. सामाजिक वास्तवही महत्त्वाचे आहे. हे पद पिकांच्या
        हंगामाशी, शेती कर्जांशी, वारसाहक्काशी, मोजणी सुधारणांशी आणि जमिनीच्या नोंदींच्या अधिकाराशी
        जोडलेले आहे. सर्वात मोठी चूक म्हणजे पदाचे कौतुक करणे आणि परीक्षेचा सराव दुर्लक्षित करणे.
        पदाचा मान सन्मान उत्तरपत्रिका भरत नाही.
      </p>

      <h3>४. गुणवाढीचा नकाशा</h3>
      <StudyGuideTable
        headers={["विभाग", "काय तपासले जाते", "यशस्वी उमेदवार काय करतात"]}
        rows={[
          ["मराठी", "व्याकरण, शब्दसंग्रह आणि आकलन", "दररोज ३० ते ४० मिनिटे अभ्यास"],
          ["इंग्रजी", "व्याकरण आणि वाचन परिच्छेद", "शब्द याद्यांपेक्षा error spotting वर भर"],
          [
            "सामान्य ज्ञान",
            "महाराष्ट्राचा इतिहास-भूगोल, राज्यव्यवस्था, विज्ञान, चालू घडामोडी आणि महसूल मूलतत्त्वे",
            "महाराष्ट्र केंद्रित अभ्यास आणि जमीन महसूल नोट्स",
          ],
          ["गणित / बुद्धिमत्ता", "वेगवान अंकगणित आणि तर्क", "दररोज थोडा नियमित सराव"],
        ]}
      />
      <p>
        साप्ताहिक गुण उद्दिष्ट ठरवण्यासाठी{" "}
        <Link href="/study-guides/mpsc-group-c-subject-wise-weightage">विषयनिहाय वजन</Link>{" "}
        मार्गदर्शक वापरा.
      </p>

      <h3>५. खरी फायदा: जमीन महसूल समज</h3>
      <h4>सात-बारा (७/१२)</h4>
      <p>त्यात काय असते, बँक का मागते आणि सामान्य शंका काय असतात.</p>
      <h4>फेरफार</h4>
      <p>मालकी हक्क नोंदीत कधी बदलतो.</p>
      <h4>सर्व्हे नंबर आणि गट नंबर</h4>
      <p>यांची मूलभूत समज आणि गाव नोंदीत त्यांचा उपयोग.</p>
      <h4>महाराष्ट्र जमीन महसूल संहिता</h4>
      <p>संहितेतील निवडक व्याख्या आणि अधिकाऱ्यांशी संबंधित महत्त्वाचे शब्द.</p>
      <h4>पिक तपासणी आणि नुकसानभरपाई</h4>
      <p>स्थानिक प्रशासनाशी संबंधित शब्द आणि संकल्पना.</p>
      <p>
        तुम्हाला वकील व्हायचे नाही. फक्त तलाठीच्या कामाच्या भाषेत तुम्ही अनोळखी राहू नये, एवढेच
        अपेक्षित आहे.
      </p>

      <h3>६. कटऑफबाबत योग्य विचार</h3>
      <ul>
        <li>नकारात्मक गुणदान असल्यास अचूकता महत्त्वाची; आंधळे प्रयत्न नव्हे</li>
        <li>वायरल “सेफ स्कोअर”पेक्षा स्वतःच्या मॉक चाचण्यांतील सरासरी उपयुक्त</li>
        <li>सोप्या पेपरची वाट न पाहता कठीण पेपरसाठी तयारी करा</li>
      </ul>
      <p>
        <Link href="/study-guides/mpsc-negative-marking">नकारात्मक गुणदान</Link> मार्गदर्शक एकदा
        नीट वाचा आणि प्रत्येक मॉक टेस्टमध्ये तीच शिस्त पाळा.
      </p>

      <h3>७. व्यवहार्य ९० दिवसांची योजना</h3>
      <h4>दिवस १ ते ३० — पाया</h4>
      <ul>
        <li>दररोज मराठी आणि इंग्रजी व्याकरण</li>
        <li>महाराष्ट्र भूगोल आणि इतिहास यांचा पाया तयार करा</li>
        <li>अंकगणित आणि दररोज सुमारे १५ तर्क प्रश्न सोडवा</li>
        <li>जमीन महसूल शब्दकोश सुरू करा</li>
        <li>दर रविवारी एक विभागीय चाचणी द्या</li>
      </ul>
      <h4>दिवस ३१ ते ६० — पॅटर्न आणि दबाव</h4>
      <ul>
        <li>
          टाइमर लावून <Link href="/exams">गट-क मागील पेपर्स</Link> सोडवा
        </li>
        <li>महाराष्ट्राच्या योजना आणि मर्यादित राष्ट्रीय चालू घडामोडी वाचा</li>
        <li>
          <Link href="/study-guides/indian-polity-for-mpsc">राज्यव्यवस्था</Link> मार्गदर्शकातून
          पुनरावृत्ती करा
        </li>
        <li>
          आठवड्यातून दोन मॉक टेस्ट द्या — <Link href="/?mode=mock">mock mode</Link>
        </li>
      </ul>
      <h4>दिवस ६१ ते ९० — निवड मोड</h4>
      <ul>
        <li>फक्त चुकांच्या वहीतून पुनरावृत्ती करा</li>
        <li>OMR शिस्त आणि जमीन महसूल नोट्स यावर भर द्या</li>
        <li>शेवटच्या दहा दिवसांत झोपेची काळजी घ्या</li>
      </ul>

      <h3>८. सामान्य चुका</h3>
      <ol>
        <li>फक्त जुन्या जिल्हा तलाठी PDF वर अवलंबून राहणे आणि Combined बदलांकडे दुर्लक्ष करणे</li>
        <li>अनेक PDF गोळा करणे पण टाइमरवर एकही पेपर न सोडवणे</li>
        <li>“मी मराठी बोलतो” म्हणून मराठी अभ्यास दुर्लक्षित करणे</li>
        <li>UPSC सारखा राष्ट्रीय चालू घडामोडींचा अभ्यास करणे आणि महाराष्ट्र प्रशासन वगळणे</li>
        <li>मॉक टेस्ट सुरू करण्यापूर्वी अंतिम जागांची वाट पाहणे</li>
      </ol>

      <h3>९. या संकेतस्थळावरील मोफत सराव</h3>
      <ul>
        <li>
          <Link href="/exams">परीक्षा पेपर्स</Link>
        </li>
        <li>
          <Link href="/?mode=mock">मॉक टेस्ट</Link>
        </li>
        <li>
          <Link href="/study-guides/maharashtra-geography">महाराष्ट्र भूगोल</Link>
          {" · "}
          <Link href="/study-guides/maharashtra-history">महाराष्ट्र इतिहास</Link>
          {" · "}
          <Link href="/study-guides/mpsc-talathi-exam">तलाठी आढावा</Link>
        </li>
      </ul>

      <h3>समारोप</h3>
      <p>
        सुमारे १,५३९ जागा कुटुंबातील चर्चा बदलू शकतात. पण अपुरी तयारी असलेली उत्तरपत्रिका बदलत
        नाहीत. Combined पूर्वपरीक्षेची क्षमता तयार करा, भाषा विषयातील गुण वाचवा आणि जमीन महसूलातील
        फायदा मिळवा — इतर अजून जागांच्या आकृत्यांवर चर्चा करत असताना.
      </p>
    </>
  );
}

export default function TalathiBharti2026Blog() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <StudyGuideShell
      title="Talathi Bharti 2026 · तलाठी भरती"
      subtitle="English + मराठी · about 16 min read"
      faq={FAQ}
      faqSchema={faqSchema}
    >
      <StudyGuideLangTabs english={<EnglishBody />} marathi={<MarathiBody />} />
    </StudyGuideShell>
  );
}
