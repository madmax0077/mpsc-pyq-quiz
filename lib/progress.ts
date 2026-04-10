const STORAGE_KEY = "mpsc-cat-progress";
const REPORTS_KEY = "mpsc-question-reports";

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

export function reportQuestion(questionId: string, questionText: string, reason: string) {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    const reports: Array<{ qId: string; text: string; reason: string; date: string }> = raw ? JSON.parse(raw) : [];
    if (reports.some((r) => r.qId === questionId)) return false;
    reports.push({ qId: questionId, text: questionText.slice(0, 100), reason, date: new Date().toISOString() });
    localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
    return true;
  } catch {
    return false;
  }
}

export function getReports() {
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
