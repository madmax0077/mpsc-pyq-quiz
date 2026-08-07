import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  tone?: "amber" | "sky";
};

export default function StudyGuideCallout({ children, tone = "amber" }: Props) {
  const toneClass =
    tone === "sky"
      ? "border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-800/60 dark:bg-sky-950/30 dark:text-sky-100"
      : "border-amber-200 bg-amber-50 text-amber-950 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-100";

  return (
    <div
      className={`not-prose my-6 rounded-xl border px-4 py-4 text-[0.95rem] leading-[1.75] ${toneClass}`}
    >
      {children}
    </div>
  );
}
