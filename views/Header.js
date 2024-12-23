import { useChain } from "@cosmos-kit/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { QRCodeSVG } from "qrcode.react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { ConnectButton, Connected } from "../components";
import { defaultChainName, toastConfig } from "../config";
import {
  ConnectOptionObject,
  NavBarData,
  placeholderAddress,
  WALLET_DISCONNECT_ERROR_MSG,
} from "../data";
import { cleanString, shortenAddress } from "../lib";

export default function Header({ setLeftCol }) {
  const chainContext = useChain(defaultChainName);
  const { username, address, wallet, disconnect } = chainContext;
  const [showModal, setShowModal] = useState(false);

  // menus ham
  const [rightHam, setRightHam] = useState(false);

  const router = useRouter();

  // Events

  const onClickDisconnect = async (e) => {
    e.preventDefault();
    try {
      await disconnect(wallet?.name);
    } catch (error) {
      console.error(error);
      toast.error(WALLET_DISCONNECT_ERROR_MSG, toastConfig);
    }
  };

  const handleOnClickConnected = (e) => {
    e.preventDefault();
    setShowModal(false);
  };

  const displayAddress = address || placeholderAddress;
  const displayUserName = username || "Default User";

  const navigationMenusRightJSX = NavBarData.rightNav.map((navItem, index) => (
    <Link href={navItem.href} key={index}>
      <a
        className={`d-flex gap-1 justify-content-center m-0 align-items-center h3 text-white ${
          router.asPath === navItem.href ? "active" : ""
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
          router.asPath === navItem.href ? "active" : ""
        } am-nav-item caption`}
        target={navItem.target ? navItem.target : "_self"}
      >
        {navItem.icon && <span className="caption icon">{navItem.icon}</span>}
        {navItem.title}
        {navItem.endIcon && (
          <span className="caption icon">{navItem.endIcon}</span>
        )}
      </a>
    </Link>
  ));

  const appLogoJSX = (
    <div
      className="d-flex position-relative"
      style={{ width: "min(195.05px,30%)", aspectRatio: "5591/900" }}
    >
      <Link href="/">
        <a>
          <Image
            layout="fill"
            src={NavBarData.logo}
            alt={NavBarData.title}
            priority={true}
          />
        </a>
      </Link>
    </div>
  );

  const connectedModalJSX = (
    <div
      className="nav-bg p-3 rounded-4 text-white border-color-white-400"
      style={{ border: "2px solid" }}
    >
      <div className="d-flex gap-3">
        <div className="d-flex flex-column gap-0">
          <h4 className="body2">
            {displayUserName.includes("mantle1") &&
            displayUserName.length === 45
              ? shortenAddress(displayUserName)
              : displayUserName}
          </h4>
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
          <QRCodeSVG width="100%" height="100%" value={displayAddress} />
        </div>
        <button
          className="d-flex align-items-center justify-content-center gap-2 text-center caption2 pt-3"
          onClick={() => navigator.clipboard.writeText(displayAddress)}
        >
          {shortenAddress(displayAddress)}
          <span className="text-primary">
            <i className="bi bi-files" />
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
            <img
              layout="fill"
              src={ConnectOptionObject[cleanString(wallet?.prettyName)]?.icon}
              alt={"♦︎"}
            />
          </div>
          {ConnectOptionObject[cleanString(wallet?.prettyName)]?.name}
        </div>
        <div className="d-flex align-items-center gap-1">
          <span className="text-success">
            <i className="bi bi-check-circle" />
          </span>
          Connected
        </div>
      </div>
      <hr className="my-3" />
      <button
        className="d-flex align-items-center justify-content-start gap-2 text-center body2 w-100 py-1"
        onClick={onClickDisconnect}
      >
        <span className="text-primary">
          <i className="bi bi-box-arrow-left" />
        </span>
        Disconnect
      </button>
    </div>
  );

  // Component
  const connectWalletButton = (
    <ConnectButton>
      <Connected
        buttonText={address ? shortenAddress(address) : "Connected"}
        icon={ConnectOptionObject?.[cleanString(wallet?.prettyName)]?.icon}
        onClick={handleOnClickConnected}
      >
        {connectedModalJSX}
      </Connected>
    </ConnectButton>
  );

  return (
    <header
      className="nav-bg position-sticky top-0 start-0 end-0"
      style={{ zIndex: "1000" }}
    >
      <div
        className="container-xxl d-flex align-items-center gap-3 p-3 px-4"
        style={{ maxWidth: "1920px" }}
      >
        <div
          className="d-flex d-lg-none my-auto"
          role="button"
          onClick={() => setLeftCol(true)}
        >
          <i className="bi bi-list h2"></i>
        </div>
        {appLogoJSX}
        <nav
          className={`navbar-nav d-none d-xl-flex align-items-center gap-3 flex-row gap-3 flex-grow-1 justify-content-center justify-content-xl-between ${
            rightHam
              ? "am_resp_right_ham w-50 top-0 end-0 bottom-0 d-flex flex-column flex-xl-row nav-bg p-4 p-xl-0 gap-5 gap-xl-3 of_auto"
              : ""
          }`}
        >
          <div
            className={`d-flex gap-4 flex-column flex-xl-row align-items-center`}
          >
            {navigationMenusLeftJSX}
          </div>
          <div className="d-flex gap-3 flex-row align-items-center">
            {navigationMenusRightJSX}
            {connectWalletButton}
          </div>
          {rightHam && (
            <div
              className="d-flex d-xl-none position-absolute top-0 start-0 p-3"
              role="button"
              onClick={() => setRightHam(false)}
            >
              <i className="bi bi-x-lg h2"></i>
            </div>
          )}
        </nav>
        <div
          className="d-flex d-xl-none ms-auto my-auto"
          role="button"
          onClick={() => setRightHam(true)}
        >
          <i className="bi bi-list h2 text-white"></i>
        </div>
      </div>
    </header>
  );
}
