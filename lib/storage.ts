import { Quiz } from "./types";

const STORAGE_KEY = "mcq_quiz_app_quizzes";

export function saveQuiz(quiz: Quiz): void {
  const quizzes = getAllQuizzes();
  const idx = quizzes.findIndex((q) => q.id === quiz.id);
  if (idx >= 0) {
    quizzes[idx] = quiz;
  } else {
    quizzes.push(quiz);
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
  } catch {
    console.error("Failed to save quiz — localStorage may be full.");
  }
}

export function getAllQuizzes(): Quiz[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    console.error("Failed to read quizzes from localStorage.");
    return [];
  }
}

export function getQuizById(id: string): Quiz | undefined {
  return getAllQuizzes().find((q) => q.id === id);
}

export function deleteQuiz(id: string): void {
  const quizzes = getAllQuizzes().filter((q) => q.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
  } catch {
    console.error("Failed to update localStorage after delete.");
  }
}

/**
 * Export all quizzes as a JSON string for backup.
 */
export function exportQuizzes(): string {
  return JSON.stringify(getAllQuizzes(), null, 2);
}

/**
 * Import quizzes from a JSON string, merging with existing data.
 * Returns the number of quizzes imported.
 */
export function importQuizzes(json: string): number {
  const incoming: Quiz[] = JSON.parse(json);
  if (!Array.isArray(incoming)) throw new Error("Invalid format");
  const existing = getAllQuizzes();
  const existingIds = new Set(existing.map((q) => q.id));
  let added = 0;
  for (const quiz of incoming) {
    if (!quiz.id || !quiz.title || !Array.isArray(quiz.questions)) continue;
    if (existingIds.has(quiz.id)) {
      const idx = existing.findIndex((q) => q.id === quiz.id);
      existing[idx] = quiz;
    } else {
      existing.push(quiz);
      added++;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  return added;
}
