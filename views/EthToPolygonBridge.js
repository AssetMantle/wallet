import { disconnect } from "@wagmi/core";
import { useWeb3Modal, useWeb3ModalNetwork } from "@web3modal/react";
import { useReducer } from "react";
import { useAccount } from "wagmi";
import {
  defaultChainGasFee,
  defaultChainSymbol,
  gravityChainName,
  placeholderAvailableBalance,
} from "../config";
import {
  formConstants,
  fromChainDenom,
  placeholderAddressEth,
  sendIbcTokenToGravity,
  toDenom,
  useMntlEthBalance,
} from "../data";
import {
  convertBech32Address,
  handleCopy,
  isObjEmpty,
  shortenEthAddress,
  useIsMounted,
} from "../lib";

const EthToPolygonBridge = () => {
  // WALLET HOOKS
  // hooks to work the multi-modal for ethereum
  const { open } = useWeb3Modal();
  // hook to get and set selected chain
  const { selectedChain, setSelectedChain } = useWeb3ModalNetwork();
  // before useAccount, define the isMounted() hook to deal with SSR issues
  const isMounted = useIsMounted();

  // books to get the address of the connected wallet
  const { address, isConnected } = useAccount();
  // hooks to get the available balance of the desired token
  const { mntlEthBalance, isLoadingMntlEthBalance } = useMntlEthBalance();

  console.log(
    "mntlEthBalance: ",
    mntlEthBalance,
    " isLoadingMNTLethbalance: ",
    isLoadingMntlEthBalance,
    " isConnected: ",
    isMounted() && isConnected,
    " address: ",
    isMounted() && address,
    " selectedChain: ",
    selectedChain,
    " isMounted(): ",
    isMounted()
  );

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

      case "SET_MAX_AMOUNT": {
        // if available balance is invalid, set error message
        if (
          isNaN(parseFloat(availableBalance)) ||
          parseFloat(availableBalance) < parseFloat(defaultChainGasFee)
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
          console.log(
            "state error message: ",
            state.errorMessages?.transferAmountErrorMsg
          );
          return {
            ...state,
            transferAmount: fromChainDenom(
              parseFloat(availableBalance) - parseFloat(defaultChainGasFee)
            ).toString(),
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
      isObjEmpty(formState?.errorMessages)
    ) {
      // define local variables
      const localTransferAmount = formState?.transferAmount;
      let memo;
      const gravityAddress = convertBech32Address(address, gravityChainName);

      // create transaction
      const { response, error } = await sendIbcTokenToGravity(
        address,
        gravityAddress,
        localTransferAmount,
        memo
      );
      console.log("response: ", response, " error: ", error);

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
    handleCopy(address);
  };

  // DISPLAY VARIABLES
  const displayShortenedAddress = shortenEthAddress(
    address || placeholderAddressEth
  );
  // const displayShortenedAddress = placeholderAddressEth;
  const displayAvailableBalance = isLoadingMntlEthBalance
    ? placeholderAvailableBalance
    : mntlEthBalance;
  const displayAvailableBalanceDenom = defaultChainSymbol;
  const displayEthBalance = "10000";
  const displayEthBalanceDenom = "$ETH";
  const displayInputAmountValue = formState?.transferAmount;
  const isFormAmountError = formState?.errorMessages?.transferAmountErrorMsg;
  const displayFormAmountErrorMsg =
    formState?.errorMessages?.transferAmountErrorMsg;
  const isWalletEthConnected = isMounted() && isConnected;
  const isSubmitDisabled =
    isWalletEthConnected || !isObjEmpty(formState?.errorMessages);
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
        </div>
        <label
          htmlFor="GravityAmount"
          className="caption2 text-gray d-flex align-items-center justify-content-between gap-2"
        >
          Amount{" "}
          <small className="small text-gray">
            ETH Balance : {displayEthBalance} {displayEthBalanceDenom}
          </small>
          <small className="small text-gray">
            MNTL Balance : {displayAvailableBalance}{" "}
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
          <button
            className="button-primary py-2 px-4 d-flex gap-2 align-items-center caption2"
            disabled={isSubmitDisabled}
            onClick={handleSubmit}
          >
            Send to Polygon Chain <i className="bi bi-arrow-down" />
          </button>
        </div>
      </div>
    </>
  );
};

export default EthToPolygonBridge;
