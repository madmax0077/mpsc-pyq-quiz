import Link from "next/link";
import type { Metadata } from "next";
import DisplayAd from "@/components/DisplayAd";
import NewsShell from "@/components/NewsShell";
import StudyGuideCallout from "@/components/StudyGuideCallout";
import { IN_CONTENT_AD_SLOT } from "@/lib/adsConfig";
import { STUDY_GUIDE_PROSE_CLASS } from "@/lib/studyGuideStyles";

export const metadata: Metadata = {
  title:
    "MPSC Mains Optional Marks Controversy 2026 — 2 & 6 out of 250, Aspirant Anger",
  description:
    "MPSC State Services Mains result storm: optional papers with 2, 6, 11 marks out of 250, qualifying language failures by 1–2 marks, Pune protests for re-evaluation, and what aspirants should do next.",
  keywords: [
    "MPSC optional marks controversy",
    "MPSC mains result discrepancy 2026",
    "MPSC re-evaluation demand",
    "MPSC optional subject low marks",
    "MPSC Rajyaseva mains marking",
    "MPSC qualifying Marathi English fail",
    "MPSC news",
  ],
  alternates: { canonical: "/news/mpsc-mains-optional-marks-controversy-2026" },
};

const FAQ = [
  {
    q: "What is the MPSC optional marks controversy about?",
    a: "After the first UPSC-style descriptive State Services Main exam results, candidates reported extreme score swings — including single-digit marks like 2, 6 or 11 out of 250 in optional papers, and huge gaps between Paper I and Paper II of the same optional. Many also said they were knocked out on qualifying Marathi/English by 1–2 marks.",
  },
  {
    q: "Are optional subjects being removed from MPSC Rajyaseva?",
    a: "Yes. MPSC has announced that from the 2027 State Services Main Examination, optional subjects will be removed for Gazetted Group-A/B, with a more uniform seven-paper pattern (qualifying languages + essay + four General Studies papers). Interview marks were revised in a later corrigendum. Confirm the final scheme on mpsc.gov.in.",
  },
  {
    q: "What are aspirants demanding right now?",
    a: "Public reports say candidates are asking for transparent valuation norms, proper moderation, and re-evaluation or inquiry where score patterns look abnormal. An MLA stated that the MPSC secretary took cognisance and indicated an inquiry — but candidates should act on official Commission notices, not social media claims.",
  },
  {
    q: "Should I stop preparing until the inquiry is over?",
    a: "No. If interview calls or the next cycle open, you must be ready. Keep General Studies, essay writing and language qualifying practice running while you follow the official process in parallel.",
  },
];

const REPORTED_CASES = [
  {
    paper: "Geography (optional)",
    reported: "Paper I ~121/250 vs Paper II ~2/250",
    concern: "Same candidate, same subject, opposite outcomes",
  },
  {
    paper: "Philosophy (optional)",
    reported: "~6/250 in a paper",
    concern: "Single-digit score in a 250-mark descriptive paper",
  },
  {
    paper: "Sociology (optional)",
    reported: "~11/250 and ~6/250; one claim of 11 vs ~100 across papers",
    concern: "Wide intra-subject spread",
  },
  {
    paper: "Essay",
    reported: "Some 150+, some allegedly ~14/250",
    concern: "Perceived evaluator-to-evaluator inconsistency",
  },
  {
    paper: "Marathi / English (qualifying)",
    reported: "Fails at 67/300 or 74 against a 75 floor",
    concern: "Strong candidates eliminated by 1–2 marks",
  },
];

const PATTERN_SHIFT = [
  { item: "Optional subject papers", before: "2 papers × 250 = 500 marks", after: "Removed" },
  { item: "Written total (merit)", before: "1,750", after: "1,250" },
  { item: "Compulsory papers", before: "GS + languages + essay + optionals", after: "7 papers (languages, essay, GS 1–4)" },
  { item: "Language papers", before: "Qualifying (25% floor)", after: "Qualifying (25% floor)" },
  { item: "Interview", before: "275", after: "175 (per reported corrigendum)" },
];

