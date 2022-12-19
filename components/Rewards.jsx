import { match } from "assert";
import React, { useState } from "react";
import {
  chainSymbol,
  placeholderMntlUsdValue,
  placeholderRewards,
} from "../config";
import { sendRewards } from "../data";
import {
  fromDenom,
  useTotalRewards,
  useMntlUsd,
  useDelegatedValidators,
  useAllValidators,
} from "../data/swrStore";
import { useWallet } from "@cosmos-kit/react";

const denomDisplay = chainSymbol;

const dataObject = {
  delegatorAddress: "mantle1jxe2fpgx6twqe7nlxn4g96nej280zcemgqjmk0",
  validatorSrcAddress: "mantlevaloper1qpkax9dxey2ut8u39meq8ewjp6rfsm3hlsyceu",
  validatorDstAddress: "mantlevaloper1p0wy6wdnw05h33rfeavqt3ueh7274hcl420svt",
  amount: 1,
  option: "yes",
};

const Rewards = ({ selectedValidator, setShowClaimError }) => {
  const walletManager = useWallet();
  const {
    delegatedValidators,
    totalDelegatedAmount,
    isLoadingDelegatedAmount,
    errorDelegatedAmount,
  } = useDelegatedValidators();
  const { getSigningStargateClient, address, status } = walletManager;

  const { allRewards, rewardsArray, isLoadingRewards, errorRewards } =
    useTotalRewards();
  const { mntlUsdValue, errorMntlUsdValue } = useMntlUsd();
  const { allValidators, isLoadingValidators, errorValidators } =
    useAllValidators();

  const selectedRewards = rewardsArray
    ?.filter((rewardObject) =>
      selectedValidator?.includes(rewardObject.validator_address)
    )
    .reduce(
      (accumulator, currentValue) =>
        accumulator + parseFloat(currentValue?.reward[0]?.amount),
      0
    );
  const cumulativeRewards = errorRewards
    ? placeholderRewards
    : fromDenom(allRewards);

  const rewardsDisplay = selectedValidator.length
    ? fromDenom(selectedRewards)
    : cumulativeRewards;

  const rewardsInUSDDisplay =
    errorRewards ||
    errorMntlUsdValue | isNaN(fromDenom(allRewards)) ||
    isNaN(parseFloat(mntlUsdValue))
      ? placeholderMntlUsdValue
      : (fromDenom(allRewards) * parseFloat(mntlUsdValue))
          .toFixed(6)
          .toString();

  const handleClaim = async () => {
    const { response, error } = await sendRewards(
      address,
      selectedValidator,
      dataObject?.memo,
      { getSigningStargateClient }
    );
    console.log("response: ", response, " error: ", error);
  };
  return (
    <div className="nav-bg p-3 rounded-4 gap-3">
      <div className="d-flex flex-column gap-2">
        {selectedValidator.length ? (
          <p className="caption d-flex gap-2 align-items-center">
            Cumulative Rewards
          </p>
        ) : (
          <p className="caption d-flex gap-2 align-items-center"> Rewards</p>
        )}
        <p className="caption">
          {rewardsDisplay}&nbsp;
          {denomDisplay}
        </p>
        <p className="caption">
          {rewardsInUSDDisplay}&nbsp;{"$USD"}
        </p>
        <div className="d-flex justify-content-end">
          {selectedValidator?.length > 5 ? null : (
            <button
              className="am-link text-start"
              data-bs-toggle={
                delegatedValidators?.length > 5 &&
                selectedValidator.length === 0
                  ? ""
                  : "modal"
              }
              data-bs-target="#claimRewardsModal"
              onClick={() =>
                delegatedValidators?.length > 5 &&
                selectedValidator.length === 0 &&
                setShowClaimError(true)
              }
            >
              <i className="text-primary bi bi-box-arrow-in-down"></i>Claim
            </button>
          )}
        </div>
      </div>

      <div
        className="modal "
        tabIndex="-1"
        role="dialog"
        id="claimRewardsModal"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Claim Rewards</h5>
              <button
                type="button"
                class="btn-close primary"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body p-4 d-flex flex-column text-white">
              <h6>Total Available $MNTL rewards:</h6>
              <p>
                {selectedValidator.length
                  ? rewardsArray
                      ?.filter((item) =>
                        selectedValidator?.includes(item?.validator_address)
                      )
                      .reduce(
                        (accumulator, currentValue) =>
                          parseFloat(accumulator) +
                            parseFloat(currentValue?.reward[0]?.amount) || 0,
                        parseFloat(0)
                      )
                  : rewardsArray?.reduce(
                      (accumulator, currentValue) =>
                        parseFloat(accumulator) +
                          parseFloat(currentValue?.reward[0]?.amount) || 0,
                      parseFloat(0)
                    )}
              </p>
              <p>Selected Validator</p>
              <table className="table nav-bg">
                <thead>
                  <tr>
                    <th className="text-white" scope="col">
                      Validator Name
                    </th>
                    <th className="text-white" scope="col">
                      Commission
                    </th>
                    <th className="text-white" scope="col">
                      Delegated Amount
                    </th>
                    <th className="text-white" scope="col">
                      Claimable Rewards
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedValidator.length ? (
                    delegatedValidators?.filter((item) =>
                      selectedValidator.includes(item?.operator_address)
                    ).length ? (
                      delegatedValidators
                        ?.filter((item) =>
                          selectedValidator.includes(item?.operator_address)
                        )
                        .map((item, index) => (
                          <tr key={index}>
                            <td className="text-white">
                              {item?.description?.moniker}
                            </td>
                            <td className="text-white">
                              {item?.commission?.commission_rates?.rate * 100}%
                            </td>
                            <td className="text-white">
                              {item?.tokens / 1000000}
                            </td>
                            <td className="text-white">
                              {rewardsArray?.find(
                                (element) =>
                                  element?.validator_address ===
                                  item?.operator_address
                              )?.reward[0]?.amount / 1000000}
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td className="text-white text-center" colSpan={4}>
                          None of the selected validators have been delegated to
                        </td>
                      </tr>
                    )
                  ) : delegatedValidators?.length ? (
                    delegatedValidators?.map((item, index) => (
                      <tr key={index}>
                        <td className="text-white">
                          {item?.description?.moniker}
                        </td>
                        <td className="text-white">
                          {item?.commission?.commission_rates?.rate * 100}%
                        </td>
                        <td className="text-white">{item?.tokens / 1000000}</td>
                        <td className="text-white">
                          {rewardsArray?.find(
                            (element) =>
                              element?.validator_address ===
                              item?.operator_address
                          )?.reward[0]?.amount / 1000000}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="text-white text-center" colSpan={4}>
                        No Record Found!!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <h6>Current wallet adress for claiming staking rewards:</h6>
              <p>{address}</p>
              <div className="d-flex gap-2">
                <p>
                  Want to claim your staking rewards to another wallet address?
                </p>
                <a href="#">Setup address</a>
              </div>
              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-primary w-25 text-right rounded-5"
                  onClick={handleClaim}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
