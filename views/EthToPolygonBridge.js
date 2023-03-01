import { disconnect } from "@wagmi/core";
import { useWeb3Modal } from "@web3modal/react";
import BigNumber from "bignumber.js";
import Link from "next/link";
import { useReducer } from "react";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import {
  defaultChainGasFee,
  defaultChainSymbol,
  ethereumChainSymbol,
  placeholderAvailableBalance,
  toastConfig,
} from "../config";
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
} from "../data";
import {
  handleCopy,
  isObjEmpty,
  shortenEthAddress,
  useIsMounted,
} from "../lib";
import { erc20ABI } from "wagmi";

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
  // hook to get the address of the connected wallet
  const { address, isConnected, connector } = useAccount();
  const isWalletEthConnected = isMounted() && isConnected;
  const MAX_UINT256 = BigNumber(2).exponentiatedBy(256).minus(1);
  // const MAX_UINT256 = BigNumber("1.157920892373162e+71");
  let id3, toastId4;

  // wagmi hook to read the allowance of gravity deposit
  const {
    data: allowanceGravity,
    isError: isErrorAllowanceGravity,
    isLoading: isLoadingAllowanceGravity,
  } = useContractRead({
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
  });

  const mntlEthBalance = toDenom(mntlEthBalanceData?.formatted);

  // get the ETH balance using wagmi hook
  const { data: ethBalanceData } = useBalance({
    address: address,
  });

  const { config: configApprove } = usePrepareContractWrite({
    ...mntlTokenContract,
    functionName: "approve",
    args: [gravityEthereumBridgeContract?.address, ethers.constants.MaxUint256],
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
          BigNumber(mntlEthBalance).isNaN() ||
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
        if (
          BigNumber(mntlEthBalance).isNaN() ||
          BigNumber(mntlEthBalance).isLessThan(BigNumber(defaultChainGasFee))
        ) {
          return {
            ...state,
            transferAmount: mntlEthBalance,
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
            transferAmount: fromDenom(mntlEthBalance),
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
      const id = toast.loading("Transaction initiated ...", toastConfig);
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

  const handleApproveSubmitPolygon = async (e) => {
    console.log("inside handleApproveSubmitPolygon()");
    e.preventDefault();

    try {
      // initiate the toast
      const id2 = toast.loading("Transaction initiated ...", toastConfig);

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

  const handleSubmitGravity = async (e) => {
    console.log("inside handleSubmitGravity()");
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
      id3 = toast.loading("Transaction initiated ...", toastConfig);
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
        notify(response, id3, "Transaction might take upto 22 mins. Check ");
      } else {
        notify(null, id3, "Transaction Aborted. Try again.");
      }
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
  const isApproveRequiredPolygon =
    isWalletEthConnected &&
    (BigNumber(allowance).isZero() ||
      BigNumber(allowance).isLessThan(
        BigNumber(formState?.transferAmount || 0)
      ));

  const isApproveRequiredGravity =
    isWalletEthConnected &&
    (BigNumber(allowanceGravity).isZero() ||
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
    notConnectedJSX
  );

  const depositToPolygonButtonJSX = isApproveRequiredPolygon ? (
    <button
      className="button-primary py-2 px-4 d-flex gap-2 align-items-center caption2"
      onClick={handleApproveSubmitPolygon}
    >
      Approve Polygon Send <i className="bi bi-hand-thumbs-up-fill" />
    </button>
  ) : (
    <button
      className="button-primary py-2 px-4 d-flex gap-2 align-items-center caption2"
      disabled={isSubmitDisabled}
      onClick={handleSubmitPolygon}
    >
      Send to Polygon <i className="bi bi-arrow-down" />
    </button>
  );

  const depositToGravityButtonJSX = isApproveRequiredGravity ? (
    <button
      className="button-secondary py-2 px-4 d-flex gap-2 align-items-center caption2"
      onClick={handleApproveSubmitGravity}
    >
      Approve Gravity Send <i className="bi bi-hand-thumbs-up-fill" />
    </button>
  ) : (
    <button
      className="button-secondary py-2 px-4 d-flex gap-2 align-items-center caption2"
      disabled={isSubmitDisabled}
      onClick={handleSubmitGravity}
    >
      Send to Ethereum <i className="bi bi-arrow-down" />
    </button>
  );

  console.log(
    " isConnected: ",
    isConnected,
    "mntl balance: ",
    displayAvailableBalance,
    " eth balance: ",
    displayEthBalance,
    " isApproveRequiredPolygon: ",
    isApproveRequiredPolygon,
    " maxval: ",
    MAX_UINT256
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
          {!isMounted() && notConnectedJSX}
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
          {depositToGravityButtonJSX}
          {depositToPolygonButtonJSX}
        </div>
      </div>
    </>
  );
};

export default EthToPolygonBridge;
