import transactions from "./transactions";
import {
    QueryClientImpl as DistributionQueryClient,
    QueryClientImpl
} from "@cosmjs/stargate/build/codec/cosmos/distribution/v1beta1/query";
import helper from "./helper";

async function getValidatorRewards(validatorAddress) {
    let address = localStorage.getItem('address');
    const rpcClient = await transactions.RpcClient();
    const stakingQueryService = new QueryClientImpl(rpcClient);
    let amount = 0;
    await stakingQueryService.DelegationRewards({
        delegatorAddress: address,
        validatorAddress: validatorAddress,
    }).then(response => {
        if(response.rewards.length){
            let rewards = helper.decimalConversion(response.rewards[0].amount);
            amount = (transactions.XprtConversion(rewards*1));
        }
    }).catch(error => {
        console.log(error.response);
    });
    return amount;
}

async function getValidatorCommission(address){
    const rpcClient = await transactions.RpcClient();
    const stakingQueryService = new DistributionQueryClient(rpcClient);
    let commission = 0;
    await stakingQueryService.ValidatorCommission({
        validatorAddress:address
    }).then((res) => {
        if(res.commission.commission[0].amount){
            commission = helper.decimalConversion(res.commission.commission[0].amount);
            commission = (transactions.XprtConversion(commission*1));
        }
    }).catch((error) => {
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
