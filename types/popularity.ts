export type PopularityStat = {
  bikeSlug: string; // must match a slug in data/bike.ts
  monthlyViews: number;
  unitsSold: number;
};