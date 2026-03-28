/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['boostertea.com.ua', 'www.boostertea.com.ua', 'https://boostertea.com.ua', 'https://www.boostertea.com.ua', 'dash.boostertea.com.ua', 'https://dash.boostertea.com.ua', 'dino.boostertea.com.ua', 'https://dino.boostertea.com.ua', 'funny.boostertea.com.ua', 'tlab.boostertea.com.ua', 'http://localhost', 'https://tlab.boostertea.com.ua', 'https://funny.boostertea.com.ua', '*'],
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
