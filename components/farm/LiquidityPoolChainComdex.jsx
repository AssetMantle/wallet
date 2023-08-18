import React from "react";
import { farmPools } from "../../data";
import { cleanString } from "../../lib";
import { LiquidityPoolChainCardComdex } from "./LiquidityPoolChainCardComdex";
import { Stack } from "react-bootstrap";

export const LiquidityPoolChainComdex = ({
  setSelectedPool,
  selectedPool,
  appIndex,
}) => {
  const data = farmPools?.[appIndex];
  const appLogoPathname = cleanString(data?.name);

  const appLogoJSX = (
    <Stack className="align-items-center mb-1" direction="horizontal" gap={2}>
      <div
        className="position-relative"
        style={{ width: "30px", aspectRatio: "1/1" }}
      >
        <img
          src={`/farm/icons/${appLogoPathname}.svg`}
          alt={`${data?.name} icon`}
          className="w-100 h-100"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
      <h1 className="caption2 text-primary m-0">{data?.name}</h1>
    </Stack>
  );

  const chainLogoJSX = (
    <div
      className="position-relative overflow-hidden"
      style={{
        height: data?.from === "polygon" ? "26px" : "20px",
        aspectRatio: data?.from === "polygon" ? "77/26" : "66/22",
      }}
    >
      <img
        src={`/farm/icons/${data?.from}.svg`}
        alt={`${data?.from} icon`}
        className="w-100 h-100"
        style={{ objectFit: "contain", objectPosition: "center" }}
      />
    </div>
  );

  return (
    <Stack className="bg-black rounded-4">
      <Stack
        className="align-items-center justify-content-between p-3 pe-0"
        direction="horizontal"
      >
        {appLogoJSX}
        <div
          className={`bg-light-subtle p-1 px-3 rounded-start ${
            data?.from !== "polygon" && "py-2"
          }`}
        >
          {chainLogoJSX}
        </div>
      </Stack>

      <i className="border-bottom me-3" />

      <Stack>
        <LiquidityPoolChainCardComdex
          setSelectedPool={setSelectedPool}
          selectedPool={selectedPool}
          appIndex={appIndex}
          poolIndex={0}
          key={0}
        />
        <LiquidityPoolChainCardComdex
          setSelectedPool={setSelectedPool}
          selectedPool={selectedPool}
          appIndex={appIndex}
          poolIndex={1}
          key={1}
        />
      </Stack>
    </Stack>
  );
};
