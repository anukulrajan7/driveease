/** Geographic data for the map + 3D globe. Everything originates from Siliguri. */

export interface GeoPoint {
  name: string;
  lat: number;
  lng: number;
}

/** Our home base — every cab route and tour starts here. */
export const ORIGIN: GeoPoint = { name: "Siliguri", lat: 26.7271, lng: 88.3953 };

/** Realistic cab circuit from Siliguri with road distance + drive time. */
export interface CabRoute extends GeoPoint {
  distanceKm: number;
  hours: string;
  note: string;
}

export const CAB_ROUTES: CabRoute[] = [
  { name: "Bagdogra Airport", lat: 26.6812, lng: 88.3286, distanceKm: 16, hours: "40 min", note: "Airport pickup" },
  { name: "Mirik", lat: 26.887, lng: 88.1869, distanceKm: 52, hours: "2.5 hrs", note: "Lake & tea gardens" },
  { name: "Darjeeling", lat: 27.036, lng: 88.2627, distanceKm: 68, hours: "3 hrs", note: "Toy-train hills" },
  { name: "Kalimpong", lat: 27.0586, lng: 88.469, distanceKm: 70, hours: "3 hrs", note: "Quiet hill town" },
  { name: "Dooars (Lataguri)", lat: 26.76, lng: 88.79, distanceKm: 80, hours: "3 hrs", note: "Wildlife & forests" },
  { name: "Lava & Lolegaon", lat: 27.099, lng: 88.6655, distanceKm: 110, hours: "4 hrs", note: "Pine forest ridge" },
  { name: "Gangtok, Sikkim", lat: 27.3389, lng: 88.6065, distanceKm: 114, hours: "4.5 hrs", note: "Permits arranged" },
  { name: "Pelling, Sikkim", lat: 27.3007, lng: 88.2393, distanceKm: 130, hours: "5 hrs", note: "Kanchenjunga views" },
];

/** Coordinates for the tour destinations (used by the globe + place mini-maps). */
export const DESTINATION_COORDS: Record<string, GeoPoint> = {
  meghalaya: { name: "Meghalaya", lat: 25.5788, lng: 91.8933 },
  kaziranga: { name: "Kaziranga", lat: 26.5775, lng: 93.1711 },
  tawang: { name: "Tawang", lat: 27.586, lng: 91.859 },
  sikkim: { name: "Sikkim", lat: 27.3314, lng: 88.6138 },
  nagaland: { name: "Nagaland", lat: 25.6751, lng: 94.1086 },
  majuli: { name: "Majuli", lat: 26.95, lng: 94.17 },
  ziro: { name: "Ziro", lat: 27.5447, lng: 93.8281 },
  manipur: { name: "Manipur", lat: 24.817, lng: 93.9368 },
  namdapha: { name: "Namdapha", lat: 27.49, lng: 96.38 },
};

/** Great-circle distance in km (Haversine). */
export function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
}
