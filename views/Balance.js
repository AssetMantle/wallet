import { useChain } from "@cosmos-kit/react";
import React from "react";
import {
  AvailableBalance,
  AvailableBalanceUsd,
  MntlUsdPrice,
  TotalBalance,
  TotalBalanceInUSD,
} from "../components";
import { defaultChainName, defaultChainSymbol } from "../config";
import { OverlayTrigger, Stack, Tooltip } from "react-bootstrap";

export default function Balance() {
  const denomDisplay = defaultChainSymbol;
  const chainContext = useChain(defaultChainName);
  const { status } = chainContext;

  return (
    <Stack className="rounded-4 p-3 bg-am-gray-200 h-auto flex-grow-0" gap={3}>
      <h3 className="h3 text-primary m-0">Wallet Balances</h3>
      <Stack className="bg-black p-3 rounded-4" gap={1}>
        <Stack
          gap={2}
          direction="horizontal"
          className={`caption align-items-center m-0 text-${
            status === "Connected"
              ? "white text-opacity-75"
              : "secondary-emphasis"
          }`}
        >
          Total Balance
          <OverlayTrigger
            as="span"
            overlay={
              <Tooltip as id={"totalBalance"}>
                Sum total of Available, Delegated, Rewards Claimable, and
                Undelegating balances
              </Tooltip>
            }
          >
            <i className="bi bi-info-circle text-primary"></i>
          </OverlayTrigger>
        </Stack>
        <TotalBalance />
        <TotalBalanceInUSD />
      </Stack>
      <Stack className="bg-black p-3 rounded-4" gap={1}>
        <Stack
          gap={2}
          direction="horizontal"
          className={`caption align-items-center m-0 text-${
            status === "Connected"
              ? "white text-opacity-75"
              : "secondary-emphasis"
          }`}
        >
          Available Balance
          <OverlayTrigger
            as="span"
            overlay={
              <Tooltip as id={"totalBalance"}>
                Amount that can be transferred.
              </Tooltip>
            }
          >
            <i className="bi bi-info-circle text-primary"></i>
          </OverlayTrigger>
        </Stack>
        {/* <Suspense fallback={<p>Loading...</p>}> */}
        <AvailableBalance />
        {/* </Suspense> */}
        <AvailableBalanceUsd />
      </Stack>
      <Stack className="bg-black p-3 rounded-4" gap={1}>
        <p
          className={`caption d-flex gap-2 align-items-center m-0 text-white text-opacity-75`}
        >
          Current Price of {denomDisplay}
        </p>
        <MntlUsdPrice />
      </Stack>
    </Stack>
  );
}
