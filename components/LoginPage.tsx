"use client";

import { useState } from "react";
import { signInWithGoogle } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { loginAdmin } = useAuth();
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [googleError, setGoogleError] = useState("");
  const [signingIn, setSigningIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleError("");
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign-in failed";
      if (msg.includes("popup-closed")) {
        setGoogleError("Sign-in popup was closed. Please try again.");
      } else {
        setGoogleError(msg);
      }
    } finally {
      setSigningIn(false);
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError("");
    const ok = loginAdmin(username.trim(), password);
    if (!ok) setAdminError("Invalid credentials. Please try again.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-50 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <img
            src="/logo.png"
            alt="MPSC Logo"
            className="mx-auto mb-4 h-20 w-20 rounded-full object-cover shadow-lg ring-4 ring-white"
          />
          <h1 className="text-2xl font-bold text-slate-800">MPSC PYQ Quiz</h1>
          <p className="mt-1 text-sm text-slate-500">Don&apos;t know Academy</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
          {!showAdminForm ? (
            <>
              {/* Aspirant Sign-In */}
              <h2 className="mb-6 text-center text-lg font-semibold text-slate-700">
                Welcome, Aspirant
              </h2>

              <button
                onClick={handleGoogleSignIn}
                disabled={signingIn}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-md disabled:opacity-50"
              >
                {signingIn ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
                ) : (
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                {signingIn ? "Signing in..." : "Sign in with Google"}
              </button>

              {googleError && (
                <p className="mt-3 text-center text-sm text-red-500">{googleError}</p>
              )}

              {/* Divider */}
              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs text-slate-400">or</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              {/* Admin Link */}
              <button
                onClick={() => setShowAdminForm(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600 transition-all hover:bg-slate-100"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                Login as Admin
              </button>
            </>
          ) : (
            <>
              {/* Admin Login Form */}
              <div className="mb-6 flex items-center gap-3">
                <button
                  onClick={() => {
                    setShowAdminForm(false);
                    setAdminError("");
                  }}
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <h2 className="text-lg font-semibold text-slate-700">Admin Login</h2>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    placeholder="Enter admin username"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm text-slate-800 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    placeholder="Enter admin password"
                    required
                  />
                </div>

                {adminError && (
                  <p className="text-sm text-red-500">{adminError}</p>
                )}

                <button
                  type="submit"
                  className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md"
                >
                  Sign In
                </button>
              </form>
            </>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Secure access &middot; Your data stays in your browser
        </p>
      </div>
    </div>
  );
}
