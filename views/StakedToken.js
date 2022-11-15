import React from "react";

export default function StakedToken() {
  const dataSet = {
    delegated: "0000.32331",
    rewards: "0000.32331",
    unbonding: "0000.32331",
  };
  return (
    <section className="rounded-5 p-4 bg-gray-800 width-100 d-flex flex-column gap-3">
      <h4 className="body1 text-primary">Staked Tokens</h4>
      <div className="nav-bg p-3 rounded-4 gap-3">
        <div className="d-flex flex-column gap-2">
          <p className="caption d-flex gap-2 align-items-center">Delegated</p>
          <p className="caption">{dataSet.delegated} $MNTL</p>
          <button className="am-link text-start">View</button>
        </div>
      </div>
      <div className="nav-bg p-3 rounded-4 gap-3">
        <div className="d-flex flex-column gap-2">
          <p className="caption d-flex gap-2 align-items-center">Rewards</p>
          <p className="caption">{dataSet.rewards} $MNTL</p>
          <button className="am-link text-start">Claim</button>
        </div>
      </div>
      <div className="nav-bg p-3 rounded-4 gap-3">
        <div className="d-flex flex-column gap-2">
          <p className="caption d-flex gap-2 align-items-center">Unbonding</p>
          <p className="caption">{dataSet.unbonding} $MNTL</p>
        </div>
      </div>
    </section>
  );
}
