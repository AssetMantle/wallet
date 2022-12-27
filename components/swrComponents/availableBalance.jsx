import React from "react";
import {
  defaultChainSymbol,
  placeholderAvailableBalance,
  placeholderMntlUsdValue,
} from "../../config";
import { fromDenom, useAvailableBalance, useMntlUsd } from "../../data";

const denomDisplay = defaultChainSymbol;

export const AvailableBalance = () => {
  console.log("inside AvailableBalance");

  const { availableBalance, errorAvailableBalance } = useAvailableBalance();

  const balanceDisplay =
    errorAvailableBalance || isNaN(fromDenom(availableBalance))
      ? placeholderAvailableBalance
      : fromDenom(availableBalance);

  return (
    <p className="caption">
      {balanceDisplay}&nbsp;{denomDisplay}
    </p>
  );
};

export const AvailableBalanceUsd = () => {
  console.log("inside AvailableBalanceUsd");

  const { availableBalance, errorAvailableBalance } = useAvailableBalance();

  const { mntlUsdValue, errorMntlUsdValue } = useMntlUsd();

  const balanceInUSDDisplay =
    errorMntlUsdValue ||
    errorAvailableBalance ||
    isNaN(fromDenom(availableBalance)) ||
    isNaN(parseFloat(mntlUsdValue))
      ? placeholderMntlUsdValue
      : (fromDenom(availableBalance) * parseFloat(mntlUsdValue))
          .toFixed(6)
          .toString();

  return <p className="caption2 text-gray">${balanceInUSDDisplay}</p>;
};
