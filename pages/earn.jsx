import Head from "next/head";
import React from "react";
import EarnTable from "../components/EarnTable";
import { Col, Row, Stack } from "react-bootstrap";

export default function Earn() {
  return (
    <>
      <Head>
        <title>Earn | MantleWallet</title>
      </Head>
      <Row as="section" className="h-100">
        <Col xs={8} className="h-100">
          <Stack
            gap={2}
            className="bg-light-subtle p-3 pb-5 rounded-4"
            style={{ height: "90%" }}
          >
            <Stack
              direction="horizontal"
              className="align-items-center justify-content-between w-100"
            >
              <h1 className="card-title body1 text-primary my-auto">Earn</h1>
            </Stack>
            <Stack
              className="w-100 bg-black p-2 rounded-4 flex-grow-1"
              style={{ height: "90%" }}
            >
              <div className="w-100 h-100" style={{ overflow: "auto" }}>
                <EarnTable />
              </div>
            </Stack>
          </Stack>
        </Col>
        <Col xs={4}>
          <Stack className="rounded-4 p-3 my-2 bg-light-subtle width-100 text-white">
            <p className="m-0">
              To earn yields, visit the listed DEXs to add $MNTL liquidity.
            </p>
            <br />
            <p className="m-0">
              Some listed entries might have additional reward tokens available
              as incentive.
            </p>
          </Stack>
        </Col>
      </Row>
    </>
  );
}
