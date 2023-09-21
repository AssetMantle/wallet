import { useChain } from "@cosmos-kit/react";
import React from "react";
import { toast } from "react-toastify";
import { defaultChainName, toastConfig } from "../config";
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
  const { wallet, status, disconnect, message, openView } =
    useChain(defaultChainName);

  const handleOnClickDisconnected = (e) => {
    e.preventDefault();
    openView();
  };

  const onClickDisconnect = async (e) => {
    e?.preventDefault?.();
    try {
      await disconnect(wallet?.name);
    } catch (error) {
      console.error(error);
      toast.error(WALLET_DISCONNECT_ERROR_MSG, toastConfig);
    }
  };

  console.log("message: ", message, " wallet: ", wallet);

  return (
    <WalletConnectComponent
      wallet={cleanString(wallet?.prettyName)}
      walletName={wallet?.name}
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
