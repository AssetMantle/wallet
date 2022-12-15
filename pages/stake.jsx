import React, { useState, useEffect } from "react";
import {
  useDelegatedValidators,
  useAllValidators,
  useAllProposals,
} from "../data/swrStore";
import StakedToken from "../views/StakedToken";
import { useWallet } from "@cosmos-kit/react";

const Stake = () => {
  const [activeValidators, setActiveValidators] = useState(true);
  const [delegated, setDelegated] = useState(false);
  const [selectedValidator, setSelectedValidator] = useState([]);
  const {
    delegatedValidators,
    totalDelegatedAmount,
    isLoadingDelegatedAmount,
    errorDelegatedAmount,
  } = useDelegatedValidators();
  const { allValidators, isLoadingValidators, errorValidators } =
    useAllValidators();

  let validatorsArray = allValidators.sort((a, b) => b.tokens - a.tokens);

  //Put all foundation nodes at the end of the array
  validatorsArray.forEach((item, index) => {
    if (item?.description?.moniker?.includes("Foundation Node")) {
      validatorsArray.push(validatorsArray.splice(index, 1)[0]);
    }
  });

  //Calculate total tokens to calculate voting power
  const totalTokens = validatorsArray.reduce(
    (accumulator, currentValue) => accumulator + parseInt(currentValue.tokens),
    0
  );

  return (
    <>
      <section className="row">
        <div className="card bg-gray-800 col-12 col-lg-8">
          <div
            className="d-flex align-items-center"
            onClick={() => {
              setDelegated((prev) => !prev);
              setSelectedValidator([]);
            }}
          >
            Delegated
            {delegated ? (
              <i className="bi bi-toggle-on fs-1 text-primary"></i>
            ) : (
              <i className="bi bi-toggle-off fs-1 text-primary"></i>
            )}
          </div>
          <div className="card-body ">
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
                    activeValidators ? "btn btn-primary" : "btn btn-inactive"
                  }
                  onClick={() => setActiveValidators(true)}
                >
                  Active
                </button>
                <button
                  className={
                    !activeValidators ? "btn btn-primary" : "btn btn-inactive"
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
                  <th>
                    <input type="checkbox"></input>
                  </th>
                  <th className="text-white" scope="col">
                    Rank
                  </th>
                  <th className="text-white" scope="col">
                    Avatar
                  </th>
                  <th className="text-white" scope="col">
                    Validator Name
                  </th>
                  <th className="text-white" scope="col">
                    Voting Power
                  </th>
                  <th className="text-white" scope="col">
                    Commission
                  </th>
                  <th className="text-white" scope="col">
                    Delegated Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {delegated
                  ? activeValidators
                    ? delegatedValidators
                        ?.filter(
                          (item) => item?.status === "BOND_STATUS_BONDED"
                        )
                        ?.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                type="checkbox"
                                onChange={() => {
                                  selectedValidator.includes(
                                    item?.operator_address
                                  )
                                    ? setSelectedValidator((prev) =>
                                        prev.filter(
                                          (element) =>
                                            element !== item?.operator_address
                                        )
                                      )
                                    : setSelectedValidator((prev) => [
                                        ...prev,
                                        item?.operator_address,
                                      ]);
                                }}
                              ></input>
                            </td>
                            <td className="text-white">{index + 1}</td>
                            <td className="text-white">
                              <img
                                style={{ height: "25px" }}
                                src={`https://raw.githubusercontent.com/cosmostation/cosmostation_token_resource/master/moniker/asset-mantle/${item?.operator_address}.png`}
                                onerror="this.src='favicon.png';"
                              />
                            </td>
                            <td className="text-white">
                              {item?.description?.moniker}
                            </td>
                            <td className="text-white">
                              {" "}
                              {((item?.tokens * 100) / totalTokens).toFixed(4)}%
                            </td>
                            <td className="text-white">
                              {item?.commission?.commission_rates?.rate * 100}%
                            </td>
                            <td className="text-white">
                              {item?.tokens / 1000000}
                            </td>
                          </tr>
                        ))
                    : delegatedValidators
                        ?.filter(
                          (item) => item?.status === "BOND_STATUS_UNBONDED"
                        )
                        ?.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <input
                                type="checkbox"
                                onChange={() => {
                                  selectedValidator.includes(
                                    item?.operator_address
                                  )
                                    ? setSelectedValidator((prev) =>
                                        prev.filter(
                                          (element) =>
                                            element !== item?.operator_address
                                        )
                                      )
                                    : setSelectedValidator((prev) => [
                                        ...prev,
                                        item?.operator_address,
                                      ]);
                                }}
                              ></input>
                            </td>
                            <td className="text-white">{index + 1}</td>
                            <td className="text-white">
                              <img
                                style={{ height: "25px" }}
                                src={`https://raw.githubusercontent.com/cosmostation/cosmostation_token_resource/master/moniker/asset-mantle/${item?.operator_address}.png`}
                                onerror="this.src='favicon.png';"
                              />
                            </td>
                            <td className="text-white">
                              {item?.description?.moniker}
                            </td>
                            <td className="text-white">
                              {" "}
                              {((item?.tokens * 100) / totalTokens).toFixed(4)}%
                            </td>
                            <td className="text-white">
                              {item?.commission?.commission_rates?.rate * 100}%
                            </td>
                            <td className="text-white">
                              {item?.tokens / 1000000}
                            </td>
                          </tr>
                        ))
                  : allValidators.length !== 1 &&
                    allValidators &&
                    activeValidators
                  ? validatorsArray
                      ?.filter((item) => item?.status === "BOND_STATUS_BONDED")
                      ?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedValidator.includes(
                                item?.operator_address
                              )}
                              onChange={() => {
                                selectedValidator.includes(
                                  item?.operator_address
                                )
                                  ? setSelectedValidator((prev) =>
                                      prev.filter(
                                        (element) =>
                                          element !== item?.operator_address
                                      )
                                    )
                                  : setSelectedValidator((prev) => [
                                      ...prev,
                                      item?.operator_address,
                                    ]);
                              }}
                            ></input>
                          </td>
                          <td className="text-white">{index + 1}</td>
                          <td className="text-white">
                            <img
                              style={{ height: "25px" }}
                              src={`https://raw.githubusercontent.com/cosmostation/cosmostation_token_resource/master/moniker/asset-mantle/${item?.operator_address}.png`}
                            />
                          </td>
                          <td className="text-white">
                            {item?.description?.moniker}
                          </td>
                          <td className="text-white">
                            {((item?.tokens * 100) / totalTokens).toFixed(4)}%
                          </td>
                          <td className="text-white">
                            {item?.commission?.commission_rates?.rate * 100}%
                          </td>
                          <td className="text-white">
                            {item?.tokens / 1000000}
                          </td>
                        </tr>
                      ))
                  : validatorsArray
                      ?.filter(
                        (item) => item?.status === "BOND_STATUS_UNBONDED"
                      )
                      ?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedValidator.includes(
                                item?.operator_address
                              )}
                              onChange={() => {
                                selectedValidator.includes(
                                  item?.operator_address
                                )
                                  ? setSelectedValidator((prev) =>
                                      prev.filter(
                                        (element) =>
                                          element !== item?.operator_address
                                      )
                                    )
                                  : setSelectedValidator((prev) => [
                                      ...prev,
                                      item?.operator_address,
                                    ]);
                              }}
                            ></input>
                          </td>
                          <td className="text-white">{index + 1}</td>
                          <td className="text-white">
                            <img
                              style={{ height: "25px" }}
                              src={`https://raw.githubusercontent.com/cosmostation/cosmostation_token_resource/master/moniker/asset-mantle/${item?.operator_address}.png`}
                            />
                          </td>
                          <td className="text-white">
                            {item?.description?.moniker}
                          </td>
                          <td className="text-white">
                            {((item?.tokens * 100) / totalTokens).toFixed(4)}%
                          </td>
                          <td className="text-white">
                            {item?.commission?.commission_rates?.rate * 100}%
                          </td>
                          <td className="text-white">
                            {item?.tokens / 1000000}
                          </td>
                        </tr>
                      ))}
              </tbody>
            </table>
          </div>
        </div>

        <StakedToken
          totalTokens={totalTokens}
          selectedValidator={selectedValidator}
        />
        <div className="modal " tabIndex="-1" role="dialog" id="manifestModal">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Trsnaction Manifest</h5>
                <button
                  type="button"
                  className="btn-close primary"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-4  d-flex flex-column">
                Transaction Details:
                <div className="nav-bg ">
                  <p>From:</p>
                  <p>mantle10x0k7tfhd4hm4hgasfuyg689khb34w4a6kbd6v2v</p>
                  <p>To:</p>
                  <p>mantle10x0k7tfhd4hm4hgasfuyg689khb34w4a6kbd6v2v</p>
                  <p>Amount</p>
                  <p>12345 $MNTL</p>
                  <p>Transaction Type:</p>
                  <p>Send</p>
                  <p>Transaction Wallet Type:</p>
                  <p>Keplr</p>
                </div>
                <div className="d-flex">
                  <i className="bi bi-exclamation-circle text-error"></i>
                  <p>
                    Upon confirmation, Keplr extension will open. Approve
                    transaction in Keplr.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Stake;
