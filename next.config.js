/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        port: " ",
        pathname:
          "/cosmostation/cosmostation_token_resource/master/moniker/asset-mantle/**",
      },
    ],
  },
  webpack: (config) => {
    // this will override the experiments
    config.experiments = { ...config.experiments, ...{ topLevelAwait: true } };
    // this will just update topLevelAwait property of config.experiments
    // config.experiments.topLevelAwait = true
    return config;
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
