import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    // serverExternalPackages: ["@prisma/client"],
  },
};

export default nextConfig;
