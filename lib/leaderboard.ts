/**
 * Today's-leaders Firestore module.
 *
 * Data model: each quiz attempt by a signed-in user is one document in the
 * `leaderboard` collection (the LeaderboardEntry below). The board aggregates
 * those raw entries client-side into per-user daily totals (LeaderboardRow):
 * each user's score on the board is sum(correct) / sum(attempted) across ALL
 * their submissions today, expressed as a percentage. As the user takes more
 * tests, their aggregate naturally updates.
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

/** A single quiz-attempt document as stored in Firestore. */
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

/** A per-user daily aggregate row computed client-side from LeaderboardEntry[]. */
export interface LeaderboardRow {
  userId: string;
  displayName: string;
  photoURL: string | null;
  /** Sum of correct answers across ALL of today's attempts. */
  totalScore: number;
  /** Sum of attempted (non-cancelled) questions across ALL of today's attempts. */
  totalQuestions: number;
  /** Aggregate score percentage: round(totalScore / totalQuestions * 100). */
  scorePct: number;
  /** How many quiz attempts the user submitted today. */
  attemptCount: number;
  /** Most recent quiz title (for display context). */
  latestQuizTitle: string;
  /** Earliest submission millis (used for tie-break). */
  earliestAt: number;
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
 * snapshot, AGGREGATED per user (sum-of-correct over sum-of-attempted) and
 * sorted by aggregate score percentage. The callback fires whenever any user
 * adds a new attempt today, so live aggregates update automatically.
 *
 * Tie-break: scorePct desc → totalQuestions desc → earliest submission asc.
 *
 * Implementation note: we deliberately use a single-field equality filter
 * (no orderBy on a different field) so Firestore can serve this with the
 * auto-created index — no composite index is required. Sorting and limiting
 * happen client-side. A safety limit caps the daily fetch so the snapshot
 * stays small even if traffic grows.
 */
export function subscribeTodayLeaderboard(
  callback: (rows: LeaderboardRow[]) => void,
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
      callback(aggregatePerUser(all));
    },
    (err) => {
      console.warn("subscribeTodayLeaderboard:", err);
      onError?.(err);
      callback([]);
    },
  );
}

/**
 * Aggregate a flat list of today's attempts into one row per user.
 *
 * Rules:
 *   - totalScore     = Σ score over the user's attempts today
 *   - totalQuestions = Σ total over the user's attempts today
 *   - scorePct       = round(totalScore / totalQuestions × 100)
 *   - attemptCount   = number of attempts today
 *   - displayName / photoURL come from the most recent attempt (so renames
 *     and avatar changes stick)
 *   - latestQuizTitle = title of the most recent attempt (display context)
 *
 * Sort: scorePct desc → totalQuestions desc → earliestAt asc.
 */
function aggregatePerUser(entries: LeaderboardEntry[]): LeaderboardRow[] {
  type Acc = LeaderboardRow & { latestAt: number };
  const byUser = new Map<string, Acc>();

  for (const e of entries) {
    const ts = e.createdAt?.toMillis() ?? Number.POSITIVE_INFINITY;
    const existing = byUser.get(e.userId);
    if (!existing) {
      byUser.set(e.userId, {
        userId: e.userId,
        displayName: e.displayName,
        photoURL: e.photoURL,
        totalScore: e.score,
        totalQuestions: e.total,
        scorePct: 0, // recomputed at the end
        attemptCount: 1,
        latestQuizTitle: e.quizTitle,
        earliestAt: ts,
        latestAt: ts,
      });
      continue;
    }
    existing.totalScore += e.score;
    existing.totalQuestions += e.total;
    existing.attemptCount += 1;
    if (ts < existing.earliestAt) existing.earliestAt = ts;
    if (ts > existing.latestAt) {
      existing.latestAt = ts;
      existing.displayName = e.displayName;
      existing.photoURL = e.photoURL;
      existing.latestQuizTitle = e.quizTitle;
    }
  }

  const rows: LeaderboardRow[] = [];
  for (const acc of byUser.values()) {
    const scorePct =
      acc.totalQuestions > 0
        ? Math.round((acc.totalScore / acc.totalQuestions) * 100)
        : 0;
    rows.push({
      userId: acc.userId,
      displayName: acc.displayName,
      photoURL: acc.photoURL,
      totalScore: acc.totalScore,
      totalQuestions: acc.totalQuestions,
      scorePct,
      attemptCount: acc.attemptCount,
      latestQuizTitle: acc.latestQuizTitle,
      earliestAt: acc.earliestAt,
    });
  }

  rows.sort((a, b) => {
    if (a.scorePct !== b.scorePct) return b.scorePct - a.scorePct;
    if (a.totalQuestions !== b.totalQuestions) return b.totalQuestions - a.totalQuestions;
    return a.earliestAt - b.earliestAt;
  });
  return rows;
}
