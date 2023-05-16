import React from "react";
import { farmPools, useComdex, useOsmosis } from "../data";
import { cleanString, getTimeDifference } from "../lib";

export function ExternalFarmPool({ appIndex, poolIndex }) {
  const selectedApp = farmPools?.[appIndex];
  const selectedPool = selectedApp?.pools?.[poolIndex];
  const { allComdex, isLoadingComdex, errorComdex } = useComdex();
  const { allOsmosis, errorOsmosis, isLoadingOsmosis } = useOsmosis();
  const tokenPairArray = selectedPool?.tokens.split(" – ");
  const appLogoPathname = cleanString(selectedApp?.name);
  console.log(typeof allComdex[0]?.apr);
  // DISPLAY VARIABLES

  const appLogoJSX = (
    <div className="d-flex gap-2 align-items-center mb-1">
      <div className={``}>
        <div
          className="position-relative"
          style={{ width: "30px", aspectRatio: "1/1" }}
        >
          <img
            src={`/farm/icons/${appLogoPathname}.svg`}
            alt={`${selectedApp?.name} icon`}
            className="w-100 h-100"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
      </div>
      <h1 className="caption2 text-gray text-primary m-0">
        {selectedApp?.name}
      </h1>
    </div>
  );

  const ctaButtonsJSX = (
    <a
      href={selectedPool?.extLink}
      target="_blank"
      rel="noopener noreferrer"
      className="button-primary px-5 py-2 d-flex gap-2"
    >
      Stake <i className="bi bi-arrow-up-right"></i>
    </a>
  );

  const chainLogoJSX = (
    <div
      className={`bg-gray-800 p-1 px-3 rounded-start ${
        selectedApp?.from !== "polygon" && "py-2"
      }`}
    >
      <div
        className="position-relative overflow-hidden"
        style={{
          height: selectedApp?.from === "polygon" ? "26px" : "20px",
          aspectRatio: selectedApp?.from === "polygon" ? "77/26" : "72/20",
        }}
      >
        <img
          src={`/farm/icons/f${selectedApp?.from}.svg`}
          alt={`${selectedApp?.from} icon`}
          className="w-100 h-100"
          style={{ objectFit: "contain", objectPosition: "center" }}
        />
      </div>
    </div>
  );

  const logoPairJSX = (
    <div
      className="position-relative"
      style={{ width: "72px", aspectRatio: "72/40" }}
    >
      <div
        className="position-absolute end-0 overflow-hidden"
        style={{ width: "40px", aspectRatio: "1/1" }}
      >
        <img
          src={`/farm/icons/${tokenPairArray?.[1].toLowerCase()}.svg`}
          alt={`${tokenPairArray?.[1]} icon`}
          className="w-100 h-100"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
      <div
        className="position-absolute start-0 overflow-hidden"
        style={{ width: "40px", aspectRatio: "1/1" }}
      >
        <img
          src={`/farm/icons/${tokenPairArray?.[0].toLowerCase()}.svg`}
          alt={`${tokenPairArray?.[0]} icon`}
          className="w-100 h-100"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
    </div>
  );

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const durationRemaining =
    selectedPool?.startTime > currentTimestamp
      ? "Not Started"
      : currentTimestamp > selectedPool?.endTime
      ? "Incentive Ended"
      : `${getTimeDifference(
          selectedPool?.endTime,
          currentTimestamp
        )} remaining`;

  console.log(
    "tokenPairArray: ",
    tokenPairArray,
    " appLogoPathname: ",
    appLogoPathname
  );

  return (
    <div className={`nav-bg p-3 rounded-4 pe-0 d-flex flex-column gap-2 `}>
      <div className="d-flex align-items-center justify-content-between">
        {/* App name and connected Address */}
        <div className="d-flex gap-2 mb-1">
          <div className={``}>{appLogoJSX}</div>
        </div>
        {chainLogoJSX}
      </div>

      <div className="pe-3 d-flex flex-column gap-3 ">
        <div className="bg-gray-800 p-4 rounded-4 d-flex flex-column gap-3">
          <div className="d-flex align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              {logoPairJSX}
              <h2 className="h3 m-0">{selectedPool?.tokens}</h2>
            </div>
          </div>
          <div className="border-bottom"></div>
          <div className="row">
            {/* <div className="col-7 py-2">
              <div className="row">
                <div className="col-6 text-gray caption">Reward Pool</div>
                <div className="col-6 caption">{selectedPool?.rewardPool}</div>
              </div>
            </div> */}
            <div className="col-4 py-2">
              <div className="row">
                <div className="col-6 text-gray caption">TVL</div>
                {appIndex == 2 && (
                  <div className="col-6 caption">
                    $
                    {
                      allOsmosis?.find(
                        (item) =>
                          item?.symbol.includes(tokenPairArray[0]) &&
                          item?.symbol.includes(tokenPairArray[1])
                      )?.tvlUsd
                    }
                  </div>
                )}
                {appIndex == 3 && (
                  <div className="col-6 caption">
                    $
                    {allComdex
                      ?.find(
                        (item) =>
                          item?.pair.includes(tokenPairArray[0]) &&
                          item?.pair.includes(tokenPairArray[1])
                      )
                      ?.tvlUsd?.toFixed(2)}
                  </div>
                )}
              </div>
            </div>
            {/* <div className="col-7 py-2">
              <div className="row">
                <div className="col-6 text-gray caption">Duration</div>
                <div className="col-6 caption">{durationRemaining}</div>
              </div>
            </div> */}
            <div className="col-4 py-2">
              <div className="row">
                <div className="col-6 text-gray caption">APR</div>
                {appIndex == 2 && (
                  <div className="col-6 caption">
                    {" "}
                    {allOsmosis
                      ?.find(
                        (item) =>
                          item?.symbol.includes(tokenPairArray[0]) &&
                          item?.symbol.includes(tokenPairArray[1])
                      )
                      ?.apy?.toFixed(2)}
                    %
                  </div>
                )}
                {appIndex == 3 && (
                  <div className="col-6 caption">
                    {" "}
                    {parseFloat(
                      allComdex?.find(
                        (item) =>
                          item?.pair.includes(tokenPairArray[0]) &&
                          item?.pair.includes(tokenPairArray[1])
                      )?.apr
                    )?.toFixed(2)}
                    %
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="border-bottom"></div>
          <div className="d-flex justify-content-end gap-2">
            {ctaButtonsJSX}
          </div>
        </div>
      </div>
    </div>
  );
}
