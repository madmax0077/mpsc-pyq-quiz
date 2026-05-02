import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { getQuizMeta } from "@/lib/quizMeta";

const SITE_URL = "https://www.mpscs.in";
const SITE_NAME = "MPSC PYQ QUIZ";
const DESCRIPTION =
  "Free MPSC Previous Year Question practice — Group B, Group C papers with subject-wise quizzes, instant scoring & detailed answers. 100% free for all aspirants.";

export const metadata: Metadata = {
  title: {
    default: "MPSC PYQ QUIZ — Free Previous Year Question Practice",
    template: "%s | MPSC PYQ QUIZ",
  },
  description: DESCRIPTION,
  keywords: [
    "MPSC", "MPSC PYQ", "MPSC previous year questions", "MPSC quiz",
    "MPSC practice", "MPSC Group B", "MPSC Group C", "MPSC prelims",
    "Maharashtra PSC", "MPSC free", "MPSC online test", "MPSC mock test",
    "MPSC preparation", "MPSC study material", "MPSC PSI",
    "MPSC Gazetted Services", "MPSC 2025", "MPSC 2024", "MPSC 2023",
    "MPSC question paper", "MPSC answer key", "MPSC subject wise questions",
  ],
  authors: [{ name: "Don't know Academy" }],
  creator: "Don't know Academy",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "MPSC PYQ QUIZ — Free Previous Year Question Practice",
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "MPSC PYQ QUIZ — Free practice for MPSC aspirants",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MPSC PYQ QUIZ — Free PYQ Practice",
    description: DESCRIPTION,
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const qm = getQuizMeta();

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "MPSC PYQ QUIZ",
        url: "https://www.mpscs.in",
        description: `Free MPSC Previous Year Question practice — ${qm.totalQuestions}+ questions from ${qm.totalPapers} exam papers (${qm.minYear}–${qm.maxYear}) with instant scoring. Available in English and Marathi.`,
        publisher: { "@type": "Organization", name: "Don't know Academy" },
        inLanguage: ["en", "mr"],
      },
      {
        "@type": "Organization",
        name: "Don't know Academy",
        url: "https://www.mpscs.in",
        logo: "https://www.mpscs.in/logo.png",
        sameAs: [],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is MPSC PYQ QUIZ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `MPSC PYQ QUIZ is a free online platform that helps MPSC aspirants practice with previous year questions from ${qm.totalPapers} exam papers (${qm.minYear}-${qm.maxYear}), available in English and Marathi.`,
            },
          },
          {
            "@type": "Question",
            name: "How many questions are available on MPSC PYQ QUIZ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `There are ${qm.totalQuestions}+ questions from ${qm.totalPapers} MPSC exam papers covering subjects like Indian Polity, History, Geography, Science, Economics, and Current Affairs.`,
            },
          },
          {
            "@type": "Question",
            name: "Is MPSC PYQ QUIZ free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, MPSC PYQ QUIZ is 100% free with no subscriptions or hidden charges. All aspirants can access every question paper and feature at no cost.",
            },
          },
          {
            "@type": "Question",
            name: "Which MPSC exams are covered?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `MPSC Group B Combined Pre, Group C Combined Pre, PSI Pre, Gazetted Civil Services Combined Pre, and Gazetted Technical Services Combined Pre exams from ${qm.minYear} through ${qm.maxYear}.`,
            },
          },
        ],
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="-OecjT9pqzPENGpM2Pva7bxV9XIMC2KY0ElKRcQjp3I" />
        <meta name="google-adsense-account" content="ca-pub-5084738834329206" />
        <meta name="theme-color" content="#4F46E5" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* JSON-LD Structured Data for Google Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')})();`,
          }}
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5084738834329206"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-sans dark:bg-slate-900">
        <AuthProvider>{children}</AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
