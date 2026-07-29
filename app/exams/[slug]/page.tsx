import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getExamPaper, getExamPapers, type ExamPaperDetail } from "@/lib/examPapers";
import DisplayAd from "@/components/DisplayAd";
import { IN_CONTENT_AD_SLOT } from "@/lib/adsConfig";

const SITE_URL = "https://www.mpscs.in";

type PageProps = { params: { slug: string } };

export function generateStaticParams() {
  return getExamPapers().map((p) => ({ slug: p.slug }));
}

function metaDescription(p: ExamPaperDetail): string {
  const subj = p.subjects.slice(0, 4).map((s) => s.name).join(", ");
  const langs = p.hasMarathi ? "English & Marathi" : "English";
  return `${p.title} — ${p.questionCount} previous-year questions with the official Set A answer key and detailed explanations. Covers ${subj}. Practice free online in ${langs} on MPSC PYQ QUIZ.`;
}

export function generateMetadata({ params }: PageProps): Metadata {
  const paper = getExamPaper(params.slug);
  if (!paper) return {};
  const title = `${paper.title} — Question Paper with Answer Key & Explanations`;
  const description = metaDescription(paper);
  return {
    title,
    description,
    keywords: [
      paper.title,
      `${paper.title} question paper`,
      `${paper.title} answer key`,
      `MPSC ${paper.type} ${paper.year || ""}`.trim(),
      "MPSC previous year question paper",
      "MPSC PYQ",
    ],
    alternates: { canonical: `/exams/${paper.slug}` },
    openGraph: {
      title: `${paper.title} | MPSC PYQ QUIZ`,
      description,
      url: `${SITE_URL}/exams/${paper.slug}`,
      type: "article",
    },
    robots: { index: true, follow: true },
  };
}

/** Tailored one-paragraph blurb by exam family. */
function typeBlurb(type: string): string {
  switch (type) {
    case "Group B":
      return "The MPSC Group B (Subordinate Services) Combined examination recruits for gazetted and non-gazetted Group B posts such as Assistant Section Officer (ASO), State Tax Inspector (STI) and Police Sub-Inspector (PSI). The preliminary paper is a 100-mark objective test on General Studies and intelligence, with one-fourth negative marking.";
    case "Group C":
      return "The MPSC Group C (Subordinate Services) Combined examination recruits for Group C posts such as Clerk-Typist, Tax Assistant, Sub-Inspector (State Excise) and Technical Assistant. The preliminary paper is a 100-mark objective General Studies and intelligence test with one-fourth negative marking.";
    case "Group B & C":
      return "This MPSC combined paper covers both Group B and Group C subordinate-service recruitment. The preliminary stage is a 100-mark objective General Studies and intelligence test set in parallel English and Marathi, with one-fourth negative marking.";
    case "PSI":
      return "The MPSC Police Sub-Inspector (PSI) examination recruits directly into the Maharashtra Police PSI cadre. The preliminary paper is a 100-mark objective General Studies and intelligence test with one-fourth negative marking.";
    case "Gazetted CS":
      return "The MPSC Gazetted Civil Services (formerly State Services) Combined examination is the flagship recruitment for higher gazetted administrative posts such as Deputy Collector, DySP, Tehsildar and BDO. The prelim is an objective General Studies test with one-fourth negative marking.";
    case "Gazetted TS":
      return "The MPSC Gazetted Technical Services Combined examination recruits for gazetted technical posts across engineering, agriculture, veterinary and forestry departments. The prelim is an objective General Studies and aptitude test with one-fourth negative marking.";
    default:
      return "This Maharashtra Public Service Commission paper follows the standard objective (MCQ) format with one-fourth negative marking, set in parallel English and Marathi. Every question below is transcribed from the official paper and paired with the official Set A answer key.";
  }
}

