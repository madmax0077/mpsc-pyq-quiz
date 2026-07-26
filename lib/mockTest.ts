import type { Category, OptionKey, Question, Quiz } from "./types";
import { isQuestionCancelled } from "./questionUtils";

/**
 * Mock Test engine.
 *
 * Builds a 100-question timed mock that mirrors the real MPSC Set A subject
 * weightage. Every General Studies question is shown BILINGUALLY (Marathi on
 * top, English below) exactly like the real paper, so GS questions are sampled
 * only from PYQ items that have a genuine Marathi counterpart. Current Affairs
 * is sourced ONLY from the "GK 2025-26 Marathon" set (English-only) and never
 * from PYQ papers. Cancelled questions are excluded. Scoring uses the real 1/4
 * negative-marking scheme.
 */

/** Quiz id that holds the curated GK Marathon current-affairs questions. */
export const GK_MARATHON_QUIZ_ID = "topic-current-affairs-gk-2025-26-marathon";

export type MockExamId = "rajyaseva" | "group-b" | "group-c";

export interface MockConfig {
  id: MockExamId;
  label: string;
  shortLabel: string;
  durationMinutes: number;
  description: string;
  /** Target number of questions per subject; must sum to totalQuestions. */
  blueprint: Partial<Record<Category, number>>;
}

export const TOTAL_QUESTIONS = 100;
/** Marks deducted per wrong answer (MPSC prelim = 1/4). */
export const NEGATIVE_MARK = 0.25;

export const MOCK_CONFIGS: MockConfig[] = [
  {
    id: "rajyaseva",
    label: "GS Rajyaseva (State Services) Prelim",
    shortLabel: "GS Rajyaseva",
    durationMinutes: 120,
    description:
      "General Studies Paper I pattern for the MPSC Rajyaseva (State Services) preliminary exam. No aptitude section — heavier on Science, Polity and Current Affairs.",
    blueprint: {
      History: 15,
      Geography: 14,
      "Indian Polity": 16,
      Economics: 13,
      Science: 20,
      Environment: 7,
      "Current Affairs": 15,
    },
  },
  {
    id: "group-b",
    label: "GS Combine Group B Prelim",
    shortLabel: "GS Combine Group B",
    durationMinutes: 60,
    description:
      "General Studies + intelligence-test pattern for the MPSC Combine Group B preliminary exam, including an aptitude/reasoning section.",
    blueprint: {
      History: 12,
      Geography: 12,
      "Indian Polity": 14,
      Economics: 13,
      Science: 17,
      Environment: 1,
      Aptitude: 19,
      "Current Affairs": 12,
    },
  },
  {
    id: "group-c",
    label: "GS Combine Group C Prelim",
    shortLabel: "GS Combine Group C",
    durationMinutes: 60,
    description:
      "General Studies + intelligence-test pattern for the MPSC Combine Group C preliminary exam, including an aptitude/reasoning section.",
    blueprint: {
      History: 13,
      Geography: 12,
      "Indian Polity": 14,
      Economics: 13,
      Science: 15,
      Environment: 2,
      Aptitude: 18,
      "Current Affairs": 13,
    },
  },
];

export function getMockConfig(id: MockExamId): MockConfig | undefined {
  return MOCK_CONFIGS.find((c) => c.id === id);
}

export interface MockText {
  text: string;
  options: Record<OptionKey, string>;
  explanation: string;
}

export interface MockQuestion {
  /** Stable local key (1..N) used for answer state and display numbering. */
  key: number;
  questionId: string;
  category: Category;
  correctAnswer: OptionKey;
  english: MockText;
  /** Marathi version; null when unavailable (e.g. Current Affairs). */
  marathi: MockText | null;
  sourceTitle: string;
}

const VALID_KEYS: OptionKey[] = ["A", "B", "C", "D"];
const DEVANAGARI = /[\u0900-\u097F]/;

function isMarathiQuiz(q: Quiz): boolean {
  const lang = (q.language || "").toLowerCase();
  return lang === "marathi" || (q.title || "").toLowerCase().includes("मराठी");
}

/** A question is usable in a mock only if it is scorable and complete. */
function isUsable(q: Question | undefined): boolean {
  if (!q) return false;
  if (isQuestionCancelled(q)) return false;
  if (!q.text || !q.text.trim()) return false;
  const ca = q.correctAnswer;
  if (!ca || !VALID_KEYS.includes(ca)) return false;
  const opts = q.options || ({} as Record<OptionKey, string>);
  return VALID_KEYS.every((k) => (opts[k] || "").trim().length > 0);
}

/** True if the question genuinely contains Marathi (Devanagari) text. */
function hasDevanagari(q: Question): boolean {
  if (DEVANAGARI.test(q.text || "")) return true;
  const opts = q.options || ({} as Record<OptionKey, string>);
  return VALID_KEYS.some((k) => DEVANAGARI.test(opts[k] || ""));
}

/** Normalise a quiz id to a language-agnostic base key so EN/MR papers pair. */
function baseKey(id: string): string {
  return id
    .replace(/[-_](english|marathi|en|mr)$/i, "")
    .replace(/[-_](english|marathi|en|mr)[-_]/i, "-");
}

