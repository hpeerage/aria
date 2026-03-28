/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/aria',
  trailingSlash: true,
  images: {
    unoptimized: true,
  
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },},
};

export default nextConfig;
