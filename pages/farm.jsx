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
} from "../components";
import ScrollableSectionContainer from "../components/ScrollableSectionContainer";
import { useIsMounted } from "../lib";

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

  console.log(
    " appIndex: ",
    selectedPool?.appIndex,
    " poolIndex: ",
    selectedPool?.poolIndex
  );

  return (
    <>
      <Head>
        <title>Farm | MantleWallet</title>
      </Head>
      <section className="row h-100">
        <div className="col-8 h-100">
          <ScrollableSectionContainer className="d-flex h-100">
            {/* New UI starts from here  */}
            <div className="bg-gray-800 rounded-4 p-3 d-flex flex-column gap-3">
              {farmPoolJSX}
            </div>
          </ScrollableSectionContainer>
        </div>
        <ScrollableSectionContainer className="col-4 d-flex flex-column gap-3 h-90">
          {/* New UI starts from here  */}
          <div className="bg-gray-800 rounded-4 p-3 d-flex flex-column gap-3 mt-2">
            <h2 className="body1 text-primary">Chains</h2>
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
          </div>
        </ScrollableSectionContainer>
      </section>
    </>
  );
}
