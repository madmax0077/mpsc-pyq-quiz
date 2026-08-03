import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  EmailAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  reauthenticateWithCredential,
  updatePassword,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  where,
  serverTimestamp,
  type Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBWE48Bh--2_4YMyo81JNnKNs_0HJhhcqU",
  authDomain: "mpsc-pyq-quiz.firebaseapp.com",
  projectId: "mpsc-pyq-quiz",
  storageBucket: "mpsc-pyq-quiz.firebasestorage.app",
  messagingSenderId: "790160623755",
  appId: "1:790160623755:web:84aabe54cce6289b7bac8e",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider("apple.com");
appleProvider.addScope("email");
appleProvider.addScope("name");

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signInWithApple() {
  const result = await signInWithPopup(auth, appleProvider);
  return result.user;
}

export async function signOutUser() {
  await fbSignOut(auth);
}

export function onAuthChange(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}

/* ── Admin authentication ── */

/**
 * The admin allow-list: `admin_users/config` holds a `uids` array. Firestore
 * rules expose this document only to the accounts it names, so a successful
 * read is itself proof of admin status and no UID needs to live in this bundle.
 */
const ADMIN_ALLOWLIST_DOC = () => doc(db, "admin_users", "config");

/** Signs an admin in with the email and password held in Firebase Auth. */
export async function signInAdminWithEmail(email: string, password: string): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email.trim(), password);
  return result.user;
}

/**
 * True when the currently signed-in user is on the admin allow-list. A
 * permission-denied read means "not an admin", which is an expected outcome
 * here rather than a failure, so it resolves to false instead of throwing.
 */
export async function isAllowlistedAdmin(): Promise<boolean> {
  if (!auth.currentUser) return false;
  try {
    const snap = await getDoc(ADMIN_ALLOWLIST_DOC());
    return snap.exists();
  } catch {
    return false;
  }
}

/**
 * Changes the signed-in admin's Firebase password. Firebase only allows this
 * shortly after a sign-in, so the current password is used to re-authenticate
 * first. Returns null on success or a human-readable message on failure.
 */
export async function changeAdminPasswordInFirebase(
  currentPw: string,
  newPw: string,
): Promise<string | null> {
  const user = auth.currentUser;
  if (!user?.email) return "No admin is signed in.";
  if (newPw.length < 6) return "New password must be at least 6 characters.";
  try {
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, currentPw));
  } catch {
    return "Current password is incorrect.";
  }
  try {
    await updatePassword(user, newPw);
    return null;
  } catch (e) {
    const code = (e as { code?: string })?.code;
    if (code === "auth/weak-password") return "That password is too weak. Please choose a longer one.";
    return "Could not update the password. Please try again.";
  }
}

/* ── Question Reports (Firestore) ── */

/** What the aspirant says is wrong, so reports can be triaged without reading every note. */
export type ReportIssueType =
  | "wrong-answer"
  | "wrong-explanation"
  | "unclear"
  | "typo"
  | "other";

export const REPORT_ISSUE_LABELS: Record<ReportIssueType, string> = {
  "wrong-answer": "Wrong answer marked",
  "wrong-explanation": "Explanation is wrong",
  unclear: "Question or options unclear",
  typo: "Typo or formatting problem",
  other: "Something else",
};

export interface QuestionReport {
  id: string;
  questionId: string;
  questionText: string;
  quizTitle: string;
  /** Absent on reports created before the issue-type selector existed. */
  issueType?: ReportIssueType;
  reason: string;
  reporterName: string;
  reporterEmail: string;
  createdAt: Timestamp | null;
  status: "pending" | "resolved";
}

const REPORTS_COLLECTION = "question_reports";

export async function submitReport(data: {
  questionId: string;
  questionText: string;
  quizTitle: string;
  issueType: ReportIssueType;
  reason: string;
  reporterName: string;
  reporterEmail: string;
}): Promise<"ok" | "duplicate" | "error"> {
  // Stored lower-cased so the duplicate check below can't be defeated by
  // capitalisation, and so the admin list groups one person's reports together.
  const reporterEmail = data.reporterEmail.trim().toLowerCase();
  try {
    const existing = query(
      collection(db, REPORTS_COLLECTION),
      where("questionId", "==", data.questionId),
      where("reporterEmail", "==", reporterEmail),
    );
    const snap = await getDocs(existing);
    if (!snap.empty) return "duplicate";

    await addDoc(collection(db, REPORTS_COLLECTION), {
      ...data,
      reporterEmail,
      createdAt: serverTimestamp(),
      status: "pending",
    });
    return "ok";
  } catch (e) {
    console.error("submitReport error:", e);
    throw e;
  }
}

export async function fetchReports(): Promise<QuestionReport[]> {
  try {
    const q = query(collection(db, REPORTS_COLLECTION), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as QuestionReport));
  } catch (e) {
    console.error("fetchReports error:", e);
    return [];
  }
}

export async function resolveReport(reportId: string): Promise<void> {
  await updateDoc(doc(db, REPORTS_COLLECTION, reportId), { status: "resolved" });
}

export async function deleteReport(reportId: string): Promise<void> {
  await deleteDoc(doc(db, REPORTS_COLLECTION, reportId));
}

/**
 * Live signal for quiz bundle updates. Create Firestore doc `settings/quiz_data` with a numeric
 * field `revision` (e.g. 1). After you deploy a new `public/quizzes.json`, increment `revision`
 * (Firebase Console or an offline admin script). All open clients refetch quizzes.json.
 *
 * Firestore rules: allow read on `settings/quiz_data` for everyone using the app; restrict writes.
 */
const QUIZ_DATA_SETTINGS = doc(db, "settings", "quiz_data");

export function subscribeQuizDataRevision(callback: (revision: number) => void): () => void {
  return onSnapshot(
    QUIZ_DATA_SETTINGS,
    (snap) => {
      if (!snap.exists()) {
        callback(0);
        return;
      }
      const raw = snap.data()?.revision;
      const n = typeof raw === "number" ? raw : Number(raw);
      callback(Number.isFinite(n) ? n : 0);
    },
    (err) => {
      console.warn("subscribeQuizDataRevision:", err);
      callback(0);
    },
  );
}

export { auth, db };
export type { User };
