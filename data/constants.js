import Link from "next/link";

export const formConstants = {
  recipientAddressErrorMsg: "Invalid Address",
  transferAmountErrorMsg: "Insufficient Balance",
  insufficientBalanceErrorMsg: (
    <span>
      Insufficient Balance. To get more tokens go to{" "}
      <Link href="/trade">
        <a style={{ textDecoration: "underline" }}>Trade</a>
      </Link>
    </span>
  ),
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

export const staticTradeData = [
  {
    logo: "lbank",
    name: "LBank",
    pair: "MNTL/USDT",
    target_coin_id: "tether",
    coin_id: "assetmantle",
    url: "https://www.lbank.info/exchange/mntl/usdt",
    price: "0.000000",
    volume: "0.000000",
  },
  {
    logo: "osmosis",
    project: "Osmosis",
    name: "Osmosis",
    target_coin_id: "osmosis",
    pair: "MNTL/OSMO",
    coin_id: "assetmantle",
    url: "https://app.osmosis.zone/?from=OSMO&to=MNTL",
    price: "0.000000",
    volume: "0.000000",
  },
  {
    logo: "osmosis",
    project: "Osmosis",
    name: "Osmosis",
    target_coin_id: "axlusdc",
    coin_id: "assetmantle",
    pair: "MNTL/AXLUSDC",
    coin_id: "assetmantle",
    url: "https://app.osmosis.zone/?from=USDC&to=MNTL",
    price: "0.000000",
    volume: "0.000000",
  },
  {
    logo: "uniswap-v3",
    name: "Uniswap (v3)",
    pair: "MNTL/ETH",
    coin_id: "assetmantle",
    target_coin_id: "weth",
    subTitle: "(ETH Pool)",
    url: "https://app.uniswap.org/#/swap?theme=dark&inputCurrency=ETH&outputCurrency=0x2c4f1df9c7de0c59778936c9b145ff56813f3295",
    price: "0.000000",
    volume: "0.000000",
  },
  {
    logo: "mexc",
    name: "MEXC Global",
    pair: "MNTL/USDT",
    target_coin_id: "tether",
    coin_id: "assetmantle",
    url: "https://www.mexc.com/exchange/MNTL_USDT?inviteCode=1498J",
    price: "0.000000",
    volume: "0.000000",
  },
  {
    logo: "osmosis",
    project: "Osmosis",
    name: "Osmosis",
    target_coin_id: "assetmantle",
    pair: "ATOM/MNTL",
    coin_id: "cosmos",
    url: "https://app.osmosis.zone/?from=ATOM&to=MNTL",
    price: "0.000000",
    volume: "0.000000",
  },
  {
    logo: "quickswap-dex",
    name: "Quickswap",
    pair: "MNTL/USDC",
    target_coin_id: "usd-coin",
    coin_id: "assetmantle",
    url: "https://quickswap.exchange/#/swap?swapIndex=0&currency0=0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174&currency1=0x38A536A31bA4d8C1Bcca016AbBf786ecD25877E8",
    price: "0.000000",
    volume: "0.000000",
  },
  {
    logo: "quickswap-dex",
    name: "Quickswap",
    pair: "MNTL/VERSA",
    target_coin_id: "versagames",
    coin_id: "assetmantle",
    url: "https://quickswap.exchange/#/swap?inputCurrency=0x8497842420cfdbc97896c2353d75d89fc8d5be5d&outputCurrency=0x38a536a31ba4d8c1bcca016abbf786ecd25877e8&swapIndex=0",
    price: "0.000000",
    volume: "0.000000",
  },
  {
    logo: "Bitrue",
    name: "Bitrue",
    pair: "MNTL/USDT",
    target_coin_id: "tether",
    coin_id: "assetmantle",
    url: "https://www.bitrue.com/trade/mntl_usdt",
    price: "0.000000",
    volume: "0.000000",
  },

  {
    logo: "cSwap",
    name: "cSwap",
    pair: "MNTL/CMDX",
    target_coin_id: "assetmantle",
    coin_id: "comdex",
    url: "https://app.cswap.one/trade",
    price: "0.000000",
    volume: "0.000000",
  },
  {
    logo: "cSwap",
    name: "cSwap",
    pair: "MNTL/CMST",
    target_coin_id: "assetmantle",
    coin_id: "composite",
    url: "https://app.cswap.one/trade",
    price: "0.000000",
    volume: "0.000000",
  },
];

export const staticEarnData = [
  {
    symbol: "MNTL-USDC",
    logo: "osmosis",
    project: "Osmosis",
    chain: "cosmos",
    apy: "0.000000",
    tvlUsd: "0.00",
  },
  {
    symbol: "MNTL-OSMO",
    logo: "osmosis",
    project: "Osmosis",
    chain: "cosmos",
    apy: "0.000000",
    tvlUsd: "0.00",
  },
  {
    symbol: "ATOM-MNTL",
    logo: "osmosis",
    project: "Osmosis",
    chain: "cosmos",
    apy: "0.000000",
    tvlUsd: "0.00",
  },
  {
    symbol: "USDC-MNTL",
    logo: "quickswap-dex",
    project: "quickswap-dex",
    chain: "polygon",
    apy: "0.000000",
    tvlUsd: "0.00",
  },
];

// New UI related data
export const farmPools = [
  {
    name: "Uniswap",
    from: "eth",
    pools: [
      {
        tokens: "MNTL – ETH",
        lpTokenLink:
          "https://app.uniswap.org/#/add/0x2c4f1df9c7de0c59778936c9b145ff56813f3295/ETH/3000?minPrice=0.000001&maxPrice=0.000006",
        rewardPool: "2,500,0000 $MNTL",
        duration: "00Days,00Hours",
        apr: "200%",
        tvl: "$30,000",
        startTime: "1680353156",
        endTime: "1688211001",
      },
    ],
  },
  {
    name: "Quickswap",
    from: "polygon",
    pools: [
      {
        tokens: "MNTL – VERSA",
        lpTokenLink: "",
        rewardPool: "$0,000.0000",
        duration: "00Days,00Hours",
        tvl: "$10,370",
        apr: "254.52%",
      },
      {
        tokens: "MNTL – USDC",
        lpTokenLink: "",
        rewardPool: "$0,000.0000",
        duration: "00Days,00Hours",
        tvl: "$10,370",
        apr: "254.52%",
      },
    ],
  },
  {
    name: "Osmosis DEX",
    from: "osmosis",
    pools: [
      {
        tokens: "MNTL – USDC",
        lpTokenLink: "",
        rewardPool: "$0,000.0000",
        duration: "00Days,00Hours",
        stakeType: "external",
        extLink: "",
      },
      {
        tokens: "MNTL – OSMO",
        lpTokenLink: "",
        rewardPool: "$0,000.0000",
        duration: "00Days,00Hours",
        stakeType: "external",
        extLink: "",
      },
      {
        tokens: "MNTL – ATOM",
        lpTokenLink: "",
        rewardPool: "$0,000.0000",
        duration: "00Days,00Hours",
        stakeType: "external",
        extLink: "",
      },
    ],
  },
  {
    name: "Comdex cSwap",
    from: "comdex",
    pools: [
      {
        tokens: "MNTL – CMST",
        rewardPool: "$0,000.0000",
        duration: "00Days,00Hours",
        tvl: "$10,370",
        apr: "254.52%",
      },
      {
        tokens: "MNTL – CMDX",
        rewardPool: "$0,000.0000",
        duration: "00Days,00Hours",
        tvl: "$10,370",
        apr: "254.52%",
      },
    ],
  },
];
