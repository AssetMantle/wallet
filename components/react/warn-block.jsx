"use client";


import { WalletStatus } from "@cosmos-kit/core";
import React from "react";

export const WarnBlock = ({ wordOfWarning, icon }) => {
  return (
    <>
      <div>{icon}</div>
      <p> </p>
      <div>
        <p>{wordOfWarning}</p>
      </div>
    </>
  );
};

export const RejectedWarn = ({ wordOfWarning, icon }) => {
  return <WarnBlock wordOfWarning={wordOfWarning} icon={icon} />;
};

export const ConnectStatusWarn = ({ walletStatus, rejected, error }) => {
  switch (walletStatus) {
    case WalletStatus.Rejected:
      return <>{rejected}</>;
    case WalletStatus.Error:
      return <>{error}</>;
    default:
      return <></>;
  }
};
