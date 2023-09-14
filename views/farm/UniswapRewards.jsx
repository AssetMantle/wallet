import BigNumber from "bignumber.js";
import dynamic from "next/dynamic";
import React from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
} from "wagmi";
import {
  defaultChainSymbol,
  getBalanceStyle,
  notify,
  toastConfig,
} from "../../config";
import { ethConfig, fromChainDenom, useIncentiveList } from "../../data";
import { useIsMounted } from "../../lib";

const uniV3StakerContractAddress =
  ethConfig?.mainnet?.uniswap?.uniV3Staker?.address;
const uniV3StakerABI = ethConfig?.mainnet?.uniswap?.uniV3Staker?.abi;
const chainID = ethConfig?.mainnet?.chainID;

const StaticUniswapRewards = () => {
  // HOOKS
  // hooks to get the incentive program data
  const { incentiveList, isLoadingIncentiveList } = useIncentiveList();
  const { data: selectedIncentiveIndex } = useSWR("selectedIncentive");
  const isIncentivePopulated = !isLoadingIncentiveList && incentiveList?.length;
  const selectedIncentive = incentiveList?.[selectedIncentiveIndex] || [];

  // hooks to get the address of the connected wallet
  const { address, isConnected } = useAccount();
  const isMounted = useIsMounted();
  let toastId = null;

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
      args: [selectedIncentive?.rewardToken, address],
      select: (data) => data?.toString?.(),
      enabled: isConnected && address && isIncentivePopulated,
      ...hookArgs,
    });

  const { config } = usePrepareContractWrite({
    ...uniV3StakerContract,
    functionName: "claimReward",
    args: [selectedIncentive?.rewardToken, address, 0],
    enabled: isConnected && address && isIncentivePopulated,
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

  // DISPLAY VARIABLES
  const isWalletEthConnected = isMounted() && isConnected;
  const loadingJSX = "Loading...";

  const rewardsBalanceStyled = getBalanceStyle(
    fromChainDenom(rewardsBalance),
    "caption",
    "caption2"
  );

  const rewardsBalanceDenomDisplay = defaultChainSymbol;
  const rewardsBalanceDisplay =
    !isMounted() || isLoadingRewardsBalance ? (
      loadingJSX
    ) : (
      <>
        {rewardsBalanceStyled}&nbsp;{rewardsBalanceDenomDisplay}
      </>
    );

  const isClaimDisabled =
    !isWalletEthConnected ||
    BigNumber(rewardsBalance).isNaN() ||
    BigNumber(rewardsBalance).isZero() ||
    !writeAsync;

  return (
    <div className="d-flex gap-4 rounded-4 p-3 bg-am-gray-200 width-100 d-flex flex-column text-white">
      <h2 className="body1 text-primary">Rewards</h2>
      <div className="bg-black rounded-4 py-3 px-3 mx-0 d-flex flex-column gap-2">
        <p className="caption color-am-gray-100">Staking Rewards</p>
        <p className="caption text-white pb-1">{rewardsBalanceDisplay}</p>
      </div>
      <button
        className="button-primary w-100 py-2 px-5"
        style={{ maxWidth: "100%" }}
        disabled={isClaimDisabled}
        onClick={handleOnClickClaim}
      >
        Claim Rewards
      </button>
    </div>
  );
};

export const UniswapRewards = dynamic(
  () => Promise.resolve(StaticUniswapRewards),
  {
    ssr: false,
  }
);
