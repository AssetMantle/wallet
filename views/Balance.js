import React, { Suspense } from "react";
import { MntlUsdPrice } from "../components";
import { AvailableBalance, AvailableBalanceUsd } from "../components";
import Tooltip from "../components/Tooltip";
import { defaultChainSymbol } from "../config";

export default function Balance() {
  const denomDisplay = defaultChainSymbol;

  return (
    <section className="rounded-4 p-3 bg-gray-800 width-100 d-flex flex-column gap-3">
      <h4 className="body1 text-primary">Wallet balances</h4>
      <div className="nav-bg p-3 rounded-4 d-flex flex-column gap-1">
        <p className="caption d-flex gap-2 align-items-center text-white-300">
          Available Balance
          <Tooltip
            titlePrimary={true}
            description={"Amount that can be transferred."}
            style={{ right: "330%" }}
          />
        </p>
        <Suspense fallback={<div>loading...</div>}>
          <AvailableBalance />
        </Suspense>
        <Suspense fallback={<div>loading...</div>}>
          <AvailableBalanceUsd />
        </Suspense>
      </div>
      <div className="nav-bg p-3 rounded-4 d-flex flex-column gap-1">
        <p className="caption d-flex gap-2 align-items-center text-white-300">
          Current Price of {denomDisplay}
        </p>
        <MntlUsdPrice />
      </div>
      {/* <div className="nav-bg p-3 rounded-4 d-flex flex-column gap-1">
        <p className="caption d-flex gap-2 align-items-center text-white-300">
          Current Value
        </p>
        <p className="caption">0.0000 $MNTL</p>
        <p className="small text-gray">$0.0000</p>
      </div> */}
    </section>
  );
}
