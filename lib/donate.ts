/** Public donation details for mpscs.in (Don't know Academy). */
export const DONATE_UPI_ID = "parthpatil1312-2@okicici";
export const DONATE_PAYEE_NAME = "Don't know Academy";

/**
 * Build a UPI deep link. Keep `pa` unescaped (`@` must stay `@`) so GPay /
 * PhonePe / Paytm can resolve the VPA reliably.
 */
export function getUpiPayUrl(amountInr?: number): string {
  const parts = [
    `pa=${DONATE_UPI_ID}`,
    `pn=${encodeURIComponent(DONATE_PAYEE_NAME)}`,
    "cu=INR",
    `tn=${encodeURIComponent("Support mpscs.in")}`,
  ];
  if (amountInr && amountInr > 0) {
    parts.push(`am=${Number(amountInr)}`);
  }
  return `upi://pay?${parts.join("&")}`;
}

/** Android Chrome intent URL — more reliable than raw upi:// in some browsers. */
export function getUpiAndroidIntentUrl(amountInr?: number): string {
  const query = getUpiPayUrl(amountInr).replace(/^upi:\/\//, "");
  return `intent://${query}#Intent;scheme=upi;end`;
}

export function getUpiQrImageUrl(amountInr?: number): string {
  const data = encodeURIComponent(getUpiPayUrl(amountInr));
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${data}`;
}
