import { useChain } from "@cosmos-kit/react";
import Head from "next/head";
import React, { useReducer, useState } from "react";
import ScrollableSectionContainer from "../components/ScrollableSectionContainer";
import Tooltip from "../components/Tooltip";
import {
  defaultChainGasFee,
  defaultChainMemoSize,
  defaultChainName,
  defaultChainSymbol,
} from "../config";
import {
  formConstants,
  fromDenom,
  isInvalidAddress,
  placeholderAddress,
  sendTokensTxn,
  toDenom,
  useAvailableBalance,
} from "../data";
import { isObjEmpty } from "../lib";
import ConnectedRecieve from "../components/ConnectedRecieve";
import DisconnecedRecieve from "../components/DisconnecedRecieve";

export default function Transact() {
  const [advanced, setAdvanced] = useState(false);
  const { availableBalance } = useAvailableBalance();
  const chainContext = useChain(defaultChainName);
  const { getSigningStargateClient, address, status } = chainContext;

  const displayAddress = address ? address : placeholderAddress;

  const initialState = {
    recipientAddress: "",
    transferAmount: "",
    memo: "",
    // all error values -> errorMessages: {recipientAddressErrorMsg: "", transferAmountErrorMsg: "" }
    errorMessages: {},
  };

  const handleSubmit = async (e) => {
    // copy form states to local variables
    const localRecipientAddress = formState.recipientAddress;
    const localTransferAmount = formState.transferAmount;
    const localMemo = formState.memo;
    formDispatch({
      type: "SUBMIT",
    });

    if (formState?.transferAmount && formState?.recipientAddress) {
      const { response, error } = await sendTokensTxn(
        address,
        localRecipientAddress,
        localTransferAmount,
        localMemo,
        { getSigningStargateClient }
      );
      formDispatch({ type: "RESET" });

      // reset the form values
      console.log("response: ", response, " error: ", error);
    }
  };

  const formReducer = (state = initialState, action) => {
    switch (action.type) {
      // handle onChange for Recipient Address Input Box
      case "CHANGE_RECIPIENT_ADDRESS": {
        console.log("inside CHANGE_RECIPIENT_ADDRESS");
        // if invalid address is input, populate error message and updated recipient address
        if (!action.payload) {
          return {
            ...state,
            recipientAddress: action.payload,
            errorMessages: {
              ...state.errorMessages,
              recipientAddressErrorMsg: formConstants.requiredErrorMsg,
            },
          };
        } else if (isInvalidAddress(action.payload)) {
          return {
            ...state,
            recipientAddress: action.payload,
            errorMessages: {
              ...state.errorMessages,
              recipientAddressErrorMsg: formConstants.recipientAddressErrorMsg,
            },
          };
        }
        // if valid address, remove any previous error message set and return updated recipient address
        else {
          // delete the error message key if already exists
          delete state.errorMessages.recipientAddressErrorMsg;
          return {
            ...state,
            recipientAddress: action.payload,
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

      case "SET_HALF_AMOUNT": {
        // if available balance is invalid, set error message
        if (
          isNaN(parseFloat(availableBalance)) ||
          parseFloat(availableBalance) / 2 < parseFloat(defaultChainGasFee)
        ) {
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
          delete state.errorMessages.transferAmountErrorMsg;
          return {
            ...state,
            transferAmount: (fromDenom(availableBalance) / 2).toString(),
          };
        }
      }

      case "SET_MAX_AMOUNT": {
        // if available balance is invalid, set error message
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

      case "CHANGE_MEMO": {
        console.log("inside CHANGE_MEMO");
        // if the memo size limit is exceeded
        console.log("memo: "), state.memo;
        if (action?.payload?.toString()?.length < defaultChainMemoSize) {
          return {
            ...state,
            memo: action.payload,
          };
        } else {
          return {
            ...state,
          };
        }
      }

      case "SUBMIT": {
        // if any required field is blank, set error message
        let localErrorMessages = state?.errorMessages;
        if (!state.recipientAddress) {
          localErrorMessages = {
            ...localErrorMessages,
            recipientAddressErrorMsg: formConstants.requiredErrorMsg,
          };
        }

        if (!state.transferAmount) {
          localErrorMessages = {
            ...localErrorMessages,
            transferAmountErrorMsg: formConstants.invalidValueErrorMsg,
          };
        }

        if (!isObjEmpty(localErrorMessages)) {
          return {
            ...state,
            errorMessages: {
              ...state.errorMessages,
              ...localErrorMessages,
            },
          };
        } else {
          return {
            ...state,
          };
        }
      }

      case "RESET": {
        return { ...initialState };
      }

      default:
        console.log("default case");
    }
  };

  const [formState, formDispatch] = useReducer(formReducer, initialState);

  const [Tab, setTab] = useState(0);
  const tabs = [{ name: "Send", href: "#send" }];

  // DISPLAY VARIABLES
  const isSubmitDisabled =
    !isObjEmpty(formState?.errorMessages) || status != "Connected";

  return (
    <>
      <Head>
        <title>Transact | MantleWallet</title>
      </Head>
      <section className="row h-100">
        <ScrollableSectionContainer className="col-12 col-lg-8">
          <div className="rounded-4 p-3 bg-gray-800 width-100 d-flex flex-column gap-2 transitionAll">
            <nav className="d-flex align-items-center justify-content-between gap-3">
              <div className="d-flex gap-3 align-items-center">
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    className={`body1 ${
                      Tab === index ? "text-primary" : "text-white"
                    }`}
                    onClick={() => setTab(index)}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </nav>
            <div className="nav-bg rounded-4 d-flex flex-column p-3 gap-3">
              <label
                className={
                  status === "Connected"
                    ? "caption d-flex gap-2 align-items-center"
                    : "caption d-flex gap-2 align-items-center text-gray"
                }
                htmlFor="recipientAddress"
              >
                Recipient Address{" "}
                <Tooltip description="Recipient’s address starts with mantle; eg: mantle10x0k7t.....hb34w4a6kbd6" />
              </label>
              <div>
                <input
                  className="bg-t p-3 py-2 rounded-2 am-input w-100"
                  type="text"
                  disabled={status === "Disconnected"}
                  name="recipientAddress"
                  id="recipientAddress"
                  value={formState?.recipientAddress}
                  placeholder="Enter Recipient’s Address"
                  onChange={(e) =>
                    formDispatch({
                      type: "CHANGE_RECIPIENT_ADDRESS",
                      payload: e.target.value,
                    })
                  }
                />
                <small
                  id="addressInputErrorMsg"
                  className="form-text text-danger d-flex align-items-center gap-1"
                >
                  {formState?.errorMessages?.recipientAddressErrorMsg && (
                    <i className="bi bi-info-circle" />
                  )}{" "}
                  {formState?.errorMessages?.recipientAddressErrorMsg}
                </small>
              </div>

              <label
                className={
                  status === "Connected"
                    ? "caption d-flex gap-2 align-items-center"
                    : "caption d-flex gap-2 align-items-center text-gray"
                }
                htmlFor="token"
              >
                Token
              </label>
              <input
                disabled={status === "Disconnected"}
                className={
                  status === "Connected"
                    ? "bg-t p-3 py-2 rounded-2 am-input"
                    : "bg-t p-3 py-2 rounded-2 am-input text-gray"
                }
                type="text"
                name="token"
                id="token"
                readOnly
                value={defaultChainSymbol}
                placeholder="Enter Recipient’s Token"
              />

              <label
                className={
                  status === "Connected"
                    ? "caption d-flex gap-2 align-items-end justify-content-between"
                    : "caption d-flex gap-2 align-items-end justify-content-between text-gray"
                }
                htmlFor="amount"
              >
                Amount{" "}
                <small>
                  Balance : {fromDenom(availableBalance).toString()}&nbsp;
                  {defaultChainSymbol}
                </small>
              </label>

              <div>
                <div className="p-3 py-2 d-flex rounded-2 gap-2 am-input">
                  <input
                    disabled={status === "Disconnected"}
                    className="bg-t"
                    type="number"
                    name="amount"
                    id="amount"
                    value={formState?.transferAmount}
                    placeholder="Enter Amount"
                    style={{ flex: "1", border: "none", outline: "none" }}
                    onChange={(e) =>
                      formDispatch({
                        type: "CHANGE_AMOUNT",
                        payload: e.target.value,
                      })
                    }
                  />
                  <button
                    className="bg-gray-800 p-1 px-2 text-primary"
                    onClick={() =>
                      formDispatch({
                        type: "SET_HALF_AMOUNT",
                      })
                    }
                  >
                    half
                  </button>
                  <button
                    className="bg-gray-800 p-1 px-2 text-primary"
                    onClick={() =>
                      formDispatch({
                        type: "SET_MAX_AMOUNT",
                      })
                    }
                  >
                    max
                  </button>
                </div>
                <small
                  id="amountInputErrorMsg"
                  className="form-text text-danger d-flex align-items-center gap-1"
                >
                  {formState?.errorMessages?.transferAmountErrorMsg && (
                    <i className="bi bi-info-circle" />
                  )}{" "}
                  {formState?.errorMessages?.transferAmountErrorMsg}
                </small>
              </div>

              <button
                className="text-primary d-flex gap-2 align-items-center caption"
                onClick={() => setAdvanced(!advanced)}
              >
                Advanced Details{" "}
                <span
                  className="transitionAll d-flex align-items-center justify-content-center"
                  style={{
                    transform: advanced ? "rotate(180deg)" : "rotate(0deg)",
                    transformOrigin: "center",
                  }}
                >
                  <i className="bi bi-chevron-down" />
                </span>
              </button>
              {advanced && (
                <>
                  <label
                    className="caption d-flex gap-2 align-items-center pt-2"
                    htmlFor="memo"
                  >
                    Memo
                    <Tooltip
                      description="Memo is an optional field & is not the place to insert mnemonic"
                      style={{ right: "-190%" }}
                    />
                  </label>
                  <input
                    className="bg-t p-3 py-2 rounded-2 am-input"
                    disabled={status === "Disconnected"}
                    type="text"
                    name="memo"
                    id="memo"
                    placeholder="Enter Memo"
                    value={formState.memo}
                    onChange={(e) =>
                      formDispatch({
                        type: "CHANGE_MEMO",
                        payload: e.target.value,
                      })
                    }
                  />
                </>
              )}
              <button
                className="btn button-primary px-5 ms-auto"
                type="submit"
                disabled={isSubmitDisabled}
                onClick={handleSubmit}
              >
                Send
              </button>
            </div>
          </div>
        </ScrollableSectionContainer>
        <div className="col-12 pt-3 pt-lg-0 col-lg-4">
          {status === "Connected" ? (
            <ConnectedRecieve displayAddress={displayAddress} />
          ) : (
            <DisconnecedRecieve />
          )}
        </div>
      </section>

      {/* <TransactionManifestModal
        id="transactionManifestModal"
        displayData={[
          { title: "From:", value: address },
          { title: "To:", value: formState.recipientAddress },
          { title: "Amount:", value: formState.transferAmount },
          { title: "Transaction Type", value: "Send" },
          { title: "Wallet Type", value: wallet?.prettyName },
        ]}
        handleSubmit={handleSubmit}
      /> */}
    </>
  );
}
