import React, { useState } from "react";
import { useChain } from "@cosmos-kit/react";
import {
  defaultChainSymbol,
  placeholderMntlUsdValue,
  placeholderTotalUnbonding,
  defaultChainName,
} from "../config";
import {
  fromChainDenom,
  fromDenom,
  sendUndelegation,
  useDelegatedValidators,
  useMntlUsd,
  useTotalUnbonding,
} from "../data";
import ModalContainer from "./ModalContainer";
import { isObjEmpty } from "../lib";
import { toast } from "react-toastify";

const denomDisplay = defaultChainSymbol;

const Unbonded = ({
  stakeState,
  stakeDispatch,
  unDelegateModal,
  setUnDelegateModal,
  notify,
}) => {
  const [unBondingModal, setUnBondingModal] = useState(false);

  const walletManager = useChain(defaultChainName);
  const { getSigningStargateClient, address, status, wallet } = walletManager;
  const [activeValidators, setActiveValidators] = useState(true);
  const {
    totalUnbondingAmount,
    allUnbonding,
    isLoadingUnbonding,
    errorUnbonding,
  } = useTotalUnbonding();
  const { mntlUsdValue, errorMntlUsdValue } = useMntlUsd();
  const {
    delegatedValidators,
    totalDelegatedAmount,
    isLoadingDelegatedAmount,
    errorDelegatedAmount,
  } = useDelegatedValidators();

  const selectedUnbonding = allUnbonding
    ?.filter((unbondingObject) =>
      stakeState?.selectedValidators?.includes(unbondingObject.address)
    )
    .reduce(
      (accumulator, currentValue) =>
        accumulator + parseFloat(currentValue?.balance),
      0
    );

  const cumulativeUnbonding = errorUnbonding
    ? placeholderTotalUnbonding
    : totalUnbondingAmount;
  const unbondingDisplay = stakeState?.selectedValidators.length
    ? fromChainDenom(selectedUnbonding)
    : fromChainDenom(cumulativeUnbonding);

  const unbondingInUSDDisplay =
    errorUnbonding ||
    errorMntlUsdValue | isNaN(fromDenom(totalUnbondingAmount)) ||
    isNaN(parseFloat(mntlUsdValue))
      ? placeholderMntlUsdValue
      : (fromDenom(totalUnbondingAmount) * parseFloat(mntlUsdValue))
          .toFixed(6)
          .toString();

  const secondsInADay = 86400;

  const isSubmitDisabled = status != "Connected";

  const handleUndelegate = async (e) => {
    e.preventDefault();
    stakeDispatch({ type: "SUBMIT_UNDELEGATE" });
    if (stakeState?.undelegationAmount) {
      setUnDelegateModal(false);
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
      const { response, error } = await sendUndelegation(
        address,
        stakeState?.undelegationSrc,
        stakeState.undelegationAmount.toString(),
        stakeState?.memo,
        { getSigningStargateClient }
      );
      stakeDispatch({ type: "RESET_UNDELEGATE" });
      console.log("response:", response, "error:", error);
      if (response) {
        notify(response?.transactionHash, id);
      } else {
        notify(null, id);
      }
    }
  };

  return (
    <div className="nav-bg p-3 rounded-4 gap-3">
      <div className="d-flex flex-column gap-2">
        <p
          className={`caption d-flex gap-2 align-items-center
          ${status === "Connected" ? "null" : "text-gray"}`}
        >
          Undelegating
        </p>
        <p className={status === "Connected" ? "caption" : "caption text-gray"}>
          {unbondingDisplay}&nbsp;{denomDisplay}
        </p>
        <p className={status === "Connected" ? "caption" : "caption text-gray"}>
          {unbondingInUSDDisplay}&nbsp;{"$USD"}
        </p>
        <div className="d-flex justify-content-end">
          {allUnbonding?.length != 0 && !isSubmitDisabled ? (
            <button
              className="d-flex align-items-center gap-1 am-link text-start caption2"
              onClick={() => {
                stakeDispatch({ type: "EMPTY_SELECTED_VALIDATORS" });
                setUnBondingModal(true);
              }}
            >
              <i className="text-primary bi bi-eye"></i>View
            </button>
          ) : null}
        </div>
      </div>
      {/* Unbonding Modal */}
      <ModalContainer active={unBondingModal} setActive={setUnBondingModal}>
        <div className="d-flex flex-column bg-gray-700 m-auto p-4 rounded-3 w-100">
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="body2 text-primary d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn-close primary"
                onClick={() => setUnDelegateModal(false)}
                style={{ background: "none" }}
              >
                <span className="text-primary">
                  <i className="bi bi-chevron-left" />
                </span>
              </button>
              Undelegating List
            </h5>
            <button
              type="button"
              className="btn-close primary"
              onClick={() => setUnBondingModal(false)}
              style={{ background: "none" }}
            >
              <span className="text-primary">
                <i className="bi bi-x-lg" />
              </span>
            </button>
          </div>
          <div className="pt-4 text-center d-flex flex-column">
            <div className="d-flex justify-content-between">
              <div className="d-flex flex-column nav-bg w-100 rounded-3 px-3 py-1">
                <div className="d-flex align-items-center justify-content-between my-2 w-100 gap-3">
                  <div
                    className="d-flex gap-2 am-input border-color-white rounded-3 py-1 px-3 align-items-center"
                    style={{ flex: "1" }}
                  >
                    <span
                      className="input-group-text bg-t p-0 h-100"
                      id="basic-addon1"
                      style={{ border: "none" }}
                    >
                      <i className="bi bi-search text-primary"></i>
                    </span>
                    <input
                      type="text"
                      className="am-input bg-t p-1 w-100 h-100"
                      placeholder="Search"
                      aria-label="Search"
                      style={{ border: "none" }}
                    />
                  </div>
                  <div className="btn-group">
                    <button
                      className={`${
                        activeValidators
                          ? "btn btn-primary"
                          : "btn btn-inactive"
                      } caption`}
                      onClick={() => setActiveValidators(true)}
                    >
                      Active
                    </button>
                    <button
                      className={`${
                        !activeValidators
                          ? "btn btn-primary"
                          : "btn btn-inactive"
                      } caption`}
                      onClick={() => setActiveValidators(false)}
                    >
                      Inactive
                    </button>
                  </div>
                </div>
                <div
                  className="d-flex w-100 mt-3"
                  style={{ overflow: "auto", maxHeight: "400px" }}
                >
                  <table className="table">
                    <thead className="bt-0">
                      <tr>
                        <th className="no-text-break text-white" scope="col">
                          Validator Name
                        </th>
                        <th className="no-text-break text-white" scope="col">
                          Undelegating Amount
                        </th>
                        <th className="no-text-break text-white" scope="col">
                          Duration Left
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUnbonding?.map((item, index) => (
                        <tr key={index}>
                          <td
                            className="text-white"
                            onClick={() => {
                              stakeDispatch({
                                type: "SET_UNDELEGATION_SRC_ADDRESS",
                                payload: item?.address,
                              });
                              setUnBondingModal(false);
                              setUnDelegateModal(true);
                            }}
                          >
                            {
                              delegatedValidators?.find(
                                (ele) => ele?.operatorAddress === item?.address
                              )?.description?.moniker
                            }
                            <i className="bi bi-arrow-up-right" />
                          </td>
                          <td className="text-white">
                            {fromDenom(item?.balance)}
                          </td>
                          <td className="text-white">
                            {/* Calculate and display number of days left */}
                            {Math.floor(
                              ((item?.completion_time?.seconds?.low +
                                item?.completion_time?.seconds?.high) *
                                1000 -
                                new Date().getTime()) /
                                1000 /
                                60 /
                                60 /
                                24
                            )}{" "}
                            days,{" "}
                            {/* Calculate and display number of hours left */}
                            {(
                              ((item?.completion_time?.seconds?.low +
                                item?.completion_time?.seconds?.high) %
                                86400) /
                              3600
                            ).toFixed(2)}{" "}
                            hours
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ModalContainer>
      {/* Undelegation Modal */}
      {
        <ModalContainer active={unDelegateModal} setActive={setUnDelegateModal}>
          <div className="d-flex flex-column bg-gray-700 m-auto p-4 rounded-3 w-100">
            <div className="d-flex align-items-center justify-content-between">
              <h5 className="body2 text-primary d-flex align-items-center gap-2">
                <button
                  className="btn-close primary bg-t"
                  onClick={() => setUnDelegateModal(false)}
                  style={{ background: "none" }}
                >
                  <span className="text-primary">
                    <i className="bi bi-chevron-left" />
                  </span>
                </button>
                Undelegate
              </h5>
              <button
                className="btn-close primary bg-t"
                onClick={() => setUnDelegateModal(false)}
                style={{ background: "none" }}
              >
                <span className="text-primary">
                  <i className="bi bi-x-lg" />
                </span>
              </button>
            </div>
            <div className="py-4 text-center d-flex flex-column gap-1">
              <div className="d-flex justify-content-between">
                <label htmlFor="delegationAmount caption2 mb-1">
                  Undelegate amount
                </label>
                <small className="caption2 text-gray">
                  Delegated Amount:
                  {fromDenom(
                    delegatedValidators?.find(
                      (item) =>
                        item?.operatorAddress === stakeState?.undelegationSrc
                    )?.delegatedAmount
                  )}
                </small>
              </div>
              <div>
                <div className="p-3 border-white py-2 d-flex rounded-2 gap-2 am-input">
                  <input
                    className="bg-t"
                    id="delegationAmount"
                    style={{ flex: "1", border: "none", outline: "none" }}
                    value={stakeState?.undelegationAmount}
                    type="text"
                    placeholder="Enter Undelegate Amount"
                    onChange={(e) =>
                      stakeDispatch({
                        type: "CHANGE_UNDELEGATION_AMOUNT",
                        payload: e.target.value,
                      })
                    }
                  ></input>
                  <button
                    onClick={() =>
                      stakeDispatch({
                        type: "SET_MAX_UNDELEGATION_AMOUNT",
                      })
                    }
                    className="text-primary"
                  >
                    Max
                  </button>
                </div>
                <small
                  id="amountInputErrorMsg"
                  className="form-text text-danger d-flex align-items-center gap-1"
                >
                  {stakeState?.errorMessages?.undelegationAmountErrorMsg && (
                    <i className="bi bi-info-circle" />
                  )}{" "}
                  {stakeState?.errorMessages?.undelegationAmountErrorMsg}
                </small>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 justify-content-end">
              <button
                type="button"
                disabled={!isObjEmpty(stakeState?.errorMessages)}
                className="button-primary px-5 py-2"
                onClick={handleUndelegate}
              >
                Submit
              </button>
            </div>
          </div>
        </ModalContainer>
      }
    </div>
  );
};

export default Unbonded;
