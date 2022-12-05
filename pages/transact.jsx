import Image from "next/image";
import React, { useReducer, useState } from "react";
import { MdOutlineContentCopy } from "react-icons/md";
import { chainGasFee, chainSymbol } from "../config";
import {
  formConstants,
  fromDenom,
  isInvalidAddress,
  toDenom,
  useAvailableBalance,
} from "../data";
import { isObjEmpty } from "../lib";
import { BsChevronDown } from "react-icons/bs";

export default function Transact() {
  const [advanced, setAdvanced] = useState(false);
  const { availableBalance } = useAvailableBalance();

  const initialState = {
    recipientAddress: "",
    transferAmount: "",
    // all error values -> errorMessages: {recipientAddressErrorMsg: "", transferAmountErrorMsg: "" }
    errorMessages: {},
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    formDispatch({
      type: "SUBMIT",
    });
    console.log("inside handleSubmit()");
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
          toDenom(action.payload) + parseFloat(chainGasFee)
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
          toDenom(action.payload) + parseFloat(chainGasFee) >
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
          parseFloat(availableBalance) / 2 < parseFloat(chainGasFee)
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
          parseFloat(availableBalance) < parseFloat(chainGasFee)
        ) {
          console.log(
            "available balance: ",
            parseFloat(availableBalance),
            " gas: ",
            parseFloat(chainGasFee)
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
              parseFloat(availableBalance) - parseFloat(chainGasFee)
            ).toString(),
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
            transferAmountErrorMsg: formConstants.requiredErrorMsg,
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

      default:
        console.log("default case");
    }
  };

  const [formState, formDispatch] = useReducer(formReducer, initialState);

  const [Tab, setTab] = useState(0);
  const tabs = [{ name: "Send", href: "#send" }];

  const WalletQrCode = "/qr-code.svg";
  const WalletAddress = "ThequickbrownfoxjumpsoverthelazydogfIfthedogr";

  return (
    <section className="row">
      <div className="col-12 col-lg-8">
        <div className="rounded-4 p-3 bg-gray-800 width-100 d-flex flex-column gap-2 transitionAll">
          <nav className="d-flex align-items-center justify-content-between gap-3">
            <div className="d-flex gap-3 align-items-center">
              {tabs.map((tab, index) => (
                <button
                  key={index}
                  className={`am-link ${
                    Tab === index ? "" : "text-white"
                  } body2`}
                  onClick={() => setTab(index)}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </nav>
          <div className="nav-bg rounded-4 d-flex flex-column p-3 gap-3">
            <label
              className="caption d-flex gap-2 align-items-center"
              htmlFor="recipientAddress"
            >
              Recipient Address
            </label>
            <input
              className="bg-t p-3 py-2 rounded-2 am-input"
              type="text"
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
            <small id="addressInputErrorMsg" className="form-text text-danger">
              {formState?.errorMessages?.recipientAddressErrorMsg}
            </small>

            <label
              className="caption d-flex gap-2 align-items-center"
              htmlFor="token"
            >
              Token
            </label>
            <input
              className="bg-t p-3 py-2 rounded-2 am-input"
              type="text"
              name="token"
              id="token"
              readOnly
              value={chainSymbol}
              placeholder="Enter Recipient’s Token"
            />

            <label
              className="caption d-flex gap-2 align-items-end justify-content-between"
              htmlFor="amount"
            >
              Amount{" "}
              <small>
                Balance : {fromDenom(availableBalance).toString()}&nbsp;
                {chainSymbol}
              </small>
            </label>
            <div className="p-3 py-2 d-flex rounded-2 gap-2 am-input">
              <input
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
            <small id="amountInputErrorMsg" className="form-text text-danger">
              {formState?.errorMessages?.transferAmountErrorMsg}
            </small>
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
                <BsChevronDown />
              </span>
            </button>
            {advanced && (
              <>
                <label
                  className="caption d-flex gap-2 align-items-center pt-2"
                  htmlFor="memo"
                >
                  Memo
                </label>
                <input
                  className="bg-t p-3 py-2 rounded-2 am-input"
                  type="text"
                  name="memo"
                  id="memo"
                  placeholder="Enter Memo"
                />
              </>
            )}
            <button
              className="btn button-primary px-5 ms-auto"
              type="submit"
              disabled={!isObjEmpty(formState?.errorMessages)}
              onClick={handleSubmit}
            >
              Send
            </button>
          </div>
        </div>
      </div>
      <div className="col-12 pt-3 pt-lg-0 col-lg-4">
        <div className="rounded-4 p-3 bg-gray-800 width-100 d-flex flex-column gap-2 transitionAll">
          <nav className="d-flex align-items-center justify-content-between gap-3">
            <div className="d-flex gap-3 align-items-center">
              <button className={`am-link body2`}>Receive</button>
            </div>
          </nav>
          <div className="nav-bg rounded-4 d-flex flex-column p-3 gap-2 align-items-center justify-content-center">
            <div
              style={{
                width: "min(140px, 100%)",
                aspectRatio: "1/1",
                position: "relative",
              }}
            >
              <Image layout="fill" src={WalletQrCode} alt="address QR code" />
            </div>
            <h4 className="body2 text-primary">Wallet Address</h4>
            <button
              className="d-flex align-items-center justify-content-center gap-2 text-center caption"
              onClick={() => navigator.clipboard.writeText(WalletAddress)}
              style={{ wordBreak: "break-all" }}
            >
              {`${WalletAddress.substring(
                0,
                12
              )}.......${WalletAddress.substring(
                WalletAddress.length - 9,
                WalletAddress.length
              )}`}
              <span className="text-primary">
                <MdOutlineContentCopy />
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
