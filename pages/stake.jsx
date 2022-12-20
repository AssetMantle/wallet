import React, { useState, useReducer } from "react";
import AllValidators from "../components/AllValidators";
import DelegatedValidators from "../components/DelegatedValidators";
import { useDelegatedValidators, useAllValidators } from "../data/swrStore";
import useStakeReducer from "../data/useStakeReducer";
import StakedToken from "../views/StakedToken";

const Stake = () => {
  const { stakeDispatch, stakeState } = useStakeReducer();
  const [showClaimError, setShowClaimError] = useState(false);
  const [activeValidators, setActiveValidators] = useState(true);
  const [delegated, setDelegated] = useState(false);
  const { allValidators, isLoadingValidators, errorValidators } =
    useAllValidators();
  let validatorsArray = allValidators.sort((a, b) => b.tokens - a.tokens);

  //Put all foundation nodes at the end of the array
  validatorsArray.forEach((item, index) => {
    if (item?.description?.moniker?.includes("Foundation Node")) {
      validatorsArray.push(validatorsArray.splice(index, 1)[0]);
    }
  });

  //Calculate total tokens to calculate voting power
  const totalTokens = validatorsArray.reduce(
    (accumulator, currentValue) => accumulator + parseInt(currentValue.tokens),
    0
  );

  return (
    <>
      <section className="row">
        <div className="card bg-gray-800 col-12 col-lg-8">
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <div className="card-title">Validators</div>
              <div className="btn-group">
                <button
                  className={
                    activeValidators ? "btn btn-primary" : "btn btn-inactive"
                  }
                  onClick={() => setActiveValidators(true)}
                >
                  Active
                </button>
                <button
                  className={
                    !activeValidators ? "btn btn-primary" : "btn btn-inactive"
                  }
                  onClick={() => setActiveValidators(false)}
                >
                  Inactive
                </button>
              </div>
            </div>
          </div>
          <div className="nav-bg">
            <div className="input-group d-flex">
              <span className="input-group-text" id="basic-addon1">
                <i className="bi bi-search text-primary"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                aria-label="Search"
              ></input>
              <div
                className="d-flex align-items-center"
                onClick={() => {
                  setDelegated((prev) => !prev);
                  stakeDispatch({ type: "EMPTY_SELECTED_VALIDATORS" });
                }}
              >
                Delegated
                {delegated ? (
                  <i className="bi bi-toggle-on fs-1 text-primary"></i>
                ) : (
                  <i className="bi bi-toggle-off fs-1 text-primary"></i>
                )}
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>
                      <input type="checkbox"></input>
                    </th>
                    <th className="text-white" scope="col">
                      Rank
                    </th>
                    <th className="text-white" scope="col">
                      Avatar
                    </th>
                    <th className="text-white" scope="col">
                      Validator Name
                    </th>
                    <th className="text-white" scope="col">
                      Voting Power
                    </th>
                    <th className="text-white" scope="col">
                      Commission
                    </th>
                    <th className="text-white" scope="col">
                      Delegated Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {delegated ? (
                    <DelegatedValidators
                      stakeState={stakeState}
                      activeValidators={activeValidators}
                      totalTokens={totalTokens}
                    />
                  ) : (
                    allValidators.length !== 1 &&
                    allValidators && (
                      <AllValidators
                        stakeState={stakeState}
                        validatorsArray={validatorsArray}
                        activeValidators={activeValidators}
                        totalTokens={totalTokens}
                      />
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <StakedToken
          stakeState={stakeState}
          stakeDispatch={stakeDispatch}
          showClaimError={showClaimError}
          setShowClaimError={setShowClaimError}
          totalTokens={totalTokens}
          selectedValidators={stakeState?.selectedValidators}
        />
        <div className="modal " tabIndex="-1" role="dialog" id="manifestModal">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Trsnaction Manifest</h5>
                <button
                  type="button"
                  className="btn-close primary"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-4  d-flex flex-column">
                Transaction Details:
                <div className="nav-bg ">
                  <p>From:</p>
                  <p>mantle10x0k7tfhd4hm4hgasfuyg689khb34w4a6kbd6v2v</p>
                  <p>To:</p>
                  <p>mantle10x0k7tfhd4hm4hgasfuyg689khb34w4a6kbd6v2v</p>
                  <p>Amount</p>
                  <p>12345 $MNTL</p>
                  <p>Transaction Type:</p>
                  <p>Send</p>
                  <p>Transaction Wallet Type:</p>
                  <p>Keplr</p>
                </div>
                <div className="d-flex">
                  <i className="bi bi-exclamation-circle text-error"></i>
                  <p>
                    Upon confirmation, Keplr extension will open. Approve
                    transaction in Keplr.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Stake;
