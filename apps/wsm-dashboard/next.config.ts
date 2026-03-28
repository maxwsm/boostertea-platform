// @ts-nocheck
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@wsm/ui', '@wsm/config', '@wsm/db'],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
