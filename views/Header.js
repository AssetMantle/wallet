import { useChain } from "@cosmos-kit/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { QRCodeSVG } from "qrcode.react";
import React, { useState } from "react";
import { Button, Stack } from "react-bootstrap";
import { toast } from "react-toastify";
import { ConnectButton, Connected } from "../components";
import { defaultChainName, toastConfig } from "../config";
import {
  ConnectOptionObject,
  NavBarData,
  WALLET_DISCONNECT_ERROR_MSG,
  placeholderAddress,
} from "../data";
import { cleanString, shortenAddress } from "../lib";

export default function Header({ setLeftCol }) {
  const chainContext = useChain(defaultChainName);
  const { username, address, wallet, disconnect } = chainContext;
  // const [showModal, setShowModal] = useState(false);

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
    // setShowModal(false);
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
        {navItem.icon && <span className="body2 icon">{navItem.icon}</span>}
        {navItem.title}
        {navItem.endIcon && (
          <span className="body2 icon">{navItem.endIcon}</span>
        )}
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
      className="position-relative"
      style={{ width: "min(195.05px,30%)", aspectRatio: "195.05/33" }}
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
      className="bg-black p-3 rounded-4 text-white border border-white border-2"
      // style={{ border: "2px solid" }}
    >
      <Stack direction="horizontal" gap={3}>
        <Stack gap={0}>
          <h4 className="body2 m-0">{displayUserName}</h4>
        </Stack>
      </Stack>
      <hr className="border border-white border-1 my-3" />
      <Stack gap={0}>
        <div
          className="position-relative mx-auto"
          style={{
            width: "min(140px, 100%)",
            aspectRatio: "1/1",
          }}
        >
          <QRCodeSVG width="100%" height="100%" value={displayAddress} />
        </div>
        <Button
          variant="link"
          className="d-flex align-items-center justify-content-center gap-2 text-center caption2 pt-3 text-decoration-none text-white"
          onClick={() => navigator.clipboard.writeText(displayAddress)}
        >
          {shortenAddress(displayAddress)}
          <i className="bi bi-files text-primary" />
        </Button>
      </Stack>
      <hr className="border border-white border-1 my-3" />
      <Stack
        gap={0}
        direction="horizontal"
        className="align-items-center justify-content-between text-center caption"
      >
        <Stack direction="horizontal" gap={1} className="align-items-center">
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
        </Stack>
        <Stack direction="horizontal" gap={1} className="align-items-center">
          <i className="bi bi-check-circle text-success" />
          Connected
        </Stack>
      </Stack>
      <hr className="border border-white border-1 my-3" />
      <Button
        variant="link"
        className="d-flex align-items-center justify-content-start gap-2 text-center w-100 py-1 px-0 text-white text-decoration-none"
        onClick={onClickDisconnect}
      >
        <i className="bi bi-box-arrow-left text-primary body2" />
        <span className="body2">Disconnect</span>
      </Button>
    </div>
  );

  // Component
  const connectWalletButton = (
    <ConnectButton>
      <Connected
        buttonText={address ? shortenAddress(address) : "Connected"}
        icon={
          ConnectOptionObject?.[wallet?.prettyName.toLocaleLowerCase()]?.icon
        }
        onClick={handleOnClickConnected}
      >
        {connectedModalJSX}
      </Connected>
    </ConnectButton>
  );

  return (
    <header
      className="bg-black position-sticky top-0 start-0 end-0"
      style={{ zIndex: "1000" }}
    >
      <Stack
        className="align-items-center p-3 px-4 h-auto"
        gap={3}
        direction="horizontal"
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
              ? "am_resp_right_ham w-50 top-0 end-0 bottom-0 d-flex flex-column flex-xl-row bg-black bg-opacity-75 p-4 p-xl-0 gap-5 gap-xl-3 of_auto"
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
              <i className="bi bi-x-lg h2 m-auto"></i>
            </div>
          )}
        </nav>
        <div
          className="d-flex d-xl-none align-items-center ms-auto my-auto"
          role="button"
          onClick={() => setRightHam(true)}
        >
          <i className="bi bi-list h2 text-white m-auto"></i>
        </div>
      </Stack>
    </header>
  );
}
