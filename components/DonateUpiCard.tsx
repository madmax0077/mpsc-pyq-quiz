"use client";

import { useMemo, useState } from "react";
import {
  DONATE_UPI_ID,
  getUpiAndroidIntentUrl,
  getUpiPayUrl,
  getUpiQrImageUrl,
} from "@/lib/donate";

const QUICK_AMOUNTS = [10, 49, 99, 199];

function isAndroid(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent || "");
}

function isMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent || "");
}

/**
 * Open the system UPI chooser (GPay / PhonePe / Paytm / BHIM).
 * Android Chrome prefers intent://; other mobile browsers use upi://.
 * Desktop: copy tip is shown — QR remains the reliable path.
 */
function openUpiApp(amountInr?: number) {
  const upiUrl = getUpiPayUrl(amountInr);

  if (!isMobile()) {
    // Desktop browsers usually cannot open UPI apps — QR is the path.
    window.alert("On a computer, please scan the QR code with your phone’s UPI app.");
    return;
  }

  if (isAndroid()) {
    const intentUrl = getUpiAndroidIntentUrl(amountInr);
    const startedAt = Date.now();
    window.location.href = intentUrl;

    // Fallback only if the page stayed visible (intent did not hand off).
    window.setTimeout(() => {
      if (document.visibilityState === "visible" && Date.now() - startedAt < 2500) {
        window.location.href = upiUrl;
      }
    }, 1100);
    return;
  }

  // iOS / other mobile
  window.location.href = upiUrl;
}

export default function DonateUpiCard() {
  const [copied, setCopied] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | undefined>(10);
  const qrUrl = useMemo(() => getUpiQrImageUrl(selectedAmount), [selectedAmount]);
  const upiHref = useMemo(() => getUpiPayUrl(selectedAmount), [selectedAmount]);

  async function copyUpi() {
    try {
      await navigator.clipboard.writeText(DONATE_UPI_ID);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy UPI ID:", DONATE_UPI_ID);
    }
  }

  return (
    <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-5 dark:border-indigo-800/60 dark:bg-indigo-950/30 sm:p-6">
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Pay via UPI</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Choose an amount, then open your UPI app or scan the QR code.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {QUICK_AMOUNTS.map((amount) => {
          const active = selectedAmount === amount;
          return (
            <button
              key={amount}
              type="button"
              onClick={() => setSelectedAmount(amount)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
                active
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-indigo-300 bg-white text-indigo-700 hover:bg-indigo-100 dark:border-indigo-700 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-slate-800"
              }`}
            >
              ₹{amount}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setSelectedAmount(undefined)}
          className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition ${
            selectedAmount === undefined
              ? "border-indigo-600 bg-indigo-600 text-white"
              : "border-indigo-300 bg-white text-indigo-700 hover:bg-indigo-100 dark:border-indigo-700 dark:bg-slate-900 dark:text-indigo-300 dark:hover:bg-slate-800"
          }`}
        >
          Any amount
        </button>
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-[200px_1fr] sm:items-start">
        <div className="mx-auto w-fit rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-600 dark:bg-slate-900">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrUrl}
            alt="UPI payment QR code"
            width={176}
            height={176}
            className="h-44 w-44"
          />
          <p className="mt-2 text-center text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Scan with any UPI app
            {selectedAmount ? ` · ₹${selectedAmount}` : ""}
          </p>
        </div>

        <div>
          <div className="flex flex-col gap-2">
            <code className="break-all rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100">
              {DONATE_UPI_ID}
            </code>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={copyUpi}
                className="rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
              >
                {copied ? "Copied" : "Copy UPI ID"}
              </button>
              {/*
                Real <a href="upi://..."> preserves the user gesture for app
                handoff; onClick upgrades Android to intent:// when needed.
              */}
              <a
                href={upiHref}
                onClick={(e) => {
                  e.preventDefault();
                  openUpiApp(selectedAmount);
                }}
                className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Open UPI app{selectedAmount ? ` · ₹${selectedAmount}` : ""}
              </a>
            </div>
          </div>

          <p className="mt-3 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            On a phone, <strong>Open UPI app</strong> should launch GPay / PhonePe / Paytm / BHIM.
            On a computer, scan the QR with your phone. Donation is optional and does not unlock any
            paid features.
          </p>
        </div>
      </div>
    </div>
  );
}
