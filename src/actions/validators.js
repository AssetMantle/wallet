import {QueryClientImpl} from '@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/query';
import {
    FETCH_ACTIVE_VALIDATORS_SUCCESS,
    FETCH_VALIDATORS_ERROR,
    FETCH_INACTIVE_VALIDATORS_SUCCESS,
    FETCH_VALIDATORS_IN_PROGRESS,
    FETCH_VALIDATORS_SUCCESS,
} from "../constants/validators";

import helper from "../utils/helper";
import transactions from "../utils/transactions";

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
                let obj = {
                    'data':item,
                    'delegations':data.balance.amount*1
                };
                delegatedValidators.push(obj);
                count = 0;
                break;
            }else {
                count ++;
            }
        }
        if(count !== 0){
            let obj ={
                'data':item,
                'delegations':0
            };
            delegatedValidators.push(obj);
        }
    });
    const sortDel = delegatedValidators.sort(function (a, b) {
        return b.delegations - a.delegations;
    });
    return sortDel;
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
            let activeValidators = [];
            let inActiveValidators = [];
            let activeValidatorsEmptyDelegations = [];
            let inActiveValidatorsEmptyDelegations = [];
            validators.forEach((item) => {
                if (helper.isActive(item)) {
                    let activeValidatorsData ={
                        'data':item,
                        'delegations':0
                    };
                    activeValidatorsEmptyDelegations.push(item);
                    activeValidators.push(activeValidatorsData);
                } else {
                    let inActiveValidatorsData ={
                        'data':item,
                        'delegations':0
                    };
                    inActiveValidatorsEmptyDelegations.push(item);
                    inActiveValidators.push(inActiveValidatorsData);
                }
            });

            const delegationsResponse = await stakingQueryService.DelegatorDelegations({
                delegatorAddr: address,
            }).catch((error) => {
                console.log(error.response
                    ? error.response.data.message
                    : error.message);
                dispatch(fetchActiveValidatorsSuccess(activeValidators));
                dispatch(fetchInactiveValidatorsSuccess(inActiveValidators));
            });

            if(delegationsResponse.delegationResponses.length) {
                const sortedActiveValidators =  validatorsDelegationSort(activeValidatorsEmptyDelegations, delegationsResponse.delegationResponses);
                const sortedInactiveValidators =  validatorsDelegationSort(inActiveValidatorsEmptyDelegations, delegationsResponse.delegationResponses);

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


