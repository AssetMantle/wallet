import { useChain } from "@cosmos-kit/react";
import BigNumber from "bignumber.js";
import Link from "next/link";
import { useEffect, useReducer, useState } from "react";
import { toast } from "react-toastify";
import {
  defaultChainName,
  defaultChainSymbol,
  gravityChainGasFee,
  gravityChainName,
  gravityChainSymbol,
} from "../config";
import {
  formConstants,
  fromChainDenom,
  fromDenom,
  sendIbcTokenToMantle,
  toDenom,
  useAvailableBalanceGravity,
} from "../data";
import { convertBech32Address, shortenAddress } from "../lib";
import { handleCopy, isObjEmpty } from "../lib/basicJavascript";

const GravityToEthBridge = () => {
  // WALLET HOOKS
  const chainContext2 = useChain(gravityChainName);
  const {
    getSigningStargateClient: getSigningStargateClient2,
    status: gravityStatus,
    address: gravityAddress,
  } = chainContext2;

  const isGravityConnected = gravityStatus == "Connected";
  const [showConnectText, setShowConnectText] = useState(true);

  // HOOKS or GETTERS
  const { availableBalanceGravity, availableBalanceIBCToken } =
    useAvailableBalanceGravity();

  useEffect(() => {
    console.log("inside useEffect");
    setShowConnectText(true);
    return () => {};
  }, [isGravityConnected]);

  // FORM REDUCER
  const initialState = {
    transferAmount: "",
    // memo: "",
    // all error values -> errorMessages: {recipientAddressErrorMsg: "", transferAmountErrorMsg: "" }
    errorMessages: {},
  };

  const formReducer = (state = initialState, action) => {
    switch (action.type) {
      case "CHANGE_AMOUNT": {
        // if amount is greater than current balance, populate error message and update amount
        // if amount is greater than current balance, populate error message and update amount
        if (
          BigNumber(action.payload).isNaN() ||
          BigNumber(action.payload) <= 0
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
          BigNumber(availableBalanceIBCToken).isNaN() ||
          BigNumber(toDenom(action.payload)).isGreaterThan(
            BigNumber(availableBalanceIBCToken)
          )
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

      case "SET_MAX_AMOUNT": {
        // if available balance is invalid, set error message
        if (
          BigNumber(availableBalanceIBCToken).isNaN() ||
          BigNumber(availableBalanceGravity).isLessThan(
            BigNumber(gravityChainGasFee)
          )
        ) {
          return {
            ...state,
            transferAmount: availableBalanceIBCToken,
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
          return {
            ...state,
            transferAmount: fromDenom(availableBalanceIBCToken),
          };
        }
      }

      case "SUBMIT": {
        // if any required field is blank, set error message
        console.log("action.payload: ", state?.transferAmount);

        let localErrorMessages = state?.errorMessages;

        if (!state?.transferAmount) {
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

  // CONFIG FUNCTIONS
  const CustomToastWithLink = ({ txHash }) => (
    <p>
      Transaction Submitted. Check
      <Link href={`https://www.mintscan.io/gravity-bridge/txs/${txHash}`}>
        <a style={{ color: "#ffc640" }} target="_blank">
          &nbsp; Here
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
        position: "bottom-center",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        toastId: txHash,
      });
    } else {
      toast.update(id, {
        render: "Transaction failed.Try Again",
        type: "error",
        isLoading: false,
        position: "bottom-center",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  // CONTROLLER FUNCTIONS

  const handleClickConnectWallet = (e) => {
    e.preventDefault();
    setShowConnectText(false);
  };

  const handleAmountOnChange = (e) => {
    e.preventDefault();
    formDispatch({
      type: "CHANGE_AMOUNT",
      payload: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    console.log("inside handleSubmit()");
    e.preventDefault();

    // execute the dispatch operations pertaining to submit
    formDispatch({
      type: "SUBMIT",
    });

    // if no validation errors, proceed to transaction processing
    if (
      formState?.transferAmount &&
      !BigNumber(formState?.transferAmount).isNaN() &&
      isObjEmpty(formState?.errorMessages)
    ) {
      // define local variables
      const localTransferAmount = formState?.transferAmount;
      let memo;
      const ethDestAddress = "0xae6094170ABC0601b4bbe933D04368cD407C186a";

      // create transaction
      const { response, error } = await sendIbcTokenToEth(
        gravityAddress,
        ethDestAddress,
        localTransferAmount,
        memo,

        { getOfflineSigner }
      );
      console.log("response: ", response, " error: ", error);

      // reset the form values
      formDispatch({ type: "RESET" });
    }
  };

  const handleSubmitMantle = async (e) => {
    console.log("inside handleSubmit()");
    e.preventDefault();

    // execute the dispatch operations pertaining to submit
    formDispatch({
      type: "SUBMIT",
    });

    // if no validation errors, proceed to transaction processing
    if (
      formState?.transferAmount &&
      !BigNumber(formState?.transferAmount).isNaN() &&
      isObjEmpty(formState?.errorMessages)
    ) {
      // define local variables
      const localTransferAmount = formState?.transferAmount;
      let memo;
      const mantleAddress = convertBech32Address(
        gravityAddress,
        defaultChainName
      );

      // initiate toast notification
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

      // initiate transaction from txn api
      const { response, error } = await sendIbcTokenToMantle(
        gravityAddress,
        mantleAddress,
        localTransferAmount,
        memo,

        { getSigningStargateClient2 }
      );
      console.log("response: ", response, " error: ", error);
      if (response) {
        notify(response?.transactionHash, id);
      } else {
        notify(null, id);
      }

      // reset the form values
      formDispatch({ type: "RESET" });
    }
  };

  const handleOnClickMax = (e) => {
    e.preventDefault();
    formDispatch({
      type: "SET_MAX_AMOUNT",
    });
  };

  const handleCopyOnClick = (e) => {
    e.preventDefault();
    handleCopy(gravityAddress);
  };

  // DISPLAY VARIABLES

  // connect button with logic
  const notConnectedJSX = (
    <button
      className="caption2 d-flex gap-1 text-primary"
      onClick={handleClickConnectWallet}
    >
      <i className="bi bi-link-45deg" /> Connect Wallet
    </button>
  );

  const displayShortenedAddress = shortenAddress(
    gravityAddress,
    gravityChainName
  );

  const connectButtonJSX = !showConnectText ? (
    <>
      <button
        className="caption2 d-flex gap-1"
        onClick={handleCopyOnClick}
        style={{ wordBreak: "break-all" }}
      >
        {displayShortenedAddress}{" "}
        <span className="text-primary">
          <i className="bi bi-clipboard" />
        </span>
      </button>
    </>
  ) : (
    notConnectedJSX
  );

  const displayAvailableBalanceIBCToken = fromChainDenom(
    availableBalanceIBCToken
  );
  const displayAvailableBalanceGravity = fromChainDenom(
    availableBalanceGravity
  );
  const displayBalanceUnitGravity = gravityChainSymbol;
  const displayBalanceUnitGravityIBCToken = defaultChainSymbol;
  const isSubmitDisabled =
    !isGravityConnected || !isObjEmpty(formState?.errorMessages);
  const displayInputAmountValue = formState?.transferAmount;
  const isFormAmountError = formState?.errorMessages?.transferAmountErrorMsg;
  const displayFormAmountErrorMsg =
    formState?.errorMessages?.transferAmountErrorMsg;

  console.log(
    "isGravityConnected: ",
    !isGravityConnected,
    " !isObjEmpty(formState?.errorMessages): ",
    !isObjEmpty(formState?.errorMessages)
  );

  return (
    <div className={`bg-gray-800 p-3 rounded-4 d-flex flex-column gap-3 ${""}`}>
      <div className="caption d-flex gap-2 align-items-center justify-content-between">
        <div className="d-flex gap-2 align-items-center position-relative">
          <div
            className="position-relative"
            style={{ width: "21px", aspectRatio: "1/1" }}
          >
            <img src="/chainLogos/grav.svg" alt="Gravity Bridge" />
          </div>
          <h5 className="caption2 text-primary">Gravity Bridge</h5>
        </div>
        {connectButtonJSX}
      </div>
      <label
        htmlFor="GravityAmount"
        className="caption2 text-gray d-flex align-items-center justify-content-between gap-2"
      >
        Amount{" "}
        <small className="small text-gray">
          Gravity Balance : {displayAvailableBalanceGravity}{" "}
          {displayBalanceUnitGravity}
        </small>
        <small className="small text-gray">
          MNTL Balance : {displayAvailableBalanceIBCToken}{" "}
          {displayBalanceUnitGravityIBCToken}
        </small>
      </label>
      <div className="input-white d-flex py-2 px-3 rounded-2">
        <input
          type="number"
          placeholder="Enter Amount"
          name="GravityAmount"
          className="am-input-secondary caption2 flex-grow-1 bg-t"
          value={displayInputAmountValue}
          onChange={handleAmountOnChange}
        />
        <button className="text-primary caption2" onClick={handleOnClickMax}>
          Max
        </button>
      </div>
      {isFormAmountError && (
        <small className="small text-error">{displayFormAmountErrorMsg}</small>
      )}
      <div className="d-flex align-items-center justify-content-end gap-3">
        <button
          className="button-secondary py-2 px-4 d-flex gap-2 align-items-center caption2"
          disabled={isSubmitDisabled}
          onClick={handleSubmitMantle}
        >
          Send to Mantle Chain <i className="bi bi-arrow-up" />
        </button>
        {/* <Link href={"https://bridge.blockscape.network/"}>
          <a target="_blank" rel="noreferrer">
            <button
              className="button-primary py-2 px-4 d-flex gap-2 align-items-center caption2"
              // disabled={isSubmitDisabled}
              // onClick={handleSubmit}
            >
              Bridge Link to Ethereum Chain{" "}
              <i className="bi bi-box-arrow-up-right" />
            </button>
          </a>
        </Link> */}
        <button
          className="button-secondary py-2 px-4 d-flex gap-2 align-items-center caption2"
          disabled={isSubmitDisabled}
          onClick={handleSubmit}
        >
          Send to Ethereum <i className="bi bi-arrow-up" />
        </button>
      </div>
    </div>
  );
};

export default GravityToEthBridge;
