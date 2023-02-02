import React, { useState } from "react";
import Head from "next/head";
import ScrollableSectionContainer from "../components/ScrollableSectionContainer";
import Image from "next/image";

export default function Farm() {
  const [Connected, setConnected] = useState(true);

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
            <div className="d-flex align-items-center justify-content-between w-100">
              <h1 className="card-title body1 text-primary my-auto">Title</h1>
            </div>
            <div
              className="d-flex flex-column w-100 p-2 rounded-4 flex-grow-1"
              style={{ height: "90%" }}
            >
              <div className="row farm-data-container">
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
          </div>
          <div className="p-1"></div>
          {Connected &&
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
            )}
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
