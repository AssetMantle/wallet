import React, { useEffect, useState } from "react";
import { ResponsiveSunburst } from "@nivo/sunburst";
import { useVote } from "../data";

const DonutChart = ({ proposalId }) => {
  const [chartData, setChartData] = useState({
    name: "validator",
    color: "hsl(173, 70%, 50%)",
  });
  const [isDataZero, setIsDataZero] = useState(false);
  const { voteInfo, isLoadingVote, errorVote } = useVote(proposalId);
  useEffect(() => {
    fetch(
      `https://rest.assetmantle.one/cosmos/gov/v1beta1/proposals/${proposalId}/votes`
    )
      .then((res) => res.json())
      .then((data) => {
        const yesVotes = data?.votes?.filter(
          (item) => item?.option === "VOTE_OPTION_YES"
        );
        const noVotes = data?.votes?.filter(
          (item) => item?.option === "VOTE_OPTION_NO"
        );
        const abstainVotes = data?.votes?.filter(
          (item) => item?.option === "VOTE_OPTION_ABSTAIN"
        );
        const noWithVeto = data?.votes?.filter(
          (item) => item?.option === "VOTE_OPTION_NO_WITH_VETO"
        );
        setIsDataZero(
          yesVotes?.length == 0 &&
            noVotes?.length == 0 &&
            abstainVotes?.length == 0 &&
            noWithVeto?.length == 0
        );
        setChartData({
          name: "validator",
          color: "hsl(173, 70%, 50%)",
          children: [
            {
              name: "Yes",
              color: "hsl(11, 70%, 50%)",
              power: yesVotes.length,
              children: yesVotes.map((item) => {
                return {
                  name: item?.voter,
                  color: "hsl(62, 70%, 50%)",
                  power: 100 / yesVotes.length,
                };
              }),
            },
            {
              name: "No",
              color: "hsl(11, 70%, 50%)",
              power: noVotes.length,
              children: noVotes.map((item) => {
                return {
                  name: item?.voter,
                  color: "hsl(62, 70%, 50%)",
                  power: 1 / noVotes.length,
                };
              }),
            },
            {
              name: "Abstain",
              color: "hsl(11, 70%, 50%)",
              power: abstainVotes.length,
              children: abstainVotes.map((item) => {
                return {
                  name: item?.voter,
                  color: "hsl(62, 70%, 50%)",
                  power: 1 / abstainVotes.length,
                };
              }),
            },
            {
              name: "No With Veto",
              color: "hsl(11, 70%, 50%)",
              power: noWithVeto.length,
              children: noWithVeto.map((item) => {
                return {
                  name: item?.voter,
                  color: "hsl(62, 70%, 50%)",
                  power: 1 / noWithVeto.length,
                };
              }),
            },
            // {
            //   name: "No with Veto",
            //   color: "hsl(11, 70%, 50%)",
            //   power: 30,
            // },
          ],
        });
      });
  }, []);

  return (
    <div className="col-12 pt-3 pt-lg-0 col-lg-4" style={{ height: "400px" }}>
      {isDataZero ? null : (
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
