import type { OptionKey, Question, Quiz } from "./types";

const ALL_KEYS: OptionKey[] = ["A", "B", "C", "D"];

function cell(v: unknown): string {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  return "";
}

/**
 * Coerce `options` to `Record<A|B|C|D, string>` so student/admin UIs always receive a stable shape.
 * Handles: 4-tuple arrays (common in JSON imports), A–D objects, lowercase keys, numeric indices, missing keys.
 */
export function normalizeQuestion(q: Question): Question {
  const o = q.options as unknown;
  const box: Record<OptionKey, string> = { A: "", B: "", C: "", D: "" };

  if (o == null) {
    return { ...q, options: box };
  }
  if (Array.isArray(o)) {
    for (let i = 0; i < 4; i++) box[ALL_KEYS[i]] = cell(o[i]);
    return { ...q, options: box };
  }
  if (typeof o === "object") {
    const rec = o as Record<string, unknown>;
    for (const k of ALL_KEYS) {
      const idx = ALL_KEYS.indexOf(k);
      const v = rec[k] ?? rec[k.toLowerCase()] ?? rec[String(idx)] ?? rec[idx];
      box[k] = cell(v);
    }
    return { ...q, options: box };
  }
  return { ...q, options: { ...box, A: cell(o) } };
}

export function normalizeQuiz(quiz: Quiz): Quiz {
  return {
    ...quiz,
    questions: Array.isArray(quiz.questions) ? quiz.questions.map(normalizeQuestion) : [],
  };
}

export function isQuestionCancelled(q: Question): boolean {
  return q.cancelled === true;
}

/** Raw option string (no placeholder); may be empty if the slot is unused. */
export function rawOptionString(q: Question, key: OptionKey): string {
  const raw = q.options as unknown;
  if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    const v = (raw as Record<string, unknown>)[key];
    return cell(v);
  }
  if (Array.isArray(raw)) {
    const i = key === "A" ? 0 : key === "B" ? 1 : key === "C" ? 2 : 3;
    return cell(raw[i]);
  }
  return "";
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
