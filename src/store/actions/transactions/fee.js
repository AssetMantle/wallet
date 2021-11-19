import {FEE_MODAL_HIDE, FEE_MODAL_SHOW, TX_FEE_SET} from "../../../constants/fee";
// import config from "../../config";
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
    console.log(data, "data");
    dispatch(setTxFee(data));
    // const response = transactions.TransactionWithKeplr([SendMsg(loginAddress, toAddress.value, (amount.value * config.xprtValue).toFixed(0), token.value.tokenDenom)], aminoMsgHelper.fee(0, 250000));
    // response.then(result => {
    //     if (result.code !== undefined) {
    //         dispatch(txSendSuccess());
    //         dispatch(txSendResponse(result));
    //         dispatch(showTxResultModal());
    //         console.log(result, "result");
    //         // helper.accountChangeCheck(result.rawLog);
    //     }else {
    //         console.log(result, "final result");
    //     }
    // }).catch(err => {
    //     dispatch(txSendFailed(err.message));
    //     // helper.accountChangeCheck(err.message);
    // });

};

