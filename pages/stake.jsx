import React, { useState, useReducer } from "react";
import AllValidators from "../components/AllValidators";
import DelegatedValidators from "../components/DelegatedValidators";
import Tooltip from "../components/Tooltip";
import { useDelegatedValidators, useAllValidators } from "../data/swrStore";
import useStakeReducer from "../data/useStakeReducer";
import StakedToken from "../views/StakedToken";
import { HiArrowsUpDown } from "react-icons/hi2";
import { MdOutlineClose } from "react-icons/md";
import { BsChevronLeft, BsChevronDown } from "react-icons/bs";
import { transform } from "typescript";

export default function Stake() {
  const [searchValue, setSearchValue] = useState("");
  const { stakeDispatch, stakeState } = useStakeReducer();
  const [showClaimError, setShowClaimError] = useState(false);
  const [activeValidators, setActiveValidators] = useState(true);
  const [delegated, setDelegated] = useState(false);
  const { allValidators, isLoadingValidators, errorValidators } =
    useAllValidators();
  let validatorsArray = allValidators.sort((a, b) => b.tokens - a.tokens);

  //Put all foundation nodes at the end of the array
  validatorsArray.forEach((item, index) => {
    if (item?.description?.moniker?.includes("Foundation Node")) {
      validatorsArray.push(validatorsArray.splice(index, 1)[0]);
    }
  });

  console.log(allValidators);

  //Calculate total tokens to calculate voting power
  const totalTokens = validatorsArray.reduce(
    (accumulator, currentValue) => accumulator + parseInt(currentValue.tokens),
    0
  );

  // transaction manifest modal states and functions
  const GasOptions = [
    {
      name: "Zero",
      usd: "0.0000",
      mntl: "0.0000",
    },
    {
      name: "Low",
      usd: "0.0000",
      mntl: "0.0000",
    },
    {
      name: "Heigh",
      usd: "0.0000",
      mntl: "0.0000",
    },
  ];
  const [SelectedGasFee, setSelectedGasFee] = useState(GasOptions[0].name);
  const [ManifestShowAdvanced, setManifestShowAdvanced] = useState(false);
  const [ManifestKeystorePassword, setManifestKeystorePassword] = useState();
  const [ManifestCustomGas, setManifestCustomGas] = useState();
  const handleManifestConfirm = () => {
    console.log("Confirming transaction manifest");
  };

  return (
    <>
      <section className="row">
        <div className="card bg-gray-800 col-12 col-lg-8 p-3 rounded-5">
          <div className="d-flex align-items-center justify-content-between my-2 w-100">
            <div className="card-title body2 text-primary my-auto">
              Validators
            </div>
            <div className="btn-group">
              <button
                className={`${
                  activeValidators ? "btn btn-primary" : "btn btn-inactive"
                } caption`}
                onClick={() => setActiveValidators(true)}
              >
                Active
              </button>
              <button
                className={`${
                  !activeValidators ? "btn btn-primary" : "btn btn-inactive"
                } caption`}
                onClick={() => setActiveValidators(false)}
              >
                Inactive
              </button>
            </div>
          </div>
          <div className="nav-bg p-2 mt-2 rounded-4">
            <div className="input-group d-flex w-100 p-2">
              <div className="d-flex align-items-center gap-3 w-100">
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
                    type="text"
                    className="am-input bg-t p-1 w-100 h-100"
                    placeholder="Search"
                    aria-label="Search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{ border: "none" }}
                  />
                </div>
                <div
                  className="d-flex gap-2 align-items-center"
                  onClick={() => {
                    setDelegated((prev) => !prev);
                    stakeDispatch({ type: "EMPTY_SELECTED_VALIDATORS" });
                  }}
                >
                  Delegated
                  <Tooltip description="Showcase a list of all validators that you have ever delegated tokens with." />
                  <button
                    className={`d-flex rounded-4 bg-theme-white align-items-center transitionAll justify-content-${
                      delegated ? "end" : "start"
                    }`}
                    style={{ width: "40px", padding: "2px" }}
                  >
                    <div className="p-2 rounded-4 nav-bg"></div>
                  </button>
                </div>
                {/* <button className="d-flex align-items-center gap-2">
                  <HiArrowsUpDown />
                  Sort
                </button> */}
              </div>
              <div className="d-flex w-100 mt-3" style={{ overflowX: "auto" }}>
                <table className="table" style={{ width: "max-content" }}>
                  <thead>
                    <tr>
                      <th>
                        <input type="checkbox"></input>
                      </th>
                      <th
                        className="text-white"
                        scope="col"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Rank
                      </th>
                      <th
                        className="text-white"
                        scope="col"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Validator Name
                      </th>
                      <th
                        className="text-white"
                        scope="col"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Voting Power(in %)
                      </th>
                      <th
                        className="text-white"
                        scope="col"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Commission(%)
                      </th>
                      <th
                        className="text-white"
                        scope="col"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        Delegated Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {delegated ? (
                      <DelegatedValidators
                        searchValue={searchValue}
                        setShowClaimError={setShowClaimError}
                        stakeDispatch={stakeDispatch}
                        stakeState={stakeState}
                        activeValidators={activeValidators}
                        totalTokens={totalTokens}
                      />
                    ) : (
                      allValidators.length !== 1 &&
                      allValidators && (
                        <AllValidators
                          setShowClaimError={setShowClaimError}
                          searchValue={searchValue}
                          stakeDispatch={stakeDispatch}
                          stakeState={stakeState}
                          validatorsArray={validatorsArray}
                          activeValidators={activeValidators}
                          totalTokens={totalTokens}
                        />
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <StakedToken
          stakeState={stakeState}
          stakeDispatch={stakeDispatch}
          showClaimError={showClaimError}
          setShowClaimError={setShowClaimError}
          totalTokens={totalTokens}
          selectedValidators={stakeState?.selectedValidators}
        />
      </section>
      <div className="modal " tabIndex="-1" role="dialog" id="manifestModal">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title body2 text-primary d-flex align-items-center gap-2">
                <button
                  type="button"
                  className="btn-close primary"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  style={{ background: "none" }}
                >
                  <span className="text-primary">
                    <BsChevronLeft />
                  </span>
                </button>
                Transaction Manifest
              </h5>
              <button
                type="button"
                className="btn-close primary"
                data-bs-dismiss="modal"
                aria-label="Close"
                style={{ background: "none" }}
              >
                <span className="text-primary">
                  <MdOutlineClose />
                </span>
              </button>
            </div>
            <div className="modal-body p-4  d-flex flex-column">
              <p className="caption mb-2">Transaction Details:</p>
              <div className="nav-bg p-3 rounded-4 d-flex flex-column gap-1">
                <p className="caption mt-3">From:</p>
                <p className="caption2 text-gray">
                  mantle10x0k7tfhd4hm4hgasfuyg689khb34w4a6kbd6v2v
                </p>
                <p className="caption mt-3">To:</p>
                <p className="caption2 text-gray">
                  mantle10x0k7tfhd4hm4hgasfuyg689khb34w4a6kbd6v2v
                </p>
                <p className="caption mt-3">Amount:</p>
                <p className="caption2 text-gray">12345 $MNTL</p>
                <p className="caption mt-3">Transaction Type:</p>
                <p className="caption2 text-gray">Send</p>
                <p className="caption mt-3">Transaction Wallet Type:</p>
                <p className="caption2 text-gray">Keplr</p>
              </div>
              <div className="d-flex my-2">
                <p className="caption2">
                  <i className="bi bi-exclamation-circle text-primary"></i> Upon
                  confirmation, Keplr extension will open. Approve transaction
                  in Keplr.
                </p>
              </div>
              <h6 className="body2 my-3">Gas Fees:</h6>
              <div className="d-flex align-items-center justify-content-center my-2">
                {React.Children.toArray(
                  GasOptions.map((el) => (
                    <button
                      className={`bg-gray-800 p-2 py-3 d-flex flex-column gap-1 select-gas ${
                        SelectedGasFee === el.name ? "active" : ""
                      }`}
                      onClick={() => setSelectedGasFee(el.name)}
                    >
                      <p className="caption">{el.name}</p>
                      <p className="caption2">{el.usd} $</p>
                      <p className="caption2">{el.mntl} $MNTL</p>
                    </button>
                  ))
                )}
              </div>
              <div className="my-2 d-flex flex-column gap-1">
                <label htmlFor="KeystorePassword" className="text-gray">
                  KeyStore Password
                </label>
                <input
                  type="password"
                  name="KeystorePassword"
                  className="am-input border-color-white px-2 py-1 rounded-2 bg-transparent"
                  placeholder="Enter Password"
                  value={ManifestKeystorePassword}
                  onChange={(e) => setManifestKeystorePassword(e.target.value)}
                />
              </div>
              <div className="my-2 d-flex flex-column gap-1">
                <button
                  className="am-link caption d-flex align-items-center justify-content-start gap-1"
                  onClick={() => setManifestShowAdvanced(!ManifestShowAdvanced)}
                >
                  Advanced Details
                  <span
                    className="transitionAll"
                    style={{
                      transformOrigin: "center",
                      transform: ManifestShowAdvanced
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  >
                    <BsChevronDown />
                  </span>
                </button>
                {ManifestShowAdvanced && (
                  <div className="my-2 d-flex flex-column gap-1">
                    <label htmlFor="customGas" className="text-gray">
                      Gas
                    </label>
                    <input
                      type="number"
                      name="customGas"
                      className="am-input border-color-white px-2 py-1 rounded-2 bg-transparent"
                      placeholder="Enter Gas Amount"
                      value={ManifestCustomGas}
                      onChange={(e) => setManifestCustomGas(e.target.value)}
                    />
                  </div>
                )}
              </div>
              <div className="my-2 d-flex">
                <button
                  className="button-primary px-5 py-2 ms-auto"
                  onClick={handleManifestConfirm}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
