import BigNumber from "bignumber.js";
import React, { useEffect, useReducer, useState } from "react";
import { toast } from "react-toastify";
import {
  useAccount,
  useBalance,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";
import { polygon } from "wagmi/chains";
import { notify, polygonChainSymbol, toastConfig } from "../config";
import {
  decimalize,
  ethConfig,
  farmPools,
  formConstants,
  toDenom,
} from "../data";
import { isObjEmpty } from "../lib";

export const QuickswapStakeModal = ({
  balance,
  isLoadingBalance,
  poolIndex,
}) => {
  const availableBalance = balance?.formatted || "0";
  const quickswapFarm = farmPools?.[1];
  const selectedQuickswapFarmPool = quickswapFarm?.pools?.[poolIndex];
  const lpTokenName = selectedQuickswapFarmPool?.lpTokenName;
  let toastId1;

  const quickV2StakerContractAddress =
    selectedQuickswapFarmPool?.farmContractAddress;
  const quickV2StakerContractABI = selectedQuickswapFarmPool?.farmContractABI;
  const quickV2StakerContract = {
    address: quickV2StakerContractAddress,
    abi: quickV2StakerContractABI,
  };

  // HOOKS
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  const chainID = polygon?.id;
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const isCorrectChain = chainID == chain?.id;
  const isWalletEthConnected = hasMounted && isConnected && isCorrectChain;

  // get the matic balance in polygon chain using wagmi hook
  const { data: polygonBalanceData, isLoading: isLoadingPolygonBalance } =
    useBalance({
      address: address,
      token: ethConfig?.mainnet?.token?.child?.matic,
      chainId: chainID,
      watch: true,
    });

  // hooks to prepare and send ethereum transaction for stake
  const { config: configStake } = usePrepareContractWrite({
    ...quickV2StakerContract,
    functionName: "deposit",
    args: [toDenom(formState?.transferAmount)],
    enabled: isWalletEthConnected && address && formState?.transferAmount,
    chainId: chainID,
    onError(error) {
      console.error("prepare error: ", error);
      /* if (true) {
        toast.error(PREPARE_CONTRACT_ERROR, {
          ...toastConfig,
        });
      } */
    },
  });

  const { writeAsync: writeAsyncStake } = useContractWrite({
    ...configStake,
    onError(error) {
      console.error(error);
      notify(null, toastId1, "Transaction Aborted. Try again.");
      toastId1 = null;
    },
  });

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
          BigNumber(toDenom(action.payload)).isGreaterThan(
            BigNumber(toDenom(availableBalance))
          )
        ) {
          return {
            ...state,
            transferAmount: action.payload,
            errorMessages: {
              ...state.errorMessages,
              transferAmountErrorMsg:
                formConstants.insufficientBalanceErrorMsg2,
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
        // delete the error message key if already exists
        delete state.errorMessages?.transferAmountErrorMsg;
        return {
          ...state,
          transferAmount: BigNumber(availableBalance).toString(),
        };
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

  // HANDLER FUNCTIONS
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

    // copy form states to local variables
    const localTransferAmount = formState?.transferAmount;
    const localLpBalance = balance?.formatted;

    // manually trigger form validation messages if any
    formDispatch({
      type: "CHANGE_AMOUNT",
      payload: localTransferAmount,
    });

    // manually calculate form validation logic
    const isFormValid =
      !BigNumber(localTransferAmount).isNaN() &&
      !BigNumber(localTransferAmount).isLessThanOrEqualTo(0) &&
      BigNumber(toDenom(localTransferAmount)).isLessThanOrEqualTo(
        BigNumber(toDenom(localLpBalance))
      ) &&
      isObjEmpty(formState?.errorMessages);

    if (isFormValid) {
      try {
        // initiate the toast
        toastId1 = toast.loading("Transaction initiated ...", toastConfig);

        // create transaction
        const transactionResponse = await writeAsyncStake();

        if (transactionResponse?.hash) {
          notify(
            transactionResponse?.hash,
            toastId1,
            "Transaction Submitted. Check ",
            "polygon"
          );
        } else {
          notify(null, toastId1, "Transaction Aborted. Try again.", "polygon");
          toastId1 = null;
        }
      } catch (error) {
        console.error("Runtime Error: ", error);
      }
      formDispatch({ type: "RESET" });
    }
  };

  const handleOnClickMax = (e) => {
    e.preventDefault();
    formDispatch({
      type: "SET_MAX_AMOUNT",
    });
  };

  // DISPLAY VARIABLES AND JSX
  const displayAvailableBalanceDenom = lpTokenName;
  const displayAvailableBalance = isLoadingBalance ? (
    <>{"Loading..."}</>
  ) : (
    <>
      {decimalize(availableBalance)}&nbsp;
      {displayAvailableBalanceDenom}
    </>
  );
  const displayMaticBalanceDenom = polygonChainSymbol;
  const displayMaticBalance = isLoadingPolygonBalance ? (
    <>{"Loading..."}</>
  ) : (
    <>
      {decimalize(polygonBalanceData?.formatted || "0")}&nbsp;
      {displayMaticBalanceDenom}
    </>
  );
  const isSubmitDisabled =
    !isWalletEthConnected || !isObjEmpty(formState?.errorMessages);
  const displayInputAmountValue = formState?.transferAmount;
  const isFormAmountError = formState?.errorMessages?.transferAmountErrorMsg;
  const displayFormAmountErrorMsg =
    formState?.errorMessages?.transferAmountErrorMsg;

  const formJSX = (
    <div
      className={`bg-gray-800 p-3 rounded-4 d-flex flex-column gap-3 ${"border-color-primary"}`}
    >
      <label
        htmlFor="mntlAmount"
        className="caption2 text-gray d-flex align-items-center justify-content-between gap-2"
      >
        Amount{" "}
        <small className="small text-gray">
          MATIC Balance : {displayMaticBalance}
        </small>
        <small className="small text-gray">
          Available Balance : {displayAvailableBalance}
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
          data-bs-dismiss="modal"
        >
          Submit <i className="bi bi-arrow-down" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="modal " tabIndex="-1" role="dialog" id="quickswapStake">
      <div
        className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title body2 text-primary d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn-close primary"
                data-bs-dismiss="modal"
                aria-label="Close"
                style={{ background: "none" }}
              >
                <span className="text-primary">
                  <i className="bi bi-chevron-left" />
                </span>
              </button>
              Stake
            </h5>
            <button
              type="button"
              className="btn-close primary"
              data-bs-dismiss="modal"
              aria-label="Close"
              style={{ background: "none" }}
            >
              <span className="text-primary">
                <i className="bi bi-x-lg" />
              </span>
            </button>
          </div>
          <div className="modal-body p-3  d-flex flex-column">
            <div
              className="nav-bg rounded-4 d-flex flex-column py-1 px-4 gap-2 align-items-center justify-content-center"
              style={{ minHeight: "250px" }}
            >
              {formJSX}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
