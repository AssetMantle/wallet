import React from "react";
// import Tooltip from "../components/Tooltip";
import { OverlayTrigger, Stack, Tooltip } from "react-bootstrap";

export default function Vesting() {
  return (
    <Stack
      className="rounded-5 p-4 bg-am-gray-200 width-100"
      gap={3}
      as={section}
    >
      <h4 className="body1 text-primary m-0">Vesting</h4>
      <Stack className="bg-black p-3 rounded-4" gap={1}>
        <p className="caption d-flex gap-2 align-items-center text-white-50 m-0">
          Vesting
          <OverlayTrigger
            as="span"
            overlay={<Tooltip as id={"vesting"}></Tooltip>}
          >
            <i className="bi bi-info-circle text-primary"></i>
          </OverlayTrigger>
        </p>
        <p className="caption m-0">0.0000 $MNTL</p>
        <p className="small text-body m-0">$0.0000&nbsp;$USD</p>
      </Stack>
      {/* <div className="bg-black p-3 rounded-4 d-flex flex-column gap-1">
        <p className="caption d-flex gap-2 align-items-center text-white-300">
          Transferable
          <Tooltip titlePrimary={true} description={""} />
        </p>
        <p className="caption">0.0000 $MNTL</p>
        <p className="small text-body">$0.0000</p>
      </div> */}
      <Stack className="bg-black p-3 rounded-4" gap={1}>
        <p className="caption d-flex gap-2 align-items-center text-white-300">
          Delegatable
          <OverlayTrigger
            as="span"
            overlay={<Tooltip as id={"delegatable"}></Tooltip>}
          >
            <i className="bi bi-info-circle text-primary"></i>
          </OverlayTrigger>
        </p>
        <p className="caption m-0">0.0000 $MNTL</p>
        <p className="small text-body m-0">$0.0000&nbsp;$USD</p>
      </Stack>
    </Stack>
  );
}
