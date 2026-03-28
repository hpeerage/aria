/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/aria',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
