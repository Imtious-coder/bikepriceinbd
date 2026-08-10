import type { MetadataRoute } from "next";
import { bikes } from "@/data/bike";

const BASE_URL = "https://bikepriceinbangladesh.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE_URL,
    },
    {
      url: `${BASE_URL}/bikes`,
    },
    {
      url: `${BASE_URL}/blogs`,
    },

    ...bikes.map((bike) => ({
      url: `${BASE_URL}/bikes/${bike.slug}`,
    })),
  ];
}