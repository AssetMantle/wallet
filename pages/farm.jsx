import Head from "next/head";
import React, { Suspense, useState } from "react";
import { ExternalFarmPool, UniswapFarmPool } from "../components";
import LiquidityPoolChains from "../components/LiquidityPoolChains";
import ScrollableSectionContainer from "../components/ScrollableSectionContainer";
import { farmPools } from "../data";
import { QuickswapFarmPool } from "../components/QuickswapFarmPool";
import { useIsMounted } from "../lib";

export default function Farm() {
  // HOOKS

  const [selectedPool, setSelectedPool] = useState({
    appIndex: 0,
    poolIndex: 0,
  });
  const isMounted = useIsMounted();
  const loadingJSX = "Loading...";

  // HANDLER FUNCTIONS

  const farmPoolJSX =
    isMounted &&
    (selectedPool?.appIndex == 0 || selectedPool?.appIndex == 1 ? (
      selectedPool?.appIndex == 0 ? (
        <Suspense fallback={loadingJSX}>
          <UniswapFarmPool poolIndex={selectedPool?.poolIndex} />
        </Suspense>
      ) : (
        <Suspense fallback={loadingJSX}>
          <QuickswapFarmPool poolIndex={selectedPool?.poolIndex} />{" "}
        </Suspense>
      )
    ) : (
      <Suspense fallback={loadingJSX}>
        <ExternalFarmPool
          appIndex={selectedPool?.appIndex}
          poolIndex={selectedPool?.poolIndex}
        />{" "}
      </Suspense>
    ));

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
            {React.Children.toArray(
              farmPools.map((pool, index) => (
                <LiquidityPoolChains
                  setSelectedPool={setSelectedPool}
                  appIndex={index}
                />
              ))
            )}
          </div>
        </ScrollableSectionContainer>
      </section>
    </>
  );
}
