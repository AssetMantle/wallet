import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import { UniswapUnstakeEntry } from "../components";
import { ethConfig, useStakedPositionsNftId } from "../data";
import { UniswapStakeContentsLoading } from "./UniswapStakeContentsLoading";

const selectedIncentive = ethConfig?.selected?.uniswapIncentiveProgram;

const latestIncentiveProgram =
  ethConfig?.mainnet?.uniswap?.incentivePrograms?.[selectedIncentive];

const StaticUniswapUnstakeContents = () => {
  // HOOKS
  // const isMounted = useIsMounted();
  const { positionNfts, isLoadingPositionNfts, errorPositionNfts } =
    useStakedPositionsNftId(latestIncentiveProgram?.incentiveId);

  const [isSsr, setIsSsr] = useState(false);

  useEffect(() => {
    setIsSsr(true);

    return () => {};
  }, []);

  console.log(
    "positionNFTs inside component: ",
    positionNfts,
    " loading: ",
    isLoadingPositionNfts,
    " error: ",
    errorPositionNfts,
    " isSSr: ",
    isSsr
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
        positionNfts?.map?.((data, index) => (
          <UniswapUnstakeEntry tokenId={data} key={index} />
        ))
      )}
    </>
  );

  const loadingJSX = <UniswapStakeContentsLoading />;

  const renderedJSX =
    !positionNfts || isLoadingPositionNfts || !isSsr
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
