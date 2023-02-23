import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { useAccount, useContractReads } from "wagmi";
import { UniswapUnstakeEntry } from "../components";
import { ethConfig, useStakedPositionsNftId } from "../data";
import { UniswapStakeContentsLoading } from "./UniswapStakeContentsLoading";

const selectedIncentive = ethConfig?.selected?.uniswapIncentiveProgram;

const latestIncentiveProgram =
  ethConfig?.mainnet?.uniswap?.incentivePrograms?.[selectedIncentive];

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
  // const isMounted = useIsMounted();
  const { positionNfts, isLoadingPositionNfts, errorPositionNfts } =
    useStakedPositionsNftId(latestIncentiveProgram?.incentiveId);

  const { address, isConnected } = useAccount();

  const [isSsr, setIsSsr] = useState(false);

  useEffect(() => {
    setIsSsr(true);

    return () => {};
  }, []);

  // read the owner of the returned positions

  // function to return the contract data array for multi-read of positions multi-read
  const positionsContracts = (tokenValuesArray) => {
    let tokenArray = [];
    for (let index = 0; index < tokenValuesArray?.length; index++) {
      tokenArray.push({
        ...nonFungiblePositionManagerContract,
        functionName: "ownerOf",
        args: [tokenValuesArray?.[index]],
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
        tokenId: positionNfts?.[index],
        owner: valObject,
      })),
    ...hookArgs,
  });

  // filter all the tokens whose owner is the uniswap v3 staker contract
  const filteredPositionNfts = ownerValues?.filter?.(
    (ownerObject) => ownerObject?.owner == uniV3StakerContractAddress
  );

  // RENDERED COMPONENTS
  const noRecordsJSX = (
    <h3 className="caption text-error">
      <i className="bi bi-info-circle"></i> No Records Found
    </h3>
  );

  const recordsJSX = (
    <>
      {React.Children.toArray(
        filteredPositionNfts?.map?.((data, index) => (
          <UniswapUnstakeEntry tokenId={data?.tokenId} key={index} />
        ))
      )}
    </>
  );

  const loadingJSX = <UniswapStakeContentsLoading />;

  const renderedJSX =
    !positionNfts ||
    !filteredPositionNfts ||
    isLoadingPositionNfts ||
    isLoadingOwnerValues ||
    !isSsr
      ? loadingJSX
      : filteredPositionNfts?.length > 0 &&
        !errorPositionNfts &&
        !isErrorOwnerValues
      ? recordsJSX
      : noRecordsJSX;

  /* console.log(
    "positionNFTs inside component: ",
    positionNfts,
    " loading: ",
    isLoadingPositionNfts,
    " error: ",
    errorPositionNfts,
    " isSSr: ",
    isSsr,
    " ownerValue: ",
    ownerValues
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
