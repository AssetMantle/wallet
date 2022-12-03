import { useWallet } from "@cosmos-kit/react";
import { assets, chains } from "chain-registry";
import useSwr from "swr";
import {
  chainDenomExponent,
  chainName,
  mntlUsdApi,
  placeholderAvailableBalance,
  placeholderMntlUsdValue,
} from "../config";
import { cosmos } from "../modules";

// get the rest endpoint from the chain registry inside the Cosmos Kit
const restEndpoint = chains.find((_chain) => _chain?.chain_name === chainName)
  ?.apis?.rest[0]?.address;

const denom = assets.find((assetObj) => assetObj?.chain_name === chainName)
  ?.assets[0]?.base;

// console.log("assets: ", assets);
// console.log("AssetMantle Endpoint: ", restEndpoint);

// get the REST Query Client using Modules & Endpoint
const client = await cosmos.ClientFactory.createLCDClient({
  restEndpoint,
});

export const fromDenom = (value, exponent = chainDenomExponent) => {
  return parseFloat(
    (parseFloat(value) / Math.pow(10, parseFloat(exponent))).toFixed(6)
  );
};

export const toDenom = (value, exponent = chainDenomExponent) => {
  return parseFloat(
    (parseFloat(value) * Math.pow(10, parseFloat(exponent))).toFixed(0)
  );
};

// function to check whether an address is invalid
export const isInvalidAddress = (address, chain = chainName) => {
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
