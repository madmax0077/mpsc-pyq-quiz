/**
 * Thin wrapper around Ezoic's global `ezstandalone` command queue.
 *
 * Ezoic's standalone integration exposes `window.ezstandalone` with a `.cmd`
 * array you push callbacks onto; the loader drains the queue once ready. We
 * only ever touch it through these helpers so the (untyped) global stays
 * contained to one file.
 *
 * Docs: https://support.ezoic.com/kb/article/using-ezoic-ad-placeholders-manually
 */

type EzstandaloneApi = {
  cmd: Array<() => void>;
  showAds: (...ids: number[]) => void;
  destroyPlaceholders: (...ids: number[]) => void;
  destroyAll: () => void;
};

type EzoicWindow = Window & { ezstandalone?: EzstandaloneApi };

function getEz(): EzstandaloneApi | null {
  if (typeof window === "undefined") return null;
  const w = window as EzoicWindow;
  if (!w.ezstandalone) return null;
  w.ezstandalone.cmd = w.ezstandalone.cmd || [];
  return w.ezstandalone;
}

/** Request Ezoic to fill the given placeholder id(s). No-op if not loaded. */
export function ezShowAds(...ids: number[]): void {
  const ids2 = ids.filter((id) => id > 0);
  if (ids2.length === 0) return;
  const ez = getEz();
  if (!ez) return;
  ez.cmd.push(() => ez.showAds(...ids2));
}

/** Tear down placeholder id(s) before re-showing (used on SPA view changes). */
export function ezDestroy(...ids: number[]): void {
  const ids2 = ids.filter((id) => id > 0);
  if (ids2.length === 0) return;
  const ez = getEz();
  if (!ez) return;
  ez.cmd.push(() => ez.destroyPlaceholders(...ids2));
}

/** Tear down every Ezoic placeholder currently on the page. */
export function ezDestroyAll(): void {
  const ez = getEz();
  if (!ez) return;
  ez.cmd.push(() => ez.destroyAll());
}
