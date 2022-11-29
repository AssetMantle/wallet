import React, { useState } from "react";
import InputEdit from "./InputEdit";
import { IoMdSwap } from "react-icons/io";
import Image from "next/image";

export default function ICFormPolygon() {
  const [SwapChains, setSwapChains] = useState(false);
  const [AmountError, setAmountError] = useState(false);
  const [ConnectionStat, setConnectionStat] = useState(false);
  const [Chain1, setChain1] = useState({
    name: "Mntl",
    value: "mntl",
    icon: "/chainLogos/mntl.webp",
    chain: "AssetMantle",
  });
  const [Chain1Amount, setChain1Amount] = useState(65);
  const [Chain2, setChain2] = useState({
    name: "Polygon",
    value: "polygon",
    icon: "/chainLogos/polygon.svg",
    chain: "Ethereum",
  });
  const [Chain2Amount, setChain2Amount] = useState(434);
  const [Address1, setAddress1] = useState(
    "ThequickbrownfoxjumpsoverthelazydogfIfthedogr"
  );
  const [Address2, setAddress2] = useState(
    "equickbrownfoxjumpsoverthelazydogfIfthedogrth"
  );
  const [Amount, setAmount] = useState("");

  const chains1 = [
    {
      name: "Mntl",
      value: "mntl",
      icon: "/chainLogos/mntl.webp",
      chain: "AssetMantle",
    },
    {
      name: "Chain 2 Polygon",
      value: "chain-2",
      icon: "/chainLogos",
      chain: "",
    },
  ];
  const chains2 = [
    {
      name: "Polygon",
      value: "polygon",
      icon: "/chainLogos/polygon.svg",
      chain: "Ethereum",
    },
    { name: "Chain 2 hd", value: "chain-2", icon: "/chainLogos", chain: "" },
  ];

  const balance = !SwapChains ? Chain1Amount : Chain2Amount;

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
    e.target.value < 0.001 || e.target.value > balance
      ? setAmountError("Insufficient Balance.")
      : setAmountError();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form
      className="d-flex flex-column gap-3"
      onSubmit={(e) => handleSubmit(e)}
    >
      <div className="nav-bg px-3 py-4 rounded-4 d-flex flex-column gap-3 position-relative">
        <div
          className="position-absolute top-0 body2"
          style={{ transform: "translateY(-50%)" }}
        >
          From
        </div>
        <div className="caption d-flex gap-2 align-items-center justify-content-between">
          <button className="d-flex gap-2 align-items-center">
            <div
              className="position-relative"
              style={{ width: "40px", aspectRatio: "1/1" }}
            >
              <Image
                src={!SwapChains ? Chain1.icon : Chain2.icon}
                alt={!SwapChains ? Chain1.name : Chain2.name}
                layout="fill"
              />
            </div>
            <div className="d-flex flex-column text-start">
              <h5 className="body2">
                {!SwapChains ? Chain1.name : Chain2.name}
              </h5>
              <p className="caption2">
                {!SwapChains ? Chain1.chain : Chain2.chain}
              </p>
            </div>
          </button>
          <div className="d-flex flex-column gap-1 text-end text-end">
            <p className="caption">
              Available: {!SwapChains ? Chain1Amount : Chain2Amount} $MNTL
            </p>
            <p className="caption2 position-relative hoverShowChild">
              {(SwapChains ? Address1 : Address2)
                ? `${(!SwapChains ? Address1 : Address2).substring(
                    0,
                    10
                  )}...${(!SwapChains ? Address1 : Address2).substring(
                    (!SwapChains ? Address1 : Address2).length - 7,
                    (!SwapChains ? Address1 : Address2).length
                  )}`
                : "wallet is not connected"}
              <span
                className=" d-none nav-bg text-primary position-absolute bottom-0 start-0 p-1 rounded-2"
                style={{ transform: "translate(-50%,100%)" }}
              >
                {!SwapChains ? Address1 : Address2}
              </span>
            </p>
            {SwapChains && (
              <button className="caption2 p-1 bg-gray-800 text-primary d-inline ms-auto">
                {ConnectionStat ? "Disconnect" : "Connect"}
              </button>
            )}
          </div>
        </div>
      </div>
      <div
        className="d-flex position-relative"
        style={{ margin: "-30px 0", zIndex: "1" }}
      >
        <button
          className="h3 text-dark p-2 m-auto transitionAll rounded-circle bg-yellow-100"
          style={{
            transform: `rotate(${SwapChains ? "90deg" : "270deg"})`,
            aspectRatio: "1/1",
            width: "45px",
          }}
          onClick={() => setSwapChains(!SwapChains)}
        >
          <IoMdSwap />
        </button>
      </div>
      <div className="nav-bg px-3 py-4 rounded-4 d-flex flex-column gap-3 position-relative">
        <div
          className="position-absolute top-0 body2"
          style={{ transform: "translateY(-50%)" }}
        >
          To
        </div>
        <div className="caption d-flex gap-2 align-items-center justify-content-between">
          <button className="d-flex gap-2 align-items-center">
            <div
              className="position-relative"
              style={{ width: "40px", aspectRatio: "1/1" }}
            >
              <Image
                src={SwapChains ? Chain1.icon : Chain2.icon}
                alt={SwapChains ? Chain1.name : Chain2.name}
                layout="fill"
              />
            </div>
            <div className="d-flex flex-column text-start">
              <h5 className="body2">
                {SwapChains ? Chain1.name : Chain2.name}
              </h5>
              <p className="caption2">
                {SwapChains ? Chain1.chain : Chain2.chain}
              </p>
            </div>
          </button>
          <div className="d-flex flex-column gap-1 text-end text-end">
            <p className="caption">
              Available: {SwapChains ? Chain1Amount : Chain2Amount} $MNTL
            </p>
            <p className="caption2 position-relative hoverShowChild">
              {(SwapChains ? Address1 : Address2)
                ? `${(SwapChains ? Address1 : Address2).substring(
                    0,
                    10
                  )}...${(SwapChains ? Address1 : Address2).substring(
                    (SwapChains ? Address1 : Address2).length - 7,
                    (SwapChains ? Address1 : Address2).length
                  )}`
                : "wallet is not connected"}
              <span
                className=" d-none nav-bg text-primary position-absolute bottom-0 start-0 p-1 rounded-2"
                style={{ transform: "translate(-50%,100%)" }}
              >
                {SwapChains ? Address1 : Address2}
              </span>
            </p>
            {!SwapChains && (
              <button className="caption2 p-1 bg-gray-800 text-primary d-inline ms-auto">
                {ConnectionStat ? "Disconnect" : "Connect"}
              </button>
            )}
          </div>
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
      <div className="rounded-4 position-relative caption d-flex flex-column gap-2">
        <label
          className="caption d-flex gap-2 align-items-center justify-content-between"
          htmlFor="amount"
        >
          Amount
        </label>
        <div className="p-3 py-1 d-flex rounded-2 gap-2 am-input">
          <input
            className="bg-t"
            type="number"
            name="amount"
            id="amount"
            value={Amount}
            placeholder="Enter Amount"
            style={{ flex: "1", border: "none", outline: "none" }}
            onChange={(e) => handleAmountChange(e)}
          />
          <button
            className="bg-gray-800 p-1 px-2 text-primary"
            onClick={() => setAmount(balance / 2)}
          >
            half
          </button>
          <button
            className="bg-gray-800 p-1 px-2 text-primary"
            onClick={() => setAmount(balance)}
          >
            max
          </button>
        </div>
        {Amount && AmountError && (
          <div className="text-error caption2">{AmountError}</div>
        )}
        {Amount && !AmountError && (
          <div className="ms-auto caption2">Value: {Amount} USD</div>
        )}
      </div>
      <button
        className="btn button-primary px-5"
        type="submit"
        disabled={!(Address1 && Address2 && Amount && !AmountError)}
      >
        Send
      </button>
    </form>
  );
}
