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
    "MPSC Salary & Pay Scale 2026 — Group B, Group C, Rajyaseva (English + Marathi) | एमपीएससी पगार",
  description:
    "Bilingual MPSC salary guide in English and Marathi: how pay matrix, DA, HRA and deductions work for PSI, STI, ASO, Tax Assistant, Clerk-Typist and Rajyaseva posts, plus a practical government-vs-private comparison.",
  keywords: [
    "MPSC salary",
    "MPSC salary 2026",
    "MPSC pay scale",
    "एमपीएससी पगार",
    "एमपीएससी वेतनश्रेणी",
    "PSI salary in hand",
    "पोलीस उपनिरीक्षक पगार",
    "STI salary MPSC",
    "ASO salary MPSC",
    "MPSC Group B salary",
    "MPSC Group C salary",
    "गट ब पगार",
    "गट क पगार",
    "Deputy Collector salary Maharashtra",
    "राज्यसेवा पगार",
    "government job vs private job salary",
  ],
  alternates: { canonical: "/study-guides/mpsc-salary-pay-scale" },
};

const FAQ: Array<{ q: string; a: string }> = [
  {
    q: "What is the starting salary for MPSC Group B posts like PSI, STI and ASO? / गट-ब पदांचा सुरुवातीचा पगार किती?",
    a: "As a 2025–26 ballpark: Group B posts usually start around ~₹38,000–₹45,000 basic pay and about ~₹48,000–₹65,000 in-hand per month after DA/HRA and deductions (higher in Mumbai/Pune). Confirm the exact basic-pay band in that year’s official advertisement (जाहिरात). २०२५–२६ चा अंदाज: गट-ब पदांचे सुरुवातीचे मूळ वेतन सुमारे ~₹३८,०००–₹४५,००० आणि हातात सुमारे ~₹४८,०००–₹६५,००० प्रति महिना (मुंबई/पुणेत जास्त). अचूक आकडा त्या वर्षाच्या अधिकृत जाहिरातीत तपासा.",
  },
  {
    q: "Is the in-hand MPSC salary lower than the advertised pay scale? / हातात मिळणारा पगार जाहिरातीतील आकड्यापेक्षा कमी असतो का?",
    a: "Yes. The advertised figure is usually the basic pay band. In-hand (net) pay is basic pay + Dearness Allowance (DA) + House Rent Allowance (HRA), minus NPS contribution and professional tax. Gross can be higher than basic once DA and HRA are added; net is lower after deductions. होय. जाहिरातीतील आकडा बहुतेक वेळा मूळ वेतनाची श्रेणी असतो. हातात मिळणारा पगार = मूळ वेतन + महागाई भत्ता + घरभाडे भत्ता − राष्ट्रीय पेन्शन प्रणाली योगदान आणि व्यवसाय कर. भत्ते मिळाल्यावर एकूण (gross) पगार वाढतो; कपात झाल्यावर निव्वळ (net) पगार कमी असतो.",
  },
  {
    q: "Does MPSC salary increase automatically every year? / एमपीएससी पगार दरवर्षी आपोआप वाढतो का?",
    a: "Yes, mainly through an annual increment (about 3% of basic pay) and periodic DA revisions by the state government, usually twice a year. होय. मुख्यतः वार्षिक वेतनवाढ (मूळ वेतनाच्या सुमारे ३%) आणि राज्य शासनाने वेळोवेळी जाहीर केलेल्या महागाई भत्त्यातील सुधारणांमुळे — सहसा वर्षातून दोनदा.",
  },
  {
    q: "Do Rajyaseva posts earn more than Group B and Group C? / राज्यसेवा पदांचा पगार गट-ब आणि गट-क पेक्षा जास्त असतो का?",
    a: "Yes. Gazetted Civil Services posts such as Deputy Collector, DySP and Tehsildar sit on a higher pay level and also carry gazetted-officer benefits — official residence or a higher HRA slab, vehicle or transport support for many field posts, and a faster path to senior grades. होय. उपजिल्हाधिकारी, पोलीस उपअधीक्षक, तहसीलदार यांसारखी राजपत्रित पदे उच्च वेतनस्तरावर असतात. अधिकृत निवास किंवा उच्च घरभाडे भत्ता, अनेक क्षेत्रीय पदांसाठी वाहन/प्रवास सुविधा आणि वरिष्ठ पदांकडे जलद वाटचाल हे अतिरिक्त फायदे आहेत.",
  },
  {
    q: "Is an MPSC job better paid than a private job? / खाजगी नोकरीपेक्षा एमपीएससी नोकरीचा पगार चांगला आहे का?",
    a: "On year-one basic pay alone, a metro private job can look higher. Over 25–30 years the picture changes: guaranteed increments, DA that tracks inflation, NPS with employer contribution, medical cover, job security and social standing. Treat MPSC as a long-horizon career choice, not a one-payslip comparison. फक्त पहिल्या वर्षाच्या मूळ वेतनावर पाहिले तर शहरातील खाजगी ऑफर जास्त दिसू शकते. २५–३० वर्षांच्या कालावधीत चित्र बदलते: हमीची वेतनवाढ, महागाईशी जोडलेला भत्ता, शासकीय योगदानासह पेन्शन, वैद्यकीय सुविधा, नोकरीची सुरक्षितता आणि सामाजिक स्थान. एमपीएससीला फक्त पहिल्या पे-स्लिपने नव्हे, दीर्घकालीन करिअर म्हणून पाहा.",
  },
];

