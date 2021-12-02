import transactions from "../../../utils/transactions";
import aminoMsgHelper from "../../../utils/aminoMsgHelper";
import {showTxResultModal} from "./common";
import {txResponse, txFailed, txSuccess, txInProgress} from "./common";
import * as Sentry from "@sentry/browser";

export const keplrSubmit = (messages) => (dispatch, getState) => {
    dispatch(txInProgress());
    console.log(messages, "messages");
    const response = transactions.TransactionWithKeplr(messages, aminoMsgHelper.fee(0, 250000));
    response.then(result => {
        dispatch(getState().common.txInfo.value.modal);
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
        console.log(error, "error result");

        Sentry.captureException(error.response
            ? error.response.data.message
            : error.message);
        dispatch(txFailed(error.message));
        // helper.accountChangeCheck(err.message);
    });

};