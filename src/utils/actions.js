import {getLatestBlockUrl} from "../constants/url";
import axios from "axios";
import transactions from "./transactions";
import {QueryClientImpl} from "@cosmjs/stargate/build/codec/cosmos/distribution/v1beta1/query";
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
            let rewards = helper.DecimalConversion(response.rewards[0].amount);
            amount = (transactions.XprtConversion(rewards*1)).toFixed(6);
        }
    }).catch(error => {
        console.log(error.response);
    });
    return amount;
}

async function getLatestBlock() {
    const url = getLatestBlockUrl();
    let height = 0;
    await axios.get(url).then(response => {
        if(response.data.result.block.header.height){
            height = response.data.result.block.header.height;
        }
    }).catch(error => {
        console.log(error.response);
    });
    return height;
}

export default {
    getValidatorRewards,
    getLatestBlock
};