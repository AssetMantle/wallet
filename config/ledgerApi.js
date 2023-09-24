import { stringToPath } from "@cosmjs/crypto";
import { LedgerSigner } from "@cosmjs/ledger-amino";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
import { getPrefixFromChainName, getSlip44FromChainName } from "../lib";

const interactiveTimeout = 120_000;

export async function createTransport() {
  const ledgerTransport = await TransportWebUSB.create(
    interactiveTimeout,
    interactiveTimeout
  );
  return ledgerTransport;
}

function makeHdPath(accountNumber = "0", addressIndex = "0", coinType = "118") {
  return stringToPath(
    "m/44'/" + coinType + "'/" + accountNumber + "'/0/" + addressIndex
  );
}

export const connectLedger = async () => {
  let transport = await createTransport();
  return transport;
};

export const fetchAddress = async (
  chainName,
  accountNumber = "0",
  addressIndex = "0"
) => {
  let transport = await createTransport();
  let slip44 = getSlip44FromChainName(chainName);

  let signer;
  signer = new LedgerSigner(transport, {
    testModeAllowed: true,
    hdPaths: [makeHdPath(accountNumber, addressIndex, slip44)],
    prefix: getPrefixFromChainName(chainName),
  });

  const [firstAccount] = await signer.getAccounts();
  return firstAccount.address;
};

export async function LedgerWallet(hdpath, prefix) {
  const interactiveTimeout = 120_000;

  async function createTransport() {
    const ledgerTransport = await TransportWebUSB.create(
      interactiveTimeout,
      interactiveTimeout
    );
    return ledgerTransport;
  }

  const transport = await createTransport();
  const signer = new LedgerSigner(transport, {
    testModeAllowed: true,
    hdPaths: [hdpath],
    prefix: prefix,
  });
  const [firstAccount] = await signer.getAccounts();
  return [signer, firstAccount.address];
}
