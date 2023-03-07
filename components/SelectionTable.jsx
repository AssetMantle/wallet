import React, { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const SelectionTable = ({
  columns,
  data,
  delegated,
  setDelegated,
  stakeState,
  stakeDispatch,
}) => {
  const { sorting, setSorting } = useState([]);
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },

    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // const setSelectedValidators = (selectedFlatRows) => {
  //   const selectedValidators = selectedFlatRows.map(
  //     (item) => item?.original?.operatorAddress
  //   );
  //   stakeDispatch({
  //     type: "SET_SELECTED_VALIDATORS",
  //     payload: selectedValidators,
  //   });
  // };

  // const memoizedSelectedValidators = useMemo(
  //   () => setSelectedValidators(selectedFlatRows),
  //   [selectedFlatRows?.length]
  // );

  // console.log(selectedFlatRows);

  return (
    <table className="table caption2 text-white-300">
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id} colSpan={header.colSpan}>
                {header.isPlaceholder ? null : (
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
                    {/* {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }} */}
                  </div>
                )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SelectionTable;
