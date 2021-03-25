import { combineReducers } from 'redux';
import {
    TRANSACTIONS_FETCH_ERROR,
    TRANSACTIONS_FETCH_SUCCESS
} from "../constants/transactions";

const list = (state = [], action) => {
    if (action.type === TRANSACTIONS_FETCH_SUCCESS) {
        return action.list;
    }
    return state;
};

const _ = (state = 0, action) => {
    if (action.type === TRANSACTIONS_FETCH_SUCCESS) {
        return action.list;
    } else {
        return state;
    }
};


export default combineReducers({
    list,
    _,
});