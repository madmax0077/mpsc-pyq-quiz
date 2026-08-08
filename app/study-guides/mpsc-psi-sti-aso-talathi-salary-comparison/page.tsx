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
    "PSI vs STI vs ASO vs Talathi Salary Comparison 2026 (English + Marathi) | MPSC Pay",
  description:
    "Side-by-side MPSC salary comparison for PSI, STI, ASO and Talathi using Maharashtra 7th Pay matrix basics (S-14 ₹38,600; Talathi Level-4 ₹25,500), DA ~60% from Jan 2026, and realistic in-hand bands.",
  keywords: [
    "PSI salary Maharashtra",
    "STI salary MPSC",
    "ASO salary MPSC",
    "Talathi salary",
    "तलाठी पगार",
    "PSI STI ASO salary comparison",
    "MPSC Group B salary",
    "एमपीएससी पगार तुलना",
    "पोलीस उपनिरीक्षक पगार",
    "राज्य कर निरीक्षक पगार",
    "MPSC combine salary",
  ],
  alternates: { canonical: "/study-guides/mpsc-psi-sti-aso-talathi-salary-comparison" },
};

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "Do PSI, STI and ASO get the same basic pay? / PSI, STI, ASO चे मूळ वेतन एकच आहे का?",
    a: "In current Maharashtra Combined Group B notifications and pay discussions, PSI, STI and ASO commonly enter on the same state matrix band starting at ₹38,600 (S-14 / ₹38,600–₹1,22,800 scale). Exact level is always printed in that year’s official advertisement. सध्याच्या Combined गट-ब चर्चेत तिन्ही पदे सहसा ₹३८,६०० पासून सुरू होणाऱ्या S-14 पट्ट्यात दाखवली जातात — अचूक स्तर जाहिरातीत तपासा.",
  },
  {
    q: "Why is Talathi salary lower than PSI/STI/ASO? / तलाठी पगार कमी का?",
    a: "Talathi (Gram Mahsul Adhikari) is a Group C village revenue post. Recent Bharti material places it on Pay Matrix Level 4 with basic pay ₹25,500–₹81,100 — below Group B S-14 entry. तलाठी गट-क पद आहे; Level 4 वर मूळ वेतन ₹२५,५००–₹८१,१००.",
  },
  {
    q: "How was in-hand estimated here? / हातात पगार कसा मोजला?",
    a: "Basic from the Maharashtra matrix + Dearness Allowance at the state rate reported at 60% from 1 January 2026 + typical city HRA − NPS/professional tax style deductions. HRA and posting change the final number, so bands are used — not a single fake figure. मूळ वेतन + जानेवारी २०२६ पासून नोंदवलेला ~६०% महागाई भत्ता + शहरानुसार HRA − नेहमीच्या कपातीनंतरची श्रेणी.",
  },
];

