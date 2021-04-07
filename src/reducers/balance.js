import {combineReducers} from 'redux';
import {
    BALANCE_FETCH_SUCCESS,
    BALANCE_FETCH_ERROR,
    BALANCE_FETCH_IN_PROGRESS
} from "../constants/balance"


const inProgress = (state = false, action) => {
    switch (action.type) {
        case BALANCE_FETCH_IN_PROGRESS:
            return true;
        case BALANCE_FETCH_SUCCESS:
        case BALANCE_FETCH_ERROR:
            return false;
        default:
            return state;
    }
};

const amount = (state = 0, action) => {
    if (action.type === BALANCE_FETCH_SUCCESS) {
        return (action.data);
    }
    return state;
};

const _ = (state = 0, action) => {
    if (action.type === BALANCE_FETCH_ERROR) {
        return (action.data * 1);
    } else {
        return state;
    }
};


export default combineReducers({
    amount,
    _,
});