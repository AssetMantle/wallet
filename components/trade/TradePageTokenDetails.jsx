import React from "react";
import { getBalanceStyle } from "../../config";
import { decimalize, useTrade } from "../../data";
import { Stack } from "react-bootstrap";

const TradePageTokenDetails = () => {
  const { allTrades, isLoadingTrades, errorTrades } = useTrade();
  const data = allTrades?.tokenDetails;

  console.error(errorTrades);

  return (
    <Stack gap={3} className="rounded-4 p-3 bg-am-gray-200 width-100">
      <h3 className="h3 text-primary m-0">Token Details</h3>
      <Stack gap={1} className="bg-black p-3 rounded-4">
        <div>
          <p className="caption d-flex gap-2 align-items-center text-white-50 m-0">
            Market Cap
          </p>
        </div>
        {isLoadingTrades ? (
          <p className="placeholder-glow m-0">
            <span className="placeholder col-6 w-100"></span>
          </p>
        ) : (
          <p className="caption pb-3 m-0">${decimalize(data?.marketCap, 2)}</p>
        )}
        <div>
          <p className="caption d-flex gap-2 align-items-center text-white-50 m-0">
            Circulating Supply
          </p>
        </div>
        {isLoadingTrades ? (
          <p className="placeholder-glow m-0">
            <span className="placeholder col-6 w-100"></span>
          </p>
        ) : (
          <p className="caption pb-3 m-0">
            {getBalanceStyle(
              decimalize(data?.circulatingSupply),
              "caption",
              "caption2"
            )}
          </p>
        )}
        <div>
          <p className="caption d-flex gap-2 align-items-center text-white-50 m-0">
            Total Supply
          </p>
        </div>
        {isLoadingTrades ? (
          <p className="placeholder-glow">
            <span className="placeholder col-6 w-100 m-0"></span>
          </p>
        ) : (
          <p className="caption pb-3 m-0">
            {getBalanceStyle(
              decimalize(data?.totalSupply),
              "caption",
              "caption2"
            )}
          </p>
        )}
        <div>
          <p className="caption d-flex gap-2 align-items-center text-white-50 m-0">
            Max Supply
          </p>
        </div>
        {isLoadingTrades ? (
          <p className="placeholder-glow m-0">
            <span className="placeholder col-6 w-100"></span>
          </p>
        ) : (
          <p className="caption pb-3 m-0">${decimalize(data?.maxSupply, 0)}</p>
        )}
        <div>
          <p className="caption d-flex gap-2 align-items-center text-white-50 m-0">
            24 Hour Trading Volume
          </p>
          {isLoadingTrades ? (
            <p className="placeholder-glow m-0">
              <span className="placeholder col-6 w-100"></span>
            </p>
          ) : (
            <p className="caption pb-3 m-0">
              $
              {getBalanceStyle(
                decimalize(data?.volume, 2),
                "caption",
                "caption2"
              )}
            </p>
          )}
        </div>
        <div>
          <p className="caption d-flex gap-2 align-items-center text-white-50 m-0">
            Fully Diluted Valuation
          </p>
          {isLoadingTrades ? (
            <p className="placeholder-glow m-0">
              <span className="placeholder col-6 w-100"></span>
            </p>
          ) : (
            <p className="caption pb-3 m-0">
              ${decimalize(data?.fullyDilutedValuation, 2)}
            </p>
          )}
        </div>
      </Stack>
    </Stack>
  );
};

export default TradePageTokenDetails;
