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
  sortParam,
}) => {
  const {
    allValidatorsBonded,
    // isLoadingValidatorsBonded,
    // errorValidatorsBonded,
  } = useAllValidatorsBonded();
  const {
    allValidatorsUnbonded,
    // isLoadingValidatorsUnbonded,
    // errorValidatorsUnbonded,
  } = useAllValidatorsUnbonded();
  // controller for onError
  const handleOnError = (e) => {
    e.preventDefault();
    e.target.src = "/validatorAvatars/alt.png";
  };

  const allDelegatedValidatorFiltered = delegatedValidators
    ?.sort((a, b) => b.tokens - a.tokens)
    ?.filter(
      (item) =>
        allValidatorsBonded?.find(
          (e) => item?.operatorAddress == e?.operatorAddress
        ) &&
        item?.description?.moniker
          ?.toLowerCase()
          ?.includes(searchValue.toLowerCase())
    );

  const allDelegatedValidatorUsable = allDelegatedValidatorFiltered?.map(
    (el) => ({
      ...el,
      am_delegatedAmount: delegatedValidators?.find(
        (element) => element?.operatorAddress == el?.operatorAddress
      )?.delegatedAmount,
    })
  );

  const allDelegatedValidatorsUsableSorted = (sortBy) => {
    let ascending = true;
    let sortStr = `${sortBy}`;
    if (sortBy[0] === "-") {
      ascending = false;
      let temp = sortBy.split("");
      sortStr = "";
      for (let i = 1; i < temp.length; i++) sortStr += temp[i];
    }

    switch (sortStr) {
      case "name":
        return allDelegatedValidatorUsable?.sort((a, b) => {
          let av = a?.description?.moniker.trim();
          let bv = b?.description?.moniker.trim();
          return ascending ? av?.localeCompare(bv) : bv?.localeCompare(av);
        });
      case "commission":
        return allDelegatedValidatorUsable?.sort((a, b) => {
          let av =
            !isNaN(a?.commission?.commissionRates?.rate) &&
            Number(a?.commission?.commissionRates?.rate);
          let bv =
            !isNaN(b?.commission?.commissionRates?.rate) &&
            Number(b?.commission?.commissionRates?.rate);
          return ascending ? av - bv : bv - av;
        });
      case "delegatedAmount":
        return allDelegatedValidatorUsable?.sort((a, b) => {
          let av =
            !isNaN(a?.am_delegatedAmount) && Number(a?.am_delegatedAmount);
          let bv =
            !isNaN(b?.am_delegatedAmount) && Number(b?.am_delegatedAmount);
          return ascending ? av - bv : bv - av;
        });
      case "tokens":
      default:
        return allDelegatedValidatorUsable?.sort((a, b) =>
          ascending ? b?.tokens - a?.tokens : a?.tokens - b?.tokens
        );
    }
  };

  // const statusArray = [0, 1, 2, -1];

  return (
    <>
      {activeValidators
        ? allDelegatedValidatorsUsableSorted(sortParam)?.map((item, index) => (
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
              {activeValidators ? <td>{item?.rank}</td> : null}
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
                {shiftDecimalPlaces(item?.commission?.commissionRates?.rate, 2)}{" "}
                %
              </td>
              <td>
                {" "}
                {getBalanceStyle(
                  fromChainDenom(item?.am_delegatedAmount),
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
                item?.description?.moniker
                  ?.toLowerCase()
                  ?.includes(searchValue.toLowerCase())
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
                    2
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
