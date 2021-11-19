import {
    TX_SEND_TOKEN_SET,
    TX_SEND_ADDRESS_SET,
    TX_SEND_AMOUNT_SET,
    // TX_SEND_IN_PROGRESS,
    TX_SEND_MEMO_SET,
    // TX_SEND_RESPONSE, TX_SEND_SUCCESS, TX_SEND_FAILED
} from "../../../constants/send";
import {setTxName} from "./common";
import {showFeeModal} from "./fee";

export const setTxSendAmount = (data) => {
    console.log(data, "setTxSendAmount");

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

export const setTxSendMemo = (data) => {
    return {
        type: TX_SEND_MEMO_SET,
        data,
    };
};

// export const txSendSuccess = (data) => {
//     return {
//         type: TX_SEND_SUCCESS,
//         data,
//     };
// };
//
// export const txSendFailed = (data) => {
//     return {
//         type: TX_SEND_FAILED,
//         data,
//     };
// };
//
// export const txSendInProgress = (data) => {
//     return {
//         type: TX_SEND_IN_PROGRESS,
//         data,
//     };
// };
//
// export const txSendResponse = (data) => {
//     return {
//         type: TX_SEND_RESPONSE,
//         data,
//     };
// };

export const submitFormData = () => (dispatch,getState) => {
    dispatch(setTxName({
        value:{
            name:"send",
            data:{
                toAddress:getState().send.toAddress,
                amount:getState().send.amount,
                token:getState().send.token.value.tokenDenom,
            }
        }
    }));
    dispatch(showFeeModal());
};
