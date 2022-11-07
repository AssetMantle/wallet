"use client";


import { WalletStatus } from "@cosmos-kit/core";
import React from "react";

export const ConnectWalletButton = ({
  buttonText,
  isLoading,
  isDisabled,
  icon,
  onClickConnectBtn,
}) => {
  return isLoading ? (
    <p>loading...</p>
  ) : (
    <button disabled={isDisabled} onClick={onClickConnectBtn}>
      {buttonText ? buttonText : "Connect Wallet"}
    </button>
  );
};

export const Disconnected = ({ buttonText, onClick }) => {
  return (
    <ConnectWalletButton buttonText={buttonText} onClickConnectBtn={onClick} />
  );
};

export const Connected = ({ buttonText, onClick }) => {
  return (
    <ConnectWalletButton buttonText={buttonText} onClickConnectBtn={onClick} />
  );
};

export const Connecting = () => {
  return <ConnectWalletButton isLoading={true} />;
};

export const Rejected = ({ buttonText, wordOfWarning, onClick }) => {
  return (
    <>
      <ConnectWalletButton
        buttonText={buttonText}
        isDisabled={false}
        onClickConnectBtn={onClick}
      />
      {wordOfWarning && <p>{wordOfWarning}</p>}
    </>
  );
};

export const Error = ({ buttonText, wordOfWarning, onClick }) => {
  return (
    <>
      <ConnectWalletButton
        buttonText={buttonText}
        isDisabled={false}
        onClickConnectBtn={onClick}
      />
      {wordOfWarning && <p>{wordOfWarning}</p>}
    </>
  );
};

export const NotExist = ({ buttonText, onClick }) => {
  return (
    <ConnectWalletButton
      buttonText={buttonText}
      isDisabled={false}
      onClickConnectBtn={onClick}
    />
  );
};

export const WalletConnectComponent = ({
  walletStatus,
  disconnect,
  connecting,
  connected,
  rejected,
  error,
  notExist,
}) => {
  switch (walletStatus) {
    case WalletStatus.Disconnected:
      return <>{disconnect}</>;
    case WalletStatus.Connecting:
      return <>{connecting}</>;
    case WalletStatus.Connected:
      return <>{connected}</>;
    case WalletStatus.Rejected:
      return <>{rejected}</>;
    case WalletStatus.Error:
      return <>{error}</>;
    case WalletStatus.NotExist:
      return <>{notExist}</>;
    default:
      return <>{disconnect}</>;
  }
};
