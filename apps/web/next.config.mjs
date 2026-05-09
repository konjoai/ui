/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@konjoai/ui"],
  experimental: {
    optimizePackageImports: ["motion"],
  },
};

export default nextConfig;
