import React from "react";
import { UniswapStakeEntryLoading } from "../components/UniswapStakeEntryLoading";

export const UniswapStakeContentsLoading = () => {
  // const totalPositions = Number(balanceOf);
  const totalPositions = 3;
  const truthyArray = new Array(totalPositions).fill(true);

  return (
    <>
      {React.Children.toArray(
        truthyArray?.map?.((data, index) => (
          <UniswapStakeEntryLoading
            tokenId={data}
            liquidity={data}
            key={index}
          />
        ))
      )}
    </>
  );
};
