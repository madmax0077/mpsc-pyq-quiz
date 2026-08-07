import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer — MPSC PYQ QUIZ",
  description:
    "Editorial and legal disclaimer for MPSC PYQ QUIZ by Don't know Academy. Not affiliated with MPSC or the Government of Maharashtra. Content is for educational purposes only. Please verify answer keys against the official MPSC source.",
  alternates: { canonical: "/disclaimer" },
};

export default function DisclaimerPage() {
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
          <h1 className="min-w-0 flex-1 break-words text-lg font-bold leading-snug text-slate-800 dark:text-slate-100">Disclaimer</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="prose prose-slate max-w-none rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8 dark:prose-invert dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: 18 July 2026</p>

          <h2>Editorial disclaimer</h2>
          <p>
            The information published on <strong>MPSC PYQ QUIZ</strong> (mpscs.in) is provided for
            general informational and educational purposes only. Although we make sincere efforts
            to keep everything accurate and up to date, we make no representations or warranties
            of any kind, express or implied, about the completeness, accuracy, reliability,
            suitability or availability of the information, products, services or related content
            contained on the Service for any purpose.
          </p>
          <p>
            Any reliance you place on the information on the Service is therefore strictly at
            your own risk. In no event will Don&apos;t know Academy, its owner or its contributors
            be liable for any loss or damage (including, without limitation, loss of examination
            opportunities or career opportunities) arising from your use of the Service.
          </p>

          <h2>Not affiliated with MPSC</h2>
          <p>
            <strong>MPSC PYQ QUIZ</strong> is an independent educational platform. It is <strong>not
            affiliated with, endorsed by or operated on behalf of</strong>:
          </p>
          <ul>
            <li>the Maharashtra Public Service Commission (MPSC),</li>
            <li>the Government of Maharashtra,</li>
            <li>the Union Public Service Commission (UPSC),</li>
            <li>any state or central government body or agency.</li>
          </ul>
          <p>
            The words &quot;MPSC&quot;, &quot;Group B&quot;, &quot;Group C&quot;, &quot;PSI&quot;,
            &quot;Gazetted Civil Services&quot; and similar references identify examinations
            conducted by the Maharashtra Public Service Commission and are used only for
            descriptive, educational purposes. All trademarks, service marks and logos referenced
            on the Service belong to their respective owners.
          </p>

          <h2>Source of question papers and answer keys</h2>
          <p>
            The MPSC previous-year question papers and answer keys reproduced on the Service are
            sourced from material publicly released by the Maharashtra Public Service Commission
            on{" "}
            <a href="https://mpsc.gov.in" target="_blank" rel="noopener">mpsc.gov.in</a>. We use
            the official <strong>Set A</strong> version of each paper and the corresponding
            official answer key. Where MPSC has issued a revised key after an objection round, we
            use the revised key.
          </p>
          <p>
            For the most authoritative version of any question paper, answer key or notification,
            please always refer directly to the official MPSC website.
          </p>

          <h2>Explanations and study material</h2>
          <p>
            The <strong>explanations, study guides, subject tags, interactive map and other
            editorial content</strong> published on the Service are the original work of
            Don&apos;t know Academy. They are written using the official MPSC syllabus,
            NCERT textbooks (Classes 6–12 for History, Geography and Polity), the Constitution of
            India bare act, the Government of Maharashtra&apos;s public statistical handbooks and
            Economic Surveys, and standard reference works. These explanations are provided as
            study aids and are not a substitute for the original prescribed reading or the
            official MPSC syllabus and notifications.
          </p>

          <h2>No professional advice</h2>
          <p>
            Content on the Service does not constitute legal, financial, medical, career or
            professional advice. Career decisions related to MPSC selection, joining eligibility,
            reservation policy, service allocation and posting are governed by the applicable
            official rules and should be verified with the concerned authority.
          </p>

          <h2>No guarantee of examination outcomes</h2>
          <p>
            Practising with previous-year question papers is one of the most effective preparation
            strategies, and that is precisely the goal of this Service. However, the Service
            <strong> does not guarantee</strong> any particular examination score, rank, cut-off,
            selection or joining outcome. Success in MPSC examinations depends on many factors
            beyond practising previous-year questions.
          </p>

          <h2>Third-party links</h2>
          <p>
            The Service links to third-party websites (mpsc.gov.in, NCERT, news publications,
            OpenStreetMap and others). We do not control and are not responsible for the content,
            accuracy, availability or privacy practices of any third-party website. Any such link
            is provided for the reader&apos;s convenience only.
          </p>

          <h2>Advertising</h2>
          <p>
            Once the Service is enrolled with Google AdSense, third-party advertisements may be
            displayed on certain pages. We do not endorse any product, service, coaching institute,
            publisher or advertiser whose advertisement may appear on the Service. Any transaction
            you enter into with an advertiser is between you and that advertiser; we are not a
            party to it.
          </p>

          <h2>Reporting errors</h2>
          <p>
            If you spot a wrong answer key, an outdated study-guide fact, a broken link or any
            other error, please email us at{" "}
            <a href="mailto:dontknowacademy@gmail.com">dontknowacademy@gmail.com</a> or use the
            in-quiz <strong>Report</strong> button. We acknowledge every report within 24 hours
            and push a fix within 48 hours of acknowledgement.
          </p>

          <h2>Contact</h2>
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
              <Link href="/terms" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
