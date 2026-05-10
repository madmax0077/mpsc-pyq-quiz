"use client";

import {
  MH_HISTORY_CHAPTERS,
  MH_HISTORY_SUBTITLE_MR,
  MH_HISTORY_TITLE_EN,
  MH_HISTORY_TITLE_MR,
  MH_HISTORY_TOTAL_BULLETS,
  MH_HISTORY_TOTAL_CHAPTERS,
  MH_HISTORY_TOTAL_PAGES,
  type MhHistoryBlock,
  type MhHistoryChapter,
} from "@/lib/notesData/mhHistory";

/**
 * MhHistoryNotes
 * --------------
 * "आधुनिक महाराष्ट्राचा इतिहास" — 13-chapter Marathi notes pack rendered as
 * an attractive single-page reader. Each chapter gets its own gradient
 * banner, sub-heading chips, bulleted summary, and birth/death info chips
 * for the reformer biographies.
 *
 * Source content lives in `lib/notesData/mhHistoryContent.json`, generated
 * from the Santosh Chavan handout via `scripts/extract_mh_history_pdf.py`
 * (publisher branding stripped).
 */

const ROMAN_TO_DEV: Record<number, string> = {
  1: "१",
  2: "२",
  3: "३",
  4: "४",
  5: "५",
  6: "६",
  7: "७",
  8: "८",
  9: "९",
  10: "१०",
  11: "११",
  12: "१२",
  13: "१३",
};

function ChapterBlocks({ blocks }: { blocks: MhHistoryBlock[] }) {
  return (
    <div className="mt-5 space-y-3">
      {blocks.map((b, i) => {
        if (b.kind === "subhead") {
          return (
            <h4
              key={i}
              className="font-devanagari-serif scroll-mt-24 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3 text-lg font-extrabold text-orange-950 shadow-sm dark:border-orange-800/60 dark:bg-orange-950/30 dark:text-orange-200 sm:text-xl"
            >
              <span aria-hidden className="mr-2 text-orange-600 dark:text-orange-300">
                ❖
              </span>
              {b.text}
            </h4>
          );
        }
        if (b.kind === "info") {
          return (
            <div
              key={i}
              className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-medium text-amber-900 dark:border-amber-800/60 dark:bg-amber-900/20 dark:text-amber-200"
            >
              <span aria-hidden className="mt-0.5 text-base">
                📅
              </span>
              <span className="flex-1 leading-relaxed">{b.text}</span>
            </div>
          );
        }
        if (b.kind === "bullet") {
          return (
            <div
              key={i}
              className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <span
                aria-hidden
                className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-500 text-[11px] font-bold text-white shadow-sm"
              >
                ▸
              </span>
              <p className="flex-1 text-sm leading-relaxed text-slate-700 dark:text-slate-200 sm:text-[15px]">
                {b.text}
              </p>
            </div>
          );
        }
        // para
        return (
          <p
            key={i}
            className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700 dark:border-slate-700/60 dark:bg-slate-900/40 dark:text-slate-200 sm:text-[15px]"
          >
            {b.text}
          </p>
        );
      })}
    </div>
  );
}

