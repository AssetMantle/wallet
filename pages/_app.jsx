import { ChakraProvider } from "@chakra-ui/react";
import { wallets } from "@cosmos-kit/keplr";
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
        wallets={wallets}
        signerOptions={signerOptions}
      >
        <Component {...pageProps} />
      </WalletProvider>
    </ChakraProvider>
  );
}

export default CreateCosmosApp;