function EnglishBody() {
  return (
    <>
      <h2>MPSC Salary &amp; Pay Scale — How Government Pay Actually Works</h2>
      <p className="!mt-2 !text-sm !text-slate-500 dark:!text-slate-400">
        Last updated: August 2026 · Reading time: about 9 minutes
      </p>

      <p>
        Salary is usually the second question every MPSC aspirant asks, right after
        “what is the exam pattern?” The honest answer is that a single number rarely
        tells the full story. An MPSC post’s real value comes from basic pay, allowances
        and long-term benefits that a payslip alone does not show.
      </p>
      <p>
        This bilingual guide explains how pay works for the posts most aspirants target —
        Group B (PSI, STI, ASO), Group C (Clerk-Typist, Tax Assistant) and Rajyaseva
        (Deputy Collector, DySP, Tehsildar) — and how to compare that with a private-sector
        offer. Pair it with the{" "}
        <Link href="/study-guides/mpsc-exam-pattern">MPSC Exam Pattern</Link> guide to see
        which exam leads to which post.
      </p>

      <StudyGuideCallout>
        <strong>Important:</strong> The ~ salary numbers below are approximate 2025–26
        ballpark figures for comparison. DA percentages and pay bands are revised by
        government notification, so always confirm the current basic-pay band from that
        year’s official MPSC advertisement (जाहिरात) on{" "}
        <a href="https://mpsc.gov.in" target="_blank" rel="noopener noreferrer">
          mpsc.gov.in
        </a>
        .
      </StudyGuideCallout>

      <h3>1. How a government salary is built</h3>
      <p>
        Maharashtra state government pay follows a <strong>pay matrix</strong> structure
        based on the 7th Pay Commission. Every post has a <strong>pay level</strong>, and
        each level has a band of basic-pay values that rises with annual increments. Final
        salary is built in four steps:
      </p>
      <ul>
        <li>
          <strong>Basic pay</strong> — fixed by your post’s pay level and years in service.
        </li>
        <li>
          <strong>+ Dearness Allowance (DA)</strong> — a percentage of basic pay revised
          periodically to offset inflation. DA is the biggest reason gross pay rises faster
          than basic pay over a career.
        </li>
        <li>
          <strong>+ House Rent Allowance (HRA) and Travel Allowance (TA)</strong> — HRA
          depends on city classification; larger cities get a higher percentage. TA is a
          smaller fixed or graded amount.
        </li>
        <li>
          <strong>− Deductions</strong> — National Pension System (NPS) contribution and
          professional tax come out before the amount reaches your bank account, so net
          (in-hand) pay is always lower than gross pay.
        </li>
      </ul>

      <DisplayAd
        adsenseSlot={IN_CONTENT_AD_SLOT}
        ezoicKey="contentInline"
        className="my-8 not-prose"
      />

      <h3>2. Approximate starting pay (~ figures, 2025–26 era)</h3>
      <p>
        These are <strong>ballpark starting figures</strong> for newly joined officers under
        Maharashtra’s 7th Pay Commission matrix, after typical DA and city HRA, and after
        common deductions. They are meant for comparison — not as an official payslip.
      </p>
      <StudyGuideTable
        headers={[
          "Post group",
          "Example posts",
          "~ Basic pay (start)",
          "~ In-hand / month (start)",
        ]}
        rows={[
          [
            "Group C",
            "Clerk-Typist, Tax Assistant, Industry Inspector",
            "₹20,000 – ₹26,000",
            "₹28,000 – ₹40,000",
          ],
          [
            "Group B (Combined)",
            "PSI, State Tax Inspector, Assistant Section Officer",
            "₹38,000 – ₹45,000",
            "₹48,000 – ₹65,000",
          ],
          [
            "Rajyaseva (Gazetted)",
            "Deputy Collector, DySP, Tehsildar, BDO",
            "₹56,000 – ₹65,000",
            "₹75,000 – ₹1,00,000+",
          ],
        ]}
      />
      <ul>
        <li>
          <strong>Mumbai / Pune / large cities:</strong> HRA is higher, so in-hand often sits
          near the top of the range.
        </li>
        <li>
          <strong>Smaller towns / rural postings:</strong> HRA is lower; in-hand can sit near
          the bottom of the range (sometimes offset by official quarters).
        </li>
        <li>
          <strong>After 5–8 years:</strong> with increments + DA growth, many Group B officers
          move toward ~₹70,000 – ₹90,000 in-hand, while Rajyaseva field officers commonly
          cross ~₹1.1 – ₹1.4 lakh depending on posting and promotions.
        </li>
      </ul>
      <p>
        The gap between groups is not only the pay level. Gazetted posts also unlock
        benefits that never appear as a separate salary line: official residence or a
        higher HRA slab, an official vehicle or driver for many field postings, support
        staff, and a faster route to senior grades such as District Collector,
        Superintendent of Police or Divisional Commissioner.
      </p>

      <h3>3. How pay grows over a career</h3>
      <ul>
        <li>
          <strong>Annual increment.</strong> Basic pay rises by about 3% each year on your
          increment date, moving you one cell up your pay level.
        </li>
        <li>
          <strong>DA revisions.</strong> Applied about twice a year on top of basic pay for
          everyone in service. This is why gross pay steadily outpaces basic pay.
        </li>
        <li>
          <strong>Promotional pay-level jumps.</strong> Assured Career Progression schemes
          and departmental promotions move you to a higher pay level entirely — usually the
          biggest single jump in a career.
        </li>
        <li>
          <strong>Post promotion.</strong> PSI can rise to Inspector and beyond; STI/ASO can
          rise through Deputy or Assistant Commissioner grades; Group C posts have their own
          ladders. Rajyaseva officers have the highest ceiling for strong performers.
        </li>
      </ul>

      <h3>4. MPSC salary vs a private-sector salary</h3>
      <p>
        A private offer in a metro city can look higher than an MPSC starting salary in year
        one, and for many posts that comparison is true on paper. What changes the picture is
        the shape of the two income curves over 25–30 years:
      </p>
      <ul>
        <li>
          <strong>Certainty.</strong> A government salary does not depend on company
          performance, layoffs or economic cycles.
        </li>
        <li>
          <strong>Guaranteed growth.</strong> Annual increments and DA revisions are
          contractual, not discretionary.
        </li>
        <li>
          <strong>Retirement benefits.</strong> NPS with a government matching contribution
          and related benefits are built in; private retirement savings depend entirely on
          individual discipline.
        </li>
        <li>
          <strong>Non-cash value.</strong> Family medical cover, housing support for many
          posts, and — for gazetted posts especially — administrative authority and local
          social standing.
        </li>
      </ul>
      <p>
        Practical takeaway: if you are choosing between serious MPSC preparation and an early
        private offer, weigh the full 25–30 year income and security curve, not only the first
        payslip. For most aspirants already deep into preparation, an MPSC selection remains a
        financially sound long-term decision.
      </p>

      <h3>Next steps</h3>
      <ul>
        <li>
          Read the <Link href="/study-guides/mpsc-exam-pattern">MPSC Exam Pattern</Link> guide
          to map each exam to the posts above.
        </li>
        <li>
          See the{" "}
          <Link href="/study-guides/mpsc-preparation-strategy">MPSC Preparation Strategy</Link>{" "}
          guide for a practical study plan.
        </li>
        <li>
          Practise on real previous-year papers at <Link href="/exams">/exams</Link> — free,
          with answer keys and explanations.
        </li>
      </ul>
    </>
  );
}

