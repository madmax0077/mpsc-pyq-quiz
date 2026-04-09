/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  webpack: (config, { isServer }) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };

    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        canvas: false,
      };
      // Skip parsing the huge pdfjs-dist worker — it's loaded separately
      config.module.noParse = /pdf\.worker/;
    }

    return config;
  },
};

export default nextConfig;
