import { ChakraProvider } from "@chakra-ui/react";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as leapwallets } from "@cosmos-kit/leap";
import { wallets as keplrWallets2 } from "@cosmos-kit/keplr";
import { WalletProvider } from "@cosmos-kit/react";
import { defaultTheme, wallets as keplrWallets } from "../config";
import "../styles/globals.css";

import { assets, chains } from "chain-registry";

function CreateCosmosApp({ Component, pageProps }) {
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
        wallets={[...keplrWallets2, ...leapwallets, ...cosmostationWallets]}
        signerOptions={signerOptions}
      >
        <Component {...pageProps} />
      </WalletProvider>
    </ChakraProvider>
  );
}

export default CreateCosmosApp;
