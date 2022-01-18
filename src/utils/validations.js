import transactions from "./transactions";
import config from "../config";
import {ACCOUNT} from "../constants/localStorage";
import {mnemonicTrim, stringToNumber} from "./scripts";

const bip39 = require("bip39");
const accountType = localStorage.getItem(ACCOUNT);

export const ValidateSendAmount = (amount, value) => {
    if (stringToNumber(amount ) < value) {
        return new Error('Insufficient wallet balance');
    }
    return new Error('');
};

export const ValidateFee = (transferableAmount, feeValue, type, amount) => {
    const amountTxns = (
        type === "withdrawMultiple" || type === "withdrawAddress" || type === "withdrawValidatorRewards" || type === "redelegate" || type === "unbond"
    );

    const vestingDelegationCheck = (
        accountType === "vesting" && type === "delegate"
    );

    if (amountTxns || vestingDelegationCheck) {
        if (transferableAmount < transactions.TokenValueConversion(feeValue)) {
            return new Error('Insufficient wallet balance to process the transaction.');
        }
        return new Error('');
    } else {
        if ((transferableAmount - (stringToNumber(amount))) < transactions.TokenValueConversion(feeValue)) {
            return new Error('Insufficient wallet balance to process the transaction.');
        }
        return new Error('');
    }
};

export const ValidateGas = (value) => {
    if (stringToNumber(value) < config.minGas || (stringToNumber(value)) > config.maxGas) {
        return new Error('Enter Gas between 80000 to 2000000');
    }
    return new Error('');
};

export const PasswordValidation = (data) => {
    const regex = /^\S{3}\S+$/;
    if (/\s/g.test(data)) {
        return new Error('Spaces not allowed');
    } else if (!regex.test(data)) {
        return new Error('Password must be greater than 3 letters');
    }
    return new Error('');
};

export const ValidateAlphaNumeric = e => {
    const regEx = /^[a-z0-9A-Z]+$/;
    if (!regEx.test(e.key)) {
        e.preventDefault();
    }
};

export const ValidateString = e => {
    const regEx = /^[a-z]+$/;
    if (!regEx.test(e.key)) {
        e.preventDefault();
    }
};


export const ValidateSpecialCharacters = e => {
    const key = e.key.toLowerCase();
    if (key === "e" || key === "-" || key === "+") {
        e.preventDefault();
    }
};
export const ValidateAccountIndex = (value) => {
    if (parseInt(value) > 2147483647 || parseInt(value) < 0) {
        return new Error('Limit exceeded');
    }
    return new Error('');
};

export const ValidateBip39PassPhrase = (value) => {
    if (parseInt(value) > 50) {
        return new Error('Length should be below 50 characters');
    }
    return new Error('');
};

export const ValidationFileTypeCheck = (filePath) => {
    let allowedExtensions =
        /(\.json)$/i;
    if (!allowedExtensions.exec(filePath)) {
        return new Error("File type not supported");
    }
    return new Error('');
};

export const ValidateSpace = (e) => {
    if (e.key === " ") {
        e.preventDefault();
    }
};

export const ValidateMultipleValidatorsClaim = (evt) => {
    if (evt.length > 3) {
        return new Error("Warning:  Recommend 3 or fewer validators to avoid potential issues.");
    }
    return new Error('');
};

export const ValidateReDelegateAmount = (delegationAmount, amount) => {
    if (stringToNumber(delegationAmount) < amount) {
        return new Error('Insufficient Delegated Amount');
    }
    return new Error('');
};

export const ValidateMnemonic = (mnemonic) => {
    const mnemonicWords = mnemonicTrim(mnemonic);
    let validateMnemonic = bip39.validateMnemonic(mnemonicWords);
    if (!validateMnemonic) {
        return new Error('Invalid mnemonic.');
    }
    return new Error('');
};

export const ValidateMemo = (value) => {
    let mnemonicWords = mnemonicTrim(value);
    let validateMnemonic = bip39.validateMnemonic(mnemonicWords);
    if (validateMnemonic) {
        return new Error('Entered secret passphrase(mnemonic) in memo field.');
    }
    return new Error('');
};

export const ValidateAlphaNumericSpaces = e => {
    const regEx = /^[a-z0-9A-Z ]+$/;
    if (!regEx.test(e.key)) {
        e.preventDefault();
    }
};

export const ValidateStringSpaces = e => {
    const regEx = /^[a-z ]+$/;
    if (!regEx.test(e.key)) {
        e.preventDefault();
    }
};

export const validateAddress = (address, prefix = "persistence") => {
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
};