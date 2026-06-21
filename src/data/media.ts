/**
 * Real North East India / Eastern Himalaya footage for the hero montage —
 * misty hills, valleys, rivers and tea country across the Seven Sisters.
 * Each clip carries a caption describing the place on screen, so the words
 * match the footage and the page feels grounded in the real region.
 * Swap these for your own on-ground footage in /public when you have it.
 */
export const NE_HERO_POSTER =
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1800&q=70";

export interface HeroClip {
  src: string;
  /** Short place label, e.g. "Meghalaya" */
  place: string;
  /** One-line description shown over the clip */
  caption: string;
}

export const NE_HERO_CLIPS: HeroClip[] = [
  {
    src: "https://videos.pexels.com/video-files/857195/857195-hd_1280_720_25fps.mp4",
    place: "Meghalaya",
    caption: "Cloud-wrapped hills & living root bridges",
  },
  {
    src: "https://videos.pexels.com/video-files/2169880/2169880-hd_1280_720_30fps.mp4",
    place: "Sikkim",
    caption: "Snow peaks above the Teesta valley",
  },
  {
    src: "https://videos.pexels.com/video-files/4763824/4763824-hd_1280_720_24fps.mp4",
    place: "Assam",
    caption: "Endless tea gardens & the Brahmaputra",
  },
  {
    src: "https://videos.pexels.com/video-files/6981411/6981411-hd_1280_720_25fps.mp4",
    place: "Arunachal Pradesh",
    caption: "Land of the dawn-lit mountains",
  },
  {
    src: "https://videos.pexels.com/video-files/3214448/3214448-hd_1280_720_25fps.mp4",
    place: "Nagaland",
    caption: "Misty ridges & hornbill country",
  },
];

/** Pick the most fitting hero clip for a destination slug (by region). */
const DESTINATION_CLIP: Record<string, string> = {
  meghalaya: "Meghalaya",
  sikkim: "Sikkim",
  dooars: "Assam",
  bhutan: "Sikkim",
  kaziranga: "Assam",
  majuli: "Assam",
  tawang: "Arunachal Pradesh",
  ziro: "Arunachal Pradesh",
  namdapha: "Arunachal Pradesh",
  nagaland: "Nagaland",
};

export function clipForDestination(slug: string): HeroClip {
  const place = DESTINATION_CLIP[slug];
  return NE_HERO_CLIPS.find((c) => c.place === place) ?? NE_HERO_CLIPS[0];
}

/** The Seven Sisters + Sikkim — shown as a marquee of real places under the hero. */
export const SEVEN_SISTERS = [
  "Meghalaya",
  "Assam",
  "Arunachal Pradesh",
  "Nagaland",
  "Manipur",
  "Mizoram",
  "Tripura",
  "Sikkim",
];

/**
 * The classic route trail shown in the hero, in travel order:
 * Siliguri → Darjeeling → Sikkim → the rest of the North East.
 */
export const HERO_ROUTE = [
  "Siliguri",
  "Darjeeling",
  "Sikkim",
  "Kalimpong",
  "Gangtok",
  "Assam",
  "Meghalaya",
  "Arunachal Pradesh",
];
