import React from "react";
import Head from "next/head";
import ICTransactionInfo from "../components/ICTransactionInfo";
import ScrollableSectionContainer from "../components/ScrollableSectionContainer";
// import Tooltip from "../components/Tooltip";
import EthToPolygonBridge from "../views/EthToPolygonBridge";
import GravityToEthBridge from "../views/GravityToEthBridge";
import MntlToGravityBridge from "../views/MntlToGravityBridge";
import PolygonBridge from "../views/PolygonBridge";
import { Col, OverlayTrigger, Row, Stack, Tooltip } from "react-bootstrap";

export default function Bridge() {
  return (
    <>
      <Head>
        <title>Bridge | MantleWallet</title>
      </Head>
      <Row as={`main`} className="h-100">
        <Col xs={8} className="h-100 pb-2">
          <ScrollableSectionContainer className="h-100">
            <Stack
              as={`section`}
              className="rounded-4 p-3 bg-light-subtle width-100 flex-grow-0"
              gap={3}
            >
              <Stack
                as="nav"
                direction="horizontal"
                gap={3}
                className="align-items-center justify-content-between"
              >
                <Stack gap={3} className="">
                  <h1 className="body1 text-primary">Interchain</h1>
                </Stack>
              </Stack>
              <Stack gap={3} className="bg-black rounded-4 p-3">
                <MntlToGravityBridge />
                <GravityToEthBridge />
                <EthToPolygonBridge />
                <PolygonBridge />
              </Stack>
            </Stack>
          </ScrollableSectionContainer>
        </Col>
        <Col xs={4} className="h-100 pb-2">
          <ScrollableSectionContainer className="d-flex flex-column gap-3">
            <div className="rounded-4 p-3 bg-light-subtle width-100 text-white-300">
              <OverlayTrigger
                as="span"
                overlay={<Tooltip as id={"transactionSequence"}></Tooltip>}
              >
                <i className="bi bi-info-circle text-primary"></i>
              </OverlayTrigger>
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
        </Col>
      </Row>
    </>
  );
}
