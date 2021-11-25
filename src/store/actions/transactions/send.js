import {
    TX_SEND_TOKEN_SET,
    TX_SEND_ADDRESS_SET,
    TX_SEND_AMOUNT_SET,
} from "../../../constants/send";
import {setTxName} from "./common";
import {showFeeModal} from "./fee";

export const setTxSendAmount = (data) => {
    return {
        type: TX_SEND_AMOUNT_SET,
        data,
    };
};
export const setTxSendToken = (data) => {
    return {
        type: TX_SEND_TOKEN_SET,
        data,
    };
};
export const setTxSendAddress = (data) => {
    return {
        type: TX_SEND_ADDRESS_SET,
        data,
    };
};


export const submitFormData = (message) => (dispatch,getState) => {
    console.log("calling");
    dispatch(setTxName({
        value:{
            name:"send",
            
            data:{
                message:message,
                token:getState().send.token.value.tokenDenom,
                memo:getState().common.memo.value,
            }
        }
    }));
    dispatch(showFeeModal());
};
