/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Old dashboard URL: redirect to home so the path is no longer usable
      { source: '/dashboard', destination: '/', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/my-reservations',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, max-age=0, must-revalidate',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
