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
  options: Record<OptionKey, string>;
  correctAnswer: OptionKey;
  explanation: string;
  imageUrl?: string;
  category?: Category;
  sourceTag?: string;
}

export interface Quiz {
  id: string;
  title: string;
  createdAt: string;
  questions: Question[];
  language?: Language;
  tag?: string;
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
