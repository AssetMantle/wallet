import { useChain } from "@cosmos-kit/react";
import React, { Suspense } from "react";
import Delegations from "../components/Delegations";
import Rewards from "../components/Rewards";
import Unbonded from "../components/Unbonded";
import { defaultChainName, defaultChainSymbol } from "../config";
import { fromDenom, sendDelegation, useAvailableBalance } from "../data";

export default function StakedToken({
  totalTokens,
  setShowClaimError,
  showClaimError,
  stakeState,
  stakeDispatch,
}) {
  const { availableBalance } = useAvailableBalance();
  const walletManager = useChain(defaultChainName);
  const { getSigningStargateClient, address, status } = walletManager;

  const handleStake = async (validator) => {
    const { response, error } = await sendDelegation(
      address,
      stakeState?.delegationAddress,
      stakeState?.delegationAmount,
      stakeState?.memo,
      { getSigningStargateClient }
    );
    console.log("response: ", response, " error: ", error);
  };

  return (
    <section className="gap-3 pt-3 pt-lg-0">
      {!stakeState?.selectedValidators?.length ? (
        <div className="rounded-4 p-3 my-2 bg-gray-800 width-100 d-flex flex-column ">
          <p>Please select the Validators you wish to take actions on.</p>
        </div>
      ) : null}
      <div className="rounded-4 gap-3 p-3 bg-gray-800 width-100 d-flex flex-column">
        <h4 className="body1 text-primary">Staked Tokens</h4>
        <Suspense>
          <Delegations
            stakeState={stakeState}
            stakeDispatch={stakeDispatch}
            totalTokens={totalTokens}
          />
        </Suspense>
        <Suspense>
          <Rewards
            stakeState={stakeState}
            setShowClaimError={setShowClaimError}
          />
        </Suspense>
        <Suspense>
          <Unbonded stakeState={stakeState} stakeDispatch={stakeDispatch} />
        </Suspense>
        {stakeState?.selectedValidators?.length === 1 ? (
          <button
            className="button-primary text-center px-3 py-2"
            style={{ maxWidth: "100%" }}
            onClick={() =>
              stakeDispatch({
                type: "SET_DELEGATION_ADDRESS",
                payload: stakeState?.selectedValidators[0],
              })
            }
            data-bs-toggle="modal"
            data-bs-target="#delegateModal"
          >
            Delegate
          </button>
        ) : null}
        {stakeState?.selectedValidators?.length > 5 || showClaimError ? (
          <div className="d-flex justify-content-between">
            <p className="text-error">
              <i className="bi bi-exclamation-circle text-error"></i>{" "}
              Culmulative Rewards can be claimed only for 5 or less validators
            </p>
          </div>
        ) : null}
        <div className="modal " tabIndex="-1" role="dialog" id="delegateModal">
          <div className="modal-dialog modal-dialog-centered" role="document">
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
                  Delegate
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
              <div className="modal-body p-4 text-center d-flex flex-column">
                <div className="d-flex my-2 justify-content-between">
                  <label htmlFor="delegationAmount caption text-gray">
                    Delegation Amount
                  </label>{" "}
                  <small className="text-gray caption2">
                    Balance : {fromDenom(availableBalance).toString()}&nbsp;
                    {defaultChainSymbol}
                  </small>
                </div>
                <div>
                  <div className="p-3 border-white py-2 d-flex rounded-2 gap-2 am-input">
                    <input
                      className="bg-t"
                      id="delegationAmount"
                      style={{ flex: "1", border: "none", outline: "none" }}
                      type="text"
                      value={stakeState?.delegationAmount}
                      placeholder="Enter Delegation Amount"
                      onChange={(e) =>
                        stakeDispatch({
                          type: "CHANGE_DELEGATION_AMOUNT",
                          payload: e.target.value,
                        })
                      }
                    ></input>
                    <button
                      onClick={() =>
                        stakeDispatch({
                          type: "SET_MAX_DELEGATION_AMOUNT",
                        })
                      }
                      className="text-primary"
                    >
                      Max
                    </button>
                  </div>
                  <small
                    id="amountInputErrorMsg"
                    className="form-text text-danger d-flex align-items-center gap-1"
                  >
                    {stakeState?.errorMessages?.transferAmountErrorMsg && (
                      <i className="bi bi-info-circle" />
                    )}{" "}
                    {stakeState?.errorMessages?.transferAmountErrorMsg}
                  </small>
                </div>
              </div>
              <div className="modal-footer ">
                <button
                  onClick={() => {
                    handleStake();
                  }}
                  type="button"
                  className="button-primary px-5 py-2"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
