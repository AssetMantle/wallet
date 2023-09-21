import useSwr from "swr";
import { fastRefreshInterval } from "./defaults";
import { useChain, useManager } from "@cosmos-kit/react";
import { useEffect } from "react";
import { WalletStatus } from "@cosmos-kit/core";

export const connectLedger = () => {
  console.log("inside connectLedger");
};

export const connectKeystore = () => {
  console.log("inside connectKeystore");
};

export const openGenerateOnlyModal = () => {
  console.log("inside openGenerateOnlyModal");
};

export const useCompositeWallet = (chainName) => {
  console.log("inside useCompositeWallet");

  // get the cosmos kit wallet hook
  const {
    address: cosmosKitAddress,
    chain: cosmosKitChain,
    wallet: cosmosKitWallet,
    status: cosmosKitStatus,
    message: cosmosKitMessage,
    username: cosmosKitUsername,
    getOfflineSignerDirect: cosmosKitGetOfflineSignerDirect,
    openView: cosmosKitOpenView,
    closeView: cosmosKitCloseView,
    isWalletConnected: cosmosKitIsWalletConnected,
    disconnect,
  } = useChain(chainName);

  // create the wallet name and type context hooks
  const { data: walletName, mutate: mutateWalletName } = useSwr("walletName");
  const { data: walletType, mutate: mutateWalletType } = useSwr("walletType");

  // get walletRepo for connect function of cosmos kit
  const { getWalletRepo } = useManager();
  const walletRepo = getWalletRepo(chainName);

  // useEffect to populate context hooks on load
  useEffect(() => {
    console.log(
      "inside useEffect, cosmosKitIsWalletConnected: ",
      cosmosKitIsWalletConnected
    );
    if (cosmosKitIsWalletConnected) {
      mutateWalletName(cosmosKitWallet?.name);
      mutateWalletType("cosmosKit");
    }
  }, [cosmosKitIsWalletConnected]);

  const disconnectCompositeWallet = async () => {
    let walletNameArg = walletName;
    let walletTypeArg = walletType;

    console.log(
      "inside disconnectCompositeWallet, walletName: ",
      walletNameArg,
      " walletType: ",
      walletTypeArg,
      " disconnect?.(): ",
      disconnect
    );

    switch (walletTypeArg) {
      case "cosmosKit":
        console.log("inside cosmosKit switch case");
        // connect to the cosmos kit wallet
        disconnect?.();
        // update the rest of the wallet properties
        mutateWalletType(null);
        mutateWalletName(null);
        break;

      case "ledger":
        // update the rest of the wallet properties
        mutateWalletType(null);
        mutateWalletName(null);
        break;

      case "keystore":
        // update the rest of the wallet properties
        mutateWalletType(null);
        mutateWalletName(null);
        break;

      case "generateonly":
        // update the rest of the wallet properties
        mutateWalletType(null);
        mutateWalletName(null);
        break;

      default:
        console.info("CompositeWallet already disconnected");
        break;
    }
  };

  // implement the composite connect function
  const connectCompositeWallet = async (walletTypeArg, walletNameArg) => {
    console.log(
      "inside connectCompositeWallet, walletTypeArg: ",
      walletTypeArg,
      " walletNameArg: ",
      walletNameArg
    );

    try {
      await disconnectCompositeWallet();
      switch (walletTypeArg) {
        case "cosmosKit":
          console.log("inside cosmosKit switch case");
          // connect to the cosmos kit wallet
          walletRepo?.connect(walletNameArg);
          // update the rest of the wallet properties
          mutateWalletType(walletTypeArg);
          mutateWalletName(walletNameArg);
          break;

        case "ledger":
          // update the rest of the wallet properties
          mutateWalletType(walletTypeArg);
          mutateWalletName(walletNameArg);
          break;

        case "keystore":
          // update the rest of the wallet properties
          mutateWalletType(walletTypeArg);
          mutateWalletName(walletNameArg);
          break;

        case "generateonly":
          // update the rest of the wallet properties
          mutateWalletType(walletTypeArg);
          mutateWalletName(walletNameArg);
          break;

        default:
          mutateWalletType(null);
          mutateWalletName(null);
          break;
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const fallbackCompositeWalletObject = {
    walletType,
    walletName,
    walletPrettyName: "",
    status: WalletStatus.Disconnected,
    message: "",
    address: null,
    chainId: null,
    chainName: null,
    username: null,
    signer: null,
    openWalletModal: cosmosKitOpenView,
    closeWalletModal: cosmosKitCloseView,
    connect: connectCompositeWallet,
    disconnect: disconnectCompositeWallet,
  };

  const fetchCompositeWallet = async ([
    url,
    chainNameArg,
    walletTypeArg,
    walletNameArg,
  ]) => {
    console.log(
      "inside fetchCompositeWallet, type: ",
      walletType,
      " name: ",
      walletName
    );

    let compositeWalletObject = {
      ...fallbackCompositeWalletObject,
      walletType: walletTypeArg,
      walletName: walletNameArg,
    };

    try {
      switch (walletTypeArg) {
        case "cosmosKit":
          // collect the wallet parameters from cosmos kit
          compositeWalletObject.walletPrettyName = cosmosKitWallet?.prettyName;
          compositeWalletObject.status = cosmosKitStatus;
          compositeWalletObject.message = cosmosKitMessage;
          compositeWalletObject.address = cosmosKitAddress;
          compositeWalletObject.chainId = cosmosKitChain?.chain_id;
          compositeWalletObject.chainName = chainNameArg;
          compositeWalletObject.username = cosmosKitUsername;
          compositeWalletObject.signer =
            await cosmosKitGetOfflineSignerDirect?.();

          break;

        case "ledger":
          console.log("inside ledger switch case");
          // collect the wallet parameters from cosmos kit
          compositeWalletObject.walletPrettyName = cosmosKitWallet?.prettyName;
          compositeWalletObject.status = cosmosKitStatus;
          compositeWalletObject.message = cosmosKitMessage;
          compositeWalletObject.address = cosmosKitAddress;
          compositeWalletObject.chainId = cosmosKitChain?.chain_id;
          compositeWalletObject.chainName = chainNameArg;
          compositeWalletObject.username = cosmosKitUsername;
          compositeWalletObject.signer =
            await cosmosKitGetOfflineSignerDirect();

          break;

        case "keystore":
          console.log("inside keystore switch case");
          // collect the wallet parameters from cosmos kit
          compositeWalletObject.walletPrettyName = cosmosKitWallet?.prettyName;
          compositeWalletObject.status = cosmosKitStatus;
          compositeWalletObject.message = cosmosKitMessage;
          compositeWalletObject.address = cosmosKitAddress;
          compositeWalletObject.chainId = cosmosKitChain?.chain_id;
          compositeWalletObject.chainName = chainNameArg;
          compositeWalletObject.username = cosmosKitUsername;
          compositeWalletObject.signer =
            await cosmosKitGetOfflineSignerDirect();

          break;

        case "generateonly":
          console.log("inside cosmosKit switch case");
          // collect the wallet parameters from cosmos kit
          compositeWalletObject.walletPrettyName = cosmosKitWallet?.prettyName;
          compositeWalletObject.status = cosmosKitStatus;
          compositeWalletObject.message = cosmosKitMessage;
          compositeWalletObject.address = cosmosKitAddress;
          compositeWalletObject.chainId = cosmosKitChain?.chain_id;
          compositeWalletObject.chainName = chainNameArg;
          compositeWalletObject.username = cosmosKitUsername;
          compositeWalletObject.signer =
            await cosmosKitGetOfflineSignerDirect();

          break;

        default:
          true;
      }
    } catch (error) {
      console.error(`swr fetcher : url: ${url},  error: ${error}`);
      throw error;
    }

    return compositeWalletObject;
  };

  // implement useSwr for cached and revalidation enabled wallet data
  const { data: compositeWalletObject, error } = useSwr(
    !!chainName && !!walletType
      ? [`compositeWallet`, chainName, walletType, walletName]
      : null,
    fetchCompositeWallet,
    {
      fallbackData: fallbackCompositeWalletObject,
      refreshInterval: fastRefreshInterval,
    }
  );

  console.log("chainName && walletType : ", !!chainName && !!walletType);

  return {
    compositeWallet: compositeWalletObject,
    connectCompositeWallet: connectCompositeWallet,
    disconnectCompositeWallet: disconnectCompositeWallet,
  };
};

/* Note: 
since changing the rpc url from dropdown will change the configuration of all the
connected chains in the app (AssetMantle, Gravity, maybe Ethereum), hence at least 
chain_id needs to be input for each chain */
