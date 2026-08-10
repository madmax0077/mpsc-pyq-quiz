const KEY = "mcq_streak";

export interface StreakData {
  lastDate: string;
  count: number;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function load(): StreakData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return { lastDate: "", count: 0 };
}

function save(data: StreakData) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function recordStreak(): void {
  if (typeof window === "undefined") return;
  const data = load();
  const t = today();
  if (data.lastDate === t) return;
  if (data.lastDate === yesterday()) {
    data.count += 1;
  } else {
    data.count = 1;
  }
  data.lastDate = t;
  save(data);
}

export function getStreak(): number {
  if (typeof window === "undefined") return 0;
  const data = load();
  const t = today();
  if (data.lastDate === t || data.lastDate === yesterday()) return data.count;
  return 0;
}

export function getStreakData(): StreakData {
  if (typeof window === "undefined") return { lastDate: "", count: 0 };
  return load();
}

export function setStreakData(data: StreakData): void {
  if (typeof window === "undefined") return;
  save({
    lastDate: typeof data?.lastDate === "string" ? data.lastDate : "",
    count: typeof data?.count === "number" && data.count > 0 ? data.count : 0,
  });
}
