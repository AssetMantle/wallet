import {
    TX_SET_WITH_DRAW_ADDRESS_MODAL_HIDE,
    TX_SET_WITH_DRAW_ADDRESS_SET,
    TX_SET_WITH_DRAW_ADDRESS_MODAL_SHOW,
    TX_SET_WITH_DRAW_ADDRESS_MEMO_SET
} from "../../../constants/setWithdrawAddress";
import {setTxName} from "./common";
import {showFeeModal} from "./fee";

export const setTxWithDrawAddress = (data) => {
    return {
        type: TX_SET_WITH_DRAW_ADDRESS_SET,
        data,
    };
};

export const showTxWithDrawAddressModal = (data) => {
    return {
        type: TX_SET_WITH_DRAW_ADDRESS_MODAL_SHOW,
        data,
    };
};

export const hideTxWithDrawAddressModal = (data) => {
    return {
        type: TX_SET_WITH_DRAW_ADDRESS_MODAL_HIDE,
        data,
    };
};

export const setTxMemo = (data) => {
    return {
        type: TX_SET_WITH_DRAW_ADDRESS_MEMO_SET,
        data,
    };
};


export const submitFormData = (messages) => (dispatch, getState) => {
    dispatch(setTxName({
        value:{
            name:"withdrawAddress",
            modal:showTxWithDrawAddressModal(),
            data:{
                message:messages,
                memo:getState().common.memo.value,
            }
        }
    }));
    dispatch(hideTxWithDrawAddressModal());
    dispatch(showFeeModal());
};
