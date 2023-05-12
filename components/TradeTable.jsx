import React from "react";
import { getBalanceStyle } from "../config";
import { decimalize, staticTradeData, useTrade } from "../data";

import Table from "./Table";

const TradeTable = () => {
  const { allTrades, isLoadingTrades, errorTrades } = useTrade();

  const placeHolderData = staticTradeData;
  // const tradeData =React.useMemo(()=>[],[])
  let tradeData = [];
  if (isLoadingTrades || errorTrades) {
    tradeData = placeHolderData;
  } else {
    tradeData = allTrades?.tradeData;
  }
  console.log(tradeData);
  const memoizedData = React.useMemo(() => tradeData, [isLoadingTrades]);
  const fetchedColumns = [
    {
      Header: "Market Name",
      accessor: "exchangeName",
      Cell: (tableProps) => (
        <div className="d-flex align-items-center justify-content-around">
          <img
            src={`/tradePage/${tableProps?.row?.original?.logo}.webp`}
            width={20}
            alt="logo"
          />
          <a
            href={tableProps.row.original.url}
            target="_blank"
            width={20}
            rel="noreferrer"
          >
            {tableProps.row.original.exchangeName}
          </a>{" "}
          <i className="bi bi-arrow-up-right"></i>
        </div>
      ),
      sortMethod: (a, b) => a - b,
    },
    { Header: "Trade Pair", accessor: "tradePair" },
    {
      Header: "Price",
      accessor: "price",
      Cell: (tableProps) => (
        <p>
          $
          {getBalanceStyle(
            decimalize(tableProps.row.original.price),
            "caption text-white-300",
            "caption2 text-white-300"
          )}
        </p>
      ),
      sortMethod: (a, b) => parseFloat(a) - parseFloat(b),
    },
    {
      Header: "Volume(24Hour)",
      accessor: "volume",
      Cell: (tableProps) => (
        <p>
          {getBalanceStyle(
            decimalize(tableProps.row.original.volume),
            "caption text-white-300",
            "caption2 text-white-300"
          )}
        </p>
      ),
    },
  ];

  const nonFetchedColumns = [
    {
      Header: "Market Name",
      accessor: "name",
      Cell: (tableProps) => (
        <div className="d-flex align-items-center justify-content-around">
          <img
            src={`/tradePage/${tableProps?.row?.original?.logo}.webp`}
            width={20}
            alt="logo"
          />
          <a
            href={tableProps.row.original.url}
            target="_blank"
            width={20}
            rel="noreferrer"
          >
            {tableProps.row.original.name}
          </a>{" "}
          <i className="bi bi-arrow-up-right"></i>
        </div>
      ),
      sortMethod: (a, b) => a - b,
    },
    { Header: "Trade Pair", accessor: "pair" },
    {
      Header: "Price",
      accessor: "price",
      Cell: (tableProps) => (
        <div>
          {isLoadingTrades ? (
            <p className="placeholder-glow">
              <span className="placeholder col-6"></span>
            </p>
          ) : (
            <p>
              {" "}
              $
              {getBalanceStyle(
                decimalize(tableProps.row.original.price),
                "caption text-white-300",
                "caption2 text-white-300"
              )}
            </p>
          )}
        </div>
      ),
      sortMethod: (a, b) => parseFloat(a) - parseFloat(b),
    },
    {
      Header: "Volume(24Hour)",
      accessor: "volume",
      Cell: (tableProps) => (
        <div>
          {isLoadingTrades ? (
            <p className="placeholder-glow">
              <span className="placeholder col-6"></span>
            </p>
          ) : (
            <p>
              {getBalanceStyle(
                decimalize(tableProps.row.original.volume),
                "caption text-white-300",
                "caption2 text-white-300"
              )}
            </p>
          )}
        </div>
      ),
    },
  ];

  let columns = [];
  if (isLoadingTrades || errorTrades) {
    columns = nonFetchedColumns;
  } else {
    columns = fetchedColumns;
  }

  return (
    <>
      <Table columns={columns} data={memoizedData} />
    </>
  );
};

export default TradeTable;
