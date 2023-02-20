import React from "react";
import { getBalanceStyle, placeholderMntlUsdValue } from "../../config";
import { useMntlUsd } from "../../data";

export const MntlUsdPrice = ({ status }) => {
  console.log("inside MntlUsdPrice");
  const { mntlUsdValue, errorMntlUsdValue } = useMntlUsd();

  const mntlUsdDisplay = errorMntlUsdValue
    ? placeholderMntlUsdValue
    : mntlUsdValue;

  const isConnected = status == "Connected";
  console.log(status);

  return (
    <p className={"caption"}>
      {getBalanceStyle(mntlUsdDisplay, "caption", "caption2")}
      &nbsp;
      {"$USD"}
    </p>
  );
};
