import React from "react";

export default function Stake({ tokenId, liquidity, icon = "mntl" }) {
  return (
    <div className="border-b-not_last py-3 d-flex gap-2 align-items-center justify-content-between w-100">
      <div className="d-flex gap-3">
        <div
          className="position-relative rounded-circle"
          style={{ width: "40px", aspectRatio: "1/1" }}
        >
          <img
            src={`/farm/icons/${icon.toLowerCase()}.svg`}
            alt={`${icon} icon`}
            className="w-100 h-100"
            style={{ objectFit: "contain", objectPosition: "center" }}
          />
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
          //   onClick={handleSubmit}
          //   disabled={!writeAsync}
        >
          Stake
        </button>
      </div>
    </div>
  );
}
