import React from "react";
import {
  chainSymbol,
  placeholderTotalDelegations,
  placeholderMntlUsdValue,
} from "../config";
import { sendRedelegation, sendUndelegation } from "../data";
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

  const delegatedOutOfSelectedValidators = delegatedValidators?.filter((item) =>
    selectedValidator?.includes(item.operator_address)
  );

  const showRedelegateUndelegateAndClaim =
    selectedValidator.length && delegatedOutOfSelectedValidators.length > 0;

  const handleRedelegate = async () => {
    const { response, error } = await sendRedelegation(
      dataObject?.delegatorAddress,
      dataObject?.validatorSrcAddress,
      dataObject?.validatorDstAddress,
      { amount: dataObject?.amount.toString(), denom: "umntl" },
      dataObject?.memo,
      { getSigningStargateClient }
    );
    console.log("response: ", response, " error: ", error);
  };
  const handleUndelegate = async () => {
    const { response, error } = await sendUndelegation(
      dataObject?.delegatorAddress,
      dataObject?.validatorSrcAddress,
      { amount: dataObject?.amount.toString(), denom: "umntl" },
      dataObject?.memo,
      { getSigningStargateClient }
    );
    console.log("response: ", response, " error: ", error);
  };
  return (
    <>
      {selectedValidator.length ? (
        <p>
          {delegatedOutOfSelectedValidators.length} out of{" "}
          {selectedValidator.length} selected are Delegated Validators
        </p>
      ) : null}
      <div className="nav-bg p-3 rounded-4 gap-3">
        <div className="d-flex flex-column gap-2">
          {selectedValidator.length ? (
            <p className="caption d-flex gap-2 align-items-center">
              Cumulative Delegated
            </p>
          ) : (
            <p className="caption d-flex gap-2 align-items-center">
              {" "}
              Delegated
            </p>
          )}
          <p className="caption">
            {delegationsDisplay}&nbsp;{denomDisplay}
          </p>
          <p className="caption">
            {delegationsInUSDDisplay}&nbsp;{"$USD"}
          </p>
          {showRedelegateUndelegateAndClaim ? (
            <div className="d-flex justify-content-end">
              <div className="d-flex w-75 justify-content-around">
                <button
                  onClick={handleRedelegate}
                  className="am-link text-start"
                >
                  <i className="text-primary bi bi-arrow-clockwise"></i>
                  Redelegate
                </button>
                <button
                  onClick={handleUndelegate}
                  className="am-link text-start"
                >
                  <i className="text-primary bi bi-arrow-counterclockwise"></i>
                  Undelegate
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Delegations;
