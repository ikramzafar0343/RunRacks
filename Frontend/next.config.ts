/**
 * Next.js project config (read at build/dev start).
 * Docs differ by version — always check the installed Next.js docs if unsure.
 */
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  ...(isProd
    ? [
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob:",
          "font-src 'self' data:",
          "connect-src 'self'",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join("; "),
      },
    ]
    : []),
];

const publicAssetCache = [
  {
    key: "Cache-Control",
    value: "public, max-age=86400, stale-while-revalidate=604800",
  },
];

const nextConfig: NextConfig = {
  typedRoutes: true,
  cacheComponents: true,
  async redirects() {
    return [
      {
        source: "/resources/blog",
        destination: "/blog",
        permanent: true,
      },
    ];
  },
  // Gzip HTML/JS/CSS for slow links when using `next start`.
  compress: true,
  // Off: instant prefetch validation breaks client module proxies in Turbopack dev.
  partialPrefetching: false,
  allowedDevOrigins: ["192.168.18.105", "localhost"],
  experimental: {
    optimizePackageImports: [
      "react-icons",
      "react-icons/hi2",
      "react-icons/si",
      "react-icons/fa",
      "react-icons/fa6",
      "gsap",
      "@gsap/react",
      "framer-motion",
    ],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 80],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [96, 128, 188, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        source: "/images/:path*",
        headers: publicAssetCache,
      },
      {
        source: "/media/:path*",
        headers: publicAssetCache,
      },
      {
        source: "/home/:path*",
        headers: publicAssetCache,
      },
      {
        source: "/brands/:path*",
        headers: publicAssetCache,
      },
      {
        source: "/flags/:path*",
        headers: publicAssetCache,
      },
    ];
  },
};

export default nextConfig;
