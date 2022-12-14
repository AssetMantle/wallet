import Image from "next/image";
import React from "react";

const AllValidators = ({
  setShowClaimError,
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
              <tr key={index} className="caption2 text-white-300">
                <td>
                  <input
                    type="checkbox"
                    checked={stakeState?.selectedValidators.includes(
                      item?.operator_address
                    )}
                    onChange={() => {
                      setShowClaimError(false);
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
                <td>{index + 1}</td>
                <td>
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
                </td>
                <td className=" d-flex align-items-center justify-content-center gap-1">
                  {item?.description?.moniker}
                </td>
                <td>{((item?.tokens * 100) / totalTokens).toFixed(2)}%</td>
                <td>
                  {Math.floor(item?.commission?.commission_rates?.rate * 100)}%
                </td>
                <td>{(item?.tokens / 1000000).toFixed(2)}</td>
              </tr>
            ))
        : validatorsArray
            ?.filter((item) => item?.status === "BOND_STATUS_UNBONDED")
            ?.map((item, index) => (
              <tr key={index} className="caption2 text-white-300">
                <td>
                  <input
                    type="checkbox"
                    checked={stakeState?.selectedValidators.includes(
                      item?.operator_address
                    )}
                    onChange={() => {
                      setShowClaimError(false);
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
                <td>{index + 1}</td>
                <td>
                  {" "}
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
                </td>
                <td className=" d-flex align-items-center justify-content-around gap-1">
                  {item?.description?.moniker}
                </td>
                <td>{((item?.tokens * 100) / totalTokens).toFixed(2)}%</td>
                <td>
                  {Math.floor(item?.commission?.commission_rates?.rate * 100)}%
                </td>
                <td>{(item?.tokens / 1000000).toFixed(2)}</td>
              </tr>
            ))}
    </>
  );
};

export default AllValidators;
