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
  onSnapshot,
  query,
  serverTimestamp,
  where,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION = "leaderboard";

/**
 * How long an idle day-stream stays open before it is torn down. Navigating
 * away and back, or React re-running an effect, then reuses the open listener
 * instead of paying to read the day again.
 */
const STREAM_GRACE_MS = 60_000;

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
 * auto-created index — no composite index is required. Sorting happens
 * client-side after aggregating. All attempts for the day are fetched (no
 * hard cap) so busy days are not truncated at 1000 rows.
 */
export function subscribeTodayLeaderboard(
  callback: (rows: LeaderboardRow[]) => void,
  onError?: (err: Error) => void,
): () => void {
  return subscribeLeaderboardByDate(todayKey(), callback, onError);
}

/**
 * Admin-only: subscribe to the AGGREGATED leaderboard for an arbitrary day
 * (YYYY-MM-DD in IST). Returns the full ranked list (not just the top five
 * the aspirant UI shows). Same Firestore query shape as the aspirant
 * subscription so no new index is required.
 */
export function subscribeLeaderboardByDate(
  dateKey: string,
  callback: (rows: LeaderboardRow[]) => void,
  onError?: (err: Error) => void,
): () => void {
  return subscribeDayEntries(dateKey, (entries) => callback(aggregatePerUser(entries)), onError);
}

/**
 * Admin-only: subscribe to the RAW per-attempt entries for an arbitrary day
 * (YYYY-MM-DD in IST). Unlike the aggregated view, each entry corresponds to
 * one quiz submission, so the admin can drill into "which quiz did this user
 * take and when".
 */
export function subscribeAttemptsByDate(
  dateKey: string,
  callback: (entries: LeaderboardEntry[]) => void,
  onError?: (err: Error) => void,
): () => void {
  return subscribeDayEntries(dateKey, callback, onError);
}

/* ── Shared per-day streams ──────────────────────────────────────────────
 * Firestore bills one document read per matching document each time a
 * listener attaches, so two components asking for the same day separately
 * pay for that day twice. These streams keep at most one listener per day
 * and fan its snapshots out to every subscriber, which makes a duplicate
 * subscription free.
 */

type EntriesListener = (entries: LeaderboardEntry[]) => void;
type ErrorListener = (err: Error) => void;

interface DayStream {
  /** Latest snapshot, or null until the first one arrives. */
  entries: LeaderboardEntry[] | null;
  listeners: Set<EntriesListener>;
  errorListeners: Set<ErrorListener>;
  detach: () => void;
  idleTimer: ReturnType<typeof setTimeout> | null;
}

const dayStreams = new Map<string, DayStream>();

function openDayStream(dateKey: string): DayStream {
  const open = dayStreams.get(dateKey);
  if (open) {
    if (open.idleTimer) {
      clearTimeout(open.idleTimer);
      open.idleTimer = null;
    }
    return open;
  }

  const stream: DayStream = {
    entries: null,
    listeners: new Set(),
    errorListeners: new Set(),
    detach: () => {},
    idleTimer: null,
  };
  dayStreams.set(dateKey, stream);

  stream.detach = onSnapshot(
    query(collection(db, COLLECTION), where("dateKey", "==", dateKey)),
    (snap) => {
      const entries: LeaderboardEntry[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<LeaderboardEntry, "id">),
      }));
      stream.entries = entries;
      for (const listener of [...stream.listeners]) listener(entries);
    },
    (err) => {
      console.warn("leaderboard day stream:", dateKey, err);
      stream.entries = [];
      for (const listener of [...stream.errorListeners]) listener(err);
      for (const listener of [...stream.listeners]) listener([]);
    },
  );

  return stream;
}

function subscribeDayEntries(
  dateKey: string,
  onEntries: EntriesListener,
  onError?: ErrorListener,
): () => void {
  const stream = openDayStream(dateKey);
  stream.listeners.add(onEntries);
  if (onError) stream.errorListeners.add(onError);

  // A later subscriber is served the snapshot already in hand, at no cost.
  if (stream.entries) onEntries(stream.entries);

  let released = false;
  return () => {
    if (released) return;
    released = true;
    stream.listeners.delete(onEntries);
    if (onError) stream.errorListeners.delete(onError);
    if (stream.listeners.size > 0 || stream.idleTimer) return;

    stream.idleTimer = setTimeout(() => {
      if (stream.listeners.size > 0) return; // someone re-subscribed meanwhile
      stream.detach();
      dayStreams.delete(dateKey);
    }, STREAM_GRACE_MS);
  };
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
export function aggregatePerUser(entries: LeaderboardEntry[]): LeaderboardRow[] {
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
