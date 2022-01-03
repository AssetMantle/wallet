import {SET_KEPLR_INFO, SIGN_IN_KEPLR_MODAL_HIDE, SIGN_IN_KEPLR_MODAL_SHOW} from "../../../constants/signIn/keplr";
import KeplerWallet from "../../../utils/kepler";
import transactions, {GetAccount} from "../../../utils/transactions";
import config from "../../../config";
import {setLoginInfo} from "../transactions/common";
import * as Sentry from "@sentry/browser";
import helper from "../../../utils/helper";

export const hideKeplrModal = (data) => {
    return {
        type: SIGN_IN_KEPLR_MODAL_HIDE,
        data,
    };
};

export const showKeplrModal = (data) => {
    return {
        type: SIGN_IN_KEPLR_MODAL_SHOW,
        data,
    };
};

export const setKeplrInfo = (data) => {
    return {
        type: SET_KEPLR_INFO,
        data,
    };
};

export const fetchKeplrAddress = () => {
    return async (dispatch) => {
        const kepler = KeplerWallet();
        kepler.then(function () {
            const address = localStorage.getItem("keplerAddress");
            dispatch(setKeplrInfo({
                value: address,
                error: {
                    message: '',
                },
            }));
        }).catch(error => {
            Sentry.captureException(error.response
                ? error.response.data.message
                : error.message);
            dispatch(setKeplrInfo({
                value: '',
                error: {
                    message: error.message,
                },
            }));
        });
    };
};


export const keplrLogin = (history) => {
    return async (dispatch, getState) => {
        const address = getState().signInKeplr.keplrInfo.value;
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
        const accountNumber = helper.getAccountNumber(getState().advanced.accountNumber.value);
        const accountIndex = helper.getAccountNumber(getState().advanced.accountIndex.value);
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
        loginInfo.loginMode = config.keplrMode;
        loginInfo.version = config.version;
        loginInfo.accountNumber = accountNumber;
        loginInfo.accountIndex = accountIndex;
        console.log(JSON.stringify(loginInfo), "in keyStoreLogin");

        localStorage.setItem('loginToken', 'loggedIn');
        localStorage.setItem('address', address);
        localStorage.setItem('loginMode', config.keplrMode);
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