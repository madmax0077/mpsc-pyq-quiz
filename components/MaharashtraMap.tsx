"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DAMS,
  DISTRICTS,
  FORTS,
  GHATS,
  MAHARASHTRA_BOUNDS,
  MAHARASHTRA_CENTER,
  MINERALS,
  POWER_PLANTS,
  RIVERS,
  UNESCO_SITES,
  WATERFALLS,
  type DistrictMarker,
  type LatLng,
  type MineralPoi,
  type Poi,
  type RiverFeature,
} from "@/lib/mapData/maharashtra";

/* ──────────────────────────────────────────────────────────────────── */
/*  CDN loader for MapLibre GL JS                                       */
/*                                                                       */
/*  We deliberately load the library at runtime from a CDN so it never   */
/*  bloats the main bundle (and so this file works without an npm       */
/*  install on first run). Swap the URLs below to pin a different       */
/*  version. If you eventually `npm install maplibre-gl`, change         */
/*  loadMapLibre() to `import("maplibre-gl")` and import the CSS in     */
/*  globals.css instead.                                                 */
/* ──────────────────────────────────────────────────────────────────── */

const MAPLIBRE_VERSION = "4.7.1";
const MAPLIBRE_JS_URL = `https://unpkg.com/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.js`;
const MAPLIBRE_CSS_URL = `https://unpkg.com/maplibre-gl@${MAPLIBRE_VERSION}/dist/maplibre-gl.css`;

// MapLibre's runtime API is large; we only use a tiny subset, so a
// permissive `any` interface here keeps the file readable without
// pulling the full type package.
type MapLibreModule = {
  Map: new (opts: Record<string, unknown>) => MapLibreMap;
  Marker: new (opts?: Record<string, unknown>) => MapLibreMarker;
  Popup: new (opts?: Record<string, unknown>) => MapLibrePopup;
  NavigationControl: new (opts?: Record<string, unknown>) => unknown;
  ScaleControl: new (opts?: Record<string, unknown>) => unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

type MapLibreMap = {
  on: (ev: string, ...args: unknown[]) => MapLibreMap;
  off: (ev: string, ...args: unknown[]) => MapLibreMap;
  remove: () => void;
  resize: () => MapLibreMap;
  addControl: (ctrl: unknown, position?: string) => MapLibreMap;
  addSource: (id: string, src: Record<string, unknown>) => MapLibreMap;
  addLayer: (layer: Record<string, unknown>, beforeId?: string) => MapLibreMap;
  removeLayer: (id: string) => MapLibreMap;
  removeSource: (id: string) => MapLibreMap;
  getLayer: (id: string) => unknown;
  getSource: (id: string) => unknown;
  setLayoutProperty: (id: string, name: string, value: unknown) => MapLibreMap;
  setTerrain: (terrain: Record<string, unknown> | null) => MapLibreMap;
  setMaxBounds: (bounds: [LatLng, LatLng]) => MapLibreMap;
  flyTo: (opts: Record<string, unknown>) => MapLibreMap;
  easeTo: (opts: Record<string, unknown>) => MapLibreMap;
  isStyleLoaded: () => boolean;
};

type MapLibreMarker = {
  setLngLat: (c: LatLng) => MapLibreMarker;
  setPopup: (p: MapLibrePopup) => MapLibreMarker;
  addTo: (m: MapLibreMap) => MapLibreMarker;
  remove: () => MapLibreMarker;
  getElement: () => HTMLElement;
};

type MapLibrePopup = {
  setHTML: (html: string) => MapLibrePopup;
  setLngLat: (c: LatLng) => MapLibrePopup;
  addTo: (m: MapLibreMap) => MapLibrePopup;
  remove: () => MapLibrePopup;
};

declare global {
  interface Window {
    maplibregl?: MapLibreModule;
  }
}

let maplibrePromise: Promise<MapLibreModule> | null = null;

/**
 * Inject a stylesheet and resolve when it has finished loading. This matters
 * because MapLibre's canvas measures the container at construction time, and
 * if the maplibre-gl.css file hasn't applied yet the container can collapse
 * to 0px and the map renders into a zero-size canvas (no tiles visible).
 */
function loadStylesheet(href: string): Promise<void> {
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLLinkElement>(`link[href="${href}"]`);
    if (existing) {
      // Browsers don't always fire `load` for already-cached stylesheets; if
      // the sheet is already in the document, assume it's ready.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((existing as any).sheet) resolve();
      else existing.addEventListener("load", () => resolve(), { once: true });
      // Even if it errors, don't block — fall back to default browser styles.
      existing.addEventListener("error", () => resolve(), { once: true });
      return;
    }
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => resolve(); // don't fail the whole map for a CSS hiccup
    document.head.appendChild(link);
  });
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existing) {
      if (window.maplibregl) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("MapLibre script failed to load")),
        { once: true },
      );
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("MapLibre script failed to load"));
    document.head.appendChild(script);
  });
}

