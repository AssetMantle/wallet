import React, { useState } from "react";
import Head from "next/head";
import { useTrade } from "../data";
import Table from "../components/Table";

export default function Trade() {
  const [searchValue, setSearchValue] = useState("");
  const { allTrades, isLoadingTrades, errorTrades } = useTrade();
  const columns = [
    {
      Header: "",
      accessor: "logo",
      Cell: (tableProps) => (
        <img src={tableProps.row.original.logo} width={20} alt="logo" />
      ),
    },
    {
      Header: "Exchange Name",
      accessor: "exchangeName",
      Cell: (tableProps) => (
        <>
          <a
            href={tableProps.row.original.url}
            target="_blank"
            width={20}
            rel="noreferrer"
          >
            {tableProps.row.original.exchangeName}
          </a>{" "}
          <i className="bi bi-arrow-up-right"></i>
        </>
      ),
    },
    { Header: "Trade Pair", accessor: "tradePair" },
    { Header: "Price", accessor: "price" },
    { Header: "Volume", accessor: "volume" },
  ];

  return (
    <>
      <Head>
        <title>Trade | MantleWallet</title>
      </Head>
      <section className="row h-100">
        <div className="col-12 col-lg-8 h-100">
          <div
            className="bg-gray-800 p-3 pb-5 rounded-4 d-flex flex-column gap-2"
            style={{ height: "90%" }}
          >
            <div className="d-flex align-items-center justify-content-between w-100">
              <h1 className="card-title body1 text-primary my-auto">
                Exchanges
              </h1>
            </div>
            <div
              className="d-flex flex-column w-100 nav-bg p-2 rounded-4 flex-grow-1"
              style={{ height: "90%" }}
            >
              <div className="d-flex align-items-center gap-3 w-100 p-2">
                <div
                  className="d-flex gap-2 am-input border-color-white rounded-3 py-1 px-3 align-items-center"
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
                    type="text"
                    className="am-input bg-t p-1 w-100 h-100"
                    placeholder="Search"
                    aria-label="Search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{ border: "none" }}
                  />
                </div>
              </div>
              <div className="w-100 h-100" style={{ overflow: "auto" }}>
                <Table columns={columns} data={allTrades} />
                {/* <table
                  className="table"
                  style={{ width: "max-content", minWidth: "100%" }}
                >
                  <thead
                    className="position-sticky top-0 nav-bg"
                    style={{
                      zIndex: "200",
                    }}
                  >
                    <tr className="caption2 text-white">
                      <th scope="col" style={{ whiteSpace: "nowrap" }}>
                        Exchange Name
                      </th>
                      <th scope="col" style={{ whiteSpace: "nowrap" }}>
                        Trade Pair
                      </th>
                      <th scope="col" style={{ whiteSpace: "nowrap" }}>
                        Price
                      </th>
                      <th scope="col" style={{ whiteSpace: "nowrap" }}>
                        Volume <small className="text-gray">(24Hour)</small>
                      </th>
                    </tr>
                  </thead>
                  <tbody> */}
                {/* {filteredData
                      ?.filter((item) =>
                        item?.name
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                      )
                      ?.map((item, index) => (
                        <tr key={index} className="caption2 text-white-300">
                          <td>
                            <div className="d-flex justify-content-start ps-3 gap-2">
                              <div
                                className="d-flex position-relative rounded-circle gap-1"
                                style={{ width: "32px", aspectRatio: "1/1" }}
                              >
                                <img
                                  alt={item.name}
                                  className="rounded-circle"
                                  layout="fill"
                                  src={item.logo}
                                />
                              </div>
                              <a
                                className="d-flex gap-1 align-items-center justify-content-start"
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {item.name}
                                <i className="bi bi-arrow-up-right"></i>
                              </a>
                            </div>
                          </td>
                          <td>{item.pair}</td>
                          <td>${item?.price}</td>
                          <td>${item?.volume}</td>
                        </tr>
                      ))} */}
                {/* </tbody> */}
                {/* </table> */}
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="rounded-4 p-3 my-2 bg-gray-800 width-100 d-flex flex-column ">
            <p>
              Instructional Copy. Lorem Ipsum Dolor Sit ametLorem ipsum dolor
              sit amet, consectetur adipiscing elit. Aliquam pulvinar vitae
              massa in egestas. Vivamus tincidunt leo nulla.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
