import {
    SET_SIGN_IN_ADDRESS,
    SIGN_IN_ADDRESS_MODAL_HIDE,
    SIGN_IN_ADDRESS_MODAL_SHOW
} from "../../../constants/signIn/address";
import helper from "../../../utils/helper";
import config from "../../../config";
import transactions, {GetAccount} from "../../../utils/transactions";
import {setLoginInfo} from "../transactions/common";
import * as Sentry from "@sentry/browser";
import {ACCOUNT, ADDRESS, FEE, LOGIN_INFO, LOGIN_MODE, LOGIN_TOKEN, VERSION} from "../../../constants/localStorage";

export const hideAddressModal = (data) => {
    return {
        type: SIGN_IN_ADDRESS_MODAL_HIDE,
        data,
    };
};

export const showAddressModal = (data) => {
    return {
        type: SIGN_IN_ADDRESS_MODAL_SHOW,
        data,
    };
};

export const setAddress = (data) => {
    return {
        type: SET_SIGN_IN_ADDRESS,
        data,
    };
};
export const addressLogin = (history) => {
    return async (dispatch, getState) => {
        const address = getState().signInAddress.address.value;

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
        if (helper.validateAddress(address) && helper.isBech32Address(address, config.addressPrefix)) {
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
            dispatch(setLoginInfo({
                encryptedSeed: false,
                error: {
                    message: ''
                }
            }));
            localStorage.setItem(LOGIN_INFO, JSON.stringify(loginInfo));
            history.push('/dashboard/wallet');
            window.location.reload();
        } else {
            dispatch(setLoginInfo(
                {
                    encryptedSeed: false,
                    error: {
                        message: 'Enter Valid Address'
                    }
                }));
        }
    };
};