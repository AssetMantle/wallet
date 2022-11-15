import React from "react";
import { BsInfoCircle } from "react-icons/bs";

export default function Portfolio() {
  const dataSet = {
    vesting: "0000.23000",
    transferable: "0000.23000",
    delegable: "0000.23000",
  };
  return (
    <section className="rounded-5 p-4 bg-gray-800 width-100 d-flex flex-column gap-3">
      <h4 className="body1 text-primary">Portfolio</h4>
      <div className="nav-bg p-3 rounded-4 gap-3">
        <div className="d-flex flex-column gap-2">
          <p className="caption d-flex gap-2 align-items-center">
            Vesting{" "}
            <span>
              <BsInfoCircle />
            </span>
          </p>
          <p className="caption">{dataSet.vesting} $MNTL</p>
        </div>
      </div>
      <div className="nav-bg p-3 rounded-4 gap-3">
        <div className="d-flex flex-column gap-2">
          <p className="caption d-flex gap-2 align-items-center">
            Transferable{" "}
            <span>
              <BsInfoCircle />
            </span>
          </p>
          <p className="caption">{dataSet.transferable} $MNTL</p>
        </div>
      </div>
      <div className="nav-bg p-3 rounded-4 gap-3">
        <div className="d-flex flex-column gap-2">
          <p className="caption d-flex gap-2 align-items-center">
            Delegatable{" "}
            <span>
              <BsInfoCircle />
            </span>
          </p>
          <p className="caption">{dataSet.delegable} $MNTL</p>
        </div>
      </div>
    </section>
  );
}
