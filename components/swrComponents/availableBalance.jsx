import { useChain } from "@cosmos-kit/react";
import BigNumber from "bignumber.js";
import React from "react";
import {
  defaultChainName,
  defaultChainSymbol,
  getBalanceStyle,
  usdSymbol,
} from "../../config";
import {
  decimalize,
  fromChainDenom,
  fromDenom,
  useAvailableBalance,
  useMntlUsd,
} from "../../data";

const denomDisplay = defaultChainSymbol;

export const AvailableBalance = () => {
  console.log("inside AvailableBalance");
  const walletManager = useChain(defaultChainName);
  const { status } = walletManager;
  const { availableBalance } = useAvailableBalance();

  const balanceDisplay =
    status === "Connected"
      ? getBalanceStyle(fromChainDenom(availableBalance), "caption", "caption2")
      : getBalanceStyle(
          fromChainDenom(availableBalance),
          "caption text-gray",
          "caption2 text-gray"
        );

  return (
    <>
      <p className={status === "Connected" ? "caption" : "caption text-gray"}>
        {balanceDisplay} {denomDisplay}
      </p>
    </>
  );
};

export const AvailableBalanceUsd = () => {
  const walletManager = useChain(defaultChainName);
  const { status } = walletManager;

  const { availableBalance, isLoadingAvailableBalance } = useAvailableBalance();
  const { mntlUsdValue } = useMntlUsd();

  const isConnected = status == "Connected" && !isLoadingAvailableBalance;

  const balanceInUSD = BigNumber(fromDenom(availableBalance))
    .multipliedBy(BigNumber(mntlUsdValue || 0))
    .toString();

  const balanceInUSDDisplay = isConnected
    ? getBalanceStyle(decimalize(balanceInUSD), "caption2", "small")
    : getBalanceStyle(
        decimalize(balanceInUSD),
        "caption2 text-gray",
        "small text-gray"
      );

  return (
    <p className={isConnected ? "caption2" : "caption2 text-gray"}>
      {balanceInUSDDisplay}
      &nbsp;{usdSymbol}
    </p>
  );
};
