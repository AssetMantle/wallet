import Head from "next/head";
import React from "react";
import EarnTable from "../components/EarnTable";

export default function Earn() {
  return (
    <>
      <Head>
        <title>Earn | MantleWallet</title>
      </Head>
      <section className="row h-100">
        <div className="col-8 h-100">
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
                <EarnTable />
              </div>
            </div>
          </div>
        </div>
        <div className="col-4">
          <div className="rounded-4 p-3 my-2 bg-gray-800 width-100 d-flex flex-column text-white">
            <p>To earn yields, visit the listed DEXs to add $MNTL liquidity.</p>
            <br></br>
            <p>
              Some listed entries might have additional reward tokens available
              as incentive.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
