const STORAGE_KEY = "mpsc-cat-progress";

export function getAttemptedIds(): Record<string, string[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function markAttempted(category: string, questionIds: string[]) {
  const data = getAttemptedIds();
  const existing = new Set(data[category] || []);
  for (const id of questionIds) existing.add(id);
  data[category] = Array.from(existing);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getCategoryProgress(category: string): number {
  const data = getAttemptedIds();
  return (data[category] || []).length;
}

/** Replace full attempted-id map (used by cloud sync merge). */
export function replaceAttemptedIds(data: Record<string, string[]>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data || {}));
  } catch {
    /* storage full */
  }
}
