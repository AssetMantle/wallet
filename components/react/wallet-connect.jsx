import { WalletStatus } from "@cosmos-kit/core";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { toastConfig } from "../../config";
import { ConnectOptionObject, WALLET_NOT_FOUND_ERROR_MSG } from "../../data";

const CustomToastWithLink = ({ wallet }) => {
  console.log(
    "inside CustomToastWithLink, installurl: ",
    ConnectOptionObject[wallet]?.installUrl,
    " wallet: ",
    wallet
  );
  return (
    <p>
      Wallet not found. To install click
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
  return !isLoading ? (
    dataBsToggle || dataBsTarget ? (
      <button
        type="button"
        className="button-secondary d-flex gap-1 align-items-center am-connect py-1 px-3"
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
        {buttonText || "Connect Wallet"}
      </button>
    ) : (
      <div className="nav-item dropdown">
        <button
          type="button"
          className="button-secondary d-flex gap-2 align-items-center nav-link dropdown-toggle am-nav-item py-1 px-3 text-lowercase text-primary"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          // disabled={isDisabled}
          onClick={onClickConnectBtn}
          id="navbarDropdown"
        >
          {icon && (
            <div
              className="position-relative rounded-circle"
              style={{ width: "20px", aspectRatio: "1/1" }}
            >
              <img
                layout="fill"
                className="rounded-circle"
                src={icon}
                alt="#"
              />
            </div>
          )}
          {buttonIcon && <i className={`bi ${buttonIcon}`}></i>}
          <span className="caption2 text-primary">
            {buttonText ? buttonText : "Connect Wallet"}
          </span>
        </button>
        <div className="dropdown-menu">{children}</div>
      </div>
    )
  ) : (
    <button
      type="button"
      className="button-secondary d-flex gap-1 align-items-center am-nav-item py-1 px-3"
      disabled
    >
      <span
        className="spinner-grow spinner-grow-sm"
        role="status"
        aria-hidden="true"
      ></span>
      Loading...
    </button>
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

export const Connecting = () => {
  return <ConnectWalletButton isLoading={true} />;
};

export const Rejected = ({ buttonText, onClick }) => {
  return (
    <ConnectWalletButton
      buttonText={buttonText}
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
  walletStatus,
  disconnected,
  connecting,
  connected,
  rejected,
  errored,
  notExist,
}) => {
  useEffect(() => {
    if (walletStatus == WalletStatus.NotExist) {
      toast.error(
        wallet ? (
          <CustomToastWithLink wallet={wallet} />
        ) : (
          WALLET_NOT_FOUND_ERROR_MSG
        ),
        toastConfig
      );
    } else if (
      walletStatus == WalletStatus.Rejected ||
      walletStatus == WalletStatus.Error
    ) {
      toast.error(WALLET_NOT_FOUND_ERROR_MSG, toastConfig);
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
