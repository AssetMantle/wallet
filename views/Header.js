import { useChain } from "@cosmos-kit/react";
import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import React, { Suspense, useEffect, useRef, useState } from "react";
import { BsCheckCircle } from "react-icons/bs";
import { MdOutlineContentCopy } from "react-icons/md";
import { TbUnlink } from "react-icons/tb";
import {
  Connected,
  Connecting,
  Disconnected,
  Error,
  NotExist,
  Rejected,
  WalletConnectComponent,
} from "../components";
import {
  defaultChainName,
  defaultChainSymbol,
  placeholderAvailableBalance,
} from "../config";
import {
  fromDenom,
  NavBarData,
  placeholderAddress,
  useAvailableBalance,
} from "../data";
import { shortenAddress } from "../lib";

export default function Header() {
  const {
    chain,
    openView,
    username,
    address,
    wallet,
    status,
    connect,
    disconnect,
  } = useChain(defaultChainName);

  console.log({
    chain,
    openView,
    username,
    wallet,
    status,
    connect,
    disconnect,
  });

  const ConnectOptionObject = {
    cosmostation: {
      icon: "/WalletIcons/cosmostation.png",
      name: "Cosmostation",
    },
    keplr: {
      icon: "/WalletIcons/keplr.png",
      name: "Keplr",
    },
    keystore: {
      icon: "/WalletIcons/keystore.png",
      name: "Keystore",
    },
    leap: {
      icon: "/WalletIcons/leap.png",
      name: "Leap",
    },
    ledger: {
      icon: "/WalletIcons/ledger.png",
      name: "Ledger",
    },
  };

  // Events
  const onClickConnect = async (e) => {
    e.preventDefault();
    await connect();
  };

  const onClickDisconnect = async (e) => {
    e.preventDefault();
    await disconnect();
  };

  const handleOpenConnectedModal = (e) => {
    e.preventDefault();
    openView();
  };

  console.log(
    "ICONN: ",
    ConnectOptionObject[wallet?.prettyName.toLocaleLowerCase()]?.icon
  );

  // Component
  const connectWalletButton = (
    <WalletConnectComponent
      walletStatus={status}
      disconnect={
        <Disconnected
          buttonText="Connect"
          buttonIcon="bi-wallet2"
          onClick={onClickConnect}
        />
      }
      connecting={<Connecting />}
      connected={
        <Connected
          buttonText={address ? shortenAddress(address) : "Connected"}
          icon={
            ConnectOptionObject?.[wallet?.prettyName.toLocaleLowerCase()]?.icon
          }
          onClick={handleOpenConnectedModal}
        />
      }
      rejected={<Rejected buttonText="Reconnect" onClick={onClickConnect} />}
      error={<Error buttonText="Change Wallet" onClick={onClickDisconnect} />}
      notExist={
        <NotExist
          buttonText="Install Wallet"
          onClick={() => window.open("https://www.keplr.app/", "_blank")}
        />
      }
    />
  );

  const profileRef = useRef();

  const [Location, setLocation] = useState();
  const path = Location && Location.pathname;
  useEffect(() => {
    if (typeof window !== "undefined") {
      setLocation(window.location);
    }
  }, [Location]);

  const { availableBalance } = useAvailableBalance();

  const displayAddress = address || placeholderAddress;
  const displayBalance =
    availableBalance == placeholderAvailableBalance
      ? availableBalance
      : fromDenom(availableBalance);
  const displayUserName = username || "Default User";

  const navigationMenusRightJSX = NavBarData.rightNav.map((navItem, index) => (
    <Link href={navItem.href} key={index}>
      <a
        className={`d-flex gap-1 align-items-center h3 text-white ${
          path && path === navItem.href ? "active" : ""
        }`}
        target={navItem.target ? navItem.target : "_self"}
      >
        {navItem.icon && <span className="h3 icon">{navItem.icon}</span>}
        {navItem.title}
        {navItem.endIcon && <span className="h3 icon">{navItem.endIcon}</span>}
      </a>
    </Link>
  ));

  const navigationMenusLeftJSX = NavBarData.navs.map((navItem, index) => (
    <Link href={navItem.href} key={index}>
      <a
        className={`d-flex gap-1 align-items-center ${
          path && path === navItem.href ? "active" : ""
        } am-nav-item h3 `}
        target={navItem.target ? navItem.target : "_self"}
      >
        {navItem.icon && <span className="h3 icon">{navItem.icon}</span>}
        {navItem.title}
        {navItem.endIcon && <span className="h3 icon">{navItem.endIcon}</span>}
      </a>
    </Link>
  ));

  const appLogoJSX = (
    <div
      className="d-flex position-relative"
      style={{ width: "min(195.05px,30%)", aspectRatio: "195.05/33" }}
    >
      <Image layout="fill" src={NavBarData.logo} alt={NavBarData.title} />
    </div>
  );

  const connectedModalJSX = (
    <div
      className="modal"
      id="connectedModal"
      aria-labelledby="connectedModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="dropdown-menu pt-3">
            <div
              className="nav-bg p-3 rounded-4 text-white border-color-white-400"
              style={{ border: "2px solid" }}
            >
              <div className="d-flex gap-3">
                <div className="d-flex flex-column gap-0">
                  <h4 className="body2">
                    <Suspense fallback="Loading...">{displayUserName}</Suspense>
                  </h4>
                  <p className="caption">
                    <Suspense fallback="Loading...">
                      {displayBalance} {defaultChainSymbol}
                    </Suspense>
                  </p>
                </div>
              </div>
              <hr className="my-3" />
              <div className="d-flex flex-column">
                <div
                  className="position-relative mx-auto"
                  style={{
                    width: "min(140px, 100%)",
                    aspectRatio: "1/1",
                  }}
                >
                  <Suspense fallback="Loading...">
                    <QRCodeSVG
                      width="100%"
                      height="100%"
                      value={displayAddress}
                    />
                  </Suspense>
                </div>
                <button
                  className="d-flex align-items-center justify-content-center gap-2 text-center caption2 pt-3"
                  onClick={() => navigator.clipboard.writeText(displayAddress)}
                >
                  <Suspense fallback="Loading...">
                    {displayAddress.substring(0, 9)}...
                    {displayAddress.substring(
                      displayAddress.length - 9,
                      displayAddress.length
                    )}
                  </Suspense>
                  <span className="text-primary">
                    <MdOutlineContentCopy />
                  </span>
                </button>
              </div>
              <hr className="my-3" />
              <div className="d-flex align-items-center justify-content-between gap-2 text-center caption">
                <div className="d-flex align-items-center gap-1">
                  <div
                    className="position-relative"
                    style={{ width: "25px", aspectRatio: "1/1" }}
                  >
                    <Image layout="fill" src={"#"} alt={"#"} />
                  </div>
                  {"name"}
                </div>
                <div className="d-flex align-items-center gap-1">
                  <span className="text-success">
                    <BsCheckCircle />
                  </span>
                  Connected
                </div>
              </div>
              <hr className="my-3" />
              <button
                className="d-flex align-items-center justify-content-center gap-2 text-center body2"
                onClick={disconnect}
              >
                <span className="text-primary">
                  <TbUnlink />
                </span>
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <header
      className="nav-bg position-sticky top-0 start-0 end-0"
      style={{ zIndex: "1000" }}
    >
      <div className="container-xxl d-flex align-items-center gap-3 p-3 px-4">
        {appLogoJSX}
        <nav className="navbar-nav d-flex align-items-center gap-3 flex-row gap-3 flex-grow-1 justify-content-between">
          <div className="d-flex gap-4 flex-row align-items-center">
            {navigationMenusLeftJSX}
          </div>
          <div className="d-flex gap-3 flex-row align-items-center">
            {navigationMenusRightJSX}
            {connectWalletButton}
          </div>
        </nav>
      </div>
    </header>
  );
}
