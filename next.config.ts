import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  // Umami is proxied through this origin so ad blockers (uBlock Origin, Brave)
  // don't drop it — cloud.umami.is is on EasyPrivacy. Keep these paths in sync
  // with the tracking tag in `src/pages/_document.tsx`.
  async rewrites() {
    return [
      { source: "/stats/:path*", destination: "https://cloud.umami.is/:path*" },
      { source: "/api/send", destination: "https://cloud.umami.is/api/send" },
    ];
  },
};

export default nextConfig;
