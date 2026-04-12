"use client";

import { useState } from "react";
import Link from "next/link";
import { signInWithGoogle, signInWithApple } from "@/lib/firebase";
import AdBanner from "./AdBanner";

export default function LoginPage() {
  const [googleError, setGoogleError] = useState("");
  const [signingIn, setSigningIn] = useState<"google" | "apple" | null>(null);

  const handleGoogleSignIn = async () => {
    setGoogleError("");
    setSigningIn("google");
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
      setSigningIn(null);
    }
  };

  const handleAppleSignIn = async () => {
    setGoogleError("");
    setSigningIn("apple");
    try {
      await signInWithApple();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sign-in failed";
      if (msg.includes("popup-closed")) {
        setGoogleError("Sign-in popup was closed. Please try again.");
      } else {
        setGoogleError(msg);
      }
    } finally {
      setSigningIn(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-50 px-4 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      <div className="w-full max-w-md">
        {/* Header */}
        <Link href="/" className="mb-8 block text-center no-underline">
          <img
            src="/logo.png"
            alt="MPSC Logo"
            className="mx-auto mb-4 h-20 w-20 rounded-full object-cover shadow-lg ring-4 ring-white"
          />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">MPSC PYQ QUIZ</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Don&apos;t know Academy</p>
        </Link>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 dark:bg-slate-800 dark:border-slate-700 dark:shadow-slate-900/50">
          <h2 className="mb-6 text-center text-lg font-semibold text-slate-700 dark:text-slate-200">
            Welcome, Aspirant
          </h2>

          <div className="space-y-3">
            {/* Google Sign-In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={!!signingIn}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:shadow-md disabled:opacity-50 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              {signingIn === "google" ? (
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
              {signingIn === "google" ? "Signing in..." : "Sign in with Google"}
            </button>

            {/* Apple Sign-In */}
            <button
              onClick={handleAppleSignIn}
              disabled={!!signingIn}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-gray-900 hover:shadow-md disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-gray-100"
            >
              {signingIn === "apple" ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-400 border-t-white dark:border-gray-300 dark:border-t-black" />
              ) : (
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              )}
              {signingIn === "apple" ? "Signing in..." : "Sign in with Apple"}
            </button>
          </div>

          {googleError && (
            <p className="mt-3 text-center text-sm text-red-500">{googleError}</p>
          )}
        </div>

        <AdBanner slot="1234567890" format="horizontal" className="mt-6" />

        <p className="mt-4 text-center text-xs text-slate-400 dark:text-slate-500">
          Secure access &middot; Your data stays in your browser
        </p>

        <nav className="mt-6 flex items-center justify-center gap-3 text-xs text-slate-400 dark:text-slate-500">
          <Link href="/about" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">About</Link>
          <span>|</span>
          <Link href="/contact" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Contact</Link>
          <span>|</span>
          <Link href="/exams" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Exams</Link>
          <span>|</span>
          <Link href="/privacy" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Privacy Policy</Link>
        </nav>
      </div>
    </div>
  );
}
