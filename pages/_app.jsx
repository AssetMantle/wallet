import { ChakraProvider } from "@chakra-ui/react";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as leapwallets } from "@cosmos-kit/leap";
import { WalletProvider } from "@cosmos-kit/react";
import { useEffect } from "react";
import { defaultTheme, wallets as keplrWallets } from "../config";

import "../config/styles/index.scss";

import { assets, chains } from "chain-registry";
import Layout from "../components/Layout";
import Head from "next/head";

function CreateCosmosApp({ Component, pageProps }) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.js");
  }, []);
  const signerOptions = {
    // stargate: (_chain: Chain) => {
    //   return getSigningCosmosClientOptions();
    // }
  };

  // console.log("keplr info: ", keplrExtensionInfo);

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
        <WalletProvider
          chains={chains}
          assetLists={assets}
          wallets={[...keplrWallets, ...leapwallets, ...cosmostationWallets]}
          signerOptions={signerOptions}
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </WalletProvider>
      </ChakraProvider>
    </>
  );
}

export default CreateCosmosApp;
