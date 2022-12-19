import React, { useState } from "react";
import {
  chainSymbol,
  placeholderMntlUsdValue,
  placeholderTotalUnbonding,
} from "../config";
import {
  fromDenom,
  useTotalUnbonding,
  useMntlUsd,
  useDelegatedValidators,
} from "../data/swrStore";

const denomDisplay = chainSymbol;

const Unbonded = ({ selectedValidator, setSelectedUndelegation }) => {
  const [activeValidators, setActiveValidators] = useState(true);
  const {
    totalUnbondingAmount,
    allUnbonding,
    isLoadingUnbonding,
    errorUnbonding,
  } = useTotalUnbonding();
  const { mntlUsdValue, errorMntlUsdValue } = useMntlUsd();
  const {
    delegatedValidators,
    totalDelegatedAmount,
    isLoadingDelegatedAmount,
    errorDelegatedAmount,
  } = useDelegatedValidators();

  const selectedUnbonding = allUnbonding
    ?.filter((unbondingObject) =>
      selectedValidator?.includes(unbondingObject.validator_address)
    )
    .reduce(
      (accumulator, currentValue) =>
        accumulator + parseFloat(currentValue?.entries[0]?.balance),
      0
    );

  const cumulativeUnbonding = errorUnbonding
    ? placeholderTotalUnbonding
    : fromDenom(totalUnbondingAmount);
  const unbondingDisplay = selectedValidator.length
    ? fromDenom(selectedUnbonding)
    : fromDenom(cumulativeUnbonding);

  const unbondingInUSDDisplay =
    errorUnbonding ||
    errorMntlUsdValue | isNaN(fromDenom(totalUnbondingAmount)) ||
    isNaN(parseFloat(mntlUsdValue))
      ? placeholderMntlUsdValue
      : (fromDenom(totalUnbondingAmount) * parseFloat(mntlUsdValue))
          .toFixed(6)
          .toString();

  function getTimeRemaining(endtime) {
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    return {
      total,
      days,
      hours,
      minutes,
      seconds,
    };
  }

  return (
    <div className="nav-bg p-3 rounded-4 gap-3">
      <div className="d-flex flex-column gap-2">
        <p className="caption d-flex gap-2 align-items-center">Unbonding</p>
        <p className="caption">
          {unbondingDisplay}&nbsp;{denomDisplay}
        </p>
        <p className="caption">
          {unbondingInUSDDisplay}&nbsp;{"$USD"}
        </p>
        <div className="d-flex justify-content-end">
          <button
            data-bs-toggle="modal"
            data-bs-target="#viewUnbondingModal"
            className="am-link text-start"
          >
            <i className="text-primary bi bi-eye"></i>View
          </button>
        </div>
      </div>
      <div
        className="modal "
        tabIndex="-1"
        role="dialog"
        id="viewUnbondingModal"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Undelegating List</h5>
              <button
                type="button"
                className="btn-close primary"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body p-4 text-center d-flex flex-column">
              <div className="d-flex justify-content-between nav-bg">
                <div className="d-flex flex-column">
                  <div className="input-group d-flex">
                    <span className="input-group-text" id="basic-addon1">
                      <i className="bi bi-search text-primary"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search"
                      aria-label="Search"
                    ></input>
                    <div className="btn-group">
                      <button
                        className={
                          activeValidators
                            ? "btn btn-primary"
                            : "btn btn-inactive"
                        }
                        onClick={() => setActiveValidators(true)}
                      >
                        Active
                      </button>
                      <button
                        className={
                          !activeValidators
                            ? "btn btn-primary"
                            : "btn btn-inactive"
                        }
                        onClick={() => setActiveValidators(false)}
                      >
                        Inactive
                      </button>
                    </div>
                  </div>
                  <table className="table nav-bg">
                    <thead>
                      <tr>
                        <th className="text-white" scope="col">
                          Validator Name
                        </th>
                        <th className="text-white" scope="col">
                          Unelegating Amount
                        </th>
                        <th className="text-white" scope="col">
                          Duration Left
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUnbonding?.map((item, index) => (
                        <tr key={index}>
                          <td
                            data-bs-toggle="modal"
                            data-bs-target="#viewUndelegatingModal"
                            className="text-white"
                            onClick={() =>
                              setSelectedUndelegation(item?.address)
                            }
                          >
                            {
                              delegatedValidators?.find(
                                (ele) => ele?.operator_address === item?.address
                              )?.description?.moniker
                            }
                          </td>
                          <td className="text-white">{item?.balance}</td>
                          <td className="text-white">
                            {getTimeRemaining(item?.completion_time).days} days,{" "}
                            {getTimeRemaining(item?.completion_time).hours}{" "}
                            hours
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unbonded;
