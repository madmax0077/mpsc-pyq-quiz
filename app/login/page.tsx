import type { Metadata } from "next";
import LoginPage from "@/components/LoginPage";

export const metadata: Metadata = {
  title: "Sign in — MPSC PYQ QUIZ",
  description:
    "Sign in with Google or Apple to sync your MPSC quiz progress, streak and history across devices. Guest mode still works without an account.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default function LoginRoute() {
  return <LoginPage />;
}
