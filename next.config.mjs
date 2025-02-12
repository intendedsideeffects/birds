/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(mp4|webm)$/i,
      type: 'asset/resource',
    });
    return config;
  },
};

export default nextConfig;
