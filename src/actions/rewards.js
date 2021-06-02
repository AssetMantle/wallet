import {
    REWARDS_FETCH_ERROR,
    REWARDS_FETCH_IN_PROGRESS,
    REWARDS_FETCH_SUCCESS,
    REWARDS_LIST_FETCH_SUCCESS
} from "../constants/rewards";
import transactions from "../utils/transactions";
import {QueryClientImpl} from "@cosmjs/stargate/build/codec/cosmos/distribution/v1beta1/query";
import helper from "../utils/helper";

export const fetchRewardsProgress = () => {
    return {
        type: REWARDS_FETCH_IN_PROGRESS,
    };
};
export const fetchRewardsListProgress = (list) => {
    return {
        type: REWARDS_LIST_FETCH_SUCCESS,
        list
    };
};
export const fetchRewardsSuccess = (data) => {
    return {
        type: REWARDS_FETCH_SUCCESS,
        data,
    };
};
export const fetchRewardsError = (data) => {
    return {
        type: REWARDS_FETCH_ERROR,
        data,
    };
};

export const fetchRewards = (address) => {
    return async dispatch => {
        dispatch(fetchRewardsProgress());
        const rpcClient = await transactions.RpcClient();
        const stakingQueryService = new QueryClientImpl(rpcClient);
        await stakingQueryService.DelegationTotalRewards({
            delegatorAddress: address,
        }).then((delegatorRewardsResponse) => {
            if (delegatorRewardsResponse.rewards.length) {
                dispatch(fetchRewardsListProgress(delegatorRewardsResponse.rewards));
            }
            if (delegatorRewardsResponse.total.length) {
                let rewards = helper.decimalConversion(delegatorRewardsResponse.total[0].amount, 18);
                const fixedRewardsResponse = transactions.XprtConversion(rewards*1);
                dispatch(fetchRewardsSuccess(fixedRewardsResponse));
            }
        }).catch((error) => {
            dispatch(fetchRewardsError(error.response
                ? error.response.data.message
                : error.message));
        });
    };
};