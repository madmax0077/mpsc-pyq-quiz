/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // Local-dev only: lets `next dev` use an alternate build dir (e.g. .next-dev)
  // via NEXT_DEV_DISTDIR when the default .next is locked by OneDrive sync.
  // Has NO effect on the production/Vercel build (env var is unset there).
  ...(process.env.NEXT_DEV_DISTDIR ? { distDir: process.env.NEXT_DEV_DISTDIR } : {}),
  images: { unoptimized: true },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };

    config.module.noParse = /pdf\.worker/;

    return config;
  },
};

export default nextConfig;
