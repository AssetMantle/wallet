import {
    KEYSTORE_MODAL_HIDE,
    KEYSTORE_MODAL_SHOW,
    TX_KEY_STORE_PASSWORD_SET,
    TX_KEY_STORE_SET
} from "../../../constants/keyStore";
import transactions from "../../../utils/transactions";
import {setLoginInfo, showTxResultModal, txFailed, txInProgress, txResponse, txSuccess} from "./common";
import helper from "../../../utils/helper";
import * as Sentry from "@sentry/browser";

export const setTxKeyStore = (data) => {
    return {
        type: TX_KEY_STORE_SET,
        data,
    };
};

export const setTxKeyStorePassword = (data) => {
    return {
        type: TX_KEY_STORE_PASSWORD_SET,
        data,
    };
};

export const showKeyStoreModal = (data) => {
    return {
        type: KEYSTORE_MODAL_SHOW,
        data,
    };
};

export const hideKeyStoreModal = (data) => {
    return {
        type: KEYSTORE_MODAL_HIDE,
        data,
    };
};

export const keyStoreSubmit = (loginAddress) => {
    return async (dispatch, getState) => {
        dispatch(txInProgress());
        try {
            const password = getState().keyStore.password;
            const keyStoreData = getState().keyStore.keyStore;

            const accountNumber = helper.getAccountNumber(getState().advanced.accountNumber.value);
            const accountIndex = helper.getAccountNumber(getState().advanced.accountIndex.value);
            const bip39PassPhrase = getState().advanced.bip39PassPhrase.value;

            const formData = getState().common.txInfo.value.data;
            const txName = getState().common.txName.value.name;

            const encryptedSeed = getState().common.loginInfo.encryptedSeed;

            const fee = getState().fee.fee.value.fee;
            const gas = getState().gas.gas.value;

            let mnemonic = "";
            if (encryptedSeed) {
                const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
                const res = JSON.parse(encryptedMnemonic);
                const decryptedData = helper.decryptStore(res, password.value);
                if (decryptedData.error != null) {
                    throw new Error(decryptedData.error);
                }
                mnemonic = decryptedData.mnemonic;
            } else {
                mnemonic = await transactions.PrivateKeyReader(keyStoreData.value, password.value, loginAddress, accountNumber, accountIndex);
            }

            let result = await transactions.getTransactionResponse(loginAddress, formData, fee, gas, mnemonic, txName, accountNumber, accountIndex, bip39PassPhrase);
            if (result.code !== undefined) {
                dispatch(setLoginInfo({
                    encryptedSeed: true,
                    error: {
                        message: ''
                    }
                }));
                dispatch(hideKeyStoreModal());
                dispatch(txSuccess());
                dispatch(txResponse(result));
                dispatch(showTxResultModal());
            }
        } catch (error) {
            Sentry.captureException(error.response
                ? error.response.data.message
                : error.message);
            console.log(error, "Error");
            dispatch(txFailed(error.message));
        }
    };
};

