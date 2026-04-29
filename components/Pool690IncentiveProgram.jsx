import React, { useMemo, useState } from "react";
import useSwr from "swr";
import incentiveData from "../data/pool690Incentives.json";
import Tooltip from "./Tooltip";

// Pre-program USD display while the live CMC fetch is in flight or has
// failed. The live price, when available, overrides this.
const FALLBACK_MNTL_USD_PRICE = 0.00008354;

// 6-decimal denoms (umntl + uosmo); 10^6 micro-units per whole coin.
const MNTL_DECIMALS = 6;
const OSMO_DECIMALS = 6;

// Refresh cadence for the live TVL / spot prices and the wall-clock
// elapsed counter on the timeline strip.
const LIVE_REFRESH_MS = 60_000;

// Osmosis LCD ships CORS `*` directly. The CMC call goes through the
// `/api/cmc` Next.js rewrite (next.config.js) since CMC's data-api does
// not expose `Access-Control-Allow-Origin: *`.
//
// CMC IDs: 19686 = AssetMantle (MNTL), 12220 = Osmosis (OSMO),
//           2781 = USD convertId.
const OSMOSIS_POOL_690_LCD =
  "https://lcd.osmosis.zone/osmosis/gamm/v1beta1/pools/690";
const CMC_MNTL_OSMO_URL =
  "/api/cmc/cryptocurrency/quote/latest?id=19686,12220&convertId=2781";
const MNTL_IBC_DENOM_ON_OSMOSIS =
  "ibc/CBA34207E969623D95D057D9B11B0C8B32B89A71F170577D982FDDE623813FFC";

const STATUS_META = {
  pending_start: { label: "Pending", className: "am-status--pending" },
  active: { label: "Active", className: "am-status--active" },
  completed: { label: "Completed", className: "am-status--completed" },
  paused: { label: "Paused", className: "am-status--pending" },
  terminated_early: {
    label: "Terminated",
    className: "am-status--completed",
  },
};

