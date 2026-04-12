import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — MPSC PYQ QUIZ",
  description:
    "Privacy policy for MPSC PYQ QUIZ. Learn how we handle your data, quiz progress, Google sign-in information, and advertising cookies.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-slate-800">Privacy Policy</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="prose prose-slate max-w-none rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm text-slate-500">Last updated: April 2026</p>

          <h2>Introduction</h2>
          <p>
            Welcome to <strong>MPSC PYQ QUIZ</strong> operated by Don&apos;t know Academy
            (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;). We respect your privacy and are
            committed to protecting your personal data. This Privacy Policy explains how we
            collect, use, and safeguard your information when you use our website.
          </p>

          <h2>Information We Collect</h2>
          <h3>Account Information</h3>
          <p>
            When you sign in with Google, we receive your name, email address, and profile
            picture from your Google account. This is used solely to identify you within the
            application.
          </p>

          <h3>Quiz Data</h3>
          <p>
            All quiz data (questions, answers, scores) is stored locally in your browser
            using localStorage. We do not upload or store your quiz data on any server.
          </p>

          <h3>Cookies and Advertising</h3>
          <p>
            We use Google AdSense to display advertisements. Google may use cookies and
            similar technologies to serve ads based on your prior visits to our website or
            other websites. You can opt out of personalized advertising by visiting{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Ads Settings
            </a>
            .
          </p>

          <h3>Analytics</h3>
          <p>
            We may use analytics services to understand how our website is used. These
            services may collect information about your browser type, device, and usage
            patterns in an anonymized manner.
          </p>

          <h2>How We Use Your Information</h2>
          <ul>
            <li>To authenticate and identify users</li>
            <li>To provide and improve our quiz service</li>
            <li>To display relevant advertisements</li>
            <li>To analyze website usage and improve user experience</li>
          </ul>

          <h2>Data Storage</h2>
          <p>
            Your quiz data is stored entirely in your browser&apos;s localStorage. We do not
            have access to this data. If you clear your browser data, your quiz history will
            be lost. You can export your data using the export feature in the Admin dashboard.
          </p>

          <h2>Third-Party Services</h2>
          <ul>
            <li>
              <strong>Google Firebase Authentication</strong> — for sign-in functionality
            </li>
            <li>
              <strong>Google AdSense</strong> — for displaying advertisements
            </li>
          </ul>
          <p>
            These services have their own privacy policies. We encourage you to review them.
          </p>

          <h2>Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Sign out and stop using the service at any time</li>
            <li>Clear your browser data to remove all locally stored information</li>
            <li>Opt out of personalized advertising through Google Ads Settings</li>
          </ul>

          <h2>Children&apos;s Privacy</h2>
          <p>
            Our service is intended for MPSC exam aspirants and is not directed at children
            under the age of 13. We do not knowingly collect data from children under 13.
          </p>

          <h2>Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted
            on this page with an updated revision date.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href="mailto:dontknowacademy@gmail.com">dontknowacademy@gmail.com</a>.
          </p>
        </div>
      </main>

      <footer className="border-t border-slate-200/80 py-6 text-center text-xs text-slate-400">
        MPSC PYQ QUIZ &middot; Don&apos;t know Academy
      </footer>
    </div>
  );
}
