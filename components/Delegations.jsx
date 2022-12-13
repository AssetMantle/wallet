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
import { useWallet } from "@cosmos-kit/react";

const denomDisplay = chainSymbol;

//Dummy Data
const dataObject = {
  delegatorAddress: "mantle1jxe2fpgx6twqe7nlxn4g96nej280zcemgqjmk0",
  validatorSrcAddress: "mantlevaloper1qpkax9dxey2ut8u39meq8ewjp6rfsm3hlsyceu",
  validatorDstAddress: "mantlevaloper1p0wy6wdnw05h33rfeavqt3ueh7274hcl420svt",
  amount: 1,
  option: "yes",
};

const Delegations = ({ selectedValidator }) => {
  const walletManager = useWallet();
  const { getSigningStargateClient, address, status } = walletManager;
  const {
    delegatedValidators,
    totalDelegatedAmount,
    isLoadingDelegatedAmount,
    errorDelegatedAmount,
  } = useDelegatedValidators();
  const { mntlUsdValue, errorMntlUsdValue } = useMntlUsd();

  //Create array of validators selected from list
  const selectedDelegations = delegatedValidators
    ?.filter((delegatedObject) =>
      selectedValidator.includes(delegatedObject?.operator_address)
    )
    .reduce(
      (accumulator, currentValue) =>
        accumulator + parseFloat(currentValue?.delegatedAmount),
      0
    );

  //Get total delegation amount of all validators selected
  const cumulativeDelegations = errorDelegatedAmount
    ? placeholderTotalDelegations
    : fromDenom(totalDelegatedAmount);

  //Show total delegated amount if no validators selected or show cumulative delegated amount of selected validators
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

  //Get number of validators delegated to out of selected validators
  const delegatedOutOfSelectedValidators = delegatedValidators?.filter((item) =>
    selectedValidator?.includes(item.operator_address)
  );

  //Flag to see if the redelegate, undelegate and claim buttons will show up
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
          {showRedelegateUndelegateAndClaim &&
          selectedValidator?.length === 1 ? (
            <div className="d-flex justify-content-end">
              <div className="d-flex flex-row w-75 justify-content-around">
                <button
                  onClick={handleRedelegate}
                  className="am-link text-start"
                >
                  <i className="text-primary bi bi-arrow-clockwise"></i>
                  Redelegate
                </button>
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#viewUndelegatingModal"
                  className="am-link text-start"
                >
                  <i className="text-primary bi bi-arrow-counterclockwise"></i>
                  Undelegate
                </button>
              </div>
            </div>
          ) : null}
        </div>
        <div
          className="modal "
          tabIndex="-1"
          role="dialog"
          id="viewUndelegatingModal"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 class="modal-title">Delegate</h5>
                <button
                  type="button"
                  class="btn-close primary"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-4 text-center d-flex flex-column">
                <div className="d-flex justify-content-between">
                  <label htmlFor="delegationAmount">Undelegate amount</label>
                  <small>
                    Delegated Amount:
                    {fromDenom(
                      delegatedValidators?.find(
                        (item) => item.operator_address === selectedValidator[0]
                      )?.delegatedAmount
                    )}
                  </small>
                </div>
                <div className="p-3 border-white py-2 d-flex rounded-2 gap-2 am-input">
                  <input
                    className="bg-t"
                    id="delegationAmount"
                    style={{ flex: "1", border: "none", outline: "none" }}
                    type="text"
                  ></input>
                  <button className="text-primary">Max</button>
                </div>
              </div>
              <div className="modal-footer ">
                <button
                  onClick={handleUndelegate}
                  type="button"
                  className="btn btn-primary"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Delegations;