const formatUmntlToMntl = (umntl) => {
  if (umntl === null || umntl === undefined) return "—";
  const s = String(umntl);
  if (s === "0") return "0";
  if (s.length <= MNTL_DECIMALS) return "0";
  const whole = s.slice(0, -MNTL_DECIMALS);
  return whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const compactUmntl = (umntl) => {
  if (umntl === null || umntl === undefined) return "—";
  const s = String(umntl);
  if (s.length <= MNTL_DECIMALS) return "0";
  const whole = Number(s.slice(0, -MNTL_DECIMALS));
  if (whole >= 1_000_000) return `${(whole / 1_000_000).toFixed(2)}M`;
  if (whole >= 1_000) return `${(whole / 1_000).toFixed(1)}K`;
  return whole.toLocaleString();
};

const umntlToUsd = (umntl, price) => {
  if (umntl === null || umntl === undefined) return null;
  if (!Number.isFinite(price)) return null;
  const s = String(umntl);
  if (s === "0") return 0;
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

const formatUsdCompact = (n) => {
  if (n === null || n === undefined) return "—";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 10_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

const formatApr = (v) => {
  if (v === null || v === undefined) return "—";
  return `${(Number(v) * 100).toFixed(2)}%`;
};

const mintscanMantleTxUrl = (hash) =>
  hash ? `https://www.mintscan.io/asset-mantle/tx/${hash}` : null;

const mintscanOsmosisTxUrl = (hash) =>
  hash ? `https://www.mintscan.io/osmosis/tx/${hash}` : null;

const osmosisPoolUrl = (id) => `https://app.osmosis.zone/pool/${id}`;

// Shared SWR fetcher: pool reserves from Osmosis LCD + MNTL/OSMO USD spot
// from CMC, combined into `{ tvlUsd, mntlPrice, osmoPrice }`. Returns
// `null` on partial failure so callers can fall back gracefully.
const fetchPool690Live = async () => {
  const [poolRes, priceRes] = await Promise.all([
    fetch(OSMOSIS_POOL_690_LCD),
    fetch(CMC_MNTL_OSMO_URL),
  ]);
  if (!poolRes.ok || !priceRes.ok) return null;
  const [poolJson, priceJson] = await Promise.all([
    poolRes.json(),
    priceRes.json(),
  ]);
  const assets = poolJson?.pool?.pool_assets ?? [];
  const mntlAsset = assets.find(
    (a) => a?.token?.denom === MNTL_IBC_DENOM_ON_OSMOSIS
  );
  const osmoAsset = assets.find((a) => a?.token?.denom === "uosmo");
  const cmcRows = Array.isArray(priceJson?.data) ? priceJson.data : [];
  const mntlRow = cmcRows.find((r) => r?.id === 19686) ?? cmcRows[0];
  const osmoRow = cmcRows.find((r) => r?.id === 12220) ?? cmcRows[1];
  const mntlPrice = Number(mntlRow?.quotes?.[0]?.price);
  const osmoPrice = Number(osmoRow?.quotes?.[0]?.price);
  if (!mntlAsset || !osmoAsset) return null;
  if (!Number.isFinite(mntlPrice) || !Number.isFinite(osmoPrice)) return null;
  const mntlAmount = Number(mntlAsset.token.amount) / 10 ** MNTL_DECIMALS;
  const osmoAmount = Number(osmoAsset.token.amount) / 10 ** OSMO_DECIMALS;
  if (!Number.isFinite(mntlAmount) || !Number.isFinite(osmoAmount)) return null;
  const tvlUsd = mntlAmount * mntlPrice + osmoAmount * osmoPrice;
  return { tvlUsd, mntlPrice, osmoPrice };
};

// SWR-cached so the center component and the sidebar metrics panel share
// one in-flight fetch and one refresh interval.
const usePool690Live = () => {
  const { data: live } = useSwr("pool690Live", fetchPool690Live, {
    refreshInterval: LIVE_REFRESH_MS,
    revalidateOnFocus: false,
    dedupingInterval: LIVE_REFRESH_MS / 2,
  });
  return live;
};

const useNowMs = () => {
  const [nowMs, setNowMs] = useState(null);
  React.useEffect(() => {
    setNowMs(Date.now());
    const tick = setInterval(() => setNowMs(Date.now()), LIVE_REFRESH_MS);
    return () => clearInterval(tick);
  }, []);
  return nowMs;
};

const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const buildTimelineModel = (program, weeklyReports, nowMs) => {
  const startMs = Date.parse(`${program.start_date}T00:00:00Z`);
  const dayMs = 86_400_000;
  const totalDays = program.duration_days;
  const completedDates = new Set(
    (weeklyReports ?? []).map((r) => r?.date).filter(Boolean)
  );

  const days = [];
  const monthAxis = [];
  let lastMonth = -1;

  for (let i = 0; i < totalDays; i++) {
    const cellStart = startMs + i * dayMs;
    const cellEnd = cellStart + dayMs;
    const d = new Date(cellStart);
    const isMonday = d.getUTCDay() === 1;
    const dateIso = d.toISOString().slice(0, 10);
    const isComplete = isMonday && completedDates.has(dateIso);

    let isPast = false;
    let isToday = false;
    if (Number.isFinite(nowMs)) {
      isPast = nowMs >= cellEnd;
      isToday = nowMs >= cellStart && nowMs < cellEnd;
    }

    const monthIdx = d.getUTCMonth();
    if (monthIdx !== lastMonth) {
      monthAxis.push({
        label: SHORT_MONTHS[monthIdx],
        pct: (i / totalDays) * 100,
      });
      lastMonth = monthIdx;
    }

    days.push({
      idx: i,
      dateIso,
      title: `${dateIso}${isMonday ? " · top-up day" : ""}${
        isComplete ? " · completed" : ""
      }`,
      classes: [
        isMonday ? "is-monday" : "",
        isPast ? "is-past" : "",
        isToday ? "is-today" : "",
        isComplete ? "is-complete" : "",
      ]
        .filter(Boolean)
        .join(" "),
    });
  }

  const daysElapsed = Number.isFinite(nowMs)
    ? Math.max(0, Math.min(totalDays, Math.floor((nowMs - startMs) / dayMs)))
    : 0;
  const pctElapsed = (daysElapsed / totalDays) * 100;

  return { days, monthAxis, daysElapsed, pctElapsed };
};

// ---------- center component (action surface) ----------------------

const Pool690IncentiveProgram = () => {
  const { program, summary, weekly_reports: weeklyReports } = incentiveData;
  const [showHistory, setShowHistory] = useState(false);
  const live = usePool690Live();
  const nowMs = useNowMs();
  const status = STATUS_META[summary.status] || STATUS_META.pending_start;
  const totalWeeks = Math.round(program.duration_days / 7);
  const hasReports = Array.isArray(weeklyReports) && weeklyReports.length > 0;

  const timeline = useMemo(
    () => buildTimelineModel(program, weeklyReports, nowMs),
    [program, weeklyReports, nowMs]
  );

  // Split the canonical program name so the display can hold the
  // pool-id token in upright Fraunces and the program-type phrase in
  // italic — same editorial rhythm, neutral content.
  const titleHead = `Pool #${program.pool.id}`;
  const titleTail =
    program.name.replace(/^Pool\s*#\s*\d+\s*/i, "").trim() ||
    "Liquidity Bootstrap";

  return (
    <div
      className="am-card p-4 d-flex flex-column gap-4"
      style={{ minHeight: "90%" }}
    >
      {/* Eyebrow row — orthogonal context (venue + pair) on the left,
          status pill on the right. The canonical pool tag is in the H2
          below so we don't repeat it here. */}
      <div className="d-flex align-items-baseline justify-content-between gap-3 flex-wrap">
        <span className="am-eyebrow">Osmosis &middot; MNTL/OSMO</span>
        <span className={`am-status ${status.className}`}>
          <span className="am-status-dot" />
          {status.label}
        </span>
      </div>

      {/* Display title — upright pool ID + italic programme type */}
      <h2
        className="am-display m-0"
        style={{ fontSize: "clamp(2.2rem, 4vw, 3.2rem)" }}
      >
        {titleHead} <span className="am-display-italic">{titleTail}.</span>
      </h2>

      {/* Subline: dates + duration + target. All neutral ink-muted —
          the orange accent stays reserved for the CTA + the active
          timeline tick so it carries real signal. */}
      <div className="am-eyebrow d-flex flex-wrap align-items-center gap-2">
        <span>
          {program.start_date} → {program.end_date}
        </span>
        <span style={{ color: "var(--am-ink-subtle)" }}>·</span>
        <span style={{ color: "var(--am-ink-subtle)" }}>
          {program.duration_days} days · target {formatApr(program.target_apr)}{" "}
          {program.peg}-pegged
        </span>
      </div>

      <hr className="am-rule" />

      {/* Primary action */}
      <div className="d-flex flex-wrap align-items-center gap-4">
        <a
          href={osmosisPoolUrl(program.pool.id)}
          target="_blank"
          rel="noreferrer"
          className="am-block-cta"
        >
          Add Liquidity
          <span className="am-block-cta-arrow">→</span>
        </a>
        <div className="am-cta-meta">
          <span className="am-mono">
            MNTL/OSMO &middot; pool #{program.pool.id}
          </span>
          <span className="am-eyebrow" style={{ letterSpacing: "0.14em" }}>
            Lock 1d / 7d / 14d for emissions
          </span>
        </div>
      </div>

      {/* 90-day timeline strip */}
      <div className="am-timeline">
        <div className="am-timeline-meta">
          <span className="am-eyebrow d-flex align-items-center gap-2">
            Day {timeline.daysElapsed} of {program.duration_days}
            <Tooltip description="Wall-clock day counter. Each tick below is one day; taller ticks are Mondays — the day the operator bot tops up the gauge." />
          </span>
          <span className="am-eyebrow">
            <span className="am-mono">{timeline.pctElapsed.toFixed(1)}%</span>{" "}
            elapsed
          </span>
        </div>
        <div
          className="am-timeline-track"
          role="img"
          aria-label={`${program.duration_days}-day program timeline; ${timeline.daysElapsed} days elapsed`}
        >
          {timeline.days.map((d) => (
            <span
              key={d.idx}
              className={`am-timeline-tick ${d.classes}`}
              style={{ "--i": d.idx }}
              title={d.title}
            />
          ))}
        </div>
        <div className="am-timeline-axis">
          {timeline.monthAxis.map((m) => (
            <span
              key={`${m.label}-${m.pct.toFixed(1)}`}
              style={{ left: `${m.pct}%` }}
            >
              {m.label}
            </span>
          ))}
        </div>
      </div>

      {/* Lock-split chips. Gauge IDs are technical detail — kept out
          of the chip face and exposed via Tooltip for the curious. */}
      <div className="d-flex flex-wrap gap-2 align-items-center">
        <span className="am-eyebrow d-flex align-items-center gap-2">
          Lock split
          <Tooltip description="Share of the weekly MNTL emission directed to each lock-duration gauge on Osmosis pool #690." />
        </span>
        {["1d", "7d", "14d"].map((bucket) => {
          const pct = Math.round(program.lock_split[bucket] * 100);
          const gauge = program.gauge_ids?.[bucket];
          return (
            <span
              key={bucket}
              className="am-lockchip"
              title={gauge != null ? `Gauge #${gauge}` : undefined}
            >
              <strong className="am-mono">{bucket}</strong>
              <em>{pct}%</em>
            </span>
          );
        })}
      </div>

      <hr className="am-rule" />

      {/* Top-up history — neutral label */}
      <div className="d-flex flex-column gap-2">
        <div className="d-flex align-items-baseline justify-content-between">
          <h3 className="am-display m-0" style={{ fontSize: "1.25rem" }}>
            Top-up history{" "}
            <span className="am-eyebrow" style={{ marginLeft: "8px" }}>
              {hasReports
                ? `${weeklyReports.length} of ${totalWeeks}`
                : `0 of ${totalWeeks}`}
            </span>
          </h3>
          {hasReports && (
            <button
              type="button"
              className="am-toggle"
              onClick={() => setShowHistory((v) => !v)}
            >
              {showHistory ? "Hide" : "Show"}
            </button>
          )}
        </div>

        {!hasReports && (
          <p
            className="am-mono m-0"
            style={{ fontSize: "12.5px", color: "var(--am-ink-muted)" }}
          >
            The first record appears after the first Monday following{" "}
            <span className="am-mono" style={{ color: "var(--am-ink)" }}>
              {program.start_date}
            </span>
            .
          </p>
        )}

        {hasReports && showHistory && (
          <div style={{ overflowX: "auto" }}>
            <table className="am-ledger">
              <thead>
                <tr>
                  <th>Wk</th>
                  <th>Date</th>
                  <th>TVL</th>
                  <th>APR</th>
                  <th>Top-up MNTL</th>
                  <th>USD</th>
                  <th>IBC</th>
                  <th>Gauge</th>
                </tr>
              </thead>
              <tbody>
                {weeklyReports.map((r, idx) => (
                  <tr key={`row-${idx}-${r.week ?? "null"}`}>
                    <td>{r.week ?? idx + 1}</td>
                    <td>{r.date ?? "—"}</td>
                    <td>{r.tvl_usd == null ? "—" : formatUsd(r.tvl_usd)}</td>
                    <td>{formatApr(r.observed_apr)}</td>
                    <td>
                      {r.top_up_mntl
                        ? `${formatUmntlToMntl(r.top_up_mntl)}`
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
                        >
                          {r.ibc_tx_hash.slice(0, 6)}…
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
                        >
                          {r.gauge_tx_hash.slice(0, 6)}…
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
      {/* Suppress unused-binding warning when only the live data flag
          is consumed indirectly via the SWR cache. */}
      <span aria-hidden="true" style={{ display: "none" }}>
        {live ? "1" : "0"}
      </span>
    </div>
  );
};

// ---------- side panel: metric tiles + hover popovers --------------

export const Pool690MetricsPanel = () => {
  const { program, summary } = incentiveData;
  const live = usePool690Live();
  const effectiveMntlPrice = live?.mntlPrice ?? FALLBACK_MNTL_USD_PRICE;
  const remainingUsd = umntlToUsd(
    summary.remaining_budget_mntl,
    effectiveMntlPrice
  );
  const displayedTvlUsd =
    live?.tvlUsd != null ? live.tvlUsd : summary.last_tvl_usd;
  const tvlIsLive = live?.tvlUsd != null;

  return (
    <div className="d-flex flex-column gap-3">
      <div className="am-card p-3">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span className="am-eyebrow">Metrics</span>
          <span className="am-eyebrow d-flex align-items-center gap-2">
            {tvlIsLive ? (
              <>
                <span className="am-pulse" aria-hidden="true" />
                Live
              </>
            ) : (
              <span style={{ color: "var(--am-ink-subtle)" }}>Cached</span>
            )}
          </span>
        </div>

        <div className="am-specimen">
          <div className="am-specimen-value">
            {formatApr(program.target_apr)}
          </div>
          <div className="am-specimen-label">
            Target APR
            <Tooltip
              description={`USD-pegged ${formatApr(
                program.target_apr
              )} target across the ${
                program.duration_days
              }-day program. Operator bot adjusts weekly emissions to keep the realised APR at or above target.`}
            />
          </div>
        </div>

        <div className="am-specimen">
          <div className="am-specimen-value">
            {summary.last_observed_apr != null
              ? formatApr(summary.last_observed_apr)
              : "—"}
          </div>
          <div className="am-specimen-label">
            Last observed APR
            <Tooltip
              description={
                summary.last_top_up_date
                  ? `Realised APR as of the ${summary.last_top_up_date} top-up.`
                  : "Awaiting first Monday top-up — the first reading is published with the first history entry."
              }
            />
          </div>
        </div>

        <div className="am-specimen">
          <div className="am-specimen-value">
            {displayedTvlUsd == null ? "—" : formatUsdCompact(displayedTvlUsd)}
          </div>
          <div className="am-specimen-sub">
            {displayedTvlUsd == null ? "" : formatUsd(displayedTvlUsd)}
          </div>
          <div className="am-specimen-label">
            Current TVL
            <Tooltip
              description={
                tvlIsLive
                  ? "Live: pool reserves × spot prices, refreshed every 60s from Osmosis LCD + CoinMarketCap."
                  : "Last bot-reported value; live fetch unavailable."
              }
            />
          </div>
        </div>

        <div className="am-specimen">
          <div className="am-specimen-value">
            {compactUmntl(summary.remaining_budget_mntl)}
            <span className="am-specimen-value-unit">MNTL</span>
          </div>
          <div className="am-specimen-sub">≈ {formatUsd(remainingUsd)}</div>
          <div className="am-specimen-label">
            Remaining budget
            <Tooltip
              description={`MNTL still allocated to weekly top-ups for the rest of the program. Total budget: ${formatUmntlToMntl(
                program.total_budget_mntl ?? "0"
              )} MNTL.`}
            />
          </div>
        </div>
      </div>

      <div className="am-card p-3">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="am-eyebrow">Other venues</span>
          <Tooltip description="MNTL liquidity outside the bootstrap. AssetMantle is no longer indexed by CoinGecko / DefiLlama, so figures are pulled directly on-chain." />
        </div>
        <ul className="am-list">
          <li>
            <a
              href="https://app.osmosis.zone/pool/690"
              target="_blank"
              rel="noopener noreferrer"
              className="am-list-row"
            >
              <span>
                Osmosis #690 <em>MNTL/OSMO</em>
              </span>
              <span className="am-list-arrow">→</span>
            </a>
          </li>
          <li>
            <a
              href="https://app.osmosis.zone/pool/738"
              target="_blank"
              rel="noopener noreferrer"
              className="am-list-row"
            >
              <span>
                Osmosis #738 <em>MNTL/USDC</em>
              </span>
              <span className="am-list-arrow">→</span>
            </a>
          </li>
          <li>
            <a
              href="https://app.osmosis.zone/pool/686"
              target="_blank"
              rel="noopener noreferrer"
              className="am-list-row"
            >
              <span>
                Osmosis #686 <em>MNTL/ATOM</em>
              </span>
              <span className="am-list-arrow">→</span>
            </a>
          </li>
        </ul>
      </div>

      {(program.announce_urls?.plan_doc ||
        program.announce_urls?.proposal ||
        program.announce_urls?.forum) && (
        <div className="am-card p-3">
          <div className="am-eyebrow mb-2">References</div>
          <ul className="am-list">
            {program.announce_urls?.plan_doc && (
              <li>
                <a
                  href={program.announce_urls.plan_doc}
                  target="_blank"
                  rel="noreferrer"
                  className="am-list-row"
                >
                  <span>
                    Plan <em>document</em>
                  </span>
                  <span className="am-list-arrow">→</span>
                </a>
              </li>
            )}
            {program.announce_urls?.proposal && (
              <li>
                <a
                  href={program.announce_urls.proposal}
                  target="_blank"
                  rel="noreferrer"
                  className="am-list-row"
                >
                  <span>
                    Governance <em>proposal</em>
                  </span>
                  <span className="am-list-arrow">→</span>
                </a>
              </li>
            )}
            {program.announce_urls?.forum && (
              <li>
                <a
                  href={program.announce_urls.forum}
                  target="_blank"
                  rel="noreferrer"
                  className="am-list-row"
                >
                  <span>
                    Forum <em>discussion</em>
                  </span>
                  <span className="am-list-arrow">→</span>
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Pool690IncentiveProgram;
