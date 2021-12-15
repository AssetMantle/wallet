import {Decimal} from "@cosmjs/math";
import transactions from "./transactions";
import config from "../config";

const encoding = require("@cosmjs/encoding");
const bip39 = require("bip39");
const crypto = require("crypto");
const passwordHashAlgorithm = "sha512";
const NODE_CONF = process.env.REACT_APP_IBC_CONFIG;

function randomNum(min, max) {
    let randomNumbers = [];
    for (var i = 0; i < 3; i++) {
        var random_number = Math.floor(Math.random() * (max - min) + min);
        if (randomNumbers.indexOf(random_number) == -1) {
            randomNumbers.push(random_number);
        }

    }
    return randomNumbers;
}

function stringTruncate(str) {
    if (str.length > 30) {
        return str.substr(0, 10) + '...' + str.substr(str.length - 10, str.length);
    }
    return str;
}

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

function validateFrom(value) {
    if (value.length === 0) {
        return new Error('Length must be greater than 0');
    }
    return new Error('');
}

function checkLastPage(pageNumber, limit, totalTransactions) {
    return totalTransactions / limit <= pageNumber;
}

function validatePassphrase(value) {
    return value.length === 50;
}

function fileTypeCheck(filePath) {
    let allowedExtensions =
        /(\.json)$/i;
    return allowedExtensions.exec(filePath);
}

function validateAddress(address, prefix = "persistence") {
    if (prefix === "cosmos") {
        if (!address.startsWith(prefix) || address.length !== 45) {
            return new Error('Invalid Recipient Address');
        }
    } else if (prefix === "osmosis") {
        if (!address.startsWith("osmo") || address.length !== 43) {
            return new Error('Invalid Recipient Address');
        }
    } else {
        if (!address.startsWith(prefix) || address.length !== 50) {
            return new Error('Invalid Recipient Address');
        }
    }
    return new Error('');
}


function accountChangeCheck(errorMessage) {
    if (errorMessage === 'Unsupported type: \'/cosmos.vesting.v1beta1.ContinuousVestingAccount\'' ||
        errorMessage === 'Unsupported type: \'/cosmos.vesting.v1beta1.DelayedVestingAccount\'' ||
        errorMessage === 'Unsupported type: \'/cosmos.vesting.v1beta1.PeriodicVestingAccount\'' ||
        errorMessage.startsWith("pubKey does not match signer address")) {
        alert("Account address changed please login again");
        localStorage.setItem('loginToken', '');
        localStorage.setItem('address', '');
        localStorage.setItem('loginMode', '');
        localStorage.setItem('fee', '');
        localStorage.setItem('keplerAddress', '');
        window.location.reload();
    }
}

function decimalConversion(data) {
    let value = Decimal.fromAtomics(data, 18).toString();
    return value;
}

function denomChange(denom) {
    if (denom === config.coinDenom) {
        return "XPRT";
    } else if (denom === "uatom") {
        return "ATOM";
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

function ValidateAmount(value) {
    if (value === 0) {
        return new Error('Value must be greater than 0');
    }
    return new Error('');
}

function inputSpaceValidation(e) {
    if (e.key === " ") {
        e.preventDefault();
    }
}

function inputAmountValidation(e) {
    if (e.key === "e" || e.key === "-" || e.key === "+") {
        e.preventDefault();
    }
}

function stringValidation(evt) {
    const regEx = /^[a-z ]*$/;
    if (regEx.test(evt.target.value)) {
        return true;
    } else {
        evt.preventDefault();
    }

}

function trimWhiteSpaces(data) {
    return data.split(' ').join('');
}


function isBech32Address(address, prefix) {
    try {
        let decodedAddress = encoding.Bech32.decode(address);
        return decodedAddress.prefix === prefix;
    } catch (e) {
        return false;
    }
}

function passwordValidation(data) {
    const regex = /^\S{3}\S+$/;
    return regex.test(data);
}

function denomModify(amount) {
    if (Array.isArray(amount)) {
        if (amount.length) {
            if (amount[0].denom === config.coinDenom) {
                return [transactions.XprtConversion(amount[0].amount), "XPRT"];
            } else {
                return [amount[0].amount, amount[0].denom];
            }
        } else {
            return '';
        }
    } else {
        if (amount.denom === config.coinDenom) {
            return [transactions.XprtConversion(amount.amount), "XPRT"];
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

function sixDigitsNumber(value, length = 6) {
    let inputValue = value.toString();
    if (inputValue.length >= length) {
        return inputValue.substr(0, 6);
    } else {
        const stringLength = length - inputValue.length;
        let newString = inputValue;
        for (let i = 0; i < stringLength; i++) {
            newString += "0";
        }
        return newString;
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


const emptyFunc = () => ({});

export default {
    randomNum,
    stringTruncate,
    createStore,
    decryptStore,
    isActive,
    validateFrom,
    validatePassphrase,
    checkLastPage,
    validateAddress,
    accountChangeCheck,
    decimalConversion,
    denomChange,
    mnemonicTrim,
    mnemonicValidation,
    ValidateAmount,
    inputSpaceValidation,
    inputAmountValidation,
    trimWhiteSpaces,
    fileTypeCheck,
    isBech32Address,
    passwordValidation,
    getTransactionAmount,
    sixDigitsNumber,
    stringValidation,
    emptyFunc,
    foundationNodeCheck,
    getAccountNumber
};
