/**
 * Today's-leaders Firestore module.
 *
 * Data model: each quiz attempt by a signed-in user is one document in the
 * `leaderboard` collection. The board displays only TODAY's entries (IST day
 * boundary), and ranks each user by their BEST attempt of the day.
 *
 * Required Firestore rules — see firestore.rules.
 */
import {
  addDoc,
  collection,
  limit,
  onSnapshot,
  query,
  serverTimestamp,
  where,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION = "leaderboard";

/** Day partition key: YYYY-MM-DD in Asia/Kolkata (IST), same boundary for all users. */
export function todayKey(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  displayName: string;
  photoURL: string | null;
  quizId: string;
  quizTitle: string;
  score: number;
  total: number;
  /** 0..100, integer percentage */
  scorePct: number;
  dateKey: string;
  createdAt: Timestamp | null;
}

export interface SubmitScoreArgs {
  userId: string;
  displayName: string | null;
  photoURL: string | null;
  quizId: string;
  quizTitle: string;
  score: number;
  total: number;
}

/**
 * Append a quiz attempt to the leaderboard. Safe to call from
 * non-signed-in flows — caller checks `userId`. Errors are swallowed
 * (logged) so they never block the user's quiz UX.
 */
export async function submitScore(args: SubmitScoreArgs): Promise<"ok" | "skipped" | "error"> {
  try {
    if (!args.userId) return "skipped";
    if (!args.quizId || args.total <= 0) return "skipped";
    const score = Math.max(0, Math.min(args.score, args.total));
    const scorePct = Math.round((score / args.total) * 100);
    await addDoc(collection(db, COLLECTION), {
      userId: args.userId,
      displayName: (args.displayName || "Aspirant").slice(0, 60),
      photoURL: args.photoURL || null,
      quizId: args.quizId,
      quizTitle: (args.quizTitle || "").slice(0, 200),
      score,
      total: args.total,
      scorePct,
      dateKey: todayKey(),
      createdAt: serverTimestamp(),
    });
    return "ok";
  } catch (e) {
    console.warn("submitScore failed:", e);
    return "error";
  }
}

/**
 * Subscribe to today's leaderboard. The callback receives the COMPLETE current
 * snapshot (sorted, deduped per-user with each user's best attempt) every time
 * the collection updates.
 *
 * Tie-break: scorePct desc → total desc → createdAt asc (earlier wins).
 *
 * Implementation note: we deliberately use a single-field equality filter
 * (no orderBy on a different field) so Firestore can serve this with the
 * auto-created index — no composite index is required. Sorting and limiting
 * happen client-side. A safety limit caps the daily fetch so the snapshot
 * stays small even if traffic grows.
 */
export function subscribeTodayLeaderboard(
  callback: (entries: LeaderboardEntry[]) => void,
  onError?: (err: Error) => void,
): () => void {
  const q = query(
    collection(db, COLLECTION),
    where("dateKey", "==", todayKey()),
    limit(1000),
  );
  return onSnapshot(
    q,
    (snap) => {
      const all: LeaderboardEntry[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<LeaderboardEntry, "id">),
      }));
      callback(dedupeBestPerUser(all));
    },
    (err) => {
      console.warn("subscribeTodayLeaderboard:", err);
      onError?.(err);
      callback([]);
    },
  );
}

/**
 * For each userId keep a single entry — their BEST attempt of the day.
 * Ranking: scorePct desc → total desc → createdAt asc.
 */
function dedupeBestPerUser(entries: LeaderboardEntry[]): LeaderboardEntry[] {
  const best = new Map<string, LeaderboardEntry>();
  for (const e of entries) {
    const prev = best.get(e.userId);
    if (!prev || isBetter(e, prev)) best.set(e.userId, e);
  }
  return Array.from(best.values()).sort((a, b) => (isBetter(a, b) ? -1 : isBetter(b, a) ? 1 : 0));
}

function isBetter(a: LeaderboardEntry, b: LeaderboardEntry): boolean {
  if (a.scorePct !== b.scorePct) return a.scorePct > b.scorePct;
  if (a.total !== b.total) return a.total > b.total;
  const at = a.createdAt?.toMillis() ?? Number.POSITIVE_INFINITY;
  const bt = b.createdAt?.toMillis() ?? Number.POSITIVE_INFINITY;
  return at < bt;
}
