import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSeoQuestion, getSeoQuestions } from "@/lib/questionSeo";

const SITE_URL = "https://www.mpscs.in";

type PageProps = {
  params: { id: string };
};

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
  const practiceUrl = question.language === "marathi" ? "/?mode=subject" : "/?mode=subject";

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <article className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-indigo-700">MPSC PYQ</span>
          {question.category && <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">{question.category}</span>}
          {question.topic && <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">{question.topic}</span>}
          {question.language && <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{question.language}</span>}
        </div>

        <h1 className="text-2xl font-black leading-tight text-slate-950 sm:text-3xl">
          {question.text}
        </h1>

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

        <div className="mt-8 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white">
          <p className="text-sm font-semibold opacity-90">Source paper</p>
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
