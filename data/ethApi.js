import { POSClient, use } from "@maticnetwork/maticjs";
import { Web3ClientPlugin } from "@maticnetwork/maticjs-web3";
import { getProvider } from "@wagmi/core";
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import useSWR from "swr";
import { configureChains, createClient, useAccount } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";
import { placeholderAvailableBalance } from "../config";

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
        //   erc721: "0x16F7EF3774c59264C46E5063b1111bCFd6e7A72f",
        //   erc1155: "0x2e3Ef7931F2d0e4a7da3dea950FF3F19269d9063",
        //   chainManagerAddress: "0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74", // Address of RootChainManager for POS Portal
      },
      child: {
        //   erc721: "0xbD88C3A7c0e242156a46Fbdf87141Aa6D0c0c649",
        erc20: "0x38a536a31ba4d8c1bcca016abbf786ecd25877e8",
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
  walletConnectProvider({ projectId: web3ModalProjectID }),
]);

console.log("walletconnect provider: ", provider);
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

// function to get the client for creating txns for Polygon POS
export const getPOSClient = async (
  provider,
  network = "mainnet",
  version = "v1"
) => {
  // declare a new POS client
  const posClient = new POSClient();

  // initialize POS client
  return await posClient.init({
    network, // 'testnet' or 'mainnet'
    version, // 'mumbai' or 'v1'
    parent: {
      provider: provider,
    },
    child: {
      provider: provider,
    },
  });
};

export const getPOSClientMainnet = async (provider) => {
  return await getPOSClient(provider, "mainnet", "v1");
};

export const getPOSClientTestnet = async (provider) => {
  return await getPOSClient(provider, "testnet", "mumbai");
};

export const parentERC20TokenAddress =
  ethConfig[selectedEthNetwork]?.token?.parent.erc20;
export const childERC20TokenAddress =
  ethConfig[selectedEthNetwork]?.token?.child.erc20;

// QUERY API
// swr hook to query the MNTL Token Balance in Eth Chain
export const useMntlEthBalance = () => {
  // get the address from connected web3Modal
  const { address } = useAccount();
  // const ethAddress = isConnected ? address : placeholderAddressEth;

  // fetcher function for useSwr of useMntlEthBalance()
  const fetchMntlEthBalance = async (url, address) => {
    console.log("inside fetchMntlEthBalance, address: ", address);
    let balanceValue;
    const wagmiProvider = getProvider();
    // console.log("wagmiProvider: ", wagmiProvider);

    // use a try catch block for creating rich Error object
    try {
      // declare a new POS client
      const posClient = new POSClient();

      // initialize POS client
      await posClient.init({
        network: ethConfig[selectedEthNetwork]?.network, // 'testnet' or 'mainnet'
        version: ethConfig[selectedEthNetwork]?.version, // 'mumbai' or 'v1'
        parent: {
          provider: wagmiProvider,
        },
        child: {
          provider: wagmiProvider,
        },
      });

      // get the parent ERC20 token
      const parentERC20Token = posClient.erc20(parentERC20TokenAddress, true);

      // get balance of user
      // const balance = "123";
      // const balance = await parentERC20Token.getBalance(address);

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

// TRANSACTION API
// txn to deposit eth token to polygon POS
export const depositEthToken = async (depositAmount, fromAddress) => {
  const erc20Token = posClient.erc20(parentERC20TokenAddress, true);

  const result = await erc20Token.deposit(depositAmount, fromAddress, {
    fromAddress,
    gasLimit: 300000,
    gasPrice: 50000000000,
    // maxPriorityFeePerGas: 6000000000,
  });

  const txHash = await result.getTransactionHash();
  console.log("txHash", txHash);
  const receipt = await result.getReceipt();
  console.log("receipt", receipt);
};
