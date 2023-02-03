import { useChain } from "@cosmos-kit/react";
import { useReducer } from "react";
import { toast } from "react-toastify";
import {
  defaultChainGasFee,
  defaultChainName,
  defaultChainSymbol,
  gravityChainName,
} from "../config";
import {
  formConstants,
  fromChainDenom,
  sendIbcTokenToGravity,
  toDenom,
  useAvailableBalance,
} from "../data";
import { convertBech32Address, shortenAddress } from "../lib";
import { handleCopy, isObjEmpty } from "../lib/basicJavascript";

const MntlToGravityBridge = ({ notify }) => {
  // WALLET HOOKS
  const walletManager = useChain(defaultChainName);
  const { address, getSigningStargateClient, status } = walletManager;

  // SWR HOOKS
  const { availableBalance } = useAvailableBalance();

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
      const { response, error } = await sendIbcTokenToGravity(
        address,
        gravityAddress,
        localTransferAmount,
        memo,

        { getSigningStargateClient }
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
    handleCopy(address);
  };

  // DISPLAY VARIABLES
  const displayShortenedAddress = shortenAddress(address);
  const displayAvailableBalance = fromChainDenom(availableBalance).toString();
  const displayAvailableBalanceDenom = defaultChainSymbol;
  const isSubmitDisabled =
    status != "Connected" || !isObjEmpty(formState?.errorMessages);
  const displayInputAmountValue = formState?.transferAmount;
  const isFormAmountError = formState?.errorMessages?.transferAmountErrorMsg;
  const displayFormAmountErrorMsg =
    formState?.errorMessages?.transferAmountErrorMsg;

  return (
    <div
      className={`bg-gray-800 p-3 rounded-4 d-flex flex-column gap-3 ${"border-color-primary"}`}
    >
      <div className="caption d-flex gap-2 align-items-center justify-content-between">
        <div className="d-flex gap-2 align-items-center position-relative">
          <div
            className="position-relative"
            style={{ width: "21px", aspectRatio: "1/1" }}
          >
            <img src="/chainLogos/mntl.webp" alt="AssetMantle" layout="fill" />
          </div>
          <h5 className="caption2 text-primary">AssetMantle</h5>
        </div>
        <button
          className="caption2 d-flex gap-1"
          onClick={handleCopyOnClick}
          style={{ wordBreak: "break-all" }}
        >
          {displayShortenedAddress}
          <span className="text-primary">
            <i className="bi bi-files" />
          </span>
        </button>
      </div>
      <label
        htmlFor="mntlAmount"
        className="caption2 text-gray d-flex align-items-center justify-content-between gap-2"
      >
        Amount{" "}
        <small className="small text-gray">
          Available Balance : {displayAvailableBalance}
          &nbsp;
          {displayAvailableBalanceDenom}
        </small>
      </label>
      <div className="input-white d-flex py-2 px-3 rounded-2">
        <input
          type="number"
          placeholder="Enter Amount"
          name="mntlAmount"
          className="am-input-secondary caption2 flex-grow-1 bg-t"
          value={displayInputAmountValue}
          onChange={handleAmountOnChange}
        />
        <button className="text-primary caption2" onClick={handleOnClickMax}>
          Max
        </button>
      </div>
      <small
        id="addressInputErrorMsg"
        className="form-text text-danger d-flex align-items-center gap-1"
      >
        {isFormAmountError && <i className="bi bi-info-circle" />}{" "}
        {displayFormAmountErrorMsg}
      </small>
      <div className="d-flex align-items-center justify-content-end gap-2">
        <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className="button-primary py-2 px-4 d-flex gap-2 align-items-center caption2"
        >
          Send to Gravity Bridge <i className="bi bi-arrow-down" />
        </button>
      </div>
    </div>
  );
};

export default MntlToGravityBridge;
