const KEY = "mcq_history";

export interface QuizResult {
  date: string;
  quizId: string;
  quizTitle: string;
  category?: string;
  score: number;
  total: number;
  timestamp: number;
}

export function recordResult(entry: Omit<QuizResult, "timestamp">): void {
  if (typeof window === "undefined") return;
  try {
    const history = getHistory();
    history.push({ ...entry, timestamp: Date.now() });
    if (history.length > 200) history.splice(0, history.length - 200);
    localStorage.setItem(KEY, JSON.stringify(history));
  } catch { /* storage full — silently fail */ }
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

export function getCategoryAccuracy(): Record<string, { correct: number; total: number; pct: number }> {
  const history = getHistory();
  const map: Record<string, { correct: number; total: number }> = {};
  for (const r of history) {
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

export function getScoreTimeline(): { date: string; pct: number; label: string }[] {
  const history = getHistory();
  const last = history.slice(-20);
  return last.map((r) => ({
    date: r.date,
    pct: r.total > 0 ? Math.round((r.score / r.total) * 100) : 0,
    label: r.quizTitle.length > 20 ? r.quizTitle.slice(0, 18) + "…" : r.quizTitle,
  }));
}

export function getSummary() {
  const history = getHistory();
  const totalQuizzes = history.length;
  const totalQuestions = history.reduce((s, r) => s + r.total, 0);
  const totalCorrect = history.reduce((s, r) => s + r.score, 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  return { totalQuizzes, totalQuestions, totalCorrect, accuracy };
}
