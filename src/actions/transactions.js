import {
    PAGE_NUMBER_FETCH_SUCCESS,
    TRANSACTIONS_FETCH_ERROR,
    TRANSACTIONS_FETCH_SUCCESS,
    TRANSACTIONS_IN_PROGRESS,
    RECEIVE_PAGE_NUMBER_FETCH_SUCCESS,
    RECEIVE_TRANSACTIONS_FETCH_ERROR,
    RECEIVE_TRANSACTIONS_FETCH_SUCCESS,
    RECEIVE_TRANSACTIONS_IN_PROGRESS
} from "../constants/transactions";
import {buildQuery} from "@cosmjs/tendermint-rpc/build/tendermint34/requests";
import {Tendermint34Client} from "@cosmjs/tendermint-rpc";
import {decodeTxRaw, Registry} from "@cosmjs/proto-signing";
const {defaultRegistryTypes} = require("@cosmjs/stargate");
const tendermintRPCURL = process.env.REACT_APP_TENDERMINT_RPC_ENDPOINT;
const vestingTx = require("cosmjs-types/cosmos/vesting/v1beta1/tx");
const tx_7 = require("cosmjs-types/ibc/core/channel/v1/tx");
import transactions from "../utils/transactions";

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

export const fetchTransactions = (address, limit, pageNumber) => {
    return async dispatch => {
        dispatch(fetchTransactionsProgress());
        try {
            const tmClient = await Tendermint34Client.connect(tendermintRPCURL);
            const txSearch = await tmClient.txSearch(txSearchParams(address, pageNumber, limit, "message.sender"));
            let txData = [];
            for (let transaction of txSearch.txs) {
                const decodedTransaction = decodeTxRaw(transaction.tx);
                const block = await tmClient.block(transaction.height);
                if (transaction.result.code === 0) {
                    const txHash = transactions.generateHash(transaction.tx);
                    let body;
                    let typeUrl;
                    if (decodedTransaction.body.messages.length > 1) {
                        typeUrl = decodedTransaction.body.messages[decodedTransaction.body.messages.length - 1].typeUrl;
                        body = registry.decode(decodedTransaction.body.messages[decodedTransaction.body.messages.length - 1]);
                    } else {
                        typeUrl = decodedTransaction.body.messages[0].typeUrl;
                        body = registry.decode(decodedTransaction.body.messages[0]);
                    }
                    txData.push({
                        'typeUrl': typeUrl,
                        'messageCount': decodedTransaction.body.messages.length,
                        'fee': decodedTransaction.authInfo.fee,
                        'height': transaction.height,
                        'hash': txHash,
                        'body': body,
                        'timestamp': block.block.header.time
                    });
                }
            }
            let txnsResponseList = txData;
            dispatch(fetchPageNumberSuccess(pageNumber, txSearch.totalCount));
            dispatch(fetchTransactionsSuccess(txnsResponseList));
        }catch (e) {
            console.log(e.message);
        }
    };
};

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


function txSearchParams(recipientAddress, pageNumber, perPage, type) {
    return {
        query: buildQuery({
            tags: [
                {key:type, value: recipientAddress},
            ],
        }), page: pageNumber, per_page: perPage, prove: true, order_by :'desc'
    };
}

function createDefaultRegistry() {
    return new Registry([...defaultRegistryTypes, ["/cosmos.vesting.v1beta1.MsgCreateVestingAccount", vestingTx.MsgCreateVestingAccount], ["/ibc.core.channel.v1.MsgTimeout", tx_7.MsgTimeout]]);
}

const registry = createDefaultRegistry();
export const fetchReceiveTransactions = (address, limit, pageNumber) => {
    return async dispatch => {
        dispatch(fetchReceiveTransactionsProgress());
        try {
            const tmClient = await Tendermint34Client.connect(tendermintRPCURL);
            const txSearch = await tmClient.txSearch(txSearchParams(address, pageNumber, limit, "transfer.recipient"));
            let txData = [];
            for (let transaction of txSearch.txs) {
                const decodedTransaction = decodeTxRaw(transaction.tx);
                const block = await tmClient.block(transaction.height);

                if (transaction.result.code === 0) {
                    const txHash = transactions.generateHash(transaction.tx);
                    let body;
                    let typeUrl;
                    if (decodedTransaction.body.messages.length > 1) {
                        typeUrl = decodedTransaction.body.messages[decodedTransaction.body.messages.length - 1].typeUrl;
                        body = registry.decode(decodedTransaction.body.messages[decodedTransaction.body.messages.length - 1]);
                    } else {
                        typeUrl = decodedTransaction.body.messages[0].typeUrl;
                        body = registry.decode(decodedTransaction.body.messages[0]);
                    }
                    txData.push({
                        'typeUrl': typeUrl,
                        'messageCount': decodedTransaction.body.messages.length,
                        'fee': decodedTransaction.authInfo.fee,
                        'height': transaction.height,
                        'hash': txHash,
                        'body': body,
                        'timestamp': block.block.header.time
                    });
                }
            }

            let txnsResponseList = txData;
            dispatch(fetchReceivePageNumberSuccess(pageNumber, txSearch.totalCount));
            dispatch(fetchReceiveTransactionsSuccess(txnsResponseList));
        } catch (e) {
            console.log(e.message);
        }
    };
};
