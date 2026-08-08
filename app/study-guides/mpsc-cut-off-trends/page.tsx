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
    "MPSC Cut Off Trends 2022–2025 — Group B PSI STI ASO & Group C (English + Marathi)",
  description:
    "Real MPSC cut-off trends for Group B Combined (PSI, STI, ASO) and Group C: category-wise prelims marks from recent cycles, what moves the cut-off, and how to set a safe target score.",
  keywords: [
    "MPSC cut off",
    "MPSC cut off 2025",
    "MPSC Group B cut off",
    "MPSC Combine cut off",
    "MPSC PSI cut off",
    "MPSC STI cut off",
    "MPSC ASO cut off",
    "MPSC Group C cut off",
    "एमपीएससी कट ऑफ",
    "गट ब कट ऑफ",
    "एमपीएससी पूर्वपरीक्षा कट ऑफ",
    "MPSC previous year cut off",
  ],
  alternates: { canonical: "/study-guides/mpsc-cut-off-trends" },
};

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "Where can I verify official MPSC cut-off marks? / अधिकृत कट ऑफ कुठे तपासावा?",
    a: "Only on mpsc.gov.in — in the Results / Candidate Information section, inside the result PDF for that advertisement. Coaching websites republish tables; treat them as secondary until you open the MPSC PDF. फक्त mpsc.gov.in वर — त्या जाहिरातीच्या निकाल PDF मध्ये. कोचिंग साइट्स दुय्यम स्रोत आहेत.",
  },
  {
    q: "Why was Open General ASO cut-off ~53.75 in 2024 but ~62.5 in 2025 prelims tables? / २०२४ आणि २०२५ मध्ये कट ऑफ वेगळा का?",
    a: "Cut-offs move with paper difficulty, vacancy count, and the size/quality of the candidate pool. A harder paper or more vacancies can pull Open cut-offs down; an easier paper or tougher competition can push them up. कट ऑफ पेपरची अडचण, जागांची संख्या आणि उमेदवार समुदायावर अवलंबून असतो.",
  },
  {
    q: "Is there a fixed safe score for MPSC Group B prelims? / सुरक्षित स्कोअर ठरलेला असतो का?",
    a: "No fixed safe score. From recent Open General tables, ASO has often needed the mid-50s to low-60s out of 100, while STI/PSI Open cut-offs have often sat lower. Aim well above the last two Open cut-offs for your post, not at the line. ठरलेला सुरक्षित स्कोअर नसतो — तुमच्या पदाच्या मागील दोन Open कट ऑफपेक्षा वर लक्ष्य ठेवा.",
  },
];

