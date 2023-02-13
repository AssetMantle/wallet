import React from "react";

const EarnPageTokenDetails = ({ data }) => {
  return (
    <div className="rounded-4 p-3 bg-gray-800 width-100 d-flex flex-column gap-3">
      <h4 className="body1 text-primary">Token Details</h4>
      <div className="nav-bg p-3 rounded-4 d-flex flex-column gap-1">
        <div className="pb-3">
          <p className="caption d-flex gap-2 align-items-center text-white-300">
            Market Cap
          </p>
        </div>
        <p className="caption">${data?.marketCap}</p>
        <div className="pb-3">
          <p className="caption d-flex gap-2 align-items-center text-white-300">
            Circulating Supply
          </p>
        </div>
        <p className="caption">{data?.circulatingSupply}</p>
        <div className="pb-3">
          <p className="caption d-flex gap-2 align-items-center text-white-300">
            Total Supply
          </p>
        </div>
        <p className="caption">{data?.totalSupply}</p>
        <div className="pb-3">
          <p className="caption d-flex gap-2 align-items-center text-white-300">
            Max Supply
          </p>
        </div>
        <p className="caption">${data?.maxSupply}</p>
        <div className="pb-3">
          <p className="caption d-flex gap-2 align-items-center text-white-300">
            Fully Diluted Valuation
          </p>
          <p className="caption">${data?.fullyDilutedValuation}</p>
        </div>
      </div>
    </div>
  );
};

export default EarnPageTokenDetails;
