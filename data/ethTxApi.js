import { POSClient, use } from "@maticnetwork/maticjs";
import { Web3ClientPlugin } from "@maticnetwork/maticjs-web3";
import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from "@web3modal/ethereum";
import { configureChains, createClient } from "wagmi";
import { mainnet, polygon } from "wagmi/chains";

// SETUP WEB3MODAL & WAGMI

// create the provider & wagmi client & ethereum client
const chains = [mainnet, polygon];

const { provider } = configureChains(chains, [
  walletConnectProvider({ projectId: "95284efe95ac1c5b14c4c3d5f0c5c60e" }),
]);

export const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: "web3Modal", chains }),
  provider,
});

export const ethereumClient = new EthereumClient(wagmiClient, chains);

// MATICJS INTEGRATION
// get a POSClient by injecting the wagmi provider
use(Web3ClientPlugin);

export const depositEthToken = async (depositAmount, fromAddress) => {
  const client = await getPOSClientMainnet();
  const erc20Token = client.erc20(pos.parent.erc20, true);

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

export const getPOSClient = (network = "mainnet", version = "v1") => {
  // declare a new POS client
  const posClient = new POSClient();

  // initialize POS client
  return posClient.init({
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
