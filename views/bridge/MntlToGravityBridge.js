import { useChain } from "@cosmos-kit/react";
import BigNumber from "bignumber.js";
import Link from "next/link";
import { useReducer } from "react";
import { toast } from "react-toastify";
import {
  defaultChainGasFee,
  defaultChainName,
  defaultChainSymbol,
  gravityChainName,
  toastConfig,
} from "../../config";
import {
  formConstants,
  fromChainDenom,
  fromDenom,
  sendIbcTokenToGravity,
  toDenom,
  useAvailableBalance,
} from "../../data";
import { convertBech32Address, shortenAddress } from "../../lib";
import { handleCopy, isObjEmpty } from "../../lib/basicJavascript";
import { Button, Stack } from "react-bootstrap";

const MntlToGravityBridge = () => {
  // WALLET HOOKS
  const walletManager = useChain(defaultChainName);
  const { address, getSigningStargateClient, status } = walletManager;

  // SWR HOOKS
  const { availableBalance } = useAvailableBalance();

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
        if (!action.payload) {
          return {
            ...state,
            transferAmount: action.payload,
            errorMessages: {
              ...state.errorMessages,
              transferAmountErrorMsg: formConstants.requiredErrorMsg,
            },
          };
        } else if (BigNumber(action.payload).isNaN()) {
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
          return {
            ...state,
            transferAmount: BigNumber(fromDenom(availableBalance))
              .minus(BigNumber(fromDenom(defaultChainGasFee)))
              .toString(),
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
  const handleAmountOnChange = (e) => {
    e.preventDefault();
    formDispatch({
      type: "CHANGE_AMOUNT",
      payload: e.target.value,
    });
  };

  const handleGravitySubmit = async (e) => {
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
      const id = toast.loading("Transaction initiated ...", toastConfig);
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
  const displayAvailableBalance = fromChainDenom(availableBalance);
  const displayAvailableBalanceDenom = defaultChainSymbol;
  const isSubmitDisabled =
    status != "Connected" || !isObjEmpty(formState?.errorMessages);
  const displayInputAmountValue = formState?.transferAmount;
  const isFormAmountError = formState?.errorMessages?.transferAmountErrorMsg;
  const displayFormAmountErrorMsg =
    formState?.errorMessages?.transferAmountErrorMsg;

  return (
    <Stack
      gap={2}
      className={`bg-secondary p-3 rounded-4 ${"border border-primary"}`}
    >
      <Stack
        gap={2}
        direction="horizontal"
        className="caption align-items-center justify-content-between"
      >
        <Stack
          gap={2}
          direction="horizontal"
          className="align-items-center position-relative"
        >
          <div
            className="position-relative"
            style={{ width: "21px", aspectRatio: "1/1" }}
          >
            <img src="/chainLogos/mntl.webp" alt="AssetMantle" layout="fill" />
          </div>
          <h5 className="caption2 text-primary m-0">AssetMantle</h5>
        </Stack>
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
      </Stack>
      <label
        htmlFor="mntlAmount"
        className="caption2 text-white-50 fw-normal d-flex align-items-center justify-content-between gap-2 pt-1"
      >
        Amount{" "}
        <small className="small text-white-50 fw-normal">
          Available Balance : {displayAvailableBalance}
          &nbsp;
          {displayAvailableBalanceDenom}
        </small>
      </label>
      <Stack
        direction="horizontal"
        className="border border-white py-2 px-3 rounded-2"
      >
        <input
          type="number"
          placeholder="Enter Amount"
          name="mntlAmount"
          className="caption2 flex-grow-1 bg-transparent border border-0"
          style={{ outline: "none" }}
          value={displayInputAmountValue}
          onChange={handleAmountOnChange}
        />
        <button className="text-primary caption2" onClick={handleOnClickMax}>
          Max
        </button>
      </Stack>
      <Stack
        as="small"
        gap={1}
        direction="horizontal"
        id="addressInputErrorMsg"
        className="form-text text-danger align-items-center"
      >
        {isFormAmountError && <i className="bi bi-info-circle" />}{" "}
        {displayFormAmountErrorMsg}
      </Stack>
      <Stack
        gap={2}
        direction="horizontal"
        className="align-items-center justify-content-end"
      >
        {/* <button
          onClick={handleGravitySubmit}
          disabled={isSubmitDisabled}
          className="button-primary py-2 px-4 d-flex gap-2 align-items-center caption2"
        >
          Send to AssetMantle <i className="bi bi-arrow-up" />
        </button> */}
        <Button
          variant="primary"
          className="d-flex gap-2 align-items-center caption fw-semibold rounded-5 px-4 text-dark"
          onClick={handleGravitySubmit}
          disabled={isSubmitDisabled}
        >
          Send to Gravity Bridge <i className="bi bi-arrow-down" />
        </Button>
      </Stack>
    </Stack>
  );
};

export default MntlToGravityBridge;
