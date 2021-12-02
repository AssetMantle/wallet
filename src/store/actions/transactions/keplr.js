import transactions from "../../../utils/transactions";
import aminoMsgHelper from "../../../utils/aminoMsgHelper";
import {showTxResultModal} from "./common";
import {txResponse, txFailed, txSuccess, txInProgress} from "./common";
import * as Sentry from "@sentry/browser";

export const keplrSubmit = (messages) => (dispatch) => {
    dispatch(txInProgress());
    // const {
    //     send: {
    //         toAddress,
    //         amount,
    //         token,
    //     },
    // } = getState();
    // console.log(toAddress, amount,token, "loginAddress");
    console.log(messages, "messages");
    const response = transactions.TransactionWithKeplr(messages, aminoMsgHelper.fee(0, 250000));
    response.then(result => {
        if (result.code !== undefined) {
            dispatch(txSuccess());
            dispatch(txResponse(result));
            dispatch(showTxResultModal());
            console.log(result, "result");
            // helper.accountChangeCheck(result.rawLog);
        }else {
            console.log(result, "final result");
        }
    }).catch(error => {
        Sentry.captureException(error.response
            ? error.response.data.message
            : error.message);
        dispatch(txFailed(error.message));
        // helper.accountChangeCheck(err.message);
    });

};