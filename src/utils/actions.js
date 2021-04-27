import {getValidatorRewardsUrl} from "../constants/url";
import axios from "axios";
import config from "../config";

export default class Actions {
    async getValidatorRewards(validatorAddress) {
        let address = localStorage.getItem('address');
        const url = getValidatorRewardsUrl(address, validatorAddress);
        let amount = 0;
        await axios.get(url).then(response => {
            if(response.data.rewards.length){
                amount = ((response.data.rewards[0].amount*1) / config.xprtValue).toFixed(6);
            }
        }).catch(error => {
            console.log(error.response);
        });
        return amount;
    }
}