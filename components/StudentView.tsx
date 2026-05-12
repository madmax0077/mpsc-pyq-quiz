"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Quiz, Question, OptionKey, CATEGORIES, Category, Language, SubjectTopics } from "@/lib/types";
import { isQuestionCancelled, countScoredQuestions, optionText, normalizeQuiz } from "@/lib/questionUtils";
import { getAllQuizzes, getSubjectTopics } from "@/lib/storage";
import { mergeBundledAndLocal } from "@/lib/quizCatalog";
import { markAttempted, getCategoryProgress } from "@/lib/progress";
import { submitReport } from "@/lib/firebase";
import { submitScore } from "@/lib/leaderboard";
import { useAuth } from "@/lib/auth-context";
import { recordStreak, getStreak } from "@/lib/streak";
import { recordResult } from "@/lib/analytics";
import AdBanner from "./AdBanner";
import ShareButton from "./ShareButton";
import Confetti from "./Confetti";
import Analytics from "./Analytics";
import SearchBar, { type SearchNavigatePayload } from "./SearchBar";

const OPTION_KEYS: OptionKey[] = ["A", "B", "C", "D"];

const REGULAR_QUIZ_PAGE_SIZE = 10;
const CATEGORY_QUIZ_PAGE_SIZE = 5;
const TOPIC_QUIZ_PAGE_SIZE = 5;

