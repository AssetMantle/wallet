import { disconnect } from "@wagmi/core";
import { useWeb3Modal } from "@web3modal/react";
import BigNumber from "bignumber.js";
import Link from "next/link";
import { useReducer } from "react";
import { toast } from "react-toastify";
import { useAccount, useBalance, useNetwork, useSwitchNetwork } from "wagmi";
import {
  defaultChainSymbol,
  placeholderAvailableBalance,
  polygonChainId,
  polygonChainSymbol,
  toastConfig,
} from "../config";
import {
  childERC20TokenAddress,
  decimalize,
  ethConfig,
  formConstants,
  fromDenom,
  placeholderAddressEth,
  toDenom,
  withdrawMntlToken,
  useCheckpointedBurnTransactions,
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
  const { open } = useWeb3Modal();

  let toastId1;

  // books to get the address of the connected wallet
  const { address, isConnected, connector } = useAccount();

  // get the mntl token balance in polygon chain using wagmi hook
  const { data: mntlEthBalanceData } = useBalance({
    address: address,
    token: childERC20TokenAddress,
    chainId: polygonChainId,
    watch: true,
  });

  const { chain } = useNetwork();
  const { chains, pendingChainId, switchNetwork } = useSwitchNetwork();
  const { burnTransactions } = useCheckpointedBurnTransactions();

  const mntlEthBalance = toDenom(mntlEthBalanceData?.formatted);

  // get the matic balance in polygon chain using wagmi hook
  const { data: polygonBalanceData } = useBalance({
    address: address,
    token: ethConfig?.mainnet?.token?.child?.matic,
    chainId: polygonChainId,
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

  // CONTROLLER FUNCTIONS

  const CustomToastWithLink = ({ txHash, message }) => (
    <p>
      {message}
      <Link href={`https://polygonscan.com/tx/${txHash}`}>
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

  const handleCopyOnClick = (e) => {
    e.preventDefault();
    handleCopy(address);
  };
  const handleOnClickMax = (e) => {
    e.preventDefault();
    formDispatch({
      type: "SET_MAX_AMOUNT",
    });
  };

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

  const handleSubmitWithdraw = async (e) => {
    console.log("inside handleSubmitWithdraw()");
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
      const polygonChainId = ethConfig?.mainnet?.polygonChainId;

      // switch network to polygon
      // switchNetwork?.(polygonChainId);

      // create transaction
      const { response, error } = await withdrawMntlToken(
        address,
        localTransferAmount,
        connector
      );
      console.log("response: ", response, " error: ", error);

      if (response) {
        notify(response, toastId1, "Transfer submitted. Check ");
      } else {
        notify(null, toastId1, "Transaction Aborted. Try again.");
      }
      // reset the form values
      formDispatch({ type: "RESET" });
    }
  };

  // DISPLAY VARIABLES
  const isWalletEthConnected = isMounted() && isConnected;
  const displayShortenedAddress = shortenEthAddress(
    address || placeholderAddressEth
  );
  // const displayShortenedAddress = placeholderAddressEth;
  const displayAvailableBalance = !isWalletEthConnected
    ? decimalize(placeholderAvailableBalance)
    : decimalize(mntlEthBalanceData?.formatted);
  const displayAvailableBalanceDenom = defaultChainSymbol;

  const displayMaticBalance = !isWalletEthConnected
    ? decimalize(placeholderAvailableBalance)
    : decimalize(polygonBalanceData?.formatted);
  const displayMaticBalanceDenom = polygonChainSymbol;

  const isFormAmountError = formState?.errorMessages?.transferAmountErrorMsg;
  const displayFormAmountErrorMsg =
    formState?.errorMessages?.transferAmountErrorMsg;
  const isSubmitDisabled =
    !isWalletEthConnected || !isObjEmpty(formState?.errorMessages);
  const displayInputAmountValue = formState?.transferAmount;

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

  console.log(
    " isMounted(): ",
    isMounted(),
    "mntl balance: ",
    displayAvailableBalance,
    " eth balance: ",
    displayMaticBalance,
    " burnTransactions: ",
    burnTransactions,
    " chain: ",
    chain,
    " chains: ",
    chains
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
          <button
            className="button-primary py-2 px-4 d-flex gap-2 align-items-center caption2"
            disabled={isSubmitDisabled}
            onClick={handleSubmitWithdraw}
          >
            Send to Ethereum <i className="bi bi-arrow-up" />
          </button>
        </div>
      </div>
    </>
  );
};

export default PolygonBridge;
