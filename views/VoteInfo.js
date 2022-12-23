import React from "react";
import { sendVote } from "../data/txApi";
import { useWallet } from "@cosmos-kit/react";

const VoteInfo = ({ voteState, voteDispatch }) => {
  const walletManager = useWallet();
  const { getSigningStargateClient, address, status } = walletManager;
  const handleVote = async () => {
    const { response, error } = await sendVote(
      voteState?.proposalID,
      address,
      voteState?.voteOption,
      voteState?.memo,
      { getSigningStargateClient }
    );
    console.log("response: ", response, " error: ", error);
  };

  return (
    <div className="col-12 pt-3 pt-lg-0 col-lg-4">
      <div className="rounded-4 p-3 bg-gray-800 width-100 d-flex flex-column gap-2 transitionAll">
        <nav className="d-flex align-items-center justify-content-between gap-3">
          <div className="d-flex gap-3 align-items-center">
            <button className={`body2 text-primary`}>Your Statistics</button>
          </div>
        </nav>
        <div className="nav-bg rounded-4 d-flex flex-column p-3 gap-2 align-items-start">
          <p className="caption">Your Voting Power is </p>
          <br />
          <p className="caption">Votes made for categories:</p>
          <p className="caption"></p>
        </div>
      </div>
      {voteState.proposalID.length ? (
        <button
          className="btn btn-primary w-100 rounded-5"
          data-bs-toggle="modal"
          data-bs-target="#voteModal"
        >
          Vote
        </button>
      ) : null}
      <div className="modal " tabIndex="-1" role="dialog" id="voteModal">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Vote</h5>
              <button
                type="button"
                className="btn-close primary"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body p-4 text-center d-flex justify-content-around">
              {/* Vote options are numbers. Check
              gov.ts(path:modules/cosmos/gov/v1beta1) for more info on which
              umber corresponds to which vote */}
              <div class="form-check  ">
                <input
                  class="form-check-input"
                  type="radio"
                  name="voteRadio"
                  id="voteRadio1"
                  onChange={() =>
                    voteDispatch({
                      type: "SET_VOTE_OPTION",
                      payload: 1,
                    })
                  }
                />
                <label class="form-check-label" for="voteRadio1">
                  Yes
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="voteRadio"
                  id="voteRadio2"
                  onChange={() =>
                    voteDispatch({
                      type: "SET_VOTE_OPTION",
                      payload: 3,
                    })
                  }
                />
                <label class="form-check-label" for="voteRadio2">
                  No
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="voteRadio"
                  id="voteRadio3"
                  onChange={() =>
                    voteDispatch({
                      type: "SET_VOTE_OPTION",
                      payload: 4,
                    })
                  }
                />
                <label class="form-check-label" for="voteRadio3">
                  No with veto
                </label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  type="radio"
                  name="voteRadio"
                  id="voteRadio4"
                  onChange={() =>
                    voteDispatch({
                      type: "SET_VOTE_OPTION",
                      payload: 2,
                    })
                  }
                />
                <label class="form-check-label" for="voteRadio4">
                  Abstain
                </label>
              </div>
            </div>
            <div className="nav-bg accordion" id="voteAccordion">
              <div class="accordion-item">
                <h2 class="accordion-header" id="heading">
                  <button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-controls="collapseOne"
                  >
                    <i class="bi bi-info-circle text-primary"></i> The following
                    items summarize the voting options and what it means for
                    this proposal
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  class="accordion-collapse collapse show"
                  aria-labelledby="heading"
                  data-bs-parent="#voteAccordion"
                >
                  <div class="accordion-body">
                    <ul>
                      <li>
                        YES - You approve of and wish to ratify the contents of
                        the proposed paper.
                      </li>
                      <li>NO - You don’t approve of the contents of paper. </li>
                      <li>
                        NO WITH VETO - A ‘NoWithVeto’ vote indicates a proposal
                        either (1) is deemed to be spam, i.e., irrelevant to
                        Cosmos Hub, (2) disproportionately infringes on minority
                        interests, or (3) violates or encourages violation of
                        the rules of engagement as currently set out by Cosmos
                        Hub governance. If the number of ‘NoWithVeto’ votes is
                        greater than a third of total votes, the proposal is
                        rejected and the deposits are burned.
                      </li>
                      <li>
                        ABSTAIN - You wish to contribute to quorum but you
                        formally decline to vote either for or against the
                        proposal.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer ">
              {voteState.voteOption !== "VOTE_OPTION_UNSPECIFIED" ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleVote}
                >
                  Confirm
                </button>
              ) : (
                <button disabled type="button" className="btn btn-primary">
                  Confirm
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteInfo;
