import transactions from "../../../utils/transactions";
import {SendMsg} from "../../../utils/protoMsgHelper";
import config from "../../../config";
import aminoMsgHelper from "../../../utils/aminoMsgHelper";
import {showTxResultModal} from "./common";
import {txResponse, txFailed, txSuccess, txInProgress} from "./common";

export const keplrTxSend = (loginAddress) => (dispatch, getState) => {
    dispatch(txInProgress());
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
            dispatch(txSuccess());
            dispatch(txResponse(result));
            dispatch(showTxResultModal());
            console.log(result, "result");
            // helper.accountChangeCheck(result.rawLog);
        }else {
            console.log(result, "final result");
        }
    }).catch(err => {
        dispatch(txFailed(err.message));
        // helper.accountChangeCheck(err.message);
    });

};