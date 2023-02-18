import { useChain } from "@cosmos-kit/react";
import BigNumber from "bignumber.js";
import React from "react";
import {
  defaultChainDenomExponent,
  defaultChainName,
  getBalanceStyle,
  usdSymbol,
} from "../../config";
import {
  fromChainDenom,
  fromDenom,
  useMntlUsd,
  useTotalBalance,
} from "../../data";

export const TotalBalance = () => {
  const {
    denomTotalBalance,
    totalBalance,
    isErrorTotalBalance,
    isLoadingTotalBalance,
  } = useTotalBalance();

  const chainContext = useChain(defaultChainName);
  const { status } = chainContext;

  const totalBalanceDisplay = fromChainDenom(totalBalance);

  const isConnected = !(
    isLoadingTotalBalance ||
    isErrorTotalBalance ||
    status != "Connected"
  );

  return (
    <>
      <p className={isConnected ? "caption" : "caption text-gray"}>
        {isConnected
          ? getBalanceStyle(totalBalanceDisplay, "caption", "caption2")
          : getBalanceStyle(
              totalBalanceDisplay,
              "caption text-gray",
              "caption2 text-gray"
            )}
        &nbsp;
        {denomTotalBalance}
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

  const totalBalanceDisplay = fromDenom(totalBalance);

  const totalBalanceInUSDDisplay = BigNumber(totalBalanceDisplay)
    .multipliedBy(BigNumber(mntlUsdValue))
    .toFixed(defaultChainDenomExponent)
    .toString();

  return (
    <p className="caption2 text-gray">
      $
      {getBalanceStyle(
        totalBalanceInUSDDisplay,
        "caption2 text-gray",
        "small text-gray"
      )}
      &nbsp;
      {usdSymbol}
    </p>
  );
};
