/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'firebasestorage.googleapis.com', 'framerusercontent.com'],
  },
  env: {
   
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth/login',
        permanent: false,
      },
      {
        source: '/dashboard/coaching/unlimited-coaching',
        destination: '/dashboard/coaching/unlimited',
        permanent: true,
      },
      {
        source: '/dashboard/coaching/group-coaching-program',
        destination: '/dashboard/coaching/group-coaching',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
