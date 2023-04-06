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
  const { availableBalance, isLoadingAvailableBalance } = useAvailableBalance();

  const isConnected = status == "Connected";

  const balanceDisplay = isConnected
    ? getBalanceStyle(fromChainDenom(availableBalance), "caption", "caption2")
    : getBalanceStyle(
        fromChainDenom(availableBalance),
        "caption text-gray",
        "caption2 text-gray"
      );

  return (
    <>
      {isConnected ? (
        <div className="caption">
          {isLoadingAvailableBalance ? (
            <p className="placeholder-glow">
              <span className="placeholder col-6 bg-light w-100"></span>
            </p>
          ) : (
            <>
              {balanceDisplay} {denomDisplay}
            </>
          )}{" "}
        </div>
      ) : (
        <div className="caption text-gray">
          {balanceDisplay} {denomDisplay}
        </div>
      )}
    </>
  );
};

export const AvailableBalanceUsd = () => {
  const walletManager = useChain(defaultChainName);
  const { status } = walletManager;

  const { availableBalance, isLoadingAvailableBalance } = useAvailableBalance();
  const { mntlUsdValue } = useMntlUsd();

  const isConnected = status == "Connected";

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
    <>
      {" "}
      {isConnected ? (
        <div className="caption">
          {isLoadingAvailableBalance ? (
            <p className="placeholder-glow">
              <span className="placeholder col-6 bg-light w-100"></span>
            </p>
          ) : (
            <>
              {" "}
              {balanceInUSDDisplay} {usdSymbol}
            </>
          )}{" "}
        </div>
      ) : (
        <div className="caption text-gray">
          {balanceInUSDDisplay} {usdSymbol}
        </div>
      )}
    </>
  );
};
