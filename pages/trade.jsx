import React, { useState } from "react";
import Head from "next/head";
import TradeTable from "../components/TradeTable";
import TradePageTokenDetails from "../components/TradePageTokenDetails";
import ScrollableSectionContainer from "../components/ScrollableSectionContainer";
import { Col, Row, Stack } from "react-bootstrap";

export default function Trade() {
  const [searchValue, setSearchValue] = useState("");

  return (
    <>
      <Head>
        <title>Trade | MantleWallet</title>
      </Head>
      <Row as="section" className="h-100">
        <Col xs={8} className="h-100">
          <ScrollableSectionContainer className="h-100">
            <Stack
              gap={2}
              className="bg-light-subtle p-3 pb-5 rounded-4 flex-grow-0"
              style={{ height: "90%" }}
            >
              <Stack className="justify-content-between w-100">
                <h1 className="card-title body1 text-primary my-auto text-start">
                  Markets
                </h1>
              </Stack>
              <Stack
                className="w-100 bg-black p-2 rounded-4 flex-grow-1"
                style={{ height: "90%" }}
              >
                <div className="w-100 h-100" style={{ overflow: "auto" }}>
                  <TradeTable />
                </div>
              </Stack>
            </Stack>
          </ScrollableSectionContainer>
        </Col>
        <Col xs={4} className="h-100">
          <ScrollableSectionContainer className="h-100">
            <Stack className="rounded-4 p-3 my-2 bg-light-subtle width-100 text-white">
              <p className="m-0">
                To purchase MNTL, visit the exchanges (CEX & DEX) shown to swap
                with your available tokens.
              </p>
              <br />
              <p className="m-0">
                Options to directly on-ramp to MNTL using fiat currencies will
                be coming soon.
              </p>
            </Stack>
            <TradePageTokenDetails />
          </ScrollableSectionContainer>
        </Col>
      </Row>
    </>
  );
}
