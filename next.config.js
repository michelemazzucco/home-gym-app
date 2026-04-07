/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@base-ui-components/react', '@heroicons/react'],
  },
}

module.exports = nextConfig
