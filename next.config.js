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
      {
        source: "/api/assetmantle/cosmosdirectoryrest",
        destination: "https://rest.cosmos.directory/assetmantle",
      },
      {
        source: "/api/assetmantle/rpc",
        destination: "https://rpc.assetmantle.one",
      },
      {
        source: "/api/assetmantle/rest",
        destination: "https://rest.assetmantle.one",
      },
      {
        source: "/api/gravitybridge/cosmosdirectoryrpc",
        destination: "https://rpc.cosmos.directory/gravitybridge",
      },
      {
        source: "/api/gravitybridge/cosmosdirectoryrest",
        destination: "https://rest.cosmos.directory/gravitybridge",
      },
      {
        source: "/api/gravitybridge/rpc",
        destination: "https://gravitychain.io:26657",
      },
      {
        source: "/api/gravitybridge/rest",
        destination: "https://gravitychain.io:1317",
      },
    ];
  },
  staticPageGenerationTimeout: 180,
  // swcMinify: true,
};

module.exports = nextConfig;
