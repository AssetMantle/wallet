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
      {
        source: "/api/assetmantle/cosmosdirectoryrpc",
        destination: "https://rpc.cosmos.directory/assetmantle",
      },
      {
        source: "/api/coingecko/:path*",
        destination: "https://api.coingecko.com/:path*",
      },
    ];
  },
  // swcMinify: true,
};

module.exports = nextConfig;
