import {SET_TX_NAME, TX_RESULT_MODAL_HIDE, TX_RESULT_MODAL_SHOW, SET_LOGIN_INFO, TX_IN_PROGRESS, TX_MEMO_SET, TX_SUCCESS,
    TX_RESPONSE, TX_FAILED} from "../../../constants/common";

export const showTxResultModal = (data) => {
    return {
        type: TX_RESULT_MODAL_SHOW,
        data,
    };
};

export const hideTxResultModal = (data) => {
    return {
        type: TX_RESULT_MODAL_HIDE,
        data,
    };
};

export const setTxMemo = (data) => {
    return {
        type: TX_MEMO_SET,
        data,
    };
};


export const setLoginInfo = (data) => {
    console.log("in info");
    return {
        type: SET_LOGIN_INFO,
        data,
    };
};


export const setTxName = (data) => {
    return {
        type: SET_TX_NAME,
        data,
    };
};


export const txInProgress = (data) => {
    return {
        type: TX_IN_PROGRESS,
        data,
    };
};

export const txSuccess = (data) => {
    return {
        type: TX_SUCCESS,
        data,
    };
};

export const txFailed = (data) => {
    return {
        type: TX_FAILED,
        data,
    };
};

export const txResponse = (data) => {
    return {
        type: TX_RESPONSE,
        data,
    };
};
