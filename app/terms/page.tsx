import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — MPSC PYQ QUIZ",
  description:
    "Terms of Service for MPSC PYQ QUIZ (mpscs.in) by Don't know Academy. Rules for using the free MPSC previous-year question practice platform, user accounts, intellectual property, disclaimers, limitation of liability and dispute resolution.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950">
      <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-700/80 dark:bg-slate-900/80">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            aria-label="Back to home"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Terms of Service</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="prose prose-slate max-w-none rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:prose-invert dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Effective date: 1 April 2026 &middot; Last updated: 18 July 2026
          </p>

          <h2>1. Agreement</h2>
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of the website
            <strong> www.mpscs.in</strong> and any subdomains, together with the associated
            Android / iOS applications (collectively, the &quot;Service&quot;). The Service is
            operated by <strong>Don&apos;t know Academy</strong> (&quot;we&quot;, &quot;us&quot;,
            &quot;our&quot;), a one-developer education project based in Pune, Maharashtra, India.
          </p>
          <p>
            By accessing or using the Service you agree to be bound by these Terms and by our{" "}
            <Link href="/privacy">Privacy Policy</Link>. If you do not agree, please stop using
            the Service.
          </p>

          <h2>2. Who may use the Service</h2>
          <ul>
            <li>The Service is intended for MPSC aspirants and general readers who are interested in Indian civil-services preparation content.</li>
            <li>You must be at least 13 years old to use the Service. Users under 18 should use the Service under the guidance of a parent or legal guardian, and we do not display personalised advertising to users we know to be under 18.</li>
            <li>You are responsible for complying with any laws that apply to you in your jurisdiction while using the Service.</li>
          </ul>

          <h2>3. The Service is free</h2>
          <p>
            MPSC PYQ QUIZ is offered free of charge. We do not sell subscriptions, premium tiers,
            paid courses, coaching packages or test series. The Service is funded by non-intrusive
            advertising (Google AdSense, subject to enrolment) and by community donations.
          </p>

          <h2>4. Accounts</h2>
          <ul>
            <li>You may use most of the Service without signing in, including the home page, the /exams index, the /map page, the /study-guides section, the /rivers-maharashtra page, the /census-2011-maharashtra page and every individual question page.</li>
            <li>Signing in with Google or Apple (via Firebase Authentication) is required only to save your quiz progress across devices and to appear on the daily leaderboard as a signed-in user. Guest users may enter a display name and still appear on the leaderboard.</li>
            <li>You are responsible for maintaining the confidentiality of the credentials associated with your account and for all activity that occurs under your account.</li>
            <li>You agree to provide accurate information (a real display name, an email that reaches you) so we can respond to support requests.</li>
          </ul>

          <h2>5. Acceptable use</h2>
          <p>You agree that you will <strong>not</strong>:</p>
          <ul>
            <li>Copy, download, republish, distribute or resell the Service&apos;s original content (study guides, explanations, curated categorisations) without prior written permission.</li>
            <li>Scrape, spider, harvest or otherwise programmatically extract data from the Service in a manner that places an unreasonable load on our servers.</li>
            <li>Attempt to gain unauthorised access to any part of the Service, another user&apos;s account, our servers or the underlying databases.</li>
            <li>Interfere with, disable or bypass any feature of the Service, including quiz scoring, the leaderboard, security controls or ad delivery.</li>
            <li>Submit false, misleading or offensive content through any feature that accepts user input (Report-a-question, contact email, display names on the leaderboard).</li>
            <li>Use the Service to violate any applicable law, including the Indian Information Technology Act 2000, the Copyright Act 1957, the Digital Personal Data Protection Act 2023 or any other law that applies to you.</li>
          </ul>
          <p>
            We reserve the right, at our sole discretion, to disable or terminate any account that
            we reasonably believe is engaging in the activities above, with or without prior
            notice.
          </p>

          <h2>6. Question papers, answer keys and study material</h2>
          <p>
            The Service reproduces MPSC previous-year question papers and answer keys that have
            been publicly released by the Maharashtra Public Service Commission (MPSC) on{" "}
            <a href="https://mpsc.gov.in" target="_blank" rel="noopener">mpsc.gov.in</a>. The
            underlying question papers are the intellectual property of MPSC. We reproduce them
            for educational, non-commercial use, categorise them by subject and topic, and provide
            explanatory notes.
          </p>
          <ul>
            <li>The <strong>categorisation, subject tags, explanations, study guides, interactive map, leaderboard and site layout</strong> are original works of Don&apos;t know Academy and are protected by copyright.</li>
            <li>You may quote short extracts from our original content (e.g. an explanation on a question page) with clear attribution to <em>MPSC PYQ QUIZ / Don&apos;t know Academy</em> and a link back to the source page.</li>
            <li>You may not republish our entire database of questions, explanations or study guides on another website, app or aggregator without our prior written permission.</li>
          </ul>

          <h2>7. Accuracy of information</h2>
          <p>
            We make reasonable efforts to keep questions, answer keys and study material accurate
            and up to date. Nonetheless, the Service is provided <strong>&quot;as is&quot;</strong>
            and <strong>&quot;as available&quot;</strong>. We do not warrant that:
          </p>
          <ul>
            <li>The Service will be uninterrupted or error-free.</li>
            <li>Every answer key matches the latest MPSC revision.</li>
            <li>The Service is suitable for any particular examination or purpose.</li>
          </ul>
          <p>
            For the most authoritative version of any question paper or answer key, please refer
            directly to <a href="https://mpsc.gov.in" target="_blank" rel="noopener">mpsc.gov.in</a>.
            See our <Link href="/disclaimer">Disclaimer</Link> for a full statement.
          </p>

          <h2>8. Third-party links and services</h2>
          <p>
            The Service links to third-party websites (mpsc.gov.in, NCERT, news publications, the
            Government of Maharashtra&apos;s statistical handbooks, OpenStreetMap, etc.). We are
            not responsible for the content, accuracy, privacy practices or terms of those sites.
            Using them is at your own risk.
          </p>
          <p>
            The Service also relies on third-party service providers, including Google Firebase
            (authentication, database), Google Analytics, Vercel (hosting) and, subject to
            enrolment, Google AdSense (advertising). Your use of the Service is also subject to the
            applicable terms of those providers.
          </p>

          <h2>9. Advertising</h2>
          <p>
            Once the Service is enrolled with Google AdSense, third-party ads may be displayed on
            certain pages. We do not control the specific ads that are shown; those are chosen by
            Google&apos;s ad-serving systems based on the page content and, where you have consented,
            your interests. We do not accept payment to alter our editorial content or to promote
            any specific coaching institute, publisher or product.
          </p>

          <h2>10. Disclaimers</h2>
          <ul>
            <li>Don&apos;t know Academy is not affiliated with, endorsed by or operated on behalf of the Maharashtra Public Service Commission, the Government of Maharashtra, the Union Public Service Commission or any government body.</li>
            <li>The Service does not guarantee any specific score, rank or selection in any MPSC or other competitive examination.</li>
            <li>The Service does not provide legal, financial, medical or professional advice. Study material is provided for educational purposes only.</li>
            <li>All trademarks referenced on the Service are the property of their respective owners.</li>
          </ul>

          <h2>11. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by applicable law, in no event will Don&apos;t know
            Academy, its owner, contributors, agents or licensors be liable for any indirect,
            incidental, special, consequential or punitive damages, or any loss of profits, data,
            examination opportunities, career opportunities or goodwill arising out of or in
            connection with your use of, or inability to use, the Service.
          </p>
          <p>
            Our total aggregate liability to you for any claims arising out of or relating to the
            Service will not exceed one hundred Indian rupees (INR 100), which reflects the
            zero-cost nature of the Service.
          </p>

          <h2>12. Indemnity</h2>
          <p>
            You agree to defend, indemnify and hold harmless Don&apos;t know Academy and its
            representatives from and against any and all claims, liabilities, damages, losses and
            expenses (including reasonable legal fees) arising from or related to (a) your breach
            of these Terms, (b) your violation of any applicable law or the rights of a third
            party, or (c) content you submit through the Service.
          </p>

          <h2>13. Termination</h2>
          <p>
            You may stop using the Service at any time. You may delete your account by writing to{" "}
            <a href="mailto:dontknowacademy@gmail.com">dontknowacademy@gmail.com</a>. We may
            suspend or terminate your access to the Service, with or without notice, if we
            reasonably believe you have violated these Terms.
          </p>

          <h2>14. Changes to the Terms</h2>
          <p>
            We may update these Terms from time to time. The &quot;Last updated&quot; date at the
            top of this page reflects the most recent change. Material changes will additionally
            be communicated through a banner on the home page for at least 14 days. Continued use
            of the Service after the effective date of any change constitutes acceptance of the
            revised Terms.
          </p>

          <h2>15. Governing law and jurisdiction</h2>
          <p>
            These Terms are governed by and construed in accordance with the laws of India,
            without regard to conflict-of-laws principles. You agree that the courts located in
            Pune, Maharashtra, India, will have exclusive jurisdiction over any dispute arising
            out of or relating to these Terms or the Service, subject to any mandatory
            consumer-protection or data-protection forum that applies to you under the DPDP Act
            2023 or similar legislation.
          </p>

          <h2>16. Contact</h2>
          <p>
            <strong>Don&apos;t know Academy (MPSC PYQ QUIZ)</strong><br />
            Email: <a href="mailto:dontknowacademy@gmail.com">dontknowacademy@gmail.com</a><br />
            Location: Pune, Maharashtra, India
          </p>
        </div>
      </main>

      <footer className="border-t border-slate-200/80 py-6 dark:border-slate-700/80">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="flex flex-col items-center gap-2">
            <p className="text-xs text-slate-400 dark:text-slate-500">MPSC PYQ QUIZ &middot; Don&apos;t know Academy</p>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400 dark:text-slate-500">
              <Link href="/" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Home</Link>
              <span>|</span>
              <Link href="/about" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">About</Link>
              <span>|</span>
              <Link href="/contact" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Contact</Link>
              <span>|</span>
              <Link href="/privacy" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Privacy</Link>
              <span>|</span>
              <Link href="/disclaimer" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Disclaimer</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
