import {
    SET_KEYSTORE_RESULT,
    SIGN_IN_KEYSTORE_MODAL_HIDE,
    SIGN_IN_KEYSTORE_MODAL_SHOW,
    SIGN_IN_KEYSTORE_RESULT_MODAL_HIDE,
    SIGN_IN_KEYSTORE_RESULT_MODAL_SHOW
} from "../../../constants/signIn/keyStore";
import transactions, {GetAccount} from "../../../utils/transactions";
import {setLoginInfo} from "../transactions/common";
import helper from "../../../utils/helper";
import wallet from "../../../utils/wallet";
import config from "../../../config";
import * as Sentry from "@sentry/browser";
import {
    ACCOUNT,
    ADDRESS,
    ENCRYPTED_MNEMONIC,
    FEE,
    LOGIN_INFO,
    LOGIN_MODE,
    LOGIN_TOKEN,
    VERSION
} from "../../../constants/localStorage";

export const hideKeyStoreModal = (data) => {
    return {
        type: SIGN_IN_KEYSTORE_MODAL_HIDE,
        data,
    };
};
export const showKeyStoreModal = (data) => {
    return {
        type: SIGN_IN_KEYSTORE_MODAL_SHOW,
        data,
    };
};

export const hideKeyStoreResultModal = (data) => {
    return {
        type: SIGN_IN_KEYSTORE_RESULT_MODAL_HIDE,
        data,
    };
};
export const showKeyStoreResultModal = (data) => {
    return {
        type: SIGN_IN_KEYSTORE_RESULT_MODAL_SHOW,
        data,
    };
};

export const setKeyStoreResult = (data) => {
    return {
        type: SET_KEYSTORE_RESULT,
        data,
    };
};

export const keyStoreSubmit = () => {
    return async (dispatch, getState) => {
        const password = getState().keyStore.password;
        const keyStoreData = getState().keyStore.keyStore;
        const fileReader = new FileReader();
        let mnemonic = "";
        fileReader.readAsText(keyStoreData.value, "UTF-8");
        fileReader.onload = async event => {
            localStorage.setItem(ENCRYPTED_MNEMONIC, event.target.result);
            const res = JSON.parse(event.target.result);
            const decryptedData = helper.decryptStore(res, password.value);
            if (decryptedData.error != null) {
                dispatch(setKeyStoreResult(
                    {
                        value: "",
                        error: {
                            message: decryptedData.error,
                        },
                    }));
                console.log(decryptedData.error, "responseData");
            } else {
                mnemonic = helper.mnemonicTrim(decryptedData.mnemonic);
                const accountNumber = helper.getAccountNumber(getState().advanced.accountNumber.value);
                const accountIndex = helper.getAccountNumber(getState().advanced.accountIndex.value);
                const bip39PassPhrase = getState().advanced.bip39PassPhrase.value;

                const walletPath = transactions.makeHdPath(accountNumber, accountIndex);
                const responseData = await wallet.createWallet(mnemonic, walletPath, bip39PassPhrase);
                dispatch(hideKeyStoreModal());
                dispatch(showKeyStoreResultModal());
                dispatch(setKeyStoreResult(
                    {
                        value: responseData,
                        error: {
                            message: "",
                        }
                    }));
            }
        };
    };
};


export const keyStoreLogin = (history) => {
    return async (dispatch, getState) => {
        const address = getState().signInKeyStore.response.value.address;
        const accountNumber = helper.getAccountNumber(getState().advanced.accountNumber.value);
        const accountIndex = helper.getAccountNumber(getState().advanced.accountIndex.value);
        const loginInfo = {
            fee: '',
            account: '',
            loginToken: '',
            address: '',
            loginMode: '',
            version: '',
            accountNumber: '',
            accountIndex: ''
        };
        GetAccount(address).then(async res => {
            const accountType = await transactions.VestingAccountCheck(res.typeUrl);
            if (accountType) {
                loginInfo.fee = config.vestingAccountFee;
                loginInfo.account = "vesting";
                localStorage.setItem(FEE, config.vestingAccountFee);
                localStorage.setItem(ACCOUNT, 'vesting');
            } else {
                loginInfo.fee = config.defaultFee;
                loginInfo.account = "non-vesting";
                localStorage.setItem(FEE, config.defaultFee);
                localStorage.setItem(ACCOUNT, 'non-vesting');
            }
        }).catch(error => {
            Sentry.captureException(error.response
                ? error.response.data.message
                : error.message);
            console.log(error.message);
            loginInfo.fee = config.defaultFee;
            loginInfo.account = "non-vesting";
            localStorage.setItem(FEE, config.defaultFee);
            localStorage.setItem(ACCOUNT, 'non-vesting');
        });

        loginInfo.loginToken = "loggedIn";
        loginInfo.address = address;
        loginInfo.loginMode = "normal";
        loginInfo.version = config.version;
        loginInfo.accountNumber = accountNumber;
        loginInfo.accountIndex = accountIndex;
        localStorage.setItem(LOGIN_TOKEN, 'loggedIn');
        localStorage.setItem(ADDRESS, address);
        localStorage.setItem(LOGIN_MODE, 'normal');
        localStorage.setItem(VERSION, config.version);
        localStorage.setItem(LOGIN_INFO, JSON.stringify(loginInfo));
        dispatch(setLoginInfo({
            encryptedSeed: true,
            error: {
                message: ''
            }
        }));
        history.push('/dashboard/wallet');
        window.location.reload();
    };
};