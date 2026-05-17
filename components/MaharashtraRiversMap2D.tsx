"use client";

/**
 * MaharashtraRiversMap2D
 * ──────────────────────
 * Pure-SVG district-wise 2D map of Maharashtra. Just the map — no
 * dashboards, no selection popups, no sidebar. Pan with drag, zoom
 * with wheel or +/- buttons.
 *
 *  - Light grey district polygons (real 2011 boundaries, simplified)
 *  - District name labels at every centroid
 *  - Every river drawn in its basin colour, with the river name printed
 *    permanently on the path. Detailed curved geometry comes from OSM
 *    (/public/maharashtra-rivers-paths.json) with a coarse hand-curated
 *    fallback for the few minor rivers OSM doesn't have.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BASIN_COLOR,
  getEnrichedRivers,
  type EnrichedRiver,
} from "@/lib/mapData/riversMeta";

/* ──────────────────────────────────────────────────────────────────── */
/*  Districts + detailed-rivers JSON shapes                             */
/* ──────────────────────────────────────────────────────────────────── */

type LonLat = [number, number];

interface DistrictsFile {
  bounds: { minLng: number; maxLng: number; minLat: number; maxLat: number };
  districts: Array<{
    name: string;
    centroid: LonLat;
    polygons: LonLat[][];
  }>;
}

type RiverPathsFile = Record<string, LonLat[][]>;

/* ──────────────────────────────────────────────────────────────────── */
/*  Geometry helpers                                                    */
/* ──────────────────────────────────────────────────────────────────── */

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

function pathOfSegments(
  segments: LonLat[][],
  project: (lng: number, lat: number) => [number, number],
): string {
  let d = "";
  for (const seg of segments) {
    if (seg.length === 0) continue;
    for (let i = 0; i < seg.length; i++) {
      const [x, y] = project(seg[i][0], seg[i][1]);
      d += (i === 0 ? "M" : "L") + x.toFixed(3) + " " + y.toFixed(3) + " ";
    }
  }
  return d.trimEnd();
}

/** Pick the visually-best label anchor: midpoint of the longest segment. */
function labelAnchor(
  segments: LonLat[][],
  project: (lng: number, lat: number) => [number, number],
): [number, number] {
  if (segments.length === 0) return [0, 0];
  let longest = segments[0];
  for (const s of segments) if (s.length > longest.length) longest = s;
  if (longest.length === 0) return [0, 0];
  if (longest.length === 1) return project(longest[0][0], longest[0][1]);
  if (longest.length === 2) {
    const a = project(longest[0][0], longest[0][1]);
    const b = project(longest[1][0], longest[1][1]);
    return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  }
  const idx = Math.floor(longest.length / 2);
  return project(longest[idx][0], longest[idx][1]);
}

/* ──────────────────────────────────────────────────────────────────── */
/*  Component                                                           */
/* ──────────────────────────────────────────────────────────────────── */

const VIEW_W = 1000;
const PAD = 18;

