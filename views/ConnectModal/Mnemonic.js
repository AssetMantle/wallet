import React, { useEffect } from "react";
import { useState } from "react";

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
    <div className="bg-gray-800 p-4 rounded-4 w-100 my-auto">
      <div className="d-flex align-items-center justify-content-between ">
        <h1 className="body1 text-primary d-flex align-items-center gap-2">
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
      </div>
      <p className="text-white-200 caption my-1 ps-2">
        Securely store this recovery phrase to recover wallet account
      </p>
      <div className="d-flex align-items-center justify-content-between gap-2 my-4">
        <div className="d-flex align-items-center gap-2">
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
        </div>
        <div className="d-flex align-items-center box-nav">
          <button
            className={`am-link body2 box-nav-item px-4 py-1 ${
              SeedLength === 12 ? "active" : ""
            }`}
            onClick={() => setSeedLength(12)}
          >
            12
          </button>
          <button
            className={`am-link body2 d-flex gap-1 box-nav-item px-4 py-1 ${
              SeedLength === 24 ? "active" : ""
            }`}
            onClick={() => setSeedLength(24)}
          >
            24
          </button>
        </div>
      </div>
      <div className="row mt-4">
        {React.Children.toArray(
          [...Array(SeedLength)].map((a, index) => (
            <div className={`col-3 d-flex flex-column gap-1 my-1`}>
              {index + 1 < 10 ? `0${index + 1}` : index + 1}
              <input
                className="am-input border-color-white bg-t mnemonic rounded-2 p-1 px-2"
                type={hidden ? "password" : "text"}
                onChange={(e) => handleInputSeed(e)}
                onFocus={() => setFocused(index)}
                onKeyDown={(e) => handleKeyDown(e)}
                onPaste={(e) => handlePaste(e)}
              />
            </div>
          ))
        )}
      </div>
      <div className="d-flex mt-4">
        <button
          className="button-primary px-5 py-1 ms-auto"
          onClick={handleConfirm}
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
