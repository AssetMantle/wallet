import React from "react";

import Table from "./Table";

// function GlobalFilter({
//   preGlobalFilteredRows,
//   globalFilter,
//   setGlobalFilter,
// }) {
//   const count = preGlobalFilteredRows.length;
//   const [value, setValue] = React.useState(globalFilter);
//   const onChange = useAsyncDebounce((value) => {
//     setGlobalFilter(value || undefined);
//   }, 200);

//   return (
//     <div className="d-flex align-items-center gap-3 w-100 p-2">
//       <div
//         className="d-flex gap-2 am-input border-color-white rounded-3 py-1 px-3 align-items-center"
//         style={{ flex: "1" }}
//       >
//         <span
//           className="input-group-text bg-t p-0 h-100"
//           id="basic-addon1"
//           style={{ border: "none" }}
//         >
//           {" "}
//           <i className="bi bi-search text-white"></i>
//         </span>
//         <input
//           className="w-100 bg-t "
//           value={value || ""}
//           onChange={(e) => {
//             setValue(e.target.value);
//             onChange(e.target.value);
//           }}
//         />
//       </div>
//     </div>
//   );
// }

const TradeTable = ({ data }) => {
  const columns = [
    {
      Header: "Market Name",
      accessor: "marketName",
      Cell: (tableProps) => (
        <div className="d-flex align-items-center justify-content-around">
          <img src={tableProps.row.original.logo} width={20} alt="logo" />
          <a
            href={tableProps.row.original.url}
            target="_blank"
            width={20}
            rel="noreferrer"
          >
            {tableProps.row.original.exchangeName}
          </a>{" "}
          <i className="bi bi-arrow-up-right"></i>
        </div>
      ),
    },
    { Header: "Trade Pair", accessor: "tradePair" },
    { Header: "Price", accessor: "price" },
    { Header: "Volume", accessor: "volume" },
  ];
  // const {
  //   getTableProps,
  //   getTableBodyProps,
  //   headerGroups,
  //   rows,
  //   prepareRow,
  //   state,
  //   preGlobalFilteredRows,
  //   setGlobalFilter,
  // } = useTable(
  //   {
  //     columns,
  //     data,
  //   },
  //   useGlobalFilter,
  //   useSortBy
  // );

  return (
    <>
      <Table columns={columns} data={data} />
    </>
  );
};

export default TradeTable;
