import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate";
import { Tendermint34Client } from "@cosmjs/tendermint-rpc";
// import { QueryClientImpl } from "./path/to/generated/codec";
import {QueryClientImpl} from '@cosmjs/stargate/build/codec/cosmos/staking/v1beta1/query';
const tendermintRPCURL =  process.env.REACT_APP_TENDERMINT_RPC_ENDPOINT;
import {
    FETCH_ACTIVE_VALIDATORS_SUCCESS,
    FETCH_VALIDATORS_ERROR,
    FETCH_INACTIVE_VALIDATORS_SUCCESS,
    FETCH_VALIDATORS_IN_PROGRESS,
    FETCH_VALIDATORS_SUCCESS,
    FETCH_VALIDATOR_SUCCESS,
    FETCH_VALIDATOR_ERROR,
    FETCH_VALIDATOR_WITH_ADDRESS_ERROR,
    FETCH_VALIDATOR_WITH_ADDRESS_SUCCESS
} from "../constants/validators";

import helper from "../utils/helper";

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
        const tendermintClient = await Tendermint34Client.connect(tendermintRPCURL);
        const queryClient = new QueryClient(tendermintClient);
        const rpcClient = createProtobufRpcClient(queryClient);

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

export const fetchValidatorSuccess = (data) => {
    return {
        type: FETCH_VALIDATOR_SUCCESS,
        data,
    };
};

export const fetchValidatorError = (data) => {
    return {
        type: FETCH_VALIDATOR_ERROR,
        data,
    };
};


export const fetchValidator = (address) => {
    
    return async dispatch => {
        const tendermintClient = await Tendermint34Client.connect(tendermintRPCURL);
        const queryClient = new QueryClient(tendermintClient);
        const rpcClient = createProtobufRpcClient(queryClient);

        const stakingQueryService = new QueryClientImpl(rpcClient);
        await stakingQueryService.Validator({
            validatorAddr: address,
        }).then((res) => {
            dispatch(fetchValidatorSuccess(res.validator));
        }).catch((error) => {
            dispatch(fetchValidatorError(error.response
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

export const fetchValidatorsWithAddress = (list) => {
    return async dispatch => {
        let validators = [];
        for (const item of list) {
            const tendermintClient = await Tendermint34Client.connect(tendermintRPCURL);
            const queryClient = new QueryClient(tendermintClient);
            const rpcClient = createProtobufRpcClient(queryClient);
            const stakingQueryService = new QueryClientImpl(rpcClient);
            await stakingQueryService.Validator({
                validatorAddr: item.validatorAddress,
            }).then((res) => {
                validators.push(res.validator);
            }).catch((error) => {
                dispatch(fetchValidatorsWithAddressError(error.response
                    ? error.response.data.message
                    : error.message));
            });
        }
        dispatch(fetchValidatorsWithAddressSuccess(validators));
    };
};