import Axios from 'axios';
import {getDelegationsUnbondUrl} from "../constants/url";
import {
    UNBOND_DELEGATIONS_FETCH_ERROR,
    UNBOND_DELEGATIONS_FETCH_IN_PROGRESS,
    UNBOND_DELEGATIONS_FETCH_SUCCESS,
    UNBOND_DELEGATIONS_LIST
} from "../constants/unbond";
import Lodash from "lodash";
import transactions from "../utils/transactions";

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
        const url = getDelegationsUnbondUrl(address);
        await Axios.get(url)
            .then((res) => {
                if (res.data.unbonding_responses.length) {
                    dispatch(fetchUnbondDelegationsList(res.data.unbonding_responses));
                    const totalUnbond = Lodash.sumBy(res.data.unbonding_responses, (item) => {
                        if (item.entries.length) {
                            const entriesSum = Lodash.sumBy(item.entries, (entry) => {
                                return parseInt(entry["balance"]);
                            });
                            return entriesSum;
                        }
                    });
                    dispatch(fetchUnbondDelegationsSuccess(transactions.XprtConversion(totalUnbond)));
                }
            })
            .catch((error) => {
                dispatch(fetchUnbondDelegationsError(error.response
                    ? error.response.data.message
                    : error.message));
            });
    };
};
