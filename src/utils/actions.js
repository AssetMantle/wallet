import {getValidatorRewardsUrl, getLatestBlockUrl} from "../constants/url";
import axios from "axios";
import transactions from "./transactions";

async function getValidatorRewards(validatorAddress) {
    let address = localStorage.getItem('address');
    const url = getValidatorRewardsUrl(address, validatorAddress);
    let amount = 0;
    await axios.get(url).then(response => {
        if(response.data.rewards.length){
            amount = (transactions.XprtConversion(response.data.rewards[0].amount*1)).toFixed(6);
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