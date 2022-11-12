import { ChakraProvider } from "@chakra-ui/react";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as keplrWallet } from "@cosmos-kit/keplr";
import { wallets as leapwallets } from "@cosmos-kit/leap";
import { WalletProvider } from "@cosmos-kit/react";
import { defaultTheme } from "../config";
import "../styles/globals.css";

import { assets, chains } from "chain-registry";

function CreateCosmosApp({ Component, pageProps }) {
  const signerOptions = {
    // stargate: (_chain: Chain) => {
    //   return getSigningCosmosClientOptions();
    // }
  };

  return (
    <ChakraProvider theme={defaultTheme}>
      <WalletProvider
        chains={chains}
        assetLists={assets}
        wallets={[...keplrWallet, ...leapwallets, ...cosmostationWallets]}
        signerOptions={signerOptions}
      >
        <Component {...pageProps} />
      </WalletProvider>
    </ChakraProvider>
  );
}

export default CreateCosmosApp;
