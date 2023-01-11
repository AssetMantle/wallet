import Image from "next/image";
import React from "react";

export default function ICTransactionInfo({
  title,
  chainForm,
  chainTo,
  addressForm,
  addressTo,
  amount,
  gas,
  time,
}) {
  const ChainImage = (name) => {
    let res = "";
    switch (name) {
      case "Polygon Chain":
        res = "/chainLogos/polygon.svg";
        break;
      case "Ethereum Chain":
        res = "/chainLogos/eth.svg";
        break;
      case "Gravity Bridge":
        res = "/chainLogos/grav.svg";
        break;
      case "Mantle Chain":
        res = "/chainLogos/mntl.webp";
        break;
      case "$MNTL Chain":
        res = "/chainLogos/mntl.webp";
        break;
    }
    return res;
  };
  return (
    <section className="rounded-4 p-3 bg-gray-800 width-100 d-flex flex-column gap-3">
      <h4 className="h3 text-primary">{title}</h4>
      <div className="nav-bg p-2 rounded-4 d-flex flex-column align-items-center gap-2">
        <div className="d-flex align-items-center justify-content-between gap-2 w-100">
          <div className="d-flex gap-1 align-items-center">
            <div
              className="position-relative"
              style={{ width: "20px", aspectRatio: "1/1" }}
            >
              <Image
                layout="fill"
                src={ChainImage(chainForm)}
                alt={chainForm}
              />
            </div>
            <p className="caption2 text-primary">{chainForm}</p>
          </div>
          <span className="caption2">{`${addressForm.substring(
            0,
            5
          )}...${addressForm.substring(
            addressForm.length - 5,
            addressForm.length
          )}`}</span>
        </div>
        <div className="body2 mx-auto text-primary">
          <i className="bi bi-arrow-down" />
        </div>
        <div className="d-flex align-items-center justify-content-between gap-2 w-100">
          <div className="d-flex gap-1 align-items-center">
            <div
              className="position-relative"
              style={{ width: "20px", aspectRatio: "1/1" }}
            >
              <Image layout="fill" src={ChainImage(chainTo)} alt={chainTo} />
            </div>
            <p className="caption2 text-primary">{chainTo}</p>
          </div>
          <span className="caption2">{`${addressTo.substring(
            0,
            5
          )}...${addressTo.substring(
            addressTo.length - 5,
            addressTo.length
          )}`}</span>
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-between gap-2 w-100">
        <span className="caption2 text-white">Amount</span>
        <span className="caption2 text-primary">{amount} $MNTL</span>
      </div>
      <div className="d-flex align-items-center justify-content-between gap-2 w-100">
        <span className="caption2 text-white">Gas</span>
        <span className="caption2 text-white-300">{gas}</span>
      </div>
      <div className="d-flex align-items-center justify-content-between gap-2 w-100">
        <span className="caption2 text-white">Average time</span>
        <span className="caption2 text-white-300">
          {Math.floor(Number(time) / 60)}Hour
          {Math.floor(Number(time) / 60) > 1 && "s"},{Number(time) % 60}Minute
          {Number(time) % 60 > 1 && "s"}
        </span>
      </div>
    </section>
  );
}
