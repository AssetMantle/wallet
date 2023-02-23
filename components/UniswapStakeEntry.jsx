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
import { ethConfig } from "../data";
import { getIncentiveIdFromKey } from "../lib";

export const UniswapStakeEntry = ({ tokenId, liquidity }) => {
  console.log("inside UniswapStakeEntry tokenId:  ", tokenId, " array: ");
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

  const incentiveIdBytes = "0x";

  const params = getIncentiveIdFromKey(latestIncentiveProgram?.incentiveTuple);

  /* const params = abiEncoder.encode(
    ["address", "address", "uint256", "uint256", ], // encode as address array
    [[latestIncentiveProgram?.incentiveId]]
  ); */

  // 0x0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ec26bf83e88de4eb86c7c98329701993a4692ba8e5410a0eaa5d2ecabe0a8167
  // 0x0000000000000000000000002c4f1df9c7de0c59778936c9b145ff56813f3295000000000000000000000000f5b8304dc18579c4247caad705df01928248bc710000000000000000000000000000000000000000000000000000000063e65c1d0000000000000000000000000000000000000000000000000000000063e8ff1d0000000000000000000000000ad4de31fc1e1e01eaaf815da18690441190f7ed
  // 0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000002c4f1df9c7de0c59778936c9b145ff56813f3295000000000000000000000000f5b8304dc18579c4247caad705df01928248bc710000000000000000000000000000000000000000000000000000000063e65c1d0000000000000000000000000000000000000000000000000000000063e8ff1d0000000000000000000000000ad4de31fc1e1e01eaaf815da18690441190f7ed;
  // 0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001ec26bf83e88de4eb86c7c98329701993a4692ba8e5410a0eaa5d2ecabe0a8167
  // 0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000042307865633236626638336538386465346562383663376339383332393730313939336134363932626138653534313061306561613564326563616265306138313637000000000000000000000000000000000000000000000000000000000000
  // 0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000042307865633236626638336538386465346562383663376339383332393730313939336134363932626138653534313061306561613564326563616265306138313637000000000000000000000000000000000000000000000000000000000000
  // 0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001ec26bf83e88de4eb86c7c98329701993a4692ba8e5410a0eaa5d2ecabe0a8167
  // 0x0000000000000000000000002c4f1df9c7de0c59778936c9b145ff56813f3295000000000000000000000000f5b8304dc18579c4247caad705df01928248bc710000000000000000000000000000000000000000000000000000000063e65c1d0000000000000000000000000000000000000000000000000000000063e8ff1d0000000000000000000000000ad4de31fc1e1e01eaaf815da18690441190f7ed

  /* const incentiveIdBytes = fromHex(
    "ec26bf83e88de4eb86c7c98329701993a4692ba8e5410a0eaa5d2ecabe0a8167"
  ); */

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
          Stake
        </button>
      </div>
    </div>
  );
};
