"use client";

import {
  EMPLOYMENT_EVOLUTION_FLOW,
  PANCH_ARCHITECTURE_FLOW,
  PANCH_CAVEATS,
  PANCH_OVERVIEW_STATS,
  PANCH_SECTIONS,
  PANCH_SUBTITLE_MR,
  PANCH_TITLE_EN,
  PANCH_TITLE_MR,
  PANCH_TOTAL_SECTIONS,
  SJGSY_MERGE_FLOW,
  type PlanBlock,
  type PlanSection,
} from "@/lib/notesData/panchvarshikPlans";
import type { Category } from "@/lib/types";

/** Topic Tests (non-PYQ) — Marathi pack topic */
export const PANCH_PRACTICE_TOPIC_MR = "पंचवार्षिक योजना";
/** Topic Tests (non-PYQ) — English pack topic */
export const PANCH_PRACTICE_TOPIC_EN = "Five Year Plans";
/** Existing PYQ topic label used across exam papers (both languages) */
export const PANCH_PYQ_TOPIC = "Economic Planning & Five Year Plans";

type PracticeTarget = {
  category: Category;
  topic: string;
  source: "catalog" | "pyq";
};

const KIND_STYLES: Record<
  PlanSection["kind"],
  { ring: string; badge: string; soft: string }
> = {
  fyp: {
    ring: "border-teal-100 dark:border-teal-900/40",
    badge: "from-teal-400 to-emerald-400",
    soft: "bg-[#F0F7F4] dark:bg-teal-950/20",
  },
  holiday: {
    ring: "border-amber-100 dark:border-amber-900/40",
    badge: "from-amber-300 to-orange-300",
    soft: "bg-[#FBF6EE] dark:bg-amber-950/20",
  },
  rolling: {
    ring: "border-cyan-100 dark:border-cyan-900/40",
    badge: "from-cyan-300 to-sky-300",
    soft: "bg-[#EEF8FA] dark:bg-cyan-950/20",
  },
  annual: {
    ring: "border-rose-100 dark:border-rose-900/40",
    badge: "from-rose-300 to-pink-300",
    soft: "bg-[#FBF0F3] dark:bg-rose-950/20",
  },
  card: {
    ring: "border-emerald-100 dark:border-emerald-900/40",
    badge: "from-emerald-300 to-teal-300",
    soft: "bg-[#EEF8F2] dark:bg-emerald-950/20",
  },
};

