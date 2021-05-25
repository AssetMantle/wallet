import transactions from "./transactions";
import {Tendermint34Client} from "@cosmjs/tendermint-rpc";
import {createProtobufRpcClient, QueryClient} from "@cosmjs/stargate";
import {QueryClientImpl} from "@cosmjs/stargate/build/codec/cosmos/distribution/v1beta1/query";
const tendermintRPCURL =  process.env.REACT_APP_TENDERMINT_RPC_ENDPOINT;

export default class Actions {
    async getValidatorRewards(validatorAddress) {
        let address = localStorage.getItem('address');
        const tendermintClient = await Tendermint34Client.connect(tendermintRPCURL);
        const queryClient = new QueryClient(tendermintClient);
        const rpcClient = createProtobufRpcClient(queryClient);

        const stakingQueryService = new QueryClientImpl(rpcClient);
        let amount = 0;
        await stakingQueryService.DelegationRewards({
            delegatorAddress: address,
            validatorAddress: validatorAddress,
        }).then(response => {
            if(response.rewards.length){
                let rewards = transactions.DecimalConversion(response.rewards[0].amount);
                amount = (transactions.XprtConversion(rewards*1)).toFixed(6);
            }
        }).catch(error => {
            console.log(error.response);
        });
        return amount;
    }
}