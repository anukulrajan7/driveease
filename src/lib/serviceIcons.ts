import { Car, Building2, BedDouble, Plane, TrainFront, Palmtree } from "lucide-react";
import type { ServiceIcon } from "@/data/services";

/** Maps a service's iconKey to its lucide icon (usable in server components). */
export const SERVICE_ICONS: Record<ServiceIcon, typeof Car> = {
  car: Car,
  corporate: Building2,
  hotel: BedDouble,
  airport: Plane,
  station: TrainFront,
  holiday: Palmtree,
};
