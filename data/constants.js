export const formConstants = {
  recipientAddressErrorMsg: "Invalid Address",
  transferAmountErrorMsg: "Insufficient Balance",
  insufficientBalanceFeeErrorMsg: "Insufficient Balance to pay for Chain Fee",
  requiredErrorMsg: "Required field is blank",
  invalidValueErrorMsg: "Input value is invalid",
};

export const placeholderAddress = "mantle1000000...000000";
export const placeholderAddressGravity =
  "gravity100000000000000000000000000000000000000";

export const placeholderAddressEth =
  "0x0000000000000000000000000000000000000000";

export const getPlaceholderAddress = (hrpValue) =>
  `${hrpValue}1000000...000000`;

export const bech32AddressSeperator = "1";
export const shortenAddressSize = 6;
export const shortenAddressSizeEth = 4;

// Wagmi related error
export const PREPARE_CONTRACT_ERROR = "Prepare Contract Error";
export const INCENTIVE_ENDED_ERROR =
  "Cannot stake as Incentive has already ended";
export const ALREADY_UNSTAKED_ERROR =
  "Token already unstaked. Withdraw Token manually";
export const WRITE_CONTRACT_ERROR = "Error during writing config of contract";

// Wallet related constants

export const WALLET_NOT_FOUND_ERROR_MSG =
  "Wallet not found. Please try a different one.";
export const WALLET_DISCONNECT_ERROR_MSG =
  "Error during disconnect. Try refreshing the page";

export const mantleWalletV1URL = "https://v1.wallet.assetmantle.one/";

export const ConnectOptionObject = {
  cosmostation: {
    icon: "/WalletIcons/cosmostation.png",
    name: "Cosmostation",
    installUrl: "https://www.cosmostation.io/wallet#extension",
  },
  cosmostationmobile: {
    icon: "/WalletIcons/cosmostation.png",
    name: "Cosmostation Mobile",
    installUrl: "https://www.cosmostation.io/wallet",
  },
  keplr: {
    icon: "/WalletIcons/keplr.png",
    name: "Keplr",
    installUrl: "https://www.keplr.app/download",
  },
  keplrmobile: {
    icon: "/WalletIcons/keplr.png",
    name: "Keplr",
    installUrl: "https://www.keplr.app/download",
  },
  trust: {
    icon: "/WalletIcons/trust.png",
    name: "Trust",
    installUrl: "https://trustwallet.com/browser-extension/",
  },
  vectis: {
    icon: "/WalletIcons/vectis.png",
    name: "Vectis",
    installUrl:
      "https://chrome.google.com/webstore/detail/vectis-wallet/cgkaddoglojnmfiblgmlinfaijcdpfjm",
  },
  keystore: {
    icon: "/WalletIcons/keystore.png",
    name: "Keystore",
    installUrl: "https://medium.com/coinmanager/what-is-keystore-e1f9bd328826",
  },
  leap: {
    icon: "/WalletIcons/leap.png",
    name: "Leap",
    installUrl: "https://www.leapwallet.io/",
  },
  ledger: {
    icon: "/WalletIcons/ledger.png",
    name: "Ledger",
    installUrl: "https://www.ledger.com/",
  },
  xdefi: {
    icon: "/WalletIcons/xdefi.jpg",
    name: "XDEFI",
    installUrl: "https://www.xdefi.io/",
  },
  frontier: {
    icon: "/WalletIcons/frontier.png",
    name: "Frontier",
    installUrl: "https://www.frontier.xyz/browser-extension",
  },
};
