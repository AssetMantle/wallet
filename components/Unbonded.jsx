import { useChain } from "@cosmos-kit/react";
import BigNumber from "bignumber.js";
import React, { useState } from "react";
import {
  defaultChainName,
  defaultChainSymbol,
  getBalanceStyle,
} from "../config";
import {
  decimalize,
  fromChainDenom,
  fromDenom,
  useAllValidatorsBonded,
  useAllValidatorsUnbonded,
  useMntlUsd,
  useTotalUnbonding,
} from "../data";
import ModalContainer from "./ModalContainer";

const denomDisplay = defaultChainSymbol;

const Unbonded = ({
  stakeState,
  stakeDispatch,
  unDelegateModal,
  setUnDelegateModal,
  notify,
}) => {
  const [unBondingModal, setUnBondingModal] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const walletManager = useChain(defaultChainName);
  const { getSigningStargateClient, address, status } = walletManager;
  const [activeValidators, setActiveValidators] = useState(true);
  const { totalUnbondingAmount, allUnbonding } = useTotalUnbonding();
  const { mntlUsdValue } = useMntlUsd();
  const { allValidatorsBonded } = useAllValidatorsBonded();
  const { allValidatorsUnbonded } = useAllValidatorsUnbonded();
  console.log(allValidatorsUnbonded);

  const selectedUnbondingArray = allUnbonding?.filter((unbondingObject) =>
    stakeState?.selectedValidators?.includes(unbondingObject.address)
  );

  const selectedUnbonding = selectedUnbondingArray?.reduce(
    (accumulator, currentValue) =>
      accumulator + parseFloat(currentValue?.balance),
    0
  );

  const unbondingValue = stakeState?.selectedValidators.length
    ? selectedUnbonding
    : totalUnbondingAmount;

  const unbondingDisplay = fromChainDenom(unbondingValue);

  const unbondingInUSDDisplay = decimalize(
    BigNumber(fromDenom(unbondingValue))
      .multipliedBy(BigNumber(mntlUsdValue))
      .toString()
  );

  const handleOnError = (e) => {
    e.preventDefault();
    // console.log("e: ", e);
    e.target.src = "/validatorAvatars/alt.png";
  };

  const secondsInADay = 86400;

  const isSubmitDisabled = status != "Connected";

  const isConnected = status == "Connected";

  console.log(
    allUnbonding
      ?.map((item) => {
        return {
          ...item,
          moniker: allValidatorsUnbonded?.find(
            (e) => e?.operatorAddress == item?.address
          )?.description?.moniker,
        };
      })
      ?.filter((item) =>
        allValidatorsUnbonded?.find((e) => e?.operatorAddress == item?.address)
      )
  );

  return (
    <div className="nav-bg p-3 rounded-4 gap-3">
      <div className="d-flex flex-column gap-2">
        <p
          className={`caption d-flex gap-2 align-items-center
          ${isConnected ? "null" : "text-gray"}`}
        >
          Undelegating
        </p>
        <p className={isConnected ? "caption" : "caption text-gray"}>
          {isConnected
            ? getBalanceStyle(unbondingDisplay, "caption", "caption2")
            : getBalanceStyle(
                unbondingDisplay,
                "caption text-gray",
                "caption2 text-gray"
              )}
          &nbsp;{denomDisplay}
        </p>
        <p className={isConnected ? "caption2" : "caption2 text-gray"}>
          {isConnected
            ? getBalanceStyle(unbondingInUSDDisplay, "caption2", "small")
            : getBalanceStyle(
                unbondingInUSDDisplay,
                "caption2 text-gray",
                "small text-gray"
              )}
          &nbsp;{"$USD"}
        </p>
        <div className="d-flex justify-content-end">
          {allUnbonding?.length != 0 && !isSubmitDisabled ? (
            <button
              className="d-flex align-items-center gap-1 am-link text-start caption2"
              onClick={() => {
                stakeDispatch({ type: "EMPTY_SELECTED_VALIDATORS" });
                setUnBondingModal(true);
              }}
            >
              <i className="text-primary bi bi-eye"></i>View
            </button>
          ) : null}
        </div>
      </div>

      {/* Unbonding Modal */}
      <ModalContainer active={unBondingModal} setActive={setUnBondingModal}>
        <div className="d-flex flex-column bg-gray-700 m-auto p-4 rounded-3 w-100">
          <div className="d-flex align-items-center justify-content-between">
            <h5 className="body2 text-primary d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn-close primary"
                onClick={() => setUnBondingModal(false)}
                style={{ background: "none" }}
              >
                <span className="text-primary">
                  <i className="bi bi-chevron-left" />
                </span>
              </button>
              Undelegating List
            </h5>
            <button
              type="button"
              className="btn-close primary"
              onClick={() => setUnBondingModal(false)}
              style={{ background: "none" }}
            >
              <span className="text-primary">
                <i className="bi bi-x-lg" />
              </span>
            </button>
          </div>
          <div className="pt-4 text-center d-flex flex-column">
            <div className="d-flex justify-content-between">
              <div className="d-flex flex-column nav-bg w-100 rounded-3 px-3 py-1">
                <div className="d-flex align-items-center justify-content-between my-2 w-100 gap-3">
                  <div
                    className="d-flex gap-2 am-input border-color-white rounded-3 py-1 px-3 align-items-center"
                    style={{ flex: "1" }}
                  >
                    <span
                      className="input-group-text bg-t p-0 h-100"
                      id="basic-addon1"
                      style={{ border: "none" }}
                    >
                      <i className="bi bi-search text-primary"></i>
                    </span>
                    <input
                      type="search"
                      className="am-input bg-t p-1 w-100 h-100"
                      placeholder="Search"
                      onChange={(e) => setSearchValue(e.target.value)}
                      aria-label="Search"
                      style={{ border: "none" }}
                    />
                  </div>
                  <div className="btn-group">
                    <button
                      className={`${
                        activeValidators
                          ? "btn btn-primary"
                          : "btn btn-inactive"
                      } caption`}
                      onClick={() => setActiveValidators(true)}
                    >
                      Active
                    </button>
                    <button
                      className={`${
                        !activeValidators
                          ? "btn btn-primary"
                          : "btn btn-inactive"
                      } caption`}
                      onClick={() => setActiveValidators(false)}
                    >
                      Inactive
                    </button>
                  </div>
                </div>
                <div
                  className="d-flex w-100 mt-3"
                  style={{ overflow: "auto", maxHeight: "400px" }}
                >
                  <table className="table text-white">
                    <thead className="bt-0">
                      <tr>
                        <th className="no-text-break text-white" scope="col">
                          Validator Name
                        </th>
                        <th className="no-text-break text-white" scope="col">
                          Undelegating Amount
                        </th>
                        <th className="no-text-break text-white" scope="col">
                          Duration Left
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeValidators
                        ? allUnbonding
                            ?.map((item) => {
                              return {
                                ...item,
                                moniker: allValidatorsBonded?.find(
                                  (e) => e?.operatorAddress == item?.address
                                )?.description?.moniker,
                              };
                            })
                            ?.filter(
                              (item) =>
                                allValidatorsBonded?.find(
                                  (e) => e?.operatorAddress == item?.address
                                ) &&
                                item?.moniker
                                  ?.toLowerCase()
                                  .includes(searchValue.toLowerCase())
                            )
                            ?.map((item, index) => (
                              <tr key={index}>
                                <td className="text-white d-flex">
                                  <div
                                    className="d-flex position-relative rounded-circle me-2"
                                    style={{
                                      width: "25px",
                                      aspectRatio: "1/1",
                                    }}
                                  >
                                    <img
                                      layout="fill"
                                      alt={item?.description?.moniker}
                                      className="rounded-circle"
                                      src={`/validatorAvatars/${item?.address}.png`}
                                      onError={handleOnError}
                                    />
                                  </div>
                                  <a
                                    className="text-truncate"
                                    style={{ maxWidth: "200px" }}
                                    href={`https://explorer.assetmantle.one/validators/${item?.address}`}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {" "}
                                    {item?.moniker}
                                    <i className="bi bi-arrow-up-right" />
                                  </a>
                                </td>
                                <td className="text-white">
                                  {getBalanceStyle(
                                    fromChainDenom(item?.balance),
                                    "caption",
                                    "caption2"
                                  )}
                                </td>
                                <td className="text-white">
                                  {/* Calculate and display number of days left */}
                                  {Math.floor(
                                    ((item?.completion_time?.seconds?.low +
                                      item?.completion_time?.seconds?.high) *
                                      1000 -
                                      new Date().getTime()) /
                                      1000 /
                                      60 /
                                      60 /
                                      24
                                  )}{" "}
                                  days,{" "}
                                  {/* Calculate and display number of hours left */}
                                  {(
                                    ((item?.completion_time?.seconds?.low +
                                      item?.completion_time?.seconds?.high) %
                                      86400) /
                                    3600
                                  ).toFixed(2)}{" "}
                                  hours
                                </td>
                              </tr>
                            ))
                        : allUnbonding
                            ?.map((item) => {
                              return {
                                ...item,
                                moniker: allValidatorsUnbonded?.find(
                                  (e) => e?.operatorAddress == item?.address
                                )?.description?.moniker,
                              };
                            })
                            ?.filter(
                              (item) =>
                                allValidatorsUnbonded?.find(
                                  (e) => e?.operatorAddress == item?.address
                                ) &&
                                item?.moniker
                                  ?.toLowerCase()
                                  .includes(searchValue.toLowerCase())
                            )
                            ?.map((item, index) => (
                              <tr key={index}>
                                <td className="text-white d-flex">
                                  {" "}
                                  <div
                                    className="d-flex position-relative rounded-circle me-2"
                                    style={{
                                      width: "25px",
                                      aspectRatio: "1/1",
                                    }}
                                  >
                                    <img
                                      layout="fill"
                                      alt={item?.description?.moniker}
                                      className="rounded-circle"
                                      src={`/validatorAvatars/${item?.address}.png`}
                                      onError={handleOnError}
                                    />
                                  </div>
                                  <a
                                    className="text-truncate"
                                    style={{ maxWidth: "200px" }}
                                    href={`https://explorer.assetmantle.one/validators/${item?.address}`}
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    {item?.moniker}
                                    <i className="bi bi-arrow-up-right" />{" "}
                                  </a>
                                </td>
                                <td className="text-white">
                                  {getBalanceStyle(
                                    fromChainDenom(item?.balance),
                                    "caption",
                                    "caption2"
                                  )}
                                </td>
                                <td className="text-white">
                                  {/* Calculate and display number of days left */}
                                  {Math.floor(
                                    ((item?.completion_time?.seconds?.low +
                                      item?.completion_time?.seconds?.high) *
                                      1000 -
                                      new Date().getTime()) /
                                      1000 /
                                      60 /
                                      60 /
                                      24
                                  )}{" "}
                                  days,{" "}
                                  {/* Calculate and display number of hours left */}
                                  {(
                                    ((item?.completion_time?.seconds?.low +
                                      item?.completion_time?.seconds?.high) %
                                      86400) /
                                    3600
                                  ).toFixed(2)}{" "}
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
      </ModalContainer>
    </div>
  );
};

export default Unbonded;
