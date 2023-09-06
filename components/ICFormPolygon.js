import React, { useState } from "react";
import Image from "next/image";
import { useChain } from "@cosmos-kit/react";
import { defaultChainName } from "../config";
import { placeholderAddress } from "../data";

export default function ICFormPolygon() {
  const walletManager = useChain(defaultChainName);
  const { address } = walletManager;

  const [EthConnectionStat, setEthConnectionStat] = useState(false);

  const [MNTLAmountError, setMNTLAmountError] = useState(false);
  const [GravityAmountError, setGravityAmountError] = useState(false);
  const [EthAmountError, setEthAmountError] = useState(false);
  const [PolygonAmountError, setPolygonAmountError] = useState(false);

  const [MNtlAddress, setMNtlAddress] = useState(
    address ? address : placeholderAddress
  );
  const [GravityAddress, setGravityAddress] = useState(
    "equickbrownfoxjumpsoverthelazydogfIfthedogrth"
  );
  const [EthereumAddress, setEthereumAddress] = useState("0xxxxxxxxxxxxx");

  const [MNTLAmount, setMNTLAmount] = useState();
  const [GravityAmount, setGravityAmount] = useState();
  const [EthAmount, setEthAmount] = useState();
  const [PolygonAmount, setPolygonAmount] = useState();

  const [MNtlBalance, setMNtlBalance] = useState(20);
  const [GravityBalance, setGravityBalance] = useState(30);
  const [EthBalance, setEthBalance] = useState(40);
  const [PolygonBalance, setPolygonBalance] = useState(50);

  const handleMNTLAmountChange = (e) => {
    setMNTLAmount(e.target.value);
    e.target.value < 0.001 || e.target.value > MNtlBalance
      ? setMNTLAmountError("Insufficient Balance.")
      : setMNTLAmountError();
  };
  const handleGravityAmountChange = (e) => {
    setGravityAmount(e.target.value);
    e.target.value < 0.001 || e.target.value > GravityBalance
      ? setGravityAmountError("Insufficient Balance.")
      : setGravityAmountError();
  };
  const handleEthAmountChange = (e) => {
    setEthAmount(e.target.value);
    e.target.value < 0.001 || e.target.value > EthBalance
      ? setEthAmountError("Insufficient Balance.")
      : setEthAmountError();
  };
  const handlePolygonAmountChange = (e) => {
    setPolygonAmount(e.target.value);
    e.target.value < 0.001 || e.target.value > PolygonBalance
      ? setPolygonAmountError("Insufficient Balance.")
      : setPolygonAmountError();
  };

  const handleEthConnect = () => {
    setEthConnectionStat(true);
  };

  const handleCopy = (e) => {
    navigator.clipboard.writeText(e);
  };

  return (
    <section className="bg-black d-flex flex-column gap-3 rounded-4 p-3">
      <div className="bg-am-gray-200 p-3 rounded-4 d-flex flex-column gap-3">
        <div className="caption d-flex gap-2 align-items-center justify-content-between">
          <div className="d-flex gap-2 align-items-center position-relative">
            <div
              className="position-relative"
              style={{ width: "21px", aspectRatio: "1/1" }}
            >
              <img
                src="/chainLogos/mntl.webp"
                alt="AssetMantle"
                layout="fill"
              />
            </div>
            <h5 className="caption2 text-primary">MNTL</h5>
          </div>
          <button
            className="caption2 d-flex gap-1"
            onClick={() => handleCopy(MNtlAddress)}
            style={{ wordBreak: "break-all" }}
          >
            {MNtlAddress}{" "}
            <span className="text-primary">
              <i className="bi bi-files" />
            </span>
          </button>
        </div>
        <label
          htmlFor="mntlAmount"
          className="caption2 text-body d-flex align-items-center justify-content-between gap-2"
        >
          Amount{" "}
          <small className="small text-body">
            Transferable Balance : {MNtlBalance.toFixed(4)} $MNTL
          </small>
        </label>
        <div className="input-white d-flex py-2 px-3 rounded-2">
          <input
            type="number"
            placeholder="Enter Amount"
            name="mntlAmount"
            className="am-input-secondary caption2 flex-grow-1 bg-t"
            value={MNTLAmount}
            onChange={(e) => handleMNTLAmountChange(e)}
          />
          <button className="text-primary caption2">Max</button>
        </div>
        {MNTLAmountError && (
          <small className="small text-error">{MNTLAmountError}</small>
        )}
        <div className="d-flex align-items-center justify-content-end gap-2">
          <button className="button-primary py-2 px-4 d-flex gap-2 align-items-center caption2">
            Send to Gravity Bridge <i className="bi bi-arrow-down" />
          </button>
        </div>
      </div>
      <div className="bg-am-gray-200 p-3 rounded-4 d-flex flex-column gap-3">
        <div className="caption d-flex gap-2 align-items-center justify-content-between">
          <div className="d-flex gap-2 align-items-center position-relative">
            <div
              className="position-relative"
              style={{ width: "21px", aspectRatio: "1/1" }}
            >
              <Image
                src="/chainLogos/grav.svg"
                alt="Gravity Bridge"
                layout="fill"
              />
            </div>
            <h5 className="caption2 text-primary">Gravity Bridge</h5>
          </div>
          <button
            className="caption2 d-flex gap-1"
            onClick={() => handleCopy(GravityAddress)}
            style={{ wordBreak: "break-all" }}
          >
            {GravityAddress}{" "}
            <span className="text-primary">
              <i className="bi bi-files" />
            </span>
          </button>
        </div>
        <label
          htmlFor="GravityAmount"
          className="caption2 text-body d-flex align-items-center justify-content-between gap-2"
        >
          Amount{" "}
          <small className="small text-body">
            Transferable Balance : {GravityBalance.toFixed(4)} $MNTL
          </small>
        </label>
        <div className="input-white d-flex py-2 px-3 rounded-2">
          <input
            type="number"
            placeholder="Enter Amount"
            name="GravityAmount"
            className="am-input-secondary caption2 flex-grow-1 bg-t"
            value={GravityAmount}
            onChange={(e) => handleGravityAmountChange(e)}
          />
          <button className="text-primary caption2">Max</button>
        </div>
        {GravityAmountError && (
          <small className="small text-error">{GravityAmountError}</small>
        )}
        <div className="d-flex align-items-center justify-content-end gap-3">
          <button className="button-secondary py-2 px-4 d-flex gap-2 align-items-center caption2">
            Send to Mantle Chain <i className="bi bi-arrow-up" />
          </button>
          <button className="button-primary py-2 px-4 d-flex gap-2 align-items-center caption2">
            Send to Ethereum Chain <i className="bi bi-arrow-down" />
          </button>
        </div>
      </div>
      <div className="bg-am-gray-200 p-3 rounded-4 d-flex flex-column gap-3">
        <div className="caption d-flex gap-2 align-items-center justify-content-between">
          <div className="d-flex gap-2 align-items-center position-relative">
            <div
              className="position-relative"
              style={{ width: "21px", aspectRatio: "1/1" }}
            >
              <Image
                src="/chainLogos/eth.svg"
                alt="Ethereum Chain"
                layout="fill"
              />
            </div>
            <h5 className="caption2 text-primary">Ethereum Chain</h5>
          </div>
          {EthConnectionStat ? (
            <button
              className="caption2 d-flex gap-1"
              onClick={() => handleCopy(EthereumAddress)}
              style={{ wordBreak: "break-all" }}
            >
              {EthereumAddress}{" "}
              <span className="text-primary">
                <i className="bi bi-files" />
              </span>
            </button>
          ) : (
            <button
              className="caption2 d-flex gap-1 text-primary"
              onClick={handleEthConnect}
            >
              <i className="bi bi-link-45deg" /> Connect Wallet
            </button>
          )}
        </div>
        <label
          htmlFor="ethAmount"
          className="caption2 text-body d-flex align-items-center justify-content-between gap-2"
        >
          Amount{" "}
          <small className="small text-body">
            Transferable Balance : {EthBalance.toFixed(4)} $MNTL
          </small>
        </label>
        <div className="input-white d-flex py-2 px-3 rounded-2">
          <input
            type="number"
            placeholder="Enter Amount"
            name="ethAmount"
            className="am-input-secondary caption2 flex-grow-1 bg-t"
            value={EthAmount}
            onChange={(e) => handleEthAmountChange(e)}
          />
          <button className="text-primary caption2">Max</button>
        </div>
        {EthAmountError && (
          <small className="small text-error">{EthAmountError}</small>
        )}
        <div className="d-flex align-items-center justify-content-end gap-3">
          <button className="button-secondary py-2 px-4 d-flex gap-2 align-items-center caption2">
            Send to Gravity bridge <i className="bi bi-arrow-up" />
          </button>
          <button className="button-primary py-2 px-4 d-flex gap-2 align-items-center caption2">
            Send to Polygon Chain <i className="bi bi-arrow-down" />
          </button>
        </div>
      </div>
      <div className="bg-am-gray-200 p-3 rounded-4 d-flex flex-column gap-3">
        <div className="caption d-flex gap-2 align-items-center justify-content-between">
          <div className="d-flex gap-2 align-items-center position-relative">
            <div
              className="position-relative"
              style={{ width: "21px", aspectRatio: "1/1" }}
            >
              <Image
                src="/chainLogos/polygon.svg"
                alt="Polygon Chain"
                layout="fill"
              />
            </div>
            <h5 className="caption2 text-primary">Polygon Chain</h5>
          </div>
          {EthConnectionStat ? (
            <button
              className="caption2 d-flex gap-1"
              onClick={() => handleCopy(EthereumAddress)}
              style={{ wordBreak: "break-all" }}
            >
              {EthereumAddress}{" "}
              <span className="text-primary">
                <i className="bi bi-files" />
              </span>
            </button>
          ) : (
            <span className="text-body caption2">Connect metamask</span>
          )}
        </div>
        <label
          htmlFor="mntlAmount"
          className="caption2 text-body d-flex align-items-center justify-content-between gap-2"
        >
          Amount{" "}
          <small className="small text-body">
            Transferable Balance : {PolygonBalance.toFixed(4)} $MNTL
          </small>
        </label>
        <div className="input-white d-flex py-2 px-3 rounded-2">
          <input
            type="number"
            placeholder="Enter Amount"
            name="mntlAmount"
            className="am-input-secondary caption2 flex-grow-1 bg-t"
            value={PolygonAmount}
            onChange={(e) => handlePolygonAmountChange(e)}
          />
          <button className="text-primary caption2">Max</button>
        </div>
        {PolygonAmountError && (
          <small className="small text-error">{PolygonAmountError}</small>
        )}
        <div className="d-flex align-items-center justify-content-end gap-3">
          <button className="button-secondary py-2 px-4 d-flex gap-2 align-items-center caption2">
            Send to ethereum Chain <i className="bi bi-arrow-up" />
          </button>
        </div>
      </div>
    </section>
  );
}

// <HiOutlineArrowNarrowUp/>
