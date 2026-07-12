export type BlogContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string }
  | { type: "list"; items: string[] }
  | { type: "image"; src: string; alt: string; caption?: string };

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  author: string;
  // ISO date string, e.g. "2026-06-14"
  publishedAt: string;
  readTimeMinutes: number;
  tags?: string[];
  // Slugs matching entries in data/bike.ts, shown as a "Related Bikes" panel
  relatedBikeSlugs?: string[];
  content: BlogContentBlock[];
};