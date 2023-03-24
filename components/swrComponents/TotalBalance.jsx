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
  const isConnected = status == "Connected";
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
      {isConnected ? (
        <div className="caption">
          {isLoadingTotalBalance ? (
            <p className="placeholder-glow">
              <span className="placeholder col-6 bg-light w-100"></span>
            </p>
          ) : (
            <>
              {" "}
              {totalBalanceDisplay} {denomDisplay}
            </>
          )}{" "}
        </div>
      ) : (
        <div className="caption text-gray">
          {totalBalanceDisplay} {usdSymbol}
        </div>
      )}
    </>
  );
};

export const TotalBalanceInUSD = () => {
  const { totalBalance, isErrorTotalBalance, isLoadingTotalBalance } =
    useTotalBalance();

  const chainContext = useChain(defaultChainName);
  const { status } = chainContext;

  const { mntlUsdValue, errorMntlUsdValue } = useMntlUsd();

  const isConnected = status == "Connected";
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
    <>
      {" "}
      {isConnected ? (
        <div className="caption">
          {isLoadingTotalBalance ? (
            <p className="placeholder-glow">
              <span className="placeholder col-6 bg-light w-100"></span>
            </p>
          ) : (
            <>
              {" "}
              {totalBalanceInUSDDisplay} {usdSymbol}
            </>
          )}{" "}
        </div>
      ) : (
        <div className="caption text-gray">
          {totalBalanceInUSDDisplay} {usdSymbol}
        </div>
      )}
    </>
  );
};
