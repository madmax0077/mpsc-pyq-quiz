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
    "MPSC Promotion Path After Selection — PSI, STI, ASO, Talathi Career Ladder (English + Marathi)",
  description:
    "Promotion and career growth after MPSC selection: PSI police hierarchy, STI tax track, ASO secretariat path, and Talathi → Circle Inspector → Naib Tehsildar (S-14) → Tehsildar (S-19) with pay-level anchors from Maharashtra orders.",
  keywords: [
    "MPSC promotion",
    "PSI promotion hierarchy",
    "Talathi promotion",
    "तलाठी पदोन्नती",
    "Naib Tehsildar pay scale",
    "Tehsildar S-19",
    "ASO career growth",
    "STI promotion",
    "MPSC career ladder",
    "after MPSC selection",
  ],
  alternates: { canonical: "/study-guides/mpsc-promotion-path-after-selection" },
};

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "Can a Talathi become Tehsildar? / तलाठी तहसीलदार होऊ शकतो का?",
    a: "Yes, through the departmental revenue promotion channel over a long service period (Circle Inspector / Mandal Adhikari → Naib Tehsildar → Tehsildar), and separately by clearing higher MPSC exams while in service. होय — विभागीय पदोन्नती मार्गाने दीर्घ सेवेनंतर, किंवा सेवेत असताना उच्च एमपीएससी परीक्षा देऊन.",
  },
  {
    q: "What pay levels appear in recent Maharashtra revenue promotion orders? / अलीकडील महसूल पदोन्नती आदेशात कोणते वेतनस्तर?",
    a: "A November 2025 Maharashtra Revenue & Forest Department promotion order for the Naib Tehsildar → Tehsildar channel cites Naib Tehsildar scale S-14 (₹38,600–₹1,22,800) and Tehsildar scale S-19 (₹55,100–₹1,75,100). नोव्हेंबर २०२५ च्या आदेशात नायब तहसीलदार S-14 आणि तहसीलदार S-19 नमूद.",
  },
];

function EnglishBody() {
  return (
    <>
      <h2>Promotion Path After MPSC Selection — Career Ladders That Actually Exist</h2>
      <p className="!mt-2 !text-sm !text-slate-500 dark:!text-slate-400">
        Last updated: August 2026 · Reading time: about 10 minutes
      </p>

      <p>
        Selection is the gate. Promotion is the long road. Joining pay for PSI, STI and ASO sits in
        the same neighbourhood; over 15–25 years the{" "}
        <strong>department ladder and whether you clear higher exams in service</strong> decide how
        far you climb. This guide maps the realistic ladders — without inventing fake “guaranteed
        Collector in 8 years” stories.
      </p>

      <StudyGuideCallout>
        <strong>Documented pay-level anchor:</strong> Maharashtra Revenue &amp; Forest Department
        promotion order dated <strong>14 November 2025</strong> (पदोन्नती-2025/प्र.क्र.221/24/आस्था-3)
        refers to promotion from Naib Tehsildar cadre on{" "}
        <strong>S-14 (₹38,600–₹1,22,800)</strong> to Tehsildar cadre on{" "}
        <strong>S-19 (₹55,100–₹1,75,100)</strong>. That is a real state order reference for the
        revenue track — not a coaching rumour.
      </StudyGuideCallout>

      <h3>1. Quick map by entry post</h3>
      <StudyGuideTable
        headers={["Entry post", "Typical early ladder", "Longer horizon"]}
        rows={[
          [
            "PSI",
            "PSI → Police Inspector (and further police ranks by seniority/departmental rules)",
            "Senior police leadership grades; parallel higher exams possible",
          ],
          [
            "STI",
            "State Tax Inspector → higher inspector / assistant commissioner style tax grades",
            "Finance / GST administration ladder inside state tax machinery",
          ],
          [
            "ASO",
            "Assistant Section Officer → Section Officer / higher secretariat grades",
            "Mantralaya / administrative desk hierarchy",
          ],
          [
            "Talathi",
            "Talathi → Circle Inspector (Mandal Adhikari) → Naib Tehsildar",
            "Tehsildar (S-19 band in recent orders); or jump via higher MPSC",
          ],
        ]}
      />

      <DisplayAd
        adsenseSlot={IN_CONTENT_AD_SLOT}
        ezoicKey="contentInline"
        className="my-8 not-prose"
      />

      <h3>2. Talathi / revenue track — the clearest public ladder</h3>
      <p>
        Village revenue work has a well-known departmental staircase. Timelines vary by vacancy,
        seniority lists and government rules; treat years below as{" "}
        <strong>order-of-magnitude service experience</strong>, not a private promise:
      </p>
      <ul>
        <li>
          <strong>Talathi (Gram Mahsul Adhikari)</strong> — entry on Level 4 style band (basic
          ₹25,500 in recent Bharti material).
        </li>
        <li>
          <strong>Circle Inspector / Mandal Adhikari</strong> — common next supervisory revenue
          step after substantial service (often discussed in the 12–18 year neighbourhood in career
          guides; actual timing follows seniority/vacancy).
        </li>
        <li>
          <strong>Naib Tehsildar</strong> — S-14 band (₹38,600–₹1,22,800) as cited in the Nov 2025
          promotion order context.
        </li>
        <li>
          <strong>Tehsildar</strong> — S-19 band (₹55,100–₹1,75,100) in the same order’s destination
          cadre.
        </li>
      </ul>

      <h3>3. PSI / STI / ASO — same entry pay, different ceilings</h3>
      <p>
        Entry basic for Combined Group B is commonly S-14 (₹38,600). Promotion titles differ by
        department:
      </p>
      <ul>
        <li>
          <strong>PSI:</strong> police rank structure; physical standards and field performance
          matter early; interview exists at selection, then departmental promotion rules take over.
        </li>
        <li>
          <strong>STI:</strong> tax administration grades; law knowledge stays useful lifelong.
        </li>
        <li>
          <strong>ASO:</strong> secretariat file work; promotions tied to administrative vacancy
          channels.
        </li>
      </ul>

      <h3>4. The fastest legitimate “jump”</h3>
      <p>
        For many Group C / Group B officers, the largest career jump is still{" "}
        <strong>clearing a higher MPSC exam while in service</strong> (for example moving toward
        Gazetted Civil Services / Rajyaseva). Departmental promotion is steadier; open competitive
        exams are steeper but can skip several rungs.
      </p>

      <h3>5. What promotion does to money</h3>
      <p>
        A promotion that changes <strong>pay level</strong> (for example S-14 → S-19) is a bigger
        jump than a normal annual increment inside the same level. That is why long-term MPSC value
        is not only the first in-hand figure — see{" "}
        <Link href="/study-guides/mpsc-psi-sti-aso-talathi-salary-comparison">salary comparison</Link>{" "}
        and <Link href="/study-guides/mpsc-salary-pay-scale">pay scale basics</Link>.
      </p>

      <h3>Next steps</h3>
      <ul>
        <li>
          <Link href="/study-guides/government-job-vs-private-job">Government vs private job</Link>
        </li>
        <li>
          <Link href="/study-guides/mpsc-interview-document-verification">
            Interview &amp; document verification guide
          </Link>
        </li>
        <li>
          Practice: <Link href="/exams">/exams</Link>
        </li>
      </ul>
    </>
  );
}

