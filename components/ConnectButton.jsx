import React from "react";
import { toast } from "react-toastify";
import { defaultChainName, toastConfig, useCompositeWallet } from "../config";
import { WALLET_DISCONNECT_ERROR_MSG } from "../data";
import { cleanString } from "../lib";
import {
  Connecting,
  Disconnected,
  Errored,
  NotExist,
  Rejected,
  WalletConnectComponent,
} from "./react";

export const ConnectButton = ({ children }) => {
  // get the composite wallet
  const { disconnectCompositeWallet: disconnect, compositeWallet } =
    useCompositeWallet(defaultChainName);

  const {
    status,
    message,
    openWalletModal: openView,
    walletName,
    walletPrettyName,
  } = compositeWallet;

  const handleOnClickDisconnected = (e) => {
    e.preventDefault();
    openView();
  };

  const onClickDisconnect = async (e) => {
    e?.preventDefault?.();
    try {
      await disconnect();
    } catch (error) {
      console.error(error);
      toast.error(WALLET_DISCONNECT_ERROR_MSG, toastConfig);
    }
  };

  console.log("compositeWallet: ", compositeWallet);

  return (
    <WalletConnectComponent
      wallet={cleanString(walletPrettyName)}
      walletName={walletName}
      walletStatus={status}
      walletMessage={message}
      disconnect={disconnect}
      disconnected={
        <Disconnected
          buttonText="Connect"
          buttonIcon="bi-wallet2"
          onClick={handleOnClickDisconnected}
        />
      }
      connecting={<Connecting onClick={onClickDisconnect} />}
      connected={children}
      rejected={
        <Rejected
          buttonText="Reconnect"
          buttonIcon="bi-patch-exclamation-fill"
          onClick={onClickDisconnect}
        />
      }
      errored={
        <Errored
          buttonText="Not Connected"
          buttonIcon="bi-patch-exclamation-fill"
          onClick={onClickDisconnect}
        />
      }
      notExist={
        <NotExist
          buttonText="Not Connected"
          buttonIcon="bi-patch-exclamation-fill"
          onClick={onClickDisconnect}
        />
      }
    />
  );
};
