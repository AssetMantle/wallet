import Axios from 'axios';
import {getValidatorsUrl, getValidatorUrl} from "../constants/url";
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
    FETCH_VALIDATOR_ERROR
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


export const fetchValidators = (address) => {
    return async dispatch => {
        dispatch(fetchValidatorsInProgress());
        const url = getValidatorsUrl(address);

        const tendermintClient = await Tendermint34Client.connect(tendermintRPCURL);
        const queryClient = new QueryClient(tendermintClient);
        const rpcClient = createProtobufRpcClient(queryClient);

        const stakingQueryService = new QueryClientImpl(rpcClient);
        const delegatorWithdrawAddressResponse = await stakingQueryService.Validators({
            status: false,
        });
        console.log(delegatorWithdrawAddressResponse.validators, "validatorsResponse");

        await Axios.get(url)
            .then((res) => {
                let validators = res.data.validators;
                console.log(validators, "validators");
                let activeValidators = [];
                let inActiveValidators = [];
                validators.forEach((item) => {
                    if (helper.isActive(item)) {
                        activeValidators.push(item);
                    } else {
                        inActiveValidators.push(item);
                    }
                });
                dispatch(fetchTotalValidatorsSuccess(validators));
                dispatch(fetchActiveValidatorsSuccess(activeValidators));
                dispatch(fetchInactiveValidatorsSuccess(inActiveValidators));
            })
            .catch((error) => {
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
        const url = getValidatorUrl(address);
        Axios.get(url)
            .then((res) => {
                dispatch(fetchValidatorSuccess(res.data.validator));
            })
            .catch((error) => {
                dispatch(fetchValidatorError(error.response
                    ? error.response.data.message
                    : error.message));
            });
    };
};