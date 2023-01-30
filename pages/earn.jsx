import React, { useState } from "react";
import Head from "next/head";
import Image from "next/image";

export default function Earn() {
  const [searchValue, setSearchValue] = useState();

  const contentObg = {
    img: "/profile.avif",
    name: "Lorem ipsum",
    href: "?sal",
    catagory: "Liquid Staking",
    chains: ["eth", "cosmos", "polygon"],
    apy: 1.56,
    tvl: 50,
  };

  return (
    <>
      <Head>
        <title>Earn | MantleWallet</title>
      </Head>
      <section className="row h-100">
        <div className="col-12 col-lg-8 h-100">
          <div
            className="bg-gray-800 p-3 pb-5 rounded-4 d-flex flex-column gap-2"
            style={{ height: "90%" }}
          >
            <div className="d-flex align-items-center justify-content-between w-100">
              <h1 className="card-title body1 text-primary my-auto">Earn</h1>
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
                <table
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
                      <th
                        scope="col"
                        style={{ whiteSpace: "nowrap" }}
                        colSpan="2"
                      >
                        Name
                      </th>
                      <th scope="col" style={{ whiteSpace: "nowrap" }}>
                        Category
                      </th>
                      <th scope="col" style={{ whiteSpace: "nowrap" }}>
                        Chains
                      </th>
                      <th scope="col" style={{ whiteSpace: "nowrap" }}>
                        APY
                      </th>
                      <th scope="col" style={{ whiteSpace: "nowrap" }}>
                        TVL
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {React.Children.toArray(
                      [...new Array(20)].map((e) => (
                        <tr className="caption2 text-white-300">
                          <td>
                            <div
                              className="d-flex position-relative rounded-circle gap-1"
                              style={{ width: "32px", aspectRatio: "1/1" }}
                            >
                              <img
                                alt={contentObg.name}
                                className="rounded-circle"
                                layout="fill"
                                src={contentObg.img}
                              />
                            </div>
                          </td>
                          <td>
                            <a
                              className="d-flex gap-1 align-items-center justify-content-center"
                              href={contentObg.href}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {contentObg.name}
                              <i className="bi bi-arrow-up-right"></i>
                            </a>
                          </td>
                          <td>{contentObg.catagory}</td>
                          <td>
                            <div className="d-flex align-items-center justify-content-end gap-1">
                              {React.Children.toArray(
                                contentObg.chains.map((e) => (
                                  <div
                                    className="d-flex position-relative rounded-circle gap-1"
                                    style={{
                                      width: "20px",
                                      aspectRatio: "1/1",
                                    }}
                                  >
                                    <Image
                                      alt={e}
                                      className="rounded-circle"
                                      layout="fill"
                                      src={`/earn/${e}.svg`}
                                    />
                                  </div>
                                ))
                              )}
                            </div>
                          </td>
                          <td>{contentObg.apy}%</td>
                          <td>$ {contentObg.tvl}b</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
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
