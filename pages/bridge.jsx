import React from "react";
import ICTransactionInfo from "../components/ICTransactionInfo";
import ScrollableSectionContainer from "../components/ScrollableSectionContainer";
import Tooltip from "../components/Tooltip";
import EthToPolygonBridge from "../views/EthToPolygonBridge";
import GravityToEthBridge from "../views/GravityToEthBridge";
import MntlToGravityBridge from "../views/MntlToGravityBridge";
import PolygonBridge from "../views/PolygonBridge";
import Head from "next/head";
import OsmosisToMntl from "../views/OsmosisToMntl";

export default function Bridge() {
  return (
    <>
      <Head>
        <title>Bridge | MantleWallet</title>
      </Head>
      <main className="row h-100">
        <ScrollableSectionContainer className="col-8">
          <section className="rounded-4 p-3 bg-gray-800 width-100 d-flex flex-column gap-3 transitionAll">
            <nav className="d-flex align-items-center justify-content-between gap-3">
              <div className="d-flex gap-3 align-items-center">
                <h1 className="body1 text-primary">Interchain</h1>
              </div>
            </nav>
            <div className="nav-bg d-flex flex-column gap-3 rounded-4 p-3">
              <MntlToGravityBridge />
              <section className="row">
                <div className="col-12 col-md-6 pe-0">
                  <OsmosisToMntl />
                </div>
                <div className="col-12 col-md-6">
                  <GravityToEthBridge />
                </div>
              </section>
              <EthToPolygonBridge />
              <PolygonBridge />
            </div>
          </section>
        </ScrollableSectionContainer>
        <ScrollableSectionContainer className="col-4 d-flex flex-column gap-3">
          <div className="rounded-4 p-3 bg-gray-800 width-100 text-white-300">
            <Tooltip
              titlePrimary={true}
              description={""}
              style={{ right: "330%" }}
            />
            &nbsp;The Order in which you need to complete the transactions:
          </div>
          <ICTransactionInfo
            title="1. Send to Gravity (5s)"
            chainFrom="assetmantle"
            chainTo="gravitybridge"
          />
          <ICTransactionInfo
            title="2. Send to Ethereum (30m)"
            chainFrom="gravitybridge"
            chainTo="ethereum"
          />
          <ICTransactionInfo
            title="3. Send to Polygon (30m)"
            chainFrom="ethereum"
            chainTo="polygon"
          />
        </ScrollableSectionContainer>
      </main>
    </>
  );
}
