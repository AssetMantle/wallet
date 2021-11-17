import transactions from "../../utils/transactions";
import {SendMsg} from "../../utils/protoMsgHelper";
import config from "../../config";
import aminoMsgHelper from "../../utils/aminoMsgHelper";
// import helper from "../../utils/helper";
import {
    TX_SEND_TOKEN_SET,
    TX_SEND_ADDRESS_SET,
    TX_SEND_AMOUNT_SET,
    TX_SEND_IN_PROGRESS,
    TX_SEND_MEMO_SET,
    TX_SEND_RESPONSE, TX_SEND_SUCCESS, TX_SEND_FAILED
} from "../../constants/send";
import {setTxName, showTxResultModal} from "./common";
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

export const txSendSuccess = (data) => {
    return {
        type: TX_SEND_SUCCESS,
        data,
    };
};

export const txSendFailed = (data) => {
    return {
        type: TX_SEND_FAILED,
        data,
    };
};

export const txSendInProgress = (data) => {
    return {
        type: TX_SEND_IN_PROGRESS,
        data,
    };
};

export const txSendResponse = (data) => {
    return {
        type: TX_SEND_RESPONSE,
        data,
    };
};


export const keplrTxSend = (loginAddress) => (dispatch, getState) => {
    dispatch(txSendInProgress());
    const {
        send: {
            toAddress,
            amount,
            token,
        },
    } = getState();
    console.log(toAddress, amount,token, "loginAddress");
    const response = transactions.TransactionWithKeplr([SendMsg(loginAddress, toAddress.value, (amount.value * config.xprtValue).toFixed(0), token.value.tokenDenom)], aminoMsgHelper.fee(0, 250000));
    response.then(result => {
        if (result.code !== undefined) {
            dispatch(txSendSuccess());
            dispatch(txSendResponse(result));
            dispatch(showTxResultModal());
            console.log(result, "result");
            // helper.accountChangeCheck(result.rawLog);
        }else {
            console.log(result, "final result");
        }
    }).catch(err => {
        dispatch(txSendFailed(err.message));
        // helper.accountChangeCheck(err.message);
    });

};

export const submitFormData = () => (dispatch,getState) => {
    console.log(getState().send.toAddress,
        getState().send.amount,
        getState().send.token.value.tokenDenom , "submitFormData") ;
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

//
// export const keyStoreTxSend = (loginAddress) => (dispatch, getState) => {
//     dispatch(txSendInProgress());
//     const {
//         send: {
//             toAddress,
//             amount,
//             token,
//         },
//     } = getState();
//
//     console.log(toAddress, amount,token, "loginAddress");
//
//     const response = transactions.TransactionWithKeplr([SendMsg(loginAddress, toAddress.value, (amount.value * config.xprtValue).toFixed(0), token.value.tokenDenom)], aminoMsgHelper.fee(0, 250000));
//     response.then(result => {
//         if (result.code !== undefined) {
//             dispatch(txSendSuccess());
//             dispatch(txSendResponse(result));
//             console.log(result, "result");
//             // helper.accountChangeCheck(result.rawLog);
//         }else {
//             console.log(result, "final result");
//         }
//     }).catch(err => {
//         dispatch(txSendFailed(err.message));
//         // helper.accountChangeCheck(err.message);
//     });
//
// };