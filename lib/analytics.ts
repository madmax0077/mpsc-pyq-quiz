const KEY = "mcq_history";

/** Where the attempt came from — drives My Stats score-history tabs. */
export type PracticeMode = "subject" | "topic-pyq" | "topic-tests" | "csat" | "mock";

export const PRACTICE_MODES: PracticeMode[] = [
  "subject",
  "topic-pyq",
  "topic-tests",
  "csat",
  "mock",
];

export const PRACTICE_MODE_LABELS: Record<PracticeMode, string> = {
  subject: "Subject Wise",
  "topic-pyq": "Topic Wise (PYQ)",
  "topic-tests": "Topic Tests",
  csat: "CSAT",
  mock: "Mock Test",
};

export interface QuizResult {
  date: string;
  quizId: string;
  quizTitle: string;
  category?: string;
  /** Practice surface that produced this attempt. */
  mode?: PracticeMode;
  score: number;
  total: number;
  /**
   * Optional display percent (used for negative-marking modes like Mock/CSAT).
   * When omitted, UI uses score/total.
   */
  pct?: number;
  timestamp: number;
}

export interface TimelinePoint {
  date: string;
  pct: number;
  score: number;
  total: number;
  label: string;
  mode: PracticeMode;
}

export function recordResult(entry: Omit<QuizResult, "timestamp">): void {
  if (typeof window === "undefined") return;
  try {
    const history = getHistory();
    history.push({ ...entry, timestamp: Date.now() });
    if (history.length > 200) history.splice(0, history.length - 200);
    localStorage.setItem(KEY, JSON.stringify(history));
  } catch {
    /* storage full — silently fail */
  }
}

export function getHistory(): QuizResult[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/** Infer mode for older history rows that predate the `mode` field. */
export function resolvePracticeMode(r: QuizResult): PracticeMode {
  if (r.mode && PRACTICE_MODES.includes(r.mode)) return r.mode;
  const id = r.quizId || "";
  const cat = (r.category || "").toLowerCase();
  if (id.startsWith("mock-") || cat === "mock test" || cat === "mock") return "mock";
  if (id.startsWith("csat-") || cat === "csat") return "csat";
  if (id.startsWith("topic-tests-") || id.includes("|||catalog")) return "topic-tests";
  if (id.startsWith("topic-pyq-") || id.startsWith("topic-")) return "topic-pyq";
  return "subject";
}

function resultPct(r: QuizResult): number {
  if (typeof r.pct === "number" && Number.isFinite(r.pct)) {
    return Math.max(0, Math.min(100, Math.round(r.pct)));
  }
  return r.total > 0 ? Math.round((r.score / r.total) * 100) : 0;
}

export function getCategoryAccuracy(): Record<string, { correct: number; total: number; pct: number }> {
  const history = getHistory();
  const map: Record<string, { correct: number; total: number }> = {};
  for (const r of history) {
    const mode = resolvePracticeMode(r);
    // Category bars are for subject/topic practice only.
    if (mode === "mock" || mode === "csat") continue;
    const cat = r.category || "Uncategorized";
    if (!map[cat]) map[cat] = { correct: 0, total: 0 };
    map[cat].correct += r.score;
    map[cat].total += r.total;
  }
  const result: Record<string, { correct: number; total: number; pct: number }> = {};
  for (const [cat, v] of Object.entries(map)) {
    result[cat] = { ...v, pct: v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0 };
  }
  return result;
}

export function getScoreTimeline(mode?: PracticeMode, limit = 12): TimelinePoint[] {
  const history = getHistory();
  const filtered = mode
    ? history.filter((r) => resolvePracticeMode(r) === mode)
    : history;
  const last = filtered.slice(-limit);
  return last.map((r) => ({
    date: r.date,
    pct: resultPct(r),
    score: r.score,
    total: r.total,
    label: r.quizTitle,
    mode: resolvePracticeMode(r),
  }));
}

export function getModeCounts(): Record<PracticeMode, number> {
  const counts: Record<PracticeMode, number> = {
    subject: 0,
    "topic-pyq": 0,
    "topic-tests": 0,
    csat: 0,
    mock: 0,
  };
  for (const r of getHistory()) {
    counts[resolvePracticeMode(r)] += 1;
  }
  return counts;
}

export function getSummary() {
  const history = getHistory();
  const totalQuizzes = history.length;
  const totalQuestions = history.reduce((s, r) => s + r.total, 0);
  const totalCorrect = history.reduce((s, r) => s + r.score, 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  return { totalQuizzes, totalQuestions, totalCorrect, accuracy };
}

/** Replace full history (used by cloud sync merge). Caps at 200. */
export function replaceHistory(entries: QuizResult[]): void {
  if (typeof window === "undefined") return;
  try {
    const next = Array.isArray(entries) ? entries.slice(-200) : [];
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* storage full */
  }
}
