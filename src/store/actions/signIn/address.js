import {
    SET_SIGN_IN_ADDRESS,
    SIGN_IN_ADDRESS_MODAL_HIDE,
    SIGN_IN_ADDRESS_MODAL_SHOW
} from "../../../constants/signIn/address";
import helper, {vestingAccountCheck} from "../../../utils/helper";
import config from "../../../config";
import {getAccount} from "../../../utils/helper";
import {setLoginInfo} from "../transactions/common";
import * as Sentry from "@sentry/browser";
import {LOGIN_INFO} from "../../../constants/localStorage";
import {isBech32Address} from "../../../utils/scripts";
import {validateAddress} from "../../../utils/validations";

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
        if (validateAddress(address) && isBech32Address(address, config.addressPrefix)) {
            const res = getAccount(address).catch(error => {
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
            loginInfo.loginMode = "normal";
            loginInfo.version = config.version;
            loginInfo.accountNumber = accountNumber;
            loginInfo.accountIndex = accountIndex;
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