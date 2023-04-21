import React, { useState } from "react";
import LiquidityPoolCard from "./LiquidityPoolCard";

export default function LiquidityPoolComponent({ data, index }) {
  const [Connected, setConnected] = useState(false);

  const address = "0x0x010x0k7tfhd4hm4hgasfuyg689khb34w4a6kbd6v2v";

  return (
    <div
      className="nav-bg p-3 rounded-4 pe-0 d-flex flex-column gap-2"
      style={{ marginTop: index === 0 ? "-24px" : "" }}
    >
      <div className="d-flex align-items-center justify-content-between">
        <h1 className="h3 text-primary">{data.name}</h1>
        <div
          className={`bg-gray-800 p-1 px-3 rounded-start ${
            data.from !== "polygon" && "py-2"
          }`}
        >
          <div
            className="position-relative overflow-hidden"
            style={{
              height: data.from === "polygon" ? "26px" : "20px",
              aspectRatio: data.from === "polygon" ? "77/26" : "72/20",
            }}
          >
            <img
              src={`/farm/icons/${data.from}.svg`}
              alt={`${data.from} icon`}
              className="w-100 h-100"
              style={{ objectFit: "contain", objectPosition: "center" }}
            />
          </div>
        </div>
      </div>
      <button
        className="d-flex gap-2 align-items-center pe-4"
        onClick={() => navigator.clipboard.writeText(address)}
        style={{ wordBreak: "break-all" }}
      >
        {Connected && (
          <>
            {address}
            <i className="bi bi-files text-primary"></i>
          </>
        )}
        <div className="opacity-0">a</div>
      </button>
      <div className="pe-3 d-flex flex-column gap-3 ">
        {data.pools &&
          Array.isArray(data.pools) &&
          data.pools.length > 0 &&
          React.Children.toArray(
            data.pools.map((pool) => (
              <LiquidityPoolCard
                pool={pool}
                Connected={Connected}
                setConnected={setConnected}
              />
            ))
          )}
      </div>
    </div>
  );
}
