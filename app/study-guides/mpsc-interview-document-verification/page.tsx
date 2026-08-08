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
    "MPSC Interview & Document Verification Guide — PSI, STI, ASO, Group C (English + Marathi)",
  description:
    "MPSC post-mains stages explained: which posts have interview (PSI 40 marks) vs document verification only (ASO/STI), physical test notes, medical, and a practical document checklist for Maharashtra domicile, caste validity and education proofs.",
  keywords: [
    "MPSC document verification",
    "MPSC interview",
    "MPSC PSI interview",
    "MPSC PSI physical test",
    "MPSC DV documents list",
    "एमपीएससी कागदपत्र पडताळणी",
    "एमपीएससी मुलाखत",
    "PSI physical test",
    "MPSC caste validity",
    "MPSC domicile certificate",
  ],
  alternates: { canonical: "/study-guides/mpsc-interview-document-verification" },
};

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "Do ASO and STI have an interview? / ASO आणि STI ला मुलाखत असते का?",
    a: "In the usual recent Combined Group B pattern, ASO and STI are selected on mains merit followed by document verification — not a personality interview. PSI has additional physical test and interview stages. अलीकडील Combined नमुन्यात ASO/STI साठी सहसा मुलाखत नसते; मेन्स + कागदपत्रे. PSI साठी शारीरिक चाचणी आणि मुलाखत अतिरिक्त असते.",
  },
  {
    q: "How are PSI interview marks counted? / PSI मुलाखत गुण कसे मोजले जातात?",
    a: "Recruitment explainers for recent Combined cycles describe PSI interview as 40 marks, with final merit often framed as Mains (400) + Interview (40), after qualifying the physical test (commonly described as 100 marks with a minimum qualifying score such as 60/100 — confirm in that year’s notification). अलीकडील चक्रांच्या स्पष्टीकरणात मुलाखत ४० गुण; मेन्स ४०० + मुलाखत ४० — शारीरिक चाचणी पात्रतेनंतर. त्या वर्षाच्या जाहिरातीत खात्री करा.",
  },
];

function EnglishBody() {
  return (
    <>
      <h2>MPSC Interview &amp; Document Verification — What Happens After Mains</h2>
      <p className="!mt-2 !text-sm !text-slate-500 dark:!text-slate-400">
        Last updated: August 2026 · Reading time: about 10 minutes
      </p>

      <p>
        Many aspirants prepare brilliantly for prelims and then lose months to a missing caste
        validity certificate or a mismatched name on the domicile. This guide separates{" "}
        <strong>which posts actually have an interview</strong> from posts that only have document
        verification — and gives a practical Maharashtra document checklist.
      </p>

      <StudyGuideCallout>
        <strong>Pattern to remember (confirm in your advertisement):</strong> For Combined Group B,
        ASO &amp; STI → mains + document verification. PSI → mains + physical test + interview
        (often described as 40 marks) + medical/document checks. Group C posts that need typing
        go through a skill test before final joining formalities.
      </StudyGuideCallout>

      <h3>1. Stage map by post</h3>
      <StudyGuideTable
        headers={["Post family", "After mains", "Interview?", "Other gates"]}
        rows={[
          ["ASO", "Document verification", "Usually no", "Eligibility / certificate scrutiny"],
          ["STI", "Document verification", "Usually no", "Eligibility / certificate scrutiny"],
          [
            "PSI",
            "Physical test → interview → medical/DV",
            "Yes (often 40 marks)",
            "Physical standards + medical fitness",
          ],
          [
            "Group C (Tax Asst / Clerk-Typist etc.)",
            "Skill test where notified",
            "Usually no personality interview",
            "Typing speeds as per post (e.g. Marathi 30 WPM / English 40 WPM patterns in recent Group C material)",
          ],
        ]}
      />

      <DisplayAd
        adsenseSlot={IN_CONTENT_AD_SLOT}
        ezoicKey="contentInline"
        className="my-8 not-prose"
      />

      <h3>2. PSI physical + interview — what to prepare for</h3>
      <ul>
        <li>
          Physical standards and the physical efficiency test are{" "}
          <strong>post-specific and notification-specific</strong>. Do not rely on an old friend’s
          memory from five years ago — open the current PDF.
        </li>
        <li>
          Interview (where applicable) typically probes background, Maharashtra awareness,
          motivation for police service and clarity of thought — not a second GS paper.
        </li>
        <li>
          Final PSI merit in recent explainers is often described as combining mains marks with
          interview marks after physical qualification.
        </li>
      </ul>

      <h3>3. Document checklist (keep originals + self-attested copies)</h3>
      <ul>
        <li>Printed application form and both admit cards (prelims / mains) if asked</li>
        <li>Photo ID (Aadhaar / PAN / Passport / Voter ID)</li>
        <li>SSC (10th) for date of birth + HSC + Graduation degree / marksheets</li>
        <li>Maharashtra domicile certificate</li>
        <li>Caste certificate + <strong>caste validity</strong> (where category claimed)</li>
        <li>Non-Creamy Layer (OBC etc.) / EWS certificate as applicable and in-date</li>
        <li>Marathi language proof if the notification requires it</li>
        <li>PwD / Ex-Servicemen / Sports / Orphan certificates if claiming that reservation</li>
        <li>Name-change affidavit / gazette if your name differs across certificates</li>
      </ul>

      <h3>4. The mistakes that actually reject candidates</h3>
      <ul>
        <li>Category claimed in form but validity certificate not ready at DV</li>
        <li>Expired Non-Creamy Layer / EWS where the notification demands a current certificate</li>
        <li>Spelling mismatches across SSC, graduation and Aadhaar with no supporting affidavit</li>
        <li>Assuming “interview coaching” is needed for ASO/STI when the post has no interview</li>
      </ul>

      <h3>5. Timeline mindset</h3>
      <p>
        Start collecting validity / domicile / NCL papers <strong>while you are still writing
        mains</strong>, not after the result PDF. Certificate offices run on their own calendar;
        MPSC DV dates do not wait for your taluka office queue.
      </p>

      <h3>Next steps</h3>
      <ul>
        <li>
          Understand competition:{" "}
          <Link href="/study-guides/mpsc-cut-off-trends">MPSC Cut Off Trends</Link>
        </li>
        <li>
          After joining:{" "}
          <Link href="/study-guides/mpsc-promotion-path-after-selection">Promotion path</Link>
        </li>
        <li>
          Keep practising on <Link href="/exams">/exams</Link> until the result is out.
        </li>
      </ul>
    </>
  );
}

