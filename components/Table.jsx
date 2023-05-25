import React from "react";
import { Stack } from "react-bootstrap";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  useAsyncDebounce,
} from "react-table";

function GlobalFilter({ globalFilter, setGlobalFilter }) {
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="align-items-center w-100 p-2"
    >
      <Stack
        gap={2}
        direction="horizontal"
        className="border border-white rounded-3 py-1 px-3 align-items-center flex-grow-1"
      >
        <span
          className="input-group-text p-0 h-100 bg-transparent"
          id="basic-addon1"
          style={{ border: "none" }}
        >
          {" "}
          <i className="bi bi-search text-white"></i>
        </span>
        <input
          style={{ outline: "none" }}
          type="search"
          className="bg-transparent border border-0 p-1 w-100 h-100"
          placeholder="Search"
          value={value || ""}
          onChange={(e) => {
            setValue(e.target.value);
            onChange(e.target.value);
          }}
        />
      </Stack>
    </Stack>
  );
}

export default function Table({ columns, data }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy
  );

  return (
    <>
      <GlobalFilter
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <table className="table caption2 text-white-300" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, index) => (
            <tr key={index} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, i) => (
                // Add the sorting props to control sorting. For this example
                // we can add them into the header props
                <th
                  key={i}
                  className="text-white text-nowrap"
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render("Header")}
                  {/* Add a sort direction indicator */}
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <i className="bi bi-caret-down-fill"></i>
                    ) : (
                      <i className="bi bi-caret-up-fill"></i>
                    )
                  ) : (
                    ""
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr key={i} {...row.getRowProps()}>
                {row.cells.map((cell, index) => {
                  return (
                    <td
                      key={index}
                      {...cell.getCellProps()}
                      className="text-nowrap"
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
