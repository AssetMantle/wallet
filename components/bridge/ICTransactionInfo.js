import React from "react";
import { Stack } from "react-bootstrap";

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
    <Stack
      as="section"
      gap={3}
      className="rounded-4 p-3 bg-secondary width-100"
    >
      <h4 className="h3 text-primary m-0">{title}</h4>
      <Stack gap={2} className="bg-black p-2 rounded-4 align-items-center">
        <Stack
          direction="horizontal"
          gap={2}
          className="align-items-center justify-content-between w-100"
        >
          <Stack direction="horizontal" gap={1} className="align-items-center">
            <div
              className="position-relative"
              style={{ width: "20px", aspectRatio: "1/1" }}
            >
              <img layout="fill" src={ChainImage(chainFrom)} alt={chainFrom} />
            </div>
            <p className="caption2 text-primary m-0">{chainFrom}</p>
          </Stack>
        </Stack>
        <div className="body2 mx-auto text-primary">
          <i className="bi bi-arrow-down" />
        </div>
        <Stack
          direction="horizontal"
          gap={2}
          className="align-items-center justify-content-between w-100"
        >
          <Stack direction="horizontal" gap={1} className="align-items-center">
            <div
              className="position-relative"
              style={{ width: "20px", aspectRatio: "1/1" }}
            >
              <img layout="fill" src={ChainImage(chainTo)} alt={chainTo} />
            </div>
            <p className="caption2 text-primary m-0">{chainTo}</p>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
