import { useChain } from "@cosmos-kit/react";
import React, { useState } from "react";
import BigNumber from "bignumber.js";
import {
  defaultChainName,
  defaultChainSymbol,
  placeholderMntlUsdValue,
  placeholderRewards,
} from "../config";
import {
  fromChainDenom,
  sendRewardsBatched,
  useDelegatedValidators,
  useMntlUsd,
  useTotalRewards,
  useWithdrawAddress,
  sendWithdrawAddress,
  isInvalidAddress,
} from "../data";
import ModalContainer from "./ModalContainer";
import { toast } from "react-toastify";

const denomDisplay = defaultChainSymbol;

const Rewards = ({ setShowClaimError, stakeState, notify }) => {
  const [ClaimModal, setClaimModal] = useState(false);

  const walletManager = useChain(defaultChainName);
  const { withdrawAddress, isLoadingWithdrawAddress, errorWithdrawAddress } =
    useWithdrawAddress();
  const { delegatedValidators } = useDelegatedValidators();
  const { getSigningStargateClient, address, status, wallet } = walletManager;
  const { allRewards, rewardsArray, errorRewards } = useTotalRewards();
  const { mntlUsdValue, errorMntlUsdValue } = useMntlUsd();
  // console.log("allRewards", allRewards, "rewards", rewardsArray);
  const selectedRewards = rewardsArray
    ?.filter((rewardObject) =>
      stakeState?.selectedValidators?.includes(rewardObject.validatorAddress)
    )
    .reduce(
      (accumulator, currentValue) =>
        accumulator.plus(new BigNumber(currentValue?.reward?.[0]?.amount) || 0),
      new BigNumber("0")
    );

  const cumulativeRewards = errorRewards
    ? placeholderRewards
    : fromChainDenom(allRewards);

  const rewardsDisplay = stakeState?.selectedValidators.length
    ? fromChainDenom(selectedRewards)
    : cumulativeRewards;

  const rewardsInUSDDisplay =
    errorRewards ||
    errorMntlUsdValue | isNaN(fromChainDenom(allRewards)) ||
    isNaN(parseFloat(mntlUsdValue))
      ? placeholderMntlUsdValue
      : (fromChainDenom(allRewards) * parseFloat(mntlUsdValue))
          .toFixed(6)
          .toString();

  const handleClaim = async (e) => {
    e.preventDefault();
    setClaimModal(false);
    const id = toast.loading("Transaction initiated ...", {
      position: "bottom-center",
      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    const { response, error } = await sendRewardsBatched(
      address,
      withdrawAddress,
      stakeState?.selectedValidators,
      stakeState?.memo,
      { getSigningStargateClient }
    );
    console.log("response: ", response, " error: ", error);
    if (response) {
      notify(response?.transactionHash, id);
    } else {
      notify(null, id);
    }
  };

  const [setupAddress, setSetupAddress] = useState(false);
  const [newAddress, setNewAddress] = useState();

  const handleAddressChangeSubmit = async (e) => {
    e.preventDefault();
    // do something to change the address
    setClaimModal(false);
    const id = toast.loading("Transaction initiated ...", {
      position: "bottom-center",
      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    const { response, error } = await sendWithdrawAddress(
      address,
      newAddress,
      stakeState?.memo,
      {
        getSigningStargateClient,
      }
    );
    console.log("response: ", response, " error: ", error);
    if (response) {
      notify(response?.transactionHash, id);
    } else {
      notify(null, id);
    }
  };

  const isSubmitDisabled = status != "Connected";

  const getCommission = (rate) =>
    BigNumber(rate).isZero() ? 0 : BigNumber(rate).toString().slice(0, -16);

  return (
    <div className="nav-bg p-3 rounded-4 gap-3">
      <div className="d-flex flex-column gap-2">
        {stakeState?.selectedValidators.length ? (
          <p className="caption d-flex gap-2 align-items-center">
            Cumulative Rewards
          </p>
        ) : (
          <p
            className={`caption d-flex gap-2 align-items-center ${
              status === "Connected" ? null : "text-gray"
            }`}
          >
            {" "}
            Rewards
          </p>
        )}
        <p className={status === "Connected" ? "caption" : "caption text-gray"}>
          {rewardsDisplay}&nbsp;
          {denomDisplay}
        </p>
        <p
          className={status === "Connected" ? "caption2" : "caption2 text-gray"}
        >
          {rewardsInUSDDisplay}&nbsp;{"$USD"}
        </p>
        <div className="d-flex justify-content-end">
          {stakeState?.selectedValidators?.length > 5 ||
          isSubmitDisabled ? null : (
            <button
              className="am-link text-start d-flex align-items-center gap-1"
              onClick={() => {
                delegatedValidators?.length > 5 &&
                  stakeState?.selectedValidators.length === 0 &&
                  setShowClaimError(true);
                delegatedValidators?.length > 5 &&
                stakeState?.selectedValidators.length === 0
                  ? null
                  : setClaimModal(true);
              }}
            >
              <i className="text-primary bi bi-box-arrow-in-down"></i>Claim
            </button>
          )}
        </div>
      </div>

      <ModalContainer active={ClaimModal} setActive={setClaimModal}>
        {!setupAddress ? (
          <div className="d-flex flex-column bg-gray-700 m-auto p-4 rounded-3 w-100">
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="body2 text-primary d-flex align-items-center gap-2">
                <button
                  className="btn-close primary bg-t"
                  onClick={() => setClaimModal(false)}
                  style={{ background: "none" }}
                >
                  <span className="text-primary">
                    <i className="bi bi-chevron-left" />
                  </span>
                </button>
                Claim Rewards
              </h5>
              <button
                className="btn-close primary bg-t"
                onClick={() => setClaimModal(false)}
                style={{ background: "none" }}
              >
                <span className="text-primary">
                  <i className="bi bi-x-lg" />
                </span>
              </button>
            </div>
            <div className="pt-4 d-flex flex-column text-white">
              <h6 className="caption2 my-1">Total Available $MNTL rewards:</h6>
              <p className="body2 my-1">
                {stakeState?.selectedValidators.length
                  ? fromChainDenom(selectedRewards)
                  : fromChainDenom(allRewards)}{" "}
                $MNTL
              </p>
              <p className="caption2 my-2 text-gray">Selected Validator</p>
              <div
                className="nav-bg p-2 rounded-4 w-100"
                style={{ overflowX: "auto" }}
              >
                <table className="table claim-table">
                  <thead className="bt-0">
                    <tr>
                      <th
                        className="text-white caption2"
                        scope="col"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Validator Name
                      </th>
                      <th
                        className="text-white caption2"
                        scope="col"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Commission
                      </th>
                      <th
                        className="text-white caption2"
                        scope="col"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Delegated Amount
                      </th>
                      <th
                        className="text-white caption2"
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
                          item?.operatorAddress
                        )
                      ).length ? (
                        delegatedValidators
                          ?.filter((item) =>
                            stakeState?.selectedValidators.includes(
                              item?.operatorAddress
                            )
                          )
                          .map((item, index) => (
                            <tr key={index}>
                              <td className="caption2">
                                {item?.description?.moniker}
                              </td>
                              <td className="caption2">
                                {getCommission(
                                  item?.commission?.commissionRates?.rate
                                )}{" "}
                                %
                              </td>

                              <td className="caption2">
                                {item?.tokens / 1000000}
                              </td>
                              <td className="caption2">
                                {fromChainDenom(
                                  rewardsArray?.find(
                                    (element) =>
                                      element?.validatorAddress ===
                                      item?.operatorAddress
                                  )?.reward[0]?.amount
                                )}
                              </td>
                            </tr>
                          ))
                      ) : (
                        <tr>
                          <td className="text-white text-center" colSpan={4}>
                            None of the selected validators have been delegated
                            to
                          </td>
                        </tr>
                      )
                    ) : delegatedValidators?.length ? (
                      delegatedValidators?.map((item, index) => (
                        <tr key={index}>
                          <td className="caption2">
                            {item?.description?.moniker}
                          </td>
                          <td className="caption2">
                            {getCommission(
                              item?.commission?.commissionRates?.rate
                            )}{" "}
                            %
                          </td>
                          <td className="caption2">{item?.tokens / 1000000}</td>
                          <td className="caption2">
                            {fromChainDenom(
                              rewardsArray?.find(
                                (element) =>
                                  element?.validatorAddress ===
                                  item?.operatorAddress
                              )?.reward[0]?.amount
                            )}
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
              <p className="caption2 my-2 text-gray">{withdrawAddress}</p>
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
              <div className="d-flex align-items-center gap-2 justify-content-end">
                <button
                  className="button-primary py-2 px-5 mt-3 text-right rounded-5"
                  onClick={handleClaim}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column bg-gray-700 m-auto p-4 rounded-3 w-100">
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="body2 text-primary d-flex align-items-center gap-2">
                <button onClick={() => setSetupAddress(false)}>
                  <i className="bi bi-chevron-left" />
                </button>
                Setup Rewards Withdrawal Address
              </h5>
              <button
                className="btn-close primary bg-t"
                onClick={() => setClaimModal(false)}
                style={{ background: "none" }}
              >
                <span className="text-primary">
                  <i className="bi bi-x-lg" />
                </span>
              </button>
            </div>
            <div className="py-4 d-flex flex-column text-white">
              <h6 className="caption2 my-1">Current Address</h6>
              <p className="caption2 my-1">{withdrawAddress}</p>
              <p className="caption2 my-2 text-gray">Revised Address</p>
              <input
                type="text"
                className="am-input py-1 px-3 border-color-white rounded-2 bg-t"
                placeholder="Enter Withdraw Address"
                onChange={(e) => setNewAddress(e.target.value)}
              />
              {newAddress && newAddress === withdrawAddress && (
                <p className="caption2 text-error pt-1">
                  Revised Address can&apos;t be same as current address.
                </p>
              )}
              {isInvalidAddress(newAddress) && (
                <p className="caption2 text-error pt-1">Invalid Address</p>
              )}
              <div className="d-flex align-items-center gap-2 justify-content-end">
                <button
                  className="button-primary py-2 px-5 mt-3 caption text-center"
                  onClick={handleAddressChangeSubmit}
                  disabled={
                    newAddress == withdrawAddress ||
                    isInvalidAddress(newAddress)
                  }
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </ModalContainer>

      {/* <TransactionManifestModal
        id="claimTransactionManifestModal"
        claimArray={stakeState.selectedValidators.map((item) => item)}
        displayData={[
          { title: "Claiming rewards to", value: address },

          {
            title: "amount",
            value: stakeState?.selectedValidators.length
              ? fromChainDenom(selectedRewards)
              : rewardsArray
                  ?.filter((item) =>
                    stakeState?.selectedValidators?.includes(
                      item?.validatorAddress
                    )
                  )
                  .reduce(
                    (accumulator, currentValue) =>
                      parseFloat(accumulator) +
                        parseFloat(currentValue?.reward[0]?.amount) || 0,
                    parseFloat(0)
                  ),
          },
          { title: "Transaction Type", value: "Claim" },
          { title: "Wallet Type", value: wallet?.prettyName },
        ]}
        handleSubmit={handleClaim}
      /> */}
    </div>
  );
};

export default Rewards;
