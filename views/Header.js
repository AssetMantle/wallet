import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlineContentCopy } from "react-icons/md";
import { RiKey2Fill } from "react-icons/ri";
import { TbUnlink } from "react-icons/tb";
import { BsWallet2, BsCheckCircle, BsChevronDown } from "react-icons/bs";
import {
  BasicData,
  fromDenom,
  placeholderAddress,
  useAvailableBalance,
} from "../data";
import ModalContainer from "../components/ModalContainer";
import ConnectModal from "./ConnectModal";
import { useWallet } from "@cosmos-kit/react";
import { QRCodeSVG } from "qrcode.react";
import { defaultChainSymbol } from "../config";

export default function Header({ Connected, setConnected }) {
  const [ConnectFlow, setConnectFlow] = useState();
  const [ConnectOption, setConnectOption] = useState("keplr");
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

  const profileRef = useRef();

  const [Location, setLocation] = useState();
  const path = Location && Location.pathname;
  useEffect(() => {
    if (typeof window !== "undefined") {
      setLocation(window.location);
    }
  }, [Location]);

  const { availableBalance } = useAvailableBalance();
  const walletManager = useWallet();
  const { username, address } = walletManager;

  const displayAddress = address ? address : placeholderAddress;
  const displayBalance = availableBalance
    ? fromDenom(availableBalance)
    : "0.000";
  const displayUserName = username ? username : "Default User";

  return (
    <>
      <header
        className="nav-bg position-sticky top-0 start-0 end-0"
        style={{ zIndex: "1000" }}
      >
        <div className="container-xxl d-flex align-items-center gap-3 p-3 px-4">
          <div
            className="d-flex position-relative"
            style={{ width: "min(195.05px,30%)", aspectRatio: "195.05/33" }}
          >
            <Image layout="fill" src={BasicData.logo} alt={BasicData.title} />
          </div>
          <nav className="navbar-nav d-flex align-items-center gap-3 flex-row gap-3 flex-grow-1 justify-content-between">
            <div className="d-flex gap-4 flex-row align-items-center">
              {React.Children.toArray(
                BasicData.navs.map((navItem) => (
                  <Link href={navItem.href}>
                    <a
                      className={`d-flex gap-1 align-items-center ${
                        path && path === navItem.href ? "active" : ""
                      } am-nav-item h3 `}
                      target={navItem.target ? navItem.target : "_self"}
                    >
                      {navItem.icon && (
                        <span className="h3 icon">{navItem.icon}</span>
                      )}
                      {navItem.title}
                      {navItem.endIcon && (
                        <span className="h3 icon">{navItem.endIcon}</span>
                      )}
                    </a>
                  </Link>
                ))
              )}
            </div>
            <div className="d-flex gap-3 flex-row align-items-center">
              {React.Children.toArray(
                BasicData.rightNav.map((navItem) => (
                  <Link href={navItem.href}>
                    <a
                      className={`d-flex gap-1 align-items-center h3 text-white ${
                        path && path === navItem.href ? "active" : ""
                      }`}
                      target={navItem.target ? navItem.target : "_self"}
                    >
                      {navItem.icon && (
                        <span className="h3 icon">{navItem.icon}</span>
                      )}
                      {navItem.title}
                      {navItem.endIcon && (
                        <span className="h3 icon">{navItem.endIcon}</span>
                      )}
                    </a>
                  </Link>
                ))
              )}
              {Connected ? (
                <div className="nav-item dropdown">
                  <button
                    className="button-secondary nav-link d-flex gap-2 align-items-center dropdown-toggle am-nav-item py-1 px-3"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    ref={profileRef}
                  >
                    <div
                      className="position-relative rounded-circle"
                      style={{ width: "23px", aspectRatio: "1/1" }}
                    >
                      <Image
                        layout="fill"
                        className="rounded-circle"
                        src={
                          ConnectOptionObject[ConnectOption.toLowerCase()].icon
                        }
                        alt={
                          ConnectOptionObject[ConnectOption.toLowerCase()].name
                        }
                      />
                    </div>
                    <span
                      style={{
                        textTransform: "lowercase",
                      }}
                    >
                      {displayAddress &&
                        `${displayAddress.substring(
                          0,
                          5
                        )}...${displayAddress.substring(
                          displayAddress.length - 5,
                          displayAddress.length
                        )}`}
                    </span>
                    <span className="rotatableIcon">
                      <BsChevronDown />
                    </span>
                  </button>
                  <div className="dropdown-menu pt-3">
                    <div
                      className="nav-bg p-3 rounded-4 text-white border-color-white-400"
                      style={{ border: "2px solid" }}
                    >
                      <div className="d-flex gap-3 py-3">
                        <div className="d-flex flex-column gap-0">
                          <h4 className="body2">{displayUserName}</h4>
                          <p className="caption">
                            {displayBalance} {defaultChainSymbol}
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
                          <QRCodeSVG
                            width="100%"
                            height="100%"
                            value={displayAddress}
                          />
                        </div>
                        <button
                          className="d-flex align-items-center justify-content-center gap-2 text-center body2"
                          onClick={() =>
                            navigator.clipboard.writeText(displayAddress)
                          }
                        >
                          {displayAddress.substring(0, 9)}...
                          {displayAddress.substring(
                            displayAddress.length - 9,
                            displayAddress.length
                          )}
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
                            <Image
                              layout="fill"
                              src={
                                ConnectOptionObject[ConnectOption.toLowerCase()]
                                  .icon
                              }
                              alt={
                                ConnectOptionObject[ConnectOption.toLowerCase()]
                                  .name
                              }
                            />
                          </div>
                          {
                            ConnectOptionObject[ConnectOption.toLowerCase()]
                              .name
                          }
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
                        onClick={walletManager.disconnect}
                      >
                        <span className="text-primary">
                          <TbUnlink />
                        </span>
                        Disconnect
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  className="button-secondary d-flex gap-1 align-items-center am-nav-item py-1 px-3"
                  // onClick={walletManager.connect}
                  onClick={() => setConnectFlow(1)}
                >
                  <span className="text-primary">
                    <BsWallet2 />
                  </span>
                  Connect
                </button>
              )}
            </div>
          </nav>
        </div>
      </header>
      <ModalContainer active={ConnectFlow && true}>
        <ConnectModal
          isConnected={setConnected}
          step={ConnectFlow}
          setStep={setConnectFlow}
          byWallet={ConnectOption}
          setByWallet={setConnectOption}
          close={setConnectFlow}
        />
      </ModalContainer>
    </>
  );
}
