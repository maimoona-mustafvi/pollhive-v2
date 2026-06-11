import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  serverExternalPackages: [
    'mongoose',
    'kafkajs',
    'socket.io',
    '@socket.io/redis-adapter',
    'redis',
    'bcryptjs',
    'jose',
  ],
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig