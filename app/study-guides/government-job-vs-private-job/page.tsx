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
    "Government Job vs Private Job Salary — MPSC Career Reality Check (English + Marathi)",
  description:
    "Honest comparison of Maharashtra government jobs (MPSC Group B/C) versus private-sector offers: year-one pay, DA-linked growth, NPS, job security and 25-year value — with real Group B basic ₹38,600 and DA ~60% anchors.",
  keywords: [
    "government job vs private job",
    "government job vs private job salary",
    "MPSC job vs private job",
    "शासकीय नोकरी विरुद्ध खाजगी नोकरी",
    "government job benefits India",
    "is government job better than private",
    "MPSC career worth it",
    "stable career after MPSC",
  ],
  alternates: { canonical: "/study-guides/government-job-vs-private-job" },
};

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "Is a private job always higher paying in year one? / पहिल्या वर्षी खाजगी पगार नेहमी जास्त असतो का?",
    a: "In large metros, many private offers can beat a new Group B in-hand band on paper. That is often true for IT/finance roles. It is less true when you compare a mid-tier private job outside metros with MPSC Group B after DA and HRA. शहरातील अनेक खाजगी ऑफर पहिल्या वर्षी जास्त दिसू शकतात; सर्व खाजगी नोकऱ्यांसाठी हे खरे नसते.",
  },
  {
    q: "What unique money advantage does a Maharashtra government job have in 2026? / २०२६ मध्ये शासकीय नोकरीचा खास आर्थिक फायदा काय?",
    a: "Contractual DA revisions (state DA reported at 60% of basic from 1 Jan 2026), annual increments, and NPS with employer contribution — plus near-zero layoff risk. करारबद्ध महागाई भत्ता (जानेवारी २०२६ पासून ~६०%), वार्षिक वाढ आणि शासकीय योगदानासह NPS.",
  },
];

function EnglishBody() {
  return (
    <>
      <h2>Government Job vs Private Job — An MPSC Aspirant’s Honest Comparison</h2>
      <p className="!mt-2 !text-sm !text-slate-500 dark:!text-slate-400">
        Last updated: August 2026 · Reading time: about 9 minutes
      </p>

      <p>
        If you only compare the first payslip, a private offer in Pune or Mumbai can look more
        attractive than an MPSC Group B joining package. If you compare{" "}
        <strong>25 years of income certainty, DA-linked growth and retirement savings</strong>, the
        picture often flips. This page is written for MPSC aspirants who need a decision framework —
        not motivational slogans.
      </p>

      <StudyGuideCallout>
        <strong>Numbers used as anchors:</strong> Combined Group B entry basic commonly{" "}
        <strong>₹38,600 (S-14)</strong>; with state DA reported at <strong>60%</strong> from 1 Jan
        2026, basic+DA alone is about <strong>₹61,760</strong> before HRA. Talathi entry basic
        commonly <strong>₹25,500</strong>. Private figures below are illustrative metro bands, not
        one company’s offer letter.
      </StudyGuideCallout>

      <h3>1. Year-one cash comparison</h3>
      <StudyGuideTable
        headers={["Path", "~ Year-one monthly cash", "What drives it"]}
        rows={[
          [
            "MPSC Group B (PSI/STI/ASO)",
            "₹55,000 – ₹70,000 in-hand (city dependent)",
            "Basic ₹38,600 + DA ~60% + HRA − deductions",
          ],
          [
            "MPSC Talathi (Group C)",
            "₹32,000 – ₹42,000 in-hand",
            "Basic ₹25,500 + DA + lower rural HRA",
          ],
          [
            "Private (metro, mid-tier)",
            "₹40,000 – ₹80,000 CTC-linked",
            "Company, skill, city; variable appraisal",
          ],
          [
            "Private (metro, high-skill IT/finance)",
            "₹80,000 – ₹1,50,000+ CTC possible",
            "Can beat government year-one cash clearly",
          ],
        ]}
      />

      <DisplayAd
        adsenseSlot={IN_CONTENT_AD_SLOT}
        ezoicKey="contentInline"
        className="my-8 not-prose"
      />

      <h3>2. Growth over time — where government pulls ahead</h3>
      <ul>
        <li>
          <strong>DA revisions</strong> raise pay for everyone in service when the state revises the
          percentage (example path: 58% from July 2025 → 60% from Jan 2026 in reported state
          decisions).
        </li>
        <li>
          <strong>~3% annual increment</strong> on basic is built into the matrix logic.
        </li>
        <li>
          <strong>Promotions</strong> change pay level entirely (see{" "}
          <Link href="/study-guides/mpsc-promotion-path-after-selection">promotion path</Link>).
        </li>
        <li>
          Private growth depends on appraisals, switching jobs and market cycles — higher upside,
          higher variance.
        </li>
      </ul>

      <h3>3. Non-salary value that still counts as money</h3>
      <StudyGuideTable
        headers={["Factor", "Maharashtra government (typical)", "Private (typical)"]}
        rows={[
          ["Layoff risk", "Very low after confirmation", "Real in downturns"],
          ["Retirement", "NPS with employer contribution", "Mostly self-funded"],
          ["Medical", "Government medical frameworks", "Depends on employer policy"],
          ["Housing", "HRA or quarters for many posts", "Fully self-paid rent"],
          ["Loan / social standing", "Often stronger for government IDs", "Varies by employer brand"],
        ]}
      />

      <h3>4. When private still wins</h3>
      <p>
        Choose private (or keep a private job while preparing) if you already have a high-skill
        metro offer with clear skill growth, you dislike field/transfer life, or you value faster
        cash in the first 5 years more than certainty. MPSC is a long-horizon bet, not a get-rich
        scheme.
      </p>

      <h3>5. A simple decision rule for aspirants</h3>
      <ul>
        <li>
          If your realistic private alternative is below ~₹50,000 stable take-home in your city,
          Group B’s package + security is often competitive even in year one.
        </li>
        <li>
          If you hold a strong IT/finance offer above ~₹1 lakh CTC with growth, treat MPSC as a
          values/security choice, not a pure salary upgrade.
        </li>
        <li>
          Compare posts properly on{" "}
          <Link href="/study-guides/mpsc-psi-sti-aso-talathi-salary-comparison">
            PSI / STI / ASO / Talathi salary comparison
          </Link>
          .
        </li>
      </ul>

      <h3>Next steps</h3>
      <ul>
        <li>
          <Link href="/study-guides/mpsc-salary-pay-scale">MPSC Salary &amp; Pay Scale</Link>
        </li>
        <li>
          <Link href="/study-guides/mpsc-preparation-strategy">MPSC Preparation Strategy</Link>
        </li>
        <li>
          Free practice: <Link href="/exams">/exams</Link>
        </li>
      </ul>
    </>
  );
}

