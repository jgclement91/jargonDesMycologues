/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["cdn.sanity.io"],
    unoptimized: true,
  },
  "redirects": [
    {
      "source": "/(.*)",
      "destination": "https://jargon-des-mycologues.org/$1",
      "permanent": true
    }
  ]
};

module.exports = nextConfig;
