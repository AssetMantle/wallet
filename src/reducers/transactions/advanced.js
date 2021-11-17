import { combineReducers } from 'redux';
import {SET_ACCOUNT_INDEX, SET_ACCOUNT_NUMBER, SET_BIP_39_PASSPHRASE} from "../../constants/advanced";

const accountIndex = (state = {
    value: '0',
    error: {
        message: '',
    },
}, {
    type,
    data,
}) => {
    switch (type) {
    case SET_ACCOUNT_INDEX:
        return {
            ...state,
            value: data.value,
            error: {
                ...state.error,
                message: data.error.message,
            },
        };
    default:
        return state;
    }
};

const accountNumber = (state = {
    value: '0',
    error: {
        message: '',
    },
}, {
    type,
    data,
}) => {
    switch (type) {
    case SET_ACCOUNT_NUMBER:
        return {
            ...state,
            value: data.value,
            error: {
                ...state.error,
                message: data.error.message,
            },
        };
    default:
        return state;
    }
};
const bip39PassPhrase = (state = {
    value: '',
    error: {
        message: '',
    },
}, {
    type,
    data,
}) => {
    switch (type) {
    case SET_BIP_39_PASSPHRASE:
        return {
            ...state,
            value: data.value,
            error: {
                ...state.error,
                message: data.error.message,
            },
        };
    default:
        return state;
    }
};
export default combineReducers({
    accountIndex,
    accountNumber,
    bip39PassPhrase
});
