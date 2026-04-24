import React, { useEffect, useState } from "react";
import incentiveData from "../data/pool690Incentives.json";

// Used for pre-program USD display when the live CoinGecko fetch has not yet
// resolved (or has failed). The live price, when available, overrides this.
const FALLBACK_MNTL_USD_PRICE = 0.00008354;

// 6-decimal denom (umntl) and likewise uosmo. 10^6 micro-units per whole coin.
const MNTL_DECIMALS = 6;
const OSMO_DECIMALS = 6;

// Endpoints for the one-shot client-side refresh of pool TVL + MNTL/OSMO
// prices. Both endpoints serve CORS `Access-Control-Allow-Origin: *` headers
// so the browser can reach them directly from any wallet.assetmantle.one
// origin.
const OSMOSIS_POOL_690_LCD =
  "https://lcd.osmosis.zone/osmosis/gamm/v1beta1/pools/690";
const COINGECKO_MNTL_OSMO_URL =
  "https://api.coingecko.com/api/v3/simple/price?ids=assetmantle,osmosis&vs_currencies=usd";
const MNTL_IBC_DENOM_ON_OSMOSIS =
  "ibc/CBA34207E969623D95D057D9B11B0C8B32B89A71F170577D982FDDE623813FFC";

const STATUS_META = {
  pending_start: { label: "Pending", symbol: "⏳", className: "text-warning" },
  active: { label: "Active", symbol: "🟢", className: "text-success" },
  completed: { label: "Completed", symbol: "✅", className: "text-info" },
  paused: { label: "Paused", symbol: "🛑", className: "text-warning" },
  terminated_early: {
    label: "Terminated",
    symbol: "🔴",
    className: "text-danger",
  },
};

