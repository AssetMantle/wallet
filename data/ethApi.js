import { POSClient, use } from "@maticnetwork/maticjs";
import { Web3ClientPlugin } from "@maticnetwork/maticjs-web3";
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import useSWR from "swr";
import { configureChains, createClient, useAccount } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";
import { placeholderAvailableBalance } from "../config";
import { toChainDenom } from "./queryApi";

// CONFIG PARAMETERS FOR ETH AND POLYGON
export const selectedEthNetwork = "mainnet";
export const web3ModalProjectID = "f068c2aa18a3ec82f5eafdc8abe7ae23";

export const ethConfig = {
  mainnet: {
    network: "mainnet",
    version: "v1",
    rpc: {
      pos: {
        parent: process.env.ETH_MAINNET_RPC,
        child:
          process.env.POLYGON_MAINNET_RPC || "https://rpc-mumbai.matic.today",
      },
      hermez: {
        parent: process.env.GOERLI_ROOT_RPC,
        child: process.env.HERMEZ_RPC || "https://rpc.public.zkevm-test.net",
      },
    },
    token: {
      parent: {
        erc20: "0x2C4F1DF9c7DE0C59778936C9b145fF56813F3295",
        // matic: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
        //   erc721: "0x16F7EF3774c59264C46E5063b1111bCFd6e7A72f",
        //   erc1155: "0x2e3Ef7931F2d0e4a7da3dea950FF3F19269d9063",
        //   chainManagerAddress: "0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74", // Address of RootChainManager for POS Portal
      },
      child: {
        //   erc721: "0xbD88C3A7c0e242156a46Fbdf87141Aa6D0c0c649",
        erc20: "0x38a536a31ba4d8c1bcca016abbf786ecd25877e8",
        matic: "0x0000000000000000000000000000000000001010",
        //   weth: "0x714550C2C1Ea08688607D86ed8EeF4f5E4F22323",
        //   erc1155: "0xA07e45A987F19E25176c877d98388878622623FA",
      },
    },
    erc20PredicateProxy: {
      parent: "0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf",
    },
    rootChainManagerProxy: {
      parent: "0xA0c68C638235ee32657e8f720a23ceC1bFc77C77",
    },
    SYNCER_URL: "https://testnetv3-syncer.api.matic.network/api/v1", // Backend service which syncs the Matic sidechain state to a MySQL database which we use for faster querying. This comes in handy especially for constructing withdrawal proofs while exiting assets from Plasma.
    WATCHER_URL: "https://testnetv3-watcher.api.matic.network/api/v1", // Backend service which syncs the Matic Plasma contract events on Ethereum mainchain to a MySQL database which we use for faster querying. This comes in handy especially for listening to asset deposits on the Plasma contract.
    user1: {
      // '<paste your private key here>' - A sample private key prefix with `0x`
      privateKey: process.env.USER1_PRIVATE_KEY,
      //'<paste address belonging to private key here>', Your address
      address: process.env.USER1_FROM,
    },
    user2: {
      address: process.env.USER2_FROM,
    },
    proofApi: process.env.PROOF_API || "https://apis.matic.network/",
  },
  testnet: {
    network: "testnet",
    version: "mumbai",
    rpc: {
      pos: {
        parent: process.env.ETH_TESTNET_RPC,
        child:
          process.env.POLYGON_TESTNET_RPC || "https://rpc-mumbai.matic.today",
      },
      hermez: {
        parent: process.env.GOERLI_ROOT_RPC,
        child: process.env.HERMEZ_RPC || "https://rpc.public.zkevm-test.net",
      },
    },
    token: {
      parent: {
        erc20: "0x2C4F1DF9c7DE0C59778936C9b145fF56813F3295", // CHANGE THIS TO TESTNET
        //   erc721: "0x16F7EF3774c59264C46E5063b1111bCFd6e7A72f",
        //   erc1155: "0x2e3Ef7931F2d0e4a7da3dea950FF3F19269d9063",
        //   chainManagerAddress: "0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74", // Address of RootChainManager for POS Portal
      },
      child: {
        //   erc721: "0xbD88C3A7c0e242156a46Fbdf87141Aa6D0c0c649",
        erc20: "0x38a536a31ba4d8c1bcca016abbf786ecd25877e8", // CHANGE THIS TO TESTNET
        //   weth: "0x714550C2C1Ea08688607D86ed8EeF4f5E4F22323",
        //   erc1155: "0xA07e45A987F19E25176c877d98388878622623FA",
      },
    },
    SYNCER_URL: "https://testnetv3-syncer.api.matic.network/api/v1", // Backend service which syncs the Matic sidechain state to a MySQL database which we use for faster querying. This comes in handy especially for constructing withdrawal proofs while exiting assets from Plasma.
    WATCHER_URL: "https://testnetv3-watcher.api.matic.network/api/v1", // Backend service which syncs the Matic Plasma contract events on Ethereum mainchain to a MySQL database which we use for faster querying. This comes in handy especially for listening to asset deposits on the Plasma contract.
    user1: {
      // '<paste your private key here>' - A sample private key prefix with `0x`
      privateKey: process.env.USER1_PRIVATE_KEY,
      //'<paste address belonging to private key here>', Your address
      address: process.env.USER1_FROM,
    },
    user2: {
      address: process.env.USER2_FROM,
    },
    proofApi: process.env.PROOF_API || "https://apis.matic.network/",
  },
};

