/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    LAST_UPDATED: new Date().toISOString(),
  },
};

export default nextConfig;
