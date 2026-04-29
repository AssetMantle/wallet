import Head from "next/head";
import React from "react";
import Pool690IncentiveProgram, {
  Pool690MetricsPanel,
} from "../components/Pool690IncentiveProgram";
import ScrollableSectionContainer from "../components/ScrollableSectionContainer";

export default function Earn() {
  return (
    <>
      <Head>
        <title>Earn | MantleWallet</title>
      </Head>
      <h1 className="visually-hidden">Earn</h1>
      <section className="row h-100">
        <ScrollableSectionContainer className="col-8 h-100">
          <Pool690IncentiveProgram />
        </ScrollableSectionContainer>
        <ScrollableSectionContainer className="col-4 d-flex flex-column gap-3">
          <Pool690MetricsPanel />
        </ScrollableSectionContainer>
      </section>
    </>
  );
}
