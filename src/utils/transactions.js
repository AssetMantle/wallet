import {DirectSecp256k1Wallet} from "@cosmjs/proto-signing";
import config from "../config.json";
import {Bip39, EnglishMnemonic, Slip10, Slip10Curve, stringToPath} from "@cosmjs/crypto";
import MakePersistence from "./cosmosjsWrapper";
import helper from "./helper";
import {Decimal} from "@cosmjs/math";
const bip39 = require("bip39");
const {SigningStargateClient} = require("@cosmjs/stargate");
const addressPrefix = config.addressPrefix;
const configChainID = process.env.REACT_APP_CHAIN_ID;
const configCoinType = config.coinType;
const tendermintRPCURL = process.env.REACT_APP_TENDERMINT_RPC_ENDPOINT;

//TODO take from config and env
async function Transaction(wallet, signerAddress, msgs, fee, memo = "") {
    const cosmJS = await SigningStargateClient.connectWithSigner(
        tendermintRPCURL,
        wallet
    );
    return await cosmJS.signAndBroadcast(signerAddress, msgs, fee, memo);
}

async function TransactionWithKeplr(msgs, fee, memo = "", chainID = configChainID) {
    const [wallet, address] = await KeplrWallet(chainID);
    return Transaction(wallet, address, msgs, fee, memo);
}

async function KeplrWallet(chainID = configChainID) {
    await window.keplr.enable(chainID);
    const offlineSigner = window.getOfflineSigner(chainID);
    const accounts = await offlineSigner.getAccounts();
    return [offlineSigner, accounts[0].address];
}

async function TransactionWithMnemonic(msgs, fee, memo, mnemonic, hdpath = makeHdPath(), bip39Passphrase = "", prefix = addressPrefix) {
    const [wallet, address] = await MnemonicWalletWithPassphrase(mnemonic, hdpath, bip39Passphrase, prefix);
    return Transaction(wallet, address, msgs, fee, memo);
}

// TODO remove this function; use MnemonicWallet instead.
async function MnemonicWalletWithPassphrase(mnemonic, hdPath = makeHdPath(), password = "", prefix = addressPrefix) {
    const mnemonicChecked = new EnglishMnemonic(mnemonic);
    const seed = await Bip39.mnemonicToSeed(mnemonicChecked, password);
    const {privkey} = Slip10.derivePath(Slip10Curve.Secp256k1, seed, hdPath);
    const wallet = await DirectSecp256k1Wallet.fromKey(privkey, prefix);
    const [firstAccount] = await wallet.getAccounts();
    return [wallet, firstAccount.address];
}

//TODO use this when bip39 passphrase is included in cosmjs.
// async function MnemonicWallet(mnemonic, hdPath = makeHdPath(), prefix = addressPrefix) {
//     const wallet = await DirectSecp256k1HdWallet.fromMnemonic(mnemonic, hdPath, prefix);
//     const [firstAccount] = await wallet.getAccounts();
//     return [wallet, firstAccount.address]
//
// }

function makeHdPath(accountNumber = "0", addressIndex = "0", coinType = configCoinType) {
    return stringToPath("m/44'/" + coinType + "'/" + accountNumber + "'/0/" + addressIndex);
}

function getAccountNumberAndSequence(authResponse) {
    if (authResponse.account["@type"] === "/cosmos.vesting.v1beta1.PeriodicVestingAccount") {
        return [authResponse.account.base_vesting_account.base_account.account_number, authResponse.account.base_vesting_account.base_account.sequence];
    } else if (authResponse.account["@type"] === "/cosmos.vesting.v1beta1.DelayedVestingAccount") {
        return [authResponse.account.base_vesting_account.base_account.account_number, authResponse.account.base_vesting_account.base_account.sequence];
    } else if (authResponse.account["@type"] === "/cosmos.vesting.v1beta1.ContinuousVestingAccount") {
        return [authResponse.account.base_vesting_account.base_account.account_number, authResponse.account.base_vesting_account.base_account.sequence];
    } else if (authResponse.account["@type"] === "/cosmos.auth.v1beta1.BaseAccount") {
        return [authResponse.account.account_number, authResponse.account.sequence];
    } else {
        return [-1, -1];
    }
}

function mnemonicTrim(mnemonic) {
    let mnemonicList = mnemonic.replace(/\s/g, " ").split(/\s/g);
    let mnemonicWords = [];
    for (let word of mnemonicList) {
        if (word === "") {
            console.log();
        } else {
            let trimmedWord = word.replace(/\s/g, "");
            mnemonicWords.push(trimmedWord);
        }
    }
    mnemonicWords = mnemonicWords.join(" ");
    return mnemonicWords;
}

function mnemonicValidation(memo) {
    const mnemonicWords = mnemonicTrim(memo);
    let validateMnemonic = bip39.validateMnemonic(mnemonicWords);
    return validateMnemonic;
}

function updateFee(address) {
    const persistence = MakePersistence(0, 0);
    if(localStorage.getItem('loginMode') === 'normal'){
        persistence.getAccounts(address).then(data => {
            if (data.code === undefined) {
                if (data.account["@type"] === "/cosmos.vesting.v1beta1.PeriodicVestingAccount" ||
                    data.account["@type"] === "/cosmos.vesting.v1beta1.DelayedVestingAccount" ||
                    data.account["@type"] === "/cosmos.vesting.v1beta1.ContinuousVestingAccount") {
                    localStorage.setItem('fee', config.vestingAccountFee);
                    localStorage.setItem('account', 'vesting');
                } else {
                    localStorage.setItem('fee', config.defaultFee);
                    localStorage.setItem('account', 'non-vesting');
                }
            } else {
                localStorage.setItem('fee', config.defaultFee);
                localStorage.setItem('account', 'non-vesting');
            }
        });
    }else {
        localStorage.setItem('fee', config.vestingAccountFee);
    }

}

function XprtConversion(data) {
    const Result = data/config.xprtValue;
    return Result;
}

function PrivateKeyReader(file, password, accountNumber, addressIndex, bip39Passphrase, loginAddress) {
    return new Promise(function (resolve, reject) {
        const fileReader = new FileReader();
        fileReader.readAsText(file, "UTF-8");
        fileReader.onload = event => {
            const res = JSON.parse(event.target.result);
            const decryptedData = helper.decryptStore(res, password);
            if (decryptedData.error != null) {
                reject(decryptedData.error);
            } else {
                const persistence = MakePersistence(accountNumber, addressIndex);
                let mnemonic = mnemonicTrim(decryptedData.mnemonic);
                const address = persistence.getAddress(mnemonic, bip39Passphrase, true);
                if(address === loginAddress){
                    resolve(mnemonic);
                    localStorage.setItem('encryptedMnemonic', event.target.result);
                }else {
                    reject("Your sign in address and keystore file don’t match. Please try again or else sign in again.");
                }
            }
        };
    });
}

function DecimalConversion(data){
    let value = Decimal.fromAtomics(data, 18).toString();
    return value;
}

export default {
    TransactionWithKeplr,
    TransactionWithMnemonic,
    makeHdPath,
    getAccountNumberAndSequence,
    mnemonicValidation,
    updateFee,
    XprtConversion,
    PrivateKeyReader,
    mnemonicTrim,
    DecimalConversion
};
