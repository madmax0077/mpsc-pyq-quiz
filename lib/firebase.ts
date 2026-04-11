import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
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

/* ── Question Reports (Firestore) ── */

export interface QuestionReport {
  id: string;
  questionId: string;
  questionText: string;
  quizTitle: string;
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
  reason: string;
  reporterName: string;
  reporterEmail: string;
}): Promise<boolean> {
  try {
    const existing = query(
      collection(db, REPORTS_COLLECTION),
      where("questionId", "==", data.questionId),
      where("reporterEmail", "==", data.reporterEmail),
    );
    const snap = await getDocs(existing);
    if (!snap.empty) return false;

    await addDoc(collection(db, REPORTS_COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      status: "pending",
    });
    return true;
  } catch (e) {
    console.error("submitReport error:", e);
    return false;
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

export { auth, db };
export type { User };
