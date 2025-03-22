/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "standalone",
  experimental: {
    // This is optional but recommended for better performance
    serverActions: true,
  },
  // Set the server to listen on port 3006
  env: {
    PORT: "3006",
  },
};

module.exports = nextConfig;
