"use client";

import {
  SAMAJ_CHAPTERS,
  SAMAJ_SUBTITLE_MR,
  SAMAJ_TITLE_MR,
  SAMAJ_TOTAL_BULLETS,
  SAMAJ_TOTAL_CHAPTERS,
  SAMAJ_TOTAL_PAGES,
  type SamajBlock,
  type SamajChapter,
} from "@/lib/notesData/samajsudharak";

/**
 * समाजसुधारक नोट्स — केवळ मराठी.
 * सुधारक-वार पुनरावृत्ती. शीर्षकांसाठी चित्र (विकिमीडिया).
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
  14: "१४",
  15: "१५",
  16: "१६",
  17: "१७",
  18: "१८",
  19: "१९",
  20: "२०",
  21: "२१",
};

function Portrait({
  chapter,
  size = "lg",
}: {
  chapter: SamajChapter;
  size?: "sm" | "lg";
}) {
  const box =
    size === "lg"
      ? "h-14 w-14 sm:h-16 sm:w-16"
      : "h-10 w-10";
  const initials =
    chapter.titleMr.replace(/[^\u0900-\u097F]/g, "").slice(0, 2) || "सु";

  if (chapter.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={chapter.image}
        alt={chapter.titleMr}
        width={size === "lg" ? 64 : 40}
        height={size === "lg" ? 64 : 40}
        loading="lazy"
        className={`${box} shrink-0 rounded-2xl object-cover shadow-inner ring-1 ring-white/30`}
      />
    );
  }

  return (
    <span
      aria-hidden
      className={`${box} flex shrink-0 items-center justify-center rounded-2xl bg-white/20 text-lg font-bold text-white shadow-inner ring-1 ring-white/25`}
    >
      {initials}
    </span>
  );
}

function ChapterBlocks({ blocks }: { blocks: SamajBlock[] }) {
  return (
    <div className="mt-5 space-y-3">
      {blocks.map((b, i) => {
        if (b.kind === "subhead") {
          return (
            <h4
              key={i}
              className="font-devanagari-serif scroll-mt-24 rounded-xl border border-violet-200 bg-violet-50 px-4 py-3 text-lg font-extrabold text-violet-950 shadow-sm dark:border-violet-800/60 dark:bg-violet-950/30 dark:text-violet-200 sm:text-xl"
            >
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
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-violet-500"
              />
              <p className="flex-1 text-sm leading-relaxed text-slate-700 dark:text-slate-200 sm:text-[15px]">
                {b.text}
              </p>
            </div>
          );
        }
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
  chapter: SamajChapter;
  index: number;
}) {
  return (
    <section
      id={`samaj-${chapter.id}`}
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
    >
      <div
        className={`relative bg-gradient-to-r ${chapter.accent} p-5 text-white shadow-inner sm:p-6`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-slate-950/35"
        />
        <div className="relative flex items-start gap-4">
          <Portrait chapter={chapter} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-white/95 drop-shadow">
              सुधारक {ROMAN_TO_DEV[index + 1] ?? index + 1}
            </p>
            <h3
              lang="mr"
              className="font-devanagari-serif mt-1 text-2xl font-extrabold leading-tight text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.7)] sm:text-3xl"
            >
              {chapter.titleMr}
            </h3>
            <p
              lang="mr"
              className="font-devanagari-serif mt-2 text-sm font-medium text-white/95 drop-shadow sm:text-[15px]"
            >
              {chapter.subtitleMr}
            </p>
          </div>
        </div>

        <div className="relative mt-4 flex items-start gap-2 rounded-xl bg-white/20 px-3 py-2 text-white shadow-sm ring-1 ring-white/30 backdrop-blur">
          <p
            lang="mr"
            className="font-devanagari-sans flex-1 text-xs leading-relaxed text-white/95 sm:text-sm"
          >
            <strong>जलद पुनरावृत्ती:</strong> {chapter.tip}
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <ChapterBlocks blocks={chapter.blocks} />
      </div>
    </section>
  );
}

export default function SamajsudharakNotes() {
  return (
    <article lang="mr" className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-700 via-fuchsia-600 to-amber-500 p-8 text-white shadow-lg sm:p-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-yellow-300/20 blur-3xl"
        />
        <p className="text-xs font-semibold tracking-[0.22em] text-violet-100/95">
          डोन्ट नो अकादमी · नोट्स
        </p>
        <h2
          lang="mr"
          className="font-devanagari-serif mt-3 text-4xl font-extrabold leading-tight sm:text-5xl"
        >
          समाज<span className="text-amber-200">सुधारक</span>
        </h2>
        <p
          lang="mr"
          className="font-devanagari-sans mt-3 max-w-3xl text-sm text-violet-50/90 sm:text-base"
        >
          {SAMAJ_SUBTITLE_MR}. आंबेडकर, फुले, वि. रा. शिंदे, कर्वे, रानडे,
          रमाबाई आणि इतर प्रमुख सुधारकांच्या तारखा, संस्था, वृत्तपत्रे व ग्रंथ —
          एकाच ठिकाणी.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium ring-1 ring-white/25 backdrop-blur">
            एमपीएससी · राज्यसेवा · यूपीएससी · एसटीआय · पीएसआय
          </span>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium ring-1 ring-white/25 backdrop-blur">
            {SAMAJ_TOTAL_CHAPTERS} सुधारक
          </span>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium ring-1 ring-white/25 backdrop-blur">
            {SAMAJ_TOTAL_BULLETS}+ पुनरावृत्ती मुद्दे
          </span>
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium ring-1 ring-white/25 backdrop-blur">
            {SAMAJ_TOTAL_PAGES} पृष्ठे संक्षिप्त
          </span>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={`#samaj-${SAMAJ_CHAPTERS[0]?.id ?? ""}`}
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-violet-700 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-amber-50 hover:shadow-md"
          >
            वाचायला सुरुवात करा
          </a>
          <a
            href="#samaj-toc"
            className="rounded-lg bg-white/15 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/30 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/25"
          >
            अनुक्रमणिका
          </a>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          या नोट्सबद्दल
        </h3>
        <p
          lang="mr"
          className="font-devanagari-sans mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300"
        >
          <strong>{SAMAJ_TITLE_MR}</strong> हे एमपीएससी राज्यसेवा व संबंधित
          परीक्षांसाठी तयार केलेले पुनरावृत्ती नोट्स आहेत. प्रत्येक सुधारकासाठी
          जन्म/पदव्या, संस्था, वृत्तपत्रे, सत्याग्रह, ग्रंथ आणि परीक्षेसाठी उपयुक्त
          जलद टिप्स दिले आहेत. छायाचित्रे विकिमीडिया कॉमन्स / विकिपीडियाच्या
          मुक्त स्रोतांवरून घेतली आहेत.
        </p>
        <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          <strong>केवळ वाचन:</strong> मजकूर निवडणे, कॉपी करणे, उजवे-क्लिक आणि
          नियंत्रण+सी / एक्स / ए / एस / पी / यू सर्व बंद केलेले आहेत.
        </p>
      </section>

      <nav
        id="samaj-toc"
        aria-label="अनुक्रमणिका"
        className="scroll-mt-24 rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 via-fuchsia-50 to-amber-50 p-5 dark:border-violet-900/40 dark:from-violet-900/10 dark:via-fuchsia-900/10 dark:to-amber-900/10 sm:p-6"
      >
        <p className="text-xs font-semibold tracking-[0.2em] text-violet-700 dark:text-violet-300">
          अनुक्रमणिका
        </p>
        <h3
          lang="mr"
          className="font-devanagari-serif mt-2 text-2xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-3xl"
        >
          {SAMAJ_TOTAL_CHAPTERS} सुधारक · एका दृष्टीक्षेपात
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          कोणत्याही सुधारकावर क्लिक करून थेट तिथे जा.
        </p>

        <ol className="mt-5 grid gap-3 sm:grid-cols-2">
          {SAMAJ_CHAPTERS.map((c, i) => (
            <li key={c.id}>
              <a
                href={`#samaj-${c.id}`}
                className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-violet-500"
              >
                <span className="relative shrink-0 overflow-hidden rounded-xl ring-1 ring-slate-200 dark:ring-slate-600">
                  {c.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.image}
                      alt=""
                      width={40}
                      height={40}
                      loading="lazy"
                      className="h-10 w-10 object-cover"
                    />
                  ) : (
                    <span
                      className={`flex h-10 w-10 items-center justify-center bg-gradient-to-br ${c.accent} text-xs font-bold text-white`}
                    >
                      {ROMAN_TO_DEV[i + 1] ?? i + 1}
                    </span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-500">
                    सुधारक {ROMAN_TO_DEV[i + 1] ?? i + 1}
                  </p>
                  <h4
                    lang="mr"
                    className="font-devanagari-serif mt-0.5 text-sm font-bold text-slate-800 group-hover:text-violet-700 dark:text-slate-100 dark:group-hover:text-violet-300 sm:text-base"
                  >
                    {c.titleMr}
                  </h4>
                  <p
                    lang="mr"
                    className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400"
                  >
                    {c.subtitleMr}
                  </p>
                </div>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="space-y-8">
        {SAMAJ_CHAPTERS.map((c, i) => (
          <ChapterSection key={c.id} chapter={c} index={i} />
        ))}
      </div>
    </article>
  );
}
