import fs from "node:fs";
import path from "node:path";
import type { Quiz, Question } from "@/lib/types";

export type SeoQuestion = {
  id: string;
  text: string;
  options: Question["options"];
  correctAnswer?: Question["correctAnswer"];
  category?: Question["category"];
  topic?: string;
  quizId: string;
  quizTitle: string;
  language?: Quiz["language"];
};

let cache: SeoQuestion[] | null = null;

function plainText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function getSeoQuestions(): SeoQuestion[] {
  if (cache) return cache;
  const file = path.join(process.cwd(), "public", "quizzes.json");
  const quizzes = JSON.parse(fs.readFileSync(file, "utf8")) as Quiz[];
  const seen = new Set<string>();
  cache = [];
  for (const quiz of quizzes) {
    if (quiz.id === "__copyright__") continue;
    for (const question of quiz.questions || []) {
      const id = String(question.id || "");
      if (!id || question.cancelled || seen.has(id)) continue;
      const optionValues = Object.values(question.options || {});
      if (!question.text || optionValues.length < 4 || optionValues.some((value) => !value?.trim())) continue;
      seen.add(id);
      cache.push({
        id,
        text: plainText(question.text),
        options: question.options,
        correctAnswer: question.correctAnswer,
        category: question.category,
        topic: question.topic,
        quizId: quiz.id,
        quizTitle: quiz.title,
        language: quiz.language,
      });
    }
  }
  return cache;
}

export function getSeoQuestion(id: string): SeoQuestion | undefined {
  return getSeoQuestions().find((question) => question.id === id);
}
