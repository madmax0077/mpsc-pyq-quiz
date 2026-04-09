import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MPSC PYQ Quiz — Don't know Academy",
  description: "Create and take MPSC multiple-choice quizzes — local-first, fast, and simple.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
