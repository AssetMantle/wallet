import { useChain } from "@cosmos-kit/react";
import { disconnect } from "@wagmi/core";
import { useWeb3Modal } from "@web3modal/react";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import Link from "next/link";
import { useReducer } from "react";
import { toast } from "react-toastify";
import {
  erc20ABI,
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import {
  defaultChainName,
  defaultChainSymbol,
  ethereumChainSymbol,
  gravityChainName,
  placeholderAvailableBalance,
  toastConfig,
} from "../../config";
import {
  approveMaxDeposit,
  decimalize,
  depositMntlToken,
  ethConfig,
  formConstants,
  fromDenom,
  parentERC20TokenAddress,
  placeholderAddressEth,
  PREPARE_CONTRACT_ERROR,
  toDenom,
  useAllowance,
} from "../../data";
import {
  convertBech32Address,
  handleCopy,
  isObjEmpty,
  shortenEthAddress,
  useIsMounted,
} from "../../lib";
import { Button, Stack } from "react-bootstrap";

const gravityEthereumBridgeContract =
  ethConfig?.mainnet?.gravity?.ethereumBridge;
const chainID = ethConfig?.mainnet?.chainID;
const hookArgs = { watch: true, chainId: chainID };
const mntlTokenContract = {
  address: ethConfig?.mainnet?.token?.parent?.erc20,
  abi: erc20ABI,
};

const EthToPolygonBridge = () => {
  // WALLET HOOKS
  // hooks to work the multi-modal for ethereum
  const { open } = useWeb3Modal();
  // before useAccount, define the isMounted() hook to deal with SSR issues
  const isMounted = useIsMounted();
  // read the allowance of polygon deposit
  const { allowance } = useAllowance();
  // hook to get the cosmos wallet
  const chainContext5 = useChain(defaultChainName);
  const { address: mantleAddress, status: mantleStatus } = chainContext5;
  const gravityAddress = convertBech32Address(mantleAddress, gravityChainName);

  // hook to get the address of the connected ethereum wallet
  const { address, isConnected, connector } = useAccount();
  const isWalletEthConnected = isMounted() && isConnected;
  const isWalletCosmosConnected = isMounted() && mantleStatus == "Connected";
  const MAX_UINT256 = ethers.constants.MaxUint256;
  // const MAX_UINT256 = BigNumber("1.157920892373162e+71");
  let toastId1, toastId2, toastId3, toastId4;

  // wagmi hook to read the allowance of gravity deposit
  const { data: allowanceGravity } = useContractRead({
    ...mntlTokenContract,
    functionName: "allowance",
    args: [address, gravityEthereumBridgeContract?.address],
    select: (data) => data?.toString?.(),
    enabled: isWalletEthConnected && address,
    ...hookArgs,
  });

  // get the MNTL token balance using wagmi hook
  const { data: mntlEthBalanceData } = useBalance({
    address: address,
    token: parentERC20TokenAddress,
    watch: true,
  });

  const mntlEthBalance = toDenom(mntlEthBalanceData?.formatted);

  // get the ETH balance using wagmi hook
  const { data: ethBalanceData } = useBalance({
    address: address,
    watch: true,
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
          BigNumber(toDenom(action.payload)).isGreaterThan(
            BigNumber(mntlEthBalance)
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
        return {
          ...state,
          transferAmount: fromDenom(mntlEthBalance),
        };
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

  // hooks to prepare and send ethereum transaction for token approval
  const { config: configApprove } = usePrepareContractWrite({
    ...mntlTokenContract,
    functionName: "approve",
    args: [gravityEthereumBridgeContract?.address, MAX_UINT256],
    enabled: isWalletEthConnected && address,
    chainId: chainID,
    onError(error) {
      console.error("prepare error: ", error);
      if (true)
        toast.error(PREPARE_CONTRACT_ERROR, {
          ...toastConfig,
        });
    },
  });

  const { writeAsync } = useContractWrite({
    ...configApprove,
    onError(error) {
      console.error(error);
      notify(null, toastId4, "Transaction Aborted. Try again.");
      toastId4 = null;
    },
  });

  // hooks to prepare and send ethereum transaction for token transfer to gravity
  const { config: configSendGravity } = usePrepareContractWrite({
    ...gravityEthereumBridgeContract,
    functionName: "sendToCosmos",
    args: [
      mntlTokenContract?.address,
      gravityAddress,
      toDenom(formState?.transferAmount),
    ],
    enabled:
      isWalletEthConnected &&
      isWalletCosmosConnected &&
      address &&
      gravityAddress &&
      formState?.transferAmount,
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

  const { writeAsync: writeAsyncGravity } = useContractWrite({
    ...configSendGravity,
    onError(error) {
      console.error(error);
      notify(null, toastId3, "Transaction Aborted. Try again.");
      toastId3 = null;
    },
  });

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
        render: <CustomToastWithLink message={message} txHash={txHash} />,
        type: "success",
        isLoading: false,
        toastId: txHash,
        ...toastConfig,
      });
    } else {
      toast.update(id, {
        render: message,
        type: "error",
        isLoading: false,
        ...toastConfig,
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

  const handleSubmitPolygon = async (e) => {
    console.log("inside handleSubmitPolygon()");
    e.preventDefault();

    // copy form states to local variables
    const localTransferAmount = formState?.transferAmount;
    const localMntlEthBalance = mntlEthBalanceData?.formatted;

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
        BigNumber(toDenom(localMntlEthBalance))
      ) &&
      isObjEmpty(formState?.errorMessages);

    if (isFormValid) {
      toastId1 = toast.loading("Transaction initiated ...", toastConfig);
      // define local variables
      const localTransferAmount = formState?.transferAmount;

      // create transaction
      const { response, error } = await depositMntlToken(
        address,
        localTransferAmount,
        connector
      );
      console.log("response: ", response, " error: ", error);

      if (response) {
        notify(response, toastId1, "Transfer might take upto 22 mins. Check ");
      } else {
        notify(null, toastId1, "Transaction Aborted. Try again.");
      }
      // reset the form values
      formDispatch({ type: "RESET" });
    }
  };

  const handleApproveSubmitPolygon = async (e) => {
    console.log("inside handleApproveSubmitPolygon()");
    e.preventDefault();

    try {
      // initiate the toast
      toastId2 = toast.loading("Transaction initiated ...", toastConfig);

      // create transaction
      const { response, error } = await approveMaxDeposit(address, connector);
      console.log("response: ", response, " error: ", error);
      if (response) {
        notify(response, toastId2, "Transaction Submitted. Check ");
      } else {
        notify(null, toastId2, "Transaction Aborted. Try again.");
      }
    } catch (error) {
      console.error("Runtime Error: ", error);
    }
  };

  const handleSubmitGravity = async (e) => {
    console.log("inside handleSubmitGravity()");
    e.preventDefault();

    // copy form states to local variables
    const localTransferAmount = formState?.transferAmount;
    const localMntlEthBalance = mntlEthBalanceData?.formatted;

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
        BigNumber(toDenom(localMntlEthBalance))
      ) &&
      isObjEmpty(formState?.errorMessages);

    if (isFormValid) {
      try {
        // initiate the toast
        toastId3 = toast.loading("Transaction initiated ...", toastConfig);

        // create transaction
        const transactionResponse = await writeAsyncGravity();

        if (transactionResponse?.hash) {
          notify(
            transactionResponse?.hash,
            toastId3,
            "Transfer might take upto 20 mins. Check "
          );
        } else {
          notify(null, toastId3, "Transaction Aborted. Try again.");
        }
      } catch (error) {
        console.error("Runtime Error: ", error);
      }
      formDispatch({ type: "RESET" });
    }
  };

  const handleApproveSubmitGravity = async (e) => {
    console.log("inside handlhandleApproveSubmitGravityeSubmit()");
    e.preventDefault();

    try {
      // initiate the toast
      toastId4 = toast.loading("Transaction initiated ...", toastConfig);

      // create transaction
      const transactionResponse = await writeAsync();

      console.log("response: ", transactionResponse);
      if (transactionResponse?.hash) {
        notify(
          transactionResponse?.hash,
          toastId4,
          "Transaction Submitted. Check "
        );
      } else {
        notify(null, toastId4, "Transaction Aborted. Try again.");
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
  const displayAvailableBalance = !isWalletEthConnected
    ? decimalize(placeholderAvailableBalance)
    : decimalize(mntlEthBalanceData?.formatted);

  const displayAvailableBalanceDenom = defaultChainSymbol;

  const displayEthBalance = !isWalletEthConnected
    ? decimalize(placeholderAvailableBalance)
    : decimalize(ethBalanceData?.formatted);
  const displayEthBalanceDenom = ethereumChainSymbol;

  const displayInputAmountValue = formState?.transferAmount;
  const isFormAmountError = formState?.errorMessages?.transferAmountErrorMsg;
  const displayFormAmountErrorMsg =
    formState?.errorMessages?.transferAmountErrorMsg;
  const isSubmitDisabled =
    !isWalletEthConnected || !isObjEmpty(formState?.errorMessages);
  const isSubmitDisabledGravity =
    !isWalletEthConnected ||
    !isWalletCosmosConnected ||
    !isObjEmpty(formState?.errorMessages);
  const isApproveRequiredPolygon =
    isWalletEthConnected &&
    (BigNumber(allowance).isLessThanOrEqualTo(0) ||
      BigNumber(allowance).isLessThan(
        BigNumber(formState?.transferAmount || 0)
      ));

  const isApproveRequiredGravity =
    isWalletEthConnected &&
    (BigNumber(allowanceGravity).isLessThanOrEqualTo(0) ||
      BigNumber(allowanceGravity).isLessThan(
        BigNumber(formState?.transferAmount || 0)
      ));

  // connect button with logic
  const notConnectedJSX = (
    <button
      className="caption2 d-flex gap-1 text-primary"
      onClick={handleOpenWeb3Modal}
    >
      <i className="bi bi-link-45deg" /> Connect Wallet
    </button>
  );

  const connectButtonJSX = isWalletEthConnected ? (
    <>
      <button
        className="caption2 d-flex gap-1 text-primary"
        onClick={handleCopyOnClick}
        style={{ wordBreak: "break-all" }}
      >
        {displayShortenedAddress} <i className="bi bi-clipboard text-primary" />
        <span className="text-primary" onClick={handleDisconnectWeb3Modal}>
          <i className="bi bi-power" />
        </span>
      </button>
    </>
  ) : (
    notConnectedJSX
  );

  const depositToPolygonButtonJSX = isApproveRequiredPolygon ? (
    <Button
      variant="primary"
      className="d-flex gap-2 align-items-center caption fw-semibold rounded-5 px-4 text-dark"
      onClick={handleApproveSubmitPolygon}
    >
      Approve Polygon Send <i className="bi bi-hand-thumbs-up-fill" />
    </Button>
  ) : (
    <Button
      variant="primary"
      className="d-flex gap-2 align-items-center caption fw-semibold rounded-5 px-4 text-dark"
      disabled={isSubmitDisabled}
      onClick={handleSubmitPolygon}
    >
      Send to Polygon <i className="bi bi-arrow-down" />
    </Button>
  );

  const depositToGravityButtonJSX = isApproveRequiredGravity ? (
    <Button
      variant="outline-primary"
      className="d-flex gap-2 align-items-center caption fw-semibold rounded-5 px-4"
      onClick={handleApproveSubmitGravity}
    >
      Approve Gravity Send <i className="bi bi-hand-thumbs-up-fill" />
    </Button>
  ) : (
    <Button
      variant="outline-primary"
      className="d-flex gap-2 align-items-center caption fw-semibold rounded-5 px-4"
      disabled={isSubmitDisabledGravity}
      onClick={handleSubmitGravity}
    >
      Send to Gravity <i className="bi bi-arrow-up" />
    </Button>
  );

  /* console.log(
    " isConnected: ",
    isConnected,
    "mntl balance: ",
    displayAvailableBalance,
    " eth balance: ",
    displayEthBalance,
    " isApproveRequiredPolygon: ",
    isApproveRequiredPolygon,
    " maxval: ",
    MAX_UINT256.toString(),
    " mntlEthBalanceData?.formatted: ",
    mntlEthBalanceData?.formatted
  ); */

  return (
    <>
      <Stack gap={3} className={`bg-am-gray-200 p-3 rounded-4 ${""}`}>
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
              <img src="/chainLogos/eth.svg" alt="Ethereum Chain" />
            </div>
            <h5 className="caption2 text-primary m-0">Ethereum Chain</h5>
          </Stack>
          {isMounted() && connectButtonJSX}
          {!isMounted() && notConnectedJSX}
        </Stack>
        <label
          htmlFor="GravityAmount"
          className="caption2 text-white-50 d-flex align-items-center justify-content-between gap-2"
        >
          Amount{" "}
          <small className="small text-white-50">
            ETH Balance : {displayEthBalance} {displayEthBalanceDenom}
          </small>
          <small className="small text-white-50">
            MNTL Balance : {displayAvailableBalance}{" "}
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
            name="ethAmount"
            className="caption2 flex-grow-1 bg-transparent border border-0"
            style={{ outline: "none" }}
            value={displayInputAmountValue}
            onChange={handleAmountOnChange}
          />
          <button className="text-primary caption2" onClick={handleOnClickMax}>
            Max
          </button>
        </Stack>
        <small className="small text-error">
          {isFormAmountError && <i className="bi bi-info-circle" />}{" "}
          {displayFormAmountErrorMsg}
        </small>
        <Stack
          direction="horizontal"
          gap={3}
          className="align-items-center justify-content-end"
        >
          {depositToGravityButtonJSX}
          {depositToPolygonButtonJSX}
        </Stack>
      </Stack>
    </>
  );
};

export default EthToPolygonBridge;
