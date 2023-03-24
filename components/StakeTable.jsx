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
  const { allValidatorsBonded } = useAllValidatorsBonded();
  const { allValidatorsUnbonded } = useAllValidatorsUnbonded();
  const { delegatedValidators } = useDelegatedValidators();

  const [activeValidators, setActiveValidators] = useState(true);
  const [value, setValue] = useState("");

  const tableUnstyledData = activeValidators
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

  const tableData = tableUnstyledData?.map?.((item) => ({
    ...item,
    description: {
      ...item?.description,
      moniker: item?.description?.moniker.toString().trim(),
    },
  }));

  const memoizedTableData = React.useMemo(() => tableData, [tableData?.length]);

  const getSelectedRows = (selectedRows) => {
    const selectedValidatorObjects = tableUnstyledData?.filter((item, index) =>
      selectedRows?.find((ele) => ele == index)
    );
    const selectedValidatorsAddresses = selectedValidatorObjects?.map(
      (item) => {
        return item?.operatorAddress;
      }
    );
    stakeDispatch({
      type: "SET_SELECTED_VALIDATORS",
      payload: selectedValidatorsAddresses,
    });
  };

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

  //imported function from SelectionTable for toggling all selected checkboxes when switching Active/Inactive State
  let toggleCheckboxesFn;

  const toggleCheckboxes = (callback) => {
    toggleCheckboxesFn = callback;
  };

  let setGlobalFilter;

  const globalFilterState = (callback, value) => {
    setGlobalFilter = callback;
    setValue(value);
  };

  const IndeterminateCheckbox = ({
    indeterminate,
    className = "",
    ...rest
  }) => {
    const ref = React.useRef();

    React.useEffect(() => {
      if (typeof indeterminate === "boolean") {
        ref.current.indeterminate = !rest.checked && indeterminate;
      }
    }, [ref, indeterminate]);

    return (
      <input
        type="checkbox"
        ref={ref}
        className={className + " cursor-pointer"}
        {...rest}
      />
    );
  };

  const allActiveValidatorsColumns = useMemo(
    () => [
      {
        id: "select",
        size: 5,
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      {
        id: "index",
        size: 5,
        cell: (info) => (
          <div className="d-flex text-start justify-content-end">
            {info.row.index < 9 ? (
              <p className="me-1">
                <Tooltip
                  titlePrimary={"text-warning"}
                  title={<i className="bi bi-patch-exclamation-fill"></i>}
                  description="It is preferable to not stake to the top 10 validators"
                  style={{
                    transform: "translateX(83%) translateY(-1%)",
                  }}
                />
              </p>
            ) : null}
            <p className="me-1">{info.row.index + 1}</p>{" "}
          </div>
        ),
        header: () => <span>Rank</span>,
        //      footer: (props) => props.column.id,
      },
      columnHelper.accessor((row) => row.description.moniker, {
        id: "description.moniker",
        cell: (props) => (
          <div className="d-flex gap-3">
            <div
              className="d-flex position-relative rounded-circle d-flex"
              style={{ width: "25px", aspectRatio: "1/1" }}
            >
              <img
                layout="fill"
                alt={props?.row?.original?.description?.moniker}
                className="rounded-circle"
                src={`/validatorAvatars/${props?.row?.original?.operatorAddress}.png`}
                onError={handleOnError}
              />
            </div>
            <a
              className="text-truncate"
              style={{ maxWidth: "200px" }}
              href={`https://explorer.assetmantle.one/validators/${props?.row?.original?.operatorAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              {props?.row?.original?.description?.moniker}{" "}
              <i className="bi bi-arrow-up-right" />
            </a>
          </div>
        ),
        header: () => <span>Validator Name</span>,
        //      footer: (props) => props.column.id,
        sortingFn: "text",
      }),
      columnHelper.accessor(
        (row) => {
          let votingPower;
          if (!BigNumber(totalTokens || 0).isZero()) {
            votingPower = BigNumber(row?.tokens)
              .multipliedBy(100)
              .dividedBy(BigNumber(totalTokens))
              .toFixed(2)
              .toString();
          } else {
            votingPower = "0";
          }
          console.log("vp:", votingPower);
          return votingPower;
        },
        {
          id: "tokens",
          cell: (props) => (
            <p>
              {!BigNumber(totalTokens || 0).isZero()
                ? decimalize(
                    BigNumber(props?.row?.original?.tokens)
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
          //      footer: (props) => props.column.id,
        }
      ),
      columnHelper.accessor((row) => row.commission.commissionRates.rate, {
        id: "commission.commissionRates.rate",
        cell: (props) => (
          <p>
            {shiftDecimalPlaces(
              props?.row?.original?.commission?.commissionRates?.rate,
              -16
            )}
            %
          </p>
        ),
        header: () => <span>Commission</span>,
        //      footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.tokens, {
        id: "delegations",
        size: 5,
        cell: (props) => (
          <p>
            {getBalanceStyle(
              fromChainDenom(props?.row?.original?.tokens, 2),
              "caption2 text-white-300",
              "small text-white-300"
            )}
          </p>
        ),
        header: () => <span>Delegations</span>,
        //      footer: (props) => props.column.id,
      }),
      columnHelper.accessor(
        (row) => {
          let delegatedAmount;
          if (
            delegatedValidators?.find(
              (element) => element?.operatorAddress == row?.operatorAddress
            )
          ) {
            delegatedAmount = fromChainDenom(
              delegatedValidators?.find(
                (element) => element?.operatorAddress == row?.operatorAddress
              )?.delegatedAmount
            );
          }
          return delegatedAmount;
        },
        {
          id: "operatorAddress",
          cell: (props) => (
            <p>
              {delegatedValidators?.find(
                (element) =>
                  element?.operatorAddress ==
                  props?.row?.original?.operatorAddress
              )
                ? getBalanceStyle(
                    fromChainDenom(
                      delegatedValidators?.find(
                        (element) =>
                          element?.operatorAddress ==
                          props?.row?.original?.operatorAddress
                      )?.delegatedAmount
                    ),
                    "caption2 text-white-300",
                    "small text-white-300"
                  )
                : "-"}
            </p>
          ),
          header: () => <span>Delegated Amount</span>,
          //      footer: (props) => props.column.id,
        }
      ),
    ],
    [totalTokens, delegatedValidators?.length]
  );
  const allInactiveValidatorsColumns = React.useMemo(
    () => [
      {
        id: "select",
        // size: 5,
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      columnHelper.accessor((row) => row.description.moniker, {
        id: "description.moniker",
        size: 1,
        cell: (props) => (
          <div className="d-flex">
            <div
              className="d-flex position-relative rounded-circle d-flex"
              style={{ width: "25px", aspectRatio: "1/1" }}
            >
              <img
                layout="fill"
                alt={props?.row?.original?.description?.moniker}
                className="rounded-circle"
                src={`/validatorAvatars/${props?.row?.original?.operatorAddress}.png`}
                onError={handleOnError}
              />
            </div>
            <a
              className="text-truncate ms-2"
              style={{ maxWidth: "200px" }}
              href={`https://explorer.assetmantle.one/validators/${props?.row?.original?.operatorAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              {props?.row?.original?.description?.moniker}{" "}
              <i className="bi bi-arrow-up-right" />
            </a>
          </div>
        ),
        header: () => <span>Validator Name</span>,
        //      footer: (props) => props.column.id,
        sortingFn: "text",
      }),
      columnHelper.accessor((row) => row.tokens, {
        id: "tokens",
        size: 5,
        cell: (props) => (
          <p>
            {!BigNumber(totalTokens || 0).isZero()
              ? decimalize(
                  BigNumber(props?.row?.original?.tokens)
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
        //      footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.commission.commissionRates.rate, {
        id: "commission.commissionRates.rate",
        // size: 5,
        cell: (props) => (
          <p>
            {shiftDecimalPlaces(
              props?.row?.original?.commission?.commissionRates?.rate,
              -16
            )}
            %
          </p>
        ),
        header: () => <span>Commission</span>,
        //      footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.tokens, {
        id: "delegations",
        // size: 5,
        cell: (props) => (
          <p>
            {getBalanceStyle(
              fromChainDenom(props?.row?.original?.tokens, 2),
              "caption2 text-white-300",
              "small text-white-300"
            )}
          </p>
        ),
        header: () => <span>Delegations</span>,
        //      footer: (props) => props.column.id,
      }),
      columnHelper.accessor(
        (row) => {
          let delegatedAmount;
          if (
            delegatedValidators?.find(
              (element) => element?.operatorAddress == row?.operatorAddress
            )
          ) {
            delegatedAmount = fromChainDenom(
              delegatedValidators?.find(
                (element) => element?.operatorAddress == row?.operatorAddress
              )?.delegatedAmount
            );
          }
          return delegatedAmount;
        },
        {
          id: "operatorAddress",
          // size: 5,
          cell: (props) => (
            <p>
              {delegatedValidators?.find(
                (element) =>
                  element?.operatorAddress ==
                  props?.row?.original?.operatorAddress
              )
                ? getBalanceStyle(
                    fromChainDenom(
                      delegatedValidators?.find(
                        (element) =>
                          element?.operatorAddress ==
                          props?.row?.original?.operatorAddress
                      )?.delegatedAmount
                    ),
                    "caption2 text-white-300",
                    "small text-white-300"
                  )
                : "-"}
            </p>
          ),
          header: () => <span>Delegated Amount</span>,
          //      footer: (props) => props.column.id,
        }
      ),
      columnHelper.accessor((row) => row.jailed, {
        id: "jailed",
        // size: 5,
        cell: (props) =>
          props?.row?.original?.jailed ? (
            <i className="bi bi-exclamation-octagon text-danger"></i>
          ) : (
            "-"
          ),
      }),
    ],
    [totalTokens, delegatedValidators?.length]
  );

  const allActiveDelegatedValidatorsColumns = React.useMemo(
    () => [
      {
        id: "select",
        size: 100,
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      columnHelper.accessor((row) => row, {
        id: "index",
        size: 60,
        cell: (info) => <p>{info.row.index + 1}</p>,
        header: () => <span>Rank</span>,
        //      footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.description.moniker, {
        id: "description.moniker",
        cell: (props) => (
          <div className="d-flex">
            <div
              className="d-flex position-relative rounded-circle d-flex"
              style={{ width: "25px", aspectRatio: "1/1" }}
            >
              <img
                layout="fill"
                alt={props?.row?.original?.description?.moniker}
                className="rounded-circle"
                src={`/validatorAvatars/${props?.row?.original?.operatorAddress}.png`}
                onError={handleOnError}
              />
            </div>
            <a
              className="text-truncate"
              style={{ maxWidth: "200px" }}
              href={`https://explorer.assetmantle.one/validators/${props?.row?.original?.operatorAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              {props?.row?.original?.description?.moniker}{" "}
              <i className="bi bi-arrow-up-right" />
            </a>
          </div>
        ),
        header: () => <span>Validator Name</span>,
        //      footer: (props) => props.column.id,
        sortingFn: "text",
      }),
      columnHelper.accessor((row) => row.tokens, {
        id: "tokens",
        size: 5,
        cell: (props) => (
          <p>
            {!BigNumber(totalTokens || 0).isZero()
              ? decimalize(
                  BigNumber(props?.row?.original?.tokens)
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
        //      footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.commission.commissionRates.rate, {
        id: "commission.commissionRates.rate",
        cell: (props) => (
          <p>
            {shiftDecimalPlaces(
              props?.row?.original?.commission?.commissionRates?.rate,
              -16
            )}
            %
          </p>
        ),
        header: () => <span>Commission</span>,
        //      footer: (props) => props.column.id,
      }),
      columnHelper.accessor(
        (row) => {
          let delegatedAmount;
          if (
            delegatedValidators?.find(
              (element) => element?.operatorAddress == row?.operatorAddress
            )
          ) {
            delegatedAmount = fromChainDenom(
              delegatedValidators?.find(
                (element) => element?.operatorAddress == row?.operatorAddress
              )?.delegatedAmount
            );
          }
          return delegatedAmount;
        },
        {
          id: "operatorAddress",
          cell: (props) => (
            <p>
              {delegatedValidators?.find(
                (element) =>
                  element?.operatorAddress ==
                  props?.row?.original?.operatorAddress
              )
                ? getBalanceStyle(
                    fromChainDenom(
                      delegatedValidators?.find(
                        (element) =>
                          element?.operatorAddress ==
                          props?.row?.original?.operatorAddress
                      )?.delegatedAmount
                    ),
                    "caption2 text-white-300",
                    "small text-white-300"
                  )
                : "-"}
            </p>
          ),
          header: () => <span>Delegated Amount</span>,
          //      footer: (props) => props.column.id,
        }
      ),
    ],
    [totalTokens, delegatedValidators?.length]
  );
  const allInactiveDelegatedValidatorsColumns = React.useMemo(
    () => [
      {
        id: "select",
        size: 3,
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
      columnHelper.accessor((row) => row.description.moniker, {
        id: "description.moniker",
        size: 2,
        cell: (props) => (
          <div className="d-flex">
            <div
              className="d-flex position-relative rounded-circle d-flex"
              style={{ width: "25px", aspectRatio: "1/1" }}
            >
              <img
                layout="fill"
                alt={props?.row?.original?.description?.moniker}
                className="rounded-circle"
                src={`/validatorAvatars/${props?.row?.original?.operatorAddress}.png`}
                onError={handleOnError}
              />
            </div>
            <a
              className="text-truncate"
              style={{ maxWidth: "200px" }}
              href={`https://explorer.assetmantle.one/validators/${props?.row?.original?.operatorAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              {props?.row?.original?.description?.moniker}{" "}
              <i className="bi bi-arrow-up-right" />
            </a>
          </div>
        ),
        header: () => <span>Validator Name</span>,
        //      footer: (props) => props.column.id,
        sortingFn: "text",
      }),
      columnHelper.accessor((row) => row.tokens, {
        id: "tokens",
        //size: 30,
        cell: (props) => (
          <p>
            {!BigNumber(totalTokens || 0).isZero()
              ? decimalize(
                  BigNumber(props?.row?.original?.tokens)
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
        //      footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.commission.commissionRates.rate, {
        id: "commission.commissionRates.rate",
        // size: 20,
        cell: (props) => (
          <p>
            {shiftDecimalPlaces(
              props?.row?.original?.commission?.commissionRates?.rate,
              -16
            )}
            %
          </p>
        ),
        header: () => (
          <span style={{ width: "100px" }} className="w-100">
            Commission
          </span>
        ),
        //      footer: (props) => props.column.id,
      }),
      columnHelper.accessor(
        (row) => {
          let delegatedAmount;
          if (
            delegatedValidators?.find(
              (element) => element?.operatorAddress == row?.operatorAddress
            )
          ) {
            delegatedAmount = fromChainDenom(
              delegatedValidators?.find(
                (element) => element?.operatorAddress == row?.operatorAddress
              )?.delegatedAmount
            );
          }
          return delegatedAmount;
        },
        {
          id: "operatorAddress",
          // size: 15,
          cell: (props) => (
            <p>
              {delegatedValidators?.find(
                (element) =>
                  element?.operatorAddress ==
                  props?.row?.original?.operatorAddress
              )
                ? getBalanceStyle(
                    fromChainDenom(
                      delegatedValidators?.find(
                        (element) =>
                          element?.operatorAddress ==
                          props?.row?.original?.operatorAddress
                      )?.delegatedAmount
                    ),
                    "caption2 text-white-300",
                    "small text-white-300"
                  )
                : "-"}
            </p>
          ),
          header: () => <span>Delegated Amount</span>,
          //      footer: (props) => props.column.id,
        }
      ),
      columnHelper.accessor((row) => row.jailed, {
        id: "jailed",
        //size: 30,
        cell: (props) =>
          props?.row?.original?.jailed ? (
            <i className="bi bi-exclamation-octagon text-danger"></i>
          ) : (
            "-"
          ),
      }),
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
            onClick={() => {
              setActiveValidators(true);
              toggleCheckboxesFn(false);
            }}
          >
            Active
          </button>
          <button
            className={`${
              !activeValidators ? "btn btn-primary" : "btn btn-inactive"
            } caption`}
            onClick={() => {
              setActiveValidators(false);
              toggleCheckboxesFn(false);
            }}
          >
            Inactive
          </button>
        </div>
      </div>
      <div
        className="d-flex flex-column w-100 nav-bg p-2 rounded-4 flex-grow-1"
        style={{ height: "88%" }}
      >
        <div className="d-flex">
          <div
            className="bg-t p-1 w-100 d-flex gap-2 am-input border-color-white rounded-3 py-1 px-3 align-items-center"
            style={{ flex: "1" }}
          >
            <span
              className="input-group-text bg-t p-0 h-100"
              id="basic-addon1"
              style={{ border: "none" }}
            >
              <i className="bi bi-search text-white"></i>
            </span>
            <input
              type="search"
              className="am-input bg-t p-1 w-100 h-100"
              placeholder="Search"
              aria-label="Search"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setGlobalFilter(String(e.target.value));
              }}
              style={{ border: "none" }}
            />
          </div>
          <div
            className="d-flex gap-2 align-items-center text-white ms-2"
            onClick={() => {
              toggleCheckboxesFn(false);
              setDelegated((prev) => !prev);
              stakeDispatch({ type: "EMPTY_SELECTED_VALIDATORS" });
            }}
          >
            Delegated
            <Tooltip description="Showcase a list of all validators that you have ever delegated tokens with." />
            <button
              className={`d-flex rounded-4 align-items-center transitionAll ${
                delegated
                  ? "bg-yellow-100 justify-content-end"
                  : "bg-theme-white justify-content-start"
              }`}
              style={{ width: "40px", padding: "2px" }}
            >
              <div className="p-2 rounded-4 bg-dark-200"></div>
            </button>
          </div>
        </div>{" "}
        <div className="w-100 mt-3 h-100" style={{ overflow: "auto" }}>
          <SelectionTable
            globalFilterState={globalFilterState}
            getSelectedRows={getSelectedRows}
            toggleCheckboxes={toggleCheckboxes}
            stakeState={stakeState}
            stakeDispatch={stakeDispatch}
            unstyledData={tableUnstyledData}
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
