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

export const fetchTransactions = (address, limit, pageNumber, stage) => {

    return async dispatch => {
        dispatch(fetchTransactionsProgress());
        const url = getTransactionsUrl(address, limit, pageNumber);
        await Axios.get(url)
            .then((res) => {
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
                            if (stage === "Initial") {
                                dispatch(fetchPageNumberSuccess(newResponse.data.page_number * 1, newResponse.data.page_total * 1));
                                let sendTxnsResponseList = newResponse.data.txs.reverse();
                                if (newResponse.data.count !== limit) {
                                    Axios.get(getTransactionsUrl(address, limit, (res.data.page_total*1 - 1))).then(
                                        previousTxResponse => {
                                            let previousTxResponseList = previousTxResponse.data.txs.reverse();
                                            const firstHalf = previousTxResponseList.splice(0, (previousTxResponse.data.count*1 - newResponse.data.count*1 ));
                                            const finalTxns = sendTxnsResponseList.concat(firstHalf);
                                            dispatch(fetchTransactionsSuccess(finalTxns));
                                        }
                                    )
                                } else {
                                    dispatch(fetchTransactionsSuccess(sendTxnsResponseList));
                                }
                            } else {
                                dispatch(fetchPageNumberSuccess(res.data.page_number * 1, res.data.page_total * 1));
                                let txnsResponseList = res.data.txs.reverse();
                                if (txnsResponseList !== undefined) {
                                    dispatch(fetchTransactionsSuccess(txnsResponseList));
                                }
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
}