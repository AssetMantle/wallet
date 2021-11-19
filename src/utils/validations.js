import transactions from "./transactions";
import config from "../config";

const accountType = localStorage.getItem('account');

export const ValidateSendAmount = (amount, value) => {
    if ((amount*1) < value) {
        return new Error('Insufficient wallet balance');
    }
    return new Error('');
};

export const ValidateFee = (transferableAmount, feeValue,  type, amount) => {
    const amountTxns = (
        type === "withdrawMultiple" || type === "withdrawAddress" || type === "withdrawValidatorRewards" || type === "redelegate" || type === "unbond"
    );

    const vestingDelegationCheck = (
        accountType === "vesting" && type === "delegate"
    );

    if (amountTxns || vestingDelegationCheck) {
        if (transferableAmount < transactions.XprtConversion(feeValue)) {
            return new Error('Insufficient wallet balance to process the transaction.');
        }
        return new Error('');
    } else {
        console.log(transferableAmount,amount, transactions.XprtConversion(feeValue)," oin validate");

        if ((transferableAmount - (amount * 1)) < transactions.XprtConversion(feeValue)) {
            console.log(" in validate");
            return new Error('Insufficient wallet balance to process the transaction.');
        }
        return new Error('');
    }
};

export const ValidateGas = (value) => {
    console.log("error in gas");
    if ((value * 1) < config.minGas || (value * 1) > config.maxGas) {
        return new Error('Enter Gas between 80000 to 2000000');
    }
    return new Error('');
};

export const passwordValidation = (data) => {
    const regex = /^\S{3}\S+$/;
    if(!regex.test(data)){
        return new Error('Password must be greater than 3 letters and no spaces allowed');
    }
    return new Error('');
};

export const ValidateSpecialCharacters = e => {
    const key = e.key.toUpperCase();
    if (key === "e" || key === "-" || key === "+") {
        e.preventDefault();
    }
};
export const ValidateAccountIndex = (value) => {
    if (parseInt(value) > 4294967295 || parseInt(value) < 0) {
        return new Error('Limit exceeded');
    }
    return new Error('');
};

export const ValidateBip39PassPhrase = (value) => {
    if (parseInt(value) > 50) {
        return new Error(' "Length should be below 50 characters",');
    }
    return new Error('');
};