import type { OptionKey, Question, Quiz } from "./types";
import { isQuestionCancelled } from "./questionUtils";
import { shuffle, type MockQuestion, type MockText } from "./mockTest";

/**
 * RTO AMVI Mains mock — mirrors the 2020 booklet pattern:
 *   Q1–120   Common (Mechanical & Automobile)
 *   Q121–150 One optional branch (Mechanical OR Automobile) — 30 Q
 * Candidate answers 150 questions in 90 minutes (300 marks).
 * Questions are mixed from all RTO_AMVI papers on the site.
 */

export type RtoBranch = "mechanical" | "automobile";

export const RTO_MOCK_TOTAL = 150;
export const RTO_MOCK_COMMON = 120;
export const RTO_MOCK_BRANCH = 30;
export const RTO_MOCK_DURATION_MIN = 90;
/** 2020 paper: 300 marks / 150 questions. */
export const RTO_MARKS_PER_QUESTION = 2;

export const RTO_SECTION_COMMON = "Mechanical & Automobile";
export const RTO_SECTION_MECH = "Mechanical Engineering";
export const RTO_SECTION_AUTO = "Automobile Engineering";

const VALID_KEYS: OptionKey[] = ["A", "B", "C", "D"];

export interface RtoMockConfig {
  id: "rto-amvi-mains";
  label: string;
  shortLabel: string;
  durationMinutes: number;
  description: string;
  totalQuestions: number;
  marksPerQuestion: number;
  branch: RtoBranch;
}

export function makeRtoMockConfig(branch: RtoBranch): RtoMockConfig {
  const branchLabel =
    branch === "mechanical" ? "Mechanical Engineering" : "Automobile Engineering";
  return {
    id: "rto-amvi-mains",
    label: `RTO AMVI Mains Mock (2020 pattern) — ${branchLabel}`,
    shortLabel: `RTO AMVI · ${branch === "mechanical" ? "Mech" : "Auto"}`,
    durationMinutes: RTO_MOCK_DURATION_MIN,
    description:
      "150 questions · 90 minutes · 300 marks. Pattern matches RTO AMVI Mains 2020: 120 common Mechanical & Automobile questions plus 30 from your chosen branch. Mixed from all RTO AMVI papers on this site (cancelled items excluded). English paper.",
    totalQuestions: RTO_MOCK_TOTAL,
    marksPerQuestion: RTO_MARKS_PER_QUESTION,
    branch,
  };
}

function isUsable(q: Question | undefined): boolean {
  if (!q) return false;
  if (isQuestionCancelled(q)) return false;
  if (!q.text || !q.text.trim()) return false;
  const ca = q.correctAnswer;
  if (!ca || !VALID_KEYS.includes(ca)) return false;
  const opts = q.options || ({} as Record<OptionKey, string>);
  return VALID_KEYS.every((k) => (opts[k] || "").trim().length > 0);
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

/** Map a question into one of the three 2020-style sections. */
export function rtoSectionFor(quiz: Quiz, q: Question): string | null {
  const cat = (q.category || "").trim();
  if (cat === RTO_SECTION_COMMON || cat === RTO_SECTION_MECH || cat === RTO_SECTION_AUTO) {
    return cat;
  }
  // Legacy automobile-only papers (2002/2003/2005) have no category.
  if ((quiz.id || "").startsWith("rto-amvi-auto-engg-")) {
    return RTO_SECTION_AUTO;
  }
  // Fall back using original paper numbering when present (mains booklets).
  const n = q.number;
  if (typeof n === "number" && n >= 1) {
    if (n <= 120) return RTO_SECTION_COMMON;
    if (n <= 150) return RTO_SECTION_MECH;
    if (n <= 180) return RTO_SECTION_AUTO;
  }
  return null;
}

interface PoolItem {
  id: string;
  section: string;
  correctAnswer: OptionKey;
  english: MockText;
  sourceTitle: string;
}

export interface RtoBuildResult {
  questions: MockQuestion[];
  shortfalls: { section: string; wanted: number; got: number }[];
}

export function buildRtoMockTest(quizzes: Quiz[], branch: RtoBranch): RtoBuildResult {
  const pools: Record<string, PoolItem[]> = {
    [RTO_SECTION_COMMON]: [],
    [RTO_SECTION_MECH]: [],
    [RTO_SECTION_AUTO]: [],
  };

  for (const quiz of quizzes) {
    if (quiz.id === "__copyright__") continue;
    if (quiz.examType !== "RTO_AMVI") continue;
    const title = quiz.title || quiz.id;
    for (const q of quiz.questions || []) {
      if (!isUsable(q)) continue;
      const section = rtoSectionFor(quiz, q);
      if (!section || !pools[section]) continue;
      pools[section].push({
        id: q.id,
        section,
        correctAnswer: q.correctAnswer as OptionKey,
        english: toText(q),
        sourceTitle: title,
      });
    }
  }

  const branchSection =
    branch === "mechanical" ? RTO_SECTION_MECH : RTO_SECTION_AUTO;
  const plan: Array<{ section: string; wanted: number }> = [
    { section: RTO_SECTION_COMMON, wanted: RTO_MOCK_COMMON },
    { section: branchSection, wanted: RTO_MOCK_BRANCH },
  ];

  const shortfalls: RtoBuildResult["shortfalls"] = [];
  const picked: PoolItem[] = [];
  const usedIds = new Set<string>();

  for (const { section, wanted } of plan) {
    const available = shuffle(pools[section] || []).filter((item) => {
      if (usedIds.has(item.id)) return false;
      usedIds.add(item.id);
      return true;
    });
    const take = available.slice(0, wanted);
    picked.push(...take);
    if (take.length < wanted) {
      shortfalls.push({ section, wanted, got: take.length });
    }
  }

  // Single subject label for scorecard / UI — no Mech vs Auto segregation in results.
  const displayCategory = "Mechanical & Automobile Engineering";

  const questions: MockQuestion[] = picked.map((item, idx) => ({
    key: idx + 1,
    questionId: item.id,
    category: displayCategory,
    correctAnswer: item.correctAnswer,
    english: item.english,
    marathi: null,
    sourceTitle: item.sourceTitle,
  }));

  return { questions, shortfalls };
}
