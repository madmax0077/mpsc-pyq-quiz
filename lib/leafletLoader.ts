/**
 * Shared Leaflet CDN loader + minimal TS surface.
 *
 * Both /map and /rivers-maharashtra pages lazy-load Leaflet 1.9.x from
 * a CDN at runtime. They used to each declare their own copies of the
 * types and the `Window.L` global, which clashed at build time. This
 * module centralises everything so the components can just `import`.
 */

const LEAFLET_VERSION = "1.9.4";
const LEAFLET_JS_URL = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;
const LEAFLET_CSS_URL = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;

export type LeafletModule = {
  map: (el: HTMLElement, opts?: Record<string, unknown>) => LeafletMap;
  tileLayer: (url: string, opts?: Record<string, unknown>) => LeafletLayer;
  marker: (latlng: [number, number], opts?: Record<string, unknown>) => LeafletMarker;
  polyline: (latlngs: Array<[number, number]>, opts?: Record<string, unknown>) => LeafletPolyline;
  divIcon: (opts: Record<string, unknown>) => unknown;
  control: { scale: (opts?: Record<string, unknown>) => LeafletControl };
  latLngBounds: (sw: [number, number], ne: [number, number]) => unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
};

export type LeafletMap = {
  setView: (latlng: [number, number], zoom: number) => LeafletMap;
  flyTo: (latlng: [number, number], zoom?: number, opts?: Record<string, unknown>) => LeafletMap;
  flyToBounds: (b: unknown, opts?: Record<string, unknown>) => LeafletMap;
  setMaxBounds: (bounds: unknown) => LeafletMap;
  fitBounds: (bounds: unknown, opts?: Record<string, unknown>) => LeafletMap;
  addLayer: (l: LeafletLayer | LeafletMarker) => LeafletMap;
  removeLayer: (l: LeafletLayer | LeafletMarker) => LeafletMap;
  invalidateSize: () => LeafletMap;
  remove: () => void;
};

export type LeafletLayer = {
  addTo: (m: LeafletMap) => LeafletLayer;
  remove: () => LeafletLayer;
  bringToFront?: () => LeafletLayer;
  bindPopup?: (html: string, opts?: Record<string, unknown>) => LeafletLayer;
  on?: (ev: string, cb: (...a: unknown[]) => void) => LeafletLayer;
};

export type LeafletPolyline = LeafletLayer & {
  setStyle: (s: Record<string, unknown>) => LeafletPolyline;
  getBounds: () => unknown;
  on: (ev: string, cb: (...a: unknown[]) => void) => LeafletPolyline;
  bindPopup: (html: string, opts?: Record<string, unknown>) => LeafletPolyline;
};

export type LeafletMarker = LeafletLayer & {
  bindPopup: (html: string, opts?: Record<string, unknown>) => LeafletMarker;
  on: (ev: string, cb: (...a: unknown[]) => void) => LeafletMarker;
  setLatLng?: (latlng: [number, number]) => LeafletMarker;
};

export type LeafletControl = {
  addTo: (m: LeafletMap) => LeafletControl;
  remove: () => LeafletControl;
};

declare global {
  interface Window {
    L?: LeafletModule;
  }
}

let leafletPromise: Promise<LeafletModule> | null = null;

function loadStylesheet(href: string): Promise<void> {
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLLinkElement>(`link[href="${href}"]`);
    if (existing) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((existing as any).sheet) resolve();
      else existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => resolve(), { once: true });
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => resolve();
    document.head.appendChild(link);
  });
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      if (window.L) { resolve(); return; }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Leaflet failed to load")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Leaflet failed to load"));
    document.head.appendChild(script);
  });
}

export function loadLeaflet(): Promise<LeafletModule> {
  if (typeof window === "undefined") return Promise.reject(new Error("Leaflet only loads in the browser"));
  if (window.L) return Promise.resolve(window.L);
  if (leafletPromise) return leafletPromise;
  const p: Promise<LeafletModule> = (async () => {
    await Promise.all([loadStylesheet(LEAFLET_CSS_URL), loadScript(LEAFLET_JS_URL)]);
    if (!window.L) throw new Error("Leaflet loaded but global is missing");
    return window.L;
  })();
  leafletPromise = p;
  return p;
}
