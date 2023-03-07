import React, { useMemo, useState } from "react";
import { getBalanceStyle } from "../config";
import { decimalize, fromChainDenom } from "../data";
import { shiftDecimalPlaces } from "../lib";
import SelectionTable from "./SelectionTable";
import Tooltip from "./Tooltip";
import {
  useAllValidatorsBonded,
  useAllValidatorsUnbonded,
  useDelegatedValidators,
} from "../data";
import BigNumber from "bignumber.js";
import { createColumnHelper } from "@tanstack/react-table";

const StakeTable = ({
  data,
  delegated,
  setDelegated,
  setShowClaimError,
  stakeState,
  stakeDispatch,
}) => {
  const {
    allValidatorsBonded,
    isLoadingValidatorsBonded,
    errorValidatorsBonded,
  } = useAllValidatorsBonded();
  const {
    allValidatorsUnbonded,
    isLoadingValidatorsUnbonded,
    errorValidatorsUnbonded,
  } = useAllValidatorsUnbonded();
  const { delegatedValidators } = useDelegatedValidators();

  const [activeValidators, setActiveValidators] = useState(true);

  const tableData = activeValidators
    ? delegated
      ? delegatedValidators
          ?.sort((a, b) => b.tokens - a.tokens)
          ?.filter((item) =>
            allValidatorsBonded?.find(
              (e) => item?.operatorAddress == e?.operatorAddress
            )
          )
      : allValidatorsBonded
    : delegated
    ? delegatedValidators
        ?.sort((a, b) => b.tokens - a.tokens)
        ?.filter((item) =>
          allValidatorsUnbonded?.find(
            (e) => item?.operatorAddress == e?.operatorAddress
          )
        )
    : allValidatorsUnbonded;

  const memoizedTableData = React.useMemo(() => tableData, [tableData?.length]);

  const handleOnError = (e) => {
    e.preventDefault();
    // console.log("e: ", e);
    e.target.src = "/validatorAvatars/alt.png";
  };

  const totalTokens = data?.reduce?.(
    (accumulator, currentValue) =>
      BigNumber(accumulator).plus(BigNumber(currentValue?.tokens)).toString(),
    "0"
  );

  const columnHelper = createColumnHelper();

  const allActiveValidatorsColumns = useMemo(
    () => [
      columnHelper.accessor((row) => row.index, {
        id: "tooltip",
        cell: (info) => (
          <p>
            {" "}
            {/* {row.index < 10 ? ( */}
            <Tooltip
              titlePrimary={"text-warning"}
              title={<i className="bi bi-patch-exclamation-fill"></i>}
              description="It is preferable to not stake to the top 10 validators"
              style={{
                transform: "translateX(83%) translateY(-1%)",
              }}
            />
            {/* ) : null} */}
          </p>
        ),
        header: () => <span>Rank</span>,
        // footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.description.moniker, {
        id: "description.moniker",
        cell: (info) => <p>{info.getValue()}</p>,
        header: () => <span>Validator Name</span>,
        // footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.commission.commissionRates.rate, {
        id: "commission.commissionRates.rate",
        cell: (info) => <p>{shiftDecimalPlaces(info.getValue(), -16)}%</p>,
        header: () => <span>Commission</span>,
        // footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.tokens, {
        id: "tokens",
        cell: (info) => (
          <p>
            {!BigNumber(totalTokens || 0).isZero()
              ? decimalize(
                  BigNumber(info.getValue())
                    .multipliedBy(100)
                    .dividedBy(BigNumber(totalTokens))
                    .toString(),
                  2
                )
              : decimalize("0", 2)}
            %
          </p>
        ),
        header: () => <span>Voting Power</span>,
        // footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.tokens, {
        id: "delegations",
        cell: (info) => (
          <p>
            {getBalanceStyle(
              fromChainDenom(info.getValue(), 2),
              "caption2 text-white-300",
              "small text-white-300"
            )}
          </p>
        ),
        header: () => <span>Delegations</span>,
        // footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.operatorAddress, {
        id: "operatorAddress",
        cell: (info) => (
          <p>
            {delegatedValidators?.find(
              (element) => element?.operatorAddress == info.getValue()
            )
              ? getBalanceStyle(
                  fromChainDenom(
                    delegatedValidators?.find(
                      (element) => element?.operatorAddress == info.getValue()
                    )?.delegatedAmount
                  ),
                  "caption2 text-white-300",
                  "small text-white-300"
                )
              : "-"}
          </p>
        ),
        header: () => <span>Delegated Amount</span>,
        // footer: (props) => props.column.id,
      }),
    ],
    [totalTokens, delegatedValidators?.length]
  );
  // React.useMemo(
  //   () => [
  //     {
  //       Header: "",
  //       accessor: "tooltip",
  //       Cell: ({ row }) => (
  // <p>
  //   {" "}
  //   {row.index < 10 ? (
  //     <Tooltip
  //       titlePrimary={"text-warning"}
  //       title={<i className="bi bi-patch-exclamation-fill"></i>}
  //       description="It is preferable to not stake to the top 10 validators"
  //       style={{
  //         transform: "translateX(83%) translateY(-1%)",
  //       }}
  //     />
  //   ) : null}
  // </p>
  //       ),
  //     },
  //     {
  //       Header: "Rank",
  //       accessor: "tradePair",
  //       Cell: ({ row }) => <p> {row.index + 1}</p>,
  //     },
  //     {
  //       Header: "Validator Name",
  //       accessor: "description.moniker",
  //       Cell: (tableProps) => (
  //         <div
  //           className="d-flex position-relative rounded-circle gap-2"
  //           style={{ width: "25px", aspectRatio: "1/1" }}
  //         >
  //           <img
  //             layout="fill"
  //             alt={tableProps?.row?.original?.description?.moniker}
  //             className="rounded-circle"
  //             src={`/validatorAvatars/${tableProps?.row?.original?.operatorAddress}.png`}
  //             onError={handleOnError}
  //           />
  //           <a
  //             className="text-truncate"
  //             href={`https://explorer.assetmantle.one/validators/${tableProps?.row?.original?.operatorAddress}`}
  //             target="_blank"
  //             rel="noreferrer"
  //           >
  //             {tableProps?.row?.original?.description?.moniker}
  //           </a>
  //         </div>
  //       ),
  //     },
  //     {
  //       Header: "Voting Power",
  //       accessor: "tokens",
  //       Cell: (tableProps) => (
  //         <p>
  //           {!BigNumber(totalTokens || 0).isZero()
  //             ? decimalize(
  //                 BigNumber(tableProps?.row?.original?.tokens)
  //                   .multipliedBy(100)
  //                   .dividedBy(BigNumber(totalTokens))
  //                   .toString(),
  //                 2
  //               )
  //             : decimalize("0", 2)}
  //           %
  //         </p>
  //       ),
  //     },
  //     {
  //       Header: "Commissions",
  //       accessor: "commissions",
  //       Cell: (tableProps) => (
  //         <p>
  //           {shiftDecimalPlaces(
  //             tableProps?.row?.original?.commission?.commissionRates?.rate,
  //             -16
  //           )}
  //           %
  //         </p>
  //       ),
  //     },
  //     {
  //       Header: "Delegations",
  //       accessor: "delegations",
  //       Cell: (tableProps) => (
  //         <p>
  //           {getBalanceStyle(
  //             fromChainDenom(tableProps?.row?.original?.tokens, 2),
  //             "caption2 text-white-300",
  //             "small text-white-300"
  //           )}
  //         </p>
  //       ),
  //     },
  //     {
  //       Header: "Delegated amount",
  //       Cell: (tableProps) => (
  //         <p>
  //           {delegatedValidators?.find(
  //             (element) =>
  //               element?.operatorAddress ==
  //               tableProps?.row?.original?.operatorAddress
  //           )
  //             ? getBalanceStyle(
  //                 fromChainDenom(
  //                   delegatedValidators?.find(
  //                     (element) =>
  //                       element?.operatorAddress ==
  //                       tableProps?.row?.original?.operatorAddress
  //                   )?.delegatedAmount
  //                 ),
  //                 "caption2 text-white-300",
  //                 "small text-white-300"
  //               )
  //             : "-"}
  //         </p>
  //       ),
  //     },
  //   ],
  //   [totalTokens, delegatedValidators?.length]
  // );
  const allInactiveValidatorsColumns = React.useMemo(
    () => [
      {
        Header: "Validator Name",
        accessor: "description.moniker",
        Cell: (tableProps) => (
          <div
            className="d-flex position-relative rounded-circle gap-2"
            style={{ width: "25px", aspectRatio: "1/1" }}
          >
            <img
              layout="fill"
              alt={tableProps?.row?.original?.description?.moniker}
              className="rounded-circle"
              src={`/validatorAvatars/${tableProps?.row?.original?.operatorAddress}.png`}
              onError={handleOnError}
            />
            <a
              className="text-truncate"
              href={`https://explorer.assetmantle.one/validators/${tableProps?.row?.original?.operatorAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              {tableProps?.row?.original?.description?.moniker}
            </a>
          </div>
        ),
      },
      {
        Header: "Voting Power",
        accessor: "votingPower",
        Cell: (tableProps) => (
          <p>
            {((tableProps?.row?.original?.tokens * 100) / totalTokens).toFixed(
              2
            )}
            %
          </p>
        ),
      },
      {
        Header: "Commissions",
        accessor: "commissions",
        Cell: (tableProps) => (
          <p>
            {shiftDecimalPlaces(
              tableProps?.row?.original?.commission?.commissionRates?.rate,
              -16
            )}
            %
          </p>
        ),
      },
      {
        Header: "Delegations",
        accessor: "delegations",
        Cell: (tableProps) => (
          <p>
            {getBalanceStyle(
              fromChainDenom(tableProps?.row?.original?.tokens, 2),
              "caption2 text-white-300",
              "small text-white-300"
            )}
          </p>
        ),
      },
      {
        Header: "Delegated amount",
        accessor: "delegatedAmount",
        Cell: (tableProps) => (
          <p>
            {getBalanceStyle(
              fromChainDenom(
                delegatedValidators?.find(
                  (element) =>
                    element?.operatorAddress ==
                    tableProps?.row?.original?.operatorAddress
                )?.delegatedAmount
              ),
              "caption2 text-white-300",
              "small text-white-300"
            )}
          </p>
        ),
      },
      {
        Header: "Jailed",
        accessor: "jailed",
        Cell: (tableProps) =>
          tableProps?.row?.original?.jailed ? (
            <i className="bi bi-exclamation-octagon text-danger"></i>
          ) : (
            "-"
          ),
      },
    ],
    [totalTokens, delegatedValidators?.length]
  );

  const allActiveDelegatedValidatorsColumns = React.useMemo(
    () => [
      {
        Header: "Rank",
        accessor: "tradePair",
        Cell: ({ row }) => <p> {row.index + 1}</p>,
      },
      {
        Header: "Validator Name",
        accessor: "description.moniker",
        Cell: (tableProps) => (
          <div
            className="d-flex position-relative rounded-circle gap-2"
            style={{ width: "25px", aspectRatio: "1/1" }}
          >
            <img
              layout="fill"
              alt={tableProps?.row?.original?.description?.moniker}
              className="rounded-circle"
              src={`/validatorAvatars/${tableProps?.row?.original?.operatorAddress}.png`}
              onError={handleOnError}
            />
            <a
              href={`https://explorer.assetmantle.one/validators/${tableProps?.row?.original?.operatorAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              {" "}
              {tableProps?.row?.original?.description?.moniker}
              <i className="bi bi-arrow-up-right" />
            </a>
          </div>
        ),
      },
      {
        Header: "Voting Power",
        accessor: "votingPower",
        Cell: (tableProps) => (
          <p>
            {((tableProps?.row?.original?.tokens * 100) / totalTokens).toFixed(
              2
            )}
            %
          </p>
        ),
      },
      {
        Header: "Commissions",
        accessor: "commissions",
        Cell: (tableProps) => (
          <p>
            {shiftDecimalPlaces(
              tableProps?.row?.original?.commission?.commissionRates?.rate,
              -16
            )}
            %
          </p>
        ),
      },
      {
        Header: "Delegated amount",
        accessor: "delegatedAmount",
        Cell: (tableProps) => (
          <p>
            {getBalanceStyle(
              fromChainDenom(
                delegatedValidators?.find(
                  (element) =>
                    element?.operatorAddress ==
                    tableProps?.row?.original?.operatorAddress
                )?.delegatedAmount
              ),
              "caption2 text-white-300",
              "small text-white-300"
            )}
          </p>
        ),
      },
    ],
    [totalTokens, delegatedValidators?.length]
  );
  const allInactiveDelegatedValidatorsColumns = React.useMemo(
    () => [
      {
        Header: "Validator Name",
        accessor: "description.moniker",
        Cell: (tableProps) => (
          <div
            className="d-flex position-relative rounded-circle gap-2"
            style={{ width: "25px", aspectRatio: "1/1" }}
          >
            <img
              layout="fill"
              alt={tableProps?.row?.original?.description?.moniker}
              className="rounded-circle"
              src={`/validatorAvatars/${tableProps?.row?.original?.operatorAddress}.png`}
              onError={handleOnError}
            />
            <a
              href={`https://explorer.assetmantle.one/validators/${tableProps?.row?.original?.operatorAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              {" "}
              {tableProps?.row?.original?.description?.moniker}
              <i className="bi bi-arrow-up-right" />
            </a>
          </div>
        ),
      },
      {
        Header: "Voting Power",
        accessor: "votingPower",
        Cell: (tableProps) => (
          <p>
            {((tableProps?.row?.original?.tokens * 100) / totalTokens).toFixed(
              2
            )}
            %
          </p>
        ),
      },
      {
        Header: "Commissions",
        accessor: "commissions",
        Cell: (tableProps) => (
          <p>
            {shiftDecimalPlaces(
              tableProps?.row?.original?.commission?.commissionRates?.rate,
              -16
            )}
            %
          </p>
        ),
      },
      {
        Header: "Delegated amount",
        accessor: "delegatedAmount",
        Cell: (tableProps) => (
          <p>
            {getBalanceStyle(
              fromChainDenom(
                delegatedValidators?.find(
                  (element) =>
                    element?.operatorAddress ==
                    tableProps?.row?.original?.operatorAddress
                )?.delegatedAmount
              ),
              "caption2 text-white-300",
              "small text-white-300"
            )}
          </p>
        ),
      },
      {
        Header: "Jailed",
        accessor: "jailed",
        Cell: (tableProps) =>
          tableProps?.row?.original?.jailed ? (
            <i className="bi bi-exclamation-octagon text-danger"></i>
          ) : (
            "-"
          ),
      },
    ],
    [totalTokens, delegatedValidators?.length]
  );

  return (
    <div
      className="bg-gray-800 p-3 rounded-4 d-flex flex-column gap-2"
      style={{ height: "90%" }}
    >
      <div className="d-flex align-items-center justify-content-between w-100">
        <div className="card-title body1 text-primary my-auto">Validators</div>
        <div className="btn-group">
          <button
            className={`${
              activeValidators ? "btn btn-primary" : "btn btn-inactive"
            } caption`}
            onClick={() => setActiveValidators(true)}
          >
            Active
          </button>
          <button
            className={`${
              !activeValidators ? "btn btn-primary" : "btn btn-inactive"
            } caption`}
            onClick={() => setActiveValidators(false)}
          >
            Inactive
          </button>
        </div>
      </div>
      <div
        className="d-flex flex-column w-100 nav-bg p-2 rounded-4 flex-grow-1"
        style={{ height: "88%" }}
      >
        <div className="w-100 mt-3 h-100" style={{ overflow: "auto" }}>
          <SelectionTable
            stakeState={stakeState}
            stakeDispatch={stakeDispatch}
            delegated={delegated}
            setDelegated={setDelegated}
            columns={
              !delegated
                ? activeValidators
                  ? allActiveValidatorsColumns
                  : allInactiveValidatorsColumns
                : activeValidators
                ? allActiveDelegatedValidatorsColumns
                : allInactiveDelegatedValidatorsColumns
            }
            data={memoizedTableData}
            setShowClaimError={setShowClaimError}
          />
        </div>
      </div>
    </div>
  );
};

export default StakeTable;
