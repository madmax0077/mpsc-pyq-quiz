import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { getQuizMeta } from "@/lib/quizMeta";

const SITE_URL = "https://www.mpscs.in";
const SITE_NAME = "MPSC PYQ QUIZ";
const DESCRIPTION =
  "Free MPSC Previous Year Question practice — Group B, Group C, PSI, Gazetted papers with subject-wise quizzes, instant scoring & detailed answers. Now includes a daily aggregate leaderboard and an interactive Maharashtra map (rivers, forts, dams, UNESCO sites, nuclear / hydro / thermal plants). 100% free for all aspirants.";

/**
 * Social / profile links used both in the footer and in the
 * Organization schema as sameAs entries. Adding the canonical
 * URLs here gives Google a strong identity signal and also acts
 * as a backlink anchor for the brand.
 */
const SAME_AS = [
  "https://github.com/madmax0077/mpsc-pyq-quiz",
  "https://www.youtube.com/@dontknowacademy",
  "https://x.com/mpscs_in",
  "https://www.facebook.com/mpscs.in",
  "https://www.instagram.com/mpscs.in",
];

export const metadata: Metadata = {
  title: {
    default: "MPSC PYQ QUIZ — Free PYQ Practice + Daily Leaderboard + Maharashtra Map",
    template: "%s | MPSC PYQ QUIZ",
  },
  description: DESCRIPTION,
  keywords: [
    // Core MPSC keywords
    "MPSC", "MPSC PYQ", "MPSC previous year questions", "MPSC quiz",
    "MPSC practice", "MPSC Group B", "MPSC Group C", "MPSC prelims",
    "Maharashtra PSC", "MPSC free", "MPSC online test", "MPSC mock test",
    "MPSC preparation", "MPSC study material", "MPSC PSI",
    "MPSC Gazetted Services", "MPSC 2025", "MPSC 2024", "MPSC 2023",
    "MPSC question paper", "MPSC answer key", "MPSC subject wise questions",
    // New: leaderboard
    "MPSC daily quiz", "MPSC leaderboard", "MPSC daily test",
    "MPSC top scorers", "MPSC daily ranking",
    // New: interactive map
    "Maharashtra map", "Maharashtra rivers map", "Maharashtra forts map",
    "Maharashtra geography map", "Konkan rivers", "Sahyadri ghats map",
    "Maharashtra power plants", "Maharashtra UNESCO sites",
    "MPSC geography map", "Maharashtra districts map",
    "Tarapur nuclear", "Koyna hydro", "Chandrapur thermal power plant",
    "Godavari Krishna Bhima rivers", "Painganga Wainganga Wardha",
    "Vaitarna Ulhas Vashishti Shastri",
    // New: long-form study guides
    "MPSC study guides", "MPSC notes free", "Maharashtra geography for MPSC",
    "Maharashtra history for MPSC", "Indian polity for MPSC",
    "MPSC exam pattern", "MPSC preparation strategy", "MPSC 6 month plan",
    "Chhatrapati Shivaji Maharaj history", "Maratha Empire", "Peshwa era",
    "Samyukta Maharashtra movement",
  ],
  authors: [{ name: "Don't know Academy" }],
  creator: "Don't know Academy",
  publisher: "Don't know Academy",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  category: "education",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "MPSC PYQ QUIZ — Free PYQ Practice + Daily Leaderboard + Maharashtra Map",
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "MPSC PYQ QUIZ — Free PYQ practice, daily leaderboard, interactive Maharashtra map",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MPSC PYQ QUIZ — Free PYQ Practice + Maharashtra Map",
    description: DESCRIPTION,
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
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
        "@id": `${SITE_URL}/#website`,
        name: "MPSC PYQ QUIZ",
        url: SITE_URL,
        description: `Free MPSC Previous Year Question practice — ${qm.totalQuestions}+ questions from ${qm.totalPapers} exam papers (${qm.minYear}–${qm.maxYear}) with instant scoring, a daily aggregate leaderboard and an interactive map of Maharashtra. Available in English and Marathi.`,
        publisher: { "@id": `${SITE_URL}/#org` },
        inLanguage: ["en", "mr"],
        potentialAction: {
          "@type": "SearchAction",
          target: `${SITE_URL}/exams?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "EducationalOrganization",
        "@id": `${SITE_URL}/#org`,
        name: "Don't know Academy",
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        description:
          "Don't know Academy publishes the free MPSC PYQ QUIZ platform — previous-year question practice, daily quizzes, a leaderboard and an interactive Maharashtra map for MPSC and other competitive exam aspirants.",
        sameAs: SAME_AS,
      },
      {
        "@type": "WebPage",
        "@id": `${SITE_URL}/map#webpage`,
        url: `${SITE_URL}/map`,
        name: "Interactive Map of Maharashtra — Rivers, Forts, Power Plants, UNESCO sites",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        description:
          "High-resolution OpenStreetMap-based interactive map of Maharashtra with toggleable layers for Deccan rivers (Godavari, Krishna, Bhima, Tapi, Wardha, Wainganga, Painganga) and Konkan coastal rivers (Damanganga, Vaitarna, Ulhas, Patalganga, Amba, Kundalika, Savitri, Vashishti, Shastri, Karli, Terekhol) plus 30+ tributaries, dams, waterfalls, ghats, nuclear plants (Tarapur, Jaitapur), hydroelectric plants (Koyna, Bhira), thermal plants (Chandrapur, Koradi, Tiroda), mineral belts, UNESCO sites and historic forts.",
        about: [
          { "@type": "Thing", name: "Maharashtra rivers" },
          { "@type": "Thing", name: "Maharashtra forts" },
          { "@type": "Thing", name: "Maharashtra power plants" },
          { "@type": "Thing", name: "Maharashtra UNESCO World Heritage sites" },
          { "@type": "Thing", name: "MPSC geography preparation" },
        ],
      },
      {
        "@type": "CollectionPage",
        "@id": `${SITE_URL}/study-guides#webpage`,
        url: `${SITE_URL}/study-guides`,
        name: "MPSC Study Guides — Long-form Notes for Geography, History, Polity & Strategy",
        isPartOf: { "@id": `${SITE_URL}/#website` },
        description:
          "Five comprehensive MPSC study guides covering Maharashtra geography, Maharashtra history, Indian polity, MPSC exam pattern and a complete preparation strategy.",
        hasPart: [
          {
            "@type": "Article",
            "@id": `${SITE_URL}/study-guides/maharashtra-geography#article`,
            headline: "Maharashtra Geography for MPSC — Physical Divisions, Rivers, Climate, Soils & Resources",
            url: `${SITE_URL}/study-guides/maharashtra-geography`,
            author: { "@id": `${SITE_URL}/#org` },
            publisher: { "@id": `${SITE_URL}/#org` },
            inLanguage: "en",
            articleSection: "MPSC Geography",
            wordCount: 2200,
          },
          {
            "@type": "Article",
            "@id": `${SITE_URL}/study-guides/maharashtra-history#article`,
            headline: "Maharashtra History for MPSC — Satavahanas to State Formation",
            url: `${SITE_URL}/study-guides/maharashtra-history`,
            author: { "@id": `${SITE_URL}/#org` },
            publisher: { "@id": `${SITE_URL}/#org` },
            inLanguage: "en",
            articleSection: "MPSC History",
            wordCount: 2400,
          },
          {
            "@type": "Article",
            "@id": `${SITE_URL}/study-guides/indian-polity-for-mpsc#article`,
            headline: "Indian Polity for MPSC — Constitution, Rights, DPSPs, Parliament & State Government",
            url: `${SITE_URL}/study-guides/indian-polity-for-mpsc`,
            author: { "@id": `${SITE_URL}/#org` },
            publisher: { "@id": `${SITE_URL}/#org` },
            inLanguage: "en",
            articleSection: "MPSC Polity",
            wordCount: 2300,
          },
          {
            "@type": "Article",
            "@id": `${SITE_URL}/study-guides/mpsc-exam-pattern#article`,
            headline: "MPSC Exam Pattern — Group B, Group C, PSI, Gazetted CS & TS Prelims (2026)",
            url: `${SITE_URL}/study-guides/mpsc-exam-pattern`,
            author: { "@id": `${SITE_URL}/#org` },
            publisher: { "@id": `${SITE_URL}/#org` },
            inLanguage: "en",
            articleSection: "MPSC Exam Pattern",
            wordCount: 1900,
          },
          {
            "@type": "Article",
            "@id": `${SITE_URL}/study-guides/mpsc-preparation-strategy#article`,
            headline: "MPSC Preparation Strategy 2026 — 6-Month Study Plan, Books, PYQ & Mock Routine",
            url: `${SITE_URL}/study-guides/mpsc-preparation-strategy`,
            author: { "@id": `${SITE_URL}/#org` },
            publisher: { "@id": `${SITE_URL}/#org` },
            inLanguage: "en",
            articleSection: "MPSC Strategy",
            wordCount: 2100,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is MPSC PYQ QUIZ?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `MPSC PYQ QUIZ is a free online platform that helps MPSC aspirants practice with previous year questions from ${qm.totalPapers} exam papers (${qm.minYear}-${qm.maxYear}), available in English and Marathi. It also includes a daily aggregate leaderboard and an interactive map of Maharashtra for geography revision.`,
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
              text: "Yes, MPSC PYQ QUIZ is 100% free with no subscriptions or hidden charges. All aspirants can access every question paper, the daily leaderboard and the interactive Maharashtra map at no cost.",
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
          {
            "@type": "Question",
            name: "How does the daily leaderboard work?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Sign in once and every quiz set you submit during the day counts towards your aggregate score. The leaderboard ranks the top three users by question-weighted average across all daily attempts, so the more sets you solve, the more accurate your standing becomes.",
            },
          },
          {
            "@type": "Question",
            name: "What does the interactive Maharashtra map include?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The /map page shows every major river of Maharashtra (Godavari, Krishna, Bhima, Tapi, Wardha, Wainganga, Painganga) and the Konkan coastal rivers (Damanganga, Vaitarna, Ulhas, Patalganga, Amba, Kundalika, Savitri, Vashishti, Shastri, Karli, Terekhol) with 30+ tributaries and inline name labels, plus toggleable layers for dams, waterfalls, ghats, nuclear / hydro / thermal power plants, mineral belts, UNESCO sites and historic forts marked with the saffron flag.",
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
