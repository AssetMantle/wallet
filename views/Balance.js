import { useChain } from "@cosmos-kit/react";
import React from "react";
import {
  AvailableBalance,
  AvailableBalanceUsd,
  MntlUsdPrice,
  TotalBalance,
  TotalBalanceInUSD,
} from "../components";
import Tooltip from "../components/Tooltip";
import { defaultChainName, defaultChainSymbol } from "../config";

export default function Balance() {
  const denomDisplay = defaultChainSymbol;
  const walletManager = useChain(defaultChainName);
  const { getSigningStargateClient, address, status } = walletManager;

  return (
    <section className="rounded-4 p-3 bg-gray-800 width-100 d-flex flex-column gap-3">
      <h4 className="body1 text-primary">Wallet Balances</h4>
      <div className="nav-bg p-3 rounded-4 d-flex flex-column gap-1">
        <p
          className={`caption d-flex gap-2 align-items-center text-${
            status === "Connected" ? "white-300" : "gray"
          }`}
        >
          Total Balance
          <Tooltip
            titlePrimary={true}
            description={
              "Sum total of Available, Delegated, Rewards Claimable, and Undelegating balances"
            }
            style={{ right: "330%" }}
          />
        </p>
        <TotalBalance />
        <TotalBalanceInUSD />
      </div>
      <div className="nav-bg p-3 rounded-4 d-flex flex-column gap-1">
        <p
          className={`caption d-flex gap-2 align-items-center text-${
            status === "Connected" ? "white-300" : "gray"
          }`}
        >
          Available Balance
          <Tooltip
            titlePrimary={true}
            description={"Amount that can be transferred."}
            style={{ right: "330%" }}
          />
        </p>
        {/* <Suspense fallback={<p>Loading...</p>}> */}
        <AvailableBalance />
        {/* </Suspense> */}
        <AvailableBalanceUsd />
      </div>
      <div className="nav-bg p-3 rounded-4 d-flex flex-column gap-1">
        <p
          className={
            status == "Connected"
              ? `caption d-flex gap-2 align-items-center text-white-300`
              : `caption d-flex gap-2 align-items-center text-gray`
          }
        >
          Current Price of {denomDisplay}
        </p>
        <MntlUsdPrice status={status} />
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
