import { ChakraProvider } from "@chakra-ui/react";
import { wallets as leapwallets } from "@cosmos-kit/leap";
import { ChainProvider } from "@cosmos-kit/react";
import { assets, chains } from "chain-registry";
import Head from "next/head";
import { useEffect } from "react";
import Layout from "../components/Layout";
import {
  cosmostationWallets,
  defaultChainGRPCProxy,
  defaultChainName,
  defaultChainRESTProxy,
  defaultChainRPCProxy,
  defaultTheme,
  keplrWallets,
} from "../config";
import "../config/styles/index.scss";
import ConnectModal from "../views/ConnectModal/ConnectModal";

function CreateCosmosApp({ Component, pageProps }) {
  // useEffect for bootstrap js hydration
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.js");
    console.log("leapwallets: ", leapwallets);
  }, []);

  const assetmantleChain = chains.find(
    (_chain) => _chain?.chain_name === "assetmantle"
  );

  const assetmantleTestnetProps = {
    apis: {
      grpc: [{ address: defaultChainGRPCProxy, provider: "AssetMantle" }],
      rest: [{ address: defaultChainRESTProxy, provider: "AssetMantle" }],
      rpc: [{ address: defaultChainRPCProxy, provider: "AssetMantle" }],
    },
    bech32_prefix: "mantle",
    chain_id: "test-mantle-2",
    chain_name: "assetmantletestnet",
    daemon_name: "mantelNode",
    explorers: [
      {
        kind: "other",
        tx_page:
          "https://explorer.testnet.assetmantle.one/transactions/${txHash}",
        url: "https://explorer.testnet.assetmantle.one",
      },
    ],
    network_type: "testnet",
    pretty_name: "AssetMantle Testnet",
    slip44: 118,
    status: "live",
  };

  const assetmantletestnet = {
    ...assetmantleChain,
    ...assetmantleTestnetProps,
  };

  // get the exact asset configuration of the default chain
  let assetmantleAssets = assets.find(
    (_asset) => _asset?.chain_name === "assetmantle"
  );

  // make changes pertaining to testnet
  let assetmantletestnetAssets = {
    ...assetmantleAssets,
    chain_name: defaultChainName,
  };

  // console.log("assetmantletestnetAssets: ", assetmantletestnetAssets);
  // console.log("assetmantletestnet: ", assetmantletestnet);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="AssetMantle is a community-first platform for NFT creators and collectors. Use AssetMantle to create your own NFT store or to expand your collection of NFTs."
        />
        <title>MantleWallet</title>
        {/* PWA primary color */}
        <meta name="theme-color" content="#111111" />
        {/* open graphs start */}
        <meta property="og:site_name" content="AssetMantle" />
        <meta property="og:url" content="https://assetmantle.one" />
        <meta property="al:web:url" content="https://assetmantle.one" />
        <meta property="og:image" content="/socialTagCard.png" />
        <meta property="og:title" content="AssetMantle" />
        <meta
          property="og:description"
          content="AssetMantle is a community-first platform for NFT creators and collectors. Use AssetMantle to create your own NFT store or to expand your collection of NFTs."
        />
        {/* open graphs end */}
      </Head>

      <ChakraProvider theme={defaultTheme}>
        <ChainProvider
          chains={[...chains, assetmantletestnet]}
          assetLists={[...assets, assetmantletestnetAssets]}
          wallets={[...keplrWallets, ...leapwallets, ...cosmostationWallets]}
          endpointOptions={{
            assetmantletestnet: {
              rpc: [defaultChainRPCProxy],
              rest: [defaultChainRESTProxy],
            },
          }}
          walletModal={ConnectModal} // Provide walletModal
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChainProvider>
      </ChakraProvider>
    </>
  );
}

export default CreateCosmosApp;
