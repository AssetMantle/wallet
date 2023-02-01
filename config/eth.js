import { POSClient, use } from "@maticnetwork/maticjs";
import { Web3ClientPlugin } from "@maticnetwork/maticjs-web3";
import detectEthereumProvider from "@metamask/detect-provider";

use(Web3ClientPlugin);

export const selectedEthNetwork = "mainnet";

export const ethConfig = {
  mainnet: {
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
        erc20: "0x655f2166b0709cd575202630952d71e2bb0d61af",
        //   erc721: "0x16F7EF3774c59264C46E5063b1111bCFd6e7A72f",
        //   erc1155: "0x2e3Ef7931F2d0e4a7da3dea950FF3F19269d9063",
        //   chainManagerAddress: "0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74", // Address of RootChainManager for POS Portal
      },
      child: {
        //   erc721: "0xbD88C3A7c0e242156a46Fbdf87141Aa6D0c0c649",
        erc20: "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1",
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
        erc20: "0x655f2166b0709cd575202630952d71e2bb0d61af", // CHANGE THIS TO TESTNET
        //   erc721: "0x16F7EF3774c59264C46E5063b1111bCFd6e7A72f",
        //   erc1155: "0x2e3Ef7931F2d0e4a7da3dea950FF3F19269d9063",
        //   chainManagerAddress: "0xBbD7cBFA79faee899Eaf900F13C9065bF03B1A74", // Address of RootChainManager for POS Portal
      },
      child: {
        //   erc721: "0xbD88C3A7c0e242156a46Fbdf87141Aa6D0c0c649",
        erc20: "0xfe4F5145f6e09952a5ba9e956ED0C25e3Fa4c7F1", // CHANGE THIS TO TESTNET
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

const getPOSClient = async (network = "testnet", version = "mumbai") => {
  const posClient = new POSClient();
  const metamaskWeb3Provider = await detectEthereumProvider();

  return posClient.init({
    log: true,
    network: network,
    version: version,
    child: {
      provider: metamaskWeb3Provider,
    },
    parent: {
      provider: metamaskWeb3Provider,
    },
  });
};

export const getPOSClientMainnet = async () => {
  return await getPOSClient("mainnet", "v1");
};

export const getPOSClientTestnet = async () => {
  return await getPOSClient("testnet", "mumbai");
};
