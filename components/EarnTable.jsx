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
      Cell: (tableProps) => (
        <div className="d-flex justify-content-start  gap-2">
          <div
            className="d-flex position-relative rounded-circle gap-1"
            style={{
              width: "20px",
              aspectRatio: "1/1",
              marginLeft: "5px",
            }}
          >
            <img
              alt={tableProps.row.original.logo}
              className="rounded-circle"
              layout="fill"
              src={`/trade/${tableProps?.row?.original?.project}.webp`}
            />
          </div>
          <p>{tableProps?.row?.original?.project}</p>
        </div>
      ),
    },
    {
      Header: "Chains",
      accessor: "chains",
      Cell: (tableProps) => (
        <div className="d-flex justify-content-center">
          <div
            className="d-flex position-relative rounded-circle gap-1"
            style={{
              width: "20px",
              aspectRatio: "1/1",
            }}
          >
            <img
              alt={tableProps?.row?.original?.logo}
              className="rounded-circle"
              layout="fill"
              src={`/earn/${tableProps?.row?.original?.chain}.svg`}
            />
          </div>
        </div>
      ),
    },
    {
      Header: "APY",
      accessor: "apy",
      Cell: (tableProps) => <p>{tableProps?.row?.original?.apy}%</p>,
    },
    { Header: "TVL", accessor: "tvlUsd" },
  ];
  return (
    <>
      <Table columns={columns} data={data} />
    </>
  );
};

export default EarnTable;
