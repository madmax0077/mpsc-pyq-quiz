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
    "RTO AMVI Exam 2026 — Prelims, Mains and Strategy (English + Marathi) | आरटीओ एएमव्हीआय",
  description:
    "Bilingual MPSC RTO AMVI 2026 guide in English and Marathi: Combined prelims strategy, 150-question technical mains, Mechanical versus Automobile branch choice, Motor Vehicles Act focus and free previous-year practice.",
  keywords: [
    "RTO AMVI",
    "MPSC AMVI",
    "आरटीओ एएमव्हीआय",
    "सहाय्यक मोटार वाहन निरीक्षक",
    "AMVI syllabus 2026",
    "RTO AMVI mains",
    "MPSC AMVI previous year papers",
    "AMVI तयारी",
    "MPSC Group C AMVI",
  ],
  alternates: { canonical: "/study-guides/mpsc-rto-amvi-exam" },
};

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "What is RTO AMVI? / आरटीओ एएमव्हीआय म्हणजे काय?",
    a: "AMVI means Assistant Motor Vehicle Inspector. It is a Group C technical post in Maharashtra’s transport and RTO system. एएमव्हीआय म्हणजे सहाय्यक मोटार वाहन निरीक्षक. हे महाराष्ट्राच्या परिवहन आणि आरटीओ व्यवस्थेतील गट-क तांत्रिक पद आहे.",
  },
  {
    q: "What is the AMVI mains pattern? / मुख्य परीक्षेची पद्धत काय आहे?",
    a: "The mains usually has about 150 questions for 300 marks in 90 minutes. Section A covers common Mechanical and Automobile topics. Candidates choose Section B (Mechanical) or Section C (Automobile). मुख्य परीक्षेत साधारणतः १५० प्रश्न, ३०० गुण आणि ९० मिनिटे असतात. विभाग अ सर्वांसाठी समान असतो. विभाग ब (Mechanical) किंवा विभाग क (Automobile) निवडावा लागतो.",
  },
  {
    q: "Is there negative marking? / नकारात्मक गुणांकन आहे का?",
    a: "Yes. Objective papers usually follow MPSC’s one-fourth (0.25) penalty for each wrong answer. होय. वस्तुनिष्ठ पेपर्समध्ये साधारणतः प्रत्येक चुकीच्या उत्तरासाठी एक चतुर्थांश (०.२५) गुण कपात होते.",
  },
  {
    q: "Where can I practise for free? / मोफत सराव कुठे करता येईल?",
    a: "On mpscs.in you can practise RTO AMVI previous year papers and a full RTO mock test of 150 questions in 90 minutes. mpscs.in वर आरटीओ एएमव्हीआय मागील पेपर्स आणि १५० प्रश्न / ९० मिनिटांची पूर्ण मॉक टेस्ट उपलब्ध आहे.",
  },
];

