import { ChakraProvider } from "@chakra-ui/react";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as leapwallets } from "@cosmos-kit/leap";
import { WalletProvider } from "@cosmos-kit/react";
import { useEffect } from "react";
import { defaultTheme, wallets as keplrWallets } from "../config";

import "../config/styles/index.scss";

import { assets, chains } from "chain-registry";
import Layout from "../components/Layout";

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
  );
}

export default CreateCosmosApp;
