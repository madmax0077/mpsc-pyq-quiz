"use client";

import { useState, useEffect, useMemo } from "react";
import { Quiz, Question, OptionKey, CATEGORIES, Category, Language } from "@/lib/types";
import { getAllQuizzes } from "@/lib/storage";
import AdBanner from "./AdBanner";
import ShareButton from "./ShareButton";

/** Merge quizzes baked into the site (`public/quizzes.json`) with any from this browser's localStorage. Same id → bundled wins. */
function mergeBundledAndLocal(bundled: Quiz[], local: Quiz[]): Quiz[] {
  const ids = new Set(bundled.map((q) => q.id));
  const merged = [...bundled];
  for (const q of local) {
    if (!ids.has(q.id)) merged.push(q);
  }
  return merged;
}

const OPTION_KEYS: OptionKey[] = ["A", "B", "C", "D"];

const CATEGORY_COLORS: Record<Category, { gradient: string; icon: string; badge: string }> = {
  Polity:    { gradient: "from-blue-500 to-blue-600",    icon: "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z", badge: "bg-blue-100 text-blue-700" },
  History:   { gradient: "from-amber-500 to-amber-600",  icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z", badge: "bg-amber-100 text-amber-700" },
  Geography: { gradient: "from-emerald-500 to-emerald-600", icon: "M20.893 13.393l-1.135-1.135a2.252 2.252 0 01-.421-.585l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 01-1.81 1.025 1.055 1.055 0 01-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 01-1.383-2.46l.007-.042a2.25 2.25 0 01.29-.787l.09-.15a2.25 2.25 0 012.37-1.048l1.178.236a1.125 1.125 0 001.302-.795l.208-.73a1.125 1.125 0 00-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 01-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 01-1.458-1.137l1.411-2.353a2.25 2.25 0 00.286-.76M11.25 2.5c3.083.307 5.768 1.934 7.393 4.393M15.75 21H5.25A2.25 2.25 0 013 18.75V5.25A2.25 2.25 0 015.25 3h1.5", badge: "bg-emerald-100 text-emerald-700" },
  Science:   { gradient: "from-purple-500 to-purple-600", icon: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5", badge: "bg-purple-100 text-purple-700" },
  GK:        { gradient: "from-pink-500 to-pink-600",    icon: "M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5", badge: "bg-pink-100 text-pink-700" },
  Economics: { gradient: "from-teal-500 to-teal-600",    icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z", badge: "bg-teal-100 text-teal-700" },
};

interface DisplayQuiz {
  id: string;
  title: string;
  questions: Question[];
  isCategory: boolean;
  category?: Category;
  quizCount?: number;
}

export default function StudentView({ language = "english" }: { language?: Language }) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<DisplayQuiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, OptionKey>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [submittedPages, setSubmittedPages] = useState<Set<number>>(new Set());
  const [pageScores, setPageScores] = useState<Record<number, { correct: number; total: number }>>({});

  useEffect(() => {
    let cancelled = false;
    const local = getAllQuizzes();

    (async () => {
      try {
        const res = await fetch("/quizzes.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`quizzes.json ${res.status}`);
        const bundled = (await res.json()) as Quiz[];
        if (!Array.isArray(bundled)) throw new Error("invalid quizzes.json shape");
        if (cancelled) return;
        setQuizzes(mergeBundledAndLocal(bundled, local));
      } catch {
        if (!cancelled) setQuizzes(local);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const categoryQuizzes = useMemo<DisplayQuiz[]>(() => {
    const catMap = new Map<Category, Map<string, Question>>();
    for (const quiz of quizzes) {
      const tag = quiz.tag || quiz.title;
      for (const q of quiz.questions) {
        if (!q.category) continue;
        if (!catMap.has(q.category)) catMap.set(q.category, new Map());
        const map = catMap.get(q.category)!;
        if (!map.has(q.id)) map.set(q.id, { ...q, sourceTag: tag });
      }
    }
    const result: DisplayQuiz[] = [];
    for (const cat of CATEGORIES) {
      const map = catMap.get(cat);
      if (!map || map.size === 0) continue;
      result.push({
        id: `cat-${cat}`,
        title: cat,
        questions: Array.from(map.values()),
        isCategory: true,
        category: cat,
      });
    }
    return result;
  }, [quizzes]);

  const regularQuizzes = useMemo<DisplayQuiz[]>(
    () =>
      quizzes.map((q) => ({
        id: q.id,
        title: q.title,
        questions: q.questions,
        isCategory: false,
        quizCount: q.questions.length,
      })),
    [quizzes],
  );

  const selectQuiz = (quiz: DisplayQuiz) => {
    setSelectedQuiz(quiz);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setCurrentPage(0);
    setSubmittedPages(new Set());
    setPageScores({});
  };

  const handleAnswer = (questionId: string, option: OptionKey) => {
    if (submitted) return;
    if (selectedQuiz?.isCategory && submittedPages.has(currentPage)) return;
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    if (!selectedQuiz) return;
    const answeredCount = Object.keys(answers).length;
    if (answeredCount === 0) {
      alert("Please attempt at least one question before submitting.");
      return;
    }
    let correct = 0;
    for (const q of selectedQuiz.questions) {
      if (answers[q.id] === q.correctAnswer) correct++;
    }
    setScore(correct);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitPage = () => {
    if (!selectedQuiz) return;
    const perPage = selectedQuiz.isCategory ? 20 : QUESTIONS_PER_PAGE;
    const start = currentPage * perPage;
    const end = Math.min(start + perPage, selectedQuiz.questions.length);
    const pageQs = selectedQuiz.questions.slice(start, end);

    const pageAnswered = pageQs.filter((q) => answers[q.id]).length;
    if (pageAnswered === 0) {
      alert("Please attempt at least one question before submitting this set.");
      return;
    }

    let correct = 0;
    for (const q of pageQs) {
      if (answers[q.id] === q.correctAnswer) correct++;
    }

    setSubmittedPages((prev) => new Set(prev).add(currentPage));
    setPageScores((prev) => ({ ...prev, [currentPage]: { correct, total: pageQs.length } }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextSet = () => {
    const perPage = selectedQuiz!.isCategory ? 20 : QUESTIONS_PER_PAGE;
    const nextPage = currentPage + 1;
    const maxPage = Math.ceil(selectedQuiz!.questions.length / perPage) - 1;
    if (nextPage <= maxPage) {
      setCurrentPage(nextPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    setSelectedQuiz(null);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setCurrentPage(0);
    setSubmittedPages(new Set());
    setPageScores({});
  };

  /* --------- Marathi Coming Soon --------- */
  if (language === "marathi") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50 p-16 text-center">
        <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
          <svg className="h-10 w-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-orange-700">लवकरच येत आहे!</h2>
        <p className="mt-2 text-lg font-semibold text-slate-700">Coming Soon</p>
        <p className="mt-3 max-w-sm text-sm text-slate-500">
          मराठी प्रश्नसंच लवकरच उपलब्ध होईल. कृपया सध्या English मध्ये सराव करा.
        </p>
        <p className="mt-1 max-w-sm text-xs text-slate-400">
          Marathi quizzes will be available soon. Please practice in English for now.
        </p>
      </div>
    );
  }

  /* --------- Quiz selector --------- */
  if (!selectedQuiz) {
    const hasAny = regularQuizzes.length > 0 || categoryQuizzes.length > 0;

    return (
      <div className="space-y-8">
        {!hasAny ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-slate-700">No quizzes available</p>
            <p className="mt-1 text-sm text-slate-400">
              Switch to Admin Mode to create your first quiz.
            </p>
          </div>
        ) : (
          <>
            {/* Category Quizzes */}
            {categoryQuizzes.length > 0 && (
              <div>
                <h2 className="mb-1 text-lg font-bold text-slate-800">Practice by Subject</h2>
                <p className="mb-4 text-sm text-slate-500">Auto-grouped from categorized questions across all quizzes.</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryQuizzes.map((cq) => {
                    const cat = cq.category!;
                    const colors = CATEGORY_COLORS[cat];
                    return (
                      <button
                        key={cq.id}
                        onClick={() => selectQuiz(cq)}
                        className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm hover:shadow-md transition-all"
                      >
                        <div className={`h-1.5 bg-gradient-to-r ${colors.gradient}`} />
                        <div className="p-5">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${colors.gradient} text-white shadow-sm`}>
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d={colors.icon} />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                {cq.title}
                              </h3>
                              <p className="text-xs text-slate-500">
                                {cq.questions.length} question{cq.questions.length !== 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-end">
                            <span className="text-xs font-medium text-indigo-500 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                              Start Practice
                              <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <AdBanner slot="2345678901" format="horizontal" />

            {/* Regular Quizzes */}
            {regularQuizzes.length > 0 && (
              <div>
                <h2 className="mb-1 text-lg font-bold text-slate-800">All Quizzes</h2>
                <p className="mb-4 text-sm text-slate-500">Full question papers as uploaded by admin.</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {regularQuizzes.map((quiz) => (
                    <button
                      key={quiz.id}
                      onClick={() => selectQuiz(quiz)}
                      className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"
                    >
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">
                          {quiz.title}
                        </h3>
                        <p className="mt-0.5 text-sm text-slate-500">
                          {quiz.questions.length} question{quiz.questions.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <svg className="h-5 w-5 shrink-0 text-slate-300 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Share CTA */}
            <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-5 text-center">
              <p className="mb-3 text-sm font-medium text-slate-600">
                Know someone preparing for MPSC? Help them practice for free!
              </p>
              <ShareButton />
            </div>
          </>
        )}
      </div>
    );
  }

  /* --------- Quiz in progress / submitted --------- */
  const isCategoryQuiz = selectedQuiz.isCategory;
  const QUESTIONS_PER_PAGE = 10;
  const perPage = isCategoryQuiz ? 20 : QUESTIONS_PER_PAGE;
  const total = selectedQuiz.questions.length;
  const answeredCount = Object.keys(answers).length;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const skippedCount = total - answeredCount;
  const catStyle = selectedQuiz.category ? CATEGORY_COLORS[selectedQuiz.category] : null;

  const totalPages = Math.ceil(total / perPage);
  const pageQuestions = selectedQuiz.questions.slice(
    currentPage * perPage,
    (currentPage + 1) * perPage,
  );
  const isPageSubmitted = submittedPages.has(currentPage);
  const currentPageScore = pageScores[currentPage];
  const pageAnsweredCount = pageQuestions.filter((q) => answers[q.id]).length;
  const allPagesSubmitted = submittedPages.size === totalPages;
  const totalCategoryScore = Object.values(pageScores).reduce((s, p) => s + p.correct, 0);
  const totalCategoryQuestions = Object.values(pageScores).reduce((s, p) => s + p.total, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={goBack}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-800">
              {selectedQuiz.title}
            </h2>
            {selectedQuiz.category && catStyle && (
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${catStyle.badge}`}>
                {selectedQuiz.category}
              </span>
            )}
          </div>
          {!submitted && !isCategoryQuiz && (
            <p className="mt-0.5 text-sm text-slate-500">
              {answeredCount} of {total} answered
              {skippedCount > 0 && answeredCount > 0 && (
                <span className="text-slate-400"> &middot; {skippedCount} skipped</span>
              )}
            </p>
          )}
          {isCategoryQuiz && (
            <p className="mt-0.5 text-sm text-slate-500">
              Set {currentPage + 1} of {totalPages} &middot; {pageAnsweredCount} of {pageQuestions.length} answered
              {submittedPages.size > 0 && (
                <span className="text-indigo-500 font-medium"> &middot; {submittedPages.size}/{totalPages} sets done</span>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {isCategoryQuiz ? (
        <div className="overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-1.5 rounded-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${totalPages > 0 ? (submittedPages.size / totalPages) * 100 : 0}%` }}
          />
        </div>
      ) : !submitted ? (
        <div className="overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-1.5 rounded-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${total > 0 ? (answeredCount / total) * 100 : 0}%` }}
          />
        </div>
      ) : null}

      {/* Score Banner - Regular quiz (full submit) */}
      {submitted && !isCategoryQuiz && (
        <div
          className={`animate-slide-up rounded-2xl p-6 text-center shadow-sm ${
            pct >= 70
              ? "bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200"
              : pct >= 40
                ? "bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200"
                : "bg-gradient-to-br from-red-50 to-rose-50 border border-red-200"
          }`}
        >
          <p className="text-5xl font-extrabold tracking-tight">
            <span className={pct >= 70 ? "text-emerald-600" : pct >= 40 ? "text-amber-600" : "text-red-600"}>
              {score}
            </span>
            <span className="text-slate-300">/{total}</span>
          </p>
          <p className="mt-2 text-sm font-medium text-slate-600">
            You scored {pct}%
            {skippedCount > 0 && <span className="text-slate-400"> ({skippedCount} skipped)</span>}
            {" "}
            {pct >= 70
              ? "— Excellent!"
              : pct >= 40
                ? "— Good effort, keep practicing!"
                : "— Review the answers below."}
          </p>
          <div className="mt-4 flex justify-center">
            <ShareButton score={{ correct: score, total }} />
          </div>
        </div>
      )}

      {/* Score Banner - Category quiz (per-page submit) */}
      {isCategoryQuiz && isPageSubmitted && currentPageScore && (
        <div
          className={`animate-slide-up rounded-2xl p-5 shadow-sm ${
            (() => {
              const pagePct = Math.round((currentPageScore.correct / currentPageScore.total) * 100);
              return pagePct >= 70
                ? "bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200"
                : pagePct >= 40
                  ? "bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200"
                  : "bg-gradient-to-br from-red-50 to-rose-50 border border-red-200";
            })()
          }`}
        >
          <p className="text-center text-3xl font-extrabold tracking-tight">
            <span className={(() => { const p = Math.round((currentPageScore.correct / currentPageScore.total) * 100); return p >= 70 ? "text-emerald-600" : p >= 40 ? "text-amber-600" : "text-red-600"; })()}>
              {currentPageScore.correct}
            </span>
            <span className="text-slate-300">/{currentPageScore.total}</span>
          </p>
          <p className="mt-1 text-center text-sm font-medium text-slate-600">
            Set {currentPage + 1} — {Math.round((currentPageScore.correct / currentPageScore.total) * 100)}% correct
          </p>
          {allPagesSubmitted && (
            <div className="mt-3 rounded-lg bg-white/60 p-3 text-center border border-slate-200">
              <p className="text-lg font-bold text-indigo-700">
                Overall: {totalCategoryScore}/{totalCategoryQuestions} ({totalCategoryQuestions > 0 ? Math.round((totalCategoryScore / totalCategoryQuestions) * 100) : 0}%)
              </p>
              <p className="text-xs text-slate-500">All {totalPages} sets completed!</p>
              <div className="mt-3 flex justify-center">
                <ShareButton score={{ correct: totalCategoryScore, total: totalCategoryQuestions }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Questions */}
      <div className="space-y-4">
        {pageQuestions.map((q, localIdx) => {
          const globalIdx = currentPage * perPage + localIdx;
          const showAdAfter = (localIdx + 1) % 5 === 0 && localIdx < pageQuestions.length - 1;
          const userAnswer = answers[q.id];
          const qSubmitted = isCategoryQuiz ? isPageSubmitted : submitted;
          const isCorrect = qSubmitted && userAnswer === q.correctAnswer;
          const isWrong = qSubmitted && userAnswer && userAnswer !== q.correctAnswer;
          const isSkipped = qSubmitted && !userAnswer;

          return (
            <div key={q.id} className="space-y-4">
            <div
              className={`rounded-xl border bg-white shadow-sm transition-all ${
                qSubmitted
                  ? isCorrect
                    ? "border-emerald-300 bg-emerald-50/30"
                    : isSkipped
                      ? "border-slate-200 bg-slate-50/50"
                      : "border-red-300 bg-red-50/30"
                  : userAnswer
                    ? "border-indigo-200"
                    : "border-slate-200"
              }`}
            >
              <div className="relative p-5">
                {isCategoryQuiz && q.sourceTag && (
                  <span className="absolute top-2 right-2 rounded-md bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-600 leading-tight max-w-[45%] truncate">
                    {q.sourceTag}
                  </span>
                )}
                <div className={`mb-4 flex items-start gap-3 ${isCategoryQuiz && q.sourceTag ? "pr-[calc(45%+0.5rem)] sm:pr-0" : ""}`}>
                  <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    qSubmitted && isCorrect
                      ? "bg-emerald-100 text-emerald-700"
                      : qSubmitted && isSkipped
                        ? "bg-slate-100 text-slate-500"
                        : qSubmitted && isWrong
                          ? "bg-red-100 text-red-700"
                          : userAnswer
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-slate-100 text-slate-600"
                  }`}>
                    {globalIdx + 1}
                  </span>
                  <p className="font-medium text-slate-800 leading-relaxed">{q.text}</p>
                </div>

                {q.imageUrl && (
                  <div className="mb-4 ml-10 rounded-lg border border-slate-200 bg-slate-50 p-2">
                    <img
                      src={q.imageUrl}
                      alt="Question diagram"
                      className="max-h-64 w-full rounded object-contain"
                    />
                  </div>
                )}

                <div className="ml-10 grid gap-2 sm:grid-cols-2">
                  {OPTION_KEYS.map((key) => {
                    const isSelected = userAnswer === key;
                    const isThisCorrect = q.correctAnswer === key;

                    let classes =
                      "flex items-center gap-3 rounded-lg border px-4 py-3 text-sm transition-all ";

                    if (qSubmitted) {
                      if (isThisCorrect) {
                        classes += "border-emerald-400 bg-emerald-50 text-emerald-800 font-medium";
                      } else if (isSelected && !isThisCorrect) {
                        classes += "border-red-400 bg-red-50 text-red-700 line-through";
                      } else {
                        classes += "border-slate-100 text-slate-400 bg-slate-50/50";
                      }
                    } else {
                      classes += isSelected
                        ? "border-indigo-400 bg-indigo-50 text-indigo-800 font-medium ring-2 ring-indigo-100 cursor-pointer"
                        : "border-slate-200 text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50 cursor-pointer";
                    }

                    return (
                      <label key={key} className={classes}>
                        <input
                          type="radio"
                          name={`student-q-${q.id}`}
                          value={key}
                          checked={isSelected}
                          onChange={() => handleAnswer(q.id, key)}
                          disabled={qSubmitted}
                          className="sr-only"
                        />
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                          qSubmitted && isThisCorrect
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : qSubmitted && isSelected && !isThisCorrect
                              ? "border-red-400 bg-red-100 text-red-600"
                              : isSelected
                                ? "border-indigo-500 bg-indigo-500 text-white"
                                : "border-slate-300 text-slate-500"
                        }`}>
                          {qSubmitted && isThisCorrect ? (
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          ) : qSubmitted && isSelected && !isThisCorrect ? (
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          ) : (
                            key
                          )}
                        </span>
                        <span className="leading-snug">{q.options[key] || `Option ${key}`}</span>
                      </label>
                    );
                  })}
                </div>

                {/* Explanation after submit */}
                {qSubmitted && (
                  <div className={`mt-4 ml-10 rounded-lg p-4 border ${
                    isCorrect ? "bg-emerald-50 border-emerald-200" : isSkipped ? "bg-slate-50 border-slate-200" : "bg-red-50 border-red-200"
                  }`}>
                    <div className="flex items-start gap-2">
                      {isCorrect ? (
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : isSkipped ? (
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                      ) : (
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      <div>
                        <p className="text-sm font-medium text-slate-700">
                          {isCorrect
                            ? "Correct!"
                            : isSkipped
                              ? `Skipped — the answer is ${q.correctAnswer}.`
                              : `Incorrect — the answer is ${q.correctAnswer}.`}
                        </p>
                        {q.explanation && (
                          <p className="mt-1 text-sm text-slate-600">{q.explanation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {showAdAfter && <AdBanner slot="4567890123" format="horizontal" className="my-2" />}
            </div>
          );
        })}
      </div>

      {/* Pagination - only for regular quizzes */}
      {!isCategoryQuiz && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => { setCurrentPage((p) => Math.max(0, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            disabled={currentPage === 0}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => { setCurrentPage(i); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                currentPage === i
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => { setCurrentPage((p) => Math.min(totalPages - 1, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            disabled={currentPage === totalPages - 1}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Category quiz pagination (set indicator) */}
      {isCategoryQuiz && totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => { setCurrentPage(i); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              disabled={!submittedPages.has(i) && i !== currentPage}
              className={`h-9 min-w-[2.25rem] rounded-lg px-2 text-sm font-medium transition-colors ${
                currentPage === i
                  ? "bg-indigo-600 text-white shadow-sm"
                  : submittedPages.has(i)
                    ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                    : "border border-slate-200 bg-white text-slate-400 cursor-not-allowed"
              }`}
            >
              {submittedPages.has(i) ? (
                <svg className="h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              ) : (
                i + 1
              )}
            </button>
          ))}
        </div>
      )}

      {/* Submit / Retake — Regular quizzes */}
      {!isCategoryQuiz && (
        <>
          {!submitted ? (
            <div className="sticky bottom-4 z-10">
              <button
                onClick={handleSubmit}
                className="w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Submit Quiz ({answeredCount}/{total} answered)
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <AdBanner slot="3456789012" format="horizontal" />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setAnswers({});
                    setSubmitted(false);
                    setScore(0);
                    setCurrentPage(0);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex-1 rounded-xl border border-indigo-200 bg-white px-6 py-3 text-base font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  Retake Quiz
                </button>
                <button
                  onClick={goBack}
                  className="flex-1 rounded-xl bg-slate-100 px-6 py-3 text-base font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Back to Quizzes
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Submit / Next Set / Retake — Category quizzes */}
      {isCategoryQuiz && (
        <>
          {!isPageSubmitted ? (
            <div className="sticky bottom-4 z-10">
              <button
                onClick={handleSubmitPage}
                className="w-full rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Submit Set {currentPage + 1} ({pageAnsweredCount}/{pageQuestions.length} answered)
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <AdBanner slot="3456789012" format="horizontal" />
              <div className="flex gap-3">
                {currentPage < totalPages - 1 && (
                  <button
                    onClick={handleNextSet}
                    className="flex-1 rounded-xl bg-indigo-600 px-6 py-3 text-base font-semibold text-white hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Next Set
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </button>
                )}
                <button
                  onClick={() => {
                    setAnswers({});
                    setSubmittedPages(new Set());
                    setPageScores({});
                    setCurrentPage(0);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex-1 rounded-xl border border-indigo-200 bg-white px-6 py-3 text-base font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  Retake All
                </button>
                <button
                  onClick={goBack}
                  className="flex-1 rounded-xl bg-slate-100 px-6 py-3 text-base font-semibold text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
