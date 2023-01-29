import React, { useState } from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { useAllProposals } from "../data/queryApi";
import DonutChart from "../views/DonutChart";
import VoteInfo from "../views/VoteInfo";
import useVoteReducer from "../data/useVoteReducer";
import ScrollableSectionContainer from "../components/ScrollableSectionContainer";
import { sendVote } from "../data/txApi";
import { useChain } from "@cosmos-kit/react";
import { defaultChainName } from "../config";
import ActiveProposals from "../components/ActiveProposals";
import Head from "next/head";
import { isObjEmpty } from "../lib";

export default function Vote() {
  const { voteState, voteDispatch } = useVoteReducer();
  const { allProposals, isLoadingProposals } = useAllProposals();
  const walletManager = useChain(defaultChainName);
  const { getSigningStargateClient, address, status } = walletManager;

  const handleVote = async (e) => {
    e.preventDefault();
    voteDispatch({ type: "SUBMIT_VOTE" });
    console.log(isObjEmpty(voteState.errorMessages));
    if (isObjEmpty(voteState.errorMessages)) {
      const { response, error } = await sendVote(
        voteState?.proposalID,
        address,
        voteState?.voteOption,
        voteState?.memo,
        { getSigningStargateClient }
      );
      console.log("response: ", response, " error: ", error);
    }
  };
  const [ShowAdvanced, setShowAdvanced] = useState(false);
  const isConnected = status == "Connected";

  return (
    <>
      <Head>
        <title>Vote | MantleWallet</title>
      </Head>
      <section className="row h-100">
        <ScrollableSectionContainer className="col-12 col-lg-8 px-1">
          <div className="rounded-4 p-3 bg-gray-800 width-100 d-flex flex-column gap-2 transitionAll">
            <nav className="d-flex align-items-center justify-content-between gap-3">
              <h1 className="body2 text-primary">Proposals</h1>
              <div className="d-flex align-items-center box-nav">
                <button
                  className={"am-link body2 box-nav-item px-4 py-1 active"}
                >
                  Active
                </button>
                <a
                  target="_blank"
                  href="https://www.mintscan.io/asset-mantle/proposals"
                  rel="noreferrer"
                >
                  <button
                    className={
                      "am-link body2 d-flex gap-1 box-nav-item px-4 py-1 "
                    }
                  >
                    Concluded
                    <span className="text-primary">
                      <BsArrowUpRight />
                    </span>
                  </button>
                </a>
              </div>
            </nav>
            <div className="nav-bg rounded-4 d-flex flex-column px-3 py-2 gap-3">
              <div className="row">
                <ActiveProposals
                  voteDispatch={voteDispatch}
                  voteState={voteState}
                  allProposals={allProposals}
                  isLoadingProposals={isLoadingProposals}
                />
              </div>
            </div>
          </div>
        </ScrollableSectionContainer>
        <div className="d-flex flex-column col-lg-4">
          {voteState?.proposalID ? (
            <>
              <DonutChart
                isLoadingProposals={isLoadingProposals}
                selectedProposal={allProposals.find(
                  (item) => item?.proposal_id == voteState.proposalID
                )}
                proposalId={voteState?.proposalID}
              />
              <button
                className="button-primary py-2 text-center"
                style={{ maxWidth: "100%" }}
                data-bs-toggle="modal"
                data-bs-target="#voteModal"
              >
                Vote
              </button>
            </>
          ) : (
            <VoteInfo
              isConnected={isConnected}
              voteDispatch={voteDispatch}
              voteState={voteState}
            />
          )}
        </div>
        <div className="modal " tabIndex="-1" role="dialog" id="voteModal">
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            style={{ width: "min(100%,648px)" }}
          >
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
                  Vote
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
              <div className="modal-body p-4  d-flex flex-column">
                <div className="pb-4 text-center d-flex justify-content-around subtitle1">
                  {/* Vote options are numbers. Check
              gov.ts(path:modules/cosmos/gov/v1beta1) for more info on which
              umber corresponds to which vote */}
                  <div
                    className="form-check d-flex align-items-center gap-2 p-0"
                    style={{ fontWeight: "400", lineHeight: "100%" }}
                  >
                    <input
                      className="accent-primary p-0"
                      type="radio"
                      name="voteRadio"
                      id="voteRadio1"
                      onChange={() => {
                        voteDispatch({
                          type: "SET_VOTE_OPTION",
                          payload: 1,
                        });
                        voteDispatch({
                          type: "RESET_ERRORS",
                        });
                      }}
                    />
                    <label className="form-check-label" htmlFor="voteRadio1">
                      Yes
                    </label>
                  </div>
                  <div
                    className="form-check d-flex align-items-center gap-2 p-0"
                    style={{ fontWeight: "400", lineHeight: "100%" }}
                  >
                    <input
                      className="accent-primary p-0"
                      type="radio"
                      name="voteRadio"
                      id="voteRadio2"
                      onChange={() => {
                        voteDispatch({
                          type: "SET_VOTE_OPTION",
                          payload: 3,
                        });
                        voteDispatch({
                          type: "RESET_ERRORS",
                        });
                      }}
                    />
                    <label className="form-check-label" htmlFor="voteRadio2">
                      No
                    </label>
                  </div>
                  <div
                    className="form-check d-flex align-items-center gap-2 p-0"
                    style={{ fontWeight: "400", lineHeight: "100%" }}
                  >
                    <input
                      className="accent-primary p-0"
                      type="radio"
                      name="voteRadio"
                      id="voteRadio3"
                      onChange={() => {
                        voteDispatch({
                          type: "SET_VOTE_OPTION",
                          payload: 4,
                        });
                        voteDispatch({
                          type: "RESET_ERRORS",
                        });
                      }}
                    />
                    <label className="form-check-label" htmlFor="voteRadio3">
                      No with veto
                    </label>
                  </div>
                  <div
                    className="form-check d-flex align-items-center gap-2 p-0"
                    style={{ fontWeight: "400", lineHeight: "100%" }}
                  >
                    <input
                      className="accent-primary p-0"
                      type="radio"
                      name="voteRadio"
                      id="voteRadio4"
                      onChange={() => {
                        voteDispatch({
                          type: "SET_VOTE_OPTION",
                          payload: 2,
                        });
                        voteDispatch({
                          type: "RESET_ERRORS",
                        });
                      }}
                    />
                    <label className="form-check-label" htmlFor="voteRadio4">
                      Abstain
                    </label>
                  </div>
                </div>
                <div className="nav-bg p-3 rounded-4 d-flex flex-column gap-1">
                  <button
                    className="caption2 d-flex align-items-start justify-content-start gap-1"
                    onClick={() => setShowAdvanced(!ShowAdvanced)}
                  >
                    <i className="bi bi-info-circle text-primary"></i> The
                    following items summarize the voting options and what it
                    means for this proposal
                    <span
                      className="transitionAll"
                      style={{
                        transformOrigin: "center",
                        transform: ShowAdvanced
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                    >
                      <i className="bi bi-chevron-down" />
                    </span>
                  </button>
                  {ShowAdvanced && (
                    <div className="accordion-body">
                      <ul className="ps-3 pt-2 caption2 text-gray">
                        <li>
                          <span className="text-white-300">YES</span> - You
                          approve of and wish to ratify the contents of the
                          proposed paper.
                        </li>
                        <li>
                          <span className="text-white-300">NO</span> - You don’t
                          approve of the contents of paper.
                        </li>
                        <li>
                          <span className="text-white-300">NO WITH VETO</span> -
                          A ‘NoWithVeto’ vote indicates a proposal either (1) is
                          deemed to be spam, i.e., irrelevant to Cosmos Hub, (2)
                          disproportionately infringes on minority interests, or
                          (3) violates or encourages violation of the rules of
                          engagement as currently set out by Cosmos Hub
                          governance. If the number of ‘NoWithVeto’ votes is
                          greater than a third of total votes, the proposal is
                          rejected and the deposits are burned.
                        </li>
                        <li>
                          <span className="text-white-300">ABSTAIN</span> - You
                          wish to contribute to quorum but you formally decline
                          to vote either for or against the proposal.
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                <small
                  id="amountInputErrorMsg"
                  className="form-text text-danger d-flex align-items-center gap-1"
                >
                  {" "}
                  {voteState?.errorMessages?.voteErrorMsg && (
                    <i className="bi bi-info-circle" />
                  )}{" "}
                  {voteState?.errorMessages?.voteErrorMsg}
                </small>
                <div className="d-flex pt-3">
                  {/* {voteState.voteOption !== "VOTE_OPTION_UNSPECIFIED" ? (
                    <button
                      type="button"
                      className="button-primary px-5 py-2 ms-auto"
                      onClick={handleVote}
                    >
                      Confirm
                    </button>
                  ) : ( */}
                  <button
                    disabled={!isObjEmpty(voteState?.errorMessages)}
                    type="button"
                    // data-bs-toggle={voteState.voteOption !== 0 ? "modal" : ""}
                    // data-bs-target="#voteTransactionManifestModal"
                    className="button-primary px-5 py-2 ms-auto"
                    onClick={handleVote}
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <TransactionManifestModal
        displayData={[
          { title: "Transaction Type", value: "Vote" },
          { title: "Wallet Type", value: wallet?.prettyName },
        ]}
        id="voteTransactionManifestModal"
        handleSubmit={handleVote}
      /> */}
    </>
  );
}
