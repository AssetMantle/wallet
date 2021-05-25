import {
    UNBOND_DELEGATIONS_FETCH_ERROR,
    UNBOND_DELEGATIONS_FETCH_IN_PROGRESS,
    UNBOND_DELEGATIONS_FETCH_SUCCESS,
    UNBOND_DELEGATIONS_LIST
} from "../constants/unbond";
import Lodash from "lodash";
import transactions from "../utils/transactions";
import {Tendermint34Client} from "@cosmjs/tendermint-rpc";
import {createProtobufRpcClient, QueryClient} from "@cosmjs/stargate";
import {QueryClientImpl} from "@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/query";
const tendermintRPCURL =  process.env.REACT_APP_TENDERMINT_RPC_ENDPOINT;

export const fetchUnbondDelegationsProgress = () => {
    return {
        type: UNBOND_DELEGATIONS_FETCH_IN_PROGRESS,
    };
};
export const fetchUnbondDelegationsSuccess = (data) => {
    return {
        type: UNBOND_DELEGATIONS_FETCH_SUCCESS,
        data,
    };
};
export const fetchUnbondDelegationsError = (data) => {
    return {
        type: UNBOND_DELEGATIONS_FETCH_ERROR,
        data,
    };
};
export const fetchUnbondDelegationsList = (list) => {
    return {
        type: UNBOND_DELEGATIONS_LIST,
        list,
    };
};

export const fetchUnbondDelegations = (address) => {
    return async dispatch => {
        dispatch(fetchUnbondDelegationsProgress());
        const tendermintClient = await Tendermint34Client.connect(tendermintRPCURL);
        const queryClient = new QueryClient(tendermintClient);
        const rpcClient = createProtobufRpcClient(queryClient);

        const stakingQueryService = new QueryClientImpl(rpcClient);
        await stakingQueryService.DelegatorUnbondingDelegations({
            delegatorAddr: address,
        }).then((unbondingDelegationsResponse) => {
            if (unbondingDelegationsResponse.unbondingResponses.length) {
                dispatch(fetchUnbondDelegationsList(unbondingDelegationsResponse.unbondingResponses));
                const totalUnbond = Lodash.sumBy(unbondingDelegationsResponse.unbondingResponses, (item) => {
                    if (item.entries.length) {
                        const entriesSum = Lodash.sumBy(item.entries, (entry) => {
                            return parseInt(entry["balance"]);
                        });
                        return entriesSum;
                    }
                });
                dispatch(fetchUnbondDelegationsSuccess(transactions.XprtConversion(totalUnbond)));
            }
        }).catch((error) => {
            dispatch(fetchUnbondDelegationsError(error.response
                ? error.response.data.message
                : error.message));
        });
    };
};
