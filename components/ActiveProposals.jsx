import React, { useState } from "react";
import { IoRadioButtonOff } from "react-icons/io5";

const ActiveProposals = ({ voteState, voteDispatch, allProposals }) => {
  const [onVoteHover, setOnVoteHover] = useState(null);

  return (
    <>
      {allProposals?.filter((item) => item?.status !== 3)?.length ? (
        allProposals
          ?.filter((item) => item?.status !== 3)
          ?.map((proposal, index) => (
            <div
              key={index}
              onMouseEnter={() =>
                setOnVoteHover(
                  proposal?.proposalId?.high + proposal?.proposalId?.low
                )
              }
              onMouseLeave={() => setOnVoteHover(null)}
              className={`col-12 col-md-6 p-2`}
              onClick={() => {
                voteDispatch({
                  type: "SET_PROPOSAL_ID",
                  payload:
                    proposal?.proposalId?.high + proposal?.proposalId?.low,
                });
              }}
            >
              <div
                className={`bg-translucent rounded-3`}
                // style={{ opacity: proposal.idIcon ? "1" : "0.6" }}
              >
                <div className="d-flex flex-column gap-2 p-2">
                  <div className="d-flex justify-content-between gap-3 pb-2">
                    <h4 className="d-flex gap-1 align-items-center body2 text-primary">
                      #{proposal?.proposalId?.high + proposal?.proposalId?.low}{" "}
                    </h4>
                    <div
                      className="button-secondary caption bg-translucent px-2 pb-0 pt-1"
                      style={{ fontWeight: "400" }}
                    >
                      {proposal?.content?.$typeUrl?.slice(23)}
                    </div>
                  </div>
                  <h5 className="caption2 text-primary">
                    {proposal?.content?.title}
                  </h5>

                  <p className="caption2">
                    Voting Start :{" "}
                    {new Date(
                      (proposal?.votingStartTime?.seconds?.low +
                        proposal?.votingStartTime?.seconds?.high) *
                        1000
                    ).toLocaleDateString()}
                  </p>
                  <p className="caption2">
                    Voting End :{" "}
                    {new Date(
                      (proposal?.votingEndTime?.seconds?.low +
                        proposal?.votingEndTime?.seconds?.high) *
                        1000
                    ).toLocaleDateString()}
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
                    Voting Period
                  </p>
                  {onVoteHover ===
                    proposal?.proposalId?.high + proposal?.proposalId?.low &&
                  voteState.proposalId !==
                    proposal?.proposalId?.high + proposal?.proposalId?.low ? (
                    <span
                      className="text-primary position-absolute bottom-0"
                      style={{
                        right: "5px",
                        transform: "translateY(-95%)",
                      }}
                    >
                      <IoRadioButtonOff />
                    </span>
                  ) : null}
                  {voteState.proposalID ===
                  proposal?.proposalId?.high + proposal?.proposalId?.low ? (
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
