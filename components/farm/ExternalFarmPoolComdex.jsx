import React from "react";
import { farmPools, useComdexFarm } from "../../data";
import { cleanString } from "../../lib";
import BigNumber from "bignumber.js";
import { Col, Row, Stack } from "react-bootstrap";

export function ExternalFarmPoolComdex({ appIndex, poolIndex }) {
  const selectedApp = farmPools?.[appIndex];
  const selectedPool = selectedApp?.pools?.[poolIndex];
  const tokenPairArray = selectedPool?.tokens.split(" – ");
  const appLogoPathname = cleanString(selectedApp?.name);

  const { comdexFarm, isLoadingComdexFarm } = useComdexFarm(poolIndex);

  // DISPLAY VARIABLES

  const appLogoJSX = (
    <Stack className="align-items-center mb-1" direction="horizontal" gap={2}>
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
      <h1 className="h3 text-primary m-0">{selectedApp?.name}</h1>
    </Stack>
  );

  const ctaButtonsJSX = (
    <a
      href={selectedPool?.extLink}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-primary px-5 rounded-5 py-2 d-flex gap-2 fw-semibold"
    >
      Stake <i className="bi bi-arrow-up-right"></i>
    </a>
  );

  const chainLogoJSX = (
    <div
      className={`bg-am-gray-700 p-1 px-3 rounded-start ${
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
    <Stack className={`bg-black p-3 rounded-4 pe-0`} gap={2}>
      <Stack
        direction="horizontal"
        className="align-items-center justify-content-between"
      >
        {/* App name and connected Address */}
        <Stack direction="horizontal" className="mb-1" gap={2}>
          {appLogoJSX}
        </Stack>
        {chainLogoJSX}
      </Stack>

      <Stack className="pe-3" gap={3}>
        <Stack className="bg-am-gray-700 p-4 rounded-4" gap={3}>
          <Stack
            className="align-items-center justify-content-between"
            direction="horizontal"
            gap={3}
          >
            <Stack
              className="align-items-center"
              direction="horizontal"
              gap={3}
            >
              {logoPairJSX}
              <h2 className=" body2 fw-medium color-am-white-400 m-0">
                {selectedPool?.tokens}
              </h2>
            </Stack>
          </Stack>
          <div className="border-bottom  " />
          <Row>
            <Col xs={5} className="py-2">
              <Row>
                <Col xs={3} className="color-am-white-300 caption">
                  TVL
                </Col>
                <Col xs={9} className="caption">
                  {displayTvl}
                </Col>
              </Row>
            </Col>
            <Col xs={5} className="py-2">
              <Row>
                <Col xs={3} className="color-am-white-300 caption">
                  APR
                </Col>
                <Col xs={9} className="caption">
                  {displayApr}
                </Col>
              </Row>
            </Col>
          </Row>
          <div className="border-bottom  " />
          <Stack className="justify-content-end" direction="horizontal" gap={2}>
            {ctaButtonsJSX}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
