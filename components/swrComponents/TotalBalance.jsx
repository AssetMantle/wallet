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
        "caption text-gray",
        "caption2 text-gray"
      );

  const denomDisplay = defaultChainSymbol;

  return (
    <>
      <p className={`caption m-0 ${isConnected ? "" : " text-gray"}`}>
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
        "caption2 text-gray",
        "small text-gray"
      );

  return (
    <p className={`caption2 m-0 ${isConnected ? "" : " text-gray"}`}>
      {totalBalanceInUSDDisplay}
      &nbsp;
      {usdSymbol}
    </p>
  );
};
