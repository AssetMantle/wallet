import React, { Suspense } from "react";
import { BsInfoCircle } from "react-icons/bs";
import { MntlUsdPrice } from "../components";
import { AvailableBalance, AvailableBalanceUsd } from "../components";
import { defaultChainSymbol } from "../config";

export default function Balance() {
  const denomDisplay = defaultChainSymbol;

  return (
    <section className="rounded-5 p-4 bg-gray-800 width-100 d-flex flex-column gap-3">
      <h4 className="body1 text-primary">Wallet balances</h4>
      <div className="nav-bg p-3 rounded-4 gap-3">
        <div className="d-flex flex-column gap-2">
          <p className="caption d-flex gap-2 align-items-center">
            Available Balance
            <span>
              <BsInfoCircle />
            </span>
          </p>
          <Suspense fallback={<div>loading...</div>}>
            <AvailableBalance />
          </Suspense>
        </div>
      </div>
      <div className="nav-bg p-3 rounded-4 gap-3">
        <div className="d-flex flex-column gap-2">
          <p className="caption d-flex gap-2 align-items-center">
            Current Price of {denomDisplay}
          </p>
          <MntlUsdPrice />
        </div>
      </div>
      <div className="nav-bg p-3 rounded-4 gap-3">
        <div className="d-flex flex-column gap-2">
          <p className="caption d-flex gap-2 align-items-center">Total Value</p>
          <Suspense fallback={<div>loading...</div>}>
            <AvailableBalanceUsd />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
