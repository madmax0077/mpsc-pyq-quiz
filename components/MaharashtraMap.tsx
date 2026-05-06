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
/*  CDN loader for Leaflet 1.9.x                                        */
/*                                                                       */
/*  Leaflet is the most reliable 2D web-map library: ~140 KB gzipped,   */
/*  zero peer-deps, decades of battle-testing. We lazy-load the script  */
/*  + CSS from a CDN so the heavy library only ships when /map opens.   */
/*  No npm install required.                                             */
/* ──────────────────────────────────────────────────────────────────── */

const LEAFLET_VERSION = "1.9.4";
const LEAFLET_JS_URL = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.js`;
const LEAFLET_CSS_URL = `https://unpkg.com/leaflet@${LEAFLET_VERSION}/dist/leaflet.css`;

// Permissive type definitions — we only use a small slice of Leaflet's API
// and avoiding the @types/leaflet dependency keeps this file self-contained.
type LeafletModule = {
  map: (el: HTMLElement, opts?: Record<string, unknown>) => LeafletMap;
  tileLayer: (url: string, opts?: Record<string, unknown>) => LeafletLayer;
  marker: (latlng: [number, number], opts?: Record<string, unknown>) => LeafletMarker;
  polyline: (latlngs: Array<[number, number]>, opts?: Record<string, unknown>) => LeafletLayer;
  circleMarker: (latlng: [number, number], opts?: Record<string, unknown>) => LeafletMarker;
  divIcon: (opts: Record<string, unknown>) => unknown;
  control: {
    layers: (
      base: Record<string, LeafletLayer>,
      overlays?: Record<string, LeafletLayer>,
      opts?: Record<string, unknown>,
    ) => LeafletControl;
    scale: (opts?: Record<string, unknown>) => LeafletControl;
  };
  latLngBounds: (sw: [number, number], ne: [number, number]) => unknown;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k: string]: any;
};

type LeafletMap = {
  setView: (latlng: [number, number], zoom: number) => LeafletMap;
  flyTo: (latlng: [number, number], zoom?: number, opts?: Record<string, unknown>) => LeafletMap;
  setMaxBounds: (bounds: unknown) => LeafletMap;
  fitBounds: (bounds: unknown, opts?: Record<string, unknown>) => LeafletMap;
  addLayer: (l: LeafletLayer | LeafletMarker) => LeafletMap;
  removeLayer: (l: LeafletLayer | LeafletMarker) => LeafletMap;
  hasLayer: (l: LeafletLayer | LeafletMarker) => boolean;
  invalidateSize: () => LeafletMap;
  remove: () => void;
  on: (ev: string, cb: (...a: unknown[]) => void) => LeafletMap;
};

type LeafletLayer = {
  addTo: (m: LeafletMap) => LeafletLayer;
  remove: () => LeafletLayer;
  bringToFront?: () => LeafletLayer;
};

type LeafletMarker = LeafletLayer & {
  bindPopup: (html: string, opts?: Record<string, unknown>) => LeafletMarker;
  on: (ev: string, cb: (...a: unknown[]) => void) => LeafletMarker;
  setLatLng: (latlng: [number, number]) => LeafletMarker;
};

