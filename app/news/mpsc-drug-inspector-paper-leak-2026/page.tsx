import Link from "next/link";
import type { Metadata } from "next";
import DisplayAd from "@/components/DisplayAd";
import NewsShell from "@/components/NewsShell";
import StudyGuideCallout from "@/components/StudyGuideCallout";
import { IN_CONTENT_AD_SLOT } from "@/lib/adsConfig";
import { STUDY_GUIDE_PROSE_CLASS } from "@/lib/studyGuideStyles";

export const metadata: Metadata = {
  title: "MPSC Drug Inspector Paper Leak 2026 — Cancelled Recruitment & Reality Check",
  description:
    "Goosebumps timeline of the MPSC Drug Inspector (Group-B) paper leak: March 2026 screening exam cancelled after Mumbai Police Crime Branch findings. What honest aspirants must learn from this betrayal of trust.",
  keywords: [
    "MPSC paper leak",
    "MPSC Drug Inspector paper leak",
    "MPSC exam cancelled 2026",
    "Drug Inspector Group B MPSC",
    "MPSC recruitment cancelled",
    "Maharashtra paper leak",
    "MPSC news",
  ],
  alternates: { canonical: "/news/mpsc-drug-inspector-paper-leak-2026" },
};

const FAQ = [
  {
    q: "Why was the MPSC Drug Inspector recruitment cancelled?",
    a: "According to MPSC and public reports, the Mumbai Police Crime Branch’s preliminary inquiry found that the screening exam question paper (held on 22 March 2026) had been leaked, and that at least one candidate had received it and benefited. The Commission cancelled the recruitment process to protect fairness and candidate trust.",
  },
  {
    q: "Do earlier applicants need to apply again for the fresh exam?",
    a: "MPSC has stated that candidates who already applied need not apply again, and no fresh examination fee will be charged. A separate notification will announce the re-examination schedule.",
  },
  {
    q: "Does a paper leak mean honest preparation is useless?",
    a: "No. Leaks destroy trust and waste years of honest work — that is exactly why cancellation and investigation matter. Systems fail; your discipline should not. Keep practising PYQs, mocks and CSAT the clean way.",
  },
];

export default function MpscDrugInspectorPaperLeakPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: "MPSC Drug Inspector Paper Leak 2026 — When Trust Collapses Overnight",
    datePublished: "2026-08-30",
    dateModified: "2026-08-30",
    author: { "@type": "Organization", name: "Don't know Academy" },
    publisher: { "@type": "Organization", name: "Don't know Academy", url: "https://www.mpscs.in" },
    mainEntityOfPage: "https://www.mpscs.in/news/mpsc-drug-inspector-paper-leak-2026",
    description:
      "Timeline and reality check on the MPSC Drug Inspector Group-B paper leak and cancelled recruitment after Mumbai Police Crime Branch findings.",
  };

  return (
    <NewsShell
      title="When the Paper Leaks, the Dream Bleeds"
      subtitle="MPSC Drug Inspector paper leak · Reality check for every honest aspirant"
      faq={FAQ}
      faqSchema={faqSchema}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className={STUDY_GUIDE_PROSE_CLASS}>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Published: 30 August 2026 · Based on public reports (MPSC statements &amp; national media)
        </p>

        <p>
          Imagine this.
        </p>
        <p>
          You wake up at 5 a.m. for months. You skip weddings. You revise pharmacology, Acts,
          schemes and aptitude until your eyes burn. Your parents stop asking “कधी होणार?” because
          they have learnt to wait in silence. On exam day you walk into the hall with clean hands
          and a racing heart.
        </p>
        <p>
          Somewhere else — before the bell even rings — someone already has the paper.
        </p>
        <p>
          That is not a movie scene. That is the nightmare Maharashtra aspirants lived through with
          the <strong>MPSC Drug Inspector (Group-B)</strong> recruitment. And when the truth
          finally stood up in public, an entire process had to be cancelled.
        </p>

        <StudyGuideCallout>
          <p className="m-0 font-medium">
            Reality check: A leaked question paper does not only “help a few cheaters.” It
            steals months of life from thousands who played fair — and it stains the trust every
            competitive exam is built on.
          </p>
        </StudyGuideCallout>

        <h3>The goosebumps timeline</h3>
        <p>
          Hold the dates. Feel the delay between hope and collapse.
        </p>
        <ul>
          <li>
            <strong>29 July 2025</strong> — Notification for Drug Inspector (Group-B) posts under
            the Food and Drug Administration Department.
          </li>
          <li>
            <strong>22 March 2026</strong> — Offline screening exam across six divisional
            headquarters. Roughly tens of thousands of candidates sit with faith in the system.
          </li>
          <li>
            <strong>Around 20 March 2026 (as alleged in complaints)</strong> — Reports later said
            some candidates claimed they had obtained questions / the paper before the exam,
            including via social or digital channels.
          </li>
          <li>
            <strong>12 June 2026</strong> — Screening result declared. Hundreds move toward
            interview. Families start calculating joining dates in their heads.
          </li>
          <li>
            <strong>1–22 July 2026</strong> — Interviews. A provisional merit list of hundreds is
            published. Selection feels close enough to touch.
          </li>
          <li>
            <strong>22–26 July 2026</strong> — Complaints reach MPSC: paper leak. Irregularities.
            Whispers become written allegations.
          </li>
          <li>
            <strong>27 July 2026</strong> — MPSC approaches Mumbai Police.
          </li>
          <li>
            <strong>Late July / August 2026</strong> — Mumbai Police Crime Branch preliminary
            findings: prima facie, a candidate had received the question set and benefited.
          </li>
          <li>
            <strong>25–26 August 2026</strong> — MPSC cancels the Drug Inspector recruitment
            process. Fresh exam announced. Old applicants need not re-apply; no fresh fee.
          </li>
        </ul>
        <p>
          Read that again. From notification to cancellation, almost a year of human hope —
          interrupted by a breach of confidentiality.
        </p>

        <DisplayAd
          adsenseSlot={IN_CONTENT_AD_SLOT}
          ezoicKey="contentInline"
          className="my-8 not-prose"
        />

        <h3>What makes this chilling</h3>
        <p>
          Paper leaks are not “jugaad.” They are a knife in the dark aimed at merit.
        </p>
        <p>
          The most frightening part is not only that a paper may travel before the exam. It is
          that honest candidates can finish the whole pipeline — screening, interview, merit list —
          before the floor disappears. One day you are celebrating. The next day the process is
          void.
        </p>
        <p>
          Media reports also described arrests connected to the case, including people linked to
          the Commission process and candidates in the chain of transmission. Investigations evolve;
          courts decide guilt. But the lesson for aspirants is already clear:{" "}
          <strong>when confidentiality breaks, everybody pays — especially the clean ones.</strong>
        </p>

        <StudyGuideCallout tone="sky">
          <p className="m-0">
            We are not writing this to create panic. We are writing it so you never romanticise
            “shortcut culture.” If someone sells you “paper guaranteed,” they are selling your
            future into a crime scene.
          </p>
        </StudyGuideCallout>

        <h3>The reality check nobody wants — but everybody needs</h3>
        <ol>
          <li>
            <strong>You cannot outwork a leaked paper in that hall.</strong> That is why cancellation
            is painful and necessary. Fairness must be restored even if it hurts timelines.
          </li>
          <li>
            <strong>Your only durable advantage is skill that survives a re-exam.</strong> Concepts,
            PYQs, speed, accuracy, temperament. Leaks expire. Discipline compounds.
          </li>
          <li>
            <strong>Silence helps the leak; reporting protects the process.</strong> If you ever
            receive suspicious material before an exam, treat it as a red alert — not a gift.
          </li>
          <li>
            <strong>Do not build your life plan on one notification.</strong> Keep parallel
            preparation: Combine Pre, Group C, PSI pattern papers, CSAT. One cancelled process
            should not erase your decade.
          </li>
        </ol>

        <h3>What honest aspirants should do this week</h3>
        <ul>
          <li>
            Follow only official updates on{" "}
            <a href="https://www.mpsc.gov.in" target="_blank" rel="noopener noreferrer">
              mpsc.gov.in
            </a>{" "}
            for the re-exam notification.
          </li>
          <li>
            Keep revising with{" "}
            <Link href="/exams">free MPSC previous-year papers</Link> and{" "}
            <Link href="/?mode=mock">timed mocks</Link> — clean practice, official-key thinking.
          </li>
          <li>
            Strengthen aptitude via{" "}
            <Link href="/?mode=csat">CSAT &amp; Aptitude</Link> so a fresh paper never finds you
            weak on scoring areas.
          </li>
          <li>
            Protect your mental health. Cancellation is grief. Name it, then return to the desk.
          </li>
        </ul>

        <h3>Final word</h3>
        <p>
          Somewhere in Maharashtra tonight, a student is still studying under a tube light —
          without a leaked PDF, without a middleman, without a “guarantee.”
        </p>
        <p>
          That student is the reason this site exists.
        </p>
        <p>
          Paper leaks will try to steal the story. Don’t let them steal your standards. Stay clean.
          Stay sharp. When the fresh exam comes, walk in with the only paper that belongs to you:
          the one you earned with sweat.
        </p>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Disclaimer: This article summarises publicly reported developments for aspirant
          awareness. For legal findings, rely on official MPSC notifications and police /
          court records. Names and alleged roles in ongoing cases should be read as reported,
          not as final judicial conclusions.
        </p>
      </div>
    </NewsShell>
  );
}