export default function MpscMainsOptionalMarksControversyPage() {
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
    headline:
      "MPSC Mains Optional Marks Controversy 2026 — When 250 Marks Feel Like a Lottery",
    datePublished: "2026-09-02",
    dateModified: "2026-09-02",
    author: { "@type": "Organization", name: "Don't know Academy" },
    publisher: {
      "@type": "Organization",
      name: "Don't know Academy",
      url: "https://www.mpscs.in",
    },
    mainEntityOfPage:
      "https://www.mpscs.in/news/mpsc-mains-optional-marks-controversy-2026",
    description:
      "Aspirant reality check on MPSC State Services Mains marking disputes: optional single-digit scores, qualifying language knockouts, Pune protest, and the 2027 optional-removal context.",
  };

  return (
    <NewsShell
      title="When 250 Marks Feel Like a Lottery"
      subtitle="MPSC Mains optional marking storm · Reality check for every honest aspirant"
      faq={FAQ}
      faqSchema={faqSchema}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className={STUDY_GUIDE_PROSE_CLASS}>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Published: 2 September 2026 · Based on public reports (Marathi media
          and aspirant protest coverage, 1–2 September 2026)
        </p>

        <p>
          You spent two years on one optional. You wrote Geography, Sociology or
          Philosophy answers until your handwriting changed. You trained for the
          first UPSC-style descriptive Mains like it was a second job.
        </p>
        <p>
          Then the result arrived. Paper I looked human. Paper II looked like a
          different person wrote it — or a different person checked it.
        </p>
        <p>
          <strong>121 out of 250</strong> in Geography Paper I.{" "}
          <strong>2 out of 250</strong> in Geography Paper II. Same candidate,
          same subject, same exam cycle. That figure — reported across Marathi
          newsrooms — is why the{" "}
          <strong>MPSC State Services Main Examination</strong> result is
          trending for all the wrong reasons.
        </p>

        <StudyGuideCallout>
          <p className="m-0 font-medium">
            Reality check: some variation is normal in descriptive papers.
            Single-digit scores out of 250, or a 100-mark cliff between two
            papers of the same optional, do not feel like variation to the
            person who wrote both papers in the same fortnight. Transparency
            stops being optional when careers are on the line.
          </p>
        </StudyGuideCallout>

        <h3>1. What is being alleged</h3>
        <p>
          The common charge across aspirant groups and news reports is that{" "}
          <strong>valuation looks inconsistent</strong> — most visibly in
          optional subjects and in the qualifying language papers. These are the
          examples repeatedly cited in public coverage.
        </p>

        <div className="prose-table-wrap my-4 -mx-1 overflow-x-auto rounded-xl">
          <table>
            <thead>
              <tr>
                <th>Paper</th>
                <th>Reported marks</th>
                <th>Why candidates object</th>
              </tr>
            </thead>
            <tbody>
              {REPORTED_CASES.map((row) => (
                <tr key={row.paper}>
                  <td>{row.paper}</td>
                  <td>{row.reported}</td>
                  <td>{row.concern}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          These are candidate-reported figures carried by media, not audited
          records. What matters is the pattern they describe, and the fact that
          it has gone unexplained long enough for students to reach the street.
        </p>

        <h3>2. The Pune protest</h3>
        <p>
          On <strong>2 September 2026</strong>, large numbers of aspirants
          gathered in Pune demanding re-evaluation and a transparent checking
          process. Coverage of the protest carried bitter lines suggesting posts
          were effectively for sale — despair language rather than proof.
        </p>
        <p>
          Read the anger as a trust signal. Read the corruption claims as
          allegations until an inquiry establishes anything.
        </p>

        <DisplayAd
          adsenseSlot={IN_CONTENT_AD_SLOT}
          ezoicKey="contentInline"
          className="my-8 not-prose"
        />

        <h3>3. Why optional papers became the flashpoint</h3>
        <p>
          Optionals were always the soft underbelly of Mains: different syllabi,
          different evaluator pools, different scoring cultures. That is exactly
          why several State PSCs dropped them — and why{" "}
          <strong>
            MPSC has already decided to remove optionals from the State Services
            Main Examination from 2027
          </strong>
          , citing a more uniform and standardised evaluation model.
        </p>

        <div className="prose-table-wrap my-4 -mx-1 overflow-x-auto rounded-xl">
          <table>
            <thead>
              <tr>
                <th>Component</th>
                <th>Current (optional era)</th>
                <th>From 2027 (announced)</th>
              </tr>
            </thead>
            <tbody>
              {PATTERN_SHIFT.map((row) => (
                <tr key={row.item}>
                  <td>{row.item}</td>
                  <td>{row.before}</td>
                  <td>{row.after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p>
          So this storm is landing in the final stretch of the optional era —
          when every mark still decides who reaches the interview room, while
          the next batch has already been told the optional game is ending.
        </p>

        <StudyGuideCallout tone="sky">
          <p className="m-0">
            Context, not excuse: removing optionals from 2027 may reduce
            subject-wise scoring lottery in future cycles. It does not remove
            the duty to explain extreme outcomes in the cycle that just ended.
          </p>
        </StudyGuideCallout>

        <h3>4. The quieter knife — qualifying languages</h3>
        <p>
          Optionals get the headlines. Qualifying Marathi and English end
          journeys in silence.
        </p>
        <p>
          Reports describe candidates comfortably ahead on merit papers who were
          declared not qualified because a language score sat at 74 against a
          75 floor, or 67 out of 300 alongside an essay score near 195 out of
          250. When language papers are only qualifying, that one mark is not a
          language problem. It is a full stop.
        </p>

        <h3>5. What officials and public voices have said</h3>
        <p>
          MLA <strong>Rohit Pawar</strong> stated on 1 September 2026 that
          students had alleged irregularities in Mains paper checking, including
          negligible scores such as 2, 4 and 6; that the matter was discussed
          with the MPSC secretary; and that serious cognisance and an inquiry
          were indicated. Media houses carried the same mark-sheet examples.
        </p>
        <p>
          Until the Commission publishes something formal, treat &ldquo;inquiry
          promised&rdquo; as a media-reported development. Rumour feeds anxiety.
          Official notices enable action.
        </p>

        <h3>6. What aspirants should actually do</h3>
        <ol>
          <li>
            <strong>Your anger is legitimate.</strong> Asking for transparent
            valuation is civic hygiene, especially in the same season as the
            Drug Inspector paper leak.
          </li>
          <li>
            <strong>Document everything.</strong> Keep mark sheets, application
            numbers and written representations. Follow{" "}
            <a
              href="https://www.mpsc.gov.in"
              target="_blank"
              rel="noopener noreferrer"
            >
              mpsc.gov.in
            </a>{" "}
            for re-check, RTI or inquiry updates.
          </li>
          <li>
            <strong>Do not freeze your preparation.</strong> If interview calls
            open, waiting on social-media verdicts costs you the round you can
            still win.
          </li>
          <li>
            <strong>If you are 2027-facing, redesign now.</strong> Build for
            seven compulsory papers and a lower written total; confirm every
            number against the official scheme before rewriting notes.
          </li>
          <li>
            <strong>Never buy &ldquo;marks fixing&rdquo;.</strong> That market
            feeds on exactly this distrust and poisons the honest queue.
          </li>
        </ol>

        <DisplayAd
          adsenseSlot={IN_CONTENT_AD_SLOT}
          ezoicKey="contentInline"
          className="my-8 not-prose"
        />

        <h3>7. This week&rsquo;s checklist</h3>
        <ul>
          <li>
            Track official MPSC notifications on revaluation or inquiry — not
            forwarded screenshots.
          </li>
          <li>
            Keep General Studies and essay writing warm with{" "}
            <Link href="/exams">free previous-year papers</Link> and{" "}
            <Link href="/?mode=mock">timed mocks</Link>.
          </li>
          <li>
            If languages nearly failed you, rebuild Marathi and English answer
            habits now — the 25% floor will not soften.
          </li>
          <li>
            Read our earlier reality check on{" "}
            <Link href="/news/mpsc-drug-inspector-paper-leak-2026">
              the Drug Inspector paper leak
            </Link>{" "}
            — same season, same trust wound, different symptom.
          </li>
        </ul>

        <h3>Final word</h3>
        <p>
          A competitive exam is supposed to be hard. It is not supposed to feel
          arbitrary.
        </p>
        <p>
          When a candidate sees 121 and 2 in the same optional, the question is
          no longer only &ldquo;did I prepare enough?&rdquo; It becomes{" "}
          <em>can I trust the mirror?</em>
        </p>
        <p>
          Demand that the mirror be cleaned through process, not rumour. And
          while the Commission answers, keep doing the one thing that still
          belongs entirely to you: write the next answer better than the last.
        </p>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Disclaimer: this article summarises publicly reported aspirant
          complaints, protest coverage and statements for awareness. Individual
          mark claims are as reported in media or by candidates and are not
          independently verified here. For rules, re-evaluation and final
          findings, rely on official MPSC notifications and records.
        </p>
      </div>
    </NewsShell>
  );
}
