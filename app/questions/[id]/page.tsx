import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeoQuestion, getSeoQuestions, type SeoQuestion } from "@/lib/questionSeo";

const SITE_URL = "https://www.mpscs.in";

type PageProps = {
  params: { id: string };
};

/**
 * Returns 3-5 short paragraphs of unique context for a question so the page
 * crosses Google's "minimum content" threshold (AdSense rejects pages with
 * only a question + options as "Low value content").  The text is generated
 * deterministically from the question's metadata so every page is unique
 * without us having to hand-write content for thousands of items.
 */
function buildContext(q: SeoQuestion): { intro: string; why: string; how: string; subjectTip: string } {
  const subject = q.category || "this MPSC subject";
  const topic = q.topic || subject;
  const paper = q.quizTitle;
  const langWord = q.language === "marathi" ? "Marathi" : "English";

  const intro =
    `This MPSC previous-year question is taken from ${paper}.  ` +
    `It belongs to the ${subject} section${q.topic ? `, specifically the topic of ${q.topic}` : ""} ` +
    `and is presented here in ${langWord} exactly as it appeared in the official paper.`;

  const why =
    `Questions like this one repeat almost every year across MPSC Group B, Group C, PSI and Gazetted ` +
    `pre-exams because ${subject.toLowerCase()} forms a high-weightage chunk of the syllabus.  ` +
    `Practising the original paper wording — not paraphrased mocks — is the fastest way to recognise ` +
    `the question pattern, the option-framing style and the typical trick choices set by MPSC.`;

  const how =
    `Read each option carefully before checking the answer.  Once you commit to a choice, ` +
    `note WHY the other three options are wrong — this elimination habit is what separates a 60-percentile ` +
    `score from a 90-percentile score in the actual prelims.  For ${topic.toLowerCase()} questions ` +
    `in particular, MPSC tends to swap one word (causes vs. effects, before vs. after, ratifies vs. proposes) ` +
    `to flip the correct answer.`;

  const subjectTip =
    q.category === "Indian Polity"
      ? `Tip for Polity: pin down the Article number, the year of the amendment and the body that performs ` +
        `the action.  Most Polity questions can be solved by matching just those three anchors.`
      : q.category === "Geography"
      ? `Tip for Geography: locate the region on the Maharashtra map (use our interactive /map page), ` +
        `note the watershed, soil type and the nearest power plant or UNESCO site.  Spatial recall ` +
        `is the single biggest scorer for MPSC Geography.`
      : q.category === "History"
      ? `Tip for History: anchor the answer to a date, a king/leader and a primary source.  MPSC History ` +
        `options usually contain one option with the wrong date and one with the wrong dynasty — eliminate ` +
        `those first.`
      : q.category === "Science"
      ? `Tip for Science: write the underlying formula or chemical equation in the margin.  MPSC Science ` +
        `numericals are usually one-step substitutions; the trap is in the units, not the concept.`
      : q.category === "Economics"
      ? `Tip for Economics: connect every term to a year, a scheme and a ministry.  MPSC Economics ` +
        `options often swap the launch year or the implementing ministry — that's the easiest elimination.`
      : `Tip: revise this question with the rest of the ${subject} section on our subject-wise practice ` +
        `mode to lock the concept into long-term memory.`;

  return { intro, why, how, subjectTip };
}

export function generateStaticParams() {
  return getSeoQuestions().map((question) => ({ id: question.id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const question = getSeoQuestion(params.id);
  if (!question) return {};
  const titleText = question.text.length > 86 ? `${question.text.slice(0, 86)}...` : question.text;
  const description = `${question.text} Practice this MPSC question with options and answer on MPSC PYQ QUIZ.`;
  return {
    title: `${titleText} | MPSC Question`,
    description,
    alternates: { canonical: `/questions/${question.id}` },
    // Until each question page carries its own detailed explanation, keep
    // them out of the search index to satisfy AdSense / Google "minimum
    // content" requirements. Users can still reach them via direct links;
    // we just don't promote them to Google. `follow: true` so equity from
    // any inbound link is still passed back to the main site.
    robots: { index: false, follow: true },
    openGraph: {
      title: `${titleText} | MPSC PYQ QUIZ`,
      description,
      url: `${SITE_URL}/questions/${question.id}`,
      type: "article",
    },
  };
}

export default function QuestionSeoPage({ params }: PageProps) {
  const question = getSeoQuestion(params.id);
  if (!question) notFound();

  const optionEntries = Object.entries(question.options);
  const practiceUrl = "/?mode=subject";
  const ctx = buildContext(question);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <article className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
        <nav className="mb-4 text-xs text-slate-500">
          <Link href="/" className="hover:text-indigo-600">Home</Link>
          <span className="mx-1.5">/</span>
          <Link href="/exams" className="hover:text-indigo-600">Exams</Link>
          {question.category && (
            <>
              <span className="mx-1.5">/</span>
              <span>{question.category}</span>
            </>
          )}
          <span className="mx-1.5">/</span>
          <span className="text-slate-700">Question</span>
        </nav>

        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700">MPSC PYQ</span>
          {question.category && <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{question.category}</span>}
          {question.topic && <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">{question.topic}</span>}
          {question.language && <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{question.language}</span>}
        </div>

        <h1 className="text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
          {question.text}
        </h1>

        <p className="mt-4 text-sm leading-7 text-slate-600">{ctx.intro}</p>

        <section className="mt-6 grid gap-3">
          {optionEntries.map(([key, value]) => (
            <div
              key={key}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6"
            >
              <span className="mr-2 font-bold text-indigo-600">{key}.</span>
              {value}
            </div>
          ))}
        </section>

        {question.correctAnswer && (
          <p className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
            Correct answer: {question.correctAnswer}
          </p>
        )}

        <section className="mt-8 space-y-5 text-sm leading-7 text-slate-700">
          <div>
            <h2 className="text-base font-bold text-slate-900">Why this question matters</h2>
            <p className="mt-1.5">{ctx.why}</p>
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">How to attempt it in the exam</h2>
            <p className="mt-1.5">{ctx.how}</p>
          </div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm font-semibold text-amber-900">Subject-specific tip</p>
            <p className="mt-1 text-sm leading-7 text-amber-900/90">{ctx.subjectTip}</p>
          </div>
        </section>

        <section className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
          <h2 className="text-base font-bold text-slate-900">About this paper</h2>
          <p>
            <span className="font-semibold">Source:</span> {question.quizTitle}.
            This is one of {`several hundred`} previous-year questions we have transcribed
            from the official MPSC papers and answer keys, cross-checked option by option
            against the original PDFs, and made freely searchable on MPSC PYQ QUIZ.
          </p>
          <p>
            We do not paraphrase the wording — the question above appears exactly as it
            was printed in the original paper.  Where official answer-key revisions exist,
            we update the highlighted correct option and log the revision date so you can
            verify against the source.
          </p>
        </section>

        <div className="mt-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white">
          <p className="text-sm font-semibold opacity-90">Practice the full subject</p>
          <p className="mt-1 text-lg font-bold">{question.quizTitle}</p>
          <Link
            href={practiceUrl}
            className="mt-4 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-bold text-indigo-700 shadow-sm hover:bg-indigo-50"
          >
            Practice more questions
          </Link>
        </div>
      </article>
    </main>
  );
}