function ChapterSection({
  chapter,
  index,
}: {
  chapter: MhHistoryChapter;
  index: number;
}) {
  return (
    <section
      id={`hist-${chapter.id}`}
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
    >
      {/* Banner */}
      <div
        className={`relative bg-gradient-to-r ${chapter.accent} p-5 text-white shadow-inner sm:p-6`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-slate-950/35"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
        />
        <div className="relative flex items-start gap-4">
          <span
            aria-hidden
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-3xl shadow-inner ring-1 ring-white/20 backdrop-blur"
          >
            {chapter.icon}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/95 drop-shadow">
              प्रकरण {ROMAN_TO_DEV[index + 1] ?? index + 1} ·
              Chapter {index + 1}
            </p>
            <h3
              lang="mr"
              className="font-devanagari-serif mt-1 text-2xl font-extrabold leading-tight text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] sm:text-3xl"
            >
              {chapter.titleMr}
            </h3>
            <p className="mt-1 text-sm font-semibold text-white drop-shadow sm:text-base">
              {chapter.titleEn}
            </p>
            <p
              lang="mr"
              className="font-devanagari-serif mt-2 text-sm font-medium text-white/95 drop-shadow sm:text-[15px]"
            >
              {chapter.subtitleMr}
            </p>
          </div>
        </div>

        {/* Tip strip */}
        <div className="relative mt-4 flex items-start gap-2 rounded-xl bg-white/20 px-3 py-2 text-white shadow-sm ring-1 ring-white/30 backdrop-blur">
          <span aria-hidden className="text-base">
            💡
          </span>
          <p
            lang="mr"
            className="font-devanagari-sans flex-1 text-xs leading-relaxed text-white/95 sm:text-sm"
          >
            <strong>Quick revision:</strong> {chapter.tip}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 sm:p-6">
        <ChapterBlocks blocks={chapter.blocks} />
      </div>
    </section>
  );
}

export default function MhHistoryNotes() {
  return (
    <article lang="mr" className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FF671F] via-[#D9482F] to-[#046A38] p-8 text-white shadow-lg sm:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-yellow-300/20 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 left-1/4 h-72 w-72 rounded-full bg-emerald-300/15 blur-3xl"
        />
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-100/95">
          Don&apos;t know Academy · Notes
        </p>
        <h2
          lang="mr"
          className="font-devanagari-serif mt-3 text-4xl font-extrabold leading-tight sm:text-5xl"
        >
          आधुनिक <span className="text-amber-200">महाराष्ट्राचा</span>{" "}
          इतिहास
        </h2>
        <p className="mt-2 text-base font-medium text-amber-50 sm:text-lg">
          {MH_HISTORY_TITLE_EN} — Complete Marathi Notes
        </p>
        <p
          lang="mr"
          className="font-devanagari-sans mt-3 max-w-3xl text-sm text-orange-50/90 sm:text-base"
        >
          {MH_HISTORY_SUBTITLE_MR}. १८०२ च्या वसईच्या तहापासून ते १९६० च्या
          संयुक्त महाराष्ट्र निर्मितीपर्यंत — सर्व १३ प्रकरणे एका दृष्टीक्षेपात.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium ring-1 ring-white/25 backdrop-blur">
            📚 MPSC · Rajyaseva · UPSC · STI · PSI
          </span>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium ring-1 ring-white/25 backdrop-blur">
            📖 {MH_HISTORY_TOTAL_CHAPTERS} प्रकरणे
          </span>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium ring-1 ring-white/25 backdrop-blur">
            ✦ {MH_HISTORY_TOTAL_BULLETS}+ revision points
          </span>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium ring-1 ring-white/25 backdrop-blur">
            📄 {MH_HISTORY_TOTAL_PAGES} pages condensed
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={`#hist-${MH_HISTORY_CHAPTERS[0]?.id ?? ""}`}
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-orange-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-amber-50 hover:shadow-md"
          >
            📖 वाचायला सुरुवात करा
          </a>
          <a
            href="#hist-toc"
            className="rounded-lg bg-white/15 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/30 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/25"
          >
            🗂️ अनुक्रमणिका
          </a>
        </div>
      </section>

      {/* About */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          या नोट्सबद्दल
        </h3>
        <p
          lang="mr"
          className="font-devanagari-sans mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
        >
          <strong>आधुनिक महाराष्ट्राचा इतिहास</strong> हा MPSC राज्यसेवा,
          संयुक्त गट-ब / क परीक्षा आणि UPSC यांसाठीचा अत्यंत महत्त्वाचा घटक
          आहे. या नोट्समध्ये माऊंट स्टुअर्ट एल्फिन्स्टनच्या सुधारणांपासून ते
          संयुक्त महाराष्ट्र चळवळीपर्यंतची संपूर्ण कथा{" "}
          <strong>{MH_HISTORY_TOTAL_CHAPTERS} प्रकरणांत</strong> मांडली आहे —
          सामाजिक व धार्मिक सुधारणा चळवळी, मराठी वृत्तपत्रांचा इतिहास, १८५७ चा
          उठाव, महात्मा फुले व सत्यशोधक समाज, आद्य क्रांतिकारक, क्रांतिकारी
          चळवळ, बाबासाहेब-पूर्व दलित चळवळ, गांधी युगातील सत्याग्रह व
          चलेजाव, मराठवाडा मुक्ती संग्राम आणि अखेर{" "}
          <strong>१ मे १९६० — महाराष्ट्र राज्याची निर्मिती</strong>.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          ⚠️ <strong>Read-only:</strong> टेक्स्ट निवडणे, कॉपी करणे, राइट-क्लिक
          आणि Ctrl+C / X / A / S / P / U सर्व ब्लॉक केलेले आहेत. नोट्स केवळ
          mpscs.in वर वाचण्यासाठी आहेत.
        </p>
      </section>

      {/* Table of contents */}
      <nav
        id="hist-toc"
        aria-label="अनुक्रमणिका"
        className="scroll-mt-24 rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 via-amber-50 to-emerald-50 p-5 dark:border-orange-900/40 dark:from-orange-900/10 dark:via-amber-900/10 dark:to-emerald-900/10 sm:p-6"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-700 dark:text-orange-300">
          अनुक्रमणिका · Table of Contents
        </p>
        <h3
          lang="mr"
          className="font-devanagari-serif mt-2 text-2xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-3xl"
        >
          {MH_HISTORY_TOTAL_CHAPTERS} प्रकरणे · एका दृष्टीक्षेपात
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          कोणत्याही प्रकरणावर क्लिक करून थेट तिथे जा.
        </p>

        <ol className="mt-5 grid gap-3 sm:grid-cols-2">
          {MH_HISTORY_CHAPTERS.map((c, i) => (
            <li key={c.id}>
              <a
                href={`#hist-${c.id}`}
                className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-orange-500"
              >
                <span
                  aria-hidden
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${c.accent} text-lg text-white shadow-sm`}
                >
                  {c.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    प्रकरण {ROMAN_TO_DEV[i + 1] ?? i + 1}
                  </p>
                  <h4
                    lang="mr"
                    className="font-devanagari-serif mt-0.5 text-sm font-bold text-slate-800 group-hover:text-orange-700 dark:text-slate-100 dark:group-hover:text-orange-300 sm:text-base"
                  >
                    {c.titleMr}
                  </h4>
                  <p className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    {c.titleEn}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Chapter sections */}
      <div className="space-y-8">
        {MH_HISTORY_CHAPTERS.map((c, i) => (
          <ChapterSection key={c.id} chapter={c} index={i} />
        ))}
      </div>

      {/* Source / footer */}
      <section className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 text-sm text-emerald-900/85 dark:border-emerald-800/60 dark:from-emerald-900/20 dark:to-teal-900/20 dark:text-emerald-100/85">
        <p>
          <strong>Source:</strong> Hand-curated revision notes for MPSC,
          Rajyaseva, STI, PSI, ASO and UPSC. हा compilation केवळ{" "}
          <strong>शैक्षणिक उद्देशासाठी</strong> आहे. कोणतीही चूक आढळल्यास{" "}
          <a className="underline" href="mailto:dontknowacademy@gmail.com">
            dontknowacademy@gmail.com
          </a>{" "}
          वर कळवा — 48 तासांत सुधारणा करू.
        </p>
      </section>
    </article>
  );
}
