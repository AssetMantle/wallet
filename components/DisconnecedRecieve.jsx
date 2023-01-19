import Image from "next/image";
import React from "react";
import { placeholderAddress } from "../data";

const DisconnecedRecieve = () => {
  return (
    <div className="rounded-4 p-3 bg-gray-800 width-100 d-flex flex-column gap-2 transitionAll">
      <nav className="d-flex align-items-center justify-content-between gap-3">
        <div className="d-flex gap-3 align-items-center">
          <button className={`body1 text-primary`}>Receive</button>
        </div>
      </nav>
      <div className="nav-bg rounded-4 d-flex flex-column p-3 gap-2 align-items-center justify-content-center">
        <div
          className="text-gray position-relative d-flex justify-content-center"
          style={{
            width: "min(140px, 100%)",
            aspectRatio: "1/1",
          }}
        >
          <Image src="/qr-code.svg" layout="fill" alt="qr code place holder" />
        </div>
        <h4 className="body2 text-primary">Wallet Address</h4>
        <div className="d-flex align-items-center justify-content-center gap-2 text-gray text-center caption2 pt-1">
          {placeholderAddress}
          <span className="text-gray">
            <i className="bi bi-clipboard" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default DisconnecedRecieve;
