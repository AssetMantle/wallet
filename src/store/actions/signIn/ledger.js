import {
    SET_LEDGER_ACCOUNT_INDEX,
    SET_LEDGER_ACCOUNT_NUMBER,
    SET_LEDGER_INFO,
    SIGN_IN_LEDGER_MODAL_HIDE,
    SIGN_IN_LEDGER_MODAL_SHOW
} from "../../../constants/signIn/ledger";
import {fetchAddress} from "../../../utils/ledger";
import transactions, {GetAccount} from "../../../utils/transactions";
import config from "../../../config";
import {setLoginInfo} from "../transactions/common";
import * as Sentry from "@sentry/browser";
import helper from "../../../utils/helper";

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
        GetAccount(address).then(async res => {
            const accountType = await transactions.VestingAccountCheck(res.typeUrl);
            if (accountType) {
                loginInfo.fee = config.vestingAccountFee;
                loginInfo.account = "vesting";
                localStorage.setItem('fee', config.vestingAccountFee);
                localStorage.setItem('account', 'vesting');
            } else {
                loginInfo.fee = config.defaultFee;
                loginInfo.account = "non-vesting";
                localStorage.setItem('fee', config.defaultFee);
                localStorage.setItem('account', 'non-vesting');
            }
        }).catch(error => {
            Sentry.captureException(error.response
                ? error.response.data.message
                : error.message);
            console.log(error.message);
            loginInfo.fee = config.defaultFee;
            loginInfo.account = "non-vesting";
            localStorage.setItem('fee', config.defaultFee);
            localStorage.setItem('account', 'non-vesting');
        });

        loginInfo.loginToken = "loggedIn";
        loginInfo.address = address;
        loginInfo.loginMode = "ledger";
        loginInfo.version = config.version;
        loginInfo.accountNumber = helper.getAccountNumber(getState().signInLedger.accountNumber.value);
        loginInfo.accountIndex = helper.getAccountNumber(getState().signInLedger.accountIndex.value);

        localStorage.setItem('accountNumber', helper.getAccountNumber(getState().signInLedger.accountNumber.value));
        localStorage.setItem('addressIndex', helper.getAccountNumber(getState().signInLedger.accountIndex.value));
        localStorage.setItem('loginToken', 'loggedIn');
        localStorage.setItem('address', address);
        localStorage.setItem('loginMode', 'ledger');
        localStorage.setItem('version', config.version);
        localStorage.setItem('loginInfo', JSON.stringify(loginInfo));

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