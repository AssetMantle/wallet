import {SET_KEPLR_INFO, SIGN_IN_KEPLR_MODAL_HIDE, SIGN_IN_KEPLR_MODAL_SHOW} from "../../../constants/signIn/keplr";
import KeplerWallet from "../../../utils/kepler";
import transactions, {GetAccount} from "../../../utils/transactions";
import config from "../../../config";
import {setLoginInfo} from "../transactions/common";

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
                value:address,
                error: {
                    message: '',
                },
            }));
        }).catch(err => {
            dispatch(setKeplrInfo({
                value:'',
                error: {
                    message: err.message,
                },
            }));
        });
    };
};


export const keplrLogin = (history) => {
    return async (dispatch, getState) => {
        const address = getState().signInKeplr.keplrInfo.value;
        const loginInfo = {
            fee:'',
            account:'',
            loginToken:'',
            address:'',
            loginMode:'',
            version:'',
            accountNumber:'',
            accountIndex:''
        };
        const accountNumber = getState().advanced.accountNumber.value;
        const accountIndex = getState().advanced.accountIndex.value;
        GetAccount(address)
            .then(async res => {
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
            })
            .catch(error => {
                console.log(error.message);
                loginInfo.fee = config.defaultFee;
                loginInfo.account = "non-vesting";
                localStorage.setItem('fee', config.defaultFee);
                localStorage.setItem('account', 'non-vesting');
            });
        loginInfo.loginToken = "loggedIn";
        loginInfo.address = address;
        loginInfo.loginMode = "keplr";
        loginInfo.version = config.version;
        loginInfo.accountNumber =  accountNumber;
        loginInfo.accountIndex = accountIndex;
        localStorage.setItem('loginToken', 'loggedIn');
        localStorage.setItem('address', address);
        localStorage.setItem('loginMode', 'keplr');
        localStorage.setItem('version', config.version);
        dispatch(setLoginInfo({
            value:loginInfo,
            error:{
                message:''
            }
        }));
        history.push('/dashboard/wallet');
    };
};