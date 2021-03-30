import {getValidatorRewardsUrl} from "../constants/url";
import axios from "axios";

export default class Actions {
   async getValidatorRewards(validatorAddress){
        let address = localStorage.getItem('address');
        const url = getValidatorRewardsUrl(address, validatorAddress);
        let amount =''
        await axios.get(url).then(response => {
          amount =  (response.data.rewards[0].amount/1000000).toFixed(6);
        }).catch(error => {
            console.log(error.response)
        });
       return amount;
    }
}