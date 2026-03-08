import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Disable Turbopack to avoid cache corruption issues
  experimental: {
    turbo: false,
  },
};

export default nextConfig;
