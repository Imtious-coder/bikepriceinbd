import { bikes } from "@/data/bike";

const BASE_URL = "https://bikepriceinbangladesh.com";

export async function GET() {
  const urls = [
    BASE_URL,
    `${BASE_URL}/bikes`,
    `${BASE_URL}/blogs`,
    ...bikes.map(
      (bike) => `${BASE_URL}/bikes/${bike.slug}`
    ),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}