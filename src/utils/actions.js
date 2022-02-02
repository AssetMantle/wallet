import transactions from "./transactions";
import {
    QueryClientImpl as DistributionQueryClient,
    QueryClientImpl
} from "cosmjs-types/cosmos/distribution/v1beta1/query";
import * as Sentry from "@sentry/browser";
import {LOGIN_INFO} from "../constants/localStorage";
import {decimalConversion, stringToNumber} from "./scripts";
import {tokenValueConversion} from "./helper";

async function getValidatorRewards(validatorAddress) {
    const loginInfo = JSON.parse(localStorage.getItem(LOGIN_INFO));
    const rpcClient = await transactions.RpcClient();
    const stakingQueryService = new QueryClientImpl(rpcClient);
    let amount = 0;
    await stakingQueryService.DelegationRewards({
        delegatorAddress: loginInfo && loginInfo.address,
        validatorAddress: validatorAddress,
    }).then(response => {
        if (response.rewards.length) {
            let rewards = decimalConversion(response.rewards[0].amount);
            amount = (tokenValueConversion(stringToNumber(rewards)));
        }
    }).catch(error => {
        Sentry.captureException(error.response
            ? error.response.data.message
            : error.message);
        console.log(error.response);
    });
    return amount;
}

async function getValidatorCommission(address) {
    const rpcClient = await transactions.RpcClient();
    const stakingQueryService = new DistributionQueryClient(rpcClient);
    let commission = 0;
    await stakingQueryService.ValidatorCommission({
        validatorAddress: address
    }).then((res) => {
        if (res.commission.commission[0].amount) {
            commission = decimalConversion(res.commission.commission[0].amount);
            commission = stringToNumber(tokenValueConversion(stringToNumber(commission)).toFixed(6));
        }
    }).catch((error) => {
        Sentry.captureException(error.response
            ? error.response.data.message
            : error.message);
        console.log(error.response
            ? error.response.data.message
            : error.message);
    });
    return commission;
}

export default {
    getValidatorRewards,
    getValidatorCommission
};
