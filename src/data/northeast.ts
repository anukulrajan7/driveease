/**
 * North East India planning data — festivals and a season matrix.
 *
 * Facts verified June 2026. Festival dates that follow the lunar calendar
 * (e.g. Losar) shift year to year; we show the month and flag it as variable.
 * The season matrix is a planning aid, not a guarantee — hill weather and
 * NH10 landslide closures can move the goalposts in any month.
 */

export interface Festival {
  name: string;
  state: string;
  /** Short window label shown on the card, e.g. "1–10 Dec". */
  window: string;
  /** Month index of the peak (0 = Jan) — used only for chronological sort. */
  monthIndex: number;
  why: string;
  /** Destination slug to deep-link the card to a real guide page. */
  destinationSlug: string;
  /** True when the date moves each year (lunar calendar). */
  variable?: boolean;
}

/** Chronological across the year — surfaces "what's on when". */
export const FESTIVALS: Festival[] = [
  {
    name: "Losar",
    state: "Tawang, Arunachal",
    window: "February",
    monthIndex: 1,
    why: "Tibetan-Buddhist New Year — butter lamps, masked cham dances and prayer at India's largest monastery.",
    destinationSlug: "tawang",
    variable: true,
  },
  {
    name: "Rongali Bihu",
    state: "Assam",
    window: "mid-April",
    monthIndex: 3,
    why: "Assamese New Year — husori dancers, bamboo flutes and feasts spill across every village and town.",
    destinationSlug: "majuli",
  },
  {
    name: "Ziro Festival of Music",
    state: "Ziro Valley, Arunachal",
    window: "late September",
    monthIndex: 8,
    why: "India's finest outdoor indie-music festival, staged among the Apatani rice paddies.",
    destinationSlug: "ziro",
  },
  {
    name: "Wangala — 100 Drums",
    state: "Garo Hills, Meghalaya",
    window: "Oct–Nov",
    monthIndex: 9,
    why: "The Garo post-harvest thanksgiving — a hundred drums beating as one to the sun-god Misi Saljong.",
    destinationSlug: "meghalaya",
  },
  {
    name: "Sangai Festival",
    state: "Imphal, Manipur",
    window: "21–30 Nov",
    monthIndex: 10,
    why: "Manipur's flagship culture-and-tourism festival, named for the dancing brow-antlered deer of Loktak.",
    destinationSlug: "manipur",
  },
  {
    name: "Cherry Blossom Festival",
    state: "Shillong, Meghalaya",
    window: "November",
    monthIndex: 10,
    why: "Himalayan cherry trees turn Shillong pink — paired with live music and night markets.",
    destinationSlug: "meghalaya",
  },
  {
    name: "Hornbill Festival",
    state: "Kohima, Nagaland",
    window: "1–10 Dec",
    monthIndex: 11,
    why: "The “Festival of Festivals” — every Naga tribe gathers at Kisama. Book 8+ weeks ahead; Kohima fills fast.",
    destinationSlug: "nagaland",
  },
];

/* ---------- Season matrix ---------- */

export type SeasonRating = "peak" | "good" | "limited";

export interface SeasonRow {
  region: string;
  /** Destination slug for an optional deep-link. */
  destinationSlug: string;
  /** 12 ratings, Jan → Dec. */
  months: SeasonRating[];
  note: string;
}

export const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export const SEASON_LEGEND: { key: SeasonRating; label: string; description: string }[] = [
  { key: "peak", label: "Best", description: "Clear skies, passes open — prime time" },
  { key: "good", label: "Good", description: "Pleasant, fewer crowds — a fine shoulder month" },
  { key: "limited", label: "Limited", description: "Monsoon, snow or park closure — go with care" },
];

// Order: P=peak, G=good, L=limited (Jan → Dec)
const P: SeasonRating = "peak";
const G: SeasonRating = "good";
const L: SeasonRating = "limited";

export const SEASON_MATRIX: SeasonRow[] = [
  {
    region: "Sikkim & Darjeeling",
    destinationSlug: "sikkim",
    months: [G, G, P, P, P, L, L, L, L, P, P, P],
    note: "Spring rhododendrons and clear autumn Kanchenjunga views. NH10 is landslide-prone Jun–Sep.",
  },
  {
    region: "Assam — Kaziranga",
    destinationSlug: "kaziranga",
    months: [P, P, P, P, L, L, L, L, L, G, P, P],
    note: "Park open ~Oct–Apr; closed for the Brahmaputra floods May–Sep. Best rhino safaris Nov–Apr.",
  },
  {
    region: "Meghalaya",
    destinationSlug: "meghalaya",
    months: [G, G, G, G, L, L, L, L, G, P, P, G],
    note: "Waterfalls and root bridges peak post-monsoon (Oct–Nov). Cherrapunji is wettest Jun–Aug.",
  },
  {
    region: "Arunachal — Tawang",
    destinationSlug: "tawang",
    months: [L, L, P, P, G, L, L, L, G, P, P, G],
    note: "Sela Pass (13,700 ft) is often snow-blocked Jan–Feb. Spring and autumn are the windows.",
  },
  {
    region: "Nagaland",
    destinationSlug: "nagaland",
    months: [G, G, G, G, G, G, G, G, G, P, P, P],
    note: "Pleasant most of the year; Dzukou Valley lilies bloom Jun–Aug. Hornbill peaks in early Dec.",
  },
  {
    region: "Manipur — Loktak",
    destinationSlug: "manipur",
    months: [G, G, G, G, L, L, L, L, G, P, P, P],
    note: "Loktak Lake is clearest in winter; Sangai Festival lands in late November.",
  },
];