function MarathiBody() {
  return (
    <>
      <h2>एमपीएससी पगार व वेतनश्रेणी — शासकीय वेतन खरे कसे काम करते</h2>
      <p className="!mt-2 !text-sm !text-slate-500 dark:!text-slate-400">
        अद्यतन: ऑगस्ट २०२६ · अंदाजे वाचन वेळ: ९ मिनिटे
      </p>

      <p>
        प्रत्येक एमपीएससी उमेदवाराचा दुसरा प्रश्न सहसा पगाराबद्दल असतो — पहिला प्रश्न परीक्षा
        पद्धतीचा असतो. खरे उत्तर असे आहे की एकच आकडा पूर्ण चित्र सांगत नाही. एमपीएससी पदाचे खरे
        मूल्य मूळ वेतन, विविध भत्ते आणि दीर्घकालीन फायद्यांमध्ये असते; ते फक्त एका पे-स्लिपवर
        दिसत नाही.
      </p>
      <p>
        हे द्विभाषिक मार्गदर्शक बहुतेक उमेदवार लक्ष्य करत असलेल्या पदांचे वेतन स्पष्ट करते —
        गट-ब (पोलीस उपनिरीक्षक, राज्य कर निरीक्षक, सहाय्यक विभाग अधिकारी), गट-क (लिपिक-टंकलेखक,
        कर सहाय्यक) आणि राज्यसेवा (उपजिल्हाधिकारी, पोलीस उपअधीक्षक, तहसीलदार). तसेच खाजगी
        नोकरीच्या ऑफरशी तुलना कशी करावी हेही सांगते. कोणती परीक्षा कोणत्या पदाकडे नेते हे
        समजण्यासाठी{" "}
        <Link href="/study-guides/mpsc-exam-pattern">एमपीएससी परीक्षा पद्धत</Link> मार्गदर्शक
        सोबत वाचा.
      </p>

      <StudyGuideCallout>
        <strong>महत्त्वाचे:</strong> खालील ~ पगाराचे आकडे २०२५–२६ चे अंदाजे तुलनात्मक आकडे
        आहेत. महागाई भत्त्याचे प्रमाण आणि वेतनस्तर शासकीय अधिसूचनेने बदलतात, म्हणून अचूक मूळ
        वेतन त्या वर्षाच्या अधिकृत एमपीएससी जाहिरातीतून{" "}
        <a href="https://mpsc.gov.in" target="_blank" rel="noopener noreferrer">
          mpsc.gov.in
        </a>{" "}
        वर तपासा.
      </StudyGuideCallout>

      <h3>१. शासकीय पगार कसा तयार होतो</h3>
      <p>
        महाराष्ट्र शासनाचे वेतन सातव्या वेतन आयोगावर आधारित <strong>पे मॅट्रिक्स</strong>{" "}
        पद्धतीने ठरते. प्रत्येक पदाला एक <strong>वेतनस्तर</strong> असतो आणि त्या स्तरात वार्षिक
        वाढीनुसार मूळ वेतन वाढत जाते. अंतिम पगार चार टप्प्यांनी तयार होतो:
      </p>
      <ul>
        <li>
          <strong>मूळ वेतन</strong> — तुमच्या पदाचा वेतनस्तर आणि सेवेतील वर्षे यावर अवलंबून.
        </li>
        <li>
          <strong>+ महागाई भत्ता (DA)</strong> — मूळ वेतनाच्या टक्केवारीत दिला जाणारा भत्ता.
          वाढत्या महागाईची भरपाई म्हणून शासन हा भत्ता वेळोवेळी सुधारते. करिअरमध्ये एकूण पगार
          मूळ वेतनापेक्षा वेगाने वाढण्याचे मुख्य कारण हेच असते.
        </li>
        <li>
          <strong>+ घरभाडे भत्ता (HRA) आणि प्रवास भत्ता (TA)</strong> — घरभाडे भत्ता शहराच्या
          वर्गीकरणावर अवलंबून असतो; मोठ्या शहरात टक्केवारी जास्त असते. प्रवास भत्ता तुलनेने
          लहान आणि निश्चित किंवा श्रेणीबद्ध असतो.
        </li>
        <li>
          <strong>− कपात</strong> — राष्ट्रीय पेन्शन प्रणाली (NPS) योगदान आणि व्यवसाय कर बँक
          खात्यात पैसे येण्यापूर्वी वजा होतात. म्हणून हातात मिळणारा (निव्वळ) पगार नेहमी एकूण
          पगारापेक्षा कमी असतो.
        </li>
      </ul>

      <DisplayAd
        adsenseSlot={IN_CONTENT_AD_SLOT}
        ezoicKey="contentInline"
        className="my-8 not-prose"
      />

      <h3>२. अंदाजे सुरुवातीचा पगार (~ आकडे, २०२५–२६)</h3>
      <p>
        खालील आकडे महाराष्ट्राच्या सातव्या वेतन आयोगानुसार{" "}
        <strong>नव्याने रुजू झालेल्या अधिकाऱ्यांसाठी अंदाजे</strong> आहेत — सामान्य महागाई भत्ता,
        शहरानुसार घरभाडे भत्ता आणि नेहमीच्या कपातीनंतर. तुलना समजण्यासाठी आहेत; अधिकृत पे-स्लिप
        नव्हे.
      </p>
      <StudyGuideTable
        headers={[
          "पदगट",
          "उदाहरणे",
          "~ मूळ वेतन (सुरुवात)",
          "~ हातात / महिना (सुरुवात)",
        ]}
        rows={[
          [
            "गट-क",
            "लिपिक-टंकलेखक, कर सहाय्यक, उद्योग निरीक्षक",
            "₹२०,००० – ₹२६,०००",
            "₹२८,००० – ₹४०,०००",
          ],
          [
            "गट-ब (Combined)",
            "पोलीस उपनिरीक्षक, राज्य कर निरीक्षक, सहाय्यक विभाग अधिकारी",
            "₹३८,००० – ₹४५,०००",
            "₹४८,००० – ₹६५,०००",
          ],
          [
            "राज्यसेवा (राजपत्रित)",
            "उपजिल्हाधिकारी, पोलीस उपअधीक्षक, तहसीलदार, गट विकास अधिकारी",
            "₹५६,००० – ₹६५,०००",
            "₹७५,००० – ₹१,००,०००+",
          ],
        ]}
      />
      <ul>
        <li>
          <strong>मुंबई / पुणे / मोठी शहरे:</strong> घरभाडे भत्ता जास्त असल्याने हातात मिळणारा
          पगार श्रेणीच्या वरच्या टोकाला असतो.
        </li>
        <li>
          <strong>लहान शहरे / ग्रामीण पदस्थापना:</strong> घरभाडे भत्ता कमी; हातात मिळणारा पगार
          श्रेणीच्या खालच्या टोकाला असू शकतो (अधिकृत निवास मिळाल्यास तो फरक कमी होतो).
        </li>
        <li>
          <strong>५–८ वर्षांनंतर:</strong> वेतनवाढ + महागाई भत्ता वाढल्याने अनेक गट-ब अधिकारी
          सुमारे ~₹७०,००० – ₹९०,००० हातात पोहोचतात; राज्यसेवा क्षेत्रीय अधिकारी पदोन्नती व
          पदस्थापनेनुसार अनेकदा ~₹१.१ – ₹१.४ लाख ओलांडतात.
        </li>
      </ul>
      <p>
        गटांमधील फरक फक्त वेतनस्तरापुरता मर्यादित नाही. राजपत्रित पदांना असे फायदे मिळतात जे
        वेगळ्या पगार ओळीत दिसत नाहीत: अधिकृत निवास किंवा उच्च घरभाडे भत्ता, अनेक क्षेत्रीय
        पदांसाठी अधिकृत वाहन किंवा चालक, सहाय्यक कर्मचारी आणि जिल्हाधिकारी, पोलीस अधीक्षक किंवा
        विभागीय आयुक्त यांसारख्या वरिष्ठ पदांकडे जलद वाटचाल.
      </p>

      <h3>३. करिअरमध्ये पगार कसा वाढतो</h3>
      <ul>
        <li>
          <strong>वार्षिक वेतनवाढ.</strong> वाढीच्या दिवशी मूळ वेतन सुमारे ३% ने वाढते आणि तुम्ही
          त्याच वेतनस्तरातील पुढच्या कक्षेत जाता.
        </li>
        <li>
          <strong>महागाई भत्त्यातील सुधारणा.</strong> सेवेतील सर्वांसाठी वर्षातून साधारण दोनदा
          लागू होतात. त्यामुळे एकूण पगार हळूहळू मूळ वेतनापेक्षा पुढे जातो.
        </li>
        <li>
          <strong>पदोन्नतीमुळे वेतनस्तर बदलणे.</strong> सुनिश्चित करिअर प्रगती योजना आणि विभागीय
          पदोन्नती तुम्हाला पूर्णपणे उच्च वेतनस्तरावर नेतात — करिअरमधील सर्वात मोठी एकरकमी वाढ
          सहसा हीच असते.
        </li>
        <li>
          <strong>पदातील प्रगती.</strong> पोलीस उपनिरीक्षक निरीक्षक आणि पुढे जाऊ शकतो; राज्य कर
          निरीक्षक / सहाय्यक विभाग अधिकारी उप/सहाय्यक आयुक्त श्रेणीत जाऊ शकतात; गट-क पदांनाही
          स्वतःची शिडी असते. चांगल्या कामगिरीसाठी राज्यसेवेची प्रगती मर्यादा सर्वाधिक उंच असते.
        </li>
      </ul>

      <h3>४. एमपीएससी पगार विरुद्ध खाजगी नोकरीचा पगार</h3>
      <p>
        शहरातील खाजगी ऑफर पहिल्या वर्षी एमपीएससीच्या सुरुवातीच्या पगारापेक्षा जास्त दिसू शकते
        आणि अनेक पदांसाठी कागदावर ते खरेही असते. पण २५–३० वर्षांच्या दोन्ही उत्पन्नाच्या
        वक्ररेषांकडे पाहिले की चित्र बदलते:
      </p>
      <ul>
        <li>
          <strong>निश्चितता.</strong> शासकीय पगार कंपनीच्या कामगिरीवर, नोकरी गमावण्यावर किंवा
          आर्थिक मंदीवर अवलंबून नसतो.
        </li>
        <li>
          <strong>हमीची वाढ.</strong> वार्षिक वेतनवाढ आणि महागाई भत्त्यातील सुधारणा करारबद्ध
          असतात; खाजगी मूल्यमापनाप्रमाणे त्या पूर्णपणे स्वेच्छाधीन नसतात.
        </li>
        <li>
          <strong>निवृत्तीनंतरचे फायदे.</strong> शासकीय योगदानासह राष्ट्रीय पेन्शन प्रणाली आणि
          संबंधित लाभ अंतर्भूत असतात. खाजगी क्षेत्रात निवृत्ती बचत पूर्णपणे वैयक्तिक शिस्तीवर
          अवलंबून असते.
        </li>
        <li>
          <strong>रोख नसलेले मूल्य.</strong> कुटुंबासाठी वैद्यकीय सुविधा, अनेक पदांसाठी निवास
          मदत आणि — विशेषतः राजपत्रित पदांसाठी — प्रशासकीय अधिकार व स्थानिक सामाजिक स्थान.
        </li>
      </ul>
      <p>
        व्यावहारिक निष्कर्ष: गंभीर एमपीएससी तयारी आणि लवकर खाजगी ऑफर यातील निवड करताना फक्त
        पहिली पे-स्लिप नव्हे, तर २५–३० वर्षांचे उत्पन्न व सुरक्षितता पाहा. जे उमेदवार आधीच तयारीत
        खोलवर आहेत, त्यांच्यासाठी एमपीएससी निवड दीर्घकालीन आर्थिकदृष्ट्या योग्य निर्णय ठरतो.
      </p>

      <h3>पुढची पावले</h3>
      <ul>
        <li>
          वरील पदांशी परीक्षा जुळवण्यासाठी{" "}
          <Link href="/study-guides/mpsc-exam-pattern">एमपीएससी परीक्षा पद्धत</Link> मार्गदर्शक
          वाचा.
        </li>
        <li>
          अभ्यास योजनेसाठी{" "}
          <Link href="/study-guides/mpsc-preparation-strategy">एमपीएससी तयारी रणनीती</Link>{" "}
          मार्गदर्शक पहा.
        </li>
        <li>
          मागील वर्षांच्या पेपर्सवर मोफत सराव{" "}
          <Link href="/exams">/exams</Link> येथे करा — उत्तरे आणि स्पष्टीकरणांसह.
        </li>
      </ul>
    </>
  );
}

export default function MpscSalaryPayScaleGuide() {
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
      title="MPSC Salary & Pay Scale · एमपीएससी पगार"
      subtitle="English + मराठी · about 9 min read"
      faq={FAQ}
      faqSchema={faqSchema}
    >
      <StudyGuideLangTabs english={<EnglishBody />} marathi={<MarathiBody />} />
    </StudyGuideShell>
  );
}
