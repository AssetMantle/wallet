import React from "react";
import { useDelegatedValidators } from "../data";

const DelegatedValidators = ({
  searchValue,
  activeValidators,
  stakeState,
  totalTokens,
  stakeDispatch,
  setShowClaimError,
}) => {
  const {
    delegatedValidators,
    totalDelegatedAmount,
    isLoadingDelegatedAmount,
    errorDelegatedAmount,
  } = useDelegatedValidators();

  // controller for onError
  const handleOnError = (e) => {
    e.preventDefault();
    // console.log("e: ", e);
    e.target.src = "/validatorAvatars/alt.png";
  };
  return (
    <>
      {activeValidators
        ? delegatedValidators
            ?.filter(
              (item) =>
                item?.status === 3 &&
                item?.description?.moniker?.toLowerCase()?.includes(searchValue)
            )
            ?.map((item, index) => (
              <tr key={index} className="caption2 text-white-300">
                <td>
                  <input
                    type="checkbox"
                    onChange={() => {
                      setShowClaimError(false);
                      stakeState?.selectedValidators?.includes(
                        item?.operatorAddress
                      )
                        ? stakeDispatch({
                            type: "REMOVE_FROM_SELECTED_VALIDATORS",
                            payload: item?.operatorAddress,
                          })
                        : stakeDispatch({
                            type: "SET_SELECTED_VALIDATORS",
                            payload: item?.operatorAddress,
                          });
                    }}
                  ></input>
                </td>
                <td>{index + 1}</td>
                <td>
                  <div
                    className="d-flex position-relative rounded-circle gap-1"
                    style={{ width: "25px", aspectRatio: "1/1" }}
                  >
                    <img
                      alt={item?.description?.moniker}
                      className="rounded-circle"
                      layout="fill"
                      src={`/validatorAvatars/${item?.operatorAddress}.png`}
                      onError={handleOnError}
                    />
                  </div>
                </td>
                <td className=" d-flex align-items-center justify-content-start">
                  {item?.description?.moniker}
                </td>
                <td>{((item?.tokens * 100) / totalTokens).toFixed(2)}%</td>
                {item?.commission?.commissionRates?.rate == 0 ? (
                  <td>0 %</td>
                ) : (
                  <td>
                    {item?.commission?.commissionRates?.rate.slice(0, -16)} %
                  </td>
                )}
                <td>{(item?.tokens / 1000000).toFixed(2)}</td>
              </tr>
            ))
        : delegatedValidators
            ?.filter(
              (item) =>
                item?.status === 1 &&
                item?.description?.moniker?.toLowerCase()?.includes(searchValue)
            )
            ?.map((item, index) => (
              <tr key={index} className="caption2 text-white-300">
                <td>
                  <input
                    type="checkbox"
                    onChange={() => {
                      stakeState?.selectedValidators.includes(
                        item?.operatorAddress
                      )
                        ? stakeDispatch({
                            type: "REMOVE_FROM_SELECTED_VALIDATORS",
                            payload: item?.operatorAddress,
                          })
                        : stakeDispatch({
                            type: "SET_SELECTED_VALIDATORS",
                            payload: item?.operatorAddress,
                          });
                    }}
                  ></input>
                </td>
                <td>{index + 1}</td>
                <td>
                  <div
                    className="d-flex position-relative rounded-circle"
                    style={{ width: "25px", aspectRatio: "1/1" }}
                  >
                    <img
                      alt={item?.description?.moniker}
                      className="rounded-circle"
                      layout="fill"
                      src={`/validatorAvatars/${item?.operatorAddress}.png`}
                      onError={handleOnError}
                    />
                  </div>
                </td>
                <td className=" d-flex align-items-center justify-content-start gap-1">
                  {item?.description?.moniker}
                </td>
                <td>{((item?.tokens * 100) / totalTokens).toFixed(2)}%</td>
                {item?.commission?.commissionRates?.rate == 0 ? (
                  <td>0</td>
                ) : (
                  <td>item?.commission?.commissionRates?.rate.slice(0, -16)</td>
                )}
                %<td>{(item?.tokens / 1000000).toFixed(2)}</td>
              </tr>
            ))}
    </>
  );
};

export default DelegatedValidators;
