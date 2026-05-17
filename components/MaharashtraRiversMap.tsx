"use client";

/**
 * MaharashtraRiversMap
 * ────────────────────
 * Focused, rivers-only Leaflet map of Maharashtra.
 *
 * Every river polyline is drawn with the colour of its drainage basin
 * (Godavari / Krishna / Tapi / Konkan) and labelled with a permanent
 * name tag at the midpoint, so the user sees *all* river names at once
 * — that's the explicit ask: "map will be district-wise 2D, it should
 *  show river name".
 *
 * District context comes from the OpenStreetMap basemap (which renders
 * administrative boundaries at the zoom levels we use); a per-district
 * label layer would just clutter the river view, so we let OSM handle it.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MAHARASHTRA_BOUNDS,
  MAHARASHTRA_CENTER,
  type LatLng,
} from "@/lib/mapData/maharashtra";
import {
  BASIN_COLOR,
  BASIN_ICON,
  BASIN_LABEL,
  BASINS,
  getEnrichedRivers,
  groupRiversByBasin,
  type Basin,
  type EnrichedRiver,
} from "@/lib/mapData/riversMeta";
import {
  loadLeaflet,
  type LeafletMap,
  type LeafletMarker,
  type LeafletModule,
  type LeafletPolyline,
} from "@/lib/leafletLoader";

/* ──────────────────────────────────────────────────────────────────── */
/*  Helpers                                                             */
/* ──────────────────────────────────────────────────────────────────── */

// GeoJSON order is [lng, lat] but Leaflet uses [lat, lng].
const ll = (c: LatLng): [number, number] => [c[1], c[0]];

