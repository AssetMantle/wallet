import React, { useEffect } from "react";
import { useState } from "react";
import { Button, Col, Row, Stack } from "react-bootstrap";

export default function Mnemonic({ MnemonicSeed, close, setStep }) {
  const [hidden, setHidden] = useState(true);
  const [Focused, setFocused] = useState(0);
  const [Seeds, setSeeds] = useState([]);
  const [SeedLength, setSeedLength] = useState(24);
  const [INPUTS, setINPUTS] = useState(
    document.querySelectorAll("input.mnemonic")
  );

  const handleInputSeed = (e) => {
    let seed = [...Seeds];
    seed[Focused] = e.target.value;
    setSeeds(seed);
  };
  const handleKeyDown = (e) => {
    if (Focused !== INPUTS.length && e.key === " ") {
      setFocused(Focused + 1);
      INPUTS[Focused].focus();
    } else if (
      Focused !== 0 &&
      (e.key === "Backspace" || e.key === "Delete") &&
      (e.target.value === undefined ||
        e.target.value === null ||
        e.target.value === "")
    ) {
      INPUTS[Focused - 1].focus();
    }
  };
  const handlePaste = (e) => {
    let paste = (e.clipboardData || window.clipboardData).getData("text");
    e.preventDefault();
    let arr = paste.split(" ");
    arr.map((el, ind) => {
      if (ind < SeedLength) {
        INPUTS[ind].value = el;
      }
    });
    setFocused(arr.length <= SeedLength ? arr.length - 1 : SeedLength - 1);
    INPUTS[arr.length <= SeedLength ? arr.length - 1 : SeedLength - 1].focus();
    setSeeds(arr);
  };

  useEffect(() => {
    setINPUTS(document.querySelectorAll("input.mnemonic"));
  }, [SeedLength]);

  // this function is to get the Mnemonic as sentence
  let Mnemonic = "";
  for (let i = 0; i < Seeds.length && i < SeedLength; i++) {
    if (i !== Seeds.length - 1 && !Seeds[i].includes(" ")) {
      Mnemonic += Seeds[i] + " ";
    } else {
      Mnemonic += Seeds[i];
    }
  }
  // console.log(Mnemonic.replaceAll("  ", " "));

  const handleConfirm = () => {
    MnemonicSeed(Mnemonic);
    setStep(10);
  };

  return (
    <div className="bg-light-subtle p-4 rounded-4 w-100 my-auto">
      <Stack
        className="align-items-center justify-content-between"
        direction="horizontal"
      >
        <h1 className="body1 text-primary d-flex align-items-center gap-2 m-0">
          <button className="" onClick={() => setStep(8)}>
            <i className="bi bi-chevron-left" />
          </button>
          Mnemonic
        </h1>
        <button className="btn text-primary body1" onClick={() => close()}>
          <span className="text-primary">
            <i className="bi bi-x-lg" />
          </span>
        </button>
      </Stack>
      <p className="text-white-200 caption m-0 my-1 ps-2">
        Securely store this recovery phrase to recover wallet account
      </p>
      <Stack
        className="align-items-center justify-content-between my-4"
        gap={2}
        direction="horizontal"
      >
        <Stack className="align-items-center" gap={2} direction="horizontal">
          Click to show or hide seed phrase
          <button
            className="body2 text-primary"
            onClick={() => setHidden(!hidden)}
          >
            {!hidden ? (
              <i className="bi bi-eye-hide" />
            ) : (
              <i className="bi bi-eye" />
            )}
          </button>
        </Stack>
        <Stack className="align-items-center box-nav" direction="horizontal">
          <Button
            variation="link"
            className={`text-primary text-decoration-none body2 box-nav-item px-4 py-1 ${
              SeedLength === 12 ? "active" : ""
            }`}
            onClick={() => setSeedLength(12)}
          >
            12
          </Button>
          <Button
            variation="link"
            className={`text-primary text-decoration-none body2 d-flex gap-1 box-nav-item px-4 py-1 ${
              SeedLength === 24 ? "active" : ""
            }`}
            onClick={() => setSeedLength(24)}
          >
            24
          </Button>
        </Stack>
      </Stack>
      <Row className="mt-4">
        {React.Children.toArray(
          [...Array(SeedLength)].map((a, index) => (
            <Col xs={3} key={index} className={`d-flex flex-column gap-1 my-1`}>
              {index + 1 < 10 ? `0${index + 1}` : index + 1}
              <input
                className="border border-white bg-transparent mnemonic rounded-2 p-1 px-2"
                type={hidden ? "password" : "text"}
                onChange={(e) => handleInputSeed(e)}
                onFocus={() => setFocused(index)}
                onKeyDown={(e) => handleKeyDown(e)}
                onPaste={(e) => handlePaste(e)}
              />
            </Col>
          ))
        )}
      </Row>
      <Stack className="mt-4">
        <Button
          variant="primary"
          className="rounded-5 px-5 py-1 ms-auto"
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </Stack>
    </div>
  );
}
