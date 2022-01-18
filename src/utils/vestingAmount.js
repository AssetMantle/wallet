import * as Sentry from "@sentry/browser";
import {getAccount, tokenValueConversion} from "./helper";

const config = require('../config');

const periodicVesting = "/cosmos.vesting.v1beta1.PeriodicVestingAccount";
const baseAccount = "/cosmos.auth.v1beta1.BaseAccount";
const delayedVesting = "/cosmos.vesting.v1beta1.DelayedVestingAccount";
const continuousVesting = "/cosmos.vesting.v1beta1.ContinuousVestingAccount";

function getUTOKEN_Balance(amountList) {
    let balance = 0;
    for (let i = 0; i < amountList.length; i++) {
        if (amountList[i].denom === config.coinDenom) {
            balance = parseInt(amountList[i].amount);
            break;
        }
    }
    return balance;
}

function getPeriodicVestingAmount(account, currentEpochTime) {
    let accountVestingAmount = getUTOKEN_Balance(account.accountData.baseVestingAccount.originalVesting);
    let freeBalance = 0;
    const endTime = parseInt(account.accountData.baseVestingAccount.endTime);
    if (endTime >= currentEpochTime) {
        let vestingTimes = parseInt(account.accountData.startTime);
        for (let i = 0; i < account.accountData.vestingPeriods.length; i++) {
            let length = parseInt(account.accountData.vestingPeriods[i]["length"]);
            vestingTimes = vestingTimes + length;
            if (currentEpochTime >= vestingTimes) {
                freeBalance = freeBalance + getUTOKEN_Balance(account.accountData.vestingPeriods[i].amount);
            }
        }
    } else {
        accountVestingAmount = 0;
    }
    accountVestingAmount = accountVestingAmount - freeBalance;
    return accountVestingAmount;
}

function getDelayedVestingAmount(account, currentEpochTime) {
    const endTime = parseInt(account.accountData.baseVestingAccount.endTime);
    if (endTime >= currentEpochTime) {
        return getUTOKEN_Balance(account.accountData.baseVestingAccount.originalVesting);
    } else {
        return 0;
    }
}

function getContinuousVestingAmount(account, currentEpochTime) {
    const endTime = parseInt(account.accountData.baseVestingAccount.endTime);
    const startTime = parseInt(account.accountData.startTime);
    if (endTime >= currentEpochTime) {
        let originalVestingAmount = getUTOKEN_Balance(account.accountData.baseVestingAccount.originalVesting);
        return (originalVestingAmount * (endTime - currentEpochTime)) / (endTime - startTime);
    } else {
        return 0;
    }
}

function getAccountVestingAmount(account, currentEpochTime) {
    let accountVestingAmount = 0;
    switch (account.typeUrl) {
    case periodicVesting:
        accountVestingAmount = getPeriodicVestingAmount(account, currentEpochTime);
        break;
    case delayedVesting:
        accountVestingAmount = getDelayedVestingAmount(account, currentEpochTime);
        break;
    case continuousVesting:
        accountVestingAmount = getContinuousVestingAmount(account, currentEpochTime);
        break;
    case baseAccount:
        accountVestingAmount = 0;
        break;
    default:
    }
    return accountVestingAmount;
}

async function getTransferableVestingAmount(address, balance) {

    const currentEpochTime = Math.floor(new Date().getTime() / 1000);
    let vestingAmount = 0;
    let transferableAmount = 0;

    getAccount(address)
        .then(res => {
            const amount = tokenValueConversion(getAccountVestingAmount(res, currentEpochTime));
            vestingAmount = amount;
            if ((balance - amount) < 0) {
                transferableAmount = 0;
            } else {
                transferableAmount = balance - amount;
            }
            return [vestingAmount, transferableAmount];
        })
        .catch(error => {
            Sentry.captureException(error.response
                ? error.response.data.message
                : error.message);
            console.log(error.message);
        });

}

export default {getTransferableVestingAmount, getAccountVestingAmount};
