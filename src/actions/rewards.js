import Axios from 'axios';
import {getRewardsUrl} from "../constants/url";
import {
    REWARDS_FETCH_ERROR,
    REWARDS_FETCH_IN_PROGRESS,
    REWARDS_FETCH_SUCCESS,
    REWARDS_LIST_FETCH_SUCCESS
} from "../constants/rewards";
import transactions from "../utils/transactions";

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
        const url = getRewardsUrl(address);
        await Axios.get(url)
            .then((res) => {
                if (res.data.rewards.length) {
                    dispatch(fetchRewardsListProgress(res.data.rewards));
                }
                if (res.data.total.length) {
                    const fixedRewardsResponse = transactions.XprtConversion(res.data.total[0].amount*1);
                    dispatch(fetchRewardsSuccess(fixedRewardsResponse));
                }
            })
            .catch((error) => {
                dispatch(fetchRewardsError(error.response
                    ? error.response.data.message
                    : error.message));
            });
    };
};
