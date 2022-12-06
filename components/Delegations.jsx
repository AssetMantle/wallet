import React from "react";
import {
  chainSymbol,
  placeholderTotalDelegations,
  placeholderMntlUsdValue,
} from "../config";
import {
  useDelegatedValidators,
  useMntlUsd,
  fromDenom,
} from "../data/swrStore";

const denomDisplay = chainSymbol;

const Delegations = () => {
  const {
    delegators,
    totalDelegatedAmount,
    isLoadingDelegatedAmount,
    errorDelegatedAmount,
  } = useDelegatedValidators();
  const { mntlUsdValue, errorMntlUsdValue } = useMntlUsd();

  const delegationsDisplay = errorDelegatedAmount
    ? placeholderTotalDelegations
    : fromDenom(totalDelegatedAmount);

  const delegationsInUSDDisplay =
    errorDelegatedAmount ||
    errorMntlUsdValue | isNaN(fromDenom(totalDelegatedAmount)) ||
    isNaN(parseFloat(mntlUsdValue))
      ? placeholderMntlUsdValue
      : (fromDenom(totalDelegatedAmount) * parseFloat(mntlUsdValue))
          .toFixed(6)
          .toString();
  return (
    <div className="nav-bg p-3 rounded-4 gap-3">
      <div className="d-flex flex-column gap-2">
        <p className="caption d-flex gap-2 align-items-center">Delegated</p>
        <p className="caption">
          {delegationsDisplay}&nbsp;{denomDisplay}
        </p>
        <p className="caption">
          {delegationsInUSDDisplay}&nbsp;{"$USD"}
        </p>
        <button className="am-link text-start">View</button>
      </div>
    </div>
  );
};

export default Delegations;
