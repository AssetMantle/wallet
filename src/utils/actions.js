import transactions from "./transactions";
import {
    QueryClientImpl as DistributionQueryClient,
    QueryClientImpl
} from "cosmjs-types/cosmos/distribution/v1beta1/query";
import helper from "./helper";
import * as Sentry from "@sentry/browser";
import {ADDRESS} from "../constants/localStorage";

async function getValidatorRewards(validatorAddress) {
    let address = localStorage.getItem(ADDRESS);
    const rpcClient = await transactions.RpcClient();
    const stakingQueryService = new QueryClientImpl(rpcClient);
    let amount = 0;
    await stakingQueryService.DelegationRewards({
        delegatorAddress: address,
        validatorAddress: validatorAddress,
    }).then(response => {
        if (response.rewards.length) {
            let rewards = helper.decimalConversion(response.rewards[0].amount);
            amount = (transactions.XprtConversion(helper.stringToNumber(rewards)));
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
            commission = helper.decimalConversion(res.commission.commission[0].amount);
            commission = helper.stringToNumber(transactions.XprtConversion(helper.stringToNumber(commission)).toFixed(6));
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