function FlowBlock({
  title,
  steps,
  mode = "chain",
}: {
  title?: string;
  steps: string[];
  mode?: "chain" | "merge" | "split";
}) {
  if (mode === "merge") {
    const last = steps[steps.length - 1];
    const sources = steps.slice(0, -1);
    return (
      <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50/80 to-[#F7F3EA] p-4 dark:border-amber-900/40 dark:from-amber-950/20 dark:to-stone-900/40">
        {title && (
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-amber-800/80 dark:text-amber-200/80">
            🔀 {title}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-2">
          {sources.map((s, i) => (
            <span
              key={i}
              className="rounded-lg border border-amber-100 bg-white/90 px-2.5 py-1.5 text-center text-[11px] font-semibold leading-snug text-stone-800 shadow-sm dark:border-amber-800/40 dark:bg-slate-900 dark:text-amber-100 sm:text-xs"
            >
              {s}
            </span>
          ))}
        </div>
        <div className="my-2 flex justify-center text-amber-400" aria-hidden>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
        <div className="flex justify-center">
          <span className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 px-4 py-2 text-sm font-bold text-white shadow-md">
            {last}
          </span>
        </div>
      </div>
    );
  }

  if (mode === "split") {
    const [root, ...rest] = steps;
    return (
      <div className="rounded-2xl border border-sky-200 bg-gradient-to-br from-sky-50 to-cyan-50/40 p-4 dark:border-sky-800/50 dark:from-sky-950/30 dark:to-cyan-950/20">
        {title && (
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-sky-700 dark:text-sky-300">
            ⑂ {title}
          </p>
        )}
        <div className="flex justify-center">
          <span className="rounded-xl bg-gradient-to-r from-sky-600 to-cyan-600 px-4 py-2 text-sm font-bold text-white shadow-md">
            {root}
          </span>
        </div>
        <div className="my-2 flex justify-center text-sky-400" aria-hidden>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {rest.map((s, i) => (
            <span
              key={i}
              className="rounded-lg border border-sky-200 bg-white px-3 py-2 text-center text-xs font-semibold leading-snug text-sky-900 shadow-sm dark:border-sky-700 dark:bg-slate-900 dark:text-sky-100"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // chain
  return (
    <div className="rounded-2xl border border-teal-100 bg-gradient-to-br from-[#EAF6F1] to-[#F0F4F8] p-4 dark:border-teal-900/40 dark:from-teal-950/25 dark:to-slate-900/40">
      {title && (
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-teal-800/80 dark:text-teal-200/80">
          ⟳ {title}
        </p>
      )}
      <ol className="flex flex-col gap-0 sm:flex-row sm:flex-wrap sm:items-center sm:gap-1">
        {steps.map((s, i) => (
          <li key={i} className="flex items-center gap-1">
            <span className="rounded-lg border border-teal-100 bg-white/90 px-2.5 py-1.5 text-center text-[11px] font-semibold leading-snug text-stone-800 shadow-sm dark:border-teal-800/40 dark:bg-slate-900 dark:text-teal-100 sm:text-xs">
              {s}
            </span>
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="mx-0.5 hidden text-teal-400 sm:inline"
              >
                →
              </span>
            )}
            {i < steps.length - 1 && (
              <span
                aria-hidden
                className="my-0.5 flex w-full justify-center text-teal-400 sm:hidden"
              >
                ↓
              </span>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

function ArchitectureFlowchart() {
  const { title, root, branches } = PANCH_ARCHITECTURE_FLOW;
  return (
    <section className="overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-sm dark:border-teal-900/40 dark:bg-slate-900">
      <div className="border-b border-teal-100/80 bg-gradient-to-r from-[#D8EDE4] via-[#F0EBE3] to-[#E4ECF2] px-5 py-3 dark:border-teal-900 dark:from-teal-950/50 dark:via-stone-900 dark:to-slate-900">
        <p className="text-xs font-bold uppercase tracking-widest text-teal-800/70 dark:text-teal-200/70">
          Flowchart · Overview
        </p>
        <h3 className="font-devanagari-serif mt-0.5 text-lg font-bold text-stone-800 dark:text-stone-100 sm:text-xl">
          {title}
        </h3>
      </div>
      <div className="p-5">
        <div className="flex justify-center">
          <div className="rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 px-5 py-3 text-center text-sm font-bold text-white shadow-md sm:text-base">
            {root}
          </div>
        </div>
        <div className="my-3 flex justify-center text-teal-400" aria-hidden>
          <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {branches.map((b) => (
            <div
              key={b.label}
              className="rounded-xl border border-teal-100/80 bg-[#F4FAF7] p-4 dark:border-teal-900/40 dark:bg-teal-950/20"
            >
              <p className="text-sm font-bold text-stone-800 dark:text-stone-100">
                {b.label}
              </p>
              <p className="mt-0.5 text-xs text-teal-800/70 dark:text-teal-200/70">
                {b.detail}
              </p>
              {b.children && (
                <div className="mt-3 space-y-2 border-t border-teal-100 pt-3 dark:border-teal-900/40">
                  {b.children.map((c) => (
                    <div
                      key={c.label}
                      className="rounded-lg border border-white bg-white px-3 py-2 shadow-sm dark:border-slate-700 dark:bg-slate-800"
                    >
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                        {c.label}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {c.detail}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Callout({
  tone,
  title,
  text,
}: {
  tone: "tip" | "warn" | "success" | "info";
  title?: string;
  text: string;
}) {
  const styles = {
    tip: "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-800/50 dark:bg-amber-950/25 dark:text-amber-100",
    warn: "border-rose-200 bg-rose-50 text-rose-950 dark:border-rose-800/50 dark:bg-rose-950/25 dark:text-rose-100",
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-950 dark:border-emerald-800/50 dark:bg-emerald-950/25 dark:text-emerald-100",
    info: "border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-800/50 dark:bg-sky-950/25 dark:text-sky-100",
  } as const;
  const icons = { tip: "💡", warn: "⚠️", success: "✅", info: "ℹ️" } as const;
  return (
    <div className={`rounded-xl border px-4 py-3 text-sm leading-relaxed ${styles[tone]}`}>
      {(title || icons[tone]) && (
        <p className="mb-1 text-xs font-bold uppercase tracking-wide opacity-80">
          {icons[tone]} {title}
        </p>
      )}
      <p>{text}</p>
    </div>
  );
}

function Blocks({ blocks }: { blocks: PlanBlock[] }) {
  return (
    <div className="mt-4 space-y-3">
      {blocks.map((b, i) => {
        if (b.kind === "subhead") {
          return (
            <h5
              key={i}
              className="font-devanagari-serif rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-base font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-100"
            >
              ❖ {b.text}
            </h5>
          );
        }
        if (b.kind === "para") {
          return (
            <p
              key={i}
              className="rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm leading-relaxed text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {b.text}
            </p>
          );
        }
        if (b.kind === "bullets") {
          return (
            <ul key={i} className="space-y-2">
              {b.items.map((item, j) => (
                <li
                  key={j}
                  className="flex gap-2.5 rounded-xl border border-slate-200 bg-white p-3.5 text-sm leading-relaxed text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-500 text-[10px] font-bold text-white"
                  >
                    ▸
                  </span>
                  <span className="flex-1">{item}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (b.kind === "table") {
          return (
            <div
              key={i}
              className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              {b.caption && (
                <p className="border-b border-slate-100 bg-slate-50 px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300">
                  {b.caption}
                </p>
              )}
              <table className="w-full min-w-[280px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-[#F0F7F4] dark:border-slate-700 dark:bg-teal-950/30">
                    {b.headers.map((h) => (
                      <th
                        key={h}
                        className="px-3 py-2 text-xs font-bold uppercase tracking-wide text-teal-800 dark:text-teal-200"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {b.rows.map((row, ri) => (
                    <tr
                      key={ri}
                      className="border-b border-slate-100 last:border-0 dark:border-slate-700/60"
                    >
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className="px-3 py-2 align-top text-slate-700 dark:text-slate-200"
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        if (b.kind === "callout") {
          return (
            <Callout key={i} tone={b.tone} title={b.title} text={b.text} />
          );
        }
        if (b.kind === "flow") {
          return (
            <FlowBlock
              key={i}
              title={b.title}
              steps={b.steps}
              mode={b.mode}
            />
          );
        }
        return null;
      })}
    </div>
  );
}

function PlanCard({ section }: { section: PlanSection }) {
  const style = KIND_STYLES[section.kind];
  return (
    <section
      id={`panch-${section.id}`}
      className={`scroll-mt-24 overflow-hidden rounded-2xl border ${style.ring} ${style.soft} shadow-sm`}
    >
      <div className="flex flex-wrap items-start gap-3 border-b border-white/60 px-5 py-4 dark:border-slate-700/60 sm:px-6">
        <span
          className={`mt-0.5 flex h-10 min-w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${style.badge} px-2 text-sm font-bold text-stone-800 shadow-sm ring-1 ring-black/5 dark:text-stone-900`}
        >
          {section.badge}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <h4 className="font-devanagari-serif text-lg font-extrabold leading-tight text-slate-900 dark:text-slate-50 sm:text-xl">
              {section.titleMr}
            </h4>
            <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-xs font-bold text-teal-800 ring-1 ring-teal-100 dark:bg-slate-800 dark:text-teal-200 dark:ring-teal-800">
              {section.period}
            </span>
          </div>
          <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {section.titleEn}
          </p>
        </div>
      </div>

      {section.meta.length > 0 && (
        <div className="grid gap-2 px-5 pt-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
          {section.meta.map((m) => (
            <div
              key={m.label}
              className="rounded-xl border border-white/80 bg-white px-3 py-2.5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {m.label}
              </p>
              <p className="mt-0.5 text-sm font-semibold leading-snug text-slate-800 dark:text-slate-100">
                {m.value}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="px-5 pb-5 sm:px-6 sm:pb-6">
        <Blocks blocks={section.blocks} />
      </div>
    </section>
  );
}

export default function PanchvarshikPlansNotes({
  onOpenTopicPractice,
  language = "english",
}: {
  onOpenTopicPractice?: (target: PracticeTarget) => void;
  language?: "english" | "marathi";
}) {
  const practiceTopic =
    language === "marathi" ? PANCH_PRACTICE_TOPIC_MR : PANCH_PRACTICE_TOPIC_EN;

  const openPractice = () => {
    if (onOpenTopicPractice) {
      onOpenTopicPractice({
        category: "Economics",
        topic: practiceTopic,
        source: "catalog",
      });
      return;
    }
    window.location.href = `/?mode=topic-tests&cat=Economics&topic=${encodeURIComponent(practiceTopic)}`;
  };

  const openPyq = () => {
    if (onOpenTopicPractice) {
      onOpenTopicPractice({
        category: "Economics",
        topic: PANCH_PYQ_TOPIC,
        source: "pyq",
      });
      return;
    }
    window.location.href = `/?mode=topic&cat=Economics&topic=${encodeURIComponent(PANCH_PYQ_TOPIC)}`;
  };

  return (
    <article lang="mr" className="space-y-10">
      {/* Hero */}
      <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-[#EAF6F1] via-[#F7F3EA] to-[#E8EEF5] p-8 text-stone-800 shadow-sm ring-1 ring-teal-100/80 sm:p-10 dark:from-slate-900 dark:via-stone-900 dark:to-slate-900 dark:text-stone-100 dark:ring-teal-900/40">
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-800/70 dark:text-teal-200/70">
          Don&apos;t know Academy · Notes
        </p>
        <h2 className="font-devanagari-serif mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
          {PANCH_TITLE_MR}
        </h2>
        <p className="mt-2 text-base font-medium text-stone-600 dark:text-stone-300 sm:text-lg">
          {PANCH_TITLE_EN}
        </p>
        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{PANCH_SUBTITLE_MR}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-stone-700 ring-1 ring-teal-100/80 dark:bg-slate-800/70 dark:text-stone-200 dark:ring-teal-900/40">
            📚 MPSC · Rajyaseva · STI · PSI · ASO · UPSC
          </span>
          <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-stone-700 ring-1 ring-teal-100/80 dark:bg-slate-800/70 dark:text-stone-200 dark:ring-teal-900/40">
            🗂️ {PANCH_TOTAL_SECTIONS} विभाग
          </span>
          <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-stone-700 ring-1 ring-teal-100/80 dark:bg-slate-800/70 dark:text-stone-200 dark:ring-teal-900/40">
            ✅ १०० Practice MCQ
          </span>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="#panch-overview"
            className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-md"
          >
            📊 आढावा
          </a>
          <a
            href="#panch-plans"
            className="rounded-lg bg-white/80 px-4 py-2 text-sm font-semibold text-stone-700 ring-1 ring-stone-200/80 transition-all hover:-translate-y-0.5 hover:bg-white dark:bg-slate-800/80 dark:text-stone-200 dark:ring-slate-600"
          >
            📖 सर्व योजना
          </a>
          <button
            type="button"
            onClick={openPractice}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-amber-600 hover:shadow-md"
          >
            📝 १०० MCQ Practice
          </button>
        </div>
      </section>

      {/* About */}
      <section className="rounded-2xl border border-teal-100/80 bg-white p-6 shadow-sm dark:border-teal-900/40 dark:bg-slate-800">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          या नोट्सबद्दल
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          भारतीय आर्थिक नियोजन —{" "}
          <strong>१२ पंचवार्षिक योजना + ७ वार्षिक</strong> — हा MPSC /
          UPSC पूर्वपरीक्षेत दरवर्षी विचारला जाणारा high-yield घटक. Don&apos;t
          know Academy च्या या नोट्समध्ये प्रत्येक योजनेचे नाव, भर, प्रतिमान,
          अध्यक्ष, प्रकल्प, आर्थिक–राजकीय घटना आणि flowchart क्रमाने मांडले
          आहेत. शेवटी <strong>१०० practice MCQ</strong> (Topic Tests) आणि{" "}
          <strong>PYQ</strong> (Topic Wise) लिंक आहेत.
        </p>
      </section>

      {/* Overview stats + architecture */}
      <section id="panch-overview" className="scroll-mt-24 space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-teal-700 dark:text-teal-300">
            विभाग १ · Overview
          </p>
          <h3 className="font-devanagari-serif mt-1 text-2xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-3xl">
            एका दृष्टीक्षेपात
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PANCH_OVERVIEW_STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-teal-100/80 bg-gradient-to-br from-[#F0F7F4] to-[#F7F3EA] p-4 text-center shadow-sm dark:border-teal-900/40 dark:from-teal-950/30 dark:to-stone-900/40"
            >
              <p className="text-2xl font-extrabold text-teal-800/80 dark:text-teal-200/80">
                {s.value}
              </p>
              <p className="mt-1 text-xs font-bold text-slate-700 dark:text-slate-200">
                {s.label}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {s.hint}
              </p>
            </div>
          ))}
        </div>

        <ArchitectureFlowchart />

        <div className="grid gap-4 lg:grid-cols-2">
          <FlowBlock
            title={EMPLOYMENT_EVOLUTION_FLOW.title}
            steps={EMPLOYMENT_EVOLUTION_FLOW.steps}
            mode="chain"
          />
          <FlowBlock
            title={SJGSY_MERGE_FLOW.title}
            steps={SJGSY_MERGE_FLOW.steps}
            mode="merge"
          />
        </div>
      </section>

      {/* Quick jump */}
      <nav
        aria-label="योजना नेविगेशन"
        className="rounded-2xl border border-teal-100/80 bg-[#F4FAF7]/80 p-5 dark:border-teal-900/40 dark:bg-teal-950/15"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-800/80 dark:text-teal-200/80">
          Quick Jump · {PANCH_TOTAL_SECTIONS} Sections
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {PANCH_SECTIONS.map((g) => (
            <a
              key={g.id}
              href={`#panch-${g.id}`}
              className="rounded-full border border-teal-100 bg-white px-3 py-1 text-xs font-medium text-stone-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-300 dark:border-teal-800/40 dark:bg-slate-800 dark:text-teal-100"
            >
              <span className="mr-1 font-bold text-teal-600">{g.badge}</span>
              {g.period}
            </a>
          ))}
        </div>
      </nav>

      {/* All plans */}
      <section id="panch-plans" className="scroll-mt-24 space-y-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-500 dark:text-stone-400">
            विभाग २ · Plans
          </p>
          <h3 className="font-devanagari-serif mt-1 text-2xl font-extrabold text-slate-900 dark:text-slate-100 sm:text-3xl">
            सर्व योजना — क्रमाने
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            प्रत्येक कार्डमध्ये meta chips, flowchart, सारण्या आणि bullet
            revision. रंग: सौम्य हिरवा — पंचवार्षिक · पीच — सुट्टी · मिंट —
            Rolling · गुलाबी — वार्षिक · सीफोम — revision card.
          </p>
        </div>
        <div className="space-y-5">
          {PANCH_SECTIONS.map((s) => (
            <PlanCard key={s.id} section={s} />
          ))}
        </div>
      </section>

      {/* Caveats */}
      <section id="panch-caveats" className="scroll-mt-24">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-700/80 dark:text-amber-300/80">
          विभाग ३ · Quick checks
        </p>
        <h3 className="font-devanagari-serif mt-1 text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          महत्त्वाचे मुद्दे
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          परीक्षेत गोंधळ होऊ नये म्हणून हे मुद्दे एकदा नक्की वाचा.
        </p>
        <ul className="mt-4 space-y-2">
          {PANCH_CAVEATS.map((c, i) => (
            <li
              key={i}
              className="flex gap-2 rounded-xl border border-amber-100 bg-[#FBF6EE] px-4 py-3 text-sm text-stone-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-100"
            >
              <span className="font-bold text-amber-700/80 dark:text-amber-300">
                {i + 1}.
              </span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Practice CTA */}
      <section
        id="panch-practice"
        className="scroll-mt-24 overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-[#FFF8EE] via-white to-[#F0F7F4] p-6 shadow-sm dark:border-amber-900/40 dark:from-amber-950/20 dark:via-slate-900 dark:to-teal-950/20 sm:p-8"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-800/80 dark:text-amber-300/80">
          विभाग ४ · Practice
        </p>
        <h3 className="font-devanagari-serif mt-1 text-2xl font-extrabold text-stone-900 dark:text-stone-100">
          आता सराव करा
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-stone-600 dark:text-stone-300">
          नोट्स वाचल्यानंतर खालील बटणाने थेट practice सुरू करा.{" "}
          <strong>१०० MCQ</strong> हे Don&apos;t know Academy चे practice set
          आहेत (PYQ नव्हे) — Topic Tests मध्ये. मागील परीक्षांचे प्रश्न Topic
          Wise मध्ये वेगळे उपलब्ध आहेत.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={openPractice}
            className="group rounded-2xl border border-teal-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-400 hover:shadow-md dark:border-teal-800 dark:bg-slate-800"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-teal-700 dark:text-teal-300">
              Topic Tests · Other than PYQ
            </p>
            <p className="mt-1 text-lg font-extrabold text-stone-900 dark:text-stone-50">
              {language === "marathi"
                ? "१०० MCQ — पंचवार्षिक योजना"
                : "100 MCQs — Five Year Plans"}
            </p>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
              {language === "marathi"
                ? "नोट्सवर आधारित नवीन practice प्रश्न · Economics"
                : "Notes-based practice set · Economics · English"}
            </p>
            <span className="mt-3 inline-flex items-center text-sm font-semibold text-teal-700 group-hover:underline dark:text-teal-300">
              Practice सुरू करा →
            </span>
          </button>

          <button
            type="button"
            onClick={openPyq}
            className="group rounded-2xl border border-amber-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md dark:border-amber-800 dark:bg-slate-800"
          >
            <p className="text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">
              Topic Wise · PYQ
            </p>
            <p className="mt-1 text-lg font-extrabold text-stone-900 dark:text-stone-50">
              Economic Planning &amp; Five Year Plans
            </p>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-300">
              मागील MPSC पेपर्समधील PYQ · Economics
            </p>
            <span className="mt-3 inline-flex items-center text-sm font-semibold text-amber-700 group-hover:underline dark:text-amber-300">
              PYQ सराव करा →
            </span>
          </button>
        </div>

        <p className="mt-4 break-all text-xs text-stone-500 dark:text-stone-400">
          Direct link:{" "}
          <a
            className="font-medium text-teal-700 underline dark:text-teal-300"
            href={`/?mode=topic-tests&cat=Economics&topic=${encodeURIComponent(practiceTopic)}`}
          >
            /?mode=topic-tests&amp;cat=Economics&amp;topic=
            {practiceTopic}
          </a>
        </p>
      </section>

      <section className="rounded-2xl border border-teal-100 bg-[#F0F7F4] p-5 text-sm text-stone-700 dark:border-teal-900/40 dark:bg-teal-950/20 dark:text-stone-300">
        <p>
          <strong>Don&apos;t know Academy</strong> — पंचवार्षिक योजना revision
          notes + १०० Topic Tests MCQ. चुकीचे मुद्दे सापडल्यास{" "}
          <a className="underline" href="mailto:dontknowacademy@gmail.com">
            dontknowacademy@gmail.com
          </a>{" "}
          वर कळवा.
        </p>
      </section>
    </article>
  );
}
