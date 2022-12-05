import React, { useState } from "react";
import { BsArrowUpRight } from "react-icons/bs";

export default function Vote() {
  const [ActiveNav, setActiveNav] = useState(0);

  const votingPower = 1 === 1 ? "0.4%" : "--%";
  const currentVotingPower =
    1 === 2 ? { display: "6/10", value: 60 } : { display: "X/X", value: "" };
  const pastVotingPower =
    1 === 2 ? { display: "4/10", value: 40 } : { display: "X/X", value: "" };

  return (
    <section className="row">
      <div className="col-12 col-lg-8">
        <div className="rounded-4 p-3 bg-gray-800 width-100 d-flex flex-column gap-2 transitionAll">
          <nav className="d-flex align-items-center justify-content-between gap-3">
            <h1 className="body2 text-primary">Proposals</h1>
            <div className="d-flex align-items-center box-nav">
              <button
                className={`am-link body2 box-nav-item px-4 py-1 ${
                  ActiveNav === 0 ? "active" : ""
                }`}
                onClick={() => setActiveNav(0)}
              >
                Active
              </button>
              <button
                className={`am-link body2 d-flex gap-1 box-nav-item px-4 py-1 ${
                  ActiveNav === 1 ? "active" : ""
                }`}
                onClick={() => setActiveNav(1)}
              >
                Concluded
                <span className="text-primary">
                  <BsArrowUpRight />
                </span>
              </button>
            </div>
          </nav>
          <div className="nav-bg rounded-4 d-flex flex-column p-3 gap-3"></div>
        </div>
      </div>
      <div className="col-12 pt-3 pt-lg-0 col-lg-4">
        <div className="rounded-4 p-3 bg-gray-800 width-100 d-flex flex-column gap-2 transitionAll">
          <nav className="d-flex align-items-center justify-content-between gap-3">
            <div className="d-flex gap-3 align-items-center">
              <button className={`body2 text-primary`}>Your Statistics</button>
            </div>
          </nav>
          <div className="nav-bg rounded-4 d-flex flex-column p-3 gap-2 align-items-start">
            <p className="caption">
              Your Voting Power is{" "}
              <span className="text-primary">{votingPower}</span>
            </p>
            <br />
            <p className="caption">Votes made for categories:</p>
            <p className="caption">
              Current Voting : {currentVotingPower.display}
            </p>
            {currentVotingPower.value && (
              <div className="am-progress bg-gray-800 rounded-2">
                <div
                  className="am-progress-bar bg-yellow-100 rounded-2"
                  style={{ width: `${currentVotingPower.value}%` }}
                ></div>
              </div>
            )}
            <p className="caption">Past Voting : {pastVotingPower.display}</p>
            {pastVotingPower.value && (
              <div className="am-progress bg-gray-800 rounded-2">
                <div
                  className="am-progress-bar bg-yellow-100 rounded-2"
                  style={{ width: `${pastVotingPower.value}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
