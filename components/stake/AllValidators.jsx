import React from "react";
import { fromChainDenom, useAllValidatorsUnbonded } from "../../data";
// import Tooltip from "./Tooltip";
import { useAllValidatorsBonded } from "../../data";
import { getBalanceStyle } from "../../config";
import { shiftDecimalPlaces } from "../../lib";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

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
  const {
    allValidatorsBonded,
    isLoadingValidatorsBonded,
    errorValidatorsBonded,
  } = useAllValidatorsBonded();
  const {
    allValidatorsUnbonded,
    isLoadingValidatorsUnbonded,
    errorValidatorsUnbonded,
  } = useAllValidatorsUnbonded();
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
        ? allValidatorsBonded
            ?.sort((a, b) => b.tokens - a.tokens)
            ?.filter((item) =>
              item?.description?.moniker
                .toLowerCase()
                .includes(searchValue.toLowerCase())
            )
            ?.map((item, index) => (
              <tr key={index} className="caption2 color-am-white-300">
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
                  />
                </td>
                {index < 10 ? (
                  <td>
                    <OverlayTrigger
                      as="span"
                      overlay={
                        <Tooltip as id={"doNotStake"}>
                          It is preferable to not stake to the top 10 validators
                        </Tooltip>
                      }
                    >
                      <i className="bi bi-patch-exclamation-fill text-warning" />
                    </OverlayTrigger>
                  </td>
                ) : (
                  <td></td>
                )}
                {activeValidators ? <td>{index + 1}</td> : null}
                <td>
                  <div
                    className="d-flex position-relative rounded-circle overflow-hidden"
                    style={{ width: "25px", aspectRatio: "1/1" }}
                  >
                    <img
                      layout="fill"
                      className="h-100 w-100"
                      style={{ objectFit: "cover", objectPosition: "center" }}
                      alt={item?.description?.moniker}
                      src={`/validatorAvatars/${item?.operatorAddress}.png`}
                      onError={handleOnError}
                    />
                  </div>
                </td>
                <td className="d-flex align-items-center justify-content-start gap-1 text-white">
                  <a
                    className="text-truncate text-white"
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
                <td>
                  {shiftDecimalPlaces(
                    item?.commission?.commissionRates?.rate,
                    -16
                  )}
                  %
                </td>
                <td>
                  {getBalanceStyle(
                    fromChainDenom(item?.tokens, 2),
                    "caption2 text-white-300",
                    "small text-white-300"
                  )}
                </td>
                <td>
                  {delegatedValidators?.find(
                    (element) =>
                      element?.operatorAddress == item?.operatorAddress
                  )
                    ? getBalanceStyle(
                        fromChainDenom(
                          delegatedValidators?.find(
                            (element) =>
                              element?.operatorAddress == item?.operatorAddress
                          )?.delegatedAmount
                        ),
                        "caption2 text-white-300",
                        "small text-white-300"
                      )
                    : "-"}
                </td>
              </tr>
            ))
        : allValidatorsUnbonded
            ?.filter((item) =>
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
                    className="d-flex position-relative rounded-circle overflow-hidden"
                    style={{ width: "25px", aspectRatio: "1/1" }}
                  >
                    <img
                      layout="fill"
                      className="h-100 w-100"
                      style={{ objectFit: "cover", objectPosition: "center" }}
                      alt={item?.description?.moniker}
                      src={`/validatorAvatars/${item?.operatorAddress}.png`}
                      onError={handleOnError}
                    />
                  </div>
                </td>
                <td className="d-flex align-items-center justify-content-start gap-1">
                  <a
                    className="text-truncate text-white"
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

                <td>
                  {shiftDecimalPlaces(
                    item?.commission?.commissionRates?.rate,
                    -16
                  )}{" "}
                  %
                </td>

                <td>
                  {getBalanceStyle(
                    fromChainDenom(item?.tokens, 2),
                    "caption2 text-white-300",
                    "small text-white-300"
                  )}
                </td>
                <td>
                  {" "}
                  {delegatedValidators?.find(
                    (element) =>
                      element?.operatorAddress == item?.operatorAddress
                  )
                    ? getBalanceStyle(
                        fromChainDenom(
                          delegatedValidators?.find(
                            (element) =>
                              element?.operatorAddress == item?.operatorAddress
                          )?.delegatedAmount
                        ),
                        "caption2 text-white-300",
                        "small text-white-300"
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
