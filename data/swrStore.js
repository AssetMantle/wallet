import { useWallet } from "@cosmos-kit/react";
import { assets, chains } from "chain-registry";
import useSwr from "swr";
import {
  defaultChainDenom,
  defaultChainDenomExponent,
  defaultChainName,
  mntlUsdApi,
  placeholderAvailableBalance,
  placeholderMntlUsdValue,
} from "../config";
import { cosmos } from "../modules";
import BigNumber from "bignumber.js";

// get the rest endpoint from the chain registry inside the Cosmos Kit
const restEndpoint = chains.find(
  (_chain) => _chain?.chain_name === defaultChainName
)?.apis?.rest[0]?.address;

const denom = assets.find(
  (assetObj) => assetObj?.chain_name === defaultChainName
)?.assets[0]?.base;

// console.log("assets: ", assets);
// console.log("AssetMantle Endpoint: ", restEndpoint);

// get the REST Query Client using Modules & Endpoint
const client = await cosmos.ClientFactory.createLCDClient({
  restEndpoint,
});

export const fromDenom = (value, exponent = defaultChainDenomExponent) => {
  return parseFloat(
    (parseFloat(value) / Math.pow(10, parseFloat(exponent))).toFixed(6)
  );
};

export const toDenom = (value, exponent = defaultChainDenomExponent) => {
  return parseFloat(
    (parseFloat(value) * Math.pow(10, parseFloat(exponent))).toFixed(0)
  );
};

export const fromChainDenom = (
  value,
  chainName = defaultChainName,
  chainDenom = defaultChainDenom
) => {
  let amount;
  // get the chain assets for the specified chain
  const chainassets = assets.find((chain) => chain.chain_name === chainName);
  // get the coin data from the chain assets data
  const coin = chainassets.assets.find((asset) => asset.base === chainDenom);
  // Get the display exponent
  // we can get the exponent from chain registry asset denom_units
  const exp = coin.denom_units.find(
    (unit) => unit.denom === coin.display
  )?.exponent;
  // show balance in display values by exponentiating it
  const valueBigNumber = new BigNumber(value.toString() || 0);
  if (BigNumber.isBigNumber(valueBigNumber)) {
    amount = valueBigNumber.multipliedBy(10 ** -exp).toString();
  } else {
    return "-1";
  }
  return amount;
};

export const toChainDenom = (
  value,
  chainName = defaultChainName,
  chainDenom = defaultChainDenom
) => {
  console.log("inside tochaindenom, value: ", value);
  let amount;
  // get the chain assets for the specified chain
  const chainassets = assets.find((chain) => chain.chain_name === chainName);
  // get the coin data from the chain assets data
  const coin = chainassets.assets.find((asset) => asset.base === chainDenom);
  // Get the display exponent
  // we can get the exponent from chain registry asset denom_units
  const exp = coin.denom_units.find(
    (unit) => unit.denom === coin.display
  )?.exponent;
  // show balance in display values by exponentiating it
  const valueBigNumber = new BigNumber(value.toString() || 0);
  if (BigNumber.isBigNumber(valueBigNumber)) {
    amount = valueBigNumber.multipliedBy(10 ** exp).toString();
  } else {
    return "-1";
  }
  return amount;
};

// function to check whether an address is invalid
export const isInvalidAddress = (address, chain = defaultChainName) => {
  return false;
};

// custom hook to implement multiple revalidation points to useWallet of cosmosKit
export const useWalletSwr = () => {
  // get the connected wallet parameters from useWallet hook
  const walletManager = useWallet();

  // fetcher function for useSwr of useWalletSwr()
  const fetchWalletManager = async (url) => {
    // console.log("inside fetchWalletManager, url: ", url);

    let walletManagerObject;

    // use a try catch block for creating rich Error object
    try {
      // get the properties of walletManager
      const {
        walletStatus,
        username,
        address,
        currentChainName,
        currentWalletName,
      } = walletManager;

      walletManagerObject = {
        walletStatus,
        username,
        address,
        currentChainName,
        currentWalletName,
      };
      // console.log("swr fetcher success: ", url);
    } catch (error) {
      console.error(`swr fetcher error: ${url}`);
      throw error;
    }

    // return the data
    return walletManagerObject;
  };

  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: walletManagerObject } = useSwr(
    "walletManager",
    fetchWalletManager,
    {
      refreshInterval: 1000,
    }
  );

  return {
    walletStatus: walletManagerObject?.walletStatus,
    username: walletManagerObject?.username,
    address: walletManagerObject?.address,
    currentChainName: walletManagerObject?.currentChainName,
    currentWalletName: walletManagerObject?.currentWalletName,
  };
};

export const useMntlUsd = () => {
  // fetcher function for useSwr of useAvailableBalance()
  const fetchMntlUsd = async (url) => {
    // console.log("inside fetchMntlUsd, url: ", url);
    let mntlUsdValue;

    // use a try catch block for creating rich Error object
    try {
      // fetch the data from API
      const res = await fetch(mntlUsdApi);
      const resJson = await res.json();
      mntlUsdValue = resJson?.assetmantle?.usd;
    } catch (error) {
      console.error(`swr fetcher error: ${url}`);
      throw error;
    }

    // return the data
    return mntlUsdValue;
  };

  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: mntlUsdValue, error } = useSwr("mntlusd", fetchMntlUsd, {
    fallbackData: placeholderMntlUsdValue,
    refreshInterval: 10000,
    suspense: true,
  });

  console.log("data: ", mntlUsdValue);

  return {
    mntlUsdValue: mntlUsdValue,
    // isLoadingMntlUsdValue: !error && !mntlUsdValue,
    errorMntlUsdValue: error,
  };
};

export const useAvailableBalance = () => {
  // get the connected wallet parameters from useWallet hook
  const walletManager = useWallet();
  const { walletStatus, address, currentWalletInfo } = walletManager;

  // let address = "mantle1egdwq4khcmsyd0tk6mpq28r7eawjpe6n5jdrm4";

  // let address = null;
  // console.log("address: ", address, " currentWalletInfo: ", currentWalletInfo);

  // fetcher function for useSwr of useAvailableBalance()
  const fetchAvailableBalance = async (url, address) => {
    // console.log("inside fetchAvailableBalance, url: ", url);
    let balanceValue;

    // use a try catch block for creating rich Error object
    try {
      // get the data from cosmos queryClient
      const { balance } = await client.cosmos.bank.v1beta1.balance({
        address,
        denom,
      });

      balanceValue = balance;
      // console.log("swr fetcher success: ", url);
    } catch (error) {
      console.error(`swr fetcher error: ${url}`);
      throw error;
    }

    // return the data
    return balanceValue;
  };

  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: balanceObject, error } = useSwr(
    address ? ["balance", address] : null,
    fetchAvailableBalance,
    {
      fallbackData: { amount: placeholderAvailableBalance, denom },
      refreshInterval: 1000,
      suspense: true,
    }
  );

  return {
    availableBalance: balanceObject?.amount,
    denom: balanceObject?.denom,
    // isLoadingAvailableBalance: !error && !balanceObject,
    errorAvailableBalance: error,
  };
};
