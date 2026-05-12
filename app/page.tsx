import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";
import { getQuizMeta } from "@/lib/quizMeta";

const meta = getQuizMeta();

export const metadata: Metadata = {
  title: "MPSC PYQ QUIZ — Free PYQ Practice + Daily Leaderboard + Maharashtra Map",
  description: `Free MPSC Previous Year Question practice — ${meta.totalQuestions}+ questions from ${meta.totalPapers} exam papers (${meta.minYear}–${meta.maxYear}) in English & Marathi. Daily aggregate leaderboard, interactive Maharashtra map (rivers, forts, nuclear / hydro / thermal plants, UNESCO sites). 100% free, instant scoring, detailed answers.`,
  alternates: { canonical: "/" },
};

export default function Home() {
  const { examTitles, subjects, totalQuestions, totalPapers, minYear, maxYear } = meta;

  return (
    <>
      <HomeClient />

      {/* Static SEO content — always present in HTML for search engine crawlers.
          Hidden by HomeClient on mount via document.getElementById. */}
      <section id="seo-landing" className="bg-white text-slate-800">
        {/* Hero */}
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            MPSC PYQ QUIZ — Free Previous Year Question Practice
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Practice {totalQuestions.toLocaleString()}+ MPSC previous year questions from {totalPapers} exam papers ({minYear}–{maxYear}).
            Covering Group B, Group C, PSI, Gazetted Civil Services and Technical Services.
            Available in both English and Marathi. 100% free for all aspirants.
          </p>
          <p className="mt-6 text-sm font-medium text-indigo-600">
            Sign in to start practicing — instant scoring, detailed answers, daily quizzes &amp; streak tracking.
          </p>

          {/* What's new — quick links to the new features (also good for internal SEO) */}
          <div className="mx-auto mt-6 grid max-w-3xl gap-2 text-left sm:grid-cols-2 lg:grid-cols-4">
            <a
              href="/?mode=topic"
              className="rounded-lg border border-fuchsia-200 bg-fuchsia-50 px-3 py-2 text-sm hover:border-fuchsia-400 hover:bg-fuchsia-100 sm:col-span-2 lg:col-span-4"
            >
              <span className="block font-semibold text-fuchsia-800">🆕 GK 2025-26 Marathon — Last 6 months Current Affairs (Top 500 MCQs)</span>
              <span className="block text-xs text-fuchsia-700">Sports, science, awards, politics, schemes, economy — practice in 5-question sets under Topic Wise → Current Affairs → GK 2025-26 Marathon.</span>
            </a>
            <a
              href="/exams"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:border-indigo-300 hover:bg-indigo-50"
            >
              <span className="block font-semibold text-slate-800">📚 PYQ papers</span>
              <span className="block text-xs text-slate-500">Browse {totalPapers} exam papers ({minYear}–{maxYear})</span>
            </a>
            <a
              href="/study-guides"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:border-indigo-300 hover:bg-indigo-50"
            >
              <span className="block font-semibold text-slate-800">📖 Study guides</span>
              <span className="block text-xs text-slate-500">Geography, history, polity, exam pattern, strategy</span>
            </a>
            <a
              href="/map"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:border-indigo-300 hover:bg-indigo-50"
            >
              <span className="block font-semibold text-slate-800">🗺️ Maharashtra map</span>
              <span className="block text-xs text-slate-500">Rivers, forts, dams, UNESCO, power plants</span>
            </a>
            <a
              href="/?mode=leaderboard"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm hover:border-indigo-300 hover:bg-indigo-50"
            >
              <span className="block font-semibold text-slate-800">🏆 Daily leaderboard</span>
              <span className="block text-xs text-slate-500">Top 5 aggregate scorers of the day</span>
            </a>
          </div>
        </div>

        {/* Available Exam Papers */}
        <div className="border-t border-slate-100 bg-slate-50 py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              Available MPSC Exam Papers
            </h2>
            <p className="mb-6 text-slate-600">
              All question papers include the official answer key (Set A) with correct answers pre-marked.
              Each paper is available in both English and Marathi.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {examTitles.map((paper) => (
                <li key={paper} className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
                  <span className="text-indigo-500">&#10003;</span>
                  {paper}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Subject-wise Practice */}
        <div className="border-t border-slate-100 py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              Subject-wise Practice for MPSC Exams
            </h2>
            <p className="mb-6 text-slate-600">
              Questions are automatically categorized by subject so you can focus on your weak areas.
              Track your progress across each subject.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {subjects.filter(s => s.count >= 10).map((s) => (
                <div key={s.name} className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                  <p className="font-semibold text-slate-800">{s.name}</p>
                  <p className="text-sm text-slate-500">{s.count}+ questions</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="border-t border-slate-100 bg-slate-50 py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              Why Use MPSC PYQ QUIZ?
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="font-semibold text-slate-800">Previous Year Questions</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Practice with actual MPSC exam questions from {minYear} to {maxYear} — Group B, Group C, PSI, Gazetted Civil Services, and Technical Services prelims.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Instant Results & Explanations</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Submit your answers and get instant scoring with correct answer marking. Review every question after submission.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Bilingual — English & Marathi</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Every question paper is available in both English and Marathi. Switch languages anytime.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Daily Quiz & Streak Tracking</h3>
                <p className="mt-1 text-sm text-slate-600">
                  A new daily quiz with 10 random questions every day. Maintain your practice streak and track performance.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Subject-wise Analytics</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Track your progress in Indian Polity, History, Geography, Science, Economics, Current Affairs, and more.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">100% Free — No Hidden Charges</h3>
                <p className="mt-1 text-sm text-slate-600">
                  MPSC PYQ QUIZ is completely free for all MPSC aspirants. No subscriptions, no premium plans.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Maharashtra Map — SEO + internal link to /map */}
        <div className="border-t border-slate-100 py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="mb-2 text-2xl font-bold text-slate-900">
              Interactive Map of Maharashtra
            </h2>
            <p className="text-sm text-slate-500">
              Built specifically for MPSC geography — toggle layers, read inline river names, drop in to a fort.
            </p>
            <p className="mt-4 text-slate-600">
              The <a href="/map" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700">interactive map of Maharashtra</a> covers
              every major river of the state on a single high-resolution OpenStreetMap basemap. The Deccan east-flowing
              systems (Godavari, Krishna, Bhima, Tapi, Wardha, Wainganga, Painganga) and the Konkan west-flowing
              coastal rivers (Damanganga, Vaitarna, Ulhas, Patalganga, Amba, Kundalika, Savitri, Vashishti, Shastri,
              Kajli, Muchkundi, Gad, Karli, Terekhol) are drawn with thicker dark-blue lines, with 30+ tributaries
              (Koyna, Venna, Panchganga, Warna, Yerla, Dudhganga, Pravara, Manjira, Purna, Mula-Mutha, Indrayani,
              Nira, Pavna, Bhama, Ghod, Sina, Girna, Kanhan, Pench, Adan, Pus, Pinjal, Surya, Tansa, Bhatsa, …) drawn
              slightly thinner. Every river carries an inline name label so you can revise drainage at a glance.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                <p className="font-semibold text-slate-800">🌊 Dams &amp; waterfalls</p>
                <p className="mt-1 text-xs text-slate-500">Koyna, Jayakwadi, Bhandardara, Tansa, Ujani, Hatnur, Thoseghar, Vajrai, Lingmala…</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                <p className="font-semibold text-slate-800">⛰️ Sahyadri ghats</p>
                <p className="mt-1 text-xs text-slate-500">Tamhini, Amba, Malshej, Kasara, Bor, Varandha, Kumbharli, Khambatki…</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                <p className="font-semibold text-slate-800">☢️ Nuclear plants</p>
                <p className="mt-1 text-xs text-slate-500">Tarapur (operating) · Jaitapur (proposed)</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                <p className="font-semibold text-slate-800">🌀 Hydroelectric plants</p>
                <p className="mt-1 text-xs text-slate-500">Koyna, Bhira, Bhivpuri, Khopoli, Ghatghar, Pench, Vaitarna, Tillari, Yeldari…</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                <p className="font-semibold text-slate-800">🏭 Thermal plants</p>
                <p className="mt-1 text-xs text-slate-500">Chandrapur STPS, Koradi, Khaperkheda, Mauda, Tiroda, Parli, Bhusawal, Trombay, Dahanu, JSW Jaigad…</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                <p className="font-semibold text-slate-800">🚩 Historic forts</p>
                <p className="mt-1 text-xs text-slate-500">Raigad, Sinhagad, Pratapgad, Shivneri, Lohgad, Rajgad, Torna, Daulatabad, Panhala, Vijaydurg</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                <p className="font-semibold text-slate-800">🏛️ UNESCO sites</p>
                <p className="mt-1 text-xs text-slate-500">Ajanta, Ellora, Elephanta, CSMT, Victorian Gothic / Art Deco, Western Ghats</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                <p className="font-semibold text-slate-800">⛏️ Mineral belts</p>
                <p className="mt-1 text-xs text-slate-500">Manganese (Nagpur, Bhandara), Coal (Chandrapur, Wani), Bauxite (Kolhapur, Ratnagiri), Iron Ore (Sindhudurg, Gadchiroli)</p>
              </div>
            </div>
            <p className="mt-6 text-sm">
              <a href="/map" className="font-semibold text-indigo-600 underline underline-offset-2 hover:text-indigo-700">
                Open the interactive Maharashtra map &rarr;
              </a>
            </p>
          </div>
        </div>

        {/* Daily Leaderboard — SEO + internal link */}
        <div className="border-t border-slate-100 bg-slate-50 py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="mb-2 text-2xl font-bold text-slate-900">
              Daily Aggregate Leaderboard
            </h2>
            <p className="text-sm text-slate-500">
              Rank yourself against every other MPSC aspirant practicing today.
            </p>
            <p className="mt-4 text-slate-600">
              Sign in once and every quiz set you submit during the day counts towards your aggregate score. The
              <a href="/?mode=leaderboard" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700"> daily leaderboard </a>
              ranks the top five users by question-weighted average across all of their attempts that day, so the more
              sets you solve, the more accurate your standing becomes. Your rank, attempts and current accuracy are
              shown in a personal panel below the podium.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-3 text-sm text-slate-600">
              <p>&#10003; Question-weighted average — not just a single best score</p>
              <p>&#10003; Attempts counter so volume of practice is visible</p>
              <p>&#10003; Resets every day at midnight IST</p>
            </div>
            <p className="mt-6 text-sm">
              <a href="/?mode=leaderboard" className="font-semibold text-indigo-600 underline underline-offset-2 hover:text-indigo-700">
                See today&apos;s top scorers &rarr;
              </a>
            </p>
          </div>
        </div>

        {/* Study Guides — long-form internal-link section */}
        <div className="border-t border-slate-100 py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 id="study-guides" className="mb-2 text-2xl font-bold text-slate-900">
              Long-form MPSC Study Guides
            </h2>
            <p className="text-sm text-slate-500">
              Five comprehensive, exam-focused articles you can read in one sitting.
            </p>
            <p className="mt-4 text-slate-600">
              The static base for every MPSC prelim — Maharashtra geography, Maharashtra history,
              Indian polity, the exam pattern itself and a 6-month preparation plan — collected as
              long-form reference articles. Each guide is between 12 and 16 minutes long, written
              from the official syllabus and the NCERT base, and cross-linked with the matching
              papers on <a href="/exams" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700">/exams</a> and the layers of the
              <a href="/map" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700"> interactive map</a>.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <a href="/study-guides/maharashtra-geography" className="rounded-lg border border-slate-200 bg-white px-4 py-3 hover:border-indigo-300 hover:bg-indigo-50">
                <p className="font-semibold text-slate-800">🗺️ Maharashtra Geography</p>
                <p className="mt-1 text-xs text-slate-500">Konkan, Sahyadri, Deccan plateau, rivers, soils, agriculture, minerals, power, landmarks.</p>
              </a>
              <a href="/study-guides/maharashtra-history" className="rounded-lg border border-slate-200 bg-white px-4 py-3 hover:border-indigo-300 hover:bg-indigo-50">
                <p className="font-semibold text-slate-800">🏛️ Maharashtra History</p>
                <p className="mt-1 text-xs text-slate-500">Satavahanas, Yadavas, Maratha Empire under Chhatrapati Shivaji Maharaj, Peshwas, British era, 1960 state formation.</p>
              </a>
              <a href="/study-guides/indian-polity-for-mpsc" className="rounded-lg border border-slate-200 bg-white px-4 py-3 hover:border-indigo-300 hover:bg-indigo-50">
                <p className="font-semibold text-slate-800">⚖️ Indian Polity for MPSC</p>
                <p className="mt-1 text-xs text-slate-500">Constitution, Fundamental Rights, DPSPs, Parliament, state government, Panchayati Raj, key amendments.</p>
              </a>
              <a href="/study-guides/mpsc-exam-pattern" className="rounded-lg border border-slate-200 bg-white px-4 py-3 hover:border-indigo-300 hover:bg-indigo-50">
                <p className="font-semibold text-slate-800">📋 MPSC Exam Pattern</p>
                <p className="mt-1 text-xs text-slate-500">Group B, Group C, PSI, Gazetted CS &amp; TS prelims — marks, syllabus, negative marking, cut-offs.</p>
              </a>
              <a href="/study-guides/mpsc-preparation-strategy" className="rounded-lg border border-slate-200 bg-white px-4 py-3 hover:border-indigo-300 hover:bg-indigo-50 sm:col-span-2">
                <p className="font-semibold text-slate-800">🎯 MPSC Preparation Strategy</p>
                <p className="mt-1 text-xs text-slate-500">A practical 6-month study plan — book list, daily routine, PYQ analysis, mock-test approach, last-month revision blueprint.</p>
              </a>
            </div>
            <p className="mt-6 text-sm">
              <a href="/study-guides" className="font-semibold text-indigo-600 underline underline-offset-2 hover:text-indigo-700">
                Open the study-guides hub &rarr;
              </a>
            </p>
          </div>
        </div>

        {/* FAQ for SEO */}
        <div className="border-t border-slate-100 py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-800">What is MPSC PYQ QUIZ?</h3>
                <p className="mt-1 text-sm text-slate-600">
                  MPSC PYQ QUIZ is a free online platform by Don&#39;t know Academy that helps Maharashtra Public Service Commission (MPSC) aspirants practice with previous year questions. It covers Group B, Group C, PSI, and Gazetted Services prelims from {minYear} to {maxYear}.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">How many questions are available?</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Currently there are {totalQuestions.toLocaleString()}+ questions from {totalPapers} different MPSC exam papers, available in both English and Marathi.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Is MPSC PYQ QUIZ free?</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Yes, MPSC PYQ QUIZ is 100% free. There are no subscriptions, premium plans, or hidden charges. All aspirants can access every question paper and feature at no cost.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Which MPSC exams are covered?</h3>
                <p className="mt-1 text-sm text-slate-600">
                  The platform covers MPSC Group B Combined Pre, MPSC Group C Combined Pre, MPSC PSI Pre, MPSC Gazetted Civil Services Combined Pre, and MPSC Gazetted Technical Services Combined Pre exams from {minYear} through {maxYear}.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Are the answers verified?</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Yes, all answers are based on the official MPSC answer key (Set A) published after each exam.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">How does the daily leaderboard work?</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Every quiz set you submit during the day counts towards your aggregate score. The leaderboard ranks
                  users by question-weighted average (sum of correct answers ÷ sum of attempted questions) across all
                  of their attempts that day, so the more sets you solve the more accurate your standing becomes.
                  Your rank resets at midnight IST. <a href="/?mode=leaderboard" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700">Open today&apos;s leaderboard</a>.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">What does the interactive Maharashtra map include?</h3>
                <p className="mt-1 text-sm text-slate-600">
                  The <a href="/map" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700">/map page</a> shows every major
                  river of Maharashtra (Godavari, Krishna, Bhima, Tapi, Wardha, Wainganga, Painganga) and all the
                  Konkan coastal rivers (Damanganga, Vaitarna, Ulhas, Patalganga, Amba, Kundalika, Savitri, Vashishti,
                  Shastri, Karli, Terekhol) with 30+ tributaries and inline name labels. Toggleable layers add dams,
                  waterfalls, ghats, separate Nuclear / Hydro / Thermal power plants, mineral belts, UNESCO sites and
                  historic forts marked with the saffron flag.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Marathi SEO Content */}
        <div className="border-t border-slate-100 bg-slate-50 py-12">
          <div className="mx-auto max-w-4xl px-4 sm:px-6">
            <h2 className="mb-4 text-2xl font-bold text-slate-900">
              MPSC मागील वर्षाच्या प्रश्नपत्रिका — मोफत ऑनलाइन सराव
            </h2>
            <p className="text-slate-600">
              MPSC PYQ QUIZ हे MPSC परीक्षेच्या तयारीसाठी एक मोफत ऑनलाइन व्यासपीठ आहे. येथे तुम्ही गट ब, गट क, PSI, राजपत्रित नागरी सेवा आणि तांत्रिक सेवा प्रारंभिक परीक्षांच्या ({minYear}–{maxYear}) मागील वर्षाच्या प्रश्नपत्रिका सोडवू शकता. सर्व प्रश्नपत्रिका इंग्रजी आणि मराठी दोन्ही भाषांमध्ये उपलब्ध आहेत. {totalQuestions.toLocaleString()}+ प्रश्न, तात्काळ गुणांकन, आणि विषयनिहाय सराव — सर्व काही 100% मोफत.
            </p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 text-sm text-slate-600">
              <p>&#10003; MPSC गट ब संयुक्त पूर्व परीक्षा</p>
              <p>&#10003; MPSC गट क संयुक्त पूर्व परीक्षा</p>
              <p>&#10003; MPSC PSI पूर्व परीक्षा</p>
              <p>&#10003; MPSC राजपत्रित नागरी सेवा पूर्व परीक्षा</p>
              <p>&#10003; MPSC राजपत्रित तांत्रिक सेवा पूर्व परीक्षा</p>
              <p>&#10003; अधिकृत उत्तरतालिका (Set A) समाविष्ट</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 py-8 text-center">
          <p className="text-sm text-slate-500">
            MPSC PYQ QUIZ &middot; Don&#39;t know Academy
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Free MPSC previous year question practice for all aspirants
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-400">
            <a href="/exams" className="hover:text-indigo-600 hover:underline">Exam Papers</a>
            <span>|</span>
            <a href="/study-guides" className="hover:text-indigo-600 hover:underline">Study Guides</a>
            <span>|</span>
            <a href="/map" className="hover:text-indigo-600 hover:underline">Maharashtra Map</a>
            <span>|</span>
            <a href="/?mode=leaderboard" className="hover:text-indigo-600 hover:underline">Daily Leaderboard</a>
            <span>|</span>
            <a href="/about" className="hover:text-indigo-600 hover:underline">About</a>
            <span>|</span>
            <a href="/contact" className="hover:text-indigo-600 hover:underline">Contact</a>
            <span>|</span>
            <a href="/privacy" className="hover:text-indigo-600 hover:underline">Privacy Policy</a>
          </div>
        </div>
      </section>
    </>
  );
}
