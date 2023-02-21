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

  const provider = useProvider();
  const npmContract = useContract({
    ...nonFungiblePositionManagerContract,
    signerOrProvider: provider,
  });

  // HOOKS
  const { address, isConnected } = useAccount();
  /* const incentiveIdBytes = ethers.utils.arrayify(
    "0xec26bf83e88de4eb86c7c98329701993a4692ba8e5410a0eaa5d2ecabe0a8167"
  ); */

  const incentiveIdBytes =
    "ec26bf83e88de4eb86c7c98329701993a4692ba8e5410a0eaa5d2ecabe0a8167";

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
    enabled: isConnected && address && tokenId,
    chainId: 1,
    onError(error) {
      console.error("prepare error: ", error);
      if (error?.message?.toString?.().contains?.("User denied Transaction"))
        toast.error(PREPARE_CONTRACT_ERROR, toastConfig);
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

  /* console.log(
    "npmContract: ",
    npmContract,
    " arrirify: ",
    ethers.utils.arrayify(
      ethers.utils.hexlify(latestIncentiveProgram?.incentiveId)
    ),
    " hexlify: ",
    ethers.utils.hexlify(latestIncentiveProgram?.incentiveId),
    " !writeAsync: ",
    !writeAsync,
    " incentiveIdBytes: ",
    incentiveIdBytes,
    " hexlify: ",
    ethers.utils.hexlify(latestIncentiveProgram?.incentiveId)
  ); */

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
          // disabled={!writeAsync}
        >
          Stake
        </button>
      </div>
    </div>
  );
};
