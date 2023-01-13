import { useChain } from "@cosmos-kit/react";
import Image from "next/image";
import React, { useState } from "react";
import {
  defaultChainName,
  defaultChainSymbol,
  placeholderMntlUsdValue,
  placeholderTotalDelegations,
} from "../config";
import {
  fromDenom,
  sendRedelegation,
  sendUndelegation,
  useAllValidators,
  useDelegatedValidators,
  useMntlUsd,
} from "../data";

const denomDisplay = defaultChainSymbol;

const Delegations = ({ totalTokens, stakeState, stakeDispatch }) => {
  const { allValidators, isLoadingValidators, errorValidators } =
    useAllValidators();

  const [searchValue, setSearchValue] = useState("");
  const [activeValidators, setActiveValidators] = useState(true);
  const walletManager = useChain(defaultChainName);
  const { getSigningStargateClient, address, status } = walletManager;
  const {
    delegatedValidators,
    totalDelegatedAmount,
    isLoadingDelegatedAmount,
    errorDelegatedAmount,
  } = useDelegatedValidators();
  const { mntlUsdValue, errorMntlUsdValue } = useMntlUsd();
  let validatorsArray = allValidators.sort((a, b) => b.tokens - a.tokens);

  //Put all foundation nodes at the end of the array
  validatorsArray.forEach((item, index) => {
    if (item?.description?.moniker?.includes("Foundation Node")) {
      validatorsArray.push(validatorsArray.splice(index, 1)[0]);
    }
  });

  //Create array of validators selected from list
  const selectedDelegations = delegatedValidators
    ?.filter((delegatedObject) =>
      stakeState?.selectedValidators?.includes(
        delegatedObject?.operator_address
      )
    )
    .reduce(
      (accumulator, currentValue) =>
        accumulator + parseFloat(currentValue?.delegatedAmount),
      0
    );

  //Get total delegation amount of all validators selected
  const cumulativeDelegations = errorDelegatedAmount
    ? placeholderTotalDelegations
    : totalDelegatedAmount;

  //Show total delegated amount if no validators selected or show cumulative delegated amount of selected validators
  const delegationsDisplay = stakeState?.selectedValidators?.length
    ? fromDenom(selectedDelegations)
    : fromDenom(cumulativeDelegations);

  const delegationsInUSDDisplay =
    errorDelegatedAmount ||
    errorMntlUsdValue | isNaN(totalDelegatedAmount) ||
    isNaN(parseFloat(mntlUsdValue))
      ? placeholderMntlUsdValue
      : (totalDelegatedAmount * parseFloat(mntlUsdValue)).toFixed(6).toString();

  //Get number of validators delegated to out of selected validators
  const delegatedOutOfSelectedValidators = delegatedValidators?.filter((item) =>
    stakeState?.selectedValidators?.includes(item?.operator_address)
  );

  //Flag to see if the redelegate, undelegate and claim buttons will show up
  const showRedelegateUndelegateAndClaim =
    stakeState?.selectedValidators?.length &&
    delegatedOutOfSelectedValidators?.length > 0;

  const handleRedelegate = async () => {
    // final form validation before txn is

    const { response, error } = await sendRedelegation(
      address,
      stakeState?.redelegationSrc,
      stakeState?.redelegationDestination,
      stakeState?.redelegationAmount,
      stakeState?.memo,
      { getSigningStargateClient }
    );
    console.log("response: ", response, " error: ", error);
  };
  const handleUndelegate = async () => {
    const { response, error } = await sendUndelegation(
      address,
      stakeState?.undelegationSrc,
      stakeState.undelegationAmount.toString(),
      stakeState?.memo,
      { getSigningStargateClient }
    );
    console.log("response:", response, "error:", error);
  };

  return (
    <>
      {stakeState?.selectedValidators?.length ? (
        <p>
          {delegatedOutOfSelectedValidators?.length} out of{" "}
          {stakeState?.selectedValidators?.length} selected are Delegated
          Validators
        </p>
      ) : null}
      <div className="nav-bg p-3 rounded-4 gap-3">
        <div className="d-flex flex-column gap-2">
          {stakeState?.selectedValidators?.length ? (
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
          <p className="caption2">
            {delegationsInUSDDisplay}&nbsp;{"$USD"}
          </p>
          {showRedelegateUndelegateAndClaim &&
          stakeState?.selectedValidators?.length === 1 ? (
            <div className="d-flex justify-content-end">
              <div className="d-flex gap-1 flex-wrap flex-row justify-content-end">
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#viewRedelegatingModal"
                  className="d-flex align-items-center gap-1 am-link text-start caption2"
                  onClick={() => {
                    {
                      stakeDispatch({
                        type: "SET_REDELEGATION_SRC_ADDRESS",
                        payload: stakeState?.selectedValidators[0],
                      });
                    }
                  }}
                >
                  <i className="text-primary bi bi-arrow-clockwise"></i>
                  Redelegate
                </button>
                <button
                  data-bs-toggle="modal"
                  data-bs-target="#viewUndelegatingModal"
                  className="d-flex align-items-center gap-1 am-link text-start caption2"
                  onClick={() =>
                    stakeDispatch({
                      type: "SET_UNDELEGATION_SRC_ADDRESS",
                      payload: stakeState?.selectedValidators[0],
                    })
                  }
                >
                  <i className="text-primary bi bi-arrow-counterclockwise"></i>
                  Undelegate
                </button>
              </div>
            </div>
          ) : null}
        </div>
        {/* Undelegation Modal */}
        <div
          className="modal "
          tabIndex="-1"
          role="dialog"
          id="viewUndelegatingModal"
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            style={{ width: "min(100%,650px)", maxWidth: "min(100%,650px)" }}
          >
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
                      <i className="bi bi-chevron-left" />
                    </span>
                  </button>
                  Undelegate
                </h5>
                <button
                  type="button"
                  className="btn-close primary"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  style={{ background: "none" }}
                >
                  <span className="text-primary">
                    <i className="bi bi-x-lg" />
                  </span>
                </button>
              </div>
              <div className="modal-body p-4 text-center d-flex flex-column">
                <div className="d-flex justify-content-between">
                  <label htmlFor="delegationAmount caption2 mb-1">
                    Undelegate amount
                  </label>
                  <small className="caption2 text-gray">
                    Delegated Amount:
                    {fromDenom(
                      delegatedValidators?.find(
                        (item) =>
                          item?.operator_address === stakeState?.undelegationSrc
                      )?.delegatedAmount
                    )}
                  </small>
                </div>
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
              </div>
              <div className="modal-footer ">
                <button
                  onClick={() => handleUndelegate()}
                  type="button"
                  className="button-primary px-5 py-2"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* {Redelegation Modal} */}
        <div
          className="modal "
          tabIndex="-1"
          role="dialog"
          id="viewRedelegatingModal"
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            style={{ width: "min(100%,650px)", maxWidth: "min(100%,650px)" }}
          >
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
                      <i className="bi bi-chevron-left" />
                    </span>
                  </button>
                  Redelegate
                </h5>
                <button
                  type="button"
                  className="btn-close primary"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  style={{ background: "none" }}
                >
                  <span className="text-primary">
                    <i className="bi bi-x-lg" />
                  </span>
                </button>
              </div>
              <div className="modal-body p-4 text-center d-flex flex-column align-items-start">
                <p className="text-muted caption2 text-gray my-2">
                  Delegate From
                </p>
                <p className="ps-3 my-2 caption2">
                  Validator Name :
                  {
                    delegatedValidators?.find(
                      (item) =>
                        item?.operator_address ===
                        stakeState?.selectedValidators[0]
                    )?.description?.moniker
                  }
                </p>
                <p className="ps-3 my-2 caption2">
                  Delegated Amount:
                  {
                    delegatedValidators?.find(
                      (item) =>
                        item?.operator_address ===
                        stakeState?.selectedValidators[0]
                    )?.delegatedAmount
                  }
                </p>
                <p className="text-muted caption2 text-gray my-2">
                  Delegate to
                </p>
                <div className="nav-bg d-flex flex-column p-2 rounded-3 w-100">
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
                        onChange={(e) => setSearchValue(e.target.value)}
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
                    style={{ overflow: "auto", maxHeight: "300px" }}
                  >
                    <table className="table ">
                      <thead className="bt-0">
                        <tr>
                          <th></th>
                          <th className="text-white no-text-wrap" scope="col">
                            Rank
                          </th>
                          <th scope="col" style={{ whiteSpace: "nowrap" }}></th>
                          <th className="text-white no-text-wrap" scope="col">
                            Validator Name
                          </th>
                          <th className="text-white no-text-wrap" scope="col">
                            Voting Power
                          </th>
                          <th className="text-white no-text-wrap" scope="col">
                            Commission
                          </th>
                          <th className="text-white no-text-wrap" scope="col">
                            Delegations
                          </th>
                          <th className="text-white no-text-wrap" scope="col">
                            Delegated Amt
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeValidators
                          ? validatorsArray
                              ?.filter(
                                (item) =>
                                  item?.status === "BOND_STATUS_BONDED" &&
                                  item?.description?.moniker
                                    .toLowerCase()
                                    .includes(searchValue.toLowerCase())
                              )
                              ?.map((item, index) => (
                                <tr key={index} className="text-white">
                                  <td>
                                    <input
                                      type="radio"
                                      name="radio"
                                      onChange={() =>
                                        stakeDispatch({
                                          type: "SET_REDELEGATION_DESTINATION_ADDRESS",
                                          payload: item?.operator_address,
                                        })
                                      }
                                    />
                                  </td>
                                  <td>{index + 1}</td>
                                  <td>{item?.description?.moniker}</td>
                                  <td>
                                    {(
                                      (item?.tokens * 100) /
                                      totalTokens
                                    ).toFixed(4)}
                                    %
                                  </td>
                                  <td>
                                    {item?.commission?.commission_rates?.rate *
                                      100}
                                    %
                                  </td>
                                  <td>{item?.tokens / 1000000}</td>
                                  <td>{item.delegatedAmount}</td>
                                </tr>
                              ))
                          : validatorsArray
                              ?.filter(
                                (item) =>
                                  item?.status === "BOND_STATUS_UNBONDED" &&
                                  item?.description?.moniker
                                    .toLowerCase()
                                    .includes(searchValue.toLowerCase())
                              )
                              ?.map((item, index) => (
                                <tr key={index} className="text-white">
                                  <td>
                                    <input
                                      type="radio"
                                      name="radio"
                                      onChange={() =>
                                        stakeDispatch({
                                          type: "SET_REDELEGATION_DESTINATION_ADDRESS",
                                          payload: item?.operator_address,
                                        })
                                      }
                                    />
                                  </td>
                                  <td>{index + 1}</td>
                                  <td>
                                    <div
                                      className="d-flex position-relative rounded-circle"
                                      style={{
                                        width: "25px",
                                        aspectRatio: "1/1",
                                      }}
                                    >
                                      <Image
                                        layout="fill"
                                        alt={item?.description?.moniker}
                                        className="rounded-circle"
                                        src={`/validatoravatars/${item?.operator_address}.png`}
                                        // onError={(e) => (e.target.src = "/favicon.png")}
                                      />
                                    </div>
                                  </td>
                                  <td>{item?.description?.moniker}</td>
                                  <td>
                                    {(
                                      (item?.tokens * 100) /
                                      totalTokens
                                    ).toFixed(4)}
                                    %
                                  </td>
                                  <td>
                                    {item?.commission?.commission_rates?.rate *
                                      100}
                                    %
                                  </td>
                                  <td>{item?.tokens / 1000000}</td>
                                  <td>
                                    {item.delegatedAmount
                                      ? item.delegatedAmount
                                      : "-"}
                                  </td>
                                </tr>
                              ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="d-flex justify-content-between w-100 mt-4">
                  <label htmlFor="delegationAmount caption text-gray my-2">
                    Delegation amount
                  </label>{" "}
                  <small className="caption2 text-gray my-2">
                    Delegated Amount :{" "}
                    {fromDenom(
                      delegatedValidators?.find((item) =>
                        item?.operator_address?.includes(
                          stakeState?.selectedValidators
                        )
                      )?.delegatedAmount
                    ).toString()}
                    &nbsp;
                    {defaultChainSymbol}
                  </small>
                </div>
                <div className="p-3 border-white py-2 d-flex rounded-2 gap-2 am-input w-100">
                  <input
                    className="bg-t"
                    id="delegationAmount"
                    style={{ flex: "1", border: "none", outline: "none" }}
                    type="text"
                    value={stakeState?.redelegationAmount}
                    onChange={(e) =>
                      stakeDispatch({
                        type: "CHANGE_REDELEGATION_AMOUNT",
                        payload: e.target.value,
                      })
                    }
                  ></input>
                  <button
                    onClick={() =>
                      stakeDispatch({ type: "SET_MAX_REDELEGATION_AMOUNT" })
                    }
                    className="text-primary"
                  >
                    Max
                  </button>
                </div>
              </div>
              <div className="modal-footer ">
                <button
                  onClick={() => handleRedelegate()}
                  type="button"
                  className="button-primary px-5 py-2"
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