/** Fisher-Yates shuffle (returns a new array). */
export function shuffle<T>(input: T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function toText(q: Question): MockText {
  const opts = q.options || ({} as Record<OptionKey, string>);
  return {
    text: (q.text || "").replace(/\s+/g, " ").trim(),
    options: {
      A: (opts.A || "").trim(),
      B: (opts.B || "").trim(),
      C: (opts.C || "").trim(),
      D: (opts.D || "").trim(),
    },
    explanation: (q.explanation || "").trim(),
  };
}

interface PoolItem {
  id: string;
  category: Category;
  correctAnswer: OptionKey;
  english: MockText;
  marathi: MockText | null;
}

export interface BuildResult {
  questions: MockQuestion[];
  /** Subjects that could not be fully filled from the pool (shortfall info). */
  shortfalls: { category: Category; wanted: number; got: number }[];
}

/**
 * Build a bilingual mock test from the merged quiz catalog.
 */
export function buildMockTest(quizzes: Quiz[], config: MockConfig): BuildResult {
  // Pair each PYQ paper's English + Marathi versions by base key.
  const groups = new Map<string, { en?: Quiz; mr?: Quiz }>();
  for (const quiz of quizzes) {
    if (quiz.id === "__copyright__" || quiz.topicOnly) continue;
    if (quiz.examType && quiz.examType !== "MPSC") continue;
    const key = baseKey(quiz.id);
    const g = groups.get(key) || {};
    if (isMarathiQuiz(quiz)) g.mr = quiz;
    else g.en = quiz;
    groups.set(key, g);
  }

  // GS pool: English question paired with a genuine Marathi counterpart.
  const byCategory = new Map<Category, PoolItem[]>();
  for (const g of groups.values()) {
    if (!g.en || !g.mr) continue;
    const en = g.en.questions || [];
    const mr = g.mr.questions || [];
    for (let i = 0; i < en.length; i += 1) {
      const e = en[i];
      const m = mr[i];
      if (!e.category || e.category === "Current Affairs") continue;
      if (!isUsable(e)) continue;
      if (!isUsable(m) || !hasDevanagari(m)) continue;
      const list = byCategory.get(e.category) || [];
      list.push({
        id: e.id,
        category: e.category,
        correctAnswer: e.correctAnswer as OptionKey,
        english: toText(e),
        marathi: toText(m),
      });
      byCategory.set(e.category, list);
    }
  }

  // Current Affairs pool: GK Marathon only (English-only source).
  const marathon = quizzes.find((q) => q.id === GK_MARATHON_QUIZ_ID);
  const caPool: PoolItem[] = (marathon?.questions || [])
    .filter(isUsable)
    .map((q) => ({
      id: q.id,
      category: "Current Affairs" as Category,
      correctAnswer: q.correctAnswer as OptionKey,
      english: toText(q),
      marathi: null,
    }));

  const shortfalls: BuildResult["shortfalls"] = [];
  const picked: PoolItem[] = [];
  const usedIds = new Set<string>();

  for (const [cat, wantedRaw] of Object.entries(config.blueprint) as [Category, number][]) {
    const wanted = wantedRaw || 0;
    if (wanted <= 0) continue;
    const pool = cat === "Current Affairs" ? caPool : byCategory.get(cat) || [];
    const available = shuffle(pool).filter((item) => {
      if (usedIds.has(item.id)) return false;
      usedIds.add(item.id);
      return true;
    });
    const take = available.slice(0, wanted);
    picked.push(...take);
    if (take.length < wanted) shortfalls.push({ category: cat, wanted, got: take.length });
  }

  // Keep the real-paper subject order (blueprint order). Questions are already
  // randomised WITHIN each subject above; we do NOT shuffle across subjects, so
  // the paper flows History → … → Aptitude → Current Affairs like the original.
  const questions: MockQuestion[] = picked.map((item, idx) => ({
    key: idx + 1,
    questionId: item.id,
    category: item.category,
    correctAnswer: item.correctAnswer,
    english: item.english,
    marathi: item.marathi,
    sourceTitle:
      item.category === "Current Affairs"
        ? "GK 2025-26 Marathon"
        : "MPSC previous-year papers",
  }));

  return { questions, shortfalls };
}

export interface MockScore {
  total: number;
  answered: number;
  correct: number;
  wrong: number;
  skipped: number;
  /** correct - NEGATIVE_MARK * wrong */
  net: number;
  /** net as a percentage of total (can be negative; not clamped). */
  percent: number;
  bySubject: Array<{
    category: Category;
    total: number;
    correct: number;
    wrong: number;
    skipped: number;
  }>;
}

export function scoreMock(
  questions: MockQuestion[],
  answers: Record<number, OptionKey>,
): MockScore {
  let correct = 0;
  let wrong = 0;
  let skipped = 0;
  const subj = new Map<
    Category,
    { total: number; correct: number; wrong: number; skipped: number }
  >();

  for (const q of questions) {
    const s = subj.get(q.category) || { total: 0, correct: 0, wrong: 0, skipped: 0 };
    s.total += 1;
    const a = answers[q.key];
    if (!a) {
      skipped += 1;
      s.skipped += 1;
    } else if (a === q.correctAnswer) {
      correct += 1;
      s.correct += 1;
    } else {
      wrong += 1;
      s.wrong += 1;
    }
    subj.set(q.category, s);
  }

  const total = questions.length;
  const net = correct - NEGATIVE_MARK * wrong;
  const percent = total > 0 ? (net / total) * 100 : 0;

  return {
    total,
    answered: correct + wrong,
    correct,
    wrong,
    skipped,
    net,
    percent,
    bySubject: [...subj.entries()].map(([category, v]) => ({ category, ...v })),
  };
}