function MarathiBody() {
  return (
    <>
      <h2>शासकीय नोकरी विरुद्ध खाजगी नोकरी — एमपीएससी उमेदवारासाठी प्रामाणिक तुलना</h2>
      <p className="!mt-2 !text-sm !text-slate-500 dark:!text-slate-400">
        अद्यतन: ऑगस्ट २०२६ · अंदाजे वाचन वेळ: ९ मिनिटे
      </p>

      <p>
        फक्त पहिली पे-स्लिप पाहिली तर पुणे/मुंबईतील खाजगी ऑफर एमपीएससी गट-ब पेक्षा आकर्षक दिसू
        शकते. पण <strong>२५ वर्षांची उत्पन्नाची हमी, महागाई भत्त्याशी जोडलेली वाढ आणि निवृत्ती
        बचत</strong> पाहिली की चित्र अनेकदा बदलते. हे पान घोषणाबाजी नव्हे, निर्णय चौकट आहे.
      </p>

      <StudyGuideCallout>
        <strong>आधार आकडे:</strong> Combined गट-ब सुरुवातीचे मूळ वेतन सहसा{" "}
        <strong>₹३८,६०० (S-14)</strong>; १ जानेवारी २०२६ पासून नोंदवलेला राज्य DA{" "}
        <strong>६०%</strong> असल्यास मूळ+DA ≈ <strong>₹६१,७६०</strong> (HRA आधी). तलाठी मूळ{" "}
        <strong>₹२५,५००</strong>. खाजगी आकडे शहरातील उदाहरण श्रेणी आहेत, एका कंपनीची ऑफर नाहीत.
      </StudyGuideCallout>

      <h3>१. पहिल्या वर्षाची रोख तुलना</h3>
      <StudyGuideTable
        headers={["मार्ग", "~ पहिले वर्ष मासिक", "काय ठरवते"]}
        rows={[
          ["एमपीएससी गट-ब (PSI/STI/ASO)", "₹५५,००० – ₹७०,००० हातात", "मूळ ₹३८,६०० + DA ~६०% + HRA − कपात"],
          ["तलाठी (गट-क)", "₹३२,००० – ₹४२,००० हातात", "मूळ ₹२५,५०० + DA + कमी ग्रामीण HRA"],
          ["खाजगी (शहर, मध्यम)", "₹४०,००० – ₹८०,००० CTC-संबंधित", "कंपनी, कौशल्य, शहर"],
          ["खाजगी (शहर, उच्च कौशल्य IT/वित्त)", "₹८०,००० – ₹१,५०,०००+ CTC शक्य", "पहिल्या वर्षी शासकीय रोख ओलांडू शकते"],
        ]}
      />

      <DisplayAd
        adsenseSlot={IN_CONTENT_AD_SLOT}
        ezoicKey="contentInline"
        className="my-8 not-prose"
      />

      <h3>२. कालांतराने वाढ — शासकीय बाजू कुठे मजबूत</h3>
      <ul>
        <li>
          <strong>महागाई भत्त्यातील सुधारणा</strong> (उदा. जुलै २०२५ पासून ५८% → जानेवारी २०२६
          पासून ६०% असे नोंदवलेले निर्णय).
        </li>
        <li>
          मॅट्रिक्समधील <strong>~३% वार्षिक वाढ</strong>.
        </li>
        <li>
          <strong>पदोन्नती</strong> वेतनस्तरच बदलते (
          <Link href="/study-guides/mpsc-promotion-path-after-selection">पदोन्नती मार्ग</Link>).
        </li>
        <li>खाजगी वाढ मूल्यमापन, जॉब स्विच आणि बाजारावर अवलंबून — वरची मर्यादा जास्त, अनिश्चितताही जास्त.</li>
      </ul>

      <h3>३. पगाराबाहेरील पण पैशासारखे मूल्य</h3>
      <StudyGuideTable
        headers={["घटक", "महाराष्ट्र शासन (सामान्य)", "खाजगी (सामान्य)"]}
        rows={[
          ["कपात/ले-ऑफ धोका", "पुष्टीनंतर खूप कमी", "मंदीत खरा"],
          ["निवृत्ती", "शासकीय योगदानासह NPS", "बहुतेक स्वतःची बचत"],
          ["वैद्यकीय", "शासकीय चौकट", "कंपनी धोरणावर"],
          ["निवास", "HRA किंवा अनेक पदांना निवास", "पूर्ण भाडे स्वतः"],
          ["कर्ज / सामाजिक स्थान", "शासकीय ओळखीमुळे अनेकदा मजबूत", "कंपनी ब्रँडवर"],
        ]}
      />

      <h3>४. खाजगी कधी जिंकते</h3>
      <p>
        उच्च कौशल्याची शहरी ऑफर, फील्ड/बदली नको असल्यास, किंवा पहिल्या ५ वर्षांतील जलद रोख
        हवी असल्यास खाजगी निवडा (किंवा तयारी सुरू ठेवत नोकरी करा). एमपीएससी दीर्घकालीन निर्णय
        आहे, रातोरात श्रीमंत होण्याची योजना नाही.
      </p>

      <h3>५. सोपी निर्णय नियम</h3>
      <ul>
        <li>
          तुमची वास्तविक खाजगी पर्यायी नोकरी शहरात स्थिर ~₹५०,००० पेक्षा कमी घेऊन जाते असल्यास
          गट-ब पॅकेज+सुरक्षितता अनेकदा स्पर्धात्मक ठरते.
        </li>
        <li>
          ~₹१ लाख+ CTC ची मजबूत IT/वित्त ऑफर असल्यास एमपीएससीला फक्त पगारवाढ नव्हे,
          मूल्या/सुरक्षिततेची निवड माना.
        </li>
        <li>
          पदतुलना:{" "}
          <Link href="/study-guides/mpsc-psi-sti-aso-talathi-salary-comparison">
            PSI / STI / ASO / तलाठी पगार
          </Link>
          .
        </li>
      </ul>

      <h3>पुढची पावले</h3>
      <ul>
        <li>
          <Link href="/study-guides/mpsc-salary-pay-scale">पगार व वेतनश्रेणी</Link>
        </li>
        <li>
          <Link href="/study-guides/mpsc-preparation-strategy">तयारी रणनीती</Link>
        </li>
        <li>
          <Link href="/exams">/exams</Link> मोफत सराव
        </li>
      </ul>
    </>
  );
}

export default function GovtVsPrivateGuide() {
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
      title="Government vs Private Job · शासकीय विरुद्ध खाजगी"
      subtitle="English + मराठी · about 9 min read"
      faq={FAQ}
      faqSchema={faqSchema}
    >
      <StudyGuideLangTabs english={<EnglishBody />} marathi={<MarathiBody />} />
    </StudyGuideShell>
  );
}
