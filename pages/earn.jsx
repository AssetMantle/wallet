import React, { useState } from "react";
import Head from "next/head";
import { useQuickswap, useOsmosis } from "../data";

export default function Earn() {
  const [searchValue, setSearchValue] = useState();
  const { allOsmosis, isLoadingOsmosis, errorOsmosis } = useOsmosis();
  const { allQuickswap, isLoadingQuickswap, errorQuickswap } = useQuickswap();
  let earnInfo = [...allQuickswap];
  // const earnInfo = [
  //   {
  //     logo: "/osmosis.png",
  //     name: "Osmosis",
  //     target_coin_id: "osmosis",
  //     pair: "MNTL-OSMO",
  //     subTitle: "",
  //     category: "Liquid Staking",
  //     url: "https://app.osmosis.zone/?from=OSMO&to=MNTL",
  //     target: "_blank",
  //     chains: ["cosmos"],
  //   },
  //   {
  //     logo: "/osmosis.png",
  //     name: "Osmosis",
  //     target_coin_id: "axlusdc",
  //     pair: "MNTL-AXLUSDC",
  //     subTitle: "",
  //     category: "Liquid Staking",
  //     url: "https://app.osmosis.zone/?from=USDC&to=MNTL",
  //     target: "_blank",
  //     chains: ["cosmos"],
  //   },
  //   {
  //     logo: "/osmosis.png",
  //     name: "Osmosis",
  //     target_coin_id: "assetmantle",
  //     pair: "ATOM-MNTL",
  //     subTitle: "",
  //     category: "Liquid Staking",
  //     url: "https://app.osmosis.zone/?from=ATOM&to=MNTL",
  //     target: "_blank",
  //     chains: ["cosmos"],
  //   },
  //   {
  //     logo: "/Uniswap.png",
  //     name: "Uniswap",
  //     pair: "MNTL-ERC20",
  //     subTitle: "(ETH Pool)",
  //     url: "https://app.uniswap.org/#/swap?theme=dark&inputCurrency=ETH&outputCurrency=0x2c4f1df9c7de0c59778936c9b145ff56813f3295",
  //     target: "_blank",
  //     chains: ["eth"],
  //     row: 4,
  //     col: 5,
  //   },
  //   {
  //     logo: "/quickswap.webp",
  //     name: "Quickswap",
  //     pait: "MNTL-USDC",
  //     target_coin_id: "usd-coin",
  //     subTitle: "",
  //     category: "Liquid Staking",
  //     url: "https://quickswap.exchange/#/swap?swapIndex=0&currency0=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174&currency1=0x38A536A31bA4d8C1Bcca016AbBf786ecD25877E8",
  //     target: "_blank",
  //     chains: ["polygon"],
  //   },
  //   {
  //     logo: "/quickswap.webp",
  //     name: "Quickswap",
  //     pair: "MNTL-VERSA",
  //     target_coin_id: "versagames",
  //     subTitle: "",
  //     category: "Liquid Staking",
  //     url: "https://quickswap.exchange/#/swap?inputCurrency=0x8497842420cfdbc97896c2353d75d89fc8d5be5d&outputCurrency=0x38a536a31ba4d8c1bcca016abbf786ecd25877e8&swapIndex=0",
  //     target: "_blank",
  //     chains: ["polygon"],
  //   },
  //   // {
  //   //   logo: "/osmosis.png",
  //   //   name: "P2B",
  //   //   pair: "MNTL/USDT",

  //   //   subTitle: "(USDC Pool)",
  //   //   url: "https://p2pb2b.com/trade/MNTL_USDT/",
  //   //   target: "_blank", chains:[],
  //   //   row: 1,
  //   //   col: 3,
  //   // },
  //   // {
  //   //   logo: "/osmosis.png",
  //   //   name: "Coinsbit",
  //   //   pair: "MNTL/USDT",

  //   //   subTitle: "(USDC Pool)",
  //   //   url: "https://coinsbit.io/trade/MNTL_USDT",
  //   //   target: "_blank", chains:[],
  //   //   row: 1,
  //   //   col: 3,
  //   // },
  // ];

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
              <div className="w-100 h-100" style={{ overflow: "auto" }}>
                {/* <EarnTable data={earnInfo} />{" "} */}
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
