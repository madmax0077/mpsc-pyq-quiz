import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const ADSENSE_ID = "ca-pub-5084738834329206";

export const metadata: Metadata = {
  title: "MPSC PYQ Quiz — Don't know Academy",
  description: "Create and take MPSC multiple-choice quizzes — local-first, fast, and simple.",
  verification: {
    google: "GOOGLE_SITE_VERIFICATION_CODE", // Replace after AdSense approval
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>{children}</AuthProvider>
        {!ADSENSE_ID.includes("XXXXXXXXXX") && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
