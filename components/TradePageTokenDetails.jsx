import React from "react";
import { getBalanceStyle } from "../config";
import { decimalize } from "../data";

const TradePageTokenDetails = ({ isLoading, data }) => {
  // const { allTrades, isLoadingTrades, errorTrades } = useTrade();

  return (
    <div className="rounded-4 p-3 bg-gray-800 width-100 d-flex flex-column gap-3">
      <h4 className="body1 text-primary">Token Details</h4>
      <div className="nav-bg p-3 rounded-4 d-flex flex-column gap-1">
        <div>
          <p className="caption d-flex gap-2 align-items-center text-white-300">
            Market Cap
          </p>
        </div>
        <div className="caption pb-3">
          {isLoading ? (
            <p className="placeholder-glow">
              <span className="placeholder col-6 w-100"></span>
            </p>
          ) : (
            <>$ {decimalize(data?.marketCap, 2)}</>
          )}
        </div>
        <div>
          <p className="caption d-flex gap-2 align-items-center text-white-300">
            Circulating Supply
          </p>
        </div>
        <div className="caption pb-3">
          {isLoading ? (
            <p className="placeholder-glow">
              <span className="placeholder col-6 w-100"></span>
            </p>
          ) : (
            getBalanceStyle(
              decimalize(data?.circulatingSupply),
              "caption",
              "caption2"
            )
          )}
        </div>
        <div>
          <p className="caption d-flex gap-2 align-items-center text-white-300">
            Total Supply
          </p>
        </div>
        <div className="caption pb-3">
          {isLoading ? (
            <p className="placeholder-glow">
              <span className="placeholder col-6 w-100"></span>
            </p>
          ) : (
            getBalanceStyle(
              decimalize(data?.totalSupply),
              "caption",
              "caption2"
            )
          )}
        </div>
        <div>
          <p className="caption d-flex gap-2 align-items-center text-white-300">
            Max Supply
          </p>
        </div>
        <div className="caption pb-3">
          {isLoading ? (
            <p className="placeholder-glow">
              <span className="placeholder col-6 w-100"></span>
            </p>
          ) : (
            <>$ {decimalize(data?.maxSupply, 0)}</>
          )}
        </div>
        <div>
          <p className="caption d-flex gap-2 align-items-center text-white-300">
            24 Hour Trading Volume
          </p>
          <div className="caption pb-3">
            {isLoading ? (
              <p className="placeholder-glow">
                <span className="placeholder col-6 w-100"></span>
              </p>
            ) : (
              <>
                ${" "}
                {getBalanceStyle(
                  decimalize(data?.volume, 2),
                  "caption",
                  "caption2"
                )}
              </>
            )}
          </div>
        </div>
        <div>
          <p className="caption d-flex gap-2 align-items-center text-white-300">
            Fully Diluted Valuation
          </p>
          <div className="caption pb-3">
            {isLoading ? (
              <p className="placeholder-glow">
                <span className="placeholder col-6 w-100"></span>
              </p>
            ) : (
              <>$ {decimalize(data?.fullyDilutedValuation, 2)}</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradePageTokenDetails;
