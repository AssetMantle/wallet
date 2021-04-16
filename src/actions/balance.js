import Axios from 'axios';
import {getBalanceUrl} from "../constants/url";
import {
    BALANCE_FETCH_SUCCESS,
    BALANCE_FETCH_ERROR,
    BALANCE_FETCH_IN_PROGRESS,
    BALANCE_LIST_FETCH_SUCCESS
} from "../constants/balance"

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

export const fetchBalanceListSuccess = (list) => {
    return {
        type: BALANCE_LIST_FETCH_SUCCESS,
        list,
    };
};

export const fetchBalance = (address) => {
    return async dispatch => {
        dispatch(fetchBalanceProgress());
        const url = getBalanceUrl(address);
        await Axios.get(url)
            .then((res) => {
                if (res.data.balances.length) {
                    dispatch(fetchBalanceListSuccess(res.data.balances));
                    res.data.balances.forEach((item) => {
                        if(item.denom === 'uxprt'){
                            const totalBalance = item.amount*1;
                            dispatch(fetchBalanceSuccess(parseFloat((totalBalance / 1000000))));
                        }
                    })
                }
            })
            .catch((error) => {
                dispatch(fetchBalanceError(error.response
                    ? error.response.data.message
                    : error.message));
            });
    }
};
