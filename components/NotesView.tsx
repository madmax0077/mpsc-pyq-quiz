"use client";

import { useEffect, useState, type SyntheticEvent } from "react";
import NewspaperNotes from "@/components/notes/NewspaperNotes";
import MhGeographyNotes from "@/components/notes/MhGeographyNotes";

/**
 * NotesView
 * ---------
 * Top-level "Notes" tab. Renders a hub of available note-sets and dispatches
 * to the chosen note's content component. The whole subtree is rendered
 * inside a copy-protected container — text selection, right-click,
 * Ctrl+C / X / A / S / P / U and drag-and-drop are all blocked **only while
 * this view is mounted**. Cleanup on unmount restores normal behaviour.
 *
 * Adding a new notes set
 * ----------------------
 * 1. Drop the data in lib/notesData/<slug>.ts
 * 2. Build a content component in components/notes/<Component>.tsx
 * 3. Append a new entry to NOTES_INDEX below.
 */

type NoteSlug = "newspapers" | "mh-geography";

type NoteEntry = {
  slug: NoteSlug;
  emoji: string;
  title: string;
  subtitle: string;
  blurb: string;
  meta: string;
  accent: string;
};

const NOTES_INDEX: NoteEntry[] = [
  {
    slug: "mh-geography",
    emoji: "🗺️",
    title: "महाराष्ट्र भूगोल — संपूर्ण नोट्स",
    subtitle: "Maharashtra Geography — Complete Notes (2026)",
    blurb:
      "16 chapters · 83 pages of Marathi geography revision notes — formation of Maharashtra, political and physical geography, rivers, climate, forests, energy, transport, tourism, astronomy and space launches. Read online (copy-protected) or download the printable PDF.",
    meta: "MPSC · Rajyaseva · RTO AMVI · UPSC · 2026 redesigned edition",
    accent: "from-[#12193A] to-orange-500",
  },
  {
    slug: "newspapers",
    emoji: "🗞️",
    title: "वर्तमानपत्र — संस्थापक व संपादक",
    subtitle: "Newspapers — Founders, Editors & 100 MCQs",
    blurb:
      "70+ Indian newspapers and 50+ founders/editors organised in 6 historical groups (British / early period, Bengal Renaissance, Maharashtra press, Nationalist Congress era, Revolutionary press, Gandhi era), followed by 100 read-only MCQs with answers.",
    meta: "MPSC · Rajyaseva · RTO AMVI · UPSC · ~10 min revision",
    accent: "from-orange-500 to-red-600",
  },
];

export default function NotesView({ onBack }: { onBack: () => void }) {
  const [active, setActive] = useState<NoteSlug | null>(null);

  /* ---- Copy / selection / shortcut blockers (active only while mounted) ---- */
  useEffect(() => {
    const blockedCombos = new Set([
      "c", // copy
      "x", // cut
      "a", // select all
      "s", // save page
      "p", // print
      "u", // view source
    ]);

    const onKey = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (blockedCombos.has(e.key.toLowerCase())) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("keydown", onKey, true);
    document.body.classList.add("notes-no-copy-active");

    return () => {
      document.removeEventListener("keydown", onKey, true);
      document.body.classList.remove("notes-no-copy-active");
    };
  }, []);

  const block = (e: SyntheticEvent) => {
    e.preventDefault();
  };

  const activeEntry = active ? NOTES_INDEX.find((n) => n.slug === active) : null;

  return (
    <div
      className="notes-no-copy space-y-6"
      onCopy={block}
      onCut={block}
      onContextMenu={block}
      onDragStart={block}
    >
      {/* Header / breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => (active ? setActive(null) : onBack())}
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          aria-label="Back"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </button>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-bold text-slate-800 dark:text-slate-100">
            {activeEntry ? activeEntry.title : "📝 Notes"}
          </h2>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            {activeEntry
              ? activeEntry.subtitle
              : "Curated study notes · read-only · copy disabled"}
          </p>
        </div>
        {!activeEntry && (
          <span
            className="hidden shrink-0 items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 sm:inline-flex dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
            title="Text selection and copy are disabled on Notes pages."
          >
            <svg
              className="h-3 w-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-7a2 2 0 00-2-2H6a2 2 0 00-2 2v7a2 2 0 002 2zm10-12V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            Read-only
          </span>
        )}
      </div>

      {/* Hub OR active note */}
      {activeEntry ? (
        <NoteContent slug={activeEntry.slug} />
      ) : (
        <>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Hand-curated revision notes built by Don&apos;t know Academy.
            Optimised for last-week revision before MPSC, Rajyaseva, RTO AMVI
            and UPSC prelims. <strong>Copying and downloading are disabled</strong>{" "}
            on Notes pages so the material stays exclusive to mpscs.in readers.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {NOTES_INDEX.map((n) => (
              <button
                key={n.slug}
                onClick={() => setActive(n.slug)}
                className="group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:border-orange-600"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${n.accent}`}
                />
                <div className="flex items-start gap-3">
                  <span className="text-3xl" aria-hidden>
                    {n.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-slate-800 group-hover:text-orange-700 dark:text-slate-100 dark:group-hover:text-orange-300">
                      {n.title}
                    </h3>
                    <p className="mt-0.5 text-xs font-medium text-slate-400 dark:text-slate-500">
                      {n.subtitle}
                    </p>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {n.blurb}
                    </p>
                    <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
                      {n.meta}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
            More notes coming soon. Got a suggestion? Email us at {" "}
            <span className="font-medium text-slate-500 dark:text-slate-400">
              dontknowacademy@gmail.com
            </span>
            .
          </p>
        </>
      )}
    </div>
  );
}

function NoteContent({ slug }: { slug: NoteSlug }) {
  switch (slug) {
    case "newspapers":
      return <NewspaperNotes />;
    case "mh-geography":
      return <MhGeographyNotes />;
    default:
      return null;
  }
}
