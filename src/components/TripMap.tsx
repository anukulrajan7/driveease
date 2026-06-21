"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type * as Leaflet from "leaflet";
import { haversineKm, type GeoPoint } from "@/data/geo";

/**
 * Open-source map (Leaflet + OpenStreetMap tiles) showing Siliguri as origin,
 * the given destination points, and a dashed line to the selected one.
 * Leaflet is imported lazily inside the effect so it never runs during SSR
 * (it touches `window` on import). No API key required.
 */
export default function TripMap({
  origin,
  points,
  selected,
  className = "",
}: {
  origin: GeoPoint;
  points: GeoPoint[];
  selected?: string;
  className?: string;
}) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Leaflet.Map | null>(null);
  const LRef = useRef<typeof Leaflet | null>(null);
  const lineRef = useRef<Leaflet.Polyline | null>(null);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !elRef.current || mapRef.current) return;
      LRef.current = L;

      const dot = (color: string, pulse = false) =>
        L.divIcon({
          className: "",
          html: `<span class="${pulse ? "map-pulse" : ""}" style="display:block;width:14px;height:14px;border-radius:9999px;background:${color};border:2px solid #fff;box-shadow:0 0 0 2px rgba(15,23,42,0.2)"></span>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        });

      const map = L.map(elRef.current, { scrollWheelZoom: false });
      mapRef.current = map;

      // CARTO Voyager basemap — cleaner/modern, still © OpenStreetMap data.
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 19,
      }).addTo(map);

      L.marker([origin.lat, origin.lng], { icon: dot("#f97316", true) })
        .addTo(map)
        .bindPopup(`<b>${origin.name}</b><br>Your starting point`);

      const all: Leaflet.LatLngExpression[] = [[origin.lat, origin.lng]];
      points.forEach((p) => {
        L.marker([p.lat, p.lng], { icon: dot("#16a34a") }).addTo(map).bindPopup(`<b>${p.name}</b>`);
        all.push([p.lat, p.lng]);
      });
      map.fitBounds(L.latLngBounds(all).pad(0.15));
      setTimeout(() => map.invalidateSize(), 200);

      const ro = new ResizeObserver(() => map.invalidateSize());
      ro.observe(elRef.current);

      // Draw the initial selected line, if any.
      drawLine(selectedRef.current);

      cleanup = () => {
        ro.disconnect();
        map.remove();
        mapRef.current = null;
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function drawLine(name?: string) {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;
    if (lineRef.current) {
      lineRef.current.remove();
      lineRef.current = null;
    }
    const target = points.find((p) => p.name === name);
    if (!target) return;
    const line = L.polyline(
      [
        [origin.lat, origin.lng],
        [target.lat, target.lng],
      ],
      { color: "#f97316", weight: 3, dashArray: "6 8", opacity: 0.9 }
    ).addTo(map);
    line
      .bindTooltip(`${haversineKm(origin, target)} km`, {
        permanent: true,
        direction: "center",
        className: "map-distance-tip",
      })
      .openTooltip();
    lineRef.current = line;
    map.fitBounds(line.getBounds().pad(0.4));
  }

  // Update the line whenever the selection changes.
  useEffect(() => {
    drawLine(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  return <div ref={elRef} className={className} />;
}
