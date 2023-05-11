import React from "react";
import { getBalanceStyle } from "../config";
import { decimalize, staticEarnData, useOsmosis, useQuickswap } from "../data";
import Table from "./Table";

const EarnTable = () => {
  const { allOsmosis, isLoadingOsmosis, errorOsmosis } = useOsmosis();
  const { allQuickswap, isLoadingQuickswap, errorQuickswap } = useQuickswap();
  let isLoading = isLoadingOsmosis || isLoadingQuickswap;
  let isErrorOsmosis = errorOsmosis;
  let isErrorQuickswap = errorQuickswap;
  let fetchedData;
  // if (isLoading && isErrorOsmosis && isErrorQuickswap) {
  //   fetchedData = [];
  // } else
  if (!isErrorQuickswap && isErrorOsmosis) {
    fetchedData = [...allQuickswap];
  } else if (isErrorOsmosis && !isErrorQuickswap) {
    fetchedData = [...allOsmosis];
  }
  // else if (isLoading) {
  //   fetchedData = [];
  // }
  // else {
  //   fetchedData = [...allOsmosis, ...allQuickswap];
  // }
  // const isData =  !(isLoading || isErrorOsmosis || isErrorQuickswap)
  //  fetchedData =
  //   isData ? [] : [...allOsmosis, ...allQuickswap];

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

  const placeHolderData = staticEarnData;

  let earnData = [];
  if (isLoading || (isErrorOsmosis && isErrorQuickswap)) {
    earnData = placeHolderData;
  } else {
    earnData = fetchedData;
  }

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
              alt={tableProps.row.original.logo?.toLowerCase()}
              className="rounded-circle"
              layout="fill"
              src={`/tradePage/${tableProps?.row?.original?.project?.toLowerCase()}.webp`}
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
              src={`/earn/${tableProps?.row?.original?.chain?.toLowerCase()}.svg`}
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

  const nonFetchedColumns = [
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
              alt={tableProps.row.original.logo?.toLowerCase()}
              className="rounded-circle"
              layout="fill"
              src={`/tradePage/${tableProps?.row?.original?.project?.toLowerCase()}.webp`}
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
              src={`/earn/${tableProps?.row?.original?.chain?.toLowerCase()}.svg`}
            />
          </div>
        </div>
      ),
    },
    {
      Header: "APY",
      accessor: "apy",
      Cell: (tableProps) => (
        <div>
          {isLoading ? (
            <p className="placeholder-glow">
              <span className="placeholder col-6"></span>
            </p>
          ) : (
            <p>
              {" "}
              {getBalanceStyle(
                decimalize(tableProps?.row?.original?.apy, 4),
                "caption text-white-300",
                "caption2 text-white-300"
              )}
              %
            </p>
          )}
        </div>
      ),
    },
    {
      Header: "TVL",
      accessor: "tvlUsd",
      Cell: (tableProps) => (
        <div>
          {isLoading ? (
            <p className="placeholder-glow">
              <span className="placeholder col-6"></span>
            </p>
          ) : (
            <p>
              {" "}
              $
              {getBalanceStyle(
                decimalize(tableProps?.row?.original?.tvlUsd, 2),
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
  if (isLoading || (isErrorOsmosis && isErrorQuickswap)) {
    columns = nonFetchedColumns;
  } else {
    columns = fetchedColumns;
  }
  console.log(columns, earnData);

  return (
    <>
      <Table columns={columns} data={earnData} />
    </>
  );
};

export default EarnTable;
