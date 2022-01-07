import {FEE_MODAL_HIDE, FEE_MODAL_SHOW, TX_FEE_SET} from "../../../constants/fee";
import {showKeyStoreModal} from "./keyStore";

export const setTxFee = (data) => {
    return {
        type: TX_FEE_SET,
        data,
    };
};

export const showFeeModal = (data) => {
    return {
        type: FEE_MODAL_SHOW,
        data,
    };
};

export const hideFeeModal = (data) => {
    return {
        type: FEE_MODAL_HIDE,
        data,
    };
};

export const feeSubmitKeyStore = () => (dispatch) => {
    dispatch(showKeyStoreModal());
    dispatch(hideFeeModal());
};

export const feeChangeHandler = (data) => (dispatch) => {
    dispatch(setTxFee(data));
};

