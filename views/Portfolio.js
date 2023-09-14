import React from "react";
import { Stack } from "react-bootstrap";

export default function Portfolio() {
  const dataSet = {
    vesting: "0000.23000",
    delegable: "0000.23000",
    usd: "0.83",
  };
  return (
    <Stack
      gap={3}
      as={"section"}
      className="rounded-5 p-4 bg-am-gray-200 width-100 flex-grow-0"
    >
      <h4 className="body1 text-primary">Portfolio</h4>
      <div className="bg-black p-3 rounded-4 gap-3">
        <Stack gap={2}>
          <Stack
            as={`p`}
            gap={2}
            direction="horizontal"
            className="caption align-items-center m-0"
          >
            Vesting <i className="bi bi-info-circle" />
          </Stack>
          <p className="caption m-0">{dataSet.vesting} $MNTL</p>
          <p className="caption m-0">
            {Number(dataSet.vesting) * Number(dataSet.usd)} USD
          </p>
        </Stack>
      </div>
      <div className="bg-black p-3 rounded-4 gap-3">
        <Stack gap={2}>
          <Stack
            as={`p`}
            gap={2}
            direction="horizontal"
            className="caption align-items-center m-0"
          >
            Delegatable <i className="bi bi-info-circle" />
          </Stack>
          <p className="caption m-0">{dataSet.delegable} $MNTL</p>
          <p className="caption m-0">
            {Number(dataSet.delegable) * Number(dataSet.usd)} USD
          </p>
        </Stack>
      </div>
    </Stack>
  );
}
