import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disabled cacheComponents to allow dynamic rendering for authenticated pages
  // cacheComponents: true,

  // Disable production browser source maps to suppress warnings
  productionBrowserSourceMaps: false,

  // Empty turbopack config to acknowledge we're using Turbopack
  // Source map warnings from Next.js internal chunks are harmless and can be ignored
  turbopack: {},
};

export default nextConfig;
