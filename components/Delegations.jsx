import React, { useReducer, useState } from "react";
import {
  chainSymbol,
  placeholderTotalDelegations,
  placeholderMntlUsdValue,
  defaultChainSymbol,
  defaultChainGasFee,
} from "../config";
import { formConstants, sendRedelegation, sendUndelegation } from "../data";
import {
  useDelegatedValidators,
  useMntlUsd,
  fromDenom,
  useAllValidators,
  useAvailableBalance,
  toDenom,
} from "../data/swrStore";
import { useWallet } from "@cosmos-kit/react";

const denomDisplay = chainSymbol;

const Delegations = ({
  selectedValidator,
  totalTokens,
  selectedUndelegation,
}) => {
  const { availableBalance } = useAvailableBalance();
  const { allValidators, isLoadingValidators, errorValidators } =
    useAllValidators();

  const [activeValidators, setActiveValidators] = useState(true);
  const walletManager = useWallet();
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

  console.log(selectedUndelegation);

  const initialState = {
    recipientAddress: "",
    redelegationSrc: "",
    redelegationDestination: "",
    redelegationAmount: "",
    unedelegationValidator: selectedUndelegation,
    undelegationAmount: "",
    memo: "",
    // all error values -> errorMessages: {recipientAddressErrorMsg: "", undelegationAmountErrorMsg: "" }
    errorMessages: {},
  };

  const formReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_MAX_UNDELEGATION_AMOUNT": {
        const delegatedAmount = delegatedValidators?.find(
          (item) => item?.operator_address === selectedValidator[0]
        )?.delegatedAmount;
        if (
          isNaN(parseFloat(delegatedAmount)) ||
          parseFloat(delegatedAmount) < parseFloat(defaultChainGasFee)
        ) {
          console.log(
            "available balance: ",
            parseFloat(delegatedAmount),
            " gas: ",
            parseFloat(defaultChainGasFee)
          );
          return {
            ...state,
            undelegationAmount: 0,
            errorMessages: {
              ...state.errorMessages,
              undelegationAmountErrorMsg:
                formConstants.undelegationAmountErrorMsg,
            },
          };
        }
        // if valid available balance then set half value
        else {
          // delete the error message key if already exists
          delete state.errorMessages?.undelegationAmountErrorMsg;
          console.log(
            "state error message: ",
            state.errorMessages?.undelegationAmountErrorMsg
          );
          return {
            ...state,
            undelegationAmount: fromDenom(
              parseFloat(delegatedAmount) - parseFloat(defaultChainGasFee)
            ).toString(),
          };
        }
      }

      case "SET_MAX_REDELEGATION_AMOUNT": {
        const delegatedAmount = delegatedValidators?.find(
          (item) => item?.operator_address === selectedValidator[0]
        )?.delegatedAmount;
        if (
          isNaN(parseFloat(delegatedAmount)) ||
          parseFloat(delegatedAmount) < parseFloat(defaultChainGasFee)
        ) {
          console.log(
            "available balance: ",
            parseFloat(delegatedAmount),
            " gas: ",
            parseFloat(defaultChainGasFee)
          );
          return {
            ...state,
            redelegationAmount: 0,
            errorMessages: {
              ...state.errorMessages,
              undelegationAmountErrorMsg:
                formConstants.undelegationAmountErrorMsg,
            },
          };
        }
        // if valid available balance then set half value
        else {
          // delete the error message key if already exists
          delete state.errorMessages?.undelegationAmountErrorMsg;
          console.log(
            "state error message: ",
            state.errorMessages?.undelegationAmountErrorMsg
          );
          return {
            ...state,
            redelegationAmount: fromDenom(
              parseFloat(delegatedAmount) - parseFloat(defaultChainGasFee)
            ).toString(),
          };
        }
      }

      case "CHANGE_UNDELEGATION_AMOUNT": {
        console.log(
          "inside CHANGE_AMOUNT, action.payload: ",
          toDenom(action.payload) + parseFloat(defaultChainGasFee)
        );
        // if amount is greater than current balance, populate error message and update amount
        if (isNaN(toDenom(action.payload))) {
          return {
            ...state,
            undelegationAmount: action.payload,
            errorMessages: {
              ...state.errorMessages,
              undelegationAmountErrorMsg: formConstants.requiredErrorMsg,
            },
          };
        } else if (
          isNaN(parseFloat(availableBalance)) ||
          toDenom(action.payload) + parseFloat(defaultChainGasFee) >
            parseFloat(availableBalance)
        ) {
          return {
            ...state,
            undelegationAmount: action.payload,
            errorMessages: {
              ...state.errorMessages,
              undelegationAmountErrorMsg:
                formConstants.undelegationAmountErrorMsg,
            },
          };
        }
        // if valid amount, remove any previous error message set and return updated amount
        else {
          // delete the error message key if already exists
          delete state.errorMessages.undelegationAmountErrorMsg;
          return {
            ...state,
            undelegationAmount: action.payload,
          };
        }
      }
      case "SET_REDELEGATION_DESTINATION_ADDRESS": {
        console.log(
          "inside SET_REDELEGATION_DESTINATION_ADDRESS, action.payload: ",
          action.payload
        );
        return {
          ...state,
          redelegationDestination: action.payload,
        };
      }
      case "SET_REDELEGATION_SRC_ADDRESS": {
        console.log(
          "inside SET_SRC_DESTINATION_ADDRESS, action.payload: ",
          action.payload
        );
        return {
          ...state,
          redelegationSrc: action.payload,
        };
      }
      case "CHANGE_REDELEGATION_AMOUNT": {
        console.log(
          "inside CHANGE_REDELEGATION_AMOUNT, action.payload: ",
          toDenom(action.payload) + parseFloat(defaultChainGasFee)
        );
        // if amount is greater than current balance, populate error message and update amount
        if (
          isNaN(parseFloat(availableBalance)) ||
          toDenom(action.payload) + parseFloat(defaultChainGasFee) >
            parseFloat(availableBalance)
        ) {
          return {
            ...state,
            undelegationAmount: action.payload,
            errorMessages: {
              ...state.errorMessages,
              undelegationAmountErrorMsg:
                formConstants.undelegationAmountErrorMsg,
            },
          };
        }
        // if valid amount, remove any previous error message set and return updated amount
        else {
          // delete the error message key if already exists
          delete state.errorMessages.undelegationAmountErrorMsg;
          return {
            ...state,
            redelegationAmount: action.payload,
          };
        }
      }
    }
  };
  const [formState, formDispatch] = useReducer(formReducer, initialState);

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
    selectedValidator?.includes(item?.operator_address)
  );

  //Flag to see if the redelegate, undelegate and claim buttons will show up
  const showRedelegateUndelegateAndClaim =
    selectedValidator.length && delegatedOutOfSelectedValidators.length > 0;

  const handleRedelegate = async () => {
    // final form validation before txn is initiated
    formDispatch({
      type: "SUBMIT",
    });

    const { response, error } = await sendRedelegation(
      address,
      formState?.redelegationSrc,
      formState?.redelegationDestination,
      formState?.redelegationAmount,
      formState?.memo,
      { getSigningStargateClient }
    );
    console.log("response: ", response, " error: ", error);
  };
  const handleUndelegate = async (validator) => {
    const { response, error } = await sendUndelegation(
      address,
      validator,
      formState.undelegationAmount.toString(),
      formState?.memo,
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
                  data-bs-toggle="modal"
                  data-bs-target="#viewRedelegatingModal"
                  className="am-link text-start"
                  onClick={() => {
                    {
                      formDispatch({
                        type: "SET_REDELEGATION_SRC_ADDRESS",
                        payload: selectedValidator[0],
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
                  className="am-link text-start"
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
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Undelegate</h5>
                <button
                  type="button"
                  className="btn-close primary"
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
                        (item) =>
                          item?.operator_address === selectedValidator[0]
                      )?.delegatedAmount
                    )}
                  </small>
                </div>
                <div className="p-3 border-white py-2 d-flex rounded-2 gap-2 am-input">
                  <input
                    className="bg-t"
                    id="delegationAmount"
                    style={{ flex: "1", border: "none", outline: "none" }}
                    value={formState?.undelegationAmount}
                    type="text"
                    onChange={(e) =>
                      formDispatch({
                        type: "CHANGE_UNDELEGATION_AMOUNT",
                        payload: e.target.value,
                      })
                    }
                  ></input>
                  <button
                    onClick={() =>
                      formDispatch({
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
                  onClick={() => handleUndelegate(selectedValidator[0])}
                  type="button"
                  className="btn btn-primary"
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
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Redelegate</h5>
                <button
                  type="button"
                  className="btn-close primary"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-4 text-center d-flex flex-column align-items-start">
                <p className="text-muted">Delegate From</p>
                <p>
                  Validator Name :
                  {
                    delegatedValidators?.find(
                      (item) => item?.operator_address === selectedValidator[0]
                    )?.description?.moniker
                  }
                </p>
                <p>
                  Delegated Amount:
                  {
                    delegatedValidators?.find(
                      (item) => item?.operator_address === selectedValidator[0]
                    )?.delegatedAmount
                  }
                </p>
                <p className="text-muted">Delegate to</p>
                <div className="input-group d-flex">
                  <span className="input-group-text" id="basic-addon1">
                    <i className="bi bi-search text-primary"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                    aria-label="Search"
                  ></input>
                  <div className="btn-group">
                    <button
                      className={
                        activeValidators
                          ? "btn btn-primary"
                          : "btn btn-inactive"
                      }
                      onClick={() => setActiveValidators(true)}
                    >
                      Active
                    </button>
                    <button
                      className={
                        !activeValidators
                          ? "btn btn-primary"
                          : "btn btn-inactive"
                      }
                      onClick={() => setActiveValidators(false)}
                    >
                      Inactive
                    </button>
                  </div>
                </div>
                <table className="table nav-bg">
                  <thead>
                    <tr>
                      <th></th>
                      <th className="text-white" scope="col">
                        Rank
                      </th>
                      <th className="text-white" scope="col">
                        Validator Name
                      </th>
                      <th className="text-white" scope="col">
                        Voting Power
                      </th>
                      <th className="text-white" scope="col">
                        Commission
                      </th>
                      <th className="text-white" scope="col">
                        Delegations
                      </th>
                      <th className="text-white" scope="col">
                        Delegated Amt
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeValidators
                      ? validatorsArray
                          ?.filter(
                            (item) => item?.status === "BOND_STATUS_BONDED"
                          )
                          ?.map((item, index) => (
                            <tr key={index} className="text-white">
                              <td>
                                <input
                                  type="radio"
                                  name="radio"
                                  onChange={() =>
                                    formDispatch({
                                      type: "SET_REDELEGATION_DESTINATION_ADDRESS",
                                      payload: item?.operator_address,
                                    })
                                  }
                                />
                              </td>
                              <td>{index + 1}</td>
                              <td>{item?.description?.moniker}</td>
                              <td>
                                {((item?.tokens * 100) / totalTokens).toFixed(
                                  4
                                )}
                                %
                              </td>
                              <td>
                                {item?.commission?.commission_rates?.rate * 100}
                                %
                              </td>
                              <td>{item?.tokens / 1000000}</td>
                              <td>{item.delegatedAmount}</td>
                            </tr>
                          ))
                      : validatorsArray
                          ?.filter(
                            (item) => item?.status === "BOND_STATUS_UNBONDED"
                          )
                          ?.map((item, index) => (
                            <tr key={index} className="text-white">
                              <td>
                                <input
                                  type="radio"
                                  name="radio"
                                  onChange={() =>
                                    formDispatch({
                                      type: "SET_REDELEGATION_DESTINATION_ADDRESS",
                                      payload: item?.operator_address,
                                    })
                                  }
                                />
                              </td>
                              <td>{index + 1}</td>
                              <td>{item?.description?.moniker}</td>
                              <td>
                                {((item?.tokens * 100) / totalTokens).toFixed(
                                  4
                                )}
                                %
                              </td>
                              <td>
                                {item?.commission?.commission_rates?.rate * 100}
                                %
                              </td>
                              <td>{item?.tokens / 1000000}</td>
                              <td>{item.delegatedAmount}</td>
                            </tr>
                          ))}
                  </tbody>
                </table>
                <div className="d-flex justify-content-between">
                  <label htmlFor="delegationAmount">Delegation amount</label>{" "}
                  <small>
                    Delegated Amount :{" "}
                    {fromDenom(
                      delegatedValidators?.find((item) =>
                        item?.operator_address.includes(selectedValidator)
                      )?.delegatedAmount
                    ).toString()}
                    &nbsp;
                    {defaultChainSymbol}
                  </small>
                </div>
                <div className="p-3 border-white py-2 d-flex rounded-2 gap-2 am-input">
                  <input
                    className="bg-t"
                    id="delegationAmount"
                    style={{ flex: "1", border: "none", outline: "none" }}
                    type="text"
                    value={formState?.redelegationAmount}
                    onChange={(e) =>
                      formDispatch({
                        type: "CHANGE_REDELEGATION_AMOUNT",
                        payload: e.target.value,
                      })
                    }
                  ></input>
                  <button
                    onClick={() =>
                      formDispatch({ type: "SET_MAX_REDELEGATION_AMOUNT" })
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
