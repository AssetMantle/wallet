import React from "react";
import { getBalanceStyle } from "../config";
import { decimalize, staticEarnData, useOsmosis, useQuickswap } from "../data";
import Table from "./Table";
import { Stack } from "react-bootstrap";

const EarnTable = () => {
  const { allOsmosis, isLoadingOsmosis, errorOsmosis } = useOsmosis();
  const { allQuickswap, isLoadingQuickswap, errorQuickswap } = useQuickswap();

  let isLoading = isLoadingOsmosis || isLoadingQuickswap;
  let isError = errorOsmosis || errorQuickswap;
  const fetchedData =
    isLoading || isError ? [] : [...allOsmosis, ...allQuickswap];

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
  if (isLoading || isError) {
    earnData = placeHolderData;
  } else {
    earnData = fetchedData;
  }

  const fetchedColumns = [
    {
      Header: "Name",
      accessor: "symbol",
      Cell: (tableProps) => (
        <Stack
          direction="horizontal"
          className="align-items-center justify-content-around"
        >
          <a
            href={tableProps.row.original.url}
            target="_blank"
            width={20}
            rel="noreferrer"
          >
            {tableProps.row.original.symbol}
          </a>{" "}
          <i className="bi bi-arrow-up-right"></i>
        </Stack>
      ),
    },
    {
      Header: "Category",
      accessor: "project",
      Cell: (tableProps) => (
        <Stack className="justify-content-start" direction="horizontal" gap={2}>
          <div
            className="position-relative rounded-circle overflow-hidden"
            style={{
              width: "20px",
              aspectRatio: "1/1",
              margin: "auto 0",
              marginLeft: "5px",
            }}
          >
            <img
              alt={tableProps.row.original.logo?.toLowerCase()}
              className="w-100 h-100"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
              layout="fill"
              src={`/tradePage/${tableProps?.row?.original?.project?.toLowerCase()}.webp`}
            />
          </div>
          <p className="m-0">{tableProps?.row?.original?.project}</p>
        </Stack>
      ),
    },
    {
      Header: "Chains",
      accessor: "chains",
      Cell: (tableProps) => (
        <Stack className="justify-content-center" direction="horizontal">
          <div
            className="position-relative rounded-circle overflow-hidden"
            style={{
              width: "20px",
              aspectRatio: "1/1",
              margin: "auto 0",
              marginLeft: "5px",
            }}
          >
            <img
              alt={tableProps?.row?.original?.logo}
              className="w-100 h-100"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
              layout="fill"
              src={`/earn/${tableProps?.row?.original?.chain?.toLowerCase()}.svg`}
            />
          </div>
        </Stack>
      ),
    },
    {
      Header: "APY",
      accessor: "apy",
      Cell: (tableProps) => (
        <p className="m-0">
          {getBalanceStyle(
            decimalize(tableProps?.row?.original?.apy, 4),
            "caption text-white-300 m-0",
            "caption2 text-white-300 m-0"
          )}
          %
        </p>
      ),
    },
    {
      Header: "TVL",
      accessor: "tvlUsd",
      Cell: (tableProps) => (
        <p className="m-0">
          $
          {getBalanceStyle(
            decimalize(tableProps?.row?.original?.tvlUsd, 2),
            "caption text-white-300 m-0",
            "caption2 text-white-300 m-0"
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
        <Stack
          direction="horizontal"
          className="align-items-center justify-content-around"
        >
          <a
            href={tableProps.row.original.url}
            target="_blank"
            width={20}
            rel="noreferrer"
          >
            {tableProps.row.original.symbol}
          </a>{" "}
          <i className="bi bi-arrow-up-right"></i>
        </Stack>
      ),
    },
    {
      Header: "Category",
      accessor: "project",
      Cell: (tableProps) => (
        <Stack className="justify-content-start" direction="horizontal" gap={2}>
          <div
            className="position-relative rounded-circle overflow-hidden"
            style={{
              width: "20px",
              aspectRatio: "1/1",
              margin: "auto 0",
              marginLeft: "5px",
            }}
          >
            <img
              alt={tableProps.row.original.logo?.toLowerCase()}
              className="w-100 h-100"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
              layout="fill"
              src={`/tradePage/${tableProps?.row?.original?.project?.toLowerCase()}.webp`}
            />
          </div>
          <p className="m-0">{tableProps?.row?.original?.project}</p>
        </Stack>
      ),
    },
    {
      Header: "Chains",
      accessor: "chains",
      Cell: (tableProps) => (
        <Stack className="justify-content-center" direction="horizontal">
          <div
            className="position-relative rounded-circle overflow-hidden"
            style={{
              width: "20px",
              aspectRatio: "1/1",
              margin: "auto 0",
              marginLeft: "5px",
            }}
          >
            <img
              alt={tableProps?.row?.original?.logo}
              className="w-100 h-100"
              style={{
                objectFit: "cover",
                objectPosition: "center",
              }}
              layout="fill"
              src={`/earn/${tableProps?.row?.original?.chain?.toLowerCase()}.svg`}
            />
          </div>
        </Stack>
      ),
    },
    {
      Header: "APY",
      accessor: "apy",
      Cell: (tableProps) => (
        <div>
          {isLoading ? (
            <p className="placeholder-glow m-0">
              <span className="placeholder col-6"></span>
            </p>
          ) : (
            <p className="m-0">
              {" "}
              {getBalanceStyle(
                decimalize(tableProps?.row?.original?.apy, 4),
                "caption text-white-300 m-0",
                "caption2 text-white-300 m-0"
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
            <p className="placeholder-glow m-0">
              <span className="placeholder col-6"></span>
            </p>
          ) : (
            <p>
              $
              {getBalanceStyle(
                decimalize(tableProps?.row?.original?.tvlUsd, 2),
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
  if (isLoading || isError) {
    columns = nonFetchedColumns;
  } else {
    columns = fetchedColumns;
  }

  return (
    <>
      <Table columns={columns} data={earnData} />
    </>
  );
};

export default EarnTable;