function EnglishBody() {
  return (
    <>
      <h2>PSI vs STI vs ASO vs Talathi — Salary Comparison with Real Pay-Matrix Anchors</h2>
      <p className="!mt-2 !text-sm !text-slate-500 dark:!text-slate-400">
        Last updated: August 2026 · Reading time: about 10 minutes
      </p>

      <p>
        Aspirants often ask “which post pays more?” before they ask “which post fits my strengths?”
        For MPSC Combined Group B, the pay answer is simpler than WhatsApp claims:{" "}
        <strong>PSI, STI and ASO usually share the same entry basic-pay band</strong>. Talathi sits
        lower because it is a Group C revenue post. The real differences are job profile, field
        risk, promotion path and city HRA — not three different fantasy payslips.
      </p>

      <StudyGuideCallout>
        <strong>Anchors used on this page (verify in the year’s जाहिरात):</strong>
        <ul className="mt-2 list-disc pl-5">
          <li>
            Maharashtra 7th CPC state matrix: <strong>S-14 starts at ₹38,600</strong>; scale often
            written ₹38,600–₹1,22,800 for Combined Group B posts.
          </li>
          <li>
            Talathi / Gram Mahsul Adhikari: widely notified as{" "}
            <strong>Level 4, ₹25,500–₹81,100</strong>.
          </li>
          <li>
            State DA reported at <strong>60%</strong> of basic from <strong>1 January 2026</strong>{" "}
            (after earlier 58% from July 2025). DA changes by government order.
          </li>
        </ul>
      </StudyGuideCallout>

      <h3>1. Side-by-side comparison</h3>
      <StudyGuideTable
        headers={["Post", "Group", "Pay anchor (basic)", "~ DA @ 60%", "~ In-hand / month*"]}
        rows={[
          [
            "PSI",
            "Group B",
            "₹38,600 (S-14 entry)",
            "₹23,160",
            "₹55,000 – ₹70,000",
          ],
          [
            "STI",
            "Group B",
            "₹38,600 (S-14 entry)",
            "₹23,160",
            "₹55,000 – ₹70,000",
          ],
          [
            "ASO",
            "Group B",
            "₹38,600 (S-14 entry)",
            "₹23,160",
            "₹55,000 – ₹70,000",
          ],
          [
            "Talathi",
            "Group C",
            "₹25,500 (Level 4 entry)",
            "₹15,300",
            "₹32,000 – ₹42,000",
          ],
        ]}
      />
      <p className="text-sm text-slate-600 dark:text-slate-300">
        *In-hand band = basic + DA + typical HRA − common deductions. Mumbai/Pune HRA sits near the
        top; rural postings (especially Talathi) sit near the bottom, sometimes with quarters.
      </p>

      <DisplayAd
        adsenseSlot={IN_CONTENT_AD_SLOT}
        ezoicKey="contentInline"
        className="my-8 not-prose"
      />

      <h3>2. Worked example (S-14 entry at DA 60%)</h3>
      <p>
        Take basic <strong>₹38,600</strong>. DA at 60% = <strong>₹23,160</strong>. Subtotal before
        HRA = <strong>₹61,760</strong>. Add HRA (city slab) and TA, then subtract NPS contribution
        and professional tax. That is why serious estimates land around{" "}
        <strong>₹55,000–₹70,000 in-hand</strong> for new Group B officers — not the raw basic alone,
        and not the top of the ₹1,22,800 matrix cell (that top is end-of-scale, not joining pay).
      </p>

      <h3>3. What is NOT different across PSI / STI / ASO</h3>
      <ul>
        <li>Entry basic-pay band in the usual Combined notification pattern</li>
        <li>DA percentage (state-wide for eligible employees)</li>
        <li>NPS framework and annual increment logic</li>
      </ul>

      <h3>4. What IS different</h3>
      <StudyGuideTable
        headers={["Factor", "PSI", "STI", "ASO", "Talathi"]}
        rows={[
          ["Work nature", "Police field / law & order", "Tax / GST field & office", "Secretariat / office", "Village land revenue"],
          ["Physical / interview", "Physical + interview stages", "Usually DV after mains", "Usually DV after mains", "Skill / DV as notified"],
          ["Promotion ceiling", "Police hierarchy", "Tax / finance hierarchy", "Administrative hierarchy", "Circle Inspector → Naib Tehsildar → Tehsildar track"],
          ["Posting feel", "Shift / field heavy", "Field + desk", "Mostly desk", "Village / taluka field"],
        ]}
      />

      <h3>5. How to choose the post</h3>
      <p>
        If your decision is only “highest salary,” PSI/STI/ASO are in the same pay neighbourhood.
        Choose by fitness for physical standards (PSI), comfort with tax law (STI), preference for
        secretariat work (ASO), or desire for village revenue work with a lower entry band but strong
        local role (Talathi). For career ladders, see{" "}
        <Link href="/study-guides/mpsc-promotion-path-after-selection">
          Promotion path after selection
        </Link>
        .
      </p>

      <h3>Next steps</h3>
      <ul>
        <li>
          Read <Link href="/study-guides/mpsc-salary-pay-scale">MPSC Salary &amp; Pay Scale</Link> for
          how DA/HRA/NPS fit together.
        </li>
        <li>
          Check recent competition on{" "}
          <Link href="/study-guides/mpsc-cut-off-trends">MPSC Cut Off Trends</Link>.
        </li>
        <li>
          Practise free papers on <Link href="/exams">/exams</Link>.
        </li>
      </ul>
    </>
  );
}

