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
    // <p className={"caption"}>
    //   <p>
    <div>
      {isConnected ? (
        <p> {getBalanceStyle(mntlUsdDisplay, "caption", "caption2")}</p>
      ) : (
        <p>
          {" "}
          {getBalanceStyle(
            mntlUsdDisplay,
            "caption text-gray",
            "caption2 text-gray"
          )}
        </p>
      )}
    </div>

    //   &nbsp;
    //   {"$USD"}
    // </p>
  );
};
