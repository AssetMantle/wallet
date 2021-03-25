import Axios from 'axios';
import {getSendTransactionsUrl} from "../constants/url";
import {TRANSACTIONS_FETCH_SUCCESS,
    TRANSACTIONS_FETCH_ERROR,
    TRANSACTIONS_IN_PROGRESS
} from "../constants/transactions"


export const fetchTransactionsProgress = () => {
    return {
        type:  TRANSACTIONS_IN_PROGRESS,
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

export const fetchTransactions = (address)  => {
    return async dispatch => {
        dispatch(fetchTransactionsProgress());
        const url = getSendTransactionsUrl(address);
        await Axios.get(url)
            .then((res) => {

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
