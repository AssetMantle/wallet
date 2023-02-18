import React from "react";
import { getBalanceStyle } from "../config";
import { decimalize } from "../data";

import Table from "./Table";

const TradeTable = ({ data }) => {
  const memoizedData = React.useMemo(() => data, []);

  const columns = React.useMemo(
    () => [
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
    ],
    []
  );

  return (
    <>
      <Table columns={columns} data={memoizedData} />
    </>
  );
};

export default TradeTable;
