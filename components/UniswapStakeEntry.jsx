import React from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { notify, toastConfig } from "../config";
import { ethConfig, INCENTIVE_ENDED_ERROR, useIncentiveList } from "../data";
import { getIncentiveIdFromKey, getIncentiveKeyEncoded } from "../lib";

export const UniswapStakeEntry = ({ tokenId, liquidity }) => {
  console.log("inside UniswapStakeEntry tokenId:  ", tokenId, " array: ");
  // VARIABLES
  const nonFungiblePositionManagerContractAddress =
    ethConfig?.mainnet?.uniswap?.nonFungiblePositionManager?.address;
  const nonFungiblePositionManagerABI =
    ethConfig?.mainnet?.uniswap?.nonFungiblePositionManager?.abi;
  const uniV3StakerContractAddress =
    ethConfig?.mainnet?.uniswap?.uniV3Staker?.address;

  let toastId = null;

  const nonFungiblePositionManagerContract = {
    address: nonFungiblePositionManagerContractAddress,
    abi: nonFungiblePositionManagerABI,
  };

  // HOOKS
  // hooks related to incentive program data
  const { incentiveList, isLoadingIncentiveList } = useIncentiveList();
  const { data: selectedIncentiveIndex } = useSWR("selectedIncentive");
  const isIncentivePopulated = !isLoadingIncentiveList && incentiveList?.length;

  const selectedIncentive = incentiveList?.[selectedIncentiveIndex] || [];

  const selectedIncentiveTuple = isIncentivePopulated
    ? [
        selectedIncentive?.rewardToken,
        selectedIncentive?.pool,
        selectedIncentive?.startTime,
        selectedIncentive?.endTime,
        selectedIncentive?.refundee,
      ]
    : [];

  const { address, isConnected } = useAccount();

  const incentiveIdBytes = selectedIncentiveTuple?.length
    ? getIncentiveKeyEncoded(selectedIncentiveTuple)
    : "0x";

  const { config } = usePrepareContractWrite({
    ...nonFungiblePositionManagerContract,
    // functionName: "safeTransferFrom(address,address,uint256)",
    functionName: "safeTransferFrom(address,address,uint256,bytes)",
    args: [
      address,
      uniV3StakerContractAddress,
      Number(tokenId),
      incentiveIdBytes,
    ],
    enabled: isConnected && address && tokenId && isIncentivePopulated,
    chainId: 1,
    onError(error) {
      console.error("prepare error: ", error);
      if (error?.message?.includes("incentive ended"))
        toast.error(INCENTIVE_ENDED_ERROR, {
          ...toastConfig,
          toastId: getIncentiveIdFromKey(selectedIncentiveTuple),
        });
      // toast.error(PREPARE_CONTRACT_ERROR, toastConfig);
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

  // HANDLER FUNCTION
  const handleSubmit = async (e) => {
    console.log("inside handleSubmit()");
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

  return (
    <div className="border-b-not_last py-3 d-flex gap-2 align-items-center justify-content-between">
      <div className="d-flex gap-3">
        <div
          className="position-relative rounded-circle"
          style={{ width: "40px", aspectRatio: "1/1" }}
        >
          <img src="/tradePage/uniswap-v3.webp" alt="Uniswap Logo" />
        </div>
        <div className="d-flex flex-column gap-2">
          <h3 className="caption">
            Token ID: <span className="text-body caption2">{tokenId}</span>
          </h3>
          <p className="caption">
            Liquidity: <span className="text-body caption2">{liquidity}</span>
          </p>
        </div>
      </div>
      <div className="d-flex gap-2 align-items-center">
        <button
          className="button-primary px-4 py-2"
          onClick={handleSubmit}
          disabled={!writeAsync}
        >
          Stake
        </button>
      </div>
    </div>
  );
};
