export type OptionKey = "A" | "B" | "C" | "D";
export type Language = "english" | "marathi";

export const CATEGORIES = [
  "Indian Polity",
  "History",
  "Geography",
  "Science",
  "Current Affairs",
  "Economics",
  "Aptitude",
  "English",
  "Marathi",
  "Environment",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Question {
  id: string;
  text: string;
  /** Original paper number to display; when set, it is shown instead of the position index so numbering survives skipped/removed items. */
  number?: number;
  options: Record<OptionKey, string>;
  /** Absent when {@link cancelled} is true (MPSC dropped the item; no official key). */
  correctAnswer?: OptionKey;
  /** Official answer key X / dropped — not scored; do not mark any option correct. */
  cancelled?: boolean;
  explanation: string;
  imageUrl?: string;
  category?: Category;
  topic?: string;
  sourceTag?: string;
}

export type SubjectTopics = Record<string, string[]>;

export interface Quiz {
  id: string;
  title: string;
  createdAt: string;
  questions: Question[];
  language?: Language;
  tag?: string;
  topicOnly?: boolean;
  /**
   * Identifies the exam this quiz belongs to. Unset / "MPSC" means a regular
   * MPSC paper (default behaviour). Other values create separate exam sections
   * that are only visible inside their own dedicated home-page entry point
   * (e.g. "RTO_AMVI"). MPSC views explicitly exclude non-MPSC quizzes so the
   * subject/category breakdowns stay clean.
   */
  examType?: string;
  /** Optional subject grouping inside an exam section (e.g. "Automobile Engineering"). */
  subject?: string;
}

export type AppMode = "admin" | "student";

export interface ParsedQuestion {
  text: string;
  options: Record<OptionKey, string>;
  imageUrl?: string;
}

export interface Topic {
  id: string;
  name: string;
  description?: string;
  category: Category;
  questionIds: string[];
}
