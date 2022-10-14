import {
    SIGN_IN_COSMOSTATION_MODAL_HIDE,
    SIGN_IN_COSMOSTATION_MODAL_SHOW,
    SET_COSMOSTATION_INFO
} from "../../../constants/signIn/cosmostation";
import { getAccount } from "../../../utils/helper";
import { setLoginInfo } from "../transactions/common";
import * as Sentry from "@sentry/browser";
import helper, { vestingAccountCheck } from "../../../utils/helper";
import {
    COSMOSTATION_ADDRESS,
    LOGIN_INFO,
} from "../../../constants/localStorage";
import { FeeInfo } from "../../../config";
import packageJson from "../../../../package.json";
import CosmostationWallet from "../../../utils/cosmostation";

export const hideCosmostationModal = (data) => {
    return {
        type: SIGN_IN_COSMOSTATION_MODAL_HIDE,
        data,
    };
};

export const showCosmostationModal = (data) => {
    return {
        type: SIGN_IN_COSMOSTATION_MODAL_SHOW,
        data,
    };
};

export const setCosmostationInfo = (data) => {
    return {
        type: SET_COSMOSTATION_INFO,
        data,
    };
};

export const fetchCosmostationAddress = () => {
    return async (dispatch) => {
        const cosmostation = CosmostationWallet();
        cosmostation.then(function () {
            const address = localStorage.getItem(COSMOSTATION_ADDRESS);
            dispatch(setCosmostationInfo({
                value: address,
                error: {
                    message: '',
                },
            }));
        }).catch(error => {
            Sentry.captureException(error.response
                ? error.response.data.message
                : error.message);
            dispatch(setCosmostationInfo({
                value: '',
                error: {
                    message: error.message,
                },
            }));
        });
    };
};


export const cosmostationLogin = (history) => {
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
        const res = await getAccount(address).catch(error => {
            Sentry.captureException(error.response
                ? error.response.data.message
                : error.message);
            console.log(error.message);
            loginInfo.fee = FeeInfo.defaultFee;
            loginInfo.account = "non-vesting";
        });
        const accountType = await vestingAccountCheck(res && res.typeUrl);
        if (accountType) {
            loginInfo.fee = FeeInfo.vestingAccountFee;
            loginInfo.account = "vesting";
        } else {
            loginInfo.fee = FeeInfo.defaultFee;
            loginInfo.account = "non-vesting";
        }
        loginInfo.loginToken = "loggedIn";
        loginInfo.address = address;
        loginInfo.loginMode = 'keplr';
        loginInfo.version = packageJson.version;
        loginInfo.accountNumber = accountNumber;
        loginInfo.accountIndex = accountIndex;
        localStorage.setItem(LOGIN_INFO, JSON.stringify(loginInfo));
        dispatch(setLoginInfo({
            encryptedSeed: false,
            error: {
                message: ''
            }
        }));
        history.push(`/dashboard/${loginInfo.loginMode}`);
        window.location.reload();
    };
};