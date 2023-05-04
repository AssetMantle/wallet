import React from "react";
import { Alert } from "react-bootstrap";
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
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    autoplay: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const ALERTs = [
    {
      href: "https://marketplace.assetmantle.one/",
      text: (
        <>
          🎉{"  "}Click here for limited early access to{" "}
          <strong>MantlePlace NFTs</strong>
          {"  "}🎉
        </>
      ),
      target: "_blank",
    },
    {
      href: "https://hackenproof.com/assetmantle/assetmantle",
      text: (
        <>
          🏆 Participate in the Bug Bounty Program <strong>here</strong> and win
          prizes! 🏆
        </>
      ),
      target: "_blank",
    },
    {
      href: "https://quickswap.exchange/#/farm/v2?tab=DualFarm",
      text: <>💰 QuickSwap farming rewards are live now! Click Here! 💰</>,
      target: "_blank",
    },
  ];
  return (
    ALERTs &&
    Array.isArray(ALERTs) &&
    ALERTs.length > 0 && (
      <Slider className="bg-primary" {...settings}>
        {React.Children.toArray(
          ALERTs.map((alert) => (
            <Alert
              className="m-0 py-1 text-center border-0 d-flex px-2"
              variant="warning"
            >
              <Alert.Link
                className="text-center px-3 text-dark"
                style={{ width: "100%" }}
                href={alert.href}
                target={alert.target}
                rel="noopener noreferrer"
              >
                {alert.text}
              </Alert.Link>
            </Alert>
          ))
        )}
      </Slider>
    )
  );
}
