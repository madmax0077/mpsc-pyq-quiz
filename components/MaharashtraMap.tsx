"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  DAMS,
  FORTS,
  GHATS,
  HYDRO_PLANTS,
  MAHARASHTRA_BOUNDS,
  MAHARASHTRA_CENTER,
  MINERALS,
  NUCLEAR_PLANTS,
  RIVERS,
  THERMAL_PLANTS,
  UNESCO_SITES,
  WATERFALLS,
  type LatLng,
  type MineralPoi,
  type Poi,
  type RiverFeature,
} from "@/lib/mapData/maharashtra";

/* ──────────────────────────────────────────────────────────────────── */
/*  Leaflet CDN loader is centralised in @/lib/leafletLoader so this    */
/*  component and /rivers-maharashtra share a single set of types and   */
/*  a single Window.L global declaration.                               */
/* ──────────────────────────────────────────────────────────────────── */

import {
  loadLeaflet,
  type LeafletLayer,
  type LeafletMap,
  type LeafletMarker,
  type LeafletModule,
} from "@/lib/leafletLoader";

/* ──────────────────────────────────────────────────────────────────── */
/*  Layer toggles                                                       */
/* ──────────────────────────────────────────────────────────────────── */

type LayerKey =
  | "rivers"
  | "dams"
  | "waterfalls"
  | "ghats"
  | "nuclear"
  | "hydro"
  | "thermal"
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
  { key: "rivers", label: "Rivers + tributaries", emoji: "🏞️", pill: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-700", defaultOn: true },
  { key: "dams", label: "Dams", emoji: "🌊", pill: "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-300 dark:border-cyan-700", defaultOn: false },
  { key: "waterfalls", label: "Waterfalls", emoji: "💧", pill: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700", defaultOn: false },
  { key: "ghats", label: "Ghats", emoji: "⛰️", pill: "bg-stone-100 text-stone-700 border-stone-200 dark:bg-stone-900/40 dark:text-stone-300 dark:border-stone-700", defaultOn: false },
  { key: "nuclear", label: "Nuclear plants", emoji: "☢️", pill: "bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-700", defaultOn: false },
  { key: "hydro", label: "Hydro plants", emoji: "🌀", pill: "bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/40 dark:text-teal-300 dark:border-teal-700", defaultOn: false },
  { key: "thermal", label: "Thermal plants", emoji: "🏭", pill: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700", defaultOn: false },
  { key: "minerals", label: "Minerals", emoji: "⛏️", pill: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700", defaultOn: false },
  { key: "unesco", label: "UNESCO sites", emoji: "🏛️", pill: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-900/40 dark:text-fuchsia-300 dark:border-fuchsia-700", defaultOn: false },
  { key: "forts", label: "Historic forts", emoji: "🚩", pill: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700", defaultOn: false },
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

function riverLabelHtml(name: string, isMain: boolean): string {
  if (isMain) {
    return `
      <div style="
        transform: translate(-50%, -50%);
        display: inline-block;
        padding: 3px 11px;
        background: rgba(12,74,110,.95);
        color: #fff;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: .05em;
        text-transform: uppercase;
        box-shadow: 0 2px 10px rgba(0,0,0,.35);
        font-family: system-ui, sans-serif;
        white-space: nowrap;
        pointer-events: none;
      ">${escapeHtml(name)}</div>
    `;
  }
  return `
    <div style="
      transform: translate(-50%, -50%);
      display: inline-block;
      padding: 1px 7px;
      background: rgba(224,242,254,.95);
      color: #0c4a6e;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 600;
      box-shadow: 0 1px 5px rgba(0,0,0,.18);
      font-family: system-ui, sans-serif;
      white-space: nowrap;
      pointer-events: none;
    ">${escapeHtml(name)}</div>
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

/**
 * Pick the midpoint of a polyline path. For short paths (2 pts) it's the
 * average; for longer paths it's the segment midpoint by index, which is
 * close enough for label placement at our zoom levels.
 */
function pathMidpoint(path: LatLng[]): [number, number] {
  if (path.length === 0) return [0, 0];
  if (path.length === 1) return ll(path[0]);
  if (path.length === 2) {
    const a = path[0];
    const b = path[1];
    return [(a[1] + b[1]) / 2, (a[0] + b[0]) / 2];
  }
  const idx = Math.floor(path.length / 2);
  return ll(path[idx]);
}

export default function MaharashtraMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const lRef = useRef<LeafletModule | null>(null);
  const layerBucketsRef = useRef<Record<LayerKey, Array<LeafletLayer | LeafletMarker>>>({
    rivers: [], dams: [], waterfalls: [], ghats: [],
    nuclear: [], hydro: [], thermal: [],
    minerals: [], unesco: [], forts: [],
  });

  const [layers, setLayers] = useState<Record<LayerKey, boolean>>(
    () => Object.fromEntries(LAYER_SPECS.map((s) => [s.key, s.defaultOn])) as Record<LayerKey, boolean>,
  );
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
          zoomControl: false,
          worldCopyJump: false,
          attributionControl: true,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        new (L as any).Control.Zoom({ position: "bottomright" }).addTo(map);
        map.setMaxBounds(
          L.latLngBounds(
            [MAHARASHTRA_BOUNDS[0][1] - 1, MAHARASHTRA_BOUNDS[0][0] - 1],
            [MAHARASHTRA_BOUNDS[1][1] + 1, MAHARASHTRA_BOUNDS[1][0] + 1],
          ),
        );
        L.control.scale({ imperial: false, position: "bottomleft" }).addTo(map);

        // Single basemap: OpenStreetMap. detectRetina serves @2x tiles on
        // HDPI screens for crisp rendering.
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
          maxZoom: 19,
          detectRetina: true,
          subdomains: ["a", "b", "c"],
          crossOrigin: true,
        }).addTo(map);

        mapRef.current = map;
        setLoading(false);
        applyAllLayers(L, map, layerBucketsRef.current, layers);

        // Defensive resize after CSS settles.
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
    applyAllLayers(L, map, layerBucketsRef.current, layers);
  }, [layers]);

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

      {/* Layer toggle panel — z-index above Leaflet's controls (which use 1000) */}
      {!loading && !error && (
        <div
          className="absolute left-3 top-3 max-w-[260px] rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-800/95"
          style={{ zIndex: 1100 }}
          onMouseDown={stopMapPropagation}
          onClick={stopMapPropagation}
          onWheel={stopMapPropagation}
          onDoubleClick={stopMapPropagation}
        >
          <div className="flex items-center justify-between mb-2 gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Layers ({visibleCount}/{LAYER_SPECS.length})
            </h3>
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  setLayers(
                    Object.fromEntries(LAYER_SPECS.map((s) => [s.key, true])) as Record<LayerKey, boolean>,
                  )
                }
                className="rounded-md border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 dark:hover:bg-emerald-900/60"
              >
                All
              </button>
              <button
                onClick={() =>
                  setLayers(
                    Object.fromEntries(LAYER_SPECS.map((s) => [s.key, s.key === "rivers"])) as Record<LayerKey, boolean>,
                  )
                }
                className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Reset
              </button>
            </div>
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
            Tap a layer to add it to the map. Scroll to zoom, drag to pan.
          </p>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Layer-render helpers                                                */
/* ──────────────────────────────────────────────────────────────────── */

function applyAllLayers(
  L: LeafletModule,
  map: LeafletMap,
  buckets: Record<LayerKey, Array<LeafletLayer | LeafletMarker>>,
  layers: Record<LayerKey, boolean>,
) {
  for (const arr of Object.values(buckets)) {
    for (const m of arr) m.remove();
    arr.length = 0;
  }

  if (layers.dams) addPois(L, map, buckets.dams, DAMS, "#0891b2", "🌊", "Dam");
  if (layers.waterfalls) addPois(L, map, buckets.waterfalls, WATERFALLS, "#2563eb", "💧", "Waterfall");
  if (layers.ghats) addPois(L, map, buckets.ghats, GHATS, "#78716c", "⛰️", "Ghat");
  if (layers.nuclear) addPois(L, map, buckets.nuclear, NUCLEAR_PLANTS, "#eab308", "☢️", "Nuclear");
  if (layers.hydro) addPois(L, map, buckets.hydro, HYDRO_PLANTS, "#0d9488", "🌀", "Hydro");
  if (layers.thermal) addPois(L, map, buckets.thermal, THERMAL_PLANTS, "#dc2626", "🏭", "Thermal");
  if (layers.unesco) addPois(L, map, buckets.unesco, UNESCO_SITES, "#c026d3", "🏛️", "UNESCO");
  if (layers.forts) addPois(L, map, buckets.forts, FORTS, "#FF6A00", "🚩", "Fort");

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
    // Draw tributaries first so the bolder main rivers render on top.
    const tributaries = RIVERS.filter((r) => r.parent);
    const mains = RIVERS.filter((r) => !r.parent);
    for (const r of tributaries) addRiver(L, map, buckets.rivers, r, false);
    for (const r of mains) addRiver(L, map, buckets.rivers, r, true);
  }
}

function addRiver(
  L: LeafletModule,
  map: LeafletMap,
  bucket: Array<LeafletLayer | LeafletMarker>,
  river: RiverFeature,
  isMain: boolean,
) {
  const line = L.polyline(river.path.map(ll), {
    color: isMain ? "#0c4a6e" : "#38bdf8",
    weight: isMain ? 5 : 3,
    opacity: isMain ? 0.95 : 0.8,
    lineCap: "round",
    lineJoin: "round",
  });
  line.addTo(map);
  bucket.push(line);

  // Name label at the midpoint.
  const labelIcon = L.divIcon({
    className: "mh-river-label",
    html: riverLabelHtml(river.name, isMain),
    iconSize: [0, 0] as unknown as number[],
    iconAnchor: [0, 0] as unknown as number[],
  });
  const label = L.marker(pathMidpoint(river.path), {
    icon: labelIcon,
    interactive: false,
    keyboard: false,
  });
  label.addTo(map);
  bucket.push(label);
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

function stopMapPropagation(e: React.SyntheticEvent) {
  e.stopPropagation();
}

export type { RiverFeature };
