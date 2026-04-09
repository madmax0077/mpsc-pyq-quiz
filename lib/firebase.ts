import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";

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
const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutUser() {
  await fbSignOut(auth);
}

export function onAuthChange(cb: (user: User | null) => void) {
  return onAuthStateChanged(auth, cb);
}

export { auth };
export type { User };
