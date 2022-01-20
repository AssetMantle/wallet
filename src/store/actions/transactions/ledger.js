import transactions from "../../../utils/transactions";
import {showTxResultModal, txFailed, txInProgress, txResponse, txSuccess} from "./common";
import {hideFeeModal} from "./fee";
import * as Sentry from "@sentry/browser";
import helper, {privateKeyReader} from "../../../utils/helper";

export const ledgerSubmit = (loginAddress, loginMode) => {
    return async (dispatch, getState) => {
        dispatch(txInProgress());
        const password = getState().keyStore.password;
        const keyStoreData = getState().keyStore.keyStore;

        const accountNumber = helper.getAccountNumber(getState().advanced.accountNumber.value);
        const accountIndex = helper.getAccountNumber(getState().advanced.accountIndex.value);
        const bip39PassPhrase = getState().advanced.bip39PassPhrase.value;

        const formData = getState().common.txInfo.value.data;
        const txName = getState().common.txName.value.name;

        const fee = getState().fee.fee.value.fee;
        const gas = getState().gas.gas.value;

        let mnemonic = "";
        if (loginMode !== "ledger") {
            mnemonic = await privateKeyReader(keyStoreData.value, password.value, loginAddress);
        }
        let response = transactions.getTransactionResponse(loginAddress, formData, fee, gas, mnemonic, txName, accountNumber, accountIndex, bip39PassPhrase);
        response.then(result => {
            if (result.code !== undefined) {
                dispatch(hideFeeModal());
                dispatch(txSuccess());
                dispatch(txResponse(result));
                dispatch(showTxResultModal());
            } else {
                console.log(result, "final result");
            }
        }).catch(error => {
            console.log(error.message, "error.message");
            Sentry.captureException(error.response
                ? error.response.data.message
                : error.message);
            dispatch(txFailed(error.message));
        });
    };
};

