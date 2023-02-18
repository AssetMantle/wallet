import React from "react";
import { useAccount, useContractRead } from "wagmi";
import { UniswapStakeEntry } from "../components";
import { ethConfig } from "../data";
import { useContractReads } from "wagmi";
import dynamic from "next/dynamic";
import { useIsMounted } from "../lib";
import { UniswapStakeContentsLoading } from "./UniswapStakeContentsLoading";

const nonFungiblePositionManagerContractAddress =
  ethConfig?.mainnet?.uniswap?.nonFungiblePositionManager?.address;
const uniV3StakerContractAddress =
  ethConfig?.mainnet?.uniswap?.uniV3Staker?.address;
const nonFungiblePositionManagerABI =
  ethConfig?.mainnet?.uniswap?.nonFungiblePositionManager?.abi;
const uniV3StakerABI = ethConfig?.mainnet?.uniswap?.uniV3Staker?.abi;
const chainID = ethConfig?.mainnet?.chainID;

const latestIncentiveProgram =
  ethConfig?.mainnet?.uniswap?.incentivePrograms?.[0];
/* const latestIncentiveProgram = {
  RewardTokenContract: "0x2C4F1DF9c7DE0C59778936C9b145fF56813F3295",
  liquidityPoolContract: "0xf5b8304dc18579c4247caad705df01928248bc71",
  startTime: "1676041245",
  endtime: "1676214045",
  refundeeAddress: "0x0ad4de31fc1E1e01Eaaf815dA18690441190f7ed",
  token0: "0x686f2404e77Ab0d9070a46cdfb0B7feCDD2318b0",
  token1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  fee: "3000",
}; */

const StaticUniswapStakeContents = () => {
  // HOOKS
  // hooks to get the address of the connected wallet
  const { address, isConnected } = useAccount();
  const isMounted = useIsMounted();

  const finalAddress = address;
  // const finalAddress = uniV3StakerContractAddress;

  const hookArgs = { watch: true, chainId: chainID };

  const nonFungiblePositionManagerContract = {
    address: nonFungiblePositionManagerContractAddress,
    abi: nonFungiblePositionManagerABI,
  };

  const uniV3StakerContract = {
    address: uniV3StakerContractAddress,
    abi: uniV3StakerABI,
  };

  // read the count of Position NFTs
  const {
    data: balanceOf,
    isError: isErrorBalanceOf,
    isLoading: isLoadingBalanceOf,
  } = useContractRead({
    ...nonFungiblePositionManagerContract,
    functionName: "balanceOf",
    args: [finalAddress],
    select: (data) => data?.toString?.(),
    enabled: isConnected && finalAddress,
    ...hookArgs,
  });

  const totalPositions = Number(balanceOf);
  // const totalPositions = 4;

  // function to return the contract data array for tokenOfOwnerByIndex multi-read
  const tokenOfOwnerByIndexContracts = (totalPositions) => {
    let tokenArray = [];
    for (let index = 0; index < totalPositions; index++) {
      tokenArray.push({
        ...nonFungiblePositionManagerContract,
        functionName: "tokenOfOwnerByIndex",
        args: [finalAddress, index],
      });
    }
    return tokenArray;
  };

  // read the array of Position NFT IDs from the count of position NFTs
  const {
    data: tokenValues,
    isError: isErrorTokenValues,
    isLoading: isLoadingTokenValues,
  } = useContractReads({
    contracts: tokenOfOwnerByIndexContracts(totalPositions),
    enabled:
      isConnected &&
      !(isLoadingBalanceOf || isErrorBalanceOf) &&
      totalPositions,
    select: (data) => data?.map?.((val) => val?.toString?.()),
    ...hookArgs,
  });

  // function to return the contract data array for multi-read of positions multi-read
  const positionsContracts = (tokenValuesArray) => {
    let tokenArray = [];
    for (let index = 0; index < tokenValuesArray?.length; index++) {
      tokenArray.push({
        ...nonFungiblePositionManagerContract,
        functionName: "positions",
        args: [tokenValuesArray?.[index]],
      });
    }
    return tokenArray;
  };

  // read the array of Position NFT IDs from the count of position NFTs
  const {
    data: positionValues,
    isError: isErrorPositionValues,
    isLoading: isLoadingPositionValues,
  } = useContractReads({
    contracts: positionsContracts(tokenValues),
    enabled:
      isConnected &&
      !(isLoadingBalanceOf || isErrorBalanceOf) &&
      tokenValues?.length,
    select: (data) =>
      data?.map?.((valObject, index) => ({
        tokenId: tokenValues?.[index],
        fee: valObject?.fee,
        token0: valObject?.token0,
        token1: valObject?.token1,
        liquidity: valObject?.liquidity?.toString?.(),
      })),
    ...hookArgs,
  });

  const filteredPositionValues = positionValues?.filter?.(
    (positionValue) =>
      positionValue?.fee == Number(latestIncentiveProgram?.fee) &&
      positionValue?.token0 == latestIncentiveProgram?.token0 &&
      positionValue?.token1 == latestIncentiveProgram?.token1
  );

  const noRecordsJSX = (
    <div className="bg-gray-800 p-3 rounded-4 d-flex gap-2 align-items-center justify-content-between">
      <div className="d-flex gap-3">
        <div className="d-flex flex-column gap-2">
          <h3 className="body2">No Records Found</h3>
          <p className="caption"></p>
        </div>
      </div>
    </div>
  );

  const recordsJSX = (
    <>
      {React.Children.toArray(
        filteredPositionValues?.map?.((data, index) => (
          <UniswapStakeEntry
            tokenId={data?.tokenId}
            liquidity={data?.liquidity}
            key={index}
          />
        ))
      )}
    </>
  );

  const loadingJSX = <UniswapStakeContentsLoading />;

  const renderedJSX =
    !isMounted() || isLoadingPositionValues
      ? loadingJSX
      : filteredPositionValues?.length > 0 && !isErrorPositionValues
      ? recordsJSX
      : noRecordsJSX;

  console.log("contract values:", {
    balanceOf,
    totalPositions,
    tokenOfOwnerByIndexContracts: tokenOfOwnerByIndexContracts(
      totalPositions && totalPositions
    ),
    totalPositions,
    isConnected,
    finalAddress,
    tokenValues,
    isErrorTokenValues,
    isLoadingTokenValues,
    positionValues: positionValues,
    filteredPositionValues,
    latestIncentiveProgram,
  });

  return renderedJSX;
};

export const UniswapStakeContents = dynamic(
  () => Promise.resolve(StaticUniswapStakeContents),
  {
    ssr: false,
  }
);
// export default UniswapStakeContents;