const formatUmntlToMntl = (umntl) => {
  // umntl is passed as a string to keep big-integer precision
  if (umntl === null || umntl === undefined) return "—";
  const s = String(umntl);
  if (s === "0") return "0";
  // Drop last MNTL_DECIMALS chars; floor
  if (s.length <= MNTL_DECIMALS) {
    return "0";
  }
  const whole = s.slice(0, -MNTL_DECIMALS);
  // Insert thousands separators without relying on Number (precision loss)
  return whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const umntlToUsd = (umntl, price) => {
  if (umntl === null || umntl === undefined) return null;
  if (!Number.isFinite(price)) return null;
  const s = String(umntl);
  if (s === "0") return 0;
  // Budget in MNTL (~5.6e7) * price (~8.3e-5) ≈ $4,700 — safely in Number range.
  if (s.length <= MNTL_DECIMALS) return 0;
  const whole = Number(s.slice(0, -MNTL_DECIMALS));
  return whole * price;
};

const formatUsd = (n, digits = 2) => {
  if (n === null || n === undefined) return "—";
  return `$${Number(n).toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  })}`;
};

const formatApr = (v) => {
  if (v === null || v === undefined) return "—";
  return `${(Number(v) * 100).toFixed(2)}%`;
};

const mintscanMantleTxUrl = (hash) =>
  hash ? `https://www.mintscan.io/assetmantle/txs/${hash}` : null;

const mintscanOsmosisTxUrl = (hash) =>
  hash ? `https://www.mintscan.io/osmosis/txs/${hash}` : null;

const osmosisPoolUrl = (id) => `https://app.osmosis.zone/pool/${id}`;

const Pool690IncentiveProgram = () => {
  const { program, summary, weekly_reports: weeklyReports } = incentiveData;
  const [showHistory, setShowHistory] = useState(false);
  // Live TVL + spot prices fetched client-side on mount. `null` until the
  // fetch resolves; if the fetch fails we fall back silently to the values
  // in incentiveData (which the bot maintains).
  const [live, setLive] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [poolRes, priceRes] = await Promise.all([
          fetch(OSMOSIS_POOL_690_LCD),
          fetch(COINGECKO_MNTL_OSMO_URL),
        ]);
        if (!poolRes.ok || !priceRes.ok) return;
        const [poolJson, priceJson] = await Promise.all([
          poolRes.json(),
          priceRes.json(),
        ]);
        const assets = poolJson?.pool?.pool_assets ?? [];
        const mntlAsset = assets.find(
          (a) => a?.token?.denom === MNTL_IBC_DENOM_ON_OSMOSIS
        );
        const osmoAsset = assets.find((a) => a?.token?.denom === "uosmo");
        const mntlPrice = Number(priceJson?.assetmantle?.usd);
        const osmoPrice = Number(priceJson?.osmosis?.usd);
        if (!mntlAsset || !osmoAsset) return;
        if (!Number.isFinite(mntlPrice) || !Number.isFinite(osmoPrice)) return;
        const mntlAmount = Number(mntlAsset.token.amount) / 10 ** MNTL_DECIMALS;
        const osmoAmount = Number(osmoAsset.token.amount) / 10 ** OSMO_DECIMALS;
        if (!Number.isFinite(mntlAmount) || !Number.isFinite(osmoAmount))
          return;
        const tvlUsd = mntlAmount * mntlPrice + osmoAmount * osmoPrice;
        if (!cancelled) {
          setLive({ tvlUsd, mntlPrice, osmoPrice });
        }
      } catch (_) {
        // Silent fallback to JSON-reported values. Any error in the live
        // refresh path should not block rendering the card.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const status = STATUS_META[summary.status] || STATUS_META.pending_start;

  const totalWeeks = Math.round(program.duration_days / 7);
  const weeksCompleted = Math.min(summary.weeks_completed || 0, totalWeeks);
  const pctComplete = totalWeeks > 0 ? (weeksCompleted / totalWeeks) * 100 : 0;

  const effectiveMntlPrice = live?.mntlPrice ?? FALLBACK_MNTL_USD_PRICE;
  const remainingUsd = umntlToUsd(
    summary.remaining_budget_mntl,
    effectiveMntlPrice
  );

  const displayedTvlUsd =
    live?.tvlUsd != null ? live.tvlUsd : summary.last_tvl_usd;
  const tvlCaption = live?.tvlUsd != null ? "live" : "last reported";

  const hasReports = Array.isArray(weeklyReports) && weeklyReports.length > 0;

  return (
    <div
      className="bg-gray-800 p-3 rounded-4 d-flex flex-column gap-3 text-white mb-3 w-100"
      style={{ width: "100%" }}
    >
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
        <div className="d-flex align-items-center gap-2">
          <h2 className="body1 text-primary my-auto">{program.name}</h2>
          <span
            className={`caption ${status.className}`}
            title={`Program status: ${status.label}`}
          >
            {status.symbol} {status.label}
          </span>
        </div>
        <div className="d-flex align-items-center gap-2 caption2 text-white-300">
          <span>
            {program.start_date} → {program.end_date}
          </span>
          <span>·</span>
          <span>{program.duration_days} days</span>
        </div>
      </div>

      {/* Metric tiles */}
      <div className="row g-2">
        <div className="col-12 col-sm-6 col-md-3">
          <div className="nav-bg rounded-3 p-2 h-100">
            <div className="caption2 text-white-300">Target APR</div>
            <div className="body1 text-white">
              {formatApr(program.target_apr)}
            </div>
            <div className="caption2 text-white-300">{program.peg}-pegged</div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <div className="nav-bg rounded-3 p-2 h-100">
            <div className="caption2 text-white-300">Last observed APR</div>
            <div className="body1 text-white">
              {formatApr(summary.last_observed_apr)}
            </div>
            <div className="caption2 text-white-300">
              {summary.last_top_up_date
                ? `as of ${summary.last_top_up_date}`
                : "no top-ups yet"}
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <div className="nav-bg rounded-3 p-2 h-100">
            <div className="caption2 text-white-300">Current TVL</div>
            <div className="body1 text-white">
              {displayedTvlUsd == null ? "—" : formatUsd(displayedTvlUsd)}
            </div>
            <div className="caption2 text-white-300">
              pool #{program.pool.id}
              {displayedTvlUsd != null && ` · ${tvlCaption}`}
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <div className="nav-bg rounded-3 p-2 h-100">
            <div className="caption2 text-white-300">Remaining budget</div>
            <div className="body1 text-white">
              {formatUmntlToMntl(summary.remaining_budget_mntl)} MNTL
            </div>
            <div className="caption2 text-white-300">
              ≈ {formatUsd(remainingUsd)}
            </div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="d-flex flex-column gap-1">
        <div className="d-flex justify-content-between caption2 text-white-300">
          <span>
            Week {weeksCompleted} of {totalWeeks}
          </span>
          <span>{pctComplete.toFixed(0)}% elapsed</span>
        </div>
        <div
          className="nav-bg rounded-pill"
          style={{ height: "8px", overflow: "hidden" }}
        >
          <div
            className="bg-primary"
            style={{
              width: `${pctComplete}%`,
              height: "100%",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Lock-duration split summary */}
      <div className="d-flex flex-wrap gap-3 caption2 text-white-300">
        <span>
          Lock-duration split:{" "}
          {["1d", "7d", "14d"].map((bucket, i) => {
            const pct = Math.round(program.lock_split[bucket] * 100);
            const gauge = program.gauge_ids?.[bucket];
            return (
              <React.Fragment key={bucket}>
                {i > 0 && " / "}
                {bucket} {pct}%{gauge != null && ` (gauge #${gauge})`}
              </React.Fragment>
            );
          })}
        </span>
        <span>Top-up cadence: weekly (Mon 00:00 UTC)</span>
      </div>

      {/* Weekly reports */}
      <div className="d-flex flex-column gap-2">
        <div className="d-flex align-items-center justify-content-between">
          <h3 className="caption text-white my-auto">
            Top-up history ({hasReports ? weeklyReports.length : 0})
          </h3>
          {hasReports && (
            <button
              type="button"
              className="btn btn-sm btn-outline-light caption2"
              onClick={() => setShowHistory((v) => !v)}
            >
              {showHistory ? "Hide" : "Show"}
            </button>
          )}
        </div>
        {!hasReports && (
          <p className="caption2 text-white-300 my-0">
            No weekly reports yet. The program is {status.label.toLowerCase()};
            the first report will appear after the first Monday top-up following{" "}
            {program.start_date}.
          </p>
        )}
        {hasReports && showHistory && (
          <div style={{ overflowX: "auto" }}>
            <table className="table caption2 text-white-300 mb-0">
              <thead>
                <tr>
                  <th className="text-white">Week</th>
                  <th className="text-white">Date</th>
                  <th className="text-white">TVL (USD)</th>
                  <th className="text-white">Observed APR</th>
                  <th className="text-white">Top-up (MNTL)</th>
                  <th className="text-white">Top-up (USD)</th>
                  <th className="text-white">IBC tx</th>
                  <th className="text-white">Gauge tx</th>
                </tr>
              </thead>
              <tbody>
                {weeklyReports.map((r, idx) => (
                  <tr key={`${r.week ?? idx}`}>
                    <td>{r.week ?? idx + 1}</td>
                    <td>{r.date ?? "—"}</td>
                    <td>{r.tvl_usd == null ? "—" : formatUsd(r.tvl_usd)}</td>
                    <td>{formatApr(r.observed_apr)}</td>
                    <td>
                      {r.top_up_mntl
                        ? `${formatUmntlToMntl(r.top_up_mntl)} MNTL`
                        : "—"}
                    </td>
                    <td>
                      {r.top_up_usd == null ? "—" : formatUsd(r.top_up_usd)}
                    </td>
                    <td>
                      {r.ibc_tx_hash ? (
                        <a
                          href={mintscanMantleTxUrl(r.ibc_tx_hash)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary"
                        >
                          {r.ibc_tx_hash.slice(0, 8)}…{" "}
                          <i className="bi bi-arrow-up-right"></i>
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      {r.gauge_tx_hash ? (
                        <a
                          href={mintscanOsmosisTxUrl(r.gauge_tx_hash)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary"
                        >
                          {r.gauge_tx_hash.slice(0, 8)}…{" "}
                          <i className="bi bi-arrow-up-right"></i>
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Metadata footer */}
      <div className="d-flex flex-wrap gap-3 caption2 text-white-300 border-top pt-2">
        <a
          href={osmosisPoolUrl(program.pool.id)}
          target="_blank"
          rel="noreferrer"
          className="text-primary"
        >
          Pool #{program.pool.id} on Osmosis{" "}
          <i className="bi bi-arrow-up-right"></i>
        </a>
        {program.announce_urls?.plan_doc && (
          <a
            href={program.announce_urls.plan_doc}
            target="_blank"
            rel="noreferrer"
            className="text-primary"
          >
            Plan doc <i className="bi bi-arrow-up-right"></i>
          </a>
        )}
        {program.announce_urls?.proposal && (
          <a
            href={program.announce_urls.proposal}
            target="_blank"
            rel="noreferrer"
            className="text-primary"
          >
            Gov proposal <i className="bi bi-arrow-up-right"></i>
          </a>
        )}
        {program.announce_urls?.forum && (
          <a
            href={program.announce_urls.forum}
            target="_blank"
            rel="noreferrer"
            className="text-primary"
          >
            Forum discussion <i className="bi bi-arrow-up-right"></i>
          </a>
        )}
      </div>
    </div>
  );
};

export default Pool690IncentiveProgram;
