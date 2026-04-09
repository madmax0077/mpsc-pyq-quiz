"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthChange, signOutUser, type User } from "./firebase";

const ADMIN_USERNAME = "admin";
const DEFAULT_ADMIN_PASSWORD = "admin@123";
const ADMIN_PW_KEY = "mpsc_admin_pw";

const ADMIN_SESSION_KEY = "mpsc_admin_session";
const STUDENT_SESSION_KEY = "mpsc_student_session";

function getAdminPassword(): string {
  if (typeof window === "undefined") return DEFAULT_ADMIN_PASSWORD;
  return localStorage.getItem(ADMIN_PW_KEY) || DEFAULT_ADMIN_PASSWORD;
}

export interface AuthState {
  loading: boolean;
  studentUser: User | null;
  isAdmin: boolean;
  loginAdmin: (username: string, password: string) => boolean;
  logoutAdmin: () => void;
  logoutStudent: () => Promise<void>;
  changeAdminPassword: (currentPw: string, newPw: string) => string | null;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [studentUser, setStudentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const savedAdmin = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (savedAdmin === "true") setIsAdmin(true);

    const unsubscribe = onAuthChange((user) => {
      setStudentUser(user);
      if (user) {
        localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify({
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
        }));
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginAdmin = (username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === getAdminPassword()) {
      setIsAdmin(true);
      sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
      return true;
    }
    return false;
  };

  const changeAdminPassword = (currentPw: string, newPw: string): string | null => {
    if (currentPw !== getAdminPassword()) return "Current password is incorrect.";
    if (newPw.length < 6) return "New password must be at least 6 characters.";
    localStorage.setItem(ADMIN_PW_KEY, newPw);
    return null;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
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
