import React from "react";
import { placeholderMntlUsdValue } from "../../config";
import { useMntlUsd } from "../../data";

export const MntlUsdPrice = () => {
  console.log("inside MntlUsdPrice");

  const { mntlUsdValue, errorMntlUsdValue } = useMntlUsd();

  const mntlUsdDisplay = errorMntlUsdValue
    ? placeholderMntlUsdValue
    : mntlUsdValue;

  return (
    <p className="caption">
      {mntlUsdDisplay}&nbsp;{"$USD"}
    </p>
  );
};
