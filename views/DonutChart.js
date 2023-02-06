import React from "react";
import { ResponsiveSunburst } from "@nivo/sunburst";
import { useAllVotes } from "../data";

const DonutChart = ({ selectedProposal, proposalID, isLoadingProposals }) => {
  const isDataZero =
    selectedProposal?.finalTallyResult?.yes == 0 &&
    selectedProposal?.finalTallyResult?.abstain == 0 &&
    selectedProposal?.finalTallyResult?.noWithVeto == 0 &&
    selectedProposal?.finalTallyResult?.no == 0;

  const legend = [
    { title: "Yes", color: "#67C3A5" },
    { title: "No", color: "#8C9ECA" },
    { title: "Abstain", color: "#FC8D62" },
    { title: "No with Veto", color: "#E689C2" },
  ];

  const { allVotes, isLoadingVotes, errorVotes } = useAllVotes(proposalID);

  const yesVotes = allVotes.filter((item) => item?.option == "VOTE_OPTION_YES");
  const noVotes = allVotes.filter((item) => item?.option == "VOTE_OPTION_NO");
  const abstainVotes = allVotes.filter(
    (item) => item?.option == "VOTE_OPTION_ABSTAIN"
  );
  const noWithVetoVotes = allVotes.filter(
    (item) => item?.option == "VOTE_OPTION_NO_WITH_VETO"
  );

  //Order of the children in children array determines the color of each child, not the designated color in the arrat
  const chartData = {
    name: "validator",
    color: "hsl(173, 70%, 50%)",
    children: [
      {
        name: "Yes",
        color: "hsl(11, 70%, 50%)",
        children: yesVotes.map((item) => {
          return {
            name: item?.voter,
            color: "hsl(62, 70%, 50%)",
            power: item?.options?.reduce(
              (accumulator, currentValue) => accumulator + currentValue.weight,
              0
            ),
          };
        }),
      },
      {
        name: "Abstain",
        color: "hsl(11, 70%, 50%)",
        children: abstainVotes.map((item) => {
          return {
            name: item?.voter,
            color: "hsl(62, 70%, 50%)",
            power: item?.options?.reduce(
              (accumulator, currentValue) => accumulator + currentValue.weight,
              0
            ),
          };
        }),
      },
      {
        name: "No",
        color: "hsl(11, 70%, 50%)",
        children: noVotes.map((item) => {
          return {
            name: item?.voter,
            color: "hsl(62, 70%, 50%)",
            power: item?.options?.reduce(
              (accumulator, currentValue) => accumulator + currentValue.weight,
              0
            ),
          };
        }),
      },
      {
        name: "No With Veto",
        color: "hsl(11, 70%, 50%)",
        children: noWithVetoVotes.map((item) => {
          return {
            name: item?.voter,
            color: "hsl(62, 70%, 50%)",
            power: item?.options?.reduce(
              (accumulator, currentValue) => accumulator + currentValue.weight,
              0
            ),
          };
        }),
      },
    ],
  };

  return (
    <>
      {isDataZero ? (
        <div className="rounded-4 p-3 my-2 bg-gray-800 width-100 d-flex flex-column ">
          <p>No votes yet</p>
        </div>
      ) : isLoadingProposals ? (
        <p>Loading</p>
      ) : (
        <div
          style={{ height: "400px" }}
          className="rounded-4 p-3 bg-gray-800 width-100 gap-2 d-flex flex-column  mb-5"
        >
          <nav className="d-flex align-items-center justify-content-between gap-3">
            <div className="d-flex gap-3 align-items-center">
              <button className={`body2 text-primary`}>
                Voting Statistics
              </button>
            </div>
          </nav>

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
            theme={{
              tooltip: {
                container: {
                  background: "#333",
                },
              },
            }}
            enableArcLabels={true}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor="black"
          />
          <div className="justify-content-around mb-5 row">
            {legend.map((item, index) => (
              <div
                key={index}
                className="col-6 d-flex flex-row align-items-center"
              >
                <div
                  style={{
                    backgroundColor: item.color,
                    height: "12px",
                    width: "30px",
                  }}
                ></div>
                <p className="ms-2">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default DonutChart;
