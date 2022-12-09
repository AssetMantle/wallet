import React from "react";
import {
  chainSymbol,
  placeholderMntlUsdValue,
  placeholderTotalUnbonding,
} from "../config";
import { fromDenom, useTotalUnbonding, useMntlUsd } from "../data/swrStore";

const denomDisplay = chainSymbol;

const Unbonded = ({ selectedValidator }) => {
  const {
    totalUnbondingAmount,
    allUnbonding,
    isLoadingUnbonding,
    errorUnbonding,
  } = useTotalUnbonding();
  const { mntlUsdValue, errorMntlUsdValue } = useMntlUsd();

  const selectedUnbonding = allUnbonding
    ?.filter((unbondingObject) =>
      selectedValidator?.includes(unbondingObject.validator_address)
    )
    .reduce(
      (accumulator, currentValue) =>
        accumulator + parseFloat(currentValue?.entries[0]?.balance),
      0
    );

  const cumulativeUnbonding = errorUnbonding
    ? placeholderTotalUnbonding
    : fromDenom(totalUnbondingAmount);
  const unbondingDisplay = selectedValidator.length
    ? fromDenom(selectedUnbonding)
    : fromDenom(cumulativeUnbonding);

  const unbondingInUSDDisplay =
    errorUnbonding ||
    errorMntlUsdValue | isNaN(fromDenom(totalUnbondingAmount)) ||
    isNaN(parseFloat(mntlUsdValue))
      ? placeholderMntlUsdValue
      : (fromDenom(totalUnbondingAmount) * parseFloat(mntlUsdValue))
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
        <button className="am-link text-start">View</button>
      </div>
    </div>
  );
};

export default Unbonded;
