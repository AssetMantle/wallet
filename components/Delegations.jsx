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

const Delegations = ({ selectedValidator }) => {
  const {
    delegatedValidators,
    totalDelegatedAmount,
    isLoadingDelegatedAmount,
    errorDelegatedAmount,
  } = useDelegatedValidators();
  const { mntlUsdValue, errorMntlUsdValue } = useMntlUsd();

  const selectedDelegations = delegatedValidators
    ?.filter((delegatedObject) =>
      selectedValidator.includes(delegatedObject?.operator_address)
    )
    .reduce(
      (accumulator, currentValue) =>
        accumulator + parseFloat(currentValue?.delegatedAmount),
      0
    );
  const cumulativeDelegations = errorDelegatedAmount
    ? placeholderTotalDelegations
    : fromDenom(totalDelegatedAmount);

  const delegationsDisplay = selectedValidator.length
    ? fromDenom(selectedDelegations)
    : fromDenom(cumulativeDelegations);

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
