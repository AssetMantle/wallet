import React from "react";
import { toast } from "react-toastify";
import useSWR from "swr";
import {
  useAccount,
  useContract,
  useContractWrite,
  usePrepareContractWrite,
  useProvider,
} from "wagmi";
import { notify, toastConfig } from "../config";
import { ALREADY_UNSTAKED_ERROR, ethConfig, useIncentiveList } from "../data";
import { getIncentiveIdFromKey } from "../lib";

export const UniswapUnstakeEntry = ({ tokenId, liquidity }) => {
  // VARIABLES
  const uniV3StakerContractAddress =
    ethConfig?.mainnet?.uniswap?.uniV3Staker?.address;
  const uniV3StakerABI = ethConfig?.mainnet?.uniswap?.uniV3Staker?.abi;

  let toastId = null;

  const uniV3StakerContract = {
    address: uniV3StakerContractAddress,
    abi: uniV3StakerABI,
  };

  const provider = useProvider();
  const stakerContract = useContract({
    ...uniV3StakerContract,
    signerOrProvider: provider,
  });

  // HOOKS
  // hooks to get the incentive program data
  const { incentiveList, isLoadingIncentiveList } = useIncentiveList();
  console.log("incentive list: ", incentiveList);
  const { data: selectedIncentiveIndex } = useSWR("selectedIncentive");
  const isIncentivePopulated = !isLoadingIncentiveList && incentiveList?.length;

  const selectedIncentiveTuple = isIncentivePopulated
    ? [
        incentiveList?.[selectedIncentiveIndex]?.rewardToken,
        incentiveList?.[selectedIncentiveIndex]?.pool,
        incentiveList?.[selectedIncentiveIndex]?.startTime,
        incentiveList?.[selectedIncentiveIndex]?.endTime,
        incentiveList?.[selectedIncentiveIndex]?.refundee,
      ]
    : [];

  const { address, isConnected } = useAccount();
  let unstakeTokenTxn, withdrawTokenTxn;

  if (isConnected && address && tokenId && isIncentivePopulated) {
    unstakeTokenTxn = stakerContract?.interface?.encodeFunctionData?.(
      "unstakeToken((address,address,uint256,uint256,address),uint256)",
      // stakerContract?.interface?.fragments?.[23],
      [selectedIncentiveTuple, Number(tokenId)]
    );

    withdrawTokenTxn = stakerContract?.interface?.encodeFunctionData?.(
      "withdrawToken(uint256,address,bytes)",
      // stakerContract?.interface?.fragments?.[24],
      [Number(tokenId), address, []]
    );
  }

  const multiCallDataBytesArray = [unstakeTokenTxn, withdrawTokenTxn];

  const { config } = usePrepareContractWrite({
    ...uniV3StakerContract,
    functionName: "multicall(bytes[])",
    args: [multiCallDataBytesArray],
    enabled: isConnected && address && tokenId & isIncentivePopulated,
    chainId: 1,
    onError(error) {
      console.error(error);
      if (error?.message?.includes("stake does not exist"))
        toast.error(ALREADY_UNSTAKED_ERROR, {
          ...toastConfig,
          toastId: getIncentiveIdFromKey(selectedIncentiveTuple),
        });
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
      const transactionResult = await writeAsync();

      console.log("response: ", transactionResult);
      if (transactionResult?.hash) {
        notify(
          transactionResult?.hash,
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
            Token ID: <span className="text-gray caption2">{tokenId}</span>
          </h3>
          <p className="caption">
            Liquidity: <span className="text-gray caption2">{liquidity}</span>
          </p>
        </div>
      </div>
      <div className="d-flex gap-2 align-items-center">
        <button
          className="button-primary px-4 py-2"
          onClick={handleSubmit}
          disabled={!writeAsync}
        >
          Unstake
        </button>
      </div>
    </div>
  );
};
