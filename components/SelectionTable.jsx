import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  getFilteredRowModel,
} from "@tanstack/react-table";

const SelectionTable = ({
  unstyledData,
  globalFilterState,
  toggleCheckboxes,
  columns,
  data,
  delegated,
  setDelegated,
  stakeState,
  stakeDispatch,
}) => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    globalFilterFn: "includesString",
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
  });

  toggleCheckboxes(table.toggleAllRowsSelected);
  globalFilterState(setGlobalFilter, globalFilter);

  return (
    <>
      <table
        style={{ width: table.getCenterTotalSize() }}
        className="table caption2 text-white-300"
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    style={{ width: header.getSize() }}
                    key={header.id}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder ? null : (
                      <>
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : "",
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: <i className="bi bi-caret-up-fill"></i>,
                            desc: <i className="bi bi-caret-down-fill"></i>,
                          }[header.column.getIsSorted()] ?? null}
                        </div>
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              onChange={() => {
                const selectedValidatorObjects = unstyledData?.filter(
                  (item, index) =>
                    Object.keys(rowSelection)?.find((ele) => ele == index)
                );
                console.log(selectedValidatorObjects);
                const selectedValidatorsAddresses =
                  selectedValidatorObjects?.map((item) => {
                    return item?.operatorAddress;
                  });
                stakeDispatch({
                  type: "SET_SELECTED_VALIDATORS",
                  payload: selectedValidatorsAddresses,
                });
              }}
              key={row.id}
            >
              {row.getVisibleCells().map((cell) => (
                <td style={{ width: cell.column.getSize() }} key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default SelectionTable;
