import React from "react";
import { farmPools, useComdexFarm } from "../data";
import { cleanString } from "../lib";
import BigNumber from "bignumber.js";

export function ExternalFarmPoolComdex({ appIndex, poolIndex }) {
  const selectedApp = farmPools?.[appIndex];
  const selectedPool = selectedApp?.pools?.[poolIndex];
  const tokenPairArray = selectedPool?.tokens.split(" – ");
  const appLogoPathname = cleanString(selectedApp?.name);

  const { comdexFarm, isLoadingComdexFarm } = useComdexFarm(poolIndex);

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

  const displayTvl = isLoadingComdexFarm
    ? "Loading..."
    : `$ ${BigNumber(comdexFarm?.tvlUsd || 0).toFixed(2)}`;

  const displayApr = isLoadingComdexFarm
    ? "Loading..."
    : `${BigNumber(comdexFarm?.apr || 0).toFixed(2)}%`;

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
            <div className="col-5 py-2">
              <div className="row">
                <div className="col-6 text-gray caption">TVL</div>
                <div className="col-6 caption">{displayTvl}</div>
              </div>
            </div>
            <div className="col-5 py-2">
              <div className="row">
                <div className="col-6 text-gray caption">APR</div>
                {<div className="col-6 caption"> {displayApr}</div>}
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
