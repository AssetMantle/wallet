import dynamic from "next/dynamic";
import React, { useState } from "react";
import { ethConfig } from "../data";

const selectedIncentive = ethConfig?.selected?.uniswapIncentiveProgram;

const latestIncentiveProgram =
  ethConfig?.mainnet?.uniswap?.incentivePrograms?.[selectedIncentive];

const StaticUniswapIncentiveList = ({ incentiveList }) => {
  // Data Variables
  const IncentivePrograms = [
    {
      name: "Incentive Program 1",
      ended: true,
      subtitle: "Ended on: 21 Feb, 2023",
    },
    {
      name: "Incentive Program 2",
      ended: false,
      subtitle: "Ended on: 21 Feb, 2023",
    },
    {
      name: "Incentive Program 3",
      ended: true,
      subtitle: "Ended on: 21 Feb, 2023",
    },
    {
      name: "Incentive Program 4",
      ended: true,
      subtitle: "Ended on: 21 Feb, 2023",
    },
  ];
  // HOOKS
  const { positionNfts, isLoadingPositionNfts, errorPositionNfts } =
    useStakedPositionsNftId(
      getIncentiveIdFromKey(latestIncentiveProgram?.incentiveTuple)
    );
  const [SelectedIncentive, setSelectedIncentive] = useState();

  // DISPLAY VARIABLES

  return (
    <div className="d-flex gap-2 rounded-4 p-3 bg-gray-800 width-100 d-flex flex-column text-white">
      <h2 className="body1 text-primary mb-2">Incentive Programs</h2>
      {IncentivePrograms &&
        Array.isArray(IncentivePrograms) &&
        IncentivePrograms.length > 0 &&
        React.Children.toArray(
          IncentivePrograms.map((program, index) => (
            <div
              className="nav-bg rounded-4 py-3 px-3 mx-0 d-flex align-items-center gap-2"
              role="button"
              onClick={() => setSelectedIncentive(index)}
            >
              {SelectedIncentive === index ? (
                <i className="bi bi-record-circle text-primary"></i>
              ) : (
                <i className="bi bi-circle"></i>
              )}
              <div className="d-flex flex-column gap-1">
                <p className="text-primary caption">{program.name}</p>
                <p
                  className={`${
                    program.ended ? "text-gray" : "text-success"
                  } small`}
                >
                  {program.ended ? program.subtitle : "Currently Active"}
                </p>
              </div>
            </div>
          ))
        )}
    </div>
  );
};

export const UniswapIncentiveList = dynamic(
  () => Promise.resolve(StaticUniswapIncentiveList),
  {
    ssr: false,
  }
);
