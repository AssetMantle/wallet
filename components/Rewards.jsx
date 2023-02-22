import { useChain } from "@cosmos-kit/react";
import React, { useState } from "react";
import BigNumber from "bignumber.js";
import {
  defaultChainName,
  defaultChainSymbol,
  getBalanceStyle,
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
import { shiftDecimalPlaces } from "../lib";

const denomDisplay = defaultChainSymbol;

const Rewards = ({ setShowClaimError, stakeState, notify }) => {
  const [ClaimModal, setClaimModal] = useState(false);

  const walletManager = useChain(defaultChainName);
  const { withdrawAddress } = useWithdrawAddress();
  const { delegatedValidators } = useDelegatedValidators();
  const { getSigningStargateClient, address, status } = walletManager;
  const { allRewards, isLoadingRewards, rewardsArray, errorRewards } =
    useTotalRewards();
  const { mntlUsdValue, errorMntlUsdValue } = useMntlUsd();
  // console.log("allRewards", allRewards, "rewards", rewardsArray);
  const selectedRewards = rewardsArray
    ?.filter((rewardObject) =>
      stakeState?.selectedValidators?.includes?.(rewardObject.validatorAddress)
    )
    .reduce(
      (accumulator, currentValue) =>
        accumulator.plus(new BigNumber(currentValue?.reward?.[0]?.amount) || 0),
      new BigNumber("0")
    );

  const cumulativeRewards = errorRewards
    ? placeholderRewards
    : fromChainDenom(allRewards);

  const rewardsDisplay = stakeState?.selectedValidators?.length
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

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    setClaimModal(false);

    // notify toast for transaction initiation
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

    let validatorAddresses;
    let delegatedValidatorsArray = delegatedValidators?.map?.(
      (validatorObject) => validatorObject?.operatorAddress
    );

    if (stakeState?.selectedValidators?.length > 0) {
      // filter out only the validator addresses which are delegated
      validatorAddresses = stakeState?.selectedValidators?.filter?.(
        (validator) => delegatedValidatorsArray?.includes?.(validator)
      );
    } else {
      validatorAddresses = delegatedValidatorsArray;
    }

    // call the batch reward claim transaction
    const { response, error } = await sendRewardsBatched(
      address,
      withdrawAddress,
      validatorAddresses,
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

  const handleOnClickClaimRewards = (e) => {
    e.preventDefault();
    if (
      delegatedValidators?.length > 5 &&
      stakeState?.selectedValidators?.length === 0
    ) {
      setShowClaimError(true);
    } else {
      setClaimModal(true);
    }
  };

  const isSubmitDisabled = status != "Connected";

  const isConnected = !(
    isLoadingRewards ||
    errorRewards ||
    status != "Connected"
  );

  const delegationInfoJSX = (
    <>
      <h6 className="caption2 my-1">Total Available $MNTL rewards:</h6>
      <p className="body2 my-1">
        {stakeState?.selectedValidators?.length
          ? getBalanceStyle(
              fromChainDenom(selectedRewards),
              "caption",
              "caption2"
            )
          : getBalanceStyle(
              fromChainDenom(allRewards),
              "caption",
              "caption2"
            )}{" "}
        $MNTL
      </p>
    </>
  );

  const delegationTableJSX = (
    <>
      <p className="caption2 my-2 text-gray">Selected Validator</p>
      <div className="nav-bg p-2 rounded-4 w-100" style={{ overflowX: "auto" }}>
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
            {stakeState?.selectedValidators?.length ? (
              delegatedValidators?.filter((item) =>
                stakeState?.selectedValidators?.includes?.(
                  item?.operatorAddress
                )
              ).length ? (
                delegatedValidators
                  ?.filter((item) =>
                    stakeState?.selectedValidators?.includes?.(
                      item?.operatorAddress
                    )
                  )
                  .map((item, index) => (
                    <tr key={index}>
                      <td className="caption2">{item?.description?.moniker}</td>
                      <td className="caption2">
                        {shiftDecimalPlaces(
                          item?.commission?.commissionRates?.rate,
                          -16
                        )}{" "}
                        %
                      </td>

                      <td className="caption2">
                        {getBalanceStyle(
                          fromChainDenom(item?.delegatedAmount),
                          "caption",
                          "caption2"
                        )}
                      </td>
                      <td className="caption2">
                        {getBalanceStyle(
                          fromChainDenom(
                            rewardsArray?.find(
                              (element) =>
                                element?.validatorAddress ===
                                item?.operatorAddress
                            )?.reward[0]?.amount
                          ),
                          "caption",
                          "caption2"
                        )}
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
                  <td className="caption2">{item?.description?.moniker}</td>
                  <td className="caption2">
                    {shiftDecimalPlaces(
                      item?.commission?.commissionRates?.rate,
                      -16
                    )}{" "}
                    %
                  </td>
                  <td className="caption2">
                    {getBalanceStyle(
                      fromChainDenom(item?.delegatedAmount),
                      "caption",
                      "caption2"
                    )}
                  </td>
                  <td className="caption2">
                    {getBalanceStyle(
                      fromChainDenom(
                        rewardsArray?.find(
                          (element) =>
                            element?.validatorAddress === item?.operatorAddress
                        )?.reward[0]?.amount
                      ),
                      "caption",
                      "caption2"
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
    </>
  );

  const setupWithdrawAddressJSX = (
    <>
      <h6 className="caption my-2 mt-5">
        Current wallet address for claiming staking rewards:
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
    </>
  );

  const withdrawAddressModal = (
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
              newAddress == withdrawAddress || isInvalidAddress(newAddress)
            }
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="nav-bg p-3 rounded-4 gap-3">
      <div className="d-flex flex-column gap-2">
        {stakeState?.selectedValidators?.length ? (
          <p className="caption d-flex gap-2 align-items-center">Rewards</p>
        ) : (
          <p
            className={`caption d-flex gap-2 align-items-center ${
              isConnected ? null : "text-gray"
            }`}
          >
            {" "}
            Cumulative Rewards
          </p>
        )}
        <p className={isConnected ? "caption" : "caption text-gray"}>
          {isConnected
            ? getBalanceStyle(rewardsDisplay, "caption", "caption2")
            : getBalanceStyle(
                rewardsDisplay,
                "caption text-gray",
                "caption2 text-gray"
              )}
          &nbsp;
          {denomDisplay}
        </p>
        <p className={isConnected ? "caption2" : "caption2 text-gray"}>
          {isConnected
            ? getBalanceStyle(rewardsInUSDDisplay, "caption2", "small")
            : getBalanceStyle(
                rewardsInUSDDisplay,
                "caption2 text-gray",
                "small text-gray"
              )}
          &nbsp;{"$USD"}
        </p>
        <div className="d-flex justify-content-end">
          {stakeState?.selectedValidators?.length > 5 ||
          isSubmitDisabled ? null : (
            <button
              className="am-link text-start d-flex align-items-center gap-1"
              onClick={handleOnClickClaimRewards}
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
              {delegationInfoJSX}
              {delegationTableJSX}
              {setupWithdrawAddressJSX}
              <div className="d-flex align-items-center gap-2 justify-content-end">
                <button
                  className="button-primary py-2 px-5 mt-3 text-right rounded-5"
                  onClick={handleSubmitClaim}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        ) : (
          { withdrawAddressModal }
        )}
      </ModalContainer>
    </div>
  );
};

export default Rewards;
