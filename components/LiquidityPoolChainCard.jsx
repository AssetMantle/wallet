import React, { useState } from "react";

export default function LiquidityPoolChainCard({ pool, setChain, name }) {
  const [Tokens] = useState(pool && pool.tokens && pool.tokens.split(" – "));
  return (
    <div
      className="d-flex align-items-center justify-content-between border-color-primary-hover px-3 py-2 rounded-4"
      role="button"
      onClick={() => setChain({ name, card: pool.tokens })}
    >
      <div className="d-flex align-items-center gap-1">
        <div
          className="position-relative"
          style={{ width: "52px", aspectRatio: "72/40" }}
        >
          <div
            className="position-absolute end-0 overflow-hidden"
            style={{ width: "30px", aspectRatio: "1/1" }}
          >
            <img
              src={`/farm/icons/${
                Tokens && Tokens[1] && Tokens[1].toLowerCase()
              }.svg`}
              alt={`${Tokens && Tokens[1]} icon`}
              className="w-100 h-100"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
          <div
            className="position-absolute start-0 overflow-hidden"
            style={{ width: "30px", aspectRatio: "1/1" }}
          >
            <img
              src={`/farm/icons/${
                Tokens && Tokens[0] && Tokens[0].toLowerCase()
              }.svg`}
              alt={`${Tokens && Tokens[0]} icon`}
              className="w-100 h-100"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
        </div>
        <h2 className="caption2 text-primary m-0">
          {pool.tokens && pool.tokens}
        </h2>
      </div>
      <p className="small m-0 text-gray">
        {pool && pool.apr && `APR: ${pool.apr}`}
      </p>
    </div>
  );
}
