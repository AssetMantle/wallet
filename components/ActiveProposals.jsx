import React, { useState, useEffect } from "react";
import UseVoteReducer from "../data/useVoteReducer";
import { IoRadioButtonOn } from "react-icons/io5";

const ActiveProposals = ({ allProposals }) => {
  const [onVoteHover, setOnVoteHover] = useState(null);
  const { voteState, voteDispatch } = UseVoteReducer();
  const [anyActiveProposals, setAnyActiveProposals] = useState(false);

  useEffect(() => {
    allProposals?.filter((item) => item?.status !== 3)?.length
      ? setAnyActiveProposals(true)
      : setAnyActiveProposals(false);
  }, []);

  return (
    <>
      {!anyActiveProposals ? (
        allProposals
          ?.filter((item) => item?.status !== 3)
          ?.map((proposal, index) => (
            <div
              key={index}
              onMouseEnter={() => setOnVoteHover(proposal?.proposal_id)}
              onMouseLeave={() => setOnVoteHover(null)}
              className={`col-12 col-md-6 p-2`}
              onClick={() => {
                voteDispatch({
                  type: "SET_PROPOSAL_ID",
                  payload: proposal?.proposal_id,
                });
              }}
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
          ))
      ) : (
        <div>There are no active proposals at the moment</div>
      )}
    </>
  );
};

export default ActiveProposals;
