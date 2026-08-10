"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Language, OptionKey, Quiz } from "@/lib/types";
import { normalizeQuiz } from "@/lib/questionUtils";
import { mergeBundledAndLocal } from "@/lib/quizCatalog";
import { getAllQuizzes } from "@/lib/storage";
import DisplayAd from "@/components/DisplayAd";
import { IN_CONTENT_AD_SLOT } from "@/lib/adsConfig";
import { useAuth } from "@/lib/auth-context";
import { recordResult } from "@/lib/analytics";
import { recordStreak } from "@/lib/streak";
import { pushProgressToCloud } from "@/lib/user-progress";
import {
  CSAT_NEGATIVE_MARK,
  CSAT_STREAMS,
  CSAT_TOPICS,
  buildSpeedTest,
  buildTopicPractice,
  countTopicQuestions,
  csatSeenCounts,
  getCsatTopic,
  resetCsatSeen,
  scoreCsat,
  topicSeenBucket,
  type CsatBank,
  type CsatQuestion,
  type CsatScore,
  type CsatStream,
  type CsatTopic,
} from "@/lib/csat";
import {
  csatStreamBlurb,
  csatStreamLabel,
  csatTopicLabel,
  saveLanguage,
  t,
} from "@/lib/i18n";

type Stage =
  | "home"
  | "training"
  | "lesson"
  | "practice"
  | "practice-result"
  | "speed-config"
  | "speed-run"
  | "speed-result";

interface CsatViewProps {
  onExit: () => void;
  language?: Language;
  onLanguageChange?: (language: Language) => void;
}

const OPTION_KEYS: OptionKey[] = ["A", "B", "C", "D"];

/** Speed-practice presets: questions and the minutes allowed for them. */
const SPEED_PRESETS = [
  { id: "sprint", label: "Sprint", questions: 20, minutes: 20 },
  { id: "standard", label: "Standard", questions: 40, minutes: 40 },
  { id: "full", label: "Full CSAT", questions: 60, minutes: 60 },
] as const;

/** Default size of a topic practice run when no length is chosen. */
const TOPIC_PRACTICE_SIZE = 15;

/**
 * Session lengths offered on a topic. Short sets are the point — a student
 * works through the topic a few questions at a time across many sittings, and
 * every set brings questions they have not seen yet.
 */
function practiceSizes(available: number): number[] {
  const sizes = [5, 10, 15, 25, 50].filter((n) => n < available);
  return [...sizes, available];
}

const ACCENT: Record<
  CsatStream["accent"],
  { chip: string; bar: string; ring: string; text: string }
> = {
  indigo: {
    chip: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    bar: "from-indigo-500 to-violet-500",
    ring: "hover:border-indigo-300 dark:hover:border-indigo-600",
    text: "text-indigo-700 dark:text-indigo-300",
  },
  emerald: {
    chip: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    bar: "from-emerald-500 to-teal-500",
    ring: "hover:border-emerald-300 dark:hover:border-emerald-600",
    text: "text-emerald-700 dark:text-emerald-300",
  },
  amber: {
    chip: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    bar: "from-amber-500 to-orange-500",
    ring: "hover:border-amber-300 dark:hover:border-amber-600",
    text: "text-amber-700 dark:text-amber-300",
  },
};

function formatTime(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function BackLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
      </svg>
      {label}
    </button>
  );
}

