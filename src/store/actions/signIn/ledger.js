import {
    SET_LEDGER_ACCOUNT_INDEX,
    SET_LEDGER_ACCOUNT_NUMBER,
    SET_LEDGER_INFO,
    SIGN_IN_LEDGER_MODAL_HIDE,
    SIGN_IN_LEDGER_MODAL_SHOW
} from "../../../constants/signIn/ledger";
import {fetchAddress} from "../../../utils/ledger";
import config from "../../../testConfig.json";
import {setLoginInfo} from "../transactions/common";
import * as Sentry from "@sentry/browser";
import helper, {vestingAccountCheck, getAccount} from "../../../utils/helper";
import {
    LOGIN_INFO,
} from "../../../constants/localStorage";

export const hideLedgerModal = (data) => {
    return {
        type: SIGN_IN_LEDGER_MODAL_HIDE,
        data,
    };
};

export const showLedgerModal = (data) => {
    return {
        type: SIGN_IN_LEDGER_MODAL_SHOW,
        data,
    };
};

export const setLedgerInfo = (data) => {
    return {
        type: SET_LEDGER_INFO,
        data,
    };
};

export const setAccountNumber = (data) => {
    return {
        type: SET_LEDGER_ACCOUNT_NUMBER,
        data,
    };
};

export const setAccountIndex = (data) => {
    return {
        type: SET_LEDGER_ACCOUNT_INDEX,
        data,
    };
};


export const fetchLedgerAddress = (accountNumber = "0", addressIndex = "0") => {
    return async (dispatch) => {
        try {
            let ledgerResponse = fetchAddress(accountNumber, addressIndex);
            ledgerResponse.then(function (result) {
                dispatch(setLedgerInfo({
                    value: result,
                    error: {
                        message: '',
                    },
                }));
            }).catch(error => {
                Sentry.captureException(error.response
                    ? error.response.data.message
                    : error.message);
                dispatch(setLedgerInfo({
                    value: '',
                    error: {
                        message: error.message,
                    },
                }));
            });
        }catch (error) {
            Sentry.captureException(error.response
                ? error.response.data.message
                : error.message);
            dispatch(setLedgerInfo({
                value: '',
                error: {
                    message: error.message,
                },
            }));
        }
    };
};

export const ledgerLogin = (history) => {
    return async (dispatch, getState) => {
        const address = getState().signInLedger.ledgerInfo.value;
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
        const res = await getAccount(address).catch(error => {
            Sentry.captureException(error.response
                ? error.response.data.message
                : error.message);
            console.log(error.message);
            loginInfo.fee = config.defaultFee;
            loginInfo.account = "non-vesting";
        });
        const accountType = await vestingAccountCheck(res && res.typeUrl);
        if (accountType) {
            loginInfo.fee = config.vestingAccountFee;
            loginInfo.account = "vesting";
        } else {
            loginInfo.fee = config.defaultFee;
            loginInfo.account = "non-vesting";
        }

        loginInfo.loginToken = "loggedIn";
        loginInfo.address = address;
        loginInfo.loginMode = "ledger";
        loginInfo.version = config.version;
        loginInfo.accountNumber = helper.getAccountNumber(getState().signInLedger.accountNumber.value);
        loginInfo.accountIndex = helper.getAccountNumber(getState().signInLedger.accountIndex.value);

        localStorage.setItem(LOGIN_INFO, JSON.stringify(loginInfo));

        dispatch(setLoginInfo({
            encryptedSeed: false,
            error: {
                message: ''
            }
        }));
        history.push('/dashboard/wallet');
        window.location.reload();
    };
};