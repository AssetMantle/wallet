/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // this will override the experiments
    config.experiments = { ...config.experiments, ...{ topLevelAwait: true } };
    // this will just update topLevelAwait property of config.experiments
    // config.experiments.topLevelAwait = true
    return config;
  },
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/osmosis/:path*",
        destination: "https://api.osmosis.zone/:path*",
      },
    ];
  },
  // swcMinify: true,
};

module.exports = nextConfig;
