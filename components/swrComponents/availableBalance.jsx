import { useChain } from "@cosmos-kit/react";
import BigNumber from "bignumber.js";
import React from "react";
import {
  defaultChainName,
  defaultChainSymbol,
  getBalanceStyle,
} from "../../config";
import {
  decimalize,
  fromChainDenom,
  useAvailableBalance,
  useMntlUsd,
} from "../../data";

const denomDisplay = defaultChainSymbol;

export const AvailableBalance = () => {
  console.log("inside AvailableBalance");
  const walletManager = useChain(defaultChainName);
  const { status } = walletManager;
  const { availableBalance } = useAvailableBalance();

  const balanceDisplay =
    status === "Connected"
      ? getBalanceStyle(fromChainDenom(availableBalance), "caption", "caption2")
      : getBalanceStyle(
          fromChainDenom(availableBalance),
          "caption text-gray",
          "caption2 text-gray"
        );

  return (
    <>
      <p className={status === "Connected" ? "caption" : "caption text-gray"}>
        {balanceDisplay} {denomDisplay}
      </p>
    </>
  );
};

export const AvailableBalanceUsd = () => {
  const { availableBalance } = useAvailableBalance();
  const { mntlUsdValue } = useMntlUsd();

  const balanceInUSDDisplayUnstyled = BigNumber(
    fromChainDenom(availableBalance)
  )
    .multipliedBy(BigNumber(decimalize(mntlUsdValue)))
    .toString();

  const balanceInUSDDisplay = getBalanceStyle(
    decimalize(balanceInUSDDisplayUnstyled),
    "caption2 text-gray",
    "small text-gray"
  );

  return (
    <p className="caption2 text-gray">
      ${balanceInUSDDisplay}
      &nbsp;$USD
    </p>
  );
};
