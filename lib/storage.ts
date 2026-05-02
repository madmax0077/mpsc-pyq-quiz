import { Quiz, Topic, SubjectTopics } from "./types";
import { normalizeQuiz } from "./questionUtils";

const STORAGE_KEY = "mcq_quiz_app_quizzes";
const MIGRATION_KEY = "mcq_migration_gk_to_ca";
const MIGRATION_KEY_POLITY = "mcq_migration_polity_to_indian_polity";

function migrateGKtoCurrentAffairs(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(MIGRATION_KEY)) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const updated = raw.replace(/"category"\s*:\s*"GK"/g, '"category":"Current Affairs"');
      if (updated !== raw) localStorage.setItem(STORAGE_KEY, updated);
    }
    localStorage.setItem(MIGRATION_KEY, "1");
  } catch { /* ignore */ }
}

function migratePolityToIndianPolity(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(MIGRATION_KEY_POLITY)) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const updated = raw.replace(/"category"\s*:\s*"Polity"/g, '"category":"Indian Polity"');
      if (updated !== raw) localStorage.setItem(STORAGE_KEY, updated);
    }
    localStorage.setItem(MIGRATION_KEY_POLITY, "1");
  } catch { /* ignore */ }
}

export function saveQuiz(quiz: Quiz): void {
  const quizzes = getAllQuizzes();
  const nq = normalizeQuiz(quiz);
  const idx = quizzes.findIndex((q) => q.id === nq.id);
  if (idx >= 0) {
    quizzes[idx] = nq;
  } else {
    quizzes.push(nq);
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
  } catch {
    console.error("Failed to save quiz — localStorage may be full.");
  }
}

export function getAllQuizzes(): Quiz[] {
  if (typeof window === "undefined") return [];
  migrateGKtoCurrentAffairs();
  migratePolityToIndianPolity();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeQuiz);
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
    const nq = normalizeQuiz(quiz);
    if (existingIds.has(quiz.id)) {
      const idx = existing.findIndex((q) => q.id === quiz.id);
      existing[idx] = nq;
    } else {
      existing.push(nq);
      added++;
    }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  return added;
}

// ---- Topic management ----
const TOPICS_KEY = "mcq_topics";

export function getAllTopics(): Topic[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(TOPICS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveTopic(topic: Topic): void {
  const topics = getAllTopics();
  const idx = topics.findIndex((t) => t.id === topic.id);
  if (idx >= 0) {
    topics[idx] = topic;
  } else {
    topics.push(topic);
  }
  try {
    localStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
  } catch {
    console.error("Failed to save topic.");
  }
}

export function deleteTopic(id: string): void {
  const topics = getAllTopics().filter((t) => t.id !== id);
  try {
    localStorage.setItem(TOPICS_KEY, JSON.stringify(topics));
  } catch {
    console.error("Failed to delete topic.");
  }
}

// ---- Subject-topic registry (tag-based topics per subject) ----
const SUBJECT_TOPICS_KEY = "mcq_subject_topics";

export function getSubjectTopics(): SubjectTopics {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SUBJECT_TOPICS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return {};
    return parsed;
  } catch {
    return {};
  }
}

export function saveSubjectTopics(topics: SubjectTopics): void {
  try {
    localStorage.setItem(SUBJECT_TOPICS_KEY, JSON.stringify(topics));
  } catch {
    console.error("Failed to save subject topics.");
  }
}
