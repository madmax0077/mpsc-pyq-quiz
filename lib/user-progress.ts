/**
 * Cloud backup of aspirant study progress (Firestore `users/{uid}`).
 * LocalStorage remains the fast source of truth; cloud syncs on sign-in
 * and after quiz completion for signed-in users.
 */
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { getAttemptedIds, replaceAttemptedIds } from "./progress";
import { getHistory, replaceHistory, type QuizResult } from "./analytics";
import { getStreakData, setStreakData, type StreakData } from "./streak";

export type CloudProgress = {
  attemptedIds: Record<string, string[]>;
  history: QuizResult[];
  streak: StreakData;
  updatedAtMs?: number;
};

function progressDoc(uid: string) {
  return doc(db, "users", uid);
}

function mergeAttempted(
  local: Record<string, string[]>,
  remote: Record<string, string[]>,
): Record<string, string[]> {
  const keys = new Set([...Object.keys(local), ...Object.keys(remote)]);
  const out: Record<string, string[]> = {};
  for (const k of keys) {
    out[k] = Array.from(new Set([...(local[k] || []), ...(remote[k] || [])]));
  }
  return out;
}

function mergeHistory(local: QuizResult[], remote: QuizResult[]): QuizResult[] {
  const map = new Map<string, QuizResult>();
  for (const r of [...remote, ...local]) {
    const key = `${r.quizId}|${r.timestamp}|${r.score}|${r.total}`;
    map.set(key, r);
  }
  return Array.from(map.values())
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(-200);
}

function mergeStreak(local: StreakData, remote: StreakData): StreakData {
  if (!remote.lastDate) return local;
  if (!local.lastDate) return remote;
  if (local.lastDate === remote.lastDate) {
    return { lastDate: local.lastDate, count: Math.max(local.count, remote.count) };
  }
  return local.lastDate > remote.lastDate ? local : remote;
}

function readLocal(): CloudProgress {
  return {
    attemptedIds: getAttemptedIds(),
    history: getHistory(),
    streak: getStreakData(),
  };
}

function writeLocal(data: CloudProgress): void {
  replaceAttemptedIds(data.attemptedIds || {});
  replaceHistory(Array.isArray(data.history) ? data.history : []);
  if (data.streak) setStreakData(data.streak);
}

/** Pull cloud progress, merge with local, write both directions. */
export async function syncProgressOnSignIn(uid: string): Promise<"ok" | "error"> {
  if (typeof window === "undefined" || !uid) return "error";
  try {
    const local = readLocal();
    const snap = await getDoc(progressDoc(uid));
    const remote = (snap.exists() ? (snap.data() as CloudProgress) : null) || {
      attemptedIds: {},
      history: [],
      streak: { lastDate: "", count: 0 },
    };

    const merged: CloudProgress = {
      attemptedIds: mergeAttempted(local.attemptedIds, remote.attemptedIds || {}),
      history: mergeHistory(local.history, remote.history || []),
      streak: mergeStreak(local.streak, remote.streak || { lastDate: "", count: 0 }),
      updatedAtMs: Date.now(),
    };

    writeLocal(merged);
    await setDoc(
      progressDoc(uid),
      {
        attemptedIds: merged.attemptedIds,
        history: merged.history,
        streak: merged.streak,
        updatedAtMs: merged.updatedAtMs,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    return "ok";
  } catch (e) {
    console.warn("[user-progress] sync on sign-in failed", e);
    return "error";
  }
}

/** Push current local progress to cloud (signed-in users only). */
export async function pushProgressToCloud(uid: string): Promise<"ok" | "error"> {
  if (typeof window === "undefined" || !uid) return "error";
  try {
    const local = readLocal();
    await setDoc(
      progressDoc(uid),
      {
        attemptedIds: local.attemptedIds,
        history: local.history,
        streak: local.streak,
        updatedAtMs: Date.now(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    return "ok";
  } catch (e) {
    console.warn("[user-progress] push failed", e);
    return "error";
  }
}
