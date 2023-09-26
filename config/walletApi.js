import { LedgerSigner } from "@cosmjs/ledger-amino";
import { WalletStatus } from "@cosmos-kit/core";
import { useChain, useManager } from "@cosmos-kit/react";
import { useEffect } from "react";
import useSwr from "swr";
import { fastRefreshInterval } from "./defaults";
import { connectLedger } from "./ledgerApi";
import { getChainIdFromChainName, getPrefixFromChainName } from "../lib";
import { stringToPath } from "@cosmjs/crypto";

/* WalletStatus = {
  Connected: "Connected",
  Connecting: "Connecting",
  Disconnected: "Disconnected",
  Error: "Error",
  NotExist: "NotExist",
  Rejected: "Rejected",
}; */

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
    disconnect: cosmosKitDisconnect,
  } = useChain(chainName);

  // create the wallet name and type context hooks
  const { data: walletName, mutate: mutateWalletName } = useSwr("walletName");
  const { data: walletType, mutate: mutateWalletType } = useSwr("walletType");
  const { data: initialCompositeWallet, mutate: mutateInitialCompositeWallet } =
    useSwr("initialCompositeWallet");
  const { data: stateLedgerTransport, mutate: mutateStateLedgerTransport } =
    useSwr("stateLedgerTransport");

  const makeHdPath = (
    accountNumber = "0",
    addressIndex = "0",
    coinType = "118"
  ) => {
    return stringToPath(
      "m/44'/" + coinType + "'/" + accountNumber + "'/0/" + addressIndex
    );
  };

  const zeroCompositeWallet = {
    walletType: null,
    walletName: null,
    walletPrettyName: null,
    status: WalletStatus.Disconnected,
    message: null,
    address: null,
    chainId: null,
    chainName: null,
    username: null,
    signer: null,
  };

  let ledgerTransport;

  const populateCompositeWalletWithLedger = async (
    ledgerTransport,
    chainNameArg
  ) => {
    const ledgerChainId = getChainIdFromChainName(chainNameArg);

    try {
      // get signer object
      let ledgerSigner = new LedgerSigner(ledgerTransport, {
        testModeAllowed: true,
        hdPaths: [makeHdPath("0", "0")],
        prefix: getPrefixFromChainName(chainNameArg),
      });
      const [firstAccount] = await ledgerSigner.getAccounts();
      const ledgerAddress = firstAccount?.address;
      const ledgerMessage = "Ledger Connected";
      // set the connected state parameters
      mutateInitialCompositeWallet({
        ...initialCompositeWallet,
        status: WalletStatus?.Connected,
        message: ledgerMessage,
        address: ledgerAddress,
        chainId: ledgerChainId,
        chainName: chainNameArg,
        username: "Ledger",
        signer: ledgerSigner,
      });
    } catch (error) {
      console.error(
        "Error during PopulateCompositeWalletWithLedger: ",
        error?.message
      );
      mutateInitialCompositeWallet({
        ...initialCompositeWallet,
        message: error?.message,
        chainId: ledgerChainId,
        chainName: chainNameArg,
      });
      throw error;
    }
  };

  const disconnectCompositeWallet = async () => {
    let walletNameArg = walletName;
    let walletTypeArg = walletType;

    console.log(
      "inside disconnectCompositeWallet, walletName: ",
      walletNameArg,
      " walletType: ",
      walletTypeArg,
      " cosmosKitDisconnect?.(): ",
      cosmosKitDisconnect
    );

    switch (walletTypeArg) {
      case "cosmosKit":
        console.log("inside cosmosKit switch case");
        // connect to the cosmos kit wallet
        cosmosKitDisconnect?.();
        // update the rest of the wallet properties
        mutateWalletType(null);
        mutateWalletName(null);
        break;

      case "ledger":
        // update the rest of the wallet properties
        mutateInitialCompositeWallet({
          ...initialCompositeWallet,
          status: WalletStatus?.Disconnected,
        });
        mutateWalletType(null);
        mutateWalletName(null);
        mutateStateLedgerTransport(null);
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

    await disconnectCompositeWallet();
    switch (walletTypeArg) {
      case "cosmosKit":
        // update the rest of the wallet properties
        mutateWalletType(walletTypeArg);
        mutateWalletName(walletNameArg);
        // connect to the cosmos kit wallet
        walletRepo?.connect(walletNameArg);
        break;

      case "ledger":
        // update the rest of the wallet properties
        mutateWalletType(walletTypeArg);
        mutateWalletName(walletNameArg);
        try {
          // set the connecting state
          mutateInitialCompositeWallet({
            ...initialCompositeWallet,
            status: WalletStatus?.Connecting,
          });

          // connect to ledger transport
          ledgerTransport = await connectLedger();

          console.log("ledgerTransport: ", ledgerTransport);
          mutateStateLedgerTransport(ledgerTransport);
          await populateCompositeWalletWithLedger(
            ledgerTransport,
            walletNameArg
          );
        } catch (error) {
          console.error(
            "Error during connectCompositeWallet of ledger: ",
            error
          );
          if (
            error?.message
              ?.toString?.()
              ?.includes?.("TransportOpenUserCancelled")
          ) {
            mutateInitialCompositeWallet({
              ...initialCompositeWallet,
              status: WalletStatus?.Rejected,
              message: error?.message,
            });
          } else {
            mutateInitialCompositeWallet({
              ...initialCompositeWallet,
              status: WalletStatus?.Error,
              message: error?.message,
            });
          }
        }

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
  };

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
    } else {
      mutateInitialCompositeWallet({
        ...initialCompositeWallet,
        walletType,
        walletName,
        status: WalletStatus.Disconnected,
        openWalletModal: cosmosKitOpenView,
        closeWalletModal: cosmosKitCloseView,
        connect: connectCompositeWallet,
        disconnect: disconnectCompositeWallet,
      });
    }
  }, [cosmosKitIsWalletConnected]);

  const fetchCompositeWallet = async ([
    url,
    chainNameArg,
    walletTypeArg,
    walletNameArg,
  ]) => {
    console.log(
      "inside fetchCompositeWallet, type: ",
      walletType,
      " walletName: ",
      walletName,
      " chainNameArg: ",
      chainNameArg,
      " url: ",
      url
    );

    let compositeWalletObject = {
      ...initialCompositeWallet,
      walletType: walletTypeArg,
      walletName: walletNameArg,
      chainName: chainNameArg,
    };

    switch (walletTypeArg) {
      case "cosmosKit":
        try {
          // collect the wallet parameters from cosmos kit
          compositeWalletObject.walletPrettyName = cosmosKitWallet?.prettyName;
          compositeWalletObject.status = cosmosKitStatus;
          compositeWalletObject.message = cosmosKitMessage;
          compositeWalletObject.address = cosmosKitAddress;
          compositeWalletObject.chainId = cosmosKitChain?.chain_id;
          compositeWalletObject.chainName = chainNameArg;
          compositeWalletObject.username = cosmosKitUsername;
          if (cosmosKitStatus === WalletStatus?.Connected) {
            compositeWalletObject.signer =
              await cosmosKitGetOfflineSignerDirect?.();
          }
        } catch (error) {
          console.error(`swr fetcher : url: ${url},  error: ${error}`);
          throw error;
        }

        break;

      case "ledger":
        console.log("inside ledger switch case");
        try {
          // collect the wallet parameters from cosmos kit
          if (
            stateLedgerTransport &&
            compositeWalletObject?.status == WalletStatus.Connected
          ) {
            await populateCompositeWalletWithLedger(
              stateLedgerTransport,
              walletNameArg
            );
          }
        } catch (error) {
          console.error(`swr fetcher : url: ${url},  error: ${error}`);
          throw error;
        }

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
        compositeWalletObject.signer = await cosmosKitGetOfflineSignerDirect();

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
        compositeWalletObject.signer = await cosmosKitGetOfflineSignerDirect();

        break;

      default:
        true;
    }

    return compositeWalletObject;
  };

  // implement useSwr for cached and revalidation enabled wallet data
  const { data: compositeWalletObject } = useSwr(
    !!chainName && !!walletType
      ? [`compositeWallet`, chainName, walletType, walletName]
      : null,
    fetchCompositeWallet,
    {
      fallbackData: initialCompositeWallet,
      refreshInterval: fastRefreshInterval,
    }
  );

  // console.log(" cosmosKitChain: ", cosmosKitChain);

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
