"use client";


import { WalletStatus } from "@cosmos-kit/core";
import React from "react";

export const ConnectedShowAddress = ({ address, isLoading }) => {
  const handleCopy = (e) => {
    e.preventDefault();
    return navigator.clipboard.writeText(address);
  };

  return (
    <>
      <p>{isLoading ? "loading..." : address}</p>
      <button onClick={handleCopy}>Copy</button>
    </>
  );
};

export const CopyAddressBtn = ({ walletStatus, connected }) => {
  switch (walletStatus) {
    case WalletStatus.Connected:
      return <>{connected}</>;
    default:
      return <></>;
  }
};
