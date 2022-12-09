import React, { useState } from "react";
import { SlReload } from "react-icons/sl";
import ICFormETH from "../components/ICFormETH";
import ICForm from "../components/ICFormETH";
import ICFormPolygon from "../components/ICFormPolygon";

export default function Interchain() {
  const tabs = [
    { name: "Eth", href: "#eth" },
    { name: "Polygon", href: "#polygon" },
  ];

  const [Tab, setTab] = useState(0);

  const handleReload = () => {};

  return (
    <section className="row">
      <div className="col-12 col-lg-8">
        <div className="rounded-5 p-4 bg-gray-800 width-100 d-flex flex-column gap-3 transitionAll">
          {/* <nav className="d-flex align-items-center justify-content-between gap-3">
        <div className="d-flex gap-3 align-items-center">
          {React.Children.toArray(
            tabs.map((tab, index) => (
              <button
                className={`am-link ${Tab === index ? "" : "text-white"} body2`}
                onClick={() => setTab(index)}
              >
                {tab.name}
              </button>
            ))
          )}
        </div>
        <button className="body2 text-primary" onClick={() => handleReload()}>
          <SlReload />
        </button>
      </nav> */}
          {/* {
        {
          0: <ICFormETH />,
          1: <ICFormPolygon />,
        }[Tab]
      } */}
          <ICFormPolygon />
        </div>
      </div>
      <div className="col-12 pt-3 pt-lg-0 col-lg-4"></div>
    </section>
  );
}
