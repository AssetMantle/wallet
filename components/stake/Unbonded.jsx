import { useChain } from "@cosmos-kit/react";
import BigNumber from "bignumber.js";
import React, { useState } from "react";
import {
  defaultChainName,
  defaultChainSymbol,
  getBalanceStyle,
  usdSymbol,
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
import { Button, Modal, Stack } from "react-bootstrap";

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
  const { status } = walletManager;
  const [activeValidators, setActiveValidators] = useState(true);
  const { totalUnbondingAmount, allUnbonding } = useTotalUnbonding();
  const { mntlUsdValue } = useMntlUsd();
  const { allValidatorsBonded } = useAllValidatorsBonded();
  const { allValidatorsUnbonded } = useAllValidatorsUnbonded();

  const isConnected = status == "Connected";

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

  const unbondingDisplay = isConnected
    ? getBalanceStyle(fromChainDenom(unbondingValue), "caption", "caption2")
    : getBalanceStyle(
        fromChainDenom(unbondingValue),
        "caption text-body",
        "caption2 text-body"
      );

  const unbondingInUSD = BigNumber(fromDenom(unbondingValue))
    .multipliedBy(BigNumber(mntlUsdValue))
    .toString();

  const unbondingInUSDDisplay = isConnected
    ? getBalanceStyle(decimalize(unbondingInUSD), "caption2", "small")
    : getBalanceStyle(
        decimalize(unbondingInUSD),
        "caption2 text-body",
        "small text-body"
      );

  const secondsInADay = 86400;

  const isSubmitDisabled = status != "Connected";

  const handleOnError = (e) => {
    e.preventDefault();
    // console.log("e: ", e);
    e.target.src = "/validatorAvatars/alt.png";
  };

  return (
    <div className="bg-black p-3 rounded-4 gap-3">
      <Stack className="" gap={2}>
        <p
          className={`caption d-flex gap-2 align-items-center m-0
          ${isConnected ? "null" : "text-body"}`}
        >
          Undelegating
        </p>
        <p className={`caption m-0 ${isConnected ? "" : "text-body"}`}>
          {unbondingDisplay}
          &nbsp;{denomDisplay}
        </p>
        <p className={`caption2 m-0 ${isConnected ? "" : "text-body"}`}>
          {unbondingInUSDDisplay}
          &nbsp;{usdSymbol}
        </p>
        <Stack direction="horizontal" className="justify-content-end">
          {allUnbonding?.length != 0 && !isSubmitDisabled ? (
            <button
              className="d-flex align-items-center gap-1 am-link text-start caption2 text-primary"
              onClick={() => {
                stakeDispatch({ type: "EMPTY_SELECTED_VALIDATORS" });
                setUnBondingModal(true);
              }}
            >
              <i className="text-primary bi bi-eye"></i>View
            </button>
          ) : null}
        </Stack>
      </Stack>

      {/* Unbonding Modal */}
      <Modal
        show={unBondingModal}
        onHide={() => setUnBondingModal(false)}
        centered
        size="lg"
        aria-labelledby="receive-modal"
      >
        <Modal.Body className="p-0">
          <Stack className="m-auto p-4 rounded-3 w-100">
            <Stack
              className="align-items-center justify-content-between"
              direction="horizontal"
            >
              <h5 className="body2 text-primary d-flex align-items-center gap-2 m-0">
                <button
                  type="button"
                  className="primary"
                  onClick={() => setUnBondingModal(false)}
                  style={{ background: "none" }}
                >
                  <i className="bi bi-chevron-left text-primary" />
                </button>
                Undelegating List
              </h5>
              <button
                type="button"
                className="primary"
                onClick={() => setUnBondingModal(false)}
                style={{ background: "none" }}
              >
                <i className="bi bi-x-lg text-primary" />
              </button>
            </Stack>
            <Stack className="pt-4 text-center">
              <Stack className="justify-content-between" direction="horizontal">
                <Stack className="bg-black w-100 rounded-3 px-3 py-1">
                  <Stack
                    className="align-items-center justify-content-between my-2 w-100"
                    gap={3}
                    direction="horizontal"
                  >
                    <Stack
                      direction="horizontal"
                      className="border border-white rounded-3 py-1 px-3 align-items-center flex-grow-1"
                      gap={2}
                    >
                      <i className="bi bi-search text-primary"></i>
                      <input
                        type="search"
                        className="bg-transparent p-1 w-100 h-100"
                        placeholder="Search"
                        onChange={(e) => setSearchValue(e.target.value)}
                        aria-label="Search"
                        style={{ border: "none" }}
                      />
                    </Stack>
                    <div className="btn-group">
                      <Button
                        variant={`${
                          activeValidators ? "primary" : "outline-light"
                        }`}
                        className={`${
                          activeValidators ? "text-dark" : ""
                        } caption`}
                        onClick={() => setActiveValidators(true)}
                      >
                        Active
                      </Button>
                      <Button
                        variant={`${
                          !activeValidators ? "primary" : "outline-light"
                        }`}
                        className={`${
                          !activeValidators ? "text-dark" : ""
                        } caption`}
                        onClick={() => setActiveValidators(false)}
                      >
                        Inactive
                      </Button>
                    </div>
                  </Stack>
                  <Stack
                    className="w-100 mt-3 overflow-auto"
                    direction="horizontal"
                    style={{ maxHeight: "400px" }}
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
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Unbonded;
