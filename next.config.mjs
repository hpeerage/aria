/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', 



    trailingSlash: true,
    images: {
          unoptimized: true,
          remotePatterns: [
            {
              protocol: 'https',
              hostname: 'res.cloudinary.com',
            },
          ],
    },
    eslint: {
          ignoreDuringBuilds: true,
    },
    typescript: {
          ignoreBuildErrors: true,
    },
};

export default nextConfig;
