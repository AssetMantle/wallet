import {DirectSecp256k1HdWallet} from "@cosmjs/proto-signing";
import config from "./config.json";
import {stringToPath} from "@cosmjs/crypto";

const {SigningStargateClient} = require("@cosmjs/stargate");
const addressPrefix = config.addressPrefix;
const configChainID = config.chainID;
const configCoinType = config.coinType;
const tendermintRPCURL = process.env.REACT_APP_TENDERMINT_RPC_ENDPOINT;

//TODO take from config and env
async function Transaction(wallet, signerAddress, msgs, fee, memo = "") {
    const cosmJS = await SigningStargateClient.connectWithSigner(
        tendermintRPCURL,
        wallet
    );
    return await cosmJS.signAndBroadcast(signerAddress, msgs, fee, memo)
}

async function TransactionWithKeplr(msgs, fee, memo = "", chainID = configChainID) {
    const {wallet, address} = KeplrWallet(chainID)
    return Transaction(wallet, address, msgs, fee, memo)
}

async function KeplrWallet(chainID = configChainID) {
    await window.keplr.enable(chainID);
    const offlineSigner = window.getOfflineSigner(chainID);
    const accounts = await offlineSigner.getAccounts();
    return [offlineSigner, accounts]
}

async function TransactionWithMnemonic(msgs, fee, memo, mnemonic, hdpath = makeHdPath(), prefix = addressPrefix) {
    const {wallet, address} = MnemonicWallet(mnemonic,hdpath, prefix)
    return Transaction(wallet, address, msgs, fee, memo)
}

async function MnemonicWallet(mnemonic, hdpath, prefix = addressPrefix) {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, hdpath, prefix);
    const [firstAccount] = await wallet.getAccounts();
    return [wallet, firstAccount.address]

}

function makeHdPath(accountNumber = "0", addressIndex = "0", coinType = configCoinType) {
    return stringToPath("m/44'/" + coinType + "'/" + accountNumber + "'/0/" + addressIndex)
}

export default Transaction;
