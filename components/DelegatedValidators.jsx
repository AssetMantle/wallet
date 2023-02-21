import React from "react";
import { getBalanceStyle } from "../config";
import {
  fromChainDenom,
  useAllValidatorsBonded,
  useAllValidatorsUnbonded,
} from "../data";
import { shiftDecimalPlaces } from "../lib";

const DelegatedValidators = ({
  searchValue,
  activeValidators,
  stakeState,
  totalTokens,
  stakeDispatch,
  setShowClaimError,
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
        ? delegatedValidators
            ?.sort((a, b) => b.tokens - a.tokens)
            ?.filter(
              (item) =>
                allValidatorsBonded?.find(
                  (e) => item?.operatorAddress == e?.operatorAddress
                ) &&
                item?.description?.moniker?.toLowerCase()?.includes(searchValue)
            )
            ?.map((item, index) => (
              <tr key={index} className="caption2 text-white-300">
                <td>
                  <input
                    type="checkbox"
                    checked={stakeState?.selectedValidators?.includes(
                      item?.operatorAddress
                    )}
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
                {activeValidators ? <td>{index + 1}</td> : null}
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
                  <a
                    className="text-truncate"
                    href={`https://explorer.assetmantle.one/validators/${item.operatorAddress}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {" "}
                    {item?.description?.moniker}{" "}
                    <i className="bi bi-arrow-up-right" />
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
                  {" "}
                  {getBalanceStyle(
                    fromChainDenom(
                      delegatedValidators?.find(
                        (element) =>
                          element?.operatorAddress == item?.operatorAddress
                      )?.delegatedAmount
                    ),
                    "caption2 text-white-300",
                    "small text-white-300"
                  ) || "-"}
                </td>
              </tr>
            ))
        : delegatedValidators
            ?.filter(
              (item) =>
                allValidatorsUnbonded?.find(
                  (e) => item?.operatorAddress == e?.operatorAddress
                ) &&
                item?.description?.moniker?.toLowerCase()?.includes(searchValue)
            )

            ?.map((item, index) => (
              <tr key={index} className="caption2 text-white-300">
                <td>
                  <input
                    type="checkbox"
                    checked={stakeState?.selectedValidators?.includes(
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
                      alt={item?.description?.moniker}
                      className="rounded-circle"
                      layout="fill"
                      src={`/validatorAvatars/${item?.operatorAddress}.png`}
                      onError={handleOnError}
                    />
                  </div>
                </td>
                <td className=" d-flex align-items-center justify-content-start gap-1">
                  <a
                    className="text-truncate"
                    href={`https://explorer.assetmantle.one/validators/${item.operatorAddress}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {" "}
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
                  {" "}
                  {getBalanceStyle(
                    fromChainDenom(
                      delegatedValidators?.find(
                        (element) =>
                          element?.operatorAddress == item?.operatorAddress
                      )?.delegatedAmount
                    ),
                    "caption2 text-white-300",
                    "small text-white-300"
                  ) || "-"}
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

export default DelegatedValidators;
