import React from "react";
import { getBalanceStyle } from "../config";
import { decimalize } from "../data";

const TradePageTokenDetails = ({ data }) => {
  return (
    <div className="rounded-4 p-3 bg-gray-800 width-100 d-flex flex-column gap-3">
      <h4 className="body1 text-primary">Token Details</h4>
      <div className="nav-bg p-3 rounded-4 d-flex flex-column gap-1">
        <div>
          <p className="caption d-flex gap-2 align-items-center text-white-300">
            Market Cap
          </p>
        </div>
        <p className="caption pb-3">${decimalize(data?.marketCap, 2)}</p>
        <div>
          <p className="caption d-flex gap-2 align-items-center text-white-300">
            Circulating Supply
          </p>
        </div>
        <p className="caption pb-3">
          {getBalanceStyle(
            decimalize(data?.circulatingSupply),
            "caption",
            "caption2"
          )}
        </p>
        <div>
          <p className="caption d-flex gap-2 align-items-center text-white-300">
            Total Supply
          </p>
        </div>
        <p className="caption pb-3">
          {getBalanceStyle(
            decimalize(data?.totalSupply),
            "caption",
            "caption2"
          )}
        </p>
        <div>
          <p className="caption d-flex gap-2 align-items-center text-white-300">
            Max Supply
          </p>
        </div>
        <p className="caption pb-3">${decimalize(data?.maxSupply, 0)}</p>
        <div>
          <p className="caption d-flex gap-2 align-items-center text-white-300">
            24 Hour Trading Volume
          </p>
          <p className="caption pb-3">
            $
            {getBalanceStyle(
              decimalize(data?.volume, 2),
              "caption",
              "caption2"
            )}
          </p>
        </div>
        <div>
          <p className="caption d-flex gap-2 align-items-center text-white-300">
            Fully Diluted Valuation
          </p>
          <p className="caption pb-3">
            ${decimalize(data?.fullyDilutedValuation, 2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TradePageTokenDetails;
