"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MH_GEO_CHAPTERS,
  MH_GEO_IMAGE_HREF,
  MH_GEO_PARTS,
  MH_GEO_TOTAL_PAGES,
  type MhGeoChapter,
} from "@/lib/notesData/mhGeography";

const TOTAL_CHAPTERS = MH_GEO_CHAPTERS.length;

export default function MhGeographyNotes() {
  // null = browse view (hero + chapter grid)
  // chapter object = reader view scrolled to that chapter
  const [active, setActive] = useState<MhGeoChapter | null>(null);

  // Reset scroll when entering reader view or switching chapters
  useEffect(() => {
    if (active) {
      // jump near top of the reader so the chapter banner is visible
      requestAnimationFrame(() => {
        const el = document.getElementById("mh-geo-reader-top");
        if (el)
          el.scrollIntoView({ behavior: "smooth", block: "start" });
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
/* Browse view — cover + chapter grid                                 */
/* ------------------------------------------------------------------ */
function BrowseView({ onSelect }: { onSelect: (c: MhGeoChapter) => void }) {
  return (
    <article className="space-y-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#12193A] via-[#1a2454] to-[#263256] p-8 text-white shadow-lg sm:p-10">
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-orange-500/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-12 left-1/3 h-64 w-64 rounded-full bg-orange-400/10 blur-3xl"
          aria-hidden
        />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
          Don&apos;t know Academy · Notes
        </p>
        <h2 className="mt-3 text-4xl font-extrabold leading-tight sm:text-5xl">
          Maharashtra <span className="text-orange-400">Geography</span>
        </h2>
        <p
          lang="mr"
          className="font-devanagari-serif mt-2 text-xl font-bold text-orange-50/95 sm:text-2xl"
        >
          महाराष्ट्र भूगोल — संपूर्ण नोट्स
        </p>
        <p className="mt-3 max-w-2xl text-sm text-slate-200/90 sm:text-base">
          The complete Maharashtra geography revision pack — premium cover,
          redesigned table of contents, clean chapter dividers and 83 pages
          of focused content. {TOTAL_CHAPTERS} chapters · one focused study
          session.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Pill>📚 MPSC · Rajyaseva · UPSC · RTO AMVI</Pill>
          <Pill>📖 {TOTAL_CHAPTERS} chapters</Pill>
          <Pill>📄 {MH_GEO_TOTAL_PAGES} pages</Pill>
          <Pill>🎨 2026 redesigned edition</Pill>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => onSelect(MH_GEO_CHAPTERS[0])}
            className="rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-orange-400 hover:shadow-md"
          >
            📖 Start reading
          </button>
        </div>
      </section>

      {/* About strip */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-start gap-3">
          <span className="text-2xl" aria-hidden>
            ℹ️
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              About this notes pack
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              16 chapters spread across 83 pages — covering the formation of
              Maharashtra, location and extent, political geography, river
              systems, climate, forests, energy, transport, tourism and the
              supplementary astronomy + space-launch chapters. Content is
              packaged with a premium cover, redesigned table of contents,
              chapter dividers and study tips so your revision flows in a
              presentation-ready format.
            </p>
            <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
              Reading online? Pages stay copy-protected. Want to print or
              revise offline? Use the Download button above.
            </p>
          </div>
        </div>
      </section>

      {/* Parts + chapter grid */}
      {MH_GEO_PARTS.map((part) => {
        const chs = MH_GEO_CHAPTERS.filter((c) => c.part === part.id);
        return (
          <section key={part.id}>
            <header className="mb-4 flex flex-wrap items-end justify-between gap-2 border-l-4 border-orange-500 pl-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-400">
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
        Published by Don&apos;t know Academy · mpscs.in · 2026 edition · Free
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
      className="group relative flex min-h-[148px] flex-col overflow-hidden rounded-xl border-2 border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-400 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-orange-500"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-500 to-red-600" />
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-base font-extrabold text-orange-700 group-hover:bg-orange-500 group-hover:text-white dark:bg-orange-900/40 dark:text-orange-300">
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
        <span className="text-orange-600 group-hover:text-orange-700 dark:text-orange-400">
          Read →
        </span>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Reader view — vertical scroll of page images for one chapter       */
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
  const pages = useMemo(() => {
    const out: number[] = [];
    for (let p = chapter.pageStart; p <= chapter.pageEnd; p++) out.push(p);
    return out;
  }, [chapter.pageStart, chapter.pageEnd]);

  const idx = MH_GEO_CHAPTERS.findIndex((c) => c.number === chapter.number);
  const prev = idx > 0 ? MH_GEO_CHAPTERS[idx - 1] : null;
  const next =
    idx < MH_GEO_CHAPTERS.length - 1 ? MH_GEO_CHAPTERS[idx + 1] : null;

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
            <p className="text-[11px] font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-400">
              Chapter {chapter.number} of {TOTAL_CHAPTERS}
            </p>
            <h3 className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
              {chapter.titleEn}
            </h3>
          </div>
        </div>
      </div>

      {/* Chapter banner */}
      <section className="rounded-2xl bg-gradient-to-r from-[#12193A] to-[#263256] p-6 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-orange-300">
          {chapter.part === 1 ? "Part 1 · Maharashtra Geography" : "Part 2 · Other Important Topics"}
        </p>
        <h2 className="mt-1.5 text-2xl font-extrabold sm:text-3xl">
          {chapter.titleEn}
        </h2>
        <p
          lang="mr"
          className="font-devanagari-serif mt-1 text-xl font-bold text-orange-50/95 sm:text-2xl"
        >
          {chapter.titleMr}
        </p>
        <p className="mt-3 max-w-2xl text-sm text-slate-200/90">
          💡 <strong>Study tip:</strong> {chapter.tip}
        </p>
        <p className="mt-3 text-xs text-slate-400">
          Pages {chapter.pageStart}–{chapter.pageEnd} ·{" "}
          {chapter.pageEnd - chapter.pageStart + 1}{" "}
          {chapter.pageEnd - chapter.pageStart + 1 === 1 ? "page" : "pages"}
        </p>
      </section>

      {/* Page images */}
      <div className="space-y-5">
        {pages.map((p, i) => (
          <PageImage key={p} page={p} eager={i === 0} />
        ))}
      </div>

      {/* Prev / Next chapter nav */}
      <nav className="grid gap-3 pt-2 sm:grid-cols-2">
        {prev ? (
          <button
            onClick={() => onSelect(prev)}
            className="rounded-xl border-2 border-slate-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-orange-400 hover:shadow dark:border-slate-700 dark:bg-slate-800"
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
            className="rounded-xl border-2 border-slate-200 bg-white p-4 text-right transition-all hover:-translate-y-0.5 hover:border-orange-400 hover:shadow dark:border-slate-700 dark:bg-slate-800"
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
            className="rounded-xl border-2 border-orange-200 bg-orange-50 p-4 text-right transition-all hover:-translate-y-0.5 hover:border-orange-400 hover:shadow dark:border-orange-800 dark:bg-orange-900/30"
          >
            <p className="text-[11px] font-semibold uppercase tracking-widest text-orange-600 dark:text-orange-400">
              You finished the notes 🎉
            </p>
            <p className="mt-1 text-sm font-bold text-orange-800 dark:text-orange-200">
              Back to the chapter index
            </p>
          </button>
        )}
      </nav>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* PageImage — lazy, copy-protected page renderer                     */
/* ------------------------------------------------------------------ */
function PageImage({ page, eager }: { page: number; eager: boolean }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <img
        src={MH_GEO_IMAGE_HREF(page)}
        alt={`Maharashtra Geography — page ${page} of ${MH_GEO_TOTAL_PAGES}`}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        className="block w-full select-none"
        style={{
          // Prevent iOS long-press save panel
          WebkitTouchCallout: "none",
          WebkitUserSelect: "none",
          userSelect: "none",
        }}
      />
      <figcaption className="border-t border-slate-100 bg-slate-50 px-3 py-1.5 text-center text-[11px] font-medium text-slate-400 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-500">
        Page {page} / {MH_GEO_TOTAL_PAGES}
      </figcaption>
    </figure>
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
