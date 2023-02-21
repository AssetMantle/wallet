import { ethers } from "ethers";
import React from "react";
import { toast } from "react-toastify";
import {
  useAccount,
  useContract,
  useContractWrite,
  usePrepareContractWrite,
  useProvider,
} from "wagmi";
import { notify, toastConfig } from "../config";
import { ethConfig, PREPARE_CONTRACT_ERROR } from "../data";

export const UniswapUnstakeEntry = ({ tokenId }) => {
  // VARIABLES
  const uniV3StakerContractAddress =
    ethConfig?.mainnet?.uniswap?.uniV3Staker?.address;
  const latestIncentiveProgram =
    ethConfig?.mainnet?.uniswap?.incentivePrograms?.[0];
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
  const { address, isConnected } = useAccount();
  let unstakeTokenTxn, withdrawTokenTxn;

  if (isConnected && address && tokenId) {
    unstakeTokenTxn = stakerContract?.interface?.encodeFunctionData?.(
      "unstakeToken((address,address,uint256,uint256,address),uint256)",
      // stakerContract?.interface?.fragments?.[23],
      [latestIncentiveProgram?.incentiveTuple, Number(tokenId)]
    );

    withdrawTokenTxn = stakerContract?.interface?.encodeFunctionData?.(
      "withdrawToken(uint256,address,bytes)",
      // stakerContract?.interface?.fragments?.[24],
      [Number(tokenId), address, []]
    );
  }

  const multiCallDataBytesArray = [
    ethers.utils.arrayify(unstakeTokenTxn),
    ethers.utils.arrayify(withdrawTokenTxn),
  ];

  const { config } = usePrepareContractWrite({
    ...uniV3StakerContract,
    functionName: "multicall(bytes[])",
    args: [multiCallDataBytesArray],
    enabled: isConnected && address && tokenId,
    chainId: 1,
    onError(error) {
      console.error(error);
      if (error?.message?.toString?.().contains?.("User denied Transaction"))
        toast.error(PREPARE_CONTRACT_ERROR, toastConfig);
    },
  });

  const { data, write, writeAsync } = useContractWrite({
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
    <div className="bg-gray-800 p-3 rounded-4 d-flex gap-2 align-items-center justify-content-between">
      <div className="d-flex gap-3">
        <div
          className="position-relative rounded-circle"
          style={{ width: "40px", aspectRatio: "1/1" }}
        >
          <img src="/tradePage/uniswap-v3.webp" alt="Uniswap Logo" />
        </div>
        <div className="d-flex flex-column gap-2">
          <h3 className="body2">Token ID: {tokenId}</h3>
        </div>
      </div>
      <div className="d-flex gap-2 align-items-center">
        <button className="button-secondary px-3 py-1" onClick={handleSubmit}>
          Unstake
        </button>
      </div>
    </div>
  );
};
