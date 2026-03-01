/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Old dashboard URL: redirect to home so the path is no longer usable
      { source: '/dashboard', destination: '/', permanent: true },
    ]
  },
}

module.exports = nextConfig