function loadMapLibre(): Promise<MapLibreModule> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("MapLibre can only load in the browser"));
  }
  if (window.maplibregl) return Promise.resolve(window.maplibregl);
  if (maplibrePromise) return maplibrePromise;

  maplibrePromise = (async () => {
    // Load both in parallel but await BOTH before constructing the Map.
    await Promise.all([loadStylesheet(MAPLIBRE_CSS_URL), loadScript(MAPLIBRE_JS_URL)]);
    if (!window.maplibregl) throw new Error("MapLibre loaded but global is missing");
    return window.maplibregl;
  })();
  return maplibrePromise;
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Map style — free raster tiles, no API key needed.                   */
/*                                                                       */
/*  We use Carto's "voyager" basemap as the primary tile source: it's   */
/*  CDN-hosted, very reliable, and free for non-commercial use without  */
/*  attribution beyond the standard OSM/Carto credit. OSM tiles are     */
/*  listed as a secondary URL so MapLibre can fall back automatically  */
/*  if a Carto request fails.                                            */
/* ──────────────────────────────────────────────────────────────────── */

function buildBaseStyle(): Record<string, unknown> {
  return {
    version: 8,
    glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
    sources: {
      basemap: {
        type: "raster",
        tiles: [
          "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
          "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
          "https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
          "https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
          "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
          "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
          "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
        attribution:
          "© OpenStreetMap contributors © CARTO",
        maxzoom: 19,
      },
    },
    layers: [
      { id: "background", type: "background", paint: { "background-color": "#e2e8f0" } },
      { id: "basemap", type: "raster", source: "basemap", minzoom: 0, maxzoom: 22 },
    ],
  };
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Layer toggles                                                       */
/* ──────────────────────────────────────────────────────────────────── */

type LayerKey =
  | "districts"
  | "rivers"
  | "dams"
  | "waterfalls"
  | "ghats"
  | "nuclear"
  | "minerals"
  | "unesco"
  | "forts"
  | "terrain";

interface LayerSpec {
  key: LayerKey;
  label: string;
  emoji: string;
  /** Tailwind classes for the legend pill. */
  pill: string;
  defaultOn: boolean;
}

const LAYER_SPECS: LayerSpec[] = [
  { key: "districts", label: "Districts", emoji: "🗺️", pill: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:border-indigo-700", defaultOn: true },
  { key: "rivers", label: "Rivers", emoji: "🏞️", pill: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-700", defaultOn: true },
  { key: "dams", label: "Dams", emoji: "🌊", pill: "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-300 dark:border-cyan-700", defaultOn: true },
  { key: "waterfalls", label: "Waterfalls", emoji: "💧", pill: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700", defaultOn: true },
  { key: "ghats", label: "Ghats", emoji: "⛰️", pill: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700", defaultOn: true },
  { key: "nuclear", label: "Power plants", emoji: "⚡", pill: "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-700", defaultOn: false },
  { key: "minerals", label: "Minerals", emoji: "⛏️", pill: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700", defaultOn: false },
  { key: "unesco", label: "UNESCO sites", emoji: "🏛️", pill: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-900/40 dark:text-fuchsia-300 dark:border-fuchsia-700", defaultOn: true },
  { key: "forts", label: "Historic forts", emoji: "🏰", pill: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-700", defaultOn: true },
  { key: "terrain", label: "3D terrain", emoji: "🏔️", pill: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-700", defaultOn: false },
];

/* ──────────────────────────────────────────────────────────────────── */
/*  Custom HTML markers (pure CSS — no extra dependencies)             */
/* ──────────────────────────────────────────────────────────────────── */

function makeDotEl(color: string, emoji: string, size = 28): HTMLElement {
  const el = document.createElement("div");
  el.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    border-radius: 9999px;
    background: ${color};
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: ${Math.round(size * 0.55)}px;
    box-shadow: 0 4px 14px rgba(0,0,0,0.25), 0 0 0 2px white;
    cursor: pointer;
    transition: transform 0.15s ease;
  `;
  el.textContent = emoji;
  el.onmouseenter = () => (el.style.transform = "scale(1.18)");
  el.onmouseleave = () => (el.style.transform = "scale(1)");
  return el;
}

function makeDistrictEl(name: string): HTMLElement {
  const el = document.createElement("div");
  el.style.cssText = `
    padding: 4px 10px;
    border-radius: 9999px;
    background: rgba(79, 70, 229, 0.92);
    color: white;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.01em;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    cursor: pointer;
    white-space: nowrap;
    transition: transform 0.15s ease, background 0.15s ease;
  `;
  el.textContent = name;
  el.onmouseenter = () => {
    el.style.transform = "scale(1.05)";
    el.style.background = "rgba(67, 56, 202, 1)";
  };
  el.onmouseleave = () => {
    el.style.transform = "scale(1)";
    el.style.background = "rgba(79, 70, 229, 0.92)";
  };
  return el;
}

const MINERAL_COLORS: Record<MineralPoi["mineral"], string> = {
  Manganese: "#7c3aed",
  Coal: "#1f2937",
  Bauxite: "#dc2626",
  "Iron Ore": "#92400e",
  Limestone: "#64748b",
  Copper: "#ea580c",
};

function popupHtml(title: string, subtitle?: string, badge?: string): string {
  const subtitleHtml = subtitle
    ? `<div style="font-size:11px;color:#64748b;margin-top:2px;">${escapeHtml(subtitle)}</div>`
    : "";
  const badgeHtml = badge
    ? `<div style="display:inline-block;margin-top:6px;padding:2px 8px;border-radius:9999px;background:#eef2ff;color:#4338ca;font-size:10px;font-weight:600;">${escapeHtml(badge)}</div>`
    : "";
  return `
    <div style="font-family:system-ui,sans-serif;padding:2px 4px;min-width:180px;">
      <div style="font-weight:700;font-size:13px;color:#0f172a;">${escapeHtml(title)}</div>
      ${subtitleHtml}
      ${badgeHtml}
    </div>
  `;
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Component                                                           */
/* ──────────────────────────────────────────────────────────────────── */

export default function MaharashtraMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const mlRef = useRef<MapLibreModule | null>(null);
  const markersRef = useRef<Record<LayerKey, MapLibreMarker[]>>({
    districts: [], rivers: [], dams: [], waterfalls: [], ghats: [],
    nuclear: [], minerals: [], unesco: [], forts: [], terrain: [],
  });

  const [layers, setLayers] = useState<Record<LayerKey, boolean>>(
    () => Object.fromEntries(LAYER_SPECS.map((s) => [s.key, s.defaultOn])) as Record<LayerKey, boolean>,
  );
  const [activeDistrict, setActiveDistrict] = useState<DistrictMarker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* — Initial map setup — */
  useEffect(() => {
    let cancelled = false;
    if (!containerRef.current) return;

    let onWindowResize: (() => void) | null = null;

    loadMapLibre()
      .then((ml) => {
        if (cancelled || !containerRef.current) return;
        mlRef.current = ml;
        const map = new ml.Map({
          container: containerRef.current,
          style: buildBaseStyle(),
          center: MAHARASHTRA_CENTER,
          zoom: 6.4,
          pitch: 35,
          bearing: 0,
          maxPitch: 75,
          attributionControl: { compact: true },
        });
        map.setMaxBounds([
          [MAHARASHTRA_BOUNDS[0][0] - 1, MAHARASHTRA_BOUNDS[0][1] - 1],
          [MAHARASHTRA_BOUNDS[1][0] + 1, MAHARASHTRA_BOUNDS[1][1] + 1],
        ]);
        map.addControl(new ml.NavigationControl({ visualizePitch: true }), "top-right");
        map.addControl(new ml.ScaleControl({ unit: "metric" }));

        // Surface tile/style errors to the console so we can diagnose blank
        // canvases (e.g. when corporate firewalls block tile CDNs).
        map.on("error", (ev: unknown) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const e: any = ev;
          if (e?.error) console.warn("[map] error:", e.error?.message || e.error);
        });

        map.on("load", () => {
          if (cancelled) return;
          mapRef.current = map;
          setLoading(false);
          applyAllLayers(map, ml, markersRef.current, layers, setActiveDistrict);

          // Belt-and-suspenders sizing: the parent container's CSS may have
          // applied AFTER the canvas was constructed. Force a resize on the
          // next tick and again after a short delay so the canvas matches
          // the visible box.
          requestAnimationFrame(() => {
            try { map.easeTo({ duration: 0 }); } catch { /* noop */ }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            try { (map as any).resize?.(); } catch { /* noop */ }
          });
          setTimeout(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            try { (map as any).resize?.(); } catch { /* noop */ }
          }, 250);
        });

        onWindowResize = () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          try { (map as any).resize?.(); } catch { /* noop */ }
        };
        window.addEventListener("resize", onWindowResize);
      })
      .catch((e: Error) => {
        if (cancelled) return;
        setError(e.message || "Failed to load map library");
        setLoading(false);
      });

    return () => {
      cancelled = true;
      if (onWindowResize) window.removeEventListener("resize", onWindowResize);
      // Remove markers
      for (const arr of Object.values(markersRef.current)) {
        for (const m of arr) m.remove();
        arr.length = 0;
      }
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* — React to layer-toggle changes — */
  useEffect(() => {
    const map = mapRef.current;
    const ml = mlRef.current;
    if (!map || !ml || !map.isStyleLoaded()) return;
    applyAllLayers(map, ml, markersRef.current, layers, setActiveDistrict);
  }, [layers]);

  const visibleCount = useMemo(() => Object.values(layers).filter(Boolean).length, [layers]);

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      style={{ minHeight: 480 }}
    >
      <div ref={containerRef} className="absolute inset-0" style={{ minHeight: 480 }} />

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-100/90 dark:bg-slate-900/90">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading the map of Maharashtra…</p>
          </div>
        </div>
      )}

      {/* Error overlay */}
      {error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-100 p-6 dark:bg-slate-900">
          <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-5 text-center dark:border-red-800 dark:bg-red-900/20">
            <p className="font-semibold text-red-700 dark:text-red-300">Map could not load</p>
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
            <p className="mt-3 text-xs text-red-500 dark:text-red-300">
              Likely a network issue (CDN blocked or offline). Refresh and try again.
            </p>
          </div>
        </div>
      )}

      {/* Layer toggle panel */}
      {!loading && !error && (
        <div className="absolute left-3 top-3 z-10 max-w-[260px] rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-800/95">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Layers ({visibleCount}/{LAYER_SPECS.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-1">
            {LAYER_SPECS.map((spec) => {
              const on = layers[spec.key];
              return (
                <button
                  key={spec.key}
                  onClick={() => setLayers((prev) => ({ ...prev, [spec.key]: !prev[spec.key] }))}
                  className={`flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    on
                      ? spec.pill
                      : "border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span aria-hidden>{spec.emoji}</span>
                    <span>{spec.label}</span>
                  </span>
                  <span
                    className={`inline-block h-3 w-3 rounded-full ${
                      on ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500">
            Tip: drag with right-click to tilt. Scroll to zoom. Click any district pill to fly there.
          </p>
        </div>
      )}

      {/* Active district panel */}
      {!loading && !error && activeDistrict && (
        <div className="absolute right-3 top-3 z-10 max-w-[260px] rounded-2xl border border-indigo-200 bg-white/95 p-3 shadow-xl backdrop-blur dark:border-indigo-800 dark:bg-slate-800/95">
          <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400">
            Focused district
          </p>
          <h3 className="mt-1 text-base font-extrabold text-slate-800 dark:text-slate-100">
            {activeDistrict.name}
          </h3>
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Lat {activeDistrict.coords[1].toFixed(2)} · Lng {activeDistrict.coords[0].toFixed(2)}
          </p>
          <button
            onClick={() => {
              setActiveDistrict(null);
              mapRef.current?.flyTo({
                center: MAHARASHTRA_CENTER,
                zoom: 6.4,
                pitch: 35,
                duration: 900,
              });
            }}
            className="mt-3 w-full rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            ← Back to full state
          </button>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Layer-render helpers                                                */
/* ──────────────────────────────────────────────────────────────────── */

function applyAllLayers(
  map: MapLibreMap,
  ml: MapLibreModule,
  buckets: Record<LayerKey, MapLibreMarker[]>,
  layers: Record<LayerKey, boolean>,
  onDistrictClick: (d: DistrictMarker) => void,
) {
  // Clear all marker buckets first; then re-add only those that are toggled on.
  for (const arr of Object.values(buckets)) {
    for (const m of arr) m.remove();
    arr.length = 0;
  }

  if (layers.districts) {
    for (const d of DISTRICTS) {
      const el = makeDistrictEl(d.name);
      el.addEventListener("click", () => {
        onDistrictClick(d);
        map.flyTo({ center: d.coords, zoom: d.zoom, pitch: 50, duration: 1100 });
      });
      buckets.districts.push(new ml.Marker({ element: el }).setLngLat(d.coords).addTo(map));
    }
  }

  if (layers.dams) addPoiMarkers(map, ml, buckets.dams, DAMS, "#0891b2", "🌊", "Dam");
  if (layers.waterfalls) addPoiMarkers(map, ml, buckets.waterfalls, WATERFALLS, "#2563eb", "💧", "Waterfall");
  if (layers.ghats) addPoiMarkers(map, ml, buckets.ghats, GHATS, "#ea580c", "⛰️", "Ghat");
  if (layers.nuclear) addPoiMarkers(map, ml, buckets.nuclear, POWER_PLANTS, "#ca8a04", "⚡", "Power plant");
  if (layers.unesco) addPoiMarkers(map, ml, buckets.unesco, UNESCO_SITES, "#c026d3", "🏛️", "UNESCO");
  if (layers.forts) addPoiMarkers(map, ml, buckets.forts, FORTS, "#e11d48", "🏰", "Fort");

  if (layers.minerals) {
    for (const m of MINERALS) {
      const color = MINERAL_COLORS[m.mineral];
      const el = makeDotEl(color, "⛏️", 30);
      const popup = new ml.Popup({ offset: 18, closeButton: false }).setHTML(
        popupHtml(m.name, m.subtitle, m.mineral),
      );
      buckets.minerals.push(
        new ml.Marker({ element: el }).setLngLat(m.coords).setPopup(popup).addTo(map),
      );
    }
  }

  // River polylines: managed as map sources (not markers).
  applyRiversLayer(map, layers.rivers);

  // 3D terrain: optional, requires a DEM source. Defaults to AWS open
  // elevation tiles (Mapzen "terrarium" encoding). If they fail, we
  // silently fall back to flat 3D (just camera tilt).
  applyTerrainLayer(map, layers.terrain);
}

function addPoiMarkers(
  map: MapLibreMap,
  ml: MapLibreModule,
  bucket: MapLibreMarker[],
  pois: Poi[],
  color: string,
  emoji: string,
  badge: string,
) {
  for (const p of pois) {
    const el = makeDotEl(color, emoji);
    const popup = new ml.Popup({ offset: 18, closeButton: false }).setHTML(
      popupHtml(p.name, p.subtitle, badge),
    );
    bucket.push(new ml.Marker({ element: el }).setLngLat(p.coords).setPopup(popup).addTo(map));
  }
}

function applyRiversLayer(map: MapLibreMap, on: boolean) {
  const SRC = "rivers-src";
  const LYR = "rivers-line";
  const exists = !!map.getSource(SRC);

  if (on && !exists) {
    map.addSource(SRC, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: RIVERS.map((r: RiverFeature) => ({
          type: "Feature",
          properties: { name: r.name },
          geometry: { type: "LineString", coordinates: r.path },
        })),
      },
    });
    map.addLayer({
      id: LYR,
      type: "line",
      source: SRC,
      paint: {
        "line-color": "#0ea5e9",
        "line-width": [
          "interpolate",
          ["linear"],
          ["zoom"],
          5, 1.5,
          8, 2.5,
          11, 4,
        ],
        "line-opacity": 0.85,
      },
      layout: { "line-cap": "round", "line-join": "round" },
    });
  } else if (!on && exists) {
    if (map.getLayer(LYR)) map.removeLayer(LYR);
    map.removeSource(SRC);
  }
}

function applyTerrainLayer(map: MapLibreMap, on: boolean) {
  const SRC = "dem-src";
  const HILLSHADE = "hillshade";
  const sourceExists = !!map.getSource(SRC);

  if (on) {
    if (!sourceExists) {
      try {
        map.addSource(SRC, {
          type: "raster-dem",
          tiles: [
            "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
          ],
          tileSize: 256,
          encoding: "terrarium",
          maxzoom: 15,
        });
        map.addLayer({
          id: HILLSHADE,
          type: "hillshade",
          source: SRC,
          paint: {
            "hillshade-shadow-color": "#404040",
            "hillshade-highlight-color": "#FFFFFF",
            "hillshade-exaggeration": 0.55,
          },
        });
      } catch (e) {
        console.warn("terrain source failed:", e);
        return;
      }
    }
    try {
      map.setTerrain({ source: SRC, exaggeration: 1.3 });
    } catch (e) {
      console.warn("setTerrain failed:", e);
    }
  } else {
    try {
      map.setTerrain(null);
    } catch {
      /* noop */
    }
    if (map.getLayer(HILLSHADE)) map.removeLayer(HILLSHADE);
    if (sourceExists) map.removeSource(SRC);
  }
}
