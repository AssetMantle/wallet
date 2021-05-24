import {getValidatorRewardsUrl} from "../constants/url";
import axios from "axios";
import transactions from "./transactions";
import {Tendermint34Client} from "@cosmjs/tendermint-rpc";
import {createProtobufRpcClient, QueryClient} from "@cosmjs/stargate";
import {QueryClientImpl} from "@cosmjs/stargate/build/codec/cosmos/distribution/v1beta1/query";
const tendermintRPCURL =  process.env.REACT_APP_TENDERMINT_RPC_ENDPOINT;

export default class Actions {
    async getValidatorRewards(validatorAddress) {
        let address = localStorage.getItem('address');
        const url = getValidatorRewardsUrl(address, validatorAddress);
        const tendermintClient = await Tendermint34Client.connect(tendermintRPCURL);
        const queryClient = new QueryClient(tendermintClient);
        const rpcClient = createProtobufRpcClient(queryClient);

        const stakingQueryService = new QueryClientImpl(rpcClient);
        const validatorRewardsResponse = await stakingQueryService.DelegationRewards({
            delegatorAddress: address,
            validatorAddress: validatorAddress,
        });

        console.log(validatorRewardsResponse.code, "validatorRewardsResponse");
        let amount = 0;
        await axios.get(url).then(response => {
            console.log(response, "validatorRewardsResponse response");
            if(response.data.rewards.length){
                amount = (transactions.XprtConversion(response.data.rewards[0].amount*1)).toFixed(6);
            }
        }).catch(error => {
            console.log(error.response);
        });
        return amount;
    }
}