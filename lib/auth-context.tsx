"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthChange,
  signOutUser,
  signInAdminWithEmail,
  isAllowlistedAdmin,
  changeAdminPasswordInFirebase,
  type User,
} from "./firebase";
import { syncProgressOnSignIn } from "./user-progress";

const STUDENT_SESSION_KEY = "mpsc_student_session";

/**
 * Admins sign in with email and password; aspirants sign in with Google or
 * Apple. Both share one Firebase Auth session, so the provider is what tells
 * the two apart — that keeps an admin session out of the aspirant UI and off
 * the public leaderboard.
 */
function isPasswordAccount(user: User): boolean {
  return user.providerData.some((p) => p.providerId === "password");
}

export interface AuthState {
  loading: boolean;
  studentUser: User | null;
  isAdmin: boolean;
  /** Resolves to null on success, or a message to show the user on failure. */
  loginAdmin: (email: string, password: string) => Promise<string | null>;
  logoutAdmin: () => Promise<void>;
  logoutStudent: () => Promise<void>;
  changeAdminPassword: (currentPw: string, newPw: string) => Promise<string | null>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [studentUser, setStudentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (!user) {
        setStudentUser(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      if (isPasswordAccount(user)) {
        // Admin candidate. Stay in the loading state until the allow-list has
        // answered, so admin pages don't flash their login form on reload.
        setStudentUser(null);
        setIsAdmin(await isAllowlistedAdmin());
        setLoading(false);
        return;
      }

      setIsAdmin(false);
      setStudentUser(user);
      localStorage.setItem(
        STUDENT_SESSION_KEY,
        JSON.stringify({ name: user.displayName, email: user.email, photo: user.photoURL }),
      );
      // Merge localStorage ↔ Firestore so progress follows the account.
      void syncProgressOnSignIn(user.uid);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginAdmin = async (email: string, password: string): Promise<string | null> => {
    try {
      await signInAdminWithEmail(email, password);
    } catch (e) {
      const code = (e as { code?: string })?.code;
      if (code === "auth/invalid-email") return "That does not look like a valid email address.";
      if (code === "auth/too-many-requests") {
        return "Too many failed attempts. Please wait a few minutes and try again.";
      }
      if (code === "auth/network-request-failed") {
        return "Network problem — please check your connection and try again.";
      }
      // Firebase deliberately returns one generic code for a wrong password and
      // an unknown account, so both land here.
      return "Invalid credentials. Please try again.";
    }

    const allowed = await isAllowlistedAdmin();
    if (!allowed) {
      // Signed in successfully but not an admin — don't leave the session behind.
      await signOutUser();
      setIsAdmin(false);
      return "This account does not have admin access.";
    }
    setIsAdmin(true);
    return null;
  };

  const changeAdminPassword = async (currentPw: string, newPw: string): Promise<string | null> =>
    changeAdminPasswordInFirebase(currentPw, newPw);

  const logoutAdmin = async () => {
    await signOutUser();
    setIsAdmin(false);
  };

  const logoutStudent = async () => {
    await signOutUser();
    localStorage.removeItem(STUDENT_SESSION_KEY);
    setStudentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ loading, studentUser, isAdmin, loginAdmin, logoutAdmin, logoutStudent, changeAdminPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
