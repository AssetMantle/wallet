import React from "react";

export default function ICTransactionInfo({ title, chainFrom, chainTo }) {
  const ChainImage = (name) => {
    let res = "";
    switch (name) {
      case "polygon":
        res = "/chainLogos/polygon.svg";
        break;
      case "ethereum":
        res = "/chainLogos/eth.svg";
        break;
      case "gravitybridge":
        res = "/chainLogos/grav.svg";
        break;
      case "assetmantle":
        res = "/chainLogos/mntl.webp";
        break;
      default:
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
              <img layout="fill" src={ChainImage(chainFrom)} alt={chainFrom} />
            </div>
            <p className="caption2 text-primary">{chainFrom}</p>
          </div>
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
              <img layout="fill" src={ChainImage(chainTo)} alt={chainTo} />
            </div>
            <p className="caption2 text-primary">{chainTo}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
