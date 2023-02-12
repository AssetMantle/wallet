import { ChakraProvider } from "@chakra-ui/react";
import { wallets as leapwallets } from "@cosmos-kit/leap";
import { ChainProvider } from "@cosmos-kit/react";
import { Web3Modal } from "@web3modal/react";
import { assets, chains } from "chain-registry";
import Head from "next/head";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { WagmiConfig } from "wagmi";
import Layout from "../components/Layout";
import {
  cosmostationWallets,
  defaultChainRESTProxy,
  defaultChainRPCProxy,
  defaultTheme,
  keplrWallets,
  mantleAssetConfig,
  mantleChainConfig,
  mantleTestChainConfig,
  mantleTestnetAssetConfig,
} from "../config";
import "../config/styles/index.scss";
import { ethereumClient, wagmiClient, web3ModalProjectID } from "../data";
import { getSigningGravityClientOptions } from "../modules";
import ConnectModal from "../views/ConnectModal/ConnectModal";

function CreateCosmosApp({ Component, pageProps }) {
  // useEffect for bootstrap js hydration
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.js");
  }, []);

  const customChains = chains.filter(
    (chain) => chain.chain_name !== "assetmantle"
  );

  const customAssets = assets.filter(
    (assets) => assets.chain_name !== "assetmantle"
  );

  // get custom signing options for the stargate client
  // construct signer options
  const signerOptions = {
    signingStargate: (chain) => {
      // return corresponding stargate options or undefined
      switch (chain.chain_name) {
        case "gravitybridge":
          return getSigningGravityClientOptions();
      }
    },
  };

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
          chains={[
            ...customChains,
            ...mantleChainConfig,
            ...mantleTestChainConfig,
          ]}
          assetLists={[
            ...customAssets,
            ...mantleAssetConfig,
            ...mantleTestnetAssetConfig,
          ]}
          wallets={[...keplrWallets, ...leapwallets, ...cosmostationWallets]}
          signerOptions={signerOptions}
          endpointOptions={{
            assetmantle: {
              rpc: [defaultChainRPCProxy],
              rest: [defaultChainRESTProxy],
            },
          }}
          walletModal={ConnectModal} // Provide walletModal
        >
          <WagmiConfig client={wagmiClient}>
            <Layout>
              <Component {...pageProps} />
              <Web3Modal
                projectId={web3ModalProjectID}
                themeColor="orange"
                themeBackground="themeColor"
                themeZIndex="99999"
                ethereumClient={ethereumClient}
              />
              <ToastContainer
                position="bottom-center"
                autoClose={500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
              />
              <ToastContainer />{" "}
            </Layout>
          </WagmiConfig>
        </ChainProvider>
      </ChakraProvider>
    </>
  );
}

export default CreateCosmosApp;
