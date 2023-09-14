import dynamic from "next/dynamic";
import React from "react";
import useSWR from "swr";
import { useAccount, useContractRead, useContractReads } from "wagmi";
import { UniswapStakeEntry } from "../../components/farm";
import { ethConfig, useIncentiveList } from "../../data";
import { UniswapStakeContentsLoading } from "./UniswapStakeContentsLoading";

const nonFungiblePositionManagerContractAddress =
  ethConfig?.mainnet?.uniswap?.nonFungiblePositionManager?.address;
const nonFungiblePositionManagerABI =
  ethConfig?.mainnet?.uniswap?.nonFungiblePositionManager?.abi;
const chainID = ethConfig?.mainnet?.chainID;

const selectedIncentive = ethConfig?.selected?.uniswapIncentiveProgram;

ethConfig?.mainnet?.uniswap?.incentivePrograms?.[selectedIncentive];

const mntlEthPool = ethConfig?.mainnet?.uniswap?.mntlEthPool;

const StaticUniswapStakeContents = () => {
  // HOOKS
  // hooks to get the incentive program data
  const { incentiveList, isLoadingIncentiveList } = useIncentiveList();
  const { data: selectedIncentiveIndex } = useSWR("selectedIncentive");
  const isIncentivePopulated = !isLoadingIncentiveList && incentiveList?.length;

  // hooks to get the address of the connected wallet
  const { address, isConnected } = useAccount();
  // const isMounted = useIsMounted();

  const finalAddress = address;
  // const finalAddress = uniV3StakerContractAddress;

  const hookArgs = { watch: true, chainId: chainID };

  const nonFungiblePositionManagerContract = {
    address: nonFungiblePositionManagerContractAddress,
    abi: nonFungiblePositionManagerABI,
  };

  // wagmi hook to read the count of Position NFTs
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

  // wagmi hook to read the array of Position NFT IDs from the count of position NFTs
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

  // wagmi hook to read the array of Position NFT IDs from the count of position NFTs
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
      positionValue?.fee == Number(mntlEthPool?.fee) &&
      positionValue?.token0 == mntlEthPool?.token0 &&
      positionValue?.token1 == mntlEthPool?.token1
  );

  const noRecordsJSX = (
    <h3 className="caption text-error">
      <i className="bi bi-info-circle"></i> No Records Found
    </h3>
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
    isLoadingPositionValues || isLoadingTokenValues || isLoadingBalanceOf
      ? loadingJSX
      : filteredPositionValues?.length > 0 &&
        !(isErrorPositionValues || isErrorBalanceOf || isErrorTokenValues)
      ? recordsJSX
      : noRecordsJSX;

  console.log("contract values:", {
    balanceOf,
    totalPositions,
    totalPositions,
    isConnected,
    finalAddress,
    tokenValues,
    isErrorTokenValues,
    isLoadingTokenValues,
    positionValues: positionValues,
    filteredPositionValues,
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
