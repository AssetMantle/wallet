import React, { useState } from "react";
import Image from "next/image";
import Tooltip from "./Tooltip";
import { AiOutlineInfoCircle } from "react-icons/ai";

export default function ICFormPolygon() {
  const [SwapChains, setSwapChains] = useState(false);

  const [EthConnectionStat, setEthConnectionStat] = useState(false);

  const [GravityAmountError, setGravityAmountError] = useState(false);
  const [EthAmountError, setEthAmountError] = useState(false);
  const [PolygonAmountError, setPolygonAmountError] = useState(false);

  const [MNtlAddress, setMNtlAddress] = useState(
    "ThequickbrownfoxjumpsoverthelazydogfIfthedogr"
  );
  const [GravityAddress, setGravityAddress] = useState(
    "equickbrownfoxjumpsoverthelazydogfIfthedogrth"
  );
  const [EthereumAddress, setEthereumAddress] = useState("0xxxxxxxxxxxxx");

  const [GravityAmount, setGravityAmount] = useState();
  const [EthAmount, setEthAmount] = useState();
  const [PolygonAmount, setPolygonAmount] = useState();

  const [MNtlBalance, setMNtlBalance] = useState(20);
  const [GravityBalance, setGravityBalance] = useState(30);
  const [EthBalance, setEthBalance] = useState(40);

  const handleGravityAmountChange = (e) => {
    setGravityAmount(e.target.value);
    e.target.value < 0.001 || e.target.value > MNtlBalance
      ? setGravityAmountError("Insufficient Balance.")
      : setGravityAmountError();
  };
  const handleEthAmountChange = (e) => {
    setEthAmount(e.target.value);
    e.target.value < 0.001 || e.target.value > GravityBalance
      ? setEthAmountError("Insufficient Balance.")
      : setEthAmountError();
  };
  const handlePolygonAmountChange = (e) => {
    setPolygonAmount(e.target.value);
    e.target.value < 0.001 || e.target.value > EthBalance
      ? setPolygonAmountError("Insufficient Balance.")
      : setPolygonAmountError();
  };

  const handleEthConnect = () => {
    setEthConnectionStat(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="d-flex flex-column gap-3">
      <div className="nav-bg px-3 py-4 rounded-4 d-flex flex-column gap-3">
        {/* <div
          className="position-absolute top-0 body2"
          style={{ transform: "translateY(-50%)" }}
        >
          From
        </div> */}
        <div className="caption d-flex gap-2 align-items-center justify-content-between">
          <button className="d-flex gap-2 align-items-center position-relative">
            <div
              className="position-relative"
              style={{ width: "40px", aspectRatio: "1/1" }}
            >
              <Image
                src="/chainLogos/mntl.webp"
                alt="AssetMantle"
                layout="fill"
              />
            </div>
            <div className="d-flex flex-column text-start">
              <h5 className="caption">MNTL</h5>
              <p className="caption2">
                <Tooltip
                  title={`${MNtlAddress.substring(
                    0,
                    10
                  )}...${MNtlAddress.substring(
                    MNtlAddress.length - 7,
                    MNtlAddress.length
                  )}`}
                  description={MNtlAddress}
                  style={{ wordBreak: "break-word" }}
                />
              </p>
              <p className="caption2">Balance: {MNtlBalance}</p>
            </div>
          </button>
          <button className="d-flex gap-2 align-items-center position-relative">
            <div
              className="position-relative"
              style={{ width: "40px", aspectRatio: "1/1" }}
            >
              <Image
                src="/chainLogos/grav.svg"
                alt="Gravity Bridge"
                layout="fill"
              />
            </div>
            <div className="d-flex flex-column text-start">
              <h5 className="caption">Grav</h5>
              <p className="caption2">
                <Tooltip
                  title={`${GravityAddress.substring(
                    0,
                    10
                  )}...${GravityAddress.substring(
                    GravityAddress.length - 7,
                    GravityAddress.length
                  )}`}
                  description={GravityAddress}
                  style={{ wordBreak: "break-word" }}
                />
              </p>
              <div className="d-flex">
                <input
                  type="number"
                  placeholder="Enter Amount"
                  className="am-input-secondary caption2 flex-grow-1"
                  value={GravityAmount}
                  onChange={(e) => handleGravityAmountChange(e)}
                />
                {GravityAmountError && (
                  <span className="text-error">
                    <Tooltip
                      title={<AiOutlineInfoCircle />}
                      description={GravityAmountError}
                    />
                  </span>
                )}
              </div>
            </div>
          </button>
        </div>
      </div>
      <div className="nav-bg px-3 py-4 rounded-4 d-flex flex-column gap-3">
        <div className="caption d-flex gap-2 align-items-center justify-content-between">
          <button className="d-flex gap-2 align-items-center position-relative">
            <div
              className="position-relative"
              style={{ width: "40px", aspectRatio: "1/1" }}
            >
              <Image
                src="/chainLogos/grav.svg"
                alt="Gravity Bridge"
                layout="fill"
              />
            </div>
            <div className="d-flex flex-column text-start">
              <h5 className="caption">Grav</h5>
              <p className="caption2">
                <Tooltip
                  title={`${GravityAddress.substring(
                    0,
                    10
                  )}...${GravityAddress.substring(
                    GravityAddress.length - 7,
                    GravityAddress.length
                  )}`}
                  description={GravityAddress}
                  style={{ wordBreak: "break-word" }}
                />
              </p>
              <p className="caption2">Balance: {GravityBalance}</p>
            </div>
          </button>
          <button className="d-flex gap-2 align-items-center position-relative">
            <div
              className="position-relative"
              style={{ width: "40px", aspectRatio: "1/1" }}
            >
              <Image src="/chainLogos/eth.svg" alt="Ethereum" layout="fill" />
            </div>
            <div className="d-flex flex-column text-start">
              <h5 className="caption">ETH</h5>
              <div className="d-flex">
                {EthConnectionStat ? (
                  <p className="caption2">
                    <Tooltip
                      title={`${EthereumAddress.substring(
                        0,
                        10
                      )}...${EthereumAddress.substring(
                        EthereumAddress.length - 7,
                        EthereumAddress.length
                      )}`}
                      description={EthereumAddress}
                      style={{ wordBreak: "break-word" }}
                    />
                  </p>
                ) : (
                  <button
                    className="caption2 p-1 bg-gray-800 text-primary d-inline"
                    onClick={() => handleEthConnect()}
                  >
                    Connect
                  </button>
                )}
              </div>
              <div className="d-flex">
                <input
                  type="number"
                  placeholder="Enter Amount"
                  className="am-input-secondary caption2 flex-grow-1"
                  value={EthAmount}
                  onChange={(e) => handleEthAmountChange(e)}
                />
                {EthAmountError && (
                  <span className="text-error">
                    <Tooltip
                      title={<AiOutlineInfoCircle />}
                      description={EthAmountError}
                    />
                  </span>
                )}
              </div>
            </div>
          </button>
        </div>
      </div>
      <div className="nav-bg px-3 py-4 rounded-4 d-flex flex-column gap-3">
        <div className="caption d-flex gap-2 align-items-center justify-content-between">
          <button className="d-flex gap-2 align-items-center position-relative">
            <div
              className="position-relative"
              style={{ width: "40px", aspectRatio: "1/1" }}
            >
              <Image src="/chainLogos/eth.svg" alt="Ethereum" layout="fill" />
            </div>
            <div className="d-flex flex-column text-start">
              <h5 className="caption">ETH</h5>
              <p className="caption2">
                <Tooltip
                  title={`${EthereumAddress.substring(
                    0,
                    10
                  )}...${EthereumAddress.substring(
                    EthereumAddress.length - 7,
                    EthereumAddress.length
                  )}`}
                  description={EthereumAddress}
                  style={{ wordBreak: "break-word" }}
                />
              </p>
              <p className="caption2">Balance: {EthBalance}</p>
            </div>
          </button>
          <button className="d-flex gap-2 align-items-center position-relative">
            <div
              className="position-relative"
              style={{ width: "40px", aspectRatio: "1/1" }}
            >
              <Image
                src="/chainLogos/polygon.svg"
                alt="Polygon"
                layout="fill"
              />
            </div>
            <div className="d-flex flex-column text-start">
              <h5 className="caption">MATIC</h5>
              <p className="caption2">
                <Tooltip
                  title={`${EthereumAddress.substring(
                    0,
                    10
                  )}...${EthereumAddress.substring(
                    EthereumAddress.length - 7,
                    EthereumAddress.length
                  )}`}
                  description={EthereumAddress}
                  style={{ wordBreak: "break-word" }}
                />
              </p>
              <div className="d-flex">
                <input
                  type="number"
                  placeholder="Enter Amount"
                  className="am-input-secondary caption2 flex-grow-1"
                  value={PolygonAmount}
                  onChange={(e) => handlePolygonAmountChange(e)}
                />
                {PolygonAmountError && (
                  <span className="text-error">
                    <Tooltip
                      title={<AiOutlineInfoCircle />}
                      description={PolygonAmountError}
                    />
                  </span>
                )}
              </div>
            </div>
          </button>
        </div>
      </div>
      <div className="nav-bg p-3 rounded-4 position-relative caption d-flex flex-column gap-2">
        <div className="d-flex">
          <p className="col-6">Relayer Gas Fees:</p>
          <p className="col-6 text-end">1.5 axlUSDC</p>
        </div>
        <div className="d-flex">
          <p className="col-6">Estimated wait time:</p>
          <p className="col-6 text-end">~2 minutes</p>
        </div>
      </div>
      <button
        className="btn button-primary px-5 ms-auto"
        onClick={(e) => handleSubmit(e)}
        disabled={
          !(
            MNtlAddress &&
            EthereumAddress &&
            GravityAmount &&
            !GravityAmountError
          )
        }
      >
        Send
      </button>
    </div>
  );
}
