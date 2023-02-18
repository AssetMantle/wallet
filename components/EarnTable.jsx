import React from "react";
import { getBalanceStyle } from "../config";
import { decimalize, useOsmosis, useQuickswap } from "../data";
import Table from "./Table";

const EarnTable = () => {
  const { allOsmosis, isLoadingOsmosis, errorOsmosis } = useOsmosis();
  const { allQuickswap, isLoadingQuickswap, errorQuickswap } = useQuickswap();
  let isLoading = isLoadingOsmosis || isLoadingQuickswap;
  const fetchedData = isLoading ? [] : [...allOsmosis, ...allQuickswap];
  console.log(allOsmosis);
  const loadingData = [
    { symbol: true, project: true, chains: true, apy: true, tvlUsd: true },
    { symbol: true, project: true, chains: true, apy: true, tvlUsd: true },
    { symbol: true, project: true, chains: true, apy: true, tvlUsd: true },
    { symbol: true, project: true, chains: true, apy: true, tvlUsd: true },
    { symbol: true, project: true, chains: true, apy: true, tvlUsd: true },
    { symbol: true, project: true, chains: true, apy: true, tvlUsd: true },
    { symbol: true, project: true, chains: true, apy: true, tvlUsd: true },
    { symbol: true, project: true, chains: true, apy: true, tvlUsd: true },
    { symbol: true, project: true, chains: true, apy: true, tvlUsd: true },
    { symbol: true, project: true, chains: true, apy: true, tvlUsd: true },
    { symbol: true, project: true, chains: true, apy: true, tvlUsd: true },
    { symbol: true, project: true, chains: true, apy: true, tvlUsd: true },
    { symbol: true, project: true, chains: true, apy: true, tvlUsd: true },
    { symbol: true, project: true, chains: true, apy: true, tvlUsd: true },
    { symbol: true, project: true, chains: true, apy: true, tvlUsd: true },
    { symbol: true, project: true, chains: true, apy: true, tvlUsd: true },
  ];

  const fetchedColumns = [
    {
      Header: "Name",
      accessor: "symbol",
      Cell: (tableProps) => (
        <div className="d-flex align-items-center justify-content-around">
          <a
            href={tableProps.row.original.url}
            target="_blank"
            width={20}
            rel="noreferrer"
          >
            {tableProps.row.original.symbol}
          </a>{" "}
          <i className="bi bi-arrow-up-right"></i>
        </div>
      ),
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
      Cell: (tableProps) => (
        <p>
          {getBalanceStyle(
            decimalize(tableProps?.row?.original?.apy, 4),
            "caption text-white-300",
            "caption2 text-white-300"
          )}
          %
        </p>
      ),
    },
    {
      Header: "TVL",
      accessor: "tvlUsd",
      Cell: (tableProps) => (
        <p>
          $
          {getBalanceStyle(
            decimalize(tableProps?.row?.original?.tvlUsd, 2),
            "caption text-white-300",
            "caption2 text-white-300"
          )}
        </p>
      ),
    },
  ];

  const loadingColumns = [
    {
      Header: "Name",
      accessor: "symbol",
      Cell: (tableProps) =>
        tableProps.row.original.symbol ? (
          <p className="placeholder-glow">
            <span className="placeholder col-6"></span>
          </p>
        ) : null,
    },
    {
      Header: "Category",
      accessor: "project",
      Cell: (tableProps) =>
        tableProps.row.original.project ? (
          <p className="placeholder-glow">
            <span className="placeholder col-6"></span>
          </p>
        ) : null,
    },
    {
      Header: "Chains",
      accessor: "chains",
      Cell: (tableProps) =>
        tableProps.row.original.chains ? (
          <p className="placeholder-glow">
            <span className="placeholder col-6"></span>
          </p>
        ) : null,
    },
    {
      Header: "APY",
      accessor: "apy",
      Cell: (tableProps) =>
        tableProps.row.original.apy ? (
          <p className="placeholder-glow">
            <span className="placeholder col-6"></span>
          </p>
        ) : null,
    },
    {
      Header: "TVL",
      accessor: "tvlUsd",
      Cell: (tableProps) =>
        tableProps.row.original.tvlUsd ? (
          <p className="placeholder-glow">
            <span className="placeholder col-6"></span>
          </p>
        ) : null,
    },
  ];
  return (
    <>
      {isLoading ? (
        <Table columns={loadingColumns} data={loadingData} />
      ) : (
        <Table columns={fetchedColumns} data={fetchedData} />
      )}
    </>
  );
};

export default EarnTable;
