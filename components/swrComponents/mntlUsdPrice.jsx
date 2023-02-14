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

  const mntlUsdDisplay = errorMntlUsdValue
    ? placeholderMntlUsdValue
    : mntlUsdValue;

  return (
    <p className={status === "Connected" ? "caption" : "caption text-gray"}>
      {getBalanceStyle(mntlUsdDisplay, "caption", "caption2")}&nbsp;
      {"$USD"}
    </p>
  );
};
