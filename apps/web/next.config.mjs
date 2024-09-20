/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    LAST_UPDATED: new Date().toISOString(),
  },
  output: "standalone",
};

export default nextConfig;
