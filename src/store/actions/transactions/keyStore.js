import {TX_KEY_STORE_SET, TX_KEY_STORE_PASSWORD_SET} from "../../../constants/keyStore";
import transactions from "../../../utils/transactions";
import {KEYSTORE_MODAL_HIDE, KEYSTORE_MODAL_SHOW} from "../../../constants/keyStore";
import {txResponse, txFailed, txSuccess, txInProgress, setLoginInfo} from "./common";
import {showTxResultModal} from "./common";
import helper from "../../../utils/helper";

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

        const password = getState().keyStore.password;
        const keyStoreData = getState().keyStore.keyStore;

        const accountNumber = getState().advanced.accountNumber.value;
        const accountIndex = getState().advanced.accountIndex.value;
        const bip39PassPhrase = getState().advanced.bip39PassPhrase.value;

        const formData = getState().common.txInfo.value.data;
        const txName = getState().common.txInfo.value.name;

        const encryptedSeed = getState().common.loginInfo.encryptedSeed;

        const fee = getState().fee.fee.value.fee;
        const gas = getState().gas.gas.value;
        let mnemonic="";
        console.log(encryptedSeed, "encryptedSeed");
        if(encryptedSeed){
            const encryptedMnemonic = localStorage.getItem('encryptedMnemonic');
            const res = JSON.parse(encryptedMnemonic);
            const decryptedData = helper.decryptStore(res, password.value);
            mnemonic = decryptedData.mnemonic;
        }else{
            mnemonic = await transactions.PrivateKeyReader(keyStoreData.value, password.value, loginAddress);
        }
        console.log(loginAddress, formData, fee, gas, mnemonic,txName, accountNumber, accountIndex, bip39PassPhrase, "txn data");
        let response = transactions.getTransactionResponse(loginAddress, formData, fee, gas, mnemonic,txName, accountNumber, accountIndex, bip39PassPhrase);
        response.then(result => {
            console.log(result, "txn response");

            if (result.code !== undefined) {
                dispatch(setLoginInfo({
                    encryptedSeed:true,
                    error:{
                        message:''
                    }}));
                dispatch(hideKeyStoreModal());
                dispatch(txSuccess());
                dispatch(txResponse(result));
                dispatch(showTxResultModal());
                console.log(result, "result");
            }else {
                console.log(result, "final result");
            }
        }).catch(err => {
            console.log(err.message, "err.message");
            dispatch(txFailed(err.message));
        });
    };
};

