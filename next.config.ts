import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // ✅ Ignore TypeScript build errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // ✅ Ignore ESLint errors and warnings during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
