import React, { Suspense } from "react";
import Delegations from "../components/Delegations";
import Rewards from "../components/Rewards";
import Unbonded from "../components/Unbonded";
import { sendDelegation } from "../data";

const handleStake = async () => {
  const { response, error } = await sendDelegation(
    dataObject?.delegatorAddress,
    dataObject?.validatorSrcAddress,
    { amount: dataObject?.amount.toString(), denom: "umntl" },
    dataObject?.memo,
    { getSigningStargateClient }
  );
  console.log("response: ", response, " error: ", error);
};

export default function StakedToken({ selectedValidator }) {
  return (
    <section className="col-12 gap-3 pt-3 pt-lg-0 col-lg-4">
      {!selectedValidator.length ? (
        <div className="rounded-5 p-3 my-2 bg-gray-800 width-100 d-flex flex-column ">
          <p>Please select the Validators you wish to take actions on.</p>
        </div>
      ) : null}
      <div className="rounded-5 gap-3 p-4 bg-gray-800 width-100 d-flex flex-column">
        <h4 className="body1 text-primary">Staked Tokens</h4>
        <Suspense>
          <Delegations selectedValidator={selectedValidator || []} />
        </Suspense>
        <Suspense>
          <Rewards selectedValidator={selectedValidator || []} />
        </Suspense>
        {!selectedValidator.length ? (
          <Suspense>
            <Unbonded selectedValidator={selectedValidator || []} />
          </Suspense>
        ) : null}
        {selectedValidator.length === 1 ? (
          <button
            onClick={handleStake}
            className="btn btn-primary w-100 rounded-5"
          >
            Delegate
          </button>
        ) : null}
        {selectedValidator.length > 5 ? (
          <div
            className="d-flex justify-content-between
      "
          >
            <i className="bi bi-exclamation-circle text-error"></i>
            <p className="text-error ">
              Culmulative Rewards can be claimed only for 5 or less validators.{" "}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
