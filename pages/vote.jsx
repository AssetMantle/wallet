import React, { useState } from "react";
import Sunburst from "sunburst-chart";
import {
  BsArrowUpRight,
  BsFillCheckCircleFill,
  BsDashCircleFill,
  BsFillXCircleFill,
} from "react-icons/bs";
import { useAllProposals } from "../data/swrStore";
import { useProposal } from "../data/swrStore";
const myChart = Sunburst();
myChart
  .data({
    name: "root",
    children: [
      {
        name: "leafA",
        value: 3,
      },
      {
        name: "nodeB",
        children: [
          {
            name: "leafBA",
            value: 5,
          },
          {
            name: "leafBB",
            value: 1,
          },
        ],
      },
    ],
  })
  .excludeRoot(true)(document.getElementById("chart"));

export default function Vote() {
  const [ActiveNav, setActiveNav] = useState(0);
  const { allProposals, isLoadingProposals, errorProposals } =
    useAllProposals();
  const { proposalInfo, isLoadingProposal, errorProposal } = useProposal("1");
  console.log("singleProposal:", proposalInfo, "allProposals:", allProposals);
  const votingPower = 1 === 1 ? "0.4%" : "--%";
  const currentVotingPower =
    1 === 2 ? { display: "6/10", value: 60 } : { display: "X/X", value: "" };
  const pastVotingPower =
    1 === 2 ? { display: "4/10", value: 40 } : { display: "X/X", value: "" };

  return (
    <section className="row">
      <div className="col-12 col-lg-8 px-1">
        <div className="chart"></div>
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
              {allProposals?.map((proposal) => (
                <div className={`col-12 col-md-6 p-2`}>
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
                        <div
                          className="button-secondary caption bg-translucent px-2 pb-0 pt-1"
                          style={{ fontWeight: "400" }}
                        >
                          {proposal?.content?.type}
                        </div>
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
                    <div className="py-2">
                      <p
                        className="small bg-blue-100 p-2 pe-4 text-dark text-uppercase"
                        style={{
                          clipPath:
                            "polygon(0% 0%, 80% 0%, 100% 50%, 80% 100%, 0% 100%)",
                          width: "max-content",
                          fontWeight: "700",
                        }}
                      >
                        {proposal?.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 pt-3 pt-lg-0 col-lg-4">
        <div className="rounded-4 p-3 bg-gray-800 width-100 d-flex flex-column gap-2 transitionAll">
          <nav className="d-flex align-items-center justify-content-between gap-3">
            <div className="d-flex gap-3 align-items-center">
              <button className={`body2 text-primary`}>Your Statistics</button>
            </div>
          </nav>
          <div className="nav-bg rounded-4 d-flex flex-column p-3 gap-2 align-items-start">
            <p className="caption">
              Your Voting Power is{" "}
              <span className="text-primary">{votingPower}</span>
            </p>
            <br />
            <p className="caption">Votes made for categories:</p>
            <p className="caption">
              Current Voting : {currentVotingPower.display}
            </p>
            {currentVotingPower.value && (
              <div className="am-progress bg-gray-800 rounded-2">
                <div
                  className="am-progress-bar bg-yellow-100 rounded-2"
                  style={{ width: `${currentVotingPower.value}%` }}
                ></div>
              </div>
            )}
            <p className="caption">Past Voting : {pastVotingPower.display}</p>
            {pastVotingPower.value && (
              <div className="am-progress bg-gray-800 rounded-2">
                <div
                  className="am-progress-bar bg-yellow-100 rounded-2"
                  style={{ width: `${pastVotingPower.value}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
