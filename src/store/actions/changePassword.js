import {
    CHANGE_KEYSTORE_RESULT_MODAL_SHOW,
    CHANGE_KEYSTORE_NEW_PASSWORD_MODAL_SHOW,
    CHANGE_KEYSTORE_MODAL_SHOW,
    CHANGE_KEYSTORE_RESULT_SET,
    CHANGE_KEYSTORE_RESULT_MODAL_HIDE,
    CHANGE_KEYSTORE_NEW_PASSWORD_MODAL_HIDE,
    CHANGE_KEYSTORE_MODAL_HIDE,
    KEYSTORE_NEW_PASSWORD_SET
} from "../../constants/changePassword";

// import wallet from "../../utils/wallet";
// import helper from "../../utils/helper";
// import {txInProgress} from "./transactions/common";
// import transactions from "../../utils/transactions";

export const setKeyStoreNewPassword = (data) => {
    return {
        type: KEYSTORE_NEW_PASSWORD_SET,
        data,
    };
};

export const showKeyStoreModal = (data) => {
    return {
        type: CHANGE_KEYSTORE_MODAL_SHOW,
        data,
    };
};

export const hideKeyStoreModal = (data) => {
    return {
        type: CHANGE_KEYSTORE_MODAL_HIDE,
        data,
    };
};

export const showKeyStoreNewPasswordModal = (data) => {
    console.log("here");
    return {
        type: CHANGE_KEYSTORE_NEW_PASSWORD_MODAL_SHOW,
        data,
    };
};

export const hideKeyStoreNewPasswordModal = (data) => {
    return {
        type: CHANGE_KEYSTORE_NEW_PASSWORD_MODAL_HIDE,
        data,
    };
};

export const showResultModal = (data) => {
    return {
        type: CHANGE_KEYSTORE_RESULT_MODAL_SHOW,
        data,
    };
};

export const hideResultModal = (data) => {
    return {
        type: CHANGE_KEYSTORE_RESULT_MODAL_HIDE,
        data,
    };
};

export const setResult = (data) => {
    return {
        type: CHANGE_KEYSTORE_RESULT_SET,
        data,
    };
};


//
// export const keyStoreSubmit = () => {
//     return async (dispatch, getState) => {
//         dispatch(txInProgress());
//         try {
//             const password = getState().keyStore.password;
//             const keyStoreData = getState().keyStore.keyStore;
//
//             const accountNumber = getState().advanced.accountNumber.value;
//             const accountIndex = getState().advanced.accountIndex.value;
//             const bip39PassPhrase = getState().advanced.bip39PassPhrase.value;
//
//             const fileReader = new FileReader();
//             fileReader.readAsText(keyStoreData.value, "UTF-8");
//             fileReader.onload = async event => {
//                 const res = JSON.parse(event.target.result);
//                 const decryptedData = helper.decryptStore(res, password);
//                 const walletPath = transactions.makeHdPath(accountNumber, accountIndex);
//                 const responseData = await wallet.createWallet(decryptedData.mnemonic, walletPath, bip39PassPhrase);
//             };
//
//         } catch (e) {
//             dispatch(setKeyStoreMnemonic({
//                 value: '',
//                 error: {
//                     message: e.message
//                 }
//             }));
//         }
//     }
// };
