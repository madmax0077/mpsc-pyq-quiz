import HomeClient from "@/components/HomeClient";
import { getQuizMeta } from "@/lib/quizMeta";

const meta = getQuizMeta();

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
          <p className="mt-3 text-sm text-slate-500">
            <a href="/exams" className="text-indigo-600 underline underline-offset-2 hover:text-indigo-700">
              Browse all MPSC exam papers ({minYear}–{maxYear}) &rarr;
            </a>
          </p>
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
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-slate-400">
            <a href="/exams" className="hover:text-indigo-600 hover:underline">Exam Papers</a>
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
