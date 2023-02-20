import dynamic from "next/dynamic";
import React from "react";
import { UniswapUnstakeEntry } from "../components";
import { ethConfig, useStakedPositionsNftId } from "../data";
import { useIsMounted } from "../lib";
import { UniswapStakeContentsLoading } from "./UniswapStakeContentsLoading";

const selectedIncentive = ethConfig?.selected?.uniswapIncentiveProgram;

const latestIncentiveProgram =
  ethConfig?.mainnet?.uniswap?.incentivePrograms?.[selectedIncentive];

const StaticUniswapUnstakeContents = () => {
  // HOOKS
  const isMounted = useIsMounted();
  const { positionNfts, isLoadingPositionNfts, errorPositionNfts } =
    useStakedPositionsNftId(latestIncentiveProgram?.incentiveId);

  console.log(
    "positionNFTs inside component: ",
    positionNfts,
    " loading: ",
    isLoadingPositionNfts,
    " error: ",
    errorPositionNfts,
    "isMounted: ",
    isMounted()
  );

  // RENDERED COMPONENTS
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
        positionNfts?.map?.((data, index) => (
          <UniswapUnstakeEntry tokenId={data} key={index} />
        ))
      )}
    </>
  );

  const loadingJSX = <UniswapStakeContentsLoading />;

  const renderedJSX =
    !positionNfts || isLoadingPositionNfts
      ? loadingJSX
      : positionNfts?.length > 0 && !errorPositionNfts
      ? recordsJSX
      : noRecordsJSX;

  return renderedJSX;
};

export const UniswapUnstakeContents = dynamic(
  () => Promise.resolve(StaticUniswapUnstakeContents),
  {
    ssr: false,
  }
);
// export default UniswapStakeContents;
