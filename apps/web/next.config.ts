import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const allowedOrigins = [
  process.env.NEXT_PUBLIC_APP_URL,
  process.env.NEXT_PUBLIC_ADMIN_URL,
].filter(Boolean) as string[];

function getCorsOriginHeader() {
  if (allowedOrigins.length === 0) {
    return "https://artlighting-eg.com";
  }

  if (allowedOrigins.length === 1) {
    return allowedOrigins[0];
  }

  return allowedOrigins[0];
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@/components/ui"],
  },
  async headers() {
    const corsOrigin = getCorsOriginHeader();

    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: corsOrigin,
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
      {
        source: "/brand/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  compress: true,
  poweredByHeader: false,
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);