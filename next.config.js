/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'api.slingacademy.com',
      },
    ],
  },
  transpilePackages: ['geist'],
  eslint: {
    // Only run ESLint on specific directories during builds
    dirs: ['src', 'pages', 'components', 'lib', 'app'], // adjust to your actual directories
    // This allows builds to continue even with ESLint errors, but still shows them
    ignoreDuringBuilds: false,
  },
  reactStrictMode: false,
  // output: 'export',
}

export default nextConfig;