function MarathiBody() {
  return (
    <>
      <h2>PSI विरुद्ध STI विरुद्ध ASO विरुद्ध तलाठी — खऱ्या वेतन-मॅट्रिक्ससह पगार तुलना</h2>
      <p className="!mt-2 !text-sm !text-slate-500 dark:!text-slate-400">
        अद्यतन: ऑगस्ट २०२६ · अंदाजे वाचन वेळ: १० मिनिटे
      </p>

      <p>
        उमेदवार अनेकदा आधी “कुणाचा पगार जास्त?” विचारतात. Combined गट-ब साठी उत्तर सोपे आहे:{" "}
        <strong>PSI, STI आणि ASO चे सुरुवातीचे मूळ वेतनपट्टे सहसा एकच</strong> असतात. तलाठी गट-क
        महसूल पद असल्याने कमी पट्ट्यात असते. खरा फरक कामाचे स्वरूप, पदोन्नती आणि शहरानुसार
        घरभाडे भत्त्यात असतो — तीन वेगवेगळ्या काल्पनिक पे-स्लिपमध्ये नाही.
      </p>

      <StudyGuideCallout>
        <strong>या पानावरील आधार (त्या वर्षाच्या जाहिरातीत तपासा):</strong>
        <ul className="mt-2 list-disc pl-5">
          <li>
            महाराष्ट्र ७व्या वेतन आयोगातील <strong>S-14 ची सुरुवात ₹३८,६००</strong>; Combined गट-ब
            साठी अनेकदा ₹३८,६००–₹१,२२,८०० असा उल्लेख.
          </li>
          <li>
            तलाठी / ग्राम महसूल अधिकारी: <strong>Level 4, ₹२५,५००–₹८१,१००</strong>.
          </li>
          <li>
            राज्य महागाई भत्ता <strong>१ जानेवारी २०२६</strong> पासून नोंदवलेला दर{" "}
            <strong>६०%</strong> (पूर्वी जुलै २०२५ पासून ५८%).
          </li>
        </ul>
      </StudyGuideCallout>

      <h3>१. एकत्रित तुलना</h3>
      <StudyGuideTable
        headers={["पद", "गट", "मूळ वेतन आधार", "~ DA @ ६०%", "~ हातात / महिना*"]}
        rows={[
          ["PSI", "गट-ब", "₹३८,६०० (S-14)", "₹२३,१६०", "₹५५,००० – ₹७०,०००"],
          ["STI", "गट-ब", "₹३८,६०० (S-14)", "₹२३,१६०", "₹५५,००० – ₹७०,०००"],
          ["ASO", "गट-ब", "₹३८,६०० (S-14)", "₹२३,१६०", "₹५५,००० – ₹७०,०००"],
          ["तलाठी", "गट-क", "₹२५,५०० (Level 4)", "₹१५,३००", "₹३२,००० – ₹४२,०००"],
        ]}
      />
      <p className="text-sm text-slate-600 dark:text-slate-300">
        *हातात = मूळ + DA + सामान्य HRA − नेहमीच्या कपात. मुंबई/पुणे वरच्या टोकाला; ग्रामीण
        पदस्थापना खालच्या टोकाला.
      </p>

      <DisplayAd
        adsenseSlot={IN_CONTENT_AD_SLOT}
        ezoicKey="contentInline"
        className="my-8 not-prose"
      />

      <h3>२. गणित (S-14 + DA ६०%)</h3>
      <p>
        मूळ <strong>₹३८,६००</strong>. DA ६०% = <strong>₹२३,१६०</strong>. HRA आधी उपयोग{" "}
        <strong>₹६१,७६०</strong>. नंतर HRA/TA मिळवा आणि NPS व व्यवसाय कर वजा करा. म्हणून नव्या
        गट-ब अधिकाऱ्यांसाठी <strong>₹५५,०००–₹७०,००० हातात</strong> ही श्रेणी वास्तववादी ठरते —
        फक्त मूळ वेतन किंवा मॅट्रिक्सच्या शेवटच्या ₹१,२२,८०० कक्षेइतके नाही.
      </p>

      <h3>३. PSI / STI / ASO मध्ये काय सारखे</h3>
      <ul>
        <li>सुरुवातीचे मूळ वेतनपट्टे (सामान्य Combined नमुन्यात)</li>
        <li>राज्याचा DA दर</li>
        <li>NPS आणि वार्षिक वेतनवाढीची चौकट</li>
      </ul>

      <h3>४. काय वेगळे</h3>
      <StudyGuideTable
        headers={["घटक", "PSI", "STI", "ASO", "तलाठी"]}
        rows={[
          ["कामाचे स्वरूप", "पोलीस क्षेत्र / कायदा-सुव्यवस्था", "कर / GST क्षेत्र व कार्यालय", "सचिवालय / कार्यालय", "गाव जमीन महसूल"],
          ["शारीरिक / मुलाखत", "शारीरिक चाचणी + मुलाखत", "सहसा मुख्य परीक्षेनंतर कागदपत्रे", "सहसा मुख्य परीक्षेनंतर कागदपत्रे", "जाहिरातीनुसार कौशल्य / DV"],
          ["पदोन्नती", "पोलीस शिडी", "कर / वित्त शिडी", "प्रशासकीय शिडी", "मंडळ अधिकारी → नायब तहसीलदार → तहसीलदार"],
          ["पदस्थापना", "शिफ्ट / फील्ड", "फील्ड + डेस्क", "बहुतेक डेस्क", "गाव / तालुका"],
        ]}
      />

      <h3>५. पद कसे निवडावे</h3>
      <p>
        फक्त “जास्त पगार” पाहत असाल तर PSI/STI/ASO एकाच परिसरात आहेत. शारीरिक क्षमता (PSI), कर
        कायदा (STI), कार्यालयीन काम (ASO) किंवा गाव महसूल भूमिका (तलाठी) यावर निर्णय घ्या. शिडी
        समजण्यासाठी{" "}
        <Link href="/study-guides/mpsc-promotion-path-after-selection">
          निवडीनंतरची पदोन्नती वाटचाल
        </Link>{" "}
        वाचा.
      </p>

      <h3>पुढची पावले</h3>
      <ul>
        <li>
          <Link href="/study-guides/mpsc-salary-pay-scale">एमपीएससी पगार व वेतनश्रेणी</Link> वाचा.
        </li>
        <li>
          <Link href="/study-guides/mpsc-cut-off-trends">कट ऑफ ट्रेंड</Link> पहा.
        </li>
        <li>
          <Link href="/exams">/exams</Link> वर मोफत सराव करा.
        </li>
      </ul>
    </>
  );
}

export default function SalaryComparisonGuide() {
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
      title="PSI · STI · ASO · Talathi Salary · पगार तुलना"
      subtitle="English + मराठी · about 10 min read"
      faq={FAQ}
      faqSchema={faqSchema}
    >
      <StudyGuideLangTabs english={<EnglishBody />} marathi={<MarathiBody />} />
    </StudyGuideShell>
  );
}
