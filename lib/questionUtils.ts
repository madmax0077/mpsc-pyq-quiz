import type { OptionKey, Question } from "./types";

const ALL_KEYS: OptionKey[] = ["A", "B", "C", "D"];

export function isQuestionCancelled(q: Question): boolean {
  return q.cancelled === true;
}

/** Raw option string (no placeholder); may be empty if the slot is unused. */
export function rawOptionString(q: Question, key: OptionKey): string {
  const raw = q.options as unknown;
  if (Array.isArray(raw)) {
    const i = key === "A" ? 0 : key === "B" ? 1 : key === "C" ? 2 : 3;
    const v = raw[i];
    return typeof v === "string" ? v : "";
  }
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const v = (raw as Record<string, string>)[key];
    return typeof v === "string" ? v : "";
  }
  return "";
}

export function hasOptionContent(q: Question, key: OptionKey): boolean {
  return rawOptionString(q, key).trim().length > 0;
}

/** Keys A–D that have non-empty option text (for 2-option booklet items, etc.). Falls back to all four if none set (legacy safety). */
export function visibleOptionKeys(q: Question): OptionKey[] {
  const keys = ALL_KEYS.filter((k) => hasOptionContent(q, k));
  return keys.length > 0 ? keys : ALL_KEYS;
}

/** Option text whether `options` is `Record<OptionKey, string>` or a 4-tuple array (legacy import). */
export function optionText(q: Question, key: OptionKey): string {
  const raw = rawOptionString(q, key);
  const s = raw.trim();
  if (s.length > 0) return s;
  return `Option ${key}`;
}

export function countScoredQuestions(questions: Question[]): number {
  return questions.filter((q) => !isQuestionCancelled(q)).length;
}
