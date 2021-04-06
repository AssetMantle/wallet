import Axios from 'axios';
import {getBalanceUrl} from "../constants/url";
import {
    BALANCE_FETCH_SUCCESS,
    BALANCE_FETCH_ERROR,
    BALANCE_FETCH_IN_PROGRESS
} from "../constants/balance"
import Lodash from "lodash";

export const fetchBalanceProgress = () => {
    return {
        type: BALANCE_FETCH_IN_PROGRESS,
    };
};
export const fetchBalanceSuccess = (data) => {

    return {
        type: BALANCE_FETCH_SUCCESS,
        data,
    };
};
export const fetchBalanceError = (data) => {
    return {
        type: BALANCE_FETCH_ERROR,
        data,
    };
};

export const fetchBalance = (address) => {
    return async dispatch => {
        dispatch(fetchBalanceProgress());
        const url = getBalanceUrl(address);
        await Axios.get(url)
            .then((res) => {
                if (res.data.balances.length) {
                    const totalBalance = Lodash.sumBy(res.data.balances, (balance) => {
                        return balance.amount * 1;
                    });
                    dispatch(fetchBalanceSuccess(parseFloat((totalBalance / 1000000).toFixed(2))));
                }
            })
            .catch((error) => {
                dispatch(fetchBalanceError(error.response
                    ? error.response.data.message
                    : error.message));
            });
    }
};
