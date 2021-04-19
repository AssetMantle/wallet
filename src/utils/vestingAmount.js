import MakePersistence from "./cosmosjsWrapper";

const config = require('../config');

const periodicVesting = "/cosmos.vesting.v1beta1.PeriodicVestingAccount"
const baseAccount = "/cosmos.auth.v1beta1.BaseAccount"
const delayedVesting = "/cosmos.vesting.v1beta1.DelayedVestingAccount"
const continuousVesting = "/cosmos.vesting.v1beta1.ContinuousVestingAccount"

// takes input of authAccount.
/*
* Usage :
* const currentEpochTime = Math.floor(new Date().getTime() / 1000)
* const persistence = MakePersistence(0,0)
* const accountsResponse = persistence.getAccounts(inputAddress);
* const vestingAmount = getAccountVestingAmount(accountsResponse.account, currentEpochTime)
*/
function getAuthAccountAddress(account) {
    if (account["@type"] !== baseAccount) {
        return account.address;
    } else {
        return account.base_vesting_account.base_account.address;
    }
}

function getUXPRT_Balance(amountList) {
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
    let accountVestingAmount = getUXPRT_Balance(account.base_vesting_account.original_vesting);
    let freeBalance = 0;
    const endTime = parseInt(account.base_vesting_account.end_time);
    if (endTime >= currentEpochTime) {
        let vestingTimes = parseInt(account.start_time);
        for (let i = 0; i < account.vesting_periods.length; i++) {
            let length = parseInt(account.vesting_periods[i]["length"]);
            vestingTimes = vestingTimes + length;
            if (currentEpochTime >= vestingTimes) {
                freeBalance = freeBalance + getUXPRT_Balance(account.vesting_periods[i].amount);
            }
        }
    } else {
        accountVestingAmount = 0;
    }
    accountVestingAmount = accountVestingAmount - freeBalance;
    return accountVestingAmount;
}

function getDelayedVestingAmount(account, currentEpochTime) {
    const endTime = parseInt(account.base_vesting_account.end_time);
    if (endTime >= currentEpochTime) {
        return getUXPRT_Balance(account.base_vesting_account.original_vesting);
    } else {
        return 0;
    }
}

function getContinuousVestingAmount(account, currentEpochTime) {
    const endTime = parseInt(account.base_vesting_account.end_time);
    const startTime = parseInt(account.start_time);
    if (endTime >= currentEpochTime) {
        let originalVestingAmount = getUXPRT_Balance(account.base_vesting_account.original_vesting);
        return (originalVestingAmount * (currentEpochTime - startTime)) / (endTime - startTime);
    } else {
        return 0;
    }
}

function getAccountVestingAmount(account, currentEpochTime) {
    let accountVestingAmount = 0;
    switch (account["@type"]) {
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
    const persistence = MakePersistence(0, 0);
    const vestingAmountData = await persistence.getAccounts(address);
    const currentEpochTime = Math.floor(new Date().getTime() / 1000);
    let vestingAmount = 0;
    let transferableAmount = 0;
    if (vestingAmountData.code === undefined) {
        const amount = getAccountVestingAmount(vestingAmountData.account, currentEpochTime) / 1000000;
        vestingAmount = amount;
        console.log(amount, balance, "Red")
        if ((balance - amount) < 0) {
            transferableAmount = 0;
        } else {
            transferableAmount = balance - amount;
        }
    }
    return [vestingAmount, transferableAmount]
}

export default {getTransferableVestingAmount};
