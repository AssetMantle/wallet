import { useChain } from "@cosmos-kit/react";
import React from "react";
import {
  defaultChainName,
  defaultChainSymbol,
  placeholderAvailableBalance,
  placeholderMntlUsdValue,
} from "../../config";
import { fromChainDenom, useAvailableBalance, useMntlUsd } from "../../data";

const denomDisplay = defaultChainSymbol;

export const AvailableBalance = () => {
  console.log("inside AvailableBalance");
  const walletManager = useChain(defaultChainName);
  const { getSigningStargateClient, address, status } = walletManager;

  const { availableBalance, errorAvailableBalance, isLoadingAvailableBalance } =
    useAvailableBalance();
  const balanceDisplay =
    errorAvailableBalance || isNaN(fromChainDenom(availableBalance))
      ? placeholderAvailableBalance
      : fromChainDenom(availableBalance);

  return (
    <>
      {isLoadingAvailableBalance ? (
        <p>Loading...</p>
      ) : (
        <p className={status === "Connected" ? "caption" : "caption text-gray"}>
          {balanceDisplay}&nbsp;{denomDisplay}
        </p>
      )}
    </>
  );
};

export const AvailableBalanceUsd = () => {
  console.log("inside AvailableBalanceUsd");
  const walletManager = useChain(defaultChainName);
  const { getSigningStargateClient, address, status } = walletManager;

  const { availableBalance, errorAvailableBalance } = useAvailableBalance();

  const { mntlUsdValue, errorMntlUsdValue } = useMntlUsd();

  const balanceInUSDDisplay =
    errorMntlUsdValue ||
    errorAvailableBalance ||
    isNaN(fromChainDenom(availableBalance)) ||
    isNaN(parseFloat(mntlUsdValue))
      ? placeholderMntlUsdValue
      : (fromChainDenom(availableBalance) * parseFloat(mntlUsdValue))
          .toFixed(6)
          .toString();

  return <p className="caption2 text-gray">${balanceInUSDDisplay}&nbsp;$USD</p>;
};