function pathMidpoint(path: LatLng[]): [number, number] {
  if (path.length === 0) return [0, 0];
  if (path.length === 1) return ll(path[0]);
  if (path.length === 2) {
    const a = path[0]; const b = path[1];
    return [(a[1] + b[1]) / 2, (a[0] + b[0]) / 2];
  }
  return ll(path[Math.floor(path.length / 2)]);
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function riverLabelHtml(name: string, color: string, isMain: boolean): string {
  if (isMain) {
    return `
      <div style="
        transform: translate(-50%, -50%);
        display: inline-block;
        padding: 3px 11px;
        background: ${color};
        color: #fff;
        border-radius: 9999px;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: .05em;
        text-transform: uppercase;
        box-shadow: 0 2px 10px rgba(0,0,0,.30);
        font-family: system-ui, sans-serif;
        white-space: nowrap;
        pointer-events: none;
        border: 1.5px solid #fff;
      ">${escapeHtml(name)}</div>
    `;
  }
  return `
    <div style="
      transform: translate(-50%, -50%);
      display: inline-block;
      padding: 1px 7px;
      background: rgba(255,255,255,.95);
      color: ${color};
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 600;
      box-shadow: 0 1px 5px rgba(0,0,0,.18);
      font-family: system-ui, sans-serif;
      white-space: nowrap;
      pointer-events: none;
      border: 1px solid ${color};
    ">${escapeHtml(name)}</div>
  `;
}

function popupHtml(r: EnrichedRiver): string {
  const meta = r.meta;
  const rows: string[] = [];
  if (meta?.origin) rows.push(`<div><b>Origin:</b> ${escapeHtml(meta.origin)}</div>`);
  if (meta?.mouth) rows.push(`<div><b>Mouth:</b> ${escapeHtml(meta.mouth)}</div>`);
  if (meta?.lengthKm) rows.push(`<div><b>Length:</b> ${meta.lengthKm} km</div>`);
  if (meta?.districts?.length) rows.push(`<div><b>Districts:</b> ${escapeHtml(meta.districts.join(", "))}</div>`);
  const noteHtml = meta?.note
    ? `<div style="margin-top:6px;padding-top:6px;border-top:1px solid #e2e8f0;color:#334155;font-size:11px;line-height:1.4;">${escapeHtml(meta.note)}</div>`
    : "";
  const basinPill = `
    <div style="display:inline-block;margin-top:6px;padding:2px 8px;border-radius:9999px;background:${BASIN_COLOR[r.basin]};color:#fff;font-size:10px;font-weight:700;letter-spacing:.04em;">
      ${escapeHtml(BASIN_LABEL[r.basin])}
    </div>
  `;
  return `
    <div style="font-family:system-ui,sans-serif;padding:2px 4px;min-width:220px;max-width:280px;">
      <div style="font-weight:800;font-size:14px;color:#0f172a;">${escapeHtml(r.name)}${r.parent ? ' <span style="color:#94a3b8;font-weight:500;font-size:11px;">(tributary)</span>' : ""}</div>
      ${basinPill}
      <div style="margin-top:6px;font-size:11px;line-height:1.45;color:#334155;display:flex;flex-direction:column;gap:2px;">${rows.join("")}</div>
      ${noteHtml}
    </div>
  `;
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Component                                                           */
/* ──────────────────────────────────────────────────────────────────── */

export default function MaharashtraRiversMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const lRef = useRef<LeafletModule | null>(null);

  /** id → { polyline, label } so we can highlight / restyle on demand. */
  const layerById = useRef<Map<string, { line: LeafletPolyline; label: LeafletMarker }>>(new Map());

  const enriched = useMemo(() => getEnrichedRivers(), []);
  const grouped = useMemo(() => groupRiversByBasin(), []);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [enabledBasins, setEnabledBasins] = useState<Record<Basin, boolean>>({
    Godavari: true, Krishna: true, Tapi: true, Konkan: true,
  });
  const [showTributaries, setShowTributaries] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const selectedRiver = useMemo(
    () => (selectedId ? enriched.find((r) => r.id === selectedId) ?? null : null),
    [selectedId, enriched],
  );

  /* — Build / rebuild all river layers when component first mounts — */
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
          maxZoom: 16,
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

        // OSM basemap — districts and labels come for free from the tiles.
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
          maxZoom: 19,
          detectRetina: true,
          subdomains: ["a", "b", "c"],
          crossOrigin: true,
        }).addTo(map);

        mapRef.current = map;

        // Draw all rivers — tributaries first so mains paint on top.
        const tribs = enriched.filter((r) => !r.isMain);
        const mains = enriched.filter((r) => r.isMain);
        for (const r of [...tribs, ...mains]) {
          const color = BASIN_COLOR[r.basin];
          const line = L.polyline(r.path.map(ll), {
            color,
            weight: r.isMain ? 5 : 3,
            opacity: r.isMain ? 0.95 : 0.8,
            lineCap: "round",
            lineJoin: "round",
          }) as LeafletPolyline;
          line.bindPopup?.(popupHtml(r));
          line.on("click", () => setSelectedId(r.id));
          // Hover highlight
          line.on("mouseover", () => {
            line.setStyle({ weight: r.isMain ? 8 : 6, opacity: 1 });
            line.bringToFront?.();
          });
          line.on("mouseout", () => {
            line.setStyle({ weight: r.isMain ? 5 : 3, opacity: r.isMain ? 0.95 : 0.8 });
          });
          line.addTo(map);

          const labelIcon = L.divIcon({
            className: "mh-river-label",
            html: riverLabelHtml(r.name, color, r.isMain),
            iconSize: [0, 0] as unknown as number[],
            iconAnchor: [0, 0] as unknown as number[],
          });
          const label = L.marker(pathMidpoint(r.path), {
            icon: labelIcon,
            interactive: false,
            keyboard: false,
            // Keep main-river labels above tributary labels.
            zIndexOffset: r.isMain ? 1000 : 0,
          });
          label.addTo(map);

          layerById.current.set(r.id, { line, label });
        }

        setLoading(false);

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
      for (const { line, label } of layerById.current.values()) {
        line.remove();
        label.remove();
      }
      layerById.current.clear();
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* — React to layer-visibility / filter changes — */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    for (const r of enriched) {
      const layer = layerById.current.get(r.id);
      if (!layer) continue;
      const allowedByBasin = enabledBasins[r.basin];
      const allowedByTrib = r.isMain || showTributaries;
      const visible = allowedByBasin && allowedByTrib;
      const labelVisible = visible && showLabels;
      try {
        if (visible) layer.line.addTo(map); else layer.line.remove();
        if (labelVisible) layer.label.addTo(map); else layer.label.remove();
      } catch { /* noop */ }
    }
  }, [enabledBasins, showTributaries, showLabels, enriched]);

  /* — When a river is selected, highlight it + fly there — */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    for (const r of enriched) {
      const layer = layerById.current.get(r.id);
      if (!layer) continue;
      const color = BASIN_COLOR[r.basin];
      if (selectedId && r.id === selectedId) {
        layer.line.setStyle({ color, weight: 9, opacity: 1 });
        layer.line.bringToFront?.();
      } else {
        layer.line.setStyle({
          color,
          weight: r.isMain ? 5 : 3,
          opacity: r.isMain ? 0.95 : 0.8,
        });
      }
    }
    if (selectedRiver) {
      try {
        const bounds = layerById.current.get(selectedRiver.id)?.line.getBounds();
        if (bounds) map.flyToBounds(bounds, { padding: [80, 80], maxZoom: 11, duration: 0.8 });
      } catch { /* noop */ }
    }
  }, [selectedId, selectedRiver, enriched]);

  const filteredGrouped = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return grouped;
    const out: Record<Basin, EnrichedRiver[]> = { Godavari: [], Krishna: [], Tapi: [], Konkan: [] };
    for (const b of BASINS) {
      out[b] = grouped[b].filter((r) =>
        r.name.toLowerCase().includes(q) ||
        (r.meta?.districts ?? []).some((d) => d.toLowerCase().includes(q)) ||
        (r.meta?.note ?? "").toLowerCase().includes(q),
      );
    }
    return out;
  }, [grouped, searchQuery]);

  const totalRivers = enriched.length;
  const visibleRivers = enriched.filter((r) => enabledBasins[r.basin] && (r.isMain || showTributaries)).length;

  const handleResetView = useCallback(() => {
    const map = mapRef.current;
    const L = lRef.current;
    if (!map || !L) return;
    setSelectedId(null);
    try {
      map.flyToBounds(
        L.latLngBounds(
          [MAHARASHTRA_BOUNDS[0][1], MAHARASHTRA_BOUNDS[0][0]],
          [MAHARASHTRA_BOUNDS[1][1], MAHARASHTRA_BOUNDS[1][0]],
        ),
        { padding: [40, 40], duration: 0.8 },
      );
    } catch { /* noop */ }
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col gap-3 lg:flex-row">
      {/* Map */}
      <div
        className="relative h-[60vh] flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-700 dark:bg-slate-800 lg:h-auto"
        style={{ minHeight: 480 }}
      >
        <div ref={containerRef} className="absolute inset-0" style={{ minHeight: 480 }} />

        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-100/90 dark:bg-slate-900/90">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500 dark:border-slate-700 dark:border-t-sky-400" />
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading the rivers map…</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-100 p-6 dark:bg-slate-900">
            <div className="max-w-md rounded-xl border border-red-200 bg-red-50 p-5 text-center dark:border-red-800 dark:bg-red-900/20">
              <p className="font-semibold text-red-700 dark:text-red-300">Map could not load</p>
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
              <p className="mt-3 text-xs text-red-500 dark:text-red-300">Likely a network issue. Refresh and try again.</p>
            </div>
          </div>
        )}

        {/* Filter / control panel — top-left */}
        {!loading && !error && (
          <div
            className="absolute left-3 top-3 max-w-[260px] rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-800/95"
            style={{ zIndex: 1100 }}
            onMouseDown={stopMapPropagation}
            onClick={stopMapPropagation}
            onWheel={stopMapPropagation}
            onDoubleClick={stopMapPropagation}
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Basins ({visibleRivers}/{totalRivers})
              </h3>
              <button
                onClick={handleResetView}
                className="rounded-md border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Reset
              </button>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {BASINS.map((b) => {
                const on = enabledBasins[b];
                const color = BASIN_COLOR[b];
                return (
                  <button
                    key={b}
                    onClick={() => setEnabledBasins((p) => ({ ...p, [b]: !p[b] }))}
                    className={`flex items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                      on
                        ? "border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
                        : "border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span aria-hidden style={{ display: "inline-block", width: 10, height: 10, borderRadius: 9999, background: on ? color : "#cbd5e1" }} />
                      <span>{BASIN_LABEL[b]}</span>
                    </span>
                    <span
                      className={`inline-block h-3 w-3 rounded-full ${on ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`}
                    />
                  </button>
                );
              })}
            </div>
            <div className="mt-2 grid grid-cols-1 gap-1 border-t border-slate-200 pt-2 dark:border-slate-700">
              <label className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                <span>Show tributaries</span>
                <input
                  type="checkbox"
                  checked={showTributaries}
                  onChange={(e) => setShowTributaries(e.target.checked)}
                  className="h-3.5 w-3.5 accent-sky-600"
                />
              </label>
              <label className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                <span>Show river names</span>
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                  className="h-3.5 w-3.5 accent-sky-600"
                />
              </label>
            </div>
            <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500">
              Tap a river on the map (or in the list) for full details.
            </p>
          </div>
        )}

        {/* Mobile sidebar toggle — bottom-left */}
        <div className="absolute bottom-3 left-3 lg:hidden" style={{ zIndex: 1100 }}>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {sidebarOpen ? "Hide river list ↓" : "Show river list ↑"}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 lg:w-[360px] ${
          sidebarOpen ? "max-h-[60vh] lg:max-h-none" : "hidden lg:flex"
        }`}
      >
        <div className="border-b border-slate-200 bg-slate-50/70 p-3 dark:border-slate-700 dark:bg-slate-900/40">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
              All rivers ({totalRivers})
            </h3>
            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[10px] font-semibold text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
              {BASINS.length} basins
            </span>
          </div>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search river or district…"
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-sky-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        {/* Selected-river detail card */}
        {selectedRiver && (
          <div
            className="border-b border-slate-200 p-3 dark:border-slate-700"
            style={{ background: `linear-gradient(135deg, ${BASIN_COLOR[selectedRiver.basin]}18, transparent)` }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: BASIN_COLOR[selectedRiver.basin] }}>
                  {BASIN_LABEL[selectedRiver.basin]}{selectedRiver.parent ? " · tributary" : ""}
                </div>
                <div className="truncate text-lg font-extrabold text-slate-900 dark:text-slate-50">
                  {selectedRiver.name}
                </div>
              </div>
              <button
                onClick={() => setSelectedId(null)}
                className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                Clear
              </button>
            </div>
            <div className="mt-2 grid grid-cols-1 gap-1 text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
              {selectedRiver.meta?.origin && (
                <div><span className="font-semibold text-slate-900 dark:text-slate-100">Origin:</span> {selectedRiver.meta.origin}</div>
              )}
              {selectedRiver.meta?.mouth && (
                <div><span className="font-semibold text-slate-900 dark:text-slate-100">Mouth:</span> {selectedRiver.meta.mouth}</div>
              )}
              {selectedRiver.meta?.lengthKm !== undefined && (
                <div><span className="font-semibold text-slate-900 dark:text-slate-100">Length:</span> {selectedRiver.meta.lengthKm} km</div>
              )}
              {selectedRiver.meta?.districts && selectedRiver.meta.districts.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Districts:</span>{" "}
                  {selectedRiver.meta.districts.join(", ")}
                </div>
              )}
              {selectedRiver.parent && (
                <div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Joins:</span>{" "}
                  <button
                    onClick={() => setSelectedId(selectedRiver.parent ?? null)}
                    className="text-sky-600 underline-offset-2 hover:underline dark:text-sky-400"
                  >
                    {enriched.find((r) => r.id === selectedRiver.parent)?.name ?? selectedRiver.parent}
                  </button>
                </div>
              )}
            </div>
            {selectedRiver.meta?.note && (
              <p className="mt-2 rounded-lg border border-slate-200 bg-white/80 p-2 text-[11px] leading-relaxed text-slate-700 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
                {selectedRiver.meta.note}
              </p>
            )}
          </div>
        )}

        {/* River list — grouped by basin */}
        <div className="flex-1 overflow-y-auto">
          {BASINS.map((b) => {
            const list = filteredGrouped[b];
            if (list.length === 0) return null;
            const color = BASIN_COLOR[b];
            return (
              <div key={b}>
                <div
                  className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-slate-200 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider dark:border-slate-700"
                  style={{ background: `${color}12`, color }}
                >
                  <span>{BASIN_ICON[b]} {BASIN_LABEL[b]}</span>
                  <span className="rounded-full bg-white px-1.5 py-0.5 text-[9px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {list.length}
                  </span>
                </div>
                <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                  {list.map((r) => {
                    const active = r.id === selectedId;
                    return (
                      <li key={r.id}>
                        <button
                          onClick={() => setSelectedId(r.id)}
                          className={`flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-xs transition-colors ${
                            active
                              ? "bg-sky-50 font-semibold text-slate-900 dark:bg-sky-900/30 dark:text-slate-100"
                              : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/60"
                          }`}
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <span
                              aria-hidden
                              style={{
                                display: "inline-block",
                                width: r.isMain ? 12 : 8,
                                height: r.isMain ? 4 : 3,
                                borderRadius: 2,
                                background: color,
                                flex: "0 0 auto",
                              }}
                            />
                            <span className="truncate">
                              {r.name}
                              {!r.isMain && (
                                <span className="ml-1 text-[10px] text-slate-400 dark:text-slate-500">
                                  → {enriched.find((x) => x.id === r.parent)?.name ?? r.parent}
                                </span>
                              )}
                            </span>
                          </span>
                          {r.meta?.lengthKm !== undefined && (
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                              {r.meta.lengthKm} km
                            </span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
          {BASINS.every((b) => filteredGrouped[b].length === 0) && (
            <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
              No rivers match “{searchQuery}”.
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function stopMapPropagation(e: React.SyntheticEvent) {
  e.stopPropagation();
}
