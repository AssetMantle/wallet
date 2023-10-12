import Link from "next/link";
import React, { useRef, useState } from "react";
import { Button, Stack } from "react-bootstrap";
import {
  defaultChainName,
  toastConfig,
  useCompositeWallet,
} from "../../config";
import {
  ConnectOptionObject,
  KEYSTORE_JSON_INVALID,
  mantleWalletV1URL,
} from "../../data";
import { cleanString } from "../../lib";
import useSwr from "swr";
import { toast } from "react-toastify";
import KeyStoreModal from "./KeyStoreModal";
import GenerateOnlyModal from "./GenerateOnlyModal";

const ConnectModal = ({ setOpen, walletRepo }) => {
  const { connectCompositeWallet } = useCompositeWallet(defaultChainName);
  const [ShowKeystoreModal, setShowKeystoreModal] = useState(false);

  const [ShowGenerateOnlyModal, setShowGenerateOnlyModal] = useState(false);

  const { mutate: mutateStateKeystoreJson } = useSwr("stateKeystoreJson");

  const formControlFileRef = useRef(null);
  const formControlPasswordRef = useRef(null);

  function handleCloseModal(e) {
    e.preventDefault();
    setOpen(false);
  }

  const handleSubmitKeystore = async (e) => {
    e.preventDefault();
    setShowKeystoreModal(false);
    const fileRaw = formControlFileRef.current.files[0];
    try {
      const fileReader = new FileReader();
      let keystoreJson;
      fileReader.readAsText(fileRaw, "UTF-8");
      fileReader.onload = (event) => {
        try {
          console.log("event.target.result: ", event.target.result);
          keystoreJson = JSON.parse(event.target.result);
          const stateKeystoreJson = {
            keystoreJson: keystoreJson,
            keystorePassword: formControlPasswordRef.current.value,
          };
          console.log("stateKeystoreJson: ", stateKeystoreJson);

          mutateStateKeystoreJson(stateKeystoreJson);
          connectCompositeWallet("keystore", "keystore");
        } catch (error) {
          console.error("Error during Keystore FileReader: ", error);
          toast.error(KEYSTORE_JSON_INVALID, toastConfig);
        }
      };
    } catch (error) {
      console.error("Error during Keystore FileReader2: ", error);
      toast.error(KEYSTORE_JSON_INVALID, toastConfig);
    }
  };

  const customWallets = [
    {
      walletPrettyName: "Ledger",
      walletName: "ledger",
      walletType: "ledger",
    },
    {
      walletPrettyName: "Keystore",
      walletName: "keystore",
      walletType: "keystore",
    },
    {
      walletPrettyName: "Generate Only",
      walletName: "generateonly",
      walletType: "generateonly",
    },
  ];

  return (
    <>
      <div
        className="modal "
        tabIndex="-1"
        role="dialog"
        id="WalletConnectModal"
      >
        <div
          className="modal-dialog modal-dialog-centered"
          role="document"
          style={{ maxWidth: "min(100%, 600px)" }}
        >
          <div className="modal-content">
            <div className="bg-am-gray-200 p-4 rounded-4 w-100 my-auto">
              <Stack
                direction="horizontal"
                className="align-items-center justify-content-between"
              >
                <h1 className="body1 text-primary m-0">Connect Wallet</h1>
                <Button
                  variant="link"
                  className="text-decoration-none text-primary body1"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={handleCloseModal}
                >
                  <i className="bi bi-x-lg text-primary" />
                </Button>
              </Stack>

              <Stack className="mt-5" gap={3}>
                <h2 className="caption text-white m-0">
                  Connect with Extension Wallets
                </h2>
                <Stack direction="horizontal" gap={2} className="flex-wrap">
                  {walletRepo?.wallets.map(
                    ({ walletPrettyName, walletName }, index) => (
                      <Button
                        variant="outline-primary"
                        className="d-flex align-items-center gap-2 py-2 px-3 rounded-2 fw-medium"
                        key={index}
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={async () => {
                          await connectCompositeWallet("cosmosKit", walletName);
                          setOpen(false);
                        }}
                      >
                        <div
                          className="position-relative overflow-hidden"
                          style={{
                            width: "25px",
                            aspectRatio: "1/1",
                            borderRadius: "7px",
                          }}
                        >
                          <img
                            layout="fill"
                            className="h-100 w-100"
                            style={{
                              objectFit: "cover",
                              objectPosition: "center",
                            }}
                            src={
                              ConnectOptionObject[cleanString(walletPrettyName)]
                                ?.icon
                            }
                            alt={walletPrettyName}
                          />
                        </div>
                        {walletPrettyName}
                      </Button>
                    )
                  )}
                </Stack>
              </Stack>

              <Stack className="mt-5" gap={3}>
                <h2 className="caption text-white m-0">
                  Connect with Custom Wallets
                </h2>
                <Stack direction="horizontal" gap={2} className="flex-wrap">
                  <Button
                    variant="outline-primary"
                    className="d-flex align-items-center gap-2 py-2 px-3 rounded-2 fw-medium"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={async () => {
                      await connectCompositeWallet?.(
                        customWallets?.[0]?.walletType,
                        customWallets?.[0]?.walletName
                      );
                      setOpen(false);
                    }}
                  >
                    <div
                      className="position-relative overflow-hidden"
                      style={{
                        width: "25px",
                        aspectRatio: "1/1",
                        borderRadius: "7px",
                      }}
                    >
                      <img
                        layout="fill"
                        className="h-100 w-100"
                        style={{
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                        src={
                          ConnectOptionObject[
                            cleanString(customWallets?.[0]?.walletPrettyName)
                          ]?.icon
                        }
                        alt={customWallets?.[0]?.walletPrettyName}
                      />
                    </div>
                    {customWallets?.[0]?.walletPrettyName}
                  </Button>
                  <Button
                    variant="outline-primary"
                    className="d-flex align-items-center gap-2 py-2 px-3 rounded-2 fw-medium"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={async () => {
                      setShowKeystoreModal(true);
                    }}
                  >
                    <div
                      className="position-relative overflow-hidden"
                      style={{
                        width: "25px",
                        aspectRatio: "1/1",
                        borderRadius: "7px",
                      }}
                    >
                      <img
                        layout="fill"
                        className="h-100 w-100"
                        style={{
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                        src={
                          ConnectOptionObject[
                            cleanString(customWallets?.[1]?.walletPrettyName)
                          ]?.icon
                        }
                        alt={customWallets?.[1]?.walletPrettyName}
                      />
                    </div>
                    {customWallets?.[1]?.walletPrettyName}
                  </Button>
                  <Button
                    variant="outline-primary"
                    className="d-flex align-items-center gap-2 py-2 px-3 rounded-2 fw-medium"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={async () => {
                      await setShowGenerateOnlyModal(true);
                    }}
                  >
                    <div
                      className="position-relative overflow-hidden"
                      style={{
                        width: "25px",
                        aspectRatio: "1/1",
                        borderRadius: "7px",
                      }}
                    >
                      <img
                        layout="fill"
                        className="h-100 w-100"
                        style={{
                          objectFit: "cover",
                          objectPosition: "center",
                        }}
                        src={
                          ConnectOptionObject[
                            cleanString(customWallets?.[2]?.walletPrettyName)
                          ]?.icon
                        }
                        alt={customWallets?.[2]?.walletPrettyName}
                      />
                    </div>
                    {customWallets?.[2]?.walletPrettyName}
                  </Button>
                </Stack>
              </Stack>

              <Stack className="mt-5" gap={3}>
                <h2 className="caption text-white m-0">
                  Go to Old Wallet for Keystore
                </h2>
                <Stack className="flex-wrap" direction="horizontal" gap={3}>
                  <Link href={mantleWalletV1URL}>
                    <a>
                      <Button
                        className="d-flex align-items-center gap-2 py-2 px-3 rounded-2 fw-medium"
                        variant="outline-primary"
                      >
                        <div
                          className="position-relative"
                          style={{ width: "25px", aspectRatio: "1/1" }}
                        >
                          <img
                            layout="fill"
                            src={"/favicon.png"}
                            alt={"v1_wallet"}
                          />
                        </div>
                        MantleWallet V1 (Old)
                      </Button>
                    </a>
                  </Link>
                </Stack>
              </Stack>
            </div>
          </div>
        </div>
      </div>

      {/* Keystore Modal */}
      <KeyStoreModal
        ShowKeystoreModal={ShowKeystoreModal}
        setShowKeystoreModal={setShowKeystoreModal}
        handleSubmitKeystore={handleSubmitKeystore}
        formControlFileRef={formControlFileRef}
        formControlPasswordRef={formControlPasswordRef}
      />

      <GenerateOnlyModal
        ShowGenerateOnlyModal={ShowGenerateOnlyModal}
        setShowGenerateOnlyModal={setShowGenerateOnlyModal}
      />
    </>
  );
};

export default ConnectModal;
