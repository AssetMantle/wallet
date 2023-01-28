import React from "react";
import { ResponsiveSunburst } from "@nivo/sunburst";
import { useAllVotes } from "../data";

const DonutChart = ({ selectedProposal, proposalID }) => {
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
        voter: "mantle1qz3zj0j3546xywfe8qwcve5flne9w98qarhr6y",
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
        voter: "mantle1pzwel4a5ft2256au8xqy89k04yxavgs5srg7cv",
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
        voter: "mantle1prk4pyjhk0z8jwn7qz9ppsz98aanj0rreq29my",
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
        voter: "mantle1py537aj2wqhxlxa82u4qf6h6c46z9s2n36xmsl",
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
        voter: "mantle1p3t8qgrewcax6j3sh48gcyq05rj5ly7lqd6hr9",
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
        voter: "mantle1puc2nzm2dnjjdfffcm822eqytvxhljwwgmaw6j",
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
        voter: "mantle1zdyrpzjw075lx0uwushzrgy5uzz5jnt4dtdcqr",
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
        voter: "mantle1zd7zdtnhefkyc8pp9t4ekmene6rpgjkppcd38s",
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
        voter: "mantle1zn0ynweuqvv899z78jvwgyf8vtt2hs687m8g44",
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
        voter: "mantle1z46jc5h43a5mesv6lz97ncsjlw2l2ycqeen3q4",
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
        voter: "mantle1z79zeeyvdgqddevdng3u8d3kqt87dtq3jg55h4",
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
        voter: "mantle1rcvsjxmf9nnq9vqncrj57n4d7p8uw0utwgexfp",
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
        voter: "mantle1yylpcsxykn0fxgg8xf74828557mwmlxcy8e9dy",
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
        voter: "mantle1ysgpmpqwmm3kvfymh6c78yt4d9ws5wyq69ytyt",
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
        voter: "mantle1ysl0s782k7s6dn8c5h9fkjn5ljz3n0spe6kg65",
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
        voter: "mantle1y4ycv888ja5ya8qtw8mqe2l0fvt9amlfj6twuz",
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
        voter: "mantle1yk8dsn62an3p8c67a047qv9lvqa7crpasj0n2x",
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
        voter: "mantle1yas4uf89c3v33gun2xd44paau3cfvwarckcfmh",
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
        voter: "mantle19tk55x9rmx07uc72yp332qvf5ewdcddnxfx0uc",
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
        voter: "mantle19mz2auaquw5yyuaypucfjvtyjzjj8mkk4d099q",
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
        voter: "mantle1xw95s6j8reqjtsh3vlj4c3g77fwfh0hjsn5dsz",
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
        voter: "mantle1xwszhh663ymaup824ufcr0d33v6jqznzl6ty7u",
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
        voter: "mantle1xsqxh09svg4luxxs4ezeh5etkc50yxd45hhh4y",
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
        voter: "mantle1xmxmsmfgdxrgykxy7guev5f3hkn7nhn7tzag58",
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
        voter: "mantle18qzk3nf4j7rfde600jgc7sv7z270ksqxrqcz8f",
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
        voter: "mantle18zzddr4cqpz56z2hqvdczqvwwy4ez29z0u2p80",
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
        voter: "mantle18w8k552jszu2uz0hqa98y03t5mw49mcfcetslr",
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
        voter: "mantle1gp957czryfgyvxwn3tfnyy2f0t9g2p4pmfkt47",
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
        voter: "mantle1gydgxhs0tvnnapve44h5k89rspyjd05vpq8gn6",
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
        voter: "mantle1g2mjkrugdjr0h75cwg9ml5r8ynltd4z9trj408",
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
        voter: "mantle1g09pl3j043uqpw7zqkrdsxw3ve7u63efj4ymn3",
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
        voter: "mantle1gazfeg04x85xj58q9wherpl0kswad8thavay2x",
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
        voter: "mantle1g7ftge2jlapkjhrm2tapz8ffx534y8vvgyruy8",
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
        voter: "mantle1ffg4t9dcafslkkjweutd3ltr64lfgumtkstzyz",
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
        voter: "mantle1f2v787v6jawgd40wkv0u39wxwc68y7jxlyrhpv",
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
        voter: "mantle12gz0mh4zz4dzuhs9m76z46a5mryngwh384rzqk",
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
        voter: "mantle12vx9jcg9fuqxz80epcy283wwujq7hmh7jyy78f",
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
        voter: "mantle12vgmdunnmgsx6xtp8x8f5gkqm98nqmztnvm9t2",
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
        voter: "mantle12wyg2vm7cmkrgqggmptu0jluptsv2ndk667xl0",
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
        voter: "mantle1t59ffw9lr8usqf2v2x7heek7wfxfh78n4gd85h",
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
        voter: "mantle1t5wmu8x093ac6xsvqdm2v95a3ekk7fsrvahaqs",
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
        voter: "mantle1tcuqa8jwar5vcrlxet2du4pj9yzyglk93cuqeh",
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
        voter: "mantle1vxr4ne6wp730kjp9txgx86lzn474frr2smfphv",
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
        voter: "mantle1vsdzx5vjet26qmm7wxw04ayrkjcxeydtl7emxx",
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
        voter: "mantle1v4ljrpc0rkmwmclvmcfxuhxcc3qkzsvuxcf9cc",
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
        voter: "mantle1v6jsy0hhf80xsqsr6qk5latlj9vdf439dvrpmn",
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
        voter: "mantle1dalqypymz0c0pmcyrkzcn3s873qhjrzhfvg4s3",
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
        voter: "mantle1w64p7gzffgszx6usrmdevhemgpzrl39nds4r0a",
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
        voter: "mantle109hq6dan6hg8k6nklk6gh0t0ey204rgcg2rqte",
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
        voter: "mantle10jkc8y8ncaqkacp03uphlqawnhal5y4ctvsafl",
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
        voter: "mantle105a4nqa9x6gfxmxu8y3nn3laagwjmx95afsv7j",
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
        voter: "mantle10h8qcursghmc94h3fgm0edyjrptupuzg4fv0l4",
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
        voter: "mantle10mpfds384z7cafd3ytj9w3kdvedkvqw9te9sls",
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
        voter: "mantle1syclxhm8lrt2x5vjqwe0ygacm7daykz8pnrjn4",
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
        voter: "mantle1s0lankh33kprer2l22nank5rvsuh9ksaqhspe9",
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
        voter: "mantle1ssmeg0jhyr57kwjlt508lgz8jeqsfx85kkxdde",
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
        voter: "mantle1slll7zjnt65ss72wrulclnzjgkjd4t8m28jgy7",
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
        voter: "mantle13qcxnanvxp4nwegdpqhgrseanp9et4jxwethek",
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
        voter: "mantle133we4t3vqsr70hg245m4em9xhwpkzqkjtqdqg5",
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
        voter: "mantle1333s9chrkmwnv2zg5x2a28xpluhkexlljfyzhz",
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
        voter: "mantle135urd7pfx6j7rjartc7uxvd77d9qw5e0ntwrsz",
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
        voter: "mantle134r2c0r7m2f2k5xznethq9hptgvpzp4jvy5v4a",
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
        voter: "mantle13mnllldgrj809q6cmlwvnux6pgeep0mukx0f0u",
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
        voter: "mantle1jz6gjme08vy5t86mfqcrn44elrzu2c9gqw0lpl",
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
        voter: "mantle1jt8nrjr6lw0e5qcs6cucnryp64s2cl6npkh429",
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
        voter: "mantle1jkl7tkgaq5vky4dhafyrvqzjtxhtcvj75nhgnt",
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
        voter: "mantle1j69657323j67s2eghpe2kmalnpaqug43aqdr6y",
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
        voter: "mantle1j6fe83ufxxg9q3lvnsfw4d3dy9393ezmyn35h4",
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
        voter: "mantle1ndp6mspfs89uvyc38evtegelueh00cy24sjjuw",
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
        voter: "mantle1nc90qe4ldn8all4qtmacvcqj2asvadr4lu8tvp",
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
        voter: "mantle15qqeu3mj4y4f0wu5758ym592n4aghynx7kwq3r",
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
        voter: "mantle15gcxvpeq4jhh7s647fmpm82v9qf9uymh72u5ja",
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
        voter: "mantle152wy5klhjyqekg0wxkltu2y4h0u0tk3qjpgv2e",
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
        voter: "mantle152mz474642sw4fclyg0h03eldwtemjyct0uhay",
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
        voter: "mantle15t0wpccnj3qfkg6y9kyandu9pj7f2z9ujj7j02",
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
        voter: "mantle15d5uzwm3ac233nlpchvfswjkplt00gq4sjpwee",
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
        voter: "mantle157nlexej8r55s3jafy3dp4x5l7fs0gxrmz38y5",
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
        voter: "mantle14xcwns4rlj3n78mj4wd5vumd33728gyh2p2x0t",
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
        voter: "mantle14jpcrfwqfhx8ypwtxjz87vyfjsszcagpxsjhfg",
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
        voter: "mantle1k0anvfqhceh4clhjrvvfzmcdltj6y2q92ky305",
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
      next_key: "FLzmwlD3L2Udl+u82I4nS3pRqn6Z",
      total: "132",
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
    (item) => item?.option == "VOTE_OPTION_NO_WITH_VETO"
  );
  console.log(yesVotes, noVotes, abstainVotes, noWithVetoVotes);
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
    <div
      style={{ height: "400px" }}
      className="rounded-4 p-3 bg-gray-800 width-100 gap-2 d-flex flex-column justify-content-center my-5"
    >
      <nav className="d-flex align-items-center justify-content-between gap-3">
        <div className="d-flex gap-3 align-items-center">
          <button className={`body2 text-primary`}>Voting Statistics</button>
        </div>
      </nav>
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
      <div className="justify-content-around mb-5 row">
        {legend.map((item) => (
          <div className="col-6 d-flex flex-row align-items-center">
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
      {/* )} */}
    </div>
  );
};

export default DonutChart;
