"use client";

import { useState } from "react";
import permitsData from "@/data/permits.json";
import { Select } from "@/components/ui";

interface PermitInfo {
  permit: string;
  details: string;
  required: boolean;
}

interface Region {
  region: string;
  destinationSlugs: string[];
  indian: PermitInfo;
  foreigner: PermitInfo;
}

const permits: Region[] = permitsData as Region[];

type Nationality = "indian" | "foreigner";

export default function PermitChecker() {
  const [regionIndex, setRegionIndex] = useState<number | "">("");
  const [nationality, setNationality] = useState<Nationality | "">("");

  const selected =
    regionIndex !== "" && nationality !== ""
      ? permits[regionIndex][nationality]
      : undefined;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Permit checker</h2>
      <p className="mt-1 text-sm text-slate-500">
        Select your destination and nationality to see exactly what paperwork you need.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="region-select" className="text-sm font-medium text-slate-700">
            Where are you going?
          </label>
          <Select
            id="region-select"
            value={regionIndex}
            onChange={(e) =>
              setRegionIndex(e.target.value === "" ? "" : Number(e.target.value))
            }
          >
            <option value="">Select a region…</option>
            {permits.map((r, i) => (
              <option key={r.region} value={i}>
                {r.region}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="nationality-select" className="text-sm font-medium text-slate-700">
            Nationality
          </label>
          <Select
            id="nationality-select"
            value={nationality}
            onChange={(e) => setNationality(e.target.value as Nationality | "")}
          >
            <option value="">Select nationality…</option>
            <option value="indian">Indian citizen</option>
            <option value="foreigner">Foreign national</option>
          </Select>
        </div>
      </div>

      {selected !== undefined && (
        <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <p className="text-lg font-bold text-slate-900">{selected.permit}</p>
            {selected.required ? (
              <span className="inline-flex items-center rounded-full bg-accent-100 px-3 py-1 text-xs font-semibold text-accent-700">
                Permit required
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                No permit needed
              </span>
            )}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{selected.details}</p>
          <p className="mt-4 text-xs font-medium text-brand-700">
            We handle permit paperwork for every DriveEase booking.
          </p>
        </div>
      )}
    </div>
  );
}
