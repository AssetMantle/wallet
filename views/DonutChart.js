import React from "react";
import { ResponsiveSunburst } from "@nivo/sunburst";
import { useVotes } from "../data/swrStore";

const chartData = {
  name: "validator",
  color: "hsl(173, 70%, 50%)",
  children: [
    {
      name: "Yes",
      color: "hsl(11, 70%, 50%)",
      power: null,
      children: [
        {
          name: "Validator 1",
          color: "hsl(62, 70%, 50%)",
          power: 5,
        },
        {
          name: "Validator 2",
          color: "hsl(35, 70%, 50%)",
          power: 5,
        },
      ],
    },
    {
      name: "No",
      color: "hsl(11, 70%, 50%)",
      power: null,
    },
    {
      name: "Abstain",
      color: "hsl(11, 70%, 50%)",
      power: null,
    },
    {
      name: "No with Veto",
      color: "hsl(11, 70%, 50%)",
      power: null,
    },
  ],
};

const DonutChart = ({ proposalID }) => {
  const { votesInfo, isLoadingVote, errorVote } = useVotes(proposalID);

  return (
    <div className="col-12 pt-3 pt-lg-0 col-lg-4" style={{ height: "400px" }}>
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
  );
};

export default DonutChart;
