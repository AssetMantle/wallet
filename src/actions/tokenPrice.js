import Axios from 'axios';

import {
    TOKEN_PRICE_FETCH_ERROR,
    TOKEN_PRICE_FETCH_SUCCESS,
} from "../constants/tokenPrice";

const PROXY_API = process.env.REACT_APP_PROXY_API;

export const fetchTokenPriceSuccess = (data) => {
    return {
        type: TOKEN_PRICE_FETCH_SUCCESS,
        data,
    };
};
export const fetchTokenPriceError = (data) => {
    return {
        type: TOKEN_PRICE_FETCH_ERROR,
        data,
    };
};

export const fetchTokenPrice = () => (dispatch) => {
    const url = `${PROXY_API}/ascendExTicker?symbol=XPRT/USDT`;
    Axios.get(url)
        .then((res) => {
            if (res.data.data.close) {
                dispatch(fetchTokenPriceSuccess(res.data.data.close));
            }
        })
        .catch((error) => {
            dispatch(fetchTokenPriceError(error.response
                ? error.response.data.message
                : error.message));
        });
};
