import React, { useState } from "react";
import Head from "next/head";
import ScrollableSectionContainer from "../components/ScrollableSectionContainer";
import Image from "next/image";

export default function Farm() {
  const [Connected, setConnected] = useState(true);

  const [Tab, setTab] = useState(0);
  const tabs = [
    { name: "Stake UniV3 LP", href: "#Stake-UniV3-LP" },
    { name: "Unstake UniV3 LP", href: "#Unstake-UniV3-LP" },
  ];

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
        <title>Farm | MantleWallet</title>
      </Head>
      <section className="row h-100">
        <ScrollableSectionContainer className="col-12 col-lg-8 d-flex">
          <div className="bg-gray-800 p-3 rounded-4 d-flex flex-column gap-2">
            <nav className="d-flex align-items-center justify-content-between gap-3">
              <div className="d-flex gap-3 align-items-center">
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    className={`body1 ${
                      Tab === index ? "text-primary" : "text-white"
                    }`}
                    onClick={() => setTab(index)}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </nav>
            {
              {
                0: (
                  <div
                    className="d-flex flex-column w-100 rounded-4 flex-grow-1 pt-2"
                    style={{ height: "90%" }}
                  >
                    <div className="row farm-data-container nav-bg rounded-4 p-3 mx-0">
                      <div className="col-3 d-flex flex-column gap-3">
                        <h4 className="caption text-gray">TVL</h4>
                        <p className="body1">$450</p>
                      </div>
                      <div className="col-3 d-flex flex-column gap-3">
                        <h4 className="caption text-gray">APR</h4>
                        <p className="body1">--</p>
                      </div>
                      <div className="col-6 d-flex flex-column gap-3">
                        <h4 className="caption text-gray">Connect</h4>
                        <button
                          className="btn button-primary text-center w-100 my-auto"
                          style={{ maxWidth: "100%" }}
                          onClick={() => setConnected(!Connected)}
                        >
                          {Connected ? "Connected" : "Connect"}
                        </button>
                      </div>
                    </div>
                  </div>
                ),
                1: (
                  <div
                    className="d-flex flex-column w-100 rounded-4 flex-grow-1 pt-2"
                    style={{ height: "90%" }}
                  >
                    <div className="row farm-data-container nav-bg rounded-4 p-3 mx-0">
                      <div className="col-3 d-flex flex-column gap-3">
                        <h4 className="caption text-gray">TVL</h4>
                        <p className="body1">$450</p>
                      </div>
                      <div className="col-3 d-flex flex-column gap-3">
                        <h4 className="caption text-gray">APR</h4>
                        <p className="body1">--</p>
                      </div>
                      <div className="col-6 d-flex flex-column gap-3">
                        <h4 className="caption text-gray">Connect</h4>
                        <button
                          className="btn button-primary text-center w-100 my-auto"
                          style={{ maxWidth: "100%" }}
                          onClick={() => setConnected(!Connected)}
                        >
                          {Connected ? "Connected" : "Connect"}
                        </button>
                      </div>
                    </div>
                  </div>
                ),
              }[Tab]
            }
          </div>
          <div className="p-1"></div>
          {
            {
              0:
                Connected &&
                React.Children.toArray(
                  [...new Array(13)].map((data) => (
                    <div className="bg-gray-800 p-3 rounded-4 d-flex gap-2 align-items-center justify-content-between">
                      <div className="d-flex gap-3">
                        <div
                          className="position-relative rounded-circle"
                          style={{ width: "40px", aspectRatio: "1/1" }}
                        >
                          <Image
                            layout="fill"
                            src="/chainLogos/mntl.svg"
                            alt="mntl logo"
                          />
                        </div>
                        <div className="d-flex flex-column gap-2">
                          <h3 className="body2">MNTL</h3>
                          <p className="caption">Token info</p>
                        </div>
                      </div>
                      <div className="d-flex gap-2 align-items-center">
                        <button className="button-secondary px-3 py-1">
                          Stake
                        </button>
                      </div>
                    </div>
                  ))
                ),
              1:
                Connected &&
                React.Children.toArray(
                  [...new Array(13)].map((data) => (
                    <div className="bg-gray-800 p-3 rounded-4 d-flex gap-2 align-items-center justify-content-between">
                      <div className="d-flex gap-3">
                        <div
                          className="position-relative rounded-circle"
                          style={{ width: "40px", aspectRatio: "1/1" }}
                        >
                          <Image
                            layout="fill"
                            src="/chainLogos/mntl.svg"
                            alt="mntl logo"
                          />
                        </div>
                        <div className="d-flex flex-column gap-2">
                          <h3 className="body2">MNTL</h3>
                          <p className="caption">Token info</p>
                        </div>
                      </div>
                      <div className="d-flex gap-2 align-items-center">
                        <button className="button-secondary px-3 py-1">
                          Stake
                        </button>
                      </div>
                    </div>
                  ))
                ),
            }[Tab]
          }
          <div className="p-2"></div>
        </ScrollableSectionContainer>
        <div className="col-12 col-lg-4">
          <div className="rounded-4 p-3 my-2 bg-gray-800 width-100 d-flex flex-column ">
            <p>
              Instructional Copy. Lorem Ipsum Dolor Sit ametLorem ipsum dolor
              sit amet, consectetur adipiscing elit. Aliquam pulvinar vitae
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
