import React, { useState } from "react";
import {
  useTotalDelegations,
  useDelegatedValidators,
  useAllValidators,
} from "../data/swrStore";

const Stake = () => {
  const [delegated, setDelegated] = useState(false);
  const {
    delegatedValidators,
    totalDelegatedAmount,
    isLoadingDelegatedAmount,
    errorDelegatedAmount,
  } = useDelegatedValidators();
  const { allValidators, isLoadingValidators, errorValidators } =
    useAllValidators();

  let validatorsArray = allValidators.sort((a, b) => b.tokens - a.tokens);
  validatorsArray.forEach((item, index) => {
    if (item?.description?.moniker?.includes("Foundation Node")) {
      validatorsArray.push(validatorsArray.splice(index, 1)[0]);
    }
  });

  const totalTokens = validatorsArray.reduce(
    (accumulator, currentValue) => accumulator + parseInt(currentValue.tokens),
    0
  );

  return (
    <div className="card bg-gray-800">
      <div onClick={() => setDelegated((prev) => !prev)}>
        {delegated ? (
          <i className="bi bi-toggle-on fs-1 text-primary"></i>
        ) : (
          <i className="bi bi-toggle-off fs-1 text-primary"></i>
        )}
      </div>
      <div className="card-body">
        <table className="table nav-bg">
          <thead>
            <tr>
              <th className="text-white" scope="col">
                Rank
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
  );
};

export default Stake;
