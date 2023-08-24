import React from "react";

export const UniswapStakeEntryLoading = ({ tokenId, liquidity }) => {
  return (
    tokenId &&
    liquidity && (
      <div className="bg-secondary p-3 rounded-4 d-flex gap-2 align-items-center justify-content-between">
        <div className="d-flex gap-3">
          <div className="spinner-border text-warning">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div className="d-flex flex-column gap-2">
            <h3 className="placeholder-glow">
              <span className="placeholder col-6"></span>
            </h3>
            <p className="placeholder-glow">
              <span className="placeholder col-6"></span>
            </p>
          </div>
        </div>
      </div>
    )
  );
};
