import Head from "next/head";
import React, { Suspense, useState } from "react";
import {
  ExternalFarmPoolComdex,
  ExternalFarmPoolOsmosis,
  LiquidityPoolChainComdex,
  LiquidityPoolChainEthereum,
  LiquidityPoolChainOsmosis,
  LiquidityPoolChainPolygon,
  UniswapFarmPool,
  QuickswapFarmPool,
} from "../components/farm";
import ScrollableSectionContainer from "../components/ScrollableSectionContainer";
import { useIsMounted } from "../lib";
import { Col, Row, Stack } from "react-bootstrap";

export default function Farm() {
  // HOOKS
  const [selectedPool, setSelectedPool] = useState({
    appIndex: 0,
    poolIndex: 0,
  });
  const isMounted = useIsMounted();
  const loadingJSX = "Loading...";
  let farmPoolJSX;

  // HANDLER FUNCTIONS

  switch (selectedPool?.appIndex) {
    case 0:
    default:
      farmPoolJSX = isMounted && (
        <Suspense fallback={loadingJSX}>
          <UniswapFarmPool poolIndex={selectedPool?.poolIndex} />
        </Suspense>
      );
      break;

    case 1:
      farmPoolJSX = isMounted && (
        <Suspense fallback={loadingJSX}>
          <QuickswapFarmPool poolIndex={selectedPool?.poolIndex} />
        </Suspense>
      );
      break;
    case 2:
      farmPoolJSX = isMounted && (
        <Suspense fallback={loadingJSX}>
          <ExternalFarmPoolOsmosis
            appIndex={selectedPool?.appIndex}
            poolIndex={selectedPool?.poolIndex}
          />
        </Suspense>
      );
      break;
    case 3:
      farmPoolJSX = isMounted && (
        <Suspense fallback={loadingJSX}>
          <ExternalFarmPoolComdex
            appIndex={selectedPool?.appIndex}
            poolIndex={selectedPool?.poolIndex}
          />
        </Suspense>
      );
      break;
  }

  return (
    <>
      <Head>
        <title>Farm | MantleWallet</title>
      </Head>
      <Row className="row h-100" as="section">
        <Col xs={8} className="h-100 pb-2">
          <ScrollableSectionContainer className="d-flex h-100">
            {/* New UI starts from here  */}
            <Stack className="rounded-4 p-3 bg-secondary width-100 transitionAll flex-grow-0">
              {farmPoolJSX}
            </Stack>
          </ScrollableSectionContainer>
        </Col>
        <Col xs={4} className="h-100 pb-2">
          <ScrollableSectionContainer>
            {/* New UI starts from here  */}
            <Stack className="bg-secondary rounded-4 p-3" gap={3}>
              <h2 className="body1 text-primary m-0">Chains</h2>
              <Suspense fallback={loadingJSX}>
                <LiquidityPoolChainEthereum
                  setSelectedPool={setSelectedPool}
                  selectedPool={selectedPool}
                  appIndex={0}
                />
              </Suspense>
              <Suspense fallback={loadingJSX}>
                <LiquidityPoolChainPolygon
                  setSelectedPool={setSelectedPool}
                  selectedPool={selectedPool}
                  appIndex={1}
                />
              </Suspense>
              <Suspense fallback={loadingJSX}>
                <LiquidityPoolChainOsmosis
                  setSelectedPool={setSelectedPool}
                  selectedPool={selectedPool}
                  appIndex={2}
                />
              </Suspense>
              <Suspense fallback={loadingJSX}>
                <LiquidityPoolChainComdex
                  setSelectedPool={setSelectedPool}
                  selectedPool={selectedPool}
                  appIndex={3}
                />
              </Suspense>
            </Stack>
          </ScrollableSectionContainer>
        </Col>
      </Row>
    </>
  );
}
