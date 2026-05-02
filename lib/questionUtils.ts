import type { OptionKey, Question } from "./types";

export function isQuestionCancelled(q: Question): boolean {
  return q.cancelled === true;
}

/** Option text whether `options` is `Record<OptionKey, string>` or a 4-tuple array (legacy import). */
export function optionText(q: Question, key: OptionKey): string {
  const raw = q.options as unknown;
  if (Array.isArray(raw)) {
    const i = key === "A" ? 0 : key === "B" ? 1 : key === "C" ? 2 : 3;
    const v = raw[i];
    return typeof v === "string" && v.length > 0 ? v : `Option ${key}`;
  }
  if (raw && typeof raw === "object") {
    const v = (raw as Record<string, string>)[key];
    return v?.length ? v : `Option ${key}`;
  }
  return `Option ${key}`;
}

export function countScoredQuestions(questions: Question[]): number {
  return questions.filter((q) => !isQuestionCancelled(q)).length;
}
