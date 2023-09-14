import { disconnect } from "@wagmi/core";
import { useWeb3Modal } from "@web3modal/react";
import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useAccount,
  useBalance,
  useBlockNumber,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useToken,
} from "wagmi";
import { polygon } from "wagmi/chains";
import {
  defaultChainSymbol,
  getBalanceStyle,
  notify,
  toastConfig,
} from "../../config";
import {
  farmPools,
  fromChainDenom,
  fromDenom,
  placeholderAddressEth,
  toDenom,
  useMntlUsd,
  usePolygonFarm,
} from "../../data";
import {
  cleanString,
  getTimeDifference,
  handleCopy,
  shortenEthAddress,
} from "../../lib";
import { QuickswapStakeModal } from "./QuickswapStakeModal";
import { QuickswapUnstakeModal } from "./QuickswapUnstakeModal";
import { Button, Col, Row, Stack } from "react-bootstrap";

function StaticQuickswapFarmPool({ poolIndex }) {
  // hooks to work the multi-modal for ethereum
  const { open, setDefaultChain } = useWeb3Modal();
  // const { allQuickswap, isLoadingQuickswap } = useQuickswap();
  const { allPolygonFarm, isLoadingPolygonFarm } = usePolygonFarm(poolIndex);
  const { mntlUsdValue } = useMntlUsd();
  setDefaultChain(polygon);
  const totalSupplyValue = farmPools?.[1]?.pools?.[0]?.totalSupply;

  const quickswapFarm = farmPools?.[1];
  const selectedQuickswapFarmPool = quickswapFarm?.pools?.[poolIndex];
  const tokenPairArray = selectedQuickswapFarmPool?.tokens.split(" – ");
  const poolUrl = selectedQuickswapFarmPool?.lpTokenLink;

  // wagmi data & hooks to read and write in contracts
  const quickV2StakerContractAddress =
    selectedQuickswapFarmPool?.farmContractAddress;
  const lpTokenContractAddress = selectedQuickswapFarmPool?.lpTokenAddress;
  const quickV2StakerContractABI = selectedQuickswapFarmPool?.farmContractABI;
  const quickV2StakerContract = {
    address: quickV2StakerContractAddress,
    abi: quickV2StakerContractABI,
  };

  const lpTokenABI = selectedQuickswapFarmPool?.lpTokenABI;
  const lpTokenContract = { address: lpTokenContractAddress, abi: lpTokenABI };

  const MAX_UINT256 = ethers.constants.MaxUint256;

  let toastId, toastId2, toastId3, toastId4;

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
  const isCorrectChain = chainID == chain?.id;
  const hookArgs = { watch: true, chainId: chainID };

  const { data: lpTokenObject } = useToken({
    address: lpTokenContractAddress,
    ...hookArgs,
  });

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
    BigNumber(fromDenom(rewardsPerDay)).toFixed(0),
    "caption",
    "caption2"
  );

  // wagmi hook to read the user stake info in staker contract
  const { data: userStakeInfo, isLoading: isLoadingUserStakeInfo } =
    useContractRead({
      ...quickV2StakerContract,
      functionName: "userInfo",
      args: [address],
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
      staleTime: 10000,
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

  // get the LP token balance of user address using wagmi hook
  const { data: lpTokenBalance, isLoading: isLoadingLpTokenBalance } =
    useBalance({
      address: address,
      token: lpTokenContractAddress,
      enabled: isWalletEthConnected && isCorrectChain && address,
      ...hookArgs,
    });

  // get the LP token balance of farm pool using wagmi hook
  const {
    data: lpTokenBalanceFarmPool,
    isLoading: isLoadingLpTokenBalanceFarmPool,
  } = useBalance({
    address: quickV2StakerContractAddress,
    token: lpTokenContractAddress,
    ...hookArgs,
  });

  const balance = BigNumber(lpTokenBalanceFarmPool?.value?._hex);

  const stakedRatio = balance?.dividedBy(BigNumber(totalSupplyValue));

  // wagmi hook to get reserves of MNTL from the LP Token

  const { data: lpTokensReserves, isLoading: isLoadingLpTokensReserves } =
    useContractRead({
      ...lpTokenContract,
      functionName: "getReserves",
      args: [],
      // enabled: isConnected && isCorrectChain && address,
      ...hookArgs,
    });

  const reserves = fromDenom(
    BigNumber(lpTokensReserves?._reserve0?._hex)?.toString()
  );

  const stakedToken = BigNumber(reserves)?.multipliedBy(stakedRatio);

  const mntlTvl = stakedToken?.multipliedBy(BigNumber(mntlUsdValue));
  const tvl = mntlTvl?.multipliedBy(2)?.toNumber()?.toFixed(2);

  const rewardsPerYear = rewardsPerDay * 365;
  const rewardsPerYearInUsd = BigNumber(fromDenom(rewardsPerYear)).multipliedBy(
    BigNumber(mntlUsdValue)
  );
  const apr = rewardsPerYearInUsd
    ?.dividedBy(tvl)
    ?.multipliedBy(BigNumber(100))
    ?.toFixed(2);

  // hooks to prepare and send ethereum transaction for claim reward (unstake)
  const { config: configUnstake } = usePrepareContractWrite({
    ...quickV2StakerContract,
    functionName: "withdraw",
    args: ["0"],
    enabled: isWalletEthConnected && isCorrectChain && address,
    chainId: chainID,
    onError(error) {
      console.error("prepare error: ", error);
      /* if (true) {
        toast.error(PREPARE_CONTRACT_ERROR, {
          ...toastConfig,
        });
      } */
    },
  });

  const { writeAsync: writeAsyncClaimReward } = useContractWrite({
    ...configUnstake,
    onError(error) {
      console.error(error);
      notify(null, toastId3, "Transaction Aborted. Try again.");
      toastId3 = null;
    },
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
      /*  if (true)
        toast.error(PREPARE_CONTRACT_ERROR, {
          ...toastConfig,
        }); */
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

  const userLpStakedAmount = userStakeInfo?.amount?.toString?.();
  const userLpStakedAmountBigNumber = BigNumber(
    userLpStakedAmount?.toString() || 0
  ).isNaN()
    ? BigNumber(0)
    : BigNumber(userLpStakedAmount?.toString() || 0);

  const userLpStakedAmountFormatted = {
    formatted: userLpStakedAmountBigNumber.shiftedBy(Number(-18)).toString(),
  };

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
      toastId3 = toast.loading("Transaction initiated ...", toastConfig);

      // create transaction
      transactionResponse = await writeAsyncClaimReward();

      if (transactionResponse?.hash) {
        notify(
          transactionResponse?.hash,
          toastId3,
          "Transaction Submitted. Check ",
          "polygon"
        );
      } else {
        notify(null, toastId3, "Transaction Aborted. Try again.", polygon);
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
    e.preventDefault();

    try {
      // initiate the toast
      toastId2 = toast.loading("Transaction initiated ...", toastConfig);

      // create transaction
      const transactionResponse = await writeAsyncApprove();

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

  const isApproveLpRequired =
    BigNumber(lpTokenAllowance).isLessThan(
      BigNumber(toDenom(lpTokenBalance?.formatted))
    ) || BigNumber(lpTokenAllowance).isEqualTo(0);

  const connectedAddressJSX = isWalletEthConnected && (
    <>
      <Button
        className="d-flex gap-2 align-items-center pe-4 caption2 am-connect fw-medium"
        variant="outline-primary"
        as="button"
        onClick={handleCopyOnClick}
        style={{ wordBreak: "break-all" }}
      >
        {displayShortenedAddress}
        <i className="bi bi-files"></i>
        {/* <i className="opacity-0">a</i> */}
        <span onClick={handleDisconnectWeb3Modal}>
          <i className="bi bi-power" />
        </span>
      </Button>
    </>
  );

  const [StakeModal, setStakeModal] = useState(false);
  const [UnstakeModal, setUnstakeModal] = useState(false);

  const ctaApproveButtonJSX =
    isLoadingLpTokenAllowance || isLoadingLpTokenBalance ? (
      <Button
        className="rounded-5 fw-medium px-5 py-2 d-flex gap-2"
        variant="outline-primary"
      >
        Loading...
      </Button>
    ) : isApproveLpRequired ? (
      <Button
        variant="primary"
        className="rounded-5 fw-medium px-5 py-2 d-flex gap-2"
        onClick={handleApproveLpTransfer}
      >
        Approve LP Transfer
      </Button>
    ) : (
      <>
        <Button
          className="rounded-5 fw-medium px-5 py-2 d-flex gap-2"
          variant="outline-primary"
          onClick={() => setUnstakeModal(true)}
        >
          Unstake
        </Button>
        <Button
          className="rounded-5 fw-medium px-5 py-2 d-flex gap-2"
          variant="primary"
          onClick={() => setStakeModal(true)}
        >
          Stake
        </Button>
      </>
    );

  const ctaButtonsJSX = isWalletEthConnected ? (
    ctaApproveButtonJSX
  ) : (
    <Button
      variant="primary"
      className="rounded-5 fw-medium px-5 py-2 d-flex gap-2"
      onClick={handleOpenWeb3Modal}
    >
      <i className="bi bi-wallet2"></i> Connect Wallet
    </Button>
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
      className={`bg-am-gray-700 p-1 px-3 rounded-start ${
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

  const displayTvl = isLoadingPolygonFarm
    ? "Loading..."
    : `$ ${allPolygonFarm?.tvl || 0}`;
  const displayApr = isLoadingPolygonFarm
    ? "Loading..."
    : `${allPolygonFarm?.apr || 0}%`;

  /* console.log(
    " numberOfSeconds: ",
    numberOfSeconds,
    " currentBlock: ",
    currentBlock,
    " rewardsPerDay: ",
    rewardsPerDay,
    " farmEndBlock: ",
    farmEndBlock,
    " userStakeInfo: ",
    userStakeInfo?.amount?.toString?.()
  ); */

  if (!hasMounted) {
    return loadingJSX;
  }

  return (
    <>
      <Stack className={`bg-black p-3 rounded-4 pe-0`} gap={2}>
        <Stack
          className="align-items-center justify-content-between"
          direction="horizontal"
        >
          {/* App name and connected Address */}
          <Stack className="mb-1" direction="horizontal" gap={2}>
            {appLogoJSX}
            <Stack gap={1}>
              <h1 className="h3 text-primary m-0">{quickswapFarm?.name}</h1>
              {connectedAddressJSX}
            </Stack>
          </Stack>
          {chainLogoJSX}
        </Stack>

        <Stack className="pe-3" gap={3}>
          <Stack className="bg-am-gray-700 p-4 rounded-4" gap={3}>
            <Stack
              className="align-items-center justify-content-between"
              direction="horizontal"
              gap={3}
            >
              <Stack
                className="align-items-center"
                direction="horizontal"
                gap={3}
              >
                {logoPairJSX}
                <h2 className=" body2 fw-medium color-am-white-400 m-0">
                  {selectedQuickswapFarmPool?.tokens}
                </h2>
              </Stack>
              {isWalletEthConnected && (
                <Button
                  variant="link"
                  className="text-decoration-none text-primary px-2"
                  onClick={handleOnClickClaim}
                >
                  Claim Reward
                </Button>
              )}
              <Stack className="align-items-end my-auto" gap={3}>
                <p className="m-0 text-white">{pendingRewardsDisplay}</p>
              </Stack>
            </Stack>

            <div className="border-bottom  " />

            <Row>
              <Col xs={7} className="py-2">
                <Row>
                  <Col xs={5} className="color-am-white-300 caption">
                    Reward Pool
                  </Col>
                  <Col xs={7} className="caption">
                    {rewardsPerDayDisplay}
                  </Col>
                </Row>
              </Col>
              <Col xs={5} className="py-2">
                <Row>
                  <Col xs={3} className="color-am-white-300 caption">
                    TVL
                  </Col>
                  <Col xs={9} className="caption">
                    {displayTvl}
                  </Col>
                </Row>
              </Col>
              <Col xs={7} className="py-2">
                <Row>
                  <Col xs={5} className="color-am-white-300 caption">
                    Duration
                  </Col>
                  <Col xs={7} className="caption">
                    {isBlockNumberLoading ? "Loading..." : durationRemaining}
                  </Col>
                </Row>
              </Col>
              <Col xs={5} className="py-2">
                <Row>
                  <Col xs={3} className="color-am-white-300 caption">
                    APR
                  </Col>
                  <Col xs={9} className="caption">
                    {displayApr}
                  </Col>
                </Row>
              </Col>
            </Row>

            <div className="border-bottom  " />

            <Stack
              className="justify-content-end"
              direction="horizontal"
              gap={2}
            >
              {isWalletEthConnected &&
                !isLoadingUserStakeInfo &&
                BigNumber(userLpStakedAmount).isZero() && (
                  <>
                    {noRecordsJSX} <div className="border-bottom  " />
                  </>
                )}
            </Stack>
            <Stack
              className="justify-content-end"
              direction="horizontal"
              gap={3}
            >
              {ctaButtonsJSX}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
      <QuickswapStakeModal
        balance={lpTokenBalance}
        isLoadingBalance={isLoadingLpTokenBalance}
        poolIndex={poolIndex}
        Show={StakeModal}
        setShow={setStakeModal}
      />
      <QuickswapUnstakeModal
        balance={userLpStakedAmountFormatted}
        isLoadingBalance={isLoadingUserStakeInfo}
        poolIndex={poolIndex}
        Show={UnstakeModal}
        setShow={setUnstakeModal}
      />
    </>
  );
}

export const QuickswapFarmPool = dynamic(
  () => Promise.resolve(StaticQuickswapFarmPool),
  {
    ssr: false,
  }
);
