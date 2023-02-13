import React from "react";

const EarnPageTokenDetails = ({ data }) => {
  return (
    <div className="rounded-4 p-3 bg-gray-800 width-100 d-flex flex-column gap-3">
      <h4 className="body1 text-primary">Token Details</h4>
      <div className="nav-bg p-3 rounded-4 d-flex flex-column gap-1">
        <div>
          <p className="caption d-flex gap-2 align-items-center text-white-300">
            Market Cap
          </p>
        </div>
        <p className="caption pb-3">${data?.marketCap}</p>
        <div>
          <p className="caption d-flex gap-2 align-items-center text-white-300">
            Circulating Supply
          </p>
        </div>
        <p className="caption pb-3">{data?.circulatingSupply}</p>
        <div>
          <p className="caption d-flex gap-2 align-items-center text-white-300">
            Total Supply
          </p>
        </div>
        <p className="caption pb-3">{data?.totalSupply}</p>
        <div>
          <p className="caption d-flex gap-2 align-items-center text-white-300">
            Max Supply
          </p>
        </div>
        <p className="caption pb-3">${data?.maxSupply}</p>
        <div>
          <p className="caption d-flex gap-2 align-items-center text-white-300">
            24 Hour Trading Volume
          </p>
          <p className="caption pb-3">${data?.volume}</p>
        </div>
        <div>
          <p className="caption d-flex gap-2 align-items-center text-white-300">
            Fully Diluted Valuation
          </p>
          <p className="caption pb-3">${data?.fullyDilutedValuation}</p>
        </div>
      </div>
    </div>
  );
};

export default EarnPageTokenDetails;
