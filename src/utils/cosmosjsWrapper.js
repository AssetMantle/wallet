import cosmosjs from "@cosmostation/cosmosjs";
const bip39 = require('bip39');
const bip32 = require('bip32');
const bech32 = require('bech32');
const bitcoinjs = require('bitcoinjs-lib');

const apiUrl = "http://128.199.29.15:1317";
const chainID = "test-core-1"

function MakePersistence(accountNumber, addressIndex) {

    const Persistence = cosmosjs.network(apiUrl, chainID)
    Persistence.setBech32MainPrefix("persistence");
    Persistence.setPath("m/44'/750'/" + accountNumber + "'/0/"+ addressIndex);
    Persistence.getAddress = function(mnemonic, bip39passphrase = "", checkSum = true) {
        if (typeof mnemonic !== "string") {
            throw new Error("mnemonic expects a string")
        }
        if (checkSum) {
            if (!bip39.validateMnemonic(mnemonic)) throw new Error("mnemonic phrases have invalid checksums");
        }
        const seed = bip39.mnemonicToSeed(mnemonic, bip39passphrase);
        const node = bip32.fromSeed(seed);
        const child = node.derivePath(this.path);
        const words = bech32.toWords(child.identifier);
        return bech32.encode(this.bech32MainPrefix, words);
    };
    Persistence.getECPairPriv = function(mnemonic, bip39passphrase = "") {
        if (typeof mnemonic !== "string") {
            throw new Error("mnemonic expects a string")
        }
        const seed = bip39.mnemonicToSeed(mnemonic, bip39passphrase);
        const node = bip32.fromSeed(seed);
        const child = node.derivePath(this.path);
        const ecpair = bitcoinjs.ECPair.fromPrivateKey(child.privateKey, {compressed : false})
        return ecpair.privateKey;
    }

    Persistence.getAccounts = function (address) {
        let accountsApi = "/cosmos/auth/v1beta1/accounts/";
        return fetch(this.url + accountsApi + address)
            .then(response => response.json())

    }
    return Persistence
}

export default MakePersistence