import fs from "node:fs";
import path from "node:path";
import type { Quiz, Question } from "@/lib/types";
import {
  cleanTitle,
  extractType,
  extractYear,
  normalizeCategory,
} from "@/lib/quizMeta";

/**
 * Per-paper landing-page data.
 *
 * Each MPSC paper is stored in `public/quizzes.json` as a pair of quizzes:
 * an English quiz and its Marathi mirror. This module groups that pair into a
 * single "exam paper" with a stable URL slug, a subject breakdown and a few
 * sample questions, so `/exams/[slug]` can render a rich, indexable landing
 * page per paper.
 */

export interface ExamSample {
  id: string;
  number?: number;
  text: string;
  options: Question["options"];
  correctAnswer?: Question["correctAnswer"];
  explanation?: string;
  category?: string;
  topic?: string;
  cancelled?: boolean;
}

export interface ExamPaperDetail {
  slug: string;
  /** Cleaned, human title (no language / Set A markers). */
  title: string;
  /** Raw English quiz title (kept for metadata). */
  enTitle: string;
  year: number;
  type: string;
  enQuizId: string;
  mrQuizId?: string;
  hasMarathi: boolean;
  questionCount: number;
  cancelledCount: number;
  subjects: { name: string; count: number }[];
  topics: { name: string; count: number }[];
  samples: ExamSample[];
}

/** Strip a trailing language marker from a quiz id. */
function baseId(id: string): string {
  return id.replace(/[_-](english|marathi|en|mr)$/i, "");
}

/** Stable, URL-friendly slug for a paper, derived from its English quiz id. */
export function slugForQuizId(englishQuizId: string): string {
  return baseId(englishQuizId).replace(/_/g, "-").toLowerCase();
}

function isMarathi(q: Quiz): boolean {
  const lang = (q.language || "").toLowerCase();
  return lang === "marathi" || q.title.toLowerCase().includes("मराठी");
}

const SAMPLE_COUNT = 6;

let _cache: ExamPaperDetail[] | null = null;

export function getExamPapers(): ExamPaperDetail[] {
  if (_cache) return _cache;

  const file = path.join(process.cwd(), "public", "quizzes.json");
  const quizzes = (JSON.parse(fs.readFileSync(file, "utf8")) as Quiz[]).filter(
    (q) => q.id !== "__copyright__" && !q.topicOnly,
  );

  const englishQuizzes = quizzes.filter((q) => !isMarathi(q));
  const marathiQuizzes = quizzes.filter((q) => isMarathi(q));
  const mrByBase = new Map<string, Quiz>();
  for (const q of marathiQuizzes) mrByBase.set(baseId(q.id), q);

  const usedSlugs = new Set<string>();
  const papers: ExamPaperDetail[] = englishQuizzes.map((en) => {
    let slug = slugForQuizId(en.id);
    // Guarantee uniqueness even if two ids normalise to the same slug.
    if (usedSlugs.has(slug)) slug = en.id.replace(/_/g, "-").toLowerCase();
    usedSlugs.add(slug);

    const mr = mrByBase.get(baseId(en.id));
    const questions = en.questions || [];

    const subjectCounts: Record<string, number> = {};
    const topicCounts: Record<string, number> = {};
    for (const q of questions) {
      const cat = normalizeCategory(q.category || "General");
      subjectCounts[cat] = (subjectCounts[cat] || 0) + 1;
      if (q.topic) topicCounts[q.topic] = (topicCounts[q.topic] || 0) + 1;
    }

    const samples: ExamSample[] = questions
      .filter(
        (q) =>
          !q.cancelled &&
          q.text &&
          Object.values(q.options || {}).filter((v) => v?.trim()).length >= 4,
      )
      .sort((a, b) => (a.number ?? 0) - (b.number ?? 0))
      .slice(0, SAMPLE_COUNT)
      .map((q) => ({
        id: q.id,
        number: q.number,
        text: q.text.replace(/\s+/g, " ").trim(),
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: (q.explanation || "").trim() || undefined,
        category: q.category,
        topic: q.topic,
        cancelled: q.cancelled,
      }));

    return {
      slug,
      title: cleanTitle(en.title),
      enTitle: en.title,
      year: extractYear(en.title),
      type: extractType(en.title),
      enQuizId: en.id,
      mrQuizId: mr?.id,
      hasMarathi: Boolean(mr),
      questionCount: questions.length,
      cancelledCount: questions.filter((q) => q.cancelled).length,
      subjects: Object.entries(subjectCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      topics: Object.entries(topicCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count),
      samples,
    };
  });

  papers.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
  _cache = papers;
  return papers;
}

export function getExamPaper(slug: string): ExamPaperDetail | undefined {
  return getExamPapers().find((p) => p.slug === slug);
}

/** Map of clean title -> slug, used by the /exams list to link each card. */
export function getSlugByTitle(): Map<string, string> {
  return new Map(getExamPapers().map((p) => [p.title, p.slug]));
}
