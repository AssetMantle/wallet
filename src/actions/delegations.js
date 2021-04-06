import Axios from 'axios';
import {getDelegationsUrl} from "../constants/url";
import {DELEGATIONS_FETCH_SUCCESS, DELEGATIONS_FETCH_ERROR, DELEGATIONS_STATUS_SUCCESS} from "../constants/delegations"
import Lodash from "lodash";

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
        await Axios.get(url)
            .then((res) => {
                if (res.data.delegation_responses.length) {
                    dispatch(fetchDelegationStatusSuccess(true));
                    let totalDelegationsCount = Lodash.sumBy(res.data.delegation_responses, (delegation) => {
                        return delegation.balance.amount * 1;
                    });
                    dispatch(fetchDelegationsCountSuccess(totalDelegationsCount / 1000000));
                }

            })
            .catch((error) => {
                dispatch(fetchProposalsCountError(error.response
                    ? error.response.data.message
                    : error.message));
            });
    }
};
