import React from "react";
import {
  getBalanceStyle,
  placeholderMntlUsdValue,
  usdSymbol,
} from "../../config";
import { decimalize, useMntlUsd } from "../../data";

export const MntlUsdPrice = () => {
  const { mntlUsdValue, errorMntlUsdValue } = useMntlUsd();

  const mntlUsd = errorMntlUsdValue ? placeholderMntlUsdValue : mntlUsdValue;
  const mntlUsdDisplay = getBalanceStyle(
    decimalize(mntlUsd),
    "caption",
    "caption2"
  );

  return (
    <p className={"caption"}>
      {mntlUsdDisplay}
      &nbsp;
      {usdSymbol}
    </p>
  );
};
