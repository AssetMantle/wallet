import React, { useState } from "react";
import { useEffect } from "react";
import {
  useTotalDelegations,
  useDelegatedValidators,
  useAllValidators,
} from "../data/swrStore";
import StakedToken from "../views/StakedToken";

const Stake = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [delegated, setDelegated] = useState(false);
  const [selectedValidator, setSelectedValidator] = useState([]);
  const [validatorAvatar, setValidatorAvatar] = useState([]);
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

  const fetchIcons = async () => {
    if (allValidators?.length != 1) {
      let allValidatorUrls = allValidators.map(
        (validator) =>
          `https://keybase.io/_/api/1.0/user/lookup.json?key_suffix=${validator?.description?.identity}&fields=pictures`
      );
      let limitValue = 10;

      const singleFetch = async (url) => {
        try {
          const res = await fetch(url);
          const data = await res.json();
          if ("them" in data) {
            const img = data?.them[0]?.pictures?.primary?.url || "";
            return img;
          }
          return "";
        } catch (error) {
          throw error;
        }
      };

      const multifetch = async (urls) => {
        if (urls?.length > 0) {
          return Promise.all(urls.map(singleFetch));
        }
        return [];
      };

      const updateChunk = async (startIndex, allValidatorsUrls) => {
        try {
          let slicedArray = allValidatorUrls.slice(
            startIndex,
            startIndex + limitValue
          );
          let urlChunkArray = await multifetch(slicedArray);
          setValidatorAvatar((pre) => [...pre, ...urlChunkArray]);
          if (startIndex < allValidatorUrls.length) {
            await updateChunk(startIndex + limitValue, allValidatorUrls);
          }
        } catch (error) {
          return [];
        }
      };
      await updateChunk(0, allValidatorUrls);
    }
  };

  const totalTokens = validatorsArray.reduce(
    (accumulator, currentValue) => accumulator + parseInt(currentValue.tokens),
    0
  );

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      await fetchIcons();
      setIsLoading(false);
    })();
  }, [allValidators?.length]);

  return (
    <section className="row">
      <div className="card bg-gray-800 col-12 col-lg-8">
        <div
          className="d-flex align-items-center"
          onClick={() => setDelegated((prev) => !prev)}
        >
          Delegated
          {delegated ? (
            <i className="bi bi-toggle-on fs-1 text-primary"></i>
          ) : (
            <i className="bi bi-toggle-off fs-1 text-primary"></i>
          )}
        </div>
        <div className="card-body ">
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
                        {isLoading ? (
                          "load.."
                        ) : (
                          <img src={validatorAvatar[index]} />
                        )}
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
                      <td className="text-white">{item?.tokens / 1000000}</td>
                    </tr>
                  ))}
            </thead>
          </table>
        </div>
      </div>
      <StakedToken selectedValidator={selectedValidator} />
    </section>
  );
};

export default Stake;
