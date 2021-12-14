import {TX_KEY_STORE_SET, TX_KEY_STORE_PASSWORD_SET} from "../../../constants/keyStore";
import transactions from "../../../utils/transactions";
import {KEYSTORE_MODAL_HIDE, KEYSTORE_MODAL_SHOW} from "../../../constants/keyStore";
import {txResponse, txFailed, txSuccess, txInProgress, setLoginInfo} from "./common";
import {showTxResultModal} from "./common";
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
    console.log("here");
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
            console.log(encryptedSeed, "encryptedSeed", accountNumber, accountIndex);
            if (encryptedSeed) {
                const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
                const res = JSON.parse(encryptedMnemonic);
                const decryptedData = helper.decryptStore(res, password.value);
                if (decryptedData.error != null) {
                    throw new Error(decryptedData.error);
                }
                console.log("innn", "encryptedSeed");
                mnemonic = decryptedData.mnemonic;
            } else {
                mnemonic = await transactions.PrivateKeyReader(keyStoreData.value, password.value, loginAddress, accountNumber, accountIndex);
                console.log(mnemonic, "encryptedSeedmnemonic");

            }
            console.log(loginAddress, formData, fee, gas, mnemonic, txName, accountNumber, accountIndex, bip39PassPhrase, "txn data");
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
                console.log(result, "result");
            }
        }catch (error) {
            Sentry.captureException(error.response
                ? error.response.data.message
                : error.message);
            console.log(error.message, "err.message");
            dispatch(txFailed(error.message));
        }
    };
};

