import React from "react";

const AllValidators = ({
  activeValidators,
  validatorsArray,
  stakeState,
  totalTokens,
}) => {
  return (
    <>
      {activeValidators
        ? validatorsArray
            ?.filter((item) => item?.status === "BOND_STATUS_BONDED")
            ?.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={stakeState?.selectedValidators.includes(
                      item?.operator_address
                    )}
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
                  />
                </td>
                <td className="text-white">{item?.description?.moniker}</td>
                <td className="text-white">
                  {((item?.tokens * 100) / totalTokens).toFixed(4)}%
                </td>
                <td className="text-white">
                  {item?.commission?.commission_rates?.rate * 100}%
                </td>
                <td className="text-white">{item?.tokens / 1000000}</td>
              </tr>
            ))
        : validatorsArray
            ?.filter((item) => item?.status === "BOND_STATUS_UNBONDED")
            ?.map((item, index) => (
              <tr key={index}>
                <td>
                  <input
                    type="checkbox"
                    checked={stakeState?.selectedValidators.includes(
                      item?.operator_address
                    )}
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
                  />
                </td>
                <td className="text-white">{item?.description?.moniker}</td>
                <td className="text-white">
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

export default AllValidators;
