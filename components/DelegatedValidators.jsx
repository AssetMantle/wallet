import React from "react";
import { useDelegatedValidators } from "../data";

const DelegatedValidators = ({ activeValidators, stakeState, totalTokens }) => {
  const {
    delegatedValidators,
    totalDelegatedAmount,
    isLoadingDelegatedAmount,
    errorDelegatedAmount,
  } = useDelegatedValidators();
  return (
    <>
      {activeValidators
        ? delegatedValidators
            ?.filter((item) => item?.status === "BOND_STATUS_BONDED")
            ?.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => {
                      setShowClaimError(false);
                      stakeState?.selectedValidators?.includes(
                        item?.operator_address
                      )
                        ? stakeDispatch({
                            type: "REMOVE_FROM_SELECTED_VALIDATORS",
                            payload: item?.operator_address,
                          })
                        : stakeDispatch({
                            type: "SET_SELECTED_VALIDATORS",
                            payload: item?.operator_address,
                          });
                    }}
                  ></input>
                </td>
                <td className="text-white">{index + 1}</td>
                <td className="text-white">
                  <img
                    style={{ height: "25px" }}
                    src={`validatoravatars/${item?.operator_address}.png`}
                    // onError={()=>this.src='favicon.png'}
                  />
                </td>
                <td className="text-white">{item?.description?.moniker}</td>
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
        : delegatedValidators
            ?.filter((item) => item?.status === "BOND_STATUS_UNBONDED")
            ?.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    onChange={() => {
                      stakeState?.selectedValidators.includes(
                        item?.operator_address
                      )
                        ? stakeDispatch({
                            type: "REMOVE_FROM_SELECTED_VALIDATORS",
                            payload: item?.operator_address,
                          })
                        : stakeDispatch({
                            type: "SET_SELECTED_VALIDATORS",
                            payload: item?.operator_address,
                          });
                    }}
                  ></input>
                </td>
                <td className="text-white">{index + 1}</td>
                <td className="text-white">
                  <img
                    style={{ height: "25px" }}
                    src={`validatoravatars/${item?.operator_address}.png`}
                    // onError={()=>this.src='favicon.png'}
                  />
                </td>
                <td className="text-white">{item?.description?.moniker}</td>
                <td className="text-white">
                  {" "}
                  {((item?.tokens * 100) / totalTokens).toFixed(4)}%
                </td>
                <td className="text-white">
                  {item?.commission?.commission_rates?.rate * 100}%
                </td>
                <td className="text-white">{item?.tokens / 1000000}</td>
              </tr>
            ))}
    </>
  );
};

export default DelegatedValidators;
