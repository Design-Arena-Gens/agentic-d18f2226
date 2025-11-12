/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["@codesandbox/sandpack-react"],
  },
};

export default nextConfig;
