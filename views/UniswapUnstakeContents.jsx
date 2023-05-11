import dynamic from "next/dynamic";
import React from "react";
import useSWR from "swr";
import { useAccount, useContractReads } from "wagmi";
import { UniswapUnstakeEntry } from "../components";
import { ethConfig, useIncentiveList, useStakedPositionsNftId } from "../data";
import { getIncentiveIdFromKey } from "../lib";
import { UniswapStakeContentsLoading } from "./UniswapStakeContentsLoading";

const nonFungiblePositionManagerContractAddress =
  ethConfig?.mainnet?.uniswap?.nonFungiblePositionManager?.address;
const uniV3StakerContractAddress =
  ethConfig?.mainnet?.uniswap?.uniV3Staker?.address;
const nonFungiblePositionManagerABI =
  ethConfig?.mainnet?.uniswap?.nonFungiblePositionManager?.abi;
const chainID = ethConfig?.mainnet?.chainID;

const nonFungiblePositionManagerContract = {
  address: nonFungiblePositionManagerContractAddress,
  abi: nonFungiblePositionManagerABI,
};

const hookArgs = { watch: true, chainId: chainID };

const StaticUniswapUnstakeContents = () => {
  // HOOKS
  // hooks to get the incentive program data
  const { incentiveList, isLoadingIncentiveList } = useIncentiveList();
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

  const selectedIncentiveId = selectedIncentiveTuple?.length
    ? getIncentiveIdFromKey(selectedIncentiveTuple)
    : null;

  // const isMounted = useIsMounted();
  const { positionNfts, isLoadingPositionNfts, errorPositionNfts } =
    useStakedPositionsNftId(selectedIncentiveId);

  const { address, isConnected } = useAccount();

  // function to return the contract data array for multi-read of positions multi-read
  const positionsContracts = (tokenValuesArray) => {
    let tokenArray = [];
    for (let index = 0; index < tokenValuesArray?.length; index++) {
      tokenArray.push({
        ...nonFungiblePositionManagerContract,
        functionName: "ownerOf",
        args: [tokenValuesArray?.[index]?.id],
      });
    }
    return tokenArray;
  };

  // wagmi hook to read the array of Position NFT IDs from the count of position NFTs
  const {
    data: ownerValues,
    isError: isErrorOwnerValues,
    isLoading: isLoadingOwnerValues,
  } = useContractReads({
    contracts: positionsContracts(positionNfts),
    enabled: isConnected && address && positionNfts?.length,
    select: (data) =>
      data?.map?.((valObject, index) => ({
        tokenId: positionNfts?.[index]?.id,
        owner: valObject,
        liquidity: positionNfts?.[index]?.liquidity,
      })),
    ...hookArgs,
  });

  // filter all the tokens whose owner is the uniswap v3 staker contract
  const filteredPositionNfts = ownerValues?.filter?.(
    (ownerObject) => ownerObject?.owner == uniV3StakerContractAddress
  );

  // RENDERED COMPONENTS
  const noRecordsJSX = (
    <h3 className="caption text-center text-error">
      <i className="bi bi-info-circle"></i> No Records Found
    </h3>
  );

  const recordsJSX = (
    <>
      {React.Children.toArray(
        filteredPositionNfts?.map?.((data, index) => (
          <UniswapUnstakeEntry
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
    isLoadingPositionNfts || isLoadingOwnerValues
      ? loadingJSX
      : filteredPositionNfts?.length > 0 &&
        !errorPositionNfts &&
        !isErrorOwnerValues
      ? recordsJSX
      : noRecordsJSX;

  /* console.log(
    "positionNFTs: ",
    positionNfts,
    " loading: ",
    isLoadingPositionNfts,
    " error: ",
    errorPositionNfts,
    " ownerValue: ",
    ownerValues,
    " filteredPositionNfts: ",
    filteredPositionNfts,
    " selectedIncentiveId: ",
    selectedIncentiveId
  ); */

  return renderedJSX;
};

export const UniswapUnstakeContents = dynamic(
  () => Promise.resolve(StaticUniswapUnstakeContents),
  {
    ssr: false,
  }
);
// export default UniswapStakeContents;
