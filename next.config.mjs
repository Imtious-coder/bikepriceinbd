const nextConfig = {
  images: {
    remotePatterns: [
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
    ],
  },
};

export default nextConfig;