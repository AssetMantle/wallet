import React from "react";
import { ResponsiveSunburst } from "@nivo/sunburst";
import { useAllVotes } from "../data";

const DonutChart = ({ selectedProposal, proposalID }) => {
  const isDataZero =
    selectedProposal?.finalTallyResult?.yes == 0 &&
    selectedProposal?.finalTallyResult?.abstain == 0 &&
    selectedProposal?.finalTallyResult?.noWithVeto == 0 &&
    selectedProposal?.finalTallyResult?.no == 0;

  const { allVotes, isLoadingVotes, errorVotes } = useAllVotes(proposalID);
  console.log(allVotes);

  const chartData = {
    name: "validator",
    color: "hsl(173, 70%, 50%)",
    children: [
      {
        name: "Yes",
        color: "hsl(11, 70%, 50%)",
        power: selectedProposal?.finalTallyResult?.yes,
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
        power: selectedProposal?.finalTallyResult?.no,
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
        power: selectedProposal?.finalTallyResult?.abstain,
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
        power: selectedProposal?.finalTallyResult?.noWithVeto,
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

  const data = {
    votes: [
      {
        proposal_id: "6",
        voter: "mantle1q7mtgqx4k9xr7z89dgsgd456tg0g7tgs5nm3ey",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle1q7mtgqx4k9xr7z89dgsgd456tg0g7tgs5nm3ey",
        option: "VOTE_OPTION_NO",
        options: [
          {
            option: "VOTE_OPTION_NO",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle1q7mtgqx4k9xr7z89dgsgd456tg0g7tgs5nmey",
        option: "VOTE_OPTION_NO",
        options: [
          {
            option: "VOTE_OPTION_NO",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle1q7mtgqx4k9xr7z89dgsgd456tg07tgs5nm3ey",
        option: "VOTE_OPTION_ABSTAIN",
        options: [
          {
            option: "VOTE_OPTION_ABSTAIN",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle1q7mtgqx4k9xr7z89dgsgd45g0g7tgs5nm3ey",
        option: "VOTE_OPTION_ABSTAIN",
        options: [
          {
            option: "VOTE_OPTION_ABSTAIN",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle1p224qamtqhqmg2k3cguwtml2ygk72spk7fxve6",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle1zcv66fuznlfjsaehfhllacdj5uvf6naul7njzd",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle1zud3h5akuch5360w8jgmc4qd8dcpush89xcxye",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle19f0w9svr905fhefusyx4z8sf83j6et0g70m5yx",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle1907n5d2xwy3av597y6347dsc2ktpl2d9u0j4tu",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle19mqu3ptenp9x3p9hz6j7j32kuvpu80d7ahanjy",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle1x2ay39z5fz8yt3nxymz4gmacwnwyup24qw5xg8",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle1fqs7gakxdmujtk0qufdzth5pfyspus3yxwppec",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle1f0e27n84d37tu26tj47mmut8d3c56p87q3fyf8",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle127ax4kl8kfrjtl20gyvlumqqsxfp66hjedmn2x",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle1tugm892unf8w2hm0u0pc04xzrmplktgw0vc3da",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle1v9w49rtdpkwxeje8xnx9pnf9z9hyr2e0jm0m96",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle1v5fq05qx38vgjeagy5k80z2rrfzrfar2hf9g0e",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle1d9j83ll3e0jh5w8kycjcmzcm2wdy0mr3kq89p4",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle1wccjp22myee43v8alz6mpwc872uhgw03skuw0c",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle1wlh0f94r6c4y5nwsqlxd2384jmxlljstrlz3st",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle1s4rrnhk3794ancd5gunhg0sp350amhdm82z4cr",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle1302zcexj6hruy3fpqd5j7m6sh5u0c3625s68mc",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle1jjwf2052uy7fvl8tl65lgxnyr7mggc7v5etaru",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle1cqwtg4zu3fx0vask9gx6xxecy29mrmtwfm5vag",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle1ufppyphwfwlhxft05fuj0206kq9fheslxnz25n",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle1uac4u9c60tj97fx3lvscefe0m3t3fmrrln4ce2",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle1akakh0qtdm9jg6c9u2jeulltrmaesmjwkma5qf",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle1actesul6kn55wnjfmttrr2mudu5762hh6d85tm",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle1auxnmr5eqpx69ajre5xwzdnaudgjlttt669cw4",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
      {
        proposal_id: "6",
        voter: "mantle17h80hf4njfydvhm3mfgy09tlrwvuclgzczw3qv",
        option: "VOTE_OPTION_YES",
        options: [
          {
            option: "VOTE_OPTION_YES",
            weight: "1.000000000000000000",
          },
        ],
      },
    ],
    pagination: {
      next_key: null,
      total: "27",
    },
  };
  const yesVotes = data.votes.filter(
    (item) => item?.option == "VOTE_OPTION_YES"
  );
  const noVotes = data.votes.filter((item) => item?.option == "VOTE_OPTION_NO");
  const abstainVotes = data.votes.filter(
    (item) => item?.option == "VOTE_OPTION_ABSTAIN"
  );
  const noWithVetoVotes = data.votes.filter(
    (item) => item?.option == "VOTE_OPTION_NO_WITH_VETO "
  );
  console.log(yesVotes, noVotes);
  const chartAltData = {
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
    <div style={{ height: "400px" }}>
      {/* {isDataZero ? (
        <div className="rounded-4 p-3 my-2 bg-gray-800 width-100 d-flex flex-column ">
          <p>No votes yet</p>
        </div>
      ) : ( */}
      <ResponsiveSunburst
        data={chartAltData}
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
          modifiers: [["darker", 5]],
        }}
      />
      <div className="d-flex flex-row">
        <div style={{ backgroundColor: "hsl(11, 70%, 50%)" }}></div>
        <div style={{ backGroundColor: "hsl(11, 70%, 50%)" }}></div>{" "}
        <div style={{ backGroundColor: "hsl(11, 70%, 50%)" }}></div>{" "}
        <div style={{ backGroundColor: "hsl(11, 70%, 50%)" }}></div>
      </div>
      {/* )} */}
    </div>
  );
};

export default DonutChart;
