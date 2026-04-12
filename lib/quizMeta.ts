import fs from "fs";
import path from "path";

interface RawQuiz {
  id: string;
  title: string;
  questions: { id: number; category?: string }[];
  language?: string;
}

export interface ExamPaper {
  title: string;
  year: number;
  type: string;
  questions: number;
  description: string;
}

export interface QuizMeta {
  exams: ExamPaper[];
  years: number[];
  totalQuestions: number;
  totalPapers: number;
  minYear: number;
  maxYear: number;
  subjects: { name: string; count: number }[];
  examTitles: string[];
}

function extractYear(title: string): number {
  const match = title.match(/\b(20\d{2})\b/);
  return match ? parseInt(match[1]) : 0;
}

function extractType(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("excise")) return "Sub Inspector Excise";
  if (t.includes("group b & c") || t.includes("group b and c"))
    return "Group B & C";
  if (t.includes("psi")) return "PSI";
  if (
    (t.includes("gazetted") || t.includes("राजपत्रित")) &&
    (t.includes("technical") || t.includes("तांत्रिक") || / ts /i.test(t))
  )
    return "Gazetted TS";
  if (
    (t.includes("gazetted") || t.includes("राजपत्रित")) &&
    (t.includes("civil") || /\bcs\b/i.test(t))
  )
    return "Gazetted CS";
  if (/group.?c/i.test(t) || t.includes("गट-क") || t.includes("गट क"))
    return "Group C";
  if (/group.?b/i.test(t) || t.includes("गट-ब") || t.includes("गट ब"))
    return "Group B";
  return "General";
}

function cleanTitle(title: string): string {
  return title
    .replace(/\s*\(English\)\s*/i, "")
    .replace(/\s*\(Marathi\)\s*/i, "")
    .replace(/\s*\(Set A\)\s*/i, "")
    .replace(/\s*\(मराठी\)\s*/i, "")
    .trim();
}

function generateDescription(title: string, qCount: number, type: string): string {
  const year = extractYear(title);
  const yearStr = year ? ` ${year}` : "";
  return `${cleanTitle(title)} — ${qCount} questions covering General Studies including Polity, History, Geography, Science, Economics, Current Affairs, and more.`;
}

const CATEGORY_MAP: Record<string, string> = {
  "current affairs": "Current Affairs",
  "science": "Science",
  "economics": "Economics",
  "history": "History",
  "geography": "Geography",
  "maharashtra": "Geography",
  "maharashtra geography": "Geography",
  "polity": "Indian Polity",
  "indian polity": "Indian Polity",
  "logical reasoning": "Aptitude",
  "aptitude": "Aptitude",
  "education": "Current Affairs",
  "art and culture": "History",
  "environment": "Environment",
  "english": "English",
  "marathi": "Marathi",
};

function normalizeCategory(cat: string): string {
  return CATEGORY_MAP[cat.toLowerCase()] || cat;
}

let _cache: QuizMeta | null = null;

export function getQuizMeta(): QuizMeta {
  if (_cache) return _cache;

  const filePath = path.join(process.cwd(), "public", "quizzes.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const quizzes: RawQuiz[] = (JSON.parse(raw) as RawQuiz[]).filter((q) => q.id !== "__copyright__");

  const englishQuizzes = quizzes.filter((q) => {
    const lang = (q.language || "").toLowerCase();
    const title = q.title.toLowerCase();
    return !title.includes("मराठी") && lang !== "marathi";
  });

  const exams: ExamPaper[] = englishQuizzes.map((q) => {
    const title = cleanTitle(q.title);
    const year = extractYear(q.title);
    const type = extractType(q.title);
    return {
      title,
      year,
      type,
      questions: q.questions.length,
      description: generateDescription(q.title, q.questions.length, type),
    };
  });

  exams.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));

  const years = [...new Set(exams.map((e) => e.year))].filter(Boolean).sort((a, b) => b - a);

  const totalQuestions = quizzes.reduce((s, q) => s + q.questions.length, 0);

  const subjectCounts: Record<string, number> = {};
  for (const q of quizzes) {
    for (const question of q.questions) {
      const cat = normalizeCategory(question.category || "General");
      subjectCounts[cat] = (subjectCounts[cat] || 0) + 1;
    }
  }
  const subjects = Object.entries(subjectCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  _cache = {
    exams,
    years,
    totalQuestions,
    totalPapers: exams.length,
    minYear: years[years.length - 1] || 0,
    maxYear: years[0] || 0,
    subjects,
    examTitles: exams.map((e) => e.title),
  };

  return _cache;
}
