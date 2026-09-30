import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "standalone",
  // The social-card route reads these off disk at runtime.
  outputFileTracingIncludes: {
    "/api/og": ["./node_modules/geist/dist/fonts/geist-sans/Geist-{Regular,Medium}.ttf"],
  },
  // The Umami tracker script is proxied through this origin so ad blockers
  // (uBlock Origin, Brave) don't drop it — cloud.umami.is is on EasyPrivacy.
  // Keep this path in sync with the tracking tag in `src/pages/_document.tsx`.
  // Collection is handled by `src/pages/api/send.ts` rather than a rewrite so
  // the visitor's real IP survives the hop (a rewrite geolocates everyone to
  // the server's region).
  // www serves the same pages, so fold it into the apex — one host for
  // crawlers to index, matching the canonical URLs in `src/lib/seo.ts`.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.javokhir.com" }],
        destination: "https://javokhir.com/:path*",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [{ source: "/stats/:path*", destination: "https://cloud.umami.is/:path*" }];
  },
};

export default nextConfig;