function EnglishBody() {
  return (
    <>
      <h2>RTO AMVI 2026: A Respected Transport Post — and a Tough Technical Exam</h2>
      <p className="!mt-2 !text-sm !text-slate-500 dark:!text-slate-400">
        Last updated: August 2026 · Reading time: about 17 minutes
      </p>

      <p>
        On a busy Maharashtra highway, authority does not always arrive as a speech. Sometimes it
        arrives as a clipboard, a careful inspection under a vehicle, and a decision that can stop an
        overloaded truck before it becomes tomorrow’s news. That is the public face of the{" "}
        <strong>RTO and Motor Vehicle Inspector system</strong>. For thousands of Mechanical and
        Automobile engineers, the entry point is one exam: <strong>AMVI</strong>.
      </p>
      <p>
        <strong>Assistant Motor Vehicle Inspector</strong> is not a soft consolation job for
        engineering graduates. It is one of the few Group C technical posts where subjects such as
        Strength of Materials, Thermal Engineering, Theory of Machines, automobile systems and
        industrial electronics become real selection tools. Coaching advertisements talk about an
        “RTO job.” The paper checks whether you can still apply engineering concepts and Motor
        Vehicles rules under strict time pressure.
      </p>

      <StudyGuideCallout tone="sky">
        <strong>Clear strategy:</strong> clear the Combined prelims like a Group C candidate, then
        dominate the mains like an engineer. If either stage is weak, selection becomes unlikely.
      </StudyGuideCallout>

      <p>
        Practise previous papers on the{" "}
        <Link href="/exams">RTO AMVI previous papers</Link> page.
      </p>

      <DisplayAd
        adsenseSlot={IN_CONTENT_AD_SLOT}
        ezoicKey="contentInline"
        className="my-8 not-prose"
      />

      <h3>1. What candidates usually search for</h3>
      <ul>
        <li>Notification, vacancy and application dates</li>
        <li>Prelims and mains exam pattern</li>
        <li>Syllabus PDF for Mechanical and Automobile engineering</li>
        <li>Previous year papers</li>
        <li>Eligibility doubts about diploma and degree branches</li>
      </ul>
      <p>
        Most websites cover vacancy news well. Fewer explain the real selection problem: how to divide
        study time between Combined prelims General Studies and a 300-mark technical mains paper.
      </p>

      <h3>2. The job, explained simply</h3>
      <ul>
        <li>Vehicle inspection and fitness-related technical checks</li>
        <li>Support for transport enforcement and documentation work</li>
        <li>Application of motor vehicle rules in office and roadside situations</li>
        <li>Day-to-day work inside the RTO administrative system</li>
      </ul>

      <h3>3. Two stages with two different demands</h3>
      <StudyGuideTable
        headers={["Stage", "What it demands", "Common reason for failure"]}
        rows={[
          [
            "Combined Prelims",
            "Speed in General Studies, aptitude and language, with basic technical awareness as notified",
            "Engineering candidates ignore Marathi, English and General Studies",
          ],
          [
            "AMVI Mains",
            "Deep Mechanical and Automobile MCQs under negative marking",
            "Weak concepts and careless guessing",
          ],
        ]}
      />
      <p>
        Some reports mention an autumn prelims window and a winter mains window.{" "}
        <strong>Confirm every date on mpsc.gov.in</strong>. For Combined pattern basics, read{" "}
        <Link href="/study-guides/mpsc-group-c-exam-pattern-2026">Group C Exam Pattern 2026</Link>.
      </p>

      <h3>4. Mains blueprint</h3>
      <ul>
        <li>About 150 objective questions</li>
        <li>300 marks in total (often 2 marks each)</li>
        <li>90 minutes</li>
        <li>
          <strong>Section A is compulsory</strong> — common Mechanical and Automobile topics
        </li>
        <li>
          <strong>Section B or Section C</strong> — Mechanical branch or Automobile branch
        </li>
        <li>Negative marking of about 0.25 for each wrong answer</li>
      </ul>
      <StudyGuideCallout tone="sky">
        Different summaries may show a slightly different size for the optional section. Your action
        remains the same: <strong>master Section A thoroughly</strong>.
      </StudyGuideCallout>

      <h3>5. Syllabus topics that appear often in previous papers</h3>
      <h4>Section A — common paper</h4>
      <ul>
        <li>Strength of Materials and stress-strain basics</li>
        <li>Theory of Machines, vibrations, governors and gears</li>
        <li>Thermal Engineering and internal combustion engines</li>
        <li>Fluid mechanics and hydraulics basics</li>
        <li>Manufacturing awareness</li>
        <li>Industrial electronics basics</li>
        <li>
          Automobile systems: engine, transmission, brakes, suspension, steering and electrical
          systems
        </li>
      </ul>
      <h4>Section B — Mechanical</h4>
      <ul>
        <li>Hydraulic machinery</li>
        <li>Industrial engineering concepts</li>
        <li>Refrigeration and air-conditioning</li>
      </ul>
      <h4>Section C — Automobile</h4>
      <ul>
        <li>Automobile systems in greater depth</li>
        <li>Vehicle maintenance</li>
        <li>Transport management</li>
      </ul>
      <h4>Legal and administrative layer</h4>
      <p>
        Serious preparation also includes <strong>Motor Vehicles Act and Rules literacy</strong> —
        key definitions, fitness and registration ideas, and transport vocabulary. You need
        exam-ready clarity, not courtroom-level memorisation.
      </p>

      <h3>6. A practical preparation strategy</h3>
      <h4>Before the prelims</h4>
      <ul>
        <li>Spend about 60% of your time on Combined prelims: Marathi, English, General Studies and aptitude</li>
        <li>Spend about 40% on technical maintenance: 20 to 30 AMVI MCQs every day</li>
        <li>Every weekend, take one Combined timed set and one technical sectional test</li>
      </ul>
      <h4>After the prelims</h4>
      <ul>
        <li>Spend about 80% of your time on Section A through previous year papers</li>
        <li>Spend about 15% on your branch optional section</li>
        <li>Spend about 5% on Motor Vehicles Act notes</li>
        <li>Take one full 150-question simulation every week</li>
      </ul>
      <p>
        Read the <Link href="/study-guides/mpsc-negative-marking">negative marking</Link> guide and
        maintain a clear error notebook.
      </p>

      <h3>7. How to use previous year papers properly</h3>
      <ol>
        <li>Attempt the paper under timed conditions</li>
        <li>Mark every wrong answer as Concept, Calculation, Careless or Guess</li>
        <li>Rebuild your personal syllabus from those mistakes</li>
        <li>Attempt the same paper again after 10 to 14 days</li>
      </ol>
      <p>
        Use <Link href="/exams">RTO AMVI papers</Link> and the{" "}
        <Link href="/?mode=mock">RTO mock test</Link> of 150 questions in 90 minutes.
      </p>

      <h3>8. Mechanical versus Automobile optional</h3>
      <ul>
        <li>If your academic background is Mechanical, Section B is usually the natural choice</li>
        <li>If your academic background is Automobile, Section C is usually the natural choice</li>
        <li>
          Do not change your optional section because of rumours. Section A has a much larger effect
          on rank
        </li>
      </ul>

      <h3>9. A 12-week technical sprint after prelims</h3>
      <StudyGuideTable
        headers={["Weeks", "Main focus"]}
        rows={[
          ["1–3", "Theory of Machines, Strength of Materials and Thermal Engineering"],
          ["4–6", "Automobile systems and industrial electronics"],
          ["7–8", "Branch optional section and weak topics"],
          ["9–10", "Full previous year papers"],
          ["11–12", "Revision, Motor Vehicles Act notes and rest"],
        ]}
      />

      <h3>10. Common mistakes</h3>
      <ol>
        <li>Assuming the prelims are easy for engineers</li>
        <li>Buying many textbooks but solving no previous year papers</li>
        <li>Watching video lectures without formula and MCQ practice</li>
        <li>Ignoring cancelled or unusual question patterns from older papers</li>
        <li>Changing the optional section only a few weeks before the mains</li>
      </ol>

      <h3>Conclusion</h3>
      <p>
        The highway does not care about your college CGPA. AMVI selection is proof that you can still
        think clearly about machines, vehicles and rules under exam pressure. Open one paper today on{" "}
        <Link href="/exams">mpscs.in/exams</Link>.
      </p>
    </>
  );
}

