import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@wsm/ui", "@wsm/config", "@wsm/db"],
};

export default nextConfig;
