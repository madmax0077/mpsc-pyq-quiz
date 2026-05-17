"use client";

/**
 * MaharashtraRiversMap2D
 * ──────────────────────
 * A clean, pure-SVG district-wise 2D map of Maharashtra.
 *
 * Replaces the earlier Leaflet+OpenStreetMap version with a simpler,
 * less cluttered presentation:
 *  - Light grey district polygons (real 2011 boundaries, simplified)
 *  - District name labels at every centroid
 *  - Every river drawn in its basin colour, with the river name printed
 *    PERMANENTLY on the path
 *  - Pan/drag + wheel-zoom done via SVG viewBox (no map library at all)
 *
 * Districts geometry: /public/maharashtra-districts-simple.json
 *  (generated from the open-source udit-001/india-maps-data TopoJSON;
 *   ~278 KB raw / ~80 KB gzipped — small enough for a static site).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

/* ──────────────────────────────────────────────────────────────────── */
/*  Districts JSON shape                                                */
/* ──────────────────────────────────────────────────────────────────── */

type LonLat = [number, number];

interface DistrictsFile {
  bounds: { minLng: number; maxLng: number; minLat: number; maxLat: number };
  districts: Array<{
    name: string;
    centroid: LonLat;
    polygons: LonLat[][]; // outer rings only
  }>;
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Geometry helpers                                                    */
/* ──────────────────────────────────────────────────────────────────── */

/**
 * Map width/height in “projection units”. Aspect-corrected equirectangular —
 * very close to a Mercator at Maharashtra latitudes, but cheaper to compute.
 *
 * x = (lng - minLng) * cos(midLat)
 * y = (maxLat - lat)
 */
function makeProjection(b: DistrictsFile["bounds"]) {
  const midLat = ((b.minLat + b.maxLat) / 2) * (Math.PI / 180);
  const cosMid = Math.cos(midLat);
  const width = (b.maxLng - b.minLng) * cosMid;
  const height = b.maxLat - b.minLat;
  return {
    width,
    height,
    project: (lng: number, lat: number): [number, number] => [
      (lng - b.minLng) * cosMid,
      b.maxLat - lat,
    ],
  };
}

function ringToPath(
  ring: LonLat[],
  project: (lng: number, lat: number) => [number, number],
): string {
  if (ring.length === 0) return "";
  let d = "";
  for (let i = 0; i < ring.length; i++) {
    const [x, y] = project(ring[i][0], ring[i][1]);
    d += (i === 0 ? "M" : "L") + x.toFixed(4) + " " + y.toFixed(4) + " ";
  }
  return d + "Z";
}

function pathOfRiver(
  river: EnrichedRiver,
  project: (lng: number, lat: number) => [number, number],
): string {
  let d = "";
  for (let i = 0; i < river.path.length; i++) {
    const [x, y] = project(river.path[i][0], river.path[i][1]);
    d += (i === 0 ? "M" : "L") + x.toFixed(4) + " " + y.toFixed(4) + " ";
  }
  return d.trimEnd();
}

function riverMidpoint(
  river: EnrichedRiver,
  project: (lng: number, lat: number) => [number, number],
): [number, number] {
  const p = river.path;
  if (p.length === 0) return [0, 0];
  if (p.length === 1) return project(p[0][0], p[0][1]);
  if (p.length === 2) {
    const a = project(p[0][0], p[0][1]);
    const b = project(p[1][0], p[1][1]);
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  }
  const idx = Math.floor(p.length / 2);
  return project(p[idx][0], p[idx][1]);
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Component                                                           */
/* ──────────────────────────────────────────────────────────────────── */

const VIEW_W = 1000;
const PAD = 18;

export default function MaharashtraRiversMap2D() {
  const [data, setData] = useState<DistrictsFile | null>(null);
  const [error, setError] = useState<string | null>(null);

  /* Load the districts JSON once. */
  useEffect(() => {
    let cancelled = false;
    fetch("/maharashtra-districts-simple.json")
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load districts: ${r.status}`);
        return r.json();
      })
      .then((d: DistrictsFile) => { if (!cancelled) setData(d); })
      .catch((e: Error) => { if (!cancelled) setError(e.message || String(e)); });
    return () => { cancelled = true; };
  }, []);

  const enriched = useMemo(() => getEnrichedRivers(), []);
  const grouped = useMemo(() => groupRiversByBasin(), []);

  /* Projection + initial viewBox derived from the districts bounds. */
  const projection = useMemo(() => {
    if (!data) return null;
    return makeProjection(data.bounds);
  }, [data]);

  const baseViewBox = useMemo(() => {
    if (!projection) return null;
    // Scale projection units so the map width = VIEW_W minus padding.
    const scale = (VIEW_W - PAD * 2) / projection.width;
    const w = projection.width * scale;
    const h = projection.height * scale;
    return {
      scale,
      x: -PAD,
      y: -PAD,
      width: w + PAD * 2,
      height: h + PAD * 2,
    };
  }, [projection]);

  const projectScaled = useCallback(
    (lng: number, lat: number): [number, number] => {
      if (!projection || !baseViewBox) return [0, 0];
      const [u, v] = projection.project(lng, lat);
      return [u * baseViewBox.scale, v * baseViewBox.scale];
    },
    [projection, baseViewBox],
  );

  /* — Pan / zoom state — */
  const [vb, setVb] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  useEffect(() => {
    if (baseViewBox) setVb({ x: baseViewBox.x, y: baseViewBox.y, width: baseViewBox.width, height: baseViewBox.height });
  }, [baseViewBox]);

  const svgRef = useRef<SVGSVGElement | null>(null);
  const draggingRef = useRef<{ startX: number; startY: number; vbX: number; vbY: number } | null>(null);

  const onPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (!vb) return;
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    draggingRef.current = { startX: e.clientX, startY: e.clientY, vbX: vb.x, vbY: vb.y };
  }, [vb]);

  const onPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const d = draggingRef.current;
    if (!d || !svgRef.current || !vb) return;
    const rect = svgRef.current.getBoundingClientRect();
    const dx = ((e.clientX - d.startX) / rect.width) * vb.width;
    const dy = ((e.clientY - d.startY) / rect.height) * vb.height;
    setVb({ x: d.vbX - dx, y: d.vbY - dy, width: vb.width, height: vb.height });
  }, [vb]);

  const onPointerUp = useCallback(() => {
    draggingRef.current = null;
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (!vb || !svgRef.current || !baseViewBox) return;
    e.preventDefault();
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const px = vb.x + (mouseX / rect.width) * vb.width;
    const py = vb.y + (mouseY / rect.height) * vb.height;
    const factor = e.deltaY < 0 ? 0.85 : 1.18;
    let newW = vb.width * factor;
    let newH = vb.height * factor;
    // Clamp zoom: min 0.15× of initial (max zoom-in), max 1.8× (zoom-out).
    const minW = baseViewBox.width * 0.15;
    const maxW = baseViewBox.width * 1.8;
    if (newW < minW) { const r = minW / newW; newW *= r; newH *= r; }
    if (newW > maxW) { const r = maxW / newW; newW *= r; newH *= r; }
    const newX = px - ((mouseX / rect.width) * newW);
    const newY = py - ((mouseY / rect.height) * newH);
    setVb({ x: newX, y: newY, width: newW, height: newH });
  }, [vb, baseViewBox]);

  // Wheel listener has to be non-passive to call preventDefault.
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  /* — UI state — */
  const [enabledBasins, setEnabledBasins] = useState<Record<Basin, boolean>>({
    Godavari: true, Krishna: true, Tapi: true, Konkan: true,
  });
  const [showTributaries, setShowTributaries] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showDistricts, setShowDistricts] = useState(true);
  const [showDistrictLabels, setShowDistrictLabels] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const selectedRiver = useMemo(
    () => (selectedId ? enriched.find((r) => r.id === selectedId) ?? null : null),
    [selectedId, enriched],
  );

  const handleResetView = useCallback(() => {
    if (baseViewBox) setVb({ x: baseViewBox.x, y: baseViewBox.y, width: baseViewBox.width, height: baseViewBox.height });
    setSelectedId(null);
  }, [baseViewBox]);

  const handleZoom = useCallback((dir: "in" | "out") => {
    if (!vb || !baseViewBox) return;
    const factor = dir === "in" ? 0.7 : 1.4;
    const newW = Math.min(baseViewBox.width * 1.8, Math.max(baseViewBox.width * 0.15, vb.width * factor));
    const newH = newW * (vb.height / vb.width);
    setVb({
      x: vb.x + (vb.width - newW) / 2,
      y: vb.y + (vb.height - newH) / 2,
      width: newW,
      height: newH,
    });
  }, [vb, baseViewBox]);

  /* — Focus on a river when selected — */
  useEffect(() => {
    if (!selectedRiver || !baseViewBox) return;
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const [lng, lat] of selectedRiver.path) {
      const [x, y] = projectScaled(lng, lat);
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
    if (!isFinite(minX)) return;
    const pad = 80;
    const w = Math.max(180, (maxX - minX) + pad * 2);
    const h = Math.max(180, (maxY - minY) + pad * 2);
    // Keep current aspect ratio
    const aspect = baseViewBox.width / baseViewBox.height;
    let newW = Math.max(w, h * aspect);
    let newH = newW / aspect;
    // Clamp
    const minW = baseViewBox.width * 0.15;
    if (newW < minW) { const r = minW / newW; newW *= r; newH *= r; }
    setVb({
      x: (minX + maxX) / 2 - newW / 2,
      y: (minY + maxY) / 2 - newH / 2,
      width: newW,
      height: newH,
    });
  }, [selectedRiver, projectScaled, baseViewBox]);

  /* — District + river render data — */
  const districtPaths = useMemo(() => {
    if (!data || !projection || !baseViewBox) return [];
    return data.districts.map((d) => ({
      name: d.name,
      centroid: ((): [number, number] => {
        const [u, v] = projection.project(d.centroid[0], d.centroid[1]);
        return [u * baseViewBox.scale, v * baseViewBox.scale];
      })(),
      d: d.polygons
        .map((ring) => ringToPath(ring, (lng, lat) => {
          const [u, v] = projection.project(lng, lat);
          return [u * baseViewBox.scale, v * baseViewBox.scale];
        }))
        .join(" "),
    }));
  }, [data, projection, baseViewBox]);

  const riverShapes = useMemo(() => {
    if (!projection || !baseViewBox) return [];
    return enriched.map((r) => ({
      r,
      d: pathOfRiver(r, (lng, lat) => {
        const [u, v] = projection.project(lng, lat);
        return [u * baseViewBox.scale, v * baseViewBox.scale];
      }),
      label: riverMidpoint(r, (lng, lat) => {
        const [u, v] = projection.project(lng, lat);
        return [u * baseViewBox.scale, v * baseViewBox.scale];
      }),
    }));
  }, [enriched, projection, baseViewBox]);

  /* — Visibility filter — */
  const visibleRiverShapes = useMemo(() =>
    riverShapes.filter((s) =>
      enabledBasins[s.r.basin] && (s.r.isMain || showTributaries)
    ),
  [riverShapes, enabledBasins, showTributaries]);

  /* Order: tributaries first then mains so mains draw on top.
   * Also bring the selected river to the absolute front. */
  const orderedRiverShapes = useMemo(() => {
    const sorted = [...visibleRiverShapes].sort((a, b) => {
      if (a.r.isMain !== b.r.isMain) return a.r.isMain ? 1 : -1;
      return 0;
    });
    if (selectedId) {
      const idx = sorted.findIndex((s) => s.r.id === selectedId);
      if (idx >= 0) {
        const [sel] = sorted.splice(idx, 1);
        sorted.push(sel);
      }
    }
    return sorted;
  }, [visibleRiverShapes, selectedId]);

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
  const visibleRivers = visibleRiverShapes.length;

  /* — Render — */
  if (error) {
    return (
      <div className="flex h-[60vh] items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
        <div className="max-w-md text-center">
          <p className="font-semibold text-red-700 dark:text-red-300">Could not load the map data</p>
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!data || !vb || !baseViewBox) {
    return (
      <div className="flex h-[60vh] items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-teal-500 dark:border-slate-700 dark:border-t-teal-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading the rivers map…</p>
        </div>
      </div>
    );
  }

  // Label / stroke sizes scale with zoom so things stay legible.
  const zoom = baseViewBox.width / vb.width;
  const baseStroke = baseViewBox.width / 600; // ≈ 1.7 svg-units at base
  const fontMain = Math.max(8, 11 / zoom);
  const fontTrib = Math.max(7, 9 / zoom);
  const fontDistrict = Math.max(7, 10 / zoom);
  const districtStroke = baseStroke * 0.6;
  const riverStrokeMain = baseStroke * 2.4;
  const riverStrokeTrib = baseStroke * 1.4;

  return (
    <div className="relative flex h-full w-full flex-col gap-3 lg:flex-row">
      {/* Map panel */}
      <div className="relative h-[65vh] flex-1 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50/60 via-white to-emerald-50/40 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 lg:h-auto">
        <svg
          ref={svgRef}
          viewBox={`${vb.x} ${vb.y} ${vb.width} ${vb.height}`}
          className="absolute inset-0 h-full w-full touch-none select-none"
          style={{ cursor: draggingRef.current ? "grabbing" : "grab" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClick={(e) => {
            // If the user clicked empty space, deselect.
            if (e.target === e.currentTarget) setSelectedId(null);
          }}
        >
          {/* Outer water rectangle — sets the “ocean” colour outside districts */}
          <rect
            x={vb.x - 10000}
            y={vb.y - 10000}
            width={vb.width + 20000}
            height={vb.height + 20000}
            fill="transparent"
          />

          {/* Districts */}
          {showDistricts && (
            <g>
              {districtPaths.map((d) => (
                <path
                  key={d.name}
                  d={d.d}
                  fill="#f1f5f9"
                  stroke="#94a3b8"
                  strokeWidth={districtStroke}
                  strokeLinejoin="round"
                  className="dark:[fill:#1e293b] dark:[stroke:#475569]"
                />
              ))}
            </g>
          )}

          {/* District labels */}
          {showDistricts && showDistrictLabels && (
            <g pointerEvents="none">
              {districtPaths.map((d) => (
                <text
                  key={d.name}
                  x={d.centroid[0]}
                  y={d.centroid[1]}
                  fontSize={fontDistrict}
                  fontWeight={500}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fill="#64748b"
                  className="dark:[fill:#cbd5e1]"
                  style={{ paintOrder: "stroke", stroke: "rgba(255,255,255,0.85)", strokeWidth: fontDistrict * 0.25 }}
                >
                  {d.name}
                </text>
              ))}
            </g>
          )}

          {/* River polylines */}
          <g>
            {orderedRiverShapes.map((s) => {
              const active = s.r.id === selectedId;
              const color = BASIN_COLOR[s.r.basin];
              const w = active
                ? riverStrokeMain * 1.7
                : s.r.isMain
                  ? riverStrokeMain
                  : riverStrokeTrib;
              return (
                <path
                  key={s.r.id}
                  d={s.d}
                  fill="none"
                  stroke={color}
                  strokeWidth={w}
                  strokeOpacity={active ? 1 : s.r.isMain ? 0.95 : 0.82}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => { e.stopPropagation(); setSelectedId(s.r.id); }}
                />
              );
            })}
          </g>

          {/* River name labels */}
          {showLabels && (
            <g pointerEvents="none">
              {orderedRiverShapes.map((s) => {
                const color = BASIN_COLOR[s.r.basin];
                const active = s.r.id === selectedId;
                const fs = s.r.isMain ? fontMain : fontTrib;
                const padX = fs * 0.45;
                const padY = fs * 0.25;
                const text = s.r.name;
                const approxW = text.length * fs * 0.58 + padX * 2;
                const approxH = fs + padY * 2;
                return (
                  <g key={s.r.id} transform={`translate(${s.label[0]} ${s.label[1]})`}>
                    <rect
                      x={-approxW / 2}
                      y={-approxH / 2}
                      width={approxW}
                      height={approxH}
                      rx={approxH / 2}
                      ry={approxH / 2}
                      fill={s.r.isMain ? color : "white"}
                      fillOpacity={s.r.isMain ? 0.95 : 0.95}
                      stroke={s.r.isMain ? "white" : color}
                      strokeWidth={Math.max(0.5, fs * 0.07)}
                    />
                    <text
                      x={0}
                      y={0}
                      fontSize={fs}
                      fontWeight={s.r.isMain ? 700 : 600}
                      letterSpacing={s.r.isMain ? 0.2 : 0}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      fill={s.r.isMain ? "white" : color}
                      style={{ textTransform: s.r.isMain ? "uppercase" : "none" }}
                    >
                      {text}
                    </text>
                    {active && (
                      <circle
                        cx={0}
                        cy={0}
                        r={approxW / 1.8}
                        fill="none"
                        stroke={color}
                        strokeWidth={0.5}
                        strokeDasharray="3 2"
                        opacity={0.6}
                      />
                    )}
                  </g>
                );
              })}
            </g>
          )}
        </svg>

        {/* Control panel — top-left */}
        <div
          className="absolute left-3 top-3 max-w-[260px] rounded-2xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur dark:border-slate-700 dark:bg-slate-800/95"
          style={{ zIndex: 10 }}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
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
                    <span aria-hidden style={{ display: "inline-block", width: 12, height: 4, borderRadius: 2, background: on ? color : "#cbd5e1" }} />
                    <span>{BASIN_LABEL[b]}</span>
                  </span>
                  <span className={`inline-block h-3 w-3 rounded-full ${on ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`} />
                </button>
              );
            })}
          </div>
          <div className="mt-2 grid grid-cols-1 gap-1 border-t border-slate-200 pt-2 dark:border-slate-700">
            <label className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              <span>Show tributaries</span>
              <input type="checkbox" checked={showTributaries} onChange={(e) => setShowTributaries(e.target.checked)} className="h-3.5 w-3.5 accent-teal-600" />
            </label>
            <label className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              <span>Show river names</span>
              <input type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} className="h-3.5 w-3.5 accent-teal-600" />
            </label>
            <label className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              <span>Show districts</span>
              <input type="checkbox" checked={showDistricts} onChange={(e) => setShowDistricts(e.target.checked)} className="h-3.5 w-3.5 accent-teal-600" />
            </label>
            <label className="flex cursor-pointer items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              <span>District names</span>
              <input type="checkbox" checked={showDistrictLabels} onChange={(e) => setShowDistrictLabels(e.target.checked)} className="h-3.5 w-3.5 accent-teal-600" />
            </label>
          </div>
          <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500">
            Drag to pan · scroll to zoom · tap a river for details.
          </p>
        </div>

        {/* Zoom buttons — bottom right */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1" style={{ zIndex: 10 }}>
          <button onClick={() => handleZoom("in")} className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-lg font-bold text-slate-700 shadow hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">+</button>
          <button onClick={() => handleZoom("out")} className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-lg font-bold text-slate-700 shadow hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">−</button>
        </div>

        {/* Mobile sidebar toggle */}
        <div className="absolute bottom-3 left-3 lg:hidden" style={{ zIndex: 10 }}>
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
            <span className="rounded-full bg-teal-100 px-2 py-0.5 text-[10px] font-semibold text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
              {BASINS.length} basins
            </span>
          </div>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search river or district…"
            className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-teal-400 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

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
              {selectedRiver.meta?.origin && <div><span className="font-semibold text-slate-900 dark:text-slate-100">Origin:</span> {selectedRiver.meta.origin}</div>}
              {selectedRiver.meta?.mouth && <div><span className="font-semibold text-slate-900 dark:text-slate-100">Mouth:</span> {selectedRiver.meta.mouth}</div>}
              {selectedRiver.meta?.lengthKm !== undefined && <div><span className="font-semibold text-slate-900 dark:text-slate-100">Length:</span> {selectedRiver.meta.lengthKm} km</div>}
              {selectedRiver.meta?.districts && selectedRiver.meta.districts.length > 0 && (
                <div><span className="font-semibold text-slate-900 dark:text-slate-100">Districts:</span> {selectedRiver.meta.districts.join(", ")}</div>
              )}
              {selectedRiver.parent && (
                <div>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">Joins:</span>{" "}
                  <button onClick={() => setSelectedId(selectedRiver.parent ?? null)} className="text-teal-700 underline-offset-2 hover:underline dark:text-teal-300">
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
                  <span className="rounded-full bg-white px-1.5 py-0.5 text-[9px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{list.length}</span>
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
                              ? "bg-teal-50 font-semibold text-slate-900 dark:bg-teal-900/30 dark:text-slate-100"
                              : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/60"
                          }`}
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <span aria-hidden style={{ display: "inline-block", width: r.isMain ? 14 : 10, height: r.isMain ? 4 : 3, borderRadius: 2, background: color, flex: "0 0 auto" }} />
                            <span className="truncate">
                              {r.name}
                              {!r.isMain && <span className="ml-1 text-[10px] text-slate-400 dark:text-slate-500">→ {enriched.find((x) => x.id === r.parent)?.name ?? r.parent}</span>}
                            </span>
                          </span>
                          {r.meta?.lengthKm !== undefined && (
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">{r.meta.lengthKm} km</span>
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
            <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">No rivers match “{searchQuery}”.</div>
          )}
        </div>
      </aside>
    </div>
  );
}
