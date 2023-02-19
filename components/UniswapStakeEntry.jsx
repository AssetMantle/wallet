import React from "react";
import { toast } from "react-toastify";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import { notify, toastConfig } from "../config";
import { ethConfig, PREPARE_CONTRACT_ERROR } from "../data";

export const UniswapStakeEntry = ({ tokenId, liquidity }) => {
  // VARIABLES
  const nonFungiblePositionManagerContractAddress =
    ethConfig?.mainnet?.uniswap?.nonFungiblePositionManager?.address;
  const nonFungiblePositionManagerABI =
    ethConfig?.mainnet?.uniswap?.nonFungiblePositionManager?.abi;
  const uniV3StakerContractAddress =
    ethConfig?.mainnet?.uniswap?.uniV3Staker?.address;
  const latestIncentiveProgram =
    ethConfig?.mainnet?.uniswap?.incentivePrograms?.[0];

  let toastId = null;

  const nonFungiblePositionManagerContract = {
    address: nonFungiblePositionManagerContractAddress,
    abi: nonFungiblePositionManagerABI,
  };

  console.log(
    "nonFungiblePositionManagerContract: ",
    nonFungiblePositionManagerContract
  );

  // HOOKS
  const { address, isConnected } = useAccount();

  const { config } = usePrepareContractWrite({
    address: nonFungiblePositionManagerContractAddress,
    abi: nonFungiblePositionManagerABI,
    functionName: "safeTransferFrom",
    args: [address, uniV3StakerContractAddress, Number(tokenId)],
    enabled: isConnected && address && tokenId,
    chainId: 1,
    onError(error) {
      console.error(error);
      toast.error(PREPARE_CONTRACT_ERROR, toastConfig);
    },
  });

  /* const { config, error } = usePrepareContractWrite({
    ...nonFungiblePositionManagerContract,
    functionName: "safeTransferFrom",
    args: [
      address,
      uniV3StakerContractAddress,
      Number(tokenId),
      [latestIncentiveProgram?.incentiveId],
    ],
    enabled: isConnected && address && tokenId,
    chainId: 1,
    onError(error) {
      console.error(error);
      toast.error(PREPARE_CONTRACT_ERROR, toastConfig);
    },
  }); */

  /* const { config, error } = usePrepareContractWrite({
    ...nonFungiblePositionManagerContract,
    functionName: "approve",
    args: [address, Number(tokenId)],
    enabled: isConnected && address && tokenId,
    chainId: 1,
  }); */

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

      console.log("response: ", transactionResponse, " error: ", error);
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
          <p className="caption">Liquidity: {liquidity}</p>
        </div>
      </div>
      <div className="d-flex gap-2 align-items-center">
        <button
          className="button-secondary px-3 py-1"
          onClick={handleSubmit}
          disabled={!writeAsync}
        >
          Stake
        </button>
      </div>
    </div>
  );
};
