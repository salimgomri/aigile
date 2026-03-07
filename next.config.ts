import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Removed 'output: export' to allow middleware and authentication
  // Static export is incompatible with Next.js middleware
  images: {
    unoptimized: true,
  },
  basePath: '',
  trailingSlash: true,
}

export default nextConfig
