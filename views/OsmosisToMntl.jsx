import { useChain } from "@cosmos-kit/react";
import BigNumber from "bignumber.js";
import Link from "next/link";
import { useReducer } from "react";
import { toast } from "react-toastify";
import {
  defaultChainName,
  defaultChainSymbol,
  osmosisChainGasFee,
  osmosisChainName,
  osmosisChainSymbol,
  toastConfig,
} from "../config";
import {
  formConstants,
  fromChainDenom,
  fromDenom,
  sendOsmosisIbcTokenToMantle,
  toDenom,
  useAvailableBalanceOsmosis,
} from "../data";
import { convertBech32Address, shortenAddress } from "../lib";
import { handleCopy, isObjEmpty } from "../lib/basicJavascript";

const OsmosisToMntl = () => {
  // WALLET HOOKS
  const walletManager = useChain(defaultChainName);
  const { address: mantleAddress, getOfflineSigner, status } = walletManager;

  const osmosisAddress = convertBech32Address(mantleAddress, osmosisChainName);

  // SWR HOOKS
  const { availableBalanceOsmosisIBCToken, availableBalanceOsmosis } =
    useAvailableBalanceOsmosis();

  const displayAvailableBalanceOsmosisIBCToken = fromChainDenom(
    availableBalanceOsmosisIBCToken
  );
  const displayAvailableBalanceOsmosis = fromChainDenom(
    availableBalanceOsmosis
  );

  // FORM REDUCER
  const initialState = {
    transferAmount: "",
    // memo: "",
    errorMessages: {},
  };

  const formReducer = (state = initialState, action) => {
    switch (action.type) {
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
          BigNumber(availableBalanceOsmosisIBCToken).isNaN() ||
          BigNumber(toDenom(action.payload)).isGreaterThan(
            BigNumber(availableBalanceOsmosisIBCToken)
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
        if (BigNumber(availableBalanceOsmosisIBCToken).isNaN()) {
          return {
            ...state,
            transferAmount: availableBalanceOsmosisIBCToken,
            errorMessages: {
              ...state.errorMessages,
              transferAmountErrorMsg: formConstants.transferAmountErrorMsg,
            },
          };
        } else if (
          BigNumber(availableBalanceOsmosis).isLessThan(
            BigNumber(osmosisChainGasFee)
          )
        ) {
          return {
            ...state,
            transferAmount: fromDenom(availableBalanceOsmosisIBCToken),
            errorMessages: {
              ...state.errorMessages,
              transferAmountErrorMsg: formConstants.gasErrorMsg,
            },
          };
        }
        // if valid available balance then set half value
        else {
          // delete the error message key if already exists
          delete state.errorMessages?.transferAmountErrorMsg;
          return {
            ...state,
            transferAmount: fromDenom(availableBalanceOsmosisIBCToken),
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
      <Link href={`https://www.mintscan.io/osmosis/tx/${txHash}`}>
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
  const handleAmountOnChange = (e) => {
    e.preventDefault();
    formDispatch({
      type: "CHANGE_AMOUNT",
      payload: e.target.value,
    });
  };

  const handleSubmitMantle = async (e) => {
    e.preventDefault();

    // define local variables
    const localTransferAmount = formState?.transferAmount;
    let memo;

    // manually trigger form validation messages if any
    formDispatch({
      type: "CHANGE_AMOUNT",
      payload: localTransferAmount,
    });

    // if no validation errors, proceed to transaction processing
    if (
      localTransferAmount &&
      !BigNumber(localTransferAmount).isNaN() &&
      isObjEmpty(formState?.errorMessages)
    ) {
      // initiate toast notification
      const toastId = toast.loading("Transaction initiated ...", toastConfig);

      // initiate transaction from txn api
      const { response, error } = await sendOsmosisIbcTokenToMantle(
        osmosisAddress,
        mantleAddress,
        localTransferAmount,
        memo,
        {
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
    handleCopy(osmosisAddress);
  };

  // DISPLAY VARIABLES
  const displayShortenedAddress = shortenAddress(
    osmosisAddress,
    osmosisChainName
  );
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
            <img
              src="/chainLogos/osmosis.svg"
              alt="Osmosis"
              layout="fill"
              className="w-100 h-100"
              style={{ objectFit: "contain", objectPosition: "center" }}
            />
          </div>
          <h5 className="caption2 text-primary">Osmosis</h5>
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
        htmlFor="osmoAmount"
        className="caption2 text-gray d-flex align-items-center justify-content-between gap-2"
      >
        <small className="small text-gray">
          OSMO Balance : {displayAvailableBalanceOsmosis}
          &nbsp;
          {osmosisChainSymbol}
        </small>
        <small className="small text-gray">
          Available Balance : {displayAvailableBalanceOsmosisIBCToken}
          &nbsp;
          {displayAvailableBalanceDenom}
        </small>
      </label>
      <div className="input-white d-flex py-2 px-3 rounded-2">
        <input
          type="number"
          placeholder="Enter Amount"
          name="osmoAmount"
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
          onClick={handleSubmitMantle}
          disabled={isSubmitDisabled}
          className="button-primary py-2 px-4 d-flex gap-2 align-items-center caption2"
        >
          Send to Mantle <i className="bi bi-arrow-up" />
        </button>
      </div>
    </div>
  );
};

export default OsmosisToMntl;
