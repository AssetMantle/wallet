import Axios from 'axios';
import {getDelegationsUrl} from "../constants/url";
import {DELEGATIONS_FETCH_SUCCESS, DELEGATIONS_FETCH_ERROR, DELEGATIONS_STATUS_SUCCESS} from "../constants/delegations";
import Lodash from "lodash";
import transactions from "../utils/transactions";
import {Tendermint34Client} from "@cosmjs/tendermint-rpc";
import {createProtobufRpcClient, QueryClient} from "@cosmjs/stargate";
import {QueryClientImpl} from "@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/query";
const tendermintRPCURL =  process.env.REACT_APP_TENDERMINT_RPC_ENDPOINT;

export const fetchDelegationsCountSuccess = (count) => {
    return {
        type: DELEGATIONS_FETCH_SUCCESS,
        count,
    };
};
export const fetchProposalsCountError = (count) => {
    return {
        type: DELEGATIONS_FETCH_ERROR,
        count,
    };
};

export const fetchDelegationStatusSuccess = (value) => {
    return {
        type: DELEGATIONS_STATUS_SUCCESS,
        value,
    };
};


export const fetchDelegationsCount = (address) => {
    return async dispatch => {
        const url = getDelegationsUrl(address);

        const tendermintClient = await Tendermint34Client.connect(tendermintRPCURL);
        const queryClient = new QueryClient(tendermintClient);
        const rpcClient = createProtobufRpcClient(queryClient);

        const stakingQueryService = new QueryClientImpl(rpcClient);
        const delegationsResponse = await stakingQueryService.DelegatorDelegations({
            delegatorAddr: address,
        });
        console.log(delegationsResponse, "validatorsResponse");
        await Axios.get(url)
            .then((res) => {
                if (res.data.delegation_responses.length) {
                    console.log(res, "res validatorsResponse");
                    dispatch(fetchDelegationStatusSuccess(true));
                    let totalDelegationsCount = Lodash.sumBy(res.data.delegation_responses, (delegation) => {
                        return delegation.balance.amount * 1;
                    });
                    dispatch(fetchDelegationsCountSuccess(transactions.XprtConversion(totalDelegationsCount)));
                }

            })
            .catch((error) => {
                dispatch(fetchProposalsCountError(error.response
                    ? error.response.data.message
                    : error.message));
            });
    };
};
