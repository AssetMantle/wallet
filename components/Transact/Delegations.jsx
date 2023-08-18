import { useChain } from "@cosmos-kit/react";
import BigNumber from "bignumber.js";
import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  defaultChainName,
  defaultChainSymbol,
  getBalanceStyle,
  toastConfig,
  usdSymbol,
} from "../../config";
import {
  decimalize,
  fromChainDenom,
  fromDenom,
  sendRedelegation,
  sendUndelegation,
  useAllValidators,
  useAllValidatorsBonded,
  useAllValidatorsUnbonded,
  useDelegatedValidators,
  useMntlUsd,
} from "../../data";
import { shiftDecimalPlaces } from "../../lib";
import { Button, Modal, Stack } from "react-bootstrap";

const denomDisplay = defaultChainSymbol;

const Delegations = ({ totalTokens, stakeState, stakeDispatch, notify }) => {
  const { allValidators } = useAllValidators();
  const { allValidatorsBonded } = useAllValidatorsBonded();
  const { allValidatorsUnbonded } = useAllValidatorsUnbonded();

  const [searchValue, setSearchValue] = useState("");
  const [activeValidators, setActiveValidators] = useState(true);
  const walletManager = useChain(defaultChainName);
  const { getSigningStargateClient, address, status } = walletManager;
  const { delegatedValidators, totalDelegatedAmount } =
    useDelegatedValidators();
  const { mntlUsdValue } = useMntlUsd();
  let validatorsArray = allValidators.sort((a, b) => b.tokens - a.tokens);

  const isConnected = status == "Connected";

  // modal handler

  const [ReDelegateModal, setReDelegateModal] = useState(false);
  const [UnDelegateModal, setUnDelegateModal] = useState(false);

  //Put all foundation nodes at the end of the array
  validatorsArray.forEach((item, index) => {
    if (item?.description?.moniker?.includes("Foundation Node")) {
      validatorsArray.push(validatorsArray.splice(index, 1)[0]);
    }
  });

  //Create array of validators selected from list
  const selectedDelegationsArray = delegatedValidators?.filter(
    (delegatedObject) =>
      stakeState?.selectedValidators?.includes(delegatedObject?.operatorAddress)
  );

  const selectedDelegations = selectedDelegationsArray?.reduce(
    (accumulator, currentValue) =>
      BigNumber(accumulator)
        .plus(BigNumber(currentValue?.delegatedAmount || 0))
        .toString(),
    "0"
  );

  //Show total delegated amount if no validators selected or show cumulative delegated amount of selected validators
  const delegationsValue = stakeState?.selectedValidators?.length
    ? selectedDelegations
    : totalDelegatedAmount;

  const delegationsDisplay = isConnected
    ? getBalanceStyle(fromChainDenom(delegationsValue), "caption", "caption2")
    : getBalanceStyle(
        fromChainDenom(delegationsValue),
        "caption text-body",
        "caption2 text-body"
      );

  const delegationsInUSD = BigNumber(fromDenom(delegationsValue))
    .multipliedBy(BigNumber(mntlUsdValue || 0))
    .toString();

  const delegationsInUSDDisplay = isConnected
    ? getBalanceStyle(decimalize(delegationsInUSD), "caption2 ", "small")
    : getBalanceStyle(
        decimalize(delegationsInUSD),
        "caption2 text-body",
        "small text-body"
      );

  //Get number of validators delegated to out of selected validators
  const delegatedOutOfSelectedValidators = delegatedValidators?.filter((item) =>
    stakeState?.selectedValidators?.includes(item?.operatorAddress)
  );

  //Flag to see if the redelegate, undelegate and claim buttons will show up
  const showRedelegateUndelegateAndClaim =
    stakeState?.selectedValidators?.length &&
    delegatedOutOfSelectedValidators?.length > 0;

  const handleRedelegate = async (e) => {
    // final form validation before txn is
    e.preventDefault();
    stakeDispatch({ type: "SUBMIT_REDELEGATE" });
    if (stakeState?.redelegationAmount && stakeState?.redelegationDestination) {
      setReDelegateModal(false);
      const id = toast.loading("Transaction initiated ...", toastConfig);
      const { response, error } = await sendRedelegation(
        address,
        stakeState?.redelegationSrc,
        stakeState?.redelegationDestination,
        stakeState?.redelegationAmount,
        stakeState?.memo,
        { getSigningStargateClient }
      );
      stakeDispatch({ type: "RESET_REDELEGATE" });
      console.log("response: ", response, " error: ", error);
      if (response) {
        notify(response?.transactionHash, id);
      } else {
        notify(null, id);
      }
    }
  };

  const handleUndelegate = async (e) => {
    e.preventDefault();
    stakeDispatch({ type: "SUBMIT_UNDELEGATE" });
    if (stakeState?.undelegationAmount) {
      setUnDelegateModal(false);
      const id = toast.loading("Transaction initiated ...", toastConfig);
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

  // controller for onError
  const handleOnError = (e) => {
    e.preventDefault();
    // console.log("e: ", e);
    e.target.src = "/validatorAvatars/alt.png";
  };

  return (
    <>
      {stakeState?.selectedValidators?.length ? (
        <p className="text-body-emphasis m-0">
          {delegatedOutOfSelectedValidators?.length} out of{" "}
          {stakeState?.selectedValidators?.length} selected are Delegated
          Validators
        </p>
      ) : null}
      <div className="bg-black p-3 rounded-4 gap-3">
        <Stack className="" gap={2}>
          {stakeState?.selectedValidators?.length ? (
            <p className="caption d-flex gap-2 align-items-center m-0">
              Selected Delegations
            </p>
          ) : (
            <p
              className={`caption d-flex gap-2 align-items-center m-0 ${
                isConnected ? `` : `text-body`
              }`}
            >
              {" "}
              Cumulative Delegations
            </p>
          )}
          <p className={`caption m-0 ${isConnected ? "" : "text-body"}`}>
            {delegationsDisplay}
            &nbsp;{denomDisplay}
          </p>
          <p className={`caption2 m-0 ${isConnected ? "" : "text-body"}`}>
            {delegationsInUSDDisplay}
            &nbsp;{usdSymbol}
          </p>
          {showRedelegateUndelegateAndClaim &&
          stakeState?.selectedValidators?.length === 1 ? (
            // <Stack direction="horizontal" className="justify-content-end">
            <Stack
              direction="horizontal"
              className="flex-wrap flex-row justify-content-end"
              gap={1}
            >
              <button
                className="d-flex align-items-center gap-1 am-link text-start caption2 text-primary"
                onClick={() => {
                  {
                    stakeDispatch({
                      type: "SET_REDELEGATION_SRC_ADDRESS",
                      payload: stakeState?.selectedValidators[0],
                    });
                    setReDelegateModal(true);
                  }
                }}
              >
                <i className="text-primary bi bi-arrow-clockwise"></i>
                Redelegate
              </button>
              <button
                className="d-flex align-items-center gap-1 am-link text-start caption2 text-primary"
                onClick={() => {
                  stakeDispatch({
                    type: "SET_UNDELEGATION_SRC_ADDRESS",
                    payload: stakeState?.selectedValidators[0],
                  });
                  setUnDelegateModal(true);
                }}
              >
                <i className="text-primary bi bi-arrow-counterclockwise"></i>
                Undelegate
              </button>
            </Stack>
          ) : // {/* </Stack> */}
          null}
        </Stack>
        {/* Undelegation Modal */}
        {
          <Modal
            show={UnDelegateModal}
            onHide={() => setUnDelegateModal(false)}
            centered
            size="md"
            aria-labelledby="undelegation-modal"
          >
            <Modal.Body className="p-0">
              <Stack className="bg-gray-700 m-auto p-4 rounded-3 w-100">
                <Stack
                  className="align-items-center justify-content-between"
                  direction="horizontal"
                >
                  <h5 className="body2 text-primary d-flex align-items-center gap-2 m-0">
                    <button
                      className="primary bg-transparent"
                      onClick={() => setUnDelegateModal(false)}
                    >
                      <i className="bi bi-chevron-left text-primary" />
                    </button>
                    Undelegate
                  </h5>
                  <button
                    className="primary bg-transparent"
                    onClick={() => setUnDelegateModal(false)}
                  >
                    <i className="bi bi-x-lg text-primary" />
                  </button>
                </Stack>
                <Stack className="py-4 text-center" gap={1}>
                  <Stack
                    className="justify-content-between"
                    direction="horizontal"
                  >
                    <label htmlFor="delegationAmount" className="caption2 mb-1">
                      Undelegate amount
                    </label>
                    <small className="caption2 text-body">
                      Delegated Amount:{" "}
                      {getBalanceStyle(
                        fromChainDenom(
                          delegatedValidators?.find(
                            (item) =>
                              item?.operatorAddress ===
                              stakeState?.undelegationSrc
                          )?.delegatedAmount
                        ),
                        "caption2 text-body",
                        "small text-body"
                      )}
                    </small>
                  </Stack>
                  <div>
                    <Stack
                      className="p-3 border-white py-2 rounded-2 border border-white"
                      direction="horizontal"
                      gap={2}
                    >
                      <input
                        className="bg-transparent flex-grow-1 border border-0"
                        id="delegationAmount"
                        style={{ outline: "none" }}
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
                    </Stack>
                    <small
                      id="amountInputErrorMsg"
                      className="form-text text-danger d-flex align-items-center gap-1"
                    >
                      {stakeState?.errorMessages
                        ?.undelegationAmountErrorMsg && (
                        <i className="bi bi-info-circle" />
                      )}{" "}
                      {stakeState?.errorMessages?.undelegationAmountErrorMsg}
                    </small>
                  </div>
                </Stack>
                <Stack
                  className="align-items-center justify-content-end"
                  gap={2}
                  direction="horizontal"
                >
                  <Button
                    variant="primary"
                    disabled={
                      stakeState?.errorMessages?.undelegationAmountErrorMsg
                    }
                    className="rounded-5 px-5 py-2 fw-medium"
                    onClick={handleUndelegate}
                  >
                    Submit
                  </Button>
                </Stack>
              </Stack>
            </Modal.Body>
          </Modal>
        }
        {/* {Redelegation Modal} */}
        <Modal
          show={ReDelegateModal}
          onHide={() => setReDelegateModal(false)}
          centered
          size="lg"
          aria-labelledby="redelegation-modal"
          scrollable
        >
          <Modal.Body className="p-0">
            <Stack className="bg-gray-700 m-auto p-4 rounded-3 w-100">
              <Stack
                className="align-items-center justify-content-between"
                direction="horizontal"
              >
                <h5 className="body2 text-primary d-flex align-items-center gap-2 m-0">
                  <button
                    className="primary bg-transparent"
                    onClick={() => setReDelegateModal(false)}
                    style={{ background: "none" }}
                  >
                    <i className="bi bi-chevron-left text-primary" />
                  </button>
                  Redelegate
                </h5>
                <button
                  className="primary bg-transparent"
                  onClick={() => setReDelegateModal(false)}
                  style={{ background: "none" }}
                >
                  <i className="bi bi-x-lg text-primary" />
                </button>
              </Stack>
              <Stack className="py-4 text-center align-items-start">
                <p className="text-muted caption2 text-body m-0 my-2">
                  Delegate From
                </p>{" "}
                <Stack
                  className="align-items-center"
                  gap={2}
                  direction="horizontal"
                >
                  <p className="ps-3 caption2 m-0">Validator Name: </p>
                  <div
                    className="d-flex justify-content-around position-relative rounded-circle"
                    style={{ width: "20px", aspectRatio: "1/1" }}
                  >
                    <img
                      layout="fill"
                      alt={
                        delegatedValidators?.find(
                          (item) =>
                            item?.operatorAddress ===
                            stakeState?.selectedValidators[0]
                        )?.description?.moniker
                      }
                      className="rounded-circle w-100 h-auto"
                      src={`/validatorAvatars/${
                        delegatedValidators?.find(
                          (item) =>
                            item?.operatorAddress ===
                            stakeState?.selectedValidators[0]
                        )?.operatorAddress
                      }.png`}
                      onError={handleOnError}
                    />
                  </div>
                  <a
                    href={`https://explorer.assetmantle.one/validators/${
                      delegatedValidators?.find(
                        (item) =>
                          item?.operatorAddress ===
                          stakeState?.selectedValidators[0]
                      )?.operatorAddress
                    }`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {
                      delegatedValidators?.find(
                        (item) =>
                          item?.operatorAddress ===
                          stakeState?.selectedValidators[0]
                      )?.description?.moniker
                    }
                  </a>
                </Stack>
                <p className="ps-3 m-0 my-2 caption2">
                  Delegated Amount:{" "}
                  {getBalanceStyle(
                    fromChainDenom(
                      delegatedValidators?.find(
                        (item) =>
                          item?.operatorAddress ===
                          stakeState?.selectedValidators[0]
                      )?.delegatedAmount
                    ),
                    "caption",
                    "caption2"
                  )}
                </p>
                <p className="text-muted caption2 text-body m-0 my-2">
                  Delegate To
                </p>
                <Stack className="bg-black p-2 rounded-3 w-100">
                  <Stack
                    className="align-items-center justify-content-between my-2 w-100"
                    gap={3}
                    direction="horizontal"
                  >
                    <Stack
                      className="border border-white rounded-3 py-1 px-3 align-items-center"
                      direction="horizontal"
                      gap={2}
                      style={{ flex: "1" }}
                    >
                      <i className="bi bi-search text-primary"></i>
                      <input
                        type="search"
                        className="bg-transparent p-1 w-100 h-100"
                        placeholder="Search"
                        aria-label="Search"
                        style={{ border: "none" }}
                        onChange={(e) => setSearchValue(e.target.value)}
                      />
                    </Stack>
                    <div className="btn-group">
                      <Button
                        variant={`${
                          activeValidators ? "primary" : "outline-light"
                        }`}
                        className={`fw-medium ${
                          activeValidators ? "text-dark" : ""
                        } caption`}
                        onClick={() => setActiveValidators(true)}
                      >
                        Active
                      </Button>
                      <Button
                        variant={`${
                          !activeValidators ? "primary" : "outline-light"
                        }`}
                        className={`fw-medium ${
                          !activeValidators ? "text-dark" : ""
                        } caption`}
                        onClick={() => setActiveValidators(false)}
                      >
                        Inactive
                      </Button>
                    </div>
                  </Stack>
                  <Stack
                    className="w-100 mt-3 overflow-auto"
                    style={{ maxHeight: "300px" }}
                  >
                    <table
                      className="table"
                      style={{ width: "max-content", minWidth: "100%" }}
                    >
                      <thead
                        className="bt-0 top-0 bg-black"
                        style={{
                          zIndex: "200",
                        }}
                      >
                        <tr>
                          <th></th>
                          <th className="text-white text-wrap " scope="col">
                            Rank
                          </th>
                          {/* <th></th> */}
                          <th
                            className="text-white text-wrap "
                            scope="col"
                            colSpan={2}
                          >
                            Validator Name
                          </th>
                          <th className="text-white text-wrap " scope="col">
                            Voting Power
                          </th>
                          <th className="text-white text-wrap " scope="col">
                            Commission
                          </th>
                          <th className="text-white text-wrap " scope="col">
                            Delegations
                          </th>
                          <th className="text-white text-wrap " scope="col">
                            Delegated Amount
                          </th>
                          {activeValidators ? null : (
                            <th className="text-white text-wrap " scope="col">
                              Jailed
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {activeValidators
                          ? allValidatorsBonded
                              ?.sort((a, b) => b.tokens - a.tokens)
                              ?.filter((item) =>
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
                                      className="radio-btn"
                                      onChange={() =>
                                        stakeDispatch({
                                          type: "SET_REDELEGATION_DESTINATION_ADDRESS",
                                          payload: item?.operatorAddress,
                                        })
                                      }
                                    />
                                  </td>
                                  <td>{index + 1}</td>
                                  <td>
                                    {" "}
                                    <div
                                      className="d-flex position-relative rounded-circle"
                                      style={{
                                        width: "25px",
                                        aspectRatio: "1/1",
                                      }}
                                    >
                                      <img
                                        layout="fill"
                                        alt={item?.description?.moniker}
                                        className="rounded-circle"
                                        src={`/validatorAvatars/${item?.operatorAddress}.png`}
                                        onError={handleOnError}
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    {" "}
                                    <a
                                      href={`https://explorer.assetmantle.one/validators/${item.operatorAddress}`}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {item?.description?.moniker}
                                      <i className="bi bi-arrow-up-right" />
                                    </a>
                                  </td>
                                  <td>
                                    {(
                                      (item?.tokens * 100) /
                                      totalTokens
                                    ).toFixed(4)}
                                    %
                                  </td>

                                  <td>
                                    {shiftDecimalPlaces(
                                      item?.commission?.commissionRates?.rate,
                                      -16
                                    )}{" "}
                                    %
                                  </td>
                                  <td>
                                    {getBalanceStyle(
                                      fromChainDenom(item?.tokens, 2),
                                      "caption",
                                      "caption2"
                                    )}
                                  </td>
                                  <td>
                                    {" "}
                                    {delegatedValidators?.find(
                                      (element) =>
                                        element?.operatorAddress ==
                                        item?.operatorAddress
                                    )
                                      ? getBalanceStyle(
                                          fromChainDenom(
                                            delegatedValidators?.find(
                                              (element) =>
                                                element?.operatorAddress ==
                                                item?.operatorAddress
                                            )?.delegatedAmount
                                          ),
                                          "caption",
                                          "caption2"
                                        )
                                      : "-"}
                                  </td>
                                </tr>
                              ))
                          : allValidatorsUnbonded
                              ?.filter((item) =>
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
                                          payload: item?.operatorAddress,
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
                                      <img
                                        layout="fill"
                                        alt={item?.description?.moniker}
                                        className="rounded-circle"
                                        src={`/validatorAvatars/${item?.operatorAddress}.png`}
                                        onError={handleOnError}
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    {" "}
                                    <a
                                      href={`https://explorer.assetmantle.one/validators/${item.operatorAddress}`}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {item?.description?.moniker}
                                      <i className="bi bi-arrow-up-right" />
                                    </a>
                                  </td>
                                  <td>
                                    {(
                                      (item?.tokens * 100) /
                                      totalTokens
                                    ).toFixed(4)}
                                    %
                                  </td>

                                  <td>
                                    {shiftDecimalPlaces(
                                      item?.commission?.commissionRates?.rate,
                                      -16
                                    )}{" "}
                                    %
                                  </td>
                                  <td>
                                    {getBalanceStyle(
                                      fromChainDenom(item?.tokens, 2),
                                      "caption",
                                      "caption2"
                                    )}
                                  </td>
                                  <td>
                                    {delegatedValidators?.find(
                                      (element) =>
                                        element?.operatorAddress ==
                                        item?.operatorAddress
                                    )
                                      ? getBalanceStyle(
                                          fromChainDenom(
                                            delegatedValidators?.find(
                                              (element) =>
                                                element?.operatorAddress ==
                                                item?.operatorAddress
                                            )?.delegatedAmount
                                          ),
                                          "caption",
                                          "caption2"
                                        )
                                      : "-"}
                                  </td>
                                  <td>
                                    {item?.jailed ? (
                                      <i className="bi bi-exclamation-octagon text-danger"></i>
                                    ) : (
                                      "-"
                                    )}
                                  </td>
                                </tr>
                              ))}
                      </tbody>
                    </table>
                  </Stack>
                </Stack>
                <Stack
                  className="justify-content-between w-100 mt-4"
                  direction="horizontal"
                >
                  <label
                    htmlFor="redelegationAmount"
                    className="caption text-white-50 my-2"
                  >
                    Delegation amount
                  </label>{" "}
                  <small className="caption2 text-white-50 my-2">
                    Delegated Amount :{" "}
                    {getBalanceStyle(
                      fromChainDenom(
                        delegatedValidators?.find((item) =>
                          item?.operatorAddress?.includes(
                            stakeState?.selectedValidators
                          )
                        )?.delegatedAmount
                      ),
                      "caption2 text-white-50",
                      "small text-white-50"
                    )}
                    &nbsp;
                    {defaultChainSymbol}
                  </small>
                </Stack>
                <div className="w-100">
                  <Stack
                    direction="horizontal"
                    gap={2}
                    className="p-3 border border-white py-2 rounded-2"
                  >
                    <input
                      className="bg-transparent"
                      id="redelegationAmount"
                      style={{
                        flex: "1",
                        border: "none",
                        outline: "none",
                      }}
                      type="text"
                      value={stakeState?.redelegationAmount}
                      placeholder="Enter Redelegation Amount"
                      onChange={(e) =>
                        stakeDispatch({
                          type: "CHANGE_REDELEGATION_AMOUNT",
                          payload: e.target.value,
                        })
                      }
                    />
                    <button
                      onClick={() =>
                        stakeDispatch({ type: "SET_MAX_REDELEGATION_AMOUNT" })
                      }
                      className="text-primary"
                    >
                      Max
                    </button>
                  </Stack>
                  <small
                    id="amountInputErrorMsg"
                    className="form-text text-danger d-flex align-items-center gap-1"
                  >
                    {stakeState?.errorMessages?.redelegationAmountErrorMsg && (
                      <i className="bi bi-info-circle" />
                    )}{" "}
                    {stakeState?.errorMessages?.redelegationAmountErrorMsg}
                  </small>
                </div>
              </Stack>
              <Stack
                className="align-items-center justify-content-end"
                direction="horizontal"
                gap={2}
              >
                <Button
                  variant="primary"
                  disabled={
                    stakeState?.errorMessages?.redelegationAmountErrorMsg
                  }
                  className="rounded-5 px-5 py-2 fw-medium"
                  onClick={handleRedelegate}
                >
                  Submit
                </Button>
              </Stack>
            </Stack>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
};

export default Delegations;
