import React from "react";
import {
  chainSymbol,
  placeholderMntlUsdValue,
  placeholderRewards,
} from "../config";
import { fromDenom, useTotalRewards, useMntlUsd } from "../data/swrStore";

const denomDisplay = chainSymbol;

const Rewards = () => {
  const { allRewards, isLoadingRewards, errorRewards } = useTotalRewards();
  const { mntlUsdValue, errorMntlUsdValue } = useMntlUsd();

  const rewardsDisplay = errorRewards
    ? placeholderRewards
    : fromDenom(allRewards);

  const rewardsInUSDDisplay =
    errorRewards ||
    errorMntlUsdValue | isNaN(fromDenom(allRewards)) ||
    isNaN(parseFloat(mntlUsdValue))
      ? placeholderMntlUsdValue
      : (fromDenom(allRewards) * parseFloat(mntlUsdValue))
          .toFixed(6)
          .toString();
  return (
    <div className="nav-bg p-3 rounded-4 gap-3">
      <div className="d-flex flex-column gap-2">
        <p className="caption d-flex gap-2 align-items-center">Rewards</p>
        <p className="caption">
          {rewardsDisplay}&nbsp;{denomDisplay}
        </p>
        <p className="caption">
          {rewardsInUSDDisplay}&nbsp;{"$USD"}
        </p>
        <button className="am-link text-start">Claim</button>
      </div>
    </div>
  );
};

export default Rewards;
