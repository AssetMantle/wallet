import { match } from "assert";
import React, { useState, useEffect } from "react";
import {
  chainSymbol,
  placeholderMntlUsdValue,
  placeholderRewards,
} from "../config";
import { sendRewards } from "../data";
import { fromDenom, useTotalRewards, useMntlUsd } from "../data/swrStore";
import { useWallet } from "@cosmos-kit/react";

const denomDisplay = chainSymbol;

const dataObject = {
  delegatorAddress: "mantle1jxe2fpgx6twqe7nlxn4g96nej280zcemgqjmk0",
  validatorSrcAddress: "mantlevaloper1qpkax9dxey2ut8u39meq8ewjp6rfsm3hlsyceu",
  validatorDstAddress: "mantlevaloper1p0wy6wdnw05h33rfeavqt3ueh7274hcl420svt",
  amount: 1,
  option: "yes",
};

const Rewards = ({ selectedValidator }) => {
  const walletManager = useWallet();
  const { getSigningStargateClient, address, status } = walletManager;

  const { allRewards, rewardsArray, isLoadingRewards, errorRewards } =
    useTotalRewards();
  const { mntlUsdValue, errorMntlUsdValue } = useMntlUsd();

  const selectedRewards = rewardsArray
    ?.filter((rewardObject) =>
      selectedValidator?.includes(rewardObject.validator_address)
    )
    .reduce(
      (accumulator, currentValue) =>
        accumulator + parseFloat(currentValue?.reward[0].amount),
      0
    );

  const cumulativeRewards = errorRewards
    ? placeholderRewards
    : fromDenom(allRewards);

  const rewardsDisplay = selectedValidator.length
    ? fromDenom(selectedRewards)
    : fromDenom(cumulativeRewards);

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
      dataObject?.delegatorAddress,
      dataObject?.validatorSrcAddress,
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
          <button onClick={handleClaim} className="am-link text-start">
            <i className="text-primary bi bi-box-arrow-in-down"></i>Claim
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
