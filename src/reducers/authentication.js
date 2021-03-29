import { combineReducers } from 'redux';
import {
    LOGIN_SUCCESS
} from "../constants/authentication";

const loginMode = (state = "", action) => {
    if (action.type === LOGIN_SUCCESS) {
        return action.mode;
    }
    return state;
};

const _ = (state = "", action) => {
    if (action.type === LOGIN_SUCCESS) {
        return action.mode;
    }
    return state;
};


export default combineReducers({
    loginMode,
    _,
});