import { useWallet } from "@cosmos-kit/react";
import { assets, chains } from "chain-registry";
import useSwr from "swr";
import {
  chainDenomExponent,
  chainName,
  mntlUsdApi,
  placeholderAvailableBalance,
  placeholderMntlUsdValue,
  placeholderTotalDelegations,
  placeholderTotalUnbonding,
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

export const useExample = () => {
  const data = "adasdsad";
  const error = "wrroe";
  return {
    data,
    error,
  };
};

export const useTotalUnbonding = () => {
  // get the connected wallet parameters from useWallet hook
  const walletManager = useWallet();
  // const { walletStatus, address, currentWalletInfo } = walletManager;

  const address = "mantle1jxe2fpgx6twqe7nlxn4g96nej280zcemgqjmk0";

  const fetchTotalUnbonding = async (url, address) => {
    let totalUnbonding;

    try {
      const { unbonding_responses } =
        await client.cosmos.staking.v1beta1.delegatorUnbondingDelegations({
          delegatorAddr: address,
        });

      totalUnbonding = unbonding_responses.reduce(
        (total, currentValue) =>
          parseFloat(total) + parseFloat(currentValue?.entries[0]?.balance),
        parseFloat("0")
      );

      // totalUnbonding = unbonding_responses;
    } catch (error) {
      console.error(`swr fetcher error: ${url}`);
      throw error;
    }
    return totalUnbonding;
  };

  const { data: totalUnbonding, error } = useSwr(
    address ? ["unbonding", address] : null,
    fetchTotalUnbonding,
    {
      fallbackData: [
        {
          entries: [
            {
              initial_balance: "0",
              balance: "0",
            },
          ],
        },
      ],
      refreshInterval: 1000,
      suspense: true,
    }
  );

  return {
    allUnbonding: totalUnbonding,
    isLoadingUnbonding: !error && !totalUnbonding,
    errorUnbonding: error,
  };
};

export const useTotalRewards = () => {
  // get the connected wallet parameters from useWallet hook
  const walletManager = useWallet();
  // const { walletStatus, address, currentWalletInfo } = walletManager;

  const address = "mantle1jxe2fpgx6twqe7nlxn4g96nej280zcemgqjmk0";

  const fetchTotalRewards = async (url, address) => {
    let totalRewards;

    try {
      const { rewards } =
        await client.cosmos.distribution.v1beta1.delegationTotalRewards({
          delegatorAddress: address,
        });
      console.log(rewards);
      totalRewards = rewards.reduce(
        (total, currentValue) =>
          parseFloat(total) + parseFloat(currentValue?.reward[0].amount),
        parseFloat("0")
      );
    } catch (error) {
      console.error(`swr fetcher error: ${url}`);
      console.log(error);
      throw error;
    }
    return totalRewards;
  };
  const { data: rewardsArray, error } = useSwr(
    address ? ["rewards", address] : null,
    fetchTotalRewards,
    {
      fallbackData: [
        {
          validator_address: "validator",
          reward: [{ denom: "umntl", amount: "amount" }],
        },
      ],

      refreshInterval: 1000,
      suspense: true,
    }
  );
  return {
    allRewards: rewardsArray,
    isLoadingRewards: !error && !rewardsArray,
    errorUnbonding: error,
  };
};

export const useTotalDelegated = () => {
  // get the connected wallet parameters from useWallet hook
  const walletManager = useWallet();
  // const { walletStatus, address, currentWalletInfo } = walletManager;

  let address = "mantle1jxe2fpgx6twqe7nlxn4g96nej280zcemgqjmk0";

  // let address = null;
  // console.log("address: ", address, " currentWalletInfo: ", currentWalletInfo);

  // fetcher function for useSwr of useAvailableBalance()
  const fetchTotalDelegations = async (url, address) => {
    let totalDelegations;

    // use a try catch block for creating rich Error object
    try {
      // get the data from cosmos queryClient
      const { delegation_responses } =
        await client.cosmos.staking.v1beta1.delegatorDelegations({
          delegatorAddr: address,
        });
      totalDelegations = delegation_responses.reduce(
        (total, currentValue) =>
          parseFloat(total) + parseFloat(currentValue?.balance?.amount),
        parseFloat("0")
      );
    } catch (error) {
      console.error(`swr fetcher error: ${url}`);
      throw error;
    }

    // return the data
    return totalDelegations;
  };
  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: delegationsArray, error } = useSwr(
    address ? ["delegations", address] : null,
    fetchTotalDelegations,
    {
      fallbackData: [
        {
          balance: { denom: "umntl", amount: 0 },
          delegation: {
            delegator_address: "delegator_address",
            validator_address: "validator_address",
            shares: "298317289",
          },
        },
      ],
      suspense: true,
      refreshInterval: 1000,
    }
  );
  return {
    allDelegations: delegationsArray,
    isLoadingDelegations: !error && !delegationsArray,
    errorDelegations: error,
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
      const res = fetch(url);
      mntlUsdValue = res.json();
      // console.log("swr fetcher success: ", url);
    } catch (error) {
      console.error(`swr fetcher error: ${url}`);
      throw error;
    }

    // return the data
    return mntlUsdValue;
  };

  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: mntlUsdValue, error } = useSwr(
    address ? [mntlUsdApi, address] : null,
    fetchMntlUsd,
    {
      fallbackData: placeholderMntlUsdValue,
      refreshInterval: 10000,
    }
  );

  console.log("data: ", mntlUsdValue);

  return {
    mntlUsdValue: mntlUsdValue?.assetmantle,
    isLoading: !error && !mntlUsdValue,
    error,
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
    }
  );

  return {
    availableBalance: balanceObject?.amount,
    denom: balanceObject?.denom,
    isLoadingAvailableBalance: !error && !balanceObject,
    errorAvailableBalance: error,
  };
};
