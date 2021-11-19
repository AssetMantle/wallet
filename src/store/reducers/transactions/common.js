import { combineReducers } from 'redux';
import {
    TX_RESULT_MODAL_HIDE,
    TX_RESULT_MODAL_SHOW,
    SET_LOGIN_INFO,
    SET_TX_NAME,
    TX_IN_PROGRESS,
    TX_SUCCESS,
    TX_FAILED, TX_RESPONSE,
} from "../../../constants/common";

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
    value: '',
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
            error:{
                message:''
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
        console.log(action.data, "receive r");
        return {
            ...state,
            value: action.data,
        };
    } else {
        return state;
    }
};


export default combineReducers({
    modal,
    txInfo,
    loginInfo,
    inProgress,
    txResponse
});
