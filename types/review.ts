export type Review = {
  id: string;
  name: string;
  location: string;
  verified: boolean;
  bikeSlug: string; // must match a slug in data/bike.ts
  rating: number; // 1-5
  text: string;
  // ISO date string, e.g. "2026-05-14"
  reviewedAt: string;
};