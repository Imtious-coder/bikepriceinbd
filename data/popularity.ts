import { getBikeBySlug } from "@/data/bike";
import { OBike } from "@/types/bike";
import { PopularityStat } from "@/types/popularity";

// NOTE: `bikeSlug` must match a slug in data/bike.ts exactly. Only
// "Suzuki_Gixxer_SF_250" is confirmed against your dataset — the rest are
// placeholder slugs. Any entry that doesn't resolve to a real bike is
// silently dropped by getRankedBikes(), so swap these for real slugs (and
// real numbers) once you have analytics or sales data to back them.
export const popularityStats: PopularityStat[] = [
  { bikeSlug: "Suzuki_Gixxer_SF_250", monthlyViews: 18400, unitsSold: 412 },
  { bikeSlug: "Yamaha_FZS_V3", monthlyViews: 22150, unitsSold: 588 },
  { bikeSlug: "Honda_CB150R", monthlyViews: 15720, unitsSold: 301 },
  { bikeSlug: "Bajaj_Pulsar_150", monthlyViews: 26840, unitsSold: 702 },
  { bikeSlug: "TVS_Apache_RTR_160", monthlyViews: 19960, unitsSold: 455 },
  { bikeSlug: "Hero_Hunk_150R", monthlyViews: 9380, unitsSold: 210 },
  { bikeSlug: "Royal_Enfield_Classic_350", monthlyViews: 13500, unitsSold: 168 },
  { bikeSlug: "CFMOTO_300NK", monthlyViews: 7120, unitsSold: 94 },
];

export type RankedBike = {
  bike: OBike;
  monthlyViews: number;
  unitsSold: number;
};

export function getRankedBikes(sortBy: "views" | "sales"): RankedBike[] {
  const resolved = popularityStats
    .map((stat) => {
      const bike = getBikeBySlug(stat.bikeSlug);
      if (!bike) return null;
      return { bike, monthlyViews: stat.monthlyViews, unitsSold: stat.unitsSold };
    })
    .filter((x): x is RankedBike => x !== null);

  return resolved.sort((a, b) =>
    sortBy === "views"
      ? b.monthlyViews - a.monthlyViews
      : b.unitsSold - a.unitsSold,
  );
}