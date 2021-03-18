const bip39 = require("bip39");
const bip32 = require("bip32");
const tmSig = require("@tendermint/sig");

const coinType = 750
const defaultWalletPath = "m/44'/" + coinType + "'/0'/0/0"
const prefix = "persistence"

// This function is not for use. Use only createRandomWallet, createWallet and getWalletPath
function getWallet(mnemonic, walletPath, bip39Passphrase = "") {
    try {
        const seed = bip39.mnemonicToSeedSync(mnemonic, bip39Passphrase);
        const masterKey = bip32.fromSeed(seed);
        const walletInfo = tmSig.createWalletFromMasterKey(masterKey, prefix, walletPath);
        return {
            success: true,
            address: walletInfo.address,
            mnemonic: mnemonic,
            walletPath: walletPath
        };
    } catch (e) {
        return {
            success: false,
            error: e.message
        }
    }
}

function createRandomWallet(walletPath = defaultWalletPath, bip39Passphrase = "") {
    return getWallet(bip39.generateMnemonic(256), walletPath, bip39Passphrase);
}

function createWallet(mnemonic, walletPath = defaultWalletPath, bip39Passphrase = "") {
    let validateMnemonic = bip39.validateMnemonic(mnemonic);
    if (validateMnemonic) {
        return getWallet(mnemonic, walletPath, bip39Passphrase);
    } else {
        return {
            success: false,
            error: "Invalid mnemonic."
        }
    }
}

// account: Account number for HD derivation
// addressIndex: Address index number for HD derivation
function getWalletPath(account = 0, addressIndex = 0) {
    return "m/44'/" + coinType + "'/" + account + "'/0/" + addressIndex
}

module.exports = {
    createWallet,
    createRandomWallet,
    defaultWalletPath,
    getWalletPath,
    prefix
}
