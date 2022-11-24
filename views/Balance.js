import React from "react";
import { BsInfoCircle } from "react-icons/bs";

export default function Balance() {
  const dataSet = {
    availableBalance: "1213",
    price: "0.312812",
    totalBalance: "0000.23000",
  };
  return (
    <section className="rounded-5 p-4 bg-gray-800 width-100 d-flex flex-column gap-3">
      <h4 className="body1 text-primary">Wallet balances</h4>
      <div className="nav-bg p-3 rounded-4 gap-3">
        <div className="d-flex flex-column gap-2">
          <p className="caption d-flex gap-2 align-items-center">
            Available{" "}
            <span>
              <BsInfoCircle />
            </span>
          </p>
          <p className="caption">
            {Number(dataSet.availableBalance).toFixed(4)} $MNTL
          </p>
          <p className="caption">
            {(Number(dataSet.availableBalance) * Number(dataSet.price)).toFixed(
              4
            )}{" "}
            USD
          </p>
        </div>
      </div>
      <div className="nav-bg p-3 rounded-4 gap-3">
        <div className="d-flex flex-column gap-2">
          <p className="caption d-flex gap-2 align-items-center">
            Current Price per $MNTL
          </p>
          <p className="caption">{Number(dataSet.price).toFixed(4)} USD</p>
        </div>
      </div>
      <div className="nav-bg p-3 rounded-4 gap-3">
        <div className="d-flex flex-column gap-2">
          <p className="caption d-flex gap-2 align-items-center">Total:</p>
          <p className="caption">
            {Number(dataSet.totalBalance).toFixed(4)} $MNTL
          </p>
          <p className="caption">
            {(Number(dataSet.totalBalance) * Number(dataSet.price)).toFixed(4)}{" "}
            USD
          </p>
        </div>
      </div>
    </section>
  );
}
