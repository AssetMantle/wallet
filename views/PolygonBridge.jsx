import { useReducer } from "react";
import { useAccount, useBalance } from "wagmi";
import {
  defaultChainGasFee,
  defaultChainSymbol,
  placeholderAvailableBalance,
  polygonChainId,
  polygonChainSymbol,
} from "../config";
import {
  childERC20TokenAddress,
  decimalize,
  ethConfig,
  formConstants,
  fromChainDenom,
  placeholderAddressEth,
  toDenom,
} from "../data";
import {
  handleCopy,
  isObjEmpty,
  shortenEthAddress,
  useIsMounted,
} from "../lib";

const PolygonBridge = () => {
  // WALLET HOOKS
  // before useAccount, define the isMounted() hook to deal with SSR issues
  const isMounted = useIsMounted();

  // books to get the address of the connected wallet
  const { address, isConnected } = useAccount();

  // get the mntl token balance in polygon chain using wagmi hook
  const mntlEthBalanceObject = useBalance({
    address: address,
    token: childERC20TokenAddress,
    chainId: polygonChainId,
  });

  // get the matic balance in polygon chain using wagmi hook
  const polygonBalanceObject = useBalance({
    address: address,
    token: ethConfig?.mainnet?.token?.child?.matic,
    chainId: polygonChainId,
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
          console.log(
            "state error message: ",
            state.errorMessages?.transferAmountErrorMsg
          );
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
      ? decimalize(placeholderAvailableBalance)
      : decimalize(mntlEthBalanceObject?.data?.formatted);
  const displayAvailableBalanceDenom = defaultChainSymbol;
  const displayMaticBalance =
    !polygonBalanceObject?.data ||
    polygonBalanceObject?.isLoading ||
    polygonBalanceObject?.isError
      ? decimalize(placeholderAvailableBalance)
      : decimalize(polygonBalanceObject?.data?.formatted);
  const displayMaticBalanceDenom = polygonChainSymbol;

  const isFormAmountError = formState?.errorMessages?.transferAmountErrorMsg;
  const displayFormAmountErrorMsg =
    formState?.errorMessages?.transferAmountErrorMsg;
  const isWalletEthConnected = isMounted() && isConnected;
  const isSubmitDisabled = true;

  // connect button with logic
  const notConnectedJSX = (
    <span className="text-primary">
      <i className="bi bi-patch-exclamation-fill" /> Not Connected
    </span>
  );
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
      </button>
    </>
  ) : (
    notConnectedJSX
  );

  /* console.log(
    " isConnected: ",
    isMounted() && isConnected,
    " address: ",
    isMounted() && address,
    " isMounted(): ",
    isMounted(),
    "mntl balance: ",
    displayAvailableBalance,
    " eth balance: ",
    displayMaticBalance
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
              <img src="/chainLogos/polygon.svg" alt="Polygon Chain" />
            </div>
            <h5 className="caption2 text-primary">Polygon Chain</h5>
          </div>
          {isMounted() && connectButtonJSX}
          {!isMounted() && notConnectedJSX}
        </div>

        <label
          htmlFor="GravityAmount"
          className="caption2 text-gray d-flex align-items-center justify-content-between gap-2"
        >
          Amount{" "}
          <small className="small text-gray">
            MATIC Balance : {displayMaticBalance} {displayMaticBalanceDenom}
          </small>
          <small className="small text-gray">
            MNTL Balance : {displayAvailableBalance}{" "}
            {displayAvailableBalanceDenom}
          </small>
        </label>
        {/*  <div className="input-white d-flex py-2 px-3 rounded-2">
          <input
            type="number"
            placeholder="Enter Amount"
            name="ethAmount"
            className="am-input-secondary caption2 flex-grow-1 bg-t"
            value={displayInputAmountValue}
            onChange={handleAmountOnChange}
            disabled={isSubmitDisabled}
          />
          <button
            className="text-primary caption2"
            onClick={handleOnClickMax}
            disabled={isSubmitDisabled}
          >
            Max
          </button>
        </div> */}
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
          >
            Send to Ethereum Chain <i className="bi bi-arrow-down" />
          </button>
        </div>
      </div>
    </>
  );
};

export default PolygonBridge;
