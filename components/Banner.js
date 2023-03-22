import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";

export default function Banner() {
  return (
    <Splide
      options={{
        type: "loop",
        rewind: true,
        width: "100%",
        gap: "32px",
        perPage: 1,
        pagination: false,
        autoplay: true,
        interval: 4000,
        speed: 2000,
        arrowPath:
          "M23 13L21.59 14.41L26.17 19H10V21H26.17L21.58 25.59L23 27L30 20L23 13Z",
      }}
      className="bg-yellow-100"
    >
      <SplideSlide>
        <div
          className="alert alert-warning alert-dismissible fade show m-0 rounded-0 py-1 text-center bg-yellow-100 border-0 text-dark d-flex px-2"
          role="alert"
        >
          <a
            className="text-dark-hover mx-auto"
            style={{ width: "80%" }}
            href="https://marketplace.assetmantle.one/"
            target="_blank"
            rel="noopener noreferrer"
          >
            🎉{"  "}Click here for limited early access to{" "}
            <strong>MantlePlace NFTs</strong>
            {"  "}🎉
          </a>
          {/* <button
    type="button"
    className="btn-close py-2"
    data-bs-dismiss="alert"
    aria-label="Close"
  ></button> */}
        </div>
      </SplideSlide>
      <SplideSlide>
        <div
          className="alert alert-warning alert-dismissible fade show m-0 rounded-0 py-1 text-center bg-yellow-100 border-0 text-dark d-flex px-2"
          role="alert"
        >
          <a
            className="text-dark-hover mx-auto"
            style={{ maxWidth: "80%" }}
            href="https://hackenproof.com/assetmantle/assetmantle"
            target="_blank"
            rel="noopener noreferrer"
          >
            🏆 Participate in the Bug Bounty Program <strong>here</strong> and
            win prizes! 🏆
          </a>
          {/* <button
        type="button"
        className="btn-close py-2"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button> */}
        </div>
      </SplideSlide>
      <SplideSlide>
        <div
          className="alert alert-warning alert-dismissible fade show m-0 rounded-0 py-1 text-center bg-yellow-100 border-0 text-dark d-flex px-2"
          role="alert"
        >
          <a
            className="text-dark-hover mx-auto"
            style={{ maxWidth: "80%" }}
            href="https://quickswap.exchange/#/farm/v2?tab=DualFarm"
            target="_blank"
            rel="noopener noreferrer"
          >
            💰 QuickSwap farming rewards are live now! Click Here! 💰
          </a>
          {/* <button
        type="button"
        className="btn-close py-2"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button> */}
        </div>
      </SplideSlide>
    </Splide>
  );
}
