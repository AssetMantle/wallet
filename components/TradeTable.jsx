import React from "react";
import Table from "./Table";

const TradeTable = ({ data }) => {
  const columns = [
    {
      Header: "",
      accessor: "logo",
      Cell: (tableProps) => (
        <img src={tableProps.row.original.logo} width={20} alt="logo" />
      ),
    },
    {
      Header: "Market Name",
      accessor: "marketName",
      Cell: (tableProps) => (
        <>
          <a
            href={tableProps.row.original.url}
            target="_blank"
            width={20}
            rel="noreferrer"
          >
            {tableProps.row.original.exchangeName}
          </a>{" "}
          <i className="bi bi-arrow-up-right"></i>
        </>
      ),
    },
    { Header: "Trade Pair", accessor: "tradePair" },
    { Header: "Price", accessor: "price" },
    { Header: "Volume", accessor: "volume" },
  ];

  return (
    <>
      <Table columns={columns} data={data} />
    </>
  );
};

export default TradeTable;
