import React from "react";

export const UniswapStakeEntry = ({ tokenId, liquidity }) => {
  return (
    <div className="bg-gray-800 p-3 rounded-4 d-flex gap-2 align-items-center justify-content-between">
      <div className="d-flex gap-3">
        <div
          className="position-relative rounded-circle"
          style={{ width: "40px", aspectRatio: "1/1" }}
        >
          <img src="/chainLogos/mntl.svg" alt="MNTL Logo" />
        </div>
        <div className="d-flex flex-column gap-2">
          <h3 className="body2">Token ID: {tokenId}</h3>
          <p className="caption">Liquidity: {liquidity}</p>
        </div>
      </div>
      <div className="d-flex gap-2 align-items-center">
        <button className="button-secondary px-3 py-1">Stake</button>
      </div>
    </div>
  );
};