export default function MaharashtraRiversMap2D() {
  const [data, setData] = useState<DistrictsFile | null>(null);
  const [detailedPaths, setDetailedPaths] = useState<RiverPathsFile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      fetch("/maharashtra-districts-simple.json").then((r) => {
        if (!r.ok) throw new Error(`Failed to load districts: ${r.status}`);
        return r.json() as Promise<DistrictsFile>;
      }),
      fetch("/maharashtra-rivers-paths.json")
        .then((r) => (r.ok ? (r.json() as Promise<RiverPathsFile>) : null))
        .catch(() => null),
    ])
      .then(([d, rp]) => {
        if (cancelled) return;
        setData(d);
        if (rp) setDetailedPaths(rp);
      })
      .catch((e: Error) => { if (!cancelled) setError(e.message || String(e)); });
    return () => { cancelled = true; };
  }, []);

  const enrichedRaw = useMemo(() => getEnrichedRivers(), []);

  type RiverShape = EnrichedRiver & { segments: LonLat[][]; isDetailed: boolean };
  const enriched: RiverShape[] = useMemo(() => {
    return enrichedRaw.map((r) => {
      const det = detailedPaths?.[r.id];
      if (det && det.length > 0) {
        return { ...r, segments: det, isDetailed: true };
      }
      return { ...r, segments: [r.path], isDetailed: false };
    });
  }, [enrichedRaw, detailedPaths]);

  const projection = useMemo(() => {
    if (!data) return null;
    return makeProjection(data.bounds);
  }, [data]);

  const baseViewBox = useMemo(() => {
    if (!projection) return null;
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
    const minW = baseViewBox.width * 0.15;
    const maxW = baseViewBox.width * 1.8;
    if (newW < minW) { const r = minW / newW; newW *= r; newH *= r; }
    if (newW > maxW) { const r = maxW / newW; newW *= r; newH *= r; }
    const newX = px - ((mouseX / rect.width) * newW);
    const newY = py - ((mouseY / rect.height) * newH);
    setVb({ x: newX, y: newY, width: newW, height: newH });
  }, [vb, baseViewBox]);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const handleResetView = useCallback(() => {
    if (baseViewBox) setVb({ x: baseViewBox.x, y: baseViewBox.y, width: baseViewBox.width, height: baseViewBox.height });
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

  /* — Render data: district + river polylines — */
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
    const projectToSvg = (lng: number, lat: number): [number, number] => {
      const [u, v] = projection.project(lng, lat);
      return [u * baseViewBox.scale, v * baseViewBox.scale];
    };
    return enriched.map((r) => ({
      r,
      d: pathOfSegments(r.segments, projectToSvg),
      label: labelAnchor(r.segments, projectToSvg),
    }));
  }, [enriched, projection, baseViewBox]);

  /* Draw tributaries first, mains on top. */
  const orderedRiverShapes = useMemo(() => {
    return [...riverShapes].sort((a, b) => {
      if (a.r.isMain !== b.r.isMain) return a.r.isMain ? 1 : -1;
      return 0;
    });
  }, [riverShapes]);

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

  const zoom = baseViewBox.width / vb.width;
  const baseStroke = baseViewBox.width / 600;
  const fontMain = Math.max(8, 11 / zoom);
  const fontTrib = Math.max(7, 9 / zoom);
  const fontDistrict = Math.max(7, 10 / zoom);
  const districtStroke = baseStroke * 0.6;
  const riverStrokeMain = baseStroke * 2.4;
  const riverStrokeTrib = baseStroke * 1.4;

  return (
    <div className="relative h-[70vh] w-full overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-sky-50/60 via-white to-emerald-50/40 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      <svg
        ref={svgRef}
        viewBox={`${vb.x} ${vb.y} ${vb.width} ${vb.height}`}
        className="absolute inset-0 h-full w-full touch-none select-none"
        style={{ cursor: draggingRef.current ? "grabbing" : "grab" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Outer transparent rectangle (catches pan events outside districts) */}
        <rect
          x={vb.x - 10000}
          y={vb.y - 10000}
          width={vb.width + 20000}
          height={vb.height + 20000}
          fill="transparent"
        />

        {/* Districts */}
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

        {/* District labels */}
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

        {/* River polylines */}
        <g pointerEvents="none">
          {orderedRiverShapes.map((s) => {
            const color = BASIN_COLOR[s.r.basin];
            const w = s.r.isMain ? riverStrokeMain : riverStrokeTrib;
            return (
              <path
                key={s.r.id}
                d={s.d}
                fill="none"
                stroke={color}
                strokeWidth={w}
                strokeOpacity={s.r.isMain ? 0.95 : 0.82}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* River name labels (pill chips) */}
        <g pointerEvents="none">
          {orderedRiverShapes.map((s) => {
            const color = BASIN_COLOR[s.r.basin];
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
                  fillOpacity={0.95}
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
              </g>
            );
          })}
        </g>
      </svg>

      {/* Compact zoom + reset controls (bottom-right). No basin selector,
          no sidebar, no popup — just the map itself. */}
      <div className="absolute bottom-3 right-3 flex flex-col gap-1" style={{ zIndex: 10 }}>
        <button
          onClick={() => handleZoom("in")}
          aria-label="Zoom in"
          className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-lg font-bold text-slate-700 shadow hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          +
        </button>
        <button
          onClick={() => handleZoom("out")}
          aria-label="Zoom out"
          className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-lg font-bold text-slate-700 shadow hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          −
        </button>
        <button
          onClick={handleResetView}
          aria-label="Reset view"
          className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-base font-bold text-slate-700 shadow hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          title="Reset view"
        >
          ⟳
        </button>
      </div>
    </div>
  );
}