/** One question with its four options. Handles both practice and test styling. */
function QuestionCard({
  question,
  selected,
  revealed,
  onSelect,
}: {
  question: CsatQuestion;
  selected: OptionKey | undefined;
  revealed: boolean;
  onSelect: (k: OptionKey) => void;
}) {
  return (
    <div>
      <p className="break-words text-[15px] font-semibold leading-7 text-slate-900 dark:text-slate-100">
        {question.text}
      </p>
      <div className="mt-4 grid gap-2">
        {OPTION_KEYS.map((k) => {
          const isSelected = selected === k;
          let cls: string;
          if (revealed) {
            const isCorrect = k === question.correctAnswer;
            const isUserWrong = isSelected && !isCorrect;
            cls = isCorrect
              ? "border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-200"
              : isUserWrong
                ? "border-rose-400 bg-rose-50 text-rose-900 dark:border-rose-600 dark:bg-rose-900/30 dark:text-rose-200"
                : "border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300";
          } else {
            cls = isSelected
              ? "border-indigo-400 bg-indigo-50 text-indigo-900 dark:border-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-200"
              : "border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/40 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-200 dark:hover:border-indigo-700";
          }
          return (
            <button
              key={k}
              onClick={() => onSelect(k)}
              disabled={revealed}
              className={
                "flex items-start gap-3 rounded-xl border px-4 py-2.5 text-left text-sm transition-colors " +
                cls +
                (revealed ? " cursor-default" : "")
              }
            >
              <span
                className={
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold " +
                  (isSelected && !revealed
                    ? "bg-indigo-600 text-white"
                    : revealed && k === question.correctAnswer
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300")
                }
              >
                {k}
              </span>
              <span className="min-w-0 flex-1 break-words leading-6">{question.options[k]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function CsatView({
  onExit,
  language: initialLanguage = "english",
  onLanguageChange,
}: CsatViewProps) {
  const [stage, setStage] = useState<Stage>("home");
  const [language, setLanguage] = useState<Language>(initialLanguage);

  useEffect(() => {
    setLanguage(initialLanguage);
  }, [initialLanguage]);
  const [quizzes, setQuizzes] = useState<Quiz[] | null>(null);
  const [bank, setBank] = useState<CsatBank | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);

  // Practice / speed-test session state
  const [session, setSession] = useState<CsatQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, OptionKey>>({});
  const [current, setCurrent] = useState(1);
  const [checked, setChecked] = useState(false);
  const [result, setResult] = useState<CsatScore | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [practiceSize, setPracticeSize] = useState(TOPIC_PRACTICE_SIZE);
  // Coverage lives in localStorage, which React cannot observe; bump this after
  // every run so the "attempted so far" figures refresh.
  const [coverageTick, setCoverageTick] = useState(0);
  const submittedRef = useRef(false);
  const { studentUser } = useAuth();

  // Load the previous-year catalogue and the generated practice bank once.
  // The bank is optional — if it fails to load, practice falls back to PYQs.
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/quizzes.json");
        const raw = (await res.json()) as Quiz[];
        const bundled = raw.map(normalizeQuiz);
        const merged = mergeBundledAndLocal(bundled, getAllQuizzes());
        if (alive) setQuizzes(merged);
      } catch {
        if (alive) setLoadError("Could not load the question bank. Please refresh and try again.");
      }
    })();
    (async () => {
      try {
        const res = await fetch("/csat-questions.json");
        const raw = (await res.json()) as CsatBank;
        if (alive && raw?.questions?.length) setBank(raw);
      } catch {
        /* practice still works from previous-year questions alone */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const counts = useMemo(
    () => (quizzes ? countTopicQuestions(quizzes, bank, language) : {}),
    [quizzes, bank, language],
  );

  const totalAvailable = useMemo(
    () => Object.values(counts).reduce((a, b) => a + b, 0),
    [counts],
  );

  const seenCounts = useMemo(() => csatSeenCounts(), [coverageTick]);

  const activeTopic = activeTopicId ? getCsatTopic(activeTopicId) : undefined;

  const goto = useCallback((next: Stage) => {
    setStage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const finishSession = useCallback(
    (questions: CsatQuestion[], ans: Record<number, OptionKey>, timed: boolean) => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      const scored = scoreCsat(questions, ans, timed);
      setResult(scored);
      recordStreak();
      const topic = activeTopicId ? getCsatTopic(activeTopicId) : undefined;
      const title = timed
        ? `CSAT Speed Test (${questions.length} Qs)`
        : `CSAT · ${
            topic
              ? csatTopicLabel(topic.id, topic.name, language)
              : "Practice"
          }`;
      recordResult({
        date: new Date().toISOString().slice(0, 10),
        quizId: timed
          ? `csat-speed-${questions.length}`
          : `csat-${activeTopicId || "practice"}`,
        quizTitle: title,
        category: "CSAT",
        mode: "csat",
        score: Math.max(0, Math.round(scored.net)),
        total: scored.total,
        pct: Math.max(0, Math.round(scored.percent)),
      });
      if (studentUser) void pushProgressToCloud(studentUser.uid);
      setStage(timed ? "speed-result" : "practice-result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [activeTopicId, language, studentUser],
  );

  // Speed-test countdown.
  useEffect(() => {
    if (stage !== "speed-run") return;
    const id = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          finishSession(session, answers, true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [stage, session, answers, finishSession]);

  const startTopicPractice = (topic: CsatTopic, size = TOPIC_PRACTICE_SIZE) => {
    if (!quizzes) return;
    const questions = buildTopicPractice(quizzes, bank, topic, language, size);
    if (questions.length === 0) return;
    submittedRef.current = false;
    setActiveTopicId(topic.id);
    setPracticeSize(size);
    setSession(questions);
    setAnswers({});
    setCurrent(1);
    setChecked(false);
    setResult(null);
    setCoverageTick((n) => n + 1);
    goto("practice");
  };

  const startSpeedTest = (questionCount: number, minutes: number) => {
    if (!quizzes) return;
    const questions = buildSpeedTest(quizzes, bank, language, questionCount);
    if (questions.length === 0) return;
    submittedRef.current = false;
    setSession(questions);
    setAnswers({});
    setCurrent(1);
    setResult(null);
    setConfirmSubmit(false);
    setRemaining(minutes * 60);
    setCoverageTick((n) => n + 1);
    goto("speed-run");
  };

  const answeredCount = Object.keys(answers).length;

  /* ============================== HOME ============================== */
  if (stage === "home") {
    return (
      <div className="mx-auto max-w-4xl py-8">
        <BackLink label={t("backToHomeShort", language)} onClick={onExit} />

        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-slate-100">
            {t("csatHome", language)}
          </h2>
          <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
            {t("csatHomeIntro", language)}
          </p>
        </div>

        {loadError && (
          <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-300">
            {loadError}
          </div>
        )}

        {/* Language switch */}
        <div className="mb-6 inline-flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
          {(["english", "marathi"] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => {
                setLanguage(lang);
                saveLanguage(lang);
                onLanguageChange?.(lang);
              }}
              className={
                "rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors " +
                (language === lang
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-indigo-600 dark:text-slate-300")
              }
            >
              {lang === "english" ? "English" : "मराठी"}
            </button>
          ))}
        </div>

        {/* Three entry points */}
        <div className="grid gap-4 sm:grid-cols-3">
          <button
            onClick={() => goto("training")}
            className="group rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-lg dark:border-indigo-800 dark:from-indigo-950/50 dark:via-slate-900 dark:to-violet-950/40 dark:hover:border-indigo-600"
          >
            <div className="mb-3 text-2xl">📖</div>
            <h3 className="text-base font-bold text-indigo-700 dark:text-indigo-300">
              {t("csatTraining", language)}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t("deepLessons", language)}
            </p>
            <span className="mt-3 inline-block text-xs font-semibold text-indigo-500 dark:text-indigo-400">
              {CSAT_TOPICS.length} {t("csatTopicsArrow", language)}
            </span>
          </button>

          <button
            onClick={() => goto("training")}
            className="group rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-lg dark:border-emerald-800 dark:from-emerald-950/50 dark:via-slate-900 dark:to-teal-950/40 dark:hover:border-emerald-600"
          >
            <div className="mb-3 text-2xl">✍️</div>
            <h3 className="text-base font-bold text-emerald-700 dark:text-emerald-300">
              {t("topicPractice", language)}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {language === "marathi"
                ? "एका वेळी एक टॉपिक — प्रत्येक प्रश्नानंतर त्वरित उत्तर आणि स्पष्टीकरण."
                : "Practise one topic at a time with instant feedback and an explanation after every question."}
            </p>
            <span className="mt-3 inline-block text-xs font-semibold text-emerald-500 dark:text-emerald-400">
              {totalAvailable > 0
                ? `${totalAvailable} ${t("questions", language)} →`
                : language === "marathi"
                  ? "लोड होत आहे…"
                  : "Loading…"}
            </span>
          </button>

          <button
            onClick={() => goto("speed-config")}
            className="group rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-lg dark:border-amber-800 dark:from-amber-950/50 dark:via-slate-900 dark:to-orange-950/40 dark:hover:border-amber-600"
          >
            <div className="mb-3 text-2xl">⏱️</div>
            <h3 className="text-base font-bold text-amber-700 dark:text-amber-300">
              {t("speedTest", language)}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {t("csatSpeedBlurb", language)} ({CSAT_NEGATIVE_MARK})
            </p>
            <span className="mt-3 inline-block text-xs font-semibold text-amber-500 dark:text-amber-400">
              20 / 40 / 60 {t("questions", language)} →
            </span>
          </button>
        </div>

        {/* Stream overview */}
        <div className="mt-10">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {language === "marathi" ? "अभ्यासक्रमात काय समाविष्ट आहे" : "What the syllabus covers"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {CSAT_STREAMS.map((stream) => {
              const topics = CSAT_TOPICS.filter((tp) => tp.stream === stream.id);
              const qs = topics.reduce((sum, tp) => sum + (counts[tp.id] ?? 0), 0);
              const accent = ACCENT[stream.accent];
              return (
                <div
                  key={stream.id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className={`h-1.5 bg-gradient-to-r ${accent.bar}`} />
                  <div className="p-4">
                    <div className="text-xl">{stream.emoji}</div>
                    <h4 className={`mt-1.5 text-sm font-bold ${accent.text}`}>
                      {csatStreamLabel(stream.id, language)}
                    </h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {csatStreamBlurb(stream.id, stream.blurb, language)}
                    </p>
                    <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                      {topics.length} {language === "marathi" ? "टॉपिक" : "topics"} · {qs} {t("questions", language)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ============================ TRAINING ============================ */
  if (stage === "training") {
    return (
      <div className="mx-auto max-w-4xl py-8">
        <BackLink label={t("backToCsat", language)} onClick={() => goto("home")} />

        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {t("csatTraining", language)}
          </h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            {language === "marathi"
              ? "धडा वाचण्यासाठी किंवा थेट सराव करण्यासाठी टॉपिक उघडा."
              : "Open a topic to read the full lesson, or jump straight into practice questions for it."}
          </p>
        </div>

        <div className="space-y-8">
          {CSAT_STREAMS.map((stream) => {
            const topics = CSAT_TOPICS.filter((tp) => tp.stream === stream.id);
            const accent = ACCENT[stream.accent];
            return (
              <div key={stream.id}>
                <div className="mb-3 flex items-center gap-2">
                  <span className="text-lg">{stream.emoji}</span>
                  <h3 className={`text-sm font-bold uppercase tracking-wide ${accent.text}`}>
                    {csatStreamLabel(stream.id, language)}
                  </h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {topics.map((topic) => {
                    const available = counts[topic.id] ?? 0;
                    const lessonOnly = !!topic.lessonOnly;
                    const done = Math.min(
                      available,
                      seenCounts[topicSeenBucket(topic.id, language)] ?? 0,
                    );
                    return (
                      <div
                        key={topic.id}
                        className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800 ${accent.ring}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="min-w-0 flex-1 break-words text-sm font-bold text-slate-800 dark:text-slate-100">
                            {csatTopicLabel(topic.id, topic.name, language)}
                          </h4>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${accent.chip}`}
                          >
                            {lessonOnly
                              ? t("lessonOnly", language)
                              : `${available} ${language === "marathi" ? "प्रश्न" : "Qs"}`}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                          {topic.blurb}
                        </p>
                        {!lessonOnly && done > 0 && (
                          <p className="mt-2 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            {done}/{available} {language === "marathi" ? "सोडवले" : "attempted"}
                          </p>
                        )}
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button
                            onClick={() => {
                              setActiveTopicId(topic.id);
                              goto("lesson");
                            }}
                            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
                          >
                            {language === "marathi" ? `धडा वाचा (${topic.minutes} मि.)` : `Learn (${topic.minutes} min)`}
                          </button>
                          {!lessonOnly && (
                            <button
                              onClick={() => startTopicPractice(topic)}
                              disabled={available === 0 || !quizzes}
                              className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200"
                            >
                              {t("practice", language)}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ============================= LESSON ============================= */
  if (stage === "lesson" && activeTopic) {
    const { lesson } = activeTopic;
    const available = counts[activeTopic.id] ?? 0;
    const attempted = Math.min(
      available,
      seenCounts[topicSeenBucket(activeTopic.id, language)] ?? 0,
    );
    const stream = CSAT_STREAMS.find((s) => s.id === activeTopic.stream)!;
    const accent = ACCENT[stream.accent];

    return (
      <div className="mx-auto max-w-3xl py-8">
        <BackLink label={t("backToTopics", language)} onClick={() => goto("training")} />

        <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${accent.chip}`}>
          {csatStreamLabel(stream.id, language)}
        </span>
        <h2 className="mt-3 text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-slate-100">
          {csatTopicLabel(activeTopic.id, activeTopic.name, language)}
        </h2>
        <p className="mt-3 text-[15px] leading-7 text-slate-700 dark:text-slate-300">
          {lesson.intro}
        </p>

        {/* Concepts */}
        <div className="mt-8 space-y-5">
          {lesson.concepts.map((c, i) => (
            <div
              key={c.heading}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <h3 className="flex items-start gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${accent.chip}`}
                >
                  {i + 1}
                </span>
                <span className="min-w-0 break-words">{c.heading}</span>
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-700 dark:text-slate-300">{c.body}</p>
            </div>
          ))}
        </div>

        {/* Mid-article ad — same placement convention as the study guides. */}
        <DisplayAd adsenseSlot={IN_CONTENT_AD_SLOT} ezoicKey="contentInline" className="my-8" />

        {/* Formulas */}
        {lesson.formulas && lesson.formulas.length > 0 && (
          <div className="mt-8 rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 dark:border-indigo-900 dark:bg-indigo-950/30">
            <h3 className="text-sm font-bold uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
              Formulas to memorise
            </h3>
            <ul className="mt-3 space-y-2">
              {lesson.formulas.map((f) => (
                <li
                  key={f}
                  className="rounded-lg bg-white/70 px-3 py-2 text-sm font-medium text-slate-800 dark:bg-slate-900/40 dark:text-slate-200"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Shortcuts */}
        {lesson.shortcuts && lesson.shortcuts.length > 0 && (
          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 dark:border-emerald-900 dark:bg-emerald-950/30">
            <h3 className="text-sm font-bold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
              Exam shortcuts
            </h3>
            <ul className="mt-3 space-y-2">
              {lesson.shortcuts.map((s) => (
                <li key={s} className="flex gap-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                  <span className="text-emerald-500">⚡</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Worked examples */}
        <div className="mt-6">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Worked examples
          </h3>
          <div className="space-y-3">
            {lesson.examples.map((ex, i) => (
              <div
                key={ex.q}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Q{i + 1}. {ex.q}
                </p>
                <p className="mt-2 border-l-2 border-emerald-300 pl-3 text-sm leading-7 text-slate-700 dark:border-emerald-700 dark:text-slate-300">
                  {ex.solution}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Traps */}
        {lesson.traps && lesson.traps.length > 0 && (
          <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50/60 p-5 dark:border-rose-900 dark:bg-rose-950/30">
            <h3 className="text-sm font-bold uppercase tracking-wide text-rose-700 dark:text-rose-300">
              Common traps
            </h3>
            <ul className="mt-3 space-y-2">
              {lesson.traps.map((t) => (
                <li key={t} className="flex gap-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                  <span className="text-rose-500">⚠</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Practice CTA */}
        <div className="mt-10 border-t border-slate-200 pt-8 dark:border-slate-700">
          <div className="rounded-2xl bg-slate-900 p-6 text-center dark:bg-slate-800">
            {activeTopic.lessonOnly ? (
              <>
                <p className="text-sm text-slate-300">
                  Comprehension is practised on full passages rather than isolated questions.
                  Attempt the comprehension sections inside the previous-year papers, where each
                  passage is presented with its questions.
                </p>
                <button
                  onClick={() => goto("speed-config")}
                  className="mt-4 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
                >
                  Try a speed test instead
                </button>
              </>
            ) : (
              <>
                <p className="text-sm text-slate-300">
                  {available > 0
                    ? `${available} questions are available on this topic. Each set gives you questions you have not attempted before, so you can keep going until you have covered them all.`
                    : "No questions available for this topic in the selected language."}
                </p>
                {available > 0 && (
                  <>
                    <div className="mx-auto mt-4 max-w-sm">
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 transition-all"
                          style={{ width: `${Math.min(100, (attempted / available) * 100)}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-slate-400">
                        {attempted === 0
                          ? "You have not attempted this topic yet."
                          : `Attempted ${attempted} of ${available} so far.`}
                        {attempted > 0 && (
                          <button
                            onClick={() => {
                              resetCsatSeen(topicSeenBucket(activeTopic.id, language));
                              setCoverageTick((n) => n + 1);
                            }}
                            className="ml-2 font-semibold text-indigo-300 underline-offset-2 hover:underline"
                          >
                            Start over
                          </button>
                        )}
                      </p>
                    </div>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Choose how many to attempt
                    </p>
                    <div className="mt-2 flex flex-wrap justify-center gap-2">
                      {practiceSizes(available).map((size) => (
                        <button
                          key={size}
                          onClick={() => startTopicPractice(activeTopic, size)}
                          disabled={!quizzes}
                          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {size === available ? `All ${size}` : `${size} questions`}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ============================ PRACTICE ============================ */
  if (stage === "practice") {
    const q = session[current - 1];
    if (!q) return null;
    const selected = answers[q.key];
    const isLast = current === session.length;

    return (
      <div className="mx-auto max-w-3xl py-8">
        <BackLink label={t("backToTopics", language)} onClick={() => goto("training")} />

        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="break-words text-lg font-bold text-slate-900 dark:text-slate-100">{q.topicName}</h2>
              {q.difficulty && (
                <span
                  className={
                    "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide " +
                    (q.difficulty === "hard"
                      ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300")
                  }
                >
                  {q.difficulty}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Question {current} of {session.length}
            </p>
          </div>
          <button
            onClick={() => finishSession(session, answers, false)}
            className="shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-rose-300 hover:text-rose-600 dark:border-slate-600 dark:text-slate-300"
          >
            End practice
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all"
            style={{ width: `${(current / session.length) * 100}%` }}
          />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <QuestionCard
            question={q}
            selected={selected}
            revealed={checked}
            onSelect={(k) => {
              if (checked) return;
              setAnswers((prev) => ({ ...prev, [q.key]: k }));
            }}
          />

          {checked && (
            <div
              className={
                "mt-5 rounded-xl border p-4 " +
                (selected === q.correctAnswer
                  ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                  : "border-rose-200 bg-rose-50 dark:border-rose-800 dark:bg-rose-900/20")
              }
            >
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {selected === q.correctAnswer
                  ? "Correct!"
                  : selected
                    ? `Incorrect — the answer is ${q.correctAnswer}.`
                    : `Skipped — the answer is ${q.correctAnswer}.`}
              </p>
              {q.explanation && (
                <p className="mt-2 break-words whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-300">
                  {q.explanation}
                </p>
              )}
              <p className="mt-3 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Source: {q.sourceTitle}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {!checked ? (
            <button
              onClick={() => setChecked(true)}
              disabled={!selected}
              className="order-first w-full rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40 sm:order-last sm:w-auto"
            >
              Check answer
            </button>
          ) : (
            <button
              onClick={() => {
                if (isLast) {
                  finishSession(session, answers, false);
                } else {
                  setCurrent(current + 1);
                  setChecked(false);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
              className="order-first w-full rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-indigo-700 sm:order-last sm:w-auto"
            >
              {isLast ? "See result" : "Next question"}
            </button>
          )}
          <button
            onClick={() => {
              if (current > 1) {
                setCurrent(current - 1);
                setChecked(false);
              }
            }}
            disabled={current === 1}
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-300 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto dark:border-slate-600 dark:text-slate-200"
          >
            Previous
          </button>
        </div>
      </div>
    );
  }

  /* ========================== SPEED CONFIG ========================== */
  if (stage === "speed-config") {
    return (
      <div className="mx-auto max-w-3xl py-8">
        <BackLink label={t("backToCsat", language)} onClick={() => goto("home")} />

        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          Combined Speed Practice
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-300">
          A timed test mixing every CSAT topic — quantitative, reasoning, data interpretation and
          comprehension. Negative marking of {CSAT_NEGATIVE_MARK} applies to each wrong answer, so
          guess only when you can eliminate options.
        </p>

        <div className="mt-4 inline-flex rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-800">
          {(["english", "marathi"] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={
                "rounded-lg px-4 py-1.5 text-sm font-semibold transition-colors " +
                (language === lang
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-indigo-600 dark:text-slate-300")
              }
            >
              {lang === "english" ? "English" : "मराठी"}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {SPEED_PRESETS.map((preset) => {
            const enough = totalAvailable >= preset.questions;
            return (
              <button
                key={preset.id}
                onClick={() => startSpeedTest(preset.questions, preset.minutes)}
                disabled={!quizzes || !enough}
                className="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800"
              >
                <h3 className="text-base font-bold text-amber-700 dark:text-amber-300">
                  {preset.label}
                </h3>
                <p className="mt-1 text-3xl font-black text-slate-900 dark:text-slate-100">
                  {preset.questions}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">questions</p>
                <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                  {preset.minutes} minutes
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  ~{Math.round((preset.minutes * 60) / preset.questions)} sec per question
                </p>
              </button>
            );
          })}
        </div>

        {!quizzes && !loadError && (
          <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">Loading question bank…</p>
        )}
      </div>
    );
  }

  /* =========================== SPEED RUN ============================ */
  if (stage === "speed-run") {
    const q = session[current - 1];
    if (!q) return null;
    const lowTime = remaining <= 60;

    return (
      <div className="mx-auto max-w-3xl py-6">
        {/* Sticky timer bar */}
        <div className="sticky top-14 z-30 mb-5 flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white/95 px-3 py-2.5 shadow-sm backdrop-blur sm:px-4 dark:border-slate-700 dark:bg-slate-800/95">
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-slate-700 dark:text-slate-200">
              Speed Practice
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {answeredCount} of {session.length} answered
            </p>
          </div>
          <div
            className={
              "rounded-lg px-2.5 py-1 text-sm font-bold tabular-nums " +
              (lowTime
                ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300")
            }
          >
            {formatTime(remaining)}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
              Q{current} / {session.length}
            </span>
            <span className="truncate text-[11px] font-medium text-slate-400">{q.topicName}</span>
          </div>

          <QuestionCard
            question={q}
            selected={answers[q.key]}
            revealed={false}
            onSelect={(k) => setAnswers((prev) => ({ ...prev, [q.key]: k }))}
          />

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
              <button
                onClick={() => setCurrent((c) => Math.max(1, c - 1))}
                disabled={current === 1}
                className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-600 dark:text-slate-200"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrent((c) => Math.min(session.length, c + 1))}
                disabled={current === session.length}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
            <button
              onClick={() => {
                setAnswers((prev) => {
                  const next = { ...prev };
                  delete next[q.key];
                  return next;
                });
              }}
              className="text-left text-xs font-semibold text-slate-400 hover:text-rose-500 sm:text-center"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Question palette */}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">
            Question palette
          </p>
          <div className="flex flex-wrap gap-1">
            {session.map((item) => {
              const done = !!answers[item.key];
              const isCurrent = item.key === current;
              return (
                <button
                  key={item.key}
                  onClick={() => setCurrent(item.key)}
                  className={
                    "h-6 w-6 rounded text-[10px] font-bold transition-colors " +
                    (isCurrent
                      ? "ring-2 ring-indigo-500 ring-offset-1 dark:ring-offset-slate-800 "
                      : "") +
                    (done
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300")
                  }
                >
                  {item.key}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-6 text-center">
          {!confirmSubmit ? (
            <button
              onClick={() => setConfirmSubmit(true)}
              className="rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-slate-800 dark:bg-slate-700"
            >
              Submit test
            </button>
          ) : (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
              <p className="text-sm text-slate-700 dark:text-slate-200">
                Submit now? {session.length - answeredCount} question
                {session.length - answeredCount === 1 ? " is" : "s are"} still unanswered.
              </p>
              <div className="mt-3 flex justify-center gap-3">
                <button
                  onClick={() => setConfirmSubmit(false)}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
                >
                  Keep going
                </button>
                <button
                  onClick={() => finishSession(session, answers, true)}
                  className="rounded-xl bg-rose-600 px-5 py-2 text-sm font-bold text-white hover:bg-rose-700"
                >
                  Yes, submit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ============================= RESULTS ============================ */
  if ((stage === "practice-result" || stage === "speed-result") && result) {
    const timed = stage === "speed-result";
    return (
      <div className="mx-auto max-w-3xl py-8">
        <BackLink label={t("backToCsat", language)} onClick={() => goto("home")} />

        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          {timed ? "Speed Practice Result" : "Practice Summary"}
        </h2>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            {timed ? "Net score (after negative marking)" : "Score"}
          </p>
          <p className="mt-1 text-4xl font-black text-slate-900 dark:text-slate-100">
            {result.net % 1 === 0 ? result.net : result.net.toFixed(2)}
            <span className="text-xl font-bold text-slate-400"> / {result.total}</span>
          </p>
          <p className="mt-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            {result.percent.toFixed(1)}%
          </p>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-emerald-50 p-3 dark:bg-emerald-900/20">
              <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                {result.correct}
              </p>
              <p className="text-[11px] font-semibold uppercase text-slate-500">Correct</p>
            </div>
            <div className="rounded-xl bg-rose-50 p-3 dark:bg-rose-900/20">
              <p className="text-xl font-black text-rose-600 dark:text-rose-400">{result.wrong}</p>
              <p className="text-[11px] font-semibold uppercase text-slate-500">Wrong</p>
            </div>
            <div className="rounded-xl bg-slate-100 p-3 dark:bg-slate-700/40">
              <p className="text-xl font-black text-slate-600 dark:text-slate-300">
                {result.skipped}
              </p>
              <p className="text-[11px] font-semibold uppercase text-slate-500">Skipped</p>
            </div>
          </div>
        </div>

        {/* Topic breakdown */}
        {result.byTopic.length > 1 && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="border-b border-slate-200 px-5 py-3 text-sm font-bold text-slate-800 dark:border-slate-700 dark:text-slate-100">
              Topic-wise breakdown
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {result.byTopic.map((row) => (
                <div key={row.topicId} className="flex flex-col gap-1 px-5 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                  <span className="min-w-0 break-words text-sm text-slate-700 dark:text-slate-300">
                    {row.topicName}
                  </span>
                  <span className="shrink-0 text-sm font-semibold text-slate-600 dark:text-slate-300">
                    <span className="text-emerald-600 dark:text-emerald-400">{row.correct}</span>
                    {" / "}
                    {row.total}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Answer review (timed test only — practice already showed explanations inline) */}
        {timed && (
          <div className="mt-6">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Answer review
            </h3>
            <div className="space-y-4">
              {session.map((q) => (
                <div
                  key={q.key}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-300">
                      Q{q.key}
                    </span>
                    <span className="truncate text-[11px] font-medium text-slate-400">
                      {q.topicName}
                    </span>
                  </div>
                  <QuestionCard
                    question={q}
                    selected={answers[q.key]}
                    revealed
                    onSelect={() => {}}
                  />
                  {q.explanation && (
                    <p className="mt-3 whitespace-pre-line rounded-xl bg-slate-50 p-3 text-sm leading-7 text-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
                      {q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!timed && activeTopic && (
          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            {(() => {
              const done = Math.min(
                counts[activeTopic.id] ?? 0,
                seenCounts[topicSeenBucket(activeTopic.id, language)] ?? 0,
              );
              const all = counts[activeTopic.id] ?? 0;
              const topicName = csatTopicLabel(activeTopic.id, activeTopic.name, language);
              return done >= all
                ? (language === "marathi"
                  ? `आपण आता ${topicName} मधील सर्व ${all} प्रश्न सोडवले आहेत.`
                  : `You have now been through all ${all} questions in ${topicName}.`)
                : (language === "marathi"
                  ? `${topicName} मध्ये ${done}/${all} प्रश्न सोडवले आहेत.`
                  : `${done} of ${all} questions attempted in ${topicName}.`);
            })()}
          </p>
        )}

        <div className="mt-6 flex flex-wrap justify-center gap-3 border-t border-slate-200 pt-8 dark:border-slate-700">
          <button
            onClick={() => goto("training")}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-indigo-300 dark:border-slate-600 dark:text-slate-200"
          >
            {t("backToTopics", language)}
          </button>
          {!timed && activeTopic && (
            <button
              onClick={() => startTopicPractice(activeTopic, practiceSize)}
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-emerald-700"
            >
              Next {practiceSize} questions
            </button>
          )}
          <button
            onClick={() => (timed ? goto("speed-config") : goto("training"))}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
          >
            {timed ? "Take another test" : "Practise another topic"}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
