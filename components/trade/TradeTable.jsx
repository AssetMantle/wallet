import React from "react";
import { getBalanceStyle } from "../../config";
import { decimalize, staticTradeData, useTrade } from "../../data";

import Table from "../Table";
import { Stack } from "react-bootstrap";

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
  const memoizedData = React.useMemo(() => tradeData, [isLoadingTrades]);
  const fetchedColumns = [
    {
      Header: "Market Name",
      accessor: "exchangeName",
      Cell: (tableProps) => (
        <Stack
          direction="horizontal"
          className="align-items-center justify-content-around"
        >
          <div
            className="position-relative"
            style={{ width: "20px", aspectRatio: "1/1" }}
          >
            <img
              src={`/tradePage/${tableProps?.row?.original?.logo}.webp`}
              className="h-100 w-100"
              style={{ objectFit: "cover", objectPosition: "center" }}
              alt="logo"
            />
          </div>
          <a
            href={tableProps.row.original.url}
            target="_blank"
            rel="noreferrer"
            className="text-primary"
          >
            {tableProps.row.original.exchangeName}
          </a>{" "}
          <i className="bi bi-arrow-up-right text-primary"></i>
        </Stack>
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
            "caption text-white-300 m-0",
            "caption2 text-white-300 m-0"
          )}
        </p>
      ),
      sortMethod: (a, b) => parseFloat(a) - parseFloat(b),
    },
    {
      Header: "Volume(24Hour)",
      accessor: "volume",
      Cell: (tableProps) => (
        <p className="m-0">
          {getBalanceStyle(
            decimalize(tableProps.row.original.volume),
            "caption text-white-300 m-0",
            "caption2 text-white-300 m-0"
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
        <Stack
          direction="horizontal"
          className="align-items-center justify-content-around"
        >
          <div
            className="position-relative"
            style={{ width: "20px", aspectRatio: "1/1" }}
          >
            <img
              src={`/tradePage/${tableProps?.row?.original?.logo}.webp`}
              className="h-100 w-100"
              style={{ objectFit: "cover", objectPosition: "center" }}
              alt="logo"
            />
          </div>
          <a
            href={tableProps.row.original.url}
            target="_blank"
            rel="noreferrer"
            className="text-primary"
          >
            {tableProps.row.original.name}
          </a>{" "}
          <i className="bi bi-arrow-up-right text-primary" />
        </Stack>
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
            <p className="placeholder-glow m-0">
              <span className="placeholder col-6"></span>
            </p>
          ) : (
            <p className="m-0">
              $
              {getBalanceStyle(
                decimalize(tableProps.row.original.price),
                "caption text-white-300 m-0",
                "caption2 text-white-300 m-0"
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
            <p className="placeholder-glow m-0">
              <span className="placeholder col-6"></span>
            </p>
          ) : (
            <p className="m-0">
              {getBalanceStyle(
                decimalize(tableProps.row.original.volume),
                "caption text-white-300 m-0",
                "caption2 text-white-300 m-0"
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