type LeafletControl = {
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

function loadLeaflet(): Promise<LeafletModule> {
  if (typeof window === "undefined") return Promise.reject(new Error("Leaflet only loads in the browser"));
  if (window.L) return Promise.resolve(window.L);
  if (leafletPromise) return leafletPromise;
  leafletPromise = (async () => {
    await Promise.all([loadStylesheet(LEAFLET_CSS_URL), loadScript(LEAFLET_JS_URL)]);
    if (!window.L) throw new Error("Leaflet loaded but global is missing");
    return window.L;
  })();
  return leafletPromise;
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Basemap providers — all free, no API key required.                  */
/* ──────────────────────────────────────────────────────────────────── */

type BasemapKey = "voyager" | "satellite" | "topo" | "osm";

interface BasemapSpec {
  key: BasemapKey;
  label: string;
  emoji: string;
  url: string;
  attribution: string;
  maxZoom: number;
  /** Crisper rendering on retina/HDPI displays. */
  detectRetina: boolean;
}

const BASEMAPS: BasemapSpec[] = [
  {
    key: "voyager",
    label: "Streets",
    emoji: "🛣️",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
    maxZoom: 20,
    detectRetina: true,
  },
  {
    key: "satellite",
    label: "Satellite",
    emoji: "🛰️",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
    maxZoom: 19,
    detectRetina: false,
  },
  {
    key: "topo",
    label: "Topographic",
    emoji: "🗻",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, USGS, NOAA, and the GIS user community",
    maxZoom: 19,
    detectRetina: false,
  },
  {
    key: "osm",
    label: "OSM",
    emoji: "🗺️",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19,
    detectRetina: false,
  },
];

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
  | "forts";

interface LayerSpec {
  key: LayerKey;
  label: string;
  emoji: string;
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
];

/* ──────────────────────────────────────────────────────────────────── */
/*  Custom HTML icons                                                   */
/* ──────────────────────────────────────────────────────────────────── */

function divIconHtml(emoji: string, color: string, size = 32): string {
  return `
    <div style="
      width:${size}px;height:${size}px;border-radius:9999px;
      background:${color};color:#fff;
      display:flex;align-items:center;justify-content:center;
      font-size:${Math.round(size * 0.55)}px;
      box-shadow:0 4px 14px rgba(0,0,0,.25),0 0 0 2px #fff;
      transition:transform .15s ease;
      cursor:pointer;
    "
      onmouseover="this.style.transform='scale(1.18)'"
      onmouseout="this.style.transform='scale(1)'"
    >${emoji}</div>
  `;
}

function districtPillHtml(name: string): string {
  return `
    <div style="
      padding:4px 10px;border-radius:9999px;
      background:rgba(79,70,229,.95);color:#fff;
      font-size:11px;font-weight:600;letter-spacing:.01em;
      box-shadow:0 4px 12px rgba(0,0,0,.2);
      white-space:nowrap;cursor:pointer;
      transition:transform .15s ease,background .15s ease;
      font-family:system-ui,sans-serif;
    "
      onmouseover="this.style.transform='scale(1.05)';this.style.background='rgba(67,56,202,1)'"
      onmouseout="this.style.transform='scale(1)';this.style.background='rgba(79,70,229,.95)'"
    >${escapeHtml(name)}</div>
  `;
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

// Convert GeoJSON [lng, lat] to Leaflet [lat, lng]
const ll = (c: LatLng): [number, number] => [c[1], c[0]];

export default function MaharashtraMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const lRef = useRef<LeafletModule | null>(null);
  const basemapLayerRef = useRef<LeafletLayer | null>(null);
  const layerBucketsRef = useRef<Record<LayerKey, Array<LeafletLayer | LeafletMarker>>>({
    districts: [], rivers: [], dams: [], waterfalls: [], ghats: [],
    nuclear: [], minerals: [], unesco: [], forts: [],
  });

  const [layers, setLayers] = useState<Record<LayerKey, boolean>>(
    () => Object.fromEntries(LAYER_SPECS.map((s) => [s.key, s.defaultOn])) as Record<LayerKey, boolean>,
  );
  const [basemap, setBasemap] = useState<BasemapKey>("voyager");
  const [activeDistrict, setActiveDistrict] = useState<DistrictMarker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* — Initial map setup — */
  useEffect(() => {
    let cancelled = false;
    if (!containerRef.current) return;

    let onWindowResize: (() => void) | null = null;

    loadLeaflet()
      .then((L) => {
        if (cancelled || !containerRef.current) return;
        lRef.current = L;
        const map = L.map(containerRef.current, {
          center: ll(MAHARASHTRA_CENTER),
          zoom: 7,
          minZoom: 6,
          maxZoom: 18,
          // Default zoom control sits in top-left and clashes with our layer
          // panel, so we re-place it bottom-right after construction.
          zoomControl: false,
          worldCopyJump: false,
          attributionControl: true,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new (L as any).Control.Zoom({ position: "bottomright" }).addTo(map);
        // Restrict pan to roughly Maharashtra envelope.
        map.setMaxBounds(
          L.latLngBounds(
            [MAHARASHTRA_BOUNDS[0][1] - 1, MAHARASHTRA_BOUNDS[0][0] - 1],
            [MAHARASHTRA_BOUNDS[1][1] + 1, MAHARASHTRA_BOUNDS[1][0] + 1],
          ),
        );
        L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

        basemapLayerRef.current = applyBasemap(L, map, null, basemap);

        mapRef.current = map;
        setLoading(false);
        applyAllLayers(L, map, layerBucketsRef.current, layers, setActiveDistrict);

        // Defensive resize: if CSS applied late, the canvas may have been
        // measured at the wrong size.
        requestAnimationFrame(() => { try { map.invalidateSize(); } catch { /* noop */ } });
        setTimeout(() => { try { map.invalidateSize(); } catch { /* noop */ } }, 250);

        onWindowResize = () => { try { map.invalidateSize(); } catch { /* noop */ } };
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
      for (const arr of Object.values(layerBucketsRef.current)) {
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
    const L = lRef.current;
    if (!map || !L) return;
    applyAllLayers(L, map, layerBucketsRef.current, layers, setActiveDistrict);
  }, [layers]);

  /* — React to basemap changes — */
  useEffect(() => {
    const map = mapRef.current;
    const L = lRef.current;
    if (!map || !L) return;
    basemapLayerRef.current = applyBasemap(L, map, basemapLayerRef.current, basemap);
  }, [basemap]);

  const visibleCount = useMemo(() => Object.values(layers).filter(Boolean).length, [layers]);

  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      style={{ minHeight: 480 }}
    >
      <div ref={containerRef} className="absolute inset-0" style={{ minHeight: 480 }} />

      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-100/90 dark:bg-slate-900/90">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600 dark:border-slate-700 dark:border-t-indigo-400" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Loading the map of Maharashtra…</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-100 p-6 dark:bg-slate-900">
          <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-5 text-center dark:border-red-800 dark:bg-red-900/20">
            <p className="font-semibold text-red-700 dark:text-red-300">Map could not load</p>
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
            <p className="mt-3 text-xs text-red-500 dark:text-red-300">
              Likely a network issue. Refresh and try again.
            </p>
          </div>
        </div>
      )}

      {/* Basemap switcher — z-index above Leaflet's controls (which use 1000) */}
      {!loading && !error && (
        <div
          className="absolute right-3 top-3 rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-800/95"
          style={{ zIndex: 1100 }}
          onMouseDown={stopMapPropagation}
          onClick={stopMapPropagation}
          onWheel={stopMapPropagation}
          onDoubleClick={stopMapPropagation}
        >
          <div className="flex items-center gap-1">
            {BASEMAPS.map((b) => (
              <button
                key={b.key}
                onClick={() => setBasemap(b.key)}
                title={b.label}
                className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                  basemap === b.key
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                <span aria-hidden>{b.emoji}</span>
                <span className="hidden sm:inline">{b.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Layer toggle panel */}
      {!loading && !error && (
        <div
          className="absolute left-3 top-3 max-w-[260px] rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-800/95"
          style={{ zIndex: 1100 }}
          onMouseDown={stopMapPropagation}
          onClick={stopMapPropagation}
          onWheel={stopMapPropagation}
          onDoubleClick={stopMapPropagation}
        >
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
            Tip: scroll to zoom. Drag to pan. Click any district pill to fly there.
          </p>
        </div>
      )}

      {/* Active district panel */}
      {!loading && !error && activeDistrict && (
        <div
          className="absolute bottom-12 left-3 max-w-[260px] rounded-2xl border border-indigo-200 bg-white/95 p-3 shadow-xl backdrop-blur dark:border-indigo-800 dark:bg-slate-800/95"
          style={{ zIndex: 1100 }}
          onMouseDown={stopMapPropagation}
          onClick={stopMapPropagation}
          onWheel={stopMapPropagation}
          onDoubleClick={stopMapPropagation}
        >
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
              mapRef.current?.flyTo(ll(MAHARASHTRA_CENTER), 7, { duration: 0.8 });
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

/**
 * Prevent mouse and wheel events on overlay panels from reaching the
 * underlying Leaflet map (otherwise the map starts dragging or zooming
 * when the user is just trying to click a layer toggle).
 */
function stopMapPropagation(e: React.SyntheticEvent) {
  e.stopPropagation();
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Layer-render helpers                                                */
/* ──────────────────────────────────────────────────────────────────── */

function applyBasemap(
  L: LeafletModule,
  map: LeafletMap,
  current: LeafletLayer | null,
  key: BasemapKey,
): LeafletLayer {
  if (current) current.remove();
  const spec = BASEMAPS.find((b) => b.key === key)!;
  const layer = L.tileLayer(spec.url, {
    attribution: spec.attribution,
    maxZoom: spec.maxZoom,
    detectRetina: spec.detectRetina,
    crossOrigin: true,
    subdomains: spec.url.includes("{s}") ? ["a", "b", "c", "d"] : undefined,
  });
  layer.addTo(map);
  return layer;
}

function applyAllLayers(
  L: LeafletModule,
  map: LeafletMap,
  buckets: Record<LayerKey, Array<LeafletLayer | LeafletMarker>>,
  layers: Record<LayerKey, boolean>,
  onDistrictClick: (d: DistrictMarker) => void,
) {
  for (const arr of Object.values(buckets)) {
    for (const m of arr) m.remove();
    arr.length = 0;
  }

  if (layers.districts) {
    for (const d of DISTRICTS) {
      const icon = L.divIcon({
        className: "mh-district-pill",
        html: districtPillHtml(d.name),
        iconSize: undefined as unknown as number[],
      });
      const m = L.marker(ll(d.coords), { icon });
      m.on("click", () => {
        onDistrictClick(d);
        map.flyTo(ll(d.coords), Math.min(11, Math.max(9, d.zoom + 1)), { duration: 0.9 });
      });
      m.addTo(map);
      buckets.districts.push(m);
    }
  }

  if (layers.dams) addPois(L, map, buckets.dams, DAMS, "#0891b2", "🌊", "Dam");
  if (layers.waterfalls) addPois(L, map, buckets.waterfalls, WATERFALLS, "#2563eb", "💧", "Waterfall");
  if (layers.ghats) addPois(L, map, buckets.ghats, GHATS, "#ea580c", "⛰️", "Ghat");
  if (layers.nuclear) addPois(L, map, buckets.nuclear, POWER_PLANTS, "#ca8a04", "⚡", "Power plant");
  if (layers.unesco) addPois(L, map, buckets.unesco, UNESCO_SITES, "#c026d3", "🏛️", "UNESCO");
  if (layers.forts) addPois(L, map, buckets.forts, FORTS, "#e11d48", "🏰", "Fort");

  if (layers.minerals) {
    for (const mn of MINERALS) {
      const color = MINERAL_COLORS[mn.mineral];
      const icon = L.divIcon({
        className: "mh-mineral",
        html: divIconHtml("⛏️", color, 30),
        iconAnchor: [15, 15] as unknown as number[],
      });
      const m = L.marker(ll(mn.coords), { icon }).bindPopup(popupHtml(mn.name, mn.subtitle, mn.mineral));
      m.addTo(map);
      buckets.minerals.push(m);
    }
  }

  if (layers.rivers) {
    for (const r of RIVERS) {
      const line = L.polyline(r.path.map(ll), {
        color: "#0ea5e9",
        weight: 4,
        opacity: 0.85,
        lineCap: "round",
        lineJoin: "round",
      });
      line.addTo(map);
      buckets.rivers.push(line);
    }
  }
}

function addPois(
  L: LeafletModule,
  map: LeafletMap,
  bucket: Array<LeafletLayer | LeafletMarker>,
  pois: Poi[],
  color: string,
  emoji: string,
  badge: string,
) {
  for (const p of pois) {
    const icon = L.divIcon({
      className: "mh-poi",
      html: divIconHtml(emoji, color),
      iconAnchor: [16, 16] as unknown as number[],
    });
    const m = L.marker(ll(p.coords), { icon }).bindPopup(popupHtml(p.name, p.subtitle, badge));
    m.addTo(map);
    bucket.push(m);
  }
}

// Re-export the rivers type so future work can extend.
export type { RiverFeature };
