import transactions from "./transactions";
import config from "../config";
import {COIN_ATOM, COIN_ATOM_DENOM} from "../constants/keyWords";
import {ADDRESS, FEE, KEPLR_ADDRESS, LOGIN_MODE, LOGIN_TOKEN} from "../constants/localStorage";

const crypto = require("crypto");
const passwordHashAlgorithm = "sha512";
const NODE_CONF = process.env.REACT_APP_IBC_CONFIG;


function createStore(mnemonic, password) {
    try {
        const key = crypto.randomBytes(32);
        const iv = crypto.randomBytes(16);
        let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
        let encrypted = cipher.update(mnemonic);
        encrypted = Buffer.concat([encrypted, cipher.final()]);

        let obj = {
            "hashpwd": crypto.createHash(passwordHashAlgorithm).update(password).digest("hex"),
            "iv": iv.toString("hex"),
            "salt": key.toString("hex"),
            "crypted": encrypted.toString("hex")
        };
        return {
            Response: obj
        };
    } catch (exception) {
        return {
            success: false,
            error: exception.message
        };
    }
}

function decryptStore(fileData, password) {
    let hashpwd = fileData.hashpwd;
    let iv = fileData.iv;
    let salt = fileData.salt;
    let crypted = fileData.crypted;

    if (hashpwd === crypto.createHash(passwordHashAlgorithm).update(password).digest("hex")) {
        let ivText = Buffer.from(iv, "hex");
        let encryptedText = Buffer.from(crypted, "hex");

        let decipher = crypto.createDecipheriv(
            "aes-256-cbc",
            Buffer.from(salt, "hex"),
            ivText
        );
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return {
            mnemonic: decrypted.toString(),
        };
    } else {
        return {
            error: "Incorrect password."
        };
    }
}

function isActive(item) {
    return item.jailed === false && item.status === 3;
}

function checkLastPage(pageNumber, limit, totalTransactions) {
    return totalTransactions / limit <= pageNumber;
}

function accountChangeCheck(errorMessage) {
    if (errorMessage === 'Unsupported type: \'/cosmos.vesting.v1beta1.ContinuousVestingAccount\'' ||
        errorMessage === 'Unsupported type: \'/cosmos.vesting.v1beta1.DelayedVestingAccount\'' ||
        errorMessage === 'Unsupported type: \'/cosmos.vesting.v1beta1.PeriodicVestingAccount\'' ||
        errorMessage.startsWith("pubKey does not match signer address")) {
        alert("Account address changed please login again");
        localStorage.setItem(LOGIN_TOKEN, '');
        localStorage.setItem(ADDRESS, '');
        localStorage.setItem(LOGIN_MODE, '');
        localStorage.setItem(FEE, '');
        localStorage.setItem(KEPLR_ADDRESS, '');
        window.location.reload();
    }
}

function denomChange(denom) {
    switch (denom) {
    case config.coinDenom:
        return config.coinName;
    case COIN_ATOM_DENOM:
        return COIN_ATOM;
    default:
        return null;
    }
}


function denomModify(amount) {
    if (Array.isArray(amount)) {
        if (amount.length) {
            if (amount[0].denom === config.coinDenom) {
                return [transactions.TokenValueConversion(amount[0].amount), config.coinName];
            } else {
                return [amount[0].amount, amount[0].denom];
            }
        } else {
            return '';
        }
    } else {
        if (amount.denom === config.coinDenom) {
            return [transactions.TokenValueConversion(amount.amount), config.coinName];
        } else {
            return [amount.amount, amount.denom];
        }
    }
}

function getTransactionAmount(data) {
    if (data.amount !== undefined || data.token !== undefined || data.value !== undefined) {
        if (data.amount !== undefined) {
            return denomModify(data.amount);
        } else if (data.token !== undefined) {
            return denomModify(data.token);
        } else {
            return denomModify(data.value);
        }
    }
}


function foundationNodeCheck(validatorAddress) {
    if (NODE_CONF === "ibcStaging.json") {
        if (config.testNetFoundationNodes.includes(validatorAddress)) {
            return true;
        } else {
            return false;
        }
    } else {
        if (config.mainNetFoundationNodes.includes(validatorAddress)) {
            return true;
        } else {
            return false;
        }
    }
}

function getAccountNumber(value) {
    return value === '' ? '0' : value;
}

export default {
    createStore,
    decryptStore,
    isActive,
    checkLastPage,
    accountChangeCheck,
    denomChange,
    getTransactionAmount,
    foundationNodeCheck,
    getAccountNumber,
};
