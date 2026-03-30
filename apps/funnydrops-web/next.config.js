/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@wsm/ui', '@wsm/config'],
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
