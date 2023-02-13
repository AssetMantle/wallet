import React from "react";
import Table from "./Table";

const EarnTable = ({ data }) => {
  const columns = [
    {
      Header: "Name",
      accessor: "symbol",
    },
    {
      Header: "Category",
      accessor: "project",
    },
    {
      Header: "Chains",
      accessor: "chains",
      Cell: (tableProps) => (
        <div
          className="d-flex position-relative rounded-circle gap-1"
          style={{
            width: "20px",
            aspectRatio: "1/1",
          }}
        >
          <img
            alt={tableProps.row.original.logo}
            className="rounded-circle"
            layout="fill"
            src={`/earn/${tableProps.row.original.project}.svg`}
          />
        </div>
      ),
    },
    { Header: "APY", accessor: "apy" },
    { Header: "TVL", accessor: "tvlUsd" },
  ];
  return (
    <>
      <Table columns={columns} data={data} />
    </>
  );
};

export default EarnTable;
