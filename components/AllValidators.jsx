import Image from "next/image";
import React from "react";

const AllValidators = ({
  searchValue,
  activeValidators,
  validatorsArray,
  stakeState,
  stakeDispatch,
  totalTokens,
}) => {
  console.log(
    validatorsArray
      ?.filter(
        (item) =>
          item?.status === "BOND_STATUS_BONDED" &&
          item?.description?.moniker
            .toLowerCase()
            .includes(searchValue.toLowerCase())
      )
      .map((item) =>
        item?.description?.moniker
          .toLowerCase()
          .includes(searchValue.toLowerCase())
      )
  );
  //&&
  // item?.description?.moniker?.includes(searchValue)

  return (
    <>
      {activeValidators
        ? validatorsArray
            ?.filter(
              (item) =>
                item?.status === "BOND_STATUS_BONDED" &&
                item?.description?.moniker
                  .toLowerCase()
                  .includes(searchValue.toLowerCase())
            )
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
                  <div className="d-flex flex-row align-items-center justify-content-between">
                    <div
                      className="d-flex position-relative rounded-circle"
                      style={{ width: "25px", aspectRatio: "1/1" }}
                    >
                      <Image
                        layout="fill"
                        alt={item?.description?.moniker}
                        className="rounded-circle"
                        src={`/validatoravatars/${item?.operator_address}.png`}
                        // onError={(e) => (e.target.src = "/favicon.png")}
                      />
                    </div>
                    {item?.description?.moniker}
                  </div>
                </td>
                <td className="text-white">
                  {((item?.tokens * 100) / totalTokens).toFixed(2)}
                </td>
                <td className="text-white">
                  {item?.commission?.commission_rates?.rate * 100}
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
                  <div className="d-flex flex-row align-items-center justify-content-between">
                    <div
                      className="d-flex position-relative rounded-circle"
                      style={{ width: "25px", aspectRatio: "1/1" }}
                    >
                      <Image
                        layout="fill"
                        alt={item?.description?.moniker}
                        className="rounded-circle"
                        src={`/validatoravatars/${item?.operator_address}.png`}
                        // onError={(e) => (e.target.src = "/favicon.png")}
                      />
                    </div>
                    {item?.description?.moniker}
                  </div>
                </td>
                <td className="text-white">
                  {((item?.tokens * 100) / totalTokens).toFixed(2)}
                </td>
                <td className="text-white">
                  {(item?.commission?.commission_rates?.rate * 100).toFixed(0)}
                </td>
                <td className="text-white">{item?.tokens / 1000000}</td>
              </tr>
            ))}
    </>
  );
};

export default AllValidators;
