import { disconnect } from "@wagmi/core";
import { useWeb3Modal } from "@web3modal/react";
import dynamic from "next/dynamic";
import React from "react";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { polygon } from "wagmi/chains";
import {
  defaultChainSymbol,
  getBalanceStyle,
  notify,
  toastConfig,
} from "../config";
import { farmPools, fromChainDenom, placeholderAddressEth } from "../data";
import {
  cleanString,
  getTimeDifference,
  handleCopy,
  shortenEthAddress,
} from "../lib";

function StaticQuickswapFarmPool({ poolIndex }) {
  // hooks to work the multi-modal for ethereum
  const { open, setDefaultChain } = useWeb3Modal();
  setDefaultChain(polygon);

  // before useAccount, define the isMounted() hook to deal with SSR issues
  // const isMounted = useIsMounted();

  // books to get the address of the connected wallet
  const { address, isConnected } = useAccount();

  const chainID = polygon?.id;
  const hookArgs = { watch: true, chainId: chainID };

  // temp variables
  let isLoadingRewardsBalance = false;
  let rewardsBalance = 0;

  // wagmi hook to read the count of Position NFTs
  /* const { data: rewardsBalance, isLoading: isLoadingRewardsBalance } =
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
  }); */

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

  const quickswapFarm = farmPools?.[1];
  const selectedQuickswapFarmPool = quickswapFarm?.pools?.[poolIndex];

  const tokenPairArray = selectedQuickswapFarmPool?.tokens.split(" – ");
  let toastId;

  // DISPLAY VARIABLES
  const displayShortenedAddress = shortenEthAddress(
    address || placeholderAddressEth
  );
  // const isWalletEthConnected = isMounted() && isConnected;
  const isWalletEthConnected = isConnected;
  const loadingJSX = "Loading...";

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

  const ctaButtonsJSX = isWalletEthConnected ? (
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
  ) : (
    <button
      className="button-primary px-5 py-2 d-flex gap-2"
      onClick={handleOpenWeb3Modal}
    >
      <i className="bi bi-wallet2"></i> Connect Wallet
    </button>
  );

  const rewardsBalanceStyled = getBalanceStyle(
    fromChainDenom(rewardsBalance),
    "caption",
    "caption2"
  );

  const rewardsBalanceDenomDisplay = defaultChainSymbol;
  /* const rewardsBalanceDisplay =
    !isMounted() || isLoadingRewardsBalance ? (
      loadingJSX
    ) : (
      <>
        {rewardsBalanceStyled}&nbsp;{rewardsBalanceDenomDisplay}
      </>
    ); */
  const rewardsBalanceDisplay = isLoadingRewardsBalance ? (
    loadingJSX
  ) : (
    <>
      {rewardsBalanceStyled}&nbsp;{rewardsBalanceDenomDisplay}
    </>
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

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const durationRemaining =
    selectedQuickswapFarmPool?.startTime > currentTimestamp
      ? "Not Started"
      : currentTimestamp > selectedQuickswapFarmPool?.endTime
      ? "Incentive Ended"
      : `${getTimeDifference(
          selectedQuickswapFarmPool?.endTime,
          currentTimestamp
        )} remaining`;

  console.log("tokenPairArray: ", tokenPairArray);

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
              <p>{rewardsBalanceDisplay}</p>
            </div>
          </div>
          <div className="border-bottom"></div>
          <div className="row">
            <div className="col-7 py-2">
              <div className="row">
                <div className="col-6 text-gray caption">Reward Pool</div>
                <div className="col-6 caption">
                  {selectedQuickswapFarmPool?.rewardPool}
                </div>
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
                <div className="col-6 caption">{durationRemaining}</div>
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