// SETUP WEB3MODAL & WAGMI
const chains = [mainnet, polygon];
// create the provider & wagmi client & ethereum client
const { provider } = configureChains(chains, [
  walletConnectProvider({
    projectId: web3ModalProjectID,
  }),
]);

// create the wagmiClient
export const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: "web3Modal", chains }),
  provider,
});
// now create ethereum client using wagmi client
export const ethereumClient = new EthereumClient(wagmiClient, chains);

// MATICJS INTEGRATION
// get a POSClient by injecting the wagmi provider
use(Web3ClientPlugin);

export const parentERC20TokenAddress =
  ethConfig[selectedEthNetwork]?.token?.parent.erc20;
export const childERC20TokenAddress =
  ethConfig[selectedEthNetwork]?.token?.child.erc20;
export const childMaticTokenAddress =
  ethConfig[selectedEthNetwork]?.token?.child.matic;

// QUERY API
// swr hook to query the MNTL Token Balance in Eth Chain
export const useMntlEthBalance = () => {
  // get the address from connected web3Modal
  const { address, connector } = useAccount();
  // const ethAddress = isConnected ? address : placeholderAddressEth;

  // declare a new POS client
  const posClient = new POSClient();

  // fetcher function for useSwr of useMntlEthBalance()
  const fetchMntlEthBalance = async (url, address) => {
    let balanceValue;

    // use a try catch block for creating rich Error object
    try {
      // get the Ethereum Provider
      // const ethereumProvider = await detectEthereumProvider();
      const newProvider = await connector.getProvider();

      // initialize POS client
      await posClient.init({
        network: ethConfig[selectedEthNetwork]?.network, // 'testnet' or 'mainnet'
        version: ethConfig[selectedEthNetwork]?.version, // 'mumbai' or 'v1'
        parent: {
          provider: newProvider,
        },
        child: {
          provider: newProvider,
        },
      });

      // get the parent ERC20 token
      const parentERC20Token = posClient.erc20(parentERC20TokenAddress, true);

      // get balance of user
      // const balance = "123";
      const balance = await parentERC20Token.getBalance(address);

      balanceValue = balance;
      // console.log("swr fetcher success: ", url);
    } catch (error) {
      console.error(`swr fetcher : url: ${url},  error: ${error}`);
      throw error;
    }

    // return the data
    return balanceValue;
  };

  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: balanceValue, error } = useSWR(
    address ? ["useMntlEthBalance", address] : null,
    fetchMntlEthBalance,
    {
      fallbackData: placeholderAvailableBalance,
      refreshInterval: 1000,
    }
  );

  return {
    mntlEthBalance: balanceValue,
    isLoadingMntlEthBalance: !error && !balanceValue,
    errorMntlEthBalance: error,
  };
};

export const useMaticBalance = () => {
  // get the address from connected web3Modal
  const { address, connector } = useAccount();
  // const ethAddress = isConnected ? address : placeholderAddressEth;

  // declare a new POS client
  const posClient = new POSClient();

  // fetcher function for useSwr of useMaticBalance()
  const fetchMaticBalance = async (url, address, connector) => {
    let balanceValue;

    // use a try catch block for creating rich Error object
    try {
      // get the Ethereum Provider
      // const ethereumProvider = await detectEthereumProvider();
      const newProvider = await connector.getProvider();

      // initialize POS client
      await posClient.init({
        network: ethConfig[selectedEthNetwork]?.network, // 'testnet' or 'mainnet'
        version: ethConfig[selectedEthNetwork]?.version, // 'mumbai' or 'v1'
        parent: {
          provider: newProvider,
        },
        child: {
          provider: newProvider,
        },
      });

      // get the child ERC20 token
      const childMaticToken = posClient.erc20(childMaticTokenAddress, false);

      // get balance of user
      // const balance = "123";
      const balance = await childMaticToken.getBalance(address);

      balanceValue = balance;
      // console.log("swr fetcher success: ", url);
    } catch (error) {
      console.error(`swr fetcher : url: ${url},  error: ${error}`);
      throw error;
    }

    // return the data
    return balanceValue;
  };

  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: balanceValue, error } = useSWR(
    address ? ["useMaticBalance", address, connector] : null,
    fetchMaticBalance,
    {
      fallbackData: placeholderAvailableBalance,
      refreshInterval: 1000,
    }
  );

  return {
    maticBalance: balanceValue,
    isLoadingMaticBalance: !error && !balanceValue,
    errorMaticBalance: error,
  };
};

