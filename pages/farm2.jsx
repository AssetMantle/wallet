import { disconnect } from "@wagmi/core";
import { useWeb3Modal } from "@web3modal/react";
import Head from "next/head";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import ScrollableSectionContainer from "../components/ScrollableSectionContainer";
import { ethConfig, placeholderAddressEth } from "../data";
import { handleCopy, shortenEthAddress, useIsMounted } from "../lib";
import { UniswapStakeContents, UniswapUnstakeContents } from "../views";

export default function Farm2() {
  // HOOKS

  const [Tab, setTab] = useState(0);
  const [StakeTab, setStakeTab] = useState(true);
  const [SelectedIncentive, setSelectedIncentive] = useState();
  const tabs = [
    { name: "UniV3 Liquidity Pool" },
    // { name: "Unstake UniV3 LP", href: "#Unstake-UniV3-LP" },
  ];

  const IncentivePrograms = [
    {
      name: "Incentive Program 1",
      ended: true,
      subtitle: "Ended on: 21 Feb, 2023",
    },
    {
      name: "Incentive Program 2",
      ended: false,
      subtitle: "Ended on: 21 Feb, 2023",
    },
    {
      name: "Incentive Program 3",
      ended: true,
      subtitle: "Ended on: 21 Feb, 2023",
    },
    {
      name: "Incentive Program 4",
      ended: true,
      subtitle: "Ended on: 21 Feb, 2023",
    },
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
      className="button-primary px-5 py-2 ms-auto"
      onClick={handleOpenWeb3Modal}
    >
      Connect Wallet
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
      <div className="row nav-bg rounded-4 p-3 mx-0">
        <h4 className="col-3 py-1 caption text-gray">Reward Pool</h4>
        <p className="col-9 py-1 body2">
          {currentRewardPoolDisplay}&nbsp;$MNTL
        </p>
        <h4 className="col-3 py-1 caption text-gray">Duration</h4>
        <p className="col-9 py-1 body2">00Days,00Hours</p>
      </div>
      {!isMounted() && (
        <div className="d-flex flex-column gap-3 mt-5">
          {/* {isMounted() && connectButtonJSX} */}
          {notConnectedJSX}
        </div>
      )}
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
        <ScrollableSectionContainer className="col-12 col-lg-8 d-flex h-90">
          <div className="bg-gray-800 p-4 rounded-4 d-flex flex-column gap-2">
            <nav className="d-flex flex-column align-items-start justify-content-between gap-3">
              <div className="d-flex gap-3 w-100">
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
              <div className="d-flex align-items-center justify-content-between gap-3 w-100">
                <div className="">
                  {isMounted() && (
                    <button
                      className="caption2 d-flex gap-1"
                      onClick={handleCopyOnClick}
                      style={{ wordBreak: "break-all" }}
                    >
                      {address}{" "}
                      <span className="text-primary">
                        <i className="bi bi-clipboard" />
                      </span>
                    </button>
                  )}
                </div>
                <div className="">
                  <div className="btn-group">
                    <button
                      className={`${
                        StakeTab ? "btn btn-primary" : "btn btn-inactive"
                      } caption2`}
                      onClick={() => setStakeTab(true)}
                    >
                      Stake
                    </button>
                    <button
                      className={`${
                        !StakeTab ? "btn btn-primary" : "btn btn-inactive"
                      } caption2`}
                      onClick={() => setStakeTab(false)}
                    >
                      Unstake
                    </button>
                  </div>
                </div>
              </div>
            </nav>
            {stakeDisplayJSX}
            {isMounted() && (
              <>{StakeTab ? stakeContentsJSX : unstakeContentsJSX}</>
            )}
          </div>
        </ScrollableSectionContainer>
        <ScrollableSectionContainer className="col-12 col-lg-4 d-flex flex-column gap-3 h-90">
          {StakeTab ? (
            <>
              <div className="d-flex gap-2 rounded-4 p-3 bg-gray-800 width-100 d-flex flex-column text-white">
                <h2 className="body1 text-primary mb-2">Incentive Programs</h2>
                {IncentivePrograms &&
                  Array.isArray(IncentivePrograms) &&
                  IncentivePrograms.length > 0 &&
                  React.Children.toArray(
                    IncentivePrograms.map((program, index) => (
                      <div
                        className="nav-bg rounded-4 py-3 px-3 mx-0 d-flex align-items-center gap-2"
                        role="button"
                        onClick={() => setSelectedIncentive(index)}
                      >
                        {SelectedIncentive === index ? (
                          <i className="bi bi-record-circle text-primary"></i>
                        ) : (
                          <i className="bi bi-circle"></i>
                        )}
                        <div className="d-flex flex-column gap-1">
                          <p className="text-primary caption">{program.name}</p>
                          <p
                            className={`${
                              program.ended ? "text-gray" : "text-success"
                            } small`}
                          >
                            {program.ended
                              ? program.subtitle
                              : "Currently Active"}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
              </div>
              <div className="rounded-4 p-3 bg-gray-800 width-100 d-flex flex-column text-white">
                <p className="caption2">
                  To purchase MNTL, visit the exchanges (CEX & DEX) shown to
                  swap with your available tokens.
                </p>
                <br></br>
                <p className="caption2">
                  Options to directly on-ramp to MNTL using fiat currencies will
                  be coming soon.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="d-flex gap-4 rounded-4 p-3 bg-gray-800 width-100 d-flex flex-column text-white">
                <h2 className="body1 text-primary">Token Details</h2>
                <div className="nav-bg rounded-4 py-3 px-3 mx-0 d-flex flex-column gap-2">
                  <p className="caption text-gray">Wallet Address</p>
                  <p className="caption text-white pb-1">
                    0x0x010x0...fhd4hm4hg
                  </p>
                  <p className="caption text-gray">Liquidity</p>
                  <p className="caption text-white pb-1">$0,000.0000</p>
                  <p className="caption text-gray">Staking Rewards</p>
                  <p className="caption text-white pb-1">$0,000.0000</p>
                </div>
                <button
                  className="button-primary w-100 py-2 px-5"
                  style={{ maxWidth: "100%" }}
                >
                  Claim Rewards
                </button>
              </div>
              <div className="d-flex gap-2 rounded-4 p-3 bg-gray-800 width-100 d-flex flex-column text-white">
                <h2 className="body1 text-primary mb-2">Incentive Programs</h2>
                {IncentivePrograms &&
                  Array.isArray(IncentivePrograms) &&
                  IncentivePrograms.length > 0 &&
                  React.Children.toArray(
                    IncentivePrograms.map((program, index) => (
                      <div
                        className="nav-bg rounded-4 py-3 px-3 mx-0 d-flex align-items-center gap-2"
                        role="button"
                        onClick={() => setSelectedIncentive(index)}
                      >
                        {SelectedIncentive === index ? (
                          <i className="bi bi-record-circle text-primary"></i>
                        ) : (
                          <i className="bi bi-circle"></i>
                        )}
                        <div className="d-flex flex-column gap-1">
                          <p className="text-primary caption">{program.name}</p>
                          <p
                            className={`${
                              program.ended ? "text-gray" : "text-success"
                            } small`}
                          >
                            {program.ended
                              ? program.subtitle
                              : "Currently Active"}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
              </div>
            </>
          )}
        </ScrollableSectionContainer>
      </section>
    </>
  );
}
