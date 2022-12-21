import { match } from "assert";
import React, { useState } from "react";
import {
  chainSymbol,
  placeholderMntlUsdValue,
  placeholderRewards,
} from "../config";
import { sendRewardsBatched } from "../data";
import {
  fromDenom,
  useTotalRewards,
  useMntlUsd,
  useDelegatedValidators,
  useAllValidators,
} from "../data/swrStore";
import { useWallet } from "@cosmos-kit/react";

import { MdOutlineClose } from "react-icons/md";
import { BsChevronLeft } from "react-icons/bs";

const denomDisplay = chainSymbol;

const Rewards = ({ setShowClaimError, stakeState }) => {
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
      stakeState?.selectedValidators?.includes(rewardObject.validator_address)
    )
    .reduce(
      (accumulator, currentValue) =>
        accumulator + parseFloat(currentValue?.reward[0]?.amount),
      0
    );
  const cumulativeRewards = errorRewards
    ? placeholderRewards
    : fromDenom(allRewards);

  const rewardsDisplay = stakeState?.selectedValidators.length
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
    const { response, error } = await sendRewardsBatched(
      address,
      stakeState?.selectedValidators,
      stakeState?.memo,
      { getSigningStargateClient }
    );
    console.log("response: ", response, " error: ", error);
  };

  const [setupAddress, setSetupAddress] = useState(false);
  const [NewAddress, setNewAddress] = useState();

  const handleAddressChange = () => {
    // do something to change the address
    setSetupAddress(false);
  };

  return (
    <div className="nav-bg p-3 rounded-4 gap-3">
      <div className="d-flex flex-column gap-2">
        {stakeState?.selectedValidators.length ? (
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
        <p className="caption2">
          {rewardsInUSDDisplay}&nbsp;{"$USD"}
        </p>
        <div className="d-flex justify-content-end">
          {stakeState?.selectedValidators?.length > 5 ? null : (
            <button
              className="am-link text-start"
              data-bs-toggle={
                delegatedValidators?.length > 5 &&
                stakeState?.selectedValidators.length === 0
                  ? ""
                  : "modal"
              }
              data-bs-target="#claimRewardsModal"
              onClick={() =>
                delegatedValidators?.length > 5 &&
                stakeState?.selectedValidators.length === 0 &&
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
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          style={{ width: "min(100%,650px)", maxWidth: "min(100%,650px)" }}
        >
          {!setupAddress ? (
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title body2 text-primary d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="btn-close primary"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    style={{ background: "none" }}
                  >
                    <span className="text-primary">
                      <BsChevronLeft />
                    </span>
                  </button>
                  Claim Rewards
                </h5>
                <button
                  type="button"
                  className="btn-close primary"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  style={{ background: "none" }}
                >
                  <span className="text-primary">
                    <MdOutlineClose />
                  </span>
                </button>
              </div>
              <div className="modal-body p-4 d-flex flex-column text-white">
                <h6 className="caption2 my-1">
                  Total Available $MNTL rewards:
                </h6>
                <p className="body2 my-1">
                  {stakeState?.selectedValidators.length
                    ? rewardsArray
                        ?.filter((item) =>
                          stakeState?.selectedValidators?.includes(
                            item?.validator_address
                          )
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
                      )}{" "}
                  $MNTL
                </p>
                <p className="caption2 my-2 text-gray">Selected Validator</p>
                <div
                  className="nav-bg p-2 rounded-4 w-100"
                  style={{ overflowX: "auto" }}
                >
                  <table className="table">
                    <thead className="bt-0">
                      <tr>
                        <th
                          className="text-white"
                          scope="col"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Validator Name
                        </th>
                        <th
                          className="text-white"
                          scope="col"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Commission
                        </th>
                        <th
                          className="text-white"
                          scope="col"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Delegated Amount
                        </th>
                        <th
                          className="text-white"
                          scope="col"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Claimable Rewards
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {stakeState?.selectedValidators.length ? (
                        delegatedValidators?.filter((item) =>
                          stakeState?.selectedValidators.includes(
                            item?.operator_address
                          )
                        ).length ? (
                          delegatedValidators
                            ?.filter((item) =>
                              stakeState?.selectedValidators.includes(
                                item?.operator_address
                              )
                            )
                            .map((item, index) => (
                              <tr key={index}>
                                <td className="text-white">
                                  {item?.description?.moniker}
                                </td>
                                <td className="text-white">
                                  {item?.commission?.commission_rates?.rate *
                                    100}
                                  %
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
                              None of the selected validators have been
                              delegated to
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
                            No Record Found!!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <h6 className="caption my-2 mt-5">
                  Current wallet adress for claiming staking rewards:
                </h6>
                <p className="caption2 my-2 text-gray">{address}</p>
                <p className="caption2 my-2 text-gray">
                  Want to claim your staking rewards to another wallet address?{" "}
                  <a
                    href="#"
                    className="caption text-primary"
                    onClick={(e) => {
                      e.preventDefault();
                      setSetupAddress(true);
                    }}
                  >
                    Setup address
                  </a>
                </p>
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-primary px-5 mt-3 text-right rounded-5"
                    onClick={handleClaim}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title body2 text-primary d-flex align-items-center gap-2">
                  <button onClick={() => setSetupAddress(false)}>
                    <BsChevronLeft />
                  </button>
                  Setup Rewards Withdrawal Address
                </h5>
                <button
                  type="button"
                  className="btn-close primary"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  style={{ background: "none" }}
                >
                  <span className="text-primary">
                    <MdOutlineClose />
                  </span>
                </button>
              </div>
              <div className="modal-body p-4 d-flex flex-column text-white">
                <h6 className="caption2 my-1">Current Address</h6>
                <p className="caption2 my-1">{address}</p>
                <p className="caption2 my-2 text-gray">Revised Address</p>
                <input
                  type="text"
                  className="am-input py-1 px-3 border-color-white rounded-2 bg-t"
                  placeholder="Enter Withdraw Address"
                  onChange={(e) => setNewAddress(e.target.value)}
                />
                {NewAddress && NewAddress === address && (
                  <p className="caption2 text-error pt-1">
                    Revised Address can&apos;t be same as current address.
                  </p>
                )}
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-primary px-5 mt-3 text-right rounded-5"
                    onClick={handleAddressChange}
                    disabled={
                      NewAddress &&
                      NewAddress !== address &&
                      NewAddress.length == 45
                        ? false
                        : true
                    }
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Rewards;
