import React, { useState, useEffect } from "react";
import {
  useTotalDelegations,
  useDelegatedValidators,
  useAllValidators,
  useAllProposals,
} from "../data/swrStore";
import StakedToken from "../views/StakedToken";
import {
  sendRedelegation,
  sendRewards,
  sendDelegation,
  sendUndelegation,
  sendVote,
} from "../data";
import { useWallet } from "@cosmos-kit/react";

const Stake = () => {
  const [delegated, setDelegated] = useState(false);
  const [selectedValidator, setSelectedValidator] = useState([]);
  const walletManager = useWallet();
  const { getSigningStargateClient, address, status } = walletManager;
  const {
    delegatedValidators,
    totalDelegatedAmount,
    isLoadingDelegatedAmount,
    errorDelegatedAmount,
  } = useDelegatedValidators();
  const { allValidators, isLoadingValidators, errorValidators } =
    useAllValidators();
  const { allProposals, isLoadingProposals, errorProposals } =
    useAllProposals();
  //Get array of validators sorted on basis of tokens to map through for list of all validators
  let validatorsArray = allValidators.sort((a, b) => b.tokens - a.tokens);

  //Put all foundation nodes at the end of the array
  validatorsArray.forEach((item, index) => {
    if (item?.description?.moniker?.includes("Foundation Node")) {
      validatorsArray.push(validatorsArray.splice(index, 1)[0]);
    }
  });

  //calculate total tokens to calculate voting power for each validator
  const totalTokens = validatorsArray.reduce(
    (accumulator, currentValue) => accumulator + parseInt(currentValue.tokens),
    0
  );

  //Dummy Data
  const dataObject = {
    delegatorAddress: "mantle1jxe2fpgx6twqe7nlxn4g96nej280zcemgqjmk0",
    validatorSrcAddress: "mantlevaloper1qpkax9dxey2ut8u39meq8ewjp6rfsm3hlsyceu",
    validatorDstAddress: "mantlevaloper1p0wy6wdnw05h33rfeavqt3ueh7274hcl420svt",
    proposalId: 1,
    option: "yes",
  };

  const handleStake = async () => {
    const { response, error } = await sendDelegation(
      dataObject?.delegatorAddress,
      dataObject?.validatorSrcAddress,
      { amount: dataObject?.amount.toString(), denom: "umntl" },
      dataObject?.memo,
      { getSigningStargateClient }
    );
    console.log("response: ", response, " error: ", error);
  };

  const handleVote = async () => {
    const { response, error } = await sendVote(
      dataObject?.proposalId,
      dataObject?.delegatorAddress,
      dataObject?.option,
      dataObject?.memo,
      { getSigningStargateClient }
    );
    console.log("response: ", response, " error: ", error);
  };

  return (
    <>
      <section className="row">
        <button onClick={handleVote}>click</button>
        <div className="card bg-gray-800 col-12 col-lg-8">
          <div className="d-flex justify-content-between">
            <p className="text-primary fs-3">Validators</p>
            <div className="btn-group">
              <button className="btn btn-primary">Active</button>
              <button className="btn btn-primary">Inactive</button>
            </div>
          </div>
          <div className="card-body ">
            <div className="input-group">
              <span className="input-group-text" id="basic-addon1">
                <i className="bi bi-search text-primary"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search"
                aria-label="Search"
              ></input>
            </div>
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
                {delegated
                  ? delegatedValidators.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="checkbox"
                            onChange={() => {
                              selectedValidator.includes(item?.operator_address)
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
                          {/* <img
                    alt="validator-logo"
                    // src={`https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${item?.description?.identity}&fields=pictures`}
                    src={()=}
                  ></img> */}
                          {item?.description?.moniker}
                        </td>
                        <td className="text-white">
                          {" "}
                          {((item?.tokens * 100) / totalTokens).toFixed(4)}%
                        </td>
                        <td className="text-white">
                          {item?.commission?.commission_rates?.rate * 100}%
                        </td>
                        <td className="text-white">{item?.tokens / 1000000}</td>
                      </tr>
                    ))
                  : allValidators.length !== 1 &&
                    allValidators &&
                    validatorsArray.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedValidator.includes(
                              item?.operator_address
                            )}
                            onChange={() => {
                              selectedValidator.includes(item?.operator_address)
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
                          {/* <img
                    alt="validator-logo"
                    // src={`https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${item?.description?.identity}&fields=pictures`}
                    src={()=}
                  ></img> */}
                          {item?.description?.moniker}
                        </td>
                        <td className="text-white">
                          {((item?.tokens * 100) / totalTokens).toFixed(4)}%
                        </td>
                        <td className="text-white">
                          {item?.commission?.commission_rates?.rate * 100}%
                        </td>
                        <td className="text-white">{item?.tokens / 1000000}</td>
                      </tr>
                    ))}
              </thead>
            </table>
          </div>
        </div>

        <StakedToken selectedValidator={selectedValidator} />
      </section>
    </>
  );
};

export default Stake;
