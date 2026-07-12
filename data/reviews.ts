import { Review } from "@/types/review";

// NOTE: `bikeSlug` must match a slug in data/bike.ts exactly, or the
// component will just hide the bike chip for that review. Only
// "Suzuki_Gixxer_SF_250" is confirmed against your dataset — swap the rest
// to real slugs from your data before shipping, or replace this file with
// real review data entirely.
export const reviews: Review[] = [
  {
    id: "r1",
    name: "Md Shahin",
    location: "Mymensingh",
    verified: true,
    bikeSlug: "Suzuki_Gixxer_SF_250",
    rating: 5,
    text: "Rode this for about six months now, mostly city commuting with the occasional highway run. The ABS gives real confidence in Dhaka traffic, and the fuel injection means it starts instantly every morning even in monsoon. Only complaint is the seat gets uncomfortable past an hour.",
    reviewedAt: "2026-05-02",
  },
  {
    id: "r2",
    name: "Sakibul Mahmud",
    location: "Brahmanbaria",
    verified: true,
    bikeSlug: "Suzuki_Gixxer_SF_250",
    rating: 5,
    text: "Bought it for both city streets and weekend off-road trails near home. Handles rougher patches better than I expected for a sports-styled bike. Mileage in the city sits around 33-34 km/l which is close to the claimed figure.",
    reviewedAt: "2026-05-18",
  },
  {
    id: "r3",
    name: "Mamun",
    location: "Pabna",
    verified: false,
    bikeSlug: "Suzuki_Gixxer_SF_250",
    rating: 4,
    text: "Good looking bike, especially in matt blue. Power delivery is smooth and predictable. Wish the headlight threw a bit further on unlit roads outside town, but overall very happy with the purchase.",
    reviewedAt: "2026-04-11",
  },
  {
    id: "r4",
    name: "Farhan Ahmed",
    location: "Chattogram",
    verified: true,
    bikeSlug: "Suzuki_Gixxer_SF_250",
    rating: 5,
    text: "Second bike from Suzuki and they haven't disappointed. Service centre in Chattogram is responsive and parts are easier to find than I expected for a relatively newer model in Bangladesh.",
    reviewedAt: "2026-06-01",
  },
  {
    id: "r5",
    name: "Nusrat Jahan",
    location: "Sylhet",
    verified: true,
    bikeSlug: "Suzuki_Gixxer_SF_250",
    rating: 4,
    text: "Comfortable for my daily 20km commute. The dual-channel ABS genuinely helped once when a rickshaw cut in front of me suddenly on a wet road — stopped without any drama.",
    reviewedAt: "2026-06-09",
  },
  {
    id: "r6",
    name: "Tanvir Islam",
    location: "Rajshahi",
    verified: false,
    bikeSlug: "Yamaha_R15_V4",
    rating: 5,
    text: "Switched from a 150cc commuter and the jump in refinement is noticeable immediately. Vibration at highway speed is much lower than I was used to. Worth the upgrade if you can afford it.",
    reviewedAt: "2026-03-27",
  },
];

export function getAllReviewCategories(
  bikeTypeBySlug: (slug: string) => string | undefined,
): string[] {
  const types = new Set<string>();
  for (const r of reviews) {
    const type = bikeTypeBySlug(r.bikeSlug);
    if (type) types.add(type);
  }
  return Array.from(types).sort();
}
