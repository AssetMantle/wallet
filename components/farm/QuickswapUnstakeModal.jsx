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
import { notify, polygonChainSymbol, toastConfig } from "../../config";
import {
  decimalize,
  ethConfig,
  farmPools,
  formConstants,
  toDenom,
} from "../../data";
import { isObjEmpty } from "../../lib";
import { Button, Modal, Stack } from "react-bootstrap";

export const QuickswapUnstakeModal = ({
  balance,
  isLoadingBalance,
  poolIndex,
  Show,
  setShow,
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
  const { data: maticBalance, isLoading: isLoadingPolygonBalance } = useBalance(
    {
      address: address,
      token: ethConfig?.mainnet?.token?.child?.matic,
      chainId: chainID,
      watch: true,
    }
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
          BigNumber(toDenom(action.payload, 18)).isGreaterThan(
            BigNumber(toDenom(availableBalance, 18))
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
        false;
    }
  };
  const [formState, formDispatch] = useReducer(formReducer, initialState);

  // hooks to prepare and send ethereum transaction for unstake
  const { config: configUnstake } = usePrepareContractWrite({
    ...quickV2StakerContract,
    functionName: "withdraw",
    args: [toDenom(formState?.transferAmount, 18)],
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

  const { writeAsync: writeAsyncUnstake } = useContractWrite({
    ...configUnstake,
    onError(error) {
      console.error(error);
      notify(null, toastId1, "Transaction Aborted. Try again.");
      toastId1 = null;
    },
  });

  // HANDLER FUNCTIONS
  const handleAmountOnChange = (e) => {
    e.preventDefault();
    formDispatch({
      type: "CHANGE_AMOUNT",
      payload: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // copy form states to local variables
    const localTransferAmount = formState?.transferAmount;
    const localStakedLpBalance = balance?.formatted;

    // manually trigger form validation messages if any
    formDispatch({
      type: "CHANGE_AMOUNT",
      payload: localTransferAmount,
    });

    // manually calculate form validation logic
    const isFormValid =
      !BigNumber(localTransferAmount).isNaN() &&
      !BigNumber(toDenom(localTransferAmount, 18)).isLessThanOrEqualTo(0) &&
      BigNumber(toDenom(localTransferAmount, 18)).isLessThanOrEqualTo(
        BigNumber(toDenom(localStakedLpBalance, 18))
      ) &&
      isObjEmpty(formState?.errorMessages);

    if (isFormValid) {
      try {
        // initiate the toast
        toastId1 = toast.loading("Transaction initiated ...", toastConfig);

        // create transaction
        const transactionResponse = await writeAsyncUnstake();

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
    setShow(false);
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
      {decimalize(maticBalance?.formatted || "0")}&nbsp;
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
    <Stack className={`p-3 rounded-4 w-100`} gap={3}>
      <label
        htmlFor="mntlAmount"
        className="caption2 text-light d-flex align-items-center justify-content-between gap-2"
      >
        Amount{" "}
        <small className="small text-light">
          Staked Balance : {displayAvailableBalance}
        </small>
      </label>
      <Stack
        direction="horizontal"
        gap={2}
        className="p-3 py-2 rounded-2 border border-secondary"
      >
        <input
          type="number"
          placeholder="Enter Amount"
          name="mntlAmount"
          className="bg-transparent flex-grow-1"
          style={{ outline: "none" }}
          value={displayInputAmountValue}
          onChange={handleAmountOnChange}
        />
        <Button
          variant="link"
          className={`bg-secondary p-1 px-2 text-primary text-decoration-none ${
            status === "Disconnected" ? "bg-opacity-75" : ""
          }`}
          onClick={handleOnClickMax}
        >
          Max
        </Button>
      </Stack>
      <small className="small text-light">
        MATIC Balance : {displayMaticBalance}
      </small>
      {isFormAmountError && (
        <small
          id="addressInputErrorMsg"
          className="form-text text-danger d-flex align-items-center gap-1"
        >
          <i className="bi bi-info-circle" /> {displayFormAmountErrorMsg}
        </small>
      )}
      <Stack
        className="align-items-center justify-content-end"
        direction="horizontal"
        gap={2}
      >
        <Button
          variant="primary"
          className="rounded-5 py-2 px-5 d-flex gap-2 align-items-center caption2"
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
        >
          Submit
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <Modal
      show={Show}
      onHide={() => setShow(false)}
      centered
      size="lg"
      aria-labelledby="quickswap-unstake-modal"
    >
      <Modal.Body className="p-0">
        <Stack className="p-3">
          <Stack
            direction="horizontal"
            gap={2}
            className="align-items-center pb-2"
          >
            <Button
              variant="link"
              className="p-0"
              onClick={() => setShow(false)}
            >
              <i className="bi bi-chevron-left fw-bold h2 text-primary" />
            </Button>
            <h2 className="h3 m-0 text-primary">Unstake</h2>
            <Button
              variant="link"
              className="ms-auto"
              onClick={() => setShow(false)}
            >
              <i className="bi bi-x fw-bold h2 text-primary"></i>
            </Button>
          </Stack>
          <Stack
            className="bg-black rounded-4 p-1 align-items-center justify-content-center"
            gap={2}
          >
            {formJSX}
          </Stack>
        </Stack>
      </Modal.Body>
    </Modal>
  );
};
