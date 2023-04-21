import React, { useState } from "react";
import LiquidityPoolCard from "./LiquidityPoolCard";

export default function LiquidityPoolComponent({ data }) {
  const [Connected, setConnected] = useState(false);

  const address = "0x0x010x0k7tfhd4hm4hgasfuyg689khb34w4a6kbd6v2v";

  return (
    <div className="bg-gray-800 p-4 rounded-4 pe-0 d-flex flex-column gap-3">
      <div className="d-flex align-items-center justify-content-between">
        <h1 className="h3 text-primary">{data.name}</h1>
        <div className="nav-bg p-1 px-3 rounded-start">
          <div
            className="position-relative overflow-hidden"
            style={{
              height: data.form === "polygon" ? "26px" : "20px",
              aspectRatio: data.form === "polygon" ? "77/26" : "72/20",
            }}
          >
            <img
              src={`/farm/icons/${data.from}.svg`}
              alt={`${data.form} icon`}
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
      <div className="pe-4 d-flex flex-column gap-3 ">
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
