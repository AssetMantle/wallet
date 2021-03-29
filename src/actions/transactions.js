import Axios from 'axios';
import {getTransactionsUrl} from "../constants/url";
import {
    PAGE_NUMBER_FETCH_SUCCESS,
    TRANSACTIONS_FETCH_ERROR,
    TRANSACTIONS_FETCH_SUCCESS,
    TRANSACTIONS_IN_PROGRESS
} from "../constants/transactions"


export const fetchTransactionsProgress = () => {
    return {
        type: TRANSACTIONS_IN_PROGRESS,
    };
};

export const fetchPageNumberSuccess = (number, totalPages) => {
    return {
        type: PAGE_NUMBER_FETCH_SUCCESS,
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

export const fetchTransactions = (address, limit, pageNUmber) => {
    return async dispatch => {
        dispatch(fetchTransactionsProgress());
        const url = getTransactionsUrl(address, limit, pageNUmber);
        await Axios.get(url)
            .then((res) => {
                console.log(res.data.page_total)
                if (res.data.page_total === 0) {
                    // say no transactions
                } else if (res.data.page_total === 1) {
                    // show the same page
                    dispatch(fetchPageNumberSuccess(res.data.page_number * 1, res.data.page_total * 1));
                    let sendTxnsResponseList = res.data.txs.reverse();
                    if (sendTxnsResponseList !== undefined) {
                        dispatch(fetchTransactionsSuccess(sendTxnsResponseList));
                    }
                } else if (res.data.page_total > 1) {
                    //impl query last page
                    Axios.get(getTransactionsUrl(address, limit, res.data.page_total)).then(
                        newResponse => {
                            console.log(newResponse)
                            dispatch(fetchPageNumberSuccess(newResponse.data.page_number * 1, newResponse.data.page_total * 1));
                            let sendTxnsResponseList = newResponse.data.txs.reverse();
                            if (sendTxnsResponseList !== undefined) {
                                dispatch(fetchTransactionsSuccess(sendTxnsResponseList));
                            }
                        }
                    )
                }
            })
            .catch((error) => {
                dispatch(fetchTransactionsError(error.response
                    ? error.response.data.message
                    : error.message));
            });
    }
};
