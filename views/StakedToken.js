import React, { Suspense } from "react";
import Delegations from "../components/Delegations";
import Rewards from "../components/Rewards";
import Unbonded from "../components/Unbonded";

export default function StakedToken() {
  const dataSet = {
    delegated: "0000.32331",
    rewards: "0000.32331",
    unbonding: "0000.32331",
    usd: "0.021",
  };

  return (
    <section className="rounded-5 p-4 bg-gray-800 width-100 d-flex flex-column gap-3">
      <h4 className="body1 text-primary">Staked Tokens</h4>
      <Suspense>
        <Delegations />
      </Suspense>
      <Suspense>
        <Rewards />
      </Suspense>
      <Suspense>
        <Unbonded />
      </Suspense>
    </section>
  );
}
