import { useChain } from "@cosmos-kit/react";
import BigNumber from "bignumber.js";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useReducer, useState } from "react";
import { toast } from "react-toastify";
import ConnectedRecieve from "../components/ConnectedRecieve";
import DisconnecedRecieve from "../components/DisconnecedRecieve";
import ScrollableSectionContainer from "../components/ScrollableSectionContainer";
import Tooltip from "../components/Tooltip";
import {
  defaultChainGasFee,
  defaultChainMemoSize,
  defaultChainName,
  defaultChainSymbol,
  getBalanceStyle,
  toastConfig,
} from "../config";
import {
  formConstants,
  fromChainDenom,
  fromDenom,
  isInvalidAddress,
  placeholderAddress,
  sendTokensTxn,
  toDenom,
  useAvailableBalance,
} from "../data";
import { isObjEmpty } from "../lib";

export default function Transact() {
  // HOOKS
  const [advanced, setAdvanced] = useState(false);
  const { availableBalance } = useAvailableBalance();
  const chainContext = useChain(defaultChainName);
  const { getSigningStargateClient, address, status, getOfflineSigner } =
    chainContext;
  const router = useRouter();
  const { toAddress, toAmount } = router.query;

  useEffect(() => {
    if (toAddress) {
      formDispatch({
        type: "CHANGE_RECIPIENT_ADDRESS",
        payload: toAddress,
      });
    }

    if (toAmount) {
      formDispatch({
        type: "CHANGE_AMOUNT",
        payload: toAmount,
      });
    }

    return () => {};
  }, [toAddress, toAmount]);

  useEffect(() => {
    if (toAddress && formState?.recipientAddress == toAddress) {
      formDispatch({
        type: "CHANGE_RECIPIENT_ADDRESS",
        payload: toAddress,
      });
    }

    if (toAmount && formState?.transferAmount == toAmount) {
      formDispatch({
        type: "CHANGE_AMOUNT",
        payload: toAmount,
      });
    }

    return () => {};
  }, [availableBalance]);

  // FORM REDUCER
  const initialState = {
    recipientAddress: toAddress || "",
    transferAmount: toAmount || "",
    memo: "",
    // all error values -> errorMessages: {recipientAddressErrorMsg: "", transferAmountErrorMsg: "" }
    errorMessages: {},
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
        // if amount is greater than current balance, populate error message and update amount
        if (
          BigNumber(action.payload).isNaN() ||
          BigNumber(action.payload).isLessThanOrEqualTo(0)
        ) {
          return {
            ...state,
            transferAmount: action.payload,
            errorMessages: {
              ...state.errorMessages,
              transferAmountErrorMsg: formConstants.invalidValueErrorMsg,
            },
          };
        } else if (
          BigNumber(availableBalance).isNaN() ||
          BigNumber(toDenom(action.payload))
            .plus(BigNumber(defaultChainGasFee))
            .isGreaterThan(BigNumber(availableBalance))
        ) {
          return {
            ...state,
            transferAmount: action.payload,
            errorMessages: {
              ...state.errorMessages,
              transferAmountErrorMsg: formConstants.insufficientBalanceErrorMsg,
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
          BigNumber(availableBalance).isNaN() ||
          BigNumber(availableBalance)
            .dividedBy(BigNumber(2))
            .isLessThan(BigNumber(defaultChainGasFee))
        ) {
          return {
            ...state,
            transferAmount: (fromDenom(availableBalance) / 2).toString(),
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
            transferAmount: fromDenom(availableBalance),
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

        if (isInvalidAddress(state.recipientAddress)) {
          localErrorMessages = {
            ...localErrorMessages,
            recipientAddressErrorMsg: formConstants.recipientAddressErrorMsg,
          };
        }

        if (!state.transferAmount) {
          localErrorMessages = {
            ...localErrorMessages,
            transferAmountErrorMsg: formConstants.requiredErrorMsg,
          };
        }

        if (BigNumber(state.transferAmount).isNaN()) {
          localErrorMessages = {
            ...localErrorMessages,
            transferAmountErrorMsg: formConstants.invalidValueErrorMsg,
          };
        } else if (
          BigNumber(availableBalance).isNaN() ||
          BigNumber(toDenom(action.payload))
            .plus(BigNumber(defaultChainGasFee))
            .isGreaterThan(BigNumber(availableBalance))
        ) {
          localErrorMessages = {
            ...localErrorMessages,
            transferAmountErrorMsg: formConstants.transferAmountErrorMsg,
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

  // CONFIG FUNCTIONS
  const CustomToastWithLink = ({ txHash }) => (
    <p>
      Transaction Submitted. Check
      <Link href={`https://explorer.assetmantle.one/transactions/${txHash}`}>
        <a style={{ color: "#ffc640" }} target="_blank">
          {" "}
          Here
        </a>
      </Link>
    </p>
  );

  const notify = (txHash, id) => {
    if (txHash) {
      toast.update(id, {
        render: <CustomToastWithLink txHash={txHash} />,
        type: "success",
        isLoading: false,
        toastId: txHash,
        ...toastConfig,
      });
    } else {
      toast.update(id, {
        render: "Transaction failed. Try Again",
        type: "error",
        isLoading: false,
        ...toastConfig,
      });
    }
  };

  // CONTROLLER FUNCTIONS
  const handleSubmit = async (e) => {
    e.preventDefault();
    // copy form states to local variables
    const localRecipientAddress = formState.recipientAddress;
    const localTransferAmount = formState.transferAmount;
    const localMemo = formState.memo;
    formDispatch({
      type: "CHANGE_RECIPIENT_ADDRESS",
      payload: localRecipientAddress,
    });

    formDispatch({
      type: "CHANGE_AMOUNT",
      payload: localTransferAmount,
    });

    const isFormValid =
      formState?.transferAmount &&
      !BigNumber(toDenom(formState.transferAmount)).isNaN() &&
      !BigNumber(availableBalance).isNaN() &&
      BigNumber(availableBalance).isGreaterThan(BigNumber(0)) &&
      BigNumber(toDenom(formState.transferAmount))
        .plus(BigNumber(defaultChainGasFee))
        .isLessThanOrEqualTo(BigNumber(availableBalance)) &&
      formState?.recipientAddress &&
      !isInvalidAddress(formState?.recipientAddress);

    if (isFormValid) {
      const id = toast.loading("Transaction initiated ...", toastConfig);

      const { response, error } = await sendTokensTxn(
        address,
        localRecipientAddress,
        localTransferAmount,
        localMemo,
        { getOfflineSigner }
      );
      formDispatch({ type: "RESET" });

      // reset the form values
      console.log("response: ", response, " error: ", error);
      if (response) {
        notify(response?.transactionHash, id);
      } else {
        notify(null, id);
      }
    }
  };

  // DISPLAY VARIABLES
  const isSubmitDisabled =
    !isObjEmpty(formState?.errorMessages) || status != "Connected";
  const displayAmountValue = formState?.transferAmount;
  const displayAddress = address || placeholderAddress;

  return (
    <>
      <Head>
        <title>Transact | MantleWallet</title>
      </Head>
      <section className="row h-100">
        <ScrollableSectionContainer className="col-8">
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
                  Balance :{" "}
                  {status === "Connected"
                    ? getBalanceStyle(
                        fromChainDenom(availableBalance),
                        "caption",
                        "caption2"
                      )
                    : getBalanceStyle(
                        fromChainDenom(availableBalance),
                        "caption text-gray",
                        "caption2 text-gray"
                      )}
                  &nbsp;
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
                    value={displayAmountValue}
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
                {/* <small
                  id="amountInputErrorMsg"
                  className="form-text text-danger d-flex align-items-center gap-1"
                >
                  {isAmountError && <i className="bi bi-info-circle" />}{" "}
                  {displayAmountErrorMsg}
                </small> */}
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
        <ScrollableSectionContainer className="col-4">
          {status === "Connected" ? (
            <ConnectedRecieve displayAddress={displayAddress} />
          ) : (
            <DisconnecedRecieve />
          )}
        </ScrollableSectionContainer>
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
