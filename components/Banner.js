import React from "react";
import Slider from "react-slick";

export default function Banner() {
  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "flex", right: "5px" }}
        onClick={onClick}
      >
        {/* <i className="bi bi-arrow-right text-black p-absolute top-0 bottom-0 start-0 end-0"></i> */}
      </div>
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "flex",
          zIndex: 100,
          left: "5px",
        }}
        onClick={onClick}
      >
        {/* <i className="bi bi-arrow-left text-black p-absolute top-0 bottom-0 start-0 end-0"></i> */}
      </div>
    );
  }
  const settings = {
    infinite: true,
    speed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 5000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };
  return (
    <Slider
      // options={{
      //   type: "loop",
      //   rewind: true,
      //   width: "100%",
      //   gap: "32px",
      //   perPage: 1,
      //   pagination: false,
      //   autoplay: true,
      //   interval: 4000,
      //   speed: 2000,
      //   arrowPath:
      //     "M23 13L21.59 14.41L26.17 19H10V21H26.17L21.58 25.59L23 27L30 20L23 13Z",
      // }}
      className="bg-yellow-100"
      {...settings}
    >
      <div>
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
      </div>
      <div>
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
      </div>
      <div>
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
      </div>
    </Slider>
  );
}