function MarathiBody() {
  return (
    <>
      <h2>एमपीएससी मुलाखत व कागदपत्र पडताळणी — मेन्सनंतर काय होते</h2>
      <p className="!mt-2 !text-sm !text-slate-500 dark:!text-slate-400">
        अद्यतन: ऑगस्ट २०२६ · अंदाजे वाचन वेळ: १० मिनिटे
      </p>

      <p>
        अनेक उमेदवार पूर्वपरीक्षा उत्तम देतात आणि नंतर जात वैधता प्रमाणपत्र किंवा अधिवास
        प्रमाणपत्रातील नावाच्या फरकामुळे महिने वाया घालवतात. हे मार्गदर्शक सांगते की{" "}
        <strong>कोणत्या पदाला खरोखर मुलाखत असते</strong> आणि कोणत्या पदाला फक्त कागदपत्र
        पडताळणी — तसेच महाराष्ट्रासाठी व्यावहारिक कागदपत्र यादी.
      </p>

      <StudyGuideCallout>
        <strong>लक्षात ठेवा (तुमच्या जाहिरातीत खात्री करा):</strong> Combined गट-ब मध्ये ASO व
        STI → मेन्स + कागदपत्र पडताळणी. PSI → मेन्स + शारीरिक चाचणी + मुलाखत (अनेकदा ४० गुण)
        + वैद्यकीय/कागदपत्रे. गट-क टायपिंग लागणाऱ्या पदांसाठी कौशल्य चाचणी अंतिम औपचारिकतेपूर्वी
        असते.
      </StudyGuideCallout>

      <h3>१. पदानुसार टप्पे</h3>
      <StudyGuideTable
        headers={["पद कुटुंब", "मेन्सनंतर", "मुलाखत?", "इतर दरवाजे"]}
        rows={[
          ["ASO", "कागदपत्र पडताळणी", "सहसा नाही", "पात्रता / प्रमाणपत्र तपासणी"],
          ["STI", "कागदपत्र पडताळणी", "सहसा नाही", "पात्रता / प्रमाणपत्र तपासणी"],
          [
            "PSI",
            "शारीरिक → मुलाखत → वैद्यकीय/DV",
            "होय (अनेकदा ४० गुण)",
            "शारीरिक मापदंड + वैद्यकीय योग्यता",
          ],
          [
            "गट-क (कर सहाय्यक / लिपिक-टंकलेखक)",
            "जाहिरातीनुसार कौशल्य चाचणी",
            "सहसा व्यक्तिमत्त्व मुलाखत नाही",
            "टायपिंग गती (अलीकडील साहित्यात मराठी ३० / इंग्रजी ४० WPM नमुने)",
          ],
        ]}
      />

      <DisplayAd
        adsenseSlot={IN_CONTENT_AD_SLOT}
        ezoicKey="contentInline"
        className="my-8 not-prose"
      />

      <h3>२. PSI शारीरिक + मुलाखत — कशाची तयारी</h3>
      <ul>
        <li>
          शारीरिक मापदंड आणि कार्यक्षमता चाचणी <strong>त्या जाहिरातीतील PDF</strong> वरूनच
          ठरतात — पाच वर्षांपूर्वीच्या मित्रांच्या आठवणीवर अवलंबून राहू नका.
        </li>
        <li>
          मुलाखत (लागू असल्यास) पार्श्वभूमी, महाराष्ट्र जाणीव, पोलीस सेवेची प्रेरणा आणि विचारांची
          स्पष्टता तपासते — दुसरी GS पेपर नसते.
        </li>
        <li>
          अलीकडील स्पष्टीकरणांत अंतिम PSI गुणवत्ता अनेकदा शारीरिक पात्रतेनंतर मेन्स + मुलाखत
          गुण एकत्र करून मांडली जाते.
        </li>
      </ul>

      <h3>३. कागदपत्र यादी (मूळ + स्वप्रमाणित प्रती)</h3>
      <ul>
        <li>अर्ज प्रिंट आणि पूर्व/मेन्स प्रवेशपत्रे (विनंतीनुसार)</li>
        <li>फोटो ओळखपत्र (आधार / पॅन / पासपोर्ट / मतदार)</li>
        <li>दहावी (जन्मतारीख) + बारावी + पदवी प्रमाणपत्रे / गुणपत्रके</li>
        <li>महाराष्ट्र अधिवास प्रमाणपत्र</li>
        <li>जात प्रमाणपत्र + <strong>जात वैधता</strong> (प्रवर्ग मागितल्यास)</li>
        <li>नॉन-क्रिमी लेयर / EWS (लागू व मुदतीत)</li>
        <li>मराठी भाषेचा पुरावा (जाहिरात मागत असल्यास)</li>
        <li>दिव्यांग / माजी सैनिक / क्रीडा / अनाथ प्रमाणपत्रे (मागितल्यास)</li>
        <li>नाव बदलाचे प्रतिज्ञापत्र / राजपत्र (प्रमाणपत्रांत फरक असल्यास)</li>
      </ul>

      <h3>४. खरे नाकारण्याची कारणे</h3>
      <ul>
        <li>अर्जात प्रवर्ग मागितला पण DV वेळी वैधता तयार नाही</li>
        <li>मुदत संपलेले NCL / EWS</li>
        <li>दहावी–पदवी–आधार यातील नावाचे फरक आणि कोणतेही समर्थन नाही</li>
        <li>ASO/STI साठी मुलाखत कोचिंग — ज्या पदाला मुलाखतच नाही</li>
      </ul>

      <h3>५. वेळेची मानसिकता</h3>
      <p>
        वैधता / अधिवास / NCL कागदपत्रे <strong>मेन्स देत असतानाच</strong> गोळा करायला सुरुवात
        करा, निकाल आल्यानंतर नव्हे. तलाठी कार्यालय आपल्या गतीने चालते; एमपीएससी DV तारखा
        थांबत नाहीत.
      </p>

      <h3>पुढची पावले</h3>
      <ul>
        <li>
          <Link href="/study-guides/mpsc-cut-off-trends">कट ऑफ ट्रेंड</Link>
        </li>
        <li>
          <Link href="/study-guides/mpsc-promotion-path-after-selection">पदोन्नती वाटचाल</Link>
        </li>
        <li>
          निकाल येईपर्यंत <Link href="/exams">/exams</Link> वर सराव सुरू ठेवा.
        </li>
      </ul>
    </>
  );
}

export default function InterviewDvGuide() {
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
      title="Interview & Document Verification · मुलाखत व DV"
      subtitle="English + मराठी · about 10 min read"
      faq={FAQ}
      faqSchema={faqSchema}
    >
      <StudyGuideLangTabs english={<EnglishBody />} marathi={<MarathiBody />} />
    </StudyGuideShell>
  );
}
