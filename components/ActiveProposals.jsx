import React, { useState } from "react";
import { useAllVotes } from "../data";

const ActiveProposals = ({
  voteState,
  voteDispatch,
  allProposals,
  isLoadingProposals,
}) => {
  console.log("inside ActiveProposals, allProposals: ", allProposals);
  const [OnVoteSelect, setOnVoteSelect] = useState(null);
  const [onVoteHover, setOnVoteHover] = useState(null);

  const { allVotes } = useAllVotes("6");

  const getTypeProposal = (typeUrl) => {
    const typeProposalArray = typeUrl?.split?.(".");
    const typeProposal = typeProposalArray?.slice?.(-1)?.[0];
    return typeProposal;
  };

  return (
    <>
      {isLoadingProposals || allProposals?.[0]?.proposal_id == "fallback" ? (
        <div>Loading ...</div>
      ) : allProposals?.length ? (
        allProposals?.map((proposal, index) => (
          <div
            key={index}
            onMouseOver={() => setOnVoteHover(proposal?.proposal_id)}
            onMouseOut={() => setOnVoteHover(null)}
            className={`col-12 col-md-6 p-2`}
            onClick={() => {
              setOnVoteSelect(index);
              voteDispatch({
                type: "SET_PROPOSAL_ID",
                payload: proposal?.proposal_id,
              });
            }}
          >
            <div
              className={`bg-translucent rounded-3`}
              // style={{ opacity: proposal.idIcon ? "1" : "0.6" }}
            >
              <div className="d-flex flex-column gap-2 p-2">
                <div className="d-flex justify-content-between gap-2 pb-2">
                  <h4 className="d-flex gap-1 align-items-center body2 text-primary">
                    #{proposal?.proposal_id}{" "}
                  </h4>
                  <div
                    className="button-secondary caption bg-translucent px-2 py-1 text-truncate"
                    style={{ fontWeight: "400" }}
                  >
                    {getTypeProposal(proposal?.content?.["@type"])}
                  </div>
                </div>
                <h5 className="caption2 text-primary">
                  {proposal?.content?.title}
                </h5>
                <p className="caption2">
                  Voting Start :{" "}
                  {new Date(proposal?.voting_start_time).toLocaleDateString()}
                </p>
                <p className="caption2">
                  Voting End :{" "}
                  {new Date(proposal?.voting_end_time).toLocaleDateString()}
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
                {OnVoteSelect !== index &&
                onVoteHover === proposal?.proposal_id &&
                voteState.proposalId !== proposal?.proposal_id ? (
                  <span
                    className="text-primary position-absolute bottom-0"
                    style={{
                      right: "5px",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <i className="bi bi-circle text-primary"></i>
                  </span>
                ) : null}
                {voteState.proposalID === proposal?.proposal_id ? (
                  <span
                    className="text-primary position-absolute bottom-0"
                    style={{
                      right: "5px",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <i className="bi bi-record-circle text-primary"></i>
                  </span>
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
