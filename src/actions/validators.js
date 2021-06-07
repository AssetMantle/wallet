import {QueryClientImpl} from '@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/query';
import {
    FETCH_ACTIVE_VALIDATORS_SUCCESS,
    FETCH_VALIDATORS_ERROR,
    FETCH_INACTIVE_VALIDATORS_SUCCESS,
    FETCH_VALIDATORS_IN_PROGRESS,
    FETCH_VALIDATORS_SUCCESS,
    FETCH_VALIDATOR_WITH_ADDRESS_ERROR,
    FETCH_VALIDATOR_WITH_ADDRESS_SUCCESS,
    FETCH_VALIDATORS_REWARDS_SUCCESS,
    FETCH_VALIDATORS_REWARDS_IN_PROGRESS,
    FETCH_VALIDATOR_COMMISSION_INFO_SUCCESS
} from "../constants/validators";

import helper from "../utils/helper";
import transactions from "../utils/transactions";
import ActionHelper from "../utils/actions";

export const fetchValidatorsInProgress = () => {
    return {
        type: FETCH_VALIDATORS_IN_PROGRESS,
    };
};

export const fetchActiveValidatorsSuccess = (list) => {
    return {
        type: FETCH_ACTIVE_VALIDATORS_SUCCESS,
        list,
    };
};


export const fetchInactiveValidatorsSuccess = (list) => {
    return {
        type: FETCH_INACTIVE_VALIDATORS_SUCCESS,
        list,
    };
};

export const fetchTotalValidatorsSuccess = (list) => {
    return {
        type: FETCH_VALIDATORS_SUCCESS,
        list,
    };
};

export const fetchValidatorsError = (count) => {
    return {
        type: FETCH_VALIDATORS_ERROR,
        count,
    };
};

const validatorsDelegationSort = (validators, delegations) =>{
    let delegatedValidators =[];
    validators.forEach((item) => {
        let count = 0;
        for (const data of delegations) {
            if(item.operatorAddress === data.delegation.validatorAddress){
                count = 0;
                break;
            }else {
                count ++;
            }
        }
        if(count === 0){
            delegatedValidators.unshift(item);
        }else {
            delegatedValidators.push(item);
        }
    });
    return delegatedValidators;
};

export const fetchValidators = (address) => {
    return async dispatch => {
        dispatch(fetchValidatorsInProgress());
        const rpcClient = await transactions.RpcClient();

        const stakingQueryService = new QueryClientImpl(rpcClient);
        await stakingQueryService.Validators({
            status: false,
        }).then(async (res) => {
            let validators = res.validators;
            const delegationsResponse = await stakingQueryService.DelegatorDelegations({
                delegatorAddr: address,
            });
            let activeValidators = [];
            let inActiveValidators = [];
            validators.forEach((item) => {
                if (helper.isActive(item)) {
                    activeValidators.push(item);
                } else {
                    inActiveValidators.push(item);
                }
            });

            if(delegationsResponse.delegationResponses.length) {
                const sortedActiveValidators =  validatorsDelegationSort(activeValidators, delegationsResponse.delegationResponses);
                const sortedInactiveValidators =  validatorsDelegationSort(inActiveValidators, delegationsResponse.delegationResponses);
                activeValidators = sortedActiveValidators;
                inActiveValidators = sortedInactiveValidators;
            }

            dispatch(fetchTotalValidatorsSuccess(validators));
            dispatch(fetchActiveValidatorsSuccess(activeValidators));
            dispatch(fetchInactiveValidatorsSuccess(inActiveValidators));
        }).catch((error) => {
            dispatch(fetchValidatorsError(error.response
                ? error.response.data.message
                : error.message));
        });


    };
};

export const fetchValidatorsWithAddressSuccess = (list) => {
    return {
        type: FETCH_VALIDATOR_WITH_ADDRESS_SUCCESS,
        list,
    };
};

export const fetchValidatorsWithAddressError = (data) => {
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

export const fetchValidatorRewardsListInProgress = () => {
    return {
        type: FETCH_VALIDATORS_REWARDS_IN_PROGRESS,
    };
};

export const fetchValidatorCommissionInfoSuccess = (list) => {

    return {
        type: FETCH_VALIDATOR_COMMISSION_INFO_SUCCESS,
        list,
    };
};

export const fetchValidatorsWithAddress = (list, address) => {
    return async dispatch => {
        dispatch(fetchValidatorRewardsListInProgress());
        let validators = [];
        let options = [];
        for (const item of list) {
            const rpcClient = await transactions.RpcClient();
            const stakingQueryService = new QueryClientImpl(rpcClient);
            await stakingQueryService.Validator({
                validatorAddr: item.validatorAddress,
            }).then( async (res) => {

                const validatorObj = {
                    validatorAddress : item.validatorAddress,
                    rewards: helper.decimalConversion(item.reward[0].amount),
                    validator:res.validator
                };
                const data = {
                    label:res.validator.description.moniker,
                    value:res.validator.operatorAddress,
                    rewards: helper.decimalConversion(item.reward[0].amount)
                };

                if(transactions.checkValidatorAccountAddress(res.validator.operatorAddress, address)){
                    let commissionInfo = await ActionHelper.getValidatorCommission(res.validator.operatorAddress);
                    dispatch(fetchValidatorCommissionInfoSuccess([commissionInfo, res.validator.operatorAddress, true]));
                }

                options.push(data);
                validators.push(validatorObj);
            }).catch((error) => {
                dispatch(fetchValidatorsWithAddressError(error.response
                    ? error.response.data.message
                    : error.message));
            });
        }
        dispatch(fetchValidatorRewardsListSuccess(options));
        dispatch(fetchValidatorsWithAddressSuccess(validators));
    };
};