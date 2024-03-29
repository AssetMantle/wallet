import React, { useState } from "react";
import { useVote } from "../data";
import Tooltip from "./Tooltip";

const ActiveProposals = ({
  status,
  voteState,
  proposal,
  voteDispatch,
  index,
  // OnVoteSelect,
  // onVoteHover,
}) => {
  const { voteInfo, isLoadingVote, errorVote } = useVote(proposal?.proposal_id);
  const [OnVoteSelect, setOnVoteSelect] = useState(null);
  const [onVoteHover, setOnVoteHover] = useState(null);

  const getTypeProposal = (typeUrl) => {
    const typeProposalArray = typeUrl?.split?.(".");
    const typeProposal = typeProposalArray?.slice?.(-1)?.[0];
    return typeProposal;
  };

  const hasVoted = voteInfo?.hasVoted || false;

  const voteOptions = [
    {
      option: "VOTE_OPTION_YES",
      icon: "bi bi-check-circle-fill",
      description: "Yes",
      color: "#148919",
    },
    {
      option: "VOTE_OPTION_NO",
      icon: "bi bi-x-circle-fill",
      description: "No",
      color: "#E44651",
    },
    {
      option: "VOTE_OPTION_ABSTAIN",
      icon: "bi bi-dash-circle-fill",
      description: "Abstain",
      color: "#FFFDFA80",
    },
    {
      option: "VOTE_OPTION_NO_WITH_VETO",
      icon: "bi bi-x-circle-fill",
      description: "No With Veto",
      color: "#696969",
    },
  ];

  return (
    <div
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
        className={hasVoted ? `bg-voted rounded-3` : `bg-translucent rounded-3`}
        // style={{ opacity: proposal.idIcon ? "1" : "0.6" }}
      >
        <div className="d-flex flex-column gap-2 p-2">
          <div className="d-flex justify-content-between gap-2 pb-2">
            <h4 className="d-flex gap-2 align-items-center body2 text-primary">
              #{proposal?.proposal_id}{" "}
              {hasVoted ? (
                <Tooltip
                  title={
                    <i
                      className={
                        voteOptions?.find?.(
                          (item) => item?.option == voteInfo?.option
                        )?.icon
                      }
                      style={{
                        color: voteOptions?.find?.(
                          (item) => item?.option == voteInfo?.option
                        )?.color,
                      }}
                    ></i>
                  }
                  description={
                    voteOptions?.find?.(
                      (item) => item?.option == voteInfo?.option
                    )?.description
                  }
                />
              ) : null}
            </h4>
            <div
              className="button-secondary caption bg-translucent px-2 py-1 text-truncate"
              style={{ fontWeight: "400" }}
            >
              {getTypeProposal(proposal?.content?.["@type"])}
            </div>
          </div>
          <h5 className="caption2 text-primary text-truncate">
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
              clipPath: "polygon(0% 0%, 80% 0%, 100% 50%, 80% 100%, 0% 100%)",
              width: "max-content",
              fontWeight: "700",
            }}
          >
            Voting Period
          </p>
          {OnVoteSelect !== index &&
          onVoteHover === proposal?.proposal_id &&
          voteState.proposalID !== proposal?.proposal_id ? (
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
  );
};

export default ActiveProposals;
