import {DirectSecp256k1HdWallet, DirectSecp256k1Wallet} from "@cosmjs/proto-signing";
import config from "./config.json";
import {Bip39, EnglishMnemonic, Slip10, Slip10Curve, stringToPath} from "@cosmjs/crypto";

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
    const [wallet, address] = await KeplrWallet(chainID)
    return Transaction(wallet, address, msgs, fee, memo)
}

async function KeplrWallet(chainID = configChainID) {
    await window.keplr.enable(chainID);
    const offlineSigner = window.getOfflineSigner(chainID);
    const accounts = await offlineSigner.getAccounts();
    return [offlineSigner, accounts[0].address]
}

async function TransactionWithMnemonic(msgs, fee, memo, mnemonic, hdpath = makeHdPath(), bip39Passphrase = "", prefix = addressPrefix) {
    const [wallet, address] = await MnemonicWalletWithPassphrase(mnemonic, hdpath, bip39Passphrase, prefix)
    return Transaction(wallet, address, msgs, fee, memo)
}

// TODO remove this function; use MnemonicWallet instead.
async function MnemonicWalletWithPassphrase(mnemonic, hdPath = makeHdPath(), password = "", prefix = addressPrefix) {
    const mnemonicChecked = new EnglishMnemonic(mnemonic);
    const seed = await Bip39.mnemonicToSeed(mnemonicChecked, password);
    const {privkey} = Slip10.derivePath(Slip10Curve.Secp256k1, seed, hdPath);
    const wallet = await DirectSecp256k1Wallet.fromKey(privkey, prefix)
    const [firstAccount] = await wallet.getAccounts();
    return [wallet, firstAccount.address]
}

//TODO use this when bip39 passphrase is included in cosmjs.
async function MnemonicWallet(mnemonic, hdPath = makeHdPath(), prefix = addressPrefix) {
    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, hdPath, prefix);
    const [firstAccount] = await wallet.getAccounts();
    return [wallet, firstAccount.address]

}

function makeHdPath(accountNumber = "0", addressIndex = "0", coinType = configCoinType) {
    return stringToPath("m/44'/" + coinType + "'/" + accountNumber + "'/0/" + addressIndex)
}

export default {TransactionWithKeplr, TransactionWithMnemonic, makeHdPath};
