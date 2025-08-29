/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.sanity.io"],
    unoptimized: true,
  }
};

module.exports = nextConfig;
