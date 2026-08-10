import type { Metadata } from "next";
import FeedbackBoard from "@/components/FeedbackBoard";

export const metadata: Metadata = {
  title: "Feedback — Say Thanks | MPSC PYQ QUIZ",
  description:
    "Share positive feedback and thanks for mpscs.in. Signed-in aspirants can post kind notes; the Don't know Academy team may reply officially.",
  alternates: { canonical: "/feedback" },
  robots: { index: true, follow: true },
};

export default function FeedbackPage() {
  return <FeedbackBoard />;
}