function MarathiBody() {
  return (
    <>
      <h2>आरटीओ एएमव्हीआय २०२६: सन्मानाचे परिवहन पद — आणि कठीण तांत्रिक परीक्षा</h2>
      <p className="!mt-2 !text-sm !text-slate-500 dark:!text-slate-400">
        अद्यतन: ऑगस्ट २०२६ · अंदाजे वाचन वेळ: १७ मिनिटे
      </p>

      <p>
        महाराष्ट्रातील कोणत्याही व्यस्त महामार्गावर अधिकार नेहमी भाषणाने येत नाही. कधी कधी तो
        क्लिपबोर्ड, वाहनाखालची काळजीपूर्वक तपासणी आणि एक निर्णायक कारवाई या रूपाने येतो. हा निर्णय
        ओव्हरलोड ट्रकला उद्याच्या अपघाताच्या बातमीपूर्वी थांबवू शकतो. हे{" "}
        <strong>आरटीओ आणि मोटार वाहन निरीक्षक</strong> व्यवस्थेचे सार्वजनिक रूप आहे. हजारो
        Mechanical आणि Automobile अभियंत्यांसाठी या क्षेत्रात प्रवेशाचा मार्ग एका परीक्षेतून जातो:{" "}
        <strong>एएमव्हीआय (AMVI)</strong>.
      </p>
      <p>
        <strong>सहाय्यक मोटार वाहन निरीक्षक</strong> हे अभियांत्रिकी पदवीधरांसाठी फक्त समाधान
        देणारे सोपे पद नाही. ही अशी दुर्मिळ गट-क तांत्रिक जागा आहे जिथे Strength of Materials, Thermal Engineering,
        Theory of Machines, automobile systems आणि industrial electronics हे विषय निवडीसाठी खरे
        उपयुक्त ठरतात. जाहिराती “RTO जॉब” असे सांगतात. परीक्षा मात्र वेळेच्या दबावाखाली अभियांत्रिकी
        संकल्पना आणि Motor Vehicles नियम लागू करता येतात का, हे तपासते.
      </p>

      <StudyGuideCallout tone="sky">
        <strong>स्पष्ट रणनीती:</strong> Combined पूर्वपरीक्षा गट-क उमेदवाराप्रमाणे उत्तीर्ण करा आणि
        मुख्य परीक्षा अभियंताप्रमाणे जिंका. कोणताही एक टप्पा कमकुवत असेल तर निवड कठीण होते.
      </StudyGuideCallout>

      <p>
        मागील पेपर्ससाठी{" "}
        <Link href="/exams">RTO AMVI previous papers</Link> पान वापरा.
      </p>

      <DisplayAd
        adsenseSlot={IN_CONTENT_AD_SLOT}
        ezoicKey="contentInline"
        className="my-8 not-prose"
      />

      <h3>१. उमेदवार सहसा काय शोधतात</h3>
      <ul>
        <li>जाहिरात, जागा आणि अर्ज तारखा</li>
        <li>पूर्व आणि मुख्य परीक्षेची पद्धत</li>
        <li>Mechanical आणि Automobile अभ्यासक्रम PDF</li>
        <li>मागील वर्षांचे पेपर्स</li>
        <li>डिप्लोमा आणि पदवी शाखांबाबत पात्रतेच्या शंका</li>
      </ul>
      <p>
        बहुतेक संकेतस्थळे जागांची बातमी चांगल्या प्रकारे देतात. पण खरी निवड समस्या कमी ठिकाणी
        स्पष्ट होते: Combined पूर्वपरीक्षेच्या सामान्य अभ्यासासाठी आणि ३०० गुणांच्या तांत्रिक मुख्य
        परीक्षेसाठी वेळ कसा वाटायचा.
      </p>

      <h3>२. नोकरी सोप्या भाषेत</h3>
      <ul>
        <li>वाहन तपासणी आणि फिटनेस संबंधित तांत्रिक कामे</li>
        <li>परिवहन अंमलबजावणी आणि कागदपत्रांच्या कामात सहाय्य</li>
        <li>कार्यालय आणि रस्त्यावर मोटार वाहन नियमांचा वापर</li>
        <li>आरटीओ प्रशासकीय व्यवस्थेतील दैनंदिन कामकाज</li>
      </ul>

      <h3>३. दोन टप्पे, दोन वेगळ्या मागण्या</h3>
      <StudyGuideTable
        headers={["टप्पा", "काय अपेक्षित आहे", "अपयशाचे सामान्य कारण"]}
        rows={[
          [
            "Combined पूर्वपरीक्षा",
            "सामान्य ज्ञान, बुद्धिमत्ता आणि भाषेत वेग; सूचित मूलभूत तांत्रिक जाण",
            "अभियांत्रिकी उमेदवार मराठी, इंग्रजी आणि सामान्य ज्ञान दुर्लक्षित करतात",
          ],
          [
            "एएमव्हीआय मुख्य परीक्षा",
            "खोल Mechanical आणि Automobile बहुपर्यायी प्रश्न, नकारात्मक गुणांकन",
            "कच्च्या संकल्पना आणि बेजबाबदार अंदाज",
          ],
        ]}
      />
      <p>
        काही अहवालांत शरद ऋतूतील पूर्वपरीक्षा आणि हिवाळ्यातील मुख्य परीक्षा नमूद आहे.{" "}
        <strong>प्रत्येक तारीख mpsc.gov.in वरूनच पक्की करा</strong>. Combined पद्धतीसाठी{" "}
        <Link href="/study-guides/mpsc-group-c-exam-pattern-2026">गट-क परीक्षा पद्धत २०२६</Link>{" "}
        वाचा.
      </p>

      <h3>४. मुख्य परीक्षेचा आराखडा</h3>
      <ul>
        <li>सुमारे १५० वस्तुनिष्ठ प्रश्न</li>
        <li>एकूण ३०० गुण (बहुधा प्रत्येकी २ गुण)</li>
        <li>९० मिनिटे</li>
        <li>
          <strong>विभाग अ सक्तीचा</strong> — Mechanical आणि Automobile समान विषय
        </li>
        <li>
          <strong>विभाग ब किंवा विभाग क</strong> — Mechanical शाखा किंवा Automobile शाखा
        </li>
        <li>प्रत्येक चुकीच्या उत्तरासाठी सुमारे ०.२५ गुणांची कपात</li>
      </ul>
      <StudyGuideCallout tone="sky">
        पर्यायी विभागाचा आकार वेगवेगळ्या सारांशांत थोडा वेगळा दिसू शकतो. तुमची कृती मात्र एकच
        राहते: <strong>विभाग अ पूर्णपणे मजबूत करा</strong>.
      </StudyGuideCallout>

      <h3>५. मागील पेपर्समध्ये वारंवार दिसणारे विषय</h3>
      <h4>विभाग अ — समान पेपर</h4>
      <ul>
        <li>Strength of Materials आणि ताण-विकृती मूलतत्त्वे</li>
        <li>Theory of Machines, कंपन, गव्हर्नर आणि गीअर्स</li>
        <li>Thermal Engineering आणि अंतर्गत दहन इंजिन</li>
        <li>Fluid mechanics आणि hydraulics मूलतत्त्वे</li>
        <li>Manufacturing विषयक जाण</li>
        <li>Industrial electronics मूलतत्त्वे</li>
        <li>
          Automobile systems: इंजिन, ट्रान्समिशन, ब्रेक, सस्पेंशन, स्टिअरिंग आणि विद्युत प्रणाली
        </li>
      </ul>
      <h4>विभाग ब — Mechanical</h4>
      <ul>
        <li>Hydraulic machinery</li>
        <li>Industrial engineering संकल्पना</li>
        <li>रेफ्रिजरेशन आणि वातानुकूलन</li>
      </ul>
      <h4>विभाग क — Automobile</h4>
      <ul>
        <li>Automobile systems अधिक खोलीने</li>
        <li>Vehicle maintenance</li>
        <li>Transport management</li>
      </ul>
      <h4>कायदा आणि प्रशासन थर</h4>
      <p>
        गांभीर्याने तयारी करणाऱ्या उमेदवारांनी <strong>Motor Vehicles Act आणि Rules</strong> ची
        समजही तयार करावी — महत्त्वाच्या व्याख्या, फिटनेस आणि नोंदणी संकल्पना, तसेच परिवहन शब्दसंग्रह.
        परीक्षाउपयोगी स्पष्टता हवी; न्यायालयीन पातळीचे पाठांतर नाही.
      </p>

      <h3>६. व्यवहार्य तयारी रणनीती</h3>
      <h4>पूर्वपरीक्षेपूर्वी</h4>
      <ul>
        <li>सुमारे ६०% वेळ Combined पूर्वपरीक्षेसाठी: मराठी, इंग्रजी, सामान्य ज्ञान आणि बुद्धिमत्ता</li>
        <li>सुमारे ४०% वेळ तांत्रिक देखभालीसाठी: दररोज २० ते ३० एएमव्हीआय बहुपर्यायी प्रश्न</li>
        <li>दर रविवारी एक Combined टाइम्ड संच आणि एक तांत्रिक विभागीय चाचणी</li>
      </ul>
      <h4>पूर्वपरीक्षेनंतर</h4>
      <ul>
        <li>सुमारे ८०% वेळ विभाग अ साठी मागील पेपर्सद्वारे</li>
        <li>सुमारे १५% वेळ शाखा पर्यायी विभागासाठी</li>
        <li>सुमारे ५% वेळ Motor Vehicles Act नोट्ससाठी</li>
        <li>आठवड्यातून एकदा पूर्ण १५० प्रश्नांची सिम्युलेशन चाचणी</li>
      </ul>
      <p>
        <Link href="/study-guides/mpsc-negative-marking">नकारात्मक गुणांकन</Link> मार्गदर्शक वाचा आणि
        चुकांची वही नियमित ठेवा.
      </p>

      <h3>७. मागील पेपर्स योग्य पद्धतीने कसे वापरावेत</h3>
      <ol>
        <li>टाइमर लावून पेपर सोडवा</li>
        <li>प्रत्येक चुकीचे उत्तर संकल्पना, गणना, क्षुल्लक चूक किंवा अंदाज असे वर्गीकृत करा</li>
        <li>त्या चुकांवरून स्वतःचा अभ्यासक्रम पुन्हा तयार करा</li>
        <li>१० ते १४ दिवसांनी तोच पेपर पुन्हा सोडवा</li>
      </ol>
      <p>
        <Link href="/exams">आरटीओ एएमव्हीआय पेपर्स</Link> आणि{" "}
        <Link href="/?mode=mock">आरटीओ मॉक टेस्ट</Link> (१५० प्रश्न / ९० मिनिटे) वापरा.
      </p>

      <h3>८. Mechanical की Automobile पर्याय</h3>
      <ul>
        <li>शैक्षणिक पार्श्वभूमी Mechanical असेल तर सामान्यतः विभाग ब योग्य</li>
        <li>शैक्षणिक पार्श्वभूमी Automobile असेल तर सामान्यतः विभाग क योग्य</li>
        <li>
          अफवांमुळे पर्यायी विभाग बदलू नका. रँकवर सर्वाधिक परिणाम विभाग अ चा होतो
        </li>
      </ul>

      <h3>९. पूर्वपरीक्षेनंतर १२ आठवड्यांची तांत्रिक स्प्रिंट</h3>
      <StudyGuideTable
        headers={["आठवडे", "मुख्य लक्ष"]}
        rows={[
          ["१–३", "Theory of Machines, Strength of Materials आणि Thermal Engineering"],
          ["४–६", "Automobile systems आणि industrial electronics"],
          ["७–८", "शाखा पर्यायी विभाग आणि कच्चे विषय"],
          ["९–१०", "पूर्ण मागील पेपर्स"],
          ["११–१२", "पुनरावृत्ती, Motor Vehicles Act नोट्स आणि विश्रांती"],
        ]}
      />

      <h3>१०. सामान्य चुका</h3>
      <ol>
        <li>पूर्वपरीक्षा अभियंत्यांसाठी सोपी आहे असे समजणे</li>
        <li>अनेक पुस्तके खरेदी करणे पण मागील पेपर्स न सोडवणे</li>
        <li>सूत्र आणि बहुपर्यायी सरावाशिवाय फक्त व्हिडिओ व्याख्याने पाहणे</li>
        <li>जुन्या पेपर्समधील रद्द किंवा वेगळ्या पद्धतीचे प्रश्न दुर्लक्षित करणे</li>
        <li>मुख्य परीक्षेच्या काही आठवडे आधी पर्यायी विभाग बदलणे</li>
      </ol>

      <h3>समारोप</h3>
      <p>
        महामार्गाला तुमचा कॉलेज CGPA महत्त्वाचा नसतो. एएमव्हीआय निवड म्हणजे मशीन, वाहन आणि नियम
        यांच्याबाबत परीक्षा दबावाखालीही स्पष्ट विचार करता येतो, हे सिद्ध करणे. आजच{" "}
        <Link href="/exams">mpscs.in/exams</Link> वर एक पेपर उघडा.
      </p>
    </>
  );
}

export default function RtoAmviExamBlog() {
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
      title="RTO AMVI 2026 · आरटीओ एएमव्हीआय"
      subtitle="English + मराठी · about 17 min read"
      faq={FAQ}
      faqSchema={faqSchema}
    >
      <StudyGuideLangTabs english={<EnglishBody />} marathi={<MarathiBody />} />
    </StudyGuideShell>
  );
}
