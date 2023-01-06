import React from "react";
import Tooltip from "../components/Tooltip";

export default function Vesting() {
  return (
    <section className="rounded-5 p-4 bg-gray-800 width-100 d-flex flex-column gap-3">
      <h4 className="body1 text-primary">Vesting</h4>
      <div className="nav-bg p-3 rounded-4 d-flex flex-column gap-1">
        <p className="caption d-flex gap-2 align-items-center text-white-300">
          Vesting
          <Tooltip titlePrimary={true} description={""} />
        </p>
        <p className="caption">0.0000 $MNTL</p>
        <p className="small text-gray">$0.0000&nbsp;$USD</p>
      </div>
      {/* <div className="nav-bg p-3 rounded-4 d-flex flex-column gap-1">
        <p className="caption d-flex gap-2 align-items-center text-white-300">
          Transferable
          <Tooltip titlePrimary={true} description={""} />
        </p>
        <p className="caption">0.0000 $MNTL</p>
        <p className="small text-gray">$0.0000</p>
      </div> */}
      <div className="nav-bg p-3 rounded-4 d-flex flex-column gap-1">
        <p className="caption d-flex gap-2 align-items-center text-white-300">
          Delegatable
          <Tooltip titlePrimary={true} description={""} />
        </p>
        <p className="caption">0.0000 $MNTL</p>
        <p className="small text-gray">$0.0000&nbsp;$USD</p>
      </div>
    </section>
  );
}
