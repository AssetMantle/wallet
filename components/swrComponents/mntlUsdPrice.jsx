import React from "react";
import {
  placeholderMntlUsdValue,
  defaultChainName,
  getBalanceStyle,
} from "../../config";
import { useMntlUsd } from "../../data";
import { useChain } from "@cosmos-kit/react";

export const MntlUsdPrice = () => {
  console.log("inside MntlUsdPrice");
  const walletManager = useChain(defaultChainName);
  const { getSigningStargateClient, address, status } = walletManager;
  const { mntlUsdValue, errorMntlUsdValue } = useMntlUsd();
  const isConnected = status == "Connected";

  const mntlUsdDisplay = errorMntlUsdValue
    ? placeholderMntlUsdValue
    : mntlUsdValue;

  return (
    <p className={isConnected ? "caption" : "caption text-gray"}>
      {isConnected
        ? getBalanceStyle(mntlUsdDisplay, "caption", "caption2")
        : getBalanceStyle(
            mntlUsdDisplay,
            "caption text-gray",
            "caption2 text-gray"
          )}
      &nbsp;
      {"$USD"}
    </p>
  );
};
