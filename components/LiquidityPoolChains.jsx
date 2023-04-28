import React from "react";
import LiquidityPoolChainCard from "./LiquidityPoolChainCard";

export default function LiquidityPoolChains({ data, setChain }) {
  return (
    <div className="nav-bg rounded-4 d-flex flex-column">
      <div className="d-flex align-items-center justify-content-between p-3 pe-0">
        <div className="d-flex gap-2 align-items-center mb-1">
          <div className={``}>
            <div
              className="position-relative"
              style={{ width: "30px", aspectRatio: "1/1" }}
            >
              <img
                src={`/farm/icons/${
                  data &&
                  data.name &&
                  data.name.replaceAll(" ", "-").toLowerCase()
                }.svg`}
                alt={`${data && data.name} icon`}
                className="w-100 h-100"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
          </div>
          <h1 className="caption2 text-gray text-primary m-0">{data.name}</h1>
        </div>
        <div
          className={`bg-gray-800 p-1 px-3 rounded-start ${
            data.from !== "polygon" && "py-2"
          }`}
        >
          <div
            className="position-relative overflow-hidden"
            style={{
              height: data.from === "polygon" ? "26px" : "20px",
              aspectRatio: data.from === "polygon" ? "77/26" : "66/22",
            }}
          >
            <img
              src={`/farm/icons/f${data.from}.svg`}
              alt={`${data.from} icon`}
              className="w-100 h-100"
              style={{ objectFit: "contain", objectPosition: "center" }}
            />
          </div>
        </div>
      </div>
      <i className="border-bottom me-3"></i>
      <div className="d-flex flex-column">
        {data.pools &&
          Array.isArray(data.pools) &&
          data.pools.length > 0 &&
          React.Children.toArray(
            data.pools.map((pool) => (
              <LiquidityPoolChainCard
                pool={pool}
                name={data.name}
                setChain={setChain}
              />
            ))
          )}
      </div>
    </div>
  );
}
