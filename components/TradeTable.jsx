import React from "react";
import { getBalanceStyle } from "../config";
import { decimalize } from "../data";

import Table from "./Table";

const TradeTable = ({ data }) => {
  const columns = [
    {
      Header: "Market Name",
      accessor: "marketName",
      Cell: (tableProps) => (
        <div className="d-flex align-items-center justify-content-around">
          <img src={tableProps.row.original.logo} width={20} alt="logo" />
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
    },
    {
      Header: "Volume(24Hour)",
      accessor: "volume",
      Cell: (tableProps) => (
        <p>
          {getBalanceStyle(
            tableProps.row.original.volume,
            "caption text-white-300",
            "caption2 text-white-300"
          )}
        </p>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} data={data} />
    </>
  );
};

export default TradeTable;
