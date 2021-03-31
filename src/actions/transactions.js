import Axios from 'axios';
import {getSendTransactionsUrl, getReceiveTransactionsUrl, getTxnUrl} from "../constants/url";
import {
    PAGE_NUMBER_FETCH_SUCCESS,
    TRANSACTIONS_FETCH_ERROR,
    TRANSACTIONS_FETCH_SUCCESS,
    TRANSACTIONS_IN_PROGRESS,
    RECEIVE_PAGE_NUMBER_FETCH_SUCCESS,
    RECEIVE_TRANSACTIONS_FETCH_ERROR,
    RECEIVE_TRANSACTIONS_FETCH_SUCCESS,
    RECEIVE_TRANSACTIONS_IN_PROGRESS
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
        const url = getSendTransactionsUrl(address, limit, pageNumber);
        await Axios.get(url)
            .then((res) => {
                //impl query last page
                dispatch(fetchPageNumberSuccess(pageNumber, res.data.result.total_count));
                let txnsResponseList = res.data.result.txs;
                let txnList = [];
                if (txnsResponseList !== undefined) {
                    txnsResponseList.map((tx, index) => {
                        Axios.get(getTxnUrl(tx.hash)).then(
                            newResponse => {
                                txnList.push(newResponse.data.tx_response);
                                if (index === (txnsResponseList.length - 1)) {
                                    dispatch(fetchTransactionsSuccess(txnList));
                                }
                            })

                    });
                }
            })
            .catch((error) => {
                dispatch(fetchTransactionsError(error.response
                    ? error.response.data.message
                    : error.message));
            });
    }
}

export const fetchReceiveTransactionsProgress = () => {
    return {
        type: RECEIVE_TRANSACTIONS_IN_PROGRESS,
    };
};

export const fetchReceivePageNumberSuccess = (number, totalPages) => {
    return {
        type: RECEIVE_PAGE_NUMBER_FETCH_SUCCESS,
        number,
        totalPages
    };
};


export const fetchReceiveTransactionsSuccess = (list) => {
    return {
        type: RECEIVE_TRANSACTIONS_FETCH_SUCCESS,
        list,
    };
};
export const fetchReceiveTransactionsError = (list) => {
    return {
        type: RECEIVE_TRANSACTIONS_FETCH_ERROR,
        list,
    };
};

// export const fetchReceiveTransactions = (address, limit, pageNumber) => {
//     return async dispatch => {
//         dispatch(fetchReceiveTransactionsProgress());
//         const url = getReceiveTransactionsUrl(address, limit, pageNumber);
//          Axios.get(url)
//             .then((res) => {
//                 //impl query last page
//                 dispatch(fetchReceivePageNumberSuccess(pageNumber, res.data.result.total_count));
//                 let txnsResponseList = res.data.result.txs;
//                 let txnList = [];
//                 if (txnsResponseList !== undefined) {
//                     txnsResponseList.map((tx, index) => {
//                          Axios.get(getTxnUrl(tx.hash)).then(
//                             newResponse => {
//                                 txnList.push(newResponse.data.tx_response);
//                                 if (index === (txnsResponseList.length - 1)) {
//                                     console.log(txnList)
//                                     dispatch(fetchReceiveTransactionsSuccess(txnList));
//                                 }
//                             })
//
//                     });
//                 }
//             })
//             .catch((error) => {
//                 dispatch(fetchReceiveTransactionsError(error.response
//                     ? error.response.data.message
//                     : error.message));
//             });
//     }
// }

export const fetchReceiveTransactions = (address, limit, pageNumber) => {
    return async dispatch => {
        dispatch(fetchReceiveTransactionsProgress());
        const url = getReceiveTransactionsUrl(address, limit, pageNumber);
        const rr = await Axios.get(url)
        //impl query last page
        dispatch(fetchReceivePageNumberSuccess(pageNumber, rr.data.result.total_count));
        let txnsResponseList = rr.data.result.txs;
        let txnList = [];
        if (txnsResponseList !== undefined) {
            txnsResponseList.map(async (tx, index) => {
                const txHashResult = await Axios.get(getTxnUrl(tx.hash))
                txnList.push(txHashResult.data.tx_response);
                console.log(txnsResponseList.length, index)
                if (index === (txnsResponseList.length - 1)) {
                    console.log(txnList)
                    dispatch(fetchReceiveTransactionsSuccess(txnList));
                }

            });
        }


    }
}