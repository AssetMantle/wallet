import {
    TX_UNBOND_AMOUNT_SET,
    TX_UNBOND_MODAL_HIDE,
    TX_UNBOND_MODAL_SHOW,
} from "../../../constants/unbond";
import {setTxName} from "./common";
import {showFeeModal} from "./fee";

export const setTxUnbondAmount = (data) => {
    return {
        type: TX_UNBOND_AMOUNT_SET,
        data,
    };
};

export const showTxUnbondModal = (data) => {
    return {
        type: TX_UNBOND_MODAL_SHOW,
        data,
    };
};

export const hideTxUnbondModal = (data) => {
    return {
        type: TX_UNBOND_MODAL_HIDE,
        data,
    };
};

export const submitFormData = (message) => (dispatch, getState) => {
    dispatch(setTxName({
        value:{
            name:"unbond",
            modal:showTxUnbondModal(),
            data:{
                message:message,
                memo:getState().common.memo.value,
            }
        }
    }));
    dispatch(hideTxUnbondModal());
    dispatch(showFeeModal());
};