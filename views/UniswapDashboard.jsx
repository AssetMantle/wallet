import { disconnect } from "@wagmi/core";
import { useWeb3Modal } from "@web3modal/react";
import BigNumber from "bignumber.js";
import dynamic from "next/dynamic";
import React from "react";
import { toast } from "react-toastify";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import { notify, toastConfig } from "../config";
import { ethConfig, fromChainDenom, placeholderAddressEth } from "../data";
import { handleCopy, shortenEthAddress, useIsMounted } from "../lib";

const uniV3StakerContractAddress =
  ethConfig?.mainnet?.uniswap?.uniV3Staker?.address;
const uniV3StakerABI = ethConfig?.mainnet?.uniswap?.uniV3Staker?.abi;
const chainID = ethConfig?.mainnet?.chainID;

const selectedIncentive = ethConfig?.selected?.uniswapIncentiveProgram;

const latestIncentiveProgram =
  ethConfig?.mainnet?.uniswap?.incentivePrograms?.[selectedIncentive];

const StaticUniswapDashboard = () => {
  // HOOKS
  // hooks to get the address of the connected wallet
  const { address, isConnected } = useAccount();
  const isMounted = useIsMounted();
  const { open } = useWeb3Modal();
  let toastId = null;

  // const finalAddress = uniV3StakerContractAddress;

  const hookArgs = { watch: true, chainId: chainID };

  const uniV3StakerContract = {
    address: uniV3StakerContractAddress,
    abi: uniV3StakerABI,
  };

  // wagmi hook to read the count of Position NFTs
  const { data: rewardsBalance, isLoading: isLoadingRewardsBalance } =
    useContractRead({
      ...uniV3StakerContract,
      functionName: "rewards",
      args: [latestIncentiveProgram?.RewardTokenContract, address],
      select: (data) => data?.toString?.(),
      enabled: isConnected && address,
      ...hookArgs,
    });

  const { config } = usePrepareContractWrite({
    ...uniV3StakerContract,
    functionName: "claimReward",
    args: [latestIncentiveProgram?.RewardTokenContract, address, 0],
    enabled: isConnected && address,
    chainId: 1,
    onError(error) {
      console.error(error.message);
    },
  });

  const { writeAsync } = useContractWrite({
    ...config,
    onError(error) {
      console.error(error);
      notify(null, toastId, "Transaction Aborted. Try again.");
      toastId = null;
    },
  });

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

  const handleOnClickClaim = async (e) => {
    e.preventDefault();
    try {
      // initiate the toast
      toastId = toast.loading("Transaction initiated ...", toastConfig);

      // create transaction
      const transactionResponse = await writeAsync();

      console.log("response: ", transactionResponse);
      if (transactionResponse?.hash) {
        notify(
          transactionResponse?.hash,
          toastId,
          "Transaction Submitted. Check "
        );
      } else {
        notify(null, toastId, "Transaction Aborted. Try again.");
      }
    } catch (error) {
      console.error("Runtime Error: ", error);
    }
  };

  const loadingJSX = "Loading...";

  const rewardsBalanceDisplay =
    !isMounted() || isLoadingRewardsBalance
      ? loadingJSX
      : fromChainDenom(rewardsBalance);
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

  // DISPLAY VARIABLES

  const isWalletEthConnected = isMounted() && isConnected;
  const displayShortenedAddress = shortenEthAddress(
    address || placeholderAddressEth
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

  const isClaimDisabled =
    !isWalletEthConnected ||
    BigNumber(rewardsBalance).isNaN() ||
    BigNumber(rewardsBalance).isZero() ||
    !writeAsync;

  return (
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
          <h4 className="caption text-gray">Claimable</h4>
          <p className="caption">{rewardsBalanceDisplay}</p>
          <button
            className="button-primary caption2"
            disabled={isClaimDisabled}
            onClick={handleOnClickClaim}
          >
            Claim
          </button>
        </div>
        <div className="col-6 d-flex flex-column gap-3">
          <h4 className="caption text-gray">Connect</h4>
          {isMounted() && connectButtonJSX}
          {!isMounted() && notConnectedJSX}
        </div>
      </div>
    </div>
  );
};

export const UniswapDashboard = dynamic(
  () => Promise.resolve(StaticUniswapDashboard),
  {
    ssr: false,
  }
);
