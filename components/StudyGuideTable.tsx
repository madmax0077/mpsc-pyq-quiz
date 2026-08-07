import type { ReactNode } from "react";

type Props = {
  headers: string[];
  rows: ReactNode[][];
};

/** Scroll-safe study-guide table with readable cell padding. */
export default function StudyGuideTable({ headers, rows }: Props) {
  return (
    <div className="not-prose prose-table-wrap my-6 -mx-5 overflow-x-auto rounded-xl border border-slate-200 sm:-mx-9 dark:border-slate-600">
      <table className="w-full min-w-[480px] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-900/70">
            {headers.map((h) => (
              <th
                key={h}
                className="break-words border-b border-slate-200 px-4 py-3 font-semibold text-slate-700 dark:border-slate-600 dark:text-slate-200"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-slate-100 last:border-0 dark:border-slate-700/80"
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`break-words px-4 py-3.5 align-top leading-[1.7] text-slate-600 dark:text-slate-300 ${
                    j === 0 ? "font-medium text-slate-800 dark:text-slate-100" : ""
                  }`}
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
