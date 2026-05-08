"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MH_GEO_CHAPTERS,
  MH_GEO_PARTS,
  MH_GEO_PDF_HREF,
  MH_GEO_TOTAL_PAGES,
  type MhGeoChapter,
} from "@/lib/notesData/mhGeography";
import contentData from "@/lib/notesData/mhGeographyContent.json";

const TOTAL_CHAPTERS = MH_GEO_CHAPTERS.length;

type RawSection = { page: number; text: string };
type RawChapter = {
  number: string;
  titleEn: string;
  titleMr: string;
  pageStart: number;
  pageEnd: number;
  part: 1 | 2;
  tip: string;
  body: RawSection[];
};

const CONTENT = contentData as { chapters: RawChapter[] };
const CONTENT_BY_NUMBER = new Map<string, RawChapter>(
  CONTENT.chapters.map((c) => [c.number, c]),
);

export default function MhGeographyNotes() {
  const [active, setActive] = useState<MhGeoChapter | null>(null);

  useEffect(() => {
    if (active) {
      requestAnimationFrame(() => {
        const el = document.getElementById("mh-geo-reader-top");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [active?.number]);

  if (active) {
    return (
      <ReaderView
        chapter={active}
        onBack={() => setActive(null)}
        onSelect={(c) => setActive(c)}
      />
    );
  }
  return <BrowseView onSelect={(c) => setActive(c)} />;
}

/* ------------------------------------------------------------------ */
/* Browse view                                                        */
/* ------------------------------------------------------------------ */
function BrowseView({ onSelect }: { onSelect: (c: MhGeoChapter) => void }) {
  return (
    <article className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0d1638] via-[#16265c] to-[#1f3175] p-8 text-white shadow-xl sm:p-10">
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-orange-400/25 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 left-1/3 h-72 w-72 rounded-full bg-amber-300/15 blur-3xl"
          aria-hidden
        />
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-300">
          Don&apos;t know Academy · Notes
        </p>
        <h2 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">
          Maharashtra <span className="text-amber-300">Geography</span>
        </h2>
        <p
          lang="mr"
          className="font-devanagari-serif mt-2 text-2xl font-bold text-amber-50/95 sm:text-3xl"
        >
          महाराष्ट्र भूगोल — संपूर्ण नोट्स
        </p>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-200/95 sm:text-base">
          A typeset, copy-protected revision pack — every chapter rendered in
          modern Noto Devanagari with calm colours, clear bullets and clean
          spacing. {TOTAL_CHAPTERS} chapters · one focused study session.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Pill>📚 MPSC · Rajyaseva · UPSC · RTO AMVI</Pill>
          <Pill>📖 {TOTAL_CHAPTERS} chapters</Pill>
          <Pill>📄 {MH_GEO_TOTAL_PAGES} pages of source</Pill>
          <Pill>🎨 2026 typeset edition</Pill>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={MH_GEO_PDF_HREF}
            download
            className="rounded-lg bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-amber-300 hover:shadow-md"
          >
            ⬇ Download printable PDF
          </a>
          <button
            onClick={() => onSelect(MH_GEO_CHAPTERS[0])}
            className="rounded-lg bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/20 backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/15"
          >
            📖 Start reading
          </button>
        </div>
      </section>

      {/* About strip */}
      <section className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-orange-50 p-6 shadow-sm dark:border-amber-900/40 dark:from-slate-800 dark:to-slate-900">
        <div className="flex items-start gap-3">
          <span className="text-2xl" aria-hidden>
            📓
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              About this typeset edition
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              The full Marathi notes have been re-rendered in Noto Serif &amp;
              Sans Devanagari with consistent bullet styling and a calm cream /
              navy / saffron palette tuned for long reading sessions.
              Highlight boxes pull out exam-ready facts; chapter banners orient
              you between sections.
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
              Pages stay copy-protected on screen. For offline revision use the
              Download button above.
            </p>
          </div>
        </div>
      </section>

      {/* Parts + chapter grid */}
      {MH_GEO_PARTS.map((part) => {
        const chs = MH_GEO_CHAPTERS.filter((c) => c.part === part.id);
        return (
          <section key={part.id}>
            <header className="mb-4 flex flex-wrap items-end justify-between gap-2 border-l-4 border-amber-500 pl-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  {part.label}
                </p>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {part.titleEn}
                </h3>
                <p
                  lang="mr"
                  className="font-devanagari-serif text-base text-slate-500 dark:text-slate-400"
                >
                  {part.titleMr}
                </p>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {chs.length} chapters · {chs.reduce((a, c) => a + (c.pageEnd - c.pageStart + 1), 0)} pages
              </p>
            </header>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {chs.map((ch) => (
                <ChapterCard key={ch.number} ch={ch} onClick={() => onSelect(ch)} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Footer credit */}
      <section className="rounded-2xl border border-dashed border-slate-200 p-5 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
        Published by Don&apos;t know Academy · mpscs.in · 2026 typeset edition · Free
        for personal MPSC / Rajyaseva preparation. Redistribution prohibited.
      </section>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Chapter card                                                       */
/* ------------------------------------------------------------------ */
function ChapterCard({
  ch,
  onClick,
}: {
  ch: MhGeoChapter;
  onClick: () => void;
}) {
  const pageCount = ch.pageEnd - ch.pageStart + 1;
  return (
    <button
      onClick={onClick}
      className="group relative flex min-h-[148px] flex-col overflow-hidden rounded-xl border-2 border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-amber-500"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500" />
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-base font-extrabold text-amber-700 group-hover:bg-amber-500 group-hover:text-white dark:bg-amber-900/40 dark:text-amber-300">
          {ch.number}
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">
            {ch.titleEn}
          </h4>
          <p
            lang="mr"
            className="font-devanagari-serif truncate text-base font-semibold text-slate-700 dark:text-slate-200"
          >
            {ch.titleMr}
          </p>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
        💡 {ch.tip}
      </p>
      <div className="mt-auto flex items-center justify-between pt-3 text-[11px] font-medium text-slate-400 dark:text-slate-500">
        <span>
          {pageCount} {pageCount === 1 ? "page" : "pages"} · pp.{" "}
          {ch.pageStart}–{ch.pageEnd}
        </span>
        <span className="text-amber-600 group-hover:text-amber-700 dark:text-amber-400">
          Read →
        </span>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Reader view — typeset chapter content                              */
/* ------------------------------------------------------------------ */
function ReaderView({
  chapter,
  onBack,
  onSelect,
}: {
  chapter: MhGeoChapter;
  onBack: () => void;
  onSelect: (c: MhGeoChapter) => void;
}) {
  const idx = MH_GEO_CHAPTERS.findIndex((c) => c.number === chapter.number);
  const prev = idx > 0 ? MH_GEO_CHAPTERS[idx - 1] : null;
  const next =
    idx < MH_GEO_CHAPTERS.length - 1 ? MH_GEO_CHAPTERS[idx + 1] : null;
  const data = CONTENT_BY_NUMBER.get(chapter.number);
  const sections = data?.body ?? [];

  return (
    <article id="mh-geo-reader-top" className="space-y-6">
      {/* Sticky toolbar */}
      <div className="sticky top-0 z-10 -mx-2 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/95">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <button
            onClick={onBack}
            className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
          >
            ← All chapters
          </button>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Chapter {chapter.number} of {TOTAL_CHAPTERS}
            </p>
            <h3 className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
              {chapter.titleEn}
            </h3>
          </div>
        </div>
        <a
          href={MH_GEO_PDF_HREF}
          download
          className="hidden shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-amber-400 sm:inline-flex"
        >
          ⬇ Full PDF
        </a>
      </div>

      {/* Chapter banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d1638] via-[#16265c] to-[#9c4221] p-6 text-white shadow-md sm:p-8">
        <div
          className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl"
          aria-hidden
        />
        <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-300">
          {chapter.part === 1
            ? "Part 1 · Maharashtra Geography"
            : "Part 2 · Other Important Topics"}
        </p>
        <h2 className="mt-1.5 text-2xl font-extrabold sm:text-3xl">
          {chapter.titleEn}
        </h2>
        <p
          lang="mr"
          className="font-devanagari-serif mt-1 text-2xl font-bold text-amber-50/95 sm:text-3xl"
        >
          {chapter.titleMr}
        </p>
        <p className="mt-3 max-w-2xl text-sm text-slate-200/90">
          💡 <strong>Study tip:</strong> {chapter.tip}
        </p>
        <p className="mt-3 text-xs text-slate-400">
          Source pages {chapter.pageStart}–{chapter.pageEnd} ·{" "}
          {chapter.pageEnd - chapter.pageStart + 1}{" "}
          {chapter.pageEnd - chapter.pageStart + 1 === 1 ? "page" : "pages"}
        </p>
      </section>

      {/* Typeset content */}
      <div className="space-y-6">
        {sections.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400">
            Typeset content for this chapter is being prepared. Please use the
            downloadable PDF for now.
          </div>
        ) : (
          sections.map((s) => <SectionCard key={s.page} section={s} />)
        )}
      </div>

      {/* Prev / Next chapter nav */}
      <nav className="grid gap-3 pt-2 sm:grid-cols-2">
        {prev ? (
          <button
            onClick={() => onSelect(prev)}
            className="rounded-xl border-2 border-slate-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-amber-400 hover:shadow dark:border-slate-700 dark:bg-slate-800"
          >
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              ← Previous · Ch {prev.number}
            </p>
            <p className="mt-1 truncate text-sm font-bold text-slate-800 dark:text-slate-100">
              {prev.titleEn}
            </p>
            <p
              lang="mr"
              className="font-devanagari-serif truncate text-sm text-slate-500 dark:text-slate-400"
            >
              {prev.titleMr}
            </p>
          </button>
        ) : (
          <span aria-hidden />
        )}
        {next ? (
          <button
            onClick={() => onSelect(next)}
            className="rounded-xl border-2 border-slate-200 bg-white p-4 text-right transition-all hover:-translate-y-0.5 hover:border-amber-400 hover:shadow dark:border-slate-700 dark:bg-slate-800"
          >
            <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Next · Ch {next.number} →
            </p>
            <p className="mt-1 truncate text-sm font-bold text-slate-800 dark:text-slate-100">
              {next.titleEn}
            </p>
            <p
              lang="mr"
              className="font-devanagari-serif truncate text-sm text-slate-500 dark:text-slate-400"
            >
              {next.titleMr}
            </p>
          </button>
        ) : (
          <button
            onClick={onBack}
            className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4 text-right transition-all hover:-translate-y-0.5 hover:border-amber-400 hover:shadow dark:border-amber-800 dark:bg-amber-900/30"
          >
            <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              You finished the notes 🎉
            </p>
            <p className="mt-1 text-sm font-bold text-amber-800 dark:text-amber-200">
              Back to the chapter index
            </p>
          </button>
        )}
      </nav>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Per-page typeset card                                              */
/* ------------------------------------------------------------------ */
function SectionCard({ section }: { section: RawSection }) {
  const blocks = useMemo(() => parseBlocks(section.text), [section.text]);
  return (
    <figure className="overflow-hidden rounded-2xl border border-amber-100 bg-[#FDF8F1] shadow-sm dark:border-slate-700 dark:bg-slate-800/60">
      <div className="border-b border-amber-100/70 bg-white/70 px-4 py-2 text-[11px] font-semibold uppercase tracking-widest text-amber-700 dark:border-slate-700 dark:bg-slate-800 dark:text-amber-300">
        Page {section.page} / {MH_GEO_TOTAL_PAGES}
      </div>
      <div
        lang="mr"
        className="font-devanagari space-y-3 px-5 py-5 text-[15px] leading-[1.85] text-slate-800 sm:px-7 sm:py-6 sm:text-base dark:text-slate-200"
      >
        {blocks.map((b, i) => (
          <Block key={i} block={b} />
        ))}
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Block parsing & rendering                                          */
/* ------------------------------------------------------------------ */
type Block =
  | { kind: "heading"; text: string }
  | { kind: "highlight"; label: string; value: string }
  | { kind: "bullet"; text: string }
  | { kind: "numbered"; text: string }
  | { kind: "para"; text: string };

const HIGHLIGHT_KEYS = [
  "उगम",
  "लांबी",
  "क्षेत्र",
  "उपनद्या",
  "क्षमता",
  "स्थापना",
  "स्थान",
  "विस्तार",
  "आकार",
  "मार्ग",
  "मुख्यालय",
  "धरण",
  "संगम",
];

function parseBlocks(text: string): Block[] {
  const lines = text.split("\n");
  const out: Block[] = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;

    // A line that starts with "•" or "-" treated as a bullet
    if (/^[•\-\u2022]\s*/.test(line)) {
      const body = line.replace(/^[•\-\u2022]\s*/, "").trim();
      if (!body) continue;
      // If the bullet content is a "key : value" with a known highlight key,
      // surface it as a highlight box.
      const m = body.match(/^([\u0900-\u097F\s]{2,15}?)\s*[:：]\s*(.+)$/);
      if (m && HIGHLIGHT_KEYS.some((k) => m[1].includes(k))) {
        out.push({ kind: "highlight", label: m[1].trim(), value: m[2].trim() });
        continue;
      }
      out.push({ kind: "bullet", text: body });
      continue;
    }

    // Numbered list (1. / 2. / १. / २.)
    if (/^(\d+|[०-९]+)[\.\)]\s/.test(line)) {
      out.push({ kind: "numbered", text: line });
      continue;
    }

    // A standalone short Marathi line that ends with no terminator and is
    // before a body — promote to a heading-ish callout.
    if (
      line.length <= 40 &&
      /[\u0900-\u097F]/.test(line) &&
      !/[।.!?:]$/.test(line)
    ) {
      out.push({ kind: "heading", text: line });
      continue;
    }

    out.push({ kind: "para", text: line });
  }
  return out;
}

function Block({ block }: { block: Block }) {
  if (block.kind === "heading") {
    return (
      <h4
        lang="mr"
        className="font-devanagari-serif mt-4 border-l-4 border-amber-500 pl-3 text-lg font-bold text-[#12193A] dark:text-amber-200"
      >
        {block.text}
      </h4>
    );
  }
  if (block.kind === "highlight") {
    return (
      <div className="rounded-lg border-l-4 border-amber-500 bg-amber-50/80 px-4 py-2.5 dark:border-amber-400 dark:bg-amber-900/20">
        <span
          lang="mr"
          className="font-devanagari-serif mr-2 text-sm font-bold uppercase tracking-wide text-amber-800 dark:text-amber-300"
        >
          {block.label}
        </span>
        <span lang="mr" className="font-devanagari text-slate-800 dark:text-slate-100">
          {block.value}
        </span>
      </div>
    );
  }
  if (block.kind === "bullet") {
    return (
      <p lang="mr" className="font-devanagari relative pl-6">
        <span
          aria-hidden
          className="absolute left-1 top-[0.65em] inline-block h-1.5 w-1.5 rounded-full bg-amber-500"
        />
        {block.text}
      </p>
    );
  }
  if (block.kind === "numbered") {
    return (
      <p lang="mr" className="font-devanagari pl-2 font-medium text-slate-800 dark:text-slate-200">
        {block.text}
      </p>
    );
  }
  return (
    <p lang="mr" className="font-devanagari">
      {block.text}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Pill — used in hero                                                */
/* ------------------------------------------------------------------ */
function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium ring-1 ring-white/20 backdrop-blur">
      {children}
    </span>
  );
}
