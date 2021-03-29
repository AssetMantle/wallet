import { combineReducers } from 'redux';
import {
    TRANSACTIONS_FETCH_ERROR,
    TRANSACTIONS_FETCH_SUCCESS,
    TRANSACTIONS_IN_PROGRESS,
    PAGE_NUMBER_FETCH_SUCCESS
} from "../constants/transactions";

const inProgress = (state = false, action) => {
    switch (action.type) {
        case TRANSACTIONS_IN_PROGRESS:
            return true;
        case TRANSACTIONS_FETCH_SUCCESS:
        case TRANSACTIONS_FETCH_ERROR:
            return false;
        default:
            return state;
    }
};

const list = (state = [], action) => {
    if (action.type === TRANSACTIONS_FETCH_SUCCESS) {
        return action.list;
    }
    return state;
};

const _ = (state = [], action) => {
    if (action.type === TRANSACTIONS_FETCH_SUCCESS) {
        return action.list;
    } else {
        return state;
    }
};

const pageNumber = (state = 1, action) => {
    if (action.type === PAGE_NUMBER_FETCH_SUCCESS) {
        return [action.number, action.totalPages];
    }
    return state;
};

export default combineReducers({
    list,
    _,
    inProgress,
    pageNumber,
});