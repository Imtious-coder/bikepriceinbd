const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.bikebd.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
