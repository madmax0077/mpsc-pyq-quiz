import type { Quiz } from "./types";

export type MergeBundledOptions = {
  /** Bundled quiz ids to omit (admin export / local catalog only). */
  excludeBundledIds?: Set<string>;
};

/**
 * Merge bundled `quizzes.json` quizzes with localStorage quizzes.
 * Same id → **local wins** (admin edits / overrides).
 * Bundled-only ids stay; extra local-only ids are appended.
 */
export function mergeBundledAndLocal(bundled: Quiz[], local: Quiz[], options?: MergeBundledOptions): Quiz[] {
  const skip = options?.excludeBundledIds;
  const bundledIn = skip?.size ? bundled.filter((b) => !skip.has(b.id)) : bundled;
  const localById = new Map(local.map((q) => [q.id, q]));
  const bundledIds = new Set(bundledIn.map((q) => q.id));
  const merged: Quiz[] = [];
  for (const b of bundledIn) {
    merged.push(localById.get(b.id) ?? b);
  }
  for (const q of local) {
    if (!bundledIds.has(q.id)) merged.push(q);
  }
  return merged;
}
