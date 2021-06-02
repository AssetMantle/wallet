import {getLatestBlockUrl} from "../constants/url";
import axios from "axios";
import transactions from "./transactions";
import {Tendermint34Client} from "@cosmjs/tendermint-rpc";
import {createProtobufRpcClient, QueryClient} from "@cosmjs/stargate";
import {QueryClientImpl} from "@cosmjs/stargate/build/codec/cosmos/distribution/v1beta1/query";
const tendermintRPCURL =  process.env.REACT_APP_TENDERMINT_RPC_ENDPOINT;

async function getValidatorRewards(validatorAddress) {
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