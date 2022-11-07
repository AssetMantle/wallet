"use client";

import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as keplrWallet } from "@cosmos-kit/keplr";
import { wallets as leapwallets } from "@cosmos-kit/leap";
import { WalletProvider } from "@cosmos-kit/react";
import { assets, chains } from "chain-registry";

export function WalletProviderClient({ children }) {
  const signerOptions = {
    // stargate: (_chain: Chain) => {
    //   return getSigningCosmosClientOptions();
    // }
  };

  const sessionOptions = {
    killOnTabClose: false,
  };

  // currently set to defaults
  const storageOptions = {
    disabled: false,
    duration: 1800000, // half an hour
    clearOnTabClose: false,
  };

  // currently set to defaults
  const viewOptions = {
    alwaysOpenView: false,
    closeViewWhenWalletIsConnected: false,
    closeViewWhenWalletIsDisconnected: true,
    closeViewWhenWalletIsRejected: false,
  };

  return (
    <WalletProvider
      chains={chains}
      assetLists={assets}
      wallets={[...keplrWallet, ...leapwallets, ...cosmostationWallets]}
      signerOptions={signerOptions}
      sessionOptions={sessionOptions}
      storageOptions={storageOptions}
      viewOptions={viewOptions}
    >
      {children}
    </WalletProvider>
  );
}
