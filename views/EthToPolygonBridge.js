import { disconnect } from "@wagmi/core";
import { useWeb3Modal } from "@web3modal/react";
import BigNumber from "bignumber.js";
import Link from "next/link";
import { useReducer } from "react";
import { toast } from "react-toastify";
import { useAccount, useBalance } from "wagmi";
import {
  defaultChainGasFee,
  defaultChainSymbol,
  ethereumChainSymbol,
  placeholderAvailableBalance,
} from "../config";
import {
  approveMaxDeposit,
  decimalize,
  depositMntlToken,
  formConstants,
  fromChainDenom,
  parentERC20TokenAddress,
  placeholderAddressEth,
  toChainDenom,
  toDenom,
  useAllowance,
} from "../data";
import {
  handleCopy,
  isObjEmpty,
  shortenEthAddress,
  useIsMounted,
} from "../lib";

const EthToPolygonBridge = () => {
  // WALLET HOOKS
  // hooks to work the multi-modal for ethereum
  const { open } = useWeb3Modal();
  // before useAccount, define the isMounted() hook to deal with SSR issues
  const isMounted = useIsMounted();
  const { allowance } = useAllowance();

  // books to get the address of the connected wallet
  const { address, isConnected, connector } = useAccount();

  // get the MNTL token balance using wagmi hook
  const mntlEthBalanceObject = useBalance({
    address: address,
    token: parentERC20TokenAddress,
  });

  const mntlEthBalance = toChainDenom(mntlEthBalanceObject?.data?.formatted);

  // get the ETH balance using wagmi hook
  const ethBalanceObject = useBalance({
    address: address,
  });

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
        if (!action.payload) {
          return {
            ...state,
            transferAmount: action.payload,
            errorMessages: {
              ...state.errorMessages,
              transferAmountErrorMsg: formConstants.requiredErrorMsg,
            },
          };
        } else if (
          isNaN(parseFloat(action.payload)) ||
          isNaN(toDenom(action.payload))
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
          isNaN(parseFloat(mntlEthBalance)) ||
          toDenom(action.payload) + parseFloat(defaultChainGasFee) >
            parseFloat(mntlEthBalance)
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
          isNaN(parseFloat(mntlEthBalance)) ||
          parseFloat(mntlEthBalance) < parseFloat(defaultChainGasFee)
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
          delete state.errorMessages?.transferAmountErrorMsg;
          return {
            ...state,
            transferAmount: fromChainDenom(
              parseFloat(mntlEthBalance) - parseFloat(defaultChainGasFee)
            ).toString(),
          };
        }
      }

      case "SUBMIT": {
        // if any required field is blank, set error message

        let localErrorMessages = state?.errorMessages;

        if (!state?.transferAmount || !parseFloat(state?.transferAmount) > 0) {
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

  const CustomToastWithLink = ({ txHash, message }) => (
    <p>
      {message}
      <Link href={`https://etherscan.io/tx/${txHash}`}>
        <a style={{ color: "#ffc640" }} target="_blank">
          {" "}
          Here
        </a>
      </Link>
    </p>
  );

  const notify = (txHash, id, message) => {
    if (txHash) {
      toast.update(id, {
        render: <CustomToastWithLink txHash={txHash} message={message} />,
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
        render: message,
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
  const handleOpenWeb3Modal = async (e) => {
    e.preventDefault();
    await open();
  };

  const handleDisconnectWeb3Modal = async (e) => {
    e.preventDefault();
    await disconnect();
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
      !isNaN(parseFloat(formState?.transferAmount)) &&
      parseFloat(formState?.transferAmount) > 0 &&
      isObjEmpty(formState?.errorMessages)
    ) {
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
      // define local variables
      const localTransferAmount = formState?.transferAmount;

      // create transaction
      const { response, error } = await depositMntlToken(
        address,
        localTransferAmount,
        connector
      );
      console.log("response: ", response, " error: ", error);

      // reset the form values
      formDispatch({ type: "RESET" });
      if (response) {
        notify(response, id, "Transaction might take upto 22 mins. Check ");
      } else {
        notify(null, id, "Transaction Aborted. Try again.");
      }
    }
  };

  const handleApproveSubmit = async (e) => {
    console.log("inside handleApproveSubmit()");
    e.preventDefault();

    try {
      // initiate the toast
      const id2 = toast.loading("Transaction initiated ...", {
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
      const { response, error } = await approveMaxDeposit(address, connector);
      console.log("response: ", response, " error: ", error);
      if (response) {
        notify(response, id2, "Transaction Submitted. Check ");
      } else {
        notify(null, id2, "Transaction Aborted. Try again.");
      }
    } catch (error) {
      console.error("Runtime Error: ", error);
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
    handleCopy(address);
  };

  // DISPLAY VARIABLES
  const displayShortenedAddress = shortenEthAddress(
    address || placeholderAddressEth
  );
  // const displayShortenedAddress = placeholderAddressEth;
  const displayAvailableBalance =
    !mntlEthBalanceObject?.data ||
    mntlEthBalanceObject?.isLoading ||
    mntlEthBalanceObject?.isError
      ? placeholderAvailableBalance
      : decimalize(mntlEthBalanceObject?.data?.formatted);
  const displayAvailableBalanceDenom = defaultChainSymbol;
  const displayEthBalance =
    !ethBalanceObject?.data ||
    ethBalanceObject?.isLoading ||
    ethBalanceObject?.isError
      ? placeholderAvailableBalance
      : decimalize(ethBalanceObject?.data?.formatted);
  const displayEthBalanceDenom = ethereumChainSymbol;

  const displayInputAmountValue = formState?.transferAmount;
  const isFormAmountError = formState?.errorMessages?.transferAmountErrorMsg;
  const displayFormAmountErrorMsg =
    formState?.errorMessages?.transferAmountErrorMsg;
  const isWalletEthConnected = isMounted() && isConnected;
  const isSubmitDisabled =
    !isWalletEthConnected || !isObjEmpty(formState?.errorMessages);
  const isApproveRequired =
    isWalletEthConnected &&
    (BigNumber(allowance).isZero() ||
      BigNumber(allowance).isLessThan(
        BigNumber(formState?.transferAmount || 0)
      ));

  // connect button with logic
  const connectButtonJSX = isWalletEthConnected ? (
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
        <span className="text-primary" onClick={handleDisconnectWeb3Modal}>
          <i className="bi bi-power" />
        </span>
      </button>
    </>
  ) : (
    <button
      className="caption2 d-flex gap-1 text-primary"
      onClick={handleOpenWeb3Modal}
    >
      <i className="bi bi-link-45deg" /> Connect Wallet
    </button>
  );

  const submitButtonJSX = isApproveRequired ? (
    <button
      className="button-primary py-2 px-4 d-flex gap-2 align-items-center caption2"
      onClick={handleApproveSubmit}
    >
      Approve Deposit <i className="bi bi-hand-thumbs-up-fill" />
    </button>
  ) : (
    <button
      className="button-primary py-2 px-4 d-flex gap-2 align-items-center caption2"
      disabled={isSubmitDisabled}
      onClick={handleSubmit}
    >
      Send to Polygon Chain <i className="bi bi-arrow-down" />
    </button>
  );

  /*  console.log(
    " isConnected: ",
    isMounted() && isConnected,
    " address: ",
    isMounted() && address,
    " selectedChain: ",
    selectedChain,
    " isMounted(): ",
    isMounted(),
    "mntl balance: ",
    displayAvailableBalance,
    " eth balance: ",
    displayEthBalance,
    " mntlEthBalanceObject: ",
    mntlEthBalanceObject,
    " isApproveRequired: ",
    isApproveRequired
  ); */

  return (
    <>
      <div
        className={`bg-gray-800 p-3 rounded-4 d-flex flex-column gap-3 ${""}`}
      >
        <div className="caption d-flex gap-2 align-items-center justify-content-between">
          <div className="d-flex gap-2 align-items-center position-relative">
            <div
              className="position-relative"
              style={{ width: "21px", aspectRatio: "1/1" }}
            >
              <img src="/chainLogos/eth.svg" alt="Ethereum Chain" />
            </div>
            <h5 className="caption2 text-primary">Ethereum Chain</h5>
          </div>
          {isMounted() && connectButtonJSX}
          {!isMounted() && (
            <button
              className="caption2 d-flex gap-1 text-primary"
              onClick={handleOpenWeb3Modal}
            >
              <i className="bi bi-link-45deg" /> Connect Wallet
            </button>
          )}
        </div>
        <label
          htmlFor="GravityAmount"
          className="caption2 text-gray d-flex align-items-center justify-content-between gap-2"
        >
          Amount{" "}
          <small className="small text-gray">
            ETH Balance : {isMounted() && displayEthBalance}{" "}
            {displayEthBalanceDenom}
          </small>
          <small className="small text-gray">
            MNTL Balance : {isMounted() && displayAvailableBalance}{" "}
            {displayAvailableBalanceDenom}
          </small>
        </label>
        <div className="input-white d-flex py-2 px-3 rounded-2">
          <input
            type="number"
            placeholder="Enter Amount"
            name="ethAmount"
            className="am-input-secondary caption2 flex-grow-1 bg-t"
            value={displayInputAmountValue}
            onChange={handleAmountOnChange}
          />
          <button className="text-primary caption2" onClick={handleOnClickMax}>
            Max
          </button>
        </div>
        <small className="small text-error">
          {isFormAmountError && <i className="bi bi-info-circle" />}{" "}
          {displayFormAmountErrorMsg}
        </small>
        <div className="d-flex align-items-center justify-content-end gap-3">
          {/* <button className="button-secondary py-2 px-4 d-flex gap-2 align-items-center caption2">
          Send to Gravity bridge <i className="bi bi-arrow-up" />
        </button> */}
          {submitButtonJSX}
        </div>
      </div>
    </>
  );
};

export default EthToPolygonBridge;