export default function ExamPaperPage({ params }: PageProps) {
  const paper = getExamPaper(params.slug);
  if (!paper) notFound();

  const langs = paper.hasMarathi ? "English & Marathi" : "English";
  const scored = paper.questionCount - paper.cancelledCount;

  // Related papers: same type first, then same year, up to 6.
  const all = getExamPapers().filter((p) => p.slug !== paper.slug);
  const related = [
    ...all.filter((p) => p.type === paper.type),
    ...all.filter((p) => p.type !== paper.type && p.year === paper.year),
  ].slice(0, 6);

  const breadcrumbItems = [
    { name: "Home", item: SITE_URL },
    { name: "Exam Papers", item: `${SITE_URL}/exams` },
    { name: paper.title, item: `${SITE_URL}/exams/${paper.slug}` },
  ];

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbItems.map((entry, idx) => ({
          "@type": "ListItem",
          position: idx + 1,
          name: entry.name,
          item: entry.item,
        })),
      },
      {
        "@type": "LearningResource",
        "@id": `${SITE_URL}/exams/${paper.slug}#resource`,
        name: `${paper.title} — MPSC Previous Year Question Paper`,
        url: `${SITE_URL}/exams/${paper.slug}`,
        description: metaDescription(paper),
        learningResourceType: "Exam question paper",
        educationalLevel: "Competitive exam (MPSC)",
        inLanguage: paper.hasMarathi ? ["en", "mr"] : ["en"],
        about: paper.subjects.slice(0, 6).map((s) => ({ "@type": "Thing", name: s.name })),
        isPartOf: { "@id": `${SITE_URL}/#website` },
        provider: { "@type": "EducationalOrganization", name: "Don't know Academy", url: SITE_URL },
      },
      paper.samples.length
        ? {
            "@type": "ItemList",
            name: `Sample questions from ${paper.title}`,
            numberOfItems: paper.samples.length,
            itemListElement: paper.samples.map((s, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              url: `${SITE_URL}/questions/${s.id}`,
              name: s.text.length > 110 ? `${s.text.slice(0, 107)}...` : s.text,
            })),
          }
        : null,
    ].filter(Boolean),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80">
        <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6">
          <nav className="text-xs text-slate-500 dark:text-slate-400" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-indigo-600">Home</Link>
            <span className="mx-1.5">/</span>
            <Link href="/exams" className="hover:text-indigo-600">Exam Papers</Link>
            <span className="mx-1.5">/</span>
            <span className="text-slate-700 dark:text-slate-300">{paper.title}</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">MPSC {paper.type}</span>
          {paper.year > 0 && (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">{paper.year}</span>
          )}
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{langs}</span>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300">Official Set A Key</span>
        </div>

        <h1 className="text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl dark:text-slate-100">
          {paper.title} — Question Paper with Answer Key &amp; Explanations
        </h1>

        <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
          Practice the <strong>{paper.title}</strong> previous-year paper online for free. This paper has{" "}
          <strong>{paper.questionCount} questions</strong>
          {paper.cancelledCount > 0 && (
            <> ({scored} scored, {paper.cancelledCount} cancelled by the Commission)</>
          )}
          , each with the official Set&nbsp;A answer key and a plain-language explanation. It is available in{" "}
          {langs} exactly as it appeared in the official Maharashtra Public Service Commission paper.{" "}
          <Link href="/" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700 dark:text-indigo-400">
            Sign in on the home page
          </Link>{" "}
          to attempt the full paper with instant scoring.
        </p>

        {/* Stat tiles */}
        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 text-center dark:border-indigo-800 dark:bg-indigo-900/30">
            <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">{paper.questionCount}</p>
            <p className="text-xs text-indigo-600 dark:text-indigo-300">Questions</p>
          </div>
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-900/30">
            <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">{paper.subjects.length}</p>
            <p className="text-xs text-emerald-600 dark:text-emerald-300">Subjects</p>
          </div>
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-center dark:border-amber-800 dark:bg-amber-900/30">
            <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">{paper.year || "—"}</p>
            <p className="text-xs text-amber-600 dark:text-amber-300">Exam Year</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-center dark:border-slate-700 dark:bg-slate-800">
            <p className="text-2xl font-bold text-slate-700 dark:text-slate-200">{paper.hasMarathi ? "2" : "1"}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Languages</p>
          </div>
        </div>

        {/* Subject breakdown */}
        {paper.subjects.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-3 text-xl font-bold text-slate-800 dark:text-slate-100">Subject-wise breakdown</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {paper.subjects.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  <span className="font-medium text-slate-700 dark:text-slate-200">{s.name}</span>
                  <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                    {s.count} {s.count === 1 ? "question" : "questions"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Mid-content ad — high viewability, between the subject breakdown and
            the sample-question list that readers scroll through. */}
        <DisplayAd
          adsenseSlot={IN_CONTENT_AD_SLOT}
          ezoicKey="contentInline"
          className="mt-10"
        />

        {/* Sample questions */}
        {paper.samples.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-1 text-xl font-bold text-slate-800 dark:text-slate-100">Sample questions with answers</h2>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
              A preview from this paper. Sign in to attempt all {paper.questionCount} questions with instant scoring.
            </p>
            <div className="space-y-4">
              {paper.samples.map((s, i) => (
                <article key={s.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0 rounded-md bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                      Q{s.number ?? i + 1}
                    </span>
                    <h3 className="font-semibold leading-6 text-slate-900 dark:text-slate-100">
                      <Link href={`/questions/${s.id}`} className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">
                        {s.text}
                      </Link>
                    </h3>
                  </div>
                  <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
                    {Object.entries(s.options).map(([k, v]) => {
                      const correct = s.correctAnswer === k;
                      return (
                        <div
                          key={k}
                          className={
                            "rounded-lg border px-3 py-2 text-sm " +
                            (correct
                              ? "border-emerald-300 bg-emerald-50 font-medium text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                              : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300")
                          }
                        >
                          <span className="mr-1.5 font-bold">{k}.</span>
                          {v}
                          {correct && <span className="ml-1.5 text-xs font-semibold">✓</span>}
                        </div>
                      );
                    })}
                  </div>
                  {s.correctAnswer && (
                    <p className="mt-3 text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                      Correct answer: {s.correctAnswer}
                    </p>
                  )}
                  {s.explanation && (
                    <p className="mt-1.5 whitespace-pre-line text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {s.explanation}
                    </p>
                  )}
                  <Link
                    href={`/questions/${s.id}`}
                    className="mt-3 inline-block text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    Read full explanation →
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="mt-10 rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50 to-violet-50 p-6 text-center dark:border-indigo-800 dark:from-indigo-900/30 dark:to-violet-900/30">
          <h2 className="text-lg font-bold text-indigo-700 dark:text-indigo-300">Attempt the full {paper.title}</h2>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Solve all {paper.questionCount} questions with instant scoring, detailed answers and a daily leaderboard — 100% free.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            Start Practicing — It&apos;s Free
          </Link>
        </div>

        {/* About this exam */}
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-bold text-slate-800 dark:text-slate-100">About the MPSC {paper.type} exam</h2>
          <div className="prose prose-slate max-w-none text-sm dark:prose-invert">
            <p>{typeBlurb(paper.type)}</p>
            <p>
              Practising the exact previous-year paper is the fastest way to internalise MPSC&apos;s
              option-framing style. The Commission recycles a meaningful share of its factual anchors —
              dates, Article numbers, districts, ratios and events — across paper cycles, so working
              through {paper.title} builds direct, transferable exam readiness. Pair this paper with our{" "}
              <Link href="/study-guides/mpsc-preparation-strategy" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700 dark:text-indigo-400">
                MPSC Preparation Strategy
              </Link>{" "}
              and{" "}
              <Link href="/study-guides/mpsc-exam-pattern" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700 dark:text-indigo-400">
                MPSC Exam Pattern
              </Link>{" "}
              guides for a complete study loop.
            </p>
          </div>
        </section>

        {/* Related papers */}
        {related.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-3 text-lg font-bold text-slate-800 dark:text-slate-100">More MPSC question papers</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/exams/${r.slug}`}
                  className="block rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-indigo-700 dark:hover:bg-indigo-900/20"
                >
                  <span className="block font-semibold text-slate-800 dark:text-slate-100">{r.title}</span>
                  <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                    {r.questionCount} questions · MPSC {r.type}{r.year ? ` · ${r.year}` : ""}
                  </span>
                </Link>
              ))}
            </div>
            <p className="mt-4 text-sm">
              <Link href="/exams" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
                Browse all MPSC previous-year papers →
              </Link>
            </p>
          </section>
        )}
      </main>

      <footer className="border-t border-slate-200/80 py-6 dark:border-slate-700/80">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-slate-400 dark:text-slate-500">MPSC PYQ QUIZ &middot; Don&apos;t know Academy</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
              <Link href="/" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Home</Link>
              <span>|</span>
              <Link href="/exams" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Exam papers</Link>
              <span>|</span>
              <Link href="/study-guides" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Study guides</Link>
              <span>|</span>
              <Link href="/about" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">About</Link>
              <span>|</span>
              <Link href="/privacy" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Privacy</Link>
              <span>|</span>
              <Link href="/disclaimer" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Disclaimer</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
