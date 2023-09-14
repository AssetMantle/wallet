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
  useMntlUsd,
  useTotalBalance,
} from "../../data";

export const TotalBalance = () => {
  const { totalBalance, isErrorTotalBalance, isLoadingTotalBalance } =
    useTotalBalance();

  const chainContext = useChain(defaultChainName);
  const { status } = chainContext;
  const isConnected = !(
    isLoadingTotalBalance ||
    isErrorTotalBalance ||
    status != "Connected"
  );

  const totalBalanceDisplay = isConnected
    ? getBalanceStyle(fromChainDenom(totalBalance), "caption", "caption2")
    : getBalanceStyle(
        fromChainDenom(totalBalance),
        "caption color-am-gray-100",
        "caption2 color-am-gray-100"
      );

  const denomDisplay = defaultChainSymbol;

  return (
    <>
      <p className={`caption m-0 ${isConnected ? "" : "color-am-gray-100"}`}>
        {totalBalanceDisplay}
        &nbsp;
        {denomDisplay}
      </p>
    </>
  );
};

export const TotalBalanceInUSD = () => {
  const { totalBalance, isErrorTotalBalance, isLoadingTotalBalance } =
    useTotalBalance();

  const chainContext = useChain(defaultChainName);
  const { status } = chainContext;

  const { mntlUsdValue, errorMntlUsdValue } = useMntlUsd();

  const isConnected = !(
    isLoadingTotalBalance ||
    isErrorTotalBalance ||
    status != "Connected" ||
    errorMntlUsdValue
  );

  const totalBalanceInUSD = BigNumber(fromDenom(totalBalance))
    .multipliedBy(BigNumber(mntlUsdValue || 0))
    .toString();

  const totalBalanceInUSDDisplay = isConnected
    ? getBalanceStyle(decimalize(totalBalanceInUSD), "caption2", "small")
    : getBalanceStyle(
        decimalize(totalBalanceInUSD),
        "caption2 color-am-white-200",
        "small color-am-white-200"
      );

  return (
    <p className={`caption2 m-0 color-am-white-200 ${isConnected ? "" : ""}`}>
      {totalBalanceInUSDDisplay}
      &nbsp;
      {usdSymbol}
    </p>
  );
};
