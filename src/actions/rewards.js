import {
    REWARDS_FETCH_ERROR,
    REWARDS_FETCH_IN_PROGRESS,
    REWARDS_FETCH_SUCCESS,
    REWARDS_LIST_FETCH_SUCCESS,
    FETCH_VALIDATOR_COMMISSION_INFO_SUCCESS,
    FETCH_VALIDATOR_WITH_ADDRESS_ERROR,
    FETCH_VALIDATORS_REWARDS_SUCCESS
} from "../constants/rewards";
import transactions from "../utils/transactions";
import {QueryClientImpl} from "@cosmjs/stargate/build/codec/cosmos/distribution/v1beta1/query";
import helper from "../utils/helper";
import ActionHelper from "../utils/actions";
import {QueryClientImpl as StakingQueryClientImpl} from "@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/query";

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

export const fetchValidatorRewardsListError = (data) => {
    return {
        type: FETCH_VALIDATOR_WITH_ADDRESS_ERROR,
        data,
    };
};

export const fetchValidatorRewardsListSuccess = (list) => {
    return {
        type: FETCH_VALIDATORS_REWARDS_SUCCESS,
        list,
    };
};

export const fetchValidatorCommissionInfoSuccess = (list) => {

    return {
        type: FETCH_VALIDATOR_COMMISSION_INFO_SUCCESS,
        list,
    };
};

export const fetchTotalRewards= (address) => {
    return async dispatch => {
        dispatch(fetchRewardsProgress());
        const rpcClient = await transactions.RpcClient();
        const distributionQueryService = new QueryClientImpl(rpcClient);
        await distributionQueryService.DelegationTotalRewards({
            delegatorAddress: address,
        }).then(async (delegatorRewardsResponse) => {
            if (delegatorRewardsResponse.total.length) {
                let rewards = helper.decimalConversion(delegatorRewardsResponse.total[0].amount, 18);
                const fixedRewardsResponse = transactions.XprtConversion(rewards*1);
                dispatch(fetchRewardsSuccess(fixedRewardsResponse));
            }
        }).catch((error) => {
            console.log(error.response
                ? error.response.data.message
                : error.message);
        });
    };
};

export const fetchRewards = (address) => {
    return async dispatch => {
        dispatch(fetchRewardsProgress());
        const rpcClient = await transactions.RpcClient();
        const distributionQueryService = new QueryClientImpl(rpcClient);
        await distributionQueryService.DelegationTotalRewards({
            delegatorAddress: address,
        }).then(async (delegatorRewardsResponse) => {
            if (delegatorRewardsResponse.rewards.length) {
                let options = [];
                for (const item of delegatorRewardsResponse.rewards) {
                    const stakingQueryService = new StakingQueryClientImpl(rpcClient);
                    await stakingQueryService.Validator({
                        validatorAddr: item.validatorAddress,
                    }).then( async (res) => {
                        const data = {
                            label:`${res.validator.description.moniker} - ${transactions.XprtConversion(helper.decimalConversion(item.reward[0].amount)).toLocaleString(undefined, {minimumFractionDigits: 5})} XPRT` ,
                            value:res.validator.operatorAddress,
                            rewards: helper.decimalConversion(item.reward[0].amount)
                        };
                        if(transactions.checkValidatorAccountAddress(res.validator.operatorAddress, address)){
                            let commissionInfo = await ActionHelper.getValidatorCommission(res.validator.operatorAddress);
                            dispatch(fetchValidatorCommissionInfoSuccess([commissionInfo, res.validator.operatorAddress, true]));
                        }
                        options.push(data);
                    }).catch((error) => {
                        dispatch(fetchValidatorRewardsListError(error.response
                            ? error.response.data.message
                            : error.message));
                    });
                }
                dispatch(fetchValidatorRewardsListSuccess(options));
                dispatch(fetchRewardsListProgress(delegatorRewardsResponse.rewards));
            }
        }).catch((error) => {
            dispatch(fetchRewardsError(error.response
                ? error.response.data.message
                : error.message));
        });
    };
};