function EnglishBody() {
  return (
    <>
      <h2>MPSC Cut Off Trends — What Recent Result PDFs Actually Show</h2>
      <p className="!mt-2 !text-sm !text-slate-500 dark:!text-slate-400">
        Last updated: August 2026 · Reading time: about 11 minutes
      </p>

      <p>
        Cut-off talk on WhatsApp groups is usually louder than it is accurate. The only numbers that
        matter are the category-wise marks published with each MPSC result PDF. This guide gathers{" "}
        <strong>recent, widely republished official cut-off figures</strong> for Group B Combined
        (ASO, STI, PSI) and explains how to read Group C mains cut-offs — then turns that into a
        practical target for your next mock.
      </p>

      <StudyGuideCallout>
        <strong>Source rule:</strong> Figures below are taken from MPSC result cycles as republished
        by major exam portals after the commission released PDFs (notably Group B prelims 2024
        post-wise tables and Group B prelims 2025 category tables released around May 2025). Always
        re-check the matching PDF on{" "}
        <a href="https://mpsc.gov.in" target="_blank" rel="noopener noreferrer">
          mpsc.gov.in
        </a>{" "}
        before you treat any cell as final.
      </StudyGuideCallout>

      <h3>1. How MPSC cut-offs work</h3>
      <ul>
        <li>
          Prelims for Group B Combined are usually scored out of <strong>100</strong>, with{" "}
          <strong>−0.25</strong> for each wrong answer.
        </li>
        <li>
          Cut-offs are <strong>post-wise and category/sub-category wise</strong> (Open, Female,
          Sports, SC, ST, OBC, EWS, and others as notified).
        </li>
        <li>
          Clearing prelims only takes you to mains (and, for PSI, later physical / interview stages).
          Final selection uses mains merit (plus interview marks for PSI where applicable).
        </li>
      </ul>

      <h3>2. Group B Combined — Open General prelims snapshot</h3>
      <p>
        These Open (General) cells are the ones most aspirants track first. Female / Sports /
        reserved categories have separate lines in the same PDFs.
      </p>
      <StudyGuideTable
        headers={["Post / cycle", "Open General", "Open Female", "What it tells you"]}
        rows={[
          [
            "ASO Prelims 2024",
            "53.75 / 100",
            "49.00 / 100",
            "Mid-50s cleared Open ASO that year",
          ],
          [
            "STI Prelims 2024",
            "46.50 / 100",
            "41.00 / 100",
            "Lower than ASO — still not “easy” after negative marking",
          ],
          [
            "PSI Prelims 2024",
            "48.25 / 100",
            "41.75 / 100",
            "Between STI and ASO in that cycle",
          ],
          [
            "Group B Prelims 2025 (reported Open)",
            "62.5 / 100",
            "59.25 / 100",
            "Higher Open line than 2024 ASO — paper/competition shifted",
          ],
          [
            "ASO Prelims 2022 (older reference)",
            "62.75 / 100",
            "58.75 / 100",
            "Shows Open can sit in the low-60s in some years",
          ],
        ]}
      />

      <DisplayAd
        adsenseSlot={IN_CONTENT_AD_SLOT}
        ezoicKey="contentInline"
        className="my-8 not-prose"
      />

      <h3>3. Reserved-category examples from 2024 post-wise tables</h3>
      <StudyGuideTable
        headers={["Post (Prelims 2024)", "SC General", "ST General", "OBC General"]}
        rows={[
          ["ASO", "50.25", "46.00", "53.75"],
          ["STI", "44.75", "40.00", "46.50"],
          ["PSI", "44.25", "39.50", "48.25"],
        ]}
      />
      <p>
        Pattern: in the same year, <strong>ASO Open/OBC lines sat highest</strong>, STI lowest, and
        PSI in between — but your personal target should still be built from{" "}
        <em>your</em> post’s last two PDFs, not from a neighbour’s rumour.
      </p>

      <h3>4. Group C cut-offs — read the scale carefully</h3>
      <p>
        Group C mains cut-offs are often published on a <strong>much larger scale</strong> than
        prelims (hundreds of marks, not out of 100). Example from the Clerk-Typist mains cycle
        republished for 2024: <strong>Open General 280</strong>, Open Female{" "}
        <strong>260</strong>. Those are not “prelims out of 100” numbers — comparing them directly
        to Group B prelims cut-offs is a common mistake.
      </p>
      <p>
        For Tax Assistant / Clerk-Typist / related Group C posts, always open the{" "}
        <strong>post-specific mains result PDF</strong> for that advertisement. Skill test (typing)
        comes after mains qualification for several Group C posts.
      </p>

      <h3>5. What actually moves the cut-off</h3>
      <ul>
        <li>Paper difficulty and cancelled questions</li>
        <li>Number of vacancies in that advertisement</li>
        <li>How many serious candidates attempt that post</li>
        <li>Category / horizontal reservation (Female, Sports, Ex-Servicemen, etc.)</li>
      </ul>

      <h3>6. A practical target for your next mock</h3>
      <ul>
        <li>
          If you want <strong>ASO</strong>: treat <strong>60+ / 100 net</strong> as a strong
          working target after seeing both mid-50s (2024) and low-60s (2022 / 2025 Open) years.
        </li>
        <li>
          If you want <strong>STI / PSI</strong>: treat <strong>55+ / 100 net</strong> as a safer
          buffer above recent Open lines in the mid-40s.
        </li>
        <li>
          Track <strong>strike rate</strong> (correct ÷ attempted), not only raw score — negative
          marking decides cut-offs as much as knowledge does. See{" "}
          <Link href="/study-guides/mpsc-negative-marking">MPSC Negative Marking</Link>.
        </li>
      </ul>

      <h3>Next steps</h3>
      <ul>
        <li>
          Practise timed papers on <Link href="/exams">/exams</Link> with the real −0.25 rule.
        </li>
        <li>
          Compare posts and pay on{" "}
          <Link href="/study-guides/mpsc-psi-sti-aso-talathi-salary-comparison">
            PSI / STI / ASO / Talathi salary comparison
          </Link>
          .
        </li>
        <li>
          Read the <Link href="/study-guides/mpsc-exam-pattern">MPSC Exam Pattern</Link> guide for
          stage-wise marks.
        </li>
      </ul>
    </>
  );
}

