import Link from "next/link";
import type { Metadata } from "next";
import DisplayAd from "@/components/DisplayAd";
import StudyGuideCallout from "@/components/StudyGuideCallout";
import StudyGuideShell from "@/components/StudyGuideShell";
import StudyGuideTable from "@/components/StudyGuideTable";
import { IN_CONTENT_AD_SLOT } from "@/lib/adsConfig";
import { STUDY_GUIDE_PROSE_CLASS } from "@/lib/studyGuideStyles";
import { STATE_PSC_EXAMS } from "@/lib/statePscExams";

export const metadata: Metadata = {
  title: "State PSC Exams in India — Complete List (UPSC, MPSC, UPPSC, BPSC, RPSC & More)",
  description:
    "Full list of State Public Service Commission exams across India — MPSC, UPPSC, BPSC, RPSC, TNPSC, KPSC, MPPSC, WBPSC, GPSC, TSPSC and more. Free CSAT/aptitude practice on mpscs.in that transfers to every state prelims.",
  keywords: [
    "state PSC exams India",
    "list of state PSC",
    "UPPSC",
    "BPSC",
    "RPSC",
    "TNPSC",
    "KPSC",
    "MPPSC",
    "WBPSC",
    "GPSC",
    "TSPSC",
    "OPSC",
    "HPSC",
    "JKPSC",
    "MPSC",
    "UPSC CSE",
    "SSC CGL",
    "state civil services exam list",
    "PSC exams in India",
  ],
  alternates: { canonical: "/study-guides/state-psc-exams-india" },
};

const FAQ = [
  {
    q: "Does mpscs.in have PYQs for UPPSC, BPSC, RPSC or TNPSC?",
    a: "Previous-year papers currently hosted on this site are Maharashtra MPSC papers (Rajyaseva, Group B/C, PSI and related). For other states, use our free CSAT & Aptitude module — the same quant and reasoning skills appear in almost every state prelims.",
  },
  {
    q: "Which state PSC exams are covered in this list?",
    a: "All major state Public Service Commissions are listed — from APPSC and BPSC to TNPSC, TSPSC, WBPSC, UKPSC and more — plus UPSC and SSC for all-India aspirants who often prepare aptitude alongside state exams.",
  },
  {
    q: "Can students outside Maharashtra use this website?",
    a: "Yes. Aptitude, reasoning, data interpretation and CSAT-style practice help every state and UPSC aspirant. MPSC PYQs are also useful for shared GS areas like Indian Polity, Economy, Environment and Science.",
  },
  {
    q: "Is CSAT required in every state PSC?",
    a: "Not always under the same name. Some commissions run a separate aptitude paper; others embed quant and reasoning inside GS. Practising CSAT topics still strengthens the skills those papers test.",
  },
];

export default function StatePscExamsIndiaPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const rows = STATE_PSC_EXAMS.map((exam) => [
    exam.state,
    <>
      <span className="font-semibold text-slate-800 dark:text-slate-100">{exam.shortName}</span>
      <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">{exam.commission}</span>
    </>,
    <>
      {exam.flagshipExam}
      {exam.alsoKnownAs ? (
        <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
          Also: {exam.alsoKnownAs}
        </span>
      ) : null}
    </>,
  ]);

  return (
    <StudyGuideShell
      title="State PSC Exams Across India"
      subtitle="Complete commission list · Free CSAT practice for every state"
      faq={FAQ}
      faqSchema={faqSchema}
    >
      <div className={STUDY_GUIDE_PROSE_CLASS}>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Last updated: August 2026 · Reading time: ~6 minutes
        </p>

        <p>
          India has a Public Service Commission in every state, plus all-India bodies like{" "}
          <strong>UPSC</strong> and <strong>SSC</strong>. Each commission runs its own Combined /
          State Service / Group exams — but the aptitude and reasoning skills they test overlap
          heavily. This page lists the major state PSC exams so aspirants from any state can find
          free practice that still helps their prelims.
        </p>

        <StudyGuideCallout>
          <p className="m-0 font-medium">
            Honest scope: PYQ papers on mpscs.in are <strong>Maharashtra MPSC</strong> focused.
            Our <strong>CSAT &amp; Aptitude</strong> module (quant, reasoning, DI) is built for
            MPSC Paper II and transfers cleanly to UPSC CSAT and most state prelims.
          </p>
        </StudyGuideCallout>

        <h3>How to use this site if you are not from Maharashtra</h3>
        <ol>
          <li>
            Practise free CSAT topics at{" "}
            <Link href="/?mode=csat">CSAT &amp; Aptitude</Link> — English and Marathi.
          </li>
          <li>
            Use{" "}
            <Link href="/study-guides/upsc-csat-practice">UPSC CSAT practice notes</Link> if you
            are targeting CSE Prelims Paper II.
          </li>
          <li>
            Browse <Link href="/exams">MPSC previous-year papers</Link> for shared GS areas
            (Polity, Economy, Environment, Science) — useful revision even for other states.
          </li>
        </ol>

        <DisplayAd
          adsenseSlot={IN_CONTENT_AD_SLOT}
          ezoicKey="contentInline"
          className="my-8 not-prose"
        />

        <h3>Complete list of State PSC / Civil Services exams</h3>
        <p>
          Short names below are what students usually search for. Always confirm the latest
          notification on the official commission website for vacancies, syllabus and pattern.
        </p>
      </div>

      <StudyGuideTable headers={["State / UT", "Commission", "Flagship exam"]} rows={rows} />

      <div className={STUDY_GUIDE_PROSE_CLASS}>
        <h3>Why aptitude practice still matters for every state</h3>
        <p>
          Whether your commission calls it CSAT, Aptitude, Mental Ability or embeds it inside GS,
          the core skills stay the same: percentages, ratio, time-work, series, coding-decoding,
          syllogism, puzzles and data interpretation. A stronger aptitude base raises your
          qualifying chance and frees revision time for state-specific GS.
        </p>

        <StudyGuideCallout tone="sky">
          <p className="m-0">
            Start free practice now:{" "}
            <Link href="/?mode=csat" className="font-semibold underline-offset-2 hover:underline">
              Open CSAT &amp; Aptitude
            </Link>
            . Timed speed tests use the same 1/4 negative marking common in many prelims.
          </p>
        </StudyGuideCallout>

        <h3>Related guides</h3>
        <ul>
          <li>
            <Link href="/study-guides/mpsc-csat-preparation">MPSC CSAT preparation</Link>
          </li>
          <li>
            <Link href="/study-guides/upsc-csat-practice">UPSC CSAT practice</Link>
          </li>
          <li>
            <Link href="/study-guides/mpsc-exam-pattern">MPSC exam pattern</Link>
          </li>
          <li>
            <Link href="/exams">Free MPSC previous-year papers</Link>
          </li>
        </ul>
      </div>
    </StudyGuideShell>
  );
}
