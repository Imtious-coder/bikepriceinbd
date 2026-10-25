import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "commons.wikimedia.org" },
      {
        protocol: "https",
        hostname: "www.bikebd.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "bdrider.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "imgbb.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/**",
      },
    ],
  },
};

// Keep development chunks separate from production builds.
export default (phase) => ({
  ...nextConfig,
  distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
});
