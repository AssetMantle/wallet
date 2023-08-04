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
import { Button, Col, Modal, Row, Stack } from "react-bootstrap";

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
      <Button
        className="d-flex gap-2 align-items-center pe-4 caption2 am-connect"
        variant="outline-primary"
        as="button"
        onClick={handleCopyOnClick}
        style={{ wordBreak: "break-all" }}
      >
        {displayShortenedAddress}
        <i className="bi bi-files"></i>
        {/* <i className="opacity-0">a</i> */}
        <span className="" onClick={handleDisconnectWeb3Modal}>
          <i className="bi bi-power" />
        </span>
      </Button>
    </>
  );

  const [StakeModal, setStakeModal] = useState(false);
  const [UnstakeModal, setUnstakeModal] = useState(true);

  const ctaButtonsJSX = isWalletEthConnected ? (
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
  ) : (
    <Button
      variant="primary"
      className="rounded-5 fw-medium px-5 py-2 d-flex gap-2"
      onClick={handleOpenWeb3Modal}
    >
      <i className="bi bi-wallet2"></i> Connect Wallet
    </Button>
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
      className={`bg-light-subtle p-1 px-3 rounded-start ${
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
              <h1 className="h3 text-primary m-0">{uniswapFarm?.name}</h1>
              {connectedAddressJSX}
            </Stack>
          </Stack>
          {chainLogoJSX}
        </Stack>

        <Stack className="pe-3" gap={3}>
          <Stack className="bg-light-subtle p-4 rounded-4" gap={3}>
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
                <h2 className="h3 m-0">{selectedUniswapFarmPool?.tokens}</h2>
              </Stack>
              <Button
                variant="link"
                className="text-decoration-none text-primary px-2"
                onClick={handleOnClickClaim}
              >
                Claim Reward
              </Button>
              <Stack className="align-items-center my-auto" gap={3}>
                <p className="m-0">{rewardsBalanceDisplay}</p>
              </Stack>
            </Stack>

            <div className="border-bottom border-secondary" />

            <Row>
              <Col xs={7} className="py-2">
                <Row>
                  <Col xs={6} className="text-light caption">
                    Reward Pool
                  </Col>
                  <Col xs={6} className="caption">
                    {selectedUniswapFarmPool?.rewardPool}
                  </Col>
                </Row>
              </Col>
              <Col xs={5} className="py-2">
                <Row>
                  <Col xs={6} className="text-light caption">
                    TVL
                  </Col>
                  <Col xs={6} className="caption">
                    {selectedUniswapFarmPool?.tvl}
                  </Col>
                </Row>
              </Col>
              <Col xs={7} className="py-2">
                <Row>
                  <Col xs={6} className="text-light caption">
                    Duration
                  </Col>
                  <Col xs={6} className="caption">
                    {durationRemaining}
                  </Col>
                </Row>
              </Col>
              <Col xs={5} className="py-2">
                <Row>
                  <Col xs={6} className="text-light caption">
                    APR
                  </Col>
                  <Col xs={6} className="caption">
                    {selectedUniswapFarmPool?.apr}
                  </Col>
                </Row>
              </Col>
            </Row>

            <div className="border-bottom border-secondary" />

            <Stack
              className="justify-content-end"
              direction="horizontal"
              gap={2}
            >
              {ctaButtonsJSX}
            </Stack>
          </Stack>
        </Stack>
      </Stack>

      {/* stake modal */}
      <Modal
        show={StakeModal}
        onHide={() => setStakeModal(false)}
        centered
        size="lg"
        aria-labelledby="quickswap-unstake-modal"
      >
        <Modal.Body className="p-0">
          <Stack className="p-3">
            <Stack
              direction="horizontal"
              gap={2}
              className="align-items-center pb-2"
            >
              <Button
                variant="link"
                className="p-0"
                onClick={() => setStakeModal(false)}
              >
                <i className="bi bi-chevron-left fw-bold h2 text-primary" />
              </Button>
              <h2 className="h3 m-0 text-primary">Unstake</h2>
              <Button
                variant="link"
                className="ms-auto"
                onClick={() => setStakeModal(false)}
              >
                <i className="bi bi-x-lg fw-bold h2 text-primary"></i>
              </Button>
            </Stack>
            <Stack
              className="bg-black rounded-4 p-1 align-items-center justify-content-center"
              gap={2}
            >
              <UniswapStakeContents />
            </Stack>
          </Stack>
        </Modal.Body>
      </Modal>

      {/* unstake modal */}
      <Modal
        show={UnstakeModal}
        onHide={() => setUnstakeModal(false)}
        centered
        size="lg"
        aria-labelledby="quickswap-unstake-modal"
      >
        <Modal.Body className="p-0">
          <Stack className="p-3">
            <Stack
              direction="horizontal"
              gap={2}
              className="align-items-center pb-2"
            >
              <Button
                variant="link"
                className="p-0"
                onClick={() => setUnstakeModal(false)}
              >
                <i className="bi bi-chevron-left fw-bold h2 text-primary" />
              </Button>
              <h2 className="h3 m-0 text-primary">Unstake</h2>
              <Button
                variant="link"
                className="ms-auto"
                onClick={() => setUnstakeModal(false)}
              >
                <i className="bi bi-x fw-bold h2 text-primary"></i>
              </Button>
            </Stack>
            <Stack
              className="bg-black rounded-4 p-1 align-items-center justify-content-center"
              gap={2}
              style={{ minHeight: "250px" }}
            >
              <UniswapUnstakeContents />
            </Stack>
          </Stack>
        </Modal.Body>
      </Modal>
    </>
  );
}
