import { disconnect } from "@wagmi/core";
import { useWeb3Modal } from "@web3modal/react";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useAccount,
  useBlockNumber,
  useContractRead,
  useNetwork,
  erc20ABI,
  useBalance,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";
import { polygon } from "wagmi/chains";
import {
  defaultChainSymbol,
  getBalanceStyle,
  notify,
  toastConfig,
} from "../config";
import {
  PREPARE_CONTRACT_ERROR,
  farmPools,
  fromChainDenom,
  placeholderAddressEth,
} from "../data";
import {
  cleanString,
  getTimeDifference,
  handleCopy,
  shortenEthAddress,
} from "../lib";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";

function StaticQuickswapFarmPool({ poolIndex }) {
  // hooks to work the multi-modal for ethereum
  const { open, setDefaultChain } = useWeb3Modal();
  setDefaultChain(polygon);

  // before useAccount, define the isMounted() hook to deal with SSR issues
  // const isMounted = useIsMounted();
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    (async () => {
      await disconnect();
    })();
    setHasMounted(true);
  }, []);

  // books to get the address of the connected wallet
  const chainID = polygon?.id;
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data: blockNumber, isLoading: isBlockNumberLoading } = useBlockNumber(
    {
      chainId: chainID,
      watch: false,
    }
  );
  const MAX_UINT256 = ethers.constants.MaxUint256;

  const quickswapFarm = farmPools?.[1];
  const selectedQuickswapFarmPool = quickswapFarm?.pools?.[poolIndex];
  const tokenPairArray = selectedQuickswapFarmPool?.tokens.split(" – ");
  const poolUrl = selectedQuickswapFarmPool?.lpTokenLink;
  let toastId, toastId2, toastId3, toastId4;

  const isCorrectChain = chainID == chain?.id;
  const hookArgs = { watch: true, chainId: chainID };

  const farmStartBlock =
    selectedQuickswapFarmPool?.startRewardBlock?.toString?.();
  const farmEndBlock = selectedQuickswapFarmPool?.endRewardBlock?.toString?.();
  const currentBlock = blockNumber?.toString?.() || "0";

  const numberOfSeconds = BigNumber(farmEndBlock)
    .minus(BigNumber(currentBlock))
    .multipliedBy(2.2)
    .absoluteValue()
    .toFixed(0);
  const durationRemaining = BigNumber(farmStartBlock).isGreaterThan(
    BigNumber(currentBlock)
  )
    ? "Not Started"
    : BigNumber(currentBlock).isGreaterThan(BigNumber(farmEndBlock))
    ? "Incentive Ended"
    : `${getTimeDifference(numberOfSeconds, 0)} remaining`;

  const rewardPerBlock = selectedQuickswapFarmPool?.rewardPerBlock || 0;
  const rewardsPerDay = BigNumber(rewardPerBlock)
    .multipliedBy(86400)
    .dividedToIntegerBy(2.2)
    .toString();
  const rewardsPerDayStyled = getBalanceStyle(
    fromChainDenom(rewardsPerDay, 0),
    "caption",
    "caption2"
  );

  // wagmi data & hooks to read and write in contracts
  const quickV2StakerContractAddress =
    selectedQuickswapFarmPool?.farmContractAddress;
  const lpTokenContractAddress = selectedQuickswapFarmPool?.lpTokenAddress;
  const quickV2StakerContractABI = selectedQuickswapFarmPool?.farmContractABI;
  const quickV2StakerContract = {
    address: quickV2StakerContractAddress,
    abi: quickV2StakerContractABI,
  };
  const lpTokenContract = { address: lpTokenContractAddress, abi: erc20ABI };

  // wagmi hook to read the user stake info in staker contract
  const { data: userStakeInfo, isLoading: isLoadingUserStakeInfo } =
    useContractRead({
      ...quickV2StakerContract,
      functionName: "userInfo",
      args: [address],
      select: (data) => data?.toString?.(),
      enabled: isConnected && isCorrectChain && address,
      ...hookArgs,
    });

  // wagmi hook to read the user's pending rewards in staker contract
  const { data: pendingRewards, isLoading: isLoadingPendingRewards } =
    useContractRead({
      ...quickV2StakerContract,
      functionName: "pendingReward",
      args: [address],
      select: (data) => data?.toString?.(),
      enabled: isConnected && isCorrectChain && address,
      ...hookArgs,
    });

  // wagmi hook to read the allowance of gravity deposit
  const { data: lpTokenAllowance, isLoading: isLoadingLpTokenAllowance } =
    useContractRead({
      ...lpTokenContract,
      functionName: "allowance",
      args: [address, quickV2StakerContractAddress],
      select: (data) => data?.toString?.(),
      enabled: isWalletEthConnected && isCorrectChain && address,
      ...hookArgs,
    });

  // get the MNTL token balance using wagmi hook
  const { data: lpTokenBalance, isLoading: isLoadingLpTokenBalance } =
    useBalance({
      address: address,
      token: lpTokenContractAddress,
      watch: true,
    });

  // hooks to prepare and send ethereum transaction for token approval
  const { config: configApprove } = usePrepareContractWrite({
    ...lpTokenContract,
    functionName: "approve",
    args: [quickV2StakerContractAddress, MAX_UINT256],
    enabled: isWalletEthConnected && isCorrectChain && address,
    chainId: chainID,
    onError(error) {
      console.error("prepare error: ", error);
      if (true)
        toast.error(PREPARE_CONTRACT_ERROR, {
          ...toastConfig,
        });
    },
  });

  const { writeAsync: writeAsyncApprove } = useContractWrite({
    ...configApprove,
    onError(error) {
      console.error(error);
      notify(null, toastId2, "Transaction Aborted. Try again.");
      toastId2 = null;
    },
  });

  /*const { config } = usePrepareContractWrite({
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
  }); */

  const userInfoArray = userStakeInfo?.split(",") || [];
  const userLpStakedAmount = userInfoArray?.[0];

  const pendingRewardsStyled = getBalanceStyle(
    fromChainDenom(pendingRewards, 0),
    "caption",
    "caption2"
  );

  // HANDLER FUNCTIONS
  const handleOnClickClaim = async (e) => {
    e.preventDefault();
    let transactionResponse;
    try {
      // initiate the toast
      toastId = toast.loading("Transaction initiated ...", toastConfig);

      // create transaction
      // transactionResponse = await writeAsync();

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

  const handleCopyOnClick = (e) => {
    e.preventDefault();
    handleCopy(address);
  };

  const handleOpenWeb3Modal = async (e) => {
    e.preventDefault();
    await disconnect();
    await open();
  };

  const handleDisconnectWeb3Modal = async (e) => {
    e.preventDefault();
    await disconnect();
  };

  const handleApproveLpTransfer = async (e) => {
    console.log("inside handlhandleApproveSubmitGravityeSubmit()");
    e.preventDefault();

    try {
      // initiate the toast
      toastId2 = toast.loading("Transaction initiated ...", toastConfig);

      // create transaction
      const transactionResponse = await writeAsyncApprove();

      console.log("response: ", transactionResponse);
      if (transactionResponse?.hash) {
        notify(
          transactionResponse?.hash,
          toastId2,
          "Transaction Submitted. Check "
        );
      } else {
        notify(null, toastId2, "Transaction Aborted. Try again.");
      }
    } catch (error) {
      console.error("Runtime Error: ", error);
    }
  };

  // DISPLAY VARIABLES
  const displayShortenedAddress = shortenEthAddress(
    address || placeholderAddressEth
  );
  // const isWalletEthConnected = isMounted() && isConnected;
  const isWalletEthConnected = isConnected;
  const loadingJSX = "Loading...";

  const isCtaDisabled =
    !userLpStakedAmount ||
    BigNumber(userLpStakedAmount).isNaN() ||
    BigNumber(userLpStakedAmount).isZero();

  const isApproveLpRequired =
    BigNumber(lpTokenAllowance).isLessThan(lpTokenBalance) ||
    BigNumber(lpTokenAllowance).isEqualTo(0);

  const connectedAddressJSX = isWalletEthConnected && (
    <>
      <button
        className="d-flex gap-2 align-items-center pe-4 caption2"
        onClick={handleCopyOnClick}
        style={{ wordBreak: "break-all" }}
      >
        {displayShortenedAddress}
        <i className="bi bi-files text-primary"></i>
        {/* <i className="opacity-0">a</i> */}
        <span className="text-primary" onClick={handleDisconnectWeb3Modal}>
          <i className="bi bi-power" />
        </span>
      </button>
    </>
  );

  const ctaApproveButtonJSX =
    isLoadingLpTokenAllowance || isLoadingLpTokenBalance ? (
      <button className="button-secondary px-5 py-2 d-flex gap-2">
        Loading...
      </button>
    ) : isApproveLpRequired ? (
      <button
        className="button-primary px-5 py-2 d-flex gap-2"
        onClick={handleApproveLpTransfer}
      >
        Approve LP Transfer
      </button>
    ) : (
      <>
        <button
          className="button-secondary px-5 py-2 d-flex gap-2"
          data-bs-toggle="modal"
          data-bs-target="#cardUnstake"
        >
          Unstake
        </button>
        <button
          className="button-primary px-5 py-2 d-flex gap-2"
          data-bs-toggle="modal"
          data-bs-target="#cardStake"
        >
          Stake
        </button>
      </>
    );

  const ctaButtonsJSX = isWalletEthConnected ? (
    ctaApproveButtonJSX
  ) : (
    <button
      className="button-primary px-5 py-2 d-flex gap-2"
      onClick={handleOpenWeb3Modal}
    >
      <i className="bi bi-wallet2"></i> Connect Wallet
    </button>
  );

  const rewardsPerDayDenomDisplay = defaultChainSymbol;
  const rewardsPerDayDisplay = (
    <>
      {rewardsPerDayStyled}&nbsp;{rewardsPerDayDenomDisplay}&nbsp;{`per day`}
    </>
  );
  const pendingRewardsDisplay = isLoadingPendingRewards ? (
    "Loading..."
  ) : (
    <>
      {pendingRewardsStyled}&nbsp;{rewardsPerDayDenomDisplay}
    </>
  );
  const noRecordsJSX = (
    <p className="text-center">
      <i className="bi bi-info-circle text-white" />{" "}
      <span className="caption text-white">Get LP Tokens at</span>{" "}
      <a
        href={poolUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="am-link"
      >
        <span className="text-primary caption">QuickSwap</span>{" "}
        <i className="text-primary bi bi-arrow-up-right caption"></i>
      </a>
      <span className="caption text-white">
        {`, and then come back and deposit it here to earn MNTL Tokens`}
      </span>{" "}
    </p>
  );
  const appLogoJSX = (
    <div
      className="position-relative"
      style={{ width: "30px", aspectRatio: "1/1" }}
    >
      <img
        src={`/farm/icons/${cleanString(quickswapFarm?.name)}.svg`}
        alt={`${quickswapFarm?.name} icon`}
        className="w-100 h-100"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
    </div>
  );

  const chainLogoJSX = (
    <div
      className={`bg-gray-800 p-1 px-3 rounded-start ${
        quickswapFarm?.from !== "polygon" && "py-2"
      }`}
    >
      <div
        className="position-relative overflow-hidden"
        style={{
          height: quickswapFarm?.from === "polygon" ? "26px" : "20px",
          aspectRatio: quickswapFarm?.from === "polygon" ? "77/26" : "72/20",
        }}
      >
        <img
          src={`/farm/icons/f${quickswapFarm?.from}.svg`}
          alt={`${quickswapFarm?.from} icon`}
          className="w-100 h-100"
          style={{ objectFit: "contain", objectPosition: "center" }}
        />
      </div>
    </div>
  );

  const logoPairJSX = (
    <div
      className="position-relative"
      style={{ width: "72px", aspectRatio: "72/40" }}
    >
      <div
        className="position-absolute end-0 overflow-hidden"
        style={{ width: "40px", aspectRatio: "1/1" }}
      >
        <img
          src={`/farm/icons/${tokenPairArray?.[1].toLowerCase()}.svg`}
          alt={`${tokenPairArray?.[1]} icon`}
          className="w-100 h-100"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
      <div
        className="position-absolute start-0 overflow-hidden"
        style={{ width: "40px", aspectRatio: "1/1" }}
      >
        <img
          src={`/farm/icons/${tokenPairArray?.[0].toLowerCase()}.svg`}
          alt={`${tokenPairArray?.[0]} icon`}
          className="w-100 h-100"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
    </div>
  );

  console.log(
    "userLpStakedAmount: ",
    userLpStakedAmount,
    " numberOfSeconds: ",
    numberOfSeconds,
    " currentBlock: ",
    currentBlock,
    " rewardsPerDay: ",
    rewardsPerDay,
    " farmEndBlock: ",
    farmEndBlock
  );

  if (!hasMounted) {
    return loadingJSX;
  }

  return (
    <div className={`nav-bg p-3 rounded-4 pe-0 d-flex flex-column gap-2 `}>
      <div className="d-flex align-items-center justify-content-between">
        {/* App name and connected Address */}
        <div className="d-flex gap-2 mb-1">
          <div className={``}>{appLogoJSX}</div>
          <div className="d-flex flex-column gap-1">
            <h1 className="h3 text-primary m-0">{quickswapFarm?.name}</h1>
            {connectedAddressJSX}
          </div>
        </div>
        {chainLogoJSX}
      </div>

      <div className="pe-3 d-flex flex-column gap-3 ">
        <div className="bg-gray-800 p-4 rounded-4 d-flex flex-column gap-3">
          <div className="d-flex align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              {logoPairJSX}
              <h2 className="h3 m-0">{selectedQuickswapFarmPool?.tokens}</h2>
            </div>
            <button className="am-link px-2" onClick={handleOnClickClaim}>
              Claim Reward
            </button>
            <div className="d-flex align-items-center gap-3">
              <p>{pendingRewardsDisplay}</p>
            </div>
          </div>
          <div className="border-bottom"></div>
          <div className="row">
            <div className="col-7 py-2">
              <div className="row">
                <div className="col-6 text-gray caption">Reward Pool</div>
                <div className="col-6 caption">{rewardsPerDayDisplay}</div>
              </div>
            </div>
            <div className="col-4 py-2">
              <div className="row">
                <div className="col-6 text-gray caption">TVL</div>
                <div className="col-6 caption">
                  {selectedQuickswapFarmPool?.tvl}
                </div>
              </div>
            </div>
            <div className="col-7 py-2">
              <div className="row">
                <div className="col-6 text-gray caption">Duration</div>
                <div className="col-6 caption">
                  {isBlockNumberLoading ? "Loading..." : durationRemaining}
                </div>
              </div>
            </div>
            <div className="col-4 py-2">
              <div className="row">
                <div className="col-6 text-gray caption">APR</div>
                <div className="col-6 caption">
                  {selectedQuickswapFarmPool?.apr}
                </div>
              </div>
            </div>
          </div>
          <div className="border-bottom"></div>
          <div className="d-flex justify-content-end gap-2">
            {isWalletEthConnected &&
              !isLoadingUserStakeInfo &&
              BigNumber(userLpStakedAmount).isZero && (
                <>
                  {noRecordsJSX} <div className="border-bottom"></div>
                </>
              )}
          </div>
          <div className="d-flex justify-content-end gap-2">
            {ctaButtonsJSX}
          </div>
        </div>
      </div>
    </div>
  );
}

export const QuickswapFarmPool = dynamic(
  () => Promise.resolve(StaticQuickswapFarmPool),
  {
    ssr: false,
  }
);
