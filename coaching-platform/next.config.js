/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'firebasestorage.googleapis.com', 'framerusercontent.com'],
  },
  env: {
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_51Nt4bnEeDxhnTeYJ7eJC3lUIVLVs47lOcm0pLtpucPnDemepdZ4dFtMu1IxzK7fMsQFOt42bNgiuKQlFC24bkzXt00M6PmVQK2',
    STRIPE_SECRET_KEY: 'sk_test_51Nt4bnEeDxhnTeYJDYm8CHlklrDNOJmAWfnPuho58poep2lV3thyDloKOlsBqBq3dbBdPtK741I1joc0dM1VCokz00aTVJ00KK',
  },
};

module.exports = nextConfig;
