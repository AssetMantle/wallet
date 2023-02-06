import React from "react";
import { useVote } from "../data";
import Tooltip from "./Tooltip";

const ActiveProposals = ({
  status,
  voteState,
  proposal,
  index,
  OnVoteSelect,
  onVoteHover,
}) => {
  const { voteInfo, isLoadingVote, errorVote } = useVote(proposal?.proposal_id);
  console.log(voteInfo);
  const getTypeProposal = (typeUrl) => {
    const typeProposalArray = typeUrl?.split?.(".");
    const typeProposal = typeProposalArray?.slice?.(-1)?.[0];
    return typeProposal;
  };

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
      color: "#FF9133",
    },
  ];

  const hasVoted = !!voteInfo.option;

  return (
    <>
      <div
        className={hasVoted ? `bg-voted rounded-3` : `bg-translucent rounded-3`}
        // style={{ opacity: proposal.idIcon ? "1" : "0.6" }}
      >
        <div className="d-flex flex-column gap-2 p-2">
          <div className="d-flex justify-content-between gap-2 pb-2">
            <h4 className="d-flex gap-2 align-items-center body2 text-primary">
              #{proposal?.proposal_id}{" "}
              {hasVoted ? (
                proposal?.option == "VOTE_OPTION_NO_WITH_VETO" ? (
                  <Tooltip
                    title={
                      <span className="position-relative body1">
                        <i
                          className={`position-absolute top-0 bottom-0 left-0 vote_no_with_veto ${
                            voteOptions.find(
                              (item) => item?.option == proposal?.option
                            ).icon
                          }`}
                          style={{
                            zIndex: "1",
                            color: "red",
                          }}
                        ></i>{" "}
                        <i
                          className={`position-absolute top-0 bottom-0 vote_no_with_veto ${
                            voteOptions.find(
                              (item) => item?.option == proposal?.option
                            ).icon
                          }`}
                          style={{
                            left: "12px",
                            zIndex: "2",
                            color: "red",
                          }}
                        ></i>
                      </span>
                    }
                    description="No with Veto"
                  />
                ) : (
                  <Tooltip
                    title={
                      <i
                        className={
                          voteOptions.find(
                            (item) => item?.option == proposal?.option
                          ).icon
                        }
                        style={{
                          color: voteOptions.find(
                            (item) => item?.option == proposal?.option
                          ).color,
                        }}
                      ></i>
                    }
                    description={
                      voteOptions.find(
                        (item) => item?.option == proposal?.option
                      ).description
                    }
                  />
                )
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
    </>
  );
};

export default ActiveProposals;
