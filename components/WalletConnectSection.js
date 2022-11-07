"use client";

import { useWallet } from "@cosmos-kit/react";
import { useEffect } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import {
  Connected,
  ConnectedShowAddress,
  ConnectedUserInfo,
  Connecting,
  ConnectStatusWarn,
  CopyAddressBtn,
  Disconnected,
  Error,
  NotExist,
  Rejected,
  RejectedWarn,
  WalletConnectComponent,
} from "../components";
import { chainName } from "../config";

export const WalletConnectSection = () => {
  const walletManager = useWallet();
  const {
    connect,
    openView,
    walletStatus,
    username,
    address,
    message,
    currentChainName,
    currentWallet,
    currentChainRecord,
    getChainLogo,
    setCurrentChain,
  } = walletManager;

  useEffect(() => {
    setCurrentChain(chainName);
  }, [setCurrentChain]);

  const chain = {
    chainName: currentChainName,
    label: currentChainRecord?.chain.pretty_name,
    value: currentChainName,
    icon: getChainLogo(currentChainName),
  };

  // Events
  const onClickConnect = async (e) => {
    e.preventDefault();
    await connect();
  };

  const onClickOpenView = (e) => {
    e.preventDefault();
    openView();
  };

  // Components
  const connectWalletButton = (
    <WalletConnectComponent
      walletStatus={walletStatus}
      disconnect={
        <Disconnected buttonText="Connect Wallet" onClick={onClickConnect} />
      }
      connecting={<Connecting />}
      connected={
        <Connected buttonText={"My Wallet"} onClick={onClickOpenView} />
      }
      rejected={<Rejected buttonText="Reconnect" onClick={onClickConnect} />}
      error={<Error buttonText="Change Wallet" onClick={onClickOpenView} />}
      notExist={
        <NotExist buttonText="Install Wallet" onClick={onClickOpenView} />
      }
    />
  );

  const connectWalletWarn = (
    <ConnectStatusWarn
      walletStatus={walletStatus}
      rejected={
        <RejectedWarn
          wordOfWarning={`${currentWallet?.walletInfo.prettyName}: ${message}`}
        />
      }
      error={
        <RejectedWarn
          wordOfWarning={`${currentWallet?.walletInfo.prettyName}: ${message}`}
        />
      }
    />
  );

  const userInfo = (
    <ConnectedUserInfo username={username} icon={<FiAlertTriangle />} />
  );
  const addressBtn = currentChainName && (
    <CopyAddressBtn
      walletStatus={walletStatus}
      connected={<ConnectedShowAddress address={address} isLoading={false} />}
    />
  );

  return (
    <div>
      <p>{`chain name: ${currentChainName}`}</p>
      <div>{userInfo}</div>
      <div>{addressBtn}</div>
      <div>{connectWalletButton}</div>
      <p>{connectWalletWarn}</p>
    </div>
  );
};
