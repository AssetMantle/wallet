import { WalletStatus } from "@cosmos-kit/core";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { toastConfig } from "../../config";
import {
  ConnectOptionObject,
  WALLET_LEDGERAPP_ERROR_MSG,
  WALLET_LOCKED_ERROR_MSG,
  WALLET_NOT_FOUND_ERROR_MSG,
} from "../../data";

const CustomToastWithLink = ({ wallet }) => {
  console.log(
    "inside CustomToastWithLink, installurl: ",
    ConnectOptionObject[wallet]?.installUrl,
    " wallet: ",
    wallet
  );
  return (
    <p className="m-0">
      Wallet not found. To install click&nbsp;
      <Link href={ConnectOptionObject[wallet]?.installUrl}>
        <a style={{ color: "#ffc640" }} target="_blank">
          &nbsp; Here
        </a>
      </Link>
    </p>
  );
};

export const ConnectWalletButton = ({
  buttonText,
  buttonIcon,
  isLoading,
  isDisabled,
  onClickConnectBtn,
  icon,
  dataBsToggle,
  dataBsTarget,
  children,
}) => {
  return dataBsToggle || dataBsTarget ? (
    <Button
      variant="outline-primary"
      className="d-flex gap-1 align-items-center am-connect py-1 px-3 rounded-4 "
      style={{ textTransform: "none", cursor: "pointer" }}
      data-bs-toggle={dataBsToggle}
      data-bs-target={dataBsTarget}
      disabled={isDisabled}
      onClick={onClickConnectBtn}
    >
      {icon && (
        <div
          className="position-relative rounded-circle"
          style={{ width: "23px", aspectRatio: "1/1" }}
        >
          <img layout="fill" className="rounded-circle" src={icon} alt="#" />
        </div>
      )}
      {buttonIcon && <i className={`bi ${buttonIcon}`}></i>}
      {isLoading && (
        <span
          className="spinner-grow spinner-grow-sm"
          role="status"
          aria-hidden="true"
        ></span>
      )}
      &nbsp;{buttonText || "Connect Wallet"}
    </Button>
  ) : (
    <div className="nav-item dropdown">
      <Button
        variant="outline-primary"
        className="d-flex gap-2 align-items-center nav-link dropdown-toggle am-nav-item am-connected py-1 px-3 rounded-4 "
        style={{ textTransform: "none", cursor: "pointer" }}
        data-bs-toggle="dropdown"
        aria-expanded="false"
        onClick={onClickConnectBtn}
        id="navbarDropdown"
      >
        {icon && (
          <div
            className="position-relative rounded-circle"
            style={{ width: "20px", aspectRatio: "1/1" }}
          >
            <img layout="fill" className="rounded-circle" src={icon} alt="#" />
          </div>
        )}
        {buttonIcon && <i className={`bi ${buttonIcon}`}></i>}
        {isLoading && (
          <span
            className="spinner-grow spinner-grow-sm"
            role="status"
            aria-hidden="true"
          ></span>
        )}
        <span className="caption2">
          &nbsp;{buttonText ? buttonText : "Connect Wallet"}
        </span>
      </Button>
      <div className="dropdown-menu border-0">{children}</div>
    </div>
  );
};

export const Disconnected = ({ buttonText, buttonIcon, onClick }) => {
  return (
    <ConnectWalletButton
      buttonText={buttonText}
      buttonIcon={buttonIcon}
      onClickConnectBtn={onClick}
      dataBsTarget="#WalletConnectModal"
      dataBsToggle="modal"
    />
  );
};

export const Connected = ({
  buttonText,
  buttonIcon,
  icon,
  onClick,
  children,
}) => {
  return (
    <ConnectWalletButton
      buttonText={buttonText}
      buttonIcon={buttonIcon}
      icon={icon}
      onClickConnectBtn={onClick}
    >
      {children}
    </ConnectWalletButton>
  );
};

export const Connecting = ({ onClick }) => {
  return (
    <ConnectWalletButton
      isLoading={true}
      buttonText={"Loading..."}
      onClickConnectBtn={onClick}
    />
  );
};

export const Rejected = ({ buttonText, buttonIcon, onClick }) => {
  return (
    <ConnectWalletButton
      buttonText={buttonText}
      buttonIcon={buttonIcon}
      isDisabled={false}
      onClickConnectBtn={onClick}
    />
  );
};

export const Errored = ({ buttonText, buttonIcon, onClick }) => {
  return (
    <ConnectWalletButton
      buttonText={buttonText}
      buttonIcon={buttonIcon}
      isDisabled={false}
      onClickConnectBtn={onClick}
    />
  );
};

export const NotExist = ({ buttonText, buttonIcon, onClick }) => {
  return (
    <ConnectWalletButton
      buttonText={buttonText}
      buttonIcon={buttonIcon}
      isDisabled={false}
      onClickConnectBtn={onClick}
    />
  );
};

export const WalletConnectComponent = ({
  wallet,
  walletName,
  walletStatus,
  walletMessage,
  disconnect,
  disconnected,
  connecting,
  connected,
  rejected,
  errored,
  notExist,
}) => {
  useEffect(() => {
    console.log(
      "inside WalletConnectComponent, wallet status: ",
      walletStatus,
      " wallet name: ",
      walletName
    );
    if (walletStatus == WalletStatus.NotExist) {
      toast.error(
        wallet ? (
          <CustomToastWithLink wallet={wallet} />
        ) : (
          WALLET_NOT_FOUND_ERROR_MSG
        ),
        toastConfig
      );
      disconnect();
    } else if (
      walletStatus == WalletStatus.Rejected ||
      walletStatus == WalletStatus.Error
    ) {
      if (walletMessage?.toString?.()?.includes?.("0x5515")) {
        toast.error(WALLET_LOCKED_ERROR_MSG, toastConfig);
        disconnect();
      } else if (walletMessage?.toString?.()?.includes?.("0x6e01")) {
        toast.error(WALLET_LEDGERAPP_ERROR_MSG, toastConfig);
        disconnect();
      } else if (walletMessage?.toString?.()?.includes?.("CLA_NOT_SUPPORTED")) {
        toast.error(WALLET_LEDGERAPP_ERROR_MSG, toastConfig);
        disconnect();
      } else if (walletMessage?.toString?.()?.includes?.("INS_NOT_SUPPORTED")) {
        toast.error(WALLET_LEDGERAPP_ERROR_MSG, toastConfig);
        disconnect();
      } else if (
        walletMessage?.toString?.()?.includes?.("Failed to execute 'open'")
      ) {
        toast.error(WALLET_LEDGERAPP_ERROR_MSG, toastConfig);
        disconnect();
      } else if (
        walletMessage?.toString?.()?.includes?.("The device was disconnected")
      ) {
        toast.error(WALLET_LEDGERAPP_ERROR_MSG, toastConfig);
        disconnect();
      } else {
        toast.error(WALLET_NOT_FOUND_ERROR_MSG, toastConfig);
        disconnect();
      }
    }

    return () => {};
  }, [wallet, walletStatus]);

  switch (walletStatus) {
    case WalletStatus.Disconnected:
      return <>{disconnected}</>;
    case WalletStatus.Connecting:
      return <>{connecting}</>;
    case WalletStatus.Connected:
      return <>{connected}</>;
    case WalletStatus.Rejected:
      return <>{rejected}</>;
    case WalletStatus.Error:
      return <>{errored}</>;
    case WalletStatus.NotExist:
      return <>{notExist}</>;
    default:
      return <>{disconnected}</>;
  }
};
