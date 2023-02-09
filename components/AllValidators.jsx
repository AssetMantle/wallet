import React from "react";
import { fromChainDenom } from "../data";
import Tooltip from "./Tooltip";

const AllValidators = ({
  setShowClaimError,
  searchValue,
  activeValidators,
  validatorsArray,
  stakeState,
  stakeDispatch,
  totalTokens,
  delegatedValidators,
}) => {
  // controller for onError
  const handleOnError = (e) => {
    e.preventDefault();
    // console.log("e: ", e);
    e.target.src = "/validatorAvatars/alt.png";
  };

  const statusArray = [0, 1, 2, -1];

  return (
    <>
      {activeValidators
        ? validatorsArray
            ?.filter(
              (item) =>
                item?.status === 3 &&
                item?.description?.moniker
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
            )
            ?.map((item, index) => (
              <tr key={index} className="caption2 text-white-300">
                <td>
                  <input
                    type="checkbox"
                    checked={stakeState?.selectedValidators.includes(
                      item?.operatorAddress
                    )}
                    onChange={() => {
                      setShowClaimError(false);
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
                {index < 10 ? (
                  <td>
                    <Tooltip
                      titlePrimary={"text-warning"}
                      title={<i className="bi bi-patch-exclamation-fill"></i>}
                      description="It is preferable to not stake to the top 10 validators"
                    />
                  </td>
                ) : (
                  <td></td>
                )}
                {activeValidators ? <td>{index + 1}</td> : null}
                <td>
                  <div
                    className="d-flex position-relative rounded-circle"
                    style={{ width: "25px", aspectRatio: "1/1" }}
                  >
                    <img
                      layout="fill"
                      alt={item?.description?.moniker}
                      className="rounded-circle"
                      src={`/validatorAvatars/${item?.operatorAddress}.png`}
                      onError={handleOnError}
                    />
                  </div>
                </td>
                <td className="d-flex align-items-center justify-content-start gap-1">
                  <a
                    className="text-truncate"
                    style={{ maxWidth: "200px" }}
                    href={`https://explorer.assetmantle.one/validators/${item.operatorAddress}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item?.description?.moniker}{" "}
                    <i className="bi bi-arrow-up-right" />
                  </a>
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
                <td>
                  {delegatedValidators?.find(
                    (element) =>
                      element?.operatorAddress == item?.operatorAddress
                  )
                    ? fromChainDenom(
                        delegatedValidators?.find(
                          (element) =>
                            element?.operatorAddress == item?.operatorAddress
                        )?.delegatedAmount
                      )
                    : "-"}
                </td>
              </tr>
            ))
        : validatorsArray
            ?.filter(
              (item) =>
                statusArray.includes(item?.status) &&
                item?.description?.moniker
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
            )

            ?.map((item, index) => (
              <tr key={index} className="caption2 text-white-300">
                <td> </td>
                <td>
                  <input
                    type="checkbox"
                    checked={stakeState?.selectedValidators.includes(
                      item?.operatorAddress
                    )}
                    onChange={() => {
                      setShowClaimError(false);
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
                {activeValidators ? <td>{index + 1}</td> : null}
                <td>
                  <div
                    className="d-flex position-relative rounded-circle"
                    style={{ width: "25px", aspectRatio: "1/1" }}
                  >
                    <img
                      layout="fill"
                      alt={item?.description?.moniker}
                      className="rounded-circle"
                      src={`/validatorAvatars/${item?.operatorAddress}.png`}
                      onError={handleOnError}
                    />
                  </div>
                </td>
                <td className="d-flex align-items-center justify-content-start gap-1">
                  <a
                    className="text-truncate"
                    style={{ maxWidth: "200px" }}
                    href={`https://explorer.assetmantle.one/validators/${item.operatorAddress}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {" "}
                    {item?.description?.moniker}{" "}
                    <i className="bi bi-arrow-up-right" />{" "}
                  </a>
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
                <td>
                  {" "}
                  {delegatedValidators?.find(
                    (element) =>
                      element?.operatorAddress == item?.operatorAddress
                  )
                    ? fromChainDenom(
                        delegatedValidators?.find(
                          (element) =>
                            element?.operatorAddress == item?.operatorAddress
                        )?.delegatedAmount
                      )
                    : "-"}
                </td>
                <td>
                  {item?.jailed ? (
                    <i className="bi bi-exclamation-octagon text-danger"></i>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))}
    </>
  );
};

export default AllValidators;
