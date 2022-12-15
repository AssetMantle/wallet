import React, { Suspense, useReducer } from "react";
import Delegations from "../components/Delegations";
import Rewards from "../components/Rewards";
import Unbonded from "../components/Unbonded";
import { formConstants, sendDelegation, toDenom } from "../data";
import { useWallet } from "@cosmos-kit/react";
import { fromDenom, defaultChainSymbol } from "../data";
import { useAvailableBalance } from "../data";
import { defaultChainGasFee } from "../config";

export default function StakedToken({ selectedValidator, totalTokens }) {
  const { availableBalance } = useAvailableBalance();
  const walletManager = useWallet();
  const { getSigningStargateClient, address, status } = walletManager;

  const initialState = {
    recipientAddress: "",
    transferAmount: "",
    memo: "",
    // all error values -> errorMessages: {recipientAddressErrorMsg: "", transferAmountErrorMsg: "" }
    errorMessages: {},
  };

  const formReducer = (state = initialState, action) => {
    switch (action.type) {
      case "SET_MAX_AMOUNT": {
        if (
          isNaN(parseFloat(availableBalance)) ||
          parseFloat(availableBalance) < parseFloat(defaultChainGasFee)
        ) {
          console.log(
            "available balance: ",
            parseFloat(availableBalance),
            " gas: ",
            parseFloat(defaultChainGasFee)
          );
          return {
            ...state,
            transferAmount: 0,
            errorMessages: {
              ...state.errorMessages,
              transferAmountErrorMsg: formConstants.transferAmountErrorMsg,
            },
          };
        }
        // if valid available balance then set half value
        else {
          // delete the error message key if already exists
          delete state.errorMessages?.transferAmountErrorMsg;
          console.log(
            "state error message: ",
            state.errorMessages?.transferAmountErrorMsg
          );
          return {
            ...state,
            transferAmount: fromDenom(
              parseFloat(availableBalance) - parseFloat(defaultChainGasFee)
            ).toString(),
          };
        }
      }
      case "CHANGE_AMOUNT": {
        console.log(
          "inside CHANGE_AMOUNT, action.payload: ",
          toDenom(action.payload) + parseFloat(defaultChainGasFee)
        );
        // if amount is greater than current balance, populate error message and update amount
        if (isNaN(toDenom(action.payload))) {
          return {
            ...state,
            transferAmount: action.payload,
            errorMessages: {
              ...state.errorMessages,
              transferAmountErrorMsg: formConstants.requiredErrorMsg,
            },
          };
        } else if (
          isNaN(parseFloat(availableBalance)) ||
          toDenom(action.payload) + parseFloat(defaultChainGasFee) >
            parseFloat(availableBalance)
        ) {
          return {
            ...state,
            transferAmount: action.payload,
            errorMessages: {
              ...state.errorMessages,
              transferAmountErrorMsg: formConstants.transferAmountErrorMsg,
            },
          };
        }
        // if valid amount, remove any previous error message set and return updated amount
        else {
          // delete the error message key if already exists
          delete state.errorMessages.transferAmountErrorMsg;
          return {
            ...state,
            transferAmount: action.payload,
          };
        }
      }
    }
  };

  const [formState, formDispatch] = useReducer(formReducer, initialState);

  const handleStake = async (validator) => {
    const { response, error } = await sendDelegation(
      dataObject?.delegatorAddress,
      validator,
      { amount: formState.transferAmount.toString(), denom: "umntl" },
      dataObject?.memo,
      { getSigningStargateClient }
    );
    console.log("response: ", response, " error: ", error);
  };
  const dataObject = {
    delegatorAddress: "mantle1jxe2fpgx6twqe7nlxn4g96nej280zcemgqjmk0",
    validatorSrcAddress: "mantlevaloper1qpkax9dxey2ut8u39meq8ewjp6rfsm3hlsyceu",
    validatorDstAddress: "mantlevaloper1p0wy6wdnw05h33rfeavqt3ueh7274hcl420svt",
    amount: 1,
    memo: "yes",
  };

  return (
    <section className="col-12 gap-3 pt-3 pt-lg-0 col-lg-4">
      {!selectedValidator?.length ? (
        <div className="rounded-5 p-3 my-2 bg-gray-800 width-100 d-flex flex-column ">
          <p>Please select the Validators you wish to take actions on.</p>
        </div>
      ) : null}
      <div className="rounded-5 gap-3 p-4 bg-gray-800 width-100 d-flex flex-column">
        <h4 className="body1 text-primary">Staked Tokens</h4>
        <Suspense>
          <Delegations
            totalTokens={totalTokens}
            selectedValidator={selectedValidator || []}
          />
        </Suspense>
        <Suspense>
          <Rewards selectedValidator={selectedValidator || []} />
        </Suspense>
        {!selectedValidator?.length ? (
          <Suspense>
            <Unbonded selectedValidator={selectedValidator || []} />
          </Suspense>
        ) : null}
        {selectedValidator?.length === 1 ? (
          <button
            className="btn btn-primary w-100 rounded-5"
            data-bs-toggle="modal"
            data-bs-target="#delegateModal"
          >
            Delegate
          </button>
        ) : null}
        {selectedValidator?.length > 5 ? (
          <div className="d-flex justify-content-between">
            <i className="bi bi-exclamation-circle text-error"></i>
            <p className="text-error ">
              Culmulative Rewards can be claimed only for 5 or less validators.{" "}
            </p>
          </div>
        ) : null}
        <div className="modal " tabIndex="-1" role="dialog" id="delegateModal">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delegate</h5>
                <button
                  type="button"
                  className="btn-close primary"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-4 text-center d-flex flex-column">
                <div className="d-flex justify-content-between">
                  <label htmlFor="delegationAmount">Delegation amount</label>{" "}
                  <small>
                    Balance : {fromDenom(availableBalance).toString()}&nbsp;
                    {defaultChainSymbol}
                  </small>
                </div>
                <div className="p-3 border-white py-2 d-flex rounded-2 gap-2 am-input">
                  <input
                    className="bg-t"
                    id="delegationAmount"
                    style={{ flex: "1", border: "none", outline: "none" }}
                    type="text"
                    value={formState?.transferAmount}
                    placeholder="Enter Amount"
                    onChange={(e) =>
                      formDispatch({
                        type: "CHANGE_AMOUNT",
                        payload: e.target.value,
                      })
                    }
                  ></input>
                  <button
                    onClick={() =>
                      formDispatch({
                        type: "SET_MAX_AMOUNT",
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
                  onClick={() => handleStake(selectedValidator[0])}
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
    </section>
  );
}
