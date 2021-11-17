import {SET_TX_NAME, TX_RESULT_MODAL_HIDE, TX_RESULT_MODAL_SHOW} from "../../constants/common";

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

export const setTxName = (data) => {
    return {
        type: SET_TX_NAME,
        data,
    };
};