// swr hook to query the MNTL Token Balance in Eth Chain
export const useAllowance = () => {
  console.log("inside useAllowance");

  // get the address from connected web3Modal
  const { address, connector } = useAccount();
  // const ethAddress = isConnected ? address : placeholderAddressEth;
  // console.log("connector: ", connector);

  // declare a new POS client
  const posClient = new POSClient();

  // fetcher function for useSwr of useMntlEthBalance()
  const fetchAllowance = async (url, address, connector) => {
    console.log("inside fetchAllowance, address: ", address);
    let allowanceValue;

    // use a try catch block for creating rich Error object
    try {
      // get the Ethereum Provider
      // const ethereumProvider = await detectEthereumProvider();
      const newProvider = await connector?.getProvider();
      // console.log("newProvider: ", newProvider);

      if (newProvider) {
        // initialize POS client
        await posClient.init({
          network: ethConfig[selectedEthNetwork]?.network, // 'testnet' or 'mainnet'
          version: ethConfig[selectedEthNetwork]?.version, // 'mumbai' or 'v1'
          parent: {
            provider: newProvider,
          },
          child: {
            provider: newProvider,
          },
        });

        // get the parent ERC20 token
        const parentERC20Token = posClient.erc20(parentERC20TokenAddress, true);

        // get balance of user
        // const balance = "123";
        const balance = await parentERC20Token.getAllowance(address);

        allowanceValue = balance;
      }

      // console.log("swr fetcher success: ", url);
    } catch (error) {
      console.error(`swr fetcher : url: ${url},  error: ${error}`);
      throw error;
    }

    // return the data
    return allowanceValue;
  };

  // implement useSwr for cached and revalidation enabled data retrieval
  const { data: allowanceValue, error } = useSWR(
    address ? ["useAllowance", address, connector] : null,
    fetchAllowance,
    {
      fallbackData: placeholderAvailableBalance,
      refreshInterval: 1000,
    }
  );

  return {
    allowance: allowanceValue,
    isLoadingAllowance: !error && !allowanceValue,
    errorAllowance: error,
  };
};

// TRANSACTION API
// txn to deposit eth token to polygon POS
export const depositMntlToken = async (address, amount, connector) => {
  console.log(
    "inside depositMntlToken, address: ",
    address,
    " amount: ",
    amount
  );
  let response;

  // convert amount to denom amount
  let denomAmount = toChainDenom(amount);

  // use a try catch block for creating rich Error object
  try {
    // declare a new POS client
    const posClient = new POSClient();
    // get the Ethereum Provider
    // const ethereumProvider = await detectEthereumProvider();
    const newProvider = await connector.getProvider();
    console.log("newProvider: ", newProvider);

    // initialize POS client
    await posClient.init({
      network: ethConfig[selectedEthNetwork]?.network, // 'testnet' or 'mainnet'
      version: ethConfig[selectedEthNetwork]?.version, // 'mumbai' or 'v1'
      parent: {
        provider: newProvider,
      },
      child: {
        provider: newProvider,
      },
    });

    // get the parent ERC20 token
    const parentERC20Token = posClient.erc20(parentERC20TokenAddress, true);

    // Function: depositFor(address user, address rootToken, bytes depositData) in rootChainManagerProxy
    const depositResult = await parentERC20Token.deposit(denomAmount, address, {
      from: address,
    });

    const txHash = await depositResult.getTransactionHash();

    response = txHash;
    // console.log("swr fetcher success: ", url);
  } catch (error) {
    console.error(`error: ${error.message}`);
    return { response: null, error: error };
  }

  // return the data
  return { response: response, error: null };
};

export const approveMaxDeposit = async (address, connector) => {
  console.log("inside approveMaxDeposit, address: ", address);
  let response;

  // use a try catch block for creating rich Error object
  try {
    // declare a new POS client
    const posClient = new POSClient();
    // get the Ethereum Provider
    // const ethereumProvider = await detectEthereumProvider();
    const newProvider = await connector.getProvider();

    // initialize POS client
    await posClient.init({
      network: ethConfig[selectedEthNetwork]?.network, // 'testnet' or 'mainnet'
      version: ethConfig[selectedEthNetwork]?.version, // 'mumbai' or 'v1'
      parent: {
        provider: newProvider,
      },
      child: {
        provider: newProvider,
      },
    });

    // get the parent ERC20 token
    const parentERC20Token = posClient.erc20(parentERC20TokenAddress, true);

    const approveResult = await parentERC20Token.approveMax({
      from: address,
    });

    const txHash = await approveResult.getTransactionHash();

    response = txHash;
    // console.log("swr fetcher success: ", url);
  } catch (error) {
    console.error(`error: ${error}`);
    return { response: null, error: error };
  }

  // return the data
  return { response: response, error: null };
};
