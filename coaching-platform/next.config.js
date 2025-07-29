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
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    NEXT_PUBLIC_RAZORPAY_KEY: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
    RAZORPAY_SECRET_KEY: process.env.RAZORPAY_SECRET_KEY,
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
