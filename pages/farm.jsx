import { disconnect } from "@wagmi/core";
import { useWeb3Modal } from "@web3modal/react";
import { BigNumber } from "bignumber.js";
import Head from "next/head";
import React, { useState } from "react";
import useSWR from "swr";
import { useAccount } from "wagmi";
import ScrollableSectionContainer from "../components/ScrollableSectionContainer";
import { defaultChainSymbol, getBalanceStyle } from "../config";
import {
  fromChainDenom,
  placeholderAddressEth,
  useIncentiveList,
} from "../data";
import {
  getTimeDifference,
  handleCopy,
  shortenEthAddress,
  useIsMounted,
} from "../lib";
import {
  UniswapRewards,
  UniswapStakeContents,
  UniswapUnstakeContents,
} from "../views";

export default function Farm() {
  // HOOKS

  const [Tab, setTab] = useState(0);
  const [StakeTab, setStakeTab] = useState(true);
  const tabs = [{ name: "Uniswap V3 LP Staking" }];
  const { incentiveList, isLoadingIncentiveList } = useIncentiveList();
  const { data: selectedIncentiveIndex } = useSWR("selectedIncentive");
  const isIncentivePopulated = !isLoadingIncentiveList && incentiveList?.length;

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

  const currentRewardPoolDisplay = isIncentivePopulated
    ? getBalanceStyle(
        fromChainDenom(incentiveList?.[selectedIncentiveIndex]?.reward),
        "caption",
        "caption2"
      )
    : getBalanceStyle(fromChainDenom(0), "caption", "caption2");

  const currentRewardPoolDenomDisplay = defaultChainSymbol;

  const currentTimestamp = Math.floor(Date.now() / 1000);

  const incentiveEndTimestamp =
    incentiveList?.[selectedIncentiveIndex]?.endTime || 0;

  const incentiveDurationDisplay = isIncentivePopulated
    ? BigNumber(incentiveEndTimestamp).isGreaterThan(
        BigNumber(currentTimestamp)
      )
      ? `${getTimeDifference(
          incentiveEndTimestamp,
          currentTimestamp
        )} remaining`
      : `Incentive Ended`
    : `---`;

  console.log(
    "isIncentivePopulated: ",
    isIncentivePopulated,
    " incentiveList: ",
    incentiveList,
    " isLoadingIncentiveList: ",
    isLoadingIncentiveList,
    " incentiveEndTimestamp: ",
    incentiveEndTimestamp,
    " currentTimestamp: ",
    currentTimestamp
  );

  const tabTitleJSX = tabs.map((tab, index) => (
    <button
      key={index}
      className={`body1 ${Tab === index ? "text-primary" : "text-white"}`}
      onClick={() => setTab(index)}
    >
      {tab.name}
    </button>
  ));

  const tabGroupJSX = (
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
  );

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

  const stakeDashboardJSX = (
    <div
      className="d-flex flex-column w-100 rounded-4 flex-grow-1 pt-2"
      style={{ height: "90%" }}
    >
      <div className="row nav-bg rounded-4 p-3 mx-0">
        <h4 className="col-3 py-1 caption text-gray">Reward Pool</h4>
        <p className="col-9 py-1 body2">
          {currentRewardPoolDisplay}&nbsp;{currentRewardPoolDenomDisplay}
        </p>
        <h4 className="col-3 py-1 caption text-gray">Duration</h4>
        <p className="col-9 py-1 body2">{incentiveDurationDisplay}</p>
        <h4 className="col-3 py-1 caption text-gray">TVL</h4>
        <p className="col-9 py-1 body2">$30,000</p>
        <h4 className="col-3 py-1 caption text-gray">APR</h4>
        <p className="col-9 py-1 body2">200%</p>
        <h4 className="col-3 py-1 caption text-gray">Token Pair</h4>
        <p className="col-9 py-1 body2">
          MNTL-ETH (click{" "}
          <a
            className="text-primary text-decoration-none body2"
            href="https://info.uniswap.org/#/pools/0xf5b8304dc18579c4247caad705df01928248bc71"
            target="_blank"
            rel="noopener noreferrer"
          >
            here
          </a>{" "}
          to add liquidity)
        </p>
        <div className="col-12 rounded-3 py-2 px-3 my-1 caption2 border border-1">
          <i className="bi bi-info-circle" />
          &nbsp;Keep the fee as 0.3% while adding liquidity
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
    isWalletEthConnected,
    " incentiveList: ",
    incentiveList
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
              <div className="d-flex gap-3 w-100">{tabTitleJSX}</div>
              <div className="rounded-3 py-2 px-3 caption2 border border-1">
                <i className="bi bi-info-circle" />
                &nbsp;For LP Farming in Polygon chain (QuickSwap) click{" "}
                <a
                  className="am-link text-decoration-none text-lowercase"
                  href="https://versagames.io/versa/earn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  here
                </a>
                .
              </div>
              <div className="d-flex align-items-center justify-content-between gap-3 w-100">
                <div className="">{connectButtonJSX}</div>
                {tabGroupJSX}
              </div>
            </nav>
            {stakeDashboardJSX}
            {StakeTab ? stakeContentsJSX : unstakeContentsJSX}
          </div>
        </ScrollableSectionContainer>
        <ScrollableSectionContainer className="col-12 col-lg-4 d-flex flex-column gap-3 h-90">
          <UniswapRewards />
          {/* <UniswapIncentiveList /> */}
        </ScrollableSectionContainer>
      </section>
    </>
  );
}
