import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

const SITE_URL = "https://mpscpyq.vercel.app";
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
    "MPSC preparation", "MPSC study material",
  ],
  authors: [{ name: "Don't know Academy" }],
  creator: "Don't know Academy",
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "MPSC PYQ QUIZ — Free Previous Year Question Practice",
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
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
    images: ["/og-image.png"],
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
  return (
    <html lang="en">
      <head>
        <meta name="google-adsense-account" content="ca-pub-5084738834329206" />
        <meta name="theme-color" content="#4F46E5" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="manifest" href="/manifest.json" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')})();if('serviceWorker' in navigator)navigator.serviceWorker.register('/sw.js').catch(function(){});`,
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
