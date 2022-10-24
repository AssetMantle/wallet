import * as Sentry from "@sentry/browser";
import packageJson from "../../../../package.json";
import {
    COSMOSTATION_ADDRESS,
    LOGIN_INFO
} from "../../../constants/localStorage";
import {
    SET_COSMOSTATION_INFO, SIGN_IN_COSMOSTATION_MODAL_HIDE,
    SIGN_IN_COSMOSTATION_MODAL_SHOW
} from "../../../constants/signIn/cosmostation";
import CosmostationWallet from "../../../utils/cosmostation";
import { setLoginInfo } from "../transactions/common";
import helper from "../../../utils/helper";


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
                    message: error.message?.replace(".", "") + (error.code === -32600 ? ", make sure you have a cosmostation wallet" : ""),
                },
            }));
        });
    };
};


export const cosmostationLogin = (history) => {
    return async (dispatch, getState) => {
        const address = getState().signInCosmostation.cosmostationInfo.value;
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
        loginInfo.loginToken = "loggedIn";
        loginInfo.address = address;
        loginInfo.loginMode = 'cosmostation';
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