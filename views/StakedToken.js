import React, { Suspense } from "react";
import Delegations from "../components/Delegations";
import Rewards from "../components/Rewards";
import Unbonded from "../components/Unbonded";

export default function StakedToken({ selectedValidator }) {
  return (
    <section className="rounded-5 p-4 bg-gray-800 width-100 d-flex flex-column gap-3 col-12 pt-3 pt-lg-0 col-lg-4">
      <h4 className="body1 text-primary">Staked Tokens</h4>
      <Suspense>
        <Delegations selectedValidator={selectedValidator} />
      </Suspense>
      <Suspense>
        <Rewards selectedValidator={selectedValidator} />
      </Suspense>
      <Suspense>
        <Unbonded selectedValidator={selectedValidator} />
      </Suspense>
    </section>
  );
}
