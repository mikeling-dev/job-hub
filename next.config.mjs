/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "remotive.com",
      },
      {
        protocol: "https",
        hostname: "web3.career",
      },
      {
        protocol: "https",
        hostname: "*.remotive.com",
      },
    ],
  },
};

export default nextConfig;
