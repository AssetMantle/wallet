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
      // CoinMarketCap public data-api (the same backend coinmarketcap.com
      // uses for its own pages). No API key required, CORS works through
      // the rewrite, and it covers spot prices, market caps, supply, and
      // market-pair tickers — see queries.coinmarketcap.GetTicker in the
      // AssetMantle/client repo for the same approach on the server side.
      {
        source: "/api/cmc/:path*",
        destination: "https://api.coinmarketcap.com/data-api/v3/:path*",
      },
    ];
  },
  // swcMinify: true,
};

module.exports = nextConfig;
