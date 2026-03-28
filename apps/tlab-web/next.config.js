/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@wsm/ui', '@wsm/config'],
  trailingSlash: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
