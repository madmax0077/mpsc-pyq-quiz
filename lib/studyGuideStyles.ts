/**
 * Shared readable prose classes for all study-guide / blog pages.
 * Keep list items, headings and paragraphs spaced for mobile reading.
 */
export const STUDY_GUIDE_PROSE_CLASS = [
  "prose prose-slate max-w-none dark:prose-invert",
  // Headings
  "prose-headings:scroll-mt-28 prose-headings:break-words prose-headings:font-bold prose-headings:text-slate-800 dark:prose-headings:text-slate-100",
  "prose-h2:mb-3 prose-h2:mt-0 prose-h2:text-[1.35rem] prose-h2:leading-snug sm:prose-h2:text-[1.65rem]",
  "prose-h3:mb-3 prose-h3:mt-10 prose-h3:border-b prose-h3:border-slate-200 prose-h3:pb-2.5 prose-h3:text-lg dark:prose-h3:border-slate-600",
  "prose-h4:mb-2.5 prose-h4:mt-7 prose-h4:text-base prose-h4:font-semibold",
  // Body
  "prose-p:my-4 prose-p:break-words prose-p:leading-[1.8] prose-p:text-[0.975rem] sm:prose-p:text-[1.02rem]",
  // Lists — small but clear gap between points
  "prose-ul:my-5 prose-ol:my-5 prose-ul:pl-5 prose-ol:pl-5",
  // Small clear gap between bullet / numbered points
  "prose-li:my-3 prose-li:leading-[1.8] prose-li:marker:text-slate-400",
  "prose-li:[&>p]:my-0",
  // Inline
  "prose-strong:font-semibold prose-em:text-slate-700 dark:prose-em:text-slate-200",
  "prose-a:break-words prose-a:font-medium prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline dark:prose-a:text-indigo-400",
].join(" ");
