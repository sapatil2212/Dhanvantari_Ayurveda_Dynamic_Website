/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export to enable server features (API routes, auth)
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
