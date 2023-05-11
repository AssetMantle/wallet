import { disconnect } from "@wagmi/core";
import { useWeb3Modal } from "@web3modal/react";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";
import { mainnet } from "wagmi/chains";
import {
  defaultChainSymbol,
  getBalanceStyle,
  notify,
  toastConfig,
} from "../config";
import {
  ethConfig,
  farmPools,
  fromChainDenom,
  placeholderAddressEth,
  useIncentiveList,
} from "../data";
import {
  cleanString,
  getTimeDifference,
  handleCopy,
  shortenEthAddress,
} from "../lib";
import { UniswapStakeContents, UniswapUnstakeContents } from "../views";

export function UniswapFarmPool({ poolIndex }) {
  // hooks to work the multi-modal for ethereum
  const { open, setDefaultChain } = useWeb3Modal();
  setDefaultChain(mainnet);

  // before useAccount, define the isMounted() hook to deal with SSR issues
  // const isMounted = useIsMounted();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    (async () => {
      await disconnect();
    })();
  }, []);

  // books to get the address of the connected wallet
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();

  // wagmi hooks to read and write in contracts
  const uniV3StakerContractAddress =
    ethConfig?.mainnet?.uniswap?.uniV3Staker?.address;
  const uniV3StakerABI = ethConfig?.mainnet?.uniswap?.uniV3Staker?.abi;
  const chainID = ethConfig?.mainnet?.chainID;
  const uniV3StakerContract = {
    address: uniV3StakerContractAddress,
    abi: uniV3StakerABI,
  };
  const { incentiveList, isLoadingIncentiveList } = useIncentiveList();
  const { data: selectedIncentiveIndex } = useSWR("selectedIncentive");
  const isIncentivePopulated = !isLoadingIncentiveList && incentiveList?.length;
  const selectedIncentive = incentiveList?.[selectedIncentiveIndex] || [];
  const hookArgs = { watch: true, chainId: chainID };
  const isCorrectChain = chainID == chain?.id;
  const isWalletEthConnected = isConnected && isCorrectChain;

  // wagmi hook to read the count of Position NFTs
  const { data: rewardsBalance, isLoading: isLoadingRewardsBalance } =
    useContractRead({
      ...uniV3StakerContract,
      functionName: "rewards",
      args: [selectedIncentive?.rewardToken, address],
      select: (data) => data?.toString?.(),
      enabled: isWalletEthConnected && address && isIncentivePopulated,
      ...hookArgs,
    });

  const { config } = usePrepareContractWrite({
    ...uniV3StakerContract,
    functionName: "claimReward",
    args: [selectedIncentive?.rewardToken, address, 0],
    enabled: isWalletEthConnected && address && isIncentivePopulated,
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

  const uniswapFarm = farmPools?.[0];
  const selectedUniswapFarmPool = uniswapFarm?.pools?.[poolIndex];

  const tokenPairArray = selectedUniswapFarmPool?.tokens.split(" – ");
  let toastId;

  // DISPLAY VARIABLES
  const displayShortenedAddress = shortenEthAddress(
    address || placeholderAddressEth
  );
  // const isWalletEthConnected = isMounted() && isConnected;
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
        src={`/farm/icons/${cleanString(uniswapFarm?.name)}.svg`}
        alt={`${uniswapFarm?.name} icon`}
        className="w-100 h-100"
        style={{ objectFit: "cover", objectPosition: "center" }}
      />
    </div>
  );

  const chainLogoJSX = (
    <div
      className={`bg-gray-800 p-1 px-3 rounded-start ${
        uniswapFarm?.from !== "polygon" && "py-2"
      }`}
    >
      <div
        className="position-relative overflow-hidden"
        style={{
          height: uniswapFarm?.from === "polygon" ? "26px" : "20px",
          aspectRatio: uniswapFarm?.from === "polygon" ? "77/26" : "72/20",
        }}
      >
        <img
          src={`/farm/icons/f${uniswapFarm?.from}.svg`}
          alt={`${uniswapFarm?.from} icon`}
          className="w-100 h-100"
          style={{ objectFit: "contain", objectPosition: "center" }}
        />
      </div>
    </div>
  );

  if (!hasMounted) {
    return loadingJSX;
  }

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
    selectedUniswapFarmPool?.startTime > currentTimestamp
      ? "Not Started"
      : currentTimestamp > selectedUniswapFarmPool?.endTime
      ? "Incentive Ended"
      : `${getTimeDifference(
          selectedUniswapFarmPool?.endTime,
          currentTimestamp
        )} remaining`;

  console.log("chain: ", chain);

  return (
    <div className={`nav-bg p-3 rounded-4 pe-0 d-flex flex-column gap-2 `}>
      <div className="d-flex align-items-center justify-content-between">
        {/* App name and connected Address */}
        <div className="d-flex gap-2 mb-1">
          <div className={``}>{appLogoJSX}</div>
          <div className="d-flex flex-column gap-1">
            <h1 className="h3 text-primary m-0">{uniswapFarm?.name}</h1>
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
              <h2 className="h3 m-0">{selectedUniswapFarmPool?.tokens}</h2>
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
                  {selectedUniswapFarmPool?.rewardPool}
                </div>
              </div>
            </div>
            <div className="col-4 py-2">
              <div className="row">
                <div className="col-6 text-gray caption">TVL</div>
                <div className="col-6 caption">
                  {selectedUniswapFarmPool?.tvl}
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
                  {selectedUniswapFarmPool?.apr}
                </div>
              </div>
            </div>
          </div>
          <div className="border-bottom"></div>
          <div className="d-flex justify-content-end gap-2">
            {ctaButtonsJSX}
          </div>
        </div>

        {/* stake modal */}
        <div className="modal " tabIndex="-1" role="dialog" id="cardStake">
          <div
            className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title body2 text-primary d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="btn-close primary"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    style={{ background: "none" }}
                  >
                    <span className="text-primary">
                      <i className="bi bi-chevron-left" />
                    </span>
                  </button>
                  Stake
                </h5>
                <button
                  type="button"
                  className="btn-close primary"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  style={{ background: "none" }}
                >
                  <span className="text-primary">
                    <i className="bi bi-x-lg" />
                  </span>
                </button>
              </div>
              <div className="modal-body p-3  d-flex flex-column">
                <div className="nav-bg rounded-4 d-flex flex-column py-1 px-4 gap-2 align-items-center justify-content-center">
                  <UniswapStakeContents />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* unstake modal */}
        <div className="modal " tabIndex="-1" role="dialog" id="cardUnstake">
          <div
            className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title body2 text-primary d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="btn-close primary"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    style={{ background: "none" }}
                  >
                    <span className="text-primary">
                      <i className="bi bi-chevron-left" />
                    </span>
                  </button>
                  Unstake
                </h5>
                <button
                  type="button"
                  className="btn-close primary"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  style={{ background: "none" }}
                >
                  <span className="text-primary">
                    <i className="bi bi-x-lg" />
                  </span>
                </button>
              </div>
              <div className="modal-body p-3  d-flex flex-column">
                <div className="nav-bg rounded-4 d-flex flex-column py-1 px-4 gap-2 align-items-center justify-content-center">
                  <UniswapUnstakeContents />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
