"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type * as Leaflet from "leaflet";
import { haversineKm, type GeoPoint } from "@/data/geo";

/**
 * Open-source map (Leaflet + OpenStreetMap tiles) showing Siliguri as origin,
 * the given destination points, and a line to the selected one.
 *
 * Leaflet is imported lazily inside the effect so it never runs during SSR
 * (it touches `window` on import). No API key required.
 *
 * - `onSelect`  → makes destination pins clickable; the map becomes an input.
 * - `lineLabel` → exact text on the route line (e.g. real road "114 km · 4.5 hrs").
 *                 When omitted we fall back to the straight-line distance.
 */
export default function TripMap({
  origin,
  points,
  selected,
  onSelect,
  lineLabel,
  className = "",
}: {
  origin: GeoPoint;
  points: GeoPoint[];
  selected?: string;
  onSelect?: (name: string) => void;
  lineLabel?: string;
  className?: string;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const LRef = useRef<typeof Leaflet | null>(null);
  const lineRef = useRef<Leaflet.Polyline | null>(null);
  const markersRef = useRef<Map<string, Leaflet.Marker>>(new Map());

  // Keep the latest values reachable inside the once-only init effect.
  const selectedRef = useRef(selected);
  const lineLabelRef = useRef(lineLabel);
  const onSelectRef = useRef(onSelect);

  // Sync refs after each render (must not assign refs during render). Declared
  // first so it runs before the init/update effects below on mount.
  useEffect(() => {
    selectedRef.current = selected;
    lineLabelRef.current = lineLabel;
    onSelectRef.current = onSelect;
  });

  // ---- icons -------------------------------------------------------------
  function destIcon(L: typeof Leaflet, active: boolean) {
    const size = active ? 22 : 15;
    const color = active ? "#f97316" : "#16a34a";
    return L.divIcon({
      className: "",
      html: `<span style="display:block;width:${size}px;height:${size}px;border-radius:9999px;background:${color};border:2.5px solid #fff;box-shadow:0 1px 4px rgba(15,23,42,.45)${active ? ",0 0 0 4px rgba(249,115,22,.25)" : ""};cursor:${onSelectRef.current ? "pointer" : "default"};transition:all .2s"></span>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  }

  function restyleMarkers() {
    const L = LRef.current;
    if (!L) return;
    markersRef.current.forEach((m, name) => {
      m.setIcon(destIcon(L, name === selectedRef.current));
    });
  }

  function drawLine() {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;
    if (lineRef.current) {
      lineRef.current.remove();
      lineRef.current = null;
    }
    const target = points.find((p) => p.name === selectedRef.current);
    if (!target) return;
    const line = L.polyline(
      [
        [origin.lat, origin.lng],
        [target.lat, target.lng],
      ],
      { color: "#f97316", weight: 3, dashArray: "6 8", opacity: 0.9 }
    ).addTo(map);
    const label = lineLabelRef.current ?? `~${haversineKm(origin, target)} km`;
    line
      .bindTooltip(label, { permanent: true, direction: "center", className: "map-distance-tip" })
      .openTooltip();
    lineRef.current = line;
    map.fitBounds(line.getBounds().pad(0.45));
  }

  // ---- init (once) -------------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !elRef.current || mapRef.current) return;
      LRef.current = L;

      const map = L.map(elRef.current, { scrollWheelZoom: false });
      mapRef.current = map;

      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      // Origin — pulsing orange dot with a permanent name label.
      L.marker([origin.lat, origin.lng], {
        icon: L.divIcon({
          className: "",
          html: `<span class="map-pulse" style="display:block;width:16px;height:16px;border-radius:9999px;background:#f97316;border:2.5px solid #fff;box-shadow:0 1px 4px rgba(15,23,42,.45)"></span>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        }),
        zIndexOffset: 1000,
      })
        .addTo(map)
        .bindTooltip(origin.name, { permanent: true, direction: "top", offset: [0, -10], className: "map-origin-label" });

      // Destinations.
      const all: Leaflet.LatLngExpression[] = [[origin.lat, origin.lng]];
      points.forEach((p) => {
        const m = L.marker([p.lat, p.lng], { icon: destIcon(L, p.name === selectedRef.current) }).addTo(map);
        m.bindTooltip(p.name, { direction: "top", offset: [0, -8] });
        if (onSelectRef.current) m.on("click", () => onSelectRef.current?.(p.name));
        markersRef.current.set(p.name, m);
        all.push([p.lat, p.lng]);
      });

      map.fitBounds(L.latLngBounds(all).pad(0.18));
      setTimeout(() => map.invalidateSize(), 200);

      const ro = new ResizeObserver(() => map.invalidateSize());
      ro.observe(elRef.current);

      drawLine();

      cleanup = () => {
        ro.disconnect();
        map.remove();
        mapRef.current = null;
        markersRef.current.clear();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-draw the line + restyle pins whenever the selection (or label) changes.
  useEffect(() => {
    restyleMarkers();
    drawLine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected, lineLabel]);

  return <div ref={elRef} className={className} />;
}
