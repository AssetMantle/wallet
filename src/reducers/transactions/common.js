import { combineReducers } from 'redux';
import {TX_RESULT_MODAL_HIDE, TX_RESULT_MODAL_SHOW, SET_LOGIN_INFO, SET_TX_NAME} from "../../constants/common";
import {TX_SEND_SUCCESS} from "../../constants/send";

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
    case TX_SEND_SUCCESS:
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
}, {
    type,
    data,
}) => {
    switch (type) {
    case SET_LOGIN_INFO:
        return {
            ...state,
            value: data.value,
        };
    case TX_SEND_SUCCESS:
    case TX_RESULT_MODAL_HIDE:
        return {
            ...state,
            value: '',
        };
    default:
        return state;
    }
};

export default combineReducers({
    modal,
    txInfo,
    loginInfo
});
