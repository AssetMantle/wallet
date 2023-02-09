import React, { useState } from "react";
import Head from "next/head";
import { useTrade } from "../data";

export default function Trade() {
  const [searchValue, setSearchValue] = useState("");
  const { allTrades, isLoadingTrades, errorTrades } = useTrade();
  console.log(allTrades?.tickers);
  const tradeInfo = [
    {
      logo: "/osmosis.png",
      name: "Osmosis",
      target_coin_id: "osmosis",
      pair: "MNTL/OSMO",
      subTitle: "",
      url: "https://app.osmosis.zone/?from=OSMO&to=MNTL",
      target: "_blank",
      row: 2,
      col: 1,
    },
    {
      logo: "/osmosis.png",
      name: "Osmosis",
      target_coin_id: "axlusdc",
      pair: "MNTL/AXLUSDC",
      subTitle: "",
      url: "https://app.osmosis.zone/?from=USDC&to=MNTL",
      target: "_blank",
      row: 2,
      col: 1,
    },
    {
      logo: "/osmosis.png",
      name: "Osmosis",
      target_coin_id: "assetmantle",
      pair: "ATOM/MNTL",
      subTitle: "",
      url: "https://app.osmosis.zone/?from=ATOM&to=MNTL",
      target: "_blank",
      row: 2,
      col: 1,
    },
    {
      logo: "/Uniswap.png",
      name: "Uniswap",
      pair: "MNTL/ERC20",

      subTitle: "(ETH Pool)",
      url: "https://app.uniswap.org/#/swap?theme=dark&inputCurrency=ETH&outputCurrency=0x2c4f1df9c7de0c59778936c9b145ff56813f3295",
      target: "_blank",
      row: 4,
      col: 5,
    },
    {
      logo: "/quickswap.webp",
      name: "Quickswap",
      pair: "MNTL/USDC",
      target_coin_id: "usd-coin",
      subTitle: "",
      url: "https://quickswap.exchange/#/swap?swapIndex=0&currency0=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174&currency1=0x38A536A31bA4d8C1Bcca016AbBf786ecD25877E8",
      target: "_blank",
      row: 2,
      col: 1,
    },
    {
      logo: "/LBank.webp",
      name: "LBank",
      pair: "MNTL/USDT",
      target_coin_id: "tether",
      subTitle: "",
      url: "https://www.lbank.info/exchange/mntl/usdt",
      target: "_blank",
      row: 2,
      col: 1,
    },
    {
      logo: "/MEXC.webp",
      name: "MEXC Global",
      pair: "MNTL/USDT",
      target_coin_id: "tether",
      subTitle: "",
      url: "https://www.mexc.com/exchange/MNTL_USDT?inviteCode=1498J",
      target: "_blank",
      row: 2,
      col: 1,
    },
    {
      logo: "/quickswap.webp",
      name: "Quickswap",
      pair: "MNTL/VERSA",
      target_coin_id: "versagames",
      subTitle: "",
      url: "https://quickswap.exchange/#/swap?inputCurrency=0x8497842420cfdbc97896c2353d75d89fc8d5be5d&outputCurrency=0x38a536a31ba4d8c1bcca016abbf786ecd25877e8&swapIndex=0",
      target: "_blank",
      row: 2,
      col: 1,
    },
    // {
    //   logo: "/osmosis.png",
    //   name: "P2B",
    //   pair: "MNTL/USDT",

    //   subTitle: "(USDC Pool)",
    //   url: "https://p2pb2b.com/trade/MNTL_USDT/",
    //   target: "_blank",
    //   row: 1,
    //   col: 3,
    // },
    // {
    //   logo: "/osmosis.png",
    //   name: "Coinsbit",
    //   pair: "MNTL/USDT",

    //   subTitle: "(USDC Pool)",
    //   url: "https://coinsbit.io/trade/MNTL_USDT",
    //   target: "_blank",
    //   row: 1,
    //   col: 3,
    // },
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
                  <tbody>
                    {tradeInfo
                      ?.filter(
                        (item) =>
                          item?.name
                            .toLowerCase()
                            .includes(searchValue.toLowerCase()) &&
                          allTrades?.tickers?.find(
                            (element) =>
                              element?.market?.name == item?.name &&
                              element?.target_coin_id == item?.target_coin_id
                          )
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
                          <td>
                            $
                            {
                              allTrades?.tickers?.find(
                                (ele) =>
                                  ele?.market?.name == item.name &&
                                  ele?.target_coin_id == item?.target_coin_id
                              )?.converted_last?.usd
                            }
                          </td>
                          <td>
                            $
                            {
                              allTrades?.tickers?.find(
                                (ele) =>
                                  ele?.market?.name == item.name &&
                                  ele?.target_coin_id == item?.target_coin_id
                              )?.converted_volume?.usd
                            }
                          </td>
                        </tr>
                      ))}
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
