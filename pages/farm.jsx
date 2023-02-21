import { disconnect } from "@wagmi/core";
import { useWeb3Modal } from "@web3modal/react";
import Head from "next/head";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import ScrollableSectionContainer from "../components/ScrollableSectionContainer";
import { ethConfig, placeholderAddressEth } from "../data";
import { handleCopy, shortenEthAddress, useIsMounted } from "../lib";
import { UniswapStakeContents, UniswapUnstakeContents } from "../views";

export default function Farm() {
  // HOOKS

  const [Tab, setTab] = useState(0);
  const tabs = [
    { name: "Stake UniV3 LP", href: "#Stake-UniV3-LP" },
    { name: "Unstake UniV3 LP", href: "#Unstake-UniV3-LP" },
  ];

  const latestIncentiveProgram =
    ethConfig?.mainnet?.uniswap?.incentivePrograms?.[0];

  // hooks to work the multi-modal for ethereum
  const { open } = useWeb3Modal();

  // before useAccount, define the isMounted() hook to deal with SSR issues
  const isMounted = useIsMounted();

  // books to get the address of the connected wallet
  const { address, isConnected } = useAccount();

  // HANDLER FUNCTIONS
  const handleCopyOnClick = (e) => {
    e.preventDefault();
    handleCopy(address);
  };

  const handleOpenWeb3Modal = async (e) => {
    e.preventDefault();
    await open();
  };

  const handleDisconnectWeb3Modal = async (e) => {
    e.preventDefault();
    await disconnect();
  };

  // DISPLAY VARIABLES
  const displayShortenedAddress = shortenEthAddress(
    address || placeholderAddressEth
  );
  const isWalletEthConnected = isMounted() && isConnected;
  const currentRewardPoolDisplay = latestIncentiveProgram?.totalRewards;

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

  const stakeDisplayJSX = (
    <div
      className="d-flex flex-column w-100 rounded-4 flex-grow-1 pt-2"
      style={{ height: "90%" }}
    >
      <div className="row farm-data-container nav-bg rounded-4 p-3 mx-0">
        <div className="col-3 d-flex flex-column gap-3">
          <h4 className="caption text-gray">Reward Pool</h4>
          <p className="body1">{currentRewardPoolDisplay}&nbsp;$MNTL</p>
        </div>
        <div className="col-3 d-flex flex-column gap-3">
          <h4 className="caption text-gray">End</h4>
          <p className="body1">--</p>
        </div>
        <div className="col-6 d-flex flex-column gap-3">
          <h4 className="caption text-gray">Connect</h4>
          {isMounted() && connectButtonJSX}
          {!isMounted() && notConnectedJSX}
        </div>
      </div>
    </div>
  );

  const stakeContentsJSX = <UniswapStakeContents />;

  const unstakeContentsJSX = <UniswapUnstakeContents />;

  console.log(
    "mounted: ",
    isMounted(),
    " address: ",
    address,
    " connected: ",
    isConnected,
    " isWalletEthConnected: ",
    isWalletEthConnected
  );

  return (
    <>
      <Head>
        <title>Farm | MantleWallet</title>
      </Head>
      <section className="row h-100">
        <ScrollableSectionContainer className="col-12 col-lg-8 d-flex">
          <div className="bg-gray-800 p-3 rounded-4 d-flex flex-column gap-2">
            <nav className="d-flex align-items-center justify-content-between gap-3">
              <div className="d-flex gap-3 align-items-center">
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    className={`body1 ${
                      Tab === index ? "text-primary" : "text-white"
                    }`}
                    onClick={() => setTab(index)}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </nav>
            {
              {
                0: stakeDisplayJSX,
                1: stakeDisplayJSX,
              }[Tab]
            }
          </div>
          <div className="p-1"></div>
          {
            {
              0: stakeContentsJSX,
              1: unstakeContentsJSX,
            }[Tab]
          }
          <div className="p-2"></div>
        </ScrollableSectionContainer>
        <div className="col-12 col-lg-4">
          <div className="rounded-4 p-3 my-2 bg-gray-800 width-100 d-flex flex-column text-white">
            <p>
              To purchase MNTL, visit the exchanges (CEX & DEX) shown to swap
              with your available tokens.
            </p>
            <br></br>
            <p>
              Options to directly on-ramp to MNTL using fiat currencies will be
              coming soon.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
