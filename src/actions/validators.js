import Axios from 'axios';
import {getValidatorsUrl} from "../constants/url";
import Async from 'async';
import {
    FETCH_ACTIVE_VALIDATORS_SUCCESS,
    FETCH_VALIDATORS_ERROR,
    FETCH_INACTIVE_VALIDATORS_SUCCESS,
    FETCH_VALIDATORS_IN_PROGRESS,
    FETCH_VALIDATORS_SUCCESS
} from "../constants/validators"

import helper from "../utils/helper";

export const fetchValidatorsInProgress = () => {
    return {
        type:  FETCH_VALIDATORS_IN_PROGRESS,
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


export const fetchValidators = (address)  => {
    return async dispatch => {
        dispatch(fetchValidatorsInProgress());
        const url = getValidatorsUrl(address);
        await Axios.get(url)
            .then((res) => {
                let validators = res.data.validators;
                let activeValidators=[];
                let inActiveValidators=[];
                validators.forEach((item) => {
                    if(helper.isActive(item)) {
                        activeValidators.push(item)
                    } else {
                        inActiveValidators.push(item)
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
    }
};
