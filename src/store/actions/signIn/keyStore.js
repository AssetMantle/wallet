// import transactions from "../../utils/transactions";
import {SIGN_IN_KEYSTORE_MODAL_HIDE, SIGN_IN_KEYSTORE_MODAL_SHOW, SIGN_IN_KEYSTORE_RESULT_MODAL_HIDE,SET_KEYSTORE_RESULT, SIGN_IN_KEYSTORE_RESULT_MODAL_SHOW} from "../../../constants/signIn/keyStore";
import transactions, {GetAccount} from "../../../utils/transactions";
import {setLoginInfo} from "../transactions/common";
import helper from "../../../utils/helper";
import wallet from "../../../utils/wallet";
import config from "../../../config";

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

export const  keyStoreSubmit = () => {
    return async (dispatch, getState) => {
        const password = getState().keyStore.password;
        const keyStoreData = getState().keyStore.keyStore;
        console.log(keyStoreData, "keyStoreData");
        const fileReader = new FileReader();
        let mnemonic ="";
        fileReader.readAsText(keyStoreData.value, "UTF-8");
        fileReader.onload = async event => {
            localStorage.setItem('encryptedMnemonic', event.target.result);
            const res = JSON.parse(event.target.result);
            console.log(password, " res keyStoreData");
            const decryptedData = helper.decryptStore(res, password.value);
            console.log(decryptedData, " decryptedData res keyStoreData");
            if (decryptedData.error != null) {
                dispatch(setKeyStoreResult(
                    {
                        value:"",
                        error: {
                            message: decryptedData.error,
                        },
                    }));
                console.log(decryptedData.error, "responseData");
            } else {
                mnemonic = helper.mnemonicTrim(decryptedData.mnemonic);
                const accountNumber = getState().advanced.accountNumber.value;
                const accountIndex = getState().advanced.accountIndex.value;
                const bip39PassPhrase = getState().advanced.bip39PassPhrase.value;

                const walletPath = transactions.makeHdPath(accountNumber, accountIndex);
                const responseData = await wallet.createWallet(mnemonic, walletPath, bip39PassPhrase);
                console.log(responseData, "responseData");
                dispatch(hideKeyStoreModal());
                dispatch(showKeyStoreResultModal());
                dispatch(setKeyStoreResult(
                    {
                        value:responseData,
                        error: {
                            message: "",
                        }
                    }));
            }
        };





        // let response = transactions.getTransactionResponse(loginAddress, formData, fee, gas, mnemonic,txName, accountNumber, accountIndex, bip39PassPhrase);
        // console.log(response, "txn response");
        // response.then(result => {
        //     if (result.code !== undefined) {
        //         dispatch(txSendSuccess());
        //         dispatch(txSendResponse(result));
        //         dispatch(showTxResultModal());
        //         console.log(result, "result");
        //         // helper.accountChangeCheck(result.rawLog);
        //     }else {
        //         console.log(result, "final result");
        //     }
        // }).catch(err => {
        //     dispatch(txSendFailed(err.message));
        //     // helper.accountChangeCheck(err.message);
        // });
    };
};


export const keyStoreLogin = (history) => {
    return async (dispatch, getState) => {
        const address = getState().signInKeyStore.response.value.address;
        const accountNumber = getState().advanced.accountNumber.value;
        const accountIndex = getState().advanced.accountIndex.value;
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
        console.log("in keyStoreLogin");
        const account = await GetAccount(address).catch(error => {
            console.log(error.message);
            loginInfo.fee = config.defaultFee;
            loginInfo.account = "non-vesting";
            localStorage.setItem('fee', config.defaultFee);
            localStorage.setItem('account', 'non-vesting');
        });
        const accountType = await transactions.VestingAccountCheck(account.typeUrl);
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

        loginInfo.loginToken = "loggedIn";
        loginInfo.address = address;
        loginInfo.loginMode = "normal";
        loginInfo.version = config.version;
        loginInfo.accountNumber = accountNumber;
        loginInfo.accountIndex = accountIndex;
        localStorage.setItem('loginToken', 'loggedIn');
        localStorage.setItem('address', address);
        localStorage.setItem('loginMode', 'normal');
        localStorage.setItem('version', config.version);
        localStorage.setItem('loginInfo', JSON.stringify(loginInfo));
        dispatch(setLoginInfo({
            encryptedSeed:true,
            error:{
                message:''
            }}));
        history.push('/dashboard/wallet');
    };
};