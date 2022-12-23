import React, { useState, useReducer } from "react";
import AllValidators from "../components/AllValidators";
import DelegatedValidators from "../components/DelegatedValidators";
import Tooltip from "../components/Tooltip";
import { useDelegatedValidators, useAllValidators } from "../data/swrStore";
import useStakeReducer from "../data/useStakeReducer";
import StakedToken from "../views/StakedToken";
import { HiArrowsUpDown } from "react-icons/hi2";

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
        <div className="card bg-gray-800 col-12 col-lg-8 py-3 rounded-5">
          <div className="d-flex align-items-center justify-content-between my-2 w-100">
            <div className="card-title body2 text-primary my-auto">
              Validators
            </div>
            <div className="btn-group">
              <button
                className={`${
                  activeValidators ? "btn btn-primary" : "btn btn-inactive"
                } caption`}
                onClick={() => setActiveValidators(true)}
              >
                Active
              </button>
              <button
                className={`${
                  !activeValidators ? "btn btn-primary" : "btn btn-inactive"
                } caption`}
                onClick={() => setActiveValidators(false)}
              >
                Inactive
              </button>
            </div>
          </div>
          <div className="nav-bg p-2 mt-2 rounded-4">
            <div className="input-group d-flex w-100 p-2">
              <div className="d-flex align-items-center gap-3 w-100">
                <div
                  className="d-flex gap-2 am-input border-color-white rounded-3 py-1 px-3 align-items-center"
                  style={{ flex: "1" }}
                >
                  <span
                    className="input-group-text bg-t p-0 h-100"
                    id="basic-addon1"
                    style={{ border: "none" }}
                  >
                    <i className="bi bi-search text-primary"></i>
                  </span>
                  <input
                    type="text"
                    className="am-input bg-t p-1 w-100 h-100"
                    placeholder="Search"
                    aria-label="Search"
                    style={{ border: "none" }}
                  />
                </div>
                <div
                  className="d-flex gap-2 align-items-center"
                  onClick={() => {
                    setDelegated((prev) => !prev);
                    stakeDispatch({ type: "EMPTY_SELECTED_VALIDATORS" });
                  }}
                >
                  Delegated
                  <Tooltip description="Showcase a list of all validators that you have ever delegated tokens with." />
                  <button
                    className={`d-flex rounded-4 bg-theme-white align-items-center transitionAll justify-content-${
                      delegated ? "end" : "start"
                    }`}
                    style={{ width: "40px", padding: "2px" }}
                  >
                    <div className="p-2 rounded-4 nav-bg"></div>
                  </button>
                </div>
                {/* <button className="d-flex align-items-center gap-2">
                  <HiArrowsUpDown />
                  Sort
                </button> */}
              </div>
              <div className="d-flex w-100 mt-3" style={{ overflowX: "auto" }}>
                <table className="table" style={{ width: "max-content" }}>
                  <thead>
                    <tr>
                      <th>
                        <input type="checkbox"></input>
                      </th>
                      <th
                        className="text-white"
                        scope="col"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Rank
                      </th>
                      <th
                        className="text-white"
                        scope="col"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Avatar
                      </th>
                      <th
                        className="text-white"
                        scope="col"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Validator Name
                      </th>
                      <th
                        className="text-white"
                        scope="col"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Voting Power
                      </th>
                      <th
                        className="text-white"
                        scope="col"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Commission
                      </th>
                      <th
                        className="text-white"
                        scope="col"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Delegated Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {delegated ? (
                      <DelegatedValidators
                        setShowClaimError={setShowClaimError}
                        stakeDispatch={stakeDispatch}
                        stakeState={stakeState}
                        activeValidators={activeValidators}
                        totalTokens={totalTokens}
                      />
                    ) : (
                      allValidators.length !== 1 &&
                      allValidators && (
                        <AllValidators
                          stakeDispatch={stakeDispatch}
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
                <h5 className="modal-title">Transaction Manifest</h5>
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
