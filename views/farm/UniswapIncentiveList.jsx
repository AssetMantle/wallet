import dynamic from "next/dynamic";
import React from "react";
import useSWR from "swr";
import { ethConfig, useIncentiveList } from "../../data";
import { getTimeDifference } from "../../lib";

const selectedIncentive = ethConfig?.selected?.uniswapIncentiveProgram;

const latestIncentiveProgram =
  ethConfig?.mainnet?.uniswap?.incentivePrograms?.[selectedIncentive];

const StaticUniswapIncentiveList = () => {
  // HOOKS
  // hooks to get the incentive program data
  const { incentiveList, isLoadingIncentiveList } = useIncentiveList();
  const { data: selectedIncentiveIndex, mutate } = useSWR("selectedIncentive");
  const isIncentivePopulated = !isLoadingIncentiveList && incentiveList?.length;

  const currentTimestamp = Math.floor(Date.now() / 1000);

  // DISPLAY VARIABLES

  return (
    <div className="d-flex gap-2 rounded-4 p-3 bg-am-gray-200 width-100 d-flex flex-column text-white">
      <h2 className="body1 text-primary mb-2">Incentive Programs</h2>
      {isIncentivePopulated &&
        Array.isArray(incentiveList) &&
        incentiveList?.length > 0 &&
        React.Children.toArray(
          incentiveList.map((incentiveObject, index) => (
            <div
              className="bg-black rounded-4 py-3 px-3 mx-0 d-flex align-items-center gap-2"
              role="button"
              onClick={() => mutate(index)}
            >
              {selectedIncentiveIndex == index ? (
                <i className="bi bi-record-circle text-primary"></i>
              ) : (
                <i className="bi bi-circle"></i>
              )}
              <div className="d-flex flex-column gap-1">
                <p className="text-primary caption">{`Incentive Program ${
                  index + 1
                }`}</p>
                <p
                  className={`${
                    incentiveObject?.endTime <= currentTimestamp
                      ? "color-am-gray-100"
                      : "text-success"
                  } small`}
                >
                  {incentiveObject?.endTime <= currentTimestamp
                    ? `${getTimeDifference(
                        incentiveObject?.endTime,
                        currentTimestamp
                      )} ago`
                    : "Currently Active"}
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
