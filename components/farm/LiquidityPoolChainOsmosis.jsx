import React, { useEffect, useState } from "react";
import { farmPools } from "../../data";
import { cleanString } from "../../lib";
import { LiquidityPoolChainCardOsmosis } from "./LiquidityPoolChainCardOsmosis";
import { Stack } from "react-bootstrap";

export const LiquidityPoolChainOsmosis = ({
  setSelectedPool,
  selectedPool,
  appIndex,
}) => {
  const data = farmPools?.[appIndex];
  const appLogoPathname = cleanString(data?.name);

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

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
      <h4 className="caption2 text-primary m-0">{data?.name}</h4>
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
        src={`/farm/icons/f${data?.from}.svg`}
        alt={`${data?.from} icon`}
        className="w-100 h-100"
        style={{ objectFit: "contain", objectPosition: "center" }}
      />
    </div>
  );

  // if (!hasMounted) return "Loading...";

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
        {data?.pools &&
          Array.isArray(data?.pools) &&
          data?.pools.length > 0 &&
          React.Children.toArray(
            data?.pools?.map?.((pool, index) => (
              <LiquidityPoolChainCardOsmosis
                setSelectedPool={setSelectedPool}
                selectedPool={selectedPool}
                appIndex={appIndex}
                poolIndex={index}
                key={index}
              />
            ))
          )}
      </Stack>
    </Stack>
  );
};
