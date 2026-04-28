import Head from "next/head";
import React from "react";
import Pool690IncentiveProgram from "../components/Pool690IncentiveProgram";

export default function Earn() {
  return (
    <>
      <Head>
        <title>Earn | MantleWallet</title>
      </Head>
      <section
        className="d-flex flex-column gap-3 h-100"
        style={{ overflowY: "auto" }}
      >
        <h1 className="visually-hidden">Earn</h1>
        <Pool690IncentiveProgram />
        <div className="bg-gray-800 p-3 rounded-4 d-flex flex-column gap-2">
          <h2 className="card-title body1 text-primary m-0">Other venues</h2>
          <p className="caption text-gray m-0">
            AssetMantle is no longer indexed by CoinGecko / DefiLlama; pool data
            is shown directly via on-chain reads above.
          </p>
          <ul className="list-unstyled m-0 d-flex flex-column gap-1">
            <li>
              <a
                href="https://app.osmosis.zone/pool/690"
                target="_blank"
                rel="noopener noreferrer"
                className="am-link"
              >
                Osmosis pool 690 (MNTL/OSMO){" "}
                <i className="bi bi-arrow-up-right"></i>
              </a>
            </li>
            <li>
              <a
                href="https://app.osmosis.zone/pool/738"
                target="_blank"
                rel="noopener noreferrer"
                className="am-link"
              >
                Osmosis pool 738 (MNTL/USDC){" "}
                <i className="bi bi-arrow-up-right"></i>
              </a>
            </li>
            <li>
              <a
                href="https://app.osmosis.zone/pool/686"
                target="_blank"
                rel="noopener noreferrer"
                className="am-link"
              >
                Osmosis pool 686 (MNTL/ATOM){" "}
                <i className="bi bi-arrow-up-right"></i>
              </a>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
