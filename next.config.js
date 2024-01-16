/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: 'http://localhost:8082/api/:path*',
    },
  ],
  images: {
    remotePatterns: [
      {
        hostname: '**',
        protocol: 'https',
        pathname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
