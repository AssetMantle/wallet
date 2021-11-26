import { combineReducers } from 'redux';
import {
    TX_RESULT_MODAL_HIDE,
    TX_RESULT_MODAL_SHOW,
    SET_LOGIN_INFO,
    SET_TX_NAME,
    TX_IN_PROGRESS,
    TX_SUCCESS,
    TX_FAILED, TX_RESPONSE,
    TX_MEMO_SET,
} from "../../../constants/common";
import {KEYSTORE_MODAL_HIDE} from "../../../constants/keyStore";

const modal = (state = false, {
    type,
}) => {
    switch (type) {
    case TX_RESULT_MODAL_SHOW:
        return true;
    case TX_RESULT_MODAL_HIDE:
        return false;
    default:
        return state;
    }
};

const txInfo = (state = {
    value: {
        name:'',
        data:''
    },
}, {
    type,
    data,
}) => {
    switch (type) {
    case SET_TX_NAME:
        return {
            ...state,
            value: data.value,
        };
    case TX_SUCCESS:
    case KEYSTORE_MODAL_HIDE:
    case TX_RESULT_MODAL_HIDE:
        return {
            ...state,
            value: {
                name:'',
                data:''
            },
        };
    default:
        return state;
    }
};

const loginInfo = (state = {
    encryptedSeed: false,
    error:{
        message:''
    },
}, {
    type,
    data,
}) => {
    switch (type) {
    case SET_LOGIN_INFO:
        return {
            ...state,
            encryptedSeed: data.encryptedSeed,
            error: {
                ...state.error,
                message: data.error.message,
            },
        };
    default:
        return state;
    }
};

const inProgress = (state = false, {
    type,
}) => {
    switch (type) {
    case TX_IN_PROGRESS:
        return true;
    case TX_FAILED:
    case TX_SUCCESS:
        return false;
    default:
        return state;
    }
};

const txResponse = (state = {}, action) => {
    if (action.type === TX_RESPONSE) {
        return {
            ...state,
            value: action.data,
        };
    } else {
        return state;
    }
};

const memo = (state = {
    value: '',
    error: {
        message: '',
    },
}, {
    type,
    data,
}) => {
    switch (type) {
    case TX_MEMO_SET:
        return {
            ...state,
            value: data.value,
            error: {
                ...state.error,
                message: data.error.message,
            },
        };
    case TX_SUCCESS:
    case TX_RESULT_MODAL_HIDE:
        return {
            ...state,
            value: '',
            error: {
                ...state.error,
                message: '',
            },
        };
    default:
        return state;
    }
};


const error = (state = {
    error: {
        message: '',
    },
}, {
    type,
    data,
}) => {
    switch (type) {
    case TX_FAILED:
        return {
            ...state,
            error: {
                ...state.error,
                message: data,
            },
        };
    case TX_RESULT_MODAL_HIDE:
    case KEYSTORE_MODAL_HIDE:
        return {
            ...state,
            error: {
                ...state.error,
                message: '',
            },
        };
    default:
        return state;
    }
};



export default combineReducers({
    modal,
    txInfo,
    loginInfo,
    inProgress,
    memo,
    txResponse,
    error
});