function MarathiBody() {
  return (
    <>
      <h2>एमपीएससी निवडीनंतरची पदोन्नती वाटचाल — खऱ्या करिअर शिड्या</h2>
      <p className="!mt-2 !text-sm !text-slate-500 dark:!text-slate-400">
        अद्यतन: ऑगस्ट २०२६ · अंदाजे वाचन वेळ: १० मिनिटे
      </p>

      <p>
        निवड दार आहे; पदोन्नती लांब रस्ता आहे. PSI, STI, ASO चे सुरूवातीचे पगार जवळपास समान
        परिसरात असतात. पुढची १५–२५ वर्षे <strong>विभागीय शिडी आणि सेवेत असताना उच्च परीक्षा</strong>{" "}
        ठरवतात तुम्ही किती वर जाल. हे मार्गदर्शक वास्तववादी शिड्या दाखवते — “८ वर्षांत
        जिल्हाधिकारी” अशा खोट्या गोष्टी नव्हे.
      </p>

      <StudyGuideCallout>
        <strong>दस्तऐवजी वेतनस्तर आधार:</strong> महसूल व वन विभाग, शासन आदेश दिनांक{" "}
        <strong>१४ नोव्हेंबर २०२५</strong> (पदोन्नती-२०२५/प्र.क्र.२२१/२४/आस्था-३) मध्ये नायब
        तहसीलदार संवर्गातील <strong>S-14 (₹३८,६००–₹१,२२,८००)</strong> वरून तहसीलदार संवर्गातील{" "}
        <strong>S-19 (₹५५,१००–₹१,७५,१००)</strong> कडे पदोन्नतीचा उल्लेख आहे. ही कोचिंग अफवा नव्हे,
        शासकीय आदेशातील नोंद आहे.
      </StudyGuideCallout>

      <h3>१. प्रवेश पदानुसार नकाशा</h3>
      <StudyGuideTable
        headers={["प्रवेश पद", "सुरुवातीची शिडी", "दीर्घ क्षितिज"]}
        rows={[
          ["PSI", "PSI → पोलीस निरीक्षक (आणि पुढील पोलीस श्रेणी)", "वरिष्ठ पोलीस श्रेणी; समांतर उच्च परीक्षा"],
          ["STI", "राज्य कर निरीक्षक → उच्च कर प्रशासन श्रेणी", "राज्य कर / GST यंत्रणेतील शिडी"],
          ["ASO", "सहाय्यक विभाग अधिकारी → विभाग अधिकारी / उच्च सचिवालय", "मंत्रालयीन प्रशासकीय शिडी"],
          ["तलाठी", "तलाठी → मंडळ अधिकारी → नायब तहसीलदार", "तहसीलदार (S-19); किंवा उच्च एमपीएससी"],
        ]}
      />

      <DisplayAd
        adsenseSlot={IN_CONTENT_AD_SLOT}
        ezoicKey="contentInline"
        className="my-8 not-prose"
      />

      <h3>२. तलाठी / महसूल शिडी — सर्वाधिक स्पष्ट सार्वजनिक मार्ग</h3>
      <ul>
        <li>
          <strong>तलाठी</strong> — Level 4 सारखा प्रवेश (मूळ ₹२५,५०० अलीकडील भरती साहित्यात).
        </li>
        <li>
          <strong>मंडळ अधिकारी / सर्कल इन्स्पेक्टर</strong> — दीर्घ सेवेनंतरचा पुढचा पर्यवेक्षी
          टप्पा (ज्येष्ठता/जागांनुसार वेळ बदलतो).
        </li>
        <li>
          <strong>नायब तहसीलदार</strong> — S-14 पट्टा (₹३८,६००–₹१,२२,८००) नोव्हेंबर २०२५ आदेश
          संदर्भात.
        </li>
        <li>
          <strong>तहसीलदार</strong> — S-19 पट्टा (₹५५,१००–₹१,७५,१००).
        </li>
      </ul>

      <h3>३. PSI / STI / ASO — समान प्रवेश पगार, वेगळ्या मर्यादा</h3>
      <ul>
        <li>
          <strong>PSI:</strong> पोलीस श्रेणी रचना; शारीरिक क्षमता आणि फील्ड कामगिरी महत्त्वाची.
        </li>
        <li>
          <strong>STI:</strong> कर प्रशासन; कायद्याचे ज्ञान दीर्घकाळ उपयुक्त.
        </li>
        <li>
          <strong>ASO:</strong> सचिवालयीन फायली; प्रशासकीय जागांच्या मार्गाने पदोन्नती.
        </li>
      </ul>

      <h3>४. सर्वात मोठी कायदेशीर “उडी”</h3>
      <p>
        अनेक गट-क / गट-ब अधिकाऱ्यांसाठी सर्वात मोठी उडी म्हणजे{" "}
        <strong>सेवेत असताना उच्च एमपीएससी परीक्षा क्लिअर करणे</strong> (उदा. राज्यसेवा /
        राजपत्रित दिशेने). विभागीय पदोन्नती स्थिर असते; खुली स्पर्धा परीक्षा अधिक उंच पण जलद रस्ते
        उघडू शकते.
      </p>

      <h3>५. पदोन्नती पगारावर काय करते</h3>
      <p>
        <strong>वेतनस्तर</strong> बदलणारी पदोन्नती (उदा. S-14 → S-19) ही त्याच स्तरातील वार्षिक
        वाढीपेक्षा मोठी असते. म्हणून दीर्घकालीन मूल्य फक्त पहिल्या हातात पगारापुरते मर्यादित
        नाही —{" "}
        <Link href="/study-guides/mpsc-psi-sti-aso-talathi-salary-comparison">पगार तुलना</Link> आणि{" "}
        <Link href="/study-guides/mpsc-salary-pay-scale">वेतनश्रेणी</Link> वाचा.
      </p>

      <h3>पुढची पावले</h3>
      <ul>
        <li>
          <Link href="/study-guides/government-job-vs-private-job">शासकीय विरुद्ध खाजगी</Link>
        </li>
        <li>
          <Link href="/study-guides/mpsc-interview-document-verification">
            मुलाखत व कागदपत्र पडताळणी
          </Link>
        </li>
        <li>
          <Link href="/exams">/exams</Link> सराव
        </li>
      </ul>
    </>
  );
}

export default function PromotionPathGuide() {
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
      title="Promotion Path · पदोन्नती वाटचाल"
      subtitle="English + मराठी · about 10 min read"
      faq={FAQ}
      faqSchema={faqSchema}
    >
      <StudyGuideLangTabs english={<EnglishBody />} marathi={<MarathiBody />} />
    </StudyGuideShell>
  );
}
