import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — MPSC PYQ QUIZ",
  description:
    "Privacy policy for MPSC PYQ QUIZ. How we handle your account data, quiz progress, cookies, advertising partners (Google AdSense), analytics, GDPR and DPDP rights, and children's privacy.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPolicy() {
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
          <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100">Privacy Policy</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="prose prose-slate max-w-none rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:prose-invert dark:border-slate-700 dark:bg-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">Effective date: 1 April 2026 · Last updated: April 2026</p>

          <h2>1. Who we are</h2>
          <p>
            This Privacy Policy describes how <strong>MPSC PYQ QUIZ</strong> (&quot;the Service&quot;,
            &quot;we&quot;, &quot;us&quot;, &quot;our&quot;), operated by <strong>Don&apos;t know
            Academy</strong>, a one-developer education project based in Pune, Maharashtra, India,
            collects, uses, stores, shares and protects information when you visit
            {" "}<strong>www.mpscs.in</strong> or use the Android / iOS apps that share the same
            backend.
          </p>
          <p>
            For any privacy-related question, you can email us at{" "}
            <a href="mailto:dontknowacademy@gmail.com">dontknowacademy@gmail.com</a>. We acknowledge
            every privacy request within 7 days.
          </p>

          <h2>2. Scope</h2>
          <p>
            This policy applies to all visitors and to all logged-in users of the Service. It
            applies regardless of whether you access the Service from India or outside India. It
            does <em>not</em> apply to third-party websites that we link to (mpsc.gov.in, NCERT,
            news websites, etc.) — those have their own policies.
          </p>

          <h2>3. Information we collect</h2>

          <h3>3.1 Account information (only if you choose to sign in)</h3>
          <p>
            We use <strong>Firebase Authentication</strong> (a Google service) to provide sign-in
            with Google or Apple. When you sign in we receive from the identity provider:
          </p>
          <ul>
            <li>Your full name, as it appears in your Google / Apple profile.</li>
            <li>Your email address.</li>
            <li>Your profile picture URL.</li>
            <li>A stable, non-public user ID assigned by Firebase.</li>
          </ul>
          <p>
            We do not receive your password. You can use the public pages and quiz practice areas
            without signing in. If you continue as a guest, we ask only for a display name and keep
            a random guest ID in your browser so the daily leaderboard can work.
          </p>

          <h3>3.2 Quiz activity and progress</h3>
          <p>
            When you attempt a quiz we record, in your browser&apos;s <code>localStorage</code> and
            (if you are signed in) in our Firestore database:
          </p>
          <ul>
            <li>Which quiz set you opened.</li>
            <li>Your answer to each question.</li>
            <li>Whether the answer was correct.</li>
            <li>The time you spent on each question.</li>
            <li>The final score and language used.</li>
          </ul>
          <p>
            If you submit a quiz, your daily aggregate score is also written to a public {""}
            <code>leaderboard</code> collection in Firestore so the {""}
            <Link href="/?mode=leaderboard">daily leaderboard</Link> can rank participants. The
            leaderboard publishes only your display name and, for signed-in users, profile picture
            — never your email address.
          </p>

          <h3>3.3 Device and log information</h3>
          <p>
            Like every web server, ours automatically receives certain technical information when
            you visit a page: your IP address, the browser type and version, the operating system,
            the page you requested, the page that referred you, and the time of the request. These
            logs are retained for up to 30 days for security and abuse-prevention purposes and are
            then deleted.
          </p>

          <h3>3.4 Cookies and similar technologies</h3>
          <p>
            We use the following cookies and similar technologies:
          </p>
          <ul>
            <li>
              <strong>Strictly necessary</strong>: a session cookie set by Firebase Authentication
              after you sign in. Without it you cannot stay logged in.
            </li>
            <li>
              <strong>Functional (localStorage)</strong>: we use your browser&apos;s
              <code>localStorage</code> (not a cookie) to remember your dark-mode preference, your
              language preference, and your in-progress quiz answers. This data never leaves your
              browser unless you are signed in.
            </li>
            <li>
              <strong>Analytics</strong>: we use Google Analytics (or a privacy-friendly equivalent)
              to understand which pages are visited and broadly which device types are used. The
              cookies set by Google Analytics are <code>_ga</code>, <code>_gid</code>,
              <code>_gat</code> and similar, with retention periods between 24 hours and 26 months.
              You can opt out using the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener">Google Analytics Opt-out Browser Add-on</a>.
            </li>
            <li>
              <strong>Advertising</strong>: third-party vendors, including Google, may use cookies
              to serve ads based on your prior visits to this and other websites. See section 4
              below for the full list and your opt-out controls.
            </li>
          </ul>

          <h2>4. Advertising — Google AdSense and partners</h2>
          <p>
            We are applying to enrol the Service with <strong>Google AdSense</strong> to display
            advertisements. Once enrolled:
          </p>
          <ul>
            <li>
              Google, as a third-party vendor, uses cookies to serve ads on the Service. Google&apos;s
              use of advertising cookies enables it and its partners to serve ads to you based on
              your visit to the Service and / or other sites on the Internet.
            </li>
            <li>
              You can opt out of personalised advertising by visiting{" "}
              <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener">Google Ads Settings</a>.
            </li>
            <li>
              Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for
              personalised advertising by visiting{" "}
              <a href="https://www.aboutads.info/" target="_blank" rel="noopener">www.aboutads.info</a>.
            </li>
            <li>
              Google&apos;s own privacy policy is available at{" "}
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">policies.google.com/technologies/ads</a>{" "}
              and the list of Google&apos;s ad-tech partners is at{" "}
              <a href="https://support.google.com/adspolicy/answer/9012903" target="_blank" rel="noopener">support.google.com/adspolicy/answer/9012903</a>.
            </li>
            <li>
              For users in the European Economic Area, the United Kingdom and Switzerland, we will
              show a Consent Management Platform (CMP) banner that complies with the IAB Europe
              Transparency &amp; Consent Framework (TCF v2). You may grant, refuse or withdraw your
              consent for personalised advertising at any time using the &quot;Manage cookie
              preferences&quot; link in the footer.
            </li>
            <li>
              We do not display interest-based advertising to users we know to be under the age of
              18.
            </li>
          </ul>

          <h2>5. How we use the information</h2>
          <p>We process the data above for the following purposes only:</p>
          <ul>
            <li>To authenticate you and keep you logged in across sessions.</li>
            <li>To save your quiz progress and analytics so you can resume.</li>
            <li>To display the daily leaderboard.</li>
            <li>To respond to your support, error-report and feedback requests.</li>
            <li>To detect, investigate and prevent abuse, fraud, spam or attacks.</li>
            <li>To measure, in aggregate, which features of the Service are used and which need improvement.</li>
            <li>To display advertisements (once AdSense is enabled) and to comply with applicable advertising-policy requirements.</li>
            <li>To comply with legal obligations under Indian law (including the Information Technology Act 2000 and the Digital Personal Data Protection Act 2023).</li>
          </ul>
          <p>
            We do <strong>not</strong> sell your personal data to anyone, and we do not share it with
            third parties for their own marketing purposes.
          </p>

          <h2>6. Where your data is stored</h2>
          <p>
            Your account data and quiz progress are stored in Google Firebase (Firestore and
            Firebase Authentication). Firebase is operated by Google LLC and the data is stored on
            Google Cloud servers, primarily in the <code>asia-south1</code> (Mumbai) region. By
            using the Service you agree to the transfer of your data to Google for processing as
            described in <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener">Firebase&apos;s privacy and security policy</a>.
          </p>

          <h2>7. Data retention</h2>
          <ul>
            <li>Account information: retained until you delete your account or for two years after your last activity, whichever is sooner.</li>
            <li>Quiz progress and analytics: retained until you delete your account.</li>
            <li>Leaderboard entries: retained for 30 days, then automatically purged.</li>
            <li>Server logs: retained for up to 30 days.</li>
            <li>Backups: retained for up to 30 days for disaster recovery, then overwritten.</li>
          </ul>

          <h2>8. Your rights</h2>
          <p>
            Depending on your country of residence, you have one or more of the following rights
            with respect to your personal data:
          </p>
          <ul>
            <li><strong>Access</strong> — request a copy of the personal data we hold about you.</li>
            <li><strong>Rectification</strong> — ask us to correct any inaccurate data.</li>
            <li><strong>Erasure</strong> — ask us to delete your data and your account.</li>
            <li><strong>Restriction</strong> — ask us to stop processing your data while a complaint is investigated.</li>
            <li><strong>Portability</strong> — ask for your data in a structured, machine-readable format.</li>
            <li><strong>Objection</strong> — object to specific processing activities, including direct marketing and personalised advertising.</li>
            <li><strong>Withdraw consent</strong> — at any time, where processing is based on your consent.</li>
            <li><strong>Lodge a complaint</strong> — with the Indian Data Protection Board (under the DPDP Act 2023) or, if you are an EEA / UK resident, with your local data protection authority.</li>
          </ul>
          <p>
            To exercise any of these rights, email us at{" "}
            <a href="mailto:dontknowacademy@gmail.com">dontknowacademy@gmail.com</a>. We will
            verify your identity (typically by replying from the same email address you used to
            sign in) and complete the request within 30 days.
          </p>

          <h2>9. Children&apos;s privacy</h2>
          <p>
            The Service is intended for adult MPSC aspirants (typically 21+ years of age) and is
            not directed at children under the age of 13. We do not knowingly collect personal data
            from children under 13. If you believe we have collected such data, please contact us
            and we will delete it promptly. Under the Indian DPDP Act 2023, we will not process the
            data of a person under 18 without verifiable parental consent and we will not display
            interest-based advertising to such users.
          </p>

          <h2>10. Security</h2>
          <p>
            We use industry-standard safeguards to protect your information:
          </p>
          <ul>
            <li>HTTPS / TLS for all traffic between your browser and our servers.</li>
            <li>Firestore security rules that prevent users from reading or modifying anyone else&apos;s data.</li>
            <li>Sign-in via Firebase Authentication (Google OAuth, Apple Sign-In) — we never see or store your password.</li>
            <li>The principle of least privilege for the small number of administrators who have read access to support tickets.</li>
          </ul>
          <p>
            No system is 100% secure, however. If we ever experience a personal-data breach that
            is likely to result in a high risk to your rights and freedoms, we will notify the
            Data Protection Board within the timelines required under the DPDP Act 2023 and will
            notify affected users by email within 72 hours of becoming aware of the breach.
          </p>

          <h2>11. Third-party services we rely on</h2>
          <ul>
            <li><strong>Google Firebase Authentication</strong> — sign-in functionality. <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener">Privacy policy</a>.</li>
            <li><strong>Google Cloud Firestore</strong> — leaderboard and progress storage. Same policy as above.</li>
            <li><strong>Google Hosting / Vercel / Cloudflare</strong> — hosting infrastructure for the Service.</li>
            <li><strong>Google Analytics</strong> — aggregate, anonymised usage analytics. <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google&apos;s privacy policy</a>.</li>
            <li><strong>Google AdSense</strong> (subject to approval) — advertising. <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">AdSense privacy policy</a>.</li>
            <li><strong>OpenStreetMap</strong> — basemap tiles for the Maharashtra map. <a href="https://wiki.osmfoundation.org/wiki/Privacy_Policy" target="_blank" rel="noopener">Privacy policy</a>.</li>
          </ul>

          <h2>12. Account deletion</h2>
          <p>
            To delete your account and all associated data, email us at{" "}
            <a href="mailto:dontknowacademy@gmail.com">dontknowacademy@gmail.com</a> from the
            address you used to sign in, with the subject line &quot;Delete my account&quot;. We
            will confirm receipt within 24 hours and complete the deletion within 7 days. Your
            past leaderboard entries will be anonymised. Server backups containing the data will be
            overwritten within the 30-day backup-retention window.
          </p>

          <h2>13. Changes to this policy</h2>
          <p>
            We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date
            at the top of this page reflects the date of the most recent change. Material changes
            will additionally be communicated through a banner on the home page for at least 14
            days. Continued use of the Service after the effective date of any change constitutes
            acceptance of the revised policy.
          </p>

          <h2>14. Contact</h2>
          <p>
            <strong>Don&apos;t know Academy (MPSC PYQ QUIZ)</strong><br />
            Email: <a href="mailto:dontknowacademy@gmail.com">dontknowacademy@gmail.com</a><br />
            Location: Pune, Maharashtra, India<br />
            Grievance Officer (DPDP Act 2023): the email address above.
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
              <Link href="/exams" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Exam papers</Link>
              <span>|</span>
              <Link href="/study-guides" className="hover:text-indigo-600 hover:underline dark:hover:text-indigo-400">Study guides</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
