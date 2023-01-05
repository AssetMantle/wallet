import React, { useState } from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { IoRadioButtonOn } from "react-icons/io5";
import { useAllProposals, useVote } from "../data";
import VoteInfo from "../views/VoteInfo";
import UseVoteReducer from "../data/useVoteReducer";
import { ResponsiveSunburst } from "@nivo/sunburst";
import ScrollableSectionContainer from "../components/ScrollableSectionContainer";

export default function Vote() {
  const { voteInfo, isLoadingVote, errorVote } = useVote(1);
  const { voteState, voteDispatch } = UseVoteReducer();
  const [ActiveNav, setActiveNav] = useState(0);
  const [onVoteHover, setOnVoteHover] = useState(null);
  const { allProposals, isLoadingProposals, errorProposals } =
    useAllProposals();

  // const chartData = {
  //   name: "validator",
  //   color: "hsl(173, 70%, 50%)",
  //   children:
  //   [
  //     {
  //       name: "Yes",
  //       color: "hsl(11, 70%, 50%)",
  //       children: [
  //         {
  //           name: "Validator 1",
  //           color: "hsl(62, 70%, 50%)",
  //           power: 5,
  //         },
  //         {
  //           name: "Validator 2",
  //           color: "hsl(35, 70%, 50%)",
  //           power: 5,
  //         },
  //       ],
  //     },
  //     {
  //       name: "No",
  //       color: "hsl(11, 70%, 50%)",
  //       power: 25,
  //     },
  //     {
  //       name: "Abstain",
  //       color: "hsl(11, 70%, 50%)",
  //       power: 45,
  //     },
  //     {
  //       name: "No with Veto",
  //       color: "hsl(11, 70%, 50%)",
  //       power: 20,
  //     },
  //   ],
  // };

  for (item in allProposals?.final_tally_result) {
    console.log(item);
  }

  return (
    <>
      <section className="row h-100">
        <ScrollableSectionContainer className="col-12 col-lg-8 px-1">
          <div className="rounded-4 p-3 bg-gray-800 width-100 d-flex flex-column gap-2 transitionAll">
            <nav className="d-flex align-items-center justify-content-between gap-3">
              <h1 className="body2 text-primary">Proposals</h1>
              <div className="d-flex align-items-center box-nav">
                <button
                  className={`am-link body2 box-nav-item px-4 py-1 ${
                    ActiveNav === 0 ? "active" : ""
                  }`}
                  onClick={() => setActiveNav(0)}
                >
                  Active
                </button>
                <button
                  className={`am-link body2 d-flex gap-1 box-nav-item px-4 py-1 ${
                    ActiveNav === 1 ? "active" : ""
                  }`}
                  onClick={() => setActiveNav(1)}
                >
                  Concluded
                  <span className="text-primary">
                    <BsArrowUpRight />
                  </span>
                </button>
              </div>
            </nav>
            <div className="nav-bg rounded-4 d-flex flex-column px-3 py-2 gap-3">
              <div className="row">
                {allProposals?.map((proposal, index) => (
                  <div
                    key={index}
                    onMouseEnter={() => setOnVoteHover(proposal?.proposal_id)}
                    onMouseLeave={() => setOnVoteHover(null)}
                    className={`col-12 col-md-6 p-2`}
                    onClick={() =>
                      voteDispatch({
                        type: "SET_PROPOSAL_ID",
                        payload: proposal?.proposal_id,
                      })
                    }
                  >
                    <div
                      className={`bg-translucent rounded-3`}
                      style={{ opacity: proposal.idIcon ? "1" : "0.6" }}
                    >
                      <div className="d-flex flex-column gap-2 p-2">
                        <div className="d-flex justify-content-between gap-3 pb-2">
                          <h4 className="d-flex gap-1 align-items-center body2 text-primary">
                            {proposal?.proposal_id}{" "}
                            {/* {proposal.idIcon ? (
                            <span
                              className={
                                {
                                  1: "text-success",
                                  2: "text-error",
                                  3: "text-gray",
                                }[proposal.idIcon]
                              }
                            >
                              {
                                {
                                  1: <BsFillCheckCircleFill />,
                                  2: <BsFillXCircleFill />,
                                  3: <BsDashCircleFill />,
                                }[proposal.idIcon]
                              }
                            </span>
                          ) : (
                            ""
                          )} */}
                          </h4>
                          {proposal?.content?.type && (
                            <div
                              className="button-secondary caption bg-translucent px-2 pb-0 pt-1"
                              style={{ fontWeight: "400" }}
                            >
                              {proposal?.content?.type}
                            </div>
                          )}
                        </div>
                        <h5 className="caption2 text-primary">
                          {proposal?.content?.title}
                        </h5>

                        <p className="caption2">
                          Voting Start : {proposal?.voting_start_time}
                        </p>
                        <p className="caption2">
                          Voting End : {proposal?.voting_end_time}
                        </p>
                      </div>
                      <div className="py-2 d-flex justify-content-between align-items-center position-relative">
                        <p
                          className="small bg-blue-100 p-2 pe-5 text-dark text-uppercase"
                          style={{
                            clipPath:
                              "polygon(0% 0%, 80% 0%, 100% 50%, 80% 100%, 0% 100%)",
                            width: "max-content",
                            fontWeight: "700",
                          }}
                        >
                          {proposal?.status}
                        </p>
                        {onVoteHover === proposal?.proposal_id &&
                        voteState.proposalID !== proposal?.proposal_id ? (
                          <span
                            className="text-primary position-absolute bottom-0"
                            style={{
                              right: "5px",
                              transform: "translateY(-95%)",
                            }}
                          >
                            <IoRadioButtonOn />
                          </span>
                        ) : null}
                        {voteState.proposalID === proposal?.proposal_id ? (
                          <i className="bi bi-record-circle text-primary"></i>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollableSectionContainer>
        {voteState?.proposalID.length ? (
          <div
            className="col-12 pt-3 pt-lg-0 col-lg-4"
            style={{ height: "400px" }}
          >
            <ResponsiveSunburst
              data={chartData}
              margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              id="name"
              value="power"
              cornerRadius={2}
              borderColor={{ theme: "background" }}
              colors={{ scheme: "set2" }}
              childColor={{
                from: "color",
                modifiers: [["brighter", 0.1]],
              }}
              enableArcLabels={true}
              arcLabelsSkipAngle={10}
              arcLabelsTextColor={{
                from: "color",
                modifiers: [["darker", 1.4]],
              }}
            />
          </div>
        ) : (
          <VoteInfo voteDispatch={voteDispatch} voteState={voteState} />
        )}
      </section>
    </>
  );
}
