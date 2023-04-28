import React, { useState } from "react";
import Stake from "./Stake";
import Unstake from "./Unstake";

export default function LiquidityPoolCard({
  pool,
  selectedCard,
  Connected,
  setConnected,
}) {
  const [HaveReward, setHaveReward] = useState(false);
  const [Error, setError] = useState(false);
  const [Tokens] = useState(pool && pool.tokens && pool.tokens.split(" – "));

  return (
    selectedCard === pool.tokens && (
      <>
        <div className="bg-gray-800 p-4 rounded-4 d-flex flex-column gap-3">
          <div className="d-flex align-items-center justify-content-between gap-3">
            <div className="d-flex align-items-center gap-3">
              <div
                className="position-relative"
                style={{ width: "72px", aspectRatio: "72/40" }}
              >
                <div
                  className="position-absolute end-0 overflow-hidden"
                  style={{ width: "40px", aspectRatio: "1/1" }}
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
                  style={{ width: "40px", aspectRatio: "1/1" }}
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
              <h2 className="h3 m-0">{pool.tokens && pool.tokens}</h2>
            </div>
            {HaveReward && (
              <button className="am-link px-2">Claim Reward</button>
            )}
          </div>
          <div className="border-bottom"></div>
          <div className="row">
            <div className="col-7 py-2">
              <div className="row">
                <div className="col-6 text-gray caption">Reward Pool</div>
                <div className="col-6 caption">
                  {pool.rewardPool && pool.rewardPool}
                </div>
              </div>
            </div>
            <div className="col-4 py-2">
              {pool.tvl && (
                <div className="row">
                  <div className="col-6 text-gray caption">TVL</div>
                  <div className="col-6 caption">{pool.tvl}</div>
                </div>
              )}
            </div>
            <div className="col-7 py-2">
              <div className="row">
                <div className="col-6 text-gray caption">Duration</div>
                <div className="col-6 caption">
                  {pool.duration && pool.duration}
                </div>
              </div>
            </div>
            <div className="col-4 py-2">
              {pool.apr && (
                <div className="row">
                  <div className="col-6 text-gray caption">APR</div>
                  <div className="col-6 caption">{pool.apr}</div>
                </div>
              )}
            </div>
          </div>
          <div className="border-bottom"></div>
          {Error && (
            <p className="">
              <i className="bi bi-info-circle text-white" />{" "}
              <span className="caption text-white">
                Insufficient balance to stake in Liquidity Pool.
              </span>{" "}
              <a
                href={pool.lpTokenLink && pool.lpTokenLink}
                target="_blank"
                rel="noopener noreferrer"
                className="am-link"
              >
                <span className="text-primary caption">Get LP Tokens</span>{" "}
                <i className="text-primary bi bi-arrow-up-right caption"></i>
              </a>
            </p>
          )}
          <div className="d-flex justify-content-end gap-2">
            {pool.stakeType && pool.stakeType === "external" ? (
              <>
                <a
                  href="http://"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="button-primary px-5 py-2 d-flex gap-2"
                >
                  Stake <i className="bi bi-arrow-up-right"></i>
                </a>
              </>
            ) : Connected ? (
              <>
                <button
                  className="button-secondary px-5 py-2 d-flex gap-2"
                  // onClick={() => setConnected(true)}
                  data-bs-toggle="modal"
                  data-bs-target="#cardUnstake"
                >
                  Unstake
                </button>
                <button
                  className="button-primary px-5 py-2 d-flex gap-2"
                  // onClick={() => setConnected(true)}
                  data-bs-toggle="modal"
                  data-bs-target="#cardStake"
                >
                  Stake
                </button>
              </>
            ) : (
              <button
                className="button-primary px-5 py-2 d-flex gap-2"
                onClick={() => setConnected(true)}
              >
                <i className="bi bi-wallet2"></i> Connect Wallet
              </button>
            )}
          </div>
        </div>

        {/* stake modal */}
        <div className="modal " tabIndex="-1" role="dialog" id="cardStake">
          <div
            className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title body2 text-primary d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="btn-close primary"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    style={{ background: "none" }}
                  >
                    <span className="text-primary">
                      <i className="bi bi-chevron-left" />
                    </span>
                  </button>
                  Stake
                </h5>
                <button
                  type="button"
                  className="btn-close primary"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  style={{ background: "none" }}
                >
                  <span className="text-primary">
                    <i className="bi bi-x-lg" />
                  </span>
                </button>
              </div>
              <div className="modal-body p-3  d-flex flex-column">
                <div className="nav-bg rounded-4 d-flex flex-column py-1 px-4 gap-2 align-items-center justify-content-center">
                  {React.Children.toArray(
                    [...Array(10)].map(() => (
                      <Stake
                        liquidity={"17,414,809.61"}
                        tokenId={"0x0x010x0k7tfhd4hm4hg"}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* unstake modal */}
        <div className="modal " tabIndex="-1" role="dialog" id="cardUnstake">
          <div
            className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title body2 text-primary d-flex align-items-center gap-2">
                  <button
                    type="button"
                    className="btn-close primary"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    style={{ background: "none" }}
                  >
                    <span className="text-primary">
                      <i className="bi bi-chevron-left" />
                    </span>
                  </button>
                  Unstake
                </h5>
                <button
                  type="button"
                  className="btn-close primary"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  style={{ background: "none" }}
                >
                  <span className="text-primary">
                    <i className="bi bi-x-lg" />
                  </span>
                </button>
              </div>
              <div className="modal-body p-3  d-flex flex-column">
                <div className="nav-bg rounded-4 d-flex flex-column py-1 px-4 gap-2 align-items-center justify-content-center">
                  {React.Children.toArray(
                    [...Array(10)].map(() => (
                      <Unstake
                        liquidity={"17,414,809.61"}
                        tokenId={"0x0x010x0k7tfhd4hm4hg"}
                      />
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
}
