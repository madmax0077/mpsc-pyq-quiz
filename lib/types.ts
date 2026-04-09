export type OptionKey = "A" | "B" | "C" | "D";

export const CATEGORIES = [
  "Polity",
  "History",
  "Geography",
  "Science",
  "GK",
  "Economics",
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
}

export interface Quiz {
  id: string;
  title: string;
  createdAt: string;
  questions: Question[];
}

export type AppMode = "admin" | "student";

export interface ParsedQuestion {
  text: string;
  options: Record<OptionKey, string>;
  imageUrl?: string;
}
