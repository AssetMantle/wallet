import cosmosjs from "@cosmostation/cosmosjs";
import config from "../utils/config";
const bip39 = require('bip39');
const bip32 = require('bip32');
const bech32 = require('bech32');
const bitcoinjs = require('bitcoinjs-lib');
const apiUrl = process.env.REACT_APP_API_KEY;
const chainID = config.chainID;
const prefix = config.addressPrefix;

function MakePersistence(accountNumber, addressIndex) {

    const Persistence = cosmosjs.network(apiUrl, chainID)
    Persistence.setBech32MainPrefix("persistence");
    Persistence.setBech32MainPrefix(prefix);
    Persistence.setPath("m/44'/750'/" + accountNumber + "'/0/"+ addressIndex);
    Persistence.getAddress = function(mnemonic, bip39passphrase = "", checkSum = true) {
        if (typeof mnemonic !== "string") {
            const data = {
                error:"mnemonic expects a string"
            };
            return  data;
        }
        if (checkSum) {
            if (!bip39.validateMnemonic(mnemonic)){
                const data = {
                    error:"mnemonic phrases have invalid checksums"
                };
                return  data;
            }
        }
        const seed = bip39.mnemonicToSeedSync(mnemonic, bip39passphrase);
        const node = bip32.fromSeed(seed);
        const child = node.derivePath(this.path);
        const words = bech32.toWords(child.identifier);
        return bech32.encode(this.bech32MainPrefix, words);
    };
    Persistence.getECPairPriv = function(mnemonic, bip39passphrase = "") {
        if (typeof mnemonic !== "string") {
            const data = {
                error:"mnemonic expects a string"
            };
            return  data;
        }
        const seed = bip39.mnemonicToSeedSync(mnemonic, bip39passphrase);
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