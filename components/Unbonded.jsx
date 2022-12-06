import React from "react";
import {
  chainSymbol,
  placeholderMntlUsdValue,
  placeholderTotalUnbonding,
} from "../config";
import { fromDenom, useTotalUnbonding, useMntlUsd } from "../data/swrStore";

const denomDisplay = chainSymbol;

const Unbonded = () => {
  const { allUnbonding, isLoadingUnbonding, errorUnbonding } =
    useTotalUnbonding();
  const { mntlUsdValue, errorMntlUsdValue } = useMntlUsd();

  const unbondingDisplay = errorUnbonding
    ? placeholderTotalUnbonding
    : fromDenom(allUnbonding);

  const unbondingInUSDDisplay =
    errorUnbonding ||
    errorMntlUsdValue | isNaN(fromDenom(allUnbonding)) ||
    isNaN(parseFloat(mntlUsdValue))
      ? placeholderMntlUsdValue
      : (fromDenom(allUnbonding) * parseFloat(mntlUsdValue))
          .toFixed(6)
          .toString();

  return (
    <div className="nav-bg p-3 rounded-4 gap-3">
      <div className="d-flex flex-column gap-2">
        <p className="caption d-flex gap-2 align-items-center">Unbonding</p>
        <p className="caption">
          {unbondingDisplay}&nbsp;{denomDisplay}
        </p>
        <p className="caption">
          {unbondingInUSDDisplay}&nbsp;{"$USD"}
        </p>
      </div>
    </div>
  );
};

export default Unbonded;
