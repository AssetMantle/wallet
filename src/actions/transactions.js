import Axios from 'axios';
import {getTransactionsUrl} from "../constants/url";
import {TRANSACTIONS_FETCH_SUCCESS,
    TRANSACTIONS_FETCH_ERROR,
    TRANSACTIONS_IN_PROGRESS,
    PAGE_NUMBER_FETCH_SUCCESS
} from "../constants/transactions"


export const fetchTransactionsProgress = () => {
    return {
        type:  TRANSACTIONS_IN_PROGRESS,
    };
};

export const fetchPageNumberSuccess = (number, totalPages) => {
    return {
        type:  PAGE_NUMBER_FETCH_SUCCESS,
        number,
        totalPages
    };
};


export const fetchTransactionsSuccess = (list) => {
    return {
        type: TRANSACTIONS_FETCH_SUCCESS,
        list,
    };
};
export const fetchTransactionsError = (list) => {
    return {
        type: TRANSACTIONS_FETCH_ERROR,
        list,
    };
};

export const fetchTransactions = (address, limit, pageNUmber)  => {
    return async dispatch => {
        dispatch(fetchTransactionsProgress());
        const url = getTransactionsUrl(address, limit, pageNUmber);
        await Axios.get(url)
            .then((res) => {
                dispatch(fetchPageNumberSuccess(res.data.page_number*1, res.data.page_total*1));
                let sendTxnsResponseList = res.data.txs;
                if(sendTxnsResponseList !== undefined){
                    dispatch(fetchTransactionsSuccess(sendTxnsResponseList));
                }
            })
            .catch((error) => {
                dispatch(fetchTransactionsError(error.response
                    ? error.response.data.message
                    : error.message));
            });
    }
};