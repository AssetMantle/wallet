import BigNumber from "bignumber.js";
import React from "react";
import {
  defaultChainName,
  defaultChainSymbol,
  getBalanceStyle,
  usdSymbol,
  useCompositeWallet,
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
  const { compositeWallet } = useCompositeWallet(defaultChainName);
  const { status } = compositeWallet;

  const { availableBalance } = useAvailableBalance();

  const balanceDisplay =
    status === "Connected"
      ? getBalanceStyle(fromChainDenom(availableBalance), "caption", "caption2")
      : getBalanceStyle(
          fromChainDenom(availableBalance),
          "caption color-am-gray-100",
          "caption2 color-am-gray-100"
        );

  return (
    <>
      <p
        className={`caption m-0 ${
          status === "Connected" ? "" : "color-am-gray-100"
        }`}
      >
        {balanceDisplay} {denomDisplay}
      </p>
    </>
  );
};

export const AvailableBalanceUsd = () => {
  const { compositeWallet } = useCompositeWallet(defaultChainName);
  const { status } = compositeWallet;

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
        "caption2 color-am-white-200",
        "small color-am-white-200"
      );

  return (
    <p className={`caption2 m-0 color-am-white-200 ${isConnected ? "" : ""}`}>
      {balanceInUSDDisplay}
      &nbsp;{usdSymbol}
    </p>
  );
};
