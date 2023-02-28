import { useChain } from "@cosmos-kit/react";
import { useWeb3Modal } from "@web3modal/react";
import BigNumber from "bignumber.js";
import Link from "next/link";
import { useReducer, useState } from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
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
  sendIbcTokenToEth,
  sendIbcTokenToMantle,
  toDenom,
  useAvailableBalanceGravity,
} from "../data";
import { convertBech32Address, shortenAddress } from "../lib";
import { handleCopy, isObjEmpty, useIsMounted } from "../lib/basicJavascript";

const GravityToEthBridge = () => {
  const [gasFee, setGasFee] = useState();
  console.log(gasFee);
  // WALLET HOOKS
  /* const chainContext4 = useChain(gravityChainName);
  const {
    address: gravityAddress,
    status: gravityStatus,
    getSigningStargateClient: getSigningStargateClientGravity,
  } = chainContext4; */

  // get the gravity address from mantle
  const chainContext3 = useChain(defaultChainName);
  const {
    address: mantleAddress,
    status: gravityStatus,
    getOfflineSigner,
  } = chainContext3;
  const gravityAddress = convertBech32Address(mantleAddress, gravityChainName);

  const isMounted = useIsMounted();
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();

  const isGravityConnected = gravityStatus == "Connected";
  // const [showConnectText, setShowConnectText] = useState(true);

  // HOOKS or GETTERS
  const { availableBalanceGravity, availableBalanceIBCToken } =
    useAvailableBalanceGravity();

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
        render: "Transaction failed. Try Again",
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

  // connect button with logic

  const handleOpenWeb3Modal = async (e) => {
    e.preventDefault();
    await open();
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

      // initiate toast notification
      const toastId2 = toast.loading("Transaction initiated ...", {
        position: "bottom-center",
        autoClose: 8000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      // create transaction
      const { response, error } = await sendIbcTokenToEth(
        gravityAddress,
        ethDestAddress,
        localTransferAmount,
        memo,

        {
          // getSigningStargateClient: getSigningStargateClientGravity,
          getOfflineSigner,
        }
      );
      console.log("response: ", response, " error: ", error);
      // reset the form values
      formDispatch({ type: "RESET" });

      // notify toast message on success or error
      if (response) {
        notify(response?.transactionHash, toastId2);
      } else {
        notify(null, toastId2);
      }
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
      const toastId = toast.loading("Transaction initiated ...", {
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

        {
          // getSigningStargateClient: getSigningStargateClientGravity,
          getOfflineSigner,
        }
      );
      console.log("response: ", response, " error: ", error);

      // reset the form values
      formDispatch({ type: "RESET" });

      // notify toast message on success or error
      if (response) {
        notify(response?.transactionHash, toastId);
      } else {
        notify(null, toastId);
      }
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
  const isWalletEthConnected = isMounted() && isConnected;

  const displayShortenedAddress = shortenAddress(
    gravityAddress,
    gravityChainName
  );

  const connectButtonJSX = (
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
  );

  const displayAvailableBalanceIBCToken = fromChainDenom(
    availableBalanceIBCToken
  );
  const displayAvailableBalanceGravity = fromChainDenom(
    availableBalanceGravity
  );
  const displayBalanceUnitGravity = gravityChainSymbol;
  const displayBalanceUnitGravityIBCToken = defaultChainSymbol;
  const isSubmitDisabled = !isObjEmpty(formState?.errorMessages);
  const displayInputAmountValue = formState?.transferAmount;
  const isFormAmountError = formState?.errorMessages?.transferAmountErrorMsg;
  const displayFormAmountErrorMsg =
    formState?.errorMessages?.transferAmountErrorMsg;

  const connectEthWalletJSX = (
    <button
      onClick={handleOpenWeb3Modal}
      className="button-primary py-2 px-4 d-flex gap-2 align-items-center caption2"
    >
      Connect Ethereum Wallet <i className="bi bi-link-45deg" />
    </button>
  );

  const submitButtonEthJSX = isWalletEthConnected ? (
    <button
      onClick={handleSubmit}
      disabled={isSubmitDisabled}
      className="button-primary py-2 px-4 d-flex gap-2 align-items-center caption2"
    >
      Send to Ethereum <i className="bi bi-arrow-down" />
    </button>
  ) : (
    connectEthWalletJSX
  );

  console.log(
    "!isGravityConnected: ",
    !isGravityConnected,
    " !isObjEmpty(formState?.errorMessages): ",
    !isObjEmpty(formState?.errorMessages),
    " gravityAddress: ",
    gravityAddress,
    " isMounted: ",
    isMounted(),
    " gravityStatus: ",
    gravityStatus
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
      <div className="d-flex align-items-center justify-content-between gap-3">
        <label className="caption2" htmlFor="gasFeeSelect">
          Select Fee
        </label>
        <select
          name="gasFeeSelect"
          id="gasFeeSelect"
          className="am-select caption2"
          onChange={(e) => setGasFee(e.target.value)}
        >
          <option value="instant" selected>
            Instant ~ 2 minutes (1950 $MNTL)
          </option>
          <option value="fast">Fast ~ 4 hours (1030 $MNTL)</option>
          <option value="slow">Slow ~ 24 hours (130 $MNTL)</option>
        </select>
      </div>
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
        {isMounted() && submitButtonEthJSX}
        {!isMounted() && connectEthWalletJSX}
      </div>
    </div>
  );
};

export default GravityToEthBridge;
