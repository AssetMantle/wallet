import React from "react";
import { Button, Stack } from "react-bootstrap";

export default function UploadKeystore({ close, setStep, setFile }) {
  const handleChange = (e) => {
    setFile(URL.createObjectURL(e.target.files[0]));
    setStep(5);
  };
  return (
    <div className="bg-am-gray-200 p-4 rounded-4 w-100 my-auto">
      <Stack
        direction="horizontal"
        className="align-items-center justify-content-between "
      >
        <Stack
          className="body1 text-primary align-items-center"
          as="h1"
          direction="horizontal"
          gap={2}
        >
          <button className="" onClick={() => setStep(1)}>
            <i className="bi bi-chevron-left text-primary" />
          </button>
          Connect with Keystore
        </Stack>
        <Button
          variant="link"
          className="text-decoration-none text-primary body1"
          onClick={() => close()}
        >
          <i className="bi bi-x-lg text-primary" />
        </Button>
      </Stack>
      <p className="text-white-50 caption m-0 my-1 ps-2">
        Connect your wallet using any of the options below
      </p>
      <Stack
        className="align-items-center justify-content-center border border-white rounded-0 position-relative mt-4"
        style={{ border: "1px dashed" }}
      >
        <Stack className="text-primary p-3 text-center" gap={3}>
          <span className="h4 text-primary mx-auto">
            <i className="bi bi-upload" />
          </span>
          <p className="caption text-white">Drop file here</p>
          <p className="caption text-white-50">or</p>
          <Stack
            direction="horizontal"
            className="border border-primary py-2 px-5 align-items-center rounded-4"
            gap={3}
          >
            Browse <i className="bi bi-search" />
          </Stack>
        </Stack>
        <input
          type="file"
          className="position-absolute top-0 bottom-0 start-0 end-0"
          accept=".json"
          style={{ opacity: "0" }}
          onChange={(e) => handleChange(e)}
        />
      </Stack>
      <p className="caption2 m-0 mt-3">
        Do not have one?{" "}
        <Button
          variant="link"
          className="text-decoration-none"
          onClick={() => setStep(8)}
        >
          Create keystore
        </Button>
      </p>
    </div>
  );
}
