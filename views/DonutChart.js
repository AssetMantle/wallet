import React, { useState } from "react";
import { ResponsiveSunburst } from "@nivo/sunburst";

const DonutChart = ({ selectedProposal }) => {
  const [isDataZero, setIsDataZero] = useState(false);
  console.log(selectedProposal);

  const chartData = {
    name: "validator",
    color: "hsl(173, 70%, 50%)",
    children: [
      {
        name: "Yes",
        color: "hsl(11, 70%, 50%)",
        power: selectedProposal?.finalTallyResult?.yes.length,
        // children: selectedProposal?.finalTallyResult.map((item) => {
        //   return {
        //     name: item?.voter,
        //     color: "hsl(62, 70%, 50%)",
        //     power: 100 / yesVotes.length,
        //   };
        // }),
      },
      {
        name: "No",
        color: "hsl(11, 70%, 50%)",
        power: selectedProposal?.finalTallyResult?.no.length,
        // children: noVotes.map((item) => {
        //   return {
        //     name: item?.voter,
        //     color: "hsl(62, 70%, 50%)",
        //     power: 1 / noVotes.length,
        //   };
        // }),
      },
      {
        name: "Abstain",
        color: "hsl(11, 70%, 50%)",
        power: selectedProposal?.finalTallyResult?.abstain.length,
        // children: abstainVotes.map((item) => {
        //   return {
        //     name: item?.voter,
        //     color: "hsl(62, 70%, 50%)",
        //     power: 1 / abstainVotes.length,
        //   };
        // }),
      },
      {
        name: "No With Veto",
        color: "hsl(11, 70%, 50%)",
        power: selectedProposal?.finalTallyResult?.noWithVeto.length,
        // children: noWithVeto.map((item) => {
        //   return {
        //     name: item?.voter,
        //     color: "hsl(62, 70%, 50%)",
        //     power: 1 / noWithVeto.length,
        //   };
        // }),
      },
      // {
      //   name: "No with Veto",
      //   color: "hsl(11, 70%, 50%)",
      //   power: 30,
      // },
    ],
  };

  return (
    <div style={{ height: "400px" }}>
      {isDataZero ? (
        <div className="rounded-4 p-3 my-2 bg-gray-800 width-100 d-flex flex-column ">
          <p>No votes yet</p>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default DonutChart;