function seededShuffle<T>(arr: T[], seed: string): T[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = ((h << 5) - h + seed.charCodeAt(i)) | 0;
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    h = (h * 16807 + 0) % 2147483647;
    const j = Math.abs(h) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SITE_URL = "https://www.mpscs.in";

const MOTIVATIONAL_QUOTES = [
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Discipline is the bridge between goals and accomplishment.", author: "Jim Rohn" },
  { text: "The future belongs to those who prepare for it today.", author: "Malcolm X" },
  { text: "A little progress each day adds up to big results.", author: "Satya Nani" },
  { text: "Winners never quit, and quitters never win.", author: "Vince Lombardi" },
  { text: "Education is the most powerful weapon to change the world.", author: "Nelson Mandela" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { text: "Strive for progress, not perfection.", author: "Unknown" },
];

const CATEGORY_COLORS: Record<Category, { gradient: string; icon: string; badge: string }> = {
  "Indian Polity":    { gradient: "from-blue-500 to-blue-600",    icon: "M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z", badge: "bg-blue-100 text-blue-700" },
  History:   { gradient: "from-amber-500 to-amber-600",  icon: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z", badge: "bg-amber-100 text-amber-700" },
  Geography: { gradient: "from-emerald-500 to-emerald-600", icon: "M20.893 13.393l-1.135-1.135a2.252 2.252 0 01-.421-.585l-1.08-2.16a.414.414 0 00-.663-.107.827.827 0 01-.812.21l-1.273-.363a.89.89 0 00-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 01-1.81 1.025 1.055 1.055 0 01-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 01-1.383-2.46l.007-.042a2.25 2.25 0 01.29-.787l.09-.15a2.25 2.25 0 012.37-1.048l1.178.236a1.125 1.125 0 001.302-.795l.208-.73a1.125 1.125 0 00-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 01-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 01-1.458-1.137l1.411-2.353a2.25 2.25 0 00.286-.76M11.25 2.5c3.083.307 5.768 1.934 7.393 4.393M15.75 21H5.25A2.25 2.25 0 013 18.75V5.25A2.25 2.25 0 015.25 3h1.5", badge: "bg-emerald-100 text-emerald-700" },
  Science:   { gradient: "from-purple-500 to-purple-600", icon: "M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5", badge: "bg-purple-100 text-purple-700" },
  "Current Affairs": { gradient: "from-pink-500 to-pink-600", icon: "M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z", badge: "bg-pink-100 text-pink-700" },
  Economics: { gradient: "from-teal-500 to-teal-600", icon: "M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z", badge: "bg-teal-100 text-teal-700" },
  Aptitude:  { gradient: "from-orange-500 to-orange-600", icon: "M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z", badge: "bg-orange-100 text-orange-700" },
  English:   { gradient: "from-cyan-500 to-cyan-600", icon: "M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802", badge: "bg-cyan-100 text-cyan-700" },
  Marathi:   { gradient: "from-rose-500 to-rose-600", icon: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25", badge: "bg-rose-100 text-rose-700" },
  Environment: { gradient: "from-lime-500 to-lime-600", icon: "M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z", badge: "bg-lime-100 text-lime-700" },
};

function ChallengeButton({ quizId, score, total }: { quizId: string; score: number; total: number }) {
  const [copied, setCopied] = useState(false);
  const link = `${SITE_URL}?cq=${encodeURIComponent(quizId)}&cs=${score}&ct=${total}&cn=${encodeURIComponent("A friend")}`;

  const share = () => {
    const text = `I scored ${score}/${total} on MPSC PYQ QUIZ! Can you beat me?`;
    if (navigator.share) {
      navigator.share({ title: "MPSC PYQ Challenge", text, url: link }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${text}\n${link}`).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {});
    }
  };

  return (
    <button
      onClick={share}
      className="flex items-center gap-1.5 rounded-lg border-2 border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700 shadow-sm hover:bg-amber-100 transition-colors dark:bg-amber-900/30 dark:border-amber-600 dark:text-amber-400 dark:hover:bg-amber-900/50"
    >
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
      {copied ? "Link Copied!" : "⚔️ Challenge a Friend"}
    </button>
  );
}

interface DisplayQuiz {
  id: string;
  title: string;
  questions: Question[];
  isCategory: boolean;
  category?: Category;
  quizCount?: number;
  /** Override page size for paginated (per-set submit) quizzes. */
  pageSize?: number;
}

interface ChallengeInfo {
  quizId: string;
  name: string;
  score: number;
  total: number;
}

interface GuestUserInfo {
  userId: string;
  displayName: string;
  photoURL: string | null;
}

export default function StudentView({ language = "english", challenge, homeKey = 0, topicMode = false, guestUser = null, directTopic = null }: { language?: Language; challenge?: ChallengeInfo | null; homeKey?: number; topicMode?: boolean; guestUser?: GuestUserInfo | null; directTopic?: { category: Category; topic: string } | null }) {
  const { studentUser } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<DisplayQuiz | null>(null);
  const [answers, setAnswers] = useState<Record<string, OptionKey>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [submittedPages, setSubmittedPages] = useState<Set<number>>(new Set());
  const [pageScores, setPageScores] = useState<Record<number, { correct: number; total: number }>>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [reportedIds, setReportedIds] = useState<Set<string>>(new Set());
  const [reportToast, setReportToast] = useState("");
  const [reportModal, setReportModal] = useState<{ qId: string; qText: string } | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [streak, setStreak] = useState(0);
  const [showAnalytics, setShowAnalytics] = useState(false);
  // Search → navigate to question
  const [scrollToQuestionId, setScrollToQuestionId] = useState<string | null>(null);
  // Topic-wise navigation state
  const [topicStep, setTopicStep] = useState<"subjects" | "topics">("subjects");
  const [topicCategory, setTopicCategory] = useState<Category | null>(null);
  const [showLangTip, setShowLangTip] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("mcq_lang_tip_dismissed") !== "1";
    return true;
  });

  /** Mirrors Firestore `settings/quiz_data.revision` so all clients refetch when it changes. */
  const [quizBundleRevision, setQuizBundleRevision] = useState(0);

  useEffect(() => {
    let unsub: (() => void) | undefined;
    let cancelled = false;
    import("@/lib/firebase")
      .then((m) => {
        if (cancelled || !m.subscribeQuizDataRevision) return;
        unsub = m.subscribeQuizDataRevision((rev) => setQuizBundleRevision(rev));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      unsub?.();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const local = getAllQuizzes();

    (async () => {
      try {
        const res = await fetch("/quizzes.json", { cache: "no-store" });
        if (!res.ok) throw new Error(`quizzes.json ${res.status}`);
        const raw = (await res.json()) as Quiz[];
        if (!Array.isArray(raw)) throw new Error("invalid quizzes.json shape");
        const bundled = raw.filter((q) => q.id !== "__copyright__").map(normalizeQuiz);
        if (cancelled) return;
        setQuizzes(mergeBundledAndLocal(bundled, local));
      } catch {
        if (!cancelled) setQuizzes(local);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [homeKey, quizBundleRevision]);

  useEffect(() => {
    setStreak(getStreak());
  }, [submitted, submittedPages]);

  useEffect(() => {
    setSelectedQuiz(null);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setCurrentPage(0);
    setSubmittedPages(new Set());
    setPageScores({});
  }, [language]);

  const filteredQuizzes = useMemo(() => {
    // Topic-only quizzes (Topic Wise tab) are language-agnostic — they expose
    // a topic-by-category catalogue that should be browsable in any UI
    // language. Only language-filter the regular exam papers.
    if (language === "marathi") {
      return quizzes.filter((q) => q.topicOnly || q.language === "marathi");
    }
    return quizzes.filter((q) => q.topicOnly || q.language !== "marathi");
  }, [quizzes, language]);

  const examQuizzes = useMemo(() => filteredQuizzes.filter((q) => !q.topicOnly), [filteredQuizzes]);

  const categoryQuizzes = useMemo<DisplayQuiz[]>(() => {
    const catMap = new Map<Category, Map<string, Question>>();
    for (const quiz of examQuizzes) {
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
  }, [filteredQuizzes]);

  const regularQuizzes = useMemo<DisplayQuiz[]>(
    () =>
      examQuizzes.map((q) => ({
        id: q.id,
        title: q.title,
        questions: q.questions,
        isCategory: false,
        quizCount: q.questions.length,
      })),
    [examQuizzes],
  );

  const dailyQuiz = useMemo<DisplayQuiz | null>(() => {
    const pool: Question[] = [];
    for (const quiz of examQuizzes) {
      for (const q of quiz.questions) pool.push(q);
    }
    if (pool.length === 0) return null;
    const today = new Date().toISOString().slice(0, 10);
    const shuffled = seededShuffle(pool, today + language);
    const picked = shuffled.slice(0, Math.min(10, shuffled.length));
    const monthDay = new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    return {
      id: `daily-${language}`,
      title: language === "marathi" ? `दैनिक प्रश्नमंजुषा — ${monthDay}` : `Daily Quiz — ${monthDay}`,
      questions: picked,
      isCategory: false,
    };
  }, [examQuizzes, language]);

  const dailyQuote = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    let h = 0;
    for (let i = 0; i < today.length; i++) h = ((h << 5) - h + today.charCodeAt(i)) | 0;
    return MOTIVATIONAL_QUOTES[Math.abs(h) % MOTIVATIONAL_QUOTES.length];
  }, []);

  const catProgress = useMemo(() => {
    const map: Record<string, number> = {};
    for (const cat of CATEGORIES) map[cat] = getCategoryProgress(cat);
    return map;
  }, [submitted, submittedPages]);

  const allSearchableQuestions = useMemo(() => {
    const result: { question: Question; quizTitle: string; quizId: string }[] = [];
    for (const quiz of examQuizzes) {
      const tag = quiz.tag || quiz.title;
      for (const q of quiz.questions) result.push({ question: q, quizTitle: tag, quizId: quiz.id });
    }
    return result;
  }, [examQuizzes]);


  const [subjectTopics, setSubjectTopics] = useState<SubjectTopics>(() => getSubjectTopics());

  useEffect(() => {
    setSubjectTopics(getSubjectTopics());
  }, [homeKey]);

  const topicMap = useMemo(() => {
    const map = new Map<string, { category: Category; topic: string; questions: Question[] }>();
    for (const quiz of filteredQuizzes) {
      for (const q of quiz.questions) {
        if (!q.category || !q.topic) continue;
        const key = `${q.category}|||${q.topic}`;
        if (!map.has(key)) map.set(key, { category: q.category, topic: q.topic, questions: [] });
        const entry = map.get(key)!;
        if (!entry.questions.some((eq) => eq.id === q.id)) {
          entry.questions.push(q);
        }
      }
    }
    return map;
  }, [filteredQuizzes]);

  const topicCountsByCategory = useMemo(() => {
    const counts: Record<string, { topicCount: number; questionCount: number }> = {};
    for (const cat of CATEGORIES) {
      const registeredTopics = new Set(subjectTopics[cat] || []);
      for (const [, entry] of topicMap) {
        if (entry.category === cat) registeredTopics.add(entry.topic);
      }
      const questionCount = Array.from(topicMap.values())
        .filter((e) => e.category === cat)
        .reduce((sum, e) => sum + e.questions.length, 0);
      counts[cat] = { topicCount: registeredTopics.size, questionCount };
    }
    return counts;
  }, [topicMap, subjectTopics]);

  useEffect(() => {
    if (challenge && quizzes.length > 0 && !selectedQuiz) {
      const allQuizzes = [...regularQuizzes, ...categoryQuizzes];
      const match = allQuizzes.find((q) => q.id === challenge.quizId);
      if (match) selectQuiz(match);
    }
  }, [challenge, quizzes]);

  const selectQuiz = useCallback((quiz: DisplayQuiz) => {
    setSelectedQuiz(quiz);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setCurrentPage(0);
    setSubmittedPages(new Set());
    setPageScores({});
    setShowConfetti(false);
  }, []);

  useEffect(() => {
    if (!directTopic || selectedQuiz) return;
    const key = `${directTopic.category}|||${directTopic.topic}`;
    if (!topicMap.has(key)) return;
    const entry = topicMap.get(key)!;
    if (entry.questions.length === 0) return;
    selectQuiz({
      id: `topic-${directTopic.category}-${directTopic.topic}`,
      title: directTopic.topic,
      questions: entry.questions,
      isCategory: true,
      category: directTopic.category,
      pageSize: TOPIC_QUIZ_PAGE_SIZE,
    });
  }, [directTopic, topicMap, selectedQuiz, selectQuiz]);

  const startTopicQuiz = useCallback((category: Category, topicName: string) => {
    const key = `${category}|||${topicName}`;
    const entry = topicMap.get(key);
    if (!entry || entry.questions.length === 0) {
      alert("This topic has no questions available in the current language.");
      return;
    }
    selectQuiz({
      id: `topic-${category}-${topicName}`,
      title: topicName,
      questions: entry.questions,
      isCategory: true,
      category,
      pageSize: TOPIC_QUIZ_PAGE_SIZE,
    });
  }, [topicMap, selectQuiz]);

  const navigateToQuestion = useCallback(
    ({ question, quizId }: SearchNavigatePayload) => {
      const regular = regularQuizzes.find((r) => r.id === quizId);
      if (regular) {
        const qIdx = regular.questions.findIndex((q) => q.id === question.id);
        if (qIdx === -1) return;
        const targetPage = Math.floor(qIdx / REGULAR_QUIZ_PAGE_SIZE);
        setSelectedQuiz(regular);
        setAnswers({});
        setSubmitted(false);
        setScore(0);
        setCurrentPage(targetPage);
        setSubmittedPages(new Set());
        setPageScores({});
        setShowConfetti(false);
        setScrollToQuestionId(question.id);
        return;
      }
      if (!question.category) return;
      const catQuiz = categoryQuizzes.find((cq) => cq.category === question.category);
      if (!catQuiz) return;
      const qIdx = catQuiz.questions.findIndex((q) => q.id === question.id);
      if (qIdx === -1) return;
      const targetPage = Math.floor(qIdx / CATEGORY_QUIZ_PAGE_SIZE);
      setSelectedQuiz(catQuiz);
      setAnswers({});
      setSubmitted(false);
      setScore(0);
      setCurrentPage(targetPage);
      setSubmittedPages(new Set());
      setPageScores({});
      setShowConfetti(false);
      setScrollToQuestionId(question.id);
    },
    [regularQuizzes, categoryQuizzes],
  );

  useEffect(() => {
    if (!scrollToQuestionId || !selectedQuiz) return;
    const timer = setTimeout(() => {
      const el = document.querySelector(`[data-question-id="${scrollToQuestionId}"]`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-indigo-400", "ring-offset-2");
        setTimeout(() => el.classList.remove("ring-2", "ring-indigo-400", "ring-offset-2"), 3000);
      }
      setScrollToQuestionId(null);
    }, 350);
    return () => clearTimeout(timer);
  }, [scrollToQuestionId, selectedQuiz]);

  const handleAnswer = (questionId: string, option: OptionKey) => {
    if (submitted) return;
    if (selectedQuiz?.isCategory && submittedPages.has(currentPage)) return;
    const q = selectedQuiz?.questions.find((x) => x.id === questionId);
    if (q && isQuestionCancelled(q)) return;
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    if (!selectedQuiz) return;
    const scoredQs = selectedQuiz.questions.filter((q) => !isQuestionCancelled(q));
    const answeredScored = scoredQs.filter((q) => answers[q.id]).length;
    if (answeredScored === 0) {
      alert("Please attempt at least one question before submitting.");
      return;
    }
    let correct = 0;
    for (const q of scoredQs) {
      if (answers[q.id] === q.correctAnswer) correct++;
    }
    setScore(correct);
    setSubmitted(true);
    const scoredTotal = scoredQs.length;
    const pctResult = scoredTotal > 0 ? Math.round((correct / scoredTotal) * 100) : 0;
    if (pctResult >= 80) setShowConfetti(true);
    if (selectedQuiz.category) {
      markAttempted(selectedQuiz.category, selectedQuiz.questions.filter((q) => answers[q.id]).map((q) => q.id));
    }
    recordStreak();
    recordResult({ date: new Date().toISOString().slice(0, 10), quizId: selectedQuiz.id, quizTitle: selectedQuiz.title, category: selectedQuiz.category, score: correct, total: scoredTotal });
    const leaderboardUser = studentUser
      ? { userId: studentUser.uid, displayName: studentUser.displayName, photoURL: studentUser.photoURL }
      : guestUser;
    if (leaderboardUser && scoredTotal > 0) {
      void submitScore({
        userId: leaderboardUser.userId,
        displayName: leaderboardUser.displayName,
        photoURL: leaderboardUser.photoURL,
        quizId: selectedQuiz.id,
        quizTitle: selectedQuiz.title,
        score: correct,
        total: scoredTotal,
      });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitPage = () => {
    if (!selectedQuiz) return;
    const perPage = selectedQuiz.pageSize ?? (selectedQuiz.isCategory ? CATEGORY_QUIZ_PAGE_SIZE : REGULAR_QUIZ_PAGE_SIZE);
    const start = currentPage * perPage;
    const end = Math.min(start + perPage, selectedQuiz.questions.length);
    const pageQs = selectedQuiz.questions.slice(start, end);

    const scoredOnPage = pageQs.filter((q) => !isQuestionCancelled(q));
    const pageAnswered = scoredOnPage.filter((q) => answers[q.id]).length;
    if (pageAnswered === 0) {
      alert("Please attempt at least one question before submitting this set.");
      return;
    }

    let correct = 0;
    for (const q of scoredOnPage) {
      if (answers[q.id] === q.correctAnswer) correct++;
    }

    setSubmittedPages((prev) => new Set(prev).add(currentPage));
    const pageTotal = scoredOnPage.length;
    setPageScores((prev) => ({ ...prev, [currentPage]: { correct, total: pageTotal } }));
    const pagePct = pageTotal > 0 ? Math.round((correct / pageTotal) * 100) : 0;
    if (pagePct >= 80) setShowConfetti(true);
    if (selectedQuiz?.category) {
      markAttempted(selectedQuiz.category, pageQs.filter((q) => answers[q.id]).map((q) => q.id));
    }
    recordStreak();
    recordResult({ date: new Date().toISOString().slice(0, 10), quizId: selectedQuiz!.id, quizTitle: `${selectedQuiz!.title} (Set ${currentPage + 1})`, category: selectedQuiz?.category, score: correct, total: pageTotal });
    const leaderboardUser = studentUser
      ? { userId: studentUser.uid, displayName: studentUser.displayName, photoURL: studentUser.photoURL }
      : guestUser;
    if (leaderboardUser && pageTotal > 0) {
      void submitScore({
        userId: leaderboardUser.userId,
        displayName: leaderboardUser.displayName,
        photoURL: leaderboardUser.photoURL,
        quizId: selectedQuiz!.id,
        quizTitle: `${selectedQuiz!.title} (Set ${currentPage + 1})`,
        score: correct,
        total: pageTotal,
      });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextSet = () => {
    const perPage = selectedQuiz!.pageSize ?? (selectedQuiz!.isCategory ? CATEGORY_QUIZ_PAGE_SIZE : REGULAR_QUIZ_PAGE_SIZE);
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

  useEffect(() => {
    if (homeKey > 0) {
      goBack();
      setTopicStep("subjects");
      setTopicCategory(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [homeKey]);

  const openReportModal = (qId: string, qText: string) => {
    if (reportedIds.has(qId)) {
      setReportToast("You already reported this question.");
      setTimeout(() => setReportToast(""), 2000);
      return;
    }
    setReportModal({ qId, qText });
    setReportReason("");
  };

  const handleReportSubmit = async () => {
    if (!reportModal || !reportReason.trim()) return;
    setReportSubmitting(true);
    try {
      const user = (await import("@/lib/firebase")).auth.currentUser;
      const result = await submitReport({
        questionId: reportModal.qId,
        questionText: reportModal.qText,
        quizTitle: selectedQuiz?.title || "",
        reason: reportReason.trim(),
        reporterName: user?.displayName || "Anonymous",
        reporterEmail: user?.email || "unknown",
      });
      if (result === "ok") {
        setReportedIds((prev) => new Set(prev).add(reportModal.qId));
        setReportToast("Thanks for reporting! We'll review this question.");
        setTimeout(() => setReportToast(""), 3000);
      } else {
        setReportToast("You already reported this question.");
        setTimeout(() => setReportToast(""), 2000);
      }
      setReportModal(null);
    } catch (err) {
      console.error("Report submit failed:", err);
      setReportToast("Failed to submit report. Please try again later.");
      setTimeout(() => setReportToast(""), 4000);
    } finally {
      setReportSubmitting(false);
    }
  };

  /* --------- Quiz selector --------- */
  if (!selectedQuiz) {

    /* ---- Topic-wise browsing (tag-based) ---- */
    if (topicMode) {
      if (topicStep === "subjects") {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{"\uD83C\uDFAF"} Topic Wise Practice</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Select a subject to browse available topics</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {CATEGORIES.map((cat) => {
                const info = topicCountsByCategory[cat] || { topicCount: 0, questionCount: 0 };
                const colors = CATEGORY_COLORS[cat];
                if (info.topicCount === 0) return null;
                return (
                  <button
                    key={cat}
                    onClick={() => { setTopicCategory(cat); setTopicStep("topics"); }}
                    className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm hover:shadow-md transition-all dark:bg-slate-800 dark:border-slate-700"
                  >
                    <div className={`h-1.5 bg-gradient-to-r ${colors.gradient}`} />
                    <div className="p-5">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 shrink-0 rounded-lg bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white`}>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d={colors.icon} />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors dark:text-slate-100 dark:group-hover:text-indigo-400">
                            {cat}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {info.topicCount} topic{info.topicCount !== 1 ? "s" : ""} &middot; {info.questionCount} question{info.questionCount !== 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-end">
                        <span className="text-xs font-medium text-indigo-500 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                          View Topics
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
        );
      }

      if (topicStep === "topics" && topicCategory) {
        const colors = CATEGORY_COLORS[topicCategory];
        const registeredTopics = new Set(subjectTopics[topicCategory] || []);
        for (const [, entry] of topicMap) {
          if (entry.category === topicCategory) registeredTopics.add(entry.topic);
        }
        const topicList = Array.from(registeredTopics).map((name) => {
          const key = `${topicCategory}|||${name}`;
          const entry = topicMap.get(key);
          return { name, questionCount: entry ? entry.questions.length : 0 };
        }).sort((a, b) => b.questionCount - a.questionCount);

        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setTopicStep("subjects")}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition-colors dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </button>
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{topicCategory}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {topicList.length} topic{topicList.length !== 1 ? "s" : ""} available
                </p>
              </div>
            </div>

            {topicList.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center dark:bg-slate-800 dark:border-slate-600">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700">
                  <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">No topics added yet</p>
                <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
                  Admin hasn&apos;t added any topics for {topicCategory} yet.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {topicList.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => startTopicQuiz(topicCategory, item.name)}
                    disabled={item.questionCount === 0}
                    className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm hover:border-emerald-200 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-800 dark:border-slate-700 dark:hover:border-emerald-600"
                  >
                    <div className={`h-1.5 bg-gradient-to-r ${colors.gradient}`} />
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-slate-800 group-hover:text-emerald-600 transition-colors dark:text-slate-100 dark:group-hover:text-emerald-400">
                            {item.name}
                          </h3>
                        </div>
                        <svg className="h-5 w-5 shrink-0 mt-0.5 text-slate-300 group-hover:text-emerald-400 transition-colors dark:text-slate-600 dark:group-hover:text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.badge}`}>
                          {topicCategory}
                        </span>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          {item.questionCount} question{item.questionCount !== 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      }
    }

    const hasAny = regularQuizzes.length > 0 || categoryQuizzes.length > 0;

    return (
      <div className="space-y-8">
        {!hasAny ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-16 text-center dark:bg-slate-800 dark:border-slate-600">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              {language === "marathi" ? "मराठी प्रश्नसंच उपलब्ध नाहीत" : "No quizzes available"}
            </p>
            <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
              {language === "marathi" ? "मराठी प्रश्नसंच लवकरच जोडले जातील." : "Switch to Admin Mode to create your first quiz."}
            </p>
          </div>
        ) : (
          <>
            {/* Language tip */}
            {showLangTip && language === "english" && (
              <div className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-2.5 dark:border-indigo-800 dark:bg-indigo-950/40">
                <span className="text-base">🌐</span>
                <p className="flex-1 text-xs sm:text-sm text-indigo-700 dark:text-indigo-300">
                  मराठी मध्ये तयारी करायची आहे? वरील dropdown मधून <span className="font-bold">मराठी</span> भाषा निवडा.
                </p>
                <button
                  onClick={() => { setShowLangTip(false); localStorage.setItem("mcq_lang_tip_dismissed", "1"); }}
                  className="shrink-0 rounded-md p-1 text-indigo-400 hover:bg-indigo-100 hover:text-indigo-600 transition-colors dark:hover:bg-indigo-900/50"
                  aria-label="Dismiss"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Streak + Search + My Stats row */}
            <div className="flex items-center justify-between gap-2 flex-wrap min-w-0">
              {streak > 0 ? (
                <div className="flex items-center gap-2 rounded-full bg-indigo-50 px-4 py-2 ring-1 ring-indigo-200 dark:bg-indigo-950/50 dark:ring-indigo-800">
                  <span className="text-xl">🔥</span>
                  <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">{streak} day{streak !== 1 ? "s" : ""} streak!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 ring-1 ring-slate-200 dark:bg-slate-800 dark:ring-slate-700">
                  <span className="text-lg">🔥</span>
                  <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Take a quiz to start your streak!</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <SearchBar allQuestions={allSearchableQuestions} onNavigateToQuestion={navigateToQuestion} />
                <button
                  onClick={() => setShowAnalytics(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-50 transition-colors dark:bg-slate-800 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-slate-700"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                  <span className="hidden sm:inline">My Stats</span>
                </button>
              </div>
            </div>

            {/* Analytics Dashboard */}
            {showAnalytics && (
              <Analytics streak={streak} onClose={() => setShowAnalytics(false)} />
            )}

            {/* Daily Motivation Quote */}
            <div className="rounded-xl border border-amber-200/60 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-4 dark:from-amber-950/20 dark:to-orange-950/20 dark:border-amber-800/40">
              <div className="flex gap-3">
                <span className="mt-0.5 text-xl">💡</span>
                <div>
                  <p className="text-sm font-medium italic text-slate-700 dark:text-slate-200">
                    &ldquo;{dailyQuote.text}&rdquo;
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    — {dailyQuote.author}
                  </p>
                </div>
              </div>
            </div>

            {/* Daily Quiz */}
            {dailyQuiz && (
              <button
                onClick={() => selectQuiz(dailyQuiz)}
                className="group w-full rounded-xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 via-violet-50 to-purple-50 p-5 text-left shadow-sm hover:shadow-md hover:border-indigo-300 transition-all dark:from-indigo-950/50 dark:via-violet-950/50 dark:to-purple-950/50 dark:border-indigo-700 dark:hover:border-indigo-500"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-indigo-700 group-hover:text-indigo-800 transition-colors dark:text-indigo-300 dark:group-hover:text-indigo-200">
                      {dailyQuiz.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {dailyQuiz.questions.length} random questions &middot; New questions every day!
                    </p>
                  </div>
                  <svg className="h-5 w-5 shrink-0 text-indigo-300 group-hover:text-indigo-500 transition-colors dark:text-indigo-600 dark:group-hover:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              </button>
            )}

            {/* Category Quizzes */}
            {categoryQuizzes.length > 0 && (
              <div>
                <h2 className="mb-1 text-lg font-bold text-slate-800 dark:text-slate-100">Practice by Subject</h2>
                <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Auto-grouped from categorized questions across all quizzes.</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {categoryQuizzes.map((cq) => {
                    const cat = cq.category!;
                    const colors = CATEGORY_COLORS[cat];
                    const attempted = catProgress[cat] || 0;
                    const totalQ = cq.questions.length;
                    const progressPct = totalQ > 0 ? Math.min(100, Math.round((attempted / totalQ) * 100)) : 0;
                    const r = 18;
                    const circ = 2 * Math.PI * r;
                    const offset = circ - (progressPct / 100) * circ;
                    return (
                      <button
                        key={cq.id}
                        onClick={() => selectQuiz(cq)}
                        className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white text-left shadow-sm hover:shadow-md transition-all dark:bg-slate-800 dark:border-slate-700"
                      >
                        <div className={`h-1.5 bg-gradient-to-r ${colors.gradient}`} />
                        <div className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <svg width="44" height="44" className="-rotate-90">
                                <circle cx="22" cy="22" r={r} fill="none" strokeWidth="3" className="stroke-slate-100 dark:stroke-slate-700" />
                                {progressPct > 0 && (
                                  <circle cx="22" cy="22" r={r} fill="none" strokeWidth="3" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} style={{ stroke: colors.gradient.includes("blue") ? "#3b82f6" : colors.gradient.includes("amber") ? "#f59e0b" : colors.gradient.includes("emerald") ? "#10b981" : colors.gradient.includes("purple") ? "#8b5cf6" : colors.gradient.includes("pink") ? "#ec4899" : colors.gradient.includes("orange") ? "#f97316" : colors.gradient.includes("cyan") ? "#06b6d4" : colors.gradient.includes("rose") ? "#f43f5e" : "#14b8a6" }} />
                                )}
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{progressPct}%</span>
                              </div>
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors dark:text-slate-100 dark:group-hover:text-indigo-400">
                                {cq.title}
                              </h3>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                {attempted}/{totalQ} attempted
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-end">
                            <span className="text-xs font-medium text-indigo-500 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                              {progressPct >= 100 ? "Review All" : "Start Practice"}
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
                <h2 className="mb-1 text-lg font-bold text-slate-800 dark:text-slate-100">All Quizzes</h2>
                <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Full question papers as uploaded by admin.</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  {regularQuizzes.map((quiz) => (
                    <button
                      key={quiz.id}
                      onClick={() => selectQuiz(quiz)}
                      className="group flex items-center gap-3 sm:gap-4 rounded-xl border border-slate-200 bg-white p-3 sm:p-5 text-left shadow-sm hover:border-indigo-200 hover:shadow-md transition-all dark:bg-slate-800 dark:border-slate-700 dark:hover:border-indigo-600"
                    >
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors dark:bg-indigo-900/40 dark:text-indigo-400 dark:group-hover:bg-indigo-900/60">
                        <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm sm:text-base font-semibold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors dark:text-slate-100 dark:group-hover:text-indigo-400">
                          {quiz.title}
                        </h3>
                        <p className="mt-0.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                          {quiz.questions.length} question{quiz.questions.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-slate-300 group-hover:text-indigo-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Share CTA */}
            <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-violet-50 p-5 text-center dark:from-indigo-950/30 dark:to-violet-950/30 dark:border-indigo-800">
              <p className="mb-3 text-sm font-medium text-slate-600 dark:text-slate-300">
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
  const perPage = selectedQuiz.pageSize ?? (isCategoryQuiz ? CATEGORY_QUIZ_PAGE_SIZE : REGULAR_QUIZ_PAGE_SIZE);
  const total = selectedQuiz.questions.length;
  const scoredTotal = countScoredQuestions(selectedQuiz.questions);
  const answeredCount = Object.keys(answers).length;
  const answeredScoredCount = selectedQuiz.questions.filter((q) => !isQuestionCancelled(q) && answers[q.id]).length;
  const pct = scoredTotal > 0 ? Math.round((score / scoredTotal) * 100) : 0;
  const skippedCount = scoredTotal - answeredScoredCount;
  const catStyle = selectedQuiz.category ? CATEGORY_COLORS[selectedQuiz.category] : null;

  const totalPages = Math.ceil(total / perPage);
  const pageQuestions = selectedQuiz.questions.slice(
    currentPage * perPage,
    (currentPage + 1) * perPage,
  );
  const isPageSubmitted = submittedPages.has(currentPage);
  const currentPageScore = pageScores[currentPage];
  const pageScoredCount = pageQuestions.filter((q) => !isQuestionCancelled(q)).length;
  const pageAnsweredCount = pageQuestions.filter((q) => !isQuestionCancelled(q) && answers[q.id]).length;
  const allPagesSubmitted = submittedPages.size === totalPages;
  const totalCategoryScore = Object.values(pageScores).reduce((s, p) => s + p.correct, 0);
  const totalCategoryQuestions = Object.values(pageScores).reduce((s, p) => s + p.total, 0);

  return (
    <div className="space-y-6">
      {showConfetti && <Confetti />}

      {/* Report Toast */}
      {reportToast && (
        <div className="animate-slide-up fixed bottom-6 right-6 z-50 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-lg">
          {reportToast}
        </div>
      )}

      {/* Report Modal */}
      {reportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Report Question</h3>
            </div>
            <p className="mb-4 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
              We are still in the initial phase of our project. Please help us by reporting wrong answers — we will take action ASAP!
            </p>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Describe the issue
            </label>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="e.g. Wrong answer marked, question is unclear, options are incorrect..."
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder:text-slate-500"
              autoFocus
            />
            <div className="mt-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setReportModal(null)}
                disabled={reportSubmitting}
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleReportSubmit}
                disabled={reportSubmitting || !reportReason.trim()}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {reportSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Challenge Banner */}
      {challenge && challenge.quizId === selectedQuiz?.id && (
        <div className="animate-slide-up rounded-xl border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-4 text-center dark:from-amber-950/30 dark:to-orange-950/30 dark:border-amber-600">
          <p className="text-base font-bold text-amber-700 dark:text-amber-400">
            ⚔️ {challenge.name} scored {challenge.score}/{challenge.total}. Can you beat them?
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={goBack}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition-colors dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-base sm:text-xl font-bold text-slate-800 dark:text-slate-100 break-words">
              {selectedQuiz.title}
            </h2>
            {selectedQuiz.category && catStyle && (
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${catStyle.badge}`}>
                {selectedQuiz.category}
              </span>
            )}
          </div>
          {!submitted && !isCategoryQuiz && (
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {answeredScoredCount} of {scoredTotal} answered
              {total > scoredTotal && (
                <span className="text-slate-400"> &middot; {total - scoredTotal} cancelled (not scored)</span>
              )}
              {skippedCount > 0 && answeredScoredCount > 0 && (
                <span className="text-slate-400"> &middot; {skippedCount} skipped</span>
              )}
            </p>
          )}
          {isCategoryQuiz && (
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              Set {currentPage + 1} of {totalPages} &middot; {pageAnsweredCount} of {pageScoredCount} answered
              {submittedPages.size > 0 && (
                <span className="text-indigo-500 font-medium"> &middot; {submittedPages.size}/{totalPages} sets done</span>
              )}
            </p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {isCategoryQuiz ? (
        <div className="overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-1.5 rounded-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${totalPages > 0 ? (submittedPages.size / totalPages) * 100 : 0}%` }}
          />
        </div>
      ) : !submitted ? (
        <div className="overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-1.5 rounded-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${scoredTotal > 0 ? (answeredScoredCount / scoredTotal) * 100 : 0}%` }}
          />
        </div>
      ) : null}

      {/* Score Banner - Regular quiz (full submit) */}
      {submitted && !isCategoryQuiz && (
        <div
          className={`animate-slide-up rounded-2xl p-4 sm:p-6 text-center shadow-sm ${
            pct >= 70
              ? "bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 dark:from-emerald-950 dark:to-green-950 dark:border-emerald-800"
              : pct >= 40
                ? "bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 dark:from-amber-950 dark:to-yellow-950 dark:border-amber-800"
                : "bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 dark:from-red-950 dark:to-rose-950 dark:border-red-800"
          }`}
        >
          <p className="text-5xl font-extrabold tracking-tight">
            <span className={pct >= 70 ? "text-emerald-600" : pct >= 40 ? "text-amber-600" : "text-red-600"}>
              {score}
            </span>
            <span className="text-slate-400 dark:text-slate-100">/{scoredTotal}</span>
          </p>
          <p className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-100">
            You scored {pct}%
            {skippedCount > 0 && <span className="text-slate-500 dark:text-slate-200"> ({skippedCount} skipped)</span>}
            {" "}
            {pct >= 70
              ? "— Excellent!"
              : pct >= 40
                ? "— Good effort, keep practicing!"
                : "— Review the answers below."}
          </p>
          {challenge && challenge.quizId === selectedQuiz.id && (
            <p className="mt-2 text-sm font-bold">
              {score > challenge.score ? (
                <span className="text-emerald-600 dark:text-emerald-400">🏆 You beat {challenge.name}! ({challenge.score}/{challenge.total})</span>
              ) : score === challenge.score ? (
                <span className="text-amber-600 dark:text-amber-400">🤝 It&apos;s a tie with {challenge.name}!</span>
              ) : (
                <span className="text-red-600 dark:text-red-400">😤 {challenge.name} wins ({challenge.score}/{challenge.total}). Try again!</span>
              )}
            </p>
          )}
          <p className="mt-4 text-xs font-medium text-slate-500 dark:text-slate-100">
            Think you did well? Dare a friend to beat your score!
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-2">
            <ChallengeButton quizId={selectedQuiz.id} score={score} total={scoredTotal} />
            <ShareButton score={{ correct: score, total: scoredTotal }} label="Share Score" />
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
                ? "bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 dark:from-emerald-950 dark:to-green-950 dark:border-emerald-800"
                : pagePct >= 40
                  ? "bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 dark:from-amber-950 dark:to-yellow-950 dark:border-amber-800"
                  : "bg-gradient-to-br from-red-50 to-rose-50 border border-red-200 dark:from-red-950 dark:to-rose-950 dark:border-red-800";
            })()
          }`}
        >
          <p className="text-center text-3xl font-extrabold tracking-tight">
            <span className={(() => { const p = Math.round((currentPageScore.correct / currentPageScore.total) * 100); return p >= 70 ? "text-emerald-600" : p >= 40 ? "text-amber-600" : "text-red-600"; })()}>
              {currentPageScore.correct}
            </span>
            <span className="text-slate-400 dark:text-slate-100">/{currentPageScore.total}</span>
          </p>
          <p className="mt-1 text-center text-sm font-medium text-slate-600 dark:text-slate-300">
            Set {currentPage + 1} — {Math.round((currentPageScore.correct / currentPageScore.total) * 100)}% correct
          </p>
          {allPagesSubmitted && (
            <div className="mt-3 rounded-lg bg-white/60 p-3 text-center border border-slate-200 dark:bg-slate-800/60 dark:border-slate-700">
              <p className="text-lg font-bold text-indigo-700 dark:text-indigo-300">
                Overall: {totalCategoryScore}/{totalCategoryQuestions} ({totalCategoryQuestions > 0 ? Math.round((totalCategoryScore / totalCategoryQuestions) * 100) : 0}%)
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-300">All {totalPages} sets completed!</p>
              <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-100">
                Dare a friend to beat your score!
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                <ChallengeButton quizId={selectedQuiz.id} score={totalCategoryScore} total={totalCategoryQuestions} />
                <ShareButton score={{ correct: totalCategoryScore, total: totalCategoryQuestions }} label="Share Score" />
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
          const qCancelled = isQuestionCancelled(q);
          const isCorrect = qSubmitted && !qCancelled && userAnswer === q.correctAnswer;
          const isWrong = qSubmitted && !qCancelled && !!userAnswer && userAnswer !== q.correctAnswer;
          const isSkipped = qSubmitted && !qCancelled && !userAnswer;

          return (
            <div key={q.id} className="space-y-4">
            <div
              data-question-id={q.id}
              className={`rounded-xl border bg-white shadow-sm transition-all dark:bg-slate-800 ${
                qSubmitted && qCancelled
                  ? "border-amber-200 bg-amber-50/40 dark:border-amber-800 dark:bg-amber-950/20"
                  : qSubmitted
                    ? isCorrect
                      ? "border-emerald-300 bg-emerald-50/30 dark:bg-emerald-900/20 dark:border-emerald-700"
                      : isSkipped
                        ? "border-slate-200 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/50"
                        : "border-red-300 bg-red-50/30 dark:bg-red-900/20 dark:border-red-700"
                    : userAnswer
                      ? "border-indigo-200 dark:border-indigo-700"
                      : "border-slate-200 dark:border-slate-700"
              }`}
            >
              <div className="relative p-3 sm:p-5">
                {isCategoryQuiz && q.sourceTag && (
                  <span className="mb-2 inline-block sm:absolute sm:top-2 sm:right-2 sm:mb-0 rounded-md bg-violet-100 px-2 py-0.5 text-[10px] font-semibold text-violet-600 leading-tight max-w-full sm:max-w-[45%] truncate dark:bg-violet-900/40 dark:text-violet-300">
                    {q.sourceTag}
                  </span>
                )}
                <div className="mb-4 flex items-start gap-2 sm:gap-3">
                  <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    qSubmitted && qCancelled
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
                      : qSubmitted && isCorrect
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
                  <p className="select-text font-medium text-slate-800 leading-relaxed whitespace-pre-line dark:text-slate-100">{q.text}</p>
                </div>

                {q.imageUrl && (
                  <div className="mb-4 ml-0 sm:ml-10 rounded-lg border border-slate-200 bg-slate-50 p-2">
                    <img
                      src={q.imageUrl}
                      alt="Question diagram"
                      className="max-h-64 w-full rounded object-contain"
                    />
                  </div>
                )}

                <div className="ml-0 sm:ml-10 grid gap-2 sm:grid-cols-2">
                  {OPTION_KEYS.map((key) => {
                    const isSelected = userAnswer === key;
                    const isThisCorrect = !qCancelled && q.correctAnswer === key;

                    let classes =
                      "flex items-center gap-2 sm:gap-3 rounded-lg border px-3 py-2.5 sm:px-4 sm:py-3 text-sm transition-all ";

                    if (qCancelled) {
                      classes += qSubmitted
                        ? "border-slate-200 text-slate-500 bg-slate-50/70 dark:border-slate-600 dark:bg-slate-800/60 dark:text-slate-400"
                        : "border-slate-200 text-slate-500 bg-slate-50/50 cursor-not-allowed opacity-80 dark:border-slate-600 dark:bg-slate-800/40 dark:text-slate-500";
                    } else if (qSubmitted) {
                      if (isThisCorrect) {
                        classes += "border-emerald-400 bg-emerald-50 text-emerald-800 font-medium dark:bg-emerald-900/30 dark:border-emerald-600 dark:text-emerald-300";
                      } else if (isSelected && !isThisCorrect) {
                        classes += "border-red-400 bg-red-50 text-red-700 line-through dark:bg-red-900/30 dark:border-red-600 dark:text-red-300";
                      } else {
                        classes += "border-slate-100 text-slate-400 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-500";
                      }
                    } else {
                      classes += isSelected
                        ? "border-indigo-400 bg-indigo-50 text-indigo-800 font-medium ring-2 ring-indigo-100 cursor-pointer dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-200 dark:ring-indigo-900"
                        : "border-slate-200 text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50 cursor-pointer dark:border-slate-600 dark:text-slate-300 dark:hover:border-indigo-600 dark:hover:bg-indigo-900/20";
                    }

                    return (
                      <label key={key} className={classes}>
                        <input
                          type="radio"
                          name={`student-q-${q.id}`}
                          value={key}
                          checked={isSelected}
                          onChange={() => handleAnswer(q.id, key)}
                          disabled={qSubmitted || qCancelled}
                          className="sr-only"
                        />
                        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold ${
                          qCancelled
                            ? "border-slate-300 bg-slate-100 text-slate-500 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-400"
                            : qSubmitted && isThisCorrect
                              ? "border-emerald-500 bg-emerald-500 text-white"
                              : qSubmitted && isSelected && !isThisCorrect
                                ? "border-red-400 bg-red-100 text-red-600"
                                : isSelected
                                  ? "border-indigo-500 bg-indigo-500 text-white"
                                  : "border-slate-300 text-slate-500"
                        }`}>
                          {!qCancelled && qSubmitted && isThisCorrect ? (
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          ) : !qCancelled && qSubmitted && isSelected && !isThisCorrect ? (
                            <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          ) : (
                            key
                          )}
                        </span>
                        <span className="select-text leading-snug whitespace-pre-line">{optionText(q, key)}</span>
                      </label>
                    );
                  })}
                </div>

                {/* Explanation after submit */}
                {qSubmitted && (
                  <div className={`mt-4 ml-0 sm:ml-10 rounded-lg p-3 sm:p-4 border ${
                    qCancelled
                      ? "bg-amber-50 border-amber-200 dark:bg-amber-950/25 dark:border-amber-800"
                      : isCorrect
                        ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-700"
                        : isSkipped
                          ? "bg-slate-50 border-slate-200 dark:bg-slate-800 dark:border-slate-700"
                          : "bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-700"
                  }`}>
                    <div className="flex items-start gap-2">
                      {qCancelled ? (
                        <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                      ) : isCorrect ? (
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
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                          {qCancelled
                            ? "Cancelled by MPSC — no official credited answer (final key: X)."
                            : isCorrect
                              ? "Correct!"
                              : isSkipped
                                ? `Skipped — the answer is ${q.correctAnswer}.`
                                : `Incorrect — the answer is ${q.correctAnswer}.`}
                        </p>
                        {q.explanation ? (
                          <p className="mt-1 text-sm text-slate-600 whitespace-pre-line dark:text-slate-300">{q.explanation}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="mt-2 ml-0 sm:ml-6 flex justify-end">
                      <button
                        onClick={() => openReportModal(q.id, q.text)}
                        disabled={reportedIds.has(q.id)}
                        className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed dark:hover:bg-red-900/20 dark:hover:text-red-400"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                        </svg>
                        {reportedIds.has(q.id) ? "Reported" : "Report"}
                      </button>
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
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto px-1 py-1">
          <button
            onClick={() => { setCurrentPage((p) => Math.max(0, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            disabled={currentPage === 0}
            className="shrink-0 rounded-lg border border-slate-200 bg-white px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => { setCurrentPage(i); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className={`h-8 w-8 sm:h-9 sm:w-9 shrink-0 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                currentPage === i
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => { setCurrentPage((p) => Math.min(totalPages - 1, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            disabled={currentPage === totalPages - 1}
            className="shrink-0 rounded-lg border border-slate-200 bg-white px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Next
          </button>
        </div>
      )}

      {/* Category quiz pagination (set indicator) — free navigation between sets */}
      {isCategoryQuiz && totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
          {Array.from({ length: totalPages }, (_, i) => {
            const isCurrent = currentPage === i;
            const isDone = submittedPages.has(i);
            return (
              <button
                key={i}
                onClick={() => { setCurrentPage(i); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                title={isDone ? `Set ${i + 1} — submitted` : isCurrent ? `Set ${i + 1} — current` : `Go to Set ${i + 1}`}
                className={`h-8 sm:h-9 min-w-[2rem] sm:min-w-[2.25rem] rounded-lg px-1.5 sm:px-2 text-xs sm:text-sm font-medium transition-colors ${
                  isCurrent
                    ? "bg-indigo-600 text-white shadow-sm"
                    : isDone
                      ? "bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-700 dark:hover:bg-emerald-900/50"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-600 dark:hover:bg-slate-700"
                }`}
              >
                {isDone ? (
                  <svg className="h-4 w-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                ) : (
                  i + 1
                )}
              </button>
            );
          })}
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
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setAnswers({});
                    setSubmitted(false);
                    setScore(0);
                    setCurrentPage(0);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="flex-1 rounded-xl border border-indigo-200 bg-white px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors dark:bg-slate-800 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-slate-700"
                >
                  Retake Quiz
                </button>
                <button
                  onClick={goBack}
                  className="flex-1 rounded-xl bg-slate-100 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-slate-700 hover:bg-slate-200 transition-colors dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
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
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                {currentPage < totalPages - 1 && (
                  <button
                    onClick={handleNextSet}
                    className="flex-1 rounded-xl bg-indigo-600 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-white hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
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
                  className="flex-1 rounded-xl border border-indigo-200 bg-white px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors dark:bg-slate-800 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-slate-700"
                >
                  Retake All
                </button>
                <button
                  onClick={goBack}
                  className="flex-1 rounded-xl bg-slate-100 px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-slate-700 hover:bg-slate-200 transition-colors dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
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