function MarathiBody() {
  return (
    <>
      <h2>एमपीएससी कट ऑफ ट्रेंड — अलीकडील निकाल PDF काय दाखवतात</h2>
      <p className="!mt-2 !text-sm !text-slate-500 dark:!text-slate-400">
        अद्यतन: ऑगस्ट २०२६ · अंदाजे वाचन वेळ: ११ मिनिटे
      </p>

      <p>
        व्हॉट्सअॅप ग्रुपमधील कट ऑफ चर्चा अनेकदा गोंगाट करणारी असते, पण अचूक नसते. खरे आकडे फक्त
        एमपीएससीच्या निकाल PDF मधील प्रवर्गनिहाय गुण आहेत. हे मार्गदर्शक गट-ब Combined (ASO, STI,
        PSI) च्या <strong>अलीकडील, व्यापकपणे प्रकाशित अधिकृत कट ऑफ आकड्यांचे</strong> संकलन करते
        आणि गट-क मुख्य परीक्षा कट ऑफ कसे वाचायचे ते सांगते — मग त्याचा उपयोग पुढच्या मॉकसाठी
        लक्ष्य ठरवण्यासाठी करा.
      </p>

      <StudyGuideCallout>
        <strong>स्रोत नियम:</strong> खालील आकडे एमपीएससीने निकाल PDF प्रसिद्ध केल्यानंतर प्रमुख
        परीक्षा पोर्टल्सनी प्रकाशित केलेल्या तक्त्यांवर आधारित आहेत (विशेषतः गट-ब पूर्वपरीक्षा २०२४
        पदनिहाय तक्ते आणि मे २०२५ च्या सुमारास प्रसिद्ध झालेले २०२५ चे Open तक्ते). कोणताही आकडा
        अंतिम मानण्यापूर्वी{" "}
        <a href="https://mpsc.gov.in" target="_blank" rel="noopener noreferrer">
          mpsc.gov.in
        </a>{" "}
        वरील संबंधित PDF पुन्हा तपासा.
      </StudyGuideCallout>

      <h3>१. एमपीएससी कट ऑफ कसे काम करते</h3>
      <ul>
        <li>
          गट-ब Combined पूर्वपरीक्षा सामान्यतः <strong>१००</strong> गुणांची असते; चुकीच्या उत्तरास{" "}
          <strong>−०.२५</strong>.
        </li>
        <li>
          कट ऑफ <strong>पदनिहाय आणि प्रवर्ग/उपप्रवर्गनिहाय</strong> असतो (Open, महिला, क्रीडा, SC,
          ST, OBC, EWS इ.).
        </li>
        <li>
          पूर्वपरीक्षा फक्त मुख्य परीक्षेसाठी पात्र करते. अंतिम निवड मुख्य परीक्षेच्या गुणांवर
          (आणि PSI साठी लागू असल्यास मुलाखत गुणांवर) अवलंबून असते.
        </li>
      </ul>

      <h3>२. गट-ब Combined — Open General पूर्वपरीक्षा सारांश</h3>
      <StudyGuideTable
        headers={["पद / वर्ष", "Open General", "Open Female", "अर्थ"]}
        rows={[
          ["ASO पूर्व २०२४", "५३.७५ / १००", "४९.०० / १००", "त्या वर्षी Open ASO साठी mid-५०s पुरेसे"],
          ["STI पूर्व २०२४", "४६.५० / १००", "४१.०० / १००", "ASO पेक्षा कमी; नकारात्मक गुणांकनानंतरही सोपा नाही"],
          ["PSI पूर्व २०२४", "४८.२५ / १००", "४१.७५ / १००", "STI आणि ASO च्या मध्ये"],
          [
            "गट-ब पूर्व २०२५ (Reported Open)",
            "६२.५ / १००",
            "५९.२५ / १००",
            "२०२४ ASO पेक्षा उच्च Open रेषा",
          ],
          ["ASO पूर्व २०२२ (जुना संदर्भ)", "६२.७५ / १००", "५८.७५ / १००", "काही वर्षांत Open low-६०s पर्यंत जातो"],
        ]}
      />

      <DisplayAd
        adsenseSlot={IN_CONTENT_AD_SLOT}
        ezoicKey="contentInline"
        className="my-8 not-prose"
      />

      <h3>३. २०२४ पदनिहाय तक्त्यांतील आरक्षित प्रवर्ग उदाहरणे</h3>
      <StudyGuideTable
        headers={["पद (पूर्व २०२४)", "SC General", "ST General", "OBC General"]}
        rows={[
          ["ASO", "५०.२५", "४६.००", "५३.७५"],
          ["STI", "४४.७५", "४०.००", "४६.५०"],
          ["PSI", "४४.२५", "३९.५०", "४८.२५"],
        ]}
      />
      <p>
        नमुना: त्याच वर्षी <strong>ASO ची Open/OBC रेषा सर्वाधिक</strong>, STI सर्वात कमी आणि PSI
        मध्ये — पण तुमचे लक्ष्य नेहमी तुमच्या पदाच्या मागील दोन PDF वरून ठरवा.
      </p>

      <h3>४. गट-क कट ऑफ — स्केल काळजीपूर्वक वाचा</h3>
      <p>
        गट-क मुख्य परीक्षा कट ऑफ अनेकदा पूर्वपरीक्षेपेक्षा <strong>खूप मोठ्या स्केलवर</strong>{" "}
        प्रकाशित होतात (शेकडो गुण). २०२४ Clerk-Typist मुख्य परीक्षेसाठी प्रसिद्ध झालेल्या उदाहरणात
        Open General <strong>२८०</strong>, Open Female <strong>२६०</strong>. हे “१०० पैकी
        पूर्वपरीक्षा” आकडे नाहीत — गट-ब पूर्वपरीक्षा कट ऑफशी थेट तुलना करणे चुकीचे आहे.
      </p>

      <h3>५. कट ऑफ का बदलतो</h3>
      <ul>
        <li>पेपरची अडचण आणि रद्द झालेले प्रश्न</li>
        <li>त्या जाहिरातीतील जागांची संख्या</li>
        <li>त्या पदासाठी गंभीर उमेदवार किती</li>
        <li>प्रवर्ग / क्षैतिज आरक्षण (महिला, क्रीडा, माजी सैनिक इ.)</li>
      </ul>

      <h3>६. पुढच्या मॉकसाठी व्यावहारिक लक्ष्य</h3>
      <ul>
        <li>
          <strong>ASO</strong> हवे असल्यास: <strong>६०+ / १०० निव्वळ</strong> हे मजबूत कामकाजी
          लक्ष्य.
        </li>
        <li>
          <strong>STI / PSI</strong> हवे असल्यास: अलीकडील Open mid-४०s रेषेच्या वर{" "}
          <strong>५५+ / १०० निव्वळ</strong> बफर ठेवा.
        </li>
        <li>
          फक्त स्कोअर नव्हे, <strong>अचूकता</strong> (बरोबर ÷ प्रयत्न) पाहा —{" "}
          <Link href="/study-guides/mpsc-negative-marking">नकारात्मक गुणांकन</Link> मार्गदर्शक
          वाचा.
        </li>
      </ul>

      <h3>पुढची पावले</h3>
      <ul>
        <li>
          <Link href="/exams">/exams</Link> वर वेळेबद्ध पेपर्स −०.२५ नियमाने सोडवा.
        </li>
        <li>
          <Link href="/study-guides/mpsc-psi-sti-aso-talathi-salary-comparison">
            PSI / STI / ASO / तलाठी पगार तुलना
          </Link>{" "}
          वाचा.
        </li>
        <li>
          <Link href="/study-guides/mpsc-exam-pattern">परीक्षा पद्धत</Link> मार्गदर्शक पहा.
        </li>
      </ul>
    </>
  );
}

export default function MpscCutOffTrendsGuide() {
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
      title="MPSC Cut Off Trends · एमपीएससी कट ऑफ"
      subtitle="English + मराठी · about 11 min read"
      faq={FAQ}
      faqSchema={faqSchema}
    >
      <StudyGuideLangTabs english={<EnglishBody />} marathi={<MarathiBody />} />
    </StudyGuideShell>
  );
}
